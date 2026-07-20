import type { Category } from "@/types/blog";

export function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export function categoryToJson(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function parseCategoryJson(value: Record<string, unknown>): Category {
  return {
    id: value.id as string,
    name: value.name as string,
    slug: value.slug as string,
    createdAt: new Date(value.createdAt as string),
    updatedAt: new Date(value.updatedAt as string),
  };
}
