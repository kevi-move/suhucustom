/**
 * Import a Markdown article from 文章输出 into blog_posts as draft.
 *
 * Usage:
 *   node scripts/import-blog-draft.mjs path/to/article.md
 *   node scripts/import-blog-draft.mjs --dir "D:/UserData/Work/kevi_work/admin-test/文章输出"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";
import { extractBlogExtras } from "./lib/parse-blog-markdown.mjs";
import { parseArticleHtml } from "./lib/parse-article-html.mjs";
import { injectBlogExtrasIntoContent } from "./lib/blog-extras.mjs";
import { applyBlogExtrasOverride } from "./lib/blog-extras-overrides.mjs";

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

function parseMetadataLine(line) {
  const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
  if (!match) return null;
  return { key: match[1].trim().toLowerCase(), value: match[2].trim() };
}

function stripBackticks(value) {
  return value.replace(/^`(.+)`$/, "$1").trim();
}

function parseOptionalYamlFrontMatter(raw) {
  if (!raw.startsWith("---")) {
    return { metadata: {}, content: raw };
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    return { metadata: {}, content: raw };
  }

  const metadata = {};
  for (const line of match[1].split("\n")) {
    const parsed = line.match(/^([a-zA-Z0-9_ -]+):\s*(.+)$/);
    if (!parsed) continue;
    const key = parsed[1].trim().toLowerCase().replace(/_/g, " ");
    metadata[key] = stripBackticks(parsed[2].trim().replace(/^["']|["']$/g, ""));
  }

  return { metadata, content: raw.slice(match[0].length) };
}

function parseArticleMarkdown(raw) {
  const normalized = raw.replace(/^\uFEFF/, "");
  const { metadata: yamlMetadata, content } = parseOptionalYamlFrontMatter(normalized);
  const hasYamlFrontMatter = Object.keys(yamlMetadata).length > 0;
  const lines = content.split(/\r?\n/);
  let title = "";
  const metadata = {};
  let separatorIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!hasYamlFrontMatter && line.trim() === "---") {
      const hasMarkdownMeta = Object.keys(metadata).length > 0;
      if (hasMarkdownMeta || (title && i <= 25)) {
        separatorIndex = i;
        break;
      }
    }
    if (!title && line.startsWith("# ")) {
      title = line.slice(2).trim();
      continue;
    }
    const meta = parseMetadataLine(line.trim());
    if (meta) metadata[meta.key] = stripBackticks(meta.value);
  }

  const bodyStart =
    separatorIndex >= 0
      ? lines.slice(separatorIndex + 1).join("\n").trim()
      : lines.join("\n").trim();

  const inlineMeta = {};
  const bodyLines = bodyStart.split(/\r?\n/);
  let bodyStartIndex = 0;
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    if (!line) continue;
    if (line === "---") {
      bodyStartIndex = i + 1;
      continue;
    }
    const meta = parseMetadataLine(line);
    if (!meta) {
      if (Object.keys(inlineMeta).length > 0) {
        bodyStartIndex = i;
        break;
      }
      bodyStartIndex = i;
      break;
    }
    inlineMeta[meta.key] = stripBackticks(meta.value);
    bodyStartIndex = i + 1;
  }

  const mergedMetadata = { ...yamlMetadata, ...metadata, ...inlineMeta };
  let body = bodyLines.slice(bodyStartIndex).join("\n").trim();

  if (title) {
    const titleHeading = `# ${title}`;
    if (body.startsWith(titleHeading)) {
      body = body.slice(titleHeading.length).replace(/^\s+/, "");
    }
  }

  const slug =
    mergedMetadata["url slug"] ||
    mergedMetadata["suggested slug"] ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const metaTitle = mergedMetadata["seo title"] || title;
  const metaDescription = mergedMetadata["meta description"] || "";
  const featuredImage =
    mergedMetadata["featured image"] ||
    mergedMetadata["suggested featured image filename"] ||
    "";

  const excerpt =
    metaDescription ||
    body
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find((block) => block && !block.startsWith("#") && !block.startsWith("|") && !block.startsWith("!["))
      ?.replace(/\*\*(.+?)\*\*/g, "$1")
      ?.replace(/\[(.+?)\]\(.+?\)/g, "$1")
      ?.slice(0, 280) ||
    "";

  return {
    title: title || metaTitle,
    slug,
    metaTitle,
    metaDescription,
    featuredImage,
    excerpt,
    bodyMarkdown: body,
    metadata: mergedMetadata,
  };
}

function markdownToHtml(markdown) {
  marked.setOptions({
    gfm: true,
    breaks: false,
  });
  return marked.parse(markdown);
}

