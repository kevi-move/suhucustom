/**
 * 检查 content_translations 表 + 触发 DeepL bootstrap
 * 用法: node scripts/run-i18n-setup.mjs
 * 若表不存在，请在 Supabase SQL Editor 运行 supabase/RUN_THIS_FOR_I18N.sql
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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

const env = { ...process.env, ...loadEnvFile(envPath) };
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = env.I18N_SETUP_BASE_URL || "http://localhost:3000";
const username = env.ADMIN_LOCAL_USERNAME;
const password = env.ADMIN_LOCAL_PASSWORD;

async function checkTables() {
  if (!supabaseUrl || !serviceKey) {
    console.error("缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: translationsError } = await admin
    .from("content_translations")
    .select("id")
    .limit(1);

  const { error: metaError } = await admin.from("page_meta").select("id").limit(1);

  return {
    contentTranslations: !translationsError || translationsError.code !== "PGRST205",
    pageMeta: !metaError || metaError.code !== "PGRST205",
    translationsError,
    metaError,
  };
}

function extractGateCookie(setCookieHeader) {
  if (!setCookieHeader) return null;
  const parts = setCookieHeader.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith("suhu_admin_local_gate=")) {
      return trimmed.split(";")[0];
    }
  }
  return null;
}

async function loginAndBootstrap() {
  const loginRes = await fetch(`${baseUrl}/api/admin-local-gate/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Admin login failed (${loginRes.status}): ${body}`);
  }

  const setCookie = loginRes.headers.get("set-cookie");
  const gateCookie = extractGateCookie(setCookie);
  if (!gateCookie) {
    throw new Error(`Admin login succeeded but gate cookie missing. set-cookie: ${setCookie}`);
  }

  const bootstrapRes = await fetch(`${baseUrl}/api/admin/translations/bootstrap`, {
    method: "POST",
    headers: { Cookie: gateCookie },
  });

  const body = await bootstrapRes.json().catch(() => ({}));
  if (!bootstrapRes.ok) {
    throw new Error(`Bootstrap failed (${bootstrapRes.status}): ${JSON.stringify(body)}`);
  }

  return body;
}

async function main() {
  console.log("=== i18n setup ===\n");

  const tables = await checkTables();
  console.log(`content_translations: ${tables.contentTranslations ? "OK" : "MISSING"}`);
  console.log(`page_meta: ${tables.pageMeta ? "OK" : "MISSING"}`);

  if (!tables.contentTranslations) {
    console.error(`
content_translations 表不存在。
请在 Supabase → SQL Editor 运行:
  supabase/RUN_THIS_FOR_I18N.sql
然后重新执行: node scripts/run-i18n-setup.mjs
`);
    process.exit(1);
  }

  if (!tables.pageMeta) {
    console.warn("page_meta 表缺失（可选），建议一并运行 RUN_THIS_FOR_I18N.sql\n");
  }

  if (!username || !password) {
    console.error("缺少 ADMIN_LOCAL_USERNAME / ADMIN_LOCAL_PASSWORD");
    process.exit(1);
  }

  console.log(`\n触发 DeepL bootstrap (${baseUrl})...`);
  const result = await loginAndBootstrap();
  console.log("Bootstrap 成功:", JSON.stringify(result, null, 2));
  console.log("\n请访问 http://localhost:3000/zh-TW 验证导航与页面标题。");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
