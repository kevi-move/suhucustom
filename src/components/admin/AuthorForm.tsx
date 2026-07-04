"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./TiptapEditor";
import { ImageUpload } from "./ImageUpload";
import { Author, AuthorInput } from "@/types/blog";
import { createAuthor, updateAuthor } from "@/lib/authors";
import { generateSlug } from "@/lib/blog";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface AuthorFormProps {
  author?: Author;
  isEditing?: boolean;
}

export function AuthorForm({ author, isEditing = false }: AuthorFormProps) {
  const [name, setName] = useState(author?.name || "");
  const [slug, setSlug] = useState(author?.slug || "");
  const [bio, setBio] = useState(author?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(author?.avatarUrl || "");
  const [email, setEmail] = useState(author?.email || "");
  const [website, setWebsite] = useState(author?.website || "");
  const [socialTwitter, setSocialTwitter] = useState(author?.socialTwitter || "");
  const [socialLinkedin, setSocialLinkedin] = useState(author?.socialLinkedin || "");
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  const router = useRouter();

  useEffect(() => {
    if (autoSlug && name) {
      setSlug(generateSlug(name));
    }
  }, [name, autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const input: AuthorInput = {
        name,
        slug,
        bio,
        avatarUrl: avatarUrl || undefined,
        email: email || undefined,
        website: website || undefined,
        socialTwitter: socialTwitter || undefined,
        socialLinkedin: socialLinkedin || undefined,
      };

      if (isEditing && author) {
        await updateAuthor(author.id, input);
      } else {
        await createAuthor(input);
      }

      router.push("/admin/authors");
    } catch (error: unknown) {
      console.error("Error saving author:", error);
      const msg = error instanceof Error ? error.message : String(error);
      alert(`Failed to save author: ${msg}`);
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
    display: "block" as const,
    color: "#C5C6C9",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: 500 as const,
  };

  const panelStyle = {
    background: "#2a2a2a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #333",
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
            href="/admin/authors"
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
            {isEditing ? "Edit Author" : "New Author"}
          </h1>
        </div>

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
          {saving ? "Saving..." : "Save Author"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter author name"
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
              placeholder="author-url-slug"
              style={inputStyle}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio</label>
            <TiptapEditor
              content={bio}
              onChange={setBio}
              placeholder="Write the author bio..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Avatar */}
          <div style={panelStyle}>
            <label style={labelStyle}>Avatar</label>
            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} />
          </div>

          {/* Contact Info */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Contact Info
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@example.com"
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={panelStyle}>
            <h3
              style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              Social Links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>X (Twitter) Handle</label>
                <input
                  type="text"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="username"
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: "13px" }}>LinkedIn Handle</label>
                <input
                  type="text"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  placeholder="username"
                  style={{ ...inputStyle, fontSize: "14px", padding: "10px 12px" }}
                />
              </div>
            </div>
          </div>

          {/* Author Info (only when editing) */}
          {isEditing && author && (
            <div style={panelStyle}>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Author Info
              </h3>
              <div style={{ fontSize: "13px", color: "#888" }}>
                <p style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#C5C6C9" }}>Created:</strong>{" "}
                  {author.createdAt.toLocaleDateString()}
                </p>
                <p>
                  <strong style={{ color: "#C5C6C9" }}>Updated:</strong>{" "}
                  {author.updatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
