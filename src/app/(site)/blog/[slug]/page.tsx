import { resolveImageSrc } from "@/lib/imageFallback";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, User } from "lucide-react";
import BlogPostBody from "@/components/blog/BlogPostBody";
import BlogPostCTA from "@/components/blog/BlogPostCTA";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import {
  getPublishedPostForPublic,
  getPublishedPostSlugs,
  getPublishedPostsForPublic,
} from "@/lib/blog";
import {
  estimateReadingMinutes,
  formatBlogDate,
  getPostImageUrl,
} from "@/lib/blogUtils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostForPublic(slug);
  if (!post) return { title: "Article Not Found | Suhu Custom" };

  const title = post.metaTitle?.trim() || `${post.title} | Suhu Custom Blog`;
  const description =
    post.metaDescription?.trim() || post.excerpt || "Read more on the SuhuCustom blog.";

  return {
    title,
    description,
    keywords: [
      "custom apparel manufacturer",
      "clothing factory China",
      "garment manufacturing",
      "Suhu Custom blog",
      ...(post.categoryId ? [] : []),
    ],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage ? [{ url: getPostImageUrl(post.featuredImage) }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPublishedPostForPublic(slug),
    getPublishedPostsForPublic(),
  ]);

  if (!post) notFound();

  const imageUrl = getPostImageUrl(post.featuredImage);
  const readMin = estimateReadingMinutes(post.content);
  const dateLabel = formatBlogDate(post.publishedAt ?? post.createdAt);
  const authorName = post.author?.name || "SuhuCustom Team";

  const sameCategory = post.categoryId
    ? allPosts.filter((p) => p.categoryId === post.categoryId)
    : allPosts;

  return (
    <main className="bg-white">
      <article>
        <header className="relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0">
            <img
              src={resolveImageSrc(imageUrl)}
              alt=""
              className="h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/85 to-slate-900/60" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-300 transition hover:text-amber-200"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back to Blog
            </Link>

            {post.category && (
              <span className="mt-8 inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
                {post.category.name}
              </span>
            )}

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{post.excerpt}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-amber-400" aria-hidden />
                {authorName}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <time dateTime={post.publishedAt?.toISOString()}>{dateLabel}</time>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4 text-amber-400" aria-hidden />
                {readMin} min read
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <BlogPostBody html={post.content} />
        </div>
      </article>

      <BlogRelatedPosts posts={sameCategory} currentSlug={post.slug} />
      <BlogPostCTA />
    </main>
  );
}
