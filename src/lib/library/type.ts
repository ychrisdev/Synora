export type SortKey = "newest" | "mostDownloaded" | "oldest" | "saved";

export interface Document {
  id: number;
  title: string;
  type: "PDF" | "DOCX" | "PPTX";
  subject: string;
  subjectId: string;
  author: { name: string; initials: string; color: string };
  date: string;
  downloads: string;
  downloadsNum: number;
}

export interface FeaturedDoc {
  id: number;
  title: string;
  type: string;
  downloads: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
}
