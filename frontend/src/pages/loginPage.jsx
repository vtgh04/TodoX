import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Lock, Mail, User as UserIcon, Loader2, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";

const translations = {
    vi: {
        title: "Chào mừng đến với TodoX",
        subtitle: "Quản lý công việc hàng ngày một cách thông minh và chuyên nghiệp.",
        signInTab: "Đăng Nhập",
        signUpTab: "Đăng Ký",
        usernameLabel: "Tên tài khoản",
        emailLabel: "Email",
        passwordLabel: "Mật khẩu",
        confirmPasswordLabel: "Xác nhận mật khẩu",
        identifierPlaceholder: "Email hoặc tên tài khoản",
        emailPlaceholder: "Nhập email của bạn",
        usernamePlaceholder: "Nhập tên tài khoản",
        passwordPlaceholder: "Nhập mật khẩu (tối thiểu 6 ký tự)",
        confirmPasswordPlaceholder: "Nhập lại mật khẩu",
        loginBtn: "Đăng Nhập",
        registerBtn: "Tạo tài khoản",
        forgotPasswordLink: "Quên mật khẩu?",
        requestResetTitle: "Quên Mật Khẩu",
        requestResetSubtitle: "Nhập email của bạn để nhận mã token khôi phục.",
        resetPasswordBtn: "Gửi mã khôi phục",
        backToLogin: "Quay lại Đăng nhập",
        resetSuccess: "Yêu cầu khôi phục thành công! Hãy xem token ở console của backend.",
        errorMismatch: "Mật khẩu xác nhận không khớp!",
        tokenTitle: "Đặt Lại Mật Khẩu",
        tokenSubtitle: "Nhập mã token từ console backend và đặt mật khẩu mới.",
        tokenLabel: "Mã Token",
        tokenPlaceholder: "Nhập mã token",
        newPasswordLabel: "Mật khẩu mới",
        newPasswordPlaceholder: "Nhập mật khẩu mới",
        resetNewPasswordBtn: "Đặt lại mật khẩu",
    },
    en: {
        title: "Welcome to TodoX",
        subtitle: "Manage your daily tasks intelligently and professionally.",
        signInTab: "Sign In",
        signUpTab: "Sign Up",
        usernameLabel: "Username",
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        identifierPlaceholder: "Email or username",
        emailPlaceholder: "Enter your email",
        usernamePlaceholder: "Enter your username",
        passwordPlaceholder: "Enter password (min 6 chars)",
        confirmPasswordPlaceholder: "Confirm your password",
        loginBtn: "Sign In",
        registerBtn: "Create account",
        forgotPasswordLink: "Forgot password?",
        requestResetTitle: "Forgot Password",
        requestResetSubtitle: "Enter your email to retrieve your reset token.",
        resetPasswordBtn: "Send Reset Token",
        backToLogin: "Back to Login",
        resetSuccess: "Reset request successful! Check backend console for token.",
        errorMismatch: "Passwords do not match!",
        tokenTitle: "Reset Password",
        tokenSubtitle: "Enter token from backend console and set new password.",
        tokenLabel: "Token Code",
        tokenPlaceholder: "Enter token code",
        newPasswordLabel: "New Password",
        newPasswordPlaceholder: "Enter new password",
        resetNewPasswordBtn: "Reset Password",
    },
};

