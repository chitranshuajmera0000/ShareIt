import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useResponsive, { Blog, useAuthor } from "../hooks";
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import MobileNavbar from "../components/navbar/MobileNavbar";

const AuthorProfile = () => {
    const { id } = useParams();
    const { loading, author } = useAuthor(Number(id));
    const { isMobile, isDesktop } = useResponsive();
    
    const [userData] = useState({
        socialLinks: [
            { platform: "Instagram", url: author.details.instagram, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762081/vce1ar88sheqkxy6zk6a.png" },
            { platform: "X", url: author.details.x, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762069/qlxvqtpseuivmf6uhfwd.png" },
            { platform: "LinkedIn", url: author.details.linkedin, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762076/c2h4ryhnkvjeuprjwlrg.png" },
        ],
    });
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    // Animation variants consistent with Profile/Blogs
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

    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    // ProfileHeader Component
    const ProfileHeader = () => {
        if (!author?.details) return null;

        return (
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 pointer-events-none"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 text-center md:text-left">
                    Who Am I?
                </h2>
                <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col items-center md:flex-row md:items-start"} gap-6 md:gap-8`}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full overflow-hidden shadow-lg border-4 border-white`}
                    >
                        <img
                            src={author.details.profileUrl || "https://via.placeholder.com/150"}
                            alt={author.details.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                        />
                    </motion.div>
                    <div className={`flex flex-col ${isMobile ? "items-center w-full" : "items-center md:items-start"}`}>
                        <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-800 group-hover:text-indigo-700 transition-colors`}>
                            {author.details.name}
                        </h1>
                        <p className={`${isMobile ? "text-lg" : "text-xl"} text-gray-600 mt-2 text-center md:text-left`}>
                            {author.details.company ? `${author.details.profession} at ${author.details.company}` : author.details.profession}
                        </p>
                        <div className="flex items-center mt-2 text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {author.details.location}
                        </div>
                        <div className={`flex gap-4 mt-4 ${isMobile ? "justify-center" : ""}`}>
                            {userData.socialLinks.map((link) => (
                                <motion.a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    <img src={link.icon} alt={link.platform} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // PersonalSummary Component
    const PersonalSummary = () => {
        if (!author?.details) return null;

        return (
            <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50 pointer-events-none"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 text-center md:text-left">
                    Mind Behind the Words
                </h2>
                <p className="text-gray-600 leading-relaxed text-center md:text-left">{author.details.about || "No about information available."}</p>
            </motion.div>
        );
    };

    // BlogPostCard Component
    const BlogPostCard: React.FC<{ post: Blog }> = ({ post }) => (
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }}>
            <Link to={`/blog/${post.id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
                    <div className="relative overflow-hidden group">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`w-full ${isMobile ? "h-36" : "h-48"} bg-gradient-to-b from-gray-200 to-gray-300`}
                        >
                            <img
                                src={post.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full shadow-md font-medium"
                        >
                            Read More
                        </motion.div>
                    </div>
                    <div className="p-5 flex-grow">
                        <h3 className={`${isMobile ? "text-base" : "text-lg"} font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors text-center md:text-left`}>
                            {post.title}
                        </h3>
                    </div>
                    <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="text-gray-500 text-sm flex items-center justify-center md:justify-start">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {post.time || "Date not available"}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    // BlogPostGrid Component
    const BlogPostGrid: React.FC<{ blogPosts: Blog[] }> = ({ blogPosts }) => (
        <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 text-center md:text-left">
                Hot Off the Keyboard
            </h2>
            {blogPosts.length ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-1 ${isMobile ? "gap-4" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}
                >
                    {blogPosts.map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl shadow-lg p-6 text-center"
                >
                    <p className="text-gray-600">No Blogs Posted</p>
                </motion.div>
            )}
        </motion.div>
    );

    // Unified Navbar rendering
    const renderNavbar = () => (
        <div className={isMobile ? "p-2" : ""}>
            {isDesktop ? <DesktopNavbar hide="invisible" /> : <MobileNavbar hide="invisible" />}
        </div>
    );

    // Updated ThemedSkeleton
    const ThemedSkeleton = () => (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {/* Navbar */}
            {renderNavbar()}

            {/* Header Section */}
            <div className="relative overflow-hidden mb-8">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10">
                    <div className="h-10 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mx-auto mb-3"></div>
                    <div className="h-4 w-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse mx-auto"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 relative z-10">
                {/* Profile Header Skeleton */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="h-8 w-40 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mb-6 mx-auto md:mx-0"></div>
                    <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col items-center md:flex-row"} gap-6 md:gap-8`}>
                        <div className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
                        <div className={`flex flex-col ${isMobile ? "items-center w-full" : "items-center md:items-start"} space-y-3`}>
                            <div className={`${isMobile ? "h-6 w-48" : "h-8 w-64"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
                            <div className={`${isMobile ? "h-5 w-36" : "h-6 w-48"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
                            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                            <div className="flex gap-4 mt-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Summary Skeleton */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="h-8 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mb-6 mx-auto md:mx-0"></div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Blog Post Grid Skeleton */}
                <div className="mt-8">
                    <div className="h-8 w-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mb-6 mx-auto md:mx-0"></div>
                    <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className={`w-full ${isMobile ? "h-36" : "h-48"} bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
                                <div className="p-5 space-y-3">
                                    <div className={`${isMobile ? "h-5 w-3/4" : "h-6 w-2/3"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mx-auto md:mx-0`}></div>
                                </div>
                                <div className="px-5 py-4 border-t border-gray-100">
                                    <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto md:mx-0"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
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
        </div>
    );
    if (loading) {
        return <ThemedSkeleton />;
    }

    if (!author) {
        return (
            <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2 flex items-center justify-center">
                {renderNavbar()}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Author Not Found</h2>
                    <p className="text-gray-600 mb-4">The author information could not be loaded.</p>
                    <Link
                        to="/"
                        className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Return to Home
                    </Link>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {renderNavbar()}
            <div className="relative overflow-hidden mb-8">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-3">
                        Meet the Storyteller
                    </h1>
                    <p className="text-indigo-800/70 max-w-2xl mx-auto">Unravel the journey, insights, and passions behind every post.</p>
                </motion.div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="container mx-auto px-4 relative z-10"
            >
                <ProfileHeader />
                <PersonalSummary />
                <BlogPostGrid blogPosts={author.posts} />
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

export default AuthorProfile;