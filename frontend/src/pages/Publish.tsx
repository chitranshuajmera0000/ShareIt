"use client";
import axios from "axios";
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import { BACKEND_URL, CLOUD_NAME, UPLOAD_PRESET } from "../config";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tiptap from "../components/Tiptap";
import useResponsive from "../hooks";
import MobileNavbar from "../components/navbar/MobileNavbar";
import { motion } from "framer-motion";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [image, setImage] = useState<string>("");
    const [description, setDescription] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error" | "warning">("error");
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const { isMobile, isDesktop } = useResponsive();
    const [deleteToken, setDeleteToken] = useState("")

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Animation variants
    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, type: "spring", stiffness: 100 },
        },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showAlertMessage = (message: string, type: "success" | "error" | "warning") => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        if (type === "success") {
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    useEffect(() => {
        const dropArea = dropAreaRef.current;
        if (!dropArea) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            setIsDraggingOver(true);
        };
        const handleDragLeave = () => setIsDraggingOver(false);
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setIsDraggingOver(false);
            if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        };

        dropArea.addEventListener("dragover", handleDragOver);
        dropArea.addEventListener("dragleave", handleDragLeave);
        dropArea.addEventListener("drop", handleDrop);

        return () => {
            dropArea.removeEventListener("dragover", handleDragOver);
            dropArea.removeEventListener("dragleave", handleDragLeave);
            dropArea.removeEventListener("drop", handleDrop);
        };
    }, []);

    const handleImageFile = async (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            showAlertMessage("Image size should be less than 5MB", "warning");
            return;
        }
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", `${UPLOAD_PRESET}`);
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, formData);
            setImage(response.data.secure_url);
            setImagePreview(response.data.secure_url);
            setDeleteToken(response.data.delete_token);
            console.log(deleteToken)
            showAlertMessage("Image uploaded successfully!", "success");
        } catch (error) {
            console.error("Error uploading image:", error);
            showAlertMessage("Failed to upload image. Please try again.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (deleteToken) {
            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`,
                    { token: deleteToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Delete response:', response.data);
                setDeleteToken("");
            } catch (error: any) {
                console.error('Error deleting image:', error.response?.data || error.message);
            }
        }
        if (e.target.files && e.target.files[0]) {
            await handleImageFile(e.target.files[0]);
        }

    }


    const handleDeleteImage = async () => {
        if (deleteToken) {
            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`,
                    { token: deleteToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('Delete response:', response.data);
                setDeleteToken("");
            } catch (error: any) {
                console.error('Error deleting image:', error.response?.data || error.message);
            }
        }
    };



    const handleCancel = () => {
        setIsCancelling(true);
        navigate("/blogs");
    };

    const validateForm = () => {
        const missingFields = [];
        if (!title.trim()) missingFields.push("title");
        if (!description.trim()) missingFields.push("description");
        if (missingFields.length > 0) {
            showAlertMessage(`Please enter ${missingFields.join(" and ")}!`, "error");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const blogData = { title, subtitle, thumbnailUrl: image, content: description };
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/blog`, blogData, {
                headers: { Authorization: `${localStorage.getItem("token")}` },
            });
            showAlertMessage("Blog published successfully!", "success");
            setTimeout(() => {
                navigate(`/blog/${response.data.id}`);
            }, 1000);
        } catch (error: any) {
            console.error("Error publishing blog:", error);
            const errorMessage = error.response?.data?.message || "An error occurred while publishing the blog. Please try again.";
            showAlertMessage(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (showAlert && alertType !== "success") {
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [showAlert, alertType]);

    const renderNavbar = () => (
        <div className={isMobile ? "p-2" : ""}>
            {isDesktop ? <DesktopNavbar /> : <MobileNavbar />}
        </div>
    );

    return (
        <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {renderNavbar()}
            <div className="relative overflow-hidden mb-4"> {/* Reduced mb-8 to mb-4 */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="container mx-auto px-4 pt-12 pb-2 text-center relative z-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-2"> {/* Reduced mb-3 to mb-2 */}
                        Create New Blog
                    </h1>
                    <p className="text-indigo-800/70 max-w-2xl mx-auto">
                        Share your thoughts with the world
                    </p>
                </motion.div>
            </div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto px-4 py-8 relative z-10"
            >
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-visible">
                    {/* Alert Box */}
                    {showAlert && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className={`fixed top-20 right-4 z-50 p-4 mb-4 text-sm rounded-lg shadow-xl ${alertType === "error"
                                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                                : alertType === "success"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                    : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white"
                                }`}
                            role="alert"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold flex items-center">
                                    {alertType === "error" && (
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.33-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                    {alertType === "success" && (
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {alertType === "warning" && (
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" />
                                        </svg>
                                    )}
                                    {alertMessage}
                                </span>
                                <button
                                    className="ml-4 text-white hover:text-gray-200"
                                    onClick={() => setShowAlert(false)}
                                    aria-label="Close"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Form Fields */}
                    <div className="flex flex-col p-6 md:p-8 space-y-6">
                        <motion.div variants={itemVariants}>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                                Title <span className="text-indigo-600">*</span>
                            </label>
                            <input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                type="text"
                                className="bg-white border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 w-full transition-all duration-200 shadow-sm"
                                placeholder="Enter your blog title"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-1">
                                Subtitle <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                id="subtitle"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                type="text"
                                className="bg-white border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 w-full transition-all duration-200 shadow-sm"
                                placeholder="Add a subtitle to provide more context"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thumbnail Image <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <motion.div
                                ref={dropAreaRef}
                                className={`mt-2 p-4 border-2 border-dashed rounded-lg ${isDraggingOver ? "border-indigo-500 bg-indigo-50" : imagePreview ? "border-indigo-300 bg-indigo-50" : "border-gray-300 bg-gray-50"
                                    }`}
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className={`relative w-40 h-40 overflow-hidden rounded-lg ${imagePreview ? "bg-white shadow-md" : "bg-gray-100"}`}>
                                        {imagePreview ? (
                                            <motion.img
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                src={imagePreview}
                                                alt="Blog thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                                                <svg className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-center text-sm">No image selected</p>
                                            </div>
                                        )}
                                        {isUploading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 bg-indigo-800 bg-opacity-60 flex items-center justify-center"
                                            >
                                                <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-stretch justify-center gap-3 w-full sm:w-auto">
                                        <div className="text-center sm:text-left mb-2">
                                            <p className="text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
                                            <p className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 630px. Max 5MB.</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                                        >
                                            {isUploading ? "Uploading..." : imagePreview ? "Change Image" : "Choose Image"}
                                        </motion.button>
                                        {imagePreview && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={async () => {
                                                    await handleDeleteImage()
                                                    setImage("");
                                                    setImagePreview("");

                                                    handleImageChange;
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md shadow-md text-sm font-medium focus:outline-none transition-all duration-200"
                                            >
                                                Remove Image
                                            </motion.button>
                                        )}
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Content <span className="text-indigo-600">*</span>
                            </label>
                            <div className="border border-indigo-300 rounded-lg overflow-visible shadow-sm">
                                <Tiptap size={48} initialContent={description} onChange={(content) => setDescription(content)} />
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="flex justify-center py-6 px-8 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={isLoading || isUploading}
                            className="inline-flex items-center px-6 py-3 text-md font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Publishing...
                                </div>
                            ) : (
                                "Publish Blog"
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCancel}
                            disabled={isLoading || isCancelling}
                            className="inline-flex items-center px-6 py-3 text-md font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
                        >
                            {isCancelling ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Canceling...
                                </div>
                            ) : (
                                "Cancel"
                            )}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
            <div className="mt-16 relative">
                <div className="w-full h-24 bg-indigo-600/10"></div>
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg className="relative block w-full h-10 text-indigo-600/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};