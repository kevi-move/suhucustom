import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAdminLocalGateEnabled,
  verifyAdminLocalGateFromRequest,
} from "@/lib/adminLocalGate";
import { isUserAdmin } from "@/lib/admin";
import { stripLocalePrefix, getSiteBaseUrl } from "@/lib/i18n/paths";
import { LOCALE_HEADER } from "@/lib/i18n/constants";
import { DEFAULT_LOCALE, RETIRED_LOCALE_PREFIXES } from "@/lib/i18n/locales";
import { isUnpublishedPath } from "@/lib/unpublishedPaths";

const isBypassEnabled = process.env.NEXT_PUBLIC_ADMIN_BYPASS === "true";

const RETIRED_LOCALE_PREFIX_PATTERN = new RegExp(
  `^/(${RETIRED_LOCALE_PREFIXES.map((l) => l.replace("-", "\\-")).join("|")})(?=/|$)`,
  "i"
);

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

/** Map /zh-TW/services/t-shirts/ → /services/t-shirts/ (English default). */
function redirectRetiredLocaleToEnglish(pathname: string): string | null {
  const match = pathname.match(RETIRED_LOCALE_PREFIX_PATTERN);
  if (!match) return null;
  const rest = pathname.slice(match[0].length) || "/";
  const englishPath = rest.startsWith("/") ? rest : `/${rest}`;
  if (englishPath === "/") return "/";
  return englishPath.endsWith("/") ? englishPath : `${englishPath}/`;
}

function isLocaleExcludedPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return (
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/auth") ||
    path.startsWith("/_next") ||
    path === "/sitemap.xml" ||
    path === "/robots.txt" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

/** Public site pages should keep a trailing slash; APIs must not be redirected. */
function needsTrailingSlashRedirect(pathname: string): boolean {
  if (!pathname || pathname === "/" || pathname.endsWith("/")) return false;
  if (isLocaleExcludedPath(pathname)) return false;
  return true;
}

/**
 * Hosts that must 301 onto the canonical hostname (from NEXT_PUBLIC_SITE_URL).
 * Never includes the canonical host itself — that would loop.
 */
function hostsToCanonical(canonicalHost: string): Set<string> {
  const host = canonicalHost.toLowerCase();
  const aliases = new Set<string>();

  if (host !== "suhucustom.vercel.app") {
    aliases.add("suhucustom.vercel.app");
  }

  if (host.startsWith("www.")) {
    aliases.add(host.slice(4));
  } else if (!host.endsWith(".vercel.app")) {
    // Canonical is apex → also fold www onto apex.
    aliases.add(`www.${host}`);
  }

  aliases.delete(host);
  return aliases;
}

/**
 * Build a 301 with the platform URL API — not NextURL.
 * NextURL drops trailing slashes when serializing Location and caused redirect loops.
 */
function permanentRedirect(
  request: NextRequest,
  pathname: string,
  host?: Pick<URL, "protocol" | "hostname" | "port">
): NextResponse {
  const url = new URL(request.url);
  if (host) {
    url.protocol = host.protocol;
    url.hostname = host.hostname;
    url.port = host.port;
  }
  url.pathname = pathname;
  const response = NextResponse.redirect(url.toString(), 301);
  if (request.nextUrl.hostname.toLowerCase().endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return withSecurityHeaders(response);
}

/**
 * One 301 from a non-canonical host onto NEXT_PUBLIC_SITE_URL,
 * fixing retired locales + trailing slash in the same hop.
 * Preview URLs (*.vercel.app other than the project alias) stay put.
 * Skips non-GET so API writes are not redirected.
 */
function redirectToCanonicalHost(request: NextRequest): NextResponse | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  let canonical: URL;
  try {
    canonical = new URL(getSiteBaseUrl());
  } catch {
    return null;
  }
  if (!canonical.hostname || canonical.hostname === "localhost") return null;

  const host = request.nextUrl.hostname.toLowerCase();
  const canonicalHost = canonical.hostname.toLowerCase();
  if (host === canonicalHost) return null;

  const isProductionVercelApp =
    process.env.VERCEL_ENV === "production" && host.endsWith(".vercel.app");
  if (!hostsToCanonical(canonicalHost).has(host) && !isProductionVercelApp) {
    return null;
  }

  const rawPath = request.nextUrl.pathname;
  const englishTarget = isLocaleExcludedPath(rawPath)
    ? null
    : redirectRetiredLocaleToEnglish(rawPath);
  let pathname = englishTarget ?? rawPath;
  if (needsTrailingSlashRedirect(pathname)) {
    pathname = `${normalizePathname(pathname)}/`;
  }

  return permanentRedirect(request, pathname, canonical);
}

/** Draft pages stay off the public site: no homepage redirect, no 404. */
function unpublishedDraftResponse(): NextResponse {
  const html = `<!DOCTYPE html><html lang="en"><head><meta name="robots" content="noindex, nofollow"><meta charset="utf-8"><title>Draft</title></head><body><p>This page is not published yet.</p></body></html>`;
  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
  return withSecurityHeaders(response);
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

function applyLocaleRouting(request: NextRequest): {
  response: NextResponse;
  locale: string;
} {
  const { pathname } = request.nextUrl;

  if (isLocaleExcludedPath(pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, DEFAULT_LOCALE);
    return {
      response: NextResponse.next({ request: { headers: requestHeaders } }),
      locale: DEFAULT_LOCALE,
    };
  }

  const { locale, pathname: internalPath } = stripLocalePrefix(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (locale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = internalPath;
    return {
      response: NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
      locale,
    };
  }

  return {
    response: NextResponse.next({ request: { headers: requestHeaders } }),
    locale,
  };
}

export async function middleware(request: NextRequest) {
  const { pathname: rawPathname } = request.nextUrl;
  const host = request.nextUrl.hostname.toLowerCase();

  const canonicalHostRedirect = redirectToCanonicalHost(request);
  if (canonicalHostRedirect) return canonicalHostRedirect;

  // Preview *.vercel.app must never be indexed as a second copy of the site.
  if (host.endsWith(".vercel.app")) {
    const { response } = applyLocaleRouting(request);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return withSecurityHeaders(response);
  }

  const normalizedPath = normalizePathname(rawPathname);
  // Cookies on sitemap/robots make Google report "temporary processing error".
  if (normalizedPath === "/sitemap.xml" || normalizedPath === "/robots.txt") {
    return withSecurityHeaders(NextResponse.next());
  }

  if (!isLocaleExcludedPath(rawPathname)) {
    const { pathname: internalPath } = stripLocalePrefix(rawPathname);
    if (isUnpublishedPath(internalPath)) {
      return unpublishedDraftResponse();
    }
  }

  if (!isLocaleExcludedPath(rawPathname)) {
    const englishTarget = redirectRetiredLocaleToEnglish(rawPathname);
    if (englishTarget) {
      return permanentRedirect(request, englishTarget);
    }
  }

  if (needsTrailingSlashRedirect(rawPathname)) {
    return permanentRedirect(
      request,
      `${normalizePathname(rawPathname)}/`
    );
  }

  const { response: localeResponse } = applyLocaleRouting(request);

  const needsAuthCookies =
    normalizedPath.startsWith("/admin") ||
    normalizedPath.startsWith("/api") ||
    normalizedPath.startsWith("/auth");
  if (!needsAuthCookies) {
    // English-only public pages: no NEXT_LOCALE cookie. Set-Cookie forces
    // Cache-Control: private and Google treats cookie variants as duplicates.
    return withSecurityHeaders(localeResponse);
  }

  if (isBypassEnabled) {
    if (normalizePathname(request.nextUrl.pathname) === "/admin/login") {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/blog/", request.url))
      );
    }
    return withSecurityHeaders(localeResponse);
  }

  if (isAdminLocalGateEnabled()) {
    const pathname = normalizePathname(request.nextUrl.pathname);
    const isGateApi = pathname.startsWith("/api/admin-local-gate");
    const isAdminLogin = pathname === "/admin/login";

    if (pathname.startsWith("/admin") && !isAdminLogin) {
      const ok = await verifyAdminLocalGateFromRequest(request);
      if (!ok) {
        const loginUrl = new URL("/admin/login/", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return withSecurityHeaders(NextResponse.redirect(loginUrl));
      }
      return withSecurityHeaders(localeResponse);
    }

    if (isGateApi) {
      return withSecurityHeaders(localeResponse);
    }

    return withSecurityHeaders(localeResponse);
  }

  let supabaseResponse = localeResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request: localeResponse.headers.get(LOCALE_HEADER)
              ? request
              : request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = normalizePathname(request.nextUrl.pathname);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user?.email) {
      const loginUrl = new URL("/admin/login/", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const admin = await isUserAdmin(user.email, supabase);
    if (!admin) {
      const loginUrl = new URL("/admin/login/", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      loginUrl.searchParams.set("error", "forbidden");
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return withSecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
