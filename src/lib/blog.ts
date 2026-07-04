import { supabase, isSupabaseConfigured } from "./supabase";
import { getAllAuthors } from "./authors";
import { getAllCategories } from "./categories";
import { BlogPost, BlogPostInput, BlogPostPublic } from "@/types/blog";

const TABLE_NAME = "blog_posts";

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    content: row.content as string,
    excerpt: row.excerpt as string,
    featuredImage: row.featured_image as string,
    status: row.status as "draft" | "published",
    categoryId: (row.category_id as string) || null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    publishedAt: row.published_at ? new Date(row.published_at as string) : null,
    authorId: row.author_id as string,
    authorEmail: row.author_email as string,
    authorRef: (row.author_ref as string) || null,
    metaTitle: (row.meta_title as string) || null,
    metaDescription: (row.meta_description as string) || null,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }

  return (data || []).map(rowToPost);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }

  return (data || []).map(rowToPost);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
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
      // No rows returned
      return null;
    }
    console.error("Error fetching post by id:", error);
    return null;
  }

  return data ? rowToPost(data) : null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching post by slug:", error);
    return null;
  }

  return data ? rowToPost(data) : null;
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return null;
  return post;
}

export async function getPublishedPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}

async function enrichPostsForPublic(posts: BlogPost[]): Promise<BlogPostPublic[]> {
  const [categories, authors] = await Promise.all([getAllCategories(), getAllAuthors()]);
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const authorById = new Map(authors.map((a) => [a.id, a]));

  return posts.map((post) => ({
    ...post,
    category: post.categoryId ? categoryById.get(post.categoryId) ?? null : null,
    author: post.authorRef ? authorById.get(post.authorRef) ?? null : null,
  }));
}

export async function getPublishedPostsForPublic(): Promise<BlogPostPublic[]> {
  const posts = await getPublishedPosts();
  return enrichPostsForPublic(posts);
}

export async function getPublishedPostForPublic(slug: string): Promise<BlogPostPublic | null> {
  const post = await getPublishedPostBySlug(slug);
  if (!post) return null;
  const [enriched] = await enrichPostsForPublic([post]);
  return enriched ?? null;
}

export async function createPost(
  input: BlogPostInput,
  authorId: string,
  authorEmail: string
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const now = new Date().toISOString();
  const insertData = {
    title: input.title,
    slug: input.slug,
    content: input.content,
    excerpt: input.excerpt,
    featured_image: input.featuredImage,
    status: input.status,
    category_id: input.categoryId || null,
    author_ref: input.authorRef || null,
    created_at: now,
    updated_at: now,
    published_at: input.status === "published" ? now : null,
    author_id: authorId,
    author_email: authorEmail,
    meta_title: input.metaTitle || null,
    meta_description: input.metaDescription || null,
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating post:", error);
    throw error;
  }

  return data.id;
}

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.featuredImage !== undefined) updateData.featured_image = input.featuredImage;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.categoryId !== undefined) updateData.category_id = input.categoryId || null;
  if (input.authorRef !== undefined) updateData.author_ref = input.authorRef || null;
  if (input.metaTitle !== undefined) updateData.meta_title = input.metaTitle || null;
  if (input.metaDescription !== undefined) updateData.meta_description = input.metaDescription || null;

  // If publishing for the first time
  if (input.status === "published") {
    const { data: existing } = await supabase
      .from(TABLE_NAME)
      .select("published_at")
      .eq("id", id)
      .single();

    if (existing && !existing.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
