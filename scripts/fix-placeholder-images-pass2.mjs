/**
 * Second pass: fix dynamic img src and ensure resolveImageSrc imports.
 * Usage: node scripts/fix-placeholder-images-pass2.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");

const DYNAMIC_SRC = /src=\{([a-zA-Z_$][\w$.[\]'"]*)\}/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.tsx$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureImport(content) {
  if (!content.includes("resolveImageSrc")) return content;
  if (content.includes('@/lib/imageFallback')) return content;
  const importLine = 'import { resolveImageSrc } from "@/lib/imageFallback";\n';
  if (content.startsWith('"use client"')) {
    const end = content.indexOf("\n") + 1;
    return content.slice(0, end) + importLine + content.slice(end);
  }
  return importLine + content;
}

function shouldWrap(expr) {
  const trimmed = expr.trim();
  if (trimmed.startsWith("resolveImageSrc(")) return false;
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return false;
  return true;
}

let patched = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  content = content.replace(DYNAMIC_SRC, (match, expr) => {
    if (!shouldWrap(expr)) return match;
    patched += 1;
    return `src={resolveImageSrc(${expr})}`;
  });

  content = ensureImport(content);

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${path.relative(SRC, file)}`);
  }
}

console.log(`\nDone. Wrapped ${patched} dynamic src expressions.`);
