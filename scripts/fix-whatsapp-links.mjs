/**
 * Replace broken WhatsApp placeholder links with SITE_WHATSAPP_URL.
 * Usage: node scripts/fix-whatsapp-links.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");

const WA_PATTERN =
  /<a\s+href="https:\/\/wa\.me\/YOUR_PHONE"([^>]*)>\s*/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.tsx$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureImports(content) {
  let next = content;
  if (!next.includes('from "@/lib/siteContact"')) {
    const importLine = 'import { SITE_WHATSAPP_URL } from "@/lib/siteContact";\n';
    if (next.startsWith('"use client"')) {
      const end = next.indexOf("\n") + 1;
      next = next.slice(0, end) + importLine + next.slice(end);
    } else if (next.includes('import Link from "next/link"')) {
      next = next.replace(
        'import Link from "next/link";',
        'import Link from "next/link";\n' + importLine
      );
    } else {
      next = 'import Link from "next/link";\n' + importLine + next;
    }
  } else if (!next.includes('import Link from "next/link"')) {
    next = 'import Link from "next/link";\n' + next;
  }
  return next;
}

let total = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("wa.me/YOUR_PHONE")) continue;

  content = content.replace(
    WA_PATTERN,
    '<Link href={SITE_WHATSAPP_URL}$1>\n              '
  );
  content = content.replace(/<\/a>/g, (match, offset) => {
    const before = content.slice(Math.max(0, offset - 400), offset);
    if (before.includes("SITE_WHATSAPP_URL") && !before.includes("</Link>")) {
      return "</Link>";
    }
    return match;
  });

  content = ensureImports(content);
  fs.writeFileSync(file, content);
  total += 1;
  console.log(`Fixed WhatsApp link in ${path.relative(SRC, file)}`);
}

console.log(`\nDone. Updated ${total} files.`);
