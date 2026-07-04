/**
 * Scan suhucustom source for image placeholders and build a manifest with nearby copy context.
 *
 * Usage: node scripts/image-pipeline/scan.mjs
 * Output: scripts/image-pipeline/manifest.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PLACEHOLDER_PATTERN,
  inferSlotType,
  sizeForSlotType,
} from "./config.mjs";
import { buildPrompt } from "./prompts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(__dirname, "manifest.json");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function extractContextBlock(content, placeholder, index) {
  const windowStart = Math.max(0, index - 900);
  const windowEnd = Math.min(content.length, index + 200);
  const block = content.slice(windowStart, windowEnd);

  const fields = [];
  const re = /(?:title|description|quote|tagline|alt|nameEn|step|eyebrow):\s*["'`]([^"'`]+)["'`]/gi;
  let m;
  while ((m = re.exec(block))) fields.push(m[1].trim());

  const h1 = block.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const text = h1[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) fields.unshift(text);
  }

  return [...new Set(fields)].slice(0, 6);
}

function inferProductFromPath(filePath) {
  const rel = path.relative(SRC, filePath).replace(/\\/g, "/");
  const serviceMatch = rel.match(/services\/([^/]+)/);
  if (serviceMatch) return serviceMatch[1].replace(/-/g, " ");
  if (rel.includes("home/")) return "home";
  if (rel.includes("about/")) return "about us";
  return "general";
}

/** HomeCategoryNav uses template literals — inject synthetic slots from navigation + taglines. */
function injectCategoryNavSlots(seen) {
  const navPath = path.join(SRC, "components/home/HomeCategoryNav.tsx");
  if (!fs.existsSync(navPath)) return;

  const content = fs.readFileSync(navPath, "utf8");
  const taglineBlock = content.match(/const taglines[^=]*=\s*\{([\s\S]*?)\};/);
  const taglines = {};
  if (taglineBlock) {
    for (const m of taglineBlock[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
      taglines[m[1]] = m[2];
    }
  }

  const navModule = path.join(SRC, "lib/navigation.ts");
  const navContent = fs.readFileSync(navModule, "utf8");
  const groupsBlock = navContent.match(/export const serviceGroups[\s\S]*?= (\[[\s\S]*?\n\];)/)?.[1] || "";
  for (const m of groupsBlock.matchAll(/slug:\s*"([^"]+)"[\s\S]*?nameEn:\s*"([^"]+)"/g)) {
    const slug = m[1];
    const nameEn = m[2];
    const id = `CATEGORY_IMAGE_${slug.toUpperCase().replace(/-/g, "_")}_URL`;
    const context = [nameEn, taglines[slug] || ""].filter(Boolean);
    const slotType = "category";

    seen.set(id, {
      id,
      slotType,
      size: sizeForSlotType(slotType),
      product: "home",
      context,
      files: ["src/components/home/HomeCategoryNav.tsx"],
      prompt: buildPrompt({ placeholder: id, slotType, product: slug.replace(/-/g, " "), context }),
      outputPath: `/generated/home/category-${slug}.webp`,
    });
  }
}

function injectAboutUsSlots(seen) {
  const defaultsPath = path.join(SRC, "lib/aboutUsDefaults.ts");
  if (!fs.existsSync(defaultsPath)) return;

  const content = fs.readFileSync(defaultsPath, "utf8");
  const sections = [
    { key: "hero", field: "heroImage", slotType: "hero" },
    { key: "story", field: "image", slotType: "factory" },
    { key: "humen", field: "image", slotType: "factory" },
    { key: "factory", field: "image", slotType: "factory" },
    { key: "team", field: "image", slotType: "factory" },
    { key: "cta", field: "backgroundImage", slotType: "cta" },
  ];

  for (const { key, field, slotType } of sections) {
    const blockRe = new RegExp(`${key}:\\s*\\{([\\s\\S]*?)\\}(?=,\\s*\\w|$)`);
    const block = content.match(blockRe)?.[1] || "";
    const context = [];
    for (const m of block.matchAll(/(?:eyebrow|title|subtitle|intro|paragraph\d+|closing):\s*\n?\s*"([^"]+)"/g)) {
      context.push(m[1].replace(/\s+/g, " ").trim());
    }

    const id = `ABOUT_US_${key.toUpperCase()}_${field.toUpperCase()}`;
    seen.set(id, {
      id,
      slotType,
      size: sizeForSlotType(slotType),
      product: "about us",
      context,
      files: ["src/lib/aboutUsDefaults.ts"],
      prompt: buildPrompt({ placeholder: id, slotType, product: "about us", context }),
      outputPath: `/generated/about-us/${key}-${field}.webp`,
    });
  }
}

function main() {
  const seen = new Map();
  const files = walk(SRC);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const product = inferProductFromPath(file);

    for (const match of content.matchAll(new RegExp(PLACEHOLDER_PATTERN.source, "g"))) {
      const placeholder = match[0];
      if (placeholder.includes("YOUR_PHONE")) continue;
      if (placeholder.startsWith("BRAND_LOGO")) continue; // logos: use real clients or SVG, not AI

      const index = match.index ?? 0;
      const context = extractContextBlock(content, placeholder, index);
      const slotType = inferSlotType(placeholder);

      if (!seen.has(placeholder)) {
        const product =
          rel.includes("home/") && placeholder === "YOUR_HERO_IMAGE_URL"
            ? "home"
            : inferProductFromPath(file);

        seen.set(placeholder, {
          id: placeholder,
          slotType,
          size: sizeForSlotType(slotType),
          product,
          context,
          files: [rel],
          prompt: buildPrompt({ placeholder, slotType, product, context }),
          outputPath: suggestOutputPath(placeholder, product, slotType),
        });
      } else {
        const entry = seen.get(placeholder);
        if (!entry.files.includes(rel)) entry.files.push(rel);
        if (rel.includes("home/") && entry.product !== "home") entry.product = "home";
        if (context.length > entry.context.length) {
          entry.context = context;
          entry.prompt = buildPrompt({
            placeholder,
            slotType: entry.slotType,
            product: entry.product,
            context,
          });
        }
      }
    }
  }

  injectCategoryNavSlots(seen);
  injectAboutUsSlots(seen);

  const manifest = {
    generatedAt: new Date().toISOString(),
    project: "suhucustom",
    totalSlots: seen.size,
    brandNote: "SuhuCustom — custom apparel OEM/ODM factory in Humen, Dongguan, China",
    slots: [...seen.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };

  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Scanned ${files.length} files → ${manifest.totalSlots} unique image slots`);
  console.log(`Manifest: ${OUT}`);

  const byType = {};
  for (const s of manifest.slots) byType[s.slotType] = (byType[s.slotType] || 0) + 1;
  console.log("By type:", byType);
}

function suggestOutputPath(placeholder, product, slotType) {
  const slug = placeholder
    .replace(/_URL$/i, "")
    .replace(/^YOUR_|^CATEGORY_IMAGE_|^REVIEW_IMAGE_|^FACTORY_INTRO_/i, "")
    .toLowerCase()
    .replace(/_/g, "-");

  const folder =
    product === "home"
      ? "home"
      : product === "about us"
        ? "about-us"
        : `services/${product.replace(/\s+/g, "-")}`;

  return `/generated/${folder}/${slotType}-${slug}.webp`;
}

main();
