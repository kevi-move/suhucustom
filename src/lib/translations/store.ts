import { createAdminSupabaseClient, isSupabaseAdminConfigured } from "@/lib/supabase/adminServer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Locale } from "@/lib/i18n/locales";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

const TABLE = "content_translations";

export type TranslationSourceType = "page" | "seo" | "ui";

function getClient() {
  return createAdminSupabaseClient() ?? supabase;
}

export async function getCachedTranslation(
  sourceType: TranslationSourceType,
  sourceId: string,
  locale: Locale,
  sourceVersion?: number
): Promise<Record<string, unknown> | null> {
  if (locale === DEFAULT_LOCALE) return null;

  const client = getClient();
  if (!isSupabaseConfigured && !isSupabaseAdminConfigured) return null;
  if (!client) return null;

  const { data, error } = await client
    .from(TABLE)
    .select("content, source_version")
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) return null;
  if (sourceVersion != null && data.source_version !== sourceVersion) return null;

  return (data.content as Record<string, unknown>) || null;
}

export async function upsertTranslation(
  sourceType: TranslationSourceType,
  sourceId: string,
  locale: Locale,
  content: Record<string, unknown>,
  sourceVersion = 1
): Promise<void> {
  const client = createAdminSupabaseClient();
  if (!client) {
    console.warn("Cannot upsert translation: admin Supabase client not configured.");
    return;
  }

  const { error } = await client.from(TABLE).upsert(
    {
      source_type: sourceType,
      source_id: sourceId,
      locale,
      content,
      source_version: sourceVersion,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "source_type,source_id,locale" }
  );

  if (error) {
    console.error("upsertTranslation error:", error);
    throw new Error(error.message);
  }
}

export async function deleteTranslationsForSource(
  sourceType: TranslationSourceType,
  sourceId: string
): Promise<void> {
  const client = createAdminSupabaseClient();
  if (!client) return;
  await client.from(TABLE).delete().eq("source_type", sourceType).eq("source_id", sourceId);
}
