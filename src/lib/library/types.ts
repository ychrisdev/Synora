export type SortKey = "newest" | "mostDownloaded" | "mine" | "saved";
export type LevelKey = "all" | "academic" | "university" | "other";

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: "PDF" | "DOCX" | "PPTX" | string;
  subject?: string;
  subjectId?: string;
  level?: string;
  grade?: string;
  major?: string;
  tags: string[];
  fileUrl: string;
  fileSize: number;
  downloadCount: number;
  uploader: {
    id: string;
    username: string;
    profile: { displayName?: string | null; avatarUrl?: string | null } | null;
  };
  isSaved?: boolean;
  createdAt: string;
}

export interface FeaturedDoc {
  id: string;
  title: string;
  type: string;
  downloadCount: number;
}

export interface LibraryStats {
  totalDocuments: number;
  totalContributors: number;
  totalDownloads: number;
}