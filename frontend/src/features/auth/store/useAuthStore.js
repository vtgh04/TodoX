import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true, // initial state is loading until me check
    error: null,

    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            const userData = await authService.getMe();
            set({ user: userData, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    login: async (identifier, password) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.login(identifier, password);
            set({ user: data.user, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Login failed" });
            return { success: false, ...error.response?.data };
        }
    },

    register: async (username, email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.register(username, email, password);
            set({ user: data.user, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Registration failed" });
            return { success: false, ...error.response?.data };
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await authService.logout();
            set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            set({ loading: false, error: "Logout failed" });
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error) {
            return { success: false, ...error.response?.data };
        }
    },

    resetPassword: async (password, token) => {
        try {
            const response = await authService.resetPassword(password, token);
            set({ user: response.user, isAuthenticated: true });
            return { success: true, ...response };
        } catch (error) {
            return { success: false, ...error.response?.data };
        }
    }
}));
