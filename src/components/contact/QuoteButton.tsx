"use client";

import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { useContactModal } from "@/contexts/ContactModalContext";

interface QuoteButtonProps {
  children: React.ReactNode;
  className?: string;
  productCategory?: string;
  sourcePage?: string;
  title?: string;
}

export function QuoteButton({
  children,
  className,
  productCategory,
  sourcePage,
  title,
}: QuoteButtonProps) {
  const { openModal } = useContactModal();
  const pathname = usePathname();

  return (
    <button
      type="button"
      className={clsx(className)}
      onClick={() =>
        openModal({
          productCategory,
          sourcePage: sourcePage || pathname || "/",
          title,
        })
      }
    >
      {children}
    </button>
  );
}
