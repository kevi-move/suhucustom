#!/usr/bin/env node
/**
 * Export public-site English copy into one .docx per page.
 * Run: node scripts/export-copy-to-docx.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "suhucustom-文案导出");

const SERVICE_GROUPS = [
  {
    titleEn: "Tops & Activewear",
    items: [
      { slug: "t-shirts", nameEn: "T-shirts" },
      { slug: "hoodies-sweatshirts", nameEn: "Hoodies & Sweatshirts" },
      { slug: "activewear-athleisure", nameEn: "Activewear & Athleisure" },
      { slug: "gym-sportswear", nameEn: "Gym & Sportswear" },
    ],
  },
  {
    titleEn: "Bottoms & Underwear",
    items: [
      { slug: "leggings", nameEn: "Leggings" },
      { slug: "jeans-denim", nameEn: "Jeans & Denim" },
      { slug: "underwear-bras", nameEn: "Underwear & Bras" },
      { slug: "swimwear", nameEn: "Swimwear" },
    ],
  },
  {
    titleEn: "Accessories & Headwear",
    items: [
      { slug: "hats-headwear", nameEn: "Hats & Headwear" },
      { slug: "socks", nameEn: "Socks" },
      { slug: "neck-gaiters", nameEn: "Neck Gaiters" },
      { slug: "leather-goods", nameEn: "Leather Goods" },
    ],
  },
  {
    titleEn: "Specialized & Home",
    items: [
      { slug: "uniforms", nameEn: "Uniforms" },
      { slug: "baby-kids-clothing", nameEn: "Baby & Kids Clothing" },
      { slug: "towels", nameEn: "Towels" },
      { slug: "cushion-covers", nameEn: "Cushion Covers" },
    ],
  },
];

const CUSTOMIZATION_ITEMS = [
  { slug: "printing", nameEn: "Printing" },
  { slug: "embroidery", nameEn: "Embroidery" },
  { slug: "private-label", nameEn: "Private Label" },
  { slug: "tech-pack-design", nameEn: "Tech Pack Design" },
];

const SERVICE_COMPONENT_DIRS = {
  "t-shirts": "components/services/tshirts",
  "hoodies-sweatshirts": "components/services/hoodies",
  "activewear-athleisure": "components/services/activewear",
  "gym-sportswear": "components/services/gym",
  leggings: "components/services/leggings",
  "jeans-denim": "components/services/jeans",
  socks: "components/services/socks",
  "neck-gaiters": "components/services/neck-gaiters",
  "leather-goods": "components/services/leather-goods",
  towels: "components/services/towels",
  "cushion-covers": "components/services/cushion-covers",
};

const SKIP_RE =
  /(^\/|https?:\/\/|@\/|\.\/|#|\.tsx?$|\.svg|\.png|YOUR_|wa\.me|placeholder|className|href=|src=|object-|flex-|max-w-|aria-|viewBox)/i;
const TAILWIND_LIKE = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;
const HAS_CHINESE = /[\u4e00-\u9fff]/;

function findService(slug) {
  for (const group of SERVICE_GROUPS) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) return { item, group };
  }
  return null;
}

function decodeJsString(raw) {
  let s = raw.slice(1, -1);
  s = s.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
  return s.replace(/\s+/g, " ").trim();
}

function isCopyCandidate(s) {
  if (!s || s.length < 2) return false;
  if (HAS_CHINESE.test(s)) return false;
  if (!/[a-zA-Z]/.test(s)) return false;
  if (SKIP_RE.test(s)) return false;
  if (TAILWIND_LIKE.test(s) && !s.includes(" ")) return false;
  if (s.length > 800) return false;
  return true;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function extractFromSource(text) {
  const found = [];

  for (const m of text.matchAll(/"(?:[^"\\]|\\.)*"/g)) {
    const s = decodeJsString(m[0]);
    if (isCopyCandidate(s)) found.push(s);
  }

  for (const m of text.matchAll(/'(?:[^'\\]|\\.)*'/g)) {
    const s = decodeJsString(m[0]);
    if (isCopyCandidate(s)) found.push(s);
  }

  for (const m of text.matchAll(/>([^<>{}]+)</g)) {
    const chunk = m[1].replace(/\s+/g, " ").trim();
    if (isCopyCandidate(chunk)) found.push(chunk);
  }

  for (const m of text.matchAll(
    /(?:title|desc|description|label|eyebrow|subtitle|paragraph\d*|intro|closing|benefits|capabilities|primaryCtaText|secondaryCtaText|alt)\s*:\s*\n?\s*"([^"]+)"/gi
  )) {
    const s = m[1].trim();
    if (isCopyCandidate(s)) found.push(s);
  }

  return dedupe(found);
}

function walkTsx(dirRel) {
  const dir = path.join(SRC, dirRel);
  if (!fs.existsSync(dir)) return [];
  const files = [];
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts"))
        files.push(full);
    }
  };
  walk(dir);
  return files.sort();
}

function readFiles(paths) {
  const all = [];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      all.push(...extractFromSource(fs.readFileSync(p, "utf8")));
    }
  }
  return dedupe(all);
}

function genericServiceCopy(slug) {
  const found = findService(slug);
  if (!found) return [];
  const { item, group } = found;
  const name = item.nameEn;
  return [
    "Services",
    name,
    group.titleEn,
    name,
    group.titleEn,
    `Professional manufacturing for ${name.toLowerCase()}. Custom specifications, quality materials, and reliable delivery for your brand or business.`,
    "Request a Quote",
    "View Quality Process",
    "Image placeholder (you can replace with real product photos later)",
  ];
}

function customizationSlugCopy(slug) {
  const item = CUSTOMIZATION_ITEMS.find((i) => i.slug === slug);
  if (!item) return [];
  const name = item.nameEn;
  return [
    "Home",
    "Customization",
    name,
    name,
    `Our ${name.toLowerCase()} services help you create unique, branded products that stand out in the market.`,
    "Get Started",
  ];
}

function servicesListCopy() {
  const lines = [
    "Our Services",
    "Comprehensive apparel manufacturing for every category. Browse by category or find your product below.",
  ];
  for (const group of SERVICE_GROUPS) {
    lines.push(group.titleEn);
    for (const item of group.items) lines.push(item.nameEn);
  }
  return lines;
}

function customizationListCopy() {
  const lines = [
    "Customization Services",
    "From printing to tech packs, we offer full customization solutions for your apparel brand.",
  ];
  for (const item of CUSTOMIZATION_ITEMS) lines.push(item.nameEn);
  return lines;
}

function extractAboutUs() {
  const defaults = fs.readFileSync(
    path.join(SRC, "lib", "aboutUsDefaults.ts"),
    "utf8"
  );
  const lines = extractFromSource(defaults);
  lines.push(...readFiles(walkTsx("components/about")));
  lines.push(
    ...readFiles(
      ["app/about-us/page.tsx", "app/about-us/AboutUsPageClient.tsx"].map((p) =>
        path.join(SRC, p)
      )
    )
  );
  return dedupe(lines);
}

function linesToParagraphs(lines) {
  const paras = [];
  for (const line of lines) {
    if (line.includes("\n")) {
      for (const part of line.split("\n")) {
        if (part.trim()) {
          paras.push(
            new Paragraph({ text: part.trim(), bullet: { level: 0 } })
          );
        }
      }
    } else {
      paras.push(new Paragraph({ children: [new TextRun(line)] }));
    }
  }
  return paras;
}

async function writeDocx(filename, title, route, lines) {
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Route: ", bold: true }),
        new TextRun(route),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      text: "Page copy (English)",
      heading: HeadingLevel.HEADING_1,
    }),
    ...linesToParagraphs(lines),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT_DIR, filename), buf);
}

function buildPages() {
  const pages = [];
  let idx = 1;

  const add = (label, route, lines, stem = null) => {
    const num = String(idx).padStart(2, "0");
    const fname = stem ? `${num}-${stem}.docx` : `${num}-${label}.docx`;
    pages.push({ idx, label, fname, route, lines });
    idx++;
  };

  add(
    "首页",
    "/",
    readFiles([
      path.join(SRC, "app", "page.tsx"),
      ...walkTsx("components/home"),
    ]),
    "首页"
  );

  add("服务列表", "/services", servicesListCopy(), "服务列表");

  for (const group of SERVICE_GROUPS) {
    for (const item of group.items) {
      const slug = item.slug;
      const rel = SERVICE_COMPONENT_DIRS[slug];
      const lines = rel
        ? readFiles(walkTsx(rel))
        : genericServiceCopy(slug);
      add(`服务-${item.nameEn}`, `/services/${slug}`, lines, `服务-${slug}`);
    }
  }

  add("定制列表", "/customization", customizationListCopy(), "定制列表");

  for (const item of CUSTOMIZATION_ITEMS) {
    add(
      `定制-${item.nameEn}`,
      `/customization/${item.slug}`,
      customizationSlugCopy(item.slug),
      `定制-${item.slug}`
    );
  }

  add("关于我们", "/about-us", extractAboutUs(), "关于我们");

  const blogLines = readFiles([
    path.join(SRC, "app", "blog", "page.tsx"),
    ...walkTsx("components/blog"),
  ]);
  const blogDetail = readFiles([
    path.join(SRC, "app", "blog", "[slug]", "page.tsx"),
    path.join(SRC, "components", "blog", "BlogPostBody.tsx"),
    path.join(SRC, "components", "blog", "BlogRelatedPosts.tsx"),
  ]);
  add("博客列表", "/blog", blogLines, "博客列表");
  add("博客文章模板", "/blog/[slug]", blogDetail, "博客-文章模板");

  add(
    "联系我们",
    "/contact-us",
    readFiles([path.join(SRC, "app", "contact-us", "page.tsx")]),
    "联系我们"
  );

  add(
    "质量与生产",
    "/quality",
    readFiles([path.join(SRC, "app", "quality", "page.tsx")]),
    "质量与生产"
  );

  add(
    "案例研究",
    "/company/case-studies",
    readFiles([
      path.join(SRC, "app", "company", "case-studies", "page.tsx"),
    ]),
    "案例研究"
  );

  add(
    "搜索",
    "/search",
    readFiles([
      path.join(SRC, "app", "search", "page.tsx"),
      path.join(SRC, "components", "search", "SearchForm.tsx"),
      path.join(SRC, "components", "search", "SearchResultsList.tsx"),
    ]),
    "搜索"
  );

  add(
    "隐私政策",
    "/privacy-policy",
    readFiles([path.join(SRC, "app", "privacy-policy", "page.tsx")]),
    "隐私政策"
  );

  add(
    "条款与条件",
    "/terms-and-conditions",
    readFiles([path.join(SRC, "app", "terms-and-conditions", "page.tsx")]),
    "条款与条件"
  );

  return pages;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const pages = buildPages();
  const manifest = [];

  for (const { idx, label, fname, route, lines } of pages) {
    const copy =
      lines.length > 0
        ? lines
        : ["(No extractable copy found in source for this page.)"];
    await writeDocx(fname, label, route, copy);
    manifest.push({
      index: idx,
      label,
      file: fname,
      route,
      lineCount: copy.length,
    });
    console.log(`  ${fname}  (${copy.length} lines)`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  console.log(`\nDone: ${pages.length} documents -> ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
