import { unstable_cache } from "next/cache";
import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "./supabase/adminServer";
import { supabase, isSupabaseConfigured } from "./supabase";
import { getRequestLocale } from "./i18n/server";
import { DEFAULT_LOCALE, type Locale } from "./i18n/locales";
import { getCachedTranslation } from "./translations/store";
import { mergePageContent } from "./pageContentDefaults";
import { deepMerge } from "./deepMerge";

const TABLE_NAME = "page_content";

export function getNestedValue<T>(obj: Record<string, unknown> | null, path: string): T | undefined {
  if (!obj) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as T | undefined;
}

export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const result: Record<string, unknown> = { ...obj };
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = current[key];
    current[key] = next && typeof next === "object" ? { ...(next as Record<string, unknown>) } : {};
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

export async function getPageContent(
  pageSlug: string,
  locale?: Locale
): Promise<{ content: Record<string, unknown>; version: number }> {
  const activeLocale = locale ?? (await getRequestLocale());
  const supabaseClient = supabase;
  if (!isSupabaseConfigured || !supabaseClient) {
    return { content: {}, version: 1 };
  }

  const cachedFetch = unstable_cache(
    async (slug: string) => {
      const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .select("content, version")
        .eq("page_slug", slug)
        .single();
      return { data, error };
    },
    ["page-content", pageSlug],
    { revalidate: 60, tags: [`page-content:${pageSlug}`] }
  );

  const { data, error } = await cachedFetch(pageSlug);

  let dbContent: Record<string, unknown> = {};
  let version = 1;

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching page content:", error);
    }
  } else {
    dbContent = (data?.content as Record<string, unknown>) || {};
    version = (data?.version as number) || 1;
  }

  const englishContent = mergePageContent(pageSlug, dbContent);

  if (activeLocale === DEFAULT_LOCALE) {
    return { content: englishContent, version };
  }

  const translated = await getCachedTranslation("page", pageSlug, activeLocale, version);
  if (translated) {
    return {
      content: deepMerge(englishContent, translated as Record<string, unknown>),
      version,
    };
  }

  return { content: englishContent, version };
}

export async function upsertPageContent(
  pageSlug: string,
  content: Record<string, unknown>,
  updatedBy: string
): Promise<{ success: boolean; version?: number; error?: string }> {
  const supabaseClient = createAdminSupabaseClient() ?? supabase;
  if (!isSupabaseConfigured && !isSupabaseAdminConfigured) {
    return { success: false, error: "Supabase is not configured" };
  }
  if (!supabaseClient) {
    return { success: false, error: "Supabase is not configured" };
  }

  const { data, error } = await supabaseClient
    .from(TABLE_NAME)
    .upsert(
      {
        page_slug: pageSlug,
        content,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_slug" }
    )
    .select("version")
    .single();

  if (error) {
    console.error("Error upserting page content:", error);
    return { success: false, error: error.message };
  }

  return { success: true, version: (data?.version as number) || 1 };
}
