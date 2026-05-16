export type Conversation = {
  id: number;
  name: string;
  initials: string;
  color: string;
  isGroup: boolean;
  lastMessage: string;
  time: string;
  unread: number;
};

export type Member = {
  initials: string;
  color: string;
  name: string;
  role: "admin" | "mod" | "member";
  active: boolean;
};

export type Message = {
  id: number;
  sender: string;
  initials: string;
  color: string;
  time: string;
  content: string | null;
  isMe: boolean;
  attachment: { name: string; size: string; type: string } | null;
};

export type PendingMessage = {
  id: number;
  sender: string;
  initials: string;
  color: string;
  content: string;
  time: string;
};

export type BlockedUser = {
  id: number;
  name: string;
  initials: string;
  color: string;
  blockedAt: string;
};

export type SharedFile = {
  name: string;
  size: string;
  type: string;
  color: string;
  date: string;
};

export type SharedImage = {
  id: number;
  bg: string;
};

export type Contact = {
  initials: string;
  color: string;
  name: string;
  active: boolean;
};

export type FilterChip = "all" | "unread" | "group";
export type NewConvTab = "direct" | "group";
export type AvatarMenuPanel = "main" | "pending" | "blocked" | "settings";
export type ConfirmAction = "block" | "leave" | "report";