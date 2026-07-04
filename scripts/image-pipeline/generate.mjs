/**
 * Batch-generate images via 火山方舟 Doubao Seedream API.
 *
 * Prerequisites:
 *   1. Create API Key: https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
 *   2. Enable model Doubao-Seedream-4.0 (or set ARK_IMAGE_MODEL)
 *   3. Set env: ARK_API_KEY=your_key
 *
 * Usage:
 *   node scripts/image-pipeline/scan.mjs          # refresh manifest
 *   node scripts/image-pipeline/generate.mjs        # all pending
 *   node scripts/image-pipeline/generate.mjs --phase=home
 *   node scripts/image-pipeline/generate.mjs --limit=5 --dry-run
 *
 * Phases: home | about | services | all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const MANIFEST = path.join(__dirname, "manifest.json");
const STATE = path.join(__dirname, "generation-state.json");
const PUBLIC = path.join(ROOT, "public");

const API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const MODEL = process.env.ARK_IMAGE_MODEL || "doubao-seedream-4-0-250828";
const CONCURRENCY = Number(process.env.CONCURRENCY || 2);
const DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1500);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { phase: "all", limit: Infinity, dryRun: false, force: false };
  for (const arg of args) {
    if (arg.startsWith("--phase=")) opts.phase = arg.split("=")[1];
    else if (arg.startsWith("--limit=")) opts.limit = Number(arg.split("=")[1]);
    else if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--force") opts.force = true;
  }
  return opts;
}

function loadState() {
  if (fs.existsSync(STATE)) return JSON.parse(fs.readFileSync(STATE, "utf8"));
  return { completed: {}, failed: {} };
}

function saveState(state) {
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2), "utf8");
}

function matchesPhase(slot, phase) {
  if (phase === "all") return true;
  if (phase === "home") return slot.product === "home";
  if (phase === "about") return slot.product === "about us";
  if (phase === "services") return slot.product !== "home" && slot.product !== "about us";
  return true;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateOne(apiKey, slot) {
  const [width, height] = slot.size.includes("x")
    ? slot.size.split("x").map(Number)
    : [null, null];

  const body = {
    model: MODEL,
    prompt: slot.prompt,
    response_format: "url",
    size: width && height ? `${width}x${height}` : "2K",
    watermark: false,
    stream: false,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || JSON.stringify(data));
  }

  const url = data?.data?.[0]?.url;
  if (!url) throw new Error("No image URL in response");
  return url;
}

async function downloadToFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

async function runPool(tasks, worker) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < tasks.length) {
      const i = index++;
      try {
        results[i] = { ok: true, value: await worker(tasks[i]) };
      } catch (err) {
        results[i] = { ok: false, error: err };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, next));
  return results;
}

async function main() {
  const opts = parseArgs();
  const apiKey = process.env.ARK_API_KEY;

  if (!fs.existsSync(MANIFEST)) {
    console.error("Run scan first: node scripts/image-pipeline/scan.mjs");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const state = loadState();

  let queue = manifest.slots.filter((s) => matchesPhase(s, opts.phase));
  queue = queue.filter((s) => opts.force || !state.completed[s.id]);
  queue = queue.slice(0, opts.limit);

  console.log(`Phase: ${opts.phase} | Queue: ${queue.length} images | Model: ${MODEL}`);

  if (opts.dryRun) {
    for (const slot of queue.slice(0, 10)) {
      console.log("\n---", slot.id);
      console.log("→", slot.outputPath);
      console.log(slot.prompt.slice(0, 200) + "...");
    }
    if (queue.length > 10) console.log(`\n... and ${queue.length - 10} more`);
    return;
  }

  if (!apiKey) {
    console.error("Missing ARK_API_KEY. Get one at https://console.volcengine.com/ark");
    process.exit(1);
  }

  let done = 0;
  const results = await runPool(queue, async (slot) => {
    await sleep(DELAY_MS);
    const imageUrl = await generateOne(apiKey, slot);
    const dest = path.join(PUBLIC, slot.outputPath.replace(/^\//, ""));
    await downloadToFile(imageUrl, dest);

    state.completed[slot.id] = {
      outputPath: slot.outputPath,
      generatedAt: new Date().toISOString(),
      prompt: slot.prompt,
    };
    delete state.failed[slot.id];
    saveState(state);

    done++;
    console.log(`[${done}/${queue.length}] ✓ ${slot.id} → ${slot.outputPath}`);
    return slot.outputPath;
  });

  let failed = 0;
  for (let i = 0; i < queue.length; i++) {
    const r = results[i];
    if (!r?.ok) {
      failed++;
      state.failed[queue[i].id] = String(r?.error?.message || r?.error);
      console.error(`✗ ${queue[i].id}:`, r?.error?.message || r?.error);
    }
  }
  saveState(state);

  console.log(`\nDone. Success: ${queue.length - failed}, Failed: ${failed}`);
  console.log(`State: ${STATE}`);
  console.log("Next: node scripts/image-pipeline/apply.mjs");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
