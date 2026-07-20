import type { Author } from "@/types/blog";

export function rowToAuthor(row: Record<string, unknown>): Author {
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

export function authorToJson(author: Author) {
  return {
    id: author.id,
    name: author.name,
    slug: author.slug,
    bio: author.bio,
    avatarUrl: author.avatarUrl,
    email: author.email,
    website: author.website,
    socialTwitter: author.socialTwitter,
    socialLinkedin: author.socialLinkedin,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString(),
  };
}

export function parseAuthorJson(value: Record<string, unknown>): Author {
  return {
    id: value.id as string,
    name: value.name as string,
    slug: value.slug as string,
    bio: (value.bio as string) || "",
    avatarUrl: (value.avatarUrl as string) || null,
    email: (value.email as string) || null,
    website: (value.website as string) || null,
    socialTwitter: (value.socialTwitter as string) || null,
    socialLinkedin: (value.socialLinkedin as string) || null,
    createdAt: new Date(value.createdAt as string),
    updatedAt: new Date(value.updatedAt as string),
  };
}

export function authorInputToRow(input: {
  name: string;
  slug: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  website?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
}) {
  return {
    name: input.name,
    slug: input.slug,
    bio: input.bio,
    avatar_url: input.avatarUrl || null,
    email: input.email || null,
    website: input.website || null,
    social_twitter: input.socialTwitter || null,
    social_linkedin: input.socialLinkedin || null,
  };
}
