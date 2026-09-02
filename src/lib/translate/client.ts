import { DEEPL_TARGET_LANG, type Locale, isNonDefaultLocale } from "@/lib/i18n/locales";
import {
  geminiTranslateHtml,
  geminiTranslateTexts,
  isGeminiConfigured,
} from "@/lib/translate/gemini";

const BATCH_SIZE = 40;
const HTML_CHUNK_CHARS = 24_000;

function getDeepLBaseUrl(apiKey: string): string {
  if (process.env.DEEPL_API_URL?.trim()) return process.env.DEEPL_API_URL.trim();
  return apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2"
    : "https://api.deepl.com/v2";
}

function getDeepLApiKey(): string | null {
  return process.env.DEEPL_API_KEY?.trim() || null;
}

export function isDeepLConfigured(): boolean {
  return Boolean(getDeepLApiKey());
}

/** True when any free/paid translation provider is available (Gemini preferred). */
export function isTranslationConfigured(): boolean {
  return isGeminiConfigured() || isDeepLConfigured();
}

export function getActiveTranslationProvider(): "gemini" | "deepl" | null {
  if (isGeminiConfigured()) return "gemini";
  if (isDeepLConfigured()) return "deepl";
  return null;
}

type DeepLOptions = {
  tagHandling?: "html" | "xml";
};

async function callDeepL(
  texts: string[],
  targetLocale: Exclude<Locale, "en">,
  options: DeepLOptions = {}
): Promise<string[]> {
  const apiKey = getDeepLApiKey();
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY is not configured.");
  }

  const body = new URLSearchParams();
  for (const text of texts) {
    body.append("text", text);
  }
  body.append("source_lang", "EN");
  body.append("target_lang", DEEPL_TARGET_LANG[targetLocale]);
  if (options.tagHandling) {
    body.append("tag_handling", options.tagHandling);
  }

  const response = await fetch(`${getDeepLBaseUrl(apiKey)}/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepL API error (${response.status}): ${detail}`);
  }

  const json = (await response.json()) as { translations: { text: string }[] };
  return json.translations.map((t) => t.text);
}

function splitHtmlForTranslation(html: string, maxChars = HTML_CHUNK_CHARS): string[] {
  const trimmed = html.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxChars) return [trimmed];

  const markers = [
    "</p>",
    "</h2>",
    "</h3>",
    "</h4>",
    "</ul>",
    "</ol>",
    "</table>",
    "</blockquote>",
    "</div>",
  ];
  const parts: string[] = [];
  let remaining = trimmed;

  while (remaining.length > maxChars) {
    const window = remaining.slice(0, maxChars);
    let end = -1;
    for (const marker of markers) {
      const idx = window.lastIndexOf(marker);
      if (idx >= 0) end = Math.max(end, idx + marker.length);
    }
    if (end < maxChars * 0.4) {
      const tagClose = window.lastIndexOf(">");
      end = tagClose > maxChars * 0.5 ? tagClose + 1 : maxChars;
    }
    parts.push(remaining.slice(0, end));
    remaining = remaining.slice(end).trimStart();
  }

  if (remaining) parts.push(remaining);
  return parts;
}

async function deeplTranslateTexts(
  texts: string[],
  targetLocale: Exclude<Locale, "en">
): Promise<string[]> {
  if (texts.length === 0) return [];

  const results: string[] = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);
    const translated = await callDeepL(chunk, targetLocale);
    results.push(...translated);
  }
  return results;
}

async function deeplTranslateHtml(
  html: string,
  targetLocale: Exclude<Locale, "en">
): Promise<string> {
  const chunks = splitHtmlForTranslation(html);
  if (chunks.length === 0) return html;

  const translated: string[] = [];
  for (const chunk of chunks) {
    const [result] = await callDeepL([chunk], targetLocale, { tagHandling: "html" });
    translated.push(result ?? chunk);
  }
  return translated.join("");
}

export async function translateTexts(
  texts: string[],
  targetLocale: Exclude<Locale, "en">
): Promise<string[]> {
  if (texts.length === 0) return [];

  const provider = getActiveTranslationProvider();
  if (provider === "gemini") {
    // Keep batches modest so the model returns valid JSON reliably.
    const results: string[] = [];
    for (let i = 0; i < texts.length; i += 20) {
      const chunk = texts.slice(i, i + 20);
      results.push(...(await geminiTranslateTexts(chunk, targetLocale)));
    }
    return results;
  }
  if (provider === "deepl") {
    return deeplTranslateTexts(texts, targetLocale);
  }

  throw new Error(
    "No translation provider configured. Set free GEMINI_API_KEY (https://aistudio.google.com/app/apikey) or DEEPL_API_KEY."
  );
}

export async function translateText(
  text: string,
  targetLocale: Exclude<Locale, "en">
): Promise<string> {
  const [result] = await translateTexts([text], targetLocale);
  return result ?? text;
}

export async function translateHtml(
  html: string,
  targetLocale: Exclude<Locale, "en">
): Promise<string> {
  const provider = getActiveTranslationProvider();
  if (provider === "gemini") {
    const chunks = splitHtmlForTranslation(html, 12_000);
    if (chunks.length === 0) return html;
    const translated: string[] = [];
    for (const chunk of chunks) {
      translated.push(await geminiTranslateHtml(chunk, targetLocale));
    }
    return translated.join("");
  }
  if (provider === "deepl") {
    return deeplTranslateHtml(html, targetLocale);
  }

  throw new Error(
    "No translation provider configured. Set free GEMINI_API_KEY (https://aistudio.google.com/app/apikey) or DEEPL_API_KEY."
  );
}

export async function translateToAllLocales(text: string): Promise<Partial<Record<Locale, string>>> {
  const output: Partial<Record<Locale, string>> = { en: text };
  for (const locale of ["zh-TW", "ko", "ja", "fr", "ru"] as const) {
    if (!isNonDefaultLocale(locale)) continue;
    output[locale] = await translateText(text, locale);
  }
  return output;
}