async function importArticle(admin, filePath, authorEmail) {
  const raw = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();

  let parsed;
  let extracted;
  let bodyHtml;

  if (ext === ".html") {
    parsed = parseArticleHtml(raw, filePath);
    extracted = {
      bodyMarkdown: "",
      aiSummary: parsed.aiSummary,
      keyPoints: parsed.keyPoints,
      faqs: parsed.faqs,
    };
    bodyHtml = parsed.bodyHtml;
  } else {
    parsed = parseArticleMarkdown(raw);
    extracted = extractBlogExtras(parsed.bodyMarkdown, parsed.metadata || {});
    bodyHtml = markdownToHtml(extracted.bodyMarkdown);
  }

  const extras = applyBlogExtrasOverride(parsed.slug, {
    aiSummary: extracted.aiSummary,
    keyPoints: extracted.keyPoints,
    faqs: extracted.faqs,
  });

  const content = injectBlogExtrasIntoContent(bodyHtml, extras);

  const { data: existing, error: existingError } = await admin
    .from("blog_posts")
    .select("id, title, slug, status")
    .eq("slug", parsed.slug)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to check existing slug: ${existingError.message}`);
  }

  const now = new Date().toISOString();
  const row = {
    title: parsed.title,
    slug: parsed.slug,
    content,
    excerpt: parsed.excerpt,
    featured_image: parsed.featuredImage,
    status: "draft",
    category_id: null,
    author_ref: null,
    updated_at: now,
    meta_title: parsed.metaTitle || null,
    meta_description: parsed.metaDescription || null,
    published_at: null,
    author_id: "import-script",
    author_email: authorEmail,
  };

  if (existing) {
    const { data, error } = await admin
      .from("blog_posts")
      .update(row)
      .eq("id", existing.id)
      .select("id, slug, status")
      .single();

    if (error) throw new Error(`Failed to update post: ${error.message}`);
    return {
      action: "updated",
      post: data,
      parsed: {
        ...parsed,
        aiSummary: extras.aiSummary,
        keyPointsCount: extras.keyPoints.length,
        faqsCount: extras.faqs.length,
      },
    };
  }

  const { data, error } = await admin
    .from("blog_posts")
    .insert({ ...row, created_at: now })
    .select("id, slug, status")
    .single();

  if (error) throw new Error(`Failed to create post: ${error.message}`);
  return {
    action: "created",
    post: data,
    parsed: {
      ...parsed,
      aiSummary: extras.aiSummary,
      keyPointsCount: extras.keyPoints.length,
      faqsCount: extras.faqs.length,
    },
  };
}

function resolveInputPaths(args) {
  if (args.length === 0) {
    console.error("Usage: node scripts/import-blog-draft.mjs <file.md> [more.md ...]");
    console.error('   or: node scripts/import-blog-draft.mjs --dir "path/to/文章输出"');
    process.exit(1);
  }

  if (args[0] === "--dir") {
    const dir = path.resolve(args[1] || "");
    if (!fs.existsSync(dir)) {
      console.error(`Directory not found: ${dir}`);
      process.exit(1);
    }
    return fs
      .readdirSync(dir)
      .filter((name) => /\.(md|html)$/i.test(name))
      .map((name) => path.join(dir, name));
  }

  return args.map((arg) => path.resolve(arg));
}

async function main() {
  const env = { ...process.env, ...loadEnvFile(envPath) };
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const authorEmail =
    env.ADMIN_LOCAL_IDENTITY_EMAIL ||
    env.NEXT_PUBLIC_ADMIN_LOCAL_DISPLAY_EMAIL ||
    "import@suhucustom.local";

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const files = resolveInputPaths(process.argv.slice(2));
  if (files.length === 0) {
    console.error("No .md or .html files found to import.");
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const filePath of files) {
    console.log(`\nImporting: ${filePath}`);
    const result = await importArticle(admin, filePath, authorEmail);
    console.log(`  ${result.action === "created" ? "Created" : "Updated"} draft: ${result.parsed.title}`);
    console.log(`  Slug: ${result.parsed.slug}`);
    console.log(`  AI Summary: ${result.parsed.aiSummary ? "yes" : "no"}`);
    console.log(`  Key Points: ${result.parsed.keyPointsCount ?? 0}`);
    console.log(`  FAQs: ${result.parsed.faqsCount ?? 0}`);
    console.log(`  Post ID: ${result.post.id}`);
    console.log(`  Admin: /admin/blog/${result.post.id}`);
  }

  console.log("\nDone. Open /admin/blog to upload images and publish when ready.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
