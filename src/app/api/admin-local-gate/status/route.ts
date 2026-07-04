import { NextRequest, NextResponse } from "next/server";
import {
  isAdminLocalGateConfigured,
  isAdminLocalGateEnabled,
  verifyAdminLocalGateFromRequest,
} from "@/lib/adminLocalGate";

export async function GET(request: NextRequest) {
  if (!isAdminLocalGateEnabled()) {
    return NextResponse.json({ enabled: false }, { status: 200 });
  }

  if (!isAdminLocalGateConfigured()) {
    return NextResponse.json({ enabled: true, configured: false }, { status: 503 });
  }

  const ok = await verifyAdminLocalGateFromRequest(request);
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, enabled: true, configured: true });
}
