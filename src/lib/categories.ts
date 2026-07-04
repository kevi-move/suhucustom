import { supabase, isSupabaseConfigured } from "./supabase";
import { Category, CategoryInput } from "@/types/blog";

const TABLE_NAME = "categories";

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data || []).map(rowToCategory);
}

export async function createCategory(input: CategoryInput): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      name: input.name,
      slug: input.slug,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data.id;
}

export async function updateCategory(id: string, input: CategoryInput): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      name: input.name,
      slug: input.slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  // Clear category_id on posts that reference this category
  await supabase
    .from("blog_posts")
    .update({ category_id: null })
    .eq("category_id", id);

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
