import Link from "next/link";
import { SITE_EMAIL } from "@/lib/siteContact";

type Section = {
  title: string;
  paragraphs: string[];
  list?: string[];
  afterList?: string;
};

export function LegalDocumentLayout({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-4 text-slate-600">Last updated: {lastUpdated}</p>
          <p className="mt-6 text-sm text-slate-500">
            Questions?{" "}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-amber-600 hover:text-amber-700">
              {SITE_EMAIL}
            </a>
            {" · "}
            <Link href="/contact-us" className="font-medium text-amber-600 hover:text-amber-700">
              Contact form
            </Link>
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="space-y-10 text-slate-700">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.afterList && <p>{section.afterList}</p>}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
