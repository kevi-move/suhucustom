"use client";
import { resolveImageSrc } from "@/lib/imageFallback";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadImageFile } from "@/lib/uploadImage";
interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Featured Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          color: "#C5C6C9",
          fontSize: "14px",
          marginBottom: "8px",
          fontWeight: 500,
        }}
      >
        {label}
      </label>

      {value ? (
        <div
          style={{
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#1a1a1a",
          }}
        >
          <Image
            src={resolveImageSrc(value)}
            alt="Featured"
            width={800}
            height={400}
            quality={90}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              objectFit: "cover",
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              width: "32px",
              height: "32px",
              background: "rgba(0,0,0,0.7)",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? "#D09947" : "#444"}`,
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            background: dragActive ? "rgba(208,153,71,0.05)" : "#1a1a1a",
            transition: "all 0.2s",
          }}
        >
          {uploading ? (
            <div style={{ color: "#D09947" }}>
              <Loader2 size={40} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
              <p style={{ marginTop: "12px", fontSize: "14px" }}>Uploading...</p>
              <style jsx>{`
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          ) : (
            <>
              <Upload size={40} style={{ color: "#666", margin: "0 auto" }} />
              <p style={{ color: "#C5C6C9", marginTop: "12px", fontSize: "14px" }}>
                Click to upload or drag and drop
              </p>
              <p style={{ color: "#666", marginTop: "4px", fontSize: "12px" }}>
                PNG, JPG, GIF or WebP (max 10MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && (
        <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
