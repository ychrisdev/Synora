import type { ApiMessage, Message } from "./types";

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
  };
}
