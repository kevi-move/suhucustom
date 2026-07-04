"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import SearchForm from "./SearchForm";

export default function HeaderSearch() {
  return (
    <>
      <SearchForm variant="header" />
      <Link
        href="/search"
        className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-amber-600 lg:hidden"
        aria-label="Open search page"
      >
        <Search className="h-5 w-5" />
      </Link>
    </>
  );
}
