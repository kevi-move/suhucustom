"use client";

import { useMemo } from "react";
import BlogPostBody from "./BlogPostBody";
import BlogArticleHeader from "./BlogArticleHeader";
import BlogAiSummary from "./BlogAiSummary";
import BlogFaqSection from "./BlogFaqSection";
import BlogArticleLayout from "./BlogArticleLayout";
import BlogArticleSidebar from "./BlogArticleSidebar";
import BlogTableOfContents from "./BlogTableOfContents";
import {
  estimateReadingMinutes,
  formatBlogDate,
} from "@/lib/blogUtils";
import type { BlogFaqItem } from "@/lib/blogExtras";
import { prepareBlogContentHtml } from "@/lib/blogToc";
import type { ReactNode } from "react";

export interface BlogPostPreviewData {
  title: string;
  excerpt: string;
  featuredImage: string;
  contentHtml: string;
  aiSummary: string;
  keyPoints: string[];
  faqs: BlogFaqItem[];
  categoryName?: string;
  authorName?: string;
  publishedAt?: Date | null;
  createdAt?: Date | null;
}

interface BlogPostArticleViewProps {
  data: BlogPostPreviewData;
  backLink?: ReactNode;
  showBackToBlog?: boolean;
}

export default function BlogPostArticleView({
  data,
  backLink,
  showBackToBlog = false,
}: BlogPostArticleViewProps) {
  const dateLabel = formatBlogDate(data.publishedAt ?? data.createdAt ?? new Date());
  const authorName = data.authorName || "SuhuCustom Team";

  const prepared = useMemo(
    () => prepareBlogContentHtml(data.contentHtml),
    [data.contentHtml]
  );

  const readMin = estimateReadingMinutes(
    [prepared.html, data.aiSummary, ...data.faqs.map((faq) => `${faq.question} ${faq.answer}`)].join(
      " "
    )
  );

  return (
    <main className="bg-slate-50">
      <article className="bg-white">
        <BlogArticleHeader
          title={data.title || "Untitled post"}
          categoryName={data.categoryName}
          authorName={authorName}
          dateLabel={dateLabel}
          readMin={readMin}
          backLink={backLink}
          showBackToBlog={showBackToBlog}
        />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <BlogArticleLayout
            sidebar={
              <BlogArticleSidebar
                headings={prepared.headings}
                aiSummary={data.aiSummary}
                keyPoints={data.keyPoints}
              />
            }
            mobileToc={
              <BlogTableOfContents headings={prepared.headings} variant="mobile" />
            }
            mobileSummary={
              <BlogAiSummary
                aiSummary={data.aiSummary}
                keyPoints={data.keyPoints}
                variant="inline"
              />
            }
          >
            <BlogPostBody html={prepared.html} />
          </BlogArticleLayout>

          <BlogFaqSection faqs={data.faqs} />
        </div>
      </article>
    </main>
  );
}
