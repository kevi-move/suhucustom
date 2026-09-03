/**
 * Optional NEXT_PUBLIC_FRONTEND_URL (site root, no trailing slash).
 * When unset, preview uses same-origin paths (e.g. /about-us on localhost:3000).
 */
function getFrontendSiteBase(): string {
  const raw = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
  return raw ? raw.replace(/\/$/, "") : "";
}

/** Absolute or same-origin path to a public page (for admin preview links). */
export function getFrontendPageUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash =
    normalized === "/" ? "/" : normalized.endsWith("/") ? normalized : `${normalized}/`;
  const base = getFrontendSiteBase();
  return base ? `${base}${withSlash}` : withSlash;
}

export function getFrontendBlogPostUrl(slug: string): string {
  return getFrontendPageUrl(`/blog/${encodeURIComponent(slug)}`);
}

export function getFrontendHomeUrl(): string {
  return getFrontendPageUrl("/");
}
