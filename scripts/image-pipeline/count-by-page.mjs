import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8")
);

const homeSlots = new Set();
const aboutSlots = new Set();
const byService = {};
const other = new Set();
const caseStudy = new Set();

for (const s of manifest.slots) {
  for (const f of s.files) {
    if (f.includes("components/home/")) homeSlots.add(s.id);
    else if (f.includes("about/") || f.includes("aboutUsDefaults")) aboutSlots.add(s.id);
    else if (f.includes("HomeCaseStudies")) caseStudy.add(s.id);
    else {
      const m = f.match(/services\/([^/]+)/);
      if (m) {
        byService[m[1]] = byService[m[1]] || new Set();
        byService[m[1]].add(s.id);
      } else other.add(s.id);
    }
  }
}

// HomeCaseStudies uses CASE_IMAGE_* - check if in manifest
const caseImages = manifest.slots.filter((s) => s.id.startsWith("CASE_IMAGE"));

console.log(JSON.stringify({
  total: manifest.totalSlots,
  home: {
    total: homeSlots.size,
    breakdown: countHomeBreakdown(manifest.slots.filter((s) => homeSlots.has(s.id))),
  },
  aboutUs: aboutSlots.size,
  servicesIndex: "0 (uses placeholder.svg only)",
  perServicePage: Object.fromEntries(
    Object.entries(byService)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, v.size])
  ),
  servicePageAverage: Math.round(
    Object.values(byService).reduce((a, s) => a + s.size, 0) /
      Object.keys(byService).length
  ),
  serviceCategoriesCount: Object.keys(byService).length,
  servicePagesTotal: Object.values(byService).reduce((a, s) => a + s.size, 0),
  caseStudiesHome: caseImages.length || "4 (CASE_IMAGE_* not in scan — manual)",
  brandLogos: 6,
  blog: "per post (featured image, not in static scan)",
  otherShared: other.size,
}, null, 2));

function countHomeBreakdown(slots) {
  const b = { hero: 0, factoryIntro: 0, categoryNav: 0, reviews: 0, cta: 0, other: 0 };
  for (const s of slots) {
    if (s.id === "YOUR_HERO_IMAGE_URL") b.hero++;
    else if (s.id === "FACTORY_INTRO_IMAGE_URL") b.factoryIntro++;
    else if (s.id.startsWith("CATEGORY_IMAGE_")) b.categoryNav++;
    else if (s.id.startsWith("REVIEW_IMAGE_")) b.reviews++;
    else if (s.id === "CTA_BACKGROUND_IMAGE_URL") b.cta++;
    else b.other++;
  }
  return b;
}
