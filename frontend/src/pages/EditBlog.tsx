import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Blog, useBlog, useName, } from '../hooks';
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
        if (!formData.title || !formData.content) {
            setError("Title and content are required.");
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

    // Check if data is fully loaded
    const isDataLoaded = !blogLoading && !detailsLoading && blog && details && blog.id && details.userId;

    // Authorization and error handling
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
            <div className="min-h-screen bg-gradient-to-b p-2 from-slate-100 to-slate-200">
                <AnimatePresence>
                    {showAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-24 right-4 p-4 z-50 mb-4 text-sm text-red-800 rounded-lg bg-red-50 shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <span>{alertMessage}</span>
                                <button
                                    className="ml-4 text-red-800 hover:text-red-500"
                                    onClick={() => setShowAlert(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <EditBlogSkeleton isMobile={isMobile} isDesktop={isDesktop} />
            </div>
        );
    }

    // Show skeleton until data is fully loaded
    if (!isDataLoaded) {
        return <EditBlogSkeleton isMobile={isMobile} isDesktop={isDesktop} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b p-2 from-slate-100 to-slate-200">
            {isMobile ? <MobileNavbar hide="invisible" /> : <DesktopNavbar hide="invisible" />}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8"
            >
                <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Blog Post</h1>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4"
                        >
                            <div className="flex">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="ml-3 text-sm">{error}</p>
                                <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4"
                        >
                            <div className="flex">
                                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="ml-3 text-sm">{success}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter a captivating title..."
                            />
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Subtitle
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                placeholder="Add a brief subtitle (optional)..."
                            />
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Blog Image</label>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative w-full md:w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 mb-4 md:mb-0"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Blog thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="ml-2">No image selected</span>
                                    </div>
                                )}
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-blue-500 animate-spin"></div>
                                    </div>
                                )}
                            </motion.div>
                            <div className="flex flex-col space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={uploadingImage}
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
                                        className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        disabled={uploadingImage}
                                    >
                                        Remove Image
                                    </motion.button>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Recommended: 1200×630px (16:9 ratio)<br />
                                    Maximum size: 5MB
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <Tiptap size={0} onChange={handleContentChange} initialContent={formData.content} />
                        </div>
                        <div className="flex justify-end text-xs text-gray-500">
                            {wordCount} words | {charCount} characters
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-md text-white font-medium ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            disabled={isDeleting}
                            onClick={() => setShowDeleteConfirm(true)}
                            className={`px-6 py-3 rounded-md text-white font-medium ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}
                        >
                            {isDeleting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </span>
                            ) : (
                                'Delete Blog'
                            )}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                    </div>
                </form>
            </motion.div>
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
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const EditBlogSkeleton = ({ isMobile }: { isMobile: boolean; isDesktop: boolean }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b p-2 from-slate-100 to-slate-200">
            {/* Navbar Skeleton */}
            {isMobile ? (
                <div className="p-2">
                    <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse" />
                </div>
            ) : (
                <div className="p-2">
                    <div className="w-full h-16 bg-gray-200 rounded-md animate-pulse" />
                </div>
            )}

            {/* Main Content Skeleton */}
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
                <div className="w-48 h-8 bg-gray-200 rounded-md mb-6 animate-pulse" />
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="space-y-3">
                                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
                                <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse" />
                                <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-full h-64 bg-gray-200 rounded-md animate-pulse" />
                        <div className="flex justify-end space-x-2">
                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                        <div className="w-36 h-12 bg-gray-200 rounded-md animate-pulse" />
                        <div className="w-36 h-12 bg-gray-200 rounded-md animate-pulse" />
                        <div className="w-28 h-12 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;