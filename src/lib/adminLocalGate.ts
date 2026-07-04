import type { NextRequest } from "next/server";
import { SITE_EMAIL } from "@/lib/siteContact";

/** HttpOnly cookie set after successful local gate login (not Supabase). */
export const ADMIN_LOCAL_GATE_COOKIE = "suhu_admin_local_gate";

const MAX_SESSION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function isAdminLocalGateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_LOCAL_GATE === "true";
}

export function getLocalGateIdentityEmail(): string {
  return (
    process.env.ADMIN_LOCAL_IDENTITY_EMAIL?.trim() ||
    SITE_EMAIL
  );
}

function getExpectedUsername(): string {
  return process.env.ADMIN_LOCAL_USERNAME?.trim() || "";
}

function getExpectedPassword(): string {
  return process.env.ADMIN_LOCAL_PASSWORD?.trim() || "";
}

export function getAdminLocalGateSecret(): string {
  return process.env.ADMIN_LOCAL_SECRET?.trim() || "";
}

export function isAdminLocalGateConfigured(): boolean {
  return Boolean(
    getExpectedUsername() &&
      getExpectedPassword() &&
      getAdminLocalGateSecret().length >= 16
  );
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export function localGateCredentialsMatch(
  username: string,
  password: string
): boolean {
  const u = getExpectedUsername();
  const p = getExpectedPassword();
  if (!u || !p) return false;
  return (
    timingSafeEqualString(username, u) && timingSafeEqualString(password, p)
  );
}

export async function signAdminLocalGateToken(
  secret: string,
  expiresAtMs: number
): Promise<string> {
  const payload = String(expiresAtMs);
  const sig = await hmacSha256Hex(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminLocalGateToken(
  token: string,
  secret: string
): Promise<boolean> {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await hmacSha256Hex(secret, expStr);
  return timingSafeEqualString(sig, expected);
}

export async function verifyAdminLocalGateFromRequest(
  request: NextRequest
): Promise<boolean> {
  if (!isAdminLocalGateEnabled()) return false;
  const secret = getAdminLocalGateSecret();
  if (!secret || secret.length < 16) return false;
  const raw = request.cookies.get(ADMIN_LOCAL_GATE_COOKIE)?.value;
  if (!raw) return false;
  return verifyAdminLocalGateToken(raw, secret);
}

export function adminLocalGateCookieOptions(expiresAtMs: number) {
  const maxAge = Math.max(
    0,
    Math.floor((expiresAtMs - Date.now()) / 1000)
  );
  return {
    path: "/" as const,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

export function createAdminLocalGateSessionExpiry(): number {
  return Date.now() + MAX_SESSION_MS;
}
