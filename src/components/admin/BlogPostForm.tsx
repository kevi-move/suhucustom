"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./TiptapEditor";
import { ImageUpload } from "./ImageUpload";
import { BlogPost, BlogPostInput, Category, Author } from "@/types/blog";
import { generateSlug } from "@/lib/blog";
import { createPostAdmin, updatePostAdmin } from "@/lib/blogAdminApi";
import {
  EMPTY_BLOG_EXTRAS,
  extractBlogExtrasFromContent,
  faqsToText,
  injectBlogExtrasIntoContent,
  keyPointsToText,
  textToFaqs,
  textToKeyPoints,
} from "@/lib/blogExtras";
import { getFrontendBlogPostUrl } from "@/lib/frontendPreview";
import { fetchAllCategoriesAdmin } from "@/lib/categoryAdminApi";
import { fetchAllAuthorsAdmin } from "@/lib/authorAdminApi";
import { BlogPostPreviewModal } from "@/components/admin/BlogPostPreviewModal";
import type { BlogPostPreviewData } from "@/components/blog/BlogPostPagePreview";
import { ArrowLeft, Save, Eye, Monitor } from "lucide-react";
import Link from "next/link";

interface BlogPostFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

export function BlogPostForm({ post, isEditing = false }: BlogPostFormProps) {
  const initialParsed = post
    ? extractBlogExtrasFromContent(post.content)
    : { extras: EMPTY_BLOG_EXTRAS, content: "" };

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(initialParsed.content || "");
  const [aiSummary, setAiSummary] = useState(initialParsed.extras.aiSummary);
  const [keyPointsText, setKeyPointsText] = useState(
    keyPointsToText(initialParsed.extras.keyPoints)
  );
  const [faqsText, setFaqsText] = useState(faqsToText(initialParsed.extras.faqs));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status || "draft");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [authorRef, setAuthorRef] = useState(post?.authorRef || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [previewOpen, setPreviewOpen] = useState(false);

  const router = useRouter();

  const previewData: BlogPostPreviewData = {
    title,
    excerpt,
    featuredImage,
    contentHtml: content,
    aiSummary,
    keyPoints: textToKeyPoints(keyPointsText),
    faqs: textToFaqs(faqsText),
    categoryName: categories.find((item) => item.id === categoryId)?.name,
    authorName: authors.find((item) => item.id === authorRef)?.name,
    publishedAt: post?.publishedAt ?? null,
    createdAt: post?.createdAt ?? new Date(),
  };

  useEffect(() => {
    fetchAllCategoriesAdmin().then(setCategories);
    fetchAllAuthorsAdmin().then(setAuthors);
  }, []);

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const input: BlogPostInput = {
        title,
        slug,
        content: injectBlogExtrasIntoContent(content, {
          aiSummary,
          keyPoints: textToKeyPoints(keyPointsText),
          faqs: textToFaqs(faqsText),
        }),
        excerpt,
        featuredImage,
        status,
        categoryId: categoryId || null,
        authorRef: authorRef || null,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
      };

      if (isEditing && post) {
        await updatePostAdmin(post.id, input);
      } else {
        await createPostAdmin(input);
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "16px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    color: "#C5C6C9",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: 500 as const,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/admin/blog"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "#2a2a2a",
              borderRadius: "8px",
              color: "#C5C6C9",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#FFFFFF" }}>
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#2a2a2a",
              color: "#C5C6C9",
              border: "1px solid #444",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Monitor size={18} />
            页面预览
          </button>
          {isEditing && post && (
            <Link
              href={`/admin/blog/${post.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#2a2a2a",
                color: "#C5C6C9",
                border: "1px solid #444",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Eye size={18} />
              新窗口预览
            </Link>
          )}
          {isEditing &&
            post?.status === "published" &&
            getFrontendBlogPostUrl(post.slug) && (
            <Link
              href={getFrontendBlogPostUrl(post.slug)!}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#2a2a2a",
                color: "#C5C6C9",
                border: "none",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <Eye size={18} />
              前台预览
            </Link>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: saving ? "#666" : "#D09947",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>

      <BlogPostPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        status={status}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
              style={inputStyle}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>
              Slug
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  style={{
                    marginLeft: "8px",
                    padding: "2px 8px",
                    background: autoSlug ? "#D09947" : "#333",
                    color: autoSlug ? "#000" : "#C5C6C9",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  {autoSlug ? "Auto" : "Manual"}
                </button>
              )}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(e.target.value);
              }}
              required
              placeholder="post-url-slug"
              style={inputStyle}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the post (shown in listings)"
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          {/* AI Summary */}
          <div>
            <label style={labelStyle}>AI Summary (Overview)</label>
            <textarea
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
              placeholder="Short AI overview shown at the top of the article"
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          {/* Key Points */}
          <div>
            <label style={labelStyle}>Key Points (one per line)</label>
            <textarea
              value={keyPointsText}
              onChange={(e) => setKeyPointsText(e.target.value)}
              placeholder={"Point one\nPoint two\nPoint three"}
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          {/* FAQ */}
          <div>
            <label style={labelStyle}>FAQ (Q/A blocks)</label>
            <textarea
              value={faqsText}
              onChange={(e) => setFaqsText(e.target.value)}
              placeholder={"Q: Your first question?\nA: Answer text here.\n\nQ: Second question?\nA: Second answer."}
              rows={10}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            />
            <p style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}>
              FAQ renders as a collapsible section with FAQPage schema on the live article page.
            </p>
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}>Content</label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your blog post content..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Status */}
          <div
            style={{
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setStatus("draft")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: status === "draft" ? "#D09947" : "#1a1a1a",
                  color: status === "draft" ? "#000" : "#C5C6C9",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("published")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: status === "published" ? "#22c55e" : "#1a1a1a",
                  color: status === "published" ? "#000" : "#C5C6C9",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Published
              </button>
            </div>
          </div>

          {/* Category */}
          <div
            style={{
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <label style={labelStyle}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "auto",
              }}
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div
            style={{
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <label style={labelStyle}>Author</label>
            <select
              value={authorRef}
              onChange={(e) => setAuthorRef(e.target.value)}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "auto",
              }}
            >
              <option value="">No Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {authors.length === 0 && (
              <p style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
                No authors yet.{" "}
                <Link href="/admin/authors/new" style={{ color: "#D09947" }}>
                  Create one
                </Link>
              </p>
            )}
          </div>

          {/* Featured Image */}
          <div
            style={{
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <ImageUpload value={featuredImage} onChange={setFeaturedImage} />
          </div>

          {/* SEO Settings */}
          <div
            style={{
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>
              SEO Settings
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>
                  Meta Title
                  <span style={{ color: "#666", fontWeight: 400, marginLeft: "6px" }}>
                    ({metaTitle.length}/60)
                  </span>
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "Uses post title if empty"}
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>
                  Meta Description
                  <span style={{ color: "#666", fontWeight: 400, marginLeft: "6px" }}>
                    ({metaDescription.length}/160)
                  </span>
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || "Uses excerpt if empty"}
                  rows={3}
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px", resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Post Info (only when editing) */}
          {isEditing && post && (
            <div
              style={{
                background: "#2a2a2a",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
                Post Info
              </h3>
              <div style={{ fontSize: "13px", color: "#888" }}>
                <p style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#C5C6C9" }}>Created:</strong>{" "}
                  {post.createdAt.toLocaleDateString()}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#C5C6C9" }}>Updated:</strong>{" "}
                  {post.updatedAt.toLocaleDateString()}
                </p>
                {post.publishedAt && (
                  <p>
                    <strong style={{ color: "#C5C6C9" }}>Published:</strong>{" "}
                    {post.publishedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
