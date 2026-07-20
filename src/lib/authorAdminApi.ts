import type { Author, AuthorInput } from "@/types/blog";
import { parseAuthorJson } from "@/lib/authorRow";

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchAllAuthorsAdmin(): Promise<Author[]> {
  const res = await fetch("/api/admin/blog/authors", { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return (body.authors as Record<string, unknown>[]).map(parseAuthorJson);
}

export async function fetchAuthorByIdAdmin(id: string): Promise<Author | null> {
  const res = await fetch(`/api/admin/blog/authors/${id}`, { credentials: "same-origin" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return parseAuthorJson(body.author as Record<string, unknown>);
}

export async function createAuthorAdmin(input: AuthorInput): Promise<string> {
  const res = await fetch("/api/admin/blog/authors", {
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

export async function updateAuthorAdmin(id: string, input: AuthorInput): Promise<void> {
  const res = await fetch(`/api/admin/blog/authors/${id}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}

export async function deleteAuthorAdmin(id: string): Promise<void> {
  const res = await fetch(`/api/admin/blog/authors/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}
