import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import {
    GestureDetector,
    usePanGesture,
    useTapGesture,
    useCompetingGestures,
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useEffect, useRef } from 'react';

import PlaceCard from './PlaceCard';
import { colors } from '../constants/colors';

// Width of the revealed action button when the card snaps open.
const ACTION_WIDTH = 96;
const SPRING = { damping: 18, stiffness: 180 };

/**
 * PlaceCard with gestures:
 *  - swipe left  -> reveals "Delete" (full swipe deletes immediately)
 *  - swipe right -> reveals "Edit"   (full swipe opens edit immediately)
 *  - double tap  -> toggles favourite (heart burst animation)
 *  - tap on the heart badge -> toggles favourite
 */
export default function SwipeablePlaceCard({ place, onEdit, onDelete, onToggleFavourite }) {
    const { width } = useWindowDimensions();
    const fullSwipe = width * 0.5;

    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const pressScale = useSharedValue(1);
    const burstScale = useSharedValue(0);
    const burstOpacity = useSharedValue(0);
    const heartScale = useSharedValue(1);

    const isFavourite = !!place.is_favourite;

    // Small "pop" of the badge every time the favourite state changes (not on mount).
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        heartScale.value = withSequence(
            withTiming(1.4, { duration: 120 }),
            withSpring(1, { damping: 6, stiffness: 200 }),
        );
    }, [isFavourite, heartScale]);

    const close = () => {
        translateX.value = withSpring(0, SPRING);
    };

    const handleEdit = () => {
        close();
        onEdit(place);
    };

    // Delete is confirmed by the parent; if cancelled the card springs back.
    const handleDelete = () => {
        onDelete(place, close);
    };

    const handleToggleFavourite = () => {
        onToggleFavourite(place);
    };

    const pan = usePanGesture({
        // Activate only on clear horizontal movement so FlatList can still scroll vertically.
        activeOffsetX: [-15, 15],
        failOffsetY: [-10, 10],
        onBegin: () => {
            pressScale.value = withTiming(0.98, { duration: 120 });
        },
        onActivate: () => {
            startX.value = translateX.value;
        },
        onUpdate: (event) => {
            translateX.value = startX.value + event.translationX;
        },
        onDeactivate: (event) => {
            const x = translateX.value;
            const projected = x + event.velocityX * 0.15;

            if (projected < -fullSwipe) {
                // Full swipe left -> slide out and ask to delete.
                translateX.value = withTiming(-width, { duration: 200 }, () => {
                    scheduleOnRN(handleDelete);
                });
            } else if (projected > fullSwipe) {
                // Full swipe right -> edit.
                translateX.value = withSpring(0, SPRING);
                scheduleOnRN(onEdit, place);
            } else if (projected < -ACTION_WIDTH / 2) {
                translateX.value = withSpring(-ACTION_WIDTH, SPRING);
            } else if (projected > ACTION_WIDTH / 2) {
                translateX.value = withSpring(ACTION_WIDTH, SPRING);
            } else {
                translateX.value = withSpring(0, SPRING);
            }
        },
        onFinalize: () => {
            pressScale.value = withSpring(1, SPRING);
        },
    });

    const doubleTap = useTapGesture({
        numberOfTaps: 2,
        maxDistance: 10,
        onActivate: () => {
            burstScale.value = 0;
            burstOpacity.value = 1;
            burstScale.value = withSpring(1, { damping: 8, stiffness: 180 });
            burstOpacity.value = withDelay(400, withTiming(0, { duration: 250 }));
            scheduleOnRN(handleToggleFavourite);
        },
    });

    // A single tap while the card is open just closes it.
    const singleTap = useTapGesture({
        maxDistance: 10,
        requireToFail: doubleTap,
        onActivate: () => {
            if (translateX.value !== 0) {
                translateX.value = withSpring(0, SPRING);
            }
        },
    });

    const heartTap = useTapGesture({
        onActivate: () => {
            scheduleOnRN(handleToggleFavourite);
        },
    });

    const editTap = useTapGesture({
        onActivate: () => {
            scheduleOnRN(handleEdit);
        },
    });

    const deleteTap = useTapGesture({
        onActivate: () => {
            scheduleOnRN(handleDelete);
        },
    });

    const cardGesture = useCompetingGestures(pan, doubleTap, singleTap);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: pressScale.value },
        ],
    }));

    const editActionStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [0, ACTION_WIDTH], [0, 1], Extrapolation.CLAMP),
        transform: [
            { scale: interpolate(translateX.value, [0, ACTION_WIDTH], [0.6, 1], Extrapolation.CLAMP) },
        ],
    }));

    const deleteActionStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-ACTION_WIDTH, 0], [1, 0], Extrapolation.CLAMP),
        transform: [
            { scale: interpolate(translateX.value, [-ACTION_WIDTH, 0], [1, 0.6], Extrapolation.CLAMP) },
        ],
    }));

    const burstStyle = useAnimatedStyle(() => ({
        opacity: burstOpacity.value,
        transform: [{ scale: burstScale.value }],
    }));

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Actions revealed behind the card */}
            <View style={styles.actions}>
                <GestureDetector gesture={editTap}>
                    <Animated.View style={[styles.action, styles.editAction, editActionStyle]}>
                        <Text style={styles.actionIcon}>✏️</Text>
                        <Text style={styles.actionText}>Edit</Text>
                    </Animated.View>
                </GestureDetector>

                <GestureDetector gesture={deleteTap}>
                    <Animated.View style={[styles.action, styles.deleteAction, deleteActionStyle]}>
                        <Text style={styles.actionIcon}>🗑️</Text>
                        <Text style={styles.actionText}>Delete</Text>
                    </Animated.View>
                </GestureDetector>
            </View>

            <GestureDetector gesture={cardGesture}>
                <Animated.View style={cardStyle}>
                    <PlaceCard place={place} style={styles.card} />

                    {/* Big heart shown on double tap */}
                    <View style={styles.burstWrapper} pointerEvents="none">
                        <Animated.Text style={[styles.burst, burstStyle]}>
                            {isFavourite ? '❤️' : '🤍'}
                        </Animated.Text>
                    </View>

                    {/* Favourite badge */}
                    <GestureDetector gesture={heartTap}>
                        <Animated.View style={[styles.heartBadge, heartStyle]}>
                            <Text style={styles.heartIcon}>{isFavourite ? '❤️' : '🤍'}</Text>
                        </Animated.View>
                    </GestureDetector>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    card: {
        marginBottom: 0,
    },
    actions: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    action: {
        width: ACTION_WIDTH - 12,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editAction: {
        backgroundColor: colors.primary,
    },
    deleteAction: {
        backgroundColor: colors.danger,
    },
    actionIcon: {
        fontSize: 22,
    },
    actionText: {
        marginTop: 6,
        fontSize: 13,
        fontWeight: '700',
        color: colors.white,
    },
    burstWrapper: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    burst: {
        fontSize: 96,
    },
    heartBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    heartIcon: {
        fontSize: 18,
    },
});
