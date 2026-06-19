export const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
  XLSX: "bg-green-600",
  ZIP: "bg-gray-500",
};

export const MEDIA_IMAGE_TYPES = new Set([
  "JPG",
  "JPEG",
  "PNG",
  "GIF",
  "WEBP",
  "BMP",
  "SVG",
]);

export const MEDIA_VIDEO_TYPES = new Set(["MP4", "MOV", "AVI", "WEBM", "MKV"]);

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatCommentTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 5) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
}

export function getFileExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export function isImageFile(name: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name);
}

export function isVideoFile(name: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv)$/i.test(name);
}

export function isVideoItem(src: string, mediaType?: string): boolean {
  if (mediaType) return mediaType === "video";
  return /\.(mp4|mov|avi|webm|mkv)$/i.test(src);
}

export function notifyTagsChanged() {
  window.dispatchEvent(new Event("tags:changed"));
}
