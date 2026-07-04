export type SearchResultType = "page" | "service" | "blog" | "customization";

export interface SearchIndexEntry {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  type: SearchResultType;
  /** Lowercase searchable blob: title + excerpt + extra keywords */
  searchText: string;
}

export interface SearchResult extends SearchIndexEntry {
  score: number;
  typeLabel: string;
}

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Page",
  service: "Service",
  blog: "Blog",
  customization: "Customization",
};
