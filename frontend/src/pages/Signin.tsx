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
    // const [alertBox, setAlertBox] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        window.scrollTo(0, 0);

        if (localStorage.getItem("token")) {
            axios.get(`${BACKEND_URL}/api/v1/user`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
                .then(() => {
                    console.log("Authentication successful");
                    setShowAlert(true);
                    setAlertMessage("You are Already Logged In!!! Redirecting to Blogs page...");
                    // setAlertBox(true)
                    // Success case handling
                    const timer = setTimeout(() => {
                        navigate("/blogs");
                    }, 3000); // 3 seconds delay
                    return () => clearTimeout(timer);

                })
                .catch((error) => {
                    console.log("Authentication error:", error);
                });
        }
    }, [navigate]);

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full overflow-hidden relative"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                }}
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>

                <SigninAuth />
            </motion.div>

            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        className="fixed top-24 right-4 z-50 p-4 text-sm text-white rounded-lg bg-green-500 shadow-lg"
                        role="alert"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between">
                            <CheckCircle size={18} className="mr-2" />
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


function SigninAuth() {
    const [postInputs, setPostInputs] = useState<SigninInput>({
        username: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (showAlert) {
            setLoading(false);
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    async function sendRequest() {
        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInputs);
            console.group(response)
            const token = response.data.jwt;
            if (!token) {
                setErrorMessage("Invalid response from server. Please try again.");
                setShowAlert(true);
                return;
            }

            localStorage.setItem("token", `Bearer ${token}`);
            navigate("/blogs");
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 411 || error.response.status === 403) {
                    setErrorMessage("Invalid username or password. Please try again.");
                } else if(error.response.status === 409 ){
                    setErrorMessage(`Error: ${error.response.data.message || "User Already Exits"}`);
                }
                else{
                    setErrorMessage(`Error: ${error.response.data.message || "Unexpected Error Occured"}`);
                }
            } else {
                setErrorMessage("Network error. Please check your connection.");
            }
            setShowAlert(true);
        }
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendRequest();
    }

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
                    Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 transition-colors">Sign up</Link>
                </p>
            </motion.div>

            <motion.form
                className="w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                onSubmit={handleFormSubmit}
            >
                <LabeledInput
                    label="Email"
                    placeholder="Enter your email"
                    icon={<Mail size={18} />}
                    onChange={(e) => setPostInputs(c => ({ ...c, username: e.target.value.toLowerCase() }))}
                    value={postInputs.username}
                />

                <LabeledInput
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    icon={<Lock size={18} />}
                    onChange={(e) => setPostInputs(c => ({ ...c, password: e.target.value }))}
                    value={postInputs.password}
                />

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
                {showAlert && (
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

            <motion.p
                className="text-xs text-gray-500 mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
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