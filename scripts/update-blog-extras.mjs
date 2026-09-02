/**
 * Update Overview (aiSummary) and Key Points for all blog posts.
 * Uses curated overrides from blog-extras-overrides.mjs.
 *
 * Usage:
 *   node scripts/update-blog-extras.mjs
 *   node scripts/update-blog-extras.mjs --slug dress-size-chart-guide
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  BLOG_EXTRAS_OVERRIDES,
  applyBlogExtrasOverride,
} from "./lib/blog-extras-overrides.mjs";
import {
  injectBlogExtrasIntoContent,
  stripBlogExtrasFromContent,
} from "./lib/blog-extras.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env.local");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function extractExtrasFromContent(content) {
  const match = content.match(
    /<div\s+data-blog-extras="([^"]*)"\s+hidden\s+aria-hidden="true"\s*><\/div>/i
  );
  if (!match) {
    return { aiSummary: "", keyPoints: [], faqs: [] };
  }
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return { aiSummary: "", keyPoints: [], faqs: [] };
  }
}

async function main() {
  const env = { ...process.env, ...loadEnvFile(envPath) };
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const slugFilter = process.argv.includes("--slug")
    ? process.argv[process.argv.indexOf("--slug") + 1]
    : null;

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = admin.from("blog_posts").select("id, slug, title, content");
  if (slugFilter) query = query.eq("slug", slugFilter);

  const { data: posts, error } = await query;
  if (error) throw new Error(error.message);

  if (!posts?.length) {
    console.log("No posts found.");
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const override = BLOG_EXTRAS_OVERRIDES[post.slug];
    if (!override) {
      console.log(`Skip (no override): ${post.slug}`);
      skipped += 1;
      continue;
    }

    const existing = extractExtrasFromContent(post.content);
    const merged = applyBlogExtrasOverride(post.slug, existing);
    const articleHtml = stripBlogExtrasFromContent(post.content);
    const content = injectBlogExtrasIntoContent(articleHtml, merged);

    const { error: updateError } = await admin
      .from("blog_posts")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", post.id);

    if (updateError) throw new Error(`${post.slug}: ${updateError.message}`);

    console.log(`Updated: ${post.slug}`);
    console.log(`  Overview: ${merged.aiSummary.slice(0, 80)}...`);
    console.log(`  Key Points: ${merged.keyPoints.length}`);
    updated += 1;
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
