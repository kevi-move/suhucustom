import type { Category, CategoryInput } from "@/types/blog";
import { parseCategoryJson } from "@/lib/categoryRow";

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchAllCategoriesAdmin(): Promise<Category[]> {
  const res = await fetch("/api/admin/blog/categories", { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const body = await res.json();
  return (body.categories as Record<string, unknown>[]).map(parseCategoryJson);
}

export async function createCategoryAdmin(input: CategoryInput): Promise<string> {
  const res = await fetch("/api/admin/blog/categories", {
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

export async function updateCategoryAdmin(id: string, input: CategoryInput): Promise<void> {
  const res = await fetch(`/api/admin/blog/categories/${id}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}

export async function deleteCategoryAdmin(id: string): Promise<void> {
  const res = await fetch(`/api/admin/blog/categories/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
}
