import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import ScreenHeader from '../components/ScreenHeader';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import Chip from '../components/Chip';
import { colors } from '../constants/colors';
import { categories } from '../data/places';

export default function AddPlaceScreen() {
    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScreenHeader title="Add New Place" />

            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Photo picker placeholder */}
                <TouchableOpacity style={styles.photoPicker} activeOpacity={0.8}>
                    <Text style={styles.photoIcon}>📷</Text>
                    <Text style={styles.photoTitle}>Add a photo</Text>
                    <Text style={styles.photoHint}>Take a picture or choose from gallery</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <FormInput label="Title" icon="🏷️" placeholder="e.g. Seven Rila Lakes" />

                    <FormInput label="Location" icon="📍" placeholder="City, Country" />
                    <TouchableOpacity style={styles.locationButton} activeOpacity={0.7}>
                        <Text style={styles.locationButtonText}>🧭  Use my current location</Text>
                    </TouchableOpacity>

                    <FormInput label="Date of visit" icon="📅" placeholder="DD.MM.YYYY" />

                    <FormInput
                        label="Description"
                        icon="📝"
                        placeholder="What made this place special?"
                        multiline
                        numberOfLines={4}
                    />

                    {/* Category */}
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.chips}>
                        {categories
                            .filter((category) => category !== 'All')
                            .map((category, index) => (
                                <View key={category} style={styles.chipWrapper}>
                                    <Chip label={category} active={index === 0} />
                                </View>
                            ))}
                    </View>

                    {/* Rating */}
                    <Text style={styles.label}>Your rating</Text>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} activeOpacity={0.7}>
                                <Text style={[styles.star, star > 4 && styles.starEmpty]}>★</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <PrimaryButton title="Save Place" />

                    <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    photoPicker: {
        height: 170,
        borderRadius: 18,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.primary,
        backgroundColor: colors.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    photoIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    photoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    photoHint: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 4,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    locationButton: {
        alignSelf: 'flex-start',
        marginTop: -8,
        marginBottom: 16,
    },
    locationButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    chipWrapper: {
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    star: {
        fontSize: 34,
        color: '#F5A524',
        marginRight: 6,
    },
    starEmpty: {
        color: '#D9DEE7',
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 4,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textMuted,
    },
});
