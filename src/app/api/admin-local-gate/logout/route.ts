import { NextResponse } from "next/server";
import { ADMIN_LOCAL_GATE_COOKIE, isAdminLocalGateEnabled } from "@/lib/adminLocalGate";

export async function POST() {
  if (!isAdminLocalGateEnabled()) {
    return NextResponse.json({ error: "Local admin gate is disabled" }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_LOCAL_GATE_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return res;
}
