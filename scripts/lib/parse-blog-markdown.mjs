/**
 * Parse AI Summary, Key Points, and FAQ sections from article markdown.
 */

function stripBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").trim();
}

/** Remove markdown tables, headings, and other non-prose blocks from summary text. */
function cleanSummaryText(text) {
  if (!text) return "";

  const lines = text.split(/\r?\n/);
  const prose = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (/^\|/.test(trimmed)) continue;
    if (/^[-|:\s]+$/.test(trimmed)) continue;
    if (/^[-*]\s+\[[ xX]\]/.test(trimmed)) continue;
    prose.push(stripBold(trimmed.replace(/\[(.+?)\]\(.+?\)/g, "$1")));
  }

  return prose.join(" ").replace(/\s{2,}/g, " ").trim();
}

const APPENDIX_HEADING =
  /^#{2,3}\s+(howto json-ld|faqpage json-ld|structured data \(json-ld\))\s*$/i;

/** Remove SEO appendix blocks, task-list checkboxes, and horizontal rules. */
export function stripImportArtifacts(markdown) {
  const lines = markdown.split(/\r?\n/);
  let cutAt = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (APPENDIX_HEADING.test(lines[i].trim())) {
      cutAt = i;
      if (i > 0 && lines[i - 1].trim() === "---") {
        cutAt = i - 1;
      }
      break;
    }
  }

  let body = lines.slice(0, cutAt).join("\n");

  body = body.replace(/<details>[\s\S]*?<\/details>/gi, "");
  body = body.replace(/\n```json[\s\S]*?```\s*$/gi, "");
  body = body.replace(/^(\s*[-*])\s+\[[ xX]\]\s+/gm, "$1 ");
  body = body.replace(/^---\s*$/gm, "");
  body = body.replace(/\n{3,}/g, "\n\n").trim();

  return body;
}

function parseBulletList(lines, startIndex) {
  const items = [];
  let i = startIndex;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      if (items.length > 0) break;
      i += 1;
      continue;
    }
    if (line.startsWith("#")) break;
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (!bullet) break;
    items.push(stripBold(bullet[1]));
    i += 1;
  }
  return { items, nextIndex: i };
}

function parseFaqsFromSection(text) {
  const faqs = [];
  const trimmed = text.trim();

  if (/^###\s+/m.test(trimmed)) {
    const blocks = trimmed.split(/\n(?=###\s+)/);
    for (const block of blocks) {
      const match = block.match(/^###\s+(.+?)\s*\n([\s\S]*)$/);
      if (!match) continue;

      const question = stripBold(match[1].replace(/^\d+\.\s*/, ""));
      const answer = stripBold(match[2].trim());
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
    if (faqs.length > 0) return faqs;
  }

  const blocks = trimmed.split(/\n(?=\*\*)/);
  for (const block of blocks) {
    const blockTrimmed = block.trim();
    if (!blockTrimmed) continue;

    const match = blockTrimmed.match(/^\*\*(.+?)\*\*\s*\n([\s\S]*)$/);
    if (!match) continue;

    const question = stripBold(match[1].replace(/^\d+\.\s*/, ""));
    const answer = stripBold(match[2].trim());

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

function findSection(body, headingNames) {
  const lines = body.split(/\r?\n/);
  let start = -1;
  let level = 2;

  for (let i = 0; i < lines.length; i++) {
    const h2 = lines[i].match(/^##\s+(.+)$/);
    const h3 = lines[i].match(/^###\s+(.+)$/);
    const match = h2 || h3;
    if (!match) continue;

    const name = match[1].trim().toLowerCase();
    if (headingNames.includes(name)) {
      start = i;
      level = h2 ? 2 : 3;
      break;
    }
  }

  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (level === 2 && /^##\s+/.test(line)) {
      end = i;
      break;
    }
    if (level === 3 && /^#{2,3}\s+/.test(line)) {
      end = i;
      break;
    }
  }

  const sectionText = lines.slice(start + 1, end).join("\n").trim();
  const remaining = [...lines.slice(0, start), ...lines.slice(end)].join("\n").trim();

  return { sectionText, remainingBody: remaining };
}

export function extractBlogExtras(bodyMarkdown, metadata = {}) {
  let body = stripImportArtifacts(bodyMarkdown);
  let aiSummary = metadata["ai summary"] || "";
  let keyPoints = [];

  if (!aiSummary) {
    const aiSection = findSection(body, ["ai summary"]);
    if (aiSection) {
      aiSummary = aiSection.sectionText.replace(/\*\*(.+?)\*\*/g, "$1").trim();
      body = aiSection.remainingBody;
    }
  }

  const keyPointsSection = findSection(body, [
    "key points",
    "key takeaways",
    "key takeaways for buyers",
  ]);
  if (keyPointsSection) {
    const lines = keyPointsSection.sectionText.split(/\r?\n/);
    keyPoints = parseBulletList(lines, 0).items;
    body = keyPointsSection.remainingBody;
  } else if (metadata["key points"]) {
    keyPoints = metadata["key points"]
      .split(/\n/)
      .map((line) => line.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean);
  }

  const faqSection = findSection(body, ["faq", "faqs", "frequently asked questions"]);
  let faqs = [];
  if (faqSection) {
    faqs = parseFaqsFromSection(faqSection.sectionText);
    body = faqSection.remainingBody;
  }

  body = stripImportArtifacts(body);

  if (!aiSummary) {
    const introParts = [];
    const firstParagraph = body
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find(
        (block) =>
          block &&
          !block.startsWith("#") &&
          !block.startsWith("|") &&
          !block.startsWith("![") &&
          !block.startsWith("- [")
      );

    if (firstParagraph) {
      introParts.push(
        firstParagraph
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/\[(.+?)\]\(.+?\)/g, "$1")
          .trim()
      );
    }

    if (introParts.length > 0) {
      aiSummary = cleanSummaryText(introParts.join("\n\n"));
    }
  }

  if (!aiSummary) {
    const introBlocks = body
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(
        (block) =>
          block &&
          !block.startsWith("#") &&
          !block.startsWith("|") &&
          !block.startsWith("![") &&
          !block.startsWith("- [")
      );

    if (introBlocks.length > 0) {
      aiSummary = cleanSummaryText(introBlocks.slice(0, 1).join(" "));
    }
  }

  if (aiSummary.length > 320) {
    aiSummary = `${aiSummary.slice(0, 317).replace(/\s+\S*$/, "")}…`;
  }

  if (keyPoints.length === 0) {
    const ruleBlocks = body.match(/\*\*Rule of Thumb:\*\*\s*(.+)/g) || [];
    keyPoints = ruleBlocks
      .slice(0, 5)
      .map((line) => line.replace(/\*\*Rule of Thumb:\*\*\s*/, "").trim());
  }

  return {
    bodyMarkdown: body.trim(),
    aiSummary,
    keyPoints,
    faqs,
  };
}
