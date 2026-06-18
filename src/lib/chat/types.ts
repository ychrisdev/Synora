export type Conversation = {
  id: string;
  name: string;
  avatarUrl: string | null;
  isGroup: boolean;
  otherUsername?: string;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
};

export type Member = {
  initials: string;
  color: string;
  name: string;
  role: "admin" | "mod" | "member";
  active: boolean;
};

export type ApiMessage = {
  id: string;
  content: string | null;
  fileUrl: string | null;
  fileType: string | null;
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    profile: { displayName: string | null; avatarUrl: string | null } | null;
  };
  replyToId: string | null;
  replyTo: {
    id: string;
    content: string | null;
    senderId: string;
    sender: {
      username: string;
      profile: { displayName: string | null } | null;
    };
  } | null;
};

export type Message = {
  id: string;
  sender: string;
  initials: string;
  color: string;
  avatarUrl: string | null;
  time: string;
  content: string | null;
  isMe: boolean;
  attachment: { name: string; size: string; type: string } | null;
  replyTo?: { id: string; sender: string; content: string; isMe?: boolean } | null;
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
