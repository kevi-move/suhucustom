"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImageFile } from "@/lib/uploadImage";
import { extractCaseStudyImageSrc, isPlaceholderImageUrl } from "@/lib/caseStudyImage";
import {
  captureSanitizedHtml,
  stripEditArtifactsFromDom,
  stripVisualEditArtifacts,
} from "@/lib/visualPageHtml";
import {
  CASE_STUDY_IMAGE_FRAME_CLASS,
  CASE_STUDY_IMAGE_IMG_CLASS,
  CASE_STUDY_IMAGE_SLOT_CLASS,
} from "@/components/services/CaseStudyImage";

interface VisualPageEditorProps {
  pageSlug: string;
  modeEnabled: boolean;
  initialHtml?: string;
  children: React.ReactNode;
}

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,strong,em,small,li,dt,dd,blockquote";

function restoreSavedCaseStudyImage(root: HTMLElement, savedHtml: string) {
  const savedSrc = extractCaseStudyImageSrc(savedHtml);
  if (!savedSrc) return;

  const img =
    root.querySelector("[data-vedit-image] img") ||
    root.querySelector(".case-study-photo-img") ||
    root.querySelector('[class*="col-span-2"] img');

  if (img instanceof HTMLImageElement && isPlaceholderImageUrl(img.getAttribute("src"))) {
    img.src = savedSrc;
  }
}

function normalizeCaseStudyPhotos(root: HTMLElement) {
  root.querySelectorAll("[data-vedit-image]").forEach((slot) => {
    const el = slot as HTMLElement;
    el.className = CASE_STUDY_IMAGE_SLOT_CLASS;

    let frame = el.querySelector(`.${CASE_STUDY_IMAGE_FRAME_CLASS}`);
    let img = el.querySelector("img");

    if (!img) return;

    img.className = CASE_STUDY_IMAGE_IMG_CLASS;

    if (!frame) {
      frame = document.createElement("div");
      frame.className = CASE_STUDY_IMAGE_FRAME_CLASS;
      el.innerHTML = "";
      frame.appendChild(img);
      el.appendChild(frame);
    }
  });
}

function migrateCaseStudyPlaceholders(root: HTMLElement) {
  root.querySelectorAll("p").forEach((node) => {
    if (node.textContent?.trim() !== "Project photo placeholder") return;
    const column = node.closest('[class*="col-span-2"]') as HTMLElement | null;
    if (!column || column.querySelector("img")) return;

    column.setAttribute("data-vedit-image", "true");
    column.setAttribute("data-vedit-alt", "Case study project photo");
    column.className = CASE_STUDY_IMAGE_SLOT_CLASS;
    column.innerHTML = `<div class="${CASE_STUDY_IMAGE_FRAME_CLASS}"><img src="/services/placeholder.svg" alt="Case study project photo" class="${CASE_STUDY_IMAGE_IMG_CLASS}" /></div>`;
  });
}

