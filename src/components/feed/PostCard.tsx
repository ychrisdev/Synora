"use client";

import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
  X,
  Send,
  Smile,
  Bookmark,
  Link as LinkIcon,
  ImageIcon,
  Video,
  EyeOff,
  Pencil,
  Trash2,
  Ban,
  Flag,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  FileText,
  Loader2,
} from "lucide-react";
import NextLink from "next/link";
import { clsx } from "clsx";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  isImageType,
  isVideoType,
  formatFileSize as composerFormatFileSize,
  getFileType,
  MediaPreview,
  FileChip,
  MediaLightboxPreview,
  ActionButton,
  type AttachedFile as ComposerAttachedFile,
} from "@/components/feed/PostComposer";
import Avatar from "@/components/ui/Avatar";
import { useUploadThing } from "@/lib/uploadthing";

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
  XLSX: "bg-green-600",
  ZIP: "bg-gray-500",
};

const MEDIA_IMAGE_TYPES = new Set([
  "JPG",
  "JPEG",
  "PNG",
  "GIF",
  "WEBP",
  "BMP",
  "SVG",
]);
const MEDIA_VIDEO_TYPES = new Set(["MP4", "MOV", "AVI", "WEBM", "MKV"]);

interface PostAuthor {
  name: string;
  initials: string;
  color: string;
  role: string;
  username?: string;
  avatarUrl?: string | null;
}

interface Post {
  id: number | string;
  authorId: string;
  author: PostAuthor;
  time: string;
  content: string;
  images?: string[];
  mediaTypes?: string[];
  mediaDocIds?: string[];
  tags: string[];
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
    docId?: string;
  };
  likes: number;
  isLikedByMe?: boolean;
  comments: number;
  editedAt?: string | null;
}

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  isImage: boolean;
  isVideo?: boolean;
  previewUrl?: string;
}

interface Comment {
  id: string;
  authorId: string;
  author: {
    name: string;
    initials: string;
    color: string;
    avatarUrl?: string | null;
    username?: string;
  };
  time: string;
  content: string;
  editedAt?: string | null;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
  showReplyInput: boolean;
  hidden?: boolean;
  hiddenByAuthor?: string | null;
}

interface Reply {
  id: string;
  authorId: string;
  author: {
    name: string;
    initials: string;
    color: string;
    avatarUrl?: string | null;
    username?: string;
  };
  time: string;
  content: string;
  replyTo?: string;
  likes: number;
  liked: boolean;
  hidden?: boolean;
}

interface ExistingMedia {
  id: string;
  url: string;
  type: string;
  name: string;
}

