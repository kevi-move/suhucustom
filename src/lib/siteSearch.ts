import { getPublishedPosts } from "@/lib/blog";
import { buildStaticSearchIndex, blogPostToSearchEntry } from "@/lib/siteSearchIndex";
import {
  SEARCH_TYPE_LABELS,
  type SearchIndexEntry,
  type SearchResult,
} from "@/types/search";

let cachedIndex: SearchIndexEntry[] | null = null;
let cacheTime = 0;
const CACHE_MS = 60_000;

export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  const now = Date.now();
  if (cachedIndex && now - cacheTime < CACHE_MS) return cachedIndex;

  const staticEntries = buildStaticSearchIndex();
  const posts = await getPublishedPosts();
  const blogEntries = posts.map((p) =>
    blogPostToSearchEntry({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
    })
  );

  cachedIndex = [...staticEntries, ...blogEntries];
  cacheTime = now;
  return cachedIndex;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

function scoreEntry(entry: SearchIndexEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  const title = entry.title.toLowerCase();
  const text = entry.searchText;
  let score = 0;

  const fullQuery = tokens.join(" ");
  if (title.includes(fullQuery)) score += 80;
  if (text.includes(fullQuery)) score += 40;

  for (const token of tokens) {
    if (title === token) score += 50;
    else if (title.startsWith(token)) score += 35;
    else if (title.includes(token)) score += 25;

    if (text.includes(token)) {
      const occurrences = text.split(token).length - 1;
      score += Math.min(15, 5 + occurrences * 2);
    }
  }

  return score;
}

export function searchIndex(
  index: SearchIndexEntry[],
  query: string,
  limit = 40
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const entry of index) {
    const score = scoreEntry(entry, tokens);
    if (score <= 0) continue;
    results.push({
      ...entry,
      score,
      typeLabel: SEARCH_TYPE_LABELS[entry.type],
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export async function searchSite(query: string, limit = 40): Promise<SearchResult[]> {
  const index = await getSearchIndex();
  return searchIndex(index, query, limit);
}

export function highlightSnippet(text: string, query: string, maxLen = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const tokens = tokenize(query);
  if (tokens.length === 0) return clean.slice(0, maxLen);

  const lower = clean.toLowerCase();
  let idx = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i >= 0 && (idx < 0 || i < idx)) idx = i;
  }

  if (idx < 0) {
    return clean.slice(0, maxLen) + (clean.length > maxLen ? "..." : "");
  }

  const start = Math.max(0, idx - 40);
  const slice = clean.slice(start, start + maxLen);
  const prefix = start > 0 ? "..." : "";
  const suffix = start + maxLen < clean.length ? "..." : "";
  return prefix + slice + suffix;
}
