"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BlogPost } from "@/types/blog";
import { fetchAllPostsAdmin, deletePostAdmin } from "@/lib/blogAdminApi";
import { getFrontendBlogPostUrl } from "@/lib/frontendPreview";
import { Plus, Edit, Trash2, Eye, FileText, Monitor } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchAllPostsAdmin();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(id);

    try {
      await deletePostAdmin(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }}>Blog Posts</h1>
          <p style={{ color: "#888", marginTop: "4px" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#D09947",
            color: "#000",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      {/* Posts list */}
      {loading ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#888",
          }}
        >
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <FileText size={48} style={{ color: "#444", margin: "0 auto 16px" }} />
          <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "8px" }}>No posts yet</h3>
          <p style={{ color: "#888", marginBottom: "24px" }}>
            Get started by creating your first blog post.
          </p>
          <Link
            href="/admin/blog/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#D09947",
              color: "#000",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Plus size={18} />
            Create Post
          </Link>
        </div>
      ) : (
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Post
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    width: "100px",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    width: "120px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "right",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    width: "150px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom: "1px solid #333",
                  }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {post.featuredImage ? (
                        <Image
                          src={resolveImageSrc(post.featuredImage)}
                          alt={post.title}
                          width={80}
                          height={50}
                          style={{
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "80px",
                            height: "50px",
                            background: "#2a2a2a",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FileText size={20} style={{ color: "#444" }} />
                        </div>
                      )}
                      <div>
                        <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 500 }}>
                          {post.title}
                        </h3>
                        <p style={{ color: "#666", fontSize: "13px", marginTop: "2px" }}>
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 500,
                        background:
                          post.status === "published"
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(234, 179, 8, 0.1)",
                        color: post.status === "published" ? "#22c55e" : "#eab308",
                      }}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", color: "#888", fontSize: "14px" }}>
                    {post.createdAt.toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <Link
                        href={`/admin/blog/${post.id}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#888",
                          textDecoration: "none",
                        }}
                        title="页面预览"
                      >
                        <Monitor size={16} />
                      </Link>
                      {post.status === "published" && getFrontendBlogPostUrl(post.slug) && (
                        <Link
                          href={getFrontendBlogPostUrl(post.slug)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            background: "#2a2a2a",
                            borderRadius: "8px",
                            color: "#888",
                            textDecoration: "none",
                          }}
                          title="在前台站点预览（需配置 NEXT_PUBLIC_FRONTEND_URL）"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#888",
                          textDecoration: "none",
                        }}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deleting === post.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background: deleting === post.id ? "#333" : "#2a2a2a",
                          borderRadius: "8px",
                          color: deleting === post.id ? "#666" : "#ef4444",
                          border: "none",
                          cursor: deleting === post.id ? "not-allowed" : "pointer",
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
