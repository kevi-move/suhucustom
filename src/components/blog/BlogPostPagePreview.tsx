"use client";

import type { ReactNode } from "react";
import BlogPostArticleView, {
  type BlogPostPreviewData,
} from "@/components/blog/BlogPostArticleView";

interface BlogPostPagePreviewProps {
  data: BlogPostPreviewData;
  showBackLink?: boolean;
}

export default function BlogPostPagePreview({
  data,
  showBackLink = false,
}: BlogPostPagePreviewProps) {
  const backLink: ReactNode | undefined = showBackLink ? (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#b45309]/80">
      Back to Blog
    </span>
  ) : undefined;

  return (
    <BlogPostArticleView
      data={data}
      backLink={backLink}
      showBackToBlog={!showBackLink}
    />
  );
}

export type { BlogPostPreviewData };
