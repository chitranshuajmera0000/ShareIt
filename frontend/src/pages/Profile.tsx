// import React, { ChangeEvent, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import useResponsive, { Blog, useDetails, useUser } from "../hooks";
// import { Link } from "react-router-dom";
// import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
// import { MobileNavbar } from "../components/navbar/MobileNavbar";
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// // import { link } from "fs";
// import { Briefcase,  Building,  LoaderCircleIcon, MapPin, User } from "lucide-react";

// const Profile = () => {
//     const { isDesktop, isMobile, isTablet } = useResponsive();

//     const { loading, user, refetch: fetchUser } = useUser();
//     const { details, refetch: fetchDetails } = useDetails();

//     const [userData] = useState({
//         socialLinks: [
//             { platform: "Instagram", url: details.instagram, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762081/vce1ar88sheqkxy6zk6a.png" },
//             { platform: "X", url: details.x, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762069/qlxvqtpseuivmf6uhfwd.png" },
//             { platform: "LinkedIn", url: details.linkedin, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762076/c2h4ryhnkvjeuprjwlrg.png" },
//         ],
//     });
//     console.log(userData)
//     // Animation variants from Blogs/MyBlogs
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: { staggerChildren: 0.15 },
//         },
//     };

//     const itemVariants = {
//         hidden: { y: 30, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: { duration: 0.5, type: "spring", stiffness: 100 },
//         },
//     };

//     const pageTransition = {
//         initial: { opacity: 0, y: 20 },
//         animate: { opacity: 1, y: 0 },
//         transition: { duration: 0.5 },
//     };

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     })

//     // ProfileHeader Component
//     const ProfileHeader = () => {
//         const [isEditingInfo, setIsEditingInfo] = useState(false);
//         const [name, setName] = useState("");
//         const [prof, setProf] = useState("");
//         const [loc, setLoc] = useState("");
//         const [company, setCompany] = useState("");
//         const [profUrl, setProfUrl] = useState("");
//         const [insta, setInsta] = useState("");
//         const [linkedin, setLinkedin] = useState("");
//         const [x, setX] = useState("");
//         const [imagePreview, setImagePreview] = useState("");
//         const [loading, setLoading] = useState(false);
//         const [save, setSave] = useState(false);


//         useEffect(() => {
//             setName(details.name);
//             setProf(details.profession);
//             setLoc(details.location);
//             setProfUrl(details.profileUrl);
//             setCompany(details.company);
//             setImagePreview(details.profileUrl);
//             setInsta(details.instagram);
//             setLinkedin(details.linkedin);
//             setX(details.x);
//         }, [details]);

//         const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
//             if (e.target.files && e.target.files[0]) {
//                 setLoading(true);
//                 const image = new FormData();
//                 image.append("file", e.target.files[0]);
//                 image.append("upload_preset", "ShareIt");

//                 try {
//                     const response = await axios.post("https://api.cloudinary.com/v1_1/dxj9gigbq/upload", image);
//                     setImagePreview(response.data.secure_url);
//                     setProfUrl(response.data.secure_url);
//                 } catch (error) {
//                     console.error("Image upload failed:", error);
//                 } finally {
//                     setLoading(false);
//                 }
//             }
//         };

//         const onSaveInfo = async () => {
//             setSave(true)
//             const formData = { name, profession: prof, location: loc, profileUrl: profUrl, company, instagram: insta, linkedin, x };
//             try {
//                 await axios.put(`${BACKEND_URL}/api/v1/user/details/info`, formData, {
//                     headers: { Authorization: localStorage.getItem("token") },
//                 });
//                 setIsEditingInfo(false);
//                 await Promise.all([fetchDetails(), fetchUser()]);
//             } catch (e) {
//                 console.log("Failed to update profile info. Try again.");
//             }
//             setSave(false)
//         };

