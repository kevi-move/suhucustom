const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,strong,em,small,li,dt,dd,blockquote,a";

function stripEditArtifactsFromElement(root: ParentNode) {
  root.querySelectorAll(TEXT_SELECTOR).forEach((node) => {
    const el = node as HTMLElement;
    el.removeAttribute("contenteditable");
    el.style.outline = "";
    el.style.outlineOffset = "";
  });

  root.querySelectorAll("img").forEach((node) => {
    const el = node as HTMLImageElement;
    el.removeAttribute("contenteditable");
    el.style.outline = "";
    el.style.cursor = "";
  });

  root.querySelectorAll("[data-vedit-image]").forEach((node) => {
    const el = node as HTMLElement;
    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.cursor = "";
  });
}

const LIGHT_SURFACE_RE = /\b(bg-white|bg-slate-50|bg-slate-100|bg-amber-50)\b/;
const LIGHT_BAD_TEXT_RE = /\b(text-white|text-slate-100|text-slate-200|text-slate-300)\b/;
const ANY_TEXT_COLOR_RE = /\btext-(?:slate|gray|zinc|neutral|stone|black|white|amber|red|blue|green)-\S+\b/;

/** Fix unreadable text that contentEditable / bad snapshots leave on light surfaces. */
function repairTextContrast(root: ParentNode) {
  root.querySelectorAll(TEXT_SELECTOR).forEach((node) => {
    const el = node as HTMLElement;

    // Drop browser-injected inline colors from contentEditable.
    if (el.style.color) el.style.color = "";
    if (el.style.opacity) el.style.opacity = "";
    el.removeAttribute("color");

    let light = false;
    let cursor: HTMLElement | null = el.parentElement;
    while (cursor) {
      const cls = cursor.getAttribute("class") || "";
      if (LIGHT_SURFACE_RE.test(cls)) {
        light = true;
        break;
      }
      if (/\b(bg-slate-900|bg-slate-800|bg-black|bg-neutral-900)\b/.test(cls)) {
        break;
      }
      cursor = cursor.parentElement;
    }
    if (!light) return;

    let cls = el.getAttribute("class") || "";
    if (LIGHT_BAD_TEXT_RE.test(cls)) {
      cls = cls.replace(new RegExp(LIGHT_BAD_TEXT_RE.source, "g"), "").replace(/\s+/g, " ").trim();
    }
    if (!ANY_TEXT_COLOR_RE.test(cls)) {
      cls = `${cls} text-slate-600`.trim();
    }
    if (cls) el.setAttribute("class", cls);
  });

  root.querySelectorAll("font[color]").forEach((node) => {
    const font = node as HTMLElement;
    const span = font.ownerDocument!.createElement("span");
    span.innerHTML = font.innerHTML;
    font.replaceWith(span);
  });
}

/** Remove edit-mode attributes/styles before persisting or displaying saved HTML. */
export function stripVisualEditArtifacts(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return trimmed;

  if (typeof DOMParser === "undefined") {
    return trimmed
      .replace(/\scontenteditable="(?:true|false)"/gi, "")
      .replace(/\scontenteditable='(?:true|false)'/gi, "");
  }

  const doc = new DOMParser().parseFromString(`<div id="__vedit_root__">${trimmed}</div>`, "text/html");
  const root = doc.getElementById("__vedit_root__");
  if (!root) return trimmed;

  stripEditArtifactsFromElement(root);
  repairTextContrast(root);
  return root.innerHTML;
}

export function stripEditArtifactsFromDom(root: HTMLElement) {
  stripEditArtifactsFromElement(root);
  repairTextContrast(root);
}

export function captureSanitizedHtml(root: HTMLElement): string {
  return stripVisualEditArtifacts(root.innerHTML);
}

function isPersistedImageSrc(src: string | null | undefined): boolean {
  const value = (src ?? "").trim();
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

function findLiveImageForSaved(
  liveRoot: HTMLElement,
  liveImgs: HTMLImageElement[],
  savedImg: HTMLImageElement,
  index: number
): HTMLImageElement | undefined {
  const optionId = savedImg.getAttribute("data-vedit-customization-id")?.trim();
  if (optionId) {
    const byOption = liveRoot.querySelector(
      `img[data-vedit-customization-id="${optionId}"]`
    );
    if (byOption instanceof HTMLImageElement) return byOption;
  }

  const alt = savedImg.getAttribute("alt")?.trim();
  if (alt) {
    const byAlt = liveImgs.find((img) => img.getAttribute("alt")?.trim() === alt);
    if (byAlt) return byAlt;
  }

  return liveImgs[index];
}

/** Apply saved CMS image URLs onto the live React-rendered service page. */
export function applySavedVisualOverrides(liveRoot: HTMLElement, savedHtml: string) {
  const cleaned = stripVisualEditArtifacts(savedHtml);
  if (!cleaned || typeof DOMParser === "undefined") return;

  const doc = new DOMParser().parseFromString(
    `<div id="__vedit_saved__">${cleaned}</div>`,
    "text/html"
  );
  const savedRoot = doc.getElementById("__vedit_saved__");
  if (!savedRoot) return;

  const savedImgs = Array.from(savedRoot.querySelectorAll("img"));
  const liveImgs = Array.from(liveRoot.querySelectorAll("img"));

  savedImgs.forEach((savedImg, index) => {
    const savedSrc = savedImg.getAttribute("src")?.trim();
    if (!savedSrc || !isPersistedImageSrc(savedSrc)) return;

    const liveImg = findLiveImageForSaved(liveRoot, liveImgs, savedImg, index);

    if (liveImg instanceof HTMLImageElement) {
      liveImg.src = savedSrc;
    }
  });
}
