import type { BlockedUser } from "@/components/settings/BlockModal";

export async function blockUser(userId: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}/block`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Không thể chặn người dùng");
  }
}

export async function unblockUser(userId: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}/block`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Không thể bỏ chặn người dùng");
  }
}

export async function fetchBlockedUsers(): Promise<BlockedUser[]> {
  const res = await fetch("/api/users/blocked");
  if (!res.ok) throw new Error("Không thể tải danh sách chặn");
  return res.json();
}