export type Visibility = "public" | "friends" | "private";

export interface MutualFriend {
  initials: string;
  name: string;
  role: string;
  color: string;
}

export interface Suggestion {
  initials: string;
  name: string;
  role: string;
  color: string;
}

export interface RecentDoc {
  name: string;
  pages: string;
  downloads: number;
}

export interface ProfileStats {
  followers: string;
  following: number;
  documents: number;
  downloads: string;
}

export interface ProfileData {
  name: string;
  username: string;
  bio: string;
  school: string;
  location: string;
  joinDate: string;
  website: string;
  stats: ProfileStats;
  subjects: string[];
  mutualFriends: MutualFriend[];
  suggestions: Suggestion[];
  recentDocs: RecentDoc[];
}