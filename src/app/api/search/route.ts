import { NextResponse } from "next/server";
import { searchSite } from "@/lib/siteSearch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  if (!q || q.length < 2) {
    return NextResponse.json({ query: q, results: [], total: 0 });
  }

  const results = await searchSite(q, limit);

  return NextResponse.json({
    query: q,
    total: results.length,
    results: results.map(({ score, ...rest }) => ({
      ...rest,
      score,
    })),
  });
}
