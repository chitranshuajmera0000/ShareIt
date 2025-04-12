import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAlert } from "./AlertContext"; // Import alert hook
import { BACKEND_URL } from "../config";

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            // Prevent duplicate alert if already on signin page
            if (location.pathname !== "/signin") {
                showAlert("You are not authorized! Redirecting to sign-in...");
                setTimeout(() => navigate("/signin"), 2500);
            }
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/user`, {
            headers: { Authorization: token }
        })
        .catch(() => {
            // Prevent duplicate alert if already on signin page
            if (location.pathname !== "/signin") {
                showAlert("Authentication failed! Redirecting to Sign-in...");
                setTimeout(() => navigate("/signin"), 2500);
            }
        });

    }, [navigate, location.pathname, showAlert]);

    return <Outlet />;
};

export default ProtectedRoute;
