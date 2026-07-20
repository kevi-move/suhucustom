"use client";

import BlogTableOfContents from "./BlogTableOfContents";
import BlogAiSummary from "./BlogAiSummary";
import type { TocHeading } from "@/lib/blogToc";

interface BlogArticleRailsProps {
  headings: TocHeading[];
  aiSummary: string;
  keyPoints: string[];
}

export function BlogArticleTocRail({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <aside className="blog-article-rail blog-article-rail-left hidden lg:block lg:shrink-0">
      <div className="blog-article-rail-inner">
        <BlogTableOfContents headings={headings} variant="sidebar" />
      </div>
    </aside>
  );
}

export function BlogArticleSummaryRail({
  aiSummary,
  keyPoints,
}: Pick<BlogArticleRailsProps, "aiSummary" | "keyPoints">) {
  const hasSummary = Boolean(aiSummary.trim()) || keyPoints.length > 0;
  if (!hasSummary) return null;

  return (
    <aside className="blog-article-rail blog-article-rail-right hidden lg:block lg:shrink-0">
      <div className="blog-article-rail-inner">
        <BlogAiSummary aiSummary={aiSummary} keyPoints={keyPoints} variant="sidebar" />
      </div>
    </aside>
  );
}
