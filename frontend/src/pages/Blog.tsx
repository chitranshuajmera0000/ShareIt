import { useEffect, useState } from "react";
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { FullBlog } from "../components/FullBlog";
import useResponsive, { useBlog } from "../hooks";
import MobileNavbar from "../components/navbar/MobileNavbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Blog = () => {
    const { loading, blog, totalBlogLikes, totalBlogDislikes, userId } = useBlog(); // Using existing implementation
    const [fadeIn, setFadeIn] = useState(false);
    const { isMobile, isDesktop } = useResponsive();
    const [, setAlertMessage] = useState("");
    const [, setShowAlert] = useState(false);

    const navigate = useNavigate();
    console.log(totalBlogLikes, totalBlogDislikes)
    console.log(blog)
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);

        // Add fade-in effect when content loads
        if (!loading && blog) {
            setTimeout(() => setFadeIn(true), 100);
        }
    }, [loading, blog]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (localStorage.getItem("token") === null) {
            setShowAlert(true);
            setAlertMessage("You are not authorized to visit this Page!!! Redirecting to sign-in page...");
            const timer = setTimeout(() => {
                setShowAlert(false);
                navigate("/signin");
            }, 5000);
            return () => clearTimeout(timer);
        }
        else {
            axios.get(`${BACKEND_URL}/api/v1/user`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            }
            ).then((r) => {
                if (r.status == 403) {
                    setShowAlert(true);
                    setAlertMessage("You are not authorized to visit this Page!!! Redirecting to sign-in page...");
                    const timer = setTimeout(() => {
                        setShowAlert(false);
                        navigate("/signin");
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            })
        }
    }, [navigate]);

    // if (localStorage.getItem("token") === null) {
    //     return (
    //         <>
    //             {showAlert && (
    //                 <motion.div
    //                     initial={{ x: 300, opacity: 0 }}
    //                     animate={{ x: 0, opacity: 1 }}
    //                     exit={{ x: 300, opacity: 0 }}
    //                     className="fixed top-24 right-4 z-50 p-4 mb-4 text-sm text-white rounded-lg bg-gradient-to-r from-red-500 to-pink-600 shadow-xl"
    //                     role="alert"
    //                 >
    //                     <div className="flex items-center justify-between">
    //                         <span className="font-semibold flex items-center">
    //                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    //                             </svg>
    //                             {alertMessage}

    //                         </span>
    //                         <button
    //                             className="ml-4 text-white hover:text-red-100"
    //                             onClick={() => setShowAlert(false)}
    //                             aria-label="Close"
    //                         >
    //                             <svg
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                                 className="w-4 h-4"
    //                                 fill="none"
    //                                 viewBox="0 0 24 24"
    //                                 stroke="currentColor"
    //                             >
    //                                 <path
    //                                     strokeLinecap="round"
    //                                     strokeLinejoin="round"
    //                                     strokeWidth={2}
    //                                     d="M6 18L18 6M6 6l12 12"
    //                                 />
    //                             </svg>
    //                         </button>
    //                     </div>
    //                 </motion.div>
    //             )}
    //             <BlogSkeleton />
    //         </>
    //     );
    // }

    // Handle loading state
    if (loading) {
        return (
            <div>
                <BlogSkeleton />
            </div>
        );
    }

    // Handle case when blog is undefined/null
    if (!blog) {
        return (
            <div className="flex flex-col w-full min-h-screen p-2 bg-[#F3F9FB]">
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
                <div className="flex-grow flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
                        <p className="text-gray-600 mb-4">
                            The blog post you're looking for could not be loaded.
                        </p>
                        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="flex flex-col w-full min-h-screen p-2 bg-[#F3F9FB]">
            {isMobile ? (
                <div className="">
                    <MobileNavbar hide="invisible" />
                </div>
            ) : isDesktop ? (
                <div className="">
                    <DesktopNavbar hide="invisible" />
                </div>
            ) : (
                <MobileNavbar />
            )}
            <div
                className={`flex-grow transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
            >
                <FullBlog
                    id={blog.id}
                    author={blog.author}
                    subtitle={blog.subtitle}
                    time={blog.time}
                    thumbnailUrl={blog.thumbnailUrl}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.publishedDate}
                    authorId={blog.authorId}
                    likes={totalBlogLikes}
                    dislikes={totalBlogDislikes}
                    blogInteraction={blog.blogInteraction}
                    userId={userId}
                    comments={blog.comments}
                />
            </div>

            {/* Reading progress indicator */}
            <div className="fixed top-0 left-0 h-1 bg-blue-500 z-50 w-0" id="reading-progress-bar" />

            {/* Back to top button - initially hidden */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 opacity-0 hidden"
                id="back-to-top-button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </button>

            {/* Script for reading progress and back-to-top functionality */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    // Reading progress indicator
                    window.addEventListener('scroll', () => {
                        const totalHeight = document.body.scrollHeight - window.innerHeight;
                        const progress = (window.scrollY / totalHeight) * 100;
                        document.getElementById('reading-progress-bar').style.width = progress + '%';
                        
                        // Show/hide back to top button
                        const backToTopButton = document.getElementById('back-to-top-button');
                        if (window.scrollY > 300) {
                            backToTopButton.classList.remove('hidden', 'opacity-0');
                            backToTopButton.classList.add('opacity-70');
                        } else {
                            backToTopButton.classList.add('opacity-0');
                            setTimeout(() => {
                                if (window.scrollY <= 300) {
                                    backToTopButton.classList.add('hidden');
                                }
                            }, 200);
                        }
                    });
                `
            }} />
        </div>
    );
};