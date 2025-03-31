import React from "react";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import MobileNavbar from "./navbar/MobileNavbar";
import useResponsive from "../hooks";

export const ProfileSkeleton: React.FC = () => {
    const { isMobile, isDesktop } = useResponsive();

    return (
        <div className="min-h-screen bg-slate-300 pb-12">
            {isMobile ? (
                <div className="p-2">
                    <MobileNavbar hide="invisible" />
                </div>
            ) : isDesktop ? (
                <div className="p-2">
                    <DesktopNavbar hide="invisible" />
                </div>
            ) : (
                <div className="p-2">
                    <MobileNavbar hide="invisible" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-8 bg-slate-200 rounded-lg mt-5">
                {/* Profile Header Skeleton */}
                <div className="overflow-hidden">
                    <div className="flex justify-between content-end mb-4">
                        <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Banner */}
                        <div className="h-16 bg-gradient-to-r from-gray-300 to-gray-400 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-shimmer" 
                                 style={{backgroundSize: "200% 100%"}}></div>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 md:p-8">
                            {/* Profile Image */}
                            <div className="relative w-32 h-32 md:w-48 md:h-48 -mt-16 mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-300 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" 
                                         style={{backgroundSize: "200% 100%"}}></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center text-center w-full space-y-4">
                                {/* Name */}
                                <div className="h-8 bg-gray-300 rounded w-48 mx-auto animate-pulse"></div>
                                
                                {/* Profession */}
                                <div className="h-6 bg-gray-300 rounded w-64 mx-auto animate-pulse" 
                                     style={{animationDelay: "0.2s"}}></div>
                                
                                {/* Location */}
                                <div className="h-4 bg-gray-300 rounded w-32 mx-auto animate-pulse"
                                     style={{animationDelay: "0.3s"}}></div>
                                
                                {/* Social Links */}
                                <div className="flex gap-6 mt-4 justify-center">
                                    {[...Array(3)].map((_, index) => (
                                        <div 
                                            key={index}
                                            className="w-8 h-8 bg-gray-300 rounded-full animate-bounce" 
                                            style={{
                                                animationDuration: "1.5s", 
                                                animationDelay: `${0.1 + index * 0.2}s`
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Summary Skeleton */}
                <div className="mt-6">
                    <div className="flex justify-between mb-4">
                        <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    </div>

                    <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg">
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" 
                                 style={{animationDelay: "0.1s"}}></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"
                                 style={{animationDelay: "0.2s"}}></div>
                        </div>
                    </div>
                </div>

                {/* Blog Posts Grid Skeleton */}
                <div className="mt-8">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-6 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
                        {[...Array(3)].map((_, index) => (
                            <div 
                                key={index} 
                                className="w-full mx-auto animate-fadeIn"
                                style={{animationDelay: `${0.1 * index}s`}}
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-80 flex flex-col border-t-4 border-gray-300">
                                    {/* Image container with shimmer effect */}
                                    <div className="relative w-full h-48 overflow-hidden bg-gray-300">
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" 
                                             style={{backgroundSize: "200% 100%"}}></div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        {/* Title */}
                                        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto md:mx-0 animate-pulse"></div>
                                        <div className="flex justify-between items-center mt-4">
                                            {/* Time */}
                                            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                            {/* Read more */}
                                            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

