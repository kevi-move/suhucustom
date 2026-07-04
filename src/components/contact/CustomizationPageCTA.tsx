"use client";

import { QuoteButton } from "@/components/contact/QuoteButton";

export function CustomizationPageCTA({
  productCategory,
  label = "Get Started",
}: {
  productCategory: string;
  label?: string;
}) {
  return (
    <QuoteButton
      productCategory={productCategory}
      title={label}
      className="inline-block rounded-full bg-amber-500 px-8 py-3 font-medium text-white hover:bg-amber-600"
    >
      {label}
    </QuoteButton>
  );
}
