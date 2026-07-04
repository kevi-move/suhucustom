const PLACEHOLDER_PATTERN = /^(YOUR_|REVIEW_IMAGE_|BRAND_LOGO_|CTA_BACKGROUND_)/;

const DEFAULT_SERVICE = "/services/placeholder.svg";
const DEFAULT_HOME = "/services/placeholder.svg";
const DEFAULT_ABOUT = "/about-us/placeholder.svg";
const DEFAULT_REVIEW = "/services/placeholder.svg";
const DEFAULT_BRAND = "/services/placeholder.svg";

/** Maps unresolved image tokens to local placeholder assets so the site never shows broken URLs. */
export function resolveImageSrc(src: string | null | undefined): string {
  const trimmed = (src ?? "").trim();
  if (!trimmed) return DEFAULT_SERVICE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (!PLACEHOLDER_PATTERN.test(trimmed)) return trimmed;

  if (trimmed.startsWith("REVIEW_IMAGE_")) return DEFAULT_REVIEW;
  if (trimmed.startsWith("BRAND_LOGO_")) return DEFAULT_BRAND;
  if (trimmed.includes("HERO") || trimmed.includes("CTA_BACKGROUND")) return DEFAULT_HOME;
  if (trimmed.includes("ABOUT")) return DEFAULT_ABOUT;
  return DEFAULT_SERVICE;
}

export function isPlaceholderImageSrc(src: string | null | undefined): boolean {
  const trimmed = (src ?? "").trim();
  return PLACEHOLDER_PATTERN.test(trimmed);
}
