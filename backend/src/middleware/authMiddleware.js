import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
    let token;

    // 1. Get token from cookies or authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this resource. Please log in.",
        });
    }

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "TodoX_SuperSecret_JWT_Key_2026_Change_Me");

        // 4. Get user from token decoded payload
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found or deleted.",
            });
        }

        next();
    } catch (error) {
        console.error("JWT Verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session token. Please log in again.",
        });
    }
};
