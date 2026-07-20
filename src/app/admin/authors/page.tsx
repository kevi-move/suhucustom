"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Author } from "@/types/blog";
import { fetchAllAuthorsAdmin, deleteAuthorAdmin } from "@/lib/authorAdminApi";
import { Plus, Edit, Trash2, UserCircle } from "lucide-react";
import Link from "next/link";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await fetchAllAuthorsAdmin();
      setAuthors(data);
    } catch (error) {
      console.error("Error loading authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${authorName}"? Posts by this author will have no author assigned.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await deleteAuthorAdmin(id);
      setAuthors(authors.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting author:", error);
      alert("Failed to delete author. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const thStyle = {
    padding: "16px 20px",
    textAlign: "left" as const,
    color: "#888",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
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
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }}>
            Authors
          </h1>
          <p style={{ color: "#888", marginTop: "4px" }}>
            {authors.length} {authors.length === 1 ? "author" : "authors"}
          </p>
        </div>

        <Link
          href="/admin/authors/new"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "#D09947",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Plus size={18} />
          New Author
        </Link>
      </div>

      {/* Authors list */}
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading authors...
        </div>
      ) : authors.length === 0 ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <UserCircle
            size={48}
            style={{ color: "#444", margin: "0 auto 16px" }}
          />
          <h3
            style={{
              color: "#fff",
              fontSize: "18px",
              marginBottom: "8px",
            }}
          >
            No authors yet
          </h3>
          <p style={{ color: "#888", marginBottom: "24px" }}>
            Create authors to assign to your blog posts.
          </p>
          <Link
            href="/admin/authors/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#D09947",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={18} />
            Create Author
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
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={{ ...thStyle, width: "120px" }}>Created</th>
                <th style={{ ...thStyle, textAlign: "right", width: "120px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr
                  key={author.id}
                  style={{ borderBottom: "1px solid #333" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {author.avatarUrl ? (
                        <img
                          src={resolveImageSrc(author.avatarUrl)}
                          alt={author.name}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #D09947, #EEC569)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFF",
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                        >
                          {author.name[0]?.toUpperCase() || "A"}
                        </div>
                      )}
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {author.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ color: "#888", fontSize: "14px" }}>
                      {author.email || "—"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    {author.createdAt.toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => router.push(`/admin/authors/${author.id}`)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#888",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id, author.name)}
                        disabled={deleting === author.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background:
                            deleting === author.id ? "#333" : "#2a2a2a",
                          borderRadius: "8px",
                          color:
                            deleting === author.id ? "#666" : "#ef4444",
                          border: "none",
                          cursor:
                            deleting === author.id
                              ? "not-allowed"
                              : "pointer",
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
