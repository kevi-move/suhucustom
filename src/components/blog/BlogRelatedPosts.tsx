import Link from "next/link";
import type { BlogPostPublic } from "@/types/blog";
import { formatBlogDate, getPostImageUrl } from "@/lib/blogUtils";

export default function BlogRelatedPosts({
  posts,
  currentSlug,
}: {
  posts: BlogPostPublic[];
  currentSlug: string;
}) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Related articles</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={getPostImageUrl(post.featuredImage)}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <time className="text-xs text-slate-500">
                  {formatBlogDate(post.publishedAt ?? post.createdAt)}
                </time>
                <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-amber-700">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
