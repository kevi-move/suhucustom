import { NextRequest, NextResponse } from "next/server";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { isDeepLConfigured } from "@/lib/deepl/client";
import { bootstrapAllTranslations } from "@/lib/translations/sync";
import { getPageContent } from "@/lib/pageContent";
import { CMS_PAGE_SLUGS } from "@/lib/pageContentDefaults";

export async function POST(request: NextRequest) {
  const userEmail = await resolveAdminEmail(request);
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDeepLConfigured()) {
    return NextResponse.json(
      { error: "DEEPL_API_KEY is not configured in .env.local" },
      { status: 400 }
    );
  }

  try {
    const result = await bootstrapAllTranslations(CMS_PAGE_SLUGS, async (slug) => {
      const { content, version } = await getPageContent(slug, "en");
      return { content, version };
    });

    return NextResponse.json({
      ok: true,
      message: "Translations bootstrapped for UI, SEO, and CMS pages.",
      ...result,
    });
  } catch (error) {
    console.error("Translation bootstrap failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Translation bootstrap failed",
      },
      { status: 500 }
    );
  }
}