const translateBackendError = (message, lang) => {
    if (!message) return "";
    if (lang !== "vi") return message;

    const msg = message.toLowerCase();
    if (msg.includes("already registered")) {
        return "Email này đã được đăng ký sử dụng.";
    }
    if (msg.includes("already taken")) {
        return "Tên tài khoản này đã có người sử dụng.";
    }
    if (msg.includes("invalid login credentials")) {
        return "Thông tin đăng nhập không chính xác.";
    }
    if (msg.includes("no account found")) {
        return "Không tìm thấy tài khoản nào liên kết với email này.";
    }
    if (msg.includes("at least 6 characters")) {
        return "Vui lòng nhập mật khẩu hợp lệ với tối thiểu 6 ký tự.";
    }
    if (msg.includes("invalid, broken, or expired")) {
        return "Mã token không hợp lệ hoặc đã hết hạn.";
    }
    if (msg.includes("username or email is required") || msg.includes("credentials and password")) {
        return "Vui lòng nhập tên tài khoản hoặc email và mật khẩu.";
    }
    if (msg.includes("username is required")) {
        return "Vui lòng nhập tên tài khoản.";
    }
    if (msg.includes("email is required")) {
        return "Vui lòng nhập email.";
    }
    if (msg.includes("password is required")) {
        return "Vui lòng nhập mật khẩu.";
    }
    if (msg.includes("fill in all registration fields")) {
        return "Vui lòng điền đầy đủ các thông tin đăng ký.";
    }
    if (msg.includes("registered email address")) {
        return "Vui lòng nhập địa chỉ email đã đăng ký.";
    }
    return message;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, register, forgotPassword, resetPassword } = useAuth();
    
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("todo_lang") || "vi";
    });
    
    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("todo_lang", lang);
    };

    const t = translations[language];

    // Views: 'signin' | 'signup' | 'forgot' | 'reset'
    const [view, setView] = useState("signin");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const changeView = (newView) => {
        setErrors({});
        setView(newView);
    };

    // Form inputs
    const [identifier, setIdentifier] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");

    // Local inputs validator
    const validateLogin = () => {
        const errs = {};
        if (!identifier.trim()) {
            errs.identifier = language === "vi" ? "Vui lòng nhập tên tài khoản hoặc email." : "Please enter your username or email.";
        }
        if (!password) {
            errs.password = language === "vi" ? "Vui lòng nhập mật khẩu." : "Please enter your password.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateRegister = () => {
        const errs = {};
        if (!username.trim()) {
            errs.username = language === "vi" ? "Vui lòng nhập tên tài khoản." : "Please enter a username.";
        } else if (username.trim().length < 3) {
            errs.username = language === "vi" ? "Tên tài khoản phải có ít nhất 3 ký tự." : "Username must be at least 3 characters.";
        }

        if (!email.trim()) {
            errs.email = language === "vi" ? "Vui lòng nhập email." : "Please enter an email.";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errs.email = language === "vi" ? "Email không hợp lệ." : "Invalid email address.";
        }

        if (!password) {
            errs.password = language === "vi" ? "Vui lòng nhập mật khẩu." : "Please enter a password.";
        } else if (password.length < 6) {
            errs.password = language === "vi" ? "Mật khẩu phải có ít nhất 6 ký tự." : "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            errs.confirmPassword = language === "vi" ? "Mật khẩu xác nhận không khớp." : "Passwords do not match.";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateForgot = () => {
        const errs = {};
        if (!email.trim()) {
            errs.email = language === "vi" ? "Vui lòng nhập email." : "Please enter your email.";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            errs.email = language === "vi" ? "Email không hợp lệ." : "Invalid email address.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateReset = () => {
        const errs = {};
        if (!token.trim()) {
            errs.token = language === "vi" ? "Vui lòng nhập mã token." : "Please enter the token code.";
        }
        if (!password) {
            errs.password = language === "vi" ? "Vui lòng nhập mật khẩu mới." : "Please enter your new password.";
        } else if (password.length < 6) {
            errs.password = language === "vi" ? "Mật khẩu mới phải có ít nhất 6 ký tự." : "New password must be at least 6 characters.";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Submit actions
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;
        
        setSubmitting(true);
        const result = await login(identifier, password);
        setSubmitting(false);

        if (result.success) {
            toast.success(language === "vi" ? "Đăng nhập thành công! 🎉" : "Logged in successfully! 🎉");
            navigate("/", { replace: true });
        } else {
            const translatedMessage = translateBackendError(result.message, language);
            if (result.field) {
                setErrors({ [result.field]: translatedMessage });
            } else {
                toast.error(translatedMessage);
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateRegister()) return;

        setSubmitting(true);
        const result = await register(username, email, password);
        setSubmitting(false);

        if (result.success) {
            toast.success(language === "vi" ? "Đăng ký thành công! 🎉" : "Registered successfully! 🎉");
            navigate("/", { replace: true });
        } else {
            const translatedMessage = translateBackendError(result.message, language);
            if (result.field) {
                setErrors({ [result.field]: translatedMessage });
            } else {
                toast.error(translatedMessage);
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!validateForgot()) return;

        setSubmitting(true);
        const result = await forgotPassword(email);
        setSubmitting(false);

        if (result.success) {
            toast.success(t.resetSuccess);
            if (result.token) {
                setToken(result.token); // autofill token for ease in testing
            }
            changeView("reset");
        } else {
            const translatedMessage = translateBackendError(result.message, language);
            if (result.field) {
                setErrors({ [result.field]: translatedMessage });
            } else {
                toast.error(translatedMessage);
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validateReset()) return;

        setSubmitting(true);
        const result = await resetPassword(token, password);
        setSubmitting(false);

        if (result.success) {
            toast.success(language === "vi" ? "Đổi mật khẩu và đăng nhập thành công! 🎉" : "Password reset and logged in! 🎉");
            navigate("/", { replace: true });
        } else {
            const translatedMessage = translateBackendError(result.message, language);
            if (result.field) {
                setErrors({ [result.field]: translatedMessage });
            } else {
                toast.error(translatedMessage);
            }
        }
    };

    // Helper to render field error message
    const renderError = (fieldName) => {
        if (!errors[fieldName]) return null;
        return (
            <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors[fieldName]}</span>
            </p>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col justify-center items-center relative overflow-hidden font-sans px-4">
            {/* Background Glows matching HomePage */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: `
                        radial-gradient(circle at center, #93c5fd 0%, transparent 70%)
                    `,
                    opacity: 0.5
                }} 
            />

            {/* Language Switcher */}
            <LanguageSwitcher language={language} setLanguage={handleSetLanguage} />

            {/* Main Auth Container */}
            <div className="w-full max-w-md z-10 transition-all duration-300">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-md">
                        TodoX
                    </h1>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 font-medium">
                        {t.subtitle}
                    </p>
                </div>

                {/* Form Card */}
                <div className="backdrop-blur-xl bg-white/85 border border-slate-200/80 rounded-2xl shadow-2xl shadow-blue-500/5 p-8 relative overflow-hidden">
                    {/* View: SIGN IN & SIGN UP */}
                    {(view === "signin" || view === "signup") && (
                        <div>
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200 mb-6 relative">
                                <button
                                    type="button"
                                    onClick={() => changeView("signin")}
                                    className={`flex-1 pb-3 text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
                                        view === "signin" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {t.signInTab}
                                    {view === "signin" && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_8px_#2563eb]" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeView("signup")}
                                    className={`flex-1 pb-3 text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
                                        view === "signup" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {t.signUpTab}
                                    {view === "signup" && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_8px_#2563eb]" />
                                    )}
                                </button>
                            </div>

                            {/* Sign In Form */}
                            {view === "signin" && (
                                <form onSubmit={handleLogin} className="space-y-5" noValidate>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {t.identifierPlaceholder}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <Mail className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                value={identifier}
                                                onChange={(e) => {
                                                    setIdentifier(e.target.value);
                                                    if (errors.identifier) setErrors({ ...errors, identifier: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.identifier 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder={t.identifierPlaceholder}
                                            />
                                        </div>
                                        {renderError("identifier")}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                {t.passwordLabel}
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => changeView("forgot")}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                                            >
                                                {t.forgotPasswordLink}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <Lock className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors({ ...errors, password: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.password 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {renderError("password")}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/10 flex items-center justify-center cursor-pointer"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        {t.loginBtn}
                                    </button>
                                </form>
                            )}

                            {/* Sign Up Form */}
                            {view === "signup" && (
                                <form onSubmit={handleRegister} className="space-y-4" noValidate>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {t.usernameLabel}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <UserIcon className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="text"
                                                required
                                                value={username}
                                                onChange={(e) => {
                                                    setUsername(e.target.value);
                                                    if (errors.username) setErrors({ ...errors, username: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.username 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder={t.usernamePlaceholder}
                                            />
                                        </div>
                                        {renderError("username")}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {t.emailLabel}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <Mail className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors({ ...errors, email: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.email 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder={t.emailPlaceholder}
                                            />
                                        </div>
                                        {renderError("email")}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {t.passwordLabel}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <Lock className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors({ ...errors, password: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.password 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {renderError("password")}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            {t.confirmPasswordLabel}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                                <Lock className="w-4 h-4" />
                                            </span>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                                                }}
                                                className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                    errors.confirmPassword 
                                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                                placeholder={t.confirmPasswordPlaceholder}
                                            />
                                        </div>
                                        {renderError("confirmPassword")}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/10 flex items-center justify-center cursor-pointer"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        {t.registerBtn}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* View: FORGOT PASSWORD */}
                    {view === "forgot" && (
                        <div className="space-y-5">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => changeView("signin")}
                                    className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-4 cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                    {t.backToLogin}
                                </button>
                                <h2 className="text-xl font-bold text-slate-800 mb-1">{t.requestResetTitle}</h2>
                                <p className="text-xs text-slate-500">{t.requestResetSubtitle}</p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {t.emailLabel}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors({ ...errors, email: "" });
                                            }}
                                            className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                errors.email 
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                            placeholder={t.emailPlaceholder}
                                        />
                                    </div>
                                    {renderError("email")}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {t.resetPasswordBtn}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* View: RESET PASSWORD */}
                    {view === "reset" && (
                        <div className="space-y-5">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => changeView("signin")}
                                    className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mb-4 cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                    {t.backToLogin}
                                </button>
                                <h2 className="text-xl font-bold text-slate-800 mb-1">{t.tokenTitle}</h2>
                                <p className="text-xs text-slate-500">{t.tokenSubtitle}</p>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {t.tokenLabel}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                            <KeyRound className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            value={token}
                                            onChange={(e) => {
                                                setToken(e.target.value);
                                                if (errors.token) setErrors({ ...errors, token: "" });
                                            }}
                                            className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                errors.token 
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                            placeholder={t.tokenPlaceholder}
                                        />
                                    </div>
                                    {renderError("token")}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {t.newPasswordLabel}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (errors.password) setErrors({ ...errors, password: "" });
                                            }}
                                            className={`w-full bg-slate-50/80 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                                                errors.password 
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" 
                                                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {renderError("password")}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {t.resetNewPasswordBtn}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
