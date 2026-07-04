import { resolveImageSrc } from "./imageFallback";

export const BLOG_PLACEHOLDER_IMAGE = "/blog/placeholder.svg";

export function getPostImageUrl(featuredImage: string | null | undefined): string {
  return resolveImageSrc(featuredImage?.trim() || BLOG_PLACEHOLDER_IMAGE);
}

export function formatBlogDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}
