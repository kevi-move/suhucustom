/**
 * 一键写入 Supabase 密钥到 .env.local
 *
 * 用法（把 key 换成你从 Supabase 复制的）：
 *   node scripts/setup-supabase-keys.mjs "eyJhbG..." "eyJhbG..."
 *
 * 第一个参数 = anon public key
 * 第二个参数 = service_role key
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

const anonKey = process.argv[2]?.trim();
const serviceKey = process.argv[3]?.trim();

if (!anonKey || !serviceKey) {
  console.log(`
用法:
  node scripts/setup-supabase-keys.mjs "你的anon_key" "你的service_role_key"

获取位置:
  Supabase 控制台 → Project Settings → API
  - anon public      → 第一个参数
  - service_role     → 第二个参数（secret，仅服务器使用）
`);
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  console.error("找不到 .env.local，请先运行 npm run dev 或从 .env.local.example 复制");
  process.exit(1);
}

let content = fs.readFileSync(envPath, "utf8");

function setEnv(name, value) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  if (re.test(content)) {
    content = content.replace(re, line);
  } else {
    content += `\n${line}\n`;
  }
}

setEnv("NEXT_PUBLIC_SUPABASE_URL", "https://jgcjlqhluegdcqjaskau.supabase.co");
setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey);
setEnv("SUPABASE_SERVICE_ROLE_KEY", serviceKey);

fs.writeFileSync(envPath, content, "utf8");

console.log("✓ 已写入 .env.local");
console.log("  请重启 npm run dev，然后打开 /admin/inquiries 查看配置状态");
