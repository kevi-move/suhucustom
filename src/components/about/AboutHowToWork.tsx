"use client";

import Link from "next/link";
import {
  BadgeCheck,
  ClipboardList,
  FileText,
  Package,
  Shirt,
} from "lucide-react";
import { EditableText } from "@/components/cms";

const STEPS = [
  {
    num: "01",
    Icon: FileText,
    titlePath: "howToWork.step1Title",
    title: "Tell Us What You Need",
    bodyPath: "howToWork.step1Body",
    body: "Share your design, tech pack, reference image, specifications or simply your idea.",
  },
  {
    num: "02",
    Icon: ClipboardList,
    titlePath: "howToWork.step2Title",
    title: "Product Review",
    bodyPath: "howToWork.step2Body",
    body: "We review the requirements, materials, construction and production details.",
  },
  {
    num: "03",
    Icon: Shirt,
    titlePath: "howToWork.step3Title",
    title: "Sampling",
    bodyPath: "howToWork.step3Body",
    body: "A sample is developed for you to review and adjust.",
  },
  {
    num: "04",
    Icon: Package,
    titlePath: "howToWork.step4Title",
    title: "Production",
    bodyPath: "howToWork.step4Body",
    body: "Once the sample is approved, we move into bulk production.",
  },
  {
    num: "05",
    Icon: BadgeCheck,
    titlePath: "howToWork.step5Title",
    title: "QC & Delivery",
    bodyPath: "howToWork.step5Body",
    body: "Products are checked before shipment and prepared for delivery.",
  },
] as const;

export default function AboutHowToWork() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            <EditableText path="howToWork.eyebrow" value="Our Process" />
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText path="howToWork.title" value="How to Work With Us" />
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {STEPS.map((step) => (
            <li key={step.num}>
              <Link
                href="/contact-us"
                className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 transition group-hover:bg-amber-100">
                    <step.Icon
                      className="h-6 w-6 text-amber-500"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-300 transition group-hover:text-amber-400">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900 transition group-hover:text-amber-700 sm:text-lg">
                  <EditableText path={step.titlePath} value={step.title} />
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  <EditableText path={step.bodyPath} value={step.body} />
                </p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-amber-600 opacity-0 transition group-hover:opacity-100">
                  Get started
                  <svg
                    className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
