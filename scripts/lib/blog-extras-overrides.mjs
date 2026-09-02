/**
 * Curated Overview (aiSummary) and Key Points per slug.
 * Short, plain text — no markdown tables or raw markup.
 */
export const BLOG_EXTRAS_OVERRIDES = {
  "apron-size-chart-measurement-fit-guide": {
    aiSummary:
      "Apron sizing has no universal standard. Match bib width, total length, and strap length to each wearer's measurements, and choose the larger size when uncertain.",
    keyPoints: [
      "Always check the manufacturer's size chart before ordering.",
      "Measure chest, length, and waist while wearing work clothing.",
      "Cross-back designs reduce neck pressure during long shifts.",
      "Custom manufacturing lets you set exact bib and strap dimensions.",
    ],
  },
  "baby-clothing-size-guide": {
    aiSummary:
      "Baby apparel sizing works best when you size by height, weight, and diaper allowance — not age labels alone. Account for fabric shrinkage before production.",
    keyPoints: [
      "Use height and weight as primary sizing references.",
      "US month labels differ from EU height-based sizing.",
      "Add diaper ease and pre-shrink allowance in tech packs.",
      "Validate fit with samples before bulk manufacturing.",
    ],
  },
  "dress-size-chart-guide": {
    aiSummary:
      "Dress sizing starts with bust, waist, and hip measurements mapped to US numeric sizes 0–18. When measurements fall across sizes, pick the size that fits your largest measurement.",
    keyPoints: [
      "Measure bust, waist, and hips at standard body points.",
      "US numeric sizes increase roughly 1 inch per size through 10.",
      "UK dress sizes run about two numbers larger than US.",
      "Letter sizes vary by brand — check garment specs, not labels alone.",
    ],
  },
  "glove-sizing-guide": {
    aiSummary:
      "Palm circumference below the knuckles is the primary glove size reference; palm length confirms fit. Measure your dominant hand and match against your factory chart.",
    keyPoints: [
      "Measure palm width at the widest point, excluding the thumb.",
      "Size up for long fingers, long nails, or synthetic materials.",
      "Leather gloves can start snug — they stretch with wear.",
      "Validate sizing with production samples before bulk runs.",
    ],
  },
  "hat-size-chart": {
    aiSummary:
      "Hat sizing converts head circumference into US, UK, and EU labels. Measure around the forehead, just above the ears, then use the conversion chart for your hat type.",
    keyPoints: [
      "Measure head circumference at the widest point above the ears.",
      "Between sizes: size up for a looser fit, down for snug.",
      "Baseball caps, beanies, and fedoras use different size ranges.",
      "Send clear size specs before custom hat production.",
    ],
  },
  "leggings-size-chart": {
    aiSummary:
      "Leggings fit depends on waist and hip measurements plus fabric stretch. Stretchy nylon-spandex blends tolerate more variance than coated or compression fabrics.",
    keyPoints: [
      "Measure waist at the narrowest point and hips at the fullest.",
      "Fabric stretch changes how measurements translate to fit.",
      "Standard inseam is 26–32 inches; petite and tall variants exist.",
      "High-waisted styles sit and fit differently than mid-rise.",
    ],
  },
  "socks-size-chart-custom-manufacturing-specs": {
    aiSummary:
      "Sock sizes map to shoe-size ranges, not exact foot length. Confirm brand-specific charts and specify cuff height, cushion level, and weight for custom orders.",
    keyPoints: [
      "One sock size typically covers 2–3 shoe sizes.",
      "Between sizes, choose larger to preserve elasticity.",
      "Cuff height ranges from no-show (~2 in) to knee-high (~17 in).",
      "Specify cushion, weight, and fabric in your tech pack.",
    ],
  },
  "t-shirt-size-chart": {
    aiSummary:
      "There is no universal t-shirt size standard — every factory grades differently. Confirm chest, body length, and sleeve measurements with your manufacturer before bulk orders.",
    keyPoints: [
      "Request the factory grade rule before sampling.",
      "Men's, women's, and youth charts use different measurements.",
      "Regional conversions (US/UK/EU/Asia) are not interchangeable.",
      "Verify measurements on fit samples, not assumptions.",
    ],
  },
  "sweatshirt-size-chart-guide": {
    aiSummary:
      "Sweatshirt sizing varies widely by brand — a Gildan Medium fits differently from Nike or Champion. Use brand-specific charts and account for style and cut differences.",
    keyPoints: [
      "Never assume Medium is consistent across brands.",
      "Check chest width and body length for each style.",
      "Youth and unisex labels need separate verification.",
      "Layering preference affects whether to size up.",
    ],
  },
  "polo-shirt-size-chart-guide": {
    aiSummary:
      "Polo shirt fit varies by brand, cut, and regional sizing. Compare chest and length measurements against brand-specific charts before custom or bulk orders.",
    keyPoints: [
      "Brand charts (Nike, Ralph Lauren, Lacoste) differ significantly.",
      "Men's, women's, and unisex polos grade differently.",
      "US/UK/EU/Asia conversions require brand confirmation.",
      "Fabric knit type affects how the polo fits on body.",
    ],
  },
};

export function getBlogExtrasOverride(slug) {
  return BLOG_EXTRAS_OVERRIDES[slug] ?? null;
}

export function applyBlogExtrasOverride(slug, extras) {
  const override = getBlogExtrasOverride(slug);
  if (!override) return extras;
  return {
    ...extras,
    aiSummary: override.aiSummary,
    keyPoints: override.keyPoints,
  };
}
