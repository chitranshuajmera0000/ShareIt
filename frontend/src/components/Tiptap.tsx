import { useEditor, EditorContent } from "@tiptap/react";
import './tiptap.css';
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import YouTube from "@tiptap/extension-youtube";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {  Loader2, X } from "lucide-react";
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Quote, Link as LinkIcon, Image as ImageIcon, Youtube,
    AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
} from "lucide-react";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import axios from "axios";
import { CustomImage } from "./CustomImage";
// import parse, { domToReact } from "html-react-parser";
import React from "react";
import { CLOUD_NAME, UPLOAD_PRESET } from "../config";

<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
</style>

const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    }),
    CustomImage,
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    Underline,
    Highlight,
    HorizontalRule,
    Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https"
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    YouTube.configure({
        width: 700,
        height: 394,
        nocookie: true,

    }),
    TextStyle,
    Color,
    FontFamily,
];

// Modal component for inputs
const Modal = ({
    isOpen,
    onClose,
    children,
    title
}: {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
    title: string
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const Tiptap = ({ onChange, size, initialContent }: { onChange: (e: any) => void, size: number, initialContent?: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const editorContentRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    // Modal states
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [youTubeModalOpen, setYouTubeModalOpen] = useState(false);
    const [youTubeUrl, setYouTubeUrl] = useState("");

    const editor = useEditor({
        extensions,
        content: initialContent || "",
        editorProps: {
            attributes: {
                class: 'prose focus:outline-none max-w-none w-full font-serif',
                style: 'min-height: 400px; padding: 1rem;'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && initialContent) {
            if (editor.getHTML() !== initialContent) {
                editor.commands.setContent(initialContent);
            }
        }
    }, [editor, initialContent]);

    if (!editor) return null;

    // const handleEditorContent = async () => {
    //     setSaveState("Saving");
    //     try {
    //         const html = editor.getHTML();
    //         if (!html) {
    //             setSaveState("Error");
    //             setTimeout(() => setSaveState("Idle"), 4000);
    //             return;
    //         }
    //         onChange(html);
    //         await new Promise((resolve) => setTimeout(resolve, 2000));
    //         setSaveState("Saved");
    //     } catch (error) {
    //         console.error("Save failed:", error);
    //         setSaveState("Error");
    //     }
    // };

    const ToolbarButton = ({
        onClick,
        onMouseDown,
        isActive,
        children,
        disabled = false
    }: {
        onClick: () => void,
        onMouseDown?: (e: React.MouseEvent) => void,
        isActive?: boolean,
        children: React.ReactNode,
        disabled?: boolean
    }) => (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={onMouseDown}
            disabled={disabled}
            className={`
                p-2 rounded transition-all duration-200 
                ${disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : (isActive
                        ? 'bg-blue-500 text-white scale-105'
                        : 'hover:bg-blue-100 text-gray-700 hover:text-blue-800')
                }
            `}
        >
            {children}
        </button>
    );

    // const [saveState, setSaveState] = useState<"Idle" | "Saving" | "Error" | "Saved">("Idle");
    const [title, setTitle] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        setSelectedImage(file);
        setImageModalOpen(true);
    };

    const handleInsertLink = () => {
        if (!linkUrl.trim()) return;

        if (editor.isActive("link")) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }

        if (linkText.trim()) {
            editor.chain().focus().insertContent({
                type: 'text',
                marks: [{ type: 'link', attrs: { href: linkUrl } }],
                text: linkText
            }).run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }

        setLinkModalOpen(false);
        setLinkUrl('');
        setLinkText('');
        editor.commands.focus();
    };

    const handleSaveImage = async () => {
        if (!selectedImage) {
            alert("Please select an image and enter a title before saving.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", `${UPLOAD_PRESET}`);

        setIsUploading(true);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
                formData
            );

            const imageUrl = response.data.secure_url;

            editor.chain().focus().insertContent({
                type: "image",
                attrs: {
                    src: imageUrl,
                    width: "700px",
                    height: "auto",
                    title: title || "",
                },
            }).run();

        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setIsUploading(false);
            setImageModalOpen(false);
            setSelectedImage(null);
            setTitle("");
        }
    };

    const handleLinkButtonClick = () => {
        if (editor.isActive("link")) {
            const linkAttrs = editor.getAttributes("link");
            setLinkUrl(linkAttrs.href || "");
        }
        const { from, to } = editor.state.selection;
        if (from !== to) {
            setLinkText(editor.state.doc.textBetween(from, to));
        }
        setLinkModalOpen(true);
    };

    const handleImageButtonClick = () => {
        setImageModalOpen(true);
    };

    // Function to handle YouTube URL insertion
    const handleInsertYouTube = () => {
        if (!youTubeUrl.trim()) return;

        try {
            editor.chain().focus().setYoutubeVideo({
                src: youTubeUrl,
                width: 700,
                height: 394,
            }).run();

            setYouTubeModalOpen(false);
            setYouTubeUrl("");
            editor.commands.focus();
        } catch (error) {
            console.error("YouTube insertion failed:", error);
        }
    };

    // Function to open YouTube modal
    const handleYouTubeButtonClick = () => {
        setYouTubeModalOpen(true);
    };

    return (
        <div className={`editor-container p-4 mx-${size} bg-white relative`} ref={editorRef}>
            <div className="border border-indigo-300 rounded-lg overflow-visible relative">
                <div
                    ref={toolbarRef}
                    className="toolbar sticky top-0 z-10 bg-white border-b flex flex-wrap items-center gap-1 px-3 py-2 shadow-sm overflow-x-auto"
                    style={{ scrollbarWidth: 'thin' }}
                >
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleBold().run(); }}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold size={16} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleItalic().run(); }}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic size={16} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleUnderline().run(); }}
                        isActive={editor.isActive('underline')}
                    >
                        <UnderlineIcon size={16} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleStrike().run(); }}
                        isActive={editor.isActive('strike')}
                    >
                        <Strikethrough size={16} />
                    </ToolbarButton>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleHeading({ level: 1 }).run(); }}
                        isActive={editor.isActive('heading', { level: 1 })}
                    >
                        H1
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleHeading({ level: 2 }).run(); }}
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        H2
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleHeading({ level: 3 }).run(); }}
                        isActive={editor.isActive('heading', { level: 3 })}
                    >
                        H3
                    </ToolbarButton>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleBulletList().run(); }}
                        isActive={editor.isActive('bulletList')}
                    >
                        <List size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleOrderedList().run(); }}
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered size={16} />
                    </ToolbarButton>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().toggleBlockquote().run(); }}
                        isActive={editor.isActive('blockquote')}
                    >
                        <Quote size={16} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().setHorizontalRule().run(); }}
                    >
                        hr
                    </ToolbarButton>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().setTextAlign('left').run(); }}
                        isActive={editor.isActive({ textAlign: 'left' })}
                    >
                        <AlignLeft size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().setTextAlign('center').run(); }}
                        isActive={editor.isActive({ textAlign: 'center' })}
                    >
                        <AlignCenter size={16} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().setTextAlign('right').run(); }}
                        isActive={editor.isActive({ textAlign: 'right' })}
                    >
                        <AlignRight size={16} />
                    </ToolbarButton>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <ToolbarButton
                        onClick={handleLinkButtonClick}
                        onMouseDown={(e) => e.preventDefault()}
                        isActive={editor.isActive("link")}
                    >
                        <LinkIcon size={16} />
                    </ToolbarButton>

                    {/* Image Button */}
                    {isUploading ? (
                        <Loader2 className="animate-spin mx-2 text-blue-700" size={18} />
                    ) : (
                        <ToolbarButton
                            onClick={handleImageButtonClick}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <ImageIcon size={16} />
                        </ToolbarButton>
                    )}

                    {/* YouTube Button - Added next to the image icon */}
                    <ToolbarButton
                        onClick={handleYouTubeButtonClick}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Youtube size={16} />
                    </ToolbarButton>

                </div>

                <div ref={editorContentRef} className="w-full overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                    <EditorContent editor={editor} className="w-full bg-white" />
                </div>
            </div>

            <Modal
                isOpen={linkModalOpen}
                onClose={() => setLinkModalOpen(false)}
                title="Insert Link"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">URL</label>
                        <input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Link Text <span className="text-gray-400 text-xs">(Optional, leave empty to use selection)</span>
                        </label>
                        <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Link text"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setLinkModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleInsertLink}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!linkUrl.trim()}
                        >
                            Insert
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={imageModalOpen}
                onClose={() => {
                    setImageModalOpen(false);
                    setSelectedImage(null);
                    setTitle("");
                }}
                title="Add Image"
            >
                <div className="space-y-5 ">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="cursor-pointer w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="text-yellow-500">⚠️</span> Upload images ≤ 10MB
                        </p>
                    </div>

                    {selectedImage && (
                        <div className="space-y-2 ">
                            <label className="block text-sm font-medium text-gray-700">Image Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Image title"
                            />
                            <div className="border rounded-md p-2 bg-gray-50">
                                <p className="text-sm font-medium truncate mb-1">{selectedImage.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setImageModalOpen(false);
                                setSelectedImage(null);
                                setTitle("");
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveImage}
                            className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isUploading || !selectedImage}
                        >
                            {isUploading ? (
                                <span className="flex items-center">
                                    <Loader2 size={14} className="animate-spin mr-2" />
                                    Uploading...
                                </span>
                            ) : 'Upload & Insert'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* YouTube Modal */}
            <Modal
                isOpen={youTubeModalOpen}
                onClose={() => {
                    setYouTubeModalOpen(false);
                    setYouTubeUrl("");
                }}
                title="Add YouTube Video"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                        <input
                            type="text"
                            value={youTubeUrl}
                            onChange={(e) => setYouTubeUrl(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        />
                        <p className="text-xs text-gray-600">
                            Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setYouTubeModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleInsertYouTube}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!youTubeUrl.trim()}
                        >
                            Insert Video
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Tiptap;