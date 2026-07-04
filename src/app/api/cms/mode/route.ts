import { NextRequest, NextResponse } from "next/server";
import { resolveAdminEmail } from "@/lib/requestAdmin";

const COOKIE_NAME = "cms-edit-mode";

async function ensureAdmin(request: NextRequest): Promise<{ ok: boolean; email?: string }> {
  const email = await resolveAdminEmail(request);
  if (!email) return { ok: false };
  return { ok: true, email };
}

export async function GET(request: NextRequest) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ enabled: false, authorized: false }, { status: 200 });
  }

  const enabled = request.cookies.get(COOKIE_NAME)?.value === "1";
  return NextResponse.json({ enabled, authorized: true });
}

export async function PUT(request: NextRequest) {
  const guard = await ensureAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { enabled?: boolean };
  const enabled = Boolean(body.enabled);
  const response = NextResponse.json({ enabled, authorized: true });
  response.cookies.set(COOKIE_NAME, enabled ? "1" : "0", {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 12,
  });
  return response;
}
