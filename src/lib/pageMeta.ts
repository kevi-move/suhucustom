import { unstable_cache } from "next/cache";
import { supabase, isSupabaseConfigured } from "./supabase";
import { PageMeta, PageMetaInput } from "@/types/pageMeta";

const TABLE_NAME = "page_meta";

function rowToPageMeta(row: Record<string, unknown>): PageMeta {
  return {
    id: row.id as string,
    pageSlug: row.page_slug as string,
    metaTitle: row.meta_title as string,
    metaDescription: row.meta_description as string,
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getAllPageMeta(): Promise<PageMeta[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("page_slug", { ascending: true });

  if (error) {
    console.error("Error fetching page meta:", error);
    return [];
  }

  return (data || []).map(rowToPageMeta);
}

export async function getPageMeta(pageSlug: string): Promise<PageMeta | null> {
  const supabaseClient = supabase;
  if (!isSupabaseConfigured || !supabaseClient) {
    console.warn("Supabase is not configured");
    return null;
  }

  const cachedFetch = unstable_cache(
    async (slug: string) => {
      const { data, error } = await supabaseClient
        .from(TABLE_NAME)
        .select("*")
        .eq("page_slug", slug)
        .single();

      return { data, error };
    },
    ["page-meta", pageSlug],
    { revalidate: 60, tags: [`page-meta:${pageSlug}`] }
  );

  const { data, error } = await cachedFetch(pageSlug);

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching page meta:", error);
    return null;
  }

  return data ? rowToPageMeta(data) : null;
}

export async function upsertPageMeta(input: PageMetaInput): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        page_slug: input.pageSlug,
        meta_title: input.metaTitle,
        meta_description: input.metaDescription,
        updated_at: now,
      },
      { onConflict: "page_slug" }
    );

  if (error) {
    console.error("Error upserting page meta:", error);
    throw error;
  }
}

export async function deletePageMeta(pageSlug: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("page_slug", pageSlug);

  if (error) {
    console.error("Error deleting page meta:", error);
    throw error;
  }
}
