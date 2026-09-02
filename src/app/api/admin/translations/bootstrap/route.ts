import { NextRequest, NextResponse } from "next/server";
import { resolveAdminEmail } from "@/lib/requestAdmin";
import { isTranslationConfigured } from "@/lib/deepl/client";
import { bootstrapAllTranslations } from "@/lib/translations/sync";
import { getPageContent } from "@/lib/pageContent";
import { CMS_PAGE_SLUGS } from "@/lib/pageContentDefaults";
import { getPublishedPosts } from "@/lib/blog";

export async function POST(request: NextRequest) {
  const userEmail = await resolveAdminEmail(request);
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isTranslationConfigured()) {
    return NextResponse.json(
      {
        error:
          "No translation provider configured. Set free GEMINI_API_KEY (https://aistudio.google.com/app/apikey) or DEEPL_API_KEY.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await bootstrapAllTranslations(
      CMS_PAGE_SLUGS,
      async (slug) => {
        const { content, version } = await getPageContent(slug, "en");
        return { content, version };
      },
      async () => getPublishedPosts()
    );

    return NextResponse.json({
      ok: true,
      message: "Translations bootstrapped for UI, SEO, CMS pages, and blog posts.",
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
