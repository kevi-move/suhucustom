const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,strong,em,small,li,dt,dd,blockquote,a,summary";

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
  return root.innerHTML;
}

export function stripEditArtifactsFromDom(root: HTMLElement) {
  stripEditArtifactsFromElement(root);
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

/** Leaf text nodes (no nested editable text tags) — stable enough to rematch after React refresh. */
function getLeafTextElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll(TEXT_SELECTOR)).filter((node) => {
    const el = node as HTMLElement;
    if (el.closest("[data-no-vedit='true']")) return false;
    if (el.closest("script, style, noscript")) return false;
    return !el.querySelector(TEXT_SELECTOR);
  }) as HTMLElement[];
}

function applySavedTextOverrides(liveRoot: HTMLElement, savedRoot: HTMLElement) {
  const savedLeaves = getLeafTextElements(savedRoot);
  const liveLeaves = getLeafTextElements(liveRoot);
  if (savedLeaves.length === 0 || liveLeaves.length === 0) return;

  // Structure changed too much (page redesign) — skip text remap to avoid scrambled copy.
  const ratio =
    Math.min(savedLeaves.length, liveLeaves.length) /
    Math.max(savedLeaves.length, liveLeaves.length);
  if (ratio < 0.75) return;

  const count = Math.min(savedLeaves.length, liveLeaves.length);
  for (let i = 0; i < count; i++) {
    const saved = savedLeaves[i];
    const live = liveLeaves[i];
    if (saved.tagName !== live.tagName) continue;

    const savedHtml = saved.innerHTML;
    const savedText = saved.textContent?.trim() ?? "";
    if (!savedText) continue;
    if (live.innerHTML === savedHtml) continue;

    live.innerHTML = savedHtml;
  }
}

/** Apply saved CMS image URLs and text edits onto the live React-rendered service page. */
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

  applySavedTextOverrides(liveRoot, savedRoot);
}
