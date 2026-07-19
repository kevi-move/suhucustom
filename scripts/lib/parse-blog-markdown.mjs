/**
 * Parse AI Summary, Key Points, and FAQ sections from article markdown.
 */

function stripBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").trim();
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
  const blocks = text.split(/\n(?=\*\*)/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^\*\*(.+?)\*\*\s*\n([\s\S]*)$/);
    if (!match) continue;

    const question = match[1].trim();
    const answer = match[2].trim().replace(/\*\*(.+?)\*\*/g, "$1");

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

  const sectionLines = lines.slice(start + 1, end);
  const sectionText = sectionLines.join("\n").trim();
  const remaining = [...lines.slice(0, start), ...lines.slice(end)].join("\n").trim();

  return { sectionText, remainingBody: remaining };
}

export function extractBlogExtras(bodyMarkdown, metadata = {}) {
  let body = bodyMarkdown;
  let aiSummary = metadata["ai summary"] || "";
  let keyPoints = [];

  if (!aiSummary) {
    const aiSection = findSection(body, ["ai summary"]);
    if (aiSection) {
      aiSummary = aiSection.sectionText.replace(/\*\*(.+?)\*\*/g, "$1").trim();
      body = aiSection.remainingBody;
    }
  }

  const keyPointsSection = findSection(body, ["key points"]);
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
      aiSummary = introBlocks
        .slice(0, 2)
        .join(" ")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\[(.+?)\]\(.+?\)/g, "$1")
        .trim();
    }
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
