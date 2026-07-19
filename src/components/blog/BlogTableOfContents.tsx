"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocHeading } from "@/lib/blogToc";

interface BlogTableOfContentsProps {
  headings: TocHeading[];
  variant?: "sidebar" | "mobile";
}

export default function BlogTableOfContents({
  headings,
  variant = "mobile",
}: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleJump = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    setMobileOpen(false);
  };

  const list = (
    <ul className="space-y-0.5">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;

        return (
          <li key={heading.id}>
            <button
              type="button"
              onClick={() => handleJump(heading.id)}
              className={`blog-toc-link w-full rounded-md px-2.5 py-2 text-left text-sm leading-snug transition ${
                isActive
                  ? "border-l-2 border-[#D09947] bg-amber-50 font-semibold text-[#9a6b1a]"
                  : "border-l-2 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {heading.text}
            </button>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "sidebar") {
    return (
      <nav
        className="blog-toc-sidebar rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        aria-label="Table of Contents"
      >
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-900">
          Table of Contents
        </h2>
        <div className="pr-1">{list}</div>
      </nav>
    );
  }

  return (
    <div className="blog-toc-mobile mb-6 lg:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
        aria-expanded={mobileOpen}
      >
        <span className="text-sm font-semibold text-slate-900">Table of Contents</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {mobileOpen ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">{list}</div>
      ) : null}
    </div>
  );
}
