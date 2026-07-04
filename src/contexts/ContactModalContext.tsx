"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";

interface OpenModalOptions {
  productCategory?: string;
  sourcePage?: string;
  title?: string;
}

interface ContactModalContextType {
  openModal: (options?: OpenModalOptions) => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OpenModalOptions>({});

  const closeModal = useCallback(() => setOpen(false), []);

  const openModal = useCallback((next?: OpenModalOptions) => {
    setOptions(next || {});
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeModal]);

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={closeModal}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              Get a Quote
            </p>
            <h2 id="quote-modal-title" className="mt-2 pr-8 text-2xl font-bold text-slate-900">
              {options.title || "Contact Suhu Custom"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Share your project details — we typically reply within 24 hours.
            </p>
            <div className="mt-6">
              <ContactInquiryForm
                compact
                sourcePage={options.sourcePage || pathname || "/"}
                productCategory={options.productCategory}
                onSuccess={() => {
                  window.setTimeout(closeModal, 2200);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}
