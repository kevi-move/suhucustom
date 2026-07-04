/**
 * Replace contact-us quote links with QuoteButton modal triggers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICES = path.join(__dirname, "..", "src", "components", "services");

const CATEGORY_BY_FOLDER = {
  activewear: "Activewear & Athleisure",
  "baby-kids-clothing": "Baby & Kids Clothing",
  "cushion-covers": "Cushion Covers",
  gym: "Gym & Sportswear",
  "hats-headwear": "Hats & Headwear",
  hoodies: "Hoodies & Sweatshirts",
  jeans: "Jeans & Denim",
  leggings: "Leggings",
  "leather-goods": "Leather Goods",
  "neck-gaiters": "Neck Gaiters",
  socks: "Socks",
  swimwear: "Swimwear",
  towels: "Towels",
  tshirts: "T-shirts",
  "underwear-bras": "Underwear & Bras",
  uniforms: "Uniforms",
};

const HERO_QUOTE_RE =
  /<Link\s+href="\/contact-us"\s+className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3\.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500\/25 transition hover:bg-amber-400"\s*>\s*Get a Free Quote\s*<\/Link>/g;

const CUSTOM_QUOTE_RE =
  /<Link\s+href="\/contact-us"\s+className="flex w-full items-center justify-center rounded-full bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"\s*>\s*Get a Quote\s*<\/Link>/g;

function ensureQuoteImport(content) {
  if (content.includes("@/components/contact/QuoteButton")) return content;
  const line = 'import { QuoteButton } from "@/components/contact/QuoteButton";\n';
  const match = content.match(/^import .+;\r?\n/m);
  if (match) {
    const idx = content.indexOf(match[0]) + match[0].length;
    return content.slice(0, idx) + line + content.slice(idx);
  }
  return line + content;
}

function heroButton(category) {
  return `<QuoteButton
              title="Get a Free Quote"
              productCategory="${category}"
              className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              Get a Free Quote
            </QuoteButton>`;
}

function customButton(category) {
  return `<QuoteButton
                  title="Get a Quote"
                  productCategory="${category}"
                  className="flex w-full items-center justify-center rounded-full bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Get a Quote
                </QuoteButton>`;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith("Hero.tsx") || entry.name.endsWith("Customization.tsx")) {
      files.push(full);
    }
  }
  return files;
}

let updated = 0;
for (const file of walk(SERVICES)) {
  const folder = path.relative(SERVICES, file).split(path.sep)[0];
  const category = CATEGORY_BY_FOLDER[folder];
  if (!category) continue;

  let content = fs.readFileSync(file, "utf8");
  const before = content;

  if (file.endsWith("Hero.tsx")) {
    content = content.replace(HERO_QUOTE_RE, heroButton(category));
  } else {
    content = content.replace(CUSTOM_QUOTE_RE, customButton(category));
  }

  if (content !== before) {
    content = ensureQuoteImport(content);
    fs.writeFileSync(file, content, "utf8");
    updated += 1;
    console.log("Updated", path.relative(SERVICES, file));
  }
}

console.log(`Done. ${updated} files updated.`);
