import React, { useEffect } from "react";
import { useAuthStore } from "../features/auth/store/useAuthStore.js";

export const AuthProvider = ({ children }) => {
    // Check session on mount
    useEffect(() => {
        useAuthStore.getState().checkAuth();
    }, []);

    return <>{children}</>;
};

export const useAuth = () => {
    const store = useAuthStore();
    
    return {
        user: store.user,
        loading: store.loading,
        login: store.login,
        register: store.register,
        logout: store.logout,
        forgotPassword: store.forgotPassword,
        resetPassword: async (token, password) => {
            return await store.resetPassword(password, token);
        }
    };
};
