import { createContext, useState, useContext, ReactNode } from "react";
import { motion } from "framer-motion";

// Define context type
interface AlertContextType {
    showAlert: (message: string) => void;
    hideAlert: () => void;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook to use alert context
export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlert must be used within an AlertProvider");
    return context;
};

// Alert Provider Component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Function to show alert
    const showAlert = (message: string) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(null), 2500); // Auto-hide after 3s
    };

    // Function to hide alert manually
    const hideAlert = () => setAlertMessage(null);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}

            {/* Custom Animated Alert Box */}
            {alertMessage && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    className="fixed top-24 right-4 z-50 p-4 text-sm text-white rounded-lg bg-gradient-to-r from-red-500 to-pink-600 shadow-xl"
                    role="alert"
                >
                    <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            {alertMessage}
                        </span>
                        <button
                            className="ml-4 text-white hover:text-red-100"
                            onClick={hideAlert}
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AlertContext.Provider>
    );
};
