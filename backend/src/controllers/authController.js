import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Helper to sign JWT and send cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "TodoX_SuperSecret_JWT_Key_2026_Change_Me",
        { expiresIn: process.env.JWT_LIFETIME || "7d" }
    );

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };

    res.status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validation
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required.",
                field: "username"
            });
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
                field: "email"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required.",
                field: "password"
            });
        }

        // 2. Check if user already exists
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered.",
                field: "email"
            });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken.",
                field: "username"
            });
        }

        // 3. Create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
        });

        // 4. Send token
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Registration failed. Please try again.",
        });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be username or email

        // 1. Validation
        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: "Username or email is required.",
                field: "identifier"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required.",
                field: "password"
            });
        }

        // 2. Find user (search email or username)
        const user = await User.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials.",
                field: "identifier"
            });
        }

        // 3. Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials.",
                field: "password"
            });
        }

        // 4. Send token
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Authentication error. Please try again.",
        });
    }
};

// @desc    Logout User / Clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Successfully logged out.",
    });
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter your registered email address.",
                field: "email"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address.",
                field: "email"
            });
        }

        // 1. Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // 2. Hash and save to database
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire time (15 mins)
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // 3. Mock Email / Print in development console
        console.log("\n=================== PASSWORD RESET SYSTEM ===================");
        console.log(`Email Requested: ${email}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log(`Reset API Link: /api/auth/reset-password/${resetToken}`);
        console.log("=============================================================\n");

        res.status(200).json({
            success: true,
            message: "Password reset instructions generated.",
            token: resetToken, // Returned in JSON response for sandbox testing convenience
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to process request. Please try again later.",
        });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.resettoken;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid password of at least 6 characters.",
                field: "password"
            });
        }

        // 1. Hash resettoken to compare with database
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // 2. Find user with valid token and expiry not passed
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid, broken, or expired reset token.",
                field: "token"
            });
        }

        // 3. Set new password, clear reset fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // 4. Login immediately after password reset
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to reset password. Please try again.",
        });
    }
};
