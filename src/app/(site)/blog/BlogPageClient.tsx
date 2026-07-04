"use client";

import BlogHero from "@/components/blog/BlogHero";
import BlogListingClient from "@/components/blog/BlogListingClient";
import BlogPageCTA from "@/components/blog/BlogPageCTA";
import { CMSProvider } from "@/contexts/CMSContext";
import { PageEditToolbar } from "@/components/cms/PageEditToolbar";
import { useAuth } from "@/contexts/AuthContext";
import type { BlogPostPublic } from "@/types/blog";
import type { Category } from "@/types/blog";

export default function BlogPageClient({
  posts,
  categories,
  displayContent,
  englishContent,
  modeEnabled,
}: {
  posts: BlogPostPublic[];
  categories: Category[];
  displayContent: Record<string, unknown>;
  englishContent: Record<string, unknown>;
  modeEnabled: boolean;
}) {
  const { isAdmin, loading } = useAuth();
  const canEdit = !loading && isAdmin && modeEnabled;

  return (
    <CMSProvider
      pageSlug="/blog"
      initialContent={englishContent}
      displayContent={displayContent}
      modeEnabled={canEdit}
    >
      <main>
        <BlogHero />
        <BlogListingClient posts={posts} categories={categories} />
        <BlogPageCTA />
      </main>
      {canEdit && <PageEditToolbar />}
    </CMSProvider>
  );
}
