"use client";

import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { QuoteButton } from "@/components/contact/QuoteButton";

interface BlogQuoteCTAButtonProps {
  size?: "default" | "compact";
  className?: string;
}

export default function BlogQuoteCTAButton({
  size = "default",
  className,
}: BlogQuoteCTAButtonProps) {
  const isCompact = size === "compact";

  return (
    <QuoteButton
      title="Start Your Free Quote"
      className={clsx(
        "blog-quote-cta group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-bold text-white",
        "bg-gradient-to-r from-[#c4862e] via-[#D09947] to-[#e8b04a]",
        "shadow-[0_4px_14px_rgba(208,153,71,0.45)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(208,153,71,0.55)]",
        "active:translate-y-0 active:shadow-[0_2px_8px_rgba(208,153,71,0.4)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D09947]",
        isCompact ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative">Start Your Free Quote</span>
      <ArrowRight
        aria-hidden
        className={clsx(
          "relative shrink-0 transition-transform duration-300 group-hover:translate-x-0.5",
          isCompact ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]"
        )}
      />
    </QuoteButton>
  );
}
