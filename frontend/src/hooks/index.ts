import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { Author } from "../components/BlogCard";
import { useParams } from "react-router-dom";
import { Blog } from "../pages/Blog";

export interface Blog {
    time: string;
    id: number;
    title: string;
    subtitle: string;
    content: string;
    author: Author;
    thumbnailUrl: string;
    publishedDate: string;
    authorId: number;
    likes: number,
    dislikes: number,
    blogInteraction: {
        isLiked?: boolean; // Changed to isLiked
        id?: number;
    } | null,
    comments: blogComment[]
    userId:number
    // Add any other properties your blog object may have
}

const defaultBlog: Blog = {
    id: 0, // or any appropriate default value
    title: '',
    subtitle: '',
    content: '',
    time: '',
    thumbnailUrl: '',
    authorId: 0,
    author: { details: { name: "User", profession: "", location: "", userId: 0, profileUrl: 'U', company: "" }/* Default author object here */ },
    publishedDate: '',
    likes: 0,
    dislikes: 0,
    blogInteraction: {},
    comments: [{
        id: 0,
        userId: 0, totalCommentLikes: 0, totalCommentDislikes: 0, replies: [], showReplyInput: false,
        replyContent: "", interactions: [],
        user: { details: [{ profileUrl: "Error 404 ", name: "User" }] },
        content: "Error Fetching Comments", createdAt: "Error"
    }],
    userId:0
};


export interface blogComment {
    id: number;
    totalCommentLikes: number;
    totalCommentDislikes: number;
    isLiked?: boolean; // Optional: Remove if not used directly
    isDisliked?: boolean; // Optional: Remove if not used directly
    replies: blogComment[];
    showReplyInput: boolean;
    replyContent: string;
    parentId?: number;
    userId: number; // Should this be string to match Prisma schema?
    interactions: { // Change to array
        isLiked?: boolean;
    }[]; // Add array notation
    user: {
        details: {
            name: string;
            profileUrl: string;
        }[];
    };
    content: string;
    createdAt: string;
}

export interface User {
    id: number;
    name: string;
    posts: Blog[]
}


const defaultUser: User = {
    id: 0,
    name: "user",
    posts: []
};


export interface Name {
    userId: number;
    name: string;
    profileUrl: string;
}


const defaultName: Name = {
    userId: 0,
    name: "User",
    profileUrl: ""
};

export interface Details {
    id: number;
    name: string;
    profession: string;
    about: string;
    profileUrl: string;
    location: string;
    company: string;
    instagram: string;
    linkedin: string;
    x: string;
}


const defaultDetails: Details = {
    id: 0,
    name: "User",
    profession: "",
    about: "",
    profileUrl: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png",
    location: "",
    company: "",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com"
};


export interface AuthorInfo {
    details: Details[],
    posts: Blog[]
}

export interface SigninAuth {
    username: "",
    password: ""
}



const defaultAuthorInfo: AuthorInfo = {
    details: [{
        name: "", profession: "", location: "", about: "", id: 0, company: "", instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        x: "https://x.com", profileUrl: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260302/zdkmb0olwoljayeawwps.png"
    }]/* Default author object here */,
    posts: []
};

export interface blogInteraction {
    isLike?: boolean
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}



// export const useAuth = () => {
//     const [postInput , setPostInputs] = useState<SigninAuth>(defaultSigninAuth)
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInput)
//             .then((response) => {

//                 setLoading(false);
//             });
//     }, []);

//     return { loading,  };
// }



export function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        // console.log("Fetching blogs for page:", page); // Debugging
        setPageLoading(true)
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
            .then((response) => {
                const sortedBlogs = response.data.blog
                    .sort((a: Blog, b: Blog) =>
                        new Date(b.time).getTime() - new Date(a.time).getTime()
                    )
                    .map((blog: { time: string; }) => ({
                        ...blog,
                        time: formatDate(blog.time)  // Format the date here
                    }));
                sortedBlogs.map((blog: Blog) => {
                    if (blog.thumbnailUrl == null)
                        blog.thumbnailUrl = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                )
                setLoading(false);
                setBlogs(sortedBlogs);
                setPageLoading(false);
                setTotalPages(Math.ceil(blogs.length / 6))
            }).catch(() => {
                setLoading(false);
            })
            .finally(() => {
                setPageLoading(false); // Move this inside .finally() to ensure it runs after fetching
            });

    }, []);

    return { loading, blogs, totalPages, pageLoading };
}

