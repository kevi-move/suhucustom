import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/i18n/paths";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/search"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