//         return (
//             <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
//                         Who You Are ?
//                     </h2>
//                     <motion.img
//                         whileHover={{ scale: 1.1 }}
//                         src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png"
//                         className="h-6 w-6 cursor-pointer"
//                         onClick={() => setIsEditingInfo(true)}
//                         alt="Edit"
//                     />
//                 </div>
//                 <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col items-center md:flex-row md:items-start"} gap-6 md:gap-8`}>
//                     {isEditingInfo ? (
//                         <label className="relative cursor-pointer">
//                             <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
//                             <div
//                                 className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full border flex items-center justify-center overflow-hidden bg-gray-200 relative`}
//                             >
//                                 {loading ? (
//                                     <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
//                                 ) : imagePreview ? (
//                                     <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
//                                 ) : (
//                                     <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742581064/camera_hw2a3z.png" className="h-16 w-16" />
//                                 )}
//                             </div>
//                         </label>
//                     ) : (
//                         <motion.div
//                             whileHover={{ scale: 1.05 }}
//                             className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full overflow-hidden shadow-lg`}
//                         >
//                             <img
//                                 src={details.profileUrl || "https://via.placeholder.com/150"}
//                                 alt={details.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
//                             />
//                         </motion.div>
//                     )}
//                     <div className={`flex flex-col ${isMobile ? "items-center w-full" : "items-center md:items-start"}`}>
//                         {isEditingInfo ? (
//                             <>
//                                 <div className="flex gap-2 w-full max-w-md">
//                                     <div className="mx-auto my-auto">
//                                         <User size={isMobile ? 24 : 32}></User>
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={name}
//                                         placeholder="Name"
//                                         onChange={(e) => setName(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full max-w-md mt-2">
//                                     <div className="mx-auto my-auto">
//                                         <Briefcase size={isMobile ? 24 : 32}></Briefcase>
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={prof}
//                                         placeholder="Profession"
//                                         onChange={(e) => setProf(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full max-w-md mt-2">
//                                     <div className="mx-auto my-auto">
//                                         <Building size={isMobile ? 24 : 32}></Building>
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={company}
//                                         placeholder="Institute / Company"
//                                         onChange={(e) => setCompany(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full max-w-md mt-2">
//                                     <div className="mx-auto my-auto">
//                                         <MapPin size={isMobile ? 24 : 32}></MapPin>
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={loc}
//                                         placeholder="Location"
//                                         onChange={(e) => setLoc(e.target.value)}
//                                     />
//                                 </div>
//                                 {/* Social Media Inputs */}
//                                 <div className="flex gap-2 w-full max-w-md mt-2 items-center">
//                                     <div className="mx-auto">
//                                         <img src={userData.socialLinks[0].icon} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={insta}
//                                         placeholder="Instagram"
//                                         onChange={(e) => setInsta(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full max-w-md mt-2 items-center">
//                                     <div className="mx-auto">
//                                         <img src={userData.socialLinks[1].icon} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={x}
//                                         placeholder="X"
//                                         onChange={(e) => setX(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="flex gap-2 w-full max-w-md mt-2 items-center">
//                                     <div className="mx-auto">
//                                         <img src={userData.socialLinks[2].icon} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"}`} />
//                                     </div>
//                                     <input
//                                         className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                                         value={linkedin}
//                                         placeholder="Linkedin"
//                                         onChange={(e) => setLinkedin(e.target.value)}
//                                     />
//                                 </div>
//                                 <motion.button
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                     className={`mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full max-w-md" : "w-auto"}`}
//                                     onClick={onSaveInfo}
//                                 >
//                                     {
//                                         save ? <div className="flex gap-2 justify-center">
//                                             <LoaderCircleIcon className="animate-spin"></LoaderCircleIcon>
//                                             <>Saving...</>
//                                         </div> : <>Save</>
//                                     }
//                                 </motion.button>
//                             </>
//                         ) : (
//                             <>
//                                 <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-800`}>{details.name}</h1>
//                                 <p className={`${isMobile ? "text-lg" : "text-xl"} text-gray-600 mt-2`}>
//                                     {details.company ? `${details.profession} at ${details.company}` : details.profession}
//                                 </p>
//                                 <div className="flex items-center mt-2 text-gray-600">
//                                     <svg className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     </svg>
//                                     {details.location}
//                                 </div>
//                                 <div className={`flex gap-4 mt-4 ${isMobile ? "justify-center" : ""}`}>
//                                     {userData.socialLinks.map((link) => (
//                                         <motion.a
//                                             key={link.platform}
//                                             href={link.url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             whileHover={{ scale: 1.1 }}
//                                             className="text-gray-600 hover:text-indigo-600 transition-colors"
//                                         >
//                                             <img src={link.icon} alt={link.platform} className={`${isMobile ? "w-6 h-6" : "w-10 h-10"}`} />
//                                         </motion.a>
//                                     ))}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </motion.div>
//         );
//     };

