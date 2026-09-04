"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { uploadImageFile } from "@/lib/uploadImage";
import { extractCaseStudyImageSrc } from "@/lib/caseStudyImage";
import {
  applySavedVisualOverrides,
  captureSanitizedHtml,
  stripEditArtifactsFromDom,
  stripVisualEditArtifacts,
} from "@/lib/visualPageHtml";
import { SERVICE_VISUAL_MODE } from "@/lib/serviceVisualMode";
import {
  CASE_STUDY_IMAGE_FRAME_CLASS,
  CASE_STUDY_IMAGE_IMG_CLASS,
  CASE_STUDY_IMAGE_SLOT_CLASS,
} from "@/components/services/CaseStudyImage";

interface VisualPageEditorProps {
  pageSlug: string;
  modeEnabled: boolean;
  /** Trusted full-page HTML (visual-v2). When set, this is the live page. */
  initialHtml?: string;
  /** Legacy / any autoHtml used only to restore uploaded image URLs onto React children. */
  imageHtml?: string;
  children: React.ReactNode;
}

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,strong,em,small,li,dt,dd,blockquote";

const HERO_ROOT_SELECTOR = ".relative.overflow-hidden";

function findHeroBackgroundImg(heroRoot: Element): HTMLImageElement | null {
  const bg = heroRoot.querySelector(":scope > .absolute.inset-0");
  const img = bg?.querySelector(":scope > img");
  return img instanceof HTMLImageElement ? img : null;
}

function extractHeroImageSrc(html: string): string | undefined {
  const trimmed = html.trim();
  if (!trimmed || typeof DOMParser === "undefined") return undefined;

  const doc = new DOMParser().parseFromString(`<div id="__vedit_hero__">${trimmed}</div>`, "text/html");
  const root = doc.getElementById("__vedit_hero__");
  if (!root) return undefined;

  const hero = root.querySelector(HERO_ROOT_SELECTOR);
  if (!hero) return undefined;

  return findHeroBackgroundImg(hero)?.getAttribute("src")?.trim() || undefined;
}

function restoreSavedHeroImage(root: HTMLElement, savedHtml: string) {
  const savedSrc = extractHeroImageSrc(savedHtml);
  if (!savedSrc) return;

  const hero = root.querySelector(HERO_ROOT_SELECTOR);
  const img = hero ? findHeroBackgroundImg(hero) : null;
  if (img instanceof HTMLImageElement) {
    img.src = savedSrc;
  }
}

function configureHeroImageEditing(root: HTMLElement, enabled: boolean) {
  root.querySelectorAll(HERO_ROOT_SELECTOR).forEach((hero) => {
    const heroEl = hero as HTMLElement;
    const bgImg = findHeroBackgroundImg(heroEl);
    const content = heroEl.querySelector(":scope > .relative");
    const contentEl = content as HTMLElement | null;
    const bgLayer = heroEl.querySelector(":scope > .absolute.inset-0");

    if (!bgImg || !contentEl) return;

    if (enabled) {
      contentEl.style.pointerEvents = "none";
      contentEl.querySelectorAll(`${TEXT_SELECTOR}, button, a, nav`).forEach((node) => {
        (node as HTMLElement).style.pointerEvents = "auto";
      });
      bgLayer?.querySelectorAll(":scope > .absolute.inset-0").forEach((overlay) => {
        (overlay as HTMLElement).style.pointerEvents = "none";
      });
      bgImg.style.pointerEvents = "auto";
    } else {
      contentEl.style.pointerEvents = "";
      contentEl.querySelectorAll(`${TEXT_SELECTOR}, button, a, nav`).forEach((node) => {
        (node as HTMLElement).style.pointerEvents = "";
      });
      bgLayer?.querySelectorAll(":scope > .absolute.inset-0").forEach((overlay) => {
        (overlay as HTMLElement).style.pointerEvents = "";
      });
      bgImg.style.pointerEvents = "";
    }
  });
}

function restoreSavedCaseStudyImage(root: HTMLElement, savedHtml: string) {
  const savedSrc = extractCaseStudyImageSrc(savedHtml);
  if (!savedSrc) return;

  const img =
    root.querySelector("[data-vedit-image] img") ||
    root.querySelector(".case-study-photo-img") ||
    root.querySelector('[class*="col-span-2"] img');

  if (img instanceof HTMLImageElement) {
    img.src = savedSrc;
  }
}

