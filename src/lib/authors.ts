import { supabase, isSupabaseConfigured } from "./supabase";
import { Author, AuthorInput } from "@/types/blog";

const TABLE_NAME = "authors";

function rowToAuthor(row: Record<string, unknown>): Author {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    bio: (row.bio as string) || "",
    avatarUrl: (row.avatar_url as string) || null,
    email: (row.email as string) || null,
    website: (row.website as string) || null,
    socialTwitter: (row.social_twitter as string) || null,
    socialLinkedin: (row.social_linkedin as string) || null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getAllAuthors(): Promise<Author[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching authors:", error);
    return [];
  }

  return (data || []).map(rowToAuthor);
}

export async function getAuthorById(id: string): Promise<Author | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching author by id:", error);
    return null;
  }

  return data ? rowToAuthor(data) : null;
}

export async function createAuthor(input: AuthorInput): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      name: input.name,
      slug: input.slug,
      bio: input.bio,
      avatar_url: input.avatarUrl || null,
      email: input.email || null,
      website: input.website || null,
      social_twitter: input.socialTwitter || null,
      social_linkedin: input.socialLinkedin || null,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating author:", error);
    throw error;
  }

  return data.id;
}

export async function updateAuthor(id: string, input: AuthorInput): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      name: input.name,
      slug: input.slug,
      bio: input.bio,
      avatar_url: input.avatarUrl || null,
      email: input.email || null,
      website: input.website || null,
      social_twitter: input.socialTwitter || null,
      social_linkedin: input.socialLinkedin || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating author:", error);
    throw error;
  }
}

export async function deleteAuthor(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  // Clear author_ref on posts that reference this author
  await supabase
    .from("blog_posts")
    .update({ author_ref: null })
    .eq("author_ref", id);

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
}
