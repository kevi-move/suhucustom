"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { BlogCtaNode } from "./tiptap/BlogCtaNode";
// Preserve tables as raw HTML blocks so TipTap doesn't mangle the structure
const RawTableNode = Node.create({
  name: "rawTable",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes() {
    return {
      rawHtml: { default: "" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "table",
        getAttrs(node: HTMLElement) {
          return { rawHtml: node.outerHTML };
        },
      },
      {
        tag: "div[data-raw-table]",
        getAttrs(node: HTMLElement) {
          const encoded = node.getAttribute("data-raw-table") || "";
          try { return { rawHtml: decodeURIComponent(encoded) }; }
          catch { return { rawHtml: "" }; }
        },
      },
    ];
  },
  renderHTML({ node }) {
    return ["div", { "data-raw-table": encodeURIComponent(node.attrs.rawHtml || "") }];
  },
  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("raw-table-wrapper");
      wrapper.contentEditable = "false";
      wrapper.innerHTML = node.attrs.rawHtml || "";
      return { dom: wrapper };
    };
  },
});

const DetailsNode = Node.create({
  name: "details",
  group: "block",
  content: "detailsSummary detailsContent",
  defining: true,
  parseHTML() {
    return [{ tag: "details" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["details", mergeAttributes(HTMLAttributes), 0];
  },
});

const DetailsSummaryNode = Node.create({
  name: "detailsSummary",
  group: "",
  content: "inline*",
  defining: true,
  parseHTML() {
    return [{ tag: "summary" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["summary", mergeAttributes(HTMLAttributes), 0];
  },
});

const DetailsContentNode = Node.create({
  name: "detailsContent",
  group: "",
  content: "block+",
  defining: true,
  parseHTML() {
    return [{ tag: "details > *:not(summary)", priority: 0 }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "details-content" }), 0];
  },
});
import { useState, useCallback, useRef } from "react";
import { uploadImageFile } from "@/lib/uploadImage";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
  Loader2,
} from "lucide-react";
interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// Restore raw table HTML from data-raw-table divs in getHTML() output
function restoreRawTables(html: string): string {
  return html.replace(/<div data-raw-table="([^"]+)"[^>]*><\/div>/g, (_, encoded) => {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return "";
    }
  });
}

