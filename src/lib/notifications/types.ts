export type NotifType = "like" | "comment" | "milestone" | "invite" | "award" | "share" | "group";

export interface NotifItem {
  id: number;
  avatars: string[];
  avatarColors: string[];
  text: string;
  sub?: string;
  createdAt: string;
  unread: boolean;
  type: NotifType;
  action?: { accept: string; decline: string } | null;
}

export interface NotifSettings {
  interactions: boolean;
  mentions: boolean;
  uploads: boolean;
  groups: boolean;
  emailDigest: boolean;
  system: boolean;
}