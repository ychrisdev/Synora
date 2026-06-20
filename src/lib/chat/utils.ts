import type {
  ApiMessage,
  ApiReaction,
  Message,
  ReactionGroup,
  PinnedMessage,
} from "./types";

export const RECALL_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getColorForUser(_userId: string): string {
  return "bg-primary";
}

export function getInitialsFromName(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function canRecallMessage(msg: Message): boolean {
  if (!msg.isMe || msg.deletedAt) return false;
  return Date.now() - new Date(msg.createdAt).getTime() <= RECALL_WINDOW_MS;
}

export function groupReactions(
  reactions: ApiReaction[],
  currentUserId: string,
): ReactionGroup[] {
  const map = new Map<string, ReactionGroup>();
  for (const r of reactions) {
    const name = r.user.profile?.displayName ?? r.user.username;
    const existing = map.get(r.emoji);
    if (existing) {
      existing.count += 1;
      existing.users.push(name);
      if (r.userId === currentUserId) existing.reactedByMe = true;
    } else {
      map.set(r.emoji, {
        emoji: r.emoji,
        count: 1,
        reactedByMe: r.userId === currentUserId,
        users: [name],
      });
    }
  }
  return Array.from(map.values());
}

export async function toggleMessageReaction(
  conversationId: string,
  messageId: string,
  emoji: string,
): Promise<{ reactions: ApiReaction[] }> {
  const res = await fetch(
    `/api/conversations/${conversationId}/messages/${messageId}/reactions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    },
  );
  if (!res.ok) throw new Error("Failed to toggle reaction");
  return res.json();
}

export async function recallMessage(
  conversationId: string,
  messageId: string,
): Promise<{ id: string; deletedAt: string }> {
  const res = await fetch(
    `/api/conversations/${conversationId}/messages/${messageId}`,
    { method: "DELETE" },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Không thể thu hồi tin nhắn");
  }
  return data;
}

export function adaptApiMessage(
  msg: ApiMessage,
  currentUserId: string,
): Message {
  const isMe = msg.senderId === currentUserId;
  const pinnedByName = msg.pinnedBy
    ? (msg.pinnedBy.profile?.displayName ?? msg.pinnedBy.username)
    : null;
  const displayName = msg.sender.profile?.displayName ?? msg.sender.username;
  const initials = getInitialsFromName(displayName);
  const color = getColorForUser(msg.senderId);
  const avatarUrl = msg.sender.profile?.avatarUrl ?? null;

  const replyTo = msg.replyTo
    ? {
        id: msg.replyTo.id,
        sender:
          msg.replyTo.sender.profile?.displayName ??
          msg.replyTo.sender.username,
        content: msg.replyTo.content ?? "Đã gửi một file",
        isMe: msg.replyTo.senderId === currentUserId,
      }
    : null;

  if (msg.deletedAt) {
    return {
      id: msg.id,
      sender: displayName,
      initials,
      color,
      avatarUrl,
      time: formatMessageTime(msg.createdAt),
      createdAt: msg.createdAt,
      content: null,
      isMe,
      attachment: null,
      replyTo,
      pinnedAt: msg.pinnedAt,
      pinnedByName: null,
      pinnedById: null,
      forwardedFromSender: msg.forwardedFromSender,
      reactions: [],
      deletedAt: msg.deletedAt,
    };
  }

  const attachment =
    msg.fileUrl && msg.fileType
      ? {
          name: msg.fileUrl.split("/").pop() ?? "file",
          size: "",
          type: msg.fileType.toUpperCase(),
        }
      : null;

  return {
    id: msg.id,
    sender: displayName,
    initials,
    color,
    avatarUrl,
    time: formatMessageTime(msg.createdAt),
    createdAt: msg.createdAt,
    content: msg.content,
    isMe,
    attachment,
    replyTo,
    pinnedAt: msg.pinnedAt,
    pinnedByName,
    pinnedById: msg.pinnedById ?? null,
    forwardedFromSender: msg.forwardedFromSender,
    reactions: groupReactions(msg.reactions, currentUserId),
    deletedAt: null,
  };
}

export async function pinMessage(
  conversationId: string,
  messageId: string,
): Promise<{
  id: string;
  pinnedAt: string;
  pinnedBy: {
    username: string;
    profile: { displayName: string | null } | null;
  };
}> {
  const res = await fetch(
    `/api/conversations/${conversationId}/messages/${messageId}/pin`,
    { method: "POST" },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Không thể ghim tin nhắn");
  return data;
}

export async function unpinMessage(
  conversationId: string,
  messageId: string,
): Promise<void> {
  const res = await fetch(
    `/api/conversations/${conversationId}/messages/${messageId}/pin`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Không thể bỏ ghim tin nhắn");
  }
}

export async function fetchPinnedMessages(
  conversationId: string,
): Promise<PinnedMessage[]> {
  const res = await fetch(
    `/api/conversations/${conversationId}/pinned-messages`,
  );
  if (!res.ok) throw new Error("Không thể tải tin nhắn ghim");
  return res.json();
}

export async function forwardMessage(
  sourceConversationId: string,
  messageId: string,
  targetConversationId: string,
): Promise<ApiMessage> {
  const res = await fetch(
    `/api/conversations/${sourceConversationId}/messages/${messageId}/forward`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetConversationId }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Không thể chuyển tiếp tin nhắn");
  return data;
}
