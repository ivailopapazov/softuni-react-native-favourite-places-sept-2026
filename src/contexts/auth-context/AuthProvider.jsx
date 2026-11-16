import { useState } from "react";
import { Alert } from "react-native";

import { authApi } from "../../api";
import AuthContext from "./AuthContext";

export default function AuthProvider({
    children,
}) {
    const [auth, setAuth] = useState(null);

    const register = async (email, password, fullName) => {
        console.log("Registering with email:", email);
        try {
            const result = await authApi.register(email, password, fullName);
            
            console.log("Registration successful:", result);
            
            setAuth(result);
        } catch (error) {
            console.error("Registration failed:", error);
            Alert.alert("Registration failed:", error);
        }
    };

    const login = async (email, password) => {
        try {
            const result = await authApi.login(email, password);
            console.log("Login successful:", result);
            setAuth(result);
        } catch (error) {
            console.error("Login failed:", error);
            Alert.alert("Login failed:", error);
        }
    };

    const value = {
        auth,
        register,
        login,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
