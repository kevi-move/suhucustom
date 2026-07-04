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
