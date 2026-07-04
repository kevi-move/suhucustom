import { resolveImageSrc } from "@/lib/imageFallback";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostPublic } from "@/types/blog";
import {
  estimateReadingMinutes,
  formatBlogDate,
  getPostImageUrl,
} from "@/lib/blogUtils";

export default function BlogPostCard({
  post,
  featured = false,
}: {
  post: BlogPostPublic;
  featured?: boolean;
}) {
  const imageUrl = getPostImageUrl(post.featuredImage);
  const readMin = estimateReadingMinutes(post.content);
  const dateLabel = formatBlogDate(post.publishedAt ?? post.createdAt);

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl ring-1 ring-slate-800">
        <Link href={`/blog/${post.slug}`} className="grid lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
            <img
              src={resolveImageSrc(imageUrl)}
              alt={post.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-900/30 lg:to-slate-900/90" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            {post.category && (
              <span className="inline-flex w-fit rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                {post.category.name}
              </span>
            )}
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-300">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>{dateLabel}</span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden />
                {readMin} min read
              </span>
              <span className="ml-auto inline-flex items-center gap-1 font-semibold text-amber-400 transition group-hover:gap-2">
                Read article
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={resolveImageSrc(imageUrl)}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          {post.category && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 shadow-sm">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <time dateTime={post.publishedAt?.toISOString()}>{dateLabel}</time>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {readMin} min
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-amber-700 sm:text-xl">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
            Read more
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
