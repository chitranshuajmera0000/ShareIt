import { SigninInput } from "@beginnerdev/common";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Mail, Eye, EyeOff, Lock, LoaderCircle, XCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export const Signin = () => {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("success"); // New state for alert type
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (localStorage.getItem("token")) {
            axios
                .get(`${BACKEND_URL}/api/v1/user`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                .then(() => {
                    console.log("Authentication successful");
                    setAlertType("success");
                    setAlertMessage("You are Already Logged In!!! Redirecting to Blogs page...");
                    setShowAlert(true);
                    const timer = setTimeout(() => {
                        navigate("/blogs");
                    }, 3000);
                    return () => clearTimeout(timer);
                })
                .catch((error) => {
                    console.log("Authentication error:", error);
                    setAlertType("error");
                    setAlertMessage("Failed to verify login status. Please try again.");
                    setShowAlert(true);
                });
        }
    }, [navigate]);

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-100 rounded-full opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-100 rounded-full opacity-10 pointer-events-none"></div>

                <SigninAuth setAlertMessage={setAlertMessage} setShowAlert={setShowAlert} setAlertType={setAlertType} />
            </motion.div>

            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        className={`fixed top-24 right-4 z-50 p-4 text-sm rounded-lg shadow-lg ${alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}
                        role="alert"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            {alertType === "success" ? (
                                <CheckCircle size={18} className="mr-2" />
                            ) : (
                                <XCircle size={18} className="mr-2" />
                            )}
                            <span>{alertMessage}</span>
                            <button
                                className="ml-4 text-white hover:text-gray-200"
                                onClick={() => setShowAlert(false)}
                                aria-label="Close"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ... (imports unchanged: SigninInput, useEffect, useState, axios, lucide-react, framer-motion, etc.)

interface SigninAuthProps {
    setAlertMessage: (message: string) => void;
    setShowAlert: (show: boolean) => void;
    setAlertType: (type: "success" | "error") => void;
}

function SigninAuth({ setAlertMessage, setShowAlert, setAlertType }: SigninAuthProps) {
    const [postInputs, setPostInputs] = useState<SigninInput>({
        username: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
    const [forgotUsername, setForgotUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [forgotError, setForgotError] = useState<string | null>(null);
    const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [isErrorTimerActive, setIsErrorTimerActive] = useState<boolean>(false); // New state
    const navigate = useNavigate();

    // Auto-dismiss sign-in error alert
    useEffect(() => {
        if (showErrorAlert) {
            setLoading(false);
            const timer = setTimeout(() => setShowErrorAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showErrorAlert]);

    // Auto-dismiss forgot password error and manage timer state
    useEffect(() => {
        if (forgotError) {
            setIsErrorTimerActive(true);
            const timer = setTimeout(() => {
                setForgotError(null);
                setIsErrorTimerActive(false);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setIsErrorTimerActive(false);
        }
    }, [forgotError]);

    // Clear error on input change
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForgotUsername(e.target.value.toLowerCase());
        setForgotError(null);
        setIsErrorTimerActive(false);
    };

    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setForgotError(null);
        setIsErrorTimerActive(false);
    };

    const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        setForgotError(null);
        setIsErrorTimerActive(false);
    };

    const handleConfirmNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmNewPassword(e.target.value);
        setForgotError(null);
        setIsErrorTimerActive(false);
    };

    // Sign-in request
    async function sendSigninRequest() {
        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInputs);
            const token = response.data.jwt;
            if (!token) {
                setErrorMessage("Invalid response from server. Please try again.");
                setShowErrorAlert(true);
                return;
            }
            localStorage.setItem("token", `Bearer ${token}`);
            setAlertType("success");
            setAlertMessage("Signed in successfully!");
            setShowAlert(true);
            navigate("/blogs");
        } catch (error: any) {
            setLoading(false);
            if (error.response) {
                if (error.response.status === 411 || error.response.status === 403) {
                    setErrorMessage("Invalid username or password. Please try again.");
                } else if (error.response.status === 409) {
                    setErrorMessage(`Error: ${error.response.data.message || "User Already Exists"}`);
                } else {
                    setErrorMessage(`Error: ${error.response.data.message || "Unexpected Error Occurred"}`);
                }
            } else {
                setErrorMessage("Network error. Please check your connection.");
            }
            setShowErrorAlert(true);
        }
    }

    // Forgot password: Send OTP
    async function sendOtpRequest() {
        const MAX_ATTEMPTS = 3;
        const WINDOW_DURATION = 300000; // 5 minutes in ms
        const COOLDOWN_DURATION = 60000; // 30 seconds in ms
        const now = Date.now();
        let otpAttempts = parseInt(localStorage.getItem(`otpAttempts_${forgotUsername}`) || "0");
        let otpWindowStart = parseInt(localStorage.getItem(`otpWindowStart_${forgotUsername}`) || "0");
        let lastOtpRequest = parseInt(localStorage.getItem(`lastOtpRequest_${forgotUsername}`) || "0");

        try {
            setForgotLoading(true);
            setForgotError(null);
            setForgotSuccess(null);
            setIsErrorTimerActive(false);

            // Check cooldown
            if (lastOtpRequest && now - lastOtpRequest < COOLDOWN_DURATION) {
                const secondsLeft = Math.ceil((COOLDOWN_DURATION - (now - lastOtpRequest)) / 1000);
                setForgotError(`Please wait ${secondsLeft} seconds before requesting another OTP.`);
                return;
            }

            // Check rate limit
            if (otpWindowStart && now - otpWindowStart < WINDOW_DURATION) {
                if (otpAttempts >= MAX_ATTEMPTS) {
                    const minutesLeft = Math.ceil((WINDOW_DURATION - (now - otpWindowStart)) / 60000);
                    setForgotError(
                        `Too many OTP requests. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`
                    );
                    return;
                }
            } else {
                otpAttempts = 0;
                otpWindowStart = now;
            }

            otpAttempts += 1;
            lastOtpRequest = now;
            localStorage.setItem(`otpAttempts_${forgotUsername}`, otpAttempts.toString());
            localStorage.setItem(`otpWindowStart_${forgotUsername}`, otpWindowStart.toString());
            localStorage.setItem(`lastOtpRequest_${forgotUsername}`, lastOtpRequest.toString());

            const response = await axios.post<{ message: string; otpSent?: boolean }>(
                `${BACKEND_URL}/api/v1/user/auth/signin/otp/generate`,
                { username: forgotUsername }
            );

            if (response.data.otpSent) {
                setForgotSuccess("OTP sent to your email!");
                setForgotStep(2);
            } else {
                setForgotError("Failed to send OTP. Please try again.");
                otpAttempts -= 1;
                localStorage.setItem(`otpAttempts_${forgotUsername}`, otpAttempts.toString());
            }
        } catch (error: any) {
            setForgotError(error.response?.data?.error || "Failed to send OTP");
            otpAttempts -= 1;
            localStorage.setItem(`otpAttempts_${forgotUsername}`, otpAttempts.toString());
        } finally {
            setForgotLoading(false);
        }
    }

    // Forgot password: Verify OTP
    async function verifyOtpRequest() {
        try {
            setForgotLoading(true);
            setForgotError(null);
            setForgotSuccess(null);
            setIsErrorTimerActive(false);
            const response = await axios.post<{ message: string }>(
                `${BACKEND_URL}/api/v1/user/auth/otp/verify`,
                { username: forgotUsername, otp }
            );
            if (response.data.message === "OTP verified successfully") {
                setForgotSuccess("OTP verified successfully!");
                setForgotStep(3);
            } else {
                setForgotError("Invalid OTP. Please try again.");
            }
        } catch (error: any) {
            setForgotError(error.response?.data?.message || "Invalid OTP");
        } finally {
            setForgotLoading(false);
        }
    }

    // Forgot password: Reset password
    async function resetPasswordRequest() {
        try {
            if (newPassword !== confirmNewPassword) {
                setForgotError("Passwords do not match");
                return;
            }
            if (newPassword.length < 6) {
                setForgotError("Password must be at least 6 characters");
                return;
            }
            setForgotLoading(true);
            setForgotError(null);
            setForgotSuccess(null);
            setIsErrorTimerActive(false);
            await axios.put(`${BACKEND_URL}/api/v1/user/password/reset`, {
                username: forgotUsername,
                password: newPassword
            });
            setShowForgotPassword(false);
            setAlertType("success");
            setAlertMessage("Password reset successfully! Please sign in.");
            setShowAlert(true);
            setForgotStep(1);
            setForgotUsername("");
            setOtp("");
            setNewPassword("");
            setConfirmNewPassword("");
            localStorage.removeItem(`otpAttempts_${forgotUsername}`);
            localStorage.removeItem(`otpWindowStart_${forgotUsername}`);
            localStorage.removeItem(`lastOtpRequest_${forgotUsername}`);
        } catch (error: any) {
            setForgotError(error.response?.data?.message || "Failed to reset password");
        } finally {
            setForgotLoading(false);
        }
    }

    function handleSigninSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendSigninRequest();
    }

    function handleForgotUsernameSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!forgotUsername || !forgotUsername.includes("@")) {
            setForgotError("Please enter a valid email address");
            return;
        }
        sendOtpRequest();
    }

    function handleOtpSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            setForgotError("Please enter a valid OTP");
            return;
        }
        verifyOtpRequest();
    }

    function handleResetPasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        resetPasswordRequest();
    }

    // Modal rendering
    return (
        <div className="flex flex-col items-center relative z-10">
            <motion.div
                className="w-full text-center mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Welcome Back
                </h1>
                <p className="text-gray-500 mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        Sign up
                    </Link>
                </p>
            </motion.div>

            <motion.form
                className="w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                onSubmit={handleSigninSubmit}
            >
                <LabeledInput
                    label="Email"
                    placeholder="Enter your email"
                    icon={<Mail size={18} />}
                    onChange={(e) => setPostInputs((c) => ({ ...c, username: e.target.value.toLowerCase() }))}
                    value={postInputs.username}
                />

                <LabeledInput
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    icon={<Lock size={18} />}
                    onChange={(e) => setPostInputs((c) => ({ ...c, password: e.target.value }))}
                    value={postInputs.password}
                />

                <div className="text-right mt-2">
                    <button
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                        onClick={() => setShowForgotPassword(true)}
                    >
                        Forgot Password?
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center mt-6">
                        <LoaderCircle className="animate-spin text-indigo-500" size={24} />
                    </div>
                ) : (
                    <motion.button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg focus:ring-2 focus:ring-indigo-300 font-medium"
                        whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign In
                    </motion.button>
                )}
            </motion.form>

            <AnimatePresence>
                {showErrorAlert && (
                    <motion.div
                        className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <XCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 max-w-sm w-full relative"
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotStep(1);
                                    setForgotError(null);
                                    setForgotSuccess(null);
                                    setIsErrorTimerActive(false);
                                    setForgotUsername("");
                                    setOtp("");
                                    setNewPassword("");
                                    setConfirmNewPassword("");
                                    localStorage.removeItem(`otpAttempts_${forgotUsername}`);
                                    localStorage.removeItem(`otpWindowStart_${forgotUsername}`);
                                    localStorage.removeItem(`lastOtpRequest_${forgotUsername}`);
                                }}
                            >
                                <XCircle size={24} />
                            </button>

                            <h2 className="text-xl font-bold text-gray-800 mb-4">Reset Your Password</h2>

                            <AnimatePresence mode="wait">
                                {forgotStep === 1 ? (
                                    <motion.form
                                        key="forgot-step1"
                                        className="w-full"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 50, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                        onSubmit={handleForgotUsernameSubmit}
                                    >
                                        <LabeledInput
                                            label="Email"
                                            placeholder="Enter your email"
                                            icon={<Mail size={18} />}
                                            onChange={handleUsernameChange}
                                            value={forgotUsername}
                                        />
                                        {forgotError && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                aria-live="assertive"
                                            >
                                                <XCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotError}</span>
                                            </motion.div>
                                        )}
                                        {forgotSuccess && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <CheckCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotSuccess}</span>
                                            </motion.div>
                                        )}
                                        <motion.button
                                            type="submit"
                                            disabled={forgotLoading || isErrorTimerActive}
                                            className={`w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium ${forgotLoading || isErrorTimerActive ? "opacity-75 cursor-not-allowed" : ""
                                                }`}
                                            whileHover={{ scale: forgotLoading || isErrorTimerActive ? 1 : 1.02 }}
                                            whileTap={{ scale: forgotLoading || isErrorTimerActive ? 1 : 0.98 }}
                                        >
                                            {forgotLoading ? (
                                                <LoaderCircle className="animate-spin mx-auto" size={20} />
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </motion.button>
                                    </motion.form>
                                ) : forgotStep === 2 ? (
                                    <motion.form
                                        key="forgot-step2"
                                        className="w-full"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 50, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                        onSubmit={handleOtpSubmit}
                                    >
                                        <LabeledInput
                                            label="OTP"
                                            placeholder="Enter the OTP sent to your email"
                                            icon={<Mail size={18} />}
                                            onChange={handleOtpChange}
                                            value={otp}
                                        />
                                        {forgotError && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                aria-live="assertive"
                                            >
                                                <XCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotError}</span>
                                            </motion.div>
                                        )}
                                        {forgotSuccess && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <CheckCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotSuccess}</span>
                                            </motion.div>
                                        )}
                                        <motion.button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className={`w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium ${forgotLoading ? "opacity-75 cursor-not-allowed" : ""
                                                }`}
                                            whileHover={{ scale: forgotLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: forgotLoading ? 1 : 0.98 }}
                                        >
                                            {forgotLoading ? (
                                                <LoaderCircle className="animate-spin mx-auto" size={20} />
                                            ) : (
                                                "Verify OTP"
                                            )}
                                        </motion.button>
                                        <p className="text-sm text-gray-500 mt-2 text-center">
                                            Didn't receive OTP?{" "}
                                            <button
                                                type="button"
                                                onClick={sendOtpRequest}
                                                disabled={forgotLoading || isErrorTimerActive}
                                                className={`text-indigo-600 hover:text-indigo-800 ${forgotLoading || isErrorTimerActive ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                            >
                                                Resend OTP
                                            </button>
                                        </p>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="forgot-step3"
                                        className="w-full"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 50, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                        onSubmit={handleResetPasswordSubmit}
                                    >
                                        <LabeledInput
                                            label="New Password"
                                            placeholder="Enter new password"
                                            type="password"
                                            icon={<Lock size={18} />}
                                            onChange={handleNewPasswordChange}
                                            value={newPassword}
                                        />
                                        <LabeledInput
                                            label="Confirm New Password"
                                            placeholder="Confirm new password"
                                            type="password"
                                            icon={<Lock size={18} />}
                                            onChange={handleConfirmNewPasswordChange}
                                            value={confirmNewPassword}
                                        />
                                        {forgotError && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                aria-live="assertive"
                                            >
                                                <XCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotError}</span>
                                            </motion.div>
                                        )}
                                        {forgotSuccess && (
                                            <motion.div
                                                className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600 flex items-start"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <CheckCircle size={16} className="mr-2 mt-0.5" />
                                                <span>{forgotSuccess}</span>
                                            </motion.div>
                                        )}
                                        <motion.button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className={`w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium ${forgotLoading ? "opacity-75 cursor-not-allowed" : ""
                                                }`}
                                            whileHover={{ scale: forgotLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: forgotLoading ? 1 : 0.98 }}
                                        >
                                            {forgotLoading ? (
                                                <LoaderCircle className="animate-spin mx-auto" size={20} />
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.p
                className="text-xs text-gray-500 mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-indigo-600 hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                </Link>
            </motion.p>
        </div>
    );
}

interface LabeledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon?: React.ReactNode;
    value?: string;
}

function LabeledInput({ label, placeholder, onChange, type, icon, value }: LabeledInputType) {
    const [showPass, setShowPass] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div
                className={`relative rounded-lg overflow-hidden transition-all duration-300 border ${isFocused ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-300"
                    }`}
            >
                <div className="flex items-center">
                    {icon && <div className="pl-3 text-gray-400">{icon}</div>}
                    <input
                        type={type === "password" ? (showPass ? "text" : "password") : type || "text"}
                        onChange={onChange}
                        placeholder={placeholder}
                        value={value}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full p-3 text-gray-700 outline-none bg-transparent"
                    />
                    {type === "password" && (
                        <button
                            type="button"
                            className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}