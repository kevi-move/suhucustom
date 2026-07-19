export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogExtras {
  aiSummary: string;
  keyPoints: string[];
  faqs: BlogFaqItem[];
}

export const EMPTY_BLOG_EXTRAS: BlogExtras = {
  aiSummary: "",
  keyPoints: [],
  faqs: [],
};

const EXTRAS_ATTR = "data-blog-extras";

function encodeExtras(extras: BlogExtras): string {
  return encodeURIComponent(JSON.stringify(extras));
}

function decodeExtras(raw: string): BlogExtras | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<BlogExtras>;
    return {
      aiSummary: typeof parsed.aiSummary === "string" ? parsed.aiSummary : "",
      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints.filter((item): item is string => typeof item === "string")
        : [],
      faqs: Array.isArray(parsed.faqs)
        ? parsed.faqs.filter(
            (item): item is BlogFaqItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as BlogFaqItem).question === "string" &&
              typeof (item as BlogFaqItem).answer === "string"
          )
        : [],
    };
  } catch {
    return null;
  }
}

export function injectBlogExtrasIntoContent(content: string, extras: BlogExtras): string {
  const cleaned = stripBlogExtrasFromContent(content);
  const marker = `<div ${EXTRAS_ATTR}="${encodeExtras(extras)}" hidden aria-hidden="true"></div>`;
  return `${marker}\n${cleaned}`.trim();
}

export function stripBlogExtrasFromContent(content: string): string {
  if (!content) return "";
  return content
    .replace(
      new RegExp(
        `<div\\s+${EXTRAS_ATTR}="[^"]*"\\s+hidden\\s+aria-hidden="true"\\s*></div>\\s*`,
        "i"
      ),
      ""
    )
    .trim();
}

export function extractBlogExtrasFromContent(content: string): {
  extras: BlogExtras;
  content: string;
} {
  const match = content.match(
    new RegExp(`<div\\s+${EXTRAS_ATTR}="([^"]*)"\\s+hidden\\s+aria-hidden="true"\\s*></div>`, "i")
  );

  if (!match) {
    return { extras: EMPTY_BLOG_EXTRAS, content: stripBlogExtrasFromContent(content) };
  }

  const extras = decodeExtras(match[1]) ?? EMPTY_BLOG_EXTRAS;
  return {
    extras,
    content: stripBlogExtrasFromContent(content),
  };
}

export function buildFaqPageSchema(faqs: BlogFaqItem[]) {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function keyPointsToText(keyPoints: string[]): string {
  return keyPoints.join("\n");
}

export function textToKeyPoints(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function faqsToText(faqs: BlogFaqItem[]): string {
  return faqs
    .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join("\n\n");
}

export function textToFaqs(text: string): BlogFaqItem[] {
  const faqs: BlogFaqItem[] = [];
  const blocks = text.split(/\n{2,}/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^Q:\s*(.+)\nA:\s*([\s\S]+)$/i);
    if (match) {
      faqs.push({ question: match[1].trim(), answer: match[2].trim() });
    }
  }

  return faqs;
}
