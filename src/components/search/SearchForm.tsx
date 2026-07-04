"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

type SearchFormProps = {
  defaultQuery?: string;
  variant?: "header" | "page";
  autoFocus?: boolean;
};

export default function SearchForm({
  defaultQuery = "",
  variant = "page",
  autoFocus = false,
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  if (variant === "header") {
    return (
      <form onSubmit={handleSubmit} className="relative hidden lg:block" role="search">
        <label htmlFor="header-search" className="sr-only">
          Search site
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          id="header-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-36 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:w-44 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 xl:w-40 xl:focus:w-52"
        />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <label htmlFor="site-search" className="sr-only">
        Search the website
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. hoodies, MOQ, embroidery, Dongguan"
            autoFocus={autoFocus}
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25"
          />
        </div>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-sm font-semibold text-slate-900 shadow-md shadow-amber-500/20 transition hover:bg-amber-400"
        >
          Search
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">Enter at least 2 characters</p>
    </form>
  );
}