// export const useBlogs = (initialSearchParams: string | undefined) => {
//     const [blogs, setBlogs] = useState<Blog[]>([]);
//     const [loading, setLoading] = useState(true);
//     console.log("hii");
//     const fetchBlogs = async (searchParams: string | undefined) => {
//         setLoading(true);
//         try {
//             console.log("Hii3");
//             const response = await axios.get(`/api/blog/bulk${searchParams ? `?filter=${searchParams}` : ''}`);
//             setBlogs(response.data.blog);
//             console.log(response.data);
//         } catch (error) {
//             console.error('Error fetching blogs', error);
//             setBlogs([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         console.log("Hii2");
//         fetchBlogs(initialSearchParams);
//     }, [initialSearchParams]);
//     console.log(blogs);
//     return {
//         loading,
//         blogs,
//         fetchBlogs,
//     };
// };



export const useBlog = () => {
    const { id } = useParams<{ id: string }>(); // Explicitly type id as string
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>(defaultBlog);
    const [err, setErr] = useState<string>(""); // Renamed to err for consistency
    const [totalBlogLikes, setTotalBlogLikes] = useState(0);
    const [totalBlogDislikes, setTotalBlogDislikes] = useState(0);
    const [userId , setUserId] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true); // Ensure loading starts as true
            setErr(""); // Reset error state on each fetch

            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                });

                console.log(response.data)
                // Format the blog data
                const blogData = response.data.blog;
                console.log(blogData)
                // const comments = response.data.blog.comments
                blogData.time = formatDate(blogData.time);
                // comments.map((comment: blogComment) => { comment.createdAt = formatDate(comment.createdAt); console.log(comment.createdAt) })
                // if (!blogData.thumbnailUrl) {
                //     blogData.thumbnailUrl =
                //         "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                // }
                if (!blogData.author.details[0].profileUrl) {
                    blogData.author.details[0].profileUrl =
                        "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png";
                }
                setTotalBlogLikes(response.data.totalBlogLikes)
                console.log(response.data.blog)
                setTotalBlogDislikes(response.data.totalBlogDislikes)
                setBlog(blogData);
                setUserId(response.data.userId)
                setLoading(false);
            } catch (error) {
                // Handle different error scenarios
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        setErr("User Not Logged In!!");
                    } else if (error.response?.status === 404) {
                        setErr("Blog Not Found");
                    } else {
                        setErr(error.response?.data?.message || "Failed to fetch blog");
                    }
                } else {
                    setErr("An unexpected error occurred");
                }
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();

        } else {
            setErr("Invalid blog ID");
            setLoading(false);
        }
    }, [id]); // Re-run effect if id changes


    return {
        loading,
        totalBlogLikes,
        totalBlogDislikes,
        blog,
        userId,
        err,
    };
};

