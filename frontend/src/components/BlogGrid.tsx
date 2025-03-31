import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Blog } from "../hooks"; // Adjust the import based on your project structure

// BlogCard component with motion animations
function BlogCard({ post }: { post: Blog }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
        >
            <Link to={`/blog/${post.id}`} className="hover:cursor-pointer block relative">
                <motion.img
                    src={post.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={post.title}
                    className="w-full h-52 object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </Link>
            <div className="p-4">
                <h2 className="text-lg font-semibold break-words pr-2 hover:underline hover:text-blue-600 transition-colors duration-200">
                    <Link to={`/blog/${post.id}`} className="hover:cursor-pointer">
                        {post.title}
                    </Link>
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.subtitle}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{new Date(post.time || Date.now()).toLocaleDateString()}</span>
                    <span>{ "Uncategorized"}</span>
                </div>
            </div>
        </motion.div>
    );
}

// BlogGrid component to display a grid of BlogCards
export default function BlogGrid({ posts }: { posts: Blog[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
}