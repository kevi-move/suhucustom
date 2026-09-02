/**
 * Backfill blog translations into content_translations.
 * Provider priority: free Gemini → DeepL.
 *
 * Usage:
 *   node scripts/sync-blog-translations.mjs
 *   node scripts/sync-blog-translations.mjs --slug glove-sizing-guide
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { ProxyAgent, fetch as undiciFetch } from "undici";

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

const fileEnv = loadEnvFile(envPath);
for (const [key, value] of Object.entries(fileEnv)) {
  if (!process.env[key]) process.env[key] = value;
}

function probePort(port, host = "127.0.0.1", timeoutMs = 300) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.on("connect", () => done(true));
    socket.on("timeout", () => done(false));
    socket.on("error", () => done(false));
  });
}

async function resolveProxyUrl() {
  const configured =
    process.env.TRANSLATE_HTTP_PROXY?.trim() ||
    process.env.HTTPS_PROXY?.trim() ||
    process.env.HTTP_PROXY?.trim();
  if (configured) return configured;

  for (const port of [7897, 7890, 10809, 1080, 6152]) {
    if (await probePort(port)) return `http://127.0.0.1:${port}`;
  }
  return null;
}

const proxyUrl = await resolveProxyUrl();
const proxyAgent = proxyUrl ? new ProxyAgent(proxyUrl) : null;

async function httpFetch(url, init = {}) {
  if (proxyAgent) {
    return undiciFetch(url, { ...init, dispatcher: proxyAgent });
  }
  return fetch(url, init);
}

const LOCALES = ["zh-TW", "ko", "ja", "fr", "ru"];
const LOCALE_LANGUAGE_NAME = {
  "zh-TW": "Traditional Chinese (zh-TW / 繁體中文)",
  ko: "Korean",
  ja: "Japanese",
  fr: "French",
  ru: "Russian",
};
const DEEPL_TARGET_LANG = {
  "zh-TW": "ZH-HANT",
  ko: "KO",
  ja: "JA",
  fr: "FR",
  ru: "RU",
};
const HTML_CHUNK_CHARS = 12_000;
const BATCH_SIZE = 20;

function getProvider() {
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.DEEPL_API_KEY?.trim()) return "deepl";
  return null;
}

function getDeepLBaseUrl(apiKey) {
  if (process.env.DEEPL_API_URL?.trim()) return process.env.DEEPL_API_URL.trim();
  return apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2"
    : "https://api.deepl.com/v2";
}

function stripCodeFence(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json|html|htm)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await httpFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 },
    }),
  });
  if (!response.ok) {
    throw new Error(`Gemini API error (${response.status}): ${await response.text()}`);
  }
  const json = await response.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("")?.trim() || "";
  if (!text) throw new Error("Gemini returned empty translation.");
  return text;
}

async function callDeepL(texts, targetLocale, { tagHandling } = {}) {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPL_API_KEY is not configured in .env.local");

  const body = new URLSearchParams();
  for (const text of texts) body.append("text", text);
  body.append("source_lang", "EN");
  body.append("target_lang", DEEPL_TARGET_LANG[targetLocale]);
  if (tagHandling) body.append("tag_handling", tagHandling);

  const response = await httpFetch(`${getDeepLBaseUrl(apiKey)}/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`DeepL API error (${response.status}): ${await response.text()}`);
  }

  const json = await response.json();
  return json.translations.map((t) => t.text);
}

async function translateTexts(texts, locale) {
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "Set free GEMINI_API_KEY (https://aistudio.google.com/app/apikey) or DEEPL_API_KEY in .env.local"
    );
  }

  if (provider === "gemini") {
    const results = [];
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const chunk = texts.slice(i, i + BATCH_SIZE);
      const prompt = [
        `You are a professional translator.`,
        `Translate each string from English to ${LOCALE_LANGUAGE_NAME[locale]}.`,
        `Return ONLY a valid JSON array of strings with the same length and order.`,
        `Do not add explanations or markdown.`,
        `Preserve brand names like SuhuCustom when natural.`,
        ``,
        `INPUT_JSON:`,
        JSON.stringify(chunk),
      ].join("\n");
      const raw = stripCodeFence(await callGemini(prompt));
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("Gemini text translation did not return JSON array.");
        parsed = JSON.parse(match[0]);
      }
      if (!Array.isArray(parsed) || parsed.length !== chunk.length) {
        throw new Error("Gemini text translation length mismatch.");
      }
      results.push(...parsed.map((item, idx) => (typeof item === "string" ? item : chunk[idx])));
    }
    return results;
  }

  const results = [];
  for (let i = 0; i < texts.length; i += 40) {
    const chunk = texts.slice(i, i + 40);
    results.push(...(await callDeepL(chunk, locale)));
  }
  return results;
}

function splitHtml(html) {
  const trimmed = html.trim();
  if (!trimmed) return [];
  if (trimmed.length <= HTML_CHUNK_CHARS) return [trimmed];

  const markers = [
    "</p>",
    "</h2>",
    "</h3>",
    "</h4>",
    "</ul>",
    "</ol>",
    "</table>",
    "</blockquote>",
    "</div>",
  ];
  const parts = [];
  let remaining = trimmed;

  while (remaining.length > HTML_CHUNK_CHARS) {
    const window = remaining.slice(0, HTML_CHUNK_CHARS);
    let end = -1;
    for (const marker of markers) {
      const idx = window.lastIndexOf(marker);
      if (idx >= 0) end = Math.max(end, idx + marker.length);
    }
    if (end < HTML_CHUNK_CHARS * 0.4) {
      const tagClose = window.lastIndexOf(">");
      end = tagClose > HTML_CHUNK_CHARS * 0.5 ? tagClose + 1 : HTML_CHUNK_CHARS;
    }
    parts.push(remaining.slice(0, end));
    remaining = remaining.slice(end).trimStart();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

async function translateHtml(html, locale) {
  const chunks = splitHtml(html);
  if (chunks.length === 0) return html;
  const provider = getProvider();
  const out = [];

  for (const chunk of chunks) {
    if (provider === "gemini") {
      const prompt = [
        `You are a professional translator for an apparel manufacturing website.`,
        `Translate the following HTML from English to ${LOCALE_LANGUAGE_NAME[locale]}.`,
        `Rules:`,
        `- Keep ALL HTML tags, attributes, classes, ids, and structure unchanged.`,
        `- Only translate human-readable text nodes.`,
        `- Do not translate URLs, email addresses, or HTML attribute names.`,
        `- Preserve brand names like SuhuCustom when natural.`,
        `- Return ONLY the translated HTML, no markdown fences or commentary.`,
        ``,
        `HTML:`,
        chunk,
      ].join("\n");
      out.push(stripCodeFence(await callGemini(prompt)));
    } else {
      const [translated] = await callDeepL([chunk], locale, { tagHandling: "html" });
      out.push(translated ?? chunk);
    }
  }
  return out.join("");
}

const CTA_HTML = `<div class="blog-inline-cta" data-blog-cta="quote"></div>`;
const CTA_REGEX = /<div\b[^>]*\bdata-blog-cta="quote"[^>]*>\s*<\/div>/gi;

function splitByCta(html) {
  const segments = [];
  let lastIndex = 0;
  let match;
  CTA_REGEX.lastIndex = 0;
  while ((match = CTA_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "html", content: html.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "cta" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    segments.push({ kind: "html", content: html.slice(lastIndex) });
  }
  return segments.length ? segments : [{ kind: "html", content: html }];
}

async function translateArticleHtml(html, locale) {
  const segments = splitByCta(html);
  const parts = [];
  for (const segment of segments) {
    if (segment.kind === "cta") {
      parts.push(CTA_HTML);
      continue;
    }
    if (!segment.content.trim()) {
      parts.push(segment.content);
      continue;
    }
    parts.push(await translateHtml(segment.content, locale));
  }
  return parts.join("");
}

const EXTRAS_ATTR = "data-blog-extras";

function extractExtras(content) {
  const match = content.match(
    new RegExp(`<div\\s+${EXTRAS_ATTR}="([^"]*)"\\s+hidden\\s+aria-hidden="true"\\s*></div>`, "i")
  );
  const strip = (html) =>
    html
      .replace(
        new RegExp(
          `<div\\s+${EXTRAS_ATTR}="[^"]*"\\s+hidden\\s+aria-hidden="true"\\s*></div>\\s*`,
          "i"
        ),
        ""
      )
      .trim();

  if (!match) return { extras: { aiSummary: "", keyPoints: [], faqs: [] }, content: strip(content) };

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return {
      extras: {
        aiSummary: typeof parsed.aiSummary === "string" ? parsed.aiSummary : "",
        keyPoints: Array.isArray(parsed.keyPoints)
          ? parsed.keyPoints.filter((x) => typeof x === "string")
          : [],
        faqs: Array.isArray(parsed.faqs)
          ? parsed.faqs.filter(
              (f) => f && typeof f.question === "string" && typeof f.answer === "string"
            )
          : [],
      },
      content: strip(content),
    };
  } catch {
    return { extras: { aiSummary: "", keyPoints: [], faqs: [] }, content: strip(content) };
  }
}

function injectExtras(content, extras) {
  const cleaned = content
    .replace(
      new RegExp(
        `<div\\s+${EXTRAS_ATTR}="[^"]*"\\s+hidden\\s+aria-hidden="true"\\s*></div>\\s*`,
        "i"
      ),
      ""
    )
    .trim();
  const marker = `<div ${EXTRAS_ATTR}="${encodeURIComponent(JSON.stringify(extras))}" hidden aria-hidden="true"></div>`;
  return `${marker}\n${cleaned}`.trim();
}

const SKIP_KEY = /^(slug|href|url|src|image(url)?|featuredimage|email|id|path|pageSlug|updatedby)$/i;
const SKIP_VALUE = /^(https?:\/\/|\/|data:|mailto:|#|[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i;

function shouldTranslate(key, value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 50_000) return false;
  if (SKIP_KEY.test(key) || SKIP_VALUE.test(trimmed)) return false;
  if (/\.(webp|png|jpe?g|gif|svg|avif|pdf)(\?|$)/i.test(trimmed)) return false;
  if (/^[a-z0-9-]+$/i.test(trimmed) && !/\s/.test(trimmed) && trimmed.length < 40) return false;
  return /[a-zA-Z\u00C0-\u024F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(trimmed);
}

function collectLeaves(value, path = "") {
  if (typeof value === "string") {
    const key = path.split(".").pop() || "";
    return shouldTranslate(key, value) ? [{ path, value }] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectLeaves(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, child]) =>
      collectLeaves(child, path ? `${path}.${k}` : k)
    );
  }
  return [];
}

function setByPath(obj, path, newValue) {
  const tokens = [];
  const regex = /([^[\].]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) tokens.push(match[1]);
    if (match[2] != null) tokens.push(Number(match[2]));
  }
  let current = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (typeof token === "number") {
      current = current[token];
      continue;
    }
    if (current[token] == null || typeof current[token] !== "object") {
      current[token] = typeof nextToken === "number" ? [] : {};
    }
    current = current[token];
  }
  const last = tokens[tokens.length - 1];
  current[last] = newValue;
}

async function translateJson(input, locale) {
  const leaves = collectLeaves(input);
  if (!leaves.length) return structuredClone(input);
  const translatedValues = await translateTexts(
    leaves.map((l) => l.value),
    locale
  );
  const output = structuredClone(input);
  leaves.forEach((leaf, i) => setByPath(output, leaf.path, translatedValues[i] ?? leaf.value));
  return output;
}

function parseArgs(argv) {
  const slugIdx = argv.indexOf("--slug");
  return {
    slug: slugIdx >= 0 ? argv[slugIdx + 1] : null,
  };
}

async function hasFreshTranslations(admin, postId, version) {
  const { data, error } = await admin
    .from("content_translations")
    .select("locale,source_version")
    .eq("source_type", "blog")
    .eq("source_id", postId);

  if (error || !data?.length) return false;
  const byLocale = new Map(data.map((row) => [row.locale, row.source_version]));
  return LOCALES.every((locale) => byLocale.get(locale) === version);
}

async function syncPost(admin, post) {
  const version = Math.floor(new Date(post.updated_at).getTime() / 1000);

  if (await hasFreshTranslations(admin, post.id, version)) {
    console.log(`\n→ ${post.slug} (already up to date, skip)`);
    return;
  }

  const { extras, content: bodyHtml } = extractExtras(post.content || "");
  const structured = {
    title: post.title || "",
    excerpt: post.excerpt || "",
    metaTitle: post.meta_title || "",
    metaDescription: post.meta_description || "",
    aiSummary: extras.aiSummary || "",
    keyPoints: extras.keyPoints || [],
    faqs: extras.faqs || [],
  };

  console.log(`\n→ ${post.slug} (${post.id})`);

  for (const locale of LOCALES) {
    process.stdout.write(`  ${locale}... `);
    const translated = await translateJson(structured, locale);
    const translatedBody = bodyHtml ? await translateArticleHtml(bodyHtml, locale) : "";
    const payload = {
      title: translated.title || post.title,
      excerpt: translated.excerpt || post.excerpt,
      metaTitle: translated.metaTitle || post.meta_title || "",
      metaDescription: translated.metaDescription || post.meta_description || "",
      content: injectExtras(translatedBody, {
        aiSummary: translated.aiSummary || "",
        keyPoints: translated.keyPoints || [],
        faqs: translated.faqs || [],
      }),
    };

    const { error } = await admin.from("content_translations").upsert(
      {
        source_type: "blog",
        source_id: post.id,
        locale,
        content: payload,
        source_version: version,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "source_type,source_id,locale" }
    );

    if (error) throw new Error(error.message);
    console.log("ok");
  }
}

async function main() {
  const { slug } = parseArgs(process.argv.slice(2));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "Missing free GEMINI_API_KEY (https://aistudio.google.com/app/apikey) or DEEPL_API_KEY"
    );
  }
  console.log(`Provider: ${provider}`);
  console.log(`Proxy: ${proxyUrl || "(none)"}`);

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = admin
    .from("blog_posts")
    .select("id,slug,title,excerpt,content,meta_title,meta_description,updated_at,status")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (slug) query = query.eq("slug", slug);

  const { data: posts, error } = await query;
  if (error) throw new Error(error.message);
  if (!posts?.length) {
    console.log(slug ? `No published post found for slug: ${slug}` : "No published posts found.");
    return;
  }

  console.log(`Syncing ${posts.length} published post(s) → ${LOCALES.join(", ")}`);
  for (const post of posts) {
    await syncPost(admin, post);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
