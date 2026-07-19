"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { BlogFaqItem } from "@/lib/blogExtras";
import { buildFaqPageSchema } from "@/lib/blogExtras";

interface BlogFaqSectionProps {
  faqs: BlogFaqItem[];
}

export default function BlogFaqSection({ faqs }: BlogFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  const schema = buildFaqPageSchema(faqs);

  return (
    <section className="blog-faq mt-12 border-t border-slate-200 pt-10" aria-label="FAQ">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <h2 className="mb-6 text-2xl font-bold text-slate-900">FAQ</h2>

      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={`${faq.question}-${index}`}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-base leading-7 text-slate-700">{faq.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
