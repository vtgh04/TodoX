import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0f12] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                <p className="text-sm font-semibold tracking-wide text-gray-400">
                    Checking authorization session...
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0f12] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                <p className="text-sm font-semibold tracking-wide text-gray-400">
                    Verifying session...
                </p>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};