export function mapFilesToPostFields(
  files: Array<{
    file: File;
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  }>,
) {
  const images: string[] = [];
  const mediaTypes: string[] = [];
  let attachment: Post["attachment"] | undefined;

  for (const f of files) {
    if (MEDIA_IMAGE_TYPES.has(f.type) && f.previewUrl) {
      images.push(f.previewUrl);
      mediaTypes.push("image");
    } else if (MEDIA_VIDEO_TYPES.has(f.type) && f.previewUrl) {
      images.push(f.previewUrl);
      mediaTypes.push("video");
    } else {
      const url = f.previewUrl ?? URL.createObjectURL(f.file);
      attachment = { name: f.name, size: f.size, type: f.type, url };
    }
  }

  return {
    images: images.length ? images : undefined,
    mediaTypes: mediaTypes.length ? mediaTypes : undefined,
    attachment,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatCommentTime(date: Date): string {
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

function getFileExt(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function isImageFile(name: string): boolean {
  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name);
}

function isVideoFile(name: string): boolean {
  return /\.(mp4|mov|avi|webm|mkv)$/i.test(name);
}

function isVideoItem(src: string, mediaType?: string): boolean {
  if (mediaType) return mediaType === "video";
  return /\.(mp4|mov|avi|webm|mkv)$/i.test(src);
}

function RichContent({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className}>
      {text.split(/(#[\wÀ-ỹ]+)/gu).map((part, i) =>
        /^#[\wÀ-ỹ]+$/u.test(part) ? (
          <span
            key={i}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

function CommentFileBadge({
  name,
  size,
  type,
  url,
}: {
  name: string;
  size?: string;
  type?: string;
  url?: string;
}) {
  const ext = type ?? getFileExt(name);
  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-surface-50 rounded-lg border border-surface-200 max-w-[260px]">
      <div
        className={clsx(
          "w-8 h-8 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0",
          fileTypeColors[ext] ?? "bg-gray-500",
        )}
      >
        {ext.slice(0, 4)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary truncate">{name}</p>
        {size && <p className="text-[11px] text-text-secondary">{size}</p>}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-surface-200 text-text-secondary transition-colors shrink-0"
          title="Xem trước"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye size={14} />
        </a>
      ) : (
        <div
          className="p-1.5 text-text-secondary shrink-0"
          title="Không có URL tải"
        >
          <FileText size={14} />
        </div>
      )}
    </div>
  );
}

function CommentMediaThumb({
  url,
  type = "video",
  fileName,
}: {
  url: string;
  type?: "image" | "video";
  fileName?: string;
}) {
  const [open, setOpen] = useState(false);
  const isVideo = type === "video";
  return (
    <>
      <div
        className="mt-2 rounded-xl overflow-hidden bg-black relative cursor-pointer group max-h-52"
        onClick={() => setOpen(true)}
      >
        {isVideo ? (
          <video
            src={url}
            muted
            preload="metadata"
            className="w-full max-h-52 object-cover group-hover:brightness-75 transition"
          />
        ) : (
          <img
            src={url}
            alt={fileName ?? "ảnh"}
            className="w-full max-h-52 object-cover group-hover:brightness-90 transition"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center shadow-lg">
            {isVideo ? (
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            )}
          </div>
        </div>
        {fileName && (
          <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
            <p className="text-white text-[11px] truncate bg-black/50 px-2 py-0.5 rounded">
              {fileName}
            </p>
          </div>
        )}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10"
          >
            <X size={16} />
          </button>
          {isVideo ? (
            <video
              src={url}
              controls
              autoPlay
              className="max-w-[90vw] max-h-[85vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={url}
              alt={fileName ?? "ảnh"}
              className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}

function EditPostComposer({
  post,
  attachments,
  onSave,
  onClose,
}: {
  post: Post;
  attachments?: NonNullable<Post["attachment"]>[];
  onSave: (result: { content: string; updatedPost: any }) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState(post.content);
  const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>(
    (post.images ?? []).map((url, i) => ({
      id: post.mediaDocIds?.[i] ?? `existing-${i}`,
      url,
      type: post.mediaTypes?.[i] === "video" ? "VIDEO" : "IMAGE",
      name: url.split("/").pop() ?? `media-${i}`,
    })),
  );
  const [existingAttachments, setExistingAttachments] = useState<
    NonNullable<Post["attachment"]>[]
  >(attachments ?? (post.attachment ? [post.attachment] : []));
  const [newFiles, setNewFiles] = useState<ComposerAttachedFile[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [removedDocIds, setRemovedDocIds] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_IMG_MB = 8;
  const MAX_VID_MB = 64;
  const MAX_DOC_MB = 32;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageVideoInputRef = useRef<HTMLInputElement>(null);

  const { startUpload: startMediaUpload } = useUploadThing("postMedia");
  const { startUpload: startDocUpload } = useUploadThing("postDocument");

  const charLimit = 1000;
  const isOverLimit = content.length > charLimit;
  const canSave = content.trim().length > 0 && !isOverLimit && !saving;

  const newMediaFiles = newFiles.filter(
    (f) => isImageType(f.type) || isVideoType(f.type),
  );
  const newDocFiles = newFiles.filter(
    (f) => !isImageType(f.type) && !isVideoType(f.type),
  );

  const processFiles = (files: File[]): ComposerAttachedFile[] =>
    files.map((f) => {
      const type = getFileType(f);
      const canPreview = isImageType(type) || isVideoType(type);
      return {
        id: `${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: composerFormatFileSize(f.size),
        type,
        previewUrl: canPreview ? URL.createObjectURL(f) : undefined,
      };
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []).filter((f) => {
      const type = getFileType(f);
      return !isImageType(type) && !isVideoType(type);
    });
    for (const f of files) {
      const sizeMB = f.size / (1024 * 1024);
      if (sizeMB > MAX_DOC_MB) {
        setUploadError(`"${f.name}" vượt quá ${MAX_DOC_MB}MB`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }
    setNewFiles((prev) => [...prev, ...processFiles(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []).filter((f) => {
      const type = getFileType(f);
      return isImageType(type) || isVideoType(type);
    });
    for (const f of files) {
      const type = getFileType(f);
      const sizeMB = f.size / (1024 * 1024);
      if (isImageType(type) && sizeMB > MAX_IMG_MB) {
        setUploadError(`"${f.name}" vượt quá ${MAX_IMG_MB}MB`);
        if (imageVideoInputRef.current) imageVideoInputRef.current.value = "";
        return;
      }
      if (isVideoType(type) && sizeMB > MAX_VID_MB) {
        setUploadError(`"${f.name}" vượt quá ${MAX_VID_MB}MB`);
        if (imageVideoInputRef.current) imageVideoInputRef.current.value = "";
        return;
      }
    }
    setNewFiles((prev) => [...prev, ...processFiles(files)]);
    if (imageVideoInputRef.current) imageVideoInputRef.current.value = "";
  };

  const removeNewFile = (id: string) => {
    setLightboxIndex(null);
    setNewFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const removeExistingMedia = (id: string) => {
    setExistingMedia((prev) => prev.filter((m) => m.id !== id));
    if (!id.startsWith("existing-")) {
      setRemovedDocIds((prev) => [...prev, id]);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setUploadError(null);
    try {
      let uploadedMedia: any[] = [];
      let uploadedDocs: any[] = [];

      console.log("=== handleSave start ===");
      console.log(
        "newDocFiles:",
        newDocFiles.map((f) => ({ name: f.name, type: f.type })),
      );
      console.log(
        "newMediaFiles:",
        newMediaFiles.map((f) => ({ name: f.name, type: f.type })),
      );

      if (newMediaFiles.length > 0) {
        console.log("Uploading media...");
        const results = await startMediaUpload(
          newMediaFiles.map((f) => f.file),
        );
        console.log("Media upload results:", results);
        uploadedMedia = (results ?? []).map((r, i) => ({
          url: r.ufsUrl ?? r.url,
          key: r.key,
          name: newMediaFiles[i].name,
          type: newMediaFiles[i].type,
          size: newMediaFiles[i].file.size,
        }));
      }

      if (newDocFiles.length > 0) {
        console.log("Uploading docs...");
        try {
          const results = await startDocUpload(newDocFiles.map((f) => f.file));
          console.log("Doc upload results:", results);
          if (!results || results.length === 0) {
            throw new Error(
              "Upload tài liệu thất bại — UploadThing trả về rỗng",
            );
          }
          uploadedDocs = results.map((r, i) => ({
            url: r.ufsUrl ?? r.url,
            key: r.key,
            name: newDocFiles[i].name,
            type: newDocFiles[i].type,
            size: newDocFiles[i].file.size,
          }));
        } catch (uploadErr) {
          console.error("Doc upload error:", uploadErr);
          setUploadError(
            "Tải tài liệu thất bại. Định dạng file có thể không được hỗ trợ.",
          );
          setSaving(false);
          return;
        }
      }

      console.log("Sending PATCH with:", {
        uploadedMedia,
        uploadedDocs,
        removedDocIds,
      });

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          removedDocIds,
          uploadedMedia,
          uploadedDocs,
        }),
      });

      console.log("PATCH response status:", res.status);
      if (!res.ok) {
        const errText = await res.text();
        console.error("PATCH error body:", errText);
        throw new Error("Lưu thất bại");
      }
      const updatedPost = await res.json();
      onSave({ content: updatedPost.content, updatedPost });
    } catch (err) {
      console.error("handleSave error:", err);
      setUploadError("Lưu thất bại, thử lại nhé");
    } finally {
      setSaving(false);
    }
  };

  const allMediaForLightbox: ComposerAttachedFile[] = [
    ...existingMedia.map((m) => ({
      id: m.id,
      file: new File([], m.name),
      name: m.name,
      size: "",
      type: m.type,
      previewUrl: m.url,
    })),
    ...newMediaFiles,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 shrink-0">
          <h2 className="text-sm font-bold text-text-primary">
            Chỉnh sửa bài viết
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-text-secondary hover:bg-surface-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-5 pt-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
              placeholder="Nội dung bài viết..."
              className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted outline-none leading-relaxed min-h-[100px] max-h-[300px] bg-transparent"
              rows={4}
            />
            {content.length > charLimit * 0.8 && (
              <p
                className={`text-xs text-right mb-1 ${isOverLimit ? "text-red-500 font-semibold" : "text-text-muted"}`}
              >
                {content.length}/{charLimit}
              </p>
            )}
          </div>

          {(existingMedia.length > 0 || newMediaFiles.length > 0) && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {existingMedia.map((m, idx) => (
                <div
                  key={m.id}
                  className="relative group rounded-xl overflow-hidden border border-surface-200 bg-surface-50 shrink-0 cursor-pointer"
                  style={{ width: 96, height: 96 }}
                  onClick={() => setLightboxIndex(idx)}
                >
                  {m.type === "VIDEO" ? (
                    <video
                      src={m.url}
                      muted
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExistingMedia(m.id);
                    }}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={11} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded pointer-events-none">
                    Hiện có
                  </span>
                </div>
              ))}
              {newMediaFiles.map((f, idx) => (
                <MediaPreview
                  key={f.id}
                  attached={f}
                  onRemove={() => removeNewFile(f.id)}
                  onClick={() => setLightboxIndex(existingMedia.length + idx)}
                />
              ))}
            </div>
          )}

          {(existingAttachments.length > 0 || newDocFiles.length > 0) && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {existingAttachments.map((att) => (
                <div
                  key={att.docId ?? att.name}
                  className="flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm"
                >
                  <FileText size={16} className="text-red-400 shrink-0" />
                  <span className="flex-1 truncate text-text-primary font-medium text-xs max-w-[160px]">
                    {att.name}
                  </span>
                  <span className="text-text-muted text-xs shrink-0">
                    {att.size}
                  </span>
                  <button
                    onClick={() => {
                      if (att.docId)
                        setRemovedDocIds((prev) => [...prev, att.docId!]);
                      setExistingAttachments((prev) =>
                        prev.filter((a) => a.docId !== att.docId),
                      );
                    }}
                    className="text-text-muted hover:text-text-secondary transition-colors ml-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              {newDocFiles.map((f) => (
                <FileChip
                  key={f.id}
                  attached={f}
                  onRemove={() => removeNewFile(f.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-surface-100 shrink-0">
          {uploadError && (
            <p className="text-xs text-red-500 px-5 pt-3">{uploadError}</p>
          )}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
              />
              <input
                ref={imageVideoInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleImageVideoChange}
                accept="image/*,video/*"
              />
              <ActionButton
                icon={<Paperclip size={18} />}
                label="Đính kèm"
                onClick={() => fileInputRef.current?.click()}
              />
              <ActionButton
                icon={<ImageIcon size={18} />}
                label="Ảnh"
                onClick={() => {
                  if (imageVideoInputRef.current) {
                    imageVideoInputRef.current.accept = "image/*";
                    imageVideoInputRef.current.click();
                    setTimeout(() => {
                      if (imageVideoInputRef.current)
                        imageVideoInputRef.current.accept = "image/*,video/*";
                    }, 500);
                  }
                }}
              />
              <ActionButton
                icon={<Video size={18} />}
                label="Video"
                onClick={() => {
                  if (imageVideoInputRef.current) {
                    imageVideoInputRef.current.accept = "video/*";
                    imageVideoInputRef.current.click();
                    setTimeout(() => {
                      if (imageVideoInputRef.current)
                        imageVideoInputRef.current.accept = "image/*,video/*";
                    }, 500);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-text-secondary border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>Lưu</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && allMediaForLightbox.length > 0 && (
        <MediaLightboxPreview
          files={allMediaForLightbox}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

function PostMoreMenu({
  isOwner,
  authorName,
  onEdit,
  onDelete,
  onSave,
  onBlock,
  onReport,
}: {
  isOwner: boolean;
  authorName: string;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onBlock: () => void;
  onReport: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  type Item = {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick: () => void;
  } | null;

  const items: Item[] = [
    {
      icon: <Bookmark size={15} />,
      label: "Lưu bài viết",
      onClick: () => {
        onSave();
        setOpen(false);
      },
    },
    ...(isOwner
      ? [
          null,
          {
            icon: <Pencil size={15} />,
            label: "Chỉnh sửa bài viết",
            onClick: () => {
              onEdit();
              setOpen(false);
            },
          } as Item,
          {
            icon: <Trash2 size={15} />,
            label: "Xóa bài viết",
            danger: true,
            onClick: () => {
              onDelete();
              setOpen(false);
            },
          } as Item,
        ]
        : [
      null,
      {
        icon: <Ban size={15} />,
        label: `Chặn ${authorName.split(" ").pop()}`,
        onClick: () => { onBlock(); setOpen(false); },
      } as Item,
      {
        icon: <Flag size={15} />,
        label: "Báo cáo",
        danger: true,
        onClick: () => { onReport(); setOpen(false); },
      } as Item,
    ]),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-surface-100 text-text-secondary transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-surface-200 rounded-xl shadow-lg z-20 min-w-[190px] overflow-hidden py-1">
          {items.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-surface-100" />
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className={clsx(
                  "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-surface-50 transition-colors",
                  item.danger ? "text-red-500" : "text-text-primary",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function MediaThumb({
  src,
  mediaType,
  onClick,
  className,
  overlay,
}: {
  src: string;
  mediaType?: string;
  onClick: () => void;
  className?: string;
  overlay?: React.ReactNode;
}) {
  const isVideo = isVideoItem(src, mediaType);
  return (
    <div
      className={clsx(
        "relative overflow-hidden cursor-pointer group",
        className,
      )}
      onClick={onClick}
    >
      {isVideo ? (
        <video
          src={src}
          muted
          preload="metadata"
          className="w-full h-full object-cover group-hover:brightness-90 transition"
        />
      ) : (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover group-hover:brightness-95 transition"
        />
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {overlay}
    </div>
  );
}

function ImageGrid({
  images,
  mediaTypes,
  onImageClick,
}: {
  images: string[];
  mediaTypes?: string[];
  onImageClick: (index: number) => void;
}) {
  const extraCount = images.length - 3;
  if (images.length === 1)
    return (
      <div className="mb-3 rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[480px]">
        <MediaThumb
          src={images[0]}
          mediaType={mediaTypes?.[0]}
          onClick={() => onImageClick(0)}
          className="w-full max-h-[500px] object-contain"
        />
      </div>
    );
  if (images.length === 2)
    return (
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        {images.map((src, i) => (
          <MediaThumb
            key={i}
            src={src}
            mediaType={mediaTypes?.[i]}
            onClick={() => onImageClick(i)}
            className="w-full h-44"
          />
        ))}
      </div>
    );
  return (
    <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      <MediaThumb
        src={images[0]}
        mediaType={mediaTypes?.[0]}
        onClick={() => onImageClick(0)}
        className="w-full row-span-2 h-[244px]"
      />
      <MediaThumb
        src={images[1]}
        mediaType={mediaTypes?.[1]}
        onClick={() => onImageClick(1)}
        className="w-full h-[120px]"
      />
      <MediaThumb
        src={images[2]}
        mediaType={mediaTypes?.[2]}
        onClick={() => onImageClick(2)}
        className="w-full h-[120px]"
        overlay={
          extraCount > 0 ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl pointer-events-none">
              +{extraCount}
            </div>
          ) : undefined
        }
      />
    </div>
  );
}

const MAX_VIDEO_MB = 64;
const MAX_IMAGE_MB = 8;
const MAX_DOC_MB = 16;

function CommentInput({
  onSubmit,
}: {
  onSubmit: (payload: CommentPayload) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | undefined>(undefined);
  const { data: session } = useSession();
  const { startUpload: uploadMedia } = useUploadThing("commentMedia");
  const { startUpload: uploadDoc } = useUploadThing("commentDocument");

  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  const userName = session?.user?.name ?? "U";
  const userImage = session?.user?.image ?? null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = getFileExt(file.name);
    const isImg = isImageFile(file.name);
    const isVid = isVideoFile(file.name);
    const sizeMB = file.size / (1024 * 1024);
    setUploadError(null);
    if (isImg && sizeMB > MAX_IMAGE_MB) {
      setUploadError(`Ảnh tối đa ${MAX_IMAGE_MB}MB`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (isVid && sizeMB > MAX_VIDEO_MB) {
      setUploadError(`Video tối đa ${MAX_VIDEO_MB}MB`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (!isImg && !isVid && sizeMB > MAX_DOC_MB) {
      setUploadError(`Tài liệu tối đa ${MAX_DOC_MB}MB`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const size = formatFileSize(file.size);
    pendingFileRef.current = file;
    if (isImg || isVid) {
      const previewUrl = URL.createObjectURL(file);
      setAttachment({
        name: file.name,
        size,
        type: ext,
        previewUrl,
        isImage: isImg,
        isVideo: isVid,
      });
    } else {
      setAttachment({
        name: file.name,
        size,
        type: ext,
        isImage: false,
        isVideo: false,
      });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!text.trim() && !attachment) return;
    setUploading(true);
    setUploadError(null);
    try {
      const rawFile = pendingFileRef.current;
      let imageUrl: string | undefined,
        videoUrl: string | undefined,
        fileUrl: string | undefined;
      if (rawFile && attachment) {
        if (attachment.isImage) {
          const r = await uploadMedia([rawFile]);
          imageUrl = r?.[0]?.ufsUrl ?? r?.[0]?.url;
        } else if (attachment.isVideo) {
          const r = await uploadMedia([rawFile]);
          videoUrl = r?.[0]?.ufsUrl ?? r?.[0]?.url;
        } else {
          const r = await uploadDoc([rawFile]);
          fileUrl = r?.[0]?.ufsUrl ?? r?.[0]?.url;
        }
        pendingFileRef.current = undefined;
      }
      await onSubmit({
        content: text.trim(),
        imageUrl,
        videoUrl,
        fileUrl,
        fileName: attachment?.name,
        fileSize: attachment?.size,
        fileType: attachment?.type,
      });
      if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      setText("");
      setAttachment(null);
    } catch (err: any) {
      setUploadError(err.message ?? "Tải lên thất bại, thử lại nhé");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
    pendingFileRef.current = undefined;
    setUploadError(null);
  };
  const canSubmit = (!!text.trim() || !!attachment) && !uploading;

  return (
    <div className="flex gap-2.5">
      <Avatar
        src={userImage}
        name={userName}
        initials={initials}
        color="bg-primary"
        size="sm"
      />
      <div className="flex-1 min-w-0">
        {attachment && (
          <div className="relative mb-2 inline-block max-w-full">
            {attachment.isImage && attachment.previewUrl ? (
              <img
                src={attachment.previewUrl}
                alt="preview"
                className="h-20 rounded-xl object-cover border border-surface-200"
              />
            ) : attachment.isVideo && attachment.previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-surface-200 bg-black h-20 w-32">
                <video
                  src={attachment.previewUrl}
                  muted
                  preload="metadata"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-3.5 h-3.5 ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-100 rounded-xl border border-surface-200">
                <FileText size={16} className="text-text-secondary shrink-0" />
                <span className="text-xs text-text-primary max-w-[160px] truncate">
                  {attachment.name}
                </span>
                <span className="text-[11px] text-text-secondary">
                  {attachment.size}
                </span>
              </div>
            )}
            <button
              onClick={removeAttachment}
              className="absolute -top-1.5 -right-1.5 bg-text-primary text-white rounded-full p-0.5"
            >
              <X size={11} />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 bg-surface-50 border border-surface-200 rounded-2xl px-3 py-2 focus-within:border-primary focus-within:bg-white transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Viết bình luận..."
            rows={1}
            className="flex-1 resize-none text-sm text-text-primary placeholder:text-text-secondary outline-none bg-transparent leading-relaxed max-h-28"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <div className="flex items-center gap-1 shrink-0">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              className="hidden"
              onChange={handleFile}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="p-1 text-text-secondary hover:text-primary transition-colors disabled:opacity-40"
              title="Đính kèm tệp"
            >
              <Paperclip size={16} />
            </button>
            <button
              className="p-1 text-text-secondary hover:text-amber-500 transition-colors"
              title="Emoji"
            >
              <Smile size={16} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={clsx(
                "p-1.5 rounded-full transition-all",
                canSubmit
                  ? "text-white bg-primary hover:bg-primary-600 shadow-sm"
                  : "text-text-secondary cursor-not-allowed",
              )}
            >
              {uploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
            </button>
          </div>
        </div>
        {uploading && (
          <p className="text-[11px] text-text-secondary mt-1 ml-1">
            Đang tải lên...
          </p>
        )}
        {uploadError && (
          <p className="text-[11px] text-red-500 mt-1 ml-1">{uploadError}</p>
        )}
      </div>
    </div>
  );
}

function ReplyInput({
  replyTo,
  isSelf,
  onSubmit,
  onCancel,
}: {
  replyTo: string;
  isSelf: boolean;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const mention = useRef(isSelf ? "" : `@${replyTo} `).current;
  const [text, setText] = useState(mention);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  const userName = session?.user?.name ?? "U";
  const userImage = session?.user?.image ?? null;
  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(mention.length, mention.length);
    }
  }, [mention]);
  const hasContent = text.startsWith(mention)
    ? text.slice(mention.length).trim().length > 0
    : text.trim().length > 0;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.startsWith(mention)) setText(mention);
    else setText(e.target.value);
  };
  return (
    <div className="flex items-center gap-2 ml-10 mt-2">
      <Avatar
        src={userImage}
        name={userName}
        initials={initials}
        color="bg-primary"
        size="sm"
      />
      <div className="flex-1 flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-full px-3 py-1.5 focus-within:border-primary transition-colors">
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && hasContent) {
              e.preventDefault();
              onSubmit(text.trim());
            }
            if (e.key === "Escape") onCancel();
          }}
          placeholder={`Trả lời ${replyTo}...`}
          className="flex-1 text-xs bg-transparent outline-none text-text-primary placeholder:text-text-secondary"
        />
        <button
          onClick={() => hasContent && onSubmit(text.trim())}
          disabled={!hasContent}
          className={clsx(
            "w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0",
            hasContent
              ? "bg-primary text-white"
              : "bg-surface-200 text-text-secondary cursor-not-allowed",
          )}
        >
          <Send size={11} />
        </button>
      </div>
    </div>
  );
}

type CommentRole = "own" | "hidden-own" | "post-author" | "viewer";
type CommentSort = "default" | "newest" | "oldest";

function CommentBubbleMenu({
  role,
  authorName,
  isHidden,
  onEdit,
  onDelete,
  onHide,
  onBlock,
  onReport,
}: {
  role: CommentRole;
  authorName: string;
  isHidden?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  type MenuItem = {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick: () => void;
  } | null;
  const items: MenuItem[] =
    role === "own"
      ? [
          {
            icon: <Pencil size={14} />,
            label: "Chỉnh sửa",
            onClick: () => {
              onEdit?.();
              setOpen(false);
            },
          },
          {
            icon: <Trash2 size={14} />,
            label: "Xóa bình luận",
            danger: true,
            onClick: () => {
              onDelete?.();
              setOpen(false);
            },
          },
        ]
      : role === "hidden-own"
        ? [
            {
              icon: <Trash2 size={14} />,
              label: "Xóa bình luận",
              danger: true,
              onClick: () => {
                onDelete?.();
                setOpen(false);
              },
            },
          ]
        : role === "post-author"
          ? [
              {
                icon: <Trash2 size={14} />,
                label: "Xóa bình luận",
                danger: true,
                onClick: () => {
                  onDelete?.();
                  setOpen(false);
                },
              },
              {
                icon: isHidden ? <Eye size={14} /> : <EyeOff size={14} />,
                label: isHidden ? "Hiện bình luận" : "Ẩn bình luận",
                onClick: () => {
                  onHide?.();
                  setOpen(false);
                },
              },
              null,
              {
                icon: <Ban size={14} />,
                label: `Chặn ${authorName.split(" ").pop()}`,
                onClick: () => {
                  onBlock?.();
                  setOpen(false);
                },
              },
              {
                icon: <Flag size={14} />,
                label: "Báo cáo",
                danger: true,
                onClick: () => {
                  onReport?.();
                  setOpen(false);
                },
              },
            ]
          : [
              {
                icon: <Ban size={14} />,
                label: `Chặn ${authorName}`,
                onClick: () => {
                  onBlock?.();
                  setOpen(false);
                },
              },
              {
                icon: <Flag size={14} />,
                label: "Báo cáo",
                danger: true,
                onClick: () => {
                  onReport?.();
                  setOpen(false);
                },
              },
            ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-text-primary hover:bg-surface-200 hover:text-text-secondary transition-colors"
      >
        <MoreHorizontal size={13} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 bg-white border border-surface-200 rounded-xl shadow-lg z-30 min-w-[180px] overflow-hidden py-1">
          {items.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-surface-100" />
            ) : (
              <button
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  item.onClick();
                }}
                className={clsx(
                  "w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-surface-50 transition-colors",
                  item.danger ? "text-red-500" : "text-text-primary",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function BlockConfirmDialog({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Ban size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Chặn {name}?
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Bạn sẽ không thấy bài viết, bình luận hoặc tin nhắn từ người này
              nữa.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-surface-200 text-sm text-text-secondary hover:bg-surface-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-500 text-sm text-white font-medium hover:bg-red-600 transition-colors"
          >
            Chặn
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Xóa bình luận?
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Bình luận sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-surface-200 text-sm text-text-secondary hover:bg-surface-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-500 text-sm text-white font-medium hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCommentInput({
  initialText,
  onSave,
  onCancel,
}: {
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);
  const canSave = text.trim().length > 0 && text.trim() !== initialText.trim();
  return (
    <div className="mt-1">
      <div className="flex items-end gap-2 bg-white border border-primary rounded-2xl px-3 py-2 transition-all">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          autoFocus
          className="flex-1 resize-none text-sm text-text-primary outline-none bg-transparent leading-relaxed max-h-28"
          style={{ height: "auto" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canSave) {
              e.preventDefault();
              onSave(text.trim());
            }
            if (e.key === "Escape") onCancel();
          }}
        />
      </div>
      <div className="flex gap-1.5 mt-1.5 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-xs text-text-secondary rounded-lg hover:bg-surface-100 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={() => canSave && onSave(text.trim())}
          disabled={!canSave}
          className={clsx(
            "px-3 py-1 text-xs rounded-lg font-medium transition-colors",
            canSave
              ? "bg-primary text-white hover:bg-primary-600"
              : "bg-surface-100 text-text-secondary cursor-not-allowed",
          )}
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

function CommentList({
  comments,
  replyingToId,
  replyingToName,
  currentUserName,
  currentUserId,
  postAuthorId,
  onLike,
  onToggleReply,
  onSubmitReply,
  onCancelReply,
  onLikeReply,
  onDeleteComment,
  onDeleteReply,
  onHideComment,
  onCountChange,
  onEditComment,
}: {
  postAuthorId: string;
  comments: Comment[];
  replyingToId: string | null;
  replyingToName: string | null;
  currentUserName: string;
  currentUserId: string;
  onLike: (id: string) => void;
  onToggleReply: (id: string, name: string) => void;
  onSubmitReply: (commentId: string, text: string, replyTo: string) => void;
  onCancelReply: () => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onDeleteComment: (id: string) => Promise<number>;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onHideComment: (id: string) => void;
  onCountChange?: (delta: number) => void;
  onEditComment: (id: string, text: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<"comment" | "reply" | null>(
    null,
  );
  const [deletingParentId, setDeletingParentId] = useState<string | null>(null);
  const [blockingName, setBlockingName] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set(),
  );
  const REPLIES_PREVIEW = 2;

  return (
    <>
      {comments.length === 0 && (
        <p className="text-center text-sm text-text-secondary py-4">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      )}
      {comments
        .filter(
          (c) =>
            !c.hidden ||
            currentUserId === postAuthorId ||
            currentUserId === c.authorId,
        )
        .map((c) => (
          <div key={c.id}>
            {c.hidden && currentUserId === postAuthorId && (
              <div className="flex items-center gap-1 mb-1 ml-1">
                <EyeOff size={11} className="text-text-muted" />
                <span className="text-[10px] text-text-muted italic">
                  Bình luận đã bị ẩn
                </span>
              </div>
            )}
            {c.hidden &&
              currentUserId === c.authorId &&
              currentUserId !== postAuthorId && (
                <div className="flex items-center gap-1 mb-1 ml-1">
                  <EyeOff size={11} className="text-text-muted" />
                  <span className="text-[10px] text-text-muted italic">
                    Bình luận của bạn đã bị ẩn
                  </span>
                </div>
              )}
            <div className="flex gap-2.5 items-start group/comment">
              <NextLink
                href={c.author.username ? `/profile/${c.author.username}` : "#"}
              >
                <Avatar
                  src={c.author.avatarUrl}
                  name={c.author.name}
                  initials={c.author.initials}
                  color={c.author.color}
                  size="sm"
                />
              </NextLink>
              <div className="min-w-0 max-w-[85%]">
                <div className="relative">
                  <div
                    className={clsx(
                      "bg-surface-100 rounded-2xl rounded-tl-sm px-3 py-2.5",
                      c.hidden && "opacity-50",
                    )}
                  >
                    <span className="text-xs font-semibold text-text-primary">
                      {c.author.name}
                    </span>
                    <span className="text-[10px] text-text-secondary ml-1.5">
                      {c.time}
                    </span>
                    {c.editedAt && (
                      <span className="text-[10px] text-text-secondary ml-1">
                        · đã chỉnh sửa
                      </span>
                    )}
                    <p className="text-sm text-text-primary leading-relaxed mt-0.5">
                      {c.content}
                    </p>
                    {c.imageUrl && (
                      <CommentMediaThumb
                        url={c.imageUrl}
                        type="image"
                        fileName={c.fileName}
                      />
                    )}
                    {c.videoUrl && (
                      <CommentMediaThumb
                        url={c.videoUrl}
                        type="video"
                        fileName={c.fileName}
                      />
                    )}
                    {c.fileName &&
                      !c.imageUrl &&
                      !c.videoUrl &&
                      (() => {
                        const ext = (c.fileType ?? "").toUpperCase();
                        const isVid = [
                          "MP4",
                          "MOV",
                          "AVI",
                          "WEBM",
                          "MKV",
                        ].includes(ext);
                        const isImg = [
                          "JPG",
                          "JPEG",
                          "PNG",
                          "GIF",
                          "WEBP",
                          "BMP",
                          "SVG",
                        ].includes(ext);
                        if (isVid && c.fileUrl)
                          return (
                            <CommentMediaThumb
                              url={c.fileUrl}
                              type="video"
                              fileName={c.fileName}
                            />
                          );
                        if (isImg && c.fileUrl)
                          return (
                            <CommentMediaThumb
                              url={c.fileUrl}
                              type="image"
                              fileName={c.fileName}
                            />
                          );
                        return (
                          <CommentFileBadge
                            name={c.fileName}
                            size={c.fileSize}
                            type={c.fileType}
                            url={c.fileUrl}
                          />
                        );
                      })()}
                  </div>
                  <div className="absolute -right-8 top-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                    <CommentBubbleMenu
                      role={
                        currentUserId === c.authorId
                          ? c.hidden
                            ? "hidden-own"
                            : "own"
                          : currentUserId === postAuthorId
                            ? "post-author"
                            : "viewer"
                      }
                      authorName={c.author.name}
                      onEdit={() => setEditingId(c.id)}
                      onDelete={() => {
                        setDeletingId(c.id);
                        setDeletingType("comment");
                        setDeletingParentId(null);
                      }}
                      isHidden={c.hidden}
                      onHide={() => onHideComment(c.id)}
                      onBlock={() => setBlockingName(c.author.name)}
                      onReport={() => {}}
                    />
                  </div>
                </div>
                {editingId === c.id && (
                  <div>
                    {(c.imageUrl || c.videoUrl || c.fileName) && (
                      <div className="mt-1 mb-1 opacity-60 pointer-events-none">
                        {c.imageUrl && (
                          <CommentMediaThumb
                            url={c.imageUrl}
                            type="image"
                            fileName={c.fileName}
                          />
                        )}
                        {c.videoUrl && (
                          <CommentMediaThumb
                            url={c.videoUrl}
                            type="video"
                            fileName={c.fileName}
                          />
                        )}
                        {c.fileName && !c.imageUrl && !c.videoUrl && (
                          <CommentFileBadge
                            name={c.fileName}
                            size={c.fileSize}
                            type={c.fileType}
                            url={c.fileUrl}
                          />
                        )}
                      </div>
                    )}
                    <EditCommentInput
                      initialText={c.content}
                      onSave={(text) => {
                        onEditComment(c.id, text);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                )}
                {editingId !== c.id &&
                  !(
                    c.hidden &&
                    currentUserId === c.authorId &&
                    currentUserId !== postAuthorId
                  ) && (
                    <div
                      className={clsx(
                        "flex items-center gap-1 mt-1 ml-1",
                        c.hidden && "opacity-50",
                      )}
                    >
                      <button
                        onClick={() => onLike(c.id)}
                        className={clsx(
                          "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors",
                          c.liked
                            ? "text-primary"
                            : "text-text-secondary hover:text-text-secondary",
                        )}
                      >
                        <ThumbsUp size={11} />
                        <span>{c.likes > 0 ? c.likes : "Thích"}</span>
                      </button>
                      <button
                        onClick={() => onToggleReply(c.id, c.author.name)}
                        className="text-[11px] font-medium text-text-secondary hover:text-text-secondary px-2 py-0.5 rounded transition-colors"
                      >
                        Trả lời
                      </button>
                    </div>
                  )}
              </div>
            </div>
            {c.replies.length > 0 &&
              (!c.hidden || currentUserId === postAuthorId) && (
                <div className="ml-10 mt-2 flex flex-col gap-2">
                  {(expandedReplies.has(c.id)
                    ? c.replies
                    : c.replies.slice(0, REPLIES_PREVIEW)
                  ).map((r) => (
                    <div
                      key={r.id}
                      className="flex gap-2 items-start group/reply"
                    >
                      <NextLink
                        href={
                          r.author.username
                            ? `/profile/${r.author.username}`
                            : "#"
                        }
                      >
                        <Avatar
                          src={r.author.avatarUrl}
                          name={r.author.name}
                          initials={r.author.initials}
                          color={r.author.color}
                        />
                      </NextLink>
                      <div className="min-w-0 max-w-[85%]">
                        <div className="relative">
                          <div
                            className={clsx(
                              "bg-surface-50 rounded-2xl rounded-tl-sm px-3 py-2",
                              r.hidden && "opacity-50",
                            )}
                          >
                            <span className="text-xs font-semibold text-text-primary">
                              {r.author.name}
                            </span>
                            <span className="text-[10px] text-text-secondary ml-1.5">
                              {r.time}
                            </span>
                            <p className="text-sm text-text-primary leading-relaxed mt-0.5">
                              {r.replyTo && (
                                <span className="text-primary font-medium">
                                  @{r.replyTo}{" "}
                                </span>
                              )}
                              {r.content}
                            </p>
                          </div>
                          <div className="absolute -right-8 top-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                            <CommentBubbleMenu
                              role={
                                currentUserId === r.authorId
                                  ? "own"
                                  : currentUserId === postAuthorId
                                    ? "post-author"
                                    : "viewer"
                              }
                              authorName={r.author.name}
                              onEdit={() => {}}
                              onDelete={() => {
                                setDeletingId(r.id);
                                setDeletingType("reply");
                                setDeletingParentId(c.id);
                              }}
                              isHidden={c.hidden}
                              onHide={() => {}}
                              onBlock={() => setBlockingName(r.author.name)}
                              onReport={() => {}}
                            />
                          </div>
                        </div>
                        <div
                          className={clsx(
                            "flex items-center gap-1 mt-1 ml-1",
                            r.hidden && "opacity-50",
                          )}
                        >
                          <button
                            onClick={() => onLikeReply(c.id, r.id)}
                            className={clsx(
                              "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors",
                              r.liked
                                ? "text-primary"
                                : "text-text-secondary hover:text-text-secondary",
                            )}
                          >
                            <ThumbsUp size={11} />
                            <span>{r.likes > 0 ? r.likes : "Thích"}</span>
                          </button>
                          <button
                            onClick={() => onToggleReply(c.id, r.author.name)}
                            className="text-[11px] font-medium text-text-secondary hover:text-text-secondary px-2 py-0.5 rounded transition-colors"
                          >
                            Trả lời
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!expandedReplies.has(c.id) &&
                    c.replies.length > REPLIES_PREVIEW && (
                      <button
                        onClick={() =>
                          setExpandedReplies((prev) => {
                            const next = new Set(prev);
                            next.add(c.id);
                            return next;
                          })
                        }
                        className="text-[11px] font-medium text-primary hover:underline text-left mt-0.5"
                      >
                        Xem thêm {c.replies.length - REPLIES_PREVIEW} câu trả
                        lời
                      </button>
                    )}
                  {expandedReplies.has(c.id) &&
                    c.replies.length > REPLIES_PREVIEW && (
                      <button
                        onClick={() =>
                          setExpandedReplies((prev) => {
                            const next = new Set(prev);
                            next.delete(c.id);
                            return next;
                          })
                        }
                        className="text-[11px] font-medium text-text-secondary hover:underline text-left mt-0.5"
                      >
                        Thu gọn
                      </button>
                    )}
                </div>
              )}
            {replyingToId === c.id && (
              <ReplyInput
                key={replyingToName ?? c.author.name}
                replyTo={replyingToName ?? c.author.name}
                isSelf={currentUserName === (replyingToName ?? c.author.name)}
                onSubmit={(text) =>
                  onSubmitReply(c.id, text, replyingToName ?? c.author.name)
                }
                onCancel={onCancelReply}
              />
            )}
          </div>
        ))}
      {deletingId && (
        <DeleteConfirmDialog
          onConfirm={async () => {
            if (deletingType === "reply" && deletingParentId) {
              onDeleteReply(deletingParentId, deletingId);
              onCountChange?.(-1);
            } else {
              const totalDeleted = await onDeleteComment(deletingId);
              onCountChange?.(-(totalDeleted ?? 1));
            }
            setDeletingId(null);
            setDeletingType(null);
            setDeletingParentId(null);
          }}
          onCancel={() => {
            setDeletingId(null);
            setDeletingType(null);
            setDeletingParentId(null);
          }}
        />
      )}
      {blockingName && (
        <BlockConfirmDialog
          name={blockingName}
          onConfirm={() => setBlockingName(null)}
          onCancel={() => setBlockingName(null)}
        />
      )}
    </>
  );
}

type CommentPayload = {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
};

function useComments(postId: number | string, sort: CommentSort = "default") {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const mapComment = useCallback((c: any): Comment => {
    const parseMention = (content: string) => {
      const m = content.match(/^@\[(.+?)\] ([\s\S]+)$/);
      return m ? { replyTo: m[1], text: m[2] } : { text: content };
    };
    return {
      id: c.id,
      authorId: c.authorId,
      author: {
        name: c.author.profile?.displayName ?? c.author.username ?? "User",
        initials: (c.author.profile?.displayName ?? c.author.username ?? "U")
          .split(" ")
          .map((w: string) => w[0])
          .slice(-2)
          .join("")
          .toUpperCase(),
        color: "bg-primary",
        avatarUrl: c.author.profile?.avatarUrl ?? null,
        username: c.author.username ?? null,
      },
      time: formatCommentTime(new Date(c.createdAt)),
      content: c.content,
      imageUrl: c.imageUrl ?? undefined,
      videoUrl: c.videoUrl ?? undefined,
      fileUrl: c.fileUrl ?? undefined,
      fileName: c.fileName ?? undefined,
      fileSize: c.fileSize ?? undefined,
      fileType: c.fileType ?? undefined,
      likes: c._count?.likes ?? 0,
      liked: Array.isArray(c.likes) && c.likes.length > 0,
      replies: (c.replies ?? []).map((r: any) => {
        const { replyTo, text } = parseMention(r.content);
        return {
          id: r.id,
          authorId: r.authorId,
          author: {
            name: r.author.profile?.displayName ?? r.author.username ?? "User",
            initials: (
              r.author.profile?.displayName ??
              r.author.username ??
              "U"
            )
              .split(" ")
              .map((w: string) => w[0])
              .slice(-2)
              .join("")
              .toUpperCase(),
            color: "bg-primary",
            avatarUrl: r.author.profile?.avatarUrl ?? null,
            username: r.author.username ?? null,
          },
          time: formatCommentTime(new Date(r.createdAt)),
          content: text,
          replyTo,
          likes: r._count?.likes ?? 0,
          liked: Array.isArray(r.likes) && r.likes.length > 0,
          hidden: r.hidden ?? false,
        };
      }),
      editedAt: c.editedAt ?? null,
      hidden: c.hidden ?? false,
      hiddenByAuthor: c.hiddenByAuthor ?? null,
      showReplyInput: false,
    };
  }, []);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data.map(mapComment));
      });
  }, [postId, mapComment]);

  const handleCommentLike = useCallback(
    async (id: string) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                liked: !c.liked,
                likes: c.liked ? c.likes - 1 : c.likes + 1,
              }
            : c,
        ),
      );
      const res = await fetch(`/api/posts/${postId}/comments/${id}/like`, {
        method: "POST",
      });
      if (!res.ok)
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  liked: !c.liked,
                  likes: c.liked ? c.likes - 1 : c.likes + 1,
                }
              : c,
          ),
        );
    },
    [postId],
  );

  const handleReplyLike = useCallback(
    async (commentId: string, replyId: string) => {
      const toggle = (prev: Comment[]) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === replyId
                    ? {
                        ...r,
                        liked: !r.liked,
                        likes: r.liked ? r.likes - 1 : r.likes + 1,
                      }
                    : r,
                ),
              }
            : c,
        );
      setComments(toggle);
      const res = await fetch(`/api/posts/${postId}/comments/${replyId}/like`, {
        method: "POST",
      });
      if (!res.ok) setComments(toggle);
    },
    [postId],
  );

  const toggleReplyInput = useCallback((id: string, name: string) => {
    setReplyingTo((prev) =>
      prev?.id === id && prev?.name === name ? null : { id, name },
    );
  }, []);

  const submitReply = useCallback(
    async (commentId: string, text: string, replyToName: string) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, parentId: commentId }),
      });
      if (!res.ok) return;
      const saved = await res.json();
      const currentName = session?.user?.name ?? "User";
      const isSelf = currentName === replyToName;
      const mentionPrefix = `@${replyToName} `;
      const displayContent = text.startsWith(mentionPrefix)
        ? text.slice(mentionPrefix.length)
        : text;
      const reply: Reply = {
        id: saved.id,
        authorId: session?.user?.id ?? "",
        author: {
          name: currentName,
          initials: currentName
            .split(" ")
            .map((w: string) => w[0])
            .slice(-2)
            .join("")
            .toUpperCase(),
          color: "bg-primary",
          avatarUrl: session?.user?.image ?? null,
        },
        time: "Vừa xong",
        content: displayContent,
        replyTo: isSelf ? undefined : replyToName,
        likes: 0,
        liked: false,
      };
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c,
        ),
      );
      setReplyingTo(null);
    },
    [postId, session],
  );

  const submitComment = useCallback(
    async (payload: CommentPayload) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: payload.content,
          imageUrl: payload.imageUrl ?? null,
          videoUrl: payload.videoUrl ?? null,
          fileUrl: payload.fileUrl ?? null,
          fileName: payload.fileName ?? null,
          fileSize: payload.fileSize ?? null,
          fileType: payload.fileType ?? null,
        }),
      });
      if (!res.ok) return;
      const saved = await res.json();
      const currentName = session?.user?.name ?? "User";
      setComments((prev) => [
        ...prev,
        {
          id: saved.id,
          authorId: session?.user?.id ?? "",
          author: {
            name:
              saved.author.profile?.displayName ??
              saved.author.username ??
              currentName,
            initials: currentName
              .split(" ")
              .map((w: string) => w[0])
              .slice(-2)
              .join("")
              .toUpperCase(),
            color: "bg-primary",
            avatarUrl: session?.user?.image ?? null,
          },
          time: "Vừa xong",
          content: payload.content,
          imageUrl: payload.imageUrl,
          videoUrl: payload.videoUrl,
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          fileSize: payload.fileSize,
          fileType: payload.fileType,
          likes: 0,
          liked: false,
          replies: [],
          showReplyInput: false,
        },
      ]);
    },
    [postId, session],
  );

  const deleteComment = useCallback(
    async (id: string) => {
      setComments((prev) => prev.filter((c) => c.id !== id));
      const res = await fetch(`/api/posts/${postId}/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        return (data.replyCount ?? 0) + 1;
      }
      return 1;
    },
    [postId],
  );

  const hideComment = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/posts/${postId}/comments/${id}/hide`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                hidden: data.hidden,
                replies: c.replies.map((r) => ({ ...r, hidden: data.hidden })),
              }
            : c,
        ),
      );
    },
    [postId],
  );

  const editComment = useCallback(
    async (id: string, content: string) => {
      const now = new Date().toISOString();
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content, editedAt: now } : c)),
      );
      await fetch(`/api/posts/${postId}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    },
    [postId],
  );

  const deleteReply = useCallback(
    async (commentId: string, replyId: string) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
            : c,
        ),
      );
      await fetch(`/api/posts/${postId}/comments/${replyId}`, {
        method: "DELETE",
      });
    },
    [postId],
  );

  const sortedComments = useMemo(() => {
    if (sort === "newest") return [...comments].reverse();
    return comments;
  }, [comments, sort]);
  const getVisibleCount = useCallback(
    () =>
      comments
        .filter((c) => !c.hidden)
        .reduce(
          (acc, c) => acc + 1 + c.replies.filter((r) => !r.hidden).length,
          0,
        ),
    [comments],
  );

  return {
    comments,
    sortedComments,
    getVisibleCount,
    replyingToId: replyingTo?.id ?? null,
    replyingToName: replyingTo?.name ?? null,
    handleCommentLike,
    handleReplyLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    deleteComment,
    deleteReply,
    editComment,
    hideComment,
    cancelReply: () => setReplyingTo(null),
  };
}

type ModalState =
  | { type: "none" }
  | { type: "comment" }
  | { type: "lightbox"; index: number };

function getViewUrl(url: string, type: string): string {
  const docTypes = [
    "PDF",
    "DOC",
    "DOCX",
    "PPT",
    "PPTX",
    "XLS",
    "XLSX",
    "OTHER",
  ];
  if (docTypes.includes(type.toUpperCase())) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`;
  }
  return url;
}

function AttachmentRow({
  attachment,
  className,
}: {
  attachment: NonNullable<Post["attachment"]>;
  className?: string;
}) {
  const isMedia =
    MEDIA_IMAGE_TYPES.has(attachment.type) ||
    MEDIA_VIDEO_TYPES.has(attachment.type);
  if (isMedia) return null;
  return (
    <div
      className={clsx(
        "flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0",
            fileTypeColors[attachment.type] ?? "bg-gray-500",
          )}
        >
          {attachment.type}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {attachment.name}
          </p>
          <p className="text-xs text-text-secondary">{attachment.size}</p>
        </div>
      </div>
      <a
        href={
          attachment.url ? getViewUrl(attachment.url, attachment.type) : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!attachment.url) e.preventDefault();
        }}
        className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary transition-colors"
        title="Xem trước"
      >
        <Eye size={16} />
      </a>
    </div>
  );
}

function MediaLightbox({
  images,
  mediaTypes,
  initialIndex,
  post,
  liked,
  likeCount,
  onClose,
  onLike,
  onCountChange,
  onSyncCount,
  menuSlot,
}: {
  images: string[];
  mediaTypes?: string[];
  initialIndex: number;
  post: Post;
  liked: boolean;
  likeCount: number;
  onClose: () => void;
  onLike: () => void;
  onCountChange?: (delta: number) => void;
  onSyncCount?: (count: number) => void;
  menuSlot?: React.ReactNode;
}) {
  const [index, setIndex] = useState(initialIndex);
  const { data: session, status } = useSession();
  const [sort, setSort] = useState<CommentSort>("default");
  const {
    comments,
    sortedComments,
    getVisibleCount,
    replyingToId,
    replyingToName,
    handleCommentLike,
    handleReplyLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
    deleteComment,
    deleteReply,
    editComment,
    hideComment,
  } = useComments(post.id, sort);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    onSyncCount?.(getVisibleCount());
  }, [comments, getVisibleCount, onSyncCount]);
  const currentSrc = images[index];
  const isVideo = isVideoItem(currentSrc, mediaTypes?.[index]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex" onClick={onClose}>
      <div
        className="flex-1 flex items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10"
        >
          <X size={16} />
        </button>
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {isVideo ? (
          <video
            key={currentSrc}
            src={currentSrc}
            controls
            autoPlay
            className="max-w-full max-h-screen object-contain px-16"
          />
        ) : (
          <img
            src={currentSrc}
            alt=""
            className="max-w-full max-h-screen object-contain px-16"
          />
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === index ? "bg-white scale-125" : "bg-white/40",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div
        className="w-[380px] shrink-0 bg-white flex flex-col"
        style={{ height: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100 shrink-0">
          <NextLink
            href={
              post.author.username ? `/profile/${post.author.username}` : "#"
            }
            className="shrink-0"
          >
            <Avatar
              src={post.author.avatarUrl}
              name={post.author.name}
              initials={post.author.initials}
              color={post.author.color}
              size="md"
            />
          </NextLink>
          <div className="flex-1">
            <NextLink
              href={
                post.author.username ? `/profile/${post.author.username}` : "#"
              }
            >
              <p className="text-sm font-semibold text-text-primary hover:underline">
                {post.author.name}
              </p>
            </NextLink>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-secondary">{post.time}</span>
            </div>
          </div>
          {menuSlot}
        </div>
        <div className="px-4 pt-3 pb-2 shrink-0">
          <RichContent
            text={post.content}
            className="text-sm text-text-primary leading-relaxed"
          />
          {post.attachment && (
            <AttachmentRow attachment={post.attachment} className="mt-2" />
          )}
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 border-y border-surface-100 shrink-0">
          <button
            onClick={onLike}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
              liked
                ? "text-primary font-semibold"
                : "text-text-secondary hover:bg-surface-100",
            )}
          >
            <ThumbsUp
              size={15}
              className={clsx(
                "transition-transform duration-150",
                liked ? "fill-primary scale-110" : "",
              )}
            />
            <span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors">
            <MessageCircle size={15} />
            <span>
              {comments
                .filter((c) => !c.hidden)
                .reduce(
                  (acc, c) =>
                    acc + 1 + c.replies.filter((r) => !r.hidden).length,
                  0,
                )}
            </span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors ml-auto">
            <Share2 size={15} />
            <span>Chia sẻ</span>
          </button>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 shrink-0">
          {(["default", "newest", "oldest"] as CommentSort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                sort === s
                  ? "bg-primary text-white"
                  : "bg-surface-100 text-text-secondary hover:bg-surface-200",
              )}
            >
              {s === "default"
                ? "Tất cả"
                : s === "newest"
                  ? "Mới nhất"
                  : "Cũ nhất"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 pr-12 py-3 flex flex-col gap-3">
          <CommentList
            comments={sortedComments}
            replyingToId={replyingToId}
            replyingToName={replyingToName}
            currentUserName={session?.user?.name ?? ""}
            onLike={handleCommentLike}
            onToggleReply={toggleReplyInput}
            onSubmitReply={submitReply}
            onCancelReply={cancelReply}
            onLikeReply={handleReplyLike}
            postAuthorId={post.authorId}
            currentUserId={
              status === "authenticated" ? (session?.user?.id ?? "") : ""
            }
            onDeleteComment={deleteComment}
            onDeleteReply={deleteReply}
            onEditComment={editComment}
            onHideComment={hideComment}
            onCountChange={onCountChange}
          />
        </div>
        <div className="border-t border-surface-100 px-4 py-3 shrink-0">
          <CommentInput
            onSubmit={async (payload) => {
              await submitComment(payload);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CommentModal({
  post,
  liked,
  likeCount,
  onLike,
  onClose,
  onCountChange,
  onSyncCount,
  menuSlot,
}: {
  post: Post;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onClose: () => void;
  onCountChange?: (delta: number) => void;
  onSyncCount?: (count: number) => void;
  menuSlot?: React.ReactNode;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sort, setSort] = useState<CommentSort>("default");
  const { data: session, status } = useSession();
  const {
    comments,
    sortedComments,
    getVisibleCount,
    replyingToId,
    replyingToName,
    handleCommentLike,
    handleReplyLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
    deleteComment,
    deleteReply,
    editComment,
    hideComment,
  } = useComments(post.id, sort);
  useEffect(() => {
    onSyncCount?.(getVisibleCount());
  }, [comments, getVisibleCount, onSyncCount]);
  const handleSubmitComment = useCallback(
    async (payload: CommentPayload) => {
      await submitComment(payload);
    },
    [submitComment],
  );
  const handleSubmitReply = useCallback(
    async (commentId: string, text: string, replyTo: string) => {
      await submitReply(commentId, text, replyTo);
    },
    [submitReply],
  );
  if (lightboxIndex !== null && post.images) {
    return (
      <MediaLightbox
        images={post.images}
        mediaTypes={post.mediaTypes}
        initialIndex={lightboxIndex}
        post={post}
        liked={liked}
        likeCount={likeCount}
        onLike={onLike}
        onClose={() => setLightboxIndex(null)}
        onCountChange={onCountChange}
        menuSlot={menuSlot}
      />
    );
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-start gap-3 px-4 pt-4 pb-3 shrink-0">
          <NextLink
            href={
              post.author.username ? `/profile/${post.author.username}` : "#"
            }
            className="shrink-0"
          >
            <Avatar
              src={post.author.avatarUrl}
              name={post.author.name}
              initials={post.author.initials}
              color={post.author.color}
              size="md"
            />
          </NextLink>
          <div className="flex-1 min-w-0">
            <NextLink
              href={
                post.author.username ? `/profile/${post.author.username}` : "#"
              }
            >
              <p className="text-sm font-semibold text-text-primary hover:underline">
                {post.author.name}
              </p>
            </NextLink>
            <span className="text-xs text-text-secondary">{post.time}</span>
          </div>
          {menuSlot}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-text-secondary hover:bg-surface-200 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-4 pb-3 shrink-0">
          <RichContent
            text={post.content}
            className="text-sm text-text-primary leading-relaxed mb-2"
          />
          {post.images && post.images.length > 0 && (
            <div className="mb-2">
              <ImageGrid
                images={post.images}
                mediaTypes={post.mediaTypes}
                onImageClick={(i) => setLightboxIndex(i)}
              />
            </div>
          )}
          {post.attachment && <AttachmentRow attachment={post.attachment} />}
        </div>
        <div className="flex items-center gap-1 px-3 py-1 border-y border-surface-100 shrink-0">
          <button
            onClick={onLike}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
              liked
                ? "text-primary font-medium"
                : "text-text-secondary hover:bg-surface-100",
            )}
          >
            <ThumbsUp
              size={15}
              className={clsx(
                "transition-transform duration-150",
                liked ? "scale-110 fill-primary" : "",
              )}
            />
            <span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors">
            <MessageCircle size={15} />
            <span>
              {comments
                .filter((c) => !c.hidden)
                .reduce(
                  (acc, c) =>
                    acc + 1 + c.replies.filter((r) => !r.hidden).length,
                  0,
                )}
            </span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors ml-auto">
            <Share2 size={15} />
            <span>Chia sẻ</span>
          </button>
        </div>
        <div className="flex items-center gap-1 px-4 py-2 shrink-0">
          {(["default", "newest", "oldest"] as CommentSort[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                sort === s
                  ? "bg-primary text-white"
                  : "bg-surface-100 text-text-secondary hover:bg-surface-200",
              )}
            >
              {s === "default"
                ? "Tất cả"
                : s === "newest"
                  ? "Mới nhất"
                  : "Cũ nhất"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 pr-12 py-3 flex flex-col gap-3 min-h-0">
          <CommentList
            comments={sortedComments}
            replyingToId={replyingToId}
            replyingToName={replyingToName}
            currentUserName={session?.user?.name ?? ""}
            onLike={handleCommentLike}
            onToggleReply={toggleReplyInput}
            onSubmitReply={handleSubmitReply}
            onCancelReply={cancelReply}
            onLikeReply={handleReplyLike}
            postAuthorId={post.authorId}
            currentUserId={
              status === "authenticated" ? (session?.user?.id ?? "") : ""
            }
            onDeleteComment={deleteComment}
            onDeleteReply={deleteReply}
            onEditComment={editComment}
            onHideComment={hideComment}
            onCountChange={onCountChange}
          />
        </div>
        <div className="px-4 pb-4 pt-3 border-t border-surface-100 shrink-0">
          <CommentInput onSubmit={handleSubmitComment} />
        </div>
      </div>
    </div>
  );
}

export default function PostCard({
  post,
  onDeleted,
}: {
  post: Post;
  onDeleted?: (id: string | number) => void;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(post.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [content, setContent] = useState(post.content);
  const [currentImages, setCurrentImages] = useState(post.images);
  const [currentMediaTypes, setCurrentMediaTypes] = useState(post.mediaTypes);
  const [currentAttachment, setCurrentAttachment] = useState(post.attachment);
  const [currentAttachments, setCurrentAttachments] = useState<
    NonNullable<Post["attachment"]>[]
  >(post.attachment ? [post.attachment] : []);
  const [editedAt, setEditedAt] = useState(post.editedAt ?? null);
  const [currentMediaDocIds, setCurrentMediaDocIds] = useState(
    post.mediaDocIds,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [blockingName, setBlockingName] = useState<string | null>(null);
  const isOwner = session?.user?.id === post.authorId;

  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : c - 1));
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  };

  const handleEdit = (result: { content: string; updatedPost: any }) => {
    const updated = result.updatedPost;
    setContent(updated.content);
    setEditedAt(updated.editedAt);
    const mediaDocs = (updated.documents ?? []).filter(
      (d: any) => d.type === "IMAGE" || d.type === "VIDEO",
    );
    const docFiles = (updated.documents ?? []).filter(
      (d: any) => d.type !== "IMAGE" && d.type !== "VIDEO",
    );
    setCurrentImages(
      mediaDocs.length ? mediaDocs.map((d: any) => d.fileUrl) : undefined,
    );
    setCurrentMediaTypes(
      mediaDocs.length
        ? mediaDocs.map((d: any) => (d.type === "VIDEO" ? "video" : "image"))
        : undefined,
    );
    setCurrentMediaDocIds(
      mediaDocs.length ? mediaDocs.map((d: any) => d.id) : undefined,
    );
    setCurrentAttachments(
      docFiles.map((d: any) => ({
        name: d.title,
        size: d.fileSize ? `${(d.fileSize / 1024).toFixed(1)} KB` : "",
        type: d.title.split(".").pop()?.toUpperCase() ?? d.type,
        url: d.fileUrl,
        docId: d.id,
      })),
    );
    setCurrentAttachment(
      docFiles.length
        ? {
            name: docFiles[0].title,
            size: docFiles[0].fileSize
              ? `${(docFiles[0].fileSize / 1024).toFixed(1)} KB`
              : "",
            type:
              docFiles[0].title.split(".").pop()?.toUpperCase() ??
              docFiles[0].type,
            url: docFiles[0].fileUrl,
            docId: docFiles[0].id,
          }
        : undefined,
    );
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleted(true);
      onDeleted?.(post.id);
    }
    setShowDeleteConfirm(false);
  };

  if (deleted) return null;

  const displayPost = {
    ...post,
    content,
    images: currentImages,
    mediaTypes: currentMediaTypes,
    mediaDocIds: currentMediaDocIds,
    attachment: currentAttachment,
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-surface-200 shadow-card card-hover p-4">
        <div className="flex items-start justify-between mb-3">
          <NextLink
            href={
              post.author.username ? `/profile/${post.author.username}` : "#"
            }
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Avatar
              src={post.author.avatarUrl}
              name={post.author.name}
              initials={post.author.initials}
              color={post.author.color}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {post.author.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-text-secondary">{post.time}</p>
                {editedAt && (
                  <span className="text-xs text-text-muted">
                    · đã chỉnh sửa
                  </span>
                )}
              </div>
            </div>
          </NextLink>
          <PostMoreMenu
            isOwner={isOwner}
            authorName={post.author.name}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
            onSave={() => {}}
            onBlock={() => setBlockingName(post.author.name)}
            onReport={() => setShowReportModal(true)}
          />
        </div>

        <RichContent
          text={content}
          className="text-sm text-text-primary leading-relaxed mb-3"
        />

        {currentImages && currentImages.length > 0 && (
          <ImageGrid
            images={currentImages}
            mediaTypes={currentMediaTypes}
            onImageClick={(index) => setModal({ type: "lightbox", index })}
          />
        )}

        {currentAttachments.map((att) => (
          <AttachmentRow
            key={att.docId ?? att.name}
            attachment={att}
            className="mb-3"
          />
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-surface-100">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all duration-150 select-none",
                liked
                  ? "bg-primary-50 text-primary font-semibold"
                  : "text-text-secondary hover:bg-surface-100",
              )}
            >
              <ThumbsUp
                size={15}
                className={clsx(
                  "transition-transform duration-150",
                  liked ? "scale-110 fill-primary" : "",
                )}
              />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => setModal({ type: "comment" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors"
            >
              <MessageCircle size={15} />
              <span>{commentCount}</span>
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
            <Share2 size={15} />
            Chia sẻ
          </button>
        </div>
      </div>

      {modal.type === "lightbox" && currentImages ? (
        <MediaLightbox
          images={currentImages}
          mediaTypes={currentMediaTypes}
          initialIndex={modal.index}
          post={displayPost}
          liked={liked}
          likeCount={likeCount}
          onClose={() => setModal({ type: "none" })}
          onLike={handleLike}
          onSyncCount={setCommentCount}
          onCountChange={(delta) =>
            setCommentCount((c) => Math.max(0, c + delta))
          }
          menuSlot={
    <PostMoreMenu
      isOwner={isOwner}
      authorName={post.author.name}
      onEdit={() => { setModal({ type: "none" }); setShowEditModal(true); }}
      onDelete={() => { setModal({ type: "none" }); setShowDeleteConfirm(true); }}
      onSave={() => {}}
      onBlock={() => setBlockingName(post.author.name)}
      onReport={() => { setModal({ type: "none" }); setShowReportModal(true); }}
    />
  }
        />
      ) : modal.type === "comment" ? (
        <CommentModal
          post={displayPost}
          liked={liked}
          likeCount={likeCount}
          onClose={() => setModal({ type: "none" })}
          onLike={handleLike}
          onSyncCount={setCommentCount}
          onCountChange={(delta) => setCommentCount((c) => Math.max(0, c + delta))}
          menuSlot={
            <PostMoreMenu
              isOwner={isOwner}
              authorName={post.author.name}
              onEdit={() => { setModal({ type: "none" }); setShowEditModal(true); }}
              onDelete={() => { setModal({ type: "none" }); setShowDeleteConfirm(true); }}
              onSave={() => {}}
              onBlock={() => setBlockingName(post.author.name)}
              onReport={() => { setModal({ type: "none" }); setShowReportModal(true); }}
            />
          }
        />
      ) : null}

      {showEditModal && (
        <EditPostComposer
          post={displayPost}
          attachments={currentAttachments}
          onSave={handleEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showReportModal && (
        <ReportPostModal
          postId={post.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}
