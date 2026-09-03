"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { EditableText } from "@/components/cms";

const FAQS = [
  {
    qPath: "faqs.q1",
    aPath: "faqs.a1",
    question: "How Can I Communicate With Your Team?",
    answer:
      "You can contact us by email or submit the inquiry form on our website. We’ll follow up through the contact method you provide, such as WhatsApp or email, to discuss your product requirements.",
  },
  {
    qPath: "faqs.q2",
    aPath: "faqs.a2",
    question: "How Do I Get a Quote?",
    answer:
      "Send us your product details, design, reference images, tech pack, quantity, materials, or any other requirements you have. We’ll review the information and discuss the details with you before preparing a quote.",
  },
  {
    qPath: "faqs.q3",
    aPath: "faqs.a3",
    question: "How Can I Place an Order?",
    answer:
      "Once your product requirements, sample, pricing, and production details are confirmed, we can proceed with the order and production.",
  },
  {
    qPath: "faqs.q4",
    aPath: "faqs.a4",
    question: "What Payment Methods Do You Accept?",
    answer:
      "We accept bank transfers and PayPal. You can also place orders through our Alibaba store if you prefer to use Alibaba for the transaction.",
  },
  {
    qPath: "faqs.q5",
    aPath: "faqs.a5",
    question: "Can I Order Through Alibaba?",
    answer:
      "Yes. We have an Alibaba store and can process orders through the Alibaba platform.",
  },
  {
    qPath: "faqs.q6",
    aPath: "faqs.a6",
    question: "Can I Send You My Own Design?",
    answer:
      "Yes. You can send us your design, tech pack, reference images, measurements, or product samples. We’ll review your requirements and discuss how to develop the product.",
  },
  {
    qPath: "faqs.q7",
    aPath: "faqs.a7",
    question: "Do You Make Products Other Than Clothing?",
    answer:
      "Yes. We work with a range of custom soft goods, including apparel, gloves, hats, bags, socks, bedding, home textiles, and other textile products.",
  },
] as const;

export default function AboutFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            <EditableText path="faqs.eyebrow" value="Support" />
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <EditableText path="faqs.title" value="Frequently Asked Questions" />
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.qPath}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-900">
                    <EditableText path={faq.qPath} value={faq.question} />
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amber-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-base">
                      <EditableText path={faq.aPath} value={faq.answer} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
