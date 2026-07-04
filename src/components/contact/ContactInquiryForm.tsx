"use client";

import { FormEvent, useEffect, useState } from "react";
import { clsx } from "clsx";

type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactInquiryFormProps {
  sourcePage: string;
  productCategory?: string;
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export function ContactInquiryForm({
  sourcePage,
  productCategory = "",
  compact = false,
  onSuccess,
  className,
}: ContactInquiryFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  useEffect(() => {
    if (status === "success") onSuccess?.();
  }, [status, onSuccess]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      productCategory:
        String(formData.get("productCategory") || "").trim() || productCategory,
      estimatedQty: String(formData.get("estimatedQty") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      sourcePage,
      website: String(formData.get("website") || ""),
      formStartedAt,
    };

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to send. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send. Please try again."
      );
    }
  }

  const inputClass = clsx(
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm",
    "placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
  );

  if (status === "success") {
    return (
      <div
        className={clsx(
          "rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center",
          className
        )}
        role="status"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-emerald-900">Message sent!</h3>
        <p className="mt-2 text-sm text-emerald-800">
          We received your inquiry and will reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form className={clsx("space-y-5", className)} onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {status === "error" && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <div className={clsx("grid gap-5", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <Field label="Name *" htmlFor="fullName">
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            disabled={status === "submitting"}
            className={inputClass}
          />
        </Field>
        <Field label="Email *" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={status === "submitting"}
            className={inputClass}
          />
        </Field>
      </div>

      {compact ? (
        <Field label="Phone / WhatsApp" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Include country code, e.g. +1 555 123 4567"
            disabled={status === "submitting"}
            className={inputClass}
          />
        </Field>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company" htmlFor="company">
            <input
              id="company"
              name="company"
              disabled={status === "submitting"}
              className={inputClass}
            />
          </Field>
          <Field label="Phone / WhatsApp" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Include country code, e.g. +1 555 123 4567"
              disabled={status === "submitting"}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      <div className={clsx("grid gap-5", !compact && "sm:grid-cols-2")}>
        <Field label="Product Category" htmlFor="productCategory">
          <input
            id="productCategory"
            name="productCategory"
            defaultValue={productCategory}
            placeholder="e.g. Hoodies, T-shirts"
            disabled={status === "submitting"}
            className={inputClass}
          />
        </Field>
        {!compact && (
          <Field label="Estimated Quantity" htmlFor="estimatedQty">
            <input
              id="estimatedQty"
              name="estimatedQty"
              placeholder="e.g. 500 pcs"
              disabled={status === "submitting"}
              className={inputClass}
            />
          </Field>
        )}
      </div>

      <Field label="Message *" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={compact ? 4 : 5}
          required
          minLength={10}
          disabled={status === "submitting"}
          placeholder="Tell us about your project, MOQ, and timeline."
          className={clsx(inputClass, "resize-y")}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
