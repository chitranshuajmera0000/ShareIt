import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Name, useName } from "../../hooks";

export function DesktopNavbar({ hide }: { hide?: string }) {
    const { details } = useName();
    const [searchParams, setSearchParams] = useSearchParams();
    // const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        if (searchTerm) {
            setSearchParams({ filter: searchTerm });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="border-b rounded-xl flex flex-row justify-between px-10 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            {/* Logo */}
            <div className="flex">
                <Link to="/blogs">
                    <img
                        src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png"
                        alt="ShareIt Logo"
                        className="h-20 w-25 rounded-md my-2.5"
                    />
                </Link>
            </div>

            {/* Search Bar (Unchanged) */}
            <div className={`pt-2 my-5 ml-82 relative w-3xl mx-auto text-slate-900 ${hide}`}>
                <input
                    className="border-2 border-gray-300 w-96 bg-white h-10 px-3 pr-16 rounded-2xl text-sm focus:outline-none"
                    type="search"
                    name="search"
                    placeholder="Search"
                    defaultValue={searchParams.get("filter") || ""}
                    onChange={handleSearch}
                />
                <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-600 h-4 w-4 fill-current"
                        viewBox="0 0 56.966 56.966"
                    >
                        <path
                            d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                        />
                    </svg>
                </button>
            </div>

            {/* Navigation and Profile */}
            <div className="flex flex-row justify-between items-center">
                <Link to="/publish" className="text-2xl font-bold cursor-pointer px-3 mt-2.5">
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-8 focus:ring-slate-300 font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2"
                    >
                        New Blog
                    </button>
                </Link>
                <ProfileMenu info={details || {}} />
            </div>
        </div>
    );
}

const ProfileMenu = ({ info }: { info: Name }) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    async function logout() {
        localStorage.removeItem("token");
        setShowAlert(true);
        setMenuOpen(false);
        setAlertMessage("Logging Out....");
        const timer = setTimeout(() => {
            setShowAlert(false);
            navigate("/signin");
        }, 2000);

        return () => clearTimeout(timer);
    }

    const toggleMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative py-4 text-xl px-5">
            {showAlert && (
                <div
                    className="fixed top-24 right-4 p-4 mb-4 text-sm z-50 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 shadow-lg animate-slide-in"
                    role="alert"
                >
                    <div className="flex items-center justify-between">
                        <span>{alertMessage}</span>
                        <button
                            className="ml-4 text-red-800 hover:text-red-500"
                            onClick={() => setShowAlert(false)}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                <img
                    src={
                        info.profileUrl ||
                        "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png"
                    }
                    alt="Profile"
                    className="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden bg-white rounded-full"
                />
            </div>

            <div
                ref={menuRef}
                className={`absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg transform transition-all duration-300 
                    ${menuOpen ? "scale-100 opacity-100 z-50" : "scale-95 opacity-0 pointer-events-none"}`}
            >
                <div
                    className="z-100 flex items-center px-4 pt-2 pb-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                >
                    <img
                        src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/profile2_m1kjnx.png"
                        alt="Profile Icon"
                        className="h-8 w-8 rounded-3xl mt-1 mr-2"
                    />
                    View Profile
                </div>
                <div
                    className="flex items-center px-4 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/myblogs")}
                >
                    <img
                        src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/blogs_jtwilb.png"
                        alt="Blogs Icon"
                        className="h-8 mb-1.5 w-8 rounded-3xl mt-2.5 mr-2"
                    />
                    My Blogs
                </div>
                <div
                    className="flex items-center px-4 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={logout}
                >
                    <img
                        src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/logout_m3vcge.png"
                        alt="Logout Icon"
                        className="h-8 w-8 mb-1.5 rounded-3xl mt-2.5 mr-2"
                    />
                    Logout
                </div>
            </div>
        </div>
    );
};

export default DesktopNavbar;