import Link from "next/link";
import { ChevronLeft, Clock, User } from "lucide-react";
import type { ReactNode } from "react";
import BlogQuoteCTAButton from "./BlogQuoteCTAButton";

interface BlogArticleHeaderProps {
  title: string;
  categoryName?: string;
  authorName: string;
  dateLabel: string;
  readMin: number;
  backLink?: ReactNode;
  showBackToBlog?: boolean;
}

export default function BlogArticleHeader({
  title,
  categoryName,
  authorName,
  dateLabel,
  readMin,
  backLink,
  showBackToBlog = true,
}: BlogArticleHeaderProps) {
  return (
    <header className="blog-article-header relative overflow-hidden border-b border-amber-100/70">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-slate-100/80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D09947]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-200/25 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D09947]/30 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {backLink ??
          (showBackToBlog ? (
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#b45309] transition hover:text-[#d97706]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back to Blog
            </Link>
          ) : null)}

        {categoryName ? (
          <span className="mt-6 inline-flex rounded-full border border-amber-200/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#9a6b1a] shadow-sm backdrop-blur-sm">
            {categoryName}
          </span>
        ) : null}

        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.35rem]">
          {title}
        </h1>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4 text-[#D09947]" aria-hidden />
              {authorName}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <time>{dateLabel}</time>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#D09947]" aria-hidden />
              {readMin} min read
            </span>
          </div>

          <BlogQuoteCTAButton className="w-full sm:w-auto" />
        </div>
      </div>
    </header>
  );
}
