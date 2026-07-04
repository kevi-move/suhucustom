"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Category } from "@/types/blog";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories";
import { generateSlug } from "@/lib/blog";
import { Plus, Edit, Trash2, X, Check, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Add/Edit form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (autoSlug && name) {
      setSlug(generateSlug(name));
    }
  }, [name, autoSlug]);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setAutoSlug(true);
    setSaving(false);
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setAutoSlug(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name: name.trim(), slug: slug.trim() });
      } else {
        await createCategory({ name: name.trim(), slug: slug.trim() });
      }
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"? Posts using this category will become uncategorized.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "14px",
    outline: "none",
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
            Categories
          </h1>
          <p style={{ color: "#888", marginTop: "4px" }}>
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
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
            }}
          >
            <Plus size={18} />
            New Category
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            {editingId ? "Edit Category" : "New Category"}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "16px",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  color: "#C5C6C9",
                  fontSize: "13px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Manufacturing Tips"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "#C5C6C9",
                  fontSize: "13px",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Slug
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
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value);
                }}
                placeholder="category-slug"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: saving ? "#666" : "#D09947",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
                title={editingId ? "Save" : "Add"}
              >
                <Check size={18} />
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  background: "#2a2a2a",
                  color: "#888",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories list */}
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading categories...
        </div>
      ) : categories.length === 0 && !showForm ? (
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <Tag
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
            No categories yet
          </h3>
          <p style={{ color: "#888", marginBottom: "24px" }}>
            Create categories to organize your blog posts.
          </p>
          <button
            onClick={() => setShowForm(true)}
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
            }}
          >
            <Plus size={18} />
            Create Category
          </button>
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
                  Name
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
                  }}
                >
                  Slug
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
                  Created
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
                    width: "120px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  style={{ borderBottom: "1px solid #333" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {category.name}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ color: "#666", fontSize: "14px" }}>
                      /{category.slug}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    {category.createdAt.toLocaleDateString()}
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
                        onClick={() => startEdit(category)}
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
                        onClick={() =>
                          handleDelete(category.id, category.name)
                        }
                        disabled={deleting === category.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background:
                            deleting === category.id ? "#333" : "#2a2a2a",
                          borderRadius: "8px",
                          color:
                            deleting === category.id ? "#666" : "#ef4444",
                          border: "none",
                          cursor:
                            deleting === category.id
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
