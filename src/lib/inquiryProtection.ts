const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|porn|xxx|sex chat|crypto airdrop)\b/i,
  /\b(click here|earn money fast|lottery winner)\b/i,
  /(https?:\/\/){3,}/i,
];

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MIN_FORM_MS = 2500;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}

export function isFormSubmittedTooFast(formStartedAt?: number): boolean {
  if (!formStartedAt || !Number.isFinite(formStartedAt)) return true;
  return Date.now() - formStartedAt < MIN_FORM_MS;
}

export function looksLikeSpam(fields: {
  fullName: string;
  email: string;
  message: string;
  company?: string;
}): boolean {
  const blob = `${fields.fullName} ${fields.email} ${fields.company || ""} ${fields.message}`;
  if (SPAM_PATTERNS.some((pattern) => pattern.test(blob))) return true;

  const linkCount = (fields.message.match(/https?:\/\//gi) || []).length;
  if (linkCount >= 4) return true;

  return false;
}
