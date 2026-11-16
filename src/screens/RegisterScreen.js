import { StyleSheet, Text, Pressable } from 'react-native';

import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

export default function RegisterScreen({ navigation }) {
    return (
        <AuthLayout
            title="Create account"
            subtitle="Start saving the places you love"
            footer={
                <Text style={styles.footerText}>
                    Already have an account? 
                    <Pressable onPress={() => navigation.goBack()}>
                        <Text style={styles.footerLink}>Log In</Text>
                    </Pressable>
                </Text>
            }
        >
            <FormInput
                label="Full name"
                icon="👤"
                placeholder="Alex Traveler"
                autoCapitalize="words"
                autoComplete="name"
            />
            <FormInput
                label="Email"
                icon="✉️"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
            />
            <FormInput
                label="Password"
                icon="🔒"
                placeholder="At least 6 characters"
                secureTextEntry
                autoComplete="new-password"
            />
            <FormInput
                label="Confirm password"
                icon="🔒"
                placeholder="Repeat your password"
                secureTextEntry
                autoComplete="new-password"
            />

            <PrimaryButton title="Create Account" />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    footerLink: {
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
