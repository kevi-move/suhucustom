export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: "draft" | "published";
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  authorId: string;
  authorEmail: string;
  authorRef: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface BlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: "draft" | "published";
  categoryId?: string | null;
  authorRef?: string | null;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string | null;
  email: string | null;
  website: string | null;
  socialTwitter: string | null;
  socialLinkedin: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorInput {
  name: string;
  slug: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  website?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

/** Published post with resolved category & author for public pages */
export interface BlogPostPublic extends BlogPost {
  category: Category | null;
  author: Author | null;
}
