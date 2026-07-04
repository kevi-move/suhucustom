"use client";

import { useMemo, useState } from "react";
import { EditableText } from "@/components/cms";
import type { BlogPostPublic } from "@/types/blog";
import type { Category } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";

export default function BlogListingClient({
  posts,
  categories,
}: {
  posts: BlogPostPublic[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.categoryId === activeCategory);
  }, [posts, activeCategory]);

  const [featured, ...rest] = filtered;
  const showFeatured = activeCategory === "all" && featured;

  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              <EditableText path="listing.title" value="Latest Articles" />
              <span className="ml-2 text-lg font-semibold text-amber-600">({filtered.length})</span>
            </h2>
            <p className="mt-2 text-slate-600">
              <EditableText
                path="listing.subtitle"
                value="Manufacturing tips, MOQ guides, and updates from our Dongguan team."
              />
            </p>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <CategoryPill
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                label="All Categories"
              />
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  label={cat.name}
                />
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
            <p className="text-lg font-semibold text-slate-800">No posts yet</p>
            <p className="mt-2 text-slate-500">Check back soon for manufacturing insights and updates.</p>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {showFeatured && <BlogPostCard post={featured} featured />}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(showFeatured ? rest : filtered).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
          : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:text-amber-700"
      }
    >
      {label}
    </button>
  );
}
