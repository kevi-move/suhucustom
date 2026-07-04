/**
 * Replace raw placeholder image tokens in src="..." with resolveImageSrc() calls.
 * Usage: node scripts/fix-placeholder-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");

const PLACEHOLDER_SRC =
  /src="((?:YOUR_|REVIEW_IMAGE_|BRAND_LOGO_|CTA_BACKGROUND_)[^"]+)"/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.tsx$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureImport(content) {
  if (content.includes("resolveImageSrc")) return content;
  const importLine = 'import { resolveImageSrc } from "@/lib/imageFallback";\n';
  const useClient = content.startsWith('"use client"');
  if (useClient) {
    const end = content.indexOf("\n") + 1;
    return content.slice(0, end) + importLine + content.slice(end);
  }
  return importLine + content;
}

let total = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  const matches = [...content.matchAll(PLACEHOLDER_SRC)];
  if (matches.length === 0) continue;

  content = content.replace(PLACEHOLDER_SRC, 'src={resolveImageSrc("$1")}');
  content = ensureImport(content);
  fs.writeFileSync(file, content);
  total += matches.length;
  console.log(`Fixed ${matches.length} in ${path.relative(SRC, file)}`);
}

console.log(`\nDone. Patched ${total} placeholder image src attributes.`);
