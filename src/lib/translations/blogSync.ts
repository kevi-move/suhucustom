import { translateHtml, translateTexts } from "@/lib/deepl/client";
import {
  BLOG_INLINE_CTA_HTML,
  splitBlogHtmlByInlineCta,
} from "@/lib/blogInlineCta";
import {
  extractBlogExtrasFromContent,
  injectBlogExtrasIntoContent,
  type BlogExtras,
  type BlogFaqItem,
} from "@/lib/blogExtras";
import { NON_DEFAULT_LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { translateJsonStrings } from "@/lib/translations/jsonTranslator";
import {
  deleteTranslationsForSource,
  getCachedTranslation,
  upsertTranslation,
} from "@/lib/translations/store";
import type { BlogPost, BlogPostPublic } from "@/types/blog";

export type BlogTranslationFields = {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

export function blogTranslationVersion(updatedAt: Date | string | number): number {
  const ms = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : 1;
}

async function translateArticleHtml(
  html: string,
  locale: Exclude<Locale, "en">
): Promise<string> {
  const segments = splitBlogHtmlByInlineCta(html);
  const parts: string[] = [];

  for (const segment of segments) {
    if (segment.kind === "cta") {
      parts.push(BLOG_INLINE_CTA_HTML);
      continue;
    }
    if (!segment.content.trim()) {
      parts.push(segment.content);
      continue;
    }
    parts.push(await translateHtml(segment.content, locale));
  }

  return parts.join("");
}

export async function syncBlogPostTranslation(
  post: Pick<
    BlogPost,
    "id" | "title" | "excerpt" | "content" | "metaTitle" | "metaDescription" | "updatedAt" | "status"
  >
): Promise<void> {
  if (post.status !== "published") {
    await deleteTranslationsForSource("blog", post.id);
    return;
  }

  const version = blogTranslationVersion(post.updatedAt);
  const { extras, content: bodyHtml } = extractBlogExtrasFromContent(post.content || "");

  const structured: Record<string, unknown> = {
    title: post.title || "",
    excerpt: post.excerpt || "",
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    aiSummary: extras.aiSummary || "",
    keyPoints: extras.keyPoints || [],
    faqs: extras.faqs || [],
  };

  for (const locale of NON_DEFAULT_LOCALES) {
    const translated = await translateJsonStrings(structured, (texts) =>
      translateTexts(texts, locale)
    );
    const translatedBody = bodyHtml ? await translateArticleHtml(bodyHtml, locale) : "";
    const translatedExtras: BlogExtras = {
      aiSummary: String(translated.aiSummary || ""),
      keyPoints: Array.isArray(translated.keyPoints)
        ? translated.keyPoints.filter((item): item is string => typeof item === "string")
        : [],
      faqs: Array.isArray(translated.faqs)
        ? translated.faqs.filter(
            (item): item is BlogFaqItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as BlogFaqItem).question === "string" &&
              typeof (item as BlogFaqItem).answer === "string"
          )
        : [],
    };

    const payload: BlogTranslationFields = {
      title: String(translated.title || post.title),
      excerpt: String(translated.excerpt || post.excerpt),
      metaTitle: String(translated.metaTitle || post.metaTitle || ""),
      metaDescription: String(translated.metaDescription || post.metaDescription || ""),
      content: injectBlogExtrasIntoContent(translatedBody, translatedExtras),
    };

    await upsertTranslation("blog", post.id, locale, payload, version);
  }
}

export async function applyBlogPostTranslation<T extends BlogPost>(
  post: T,
  locale: Locale
): Promise<T> {
  if (locale === DEFAULT_LOCALE) return post;

  const version = blogTranslationVersion(post.updatedAt);
  const cached = await getCachedTranslation("blog", post.id, locale, version);
  if (!cached) return post;

  return {
    ...post,
    title: (cached.title as string) || post.title,
    excerpt: (cached.excerpt as string) || post.excerpt,
    content: (cached.content as string) || post.content,
    metaTitle: (cached.metaTitle as string) || post.metaTitle,
    metaDescription: (cached.metaDescription as string) || post.metaDescription,
  };
}

export async function applyBlogPostsTranslation<T extends BlogPost | BlogPostPublic>(
  posts: T[],
  locale: Locale
): Promise<T[]> {
  if (locale === DEFAULT_LOCALE || posts.length === 0) return posts;
  return Promise.all(posts.map((post) => applyBlogPostTranslation(post, locale)));
}

export async function deleteBlogPostTranslations(postId: string): Promise<void> {
  await deleteTranslationsForSource("blog", postId);
}
