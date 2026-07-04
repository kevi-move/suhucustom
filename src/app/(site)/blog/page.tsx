import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { getPublishedPostsForPublic } from "@/lib/blog";
import { getAllCategories } from "@/lib/categories";
import { getPageContent } from "@/lib/pageContent";
import { getCmsModeEnabled } from "@/lib/cmsMode";
import { resolvePageMetadata } from "@/lib/resolvePageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata("/blog");
}

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, categories, { content: displayContent }, { content: englishContent }, modeEnabled] =
    await Promise.all([
      getPublishedPostsForPublic(),
      getAllCategories(),
      getPageContent("/blog"),
      getPageContent("/blog", "en"),
      getCmsModeEnabled(),
    ]);

  const usedCategoryIds = new Set(posts.map((p) => p.categoryId).filter(Boolean));
  const activeCategories = categories.filter((c) => usedCategoryIds.has(c.id));

  return (
    <BlogPageClient
      posts={posts}
      categories={activeCategories}
      displayContent={displayContent}
      englishContent={englishContent}
      modeEnabled={modeEnabled}
    />
  );
}