//     // PersonalSummary Component
//     const PersonalSummary = () => {
//         const [isEditingAbout, setIsEditingAbout] = useState(false);
//         const [aboutText, setAboutText] = useState("");
//         const [save, setSave] = useState(false)

//         useEffect(() => {
//             setAboutText(details.about);
//         }, [details]);

//         const onSaveAbout = async (text: string) => {
//             setSave(true)
//             try {

//                 await axios.put(
//                     `${BACKEND_URL}/api/v1/user/details/about`,
//                     { about: text },
//                     { headers: { Authorization: localStorage.getItem("token") } }
//                 );
//                 setIsEditingAbout(false);
//                 await fetchDetails();
//             } catch (error) {
//                 console.log("Failed to update about section. Try again.");
//             }
//             setSave(false)
//         };

//         return (
//             <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
//                         Tell the World About Yourself
//                     </h2>
//                     <motion.img
//                         whileHover={{ scale: 1.1 }}
//                         src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png"
//                         className="h-6 w-6 cursor-pointer"
//                         onClick={() => setIsEditingAbout(true)}
//                         alt="Edit"
//                     />
//                 </div>
//                 {isEditingAbout ? (
//                     <div>
//                         <textarea
//                             className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-200"
//                             value={aboutText}
//                             onChange={(e) => setAboutText(e.target.value)}
//                             rows={isMobile ? 5 : 3}
//                         />
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className={`mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full" : ""}`}
//                             onClick={() => onSaveAbout(aboutText)}
//                         >
//                             {
//                                 save ? <div className="flex gap-2 justify-center">
//                                     <LoaderCircleIcon className="animate-spin"></LoaderCircleIcon>
//                                     <>Saving...</>
//                                 </div> : <>Save</>
//                             }
//                         </motion.button>
//                     </div>
//                 ) : (
//                     <p className="text-gray-600 leading-relaxed">{aboutText || "Tell us about yourself!"}</p>
//                 )}
//             </motion.div>
//         );
//     };

//     // BlogPostCard Component
//     const BlogPostCard: React.FC<{ post: Blog }> = ({ post }) => (
//         <motion.div variants={itemVariants} whileHover={{ scale: 1.03, y: -5 }}>
//             <Link to={`/blog/${post.id}`}>
//                 <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full">
//                     <div className="relative overflow-hidden group">
//                         <motion.div
//                             whileHover={{ scale: 1.1 }}
//                             transition={{ duration: 0.6 }}
//                             className={`w-full ${isMobile ? "h-36" : "h-48"} bg-gradient-to-b from-gray-200 to-gray-300`}
//                         >
//                             <img
//                                 src={post.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
//                                 alt={post.title}
//                                 className="w-full h-full object-cover"
//                             />
//                         </motion.div>
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     </div>
//                     <div className="p-5 flex-grow">
//                         <h3 className={`${isMobile ? "text-base" : "text-lg"} font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors`}>
//                             {post.title}
//                         </h3>
//                     </div>
//                     <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
//                         <div className="text-gray-500 text-sm flex items-center">
//                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             {post.time || "Date not available"}
//                         </div>
//                     </div>
//                 </div>
//             </Link>
//         </motion.div>
//     );

