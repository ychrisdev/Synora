import type { ApiMessage, ApiReaction, Message, ReactionGroup } from "./types";

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

export function adaptApiMessage(
  msg: ApiMessage,
  currentUserId: string,
): Message {
  const isMe = msg.senderId === currentUserId;
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
    content: msg.content,
    isMe,
    attachment,
    replyTo,
    reactions: groupReactions(msg.reactions, currentUserId),
  };
}
