import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/colors';

export default function LoginScreen() {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Log in to see your favourite places"
            footer={
                <Text style={styles.footerText}>
                    Don't have an account? <Text style={styles.footerLink}>Register</Text>
                </Text>
            }
        >
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
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
            />

            <TouchableOpacity style={styles.forgotWrapper} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryButton title="Log In" />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    forgotWrapper: {
        alignSelf: 'flex-end',
        marginTop: -4,
        marginBottom: 16,
    },
    forgotText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
    },
    footerLink: {
        fontWeight: '700',
        color: colors.white,
    },
});
