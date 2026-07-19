export const BLOG_INLINE_CTA_VARIANT = "quote" as const;

/** Stable HTML marker inserted by the editor and parsed on the public blog page. */
export const BLOG_INLINE_CTA_HTML = `<div class="blog-inline-cta" data-blog-cta="${BLOG_INLINE_CTA_VARIANT}"></div>`;

export type BlogBodySegment =
  | { kind: "html"; content: string }
  | { kind: "cta"; variant: typeof BLOG_INLINE_CTA_VARIANT };

const CTA_REGEX = /<div\b[^>]*\bdata-blog-cta="quote"[^>]*>\s*<\/div>/gi;

export function splitBlogHtmlByInlineCta(html: string): BlogBodySegment[] {
  if (!html?.trim()) return [];

  const segments: BlogBodySegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  CTA_REGEX.lastIndex = 0;
  while ((match = CTA_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "html", content: html.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "cta", variant: BLOG_INLINE_CTA_VARIANT });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ kind: "html", content: html.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ kind: "html", content: html }];
}
