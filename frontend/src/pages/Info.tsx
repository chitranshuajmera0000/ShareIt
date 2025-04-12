import { ChangeEvent, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, CLOUD_NAME, UPLOAD_PRESET } from "../config";

export default function Info() {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
        // Fade-in animation on mount
        const container = document.getElementById('info-container');
        if (container) {
            container.classList.add('opacity-100');
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [profession, setProfession] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [x, setX] = useState("");
    const [image, setImage] = useState<string>("");
    const [about, setAbout] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"error" | "success">("error");
    const [isLoading, setIsLoading] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [formProgress, setFormProgress] = useState(0);
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Calculate form completion progress
    useEffect(() => {
        let completedFields = 0;
        const totalRequiredFields = 4; // name, profession, location, about
        if (name) completedFields++;
        if (profession) completedFields++;
        if (location) completedFields++;
        if (about) completedFields++;

        setFormProgress((completedFields / totalRequiredFields) * 100);
    }, [name, profession, location, about]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLoading(true);

            // File size validation
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setAlertMessage("Image size must be less than 5MB");
                setAlertType("error");
                setShowAlert(true);
                setLoading(false);
                return;
            }

            const image = new FormData();
            image.append('file', file);
            image.append('upload_preset', `${UPLOAD_PRESET}`);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
                    image
                );
                setImagePreview(response.data.secure_url);
                setImage(response.data.secure_url);

                // Show success message
                setAlertMessage("Image uploaded successfully!");
                setAlertType("success");
                setShowAlert(true);

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
            } catch (error) {
                setAlertMessage("Failed to upload image. Please try again.");
                setAlertType("error");
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        } else {
            setImage("https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png");
        }
    };

    const handleSubmit = async () => {
        if (name === "" || profession === "" || location === "" || about === "") {
            const missingFields = [];
            if (name === "") missingFields.push("Name");
            if (profession === "") missingFields.push("Profession");
            if (location === "") missingFields.push("Location");
            if (about === "") missingFields.push("About");

            if (missingFields.length > 2) {
                let message = "";
                for (let i = 0; i < missingFields.length - 1; i++) {
                    message = message + missingFields[i] + ", ";
                }
                message = message.substring(0, message.length - 2);
                message = message + " and " + missingFields[missingFields.length - 1];
                setAlertMessage(`Please enter ${message}`);
                setAlertType("error");
                setShowAlert(true);
            } else {
                setAlertMessage(`Please enter ${missingFields.join(" and ")}`);
                setAlertType("error");
                setShowAlert(true);
            }

            // Auto-scroll to first empty required field
            const firstMissingField = missingFields[0].toLowerCase();
            const element = document.querySelector(`[name="${firstMissingField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return;
        }

        setIsLoading(true);
        try {
            // Use default profile image if none was selected
            const profileUrl = image || "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png";

            await axios.post(
                `${BACKEND_URL}/api/v1/user/details`,
                { name, profession, profileUrl, about, location, company ,instagram, linkedin ,x },
                { headers: { Authorization: `${localStorage.getItem("token")}` } }
            );

            // Show success animation before navigating
            setAlertMessage("Profile updated successfully! Redirecting...");
            setAlertType("success");
            setShowAlert(true);

            setTimeout(() => {
                navigate(`/blogs`);
            }, 1500);
        } catch (error) {
            setAlertMessage("You are not authorized to visit this page.");
            setAlertType("error");
            setShowAlert(true);
            setTimeout(() => {
                navigate('/blogs');
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-full min-h-screen py-10 px-4 flex justify-center items-center">
            <div
                id="info-container"
                className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-2xl shadow-xl transition-all duration-700 opacity-0 transform hover:shadow-2xl border border-indigo-100"
            >
                <div className="w-full h-3 bg-gray-100 rounded-t-2xl overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 ease-out"
                        style={{ width: `${formProgress}%` }}
                    ></div>
                </div>

                <div className="p-8 md:p-10">
                    <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                        Complete Your Profile
                    </h2>

                    {showAlert && (
                        <div
                            className={`p-4 mb-6 rounded-xl text-center text-white font-medium animate-pulse ${alertType === "error" ? "bg-red-500" : "bg-green-500"
                                } shadow-md`}
                        >
                            {alertMessage}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="flex justify-center mb-8">
                            <label
                                className="relative cursor-pointer"
                                onMouseEnter={() => setIsImageHovered(true)}
                                onMouseLeave={() => setIsImageHovered(false)}
                            >
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-indigo-100 flex items-center justify-center overflow-hidden bg-gray-50 relative transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
                                    {loading ? (
                                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    ) : imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={64} className="text-indigo-300" />
                                    )}

                                    <div
                                        className={`absolute inset-0 bg-indigo-600 bg-opacity-70 flex items-center justify-center transition-opacity duration-300 ${isImageHovered ? "opacity-100" : "opacity-0"
                                            }`}
                                    >
                                        <span className="text-white font-medium">Change Photo</span>
                                    </div>
                                </div>
                                <div className="flex justify-center pt-3 text-indigo-600 font-medium">
                                    Profile Photo
                                </div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    Profession <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="profession"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="Software Engineer, Designer, etc."
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="Company name (optional)"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="City, Country"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    Instagram 
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="instagram.com/@your_instagram_profile"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    LinkedIn 
                                </label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="linkedin.com/@your_linkedin_profile"
                                    required
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                    X 
                                </label>
                                <input
                                    type="text"
                                    name="x"
                                    value={x}
                                    onChange={(e) => setX(e.target.value)}
                                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                    placeholder="x.com/@your_x_profile"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="block text-sm font-medium text-gray-700 group-focus-within:text-indigo-600 transition-colors">
                                About <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="about"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full p-4 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-sm"
                                rows={4}
                                placeholder="Tell us about yourself..."
                                required
                            ></textarea>
                            <div className="text-xs text-right text-gray-500 mt-1">
                                {about.length} characters
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70 transform hover:-translate-y-1"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Save Profile"
                                )}
                            </button>
                            <div className="mt-4 text-center text-xs text-gray-500">
                                All fields marked with <span className="text-red-500">*</span> are required
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}













// import { ChangeEvent, useEffect, useState } from "react";
// import { Camera, CheckCircle, Upload, MapPin, Briefcase, User } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { BACKEND_URL } from "../config";

// export default function Info() {
//     useEffect(() => {
//         // Scroll to the top of the page when the component mounts
//         window.scrollTo(0, 0);
//         // Fade-in animation on mount
//         const container = document.getElementById('info-container');
//         if (container) {
//             container.classList.add('opacity-100', 'translate-y-0');
//         }
        
//         // Staggered animation for form fields
//         const formElements = document.querySelectorAll('.form-field');
//         formElements.forEach((el, index) => {
//             setTimeout(() => {
//                 el.classList.remove('opacity-0', 'translate-y-4');
//                 el.classList.add('opacity-100', 'translate-y-0');
//             }, 100 * (index + 1));
//         });
//     }, []);

//     const [loading, setLoading] = useState(false);
//     const [name, setName] = useState("");
//     const [profession, setProfession] = useState("");
//     const [company, setCompany] = useState("");
//     const [location, setLocation] = useState("");
//     const [image, setImage] = useState<string>("");
//     const [about, setAbout] = useState("");
//     const [showAlert, setShowAlert] = useState(false);
//     const [alertMessage, setAlertMessage] = useState("");
//     const [alertType, setAlertType] = useState<"error" | "success">("error");
//     const [isLoading, setIsLoading] = useState(false);
//     const [isImageHovered, setIsImageHovered] = useState(false);
//     const [formProgress, setFormProgress] = useState(0);
//     const navigate = useNavigate();
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [shake, setShake] = useState(false);
//     const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
//     const [showRedirectMessage, setShowRedirectMessage] = useState(false);

//     // Calculate form completion progress
//     useEffect(() => {
//         let completedFields = 0;
//         const totalRequiredFields = 4; // name, profession, location, about
//         if (name) completedFields++;
//         if (profession) completedFields++;
//         if (location) completedFields++;
//         if (about) completedFields++;

//         // Animate progress change
//         const newProgress = (completedFields / totalRequiredFields) * 100;
//         setFormProgress(newProgress);
        
//         // Show success animation when form is complete
//         if (newProgress === 100 && completedFields === totalRequiredFields) {
//             const completeCheckmark = document.getElementById('complete-checkmark');
//             if (completeCheckmark) {
//                 completeCheckmark.classList.remove('opacity-0', 'scale-0');
//                 completeCheckmark.classList.add('opacity-100', 'scale-100');
//             }
//         }
//     }, [name, profession, location, about]);

//     // Handle countdown for redirect
//     useEffect(() => {
//         if (redirectCountdown !== null && redirectCountdown > 0) {
//             const timer = setTimeout(() => {
//                 setRedirectCountdown(redirectCountdown - 1);
//                 setAlertMessage(`You are not authorized to visit this page. Redirecting in ${redirectCountdown} seconds...`);
//             }, 1000);
//             return () => clearTimeout(timer);
//         } else if (redirectCountdown === 0) {
//             navigate('/blogs');
//         }
//     }, [redirectCountdown, navigate]);

//     const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setLoading(true);

//             // File size validation
//             const file = e.target.files[0];
//             if (file.size > 5 * 1024 * 1024) { // 5MB limit
//                 setAlertMessage("Image size must be less than 5MB");
//                 setAlertType("error");
//                 setShowAlert(true);
//                 setLoading(false);
//                 setShake(true);
//                 setTimeout(() => setShake(false), 820);
//                 return;
//             }

//             const image = new FormData();
//             image.append('file', file);
//             image.append('upload_preset', 'blogify');

//             try {
//                 const response = await axios.post(
//                     "https://api.cloudinary.com/v1_1/dxj9gigbq/upload",
//                     image
//                 );
//                 setImagePreview(response.data.secure_url);
//                 setImage(response.data.secure_url);

//                 // Show success message
//                 setAlertMessage("Image uploaded successfully!");
//                 setAlertType("success");
//                 setShowAlert(true);

//                 // Hide success message after 3 seconds
//                 setTimeout(() => {
//                     setShowAlert(false);
//                 }, 3000);
//             } catch (error) {
//                 setAlertMessage("Failed to upload image. Please try again.");
//                 setAlertType("error");
//                 setShowAlert(true);
//                 setShake(true);
//                 setTimeout(() => setShake(false), 820);
//             } finally {
//                 setLoading(false);
//             }
//         } else {
//             setImage("https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png");
//         }
//     };

//     const handleSubmit = async () => {
//         if (name === "" || profession === "" || location === "" || about === "") {
//             const missingFields = [];
//             if (name === "") missingFields.push("Name");
//             if (profession === "") missingFields.push("Profession");
//             if (location === "") missingFields.push("Location");
//             if (about === "") missingFields.push("About");

//             if (missingFields.length > 2) {
//                 let message = "";
//                 for (let i = 0; i < missingFields.length - 1; i++) {
//                     message = message + missingFields[i] + ", ";
//                 }
//                 message = message.substring(0, message.length - 2);
//                 message = message + " and " + missingFields[missingFields.length - 1];
//                 setAlertMessage(`Please enter ${message}`);
//                 setAlertType("error");
//                 setShowAlert(true);
//             } else {
//                 setAlertMessage(`Please enter ${missingFields.join(" and ")}`);
//                 setAlertType("error");
//                 setShowAlert(true);
//             }

//             // Shake animation for validation error
//             setShake(true);
//             setTimeout(() => setShake(false), 820);

//             // Auto-scroll to first empty required field
//             const firstMissingField = missingFields[0].toLowerCase();
//             const element = document.querySelector(`[name="${firstMissingField}"]`);
//             if (element) {
//                 element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
//                 // Highlight the field
//                 element.classList.add('ring-2', 'ring-red-400');
//                 setTimeout(() => {
//                     element.classList.remove('ring-2', 'ring-red-400');
//                 }, 2000);
//             }

//             return;
//         }

//         setIsLoading(true);
//         try {
//             // Use default profile image if none was selected
//             const profileUrl = image || "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png";

//             await axios.post(
//                 `${BACKEND_URL}/api/v1/user/details`,
//                 { name, profession, profileUrl, about, location, company },
//                 { headers: { Authorization: `${localStorage.getItem("token")}` } }
//             );

//             // Show success animation before navigating
//             setAlertMessage("Profile updated successfully! Redirecting...");
//             setAlertType("success");
//             setShowAlert(true);
//             setShowRedirectMessage(true);

//             // Add confetti effect on successful submission
//             createConfetti();

//             setTimeout(() => {
//                 navigate(`/blogs`);
//             }, 2000);
//         } catch (error) {
//             setAlertMessage("You are not authorized to visit this page. Redirecting in 10 seconds...");
//             setAlertType("error");
//             setShowAlert(true);
//             setShowRedirectMessage(true);
//             setShake(true);
//             setTimeout(() => setShake(false), 820);
            
//             // Start countdown from 10 seconds
//             setRedirectCountdown(10);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Function to create confetti effect
//     const createConfetti = () => {
//         const confettiContainer = document.createElement('div');
//         confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
//         document.body.appendChild(confettiContainer);
        
//         const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];
        
//         for (let i = 0; i < 100; i++) {
//             const confetti = document.createElement('div');
//             const color = colors[Math.floor(Math.random() * colors.length)];
            
//             confetti.className = 'absolute animate-confetti-fall';
//             confetti.style.backgroundColor = color;
//             confetti.style.width = `${Math.random() * 10 + 5}px`;
//             confetti.style.height = `${Math.random() * 10 + 5}px`;
//             confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '0'}`;
//             confetti.style.left = `${Math.random() * 100}vw`;
//             confetti.style.top = `-20px`;
//             confetti.style.opacity = `${Math.random() * 0.8 + 0.2}`;
            
//             confettiContainer.appendChild(confetti);
            
//             // Remove confetti after animation
//             setTimeout(() => {
//                 if (confetti.parentNode) {
//                     confetti.parentNode.removeChild(confetti);
//                 }
                
//                 // Remove the container when all confetti are gone
//                 if (confettiContainer.children.length === 0 && confettiContainer.parentNode) {
//                     document.body.removeChild(confettiContainer);
//                 }
//             }, 4000);
//         }
//     };

//     // If showing redirect message due to unauthorized access,
//     // keep the form visible to prevent blank screen
//     const shouldShowForm = true;

//     return (
//         <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 w-full min-h-screen py-10 flex justify-center p-2 items-center">
//             {shouldShowForm && (
//                 <div
//                     id="info-container"
//                     className={`w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl shadow-lg transition-all duration-500 opacity-0 transform translate-y-8 hover:shadow-xl ${shake ? 'shake-animation' : ''}`}
//                 >
//                     <div className="w-full h-2 bg-gray-200 rounded-t-xl overflow-hidden relative">
//                         <div
//                             className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-in-out"
//                             style={{ width: `${formProgress}%` }}
//                         ></div>
//                         <div id="complete-checkmark" className="absolute right-2 top-0 transform -translate-y-1/2 transition-all duration-500 opacity-0 scale-0">
//                             {formProgress === 100 && (
//                                 <CheckCircle size={16} className="text-green-500" />
//                             )}
//                         </div>
//                     </div>

//                     <div className="p-8">
//                         <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse-slow">
//                             Create Your Profile
//                         </h2>

//                         {showAlert && (
//                             <div
//                                 className={`p-4 mb-5 rounded-lg text-center text-white font-medium animate-fadeIn ${alertType === "error" ? "bg-red-500" : "bg-green-500"}`}
//                             >
//                                 {alertMessage}
//                                 {redirectCountdown !== null && (
//                                     <div className="mt-2 text-sm">
//                                         <div className="w-full bg-white bg-opacity-30 h-1 rounded-full overflow-hidden">
//                                             <div 
//                                                 className="h-full bg-white transition-all duration-1000 ease-linear"
//                                                 style={{ width: `${(redirectCountdown / 10) * 100}%` }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         <div className={`space-y-6 ${showRedirectMessage && alertType === "error" ? "opacity-50 pointer-events-none" : ""}`}>
//                             <div className="flex justify-center mb-6 form-field opacity-0 translate-y-4 transition-all duration-300">
//                                 <label
//                                     className="relative cursor-pointer"
//                                     onMouseEnter={() => setIsImageHovered(true)}
//                                     onMouseLeave={() => setIsImageHovered(false)}
//                                 >
//                                     <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
//                                     <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-blue-100 flex items-center justify-center overflow-hidden bg-gray-50 relative transition-all duration-300 hover:shadow-xl animate-float">
//                                         {loading ? (
//                                             <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
//                                         ) : imagePreview ? (
//                                             <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
//                                         ) : (
//                                             <Camera size={64} className="text-gray-400" />
//                                         )}

//                                         <div
//                                             className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isImageHovered ? "opacity-100" : "opacity-0"}`}
//                                         >
//                                             <div className="flex flex-col items-center">
//                                                 <Upload size={28} className="text-white mb-2" />
//                                                 <span className="text-white font-medium">Upload Photo</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-center pt-2 text-gray-600 font-medium">
//                                         Profile Photo
//                                     </div>
//                                 </label>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2 group form-field opacity-0 translate-y-4 transition-all duration-300">
//                                     <label className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">
//                                         <User size={16} className="mr-2" />
//                                         Name <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         className="w-full p-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all hover:border-blue-200"
//                                         placeholder="Enter your full name"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="space-y-2 group form-field opacity-0 translate-y-4 transition-all duration-300">
//                                     <label className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">
//                                         <Briefcase size={16} className="mr-2" />
//                                         Profession <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="profession"
//                                         value={profession}
//                                         onChange={(e) => setProfession(e.target.value)}
//                                         className="w-full p-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all hover:border-blue-200"
//                                         placeholder="Software Engineer, Designer, etc."
//                                         required
//                                     />
//                                 </div>

//                                 <div className="space-y-2 group form-field opacity-0 translate-y-4 transition-all duration-300">
//                                     <label className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">
//                                         <Briefcase size={16} className="mr-2" />
//                                         Company
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="company"
//                                         value={company}
//                                         onChange={(e) => setCompany(e.target.value)}
//                                         className="w-full p-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all hover:border-blue-200"
//                                         placeholder="Company name (optional)"
//                                     />
//                                 </div>

//                                 <div className="space-y-2 group form-field opacity-0 translate-y-4 transition-all duration-300">
//                                     <label className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">
//                                         <MapPin size={16} className="mr-2" />
//                                         Location <span className="text-red-500 ml-1">*</span>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="location"
//                                         value={location}
//                                         onChange={(e) => setLocation(e.target.value)}
//                                         className="w-full p-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all hover:border-blue-200"
//                                         placeholder="City, Country"
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-2 group form-field opacity-0 translate-y-4 transition-all duration-300">
//                                 <label className="flex items-center text-sm font-medium text-gray-700 group-focus-within:text-blue-600 transition-colors">
//                                     About <span className="text-red-500 ml-1">*</span>
//                                 </label>
//                                 <textarea
//                                     name="about"
//                                     value={about}
//                                     onChange={(e) => setAbout(e.target.value)}
//                                     className="w-full p-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none focus:bg-white transition-all hover:border-blue-200"
//                                     rows={4}
//                                     placeholder="Tell us about yourself..."
//                                     required
//                                 ></textarea>
//                                 <div className="text-xs text-right text-gray-500">
//                                     {about.length} characters
//                                     <div className="w-full h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
//                                         <div 
//                                             className={`h-full transition-all duration-300 ${about.length > 200 ? 'bg-green-400' : 'bg-blue-400'}`}
//                                             style={{ width: `${Math.min(100, (about.length / 300) * 100)}%` }}
//                                         ></div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mt-8 form-field opacity-0 translate-y-4 transition-all duration-300">
//                                 <button
//                                     type="submit"
//                                     onClick={handleSubmit}
//                                     disabled={isLoading || redirectCountdown !== null}
//                                     className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70"
//                                 >
//                                     {isLoading ? (
//                                         <span className="flex items-center justify-center">
//                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Creating Profile...
//                                         </span>
//                                     ) : (
//                                         "Save Profile"
//                                     )}
//                                 </button>
                                
//                                 <div className="text-center mt-4 text-sm text-gray-500">
//                                     All fields marked with <span className="text-red-500">*</span> are required
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }