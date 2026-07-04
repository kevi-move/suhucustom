import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import SearchForm from "@/components/search/SearchForm";
import SearchResultsList from "@/components/search/SearchResultsList";
import { searchSite } from "@/lib/siteSearch";
import { buildPageMetadata } from "@/lib/seoDefaults";

export const metadata: Metadata = {
  ...buildPageMetadata("/search"),
  robots: { index: false, follow: true },
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q: rawQ } = await searchParams;
  const query = rawQ?.trim() ?? "";
  const hasQuery = query.length >= 2;
  const results = hasQuery ? await searchSite(query) : [];

  const grouped = {
    service: results.filter((r) => r.type === "service"),
    blog: results.filter((r) => r.type === "blog"),
    page: results.filter((r) => r.type === "page"),
    customization: results.filter((r) => r.type === "customization"),
  };

  return (
    <main className="min-h-[60vh] bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
            <Search className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Search SuhuCustom
          </h1>
          <p className="mt-3 text-slate-300">
            Find services, blog posts, customization options and company pages.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <SearchForm defaultQuery={query} autoFocus={!hasQuery} />

        {!hasQuery && (
          <div className="mt-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Popular searches
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["hoodies", "MOQ", "embroidery", "uniforms", "sampling", "Dongguan"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:text-amber-700"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {hasQuery && (
          <>
            <p className="mt-10 text-sm text-slate-600">
              {results.length === 0 ? (
                <>
                  No results for <strong className="text-slate-900">&quot;{query}&quot;</strong>
                </>
              ) : (
                <>
                  <strong className="text-slate-900">{results.length}</strong> result
                  {results.length === 1 ? "" : "s"} for{" "}
                  <strong className="text-slate-900">&quot;{query}&quot;</strong>
                </>
              )}
            </p>

            {results.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                {grouped.service.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
                    {grouped.service.length} services
                  </span>
                )}
                {grouped.blog.length > 0 && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
                    {grouped.blog.length} articles
                  </span>
                )}
                {grouped.page.length > 0 && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
                    {grouped.page.length} pages
                  </span>
                )}
                {grouped.customization.length > 0 && (
                  <span className="rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-700">
                    {grouped.customization.length} customization
                  </span>
                )}
              </div>
            )}

            <SearchResultsList results={results} query={query} />
          </>
        )}
      </div>
    </main>
  );
}
