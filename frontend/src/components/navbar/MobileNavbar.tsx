import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import {  useName } from "../../hooks"

export function MobileNavbar({ hide }: { hide?: string }) {
    const { details } = useName();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLImageElement | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        if (searchTerm) {
            setSearchParams({ filter: searchTerm });
        } else {
            setSearchParams({});
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close menu if click is outside menu and not on profile image
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="border-b rounded-xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            {/* Top Bar */}
            <div className="flex justify-between items-center px-4 py-2">
                {/* Logo */}
                <Link to={'/blogs'}>
                    <img
                        src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742018435/upscalemedia-transformed_woy6ow.png"
                        className="h-12 w-auto rounded-md my-1"
                        alt="Blogify Logo"
                    />
                </Link>

                {/* Right side icons */}
                <div className="flex items-center space-x-2  ">
                    {/* Search icon */}
                    <button
                        onClick={toggleSearch}
                        className={`p-2 ${hide}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white h-6 w-6 fill-current"
                            viewBox="0 0 56.966 56.966"
                        >
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
                            />
                        </svg>
                    </button>

                    {/* User profile icon */}
                    <div className="flex items-center">
                        <img
                            ref={profileRef}
                            src={details?.profileUrl || "https://res.cloudinary.com/dxj9gigbq/image/upload/v1738260287/ll30su5iglsgz2xgyjmv.png"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full cursor-pointer"
                            onClick={toggleMenu}
                        />
                    </div>
                </div>
            </div>

            {/* Search bar - conditionally shown */}
            {showSearch && (
                <div className={`px-4 py-2 w-full ${hide}`}>
                    <div className="relative">
                        <input
                            className="border-2 border-gray-300 bg-white h-10 px-3 pr-16 w-full rounded-2xl text-sm focus:outline-none"
                            type="search"
                            name="search"
                            placeholder="Search"
                            defaultValue={searchParams.get('filter') || ''}
                            onChange={handleSearch}
                        />
                        <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
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
                </div>
            )}

            {/* Mobile menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute top-16 right-2 w-56 bg-white shadow-lg rounded-lg z-50"
                >
                    <div
                        className="flex items-center px-4 py-3 hover:bg-gray-100"
                        onClick={() => {
                            navigate('/publish');
                            setIsMenuOpen(false);
                        }}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742584130/image-removebg-preview_1_w01ltv.png" alt="New Blog" className="h-5 w-5 mr-2" />
                        New Blog
                    </div>
                    <div
                        className="flex items-center px-4 py-3 hover:bg-gray-100"
                        onClick={() => {
                            navigate('/profile');
                            setIsMenuOpen(false);
                        }}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/profile2_m1kjnx.png" alt="Profile" className="h-5 w-5 mr-2" />
                        View Profile
                    </div>
                    <div
                        className="flex items-center px-4 py-3 hover:bg-gray-100"
                        onClick={() => {
                            navigate('/myblogs');
                            setIsMenuOpen(false);
                        }}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/blogs_jtwilb.png" alt="My Blogs" className="h-5 w-5 mr-2" />
                        My Blogs
                    </div>
                    <div
                        className="flex items-center px-4 py-3 hover:bg-gray-100"
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate("/signin");
                        }}
                    >
                        <img src="https://res.cloudinary.com/dxj9gigbq/image/upload/v1742580763/logout_m3vcge.png" alt="Logout" className="h-5 w-5 mr-2" />
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default MobileNavbar;