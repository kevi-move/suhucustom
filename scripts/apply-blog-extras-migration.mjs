/**
 * Apply blog_posts extras columns migration.
 * Requires SUPABASE_DB_URL in .env.local (Supabase → Project Settings → Database → Connection string → URI)
 *
 * Usage: node scripts/apply-blog-extras-migration.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env.local");
const migrationPath = path.join(
  root,
  "supabase/migrations/20260719_add_blog_post_extras.sql"
);

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

async function main() {
  const env = { ...process.env, ...loadEnvFile(envPath) };
  const dbUrl = env.SUPABASE_DB_URL || env.DATABASE_URL;

  if (!dbUrl) {
    console.error("Missing SUPABASE_DB_URL in .env.local");
    console.error("");
    console.error("Add your Supabase Postgres connection string, then re-run:");
    console.error("  node scripts/apply-blog-extras-migration.mjs");
    console.error("");
    console.error("Or run this SQL manually in Supabase SQL Editor:");
    console.error(fs.readFileSync(migrationPath, "utf8"));
    process.exit(1);
  }

  let postgres;
  try {
    postgres = (await import("postgres")).default;
  } catch {
    console.error("Installing postgres driver...");
    const { execSync } = await import("node:child_process");
    execSync("npm install postgres --save-dev", { cwd: root, stdio: "inherit" });
    postgres = (await import("postgres")).default;
  }

  const sql = postgres(dbUrl, { ssl: "require", max: 1 });
  const migration = fs.readFileSync(migrationPath, "utf8");

  try {
    await sql.unsafe(migration);
    console.log("Migration applied successfully.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
