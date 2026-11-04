/** Detect Chrome/Gemini Chinese snapshots saved over the English site. */

const CJK_RE = /[\u3400-\u9fff\uf900-\ufaff]/g;
const LATIN_RE = /[A-Za-z]/g;

export function isCjkDominantHtml(html: string | undefined): boolean {
  if (!html) return false;
  const text = html.replace(/<[^>]+>/g, " ");
  const cjk = text.match(CJK_RE)?.length ?? 0;
  if (cjk < 40) return false;
  const latin = text.match(LATIN_RE)?.length ?? 0;
  return cjk > latin;
}

export function isBrowserTranslatedDocument(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return (
    root.classList.contains("translated-ltr") ||
    root.classList.contains("translated-rtl") ||
    root.getAttribute("class")?.includes("translated-") === true
  );
}
