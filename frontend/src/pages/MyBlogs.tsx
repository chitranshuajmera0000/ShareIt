import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import useResponsive, { type Blog, useMyBlogs } from "../hooks";
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import { MobileNavbar } from "../components/navbar/MobileNavbar";

export default function MyBlogs() {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter") || "";
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const { loading, user, pageLoading } = useMyBlogs();
    const navigate = useNavigate();
    const { isDesktop, isMobile } = useResponsive();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
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

    // Filter blogs based on search parameter
    const filteredBlogs = useMemo(() => {
        if (!user || !user.posts) return [];
        return filter
            ? user.posts.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(filter.toLowerCase()) ||
                    blog.content.toLowerCase().includes(filter.toLowerCase()) ||
                    (blog.subtitle && blog.subtitle.toLowerCase().includes(filter.toLowerCase()))
            )
            : user.posts;
    }, [user, filter]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
    const currentBlogs = useMemo(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredBlogs, page]);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) {
            setPage(1);
        }
    }, [navigate, page, totalPages]);

    // Category colors and logic
    const categoryColors = {
        General: { bg: "from-purple-500 to-indigo-600", text: "text-indigo-100" },
        tech: { bg: "from-blue-500 to-cyan-600", text: "text-blue-100" },
        health: { bg: "from-green-500 to-emerald-600", text: "text-green-100" },
        finance: { bg: "from-yellow-500 to-amber-600", text: "text-yellow-100" },
        lifestyle: { bg: "from-pink-500 to-rose-600", text: "text-pink-100" },
        travel: { bg: "from-orange-500 to-red-600", text: "text-orange-100" },
    };

    const getBlogCategory = (blog: Blog) => {
        const content = blog.title.toLowerCase() + " " + blog.content.toLowerCase();
        if (content.includes("tech") || content.includes("software") || content.includes("code")) return "tech";
        if (content.includes("health") || content.includes("fitness") || content.includes("wellness")) return "health";
        if (content.includes("money") || content.includes("finance") || content.includes("investment")) return "finance";
        if (content.includes("lifestyle") || content.includes("fashion") || content.includes("food")) return "lifestyle";
        if (content.includes("travel") || content.includes("vacation") || content.includes("journey")) return "travel";
        return "General";
    };

    // Updated BlogCard with edit button in line with title
    function BlogCard({ post }: { post: Blog }) {
        let readTime = Math.ceil(post.content.length / 500);
        let readTimeText = "";
        const category = getBlogCategory(post);
        const categoryColor = categoryColors[category];

        if (readTime <= 0) {
            readTimeText = "";
        } else if (readTime < 60) {
            const roundedMinutes = Math.round(readTime / 5) * 5;
            const finalMinutes = Math.max(5, roundedMinutes);
            readTimeText = `${finalMinutes} min read`;
        } else {
            const hours = Math.floor(readTime / 60);
            const minutes = Math.round((readTime % 60) / 5) * 5;
            readTimeText = minutes === 0 ? `${hours} hour read` : `${hours} hour ${minutes} min read`;
        }

        return (
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }} className="h-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col h-full group-hover:ring-2 group-hover:ring-indigo-400 relative">
                    {/* Category Badge */}
                    <div
                        className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor.bg} ${categoryColor.text} text-xs font-semibold shadow-md`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>

                    {/* Image Section */}
                    <Link to={`/blog/${post.id}`} className="hover:cursor-pointer">
                        <div className="relative overflow-hidden group">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-full h-60 bg-gradient-to-b from-gray-200 to-gray-300"
                            >
                                <img
                                    src={
                                        post.thumbnailUrl ||
                                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    }
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
                                <div className="flex items-center">
                                    <svg
                                        className="w-3 h-3 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {readTimeText}
                                </div>
                            </motion.div>
                        </div>
                    </Link>

                    {/* Content Section with Edit Button in Line with Title */}
                    <div className="p-5 flex-grow">
                        <div className="flex justify-between items-center mb-2">
                            <Link to={`/blog/${post.id}`} className="hover:cursor-pointer flex-grow">
                                <h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-indigo-700 transition-colors duration-300">
                                    {post.title}
                                </h2>
                            </Link>
                            <Link to={`/editblog/${post.id}`} className="flex-shrink-0 ml-2">
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png"
                                    alt="Edit"
                                    className="w-6 h-6"
                                />
                            </Link>
                        </div>
                        <p className="text-gray-600 line-clamp-2 text-base group-hover:text-gray-700 transition-colors duration-300">
                            {post.subtitle}
                        </p>
                    </div>

                    {/* Footer Section */}
                    <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="text-gray-500 text-sm flex items-center">
                                <svg
                                    className="w-4 h-4 mr-1 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                {post.time || "Date not available"}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    function BlogGrid(blogs: Blog[]) {
        return (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {blogs.length > 0 ? (
                    blogs.map((post) => <BlogCard key={post.id} post={post} />)
                ) : filter ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="col-span-2 text-center py-16 bg-white rounded-xl shadow-lg"
                    >
                        <div className="flex flex-col items-center px-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                                className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 text-white"
                            >
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </motion.div>
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-semibold text-gray-800"
                            >
                                No blogs found matching "{filter}"
                            </motion.h3>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-500 mt-3 mb-6 max-w-md"
                            >
                                Try adjusting your search criteria.
                            </motion.p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="col-span-2 flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 text-white"
                        >
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </motion.div>
                        <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-semibold text-gray-800 text-center"
                        >
                            No Blogs Written By You
                        </motion.h3>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-500 mt-3 max-w-md text-center px-6"
                        >
                            Start sharing your thoughts with the world!
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => navigate("/publish")}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Create Your First Blog
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    function SkeletonCard() {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
            >
                <div className="relative">
                    <div className="w-full h-60 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                    <div className="absolute top-3 right-3 h-6 w-16 bg-white/90 rounded-full animate-pulse" />
                    <div className="absolute top-3 left-3 h-6 w-20 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full animate-pulse" />
                </div>
                <div className="p-5 space-y-3">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-2/3" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse w-1/2" />
                </div>
                <div className="px-5 py-4 border-t border-gray-100">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/4" />
                    </div>
                </div>
            </motion.div>
        );
    }

    function Skeleton() {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
                {isMobile ? (
                    <div className="p-2">
                        <MobileNavbar />
                    </div>
                ) : isDesktop ? (
                    <div>
                        <DesktopNavbar />
                    </div>
                ) : (
                    <MobileNavbar />
                )}
                <div className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10">
                    <div className="h-10 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mx-auto mb-3"></div>
                    <div className="h-4 w-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse mx-auto max-w-full"></div>
                </div>
                <div className="relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (loading || pageLoading) {
        return <Skeleton />;
    } else {
        return (
            <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
                <div>
                    {isMobile ? (
                        <div className="p-2">
                            <MobileNavbar />
                        </div>
                    ) : isDesktop ? (
                        <div>
                            <DesktopNavbar />
                        </div>
                    ) : (
                        <MobileNavbar />
                    )}
                </div>

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
                            My Blogs
                        </h1>
                        <p className="text-indigo-800/70 max-w-2xl mx-auto">Manage and explore your personal blog collection</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="container mx-auto px-4 relative z-10"
                >
                    {filter && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md inline-block"
                        >
                            <h2 className="text-xl font-semibold text-indigo-800 flex items-center">
                                {filteredBlogs.length ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-indigo-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <span>
                                            <span className="text-indigo-600 font-bold">{filteredBlogs.length}</span> results for "
                                            <span className="text-indigo-600 italic">{filter}</span>"
                                        </span>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </h2>
                        </motion.div>
                    )}
                    <div className="space-y-8">{BlogGrid(currentBlogs)}</div>
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-12 mb-8"
                        >
                            <div className="pagination flex justify-center gap-3 sm:gap-5 flex-wrap items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className={`px-4 py-1 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base text-white font-medium transition-all duration-300 flex items-center
                                    ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"}`}
                                >
                                    <svg
                                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Prev
                                </motion.button>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/80 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-md"
                                >
                                    <span className="text-indigo-800 font-medium text-sm sm:text-base">
                                        Page <span className="font-bold text-indigo-600">{page}</span> of{" "}
                                        <span className="font-bold text-indigo-600">{totalPages || 1}</span>
                                    </span>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages || totalPages === 0}
                                    className={`px-4 py-1 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base text-white font-medium transition-all duration-300 flex items-center justify-center
                                    ${page === totalPages || totalPages === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"}`}
                                >
                                    Next
                                    <svg
                                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <div className="mt-16 relative">
                    <div className="w-full h-24 bg-indigo-600/10"></div>
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                        <svg
                            className="relative block w-full h-10 text-indigo-600/10"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </div>
                </div>
            </motion.div>
        );
    }
}