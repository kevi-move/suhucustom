const FAQS = [
  {
    question: "How much does it cost to make custom hoodies?",
    answer:
      "The cost of custom hoodies depends on factors such as quantity, fabric, GSM, garment construction, decoration, labels, packaging, and shipping requirements. Send us your specifications for a project-specific quote.",
  },
  {
    question: "What is the minimum order quantity for custom hoodies?",
    answer:
      "Our MOQ starts from 10 pieces. The final MOQ may vary depending on the product and customization requirements.",
  },
  {
    question: "Can I order a custom hoodie sample before placing a bulk order?",
    answer:
      "Yes. A sample can be developed based on your confirmed specifications before you proceed with a bulk order.",
  },
  {
    question: "What is a tech pack, and do I need one?",
    answer:
      "A tech pack provides the specifications needed to manufacture your product, such as measurements, materials, construction details, and artwork. If you don't have one, you can start with a reference garment, image, design, or product idea.",
  },
  {
    question: "How long does it take to make custom hoodies?",
    answer:
      "Production time depends on the product specifications, order quantity, sampling requirements, and production schedule. We'll confirm the applicable timeline after reviewing your project.",
  },
  {
    question: "Can you make custom hoodies in small quantities?",
    answer:
      "Yes. Our 10-piece MOQ allows smaller brands and product development projects to start with a relatively small production quantity.",
  },
  {
    question: "Can you make hoodies with my brand label?",
    answer:
      "Yes. Private label hoodies can include custom neck labels, woven labels, hang tags, packaging, and other approved branding details.",
  },
  {
    question: "How do I get a quote for custom hoodies?",
    answer:
      "Send us your quantity, hoodie style, fabric preference, size range, artwork or reference, and any branding or packaging requirements. If you don't have all the details yet, send what you have and we'll review the project.",
  },
] as const;

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-slate-200 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
        <span className="text-base font-semibold text-slate-900">{question}</span>
        <svg
          className="h-5 w-5 shrink-0 text-amber-500 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pb-6 sm:text-base">
        {answer}
      </p>
    </details>
  );
}

export default function HoodieFAQ() {
  const leftFaqs = FAQS.slice(0, 4);
  const rightFaqs = FAQS.slice(4, 8);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Custom Hoodie Manufacturing FAQs
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            {leftFaqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            {rightFaqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
