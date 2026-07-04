import { NextRequest, NextResponse } from "next/server";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import fs from "fs";
import path from "path";

const EXCLUDED_DIRS = new Set(["admin", "api", "auth"]);

function isRouteGroup(name: string): boolean {
  return name.startsWith("(") && name.endsWith(")");
}

function discoverRoutes(appDir: string): string[] {
  const routes: string[] = [];

  function scan(dir: string, routePath: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const hasPage = entries.some(
      (e) => e.isFile() && (e.name === "page.tsx" || e.name === "page.ts")
    );

    if (hasPage) {
      routes.push(routePath || "/");
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith("[")) continue;
      if (entry.name.startsWith("_")) continue;

      const nextPath = isRouteGroup(entry.name)
        ? routePath
        : `${routePath}/${entry.name}`;

      scan(path.join(dir, entry.name), nextPath);
    }
  }

  scan(appDir, "");
  return routes.sort();
}

function slugToName(slug: string): string {
  if (slug === "/") return "Home";
  return slug
    .replace(/^\//, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function GET(request: NextRequest) {
  const adminEmail = await resolveAdminEmail(request);
  if (!adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appDir = path.join(process.cwd(), "src", "app");
  const routes = discoverRoutes(appDir);

  const pages = routes.map((slug) => ({
    slug,
    name: slugToName(slug),
  }));

  return NextResponse.json(pages);
}
