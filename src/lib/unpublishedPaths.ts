/** Paths that are not ready yet — visitors are redirected to the homepage. */
export const UNPUBLISHED_PATHS = new Set([
  "/services/underwear-bras",
  "/services/swimwear",
  "/services/hats-headwear",
  "/services/uniforms",
  "/services/baby-kids-clothing",
  "/customization/printing",
  "/customization/embroidery",
  "/customization/private-label",
  "/customization/tech-pack-design",
  "/quality",
  "/company/case-studies",
]);

export function isUnpublishedPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return UNPUBLISHED_PATHS.has(normalized);
}

export function isUnpublishedServiceSlug(slug: string): boolean {
  return UNPUBLISHED_PATHS.has(`/services/${slug}`);
}

export function isUnpublishedCustomizationSlug(slug: string): boolean {
  return UNPUBLISHED_PATHS.has(`/customization/${slug}`);
}
