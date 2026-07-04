/**
 * Auto-generate images via OpenAI Images API (DALL-E 3 / GPT Image).
 * Reads CHATGPT-PROMPTS.txt — ONLY writes PNG files, never touches site code.
 *
 * Setup:
 *   1. Get API key: https://platform.openai.com/api-keys
 *      (ChatGPT Plus membership ≠ API; you need separate API billing)
 *   2. Add to .env.local: OPENAI_API_KEY=sk-...
 *
 * Usage:
 *   node scripts/openai-generate-images.mjs --folder=homepage-seo-images
 *   node scripts/openai-generate-images.mjs --folder=shared-factory-process
 *   node scripts/openai-generate-images.mjs --folder=homepage-seo-images --limit=3
 *   node scripts/openai-generate-images.mjs --folder=homepage-seo-images --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public", "generated");

const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const SIZE = process.env.OPENAI_IMAGE_SIZE || "1536x1024"; // landscape ~16:10
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "medium"; // low|medium|high
const DELAY_MS = Number(process.env.OPENAI_REQUEST_DELAY_MS || 800);

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function parseArgs() {
  const opts = { folder: "homepage-seo-images", limit: Infinity, force: false, dryRun: false };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--folder=")) opts.folder = arg.split("=")[1];
    else if (arg.startsWith("--limit=")) opts.limit = Number(arg.split("=")[1]);
    else if (arg === "--force") opts.force = true;
    else if (arg === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

/** Parse 文件名: xxx.png + following PROMPT: block */
function parsePromptsFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const items = [];
  for (const block of text.split(/\n文件名:\s*/).slice(1)) {
    const firstLineEnd = block.indexOf("\n");
    if (firstLineEnd === -1) continue;
    const filename = block.slice(0, firstLineEnd).trim();
    if (!filename.endsWith(".png")) continue;
    const body = block.slice(firstLineEnd);
    const promptMatch = body.match(/PROMPT:\s*\n([\s\S]+)/);
    if (!promptMatch) continue;
    const prompt = promptMatch[1]
      .split(/\n={10,}/)[0]
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ");
    if (prompt) items.push({ filename, prompt });
  }
  return items;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateOpenAI(apiKey, prompt) {
  const body = {
    model: MODEL,
    prompt,
    n: 1,
    size: SIZE,
  };

  // gpt-image-1 uses quality; dall-e-3 uses different params
  if (MODEL.startsWith("gpt-image")) {
    body.quality = QUALITY;
  } else if (MODEL === "dall-e-3") {
    body.quality = QUALITY === "high" ? "hd" : "standard";
    body.style = "natural";
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    throw new Error(msg);
  }

  const item = data.data?.[0];
  if (item?.b64_json) return Buffer.from(item.b64_json, "base64");
  if (item?.url) {
    const imgRes = await fetch(item.url);
    if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
    return Buffer.from(await imgRes.arrayBuffer());
  }
  throw new Error("No image data in response");
}

async function main() {
  loadEnvLocal();
  const opts = parseArgs();
  const apiKey = process.env.OPENAI_API_KEY;

  const folderPath = path.join(PUBLIC, opts.folder);
  const promptsFile = path.join(folderPath, "CHATGPT-PROMPTS.txt");

  if (!fs.existsSync(promptsFile)) {
    console.error("Missing:", promptsFile);
    process.exit(1);
  }

  let items = parsePromptsFile(promptsFile);
  if (!opts.force) {
    items = items.filter((item) => !fs.existsSync(path.join(folderPath, item.filename)));
  }
  items = items.slice(0, opts.limit);

  console.log(`Folder: public/generated/${opts.folder}/`);
  console.log(`Model: ${MODEL} | Size: ${SIZE} | Queue: ${items.length}`);

  if (opts.dryRun) {
    items.forEach((item, i) => console.log(`${i + 1}. ${item.filename}`));
    return;
  }

  if (!apiKey) {
    console.error(`
Missing OPENAI_API_KEY.

ChatGPT Plus 会员不能直接给脚本用，需要在 OpenAI 平台单独开 API：
  https://platform.openai.com/api-keys

在 .env.local 添加：
  OPENAI_API_KEY=sk-proj-...

然后重新运行：
  node scripts/openai-generate-images.mjs --folder=${opts.folder}
`);
    process.exit(1);
  }

  fs.mkdirSync(folderPath, { recursive: true });

  let ok = 0;
  let fail = 0;
  const started = Date.now();

  for (let i = 0; i < items.length; i++) {
    const { filename, prompt } = items[i];
    const dest = path.join(folderPath, filename);
    process.stdout.write(`[${i + 1}/${items.length}] ${filename} ... `);

    try {
      const buf = await generateOpenAI(apiKey, prompt);
      fs.writeFileSync(dest, buf);
      console.log("OK");
      ok++;
    } catch (err) {
      console.log("FAIL");
      console.error("  ", err.message);
      fail++;
      // Rate limit — wait and retry once
      if (/rate|429|quota/i.test(err.message)) {
        console.log("  Waiting 30s then retry...");
        await sleep(30000);
        try {
          const buf = await generateOpenAI(apiKey, prompt);
          fs.writeFileSync(dest, buf);
          console.log("  Retry OK");
          ok++;
          fail--;
        } catch (e2) {
          console.error("  Retry failed:", e2.message);
        }
      }
    }

    if (i < items.length - 1) await sleep(DELAY_MS);
  }

  const mins = ((Date.now() - started) / 60000).toFixed(1);
  console.log(`\nDone in ${mins} min. Success: ${ok}, Failed: ${fail}`);
  console.log(`Output: ${folderPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
