"use client";

import BlogTableOfContents from "./BlogTableOfContents";
import BlogAiSummary from "./BlogAiSummary";
import type { TocHeading } from "@/lib/blogToc";

interface BlogArticleSidebarProps {
  headings: TocHeading[];
  aiSummary: string;
  keyPoints: string[];
}

export default function BlogArticleSidebar({
  headings,
  aiSummary,
  keyPoints,
}: BlogArticleSidebarProps) {
  const hasSidebar = headings.length > 0 || aiSummary.trim() || keyPoints.length > 0;

  if (!hasSidebar) return null;

  return (
    <aside className="blog-article-sidebar hidden lg:block lg:w-64 xl:w-72 lg:shrink-0 lg:self-start">
      <div className="blog-article-sidebar-inner space-y-4">
        <BlogAiSummary
          aiSummary={aiSummary}
          keyPoints={keyPoints}
          variant="sidebar"
        />
        <BlogTableOfContents headings={headings} variant="sidebar" />
      </div>
    </aside>
  );
}