function restoreSavedImages(root: HTMLElement, savedHtml: string) {
  restoreSavedHeroImage(root, savedHtml);
  restoreSavedCaseStudyImage(root, savedHtml);
  applySavedVisualOverrides(root, savedHtml);
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

function activateCustomizationTab(section: HTMLElement, optionId: string) {
  section.querySelectorAll("[data-vedit-customization-tab]").forEach((node) => {
    const btn = node as HTMLElement;
    const active = btn.getAttribute("data-vedit-customization-tab") === optionId;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.className = active
      ? "flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition border-l-[3px] border-amber-500 bg-amber-50 text-slate-900"
      : "flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition border-l-[3px] border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700";
  });

  section.querySelectorAll("[data-vedit-customization-id]").forEach((node) => {
    const img = node as HTMLImageElement;
    const active = img.getAttribute("data-vedit-customization-id") === optionId;
    img.className = active
      ? "h-auto min-h-[320px] w-full object-cover relative block"
      : "h-auto min-h-[320px] w-full object-cover pointer-events-none absolute inset-0 opacity-0";
    img.setAttribute("aria-hidden", active ? "false" : "true");
  });

  section.querySelectorAll("[data-vedit-customization-detail]").forEach((node) => {
    const panel = node as HTMLElement;
    const active = panel.getAttribute("data-vedit-customization-detail") === optionId;
    panel.className = active
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative"
      : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm pointer-events-none absolute inset-0 opacity-0";
    panel.setAttribute("aria-hidden", active ? "false" : "true");
  });
}

function hydrateSavedPageInteractions(
  root: HTMLElement,
  openModal: (input?: {
    productCategory?: string;
    sourcePage?: string;
    title?: string;
  }) => void,
  pathname: string
) {
  root.querySelectorAll('[data-vedit-quote="true"]').forEach((node) => {
    const btn = node as HTMLElement;
    if (btn.dataset.veditBound === "1") return;
    btn.dataset.veditBound = "1";
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openModal({
        productCategory: btn.getAttribute("data-vedit-quote-category") || undefined,
        title: btn.getAttribute("data-vedit-quote-title") || undefined,
        sourcePage: pathname || "/",
      });
    });
  });

  root.querySelectorAll('[data-vedit-customization-root="true"]').forEach((node) => {
    const section = node as HTMLElement;
    section.querySelectorAll("[data-vedit-customization-tab]").forEach((tabNode) => {
      const tab = tabNode as HTMLElement;
      if (tab.dataset.veditBound === "1") return;
      tab.dataset.veditBound = "1";
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-vedit-customization-tab");
        if (id) activateCustomizationTab(section, id);
      });
    });
  });

  root.querySelectorAll("[data-vedit-features-root='true']").forEach((sectionNode) => {
    const section = sectionNode as HTMLElement;
    const scroller = section.querySelector(
      "[data-vedit-features-scroller='true']"
    ) as HTMLElement | null;
    if (!scroller) return;

    section.querySelectorAll("[data-vedit-features-scroll]").forEach((node) => {
      const btn = node as HTMLElement;
      if (btn.dataset.veditBound === "1") return;
      btn.dataset.veditBound = "1";
      const direction = btn.getAttribute("data-vedit-features-scroll") === "left" ? -1 : 1;
      btn.addEventListener("click", () => {
        const cardWidth = scroller.firstElementChild?.clientWidth ?? 300;
        scroller.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
      });
    });
  });

  // Fallback for Features carousels saved before data-vedit-features-* attrs existed.
  root.querySelectorAll('[aria-label="Scroll left"], [aria-label="Scroll right"]').forEach((node) => {
    const btn = node as HTMLElement;
    if (btn.dataset.veditBound === "1") return;
    btn.dataset.veditBound = "1";
    const direction = btn.getAttribute("aria-label") === "Scroll left" ? -1 : 1;
    btn.addEventListener("click", () => {
      let section: HTMLElement | null =
        btn.closest("[data-vedit-features-root='true']") as HTMLElement | null;
      if (!section) {
        let cursor: HTMLElement | null = btn.parentElement;
        while (cursor && cursor !== root) {
          if (cursor.querySelector(":scope .overflow-x-auto, :scope [data-vedit-features-scroller]")) {
            section = cursor;
            break;
          }
          cursor = cursor.parentElement;
        }
      }
      const scroller =
        (section?.querySelector("[data-vedit-features-scroller='true']") as HTMLElement | null) ||
        (section?.querySelector(".overflow-x-auto") as HTMLElement | null);
      if (!scroller) return;
      const cardWidth = scroller.firstElementChild?.clientWidth ?? 300;
      scroller.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
    });
  });
}

