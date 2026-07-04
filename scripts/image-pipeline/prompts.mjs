import { BRAND_STYLE, SHARED_PROCESS_PROMPTS, inferSlotType } from "./config.mjs";

const PRODUCT_LABELS = {
  "t shirts": "custom t-shirts",
  "tshirts": "custom t-shirts",
  hoodies: "custom hoodies and sweatshirts",
  activewear: "activewear and athleisure",
  gym: "gym and sportswear",
  leggings: "performance leggings",
  "jeans denim": "denim jeans",
  jeans: "denim jeans",
  "underwear bras": "underwear and bras",
  swimwear: "swimwear",
  "hats headwear": "custom hats and headwear",
  socks: "custom socks",
  "neck gaiters": "neck gaiters and buffs",
  "leather goods": "leather goods and accessories",
  uniforms: "work uniforms",
  "baby kids clothing": "baby and kids clothing",
  towels: "custom towels",
  "cushion covers": "cushion covers and home textiles",
};

function productLabel(product) {
  return PRODUCT_LABELS[product] || product;
}

function processPromptFromPlaceholder(placeholder) {
  const p = placeholder.toUpperCase();
  if (p.includes("DESIGN")) return SHARED_PROCESS_PROMPTS.design;
  if (p.includes("CUTTING") || p.includes("PATTERN")) return SHARED_PROCESS_PROMPTS.cutting;
  if (p.includes("SEWING") || p.includes("ASSEMBLY") || p.includes("STITCH")) return SHARED_PROCESS_PROMPTS.sewing;
  if (p.includes("PRINT") || p.includes("EMBROID") || p.includes("DECO")) return SHARED_PROCESS_PROMPTS.print;
  if (p.includes("QC") || p.includes("QUALITY") || p.includes("INSPECT")) return SHARED_PROCESS_PROMPTS.qc;
  if (p.includes("SHIP") || p.includes("PACKAGING")) return SHARED_PROCESS_PROMPTS.shipping;
  if (p.includes("YARN") || p.includes("WEAV")) return "Textile yarn and weaving machinery in a modern factory, soft natural lighting";
  if (p.includes("DYE")) return "Fabric dyeing vats in a professional textile factory, rich colors";
  if (p.includes("KNIT")) return "Industrial knitting machines producing seamless apparel fabric";
  return null;
}

function heroPrompt(product, context) {
  const label = productLabel(product);
  const headline = context[0] || "";
  if (product === "home") {
    return `Wide cinematic hero banner: modern garment manufacturing factory floor in China with sewing lines and quality apparel production, global B2B export brand mood. ${headline}. ${BRAND_STYLE}`;
  }
  if (product === "about us") {
    return `Warm professional photo: two confident Asian businesswomen in a garment district office with fabric samples and factory view, founders of an apparel manufacturing company in Dongguan. ${headline}. ${BRAND_STYLE}`;
  }
  return `Dramatic hero banner showcasing ${label} manufacturing — premium product flat lay and factory production context. ${headline}. ${BRAND_STYLE}`;
}

function categoryPrompt(context) {
  const title = context.find((c) => c.length < 60) || context[0] || "apparel category";
  return `Product category thumbnail: ${title}, clean studio product shot on neutral background, e-commerce quality, shallow depth of field. ${BRAND_STYLE}`;
}

function featurePrompt(product, context) {
  const title = context[0] || "manufacturing capability";
  const desc = context[1] || "";
  const label = productLabel(product);
  return `${title} for ${label} production. ${desc}. Close-up commercial manufacturing or materials photo. ${BRAND_STYLE}`;
}

export function buildPrompt({ placeholder, slotType, product, context }) {
  const type = slotType || inferSlotType(placeholder);

  if (type === "process") {
    const shared = processPromptFromPlaceholder(placeholder);
    const title = context[0] || "";
    if (shared) return `${shared}. Context: ${title}. ${BRAND_STYLE}`;
  }

  switch (type) {
    case "hero":
    case "cta":
      return heroPrompt(product, context);
    case "category":
      return categoryPrompt(context);
    case "overview":
      return `Editorial overview photo for ${productLabel(product)} OEM manufacturing — products, fabrics, and factory details combined in one aspirational scene. ${context.join(". ")}. ${BRAND_STYLE}`;
    case "factory":
      return `Apparel factory in Humen Dongguan China: ${context.join(". ")}. Authentic manufacturing environment. ${BRAND_STYLE}`;
    case "review":
      return `Lifestyle product photo suggesting happy international brand owner reviewing custom apparel shipment, subtle and professional, no visible faces required. Quote mood: "${context[0] || "quality delivery"}". ${BRAND_STYLE}`;
    case "feature":
    case "customization":
      return featurePrompt(product, context);
    default:
      return `${context.join(". ")} — ${productLabel(product)} manufacturing. ${BRAND_STYLE}`;
  }
}
