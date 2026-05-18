export type TabKey = "all" | "documents" | "posts" | "people" | "groups" | "topics";

export type ResultType = "document" | "post" | "person" | "group" | "topic";

export interface SearchResult {
  id: number;
  type: ResultType;
  title: string;
  subtitle?: string;
  meta?: string;
  tags?: string[];
  stats?: { label: string; value: string | number }[];
  avatar?: string;
  avatarColor?: string;
  badge?: string;
  href: string;
}

export interface FilterGroup {
  label: string;
  options: string[];
}

export interface FilterConfig {
  groups: FilterGroup[];
}