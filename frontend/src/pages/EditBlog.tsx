import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Blog, useBlog, useName } from '../hooks';
import useResponsive from '../hooks';
import { DesktopNavbar } from '../components/navbar/DesktopNavbar';
import MobileNavbar from '../components/navbar/MobileNavbar';
import Tiptap from '../components/Tiptap';

interface EditBlogProps {
    onSave?: (blog: Partial<Blog>) => Promise<void>;
    onCancel?: () => void;
}

export const EditBlog: React.FC<EditBlogProps> = () => {
    const navigate = useNavigate();
    const { loading: blogLoading, blog } = useBlog();
    const { details, loading: detailsLoading } = useName();
    const { isMobile, isDesktop } = useResponsive();

    const [formData, setFormData] = useState<Partial<Blog>>({
        title: '',
        content: '',
        subtitle: '',
        thumbnailUrl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || '',
                content: blog.content || '',
                subtitle: blog.subtitle || '',
                thumbnailUrl: blog.thumbnailUrl || '',
            });
            setImagePreview(blog.thumbnailUrl || '');
            const content = blog.content || '';
            setCharCount(content.length);
            setWordCount(content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length);
        }
    }, [blog]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setUnsavedChanges(true);
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
        const plainText = content.replace(/<[^>]*>/g, ' ');
        setCharCount(content.length);
        setWordCount(plainText.split(/\s+/).filter(Boolean).length);
        setUnsavedChanges(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingImage(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                const image = new FormData();
                image.append('file', file);
                image.append('upload_preset', 'blogify');
                axios.post("https://api.cloudinary.com/v1_1/dxj9gigbq/upload", image)
                    .then((response) => {
                        setFormData(prev => ({ ...prev, thumbnailUrl: response.data.secure_url }));
                        setImagePreview(response.data.secure_url);
                        setUploadingImage(false);
                        setUnsavedChanges(true);
                    })
                    .catch(() => {
                        setError("Failed to upload image. Please try again.");
                        setUploadingImage(false);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title?.trim()) {
            setError("Title is required.");
            return;
        }

        // Check for empty content (including stripping HTML tags and whitespace)
        const plainTextContent = formData.content
            ?.replace(/<[^>]*>/g, '') // Remove HTML tags
            ?.trim(); // Remove whitespace

        if (!plainTextContent) {
            setError("Content cannot be empty.");
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        try {
            await axios.put(`${BACKEND_URL}/api/v1/blog/${blog.id}`, formData, {
                headers: { 'Authorization': localStorage.getItem('token') || '' },
            });
            setSuccess("Blog updated successfully!");
            setUnsavedChanges(false);
            setTimeout(() => navigate(`/blog/${blog.id}`), 1500);
        } catch {
            setError("Failed to update blog. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
                headers: { 'Authorization': localStorage.getItem('token') || '' },
            });
            setSuccess("Blog deleted successfully!");
            setUnsavedChanges(false);
            setTimeout(() => navigate('/myblogs'), 1500);
        } catch {
            setError("Failed to delete blog. Please try again.");
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleCancel = () => {
        if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
            return;
        }
        navigate('/myblogs');
    };

    const isDataLoaded = !blogLoading && !detailsLoading && blog && details && blog.id && details.userId;

    if ((isDataLoaded && details.userId !== blog.authorId)) {
        if (!showAlert) {
            setShowAlert(true);
            setAlertMessage("You are not authorized to edit this blog! Redirecting to My Blogs page...");
            setTimeout(() => {
                setShowAlert(false);
                navigate("/myblogs");
            }, 5000);
        }
        return (
            <motion.div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
                <AnimatePresence>
                    {showAlert && (
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="fixed top-20 right-4 z-50 p-4 mb-4 text-sm rounded-lg shadow-xl bg-gradient-to-r from-red-500 to-pink-600 text-white"
                            role="alert"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.33-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
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
                </AnimatePresence>
                <EditBlogSkeleton isMobile={isMobile} isDesktop={isDesktop} />
            </motion.div>
        );
    }

    if (!isDataLoaded) {
        return <EditBlogSkeleton isMobile={isMobile} isDesktop={isDesktop} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2"
        >
            {isMobile ? <MobileNavbar hide="invisible" /> : <DesktopNavbar hide="invisible" />}
            <div className="relative overflow-hidden mb-4">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="container mx-auto px-4 pt-12 pb-2 text-center relative z-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-2">
                        Edit Your Blog
                    </h1>
                    <p className="text-indigo-800/70 max-w-2xl mx-auto">
                        Refine your story
                    </p>
                </motion.div>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.15 }}
                className="max-w-4xl mx-auto px-4 py-8 relative z-10"
            >
                <motion.div className="bg-white rounded-xl shadow-lg overflow-visible">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="fixed top-20 right-4 z-50 p-4 mb-4 text-sm rounded-lg shadow-xl bg-gradient-to-r from-red-500 to-pink-600 text-white"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.33-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {error}
                                    </span>
                                    <button
                                        className="ml-4 text-white hover:text-gray-200"
                                        onClick={() => setError('')}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                className="fixed top-20 right-4 z-50 p-4 mb-4 text-sm rounded-lg shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {success}
                                    </span>
                                    <button
                                        className="ml-4 text-white hover:text-gray-200"
                                        onClick={() => setSuccess('')}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <form onSubmit={handleSubmit} className="flex flex-col p-6 md:p-8 space-y-6">
                        <motion.div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                                Title <span className="text-indigo-600">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                type="text"
                                className="bg-white border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 w-full transition-all duration-200 shadow-sm"
                                placeholder="Enter your blog title"
                                required
                            />
                        </motion.div>
                        <motion.div>
                            <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-1">
                                Subtitle <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                                id="subtitle"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                type="text"
                                className="bg-white border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 w-full transition-all duration-200 shadow-sm"
                                placeholder="Add a subtitle to provide more context"
                            />
                        </motion.div>
                        <motion.div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thumbnail Image <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className={`mt-2 p-4 border-2 border-dashed rounded-lg ${imagePreview ? "border-indigo-300 bg-indigo-50" : "border-gray-300 bg-gray-50"}`}
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
                                        {uploadingImage && (
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
                                            disabled={uploadingImage}
                                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200"
                                        >
                                            {uploadingImage ? 'Uploading...' : imagePreview ? 'Change Image' : 'Choose Image'}
                                        </motion.button>
                                        {imagePreview && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview('');
                                                    setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
                                                    setUnsavedChanges(true);
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md shadow-md text-sm font-medium focus:outline-none transition-all duration-200"
                                            >
                                                Remove Image
                                            </motion.button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                        <motion.div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Content <span className="text-indigo-600">*</span>
                            </label>
                            <div className="border border-indigo-300 rounded-lg overflow-visible shadow-sm">
                                <Tiptap size={48} onChange={handleContentChange} initialContent={formData.content} />
                            </div>
                            <div className="flex justify-end text-xs text-gray-500 mt-1">
                                {wordCount} words | {charCount} characters
                            </div>
                        </motion.div>
                        <motion.div className="flex justify-center py-6 px-8 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-3 text-md font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    'Save Changes'
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center px-6 py-3 text-md font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-md hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Deleting...
                                    </span>
                                ) : (
                                    'Delete Blog'
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center px-6 py-3 text-md font-medium text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
                            >
                                Cancel
                            </motion.button>
                            {unsavedChanges && (
                                <span className="text-amber-600 text-sm italic flex items-center ml-auto">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Unsaved changes
                                </span>
                            )}
                        </motion.div>
                    </form>
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
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete this blog post? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const EditBlogSkeleton = ({ isMobile }: { isMobile: boolean; isDesktop: boolean }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {isMobile ? (
                <div className="p-2">
                    <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse" />
                </div>
            ) : (
                <div className="p-2">
                    <div className="w-full h-16 bg-gray-200 rounded-md animate-pulse" />
                </div>
            )}
            <div className="relative overflow-hidden mb-4">
                <div className="container mx-auto px-4 pt-12 pb-2 text-center">
                    <div className="w-48 h-8 bg-gray-200 rounded-md mb-2 mx-auto animate-pulse" />
                    <div className="w-64 h-4 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-40 h-40 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="flex flex-col gap-3 w-full sm:w-auto">
                                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
                                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
                                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="flex justify-end space-x-2">
                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                        <div className="w-36 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-36 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="w-28 h-12 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;