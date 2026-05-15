import { MEMBERS_PER_PAGE } from "@/lib/community/data";
import type { Member } from "@/lib/community/data";

/** Trả về slice thành viên cho trang hiện tại */
export function paginateMembers(members: Member[], page: number): Member[] {
  return members.slice(page * MEMBERS_PER_PAGE, (page + 1) * MEMBERS_PER_PAGE);
}

/** Tổng số trang dựa trên danh sách thành viên */
export function getTotalPages(members: Member[]): number {
  return Math.ceil(members.length / MEMBERS_PER_PAGE);
}

/** Clamp page về đúng phạm vi [0, totalPages - 1] */
export function clampPage(page: number, totalPages: number): number {
  return Math.max(0, Math.min(totalPages - 1, page));
}

/** Toggle một id trong Set, trả về Set mới (immutable) */
export function toggleSetItem<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set);
  next.has(item) ? next.delete(item) : next.add(item);
  return next;
}

/** Xóa một item theo id khỏi mảng */
export function removeById<T extends { id: number }>(list: T[], id: number): T[] {
  return list.filter((item) => item.id !== id);
}

/** Label phân trang dạng "1–4 / 8" */
export function paginationLabel(page: number, total: number): string {
  const start = page * MEMBERS_PER_PAGE + 1;
  const end = Math.min((page + 1) * MEMBERS_PER_PAGE, total);
  return `${start}–${end} / ${total}`;
}