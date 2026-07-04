"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFrontendPageUrl } from "@/lib/frontendPreview";

export function CmsModeToggle() {
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetch("/api/cms/mode", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  const toggle = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms/mode", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnabled(Boolean(data?.enabled));
        if (data?.enabled) {
          window.open(getFrontendPageUrl("/services/t-shirts"), "_blank", "noopener,noreferrer");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={saving}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: enabled ? "1px solid #D09947" : "1px solid #444",
          background: enabled ? "rgba(208, 153, 71, 0.15)" : "#1a1a1a",
          color: enabled ? "#D09947" : "#aaa",
          fontSize: "13px",
          fontWeight: enabled ? 600 : 400,
          cursor: saving ? "wait" : "pointer",
          textAlign: "left",
        }}
      >
        {saving ? "切换中…" : enabled ? "前台编辑：已开启" : "前台编辑：已关闭"}
      </button>
      <p style={{ margin: 0, fontSize: 11, color: "#666", lineHeight: 1.45 }}>
        开启后打开前台页面（首页、Blog、服务页等），点击文字改文案、点击图片换图，右下角保存
      </p>
    </div>
  );
}
