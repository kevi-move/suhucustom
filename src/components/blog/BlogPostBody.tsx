"use client";

import BlogQuoteCTAButton from "./BlogQuoteCTAButton";
import { splitBlogHtmlByInlineCta } from "@/lib/blogInlineCta";

export default function BlogPostBody({ html }: { html: string }) {
  if (!html?.trim()) {
    return <p className="text-slate-500">No content available.</p>;
  }

  const segments = splitBlogHtmlByInlineCta(html);

  return (
    <div className="blog-prose">
      {segments.map((segment, index) => {
        if (segment.kind === "cta") {
          return (
            <div key={`cta-${index}`} className="blog-inline-cta">
              <BlogQuoteCTAButton />
            </div>
          );
        }

        if (!segment.content.trim()) return null;

        return (
          <div
            key={`html-${index}`}
            className="blog-prose-chunk"
            dangerouslySetInnerHTML={{ __html: segment.content }}
          />
        );
      })}
    </div>
  );
}
