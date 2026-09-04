/** Activate a customization tab inside a saved/static service-page HTML snapshot. */
export function activateCustomizationTab(section: HTMLElement, optionId: string) {
  section.querySelectorAll("[data-vedit-customization-tab]").forEach((node) => {
    const btn = node as HTMLElement;
    const active = btn.getAttribute("data-vedit-customization-tab") === optionId;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.className = active
      ? "flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition border-l-[3px] border-amber-500 bg-amber-50 text-slate-900"
      : "flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition border-l-[3px] border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700";
  });

  section.querySelectorAll("[data-vedit-customization-id]").forEach((node) => {
    const img = node as HTMLImageElement;
    const active = img.getAttribute("data-vedit-customization-id") === optionId;
    img.className = active
      ? "h-auto min-h-[320px] w-full object-cover relative block"
      : "h-auto min-h-[320px] w-full object-cover pointer-events-none absolute inset-0 opacity-0";
    img.setAttribute("aria-hidden", active ? "false" : "true");
  });

  section.querySelectorAll("[data-vedit-customization-detail]").forEach((node) => {
    const panel = node as HTMLElement;
    const active = panel.getAttribute("data-vedit-customization-detail") === optionId;
    panel.className = active
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative"
      : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm pointer-events-none absolute inset-0 opacity-0";
    panel.setAttribute("aria-hidden", active ? "false" : "true");
  });
}

type HydrateOptions = {
  openQuoteModal?: (input: {
    productCategory?: string;
    sourcePage?: string;
    title?: string;
  }) => void;
  pathname?: string;
};

/** Re-bind interactions after injecting a saved service-page HTML snapshot. */
export function hydrateServicePageInteractions(
  root: HTMLElement,
  options: HydrateOptions = {}
) {
  root.querySelectorAll('[data-vedit-quote="true"]').forEach((node) => {
    const btn = node as HTMLElement;
    if (btn.dataset.veditBound === "1") return;
    btn.dataset.veditBound = "1";
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      options.openQuoteModal?.({
        productCategory: btn.getAttribute("data-vedit-quote-category") || undefined,
        title: btn.getAttribute("data-vedit-quote-title") || undefined,
        sourcePage: options.pathname || "/",
      });
    });
  });

  root.querySelectorAll('[data-vedit-customization-root="true"]').forEach((node) => {
    const section = node as HTMLElement;
    section.querySelectorAll("[data-vedit-customization-tab]").forEach((tabNode) => {
      const tab = tabNode as HTMLElement;
      if (tab.dataset.veditBound === "1") return;
      tab.dataset.veditBound = "1";
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-vedit-customization-tab");
        if (id) activateCustomizationTab(section, id);
      });
    });
  });

  root.querySelectorAll('[aria-label="Scroll left"], [aria-label="Scroll right"]').forEach((node) => {
    const btn = node as HTMLElement;
    if (btn.dataset.veditBound === "1") return;
    btn.dataset.veditBound = "1";
    const direction = btn.getAttribute("aria-label") === "Scroll left" ? -1 : 1;
    btn.addEventListener("click", () => {
      const scroller = btn
        .closest(".mx-auto.max-w-7xl, .bg-slate-50, section, div")
        ?.querySelector(".overflow-x-auto") as HTMLElement | null;
      if (!scroller) return;
      const cardWidth = scroller.firstElementChild?.clientWidth ?? 300;
      scroller.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
    });
  });
}
