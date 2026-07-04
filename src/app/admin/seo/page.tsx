"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAllPageMeta, upsertPageMeta } from "@/lib/pageMeta";
import { PageMeta, DEFAULT_PAGE_META } from "@/types/pageMeta";
import { Save, RefreshCw } from "lucide-react";

interface PageMetaForm {
  pageSlug: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  defaultTitle: string;
  defaultDescription: string;
  isSaving: boolean;
  isDirty: boolean;
}

export default function SEOSettingsPage() {
  const [forms, setForms] = useState<PageMetaForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveAllStatus, setSaveAllStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    loadPageMeta();
  }, []);

  const loadPageMeta = async () => {
    setLoading(true);
    try {
      // Auto-discover all routes from the filesystem
      const routesRes = await fetch("/api/admin/routes");
      const pages: { slug: string; name: string }[] = await routesRes.json();

      const existingMeta = await getAllPageMeta();
      const metaMap = new Map(existingMeta.map((m) => [m.pageSlug, m]));

      const initialForms: PageMetaForm[] = pages.map((page) => {
        const existing = metaMap.get(page.slug);
        const defaults = DEFAULT_PAGE_META[page.slug] || { title: "", description: "" };

        return {
          pageSlug: page.slug,
          pageName: page.name,
          metaTitle: existing?.metaTitle || "",
          metaDescription: existing?.metaDescription || "",
          defaultTitle: defaults.title,
          defaultDescription: defaults.description,
          isSaving: false,
          isDirty: false,
        };
      });

      setForms(initialForms);
    } catch (error) {
      console.error("Error loading page meta:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (index: number, field: "metaTitle" | "metaDescription", value: string) => {
    setForms((prev) =>
      prev.map((form, i) =>
        i === index ? { ...form, [field]: value, isDirty: true } : form
      )
    );
  };

  const saveForm = async (index: number) => {
    const form = forms[index];
    setForms((prev) =>
      prev.map((f, i) => (i === index ? { ...f, isSaving: true } : f))
    );

    try {
      await upsertPageMeta({
        pageSlug: form.pageSlug,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
      });

      setForms((prev) =>
        prev.map((f, i) => (i === index ? { ...f, isSaving: false, isDirty: false } : f))
      );
    } catch (error) {
      console.error("Error saving page meta:", error);
      setForms((prev) =>
        prev.map((f, i) => (i === index ? { ...f, isSaving: false } : f))
      );
      alert("Failed to save. Please try again.");
    }
  };

  const saveAll = async () => {
    setSaveAllStatus("saving");
    try {
      const dirtyForms = forms.filter((f) => f.isDirty);
      await Promise.all(
        dirtyForms.map((form) =>
          upsertPageMeta({
            pageSlug: form.pageSlug,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
          })
        )
      );

      setForms((prev) => prev.map((f) => ({ ...f, isDirty: false })));
      setSaveAllStatus("success");
      setTimeout(() => setSaveAllStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving all:", error);
      setSaveAllStatus("error");
      setTimeout(() => setSaveAllStatus("idle"), 2000);
    }
  };

  const resetToDefault = (index: number) => {
    const form = forms[index];
    setForms((prev) =>
      prev.map((f, i) =>
        i === index
          ? {
              ...f,
              metaTitle: "",
              metaDescription: "",
              isDirty: true,
            }
          : f
      )
    );
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "6px",
    color: "#FFFFFF",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    color: "#C5C6C9",
    fontSize: "13px",
    marginBottom: "6px",
    fontWeight: 500 as const,
  };

  const hasDirtyForms = forms.some((f) => f.isDirty);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading SEO settings...
        </div>
      </AdminLayout>
    );
  }

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
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
            SEO Settings
          </h1>
          <p style={{ color: "#888", fontSize: "14px" }}>
            Manage meta titles and descriptions for all pages
          </p>
        </div>

        {hasDirtyForms && (
          <button
            onClick={saveAll}
            disabled={saveAllStatus === "saving"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background:
                saveAllStatus === "success"
                  ? "#22c55e"
                  : saveAllStatus === "error"
                  ? "#ef4444"
                  : "#D09947",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              cursor: saveAllStatus === "saving" ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Save size={18} />
            {saveAllStatus === "saving"
              ? "Saving..."
              : saveAllStatus === "success"
              ? "Saved!"
              : saveAllStatus === "error"
              ? "Error"
              : "Save All Changes"}
          </button>
        )}
      </div>

      {/* Page Meta Forms */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {forms.map((form, index) => (
          <div
            key={form.pageSlug}
            style={{
              background: "#1f1f1f",
              border: form.isDirty ? "1px solid #D09947" : "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            {/* Page Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h3 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 600, margin: 0 }}>
                  {form.pageName}
                </h3>
                <span style={{ color: "#666", fontSize: "13px" }}>{form.pageSlug}</span>
                {form.isDirty && (
                  <span
                    style={{
                      padding: "2px 8px",
                      background: "#D09947",
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 600,
                      borderRadius: "4px",
                    }}
                  >
                    Unsaved
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => resetToDefault(index)}
                  title="Reset to defaults"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    background: "#2a2a2a",
                    border: "none",
                    borderRadius: "6px",
                    color: "#888",
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => saveForm(index)}
                  disabled={form.isSaving || !form.isDirty}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    background: form.isDirty ? "#D09947" : "#333",
                    color: form.isDirty ? "#000" : "#666",
                    border: "none",
                    borderRadius: "6px",
                    cursor: form.isSaving || !form.isDirty ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  <Save size={14} />
                  {form.isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Meta Title */}
              <div>
                <label style={labelStyle}>
                  Meta Title
                  <span style={{ color: "#666", fontWeight: 400, marginLeft: "8px" }}>
                    ({form.metaTitle.length}/60 recommended)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => updateForm(index, "metaTitle", e.target.value)}
                  placeholder={form.defaultTitle}
                  style={inputStyle}
                />
                <p style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
                  Default: {form.defaultTitle}
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label style={labelStyle}>
                  Meta Description
                  <span style={{ color: "#666", fontWeight: 400, marginLeft: "8px" }}>
                    ({form.metaDescription.length}/160 recommended)
                  </span>
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => updateForm(index, "metaDescription", e.target.value)}
                  placeholder={form.defaultDescription}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <p style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>
                  Default: {form.defaultDescription.substring(0, 80)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px 20px",
          background: "rgba(208, 153, 71, 0.1)",
          border: "1px solid rgba(208, 153, 71, 0.3)",
          borderRadius: "8px",
        }}
      >
        <p style={{ color: "#D09947", fontSize: "14px", margin: 0 }}>
          <strong>Note:</strong> Leave fields empty to use default values. For blog posts, you can
          set individual meta tags when creating or editing each post.
        </p>
      </div>
    </AdminLayout>
  );
}
