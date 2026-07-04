"use client";

import { QuoteButton } from "@/components/contact/QuoteButton";

export default function ServiceFallbackActions({
  productCategory,
}: {
  productCategory: string;
}) {
  return (
    <QuoteButton
      productCategory={productCategory}
      title="Request a Quote"
      className="inline-block rounded-full bg-amber-500 px-8 py-3 font-medium text-white hover:bg-amber-600"
    >
      Request a Quote
    </QuoteButton>
  );
}
