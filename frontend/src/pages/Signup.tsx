import { SignupInput } from "@beginnerdev/common";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Mail, Eye, EyeOff, Lock, LoaderCircle, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export const Signup = () => {
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("success");
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {

            if (showAlert) {
                setShowAlert(false)
            }
        }, 5000)
    }, [showAlert])

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
                    setShowAlert(true);
                    setAlertMessage("You are Already Logged In!!! Redirecting to Blogs page...");
                    const timer = setTimeout(() => {
                        navigate("/blogs");
                    }, 3000);
                    return () => clearTimeout(timer);
                })
                .catch((error) => {
                    console.log("Authentication error:", error);
                });
        }
    }, [navigate]);

    return (
        <motion.div
            className="h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ maxWidth: "100vw", willChange: "opacity", contain: "layout" }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md overflow-hidden relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                style={{ minHeight: "450px", width: "100%", maxWidth: "448px", willChange: "transform, opacity" }}
            >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-100 rounded-full opacity-10 pointer-events-none"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-100 rounded-full opacity-10 pointer-events-none"></div>

                <SignupAuth
                    setAlertMessage={setAlertMessage}
                    setShowAlert={setShowAlert}
                    setAlertType={setAlertType}
                />
            </motion.div>

            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        className={`fixed top-24 right-4 z-50 p-4 text-sm text-white rounded-lg ${alertType === "success" ? "bg-green-500" : "bg-red-500"
                            } shadow-lg`}
                        role="alert"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <CheckCircle size={20} className="mr-2" />
                            <span>{alertMessage}</span>
                            <button
                                className="ml-4 text-white hover:text-green-100"
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

interface OtpResponse {
    message: string;
    otpSent?: boolean;
}

interface SignupAuthProps {
    setAlertMessage: (message: string) => void;
    setShowAlert: (show: boolean) => void;
    setAlertType: (type: "success" | "error") => void;
}

function SignupAuth({ setAlertMessage, setShowAlert, setAlertType }: SignupAuthProps) {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        username: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    // Password strength checker
    useEffect(() => {
        if (postInputs.password) {
            const hasLowerCase = /[a-z]/.test(postInputs.password);
            const hasUpperCase = /[A-Z]/.test(postInputs.password);
            const hasNumber = /[0-9]/.test(postInputs.password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(postInputs.password);
            const isLongEnough = postInputs.password.length >= 8;

            const score = [hasLowerCase, hasUpperCase, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

            if (score <= 2) setPasswordStrength("weak");
            else if (score <= 4) setPasswordStrength("medium");
            else setPasswordStrength("strong");
        } else {
            setPasswordStrength(null);
        }
    }, [postInputs.password]);

    // Password match checker
    useEffect(() => {
        if (confirmPassword === "" || postInputs.password === "") {
            setPasswordsMatch(null);
            return;
        }
        setPasswordsMatch(confirmPassword === postInputs.password);
    }, [confirmPassword, postInputs.password]);

    // async function sendOtpRequest() {
    //     try {
    //         setLoading(true);
    //         const response = await axios.post<OtpResponse>(`${BACKEND_URL}/api/v1/user/auth/otp/generate`, {
    //             username: postInputs.username
    //         });

    //         if (response.data.otpSent) {
    //             setAlertType("success");
    //             setAlertMessage("OTP sent to your email!");
    //             setShowAlert(true);
    //             setStep(2);
    //         }
    //     } catch (error: any) {
    //         setAlertType("error");
    //         setAlertMessage(error.response?.data?.error || "Failed to send OTP");
    //         setShowAlert(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const [resendDisabled, setResendDisabled] = useState(false);
    async function sendOtpRequest() {
        if (resendDisabled) return;
        try {
            setLoading(true);
            setResendDisabled(true);
            const response = await axios.post<OtpResponse>(`${BACKEND_URL}/api/v1/user/auth/signup/otp/generate`, {
                username: postInputs.username
            });
            if (response.data.otpSent) {
                setAlertType("success");
                setAlertMessage("OTP sent to your email!");
                setShowAlert(true);
                setStep(2);
            }
        } catch (error: any) {
            setAlertType("error");
            setAlertMessage(error.response?.data?.error || "Failed to send OTP");
            setShowAlert(true);
        } finally {
            setLoading(false);
            setTimeout(() => setResendDisabled(false), 30000); // 30s cooldown
        }
    }

    async function verifyOtpRequest() {
        try {
            setLoading(true);
            const response = await axios.post<OtpResponse>(`${BACKEND_URL}/api/v1/user/auth/otp/verify`, {
                username: postInputs.username,
                otp: otp
            });

            if (response.data.message === "OTP verified successfully") {
                setAlertType("success");
                setAlertMessage("OTP verified successfully!");
                setShowAlert(true);
                setStep(3);
            }
        } catch (error: any) {
            setAlertType("error");
            setAlertMessage(error.response?.data?.message || "Invalid OTP");
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    }

    async function sendRequest() {
        try {
            if (postInputs.password.length < 6) {
                setFormError("Please enter password of length greater than or equal to 6");
                return;
            }
            if (postInputs.password !== confirmPassword) {
                setFormError("Passwords do not match");
                return;
            }
            setLoading(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs);
            const token = response.data.jwt;
            const jwt = "Bearer " + token;
            localStorage.setItem("token", jwt);

            setAlertType("success");
            setAlertMessage("Account created successfully! Redirecting...");
            setShowAlert(true);

            setTimeout(() => {
                navigate("/info");
            }, 2000);
        } catch (error: any) {
            setLoading(false);
            setAlertType("error");
            if (error.response) {
                if (error.response.status === 403) {
                    setAlertMessage("Invalid username or password. Please try again.");
                } else if (error.response.status === 411) {
                    setAlertMessage("User already exists. Please try a different username or sign in.");
                } else if (error.response.status === 409) {
                    setAlertMessage(`Error: ${error.response.data.message || "User Already Exists"}`);
                } else {
                    setAlertMessage(`Error: ${error.response.data.message || "Unexpected Error Occurred"}`);
                }
            } else {
                setAlertMessage("Network error. Please check your connection.");
            }
            setShowAlert(true);
        }
    }

    function handleUsernameSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!postInputs.username || !postInputs.username.includes('@')) {
            setFormError("Please enter a valid email address");
            return;
        }
        setFormError(null);
        sendOtpRequest();
    }

    function handleOtpSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            setFormError("Please enter a valid OTP");
            return;
        }
        setFormError(null);
        verifyOtpRequest();
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendRequest();
    }

    // Animation variants for smoother transitions
    const formVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 150, damping: 20 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            scale: 0.95,
            transition: {
                x: { type: "spring", stiffness: 150, damping: 20 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
            }
        })
    };

    // Track direction for forward/back navigation
    const [direction, setDirection] = useState(0);

    // Update direction when step changes
    useEffect(() => {
        return () => setDirection(0); // Reset direction on unmount
    }, []);

    const handleStepChange = (newStep: 1 | 2 | 3) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    return (
        <div className="flex flex-col items-center relative z-10">
            <motion.div
                className="w-full text-center mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Create An Account
                </h1>
                <p className="text-gray-500 mt-2">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>

            {/* Step Indicator */}
            <div className="w-full max-w-xs mx-auto mb-6">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((step - 1) / 3) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            <AnimatePresence custom={direction}>
                {step === 1 ? (
                    <motion.form
                        custom={direction}
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                        onSubmit={handleUsernameSubmit}
                        key="step1"
                    >
                        <LabeledInput
                            label="Email"
                            placeholder="Enter your email"
                            icon={<Mail size={18} />}
                            onChange={(e) => setPostInputs((c) => ({ ...c, username: e.target.value.toLowerCase() }))}
                            value={postInputs.username}
                        />

                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <XCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg focus:ring-2 focus:ring-indigo-300 font-medium ${loading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "" : "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : "Send OTP"}
                        </motion.button>
                    </motion.form>
                ) : step === 2 ? (
                    <motion.form
                        custom={direction}
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                        onSubmit={handleOtpSubmit}
                        key="step2"
                    >
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <motion.button
                                    type="button"
                                    onClick={() => handleStepChange(1)}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                    whileHover={{ x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </motion.button>
                                <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                    {postInputs.username}
                                </span>
                            </div>
                        </div>

                        <LabeledInput
                            label="Enter OTP"
                            placeholder="Enter the OTP sent to your email"
                            icon={<Mail size={18} />}
                            onChange={(e) => setOtp(e.target.value)}
                            value={otp}
                            type="text"
                        />

                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <XCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg focus:ring-2 focus:ring-indigo-300 font-medium ${loading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "" : "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : "Verify OTP"}
                        </motion.button>

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Didn't receive OTP?{" "}
                            <motion.button
                                type="button"
                                onClick={sendOtpRequest}
                                disabled={loading}
                                className="text-indigo-600 hover:text-indigo-800"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Resend OTP
                            </motion.button>
                        </p>
                    </motion.form>
                ) : (
                    <motion.form
                        custom={direction}
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                        onSubmit={handlePasswordSubmit}
                        key="step3"
                    >
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <motion.button
                                    type="button"
                                    onClick={() => handleStepChange(2)}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                    whileHover={{ x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </motion.button>
                                <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                    {postInputs.username}
                                </span>
                            </div>
                        </div>

                        <LabeledInput
                            label="Password"
                            placeholder="Create a strong password"
                            type="password"
                            icon={<Lock size={18} />}
                            onChange={(e) => setPostInputs((c) => ({ ...c, password: e.target.value }))}
                            value={postInputs.password}
                        />

                        {postInputs.password && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500">Password strength:</span>
                                    <span
                                        className={`text-xs font-medium ${passwordStrength === "weak"
                                            ? "text-red-500"
                                            : passwordStrength === "medium"
                                                ? "text-yellow-500"
                                                : "text-green-500"
                                            }`}
                                    >
                                        {passwordStrength}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${passwordStrength === "weak"
                                            ? "bg-red-500"
                                            : passwordStrength === "medium"
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                            }`}
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width:
                                                passwordStrength === "weak"
                                                    ? "33%"
                                                    : passwordStrength === "medium"
                                                        ? "66%"
                                                        : "100%"
                                        }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>

                                <ul className="mt-2 text-xs text-gray-500 space-y-1">
                                    <li className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full mr-2 ${/[A-Z]/.test(postInputs.password) ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        Uppercase letter
                                    </li>
                                    <li className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full mr-2 ${/[0-9]/.test(postInputs.password) ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        Number
                                    </li>
                                    <li className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(postInputs.password)
                                                ? "bg-green-500"
                                                : "bg-gray-300"
                                                }`}
                                        ></div>
                                        Special character
                                    </li>
                                    <li className="flex items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full mr-2 ${postInputs.password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        8+ characters
                                    </li>
                                </ul>
                            </div>
                        )}

                        <LabeledInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            type="password"
                            icon={<Lock size={18} />}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                        />

                        <AnimatePresence>
                            {confirmPassword && (
                                <motion.div
                                    className={`flex items-center ${passwordsMatch === null ? "hidden" : ""} mb-4`}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {passwordsMatch ? (
                                        <CheckCircle size={16} className="text-green-500 mr-2" />
                                    ) : (
                                        <XCircle size={16} className="text-red-500 mr-2" />
                                    )}
                                    <span className={`text-sm ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <XCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{formError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg focus:ring-2 focus:ring-indigo-300 font-medium ${loading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "" : "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? <LoaderCircle className="animate-spin mx-auto" size={24} /> : "Sign Up"}
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>

            <motion.p
                className="text-xs text-gray-500 mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                By signing up, you agree to our{" "}
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

// ... (LabeledInput component remains unchanged)

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
            <div className={`relative rounded-lg overflow-hidden transition-all duration-300 border ${isFocused ? "border-indigo-500 ring-2 ring-indigo-100" : "border-gray-300"
                }`}>
                <div className="flex items-center">
                    {icon && (
                        <div className="pl-3 text-gray-400">
                            {icon}
                        </div>
                    )}
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