export function VisualPageEditor({
  pageSlug,
  modeEnabled,
  initialHtml,
  imageHtml,
  children,
}: VisualPageEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useContactModal();
  const { isAdmin, loading } = useAuth();
  const editable = !loading && isAdmin && modeEnabled;
  const rootRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const serverPageHtml = stripVisualEditArtifacts((initialHtml || "").trim());
  const serverImageHtml = stripVisualEditArtifacts((imageHtml || "").trim());
  const [snapshotHtml, setSnapshotHtml] = useState(serverPageHtml);
  const useHtmlSource = Boolean(snapshotHtml);
  const cleanedSnapshot = useHtmlSource ? stripVisualEditArtifacts(snapshotHtml) : "";
  const initialSnapshot = useRef<string>(serverPageHtml);

  useEffect(() => {
    if (!serverPageHtml) return;
    setSnapshotHtml(serverPageHtml);
    initialSnapshot.current = serverPageHtml;
  }, [serverPageHtml]);

  const hydrateRoot = useCallback(
    (root: HTMLElement) => {
      hydrateSavedPageInteractions(root, openModal, pathname || "/");
    },
    [openModal, pathname]
  );

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

    configureHeroImageEditing(root, enabled);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (useHtmlSource) {
      hydrateRoot(root);
    }

    if (editable) {
      migrateCaseStudyPlaceholders(root);
      normalizeCaseStudyPhotos(root);
      if (!useHtmlSource && serverImageHtml) {
        restoreSavedImages(root, serverImageHtml);
      }
      setEditableDomState(true);
      initialSnapshot.current = captureSanitizedHtml(root);
    } else {
      setEditableDomState(false);
      stripEditArtifactsFromDom(root);
      if (useHtmlSource) {
        hydrateRoot(root);
      } else if (serverImageHtml) {
        restoreSavedImages(root, serverImageHtml);
      }
    }
  }, [
    cleanedSnapshot,
    useHtmlSource,
    serverImageHtml,
    editable,
    hydrateRoot,
    setEditableDomState,
  ]);

  useEffect(() => {
    if (editable) return;
    const frame = window.requestAnimationFrame(() => {
      if (rootRef.current) stripEditArtifactsFromDom(rootRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [editable, cleanedSnapshot]);

  const resolveEditableImage = (target: HTMLElement): HTMLImageElement | null => {
    if (target.tagName.toLowerCase() === "img") {
      return target as HTMLImageElement;
    }

    if (!target.closest(`${TEXT_SELECTOR}, button, a, nav`)) {
      const hero = target.closest(HERO_ROOT_SELECTOR);
      if (hero) {
        const heroImg = findHeroBackgroundImg(hero);
        if (heroImg) return heroImg;
      }
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

      let existing: Record<string, unknown> = {};
      try {
        const existingRes = await fetch(
          `/api/cms/content/?pageSlug=${encodeURIComponent(pageSlug)}`,
          { credentials: "same-origin", cache: "no-store" }
        );
        if (existingRes.ok) {
          const existingData = (await existingRes.json()) as {
            content?: Record<string, unknown>;
          };
          if (existingData.content && typeof existingData.content === "object") {
            existing = existingData.content;
          }
        }
      } catch {
        // best-effort merge
      }

      const res = await fetch("/api/cms/content/", {
        method: "PUT",
        credentials: "same-origin",
        redirect: "error",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug,
          content: {
            ...existing,
            autoHtml: html,
            mode: SERVICE_VISUAL_MODE,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data?.error || `保存失败 (${res.status})`);
      }
      initialSnapshot.current = html;
      setSnapshotHtml(html);
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
    window.location.reload();
  };

  return (
    <>
      <div
        ref={rootRef}
        onClick={handleRootClick}
        suppressHydrationWarning
        {...(useHtmlSource ? { dangerouslySetInnerHTML: { __html: cleanedSnapshot } } : {})}
      >
        {!useHtmlSource ? children : null}
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
            点击文字修改；点击图片、Case Study 或 Hero 背景空白处可上传。修改后请点「保存」。
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
                await fetch("/api/cms/mode/", {
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
