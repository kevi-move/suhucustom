"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How much does a custom T-shirt cost?",
    answer:
      "The cost of a custom T-shirt depends on the order quantity, fabric, GSM, construction, printing or embroidery, labels, packaging, and shipping requirements. Send us your specifications and target quantity for a custom quote.",
  },
  {
    question: "How do I get custom T-shirts made?",
    answer:
      "To get custom T-shirts made, send us your design, tech pack, reference image, existing sample, or product requirements. We can review the specifications, discuss customization options, arrange sampling, and coordinate bulk production.",
  },
  {
    question: "Can I order bulk custom T-shirts for my clothing brand?",
    answer:
      "Yes. We support bulk custom T-shirt orders for clothing brands, retailers, businesses, and other buyers. You can customize the fabric, fit, colors, decoration, labels, and packaging according to your product requirements.",
  },
  {
    question: "Can you make private label T-shirts?",
    answer:
      "Yes. Our private label T-shirt manufacturing service can include custom neck labels, care labels, hang tags, branding, and packaging. You can provide your own design or product specifications for development.",
  },
  {
    question: "What can I customize on a T-shirt?",
    answer:
      "You can customize key product details including fabric, GSM, fit, sizing, colors, printing, embroidery, labels, and packaging. Customization options depend on the requirements of your specific project.",
  },
  {
    question: "Can I provide my own T-shirt design or tech pack?",
    answer:
      "Yes. You can send your T-shirt design, tech pack, reference photos, or existing sample. If you do not have a complete tech pack, you can still send your initial product idea or reference image so we can discuss the requirements.",
  },
  {
    question: "How long does it take to make custom T-shirts?",
    answer:
      "The production timeline depends on the product specifications, sampling requirements, order quantity, and customization details. It is usually two weeks to a month.",
  },
  {
    question: "What is the best custom T-shirt site?",
    answer:
      "The best custom T-shirt supplier depends on what you need. For personal one-off orders, a printing platform may be suitable. For brands and businesses ordering in bulk, look for a manufacturer that can support product customization, sampling, branding, quality control, and bulk production.\n\nSuhuCustom focuses on B2B custom T-shirt manufacturing, supporting brands and businesses from product requirements through sampling and bulk production.",
  },
  {
    question: "Which website is the best for printing T-shirts?",
    answer:
      "The right T-shirt printing supplier depends on your order quantity, printing method, product requirements, and whether you need individual orders or bulk custom T-shirt production.\n\nFor bulk orders, it is important to evaluate more than printing alone. Fabric, garment construction, print quality, sizing, labels, packaging, and production consistency should also be considered.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently support bank transfer and PayPal. Orders can also be processed through our Alibaba store for buyers who prefer to place orders through the Alibaba platform.\n\nPayment terms can be confirmed based on your specific order and production requirements.",
  },
] as const;

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900">{faq.question}</span>
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
          <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-base">
            {faq.answer.split("\n\n").map((paragraph) => (
              <p key={`${index}-${paragraph.slice(0, 48)}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TshirtFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const leftFaqs = FAQS.slice(0, 5);
  const rightFaqs = FAQS.slice(5, 10);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Frequently Asked Questions About Custom T-Shirts
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            {leftFaqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            {rightFaqs.map((faq, index) => {
              const globalIndex = index + 5;
              return (
                <FaqItem
                  key={faq.question}
                  faq={faq}
                  index={globalIndex}
                  isOpen={openIndex === globalIndex}
                  onToggle={() =>
                    setOpenIndex(openIndex === globalIndex ? null : globalIndex)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