export function VisualPageEditor({
  pageSlug,
  modeEnabled,
  initialHtml,
  children,
}: VisualPageEditorProps) {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const editable = !loading && isAdmin && modeEnabled;
  const rootRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialSnapshot = useRef<string>(initialHtml || "");

  const renderedHtml = stripVisualEditArtifacts((initialHtml || "").trim());

  useEffect(() => {
    initialSnapshot.current = renderedHtml;
  }, [renderedHtml]);

  const setEditableDomState = useCallback((enabled: boolean) => {
    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll(TEXT_SELECTOR).forEach((node) => {
      const el = node as HTMLElement;
      if (el.closest("[data-no-vedit='true']")) return;
      if (el.closest("a[href]")) {
        el.contentEditable = "false";
        return;
      }
      el.contentEditable = enabled ? "true" : "false";
      if (enabled) {
        el.style.outline = "1px dashed rgba(208,153,71,0.55)";
        el.style.outlineOffset = "2px";
      } else {
        el.style.outline = "none";
      }
    });

    root.querySelectorAll("img").forEach((img) => {
      const el = img as HTMLImageElement;
      if (enabled) {
        el.style.cursor = "pointer";
        el.style.outline = "2px dashed rgba(208,153,71,0.45)";
      } else {
        el.style.cursor = "";
        el.style.outline = "none";
      }
    });

    root.querySelectorAll("[data-vedit-image]").forEach((slot) => {
      const el = slot as HTMLElement;
      if (enabled) {
        el.style.cursor = "pointer";
        el.style.outline = "2px dashed rgba(208,153,71,0.45)";
        el.style.outlineOffset = "2px";
      } else {
        el.style.cursor = "";
        el.style.outline = "none";
      }
    });
  }, []);

  useEffect(() => {
    if (editable) return;
    const frame = window.requestAnimationFrame(() => {
      if (rootRef.current) stripEditArtifactsFromDom(rootRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [editable, renderedHtml]);

  useEffect(() => {
    if (!editable) {
      setEditableDomState(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (rootRef.current) {
        migrateCaseStudyPlaceholders(rootRef.current);
        normalizeCaseStudyPhotos(rootRef.current);
        if (renderedHtml) restoreSavedCaseStudyImage(rootRef.current, renderedHtml);
        initialSnapshot.current = rootRef.current.innerHTML;
      }
      setEditableDomState(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editable, renderedHtml, setEditableDomState]);

  useEffect(() => {
    if (editable || !renderedHtml || !rootRef.current) return;
    normalizeCaseStudyPhotos(rootRef.current);
    restoreSavedCaseStudyImage(rootRef.current, renderedHtml);
  }, [editable, renderedHtml]);

  const resolveEditableImage = (target: HTMLElement): HTMLImageElement | null => {
    if (target.tagName.toLowerCase() === "img") {
      return target as HTMLImageElement;
    }

    const slot = target.closest("[data-vedit-image]") as HTMLElement | null;
    if (!slot) return null;

    let img = slot.querySelector("img");
    if (!img) {
      const frame = document.createElement("div");
      frame.className = CASE_STUDY_IMAGE_FRAME_CLASS;
      img = document.createElement("img");
      img.src = "/services/placeholder.svg";
      img.alt = slot.getAttribute("data-vedit-alt") || "Case study project photo";
      img.className = CASE_STUDY_IMAGE_IMG_CLASS;
      frame.appendChild(img);
      slot.className = CASE_STUDY_IMAGE_SLOT_CLASS;
      slot.innerHTML = "";
      slot.appendChild(frame);
    } else if (!img.classList.contains(CASE_STUDY_IMAGE_IMG_CLASS)) {
      img.classList.add(CASE_STUDY_IMAGE_IMG_CLASS);
    }
    return img;
  };

  const handleRootClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable) return;
    const img = resolveEditableImage(e.target as HTMLElement);
    if (!img) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedImg(img);
    fileInputRef.current?.click();
  };

  const uploadImageForSelected = async (file: File) => {
    if (!selectedImg) return;
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      selectedImg.src = url;
      setSelectedImg(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "上传失败");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    const root = rootRef.current;
    if (!root) return;
    setSaving(true);
    try {
      setEditableDomState(false);
      const html = captureSanitizedHtml(root);
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug,
          content: {
            autoHtml: html,
            mode: "visual-v1",
          },
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data?.error || "保存失败");
      initialSnapshot.current = html;
      router.refresh();
      alert("已保存");
    } catch (error) {
      alert(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
      if (editable) setEditableDomState(true);
    }
  };

  const reset = () => {
    if (editable) {
      window.location.reload();
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    root.innerHTML = initialSnapshot.current;
    setEditableDomState(false);
  };

  return (
    <>
      <div ref={rootRef} onClick={handleRootClick}>
        {children}
      </div>

      {editable && (
        <div
          data-no-vedit="true"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 70,
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
            点击文字直接修改；点击图片（或 Case Study 占位区）可上传替换
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
              onClick={() => void save()}
              disabled={saving}
              style={{
                background: "#D09947",
                color: "#111",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "保存中…" : "保存"}
            </button>
            <button
              type="button"
              onClick={reset}
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
              onClick={async () => {
                await fetch("/api/cms/mode", {
                  method: "PUT",
                  credentials: "same-origin",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ enabled: false }),
                });
                window.location.reload();
              }}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && !uploading) void uploadImageForSelected(file);
            }}
          />
        </div>
      )}
    </>
  );
}
