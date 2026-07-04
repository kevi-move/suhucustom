const PLACEHOLDER = "/services/placeholder.svg";

/** Pull the first case-study photo URL from saved visual HTML. */
export function extractCaseStudyImageSrc(html: string): string | undefined {
  const trimmed = html.trim();
  if (!trimmed) return undefined;

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(trimmed, "text/html");
    const slot = doc.querySelector("[data-vedit-image] img, .case-study-photo-img");
    const src = slot?.getAttribute("src")?.trim();
    if (src && !src.includes("placeholder.svg")) return src;

    const gridImg = doc.querySelector('[class*="col-span-2"] img');
    const gridSrc = gridImg?.getAttribute("src")?.trim();
    if (gridSrc && !gridSrc.includes("placeholder.svg")) return gridSrc;
  }

  const match = trimmed.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*case-study-photo-img/i);
  if (match?.[1] && !match[1].includes("placeholder.svg")) return match[1];

  const anyImg = trimmed.match(/<img[^>]+src=["'](https?:[^"']+|\/uploads\/[^"']+)["']/i);
  return anyImg?.[1];
}

export function isPlaceholderImageUrl(src: string | null | undefined): boolean {
  const value = (src ?? "").trim();
  return !value || value.includes("placeholder.svg");
}

export { PLACEHOLDER as CASE_STUDY_PLACEHOLDER };
