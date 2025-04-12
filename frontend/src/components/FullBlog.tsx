import { Link } from "react-router-dom";
import { Blog, blogComment, formatDate } from "../hooks";
import { useEffect, useRef, useState } from "react";
import HTMLRenderer from "./Htmlrenderer";
import { HandThumbUpIcon as HandThumbUpOutline, HandThumbDownIcon as HandThumbDownOutline, } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import axios from "axios";
import { BACKEND_URL } from "../config";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, LoaderCircleIcon } from "lucide-react";


const renderComments = (
    comments: blogComment[],
    commentInteractions: any,
    handleCommentLike: any,
    handleCommentDislike: any,
    toggleReplyInput: any,
    updateReplyContent: any,
    handleReply: any,
    userId: number,
    handleEditComment: (
        commentId: number,
        content: string,
        setIsEditCommentLoading: (loading: boolean) => void
    ) => void,
    handleDeleteComment: (commentId: number, setIsDeleteCommentLoading: (loading: boolean) => void) => void,// New prop,
) => {
    // Organize comments into a parent-child structure with user comments first
    const organizeComments = (commentsList: blogComment[]) => {
        const commentMap = new Map<number, blogComment & { children: blogComment[] }>();
        commentsList.forEach(comment => {
            commentMap.set(comment.id, { ...comment, children: [] });
        });

        const userComments: blogComment[] = [];
        const otherComments: blogComment[] = [];

        // Separate user comments from others
        commentsList.forEach(comment => {
            if (comment.parentId) {
                const parentComment = commentMap.get(comment.parentId);
                if (parentComment) {
                    parentComment.children.push(commentMap.get(comment.id) as blogComment);
                }
            } else {
                if (comment.userId === userId) {
                    userComments.push(commentMap.get(comment.id) as blogComment);
                } else {
                    otherComments.push(commentMap.get(comment.id) as blogComment);
                }
            }
        });

        // Sort children of each comment to put user's replies first
        commentMap.forEach(comment => {
            comment.children.sort((a, b) =>
                a.userId === userId && b.userId !== userId ? -1 :
                    b.userId === userId && a.userId !== userId ? 1 : 0
            );
        });

        return [...userComments, ...otherComments];
    };

    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
    const [isReplyLoading, setIsReplyLoading] = useState(false);
    const [isEditCommentLoading, setIsEditCommentLoading] = useState(false);
    const [deleteLoadingStates, setDeleteLoadingStates] = useState<Record<number, boolean>>({}); // Per-comment loading state  
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const editAreaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map()); // Single ref for all textareas
    const MAX_CONTENT_LENGTH = 150;
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});

    const toggleExpandComment = (commentId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const toggleRepliesVisibility = (commentId: number) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const startEditing = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditContent(content);
    };

    const cancelEditing = (loading: boolean) => {
        if (loading) {

            setEditingCommentId(null);
            setEditContent("");
        }
    };

    const handleDeleteC = (commentId: number) => {
        const setLoadingForComment = (loading: boolean) => {
            setDeleteLoadingStates(prev => ({
                ...prev,
                [commentId]: loading
            }));
        };
        handleDeleteComment(commentId, setLoadingForComment);
    };
    const adjustHeight = (commentId: number) => {
        const textarea = editAreaRefs.current.get(commentId);
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (editingCommentId !== null) {
            adjustHeight(editingCommentId); // Adjust height when editing starts or content changes
        }
    }, [editContent, editingCommentId]);

    const topLevelComments = organizeComments(comments);


    const renderCommentTree = (commentList: (blogComment & { children?: blogComment[] })[], depth = 0) => (
        <div className={`mt-2 ${depth > 0 ? 'ml-4' : ''}`}>
            <AnimatePresence>
                {commentList?.length > 0 ? (
                    commentList.map((comment: blogComment & { children?: blogComment[] }, index) => {
                        const interaction = commentInteractions.find((c: any) => c.id === comment.id) || {
                            totalCommentLikes: 0,
                            totalCommentDislikes: 0,
                            isCommentLiked: false,
                            isCommentDisliked: false,
                            replies: [],
                            showReplyInput: false,
                            replyContent: "",
                        };

                        const replyCount = comment.children?.length || 0;
                        const isRepliesExpanded = expandedReplies[comment.id] || false;
                        const isCommentExpanded = expandedComments[comment.id] || false;
                        const truncatedContent = comment.content.length > MAX_CONTENT_LENGTH && !isCommentExpanded
                            ? comment.content.slice(0, MAX_CONTENT_LENGTH) + "..."
                            : comment.content;
                        const isEditing = editingCommentId === comment.id;
                        const isDeleting = deleteLoadingStates[comment.id] || false; // Specific to this comment




                        return (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ backgroundColor: "#f9fafb" }}
                                className="bg-white p-3 rounded-xl border border-gray-200 mb-2 transition-colors duration-200"
                            >
                                <div className="flex gap-2">
                                    <img
                                        src={comment.user.details.profileUrl}
                                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                        alt={comment.user.details.name}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold text-gray-800 truncate text-sm">
                                                    {comment.userId === userId ? "You" : comment.user.details.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-500 flex-shrink-0 ">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                                {comment.userId === userId && !isEditing && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => startEditing(comment.id, comment.content)}
                                                            className="text-gray-600 hover:text-blue-500 text-xs"
                                                        >
                                                            <div className="flex  items-center ">
                                                                <motion.img
                                                                    whileHover={{ scale: 1.1 }}
                                                                    src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png"
                                                                    className="h-5 w-5 cursor-pointer"
                                                                    alt="Edit"
                                                                />
                                                            </div>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteC(comment.id)}
                                                            className="text-gray-600 hover:text-red-500 text-xs"
                                                        >
                                                            {isDeleting ? (
                                                                <LoaderCircleIcon className="animate-spin w-4 h-4" />
                                                            ) : (
                                                                <div className="flex  items-center ">
                                                                <motion.img
                                                                    whileHover={{ scale: 1.1 }}
                                                                    src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1743711285/trash_1_yj6d5p.png"
                                                                    className="h-5 w-5 cursor-pointer"
                                                                    alt="Delete"
                                                                />
                                                            </div>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing ? (
                                            <div className="mt-2 flex gap-2">
                                                {/* <input
                                                    value={editContent}
                                                    onChange={(e) => { adjustHeight; setEditContent(e.target.value) }}
                                                    className="flex-1 bg-gray-50 p-1 rounded-lg border border-gray-200 text-sm"
                                                /> */}
                                                <textarea
                                                    onChange={(e) => {
                                                        setEditContent(e.target.value);
                                                        adjustHeight(comment.id);
                                                    }}
                                                    value={editContent}
                                                    ref={(el) => {
                                                        if (el) editAreaRefs.current.set(comment.id, el);
                                                        else editAreaRefs.current.delete(comment.id);
                                                    }}
                                                    className="flex-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm block w-full resize-none overflow-hidden"
                                                    placeholder="Edit your Comment..."
                                                    rows={5}
                                                />
                                                <button
                                                    onClick={() => {
                                                        handleEditComment(comment.id, editContent, setIsEditCommentLoading);
                                                        setTimeout(() => {
                                                            cancelEditing(!isEditCommentLoading);
                                                        }, 2000)
                                                    }}
                                                    className="bg-blue-500 text-white px-2 py-1 h-12 rounded-lg text-sm"
                                                >
                                                    {isEditCommentLoading ? (
                                                        <LoaderCircleIcon className="animate-spin" />
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => { cancelEditing(true) }}
                                                    className="bg-gray-500 text-white px-2 py-1 h-12 rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 mt-1 text-sm break-words">
                                                {truncatedContent}
                                                {comment.content.length > MAX_CONTENT_LENGTH && (
                                                    <button
                                                        onClick={() => toggleExpandComment(comment.id)}
                                                        className="text-blue-500 text-xs font-medium ml-1"
                                                    >
                                                        {isCommentExpanded ? "Show Less" : "Show More"}
                                                    </button>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {!isEditing && (
                                    <div className="flex gap-2 mt-2 items-center">
                                        <button
                                            onClick={() => handleCommentLike(comment.id)}
                                            className={`flex items-center gap-1 ${interaction.isCommentLiked ? 'text-blue-600' : 'text-gray-600'}`}
                                        >
                                            {interaction.isCommentLiked ? <HandThumbUpSolid className="w-4 h-4" /> : <HandThumbUpOutline className="w-4 h-4" />}
                                            <span className="text-sm">{interaction.totalCommentLikes}</span>
                                        </button>
                                        <button
                                            onClick={() => handleCommentDislike(comment.id)}
                                            className={`flex items-center gap-1 ${interaction.isCommentDisliked ? 'text-red-600' : 'text-gray-600'}`}
                                        >
                                            {interaction.isCommentDisliked ? <HandThumbDownSolid className="w-4 h-4" /> : <HandThumbDownOutline className="w-4 h-4" />}
                                            <span className="text-sm">{interaction.totalCommentDislikes}</span>
                                        </button>
                                        <button
                                            onClick={() => toggleReplyInput(comment.id)}
                                            className="text-gray-600 hover:text-blue-500 text-sm font-medium"
                                        >
                                            Reply
                                        </button>
                                        {replyCount > 0 && (
                                            <button
                                                onClick={() => toggleRepliesVisibility(comment.id)}
                                                className="flex items-center gap-1 text-gray-600 hover:text-blue-500 text-sm font-medium ml-2"
                                            >
                                                {isRepliesExpanded ? (
                                                    <ChevronUpIcon className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDownIcon className="w-4 h-4" />
                                                )}
                                                <span>
                                                    {isRepliesExpanded ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {interaction.showReplyInput && !isEditing && (
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            value={interaction.replyContent}
                                            onChange={(e) => updateReplyContent(comment.id, e.target.value)}
                                            className="flex-1 bg-gray-50 p-1 rounded-lg border border-gray-200 text-sm"
                                            placeholder="Write a reply..."
                                        />
                                        <button
                                            onClick={() => handleReply(comment.id, setIsReplyLoading)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm"
                                        >
                                            {isReplyLoading ? (
                                                <LoaderCircleIcon className="animate-spin" />
                                            ) : (
                                                "Post"
                                            )}
                                        </button>
                                    </div>
                                )}

                                {comment.children && comment.children.length > 0 && isRepliesExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderCommentTree(comment.children, depth + 1)}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-500 text-center py-2 italic text-sm"
                    >
                        No comments yet. Be the first to share your thoughts!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="max-h-[50vh] overflow-y-auto">
            {renderCommentTree(topLevelComments)}
        </div>
    );
};


export const FullBlog = ({
    id,
    author,
    title,
    time,
    thumbnailUrl,
    subtitle,
    content,
    likes,
    dislikes,
    blogInteraction,
    comments,
    userId
}: Blog) => {
    console.log("Initial blogInteraction.isLiked:", blogInteraction?.isLiked);
    console.log(comments)


    const [comment, setComment] = useState("");
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [totalBlogLike, setTotalBlogLike] = useState(likes);
    const [totalBlogDislike, setTotalBlogDislike] = useState(dislikes);
    const [isBlogLiked, setIsBlogLiked] = useState(blogInteraction?.isLiked === true);
    const [isBlogDisliked, setIsBlogDisliked] = useState(blogInteraction?.isLiked === false);

    const [commentInteractions, setCommentInteractions] = useState(
        comments.map(c => ({
            id: c.id,
            totalCommentLikes: c.totalCommentLikes || 0,
            totalCommentDislikes: c.totalCommentDislikes || 0,
            isCommentLiked: c.interactions?.[0]?.isLiked === true,
            isCommentDisliked: c.interactions?.[0]?.isLiked === false,
            replies: c.replies || [],
            showReplyInput: false,
            replyContent: ""
        }))
    );

    const [allComments, setAllComments] = useState(comments);

    // First, remove or modify this useEffect
    // useEffect(() => {
    //     // This is causing your counts to disappear
    //     if (totalBlogLike < 0) setTotalBlogLike(0);
    //     if (totalBlogDislike < 0) setTotalBlogDislike(0);
    // }, [isBlogLiked, isBlogDisliked]);  // Missing dependencies




    console.log("Initial isLiked:", isBlogLiked, "Initial isDisliked:", isBlogDisliked);
    // Replace the handleBlogLike and handleBlogDislike functions with these fixed versions

    const handleBlogLike = async () => {
        // Store current state
        const currentLiked = isBlogLiked;
        const currentDisliked = isBlogDisliked;

        // Simple toggle logic - update state immediately
        if (currentLiked) {
            // User is unliking
            setTotalBlogLike(prev => Math.max(0, prev - 1));
            setIsBlogLiked(false);
        } else {
            // User is liking
            setTotalBlogLike(prev => prev + 1);
            setIsBlogLiked(true);

            // If they previously disliked, remove the dislike
            if (currentDisliked) {
                setTotalBlogDislike(prev => Math.max(0, prev - 1));
                setIsBlogDisliked(false);
            }
        }

        // Fire and forget the API call - no state updates from response
        try {
            axios.put(
                `${BACKEND_URL}/api/v1/blog/like`,
                { id },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            // No state updates from response
        } catch (error) {
            console.error("Like failed:", error);
            // Could add error handling here if needed
        }
    };

    const handleBlogDislike = async () => {
        // Store current state
        const currentLiked = isBlogLiked;
        const currentDisliked = isBlogDisliked;

        // Simple toggle logic - update state immediately
        if (currentDisliked) {
            // User is removing dislike
            setTotalBlogDislike(prev => Math.max(0, prev - 1));
            setIsBlogDisliked(false);
        } else {
            // User is disliking
            setTotalBlogDislike(prev => prev + 1);
            setIsBlogDisliked(true);

            // If they previously liked, remove the like
            if (currentLiked) {
                setTotalBlogLike(prev => Math.max(0, prev - 1));
                setIsBlogLiked(false);
            }
        }

        // Fire and forget the API call - no state updates from response
        try {
            axios.put(
                `${BACKEND_URL}/api/v1/blog/dislike`,
                { id },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            // No state updates from response
        } catch (error) {
            console.error("Dislike failed:", error);
            // Could add error handling here if needed
        }
    };
    const handleCommentLike = async (commentId: number) => {
        const commentIdx = commentInteractions.findIndex(c => c.id === commentId);
        const current = commentInteractions[commentIdx];
        const wasCommentLiked = current.isCommentLiked;
        const wasCommentDisliked = current.isCommentDisliked;

        const updatedInteractions = [...commentInteractions];
        if (wasCommentLiked) {
            // Ensure we don't go below 0 when decrementing
            updatedInteractions[commentIdx].totalCommentLikes = Math.max(0, current.totalCommentLikes - 1);
            updatedInteractions[commentIdx].isCommentLiked = false;
        } else {
            updatedInteractions[commentIdx].totalCommentLikes += 1;
            updatedInteractions[commentIdx].isCommentLiked = true;
            if (wasCommentDisliked) {
                updatedInteractions[commentIdx].totalCommentDislikes = Math.max(0, current.totalCommentDislikes - 1);
                updatedInteractions[commentIdx].isCommentDisliked = false;
            }
        }
        setCommentInteractions(updatedInteractions);

        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/v1/blog/comment/like`,
                { id: commentId },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            const { isLiked } = response.data;

            // Update with server response
            const serverUpdatedInteractions = [...commentInteractions];
            serverUpdatedInteractions[commentIdx].isCommentLiked = isLiked === true;
            serverUpdatedInteractions[commentIdx].isCommentDisliked = isLiked === false;

            // Ensure counts never go below 0
            serverUpdatedInteractions[commentIdx].totalCommentLikes = Math.max(0, serverUpdatedInteractions[commentIdx].totalCommentLikes);
            serverUpdatedInteractions[commentIdx].totalCommentDislikes = Math.max(0, serverUpdatedInteractions[commentIdx].totalCommentDislikes);

            setCommentInteractions(serverUpdatedInteractions);
        } catch (error) {
            console.error("Comment like failed:", error);

            // Restore previous state with safety checks
            const restoredInteractions = [...commentInteractions];
            restoredInteractions[commentIdx].isCommentLiked = wasCommentLiked;
            restoredInteractions[commentIdx].isCommentDisliked = wasCommentDisliked;

            // Restore previous counts, ensuring they don't go below 0
            restoredInteractions[commentIdx].totalCommentLikes = Math.max(0, current.totalCommentLikes);
            restoredInteractions[commentIdx].totalCommentDislikes = Math.max(0, current.totalCommentDislikes);

            setCommentInteractions(restoredInteractions);
        }
    };

    const handleCommentDislike = async (commentId: number) => {
        const commentIdx = commentInteractions.findIndex(c => c.id === commentId);
        const current = commentInteractions[commentIdx];
        const wasDisliked = current.isCommentDisliked;
        const wasLiked = current.isCommentLiked;


        const updatedInteractions = [...commentInteractions];
        if (wasDisliked) {
            // Ensure we don't go below 0 when decrementing
            updatedInteractions[commentIdx].totalCommentDislikes = Math.max(0, current.totalCommentDislikes - 1);
            updatedInteractions[commentIdx].isCommentDisliked = false;
        } else {
            updatedInteractions[commentIdx].totalCommentDislikes += 1;
            updatedInteractions[commentIdx].isCommentDisliked = true;
            if (wasLiked) {
                updatedInteractions[commentIdx].totalCommentLikes = Math.max(0, current.totalCommentLikes - 1);
                updatedInteractions[commentIdx].isCommentLiked = false;
            }
        }
        setCommentInteractions(updatedInteractions);

        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/v1/blog/comment/dislike`,
                { id: commentId },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            const { isLiked } = response.data;

            // Update with server response
            const serverUpdatedInteractions = [...commentInteractions];
            serverUpdatedInteractions[commentIdx].isCommentLiked = isLiked === true;
            serverUpdatedInteractions[commentIdx].isCommentDisliked = isLiked === false;

            // Ensure counts never go below 0
            serverUpdatedInteractions[commentIdx].totalCommentLikes = Math.max(0, serverUpdatedInteractions[commentIdx].totalCommentLikes);
            serverUpdatedInteractions[commentIdx].totalCommentDislikes = Math.max(0, serverUpdatedInteractions[commentIdx].totalCommentDislikes);

            setCommentInteractions(serverUpdatedInteractions);
        } catch (error) {
            console.error("Comment dislike failed:", error);

            // Restore previous state with safety checks
            const restoredInteractions = [...commentInteractions];
            restoredInteractions[commentIdx].isCommentLiked = wasLiked;
            restoredInteractions[commentIdx].isCommentDisliked = wasDisliked;

            // Restore previous counts, ensuring they don't go below 0
            restoredInteractions[commentIdx].totalCommentLikes = Math.max(0, current.totalCommentLikes);
            restoredInteractions[commentIdx].totalCommentDislikes = Math.max(0, current.totalCommentDislikes);

            setCommentInteractions(restoredInteractions);
        }
    };
    const handleReply = async (commentId: number, setIsReplyLoading: (arg0: boolean) => void) => {
        const commentIdx = commentInteractions.findIndex(c => c.id === commentId);
        const replyContent = commentInteractions[commentIdx].replyContent;

        try {
            setIsReplyLoading(true)
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog/comment/${id}/reply`,
                { content: replyContent, parentId: commentId },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            const newReply = response.data.newComment;
            const updatedInteractions = [...commentInteractions];
            // updatedInteractions[commentIdx].replies.push(newReply);
            setIsReplyLoading(false)
            updatedInteractions[commentIdx].replyContent = "";
            updatedInteractions[commentIdx].showReplyInput = false;
            setCommentInteractions([
                ...updatedInteractions,
                {
                    id: newReply.id,
                    totalCommentLikes: 0,
                    totalCommentDislikes: 0,
                    isCommentLiked: false,
                    isCommentDisliked: false,
                    replies: [],
                    showReplyInput: false,
                    replyContent: ""
                }
            ]);
            setAllComments(prev => [...prev, newReply]);
        } catch (error) {
            console.error("Failed to post reply:", error);
        }
    };

    const toggleReplyInput = (commentId: number) => {
        const updatedInteractions = commentInteractions.map(c =>
            c.id === commentId ? { ...c, showReplyInput: !c.showReplyInput } : c
        );
        setCommentInteractions(updatedInteractions);
    };

    const updateReplyContent = (commentId: number, value: any) => {
        const updatedInteractions = commentInteractions.map(c =>
            c.id === commentId ? { ...c, replyContent: value } : c
        );
        setCommentInteractions(updatedInteractions);
    };

    const [isCommentLoading, setIsCommentLoading] = useState(false);
    // const [isReplyLoading, setIsReplyLoading] = useState(false);


    const handleEditComment = async (id: Number, editContent: string, setIsEditCommentLoading: (arg0: boolean) => void) => {
        try {
            setIsEditCommentLoading(true)
            const response = await axios.put(
                `${BACKEND_URL}/api/v1/blog/comment/${id}`,
                { editComment: editContent },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            const newComment = response.data.comment;
            // setAllComments()
            setAllComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === id ? { ...comment, ...newComment } : comment
                )
            );
            setIsEditCommentLoading(false)

            console.log(allComments)
        } catch (error) {
            console.error("Failed to post reply:", error);
        }
    }


    const handleDeleteComment = async (id: Number, setIsDeleteCommentLoading: (arg0: boolean) => void) => {
        try {
            setIsDeleteCommentLoading(true)
            await axios.delete(
                `${BACKEND_URL}/api/v1/blog/comment/${id}`,
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            setAllComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== id)
            );
            setIsDeleteCommentLoading(false)
            console.log(allComments)
        } catch (error) {
            console.error("Failed to post reply:", error);
        }
    }
    const handleComment = async () => {
        // Check if comment is empty or only whitespace
        if (!comment || comment.trim() === "") {
            alert("Please enter a comment before posting");
            return;
        }

        try {
            // Set loading state to true
            setIsCommentLoading(true);

            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog/comment/${id}`,
                { content: comment },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );

            const newComment: blogComment = response.data.newComment;
            // newComment.createdAt = formatDate(newComment.createdAt);
            console.log(allComments)
            setAllComments(prev => [newComment, ...prev]);
            setCommentInteractions(prev => [
                ...prev,
                {
                    id: newComment.id,
                    totalCommentLikes: 0,
                    totalCommentDislikes: 0,
                    isCommentLiked: false,
                    isCommentDisliked: false,
                    replies: [],
                    showReplyInput: false,
                    replyContent: ""
                }
            ]);
            setComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            // Reset loading state regardless of success or failure
            setIsCommentLoading(false);
        }
    };


    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Function to adjust textarea height
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto';
            // Set height to match content
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Adjust height when component mounts or comment changes
    useEffect(() => {
        adjustHeight();
    }, [comment]);




    const toggleZoom = (src?: string) => {
        setZoomedImage(src ? src : null);
    };

    let readTime = Math.ceil(content.length / 500);
    let readTimeText = '';

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
            readTimeText = `${hours} hour ${minutes} min read`;
        }
    }

    return (
        <div className="w-full px-4 md:px-8 lg:px-20 pt-8 md:pt-12 mb-6"> {/* Reduced pt-16 to pt-12, mb-10 to mb-6 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4"> {/* Reduced gap-6 to gap-4 */}
                {/* Main content */}
                <div className="lg:col-span-8 w-full border-2 rounded-lg p-2 bg-slate-300 shadow-md shadow-gray-700">
                    <div className="text-3xl md:text-4xl lg:text-5xl text-slate-900 font-bold p-3">
                        {title}
                    </div>
                    <div className="px-3 pb-3">
                        <div className="text-lg md:text-xl text-slate-700 font-semibold mb-2">
                            {subtitle}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="inline-block text-slate-500 font-semibold rounded-2xl bg-white px-3 py-1 truncate max-w-full">
                                {time}
                            </div>
                            <div className="flex gap-3 items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <button
                                    onClick={handleBlogLike}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${isBlogLiked ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600 hover:bg-blue-50"}`}
                                    aria-label={isBlogLiked ? "Unlike this post" : "Like this post"}
                                >
                                    {isBlogLiked ? (
                                        <HandThumbUpSolid className="text-blue-600 transition-colors duration-200 w-6 h-6" />
                                    ) : (
                                        <HandThumbUpOutline className="text-gray-600 hover:text-blue-500 transition-colors duration-200 w-6 h-6" />
                                    )}
                                    <span className="text-sm font-semibold">{totalBlogLike}</span>
                                </button>
                                <button
                                    onClick={handleBlogDislike}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${isBlogDisliked ? "bg-red-100 text-red-600" : "bg-white text-gray-600 hover:bg-red-50"}`}
                                    aria-label={isBlogDisliked ? "Remove dislike from this post" : "Dislike this post"}
                                >
                                    {isBlogDisliked ? (
                                        <HandThumbDownSolid className="text-red-600 transition-colors duration-200 w-6 h-6" />
                                    ) : (
                                        <HandThumbDownOutline className="text-gray-600 hover:text-red-500 transition-colors duration-200 w-6 h-6" />
                                    )}
                                    <span className="text-sm font-semibold">{totalBlogDislike}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {thumbnailUrl && (
                        <div className="flex justify-center mt-2">
                            <img
                                src={thumbnailUrl}
                                className="w-full max-w-xl h-auto cursor-zoom-in rounded-lg transition-transform duration-300 ease-in-out"
                                alt="Image Couldn't Be Loaded"
                                onClick={() => toggleZoom(thumbnailUrl)}
                            />
                            {zoomedImage && (
                                <div
                                    className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 cursor-zoom-out"
                                    onClick={() => toggleZoom()}
                                >
                                    <img
                                        src={zoomedImage}
                                        alt="Zoomed"
                                        className="max-w-[90vw] max-h-[90vh] rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="bg-slate-300 text-base md:text-lg lg:text-xl rounded-3xl font-thin mt-2 p-3 w-full"> {/* Reduced text-2xl to text-xl */}
                        <HTMLRenderer content={content}></HTMLRenderer>
                    </div>
                </div>

                {/* Author and Comments section */}
                <div className="lg:col-span-4 w-full">
                    <div className="lg:sticky lg:top-4 space-y-3">
                        <Link
                            to={`/${author.details.name}/${author.details.userId}`}
                            className="block cursor-pointer transition duration-300 hover:transform hover:scale-105"
                        >
                            <div className="border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="font-semibold text-sm tracking-wide">Written By</span>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="rounded-lg overflow-hidden border-2 border-white shadow-md">
                                                <img
                                                    src={author.details.profileUrl}
                                                    alt={author.details.name}
                                                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-0.5">
                                                {author.details.name}
                                            </h3>
                                            <p className="text-gray-700 font-medium mb-1 text-sm">
                                                {author.details.company
                                                    ? `${author.details.profession} at ${author.details.company}`
                                                    : author.details.profession}
                                            </p>
                                            <div className="flex items-center text-gray-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span className="text-xs">{author.details.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-center">
                                    <span className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 text-sm flex justify-center items-center">
                                        View Full Profile
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3 inline-block ml-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                            <div className="flex items-center text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="text-sm">
                                    <span className="font-medium">Estimated Reading Time:</span>
                                    <span className="ml-1">{readTimeText}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Comments</h3>
                            <div className="flex gap-2 mb-4">
                                <textarea
                                    onChange={(e) => {
                                        setComment(e.target.value);
                                        adjustHeight();
                                    }}
                                    value={comment}
                                    ref={textareaRef}
                                    className="flex-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm block w-full resize-none overflow-hidden"
                                    placeholder="Share your thoughts..."
                                    rows={1}
                                />
                                <motion.button
                                    onClick={handleComment}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-green-500 text-white px-4 py-2 h-12 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium text-sm flex-shrink-0"
                                >
                                    {isCommentLoading ? (
                                        <div>
                                            <LoaderCircle className="animate-spin" />
                                        </div>
                                    ) : (
                                        <div>Post</div>
                                    )}
                                </motion.button>
                            </div>

                            {renderComments(allComments, commentInteractions, handleCommentLike, handleCommentDislike, toggleReplyInput, updateReplyContent, handleReply, userId, handleEditComment, handleDeleteComment)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
