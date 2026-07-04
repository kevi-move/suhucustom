"use client";

import { useCMS } from "@/contexts/CMSContext";
import { resolveImageSrc } from "@/lib/imageFallback";
import { uploadImageFile } from "@/lib/uploadImage";
import { useState } from "react";

export function EditableImage({
  path,
  src,
  alt,
  className,
}: {
  path: string;
  src: string;
  alt: string;
  className?: string;
}) {
  const { isEditMode, getValue, getDisplayValue, setValue } = useCMS();
  const display = resolveImageSrc(getDisplayValue<string>(path, src));
  const editSrc = resolveImageSrc(getValue<string>(path, src));
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setValue(path, url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const shown = isEditMode ? editSrc : display;

  return (
    <div
      className="relative h-full w-full"
      style={
        isEditMode
          ? { outline: "2px dashed rgba(208,153,71,0.75)", outlineOffset: 2 }
          : undefined
      }
    >
      <img src={shown} alt={alt} className={`block ${className ?? "h-full w-full object-cover"}`} />
      {isEditMode && (
        <div
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 8,
            display: "flex",
            gap: 8,
            zIndex: 2,
          }}
        >
          <input
            value={getValue<string>(path, src)}
            onChange={(e) => setValue(path, e.target.value)}
            placeholder="图片 URL"
            style={{
              flex: 1,
              background: "rgba(17,17,17,0.9)",
              color: "#fff",
              border: "1px dashed #D09947",
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 12,
            }}
          />
          <label
            style={{
              background: "#D09947",
              color: "#111",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 600,
              cursor: uploading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {uploading ? "上传中…" : "上传图片"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
