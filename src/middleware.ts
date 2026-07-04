import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAdminLocalGateEnabled,
  verifyAdminLocalGateFromRequest,
} from "@/lib/adminLocalGate";
import { isUserAdmin } from "@/lib/admin";
import { stripLocalePrefix, localizePath } from "@/lib/i18n/paths";
import { LOCALE_HEADER } from "@/lib/i18n/constants";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { isUnpublishedPath } from "@/lib/unpublishedPaths";

const isBypassEnabled = process.env.NEXT_PUBLIC_ADMIN_BYPASS === "true";

function isLocaleExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
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

  if (!isLocaleExcludedPath(rawPathname)) {
    const { locale, pathname: internalPath } = stripLocalePrefix(rawPathname);
    if (isUnpublishedPath(internalPath)) {
      return withSecurityHeaders(
        NextResponse.redirect(new URL(localizePath("/", locale), request.url))
      );
    }
  }

  const { response: localeResponse, locale } = applyLocaleRouting(request);
  localeResponse.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  if (isBypassEnabled) {
    if (request.nextUrl.pathname === "/admin/login") {
      return withSecurityHeaders(
        NextResponse.redirect(new URL("/admin/blog", request.url))
      );
    }
    return withSecurityHeaders(localeResponse);
  }

  if (isAdminLocalGateEnabled()) {
    const { pathname } = request.nextUrl;
    const isGateApi = pathname.startsWith("/api/admin-local-gate/");
    const isAdminLogin = pathname === "/admin/login";

    if (pathname.startsWith("/admin") && !isAdminLogin) {
      const ok = await verifyAdminLocalGateFromRequest(request);
      if (!ok) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
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

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user?.email) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    const admin = await isUserAdmin(user.email, supabase);
    if (!admin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
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
