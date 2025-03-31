import React, { useState, useEffect } from "react";
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
</style>

interface HTMLRendererProps {
    content: string;
}

/**
 * Component for rendering HTML content with responsive styling and dynamic interaction features
 */
const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content }) => {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Dynamic text sizes based on screen size - medium reduction for mobile
    const getFontSize = (baseSize: number): string => {
        if (windowWidth < 640) { // Small mobile
            return `text-${Math.max(baseSize - 2.0, 1)}xl`;
        } else if (windowWidth < 768) { // Large mobile
            return `text-${Math.max(baseSize - 1.0, 1)}xl`;
        } else {
            return `text-${baseSize}xl`;
        }
    };

    // Get appropriate font weight for screen size
    const getFontWeight = (defaultWeight: string): string => {
        if (windowWidth < 768) { // For mobile devices
            // Increase font weight by one level to compensate for smaller font size
            if (defaultWeight === "font-bold") return "font-extrabold";
            if (defaultWeight === "font-semibold") return "font-bold";
            if (defaultWeight === "font-medium") return "font-semibold";
            if (defaultWeight === "font-normal") return "font-medium";
            // For other weights, return the default
            return defaultWeight;
        }
        return defaultWeight;
    };

    // Base font style for the component
    const fontFamily = "font-serif"; // Changed from default sans-serif to serif

    // Responsive style mapping for HTML elements
    const tagStyles: Record<string, string> = {
        h1: `${getFontSize(5)} ${getFontWeight("font-bold")} ${fontFamily} mt-6 mb-2`,
        h2: `${getFontSize(4)} ${getFontWeight("font-semibold")} ${fontFamily} mt-6 mb-2`,
        h3: `${getFontSize(3)} ${getFontWeight("font-medium")} ${fontFamily} mt-6 mb-2`,
        p: `mb-4 whitespace-pre-wrap text-sm md:text-base lg:text-lg ${fontFamily}`, // Medium size between previous versions
        b: `${getFontWeight("font-bold")} ${fontFamily}`,
        strong: `${getFontWeight("font-bold")} ${fontFamily}`,
        i: `italic ${fontFamily}`,
        em: `italic ${fontFamily}`,
        u: `underline ${fontFamily}`,
        s: `line-through ${fontFamily}`,
        del: `line-through ${fontFamily}`,
        blockquote: `border-l-4 border-gray-500 pl-4 italic text-slate-800 my-4 py-2 text-xs md:text-sm lg:text-base ${fontFamily}`,
        ul: `list-disc list-outside ml-4 md:ml-6 my-2 ${fontFamily}`,
        ol: `list-decimal list-outside ml-4 md:ml-6 my-2 ${fontFamily}`,
        li: `ml-2 md:ml-4 mb-2 text-sm md:text-base lg:text-lg ${fontFamily}`,
        pre: `whitespace-pre-wrap break-words text-xs md:text-sm p-2 bg-gray-100 rounded-md overflow-x-auto font-mono`, // Keep monospace for code
        div: `block ${fontFamily}`,
        a: `text-blue-600 underline hover:text-blue-800 transition-all duration-200 ease-in-out ${fontFamily}`,
        table: `w-full border-collapse my-4 text-xs md:text-sm lg:text-base ${fontFamily}`,
        tr: `border-b border-gray-300 ${fontFamily}`,
        th: `p-2 text-left font-bold bg-gray-100 ${fontFamily}`,
        td: `p-2 ${fontFamily}`,
    };

    // Handle image zoom toggle
    const toggleZoom = (src?: string) => {
        setZoomedImage(src || null);
        if (src) {
            // Prevent background scrolling when zoomed
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    // Create responsive image element with zoom functionality
    const createImage = (src: string, alt: string, width?: string, height?: string, title?: string) => {
        return (
            <div className={`flex flex-col items-center mb-5 w-full ${fontFamily}`}>
                <img
                    src={src}
                    alt={alt || "Image"}
                    className="rounded-lg md:rounded-3xl py-2 max-w-full mx-auto cursor-zoom-in transition-transform duration-300 ease-in-out hover:opacity-90"
                    width={width ? width.replace("px", "") : undefined}
                    height={height === "auto" ? "auto" : height?.replace("px", "")}
                    onClick={() => toggleZoom(src)}
                    loading="lazy"
                />
                {title && (
                    <div className={`text-center text-gray-500 text-xs md:text-sm mt-1 md:mt-2 px-2 ${fontFamily}`}>{title}</div>
                )}
            </div>
        );
    };

    // Create link element with proper styling
    const createLink = (href: string, children: React.ReactNode, target?: string, title?: string) => {
        return (
            <a
                href={href}
                target={target || "_blank"}
                rel="noopener noreferrer nofollow"
                className={tagStyles.a}
                title={title || ""}
            >
                {children}
            </a>
        );
    };

    // Parser options for html-react-parser with responsive handling
    const parserOptions: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            if (domNode.type !== "tag") return undefined;

            const { name, attribs, children } = domNode;

            // Handle responsive image tags
            if (name === "img") {
                return createImage(
                    attribs.src,
                    attribs.alt || "Image Not Found....",
                    attribs.width,
                    attribs.height,
                    attribs.title
                );
            }

            // Handle anchor tags
            if (name === "a") {
                return createLink(
                    attribs.href,
                    domToReact(children, parserOptions),
                    attribs.target,
                    attribs.title
                );
            }

            // Handle empty paragraphs
            if (name === "p" && (!children || children.length === 0)) {
                return <p className={`${tagStyles.p} h-4`}>&nbsp;</p>;
            }

            // Handle iframes (videos, etc.) responsively
            if (name === "iframe") {
                return (
                    <div className="relative w-full pb-[56.25%] h-0 my-4">
                        <iframe
                            src={attribs.src}
                            title={attribs.title || "Embedded content"}
                            allowFullScreen={true}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            {...attribs}
                        />
                    </div>
                );
            }

            // Handle div with potential image or link
            if (name === "div" || name === "p") {
                // Check for direct img child
                const imgNode = children?.find((child: any) => child.name === "img");
                if (imgNode) {
                    return createImage(
                        imgNode.attribs.src,
                        imgNode.attribs.alt || "Image Not Found...",
                        imgNode.attribs.width,
                        imgNode.attribs.height,
                        imgNode.attribs.title
                    );
                }

                // Check for special styles
                if (attribs?.style) {
                    const style = attribs.style.replace(/\s/g, "");
                    if (style.includes("display:flex") && style.includes("align-items:center")) {
                        return <div className={`flex flex-col items-center ${fontFamily}`}>{domToReact(children, parserOptions)}</div>;
                    }
                    if (style.includes("text-align:center")) return <div className={`text-center ${fontFamily}`}>{domToReact(children, parserOptions)}</div>;
                    if (style.includes("text-align:right")) return <div className={`text-right ${fontFamily}`}>{domToReact(children, parserOptions)}</div>;
                    if (style.includes("text-align:left")) return <div className={`text-left ${fontFamily}`}>{domToReact(children, parserOptions)}</div>;
                }
            }

            // Handle list items to prevent nested paragraphs
            if (name === "li") {
                return (
                    <li className={tagStyles.li}>
                        {domToReact(children, {
                            ...parserOptions,
                            replace: (childNode: any) => {
                                if (childNode.type !== "tag") return undefined;

                                // Prevent <p> inside <li> by unwrapping content
                                if (childNode.name === "p") {
                                    return <>{domToReact(childNode.children, parserOptions)}</>;
                                }

                                // Ensure links inside list items are styled correctly
                                if (childNode.name === "a") {
                                    return createLink(
                                        childNode.attribs.href,
                                        domToReact(childNode.children, parserOptions),
                                        childNode.attribs.target,
                                        childNode.attribs.title
                                    );
                                }

                                return undefined;
                            },
                        })}
                    </li>
                );
            }

            // Responsive tables
            if (name === "table") {
                return (
                    <div className="overflow-x-auto my-4">
                        <table className={tagStyles.table}>
                            {domToReact(children, parserOptions)}
                        </table>
                    </div>
                );
            }

            // Apply default styles for known tags
            if (tagStyles[name]) {
                return React.createElement(
                    name,
                    { className: tagStyles[name] },
                    domToReact(children, parserOptions)
                );
            }

            return undefined;
        }
    };

    return (
        <div className={`bg-slate-300 rounded-xl md:rounded-3xl font-thin mt-2 p-2 md:p-3 w-full text-sm md:text-base lg:text-lg ${fontFamily}`}>
            {parse(content, parserOptions)}

            {/* Image zoom overlay with better mobile handling */}
            {zoomedImage && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 cursor-zoom-out"
                    onClick={() => toggleZoom()}
                >
                    <div className="relative max-w-[95vw] max-h-[95vh]">
                        <img
                            src={zoomedImage}
                            alt="Error Loading Image..."
                            className="max-w-full max-h-[90vh] rounded-lg object-contain"
                        />
                        <button
                            className="absolute top-3 right-3 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleZoom();
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HTMLRenderer;