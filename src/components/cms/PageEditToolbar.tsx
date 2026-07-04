"use client";

import { useCMS } from "@/contexts/CMSContext";

export function PageEditToolbar() {
  const { isEditMode, toggleEditMode, saveAll, resetAll, saving } = useCMS();

  if (!isEditMode) {
    return (
      <button
        type="button"
        onClick={toggleEditMode}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 60,
          background: "#111",
          color: "#D09947",
          border: "1px solid #D09947",
          borderRadius: 999,
          padding: "10px 16px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        开始编辑
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      <p
        style={{
          margin: 0,
          padding: "6px 12px",
          background: "rgba(17,17,17,0.92)",
          color: "#D09947",
          border: "1px solid #444",
          borderRadius: 8,
          fontSize: 12,
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        编辑模式：点击文字修改文案，图片右下角可上传
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          background: "rgba(17,17,17,0.96)",
          border: "1px solid #444",
          borderRadius: 12,
          padding: 8,
        }}
      >
        <button
          type="button"
          disabled={saving}
          onClick={() => void saveAll()}
          style={{
            background: "#D09947",
            color: "#111",
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? "wait" : "pointer",
          }}
        >
          {saving ? "保存中…" : "保存"}
        </button>
        <button
          type="button"
          onClick={resetAll}
          style={{
            background: "#2a2a2a",
            color: "#ddd",
            border: "1px solid #555",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          撤销
        </button>
        <button
          type="button"
          onClick={toggleEditMode}
          style={{
            background: "#2a2a2a",
            color: "#ddd",
            border: "1px solid #555",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          退出编辑
        </button>
      </div>
    </div>
  );
}
