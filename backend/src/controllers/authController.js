import authService from "../services/authService.js";

// Helper to send token response
const sendTokenResponse = (user, token, statusCode, res) => {
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

        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required.", field: "username" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required.", field: "email" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required.", field: "password" });
        }

        const { user, token } = await authService.register(username, email, password);
        sendTokenResponse(user, token, 201, res);
    } catch (error) {
        console.error("Register Error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Registration failed. Please try again.",
            field: error.field || undefined
        });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier) {
            return res.status(400).json({ success: false, message: "Username or email is required.", field: "identifier" });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required.", field: "password" });
        }

        const { user, token } = await authService.login(identifier, password);
        sendTokenResponse(user, token, 200, res);
    } catch (error) {
        console.error("Login Error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Authentication error. Please try again.",
            field: error.field || undefined
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
            return res.status(400).json({ success: false, message: "Please enter your registered email address.", field: "email" });
        }

        const resetToken = await authService.processForgotPassword(email);

        console.log("\n=================== PASSWORD RESET SYSTEM ===================");
        console.log(`Email Requested: ${email}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log(`Reset API Link: /api/auth/reset-password/${resetToken}`);
        console.log("=============================================================\n");

        res.status(200).json({
            success: true,
            message: "Password reset instructions generated.",
            token: resetToken, 
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Unable to process request. Please try again later.",
            field: error.field || undefined
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
            return res.status(400).json({ success: false, message: "Please provide a valid password of at least 6 characters.", field: "password" });
        }

        const { user, token } = await authService.processResetPassword(resetToken, password);
        sendTokenResponse(user, token, 200, res);
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : "Unable to reset password. Please try again.",
            field: error.field || undefined
        });
    }
};
