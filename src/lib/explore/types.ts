export type SortKey = "hot" | "newest" | "rising";

export interface ActiveGroup {
  name: string;
  initials: string;
  color: string;
  members: string;
  activity: string;
}

export interface TopContributor {
  name: string;
  initials: string;
  color: string;
  role: string;
  posts: number;
  subject: string;
}

export interface ExplorePost {
  id: number;
  author: {
    name: string;
    initials: string;
    color: string;
    role: string;
  };
  time: string;
  content: string;
  tags: string[];
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
  likes: number;
  comments: number;
}