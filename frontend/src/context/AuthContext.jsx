import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../lib/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on refresh/mount
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await api.get("/auth/me");
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    // Login Action
    const login = async (identifier, password) => {
        try {
            const response = await api.post("/auth/login", { identifier, password });
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Invalid credentials. Please try again.",
                field: error.response?.data?.field,
            };
        }
    };

    // Register Action
    const register = async (username, email, password) => {
        try {
            const response = await api.post("/auth/register", { username, email, password });
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed. Try a different username/email.",
                field: error.response?.data?.field,
            };
        }
    };

    // Logout Action
    const logout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            return { success: true };
        } catch (error) {
            setUser(null); // Force clear on failure
            return { success: true };
        }
    };

    // Forgot Password Link request
    const forgotPassword = async (email) => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return {
                success: true,
                message: response.data.message,
                token: response.data.token, // returned for dev ease
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong. Verify your email.",
                field: error.response?.data?.field,
            };
        }
    };

    // Reset password using token
    const resetPassword = async (token, password) => {
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Reset link invalid or expired.",
                field: error.response?.data?.field,
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
};