export const useUser = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>(defaultUser);
    let totalPages = 1;
    const fetchUser = useCallback(async () => {
        try {
            axios.get(`${BACKEND_URL}/api/v1/user/info`,

                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            )

                .then((response) => {
                    const sortedBlogs = response.data.person.posts
                        .sort((a: Blog, b: Blog) =>
                            new Date(b.time).getTime() - new Date(a.time).getTime()
                        )
                        .map((blog: { time: string; }) => ({
                            ...blog,
                            time: formatDate(blog.time)  // Format the date here
                        }));
                    sortedBlogs.map((blog: Blog) => {
                        if (blog.thumbnailUrl == null) {
                            blog.thumbnailUrl = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                    });
                    response.data.person.posts = sortedBlogs;
                    setUser(response.data.person);
                    setLoading(false)
                })
        } catch (err) {
            console.log("Error Fetching Details !!!")
        } finally {
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        fetchUser();
    }, [fetchUser])

    return {
        loading,
        user,
        totalPages,
        refetch: fetchUser
    }
}

export const useMyBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false); // Default to `false`
    const [user, setUser] = useState<User>(defaultUser);
    // const [totalPages, setTotalPages] = useState(1);

    const fetchUser = useCallback(async () => {
        setPageLoading(true); // Ensure it's set to true before fetching
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/user/info`,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            const sortedBlogs = response.data.person.posts
                .sort(
                    (a: Blog, b: Blog) =>
                        new Date(b.time).getTime() - new Date(a.time).getTime()
                )
                .map((blog: { time: string }) => ({
                    ...blog,
                    time: formatDate(blog.time), // Format the date here
                }));

            sortedBlogs.forEach((blog: Blog) => {
                if (blog.thumbnailUrl == null) {
                    blog.thumbnailUrl =
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                }
            });

            response.data.person.posts = sortedBlogs;
            setUser(response.data.person);
            // setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error Fetching Details !!!", error);
        } finally {
            setPageLoading(false); // Ensure it's set to false when the fetch completes
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return {
        loading,
        pageLoading,
        user,

        refetch: fetchUser,
    };
};






export const useName = () => {
    const [details, setDetails] = useState<Name>(defaultName)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/info/name`,
            {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
        )
            .then((response) => {
                setLoading(false)
                setDetails(response.data.person);
            })
    }, [])
    return {
        loading,
        details
    }
}


export const useCommentDetails = (id: number) => {
    const [details, setDetails] = useState<Name>(defaultName)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/comment/name`,
            {
                data: { id },
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
        )
            .then((response) => {
                setLoading(false)
                setDetails(response.data.person);
            })
    }, [])
    return {
        loading,
        details
    }
}


export const useDetails = () => {
    const [details, setDetails] = useState<Details>(defaultDetails)
    const [loading, setLoading] = useState(true);
    const [authDetails, setAuth] = useState(false);


    const fetchDetails = useCallback(async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/user/details`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
            )
            if (response.data.person.profileUrl == "") {
                response.data.person.profileUrl = "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png"
            }
            if (response.status === 403) {
                setAuth(true)
            }
            setDetails(response.data.person)
        } catch (err) {
            console.log("Error Fetching Details !!!")
            setAuth(true)
        } finally {
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        fetchDetails();
    }, [fetchDetails])
    return {
        loading,
        details,
        authDetails,
        refetch: fetchDetails
    }
}



export const useAuthor = (id: number) => {
    // const [author, setAuthor] = useState<AuthorInfo>(defaultAuthorInfo)
    let author = defaultAuthorInfo
    // const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user/author`,
            {
                params: { id },
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
        )
            .then((response) => {
                if (response.data.person.details[0].profileUrl == "") {
                    response.data.person.details[0].profileUrl = "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png"
                }
                const sortedBlogs = response.data.person.posts
                    .sort((a: Blog, b: Blog) =>
                        new Date(b.time).getTime() - new Date(a.time).getTime()
                    )
                    .map((blog: { time: string; }) => ({
                        ...blog,
                        time: formatDate(blog.time)  // Format the date here
                    }));
                sortedBlogs.map((blog: Blog) => {
                    if (blog.thumbnailUrl == null)
                        blog.thumbnailUrl = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                })
                author.details = response.data.person.details;
                author.posts = sortedBlogs;
                console.log(author)
                setLoading(false)
            }
            )
    }, [])
    return {
        loading,
        author
    }
}



const useResponsive = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = windowWidth < 640; // Small screen (sm breakpoint)
    const isTablet = windowWidth >= 640 && windowWidth < 1024; // Medium (md breakpoint)
    const isDesktop = windowWidth >= 1024; // Large screen (lg+ breakpoint)

    return { isMobile, isTablet, isDesktop, windowWidth };
};

export default useResponsive;
