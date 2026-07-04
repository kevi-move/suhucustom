import { DEEPL_TARGET_LANG, type Locale, isNonDefaultLocale } from "@/lib/i18n/locales";

const BATCH_SIZE = 40;

function getDeepLBaseUrl(apiKey: string): string {
  if (process.env.DEEPL_API_URL?.trim()) return process.env.DEEPL_API_URL.trim();
  return apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2"
    : "https://api.deepl.com/v2";
}

function getApiKey(): string | null {
  return process.env.DEEPL_API_KEY?.trim() || null;
}

export function isDeepLConfigured(): boolean {
  return Boolean(getApiKey());
}

async function callDeepL(texts: string[], targetLocale: Exclude<Locale, "en">): Promise<string[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("DEEPL_API_KEY is not configured.");
  }

  const body = new URLSearchParams();
  for (const text of texts) {
    body.append("text", text);
  }
  body.append("source_lang", "EN");
  body.append("target_lang", DEEPL_TARGET_LANG[targetLocale]);

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

export async function translateTexts(
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

export async function translateText(
  text: string,
  targetLocale: Exclude<Locale, "en">
): Promise<string> {
  const [result] = await translateTexts([text], targetLocale);
  return result ?? text;
}

export async function translateToAllLocales(text: string): Promise<Partial<Record<Locale, string>>> {
  const output: Partial<Record<Locale, string>> = { en: text };
  for (const locale of ["zh-TW", "ko", "ja", "fr", "ru"] as const) {
    if (!isNonDefaultLocale(locale)) continue;
    output[locale] = await translateText(text, locale);
  }
  return output;
}
