/**
 * Fix WhatsApp placeholder links and hero image placeholders (UTF-8 safe).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "src");

const heroFiles = [
  "components/services/activewear/ActivewearHero.tsx",
  "components/services/cushion-covers/CushionCoverHero.tsx",
  "components/services/hats-headwear/HatHero.tsx",
  "components/services/leather-goods/LeatherHero.tsx",
  "components/services/neck-gaiters/NeckGaiterHero.tsx",
  "components/services/socks/SockHero.tsx",
  "components/services/swimwear/SwimwearHero.tsx",
  "components/services/towels/TowelHero.tsx",
  "components/services/tshirts/TshirtHero.tsx",
  "components/services/underwear-bras/UnderwearHero.tsx",
];

function ensureImports(content) {
  let next = content;
  if (!next.includes('from "@/lib/siteContact"')) {
    const line = 'import { SITE_WHATSAPP_URL } from "@/lib/siteContact";\n';
    if (next.includes('import Link from "next/link";')) {
      next = next.replace('import Link from "next/link";', `import Link from "next/link";\n${line}`);
    } else {
      next = `import Link from "next/link";\n${line}` + next;
    }
  }
  if (!next.includes('@/lib/imageFallback')) {
    const line = 'import { resolveImageSrc } from "@/lib/imageFallback";\n';
    next = line + next;
  }
  return next;
}

for (const rel of heroFiles) {
  const file = path.join(SRC, rel);
  let content = fs.readFileSync(file, "utf8");

  content = content.replace(
    /src="YOUR_[^"]+"/g,
    (m) => `src={resolveImageSrc("${m.slice(5, -1)}")}`
  );

  content = content.replace(
    /<a\s+href="https:\/\/wa\.me\/YOUR_PHONE"([^>]*)>([\s\S]*?)<\/a>/g,
    '<Link href={SITE_WHATSAPP_URL}$1>$2</Link>'
  );

  content = ensureImports(content);
  fs.writeFileSync(file, content, "utf8");
  console.log(`Fixed ${rel}`);
}

console.log("Done.");
