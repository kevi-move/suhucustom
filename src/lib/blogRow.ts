import type { BlogPost, BlogPostInput } from "@/types/blog";

export function rowToPost(row: Record<string, unknown>): BlogPost {
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

export function postToJson(post: BlogPost) {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
  };
}

export function parsePostJson(raw: Record<string, unknown>): BlogPost {
  return {
    id: raw.id as string,
    title: raw.title as string,
    slug: raw.slug as string,
    content: raw.content as string,
    excerpt: raw.excerpt as string,
    featuredImage: raw.featuredImage as string,
    status: raw.status as "draft" | "published",
    categoryId: (raw.categoryId as string) || null,
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt as string) : null,
    authorId: raw.authorId as string,
    authorEmail: raw.authorEmail as string,
    authorRef: (raw.authorRef as string) || null,
    metaTitle: (raw.metaTitle as string) || null,
    metaDescription: (raw.metaDescription as string) || null,
  };
}

export function inputToInsertRow(
  input: BlogPostInput,
  authorId: string,
  authorEmail: string,
  now: string
) {
  return {
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
}

export function inputToUpdateRow(input: Partial<BlogPostInput>) {
  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.featuredImage !== undefined) updateData.featured_image = input.featuredImage;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.categoryId !== undefined) updateData.category_id = input.categoryId || null;
  if (input.authorRef !== undefined) updateData.author_ref = input.authorRef || null;
  if (input.metaTitle !== undefined) updateData.meta_title = input.metaTitle || null;
  if (input.metaDescription !== undefined) {
    updateData.meta_description = input.metaDescription || null;
  }

  return updateData;
}
