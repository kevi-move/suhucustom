import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_LOCAL_GATE_COOKIE,
  adminLocalGateCookieOptions,
  createAdminLocalGateSessionExpiry,
  getAdminLocalGateSecret,
  isAdminLocalGateConfigured,
  isAdminLocalGateEnabled,
  localGateCredentialsMatch,
  signAdminLocalGateToken,
} from "@/lib/adminLocalGate";

export async function POST(request: NextRequest) {
  if (!isAdminLocalGateEnabled()) {
    return NextResponse.json({ error: "Local admin gate is disabled" }, { status: 404 });
  }

  if (!isAdminLocalGateConfigured()) {
    return NextResponse.json(
      {
        error:
          "Server is missing ADMIN_LOCAL_USERNAME, ADMIN_LOCAL_PASSWORD, or ADMIN_LOCAL_SECRET (min 16 chars).",
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!localGateCredentialsMatch(username, password)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const secret = getAdminLocalGateSecret();
  const expiresAtMs = createAdminLocalGateSessionExpiry();
  const token = await signAdminLocalGateToken(secret, expiresAtMs);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    ADMIN_LOCAL_GATE_COOKIE,
    token,
    adminLocalGateCookieOptions(expiresAtMs)
  );
  return res;
}
