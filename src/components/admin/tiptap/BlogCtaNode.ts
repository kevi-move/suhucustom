import { Node, mergeAttributes } from "@tiptap/core";
import { BLOG_INLINE_CTA_VARIANT } from "@/lib/blogInlineCta";

export const BlogCtaNode = Node.create({
  name: "blogCta",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      variant: { default: BLOG_INLINE_CTA_VARIANT },
    };
  },
  parseHTML() {
    return [
      {
        tag: `div[data-blog-cta="${BLOG_INLINE_CTA_VARIANT}"]`,
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "div",
      mergeAttributes({
        class: "blog-inline-cta",
        "data-blog-cta": node.attrs.variant || BLOG_INLINE_CTA_VARIANT,
      }),
    ];
  },
  addNodeView() {
    return () => {
      const wrapper = document.createElement("div");
      wrapper.className = "blog-inline-cta-editor";
      wrapper.contentEditable = "false";

      const button = document.createElement("span");
      button.className = "blog-inline-cta-editor-button";
      button.textContent = "Start Your Free Quote →";
      wrapper.appendChild(button);

      const label = document.createElement("span");
      label.className = "blog-inline-cta-editor-label";
      label.textContent = "Inline CTA";
      wrapper.appendChild(label);

      return { dom: wrapper };
    };
  },
});
