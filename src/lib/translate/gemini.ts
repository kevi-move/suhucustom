import type { Locale } from "@/lib/i18n/locales";

export const LOCALE_LANGUAGE_NAME: Record<Exclude<Locale, "en">, string> = {
  "zh-TW": "Traditional Chinese (zh-TW / 繁體中文)",
  ko: "Korean",
  ja: "Japanese",
  fr: "French",
  ru: "Russian",
};

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY?.trim() || null;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

function extractText(payload: unknown): string {
  const candidates = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
    ?.candidates;
  const text = candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  return text.trim();
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json|html|htm)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

async function generateContent(prompt: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const model = getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const proxy =
    process.env.TRANSLATE_HTTP_PROXY?.trim() ||
    process.env.HTTPS_PROXY?.trim() ||
    process.env.HTTP_PROXY?.trim();

  let response: Response;
  if (proxy) {
    const { ProxyAgent, fetch: undiciFetch } = await import("undici");
    response = (await undiciFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
      dispatcher: new ProxyAgent(proxy),
    })) as unknown as Response;
  } else {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
    });
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${detail}`);
  }

  const json = await response.json();
  const text = extractText(json);
  if (!text) throw new Error("Gemini returned empty translation.");
  return text;
}

export async function geminiTranslateTexts(
  texts: string[],
  targetLocale: Exclude<Locale, "en">
): Promise<string[]> {
  if (texts.length === 0) return [];

  const language = LOCALE_LANGUAGE_NAME[targetLocale];
  const prompt = [
    `You are a professional translator.`,
    `Translate each string from English to ${language}.`,
    `Return ONLY a valid JSON array of strings with the same length and order.`,
    `Do not add explanations or markdown.`,
    `Preserve brand names like SuhuCustom, Suhu Custom when natural.`,
    ``,
    `INPUT_JSON:`,
    JSON.stringify(texts),
  ].join("\n");

  const raw = stripCodeFence(await generateContent(prompt));
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Model sometimes wraps with prose — try to extract the array.
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini text translation did not return JSON array.");
    parsed = JSON.parse(match[0]);
  }

  if (!Array.isArray(parsed) || parsed.length !== texts.length) {
    throw new Error(
      `Gemini text translation length mismatch (expected ${texts.length}, got ${Array.isArray(parsed) ? parsed.length : 0}).`
    );
  }

  return parsed.map((item, index) => (typeof item === "string" ? item : texts[index]));
}

export async function geminiTranslateHtml(
  html: string,
  targetLocale: Exclude<Locale, "en">
): Promise<string> {
  const trimmed = html.trim();
  if (!trimmed) return html;

  const language = LOCALE_LANGUAGE_NAME[targetLocale];
  const prompt = [
    `You are a professional translator for an apparel manufacturing website.`,
    `Translate the following HTML from English to ${language}.`,
    `Rules:`,
    `- Keep ALL HTML tags, attributes, classes, ids, and structure unchanged.`,
    `- Only translate human-readable text nodes.`,
    `- Do not translate URLs, email addresses, or HTML attribute names.`,
    `- Preserve brand names like SuhuCustom when natural.`,
    `- Return ONLY the translated HTML, no markdown fences or commentary.`,
    ``,
    `HTML:`,
    trimmed,
  ].join("\n");

  return stripCodeFence(await generateContent(prompt));
}