//     // BlogPostGrid Component
//     const BlogPostGrid: React.FC<{ blogPosts: Blog[] }> = ({ blogPosts }) => (
//         <motion.div variants={itemVariants} className="mt-8">
//             <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6">
//                 Fresh Off Your Keyboard
//             </h2>
//             {blogPosts.length ? (
//                 <motion.div
//                     variants={containerVariants}
//                     initial="hidden"
//                     animate="visible"
//                     className={`grid grid-cols-1 ${isMobile ? "gap-4" : isTablet ? "md:grid-cols-2 gap-6" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}
//                 >
//                     {blogPosts.map((post) => (
//                         <BlogPostCard key={post.id} post={post} />
//                     ))}
//                 </motion.div>
//             ) : (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="bg-white rounded-xl shadow-lg p-6 text-center"
//                 >
//                     <p className="text-gray-600">No Blogs Posted</p>
//                 </motion.div>
//             )}
//         </motion.div>
//     );

//     // Unified Navbar rendering
//     const renderNavbar = () => (
//         <div className={isMobile ? "p-2" : ""}>
//             {isDesktop ? <DesktopNavbar hide="invisible" /> : <MobileNavbar hide="invisible" />}
//         </div>
//     );

//     // Updated ThemedSkeleton
//     const ThemedSkeleton = () => (
//         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
//             {/* Navbar */}
//             {renderNavbar()}

//             {/* Header Section */}
//             <div className="relative overflow-hidden mb-8">
//                 <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
//                 <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
//                 <div className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10">
//                     <div className="h-10 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mx-auto mb-3"></div>
//                     <div className="h-4 w-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse mx-auto"></div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="container mx-auto px-4 relative z-10">
//                 {/* Profile Header Skeleton */}
//                 <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
//                     <div className="flex justify-between items-center mb-4">
//                         <div className="h-8 w-40 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
//                         <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
//                     </div>
//                     <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col items-center md:flex-row"} gap-6 md:gap-8`}>
//                         <div className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
//                         <div className={`flex flex-col ${isMobile ? "items-center w-full" : "items-center md:items-start"} space-y-3`}>
//                             <div className={`${isMobile ? "h-6 w-48" : "h-8 w-64"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
//                             <div className={`${isMobile ? "h-5 w-36" : "h-6 w-48"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
//                             <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
//                             <div className="flex gap-4 mt-2">
//                                 {[...Array(3)].map((_, i) => (
//                                     <div key={i} className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Personal Summary Skeleton */}
//                 <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
//                     <div className="flex justify-between items-center mb-4">
//                         <div className="h-8 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
//                         <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
//                     </div>
//                     <div className="space-y-3">
//                         <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
//                         <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
//                         <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
//                     </div>
//                 </div>

//                 {/* Blog Post Grid Skeleton */}
//                 <div className="mt-8">
//                     <div className="h-8 w-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mb-6"></div>
//                     <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : isTablet ? "md:grid-cols-2 gap-6" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}>
//                         {[...Array(3)].map((_, index) => (
//                             <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
//                                 <div className={`w-full ${isMobile ? "h-36" : "h-48"} bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
//                                 <div className="p-5 space-y-3">
//                                     <div className={`${isMobile ? "h-5 w-3/4" : "h-6 w-2/3"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
//                                 </div>
//                                 <div className="px-5 py-4 border-t border-gray-100">
//                                     <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-16 relative">
//                 <div className="w-full h-24 bg-indigo-600/10"></div>
//                 <div className="absolute bottom-0 left-0 w-full overflow-hidden">
//                     <svg className="relative block w-full h-10 text-indigo-600/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
//                         <path
//                             d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
//                             fill="currentColor"
//                         ></path>
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );

//     if (loading) {
//         return <ThemedSkeleton />;
//     }

//     return (
//         <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
//             {renderNavbar()}
//             <div className="relative overflow-hidden mb-8">
//                 <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
//                 <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7 }}
//                     className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10"
//                 >
//                     <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-3">
//                         Your Creative Hub
//                     </h1>
//                     <p className="text-indigo-800/70 max-w-2xl mx-auto">Customize, Create, and Connect</p>
//                 </motion.div>
//             </div>
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="container mx-auto px-4 relative z-10"
//             >
//                 <ProfileHeader />
//                 <PersonalSummary />
//                 <BlogPostGrid blogPosts={user.posts} />
//             </motion.div>
//             <div className="mt-16 relative">
//                 <div className="w-full h-24 bg-indigo-600/10"></div>
//                 <div className="absolute bottom-0 left-0 w-full overflow-hidden">
//                     <svg className="relative block w-full h-10 text-indigo-600/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
//                         <path
//                             d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
//                             fill="currentColor"
//                         ></path>
//                     </svg>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default Profile;

























































