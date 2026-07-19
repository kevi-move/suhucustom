import type { BlogPost, BlogPostInput } from "@/types/blog";
import { parsePostJson } from "@/lib/blogRow";

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchAllPostsAdmin(): Promise<BlogPost[]> {
  const res = await fetch("/api/admin/blog/posts", { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return (body.posts as Record<string, unknown>[]).map(parsePostJson);
}

export async function fetchPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const res = await fetch(`/api/admin/blog/posts/${id}`, { credentials: "same-origin" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return parsePostJson(body.post as Record<string, unknown>);
}

export async function createPostAdmin(input: BlogPostInput): Promise<string> {
  const res = await fetch("/api/admin/blog/posts", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return body.id as string;
}

export async function updatePostAdmin(
  id: string,
  input: Partial<BlogPostInput>
): Promise<void> {
  const res = await fetch(`/api/admin/blog/posts/${id}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}

export async function deletePostAdmin(id: string): Promise<void> {
  const res = await fetch(`/api/admin/blog/posts/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}