export function TiptapEditor({ content, onChange, placeholder = "Write your content..." }: TiptapEditorProps) {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "blog-image",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "blog-link",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      RawTableNode,
      DetailsNode,
      DetailsSummaryNode,
      DetailsContentNode,
      BlogCtaNode,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = restoreRawTables(editor.getHTML());
      onChange(html);
      setHtmlContent(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    setImageUploading(true);
    try {
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }, [editor]);

  const addImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertCta = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({ type: "blogCta", attrs: { variant: "quote" } })
      .run();
  }, [editor]);

  const handleHtmlChange = (html: string) => {
    setHtmlContent(html);
    onChange(html);
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "8px",
        background: isActive ? "#D09947" : "transparent",
        color: isActive ? "#000" : "#C5C6C9",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#333";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ border: "1px solid #444", borderRadius: "8px", overflow: "hidden" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          padding: "8px 12px",
          background: "#1a1a1a",
          borderBottom: "1px solid #444",
          alignItems: "center",
        }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={18} />
        </ToolbarButton>

        <div style={{ width: "1px", height: "24px", background: "#444", margin: "0 8px" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <div style={{ width: "1px", height: "24px", background: "#444", margin: "0 8px" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 size={18} />
        </ToolbarButton>

        <div style={{ width: "1px", height: "24px", background: "#444", margin: "0 8px" }} />

        <ToolbarButton onClick={addLink} title="Add Link">
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Upload Image">
          {imageUploading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <ImageIcon size={18} />}
        </ToolbarButton>
        <ToolbarButton onClick={insertCta} title="Insert CTA Button">
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em" }}>CTA</span>
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          style={{ display: "none" }}
        />

        <div style={{ width: "1px", height: "24px", background: "#444", margin: "0 8px" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={18} />
        </ToolbarButton>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          onClick={() => {
            if (showHtml && editor) {
              editor.commands.setContent(htmlContent);
            } else if (!showHtml && editor) {
              setHtmlContent(restoreRawTables(editor.getHTML()));
            }
            setShowHtml(!showHtml);
          }}
          style={{
            padding: "6px 12px",
            background: showHtml ? "#D09947" : "#333",
            color: showHtml ? "#000" : "#C5C6C9",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {showHtml ? "Visual" : "HTML"}
        </button>
      </div>

      {/* Editor content */}
      {showHtml ? (
        <textarea
          value={htmlContent}
          onChange={(e) => handleHtmlChange(e.target.value)}
          style={{
            width: "100%",
            minHeight: "400px",
            padding: "16px",
            background: "#2a2a2a",
            color: "#C5C6C9",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        />
      ) : (
        <div
          style={{
            background: "#2a2a2a",
            minHeight: "400px",
          }}
        >
          <style jsx global>{`
            .tiptap-editor-content {
              padding: 16px;
              min-height: 400px;
              color: #C5C6C9;
              outline: none;
            }
            .tiptap-editor-content > * + * {
              margin-top: 0.75em;
            }
            .tiptap-editor-content p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #666;
              pointer-events: none;
              height: 0;
            }
            .tiptap-editor-content h1 {
              font-size: 2em;
              font-weight: 700;
              color: #fff;
            }
            .tiptap-editor-content h2 {
              font-size: 1.5em;
              font-weight: 600;
              color: #fff;
            }
            .tiptap-editor-content h3 {
              font-size: 1.25em;
              font-weight: 600;
              color: #fff;
            }
            .tiptap-editor-content ul,
            .tiptap-editor-content ol {
              padding-left: 1.5em;
            }
            .tiptap-editor-content blockquote {
              border-left: 3px solid #D09947;
              padding-left: 1em;
              margin-left: 0;
              font-style: italic;
              color: #999;
            }
            .tiptap-editor-content code {
              background: #1a1a1a;
              padding: 0.2em 0.4em;
              border-radius: 4px;
              font-family: monospace;
            }
            .tiptap-editor-content pre {
              background: #1a1a1a;
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
            }
            .tiptap-editor-content pre code {
              background: none;
              padding: 0;
            }
            .tiptap-editor-content img.blog-image {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
            .tiptap-editor-content a.blog-link {
              color: #D09947;
              text-decoration: underline;
            }
            .tiptap-editor-content table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 0;
              margin: 1em 0;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #444;
            }
            .tiptap-editor-content thead th,
            .tiptap-editor-content th {
              background: linear-gradient(135deg, #D09947, #E8C46A);
              color: #FFFFFF;
              font-weight: 700;
              text-align: left;
              padding: 14px 18px;
              font-size: 14px;
            }
            .tiptap-editor-content tbody td,
            .tiptap-editor-content td {
              padding: 14px 18px;
              border-bottom: 1px solid #333;
              font-size: 14px;
            }
            .tiptap-editor-content tbody tr:nth-child(even) {
              background: rgba(255,255,255,0.03);
            }
            .tiptap-editor-content details {
              border: 1px solid #444;
              border-radius: 12px;
              margin: 12px 0;
              background: #2a2a2a;
            }
            .tiptap-editor-content details[open] {
              border-color: #D09947;
              background: #2f2a22;
            }
            .tiptap-editor-content details summary {
              padding: 16px 20px;
              font-weight: 600;
              font-size: 15px;
              color: #E0E0E0;
              cursor: pointer;
              list-style: none;
            }
            .tiptap-editor-content details summary::-webkit-details-marker {
              display: none;
            }
            .tiptap-editor-content details > :not(summary) {
              padding: 0 20px 16px;
              color: #999;
              font-size: 14px;
              line-height: 1.6;
            }
            .tiptap-editor-content .blog-inline-cta-editor {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
              margin: 16px 0;
              padding: 14px;
              border: 1px dashed #D09947;
              border-radius: 12px;
              background: rgba(208, 153, 71, 0.08);
            }
            .tiptap-editor-content .blog-inline-cta-editor-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 9999px;
              padding: 10px 20px;
              font-size: 13px;
              font-weight: 700;
              color: #fff;
              background: linear-gradient(90deg, #c4862e, #D09947, #e8b04a);
              box-shadow: 0 4px 14px rgba(208, 153, 71, 0.35);
            }
            .tiptap-editor-content .blog-inline-cta-editor-label {
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: #D09947;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
