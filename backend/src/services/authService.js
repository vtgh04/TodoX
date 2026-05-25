import authRepository from "../repositories/authRepository.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

class AuthService {
    // Helper to generate JWT Token
    generateToken(user) {
        return jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "TodoX_SuperSecret_JWT_Key_2026_Change_Me",
            { expiresIn: process.env.JWT_LIFETIME || "7d" }
        );
    }

    async register(username, email, password) {
        const emailExists = await authRepository.findUserByEmail(email.toLowerCase());
        if (emailExists) {
            const error = new Error("Email is already registered.");
            error.field = "email";
            error.statusCode = 400;
            throw error;
        }

        const usernameExists = await authRepository.findUserByUsername(username);
        if (usernameExists) {
            const error = new Error("Username is already taken.");
            error.field = "username";
            error.statusCode = 400;
            throw error;
        }

        const user = await authRepository.createUser({
            username,
            email: email.toLowerCase(),
            password,
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    async login(identifier, password) {
        const user = await authRepository.findUserByIdentifier(identifier);
        if (!user) {
            const error = new Error("Invalid login credentials.");
            error.field = "identifier";
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            const error = new Error("Invalid login credentials.");
            error.field = "password";
            error.statusCode = 401;
            throw error;
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    async processForgotPassword(email) {
        const user = await authRepository.findUserByEmail(email.toLowerCase());
        if (!user) {
            const error = new Error("No account found with this email address.");
            error.field = "email";
            error.statusCode = 404;
            throw error;
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await authRepository.saveUser(user);

        return resetToken;
    }

    async processResetPassword(resetToken, password) {
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user = await authRepository.findUserByResetToken(hashedToken);

        if (!user) {
            const error = new Error("Invalid, broken, or expired reset token.");
            error.field = "token";
            error.statusCode = 400;
            throw error;
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await authRepository.saveUser(user);

        const token = this.generateToken(user);
        return { user, token };
    }
}

export default new AuthService();
