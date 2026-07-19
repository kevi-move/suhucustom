export interface TocHeading {
  id: string;
  text: string;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripHtmlTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function getExistingId(attrs: string): string | null {
  const match = attrs.match(/\sid=["']([^"']+)["']/i);
  return match?.[1]?.trim() || null;
}

function ensureUniqueId(baseId: string, usedIds: Set<string>): string {
  let candidate = baseId || "section";
  let index = 2;

  while (usedIds.has(candidate)) {
    candidate = `${baseId}-${index}`;
    index += 1;
  }

  usedIds.add(candidate);
  return candidate;
}

/** Inject stable ids into H2 tags and collect TOC entries. */
export function prepareBlogContentHtml(html: string): {
  html: string;
  headings: TocHeading[];
} {
  if (!html?.trim()) {
    return { html: "", headings: [] };
  }

  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();

  const processed = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const text = stripHtmlTags(inner);
    if (!text) return match;

    const existingId = getExistingId(attrs);
    const id = ensureUniqueId(existingId || slugifyHeading(text), usedIds);
    headings.push({ id, text });

    if (existingId === id) {
      return match;
    }

    const attrsWithoutId = String(attrs).replace(/\sid=["'][^"']*["']/i, "");
    return `<h2${attrsWithoutId} id="${id}">${inner}</h2>`;
  });

  return { html: processed, headings };
}

export function extractTocHeadings(html: string): TocHeading[] {
  return prepareBlogContentHtml(html).headings;
}
