function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

export function stripHtmlTags(html) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractFaqsFromHtml(html) {
  const faqs = [];
  const faqItems = html.matchAll(/<div\s+class=["']faq-item["'][^>]*>([\s\S]*?)<\/div>/gi);

  for (const item of faqItems) {
    const block = item[1];
    const questionMatch = block.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
    const answerMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!questionMatch || !answerMatch) continue;

    faqs.push({
      question: stripHtmlTags(questionMatch[1]).replace(/^Q:\s*/i, "").trim(),
      answer: stripHtmlTags(answerMatch[1]).trim(),
    });
  }

  return faqs;
}

export function parseArticleHtml(raw, filePath = "") {
  const titleFromTag = raw.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "";
  const metaDescription =
    raw.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() || "";

  const containerMatch = raw.match(/<div\s+class=["']container["'][^>]*>([\s\S]*?)<\/div>\s*<\/body>/i);
  let bodyHtml = containerMatch?.[1]?.trim() || raw;

  bodyHtml = bodyHtml.replace(/<nav\s+class=["']breadcrumb["'][\s\S]*?<\/nav>/gi, "");
  bodyHtml = bodyHtml.replace(/<nav\s+class=["']toc["'][\s\S]*?<\/nav>/gi, "");

  const h1Match = bodyHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleFromH1 = h1Match ? stripHtmlTags(h1Match[1]) : "";
  const title = titleFromH1 || titleFromTag.replace(/\s*\(\d{4}\)\s*$/, "").trim();

  if (h1Match) {
    bodyHtml = bodyHtml.replace(h1Match[0], "");
  }

  let aiSummary = "";
  const introMatch = bodyHtml.match(/<div\s+class=["']intro-box["'][^>]*>([\s\S]*?)<\/div>/i);
  if (introMatch) {
    aiSummary = stripHtmlTags(introMatch[1]);
    bodyHtml = bodyHtml.replace(introMatch[0], "");
  }

  let faqs = [];
  const faqHeadingMatch = bodyHtml.match(/<h2[^>]*id=["']faq["'][^>]*>/i);
  if (faqHeadingMatch) {
    const faqStart = faqHeadingMatch.index ?? -1;
    const faqHtml = bodyHtml.slice(faqStart);
    faqs = extractFaqsFromHtml(faqHtml);

    const afterFaq = faqHtml.match(/<hr[\s\S]*$/i);
    const cutIndex =
      afterFaq && afterFaq.index !== undefined ? faqStart + afterFaq.index : faqStart;
    bodyHtml = bodyHtml.slice(0, faqStart).trim();

    const finalSection = afterFaq?.[0]?.match(/<h2[^>]*>Final Thoughts<\/h2>([\s\S]*)/i);
    if (finalSection?.[1]) {
      bodyHtml += `\n<h2>Final Thoughts</h2>${finalSection[1].split(/<\/div>\s*$/)[0]}`;
    }
  }

  bodyHtml = bodyHtml.replace(/<hr\b[^>]*>/gi, "");
  bodyHtml = bodyHtml.replace(/\n{3,}/g, "\n").trim();

  const baseName = filePath ? filePath.replace(/\.html$/i, "").split(/[\\/]/).pop() : "";
  const slug = slugify(baseName || title);
  const metaTitle = titleFromTag || title;
  const excerpt = metaDescription || aiSummary.slice(0, 280);

  return {
    title,
    slug,
    metaTitle,
    metaDescription,
    featuredImage: "",
    excerpt,
    bodyHtml,
    aiSummary,
    keyPoints: [],
    faqs,
    metadata: {},
  };
}
