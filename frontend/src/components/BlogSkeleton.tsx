import useResponsive from "../hooks";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import MobileNavbar from "./navbar/MobileNavbar";

export function BlogSkeleton() {
  const { isMobile, isDesktop } = useResponsive();
  return (
    <div className="min-h-screen bg-gray-50">
      {
        isMobile ?
          <div className="p-2">
            <MobileNavbar hide="invisible"></MobileNavbar>
          </div> : isDesktop ? <div className="p-2">
            <DesktopNavbar hide="invisible"></DesktopNavbar>
          </div> : <div className="p-2"><MobileNavbar hide="invisible"/></div>
      }
      {/* Main Content Area */}
      <div className="grid grid-cols-12 w-full px-4 md:px-8 lg:px-20 pt-8 md:pt-16 whitespace-pre-wrap mb-10 gap-6">
        {/* Main Blog Content - Left Column */}
        <div className="col-span-12 md:col-span-8 border border-gray-200 rounded-lg p-4 md:p-6 bg-white shadow-sm">
          {/* Title Skeleton */}
          <div className="h-12 md:h-16 lg:h-20 bg-gray-200 animate-pulse rounded-md mb-6"></div>

          {/* Meta Information Skeletons */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
            {/* <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/5"></div> */}
          </div>

          {/* Author Info Skeleton */}
          <div className="flex items-center gap-3 mb-8">
            {/* <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div> */}
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="h-56 md:h-72 bg-gray-200 animate-pulse rounded-md mb-8"></div>

          {/* Content Paragraphs Skeletons */}
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-11/12"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
          </div>

          {/* Subheading Skeleton */}
          <div className="h-8 bg-gray-200 animate-pulse rounded-md w-2/3 my-8"></div>

          {/* More Content Paragraphs */}
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-11/12"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-4/5"></div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          {/* Author Card */}
          <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white">
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2 mb-4"></div>
            <div className="flex items-start gap-3 mb-4">
              <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 animate-pulse rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-11/12 mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
          </div>

          {/* Popular Posts */}
          <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white">
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-2/3 mb-4"></div>

            {/* Post Item */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full mb-2"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
            </div>

            {/* Post Item */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full mb-2"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
            </div>

            {/* Post Item */}
            <div>
              <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full mb-2"></div>
              <div className="h-3 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
            </div>
          </div>

          {/* Categories */}
          <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white">
            <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/5"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-10 border-t border-gray-200 pt-8 pb-12 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/3 mx-auto mb-6"></div>
          <div className="flex justify-center gap-4 mb-6">
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full max-w-md mx-auto"></div>
        </div>
      </div>
    </div>
  );
}