import React, { ChangeEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useResponsive, { Blog, useDetails, useUser } from "../hooks";
import { Link } from "react-router-dom";
import { DesktopNavbar } from "../components/navbar/DesktopNavbar";
import { MobileNavbar } from "../components/navbar/MobileNavbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Briefcase, Building, LoaderCircleIcon, MapPin, User, Trash2, AlertCircle } from "lucide-react";

// Cloudinary cloud name (replace with your actual Cloudinary cloud name)
const CLOUD_NAME = "dxj9gigbq"; // Update with your Cloudinary cloud name
const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150"; // Default placeholder image

const Profile = () => {
    const { isDesktop, isMobile, isTablet } = useResponsive();
    const { loading, user, refetch: fetchUser } = useUser();
    const { details, refetch: fetchDetails } = useDetails();

    const [userData] = useState({
        socialLinks: [
            { platform: "Instagram", url: details.instagram, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762081/vce1ar88sheqkxy6zk6a.png" },
            { platform: "X", url: details.x, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762069/qlxvqtpseuivmf6uhfwd.png" },
            { platform: "LinkedIn", url: details.linkedin, icon: "https://res.cloudinary.com/dxj9gigbq/image/upload/v1742762076/c2h4ryhnkvjeuprjwlrg.png" },
        ],
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
    };

    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ProfileHeader Component
    const ProfileHeader = () => {
        const [isEditingInfo, setIsEditingInfo] = useState(false);
        const [name, setName] = useState("");
        const [prof, setProf] = useState("");
        const [loc, setLoc] = useState("");
        const [company, setCompany] = useState("");
        const [profUrl, setProfUrl] = useState("");
        const [insta, setInsta] = useState("");
        const [linkedin, setLinkedin] = useState("");
        const [x, setX] = useState("");
        const [imagePreview, setImagePreview] = useState("");
        const [deleteToken, setDeleteToken] = useState(""); // Store Cloudinary delete token
        const [loading, setLoading] = useState(false);
        const [save, setSave] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For delete confirmation dialog

        useEffect(() => {
            setName(details.name || "");
            setProf(details.profession || "");
            setLoc(details.location || "");
            setProfUrl(details.profileUrl || "");
            setCompany(details.company || "");
            setImagePreview(details.profileUrl || "");
            setInsta(details.instagram || "");
            setLinkedin(details.linkedin || "");
            setX(details.x || "");
        }, [details]);

        const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                setLoading(true);
                const image = new FormData();
                image.append("file", e.target.files[0]);
                image.append("upload_preset", "ShareIt");

                try {
                    const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, image);
                    setImagePreview(response.data.secure_url);
                    setProfUrl(response.data.secure_url);
                    setDeleteToken(response.data.delete_token || ""); // Store delete token if provided
                } catch (error) {
                    console.error("Image upload failed:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const handleDeleteImage = async () => {
            if (deleteToken) {
                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`,
                        { token: deleteToken },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    console.log("Delete response:", response.data);
                    setDeleteToken("");
                } catch (error: any) {
                    console.error("Error deleting image:", error.response?.data || error.message);
                }
            }

            // Update backend to clear profileUrl
            try {
                const formData = { name, profession: prof, location: loc, profileUrl: "", company, instagram: insta, linkedin, x };
                await axios.put(
                    `${BACKEND_URL}/api/v1/user/details/info`,
                    formData,
                    { headers: { Authorization: localStorage.getItem("token") } }
                );
                setImagePreview("");
                setProfUrl("");
                await Promise.all([fetchDetails(), fetchUser()]);
            } catch (error) {
                console.error("Failed to update profile image URL:", error);
            }
            setShowDeleteConfirm(false);
        };

        const onSaveInfo = async () => {
            setSave(true);
            const formData = { name, profession: prof, location: loc, profileUrl: profUrl, company, instagram: insta, linkedin, x };
            try {
                await axios.put(`${BACKEND_URL}/api/v1/user/details/info`, formData, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setIsEditingInfo(false);
                await Promise.all([fetchDetails(), fetchUser()]);
            } catch (e) {
                console.error("Failed to update profile info. Try again.");
            }
            setSave(false);
        };

        return (
            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                        Who You Are?
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                        onClick={() => setIsEditingInfo(true)}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png" className="h-5 w-5" alt="Edit" />
                    </motion.button>
                </div>
                <div className={`flex ${isMobile ? "flex-col items-center" : "flex-col items-center md:flex-row md:items-start"} gap-6 md:gap-8`}>
                    <div className="relative">
                        {isEditingInfo ? (
                            <div className="flex flex-col items-center gap-2">
                                <label className="relative cursor-pointer">
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    <div
                                        className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full border-2 border-indigo-200 flex items-center justify-center overflow-hidden bg-gray-100 shadow-md`}
                                    >
                                        {loading ? (
                                            <LoaderCircleIcon className="w-12 h-12 text-indigo-500 animate-spin" />
                                        ) : imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742581064/camera_hw2a3z.png" className="h-16 w-16 opacity-50" />
                                        )}
                                    </div>
                                </label>
                                {imagePreview && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <Trash2 size={16} />
                                        Remove Image
                                    </motion.button>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`${isMobile ? "w-32 h-32" : "w-40 h-40"} rounded-full overflow-hidden border-2 border-indigo-200 shadow-md`}
                            >
                                <img
                                    src={details.profileUrl || DEFAULT_PROFILE_IMAGE}
                                    alt={details.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = DEFAULT_PROFILE_IMAGE)}
                                />
                            </motion.div>
                        )}
                    </div>
                    <div className={`flex flex-col ${isMobile ? "items-center w-full" : "items-center md:items-start"} gap-4`}>
                        {isEditingInfo ? (
                            <>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <User size={isMobile ? 24 : 28} className="text-indigo-500" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={name}
                                        placeholder="Name"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <Briefcase size={isMobile ? 24 : 28} className="text-indigo-500" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={prof}
                                        placeholder="Profession"
                                        onChange={(e) => setProf(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <Building size={isMobile ? 24 : 28} className="text-indigo-500" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={company}
                                        placeholder="Institute / Company"
                                        onChange={(e) => setCompany(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <MapPin size={isMobile ? 24 : 28} className="text-indigo-500" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={loc}
                                        placeholder="Location"
                                        onChange={(e) => setLoc(e.target.value)}
                                    />
                                </div>
                                {/* Social Media Inputs */}
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <img src={userData.socialLinks[0].icon} className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} alt="Instagram" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={insta}
                                        placeholder="Instagram URL"
                                        onChange={(e) => setInsta(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <img src={userData.socialLinks[1].icon} className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} alt="X" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={x}
                                        placeholder="X URL"
                                        onChange={(e) => setX(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 w-full max-w-md items-center">
                                    <img src={userData.socialLinks[2].icon} className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} alt="LinkedIn" />
                                    <input
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        value={linkedin}
                                        placeholder="LinkedIn URL"
                                        onChange={(e) => setLinkedin(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full max-w-md" : "w-auto"} flex items-center justify-center gap-2`}
                                        onClick={onSaveInfo}
                                        disabled={save}
                                    >
                                        {save ? (
                                            <>
                                                <LoaderCircleIcon className="animate-spin" size={20} />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`bg-gray-200 text-gray-700 py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full max-w-md" : "w-auto"}`}
                                        onClick={() => setIsEditingInfo(false)}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-800`}>{details.name || "Your Name"}</h1>
                                <p className={`${isMobile ? "text-lg" : "text-xl"} text-gray-600 mt-2`}>
                                    {details.company ? `${details.profession} at ${details.company}` : details.profession || "Your Profession"}
                                </p>
                                <div className="flex items-center mt-2 text-gray-600">
                                    <MapPin size={isMobile ? 16 : 20} className="mr-1" />
                                    {details.location || "Your Location"}
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
                            </>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle size={24} className="text-red-500" />
                                    <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
                                </div>
                                <p className="text-gray-600 mb-6">Are you sure you want to remove your profile image? This action cannot be undone.</p>
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        onClick={handleDeleteImage}
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

    // PersonalSummary Component (unchanged for brevity)
    const PersonalSummary = () => {
        const [isEditingAbout, setIsEditingAbout] = useState(false);
        const [aboutText, setAboutText] = useState("");
        const [save, setSave] = useState(false);

        useEffect(() => {
            setAboutText(details.about || "");
        }, [details]);

        const onSaveAbout = async (text: string) => {
            setSave(true);
            try {
                await axios.put(
                    `${BACKEND_URL}/api/v1/user/details/about`,
                    { about: text },
                    { headers: { Authorization: localStorage.getItem("token") } }
                );
                setIsEditingAbout(false);
                await fetchDetails();
            } catch (error) {
                console.error("Failed to update about section. Try again.");
            }
            setSave(false);
        };

        return (
            <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                        Tell the World About Yourself
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                        onClick={() => setIsEditingAbout(true)}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/edit_yck5vm.png" className="h-5 w-5" alt="Edit" />
                    </motion.button>
                </div>
                {isEditingAbout ? (
                    <div className="flex flex-col gap-4">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 resize-none"
                            value={aboutText}
                            onChange={(e) => setAboutText(e.target.value)}
                            rows={isMobile ? 5 : 3}
                            placeholder="Tell us about yourself..."
                        />
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full" : "w-auto"}`}
                                onClick={() => onSaveAbout(aboutText)}
                                disabled={save}
                            >
                                {save ? (
                                    <>
                                        <LoaderCircleIcon className="animate-spin" size={20} />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-gray-200 text-gray-700 py-2 px-6 rounded-md shadow-md hover:shadow-lg ${isMobile ? "w-full" : "w-auto"}`}
                                onClick={() => setIsEditingAbout(false)}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 leading-relaxed">{aboutText || "Tell us about yourself!"}</p>
                )}
            </motion.div>
        );
    };

    // BlogPostCard Component (unchanged)
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
                    </div>
                    <div className="p-5 flex-grow">
                        <h3 className={`${isMobile ? "text-base" : "text-lg"} font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors`}>
                            {post.title}
                        </h3>
                    </div>
                    <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="text-gray-500 text-sm flex items-center">
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

    // BlogPostGrid Component (unchanged)
    const BlogPostGrid: React.FC<{ blogPosts: Blog[] }> = ({ blogPosts }) => (
        <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6">
                Fresh Off Your Keyboard
            </h2>
            {blogPosts.length ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-1 ${isMobile ? "gap-4" : isTablet ? "md:grid-cols-2 gap-6" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}
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

    // ThemedSkeleton (unchanged)
    const ThemedSkeleton = () => (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-2">
            {renderNavbar()}
            <div className="relative overflow-hidden mb-8">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 pt-12 pb-6 text-center relative z-10">
                    <div className="h-10 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mx-auto mb-3"></div>
                    <div className="h-4 w-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse mx-auto"></div>
                </div>
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-8 w-40 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
                        <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                    </div>
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
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-8 w-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
                        <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="h-8 w-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse mb-6"></div>
                    <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : isTablet ? "md:grid-cols-2 gap-6" : "md:grid-cols-2 lg:grid-cols-3 gap-8"}`}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className={`w-full ${isMobile ? "h-36" : "h-48"} bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse`}></div>
                                <div className="p-5 space-y-3">
                                    <div className={`${isMobile ? "h-5 w-3/4" : "h-6 w-2/3"} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse`}></div>
                                </div>
                                <div className="px-5 py-4 border-t border-gray-100">
                                    <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
                        Your Creative Hub
                    </h1>
                    <p className="text-indigo-800/70 max-w-2xl mx-auto">Customize, Create, and Connect</p>
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
                <BlogPostGrid blogPosts={user.posts} />
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

export default Profile;