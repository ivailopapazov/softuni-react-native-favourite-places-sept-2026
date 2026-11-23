import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import ScreenHeader from '../components/ScreenHeader';
import SwipeablePlaceCard from '../components/SwipeablePlaceCard';
import Chip from '../components/Chip';
import { colors } from '../constants/colors';
import { categories, places } from '../data/places';
import { placeApi } from '../api';
import { getErrorMessage } from '../utils/error.utils';

export default function MyPlacesScreen({
    navigation,
}) {
    const [myPlaces, setMyPlaces] = useState(places);

    const fetchPlaces = useCallback(async () => {
        try {
            const data = await placeApi.getAll();
            setMyPlaces(data);
        } catch (error) {
            console.error('Failed to fetch places:', error);
        }
    }, []);

    // Refetch every time the screen gets focus (e.g. after coming back from Edit).
    useEffect(() => {
        return navigation.addListener('focus', fetchPlaces);
    }, [navigation, fetchPlaces]);

    const editHandler = (place) => {
        navigation.navigate('AddPlace', { place });
    };

    const deleteHandler = (place, cancel) => {
        Alert.alert('Delete place', `Are you sure you want to delete "${place.title}"?`, [
            { text: 'Cancel', style: 'cancel', onPress: cancel },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    // Optimistic update - the card animates out right away.
                    const previous = myPlaces;
                    setMyPlaces((current) => current.filter((p) => p.id !== place.id));

                    try {
                        await placeApi.remove(place.id);
                    } catch (error) {
                        setMyPlaces(previous);
                        cancel();
                        Alert.alert('Failed to delete place', getErrorMessage(error));
                    }
                },
            },
        ], { cancelable: true, onDismiss: cancel });
    };

    const toggleFavouriteHandler = async (place) => {
        const isFavourite = !place.is_favourite;
        const setFavourite = (value) => setMyPlaces((current) =>
            current.map((p) => (p.id === place.id ? { ...p, is_favourite: value } : p))
        );

        setFavourite(isFavourite);

        try {
            await placeApi.toggleFavourite(place.id, isFavourite);
        } catch (error) {
            setFavourite(!isFavourite);
            Alert.alert('Failed to update favourites', getErrorMessage(error));
        }
    };

    return (
        <View style={styles.screen}>
            <ScreenHeader title="My Places" subtitle={`${myPlaces.length} saved places`} rightIcon="⇅" />

            <Animated.FlatList
                data={myPlaces}
                keyExtractor={(item) => String(item.id)}
                itemLayoutAnimation={LinearTransition.springify().damping(18)}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(Math.min(index, 6) * 60).springify().damping(18)}
                        exiting={FadeOutLeft.duration(250)}
                    >
                        <SwipeablePlaceCard
                            place={item}
                            onEdit={editHandler}
                            onDelete={deleteHandler}
                            onToggleFavourite={toggleFavouriteHandler}
                        />
                    </Animated.View>
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* Search */}
                        <View style={styles.searchBar}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search places..."
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        {/* Category filters */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.chips}
                        >
                            {categories.map((category, index) => (
                                <Chip key={category} label={category} active={index === 0} />
                            ))}
                        </ScrollView>
                        <Text style={styles.hint}>Swipe → edit · Swipe ← delete · Double tap ❤️</Text>
                    </>
                }
            />

            {/* Floating "Add" button */}
            <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => navigation.navigate('AddPlace')}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 13,
        fontSize: 15,
        color: colors.text,
    },
    chips: {
        marginTop: 14,
        marginBottom: 12,
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    hint: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: 12,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    fabIcon: {
        fontSize: 32,
        lineHeight: 34,
        color: colors.white,
        fontWeight: '300',
    },
});
