/** @typedef {"hero"|"overview"|"feature"|"customization"|"process"|"category"|"factory"|"review"|"cta"|"other"} ImageSlotType */

export const BRAND_STYLE = `
Professional B2B apparel manufacturing website photography.
Clean, modern, trustworthy. Warm amber/gold accent mood, slate gray neutrals.
Natural lighting, sharp focus, no text overlays, no watermarks, no logos.
Photorealistic commercial photography — NOT illustration, NOT cartoon.
Avoid distorted hands, faces, or unreadable text on products.
`.trim();

/** Shared process-step visuals can be reused across product categories. */
export const SHARED_PROCESS_PROMPTS = {
  design: "Garment designer reviewing tech pack and fabric swatches on a light table in a modern Dongguan apparel studio, professional product development scene",
  cutting: "Automated fabric cutting machine in a clean garment factory, stacked cotton fabric layers, precision manufacturing",
  sewing: "Industrial sewing machines on a bright garment production line, skilled workers stitching apparel, factory floor",
  print: "Screen printing station with custom t-shirt design being applied, vibrant inks, professional print shop",
  qc: "Quality inspector checking finished garments on a table, measuring tape and checklist, bright QC station",
  shipping: "Neatly folded apparel cartons on pallets in a warehouse ready for export shipping, logistics scene",
};

/** Map placeholder suffix patterns → slot type for sizing & prompt strategy */
export function inferSlotType(placeholder) {
  const p = placeholder.toUpperCase();
  if (p.includes("HERO")) return "hero";
  if (p.includes("OVERVIEW")) return "overview";
  if (p.includes("PROCESS")) return "process";
  if (p.includes("CATEGORY_IMAGE")) return "category";
  if (p.includes("FACTORY") || p.includes("HUMEN") || p.includes("STORY")) return "factory";
  if (p.includes("REVIEW")) return "review";
  if (p.includes("CTA") || p.includes("BACKGROUND")) return "cta";
  if (
    p.includes("FABRIC") ||
    p.includes("STITCH") ||
    p.includes("FEATURE") ||
    p.includes("DECORATION") ||
    p.includes("QUALITY") ||
    p.includes("QC") ||
    p.includes("YARN") ||
    p.includes("WEAV") ||
    p.includes("KNIT")
  )
    return "feature";
  if (p.includes("CUSTOM") || p.includes("STYLE") || p.includes("PACKAGING") || p.includes("COLOR"))
    return "customization";
  return "other";
}

/** Recommended output size per slot type (Seedream accepts "2K" or WxH) */
export function sizeForSlotType(type) {
  switch (type) {
    case "hero":
    case "cta":
      return "2560x1440";
    case "overview":
    case "factory":
      return "1920x1280";
    case "category":
    case "review":
      return "1280x720";
    case "feature":
    case "customization":
    case "process":
      return "1280x960";
    default:
      return "1280x960";
  }
}

export const PLACEHOLDER_PATTERN =
  /(?:YOUR_[A-Z0-9_]+|CATEGORY_IMAGE_[A-Z0-9_-]+|REVIEW_IMAGE_\d+_URL|BRAND_LOGO_\d+_URL|FACTORY_INTRO_IMAGE_URL|CTA_BACKGROUND_IMAGE_URL)/g;

export const CONTEXT_FIELD_PATTERN =
  /(?:title|description|quote|tagline|alt|nameEn|step):\s*["'`]([^"'`]+)["'`]/g;
