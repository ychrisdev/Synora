export function formatLastSeen(iso: string | null): string | null {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "Vừa mới hoạt động";
  if (diff < 3_600_000) return `Hoạt động ${Math.floor(diff / 60_000)} phút trước`;
  if (diff < 86_400_000) return `Hoạt động ${Math.floor(diff / 3_600_000)} giờ trước`;
  return "Hoạt động khá lâu trước";
}