
import Image from "@tiptap/extension-image";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      width: {
        default: "700px",
        parseHTML: (element) => element.getAttribute("width") || "500px",
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: "500px",
        parseHTML: (element) => element.getAttribute("height") || "auto",
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("title") || "",
        renderHTML: (attributes) => ({ title: attributes.title }),
      }
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      // Create container div
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";

      // Create image element
      const img = document.createElement("img");
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        img.setAttribute(key, value);
      });

      // Create caption div
      const caption = document.createElement("div");
      caption.style.marginTop = "5px";
      caption.style.fontSize = "14px";
      caption.style.color = "gray";
      caption.textContent = node.attrs.title || "";

      // Append elements
      container.appendChild(img);
      if (node.attrs.title) container.appendChild(caption); // Only show title if present

      return {
        dom: container,
      };
    };
  },
});

export { CustomImage };
