"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/cms";
import type { BlogPostPublic } from "@/types/blog";
import type { Category } from "@/types/blog";
import BlogPostCard from "./BlogPostCard";

const PAGE_SIZE = 9;

export default function BlogListingClient({
  posts,
  categories,
}: {
  posts: BlogPostPublic[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.categoryId === activeCategory);
  }, [posts, activeCategory]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), pageCount);
    setPage(clamped);
    document.getElementById("blog-listing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="blog-listing" className="scroll-mt-24 bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
                label="All"
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
          <>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            {pageCount > 1 && (
              <Pagination page={currentPage} pageCount={pageCount} onChange={goToPage} />
            )}
          </>
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

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  const items = pageNumbers(page, pageCount);

  return (
    <nav className="mt-14 flex items-center justify-center gap-1 sm:gap-2" aria-label="Blog pages">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Prev
      </button>
      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`e-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={
              item === page
                ? "inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-amber-500 px-3 text-sm font-semibold text-slate-900"
                : "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
            }
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}

function pageNumbers(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("ellipsis");
  for (let n = start; n <= end; n += 1) items.push(n);
  if (end < pageCount - 1) items.push("ellipsis");
  items.push(pageCount);
  return items;
}
