import api from "../../../lib/axios";

export const authService = {
    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data.user;
    },
    login: async (identifier, password) => {
        const response = await api.post("/auth/login", { identifier, password });
        return response.data;
    },
    register: async (username, email, password) => {
        const response = await api.post("/auth/register", { username, email, password });
        return response.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
    forgotPassword: async (email) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },
    resetPassword: async (password, token) => {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    }
};
