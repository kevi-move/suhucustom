"use client";

import { BadgeCheck, CircleDollarSign, FolderOpen, Package } from "lucide-react";
import { EditableText } from "@/components/cms";
import { QuoteButton } from "@/components/contact/QuoteButton";

const STEPS = [
  {
    num: "01",
    Icon: FolderOpen,
    titlePath: "howWeWork.step1Title",
    title: "Share Your Requirements",
    bodyPath: "howWeWork.step1Body",
    body: "Send us your tech pack, reference images, product specifications or initial idea. We’ll review what you need and clarify the key details for production.",
  },
  {
    num: "02",
    Icon: CircleDollarSign,
    titlePath: "howWeWork.step2Title",
    title: "Review, Quote & Sample",
    bodyPath: "howWeWork.step2Body",
    body: "We review your requirements, prepare a project quotation and develop a sample based on the confirmed specifications.",
  },
  {
    num: "03",
    Icon: BadgeCheck,
    titlePath: "howWeWork.step3Title",
    title: "Approve Your Product",
    bodyPath: "howWeWork.step3Body",
    body: "Review the sample, provide feedback and confirm the final specifications before production begins.",
  },
  {
    num: "04",
    Icon: Package,
    titlePath: "howWeWork.step4Title",
    title: "Bulk Production & Delivery",
    bodyPath: "howWeWork.step4Body",
    body: "Once approved, your product moves into bulk production. Finished goods are checked according to the project requirements before delivery.",
  },
] as const;

export default function HomeHowWeWork() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText path="howWeWork.title" value="How to Work With Us" />
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            <EditableText
              path="howWeWork.subtitle"
              value="A straightforward process from your first requirements to finished products."
            />
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="rounded-xl bg-slate-100 p-6 text-left sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <step.Icon className="h-6 w-6 text-amber-500" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900 sm:text-lg">
                <EditableText path={step.titlePath} value={step.title} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                <EditableText path={step.bodyPath} value={step.body} />
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <QuoteButton
            title="Start Your Instant Quote"
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-400"
          >
            <EditableText path="howWeWork.ctaText" value="Start Your Instant Quote" />
          </QuoteButton>
        </div>
      </div>
    </div>
  );
}
