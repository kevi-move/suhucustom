import Link from "next/link";
import { ArrowUpRight, FileText, Layers, Newspaper, Sparkles } from "lucide-react";
import type { SearchResult } from "@/types/search";
import { highlightSnippet } from "@/lib/siteSearch";

const TYPE_ICONS = {
  page: FileText,
  service: Layers,
  blog: Newspaper,
  customization: Sparkles,
} as const;

export default function SearchResultsList({
  results,
  query,
}: {
  results: SearchResult[];
  query: string;
}) {
  if (results.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-slate-800">No results found</p>
        <p className="mt-2 text-slate-500">
          Try different keywords - e.g. hoodies, MOQ, uniforms, or sampling.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-10 space-y-4">
      {results.map((item) => {
        const Icon = TYPE_ICONS[item.type];
        const snippet = highlightSnippet(item.excerpt, query);

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md sm:p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {item.typeLabel}
                </span>
                <h2 className="mt-2 text-lg font-bold text-slate-900 transition group-hover:text-amber-700 sm:text-xl">
                  {item.title}
                </h2>
                {snippet && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{snippet}</p>
                )}
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                  View page
                  <ArrowUpRight className="h-4 w-4" />
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
