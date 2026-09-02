/**
 * Backward-compatible DeepL entrypoint.
 * Prefer importing from `@/lib/translate/client`.
 * Provider priority: free Gemini → DeepL.
 */
export {
  getActiveTranslationProvider,
  isDeepLConfigured,
  isTranslationConfigured,
  translateHtml,
  translateText,
  translateTexts,
  translateToAllLocales,
} from "@/lib/translate/client";
