import useResponsive, { Blog, useBlogs } from "../hooks"
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MobileNavbar } from "../components/navbar/MobileNavbar";
import { motion } from "framer-motion";

export const Blogs = () => {
    const [searchParams] = useSearchParams();
    let filter = searchParams.get("filter") || "";
    // const [limit, setLimit] = useState(6);
    let limit = 6;
    const [page, setPage] = useState(1);
    const { loading, blogs, pageLoading } = useBlogs();

    // const [alertMessage, setAlertMessage] = useState("");
    // const [showAlert, setShowAlert] = useState(false);
    const { isMobile, isDesktop } = useResponsive();

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, type: "spring", stiffness: 100 }
        }
    };

    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const filteredBlogs = filter
        ? blogs.filter(blog =>
            blog.title.toLowerCase().includes(filter.toLowerCase()) ||
            blog.content.toLowerCase().includes(filter.toLowerCase()) ||
            blog.time.toLowerCase().includes(filter.toLowerCase()) ||
            (blog.subtitle && blog.subtitle.toLowerCase().includes(filter.toLowerCase())) ||
            blog.author.details[0].name.toLowerCase().includes(filter.toLowerCase())
        )
        : blogs;

    let navigate = useNavigate();
    const filteredTotalPages = Math.ceil(filteredBlogs.length / limit);

    // Get current page's blogs
    const indexOfLastBlog = page * limit;
    const indexOfFirstBlog = indexOfLastBlog - limit;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);


    useEffect(() => {
        searchParams.set(filter, "")
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(pageLoading)
        if (page > filteredTotalPages && filteredTotalPages > 0) {
            setPage(1);
        }
    }, [navigate, page, filter, filteredTotalPages]);

    // Define the category type
    type Category =
        | "General"
        | "tech"
        | "health"
        | "finance"
        | "lifestyle"
        | "travel"
        | "food"
        | "politics"
        | "education"
        | "sports"
        | "entertainment"
        | "career"; // Added "career" category for this type of content

    // Type the categoryColors object
    const categoryColors: Record<Category, { bg: string; text: string }> = {
        General: { bg: "from-purple-500 to-indigo-600", text: "text-indigo-100" },
        tech: { bg: "from-blue-500 to-cyan-600", text: "text-blue-100" },
        health: { bg: "from-green-500 to-emerald-600", text: "text-green-100" },
        finance: { bg: "from-yellow-500 to-amber-600", text: "text-yellow-100" },
        lifestyle: { bg: "from-pink-500 to-rose-600", text: "text-pink-100" },
        travel: { bg: "from-orange-500 to-red-600", text: "text-orange-100" },
        food: { bg: "from-red-500 to-orange-600", text: "text-red-100" },
        politics: { bg: "from-gray-600 to-gray-800", text: "text-gray-100" },
        education: { bg: "from-teal-500 to-teal-700", text: "text-teal-100" },
        sports: { bg: "from-lime-500 to-green-600", text: "text-lime-100" },
        entertainment: { bg: "from-fuchsia-500 to-purple-600", text: "text-fuchsia-100" },
        career: { bg: "from-indigo-500 to-blue-700", text: "text-indigo-100" }, // New career category color
    };

    

    // Update getBlogCategory to return the Category type
    const getBlogCategory = (blog: Blog): Category => {
        const title = blog.title.toLowerCase();
        const content = blog.content.toLowerCase();
        console.log("Title:", title);
        console.log("Content excerpt:", content.slice(0, 200) + "...");

        const categoryKeywords: Record<string, string[]> = {
            tech: [
                "tech", "technology", "software", "code", "coding", "programming", "developer",
                "app", "web", "ai", "artificial intelligence", "machine learning", "gadget", "device"
            ],
            health: [
                "health", "fitness", "wellness", "exercise", "diet", "nutrition", "medicine",
                "mental health", "workout", "yoga", "therapy", "disease", "doctor", "hospital"
            ],
            finance: [
                "money", "finance", "investment", "budget", "economy", "stocks", "trading",
                "bank", "savings", "wealth", "financial", "crypto", "cryptocurrency", "loan"
            ],
            lifestyle: [
                "lifestyle", "fashion", "style", "beauty", "home", "decor", "relationship",
                "hobby", "culture", "trend", "daily life", "self-care", "minimalism"
            ],
            travel: [
                "travel", "vacation", "journey", "trip", "destination", "adventure", "tourism",
                "explore", "flight", "hotel", "backpacking", "culture", "road trip", "wanderlust"
            ],
            food: [
                "food", "recipe", "cooking", "cuisine", "meal", "restaurant", "chef",
                "baking", "dining", "gourmet", "nutrition", "diet", "flavor", "ingredient"
            ],
            politics: [
                "politics", "government", "election", "policy", "law", "democracy", "vote",
                "politician", "campaign", "legislation", "rights", "justice", "debate", "news"
            ],
            education: [
                "education", "learning", "school", "study", "teacher", "student", "course",
                "knowledge", "university", "training", "research", "science", "exam", "lecture"
            ],
            sports: [
                "sports", "athlete", "team", "match", "competition", "tournament", "player",
                "coach", "league", "score", "game" // "game" is less weighted here
            ],
            entertainment: [
                "entertainment", "movie", "music", "tv", "show", "celebrity", "film",
                "concert", "performance", "streaming", "actor", "song", "theater"
            ],
            career: [ // New category for career-related content
                "career", "job", "hiring", "portfolio", "interview", "recruiter", "application",
                "layoff", "business", "design", "designer", "work", "employment", "metrics", "strategy"
            ]
        };

        // Calculate scores with title weighted more heavily (e.g., 2x)
        const categoryScores: Record<string, number> = {};

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            categoryScores[category] = keywords.reduce((score, keyword) => {
                const regex = new RegExp(`\\b${keyword}\\b`, "g");
                const titleMatches = (title.match(regex) || []).length * 2; // Double weight for title
                const contentMatches = (content.match(regex) || []).length;
                return score + titleMatches + contentMatches;
            }, 0);
        }

        // Find the best category
        let maxScore = 0;
        let bestCategory: Category = "General";

        for (const [category, score] of Object.entries(categoryScores)) {
            if (score > maxScore) {
                maxScore = score;
                bestCategory = category as Category;
            }
        }

        // If the max score is too low (e.g., < 2), default to General
        if (maxScore < 2) {
            bestCategory = "General";
        }

        console.log("Category scores:", categoryScores);
        console.log("Selected category:", bestCategory);

        return bestCategory;
    };

    
    function BlogCard({ post }: { post: Blog }) {
        let readTime = Math.ceil(post.content.length / 500);
        let readTimeText = '';
        const category = getBlogCategory(post);
        const categoryColor = categoryColors[category];

        if (readTime <= 0) {
            readTimeText = '';
        } else if (readTime < 60) {
            const roundedMinutes = Math.round(readTime / 5) * 5;
            const finalMinutes = Math.max(5, roundedMinutes);
            readTimeText = `${finalMinutes} min read`;
        } else {
            const hours = Math.floor(readTime / 60);
            const minutes = Math.round((readTime % 60) / 5) * 5;

            if (minutes === 0) {
                readTimeText = `${hours} hour read`;
            } else if (minutes === 60) {
                readTimeText = `${hours + 1} hour read`;
            } else {
                readTimeText = `${hours} hour+ read`;
            }
        }

        return (
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="h-full"
            >
                <Link to={`/blog/${post.id}`} className="hover:cursor-pointer flex flex-col h-full group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col h-full group-hover:ring-2 group-hover:ring-indigo-400 relative">
                        {/* Category Badge */}
                        <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor.bg} ${categoryColor.text} text-xs font-semibold shadow-md`}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>

                        {/* Image Section with Overlay */}
                        <div className="relative overflow-hidden group">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-full h-60 bg-gradient-to-b from-gray-200 to-gray-300"
                            >
                                {post.thumbnailUrl ? (
                                    <img
                                        src={post.thumbnailUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </motion.div>
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Read time badge */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-3 right-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full shadow-md font-medium"
                            >
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {readTimeText}
                                </div>
                            </motion.div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-grow">
                            <h2 className="text-xl font-bold mb-2 text-gray-800  group-hover:text-indigo-700 transition-colors duration-300">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-2 text-base group-hover:text-gray-700 transition-colors duration-300">
                                {post.subtitle}
                            </p>
                        </div>

                        {/* Footer Section */}
                        <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="text-gray-500 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    {post.time}
                                </div>
                                <div className="font-medium text-indigo-700 text-sm flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    {post.author.details[0].name}
                                    {post.author?.details?.[0]?.name ?? "Unknown Author"}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    function BlogGrid(blogs: Blog[]) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
                {blogs.length > 0 ? (
                    blogs.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))
                ) : (
                    filter ? (
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
                                    <svg
                                        className="w-12 h-12"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
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
                                    We couldn't find any blogs matching your search. Try a different search term or explore other topics.
                                </motion.p>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={() => window.location.href = '/blogs'}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Browse all blogs
                                </motion.button>
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
                                <svg
                                    className="w-12 h-12"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </motion.div>
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-semibold text-gray-800 text-center"
                            >
                                No blogs available yet
                            </motion.h3>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-500 mt-3 max-w-md text-center px-6"
                            >
                                Check back soon for new content. We're working on bringing you interesting articles!
                            </motion.p>
                        </motion.div>
                    )
                )}
            </motion.div>
        );
    }


    if (loading || pageLoading) {
        console.log("inside loading")
        return <Skeleton></Skeleton>
    }
    else {
        return (
            <motion.div
                {...pageTransition}
                className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2"
            >
                <div>
                    {
                        isMobile ?
                            <div className="p-2">
                                <MobileNavbar></MobileNavbar>
                            </div> : isDesktop ? <div>
                                <DesktopNavbar></DesktopNavbar>
                            </div> : <MobileNavbar />
                    }
                </div>

                {/* Header section with decorative elements */}
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
                            Explore Our Blogs
                        </h1>
                        <p className="text-indigo-800/70 max-w-2xl mx-auto">
                            Discover insightful articles, guides, and stories from our expert writers
                        </p>
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
                                {
                                    filteredBlogs.length ?
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <span>
                                                <span className="text-indigo-600 font-bold">{filteredBlogs.length}</span> results for "<span className="text-indigo-600 italic">{filter}</span>"
                                            </span>
                                        </div> : <div></div>
                                }
                            </h2>
                        </motion.div>
                    )}
                    <div className="space-y-8">
                        {BlogGrid(currentBlogs)}
                    </div>
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
        ${page === 1
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"}`}
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                                    <span className="font-bold text-indigo-600">{filteredTotalPages || 1}</span>
                                </span>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPage(page + 1)}
                                disabled={page === filteredTotalPages || filteredTotalPages === 0}
                                className={`px-4 py-1 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base text-white font-medium transition-all duration-300 flex items-center justify-center
        ${(page === filteredTotalPages || filteredTotalPages === 0)
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"}`}
                            >
                                Next
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer with decorative wave */}
                <div className="mt-16 relative">
                    <div className="w-full h-24 bg-indigo-600/10"></div>
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                        <svg className="relative block w-full h-10 text-indigo-600/10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
            </motion.div>
        );
    }
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
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/4" />
                </div>
            </div>
        </motion.div>
    )
}


function Skeleton() {
    const { isMobile, isDesktop } = useResponsive();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {
                isMobile ?
                    <div className="p-2">
                        <MobileNavbar></MobileNavbar>
                    </div> : isDesktop ? <div>
                        <DesktopNavbar></DesktopNavbar>
                    </div> : <MobileNavbar />
            }

            {/* Header skeleton */}
            <div className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10">
                <div className="h-10 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mx-auto mb-3"></div>
                <div className="h-4 w-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse mx-auto max-w-full"></div>
            </div>

            {/* Decorative elements */}
            <div className="relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
            </div>

            {/* Blog cards skeletons */}
            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>

                {/* Pagination skeleton */}
                <div className="flex justify-center gap-3 sm:gap-5 flex-wrap items-center mt-12 mb-8">
                    <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
                    <div className="w-28 sm:w-32 h-8 sm:h-10 bg-white/80 rounded-lg animate-pulse"></div>
                    <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Footer skeleton with decorative wave */}
            <div className="mt-16 relative">
                <div className="w-full h-24 bg-indigo-600/10"></div>
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg className="relative block w-full h-10 text-indigo-600/10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}
