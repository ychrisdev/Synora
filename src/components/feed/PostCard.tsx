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
  Link,
  EyeOff,
  Flag,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  FileText,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
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

interface Post {
  id: number;
  author: { name: string; initials: string; color: string; role: string };
  time: string;
  content: string;
  images?: string[];
  mediaTypes?: string[];
  tags: string[];
  attachment?: { name: string; size: string; type: string; url?: string };
  likes: number;
  isLikedByMe?: boolean;
  comments: number;
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

interface UploadedAttachment {
  url: string;
  key: string;
  name: string;
  size: string;
  type: string;
  isImage: boolean;
  isVideo: boolean;
}

interface Comment {
  id: string;
  author: { name: string; initials: string; color: string };
  time: string;
  content: string;
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
}

interface Reply {
  id: string;
  author: { name: string; initials: string; color: string };
  time: string;
  content: string;
  replyTo?: string;
  likes: number;
  liked: boolean;
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

function Avatar({
  initials,
  color,
  size = "sm",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "w-9 h-9 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        dim,
        color,
      )}
    >
      {initials}
    </div>
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
        {size && <p className="text-[11px] text-text-muted">{size}</p>}
      </div>
      {url ? (
        <a
          href={url}
          download={name}
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
          className="p-1.5 text-text-muted shrink-0"
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

function MoreMenu() {
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

  const items = [
    { icon: <Bookmark size={15} />, label: "Lưu bài viết" },
    { icon: <Link size={15} />, label: "Sao chép liên kết" },
    null,
    { icon: <EyeOff size={15} />, label: "Ẩn bài viết" },
    { icon: <Flag size={15} />, label: "Báo cáo", danger: true },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg hover:bg-surface-100 text-text-muted transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-surface-200 rounded-xl shadow-lg z-20 min-w-[170px] overflow-hidden py-1">
          {items.map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-surface-100" />
            ) : (
              <button
                key={i}
                onClick={() => setOpen(false)}
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = getFileExt(file.name);
    const isImg = isImageFile(file.name);
    const isVid = isVideoFile(file.name);
    const sizeMB = file.size / (1024 * 1024);

    setUploadError(null);
    if (isImg && sizeMB > MAX_IMAGE_MB) {
      setUploadError(
        `Ảnh tối đa ${MAX_IMAGE_MB}MB (file này ${sizeMB.toFixed(1)}MB)`,
      );
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (isVid && sizeMB > MAX_VIDEO_MB) {
      setUploadError(
        `Video tối đa ${MAX_VIDEO_MB}MB (file này ${sizeMB.toFixed(1)}MB)`,
      );
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (!isImg && !isVid && sizeMB > MAX_DOC_MB) {
      setUploadError(
        `Tài liệu tối đa ${MAX_DOC_MB}MB (file này ${sizeMB.toFixed(1)}MB)`,
      );
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
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;
      let fileUrl: string | undefined;

      if (rawFile && attachment) {
        if (attachment.isImage) {
          const results = await uploadMedia([rawFile]);
          imageUrl = results?.[0]?.url;
        } else if (attachment.isVideo) {
          const results = await uploadMedia([rawFile]);
          videoUrl = results?.[0]?.url;
        } else {
          const results = await uploadDoc([rawFile]);
          fileUrl = results?.[0]?.url;
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

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
      <Avatar initials={initials} color="bg-primary" size="sm" />
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
                <span className="text-[11px] text-text-muted">
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
            onKeyDown={handleKey}
            placeholder="Viết bình luận..."
            rows={1}
            className="flex-1 resize-none text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent leading-relaxed max-h-28"
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
              className="p-1 text-text-muted hover:text-primary transition-colors disabled:opacity-40"
              title="Đính kèm tệp"
            >
              <Paperclip size={16} />
            </button>
            <button
              className="p-1 text-text-muted hover:text-amber-500 transition-colors"
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
                  : "text-text-muted cursor-not-allowed",
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
          <p className="text-[11px] text-text-muted mt-1 ml-1">
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
  onSubmit,
  onCancel,
}: {
  replyTo: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const initials = (session?.user?.name ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 ml-10 mt-2">
      <Avatar initials={initials} color="bg-primary" size="sm" />
      <div className="flex-1 flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-full px-3 py-1.5 focus-within:border-primary transition-colors">
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              e.preventDefault();
              onSubmit(text.trim());
            }
            if (e.key === "Escape") onCancel();
          }}
          placeholder={`Trả lời ${replyTo}...`}
          className="flex-1 text-xs bg-transparent outline-none text-text-primary placeholder:text-text-muted"
        />
        <button
          onClick={() => text.trim() && onSubmit(text.trim())}
          disabled={!text.trim()}
          className={clsx(
            "w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0",
            text.trim()
              ? "bg-primary text-white"
              : "bg-surface-200 text-text-muted cursor-not-allowed",
          )}
        >
          <Send size={11} />
        </button>
      </div>
    </div>
  );
}

function CommentList({
  comments,
  replyingToId,
  onLike,
  onToggleReply,
  onSubmitReply,
  onCancelReply,
}: {
  comments: Comment[];
  replyingToId: string | null;
  onLike: (id: string) => void;
  onToggleReply: (id: string) => void;
  onSubmitReply: (commentId: string, text: string, replyTo: string) => void;
  onCancelReply: () => void;
}) {
  return (
    <>
      {comments.length === 0 && (
        <p className="text-center text-sm text-text-muted py-4">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      )}
      {comments.map((c) => (
        <div key={c.id}>
          <div className="flex gap-2.5">
            <Avatar initials={c.author.initials} color={c.author.color} />
            <div className="flex-1 min-w-0">
              <div className="bg-surface-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
                <span className="text-xs font-semibold text-text-primary">
                  {c.author.name}
                </span>
                <span className="text-[10px] text-text-muted ml-1.5">
                  {c.time}
                </span>
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
                    const isVid = ["MP4", "MOV", "AVI", "WEBM", "MKV"].includes(
                      ext,
                    );
                    const isImg = [
                      "JPG",
                      "JPEG",
                      "PNG",
                      "GIF",
                      "WEBP",
                      "BMP",
                      "SVG",
                    ].includes(ext);

                    if (isVid && c.fileUrl) {
                      return (
                        <CommentMediaThumb
                          url={c.fileUrl}
                          type="video"
                          fileName={c.fileName}
                        />
                      );
                    }
                    if (isImg && c.fileUrl) {
                      return (
                        <CommentMediaThumb
                          url={c.fileUrl}
                          type="image"
                          fileName={c.fileName}
                        />
                      );
                    }
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

              <div className="flex items-center gap-1 mt-1 ml-1">
                <button
                  onClick={() => onLike(c.id)}
                  className={clsx(
                    "flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors",
                    c.liked
                      ? "text-primary"
                      : "text-text-muted hover:text-text-secondary",
                  )}
                >
                  <ThumbsUp size={11} />
                  <span>{c.likes > 0 ? c.likes : "Thích"}</span>
                </button>
                <span className="text-text-muted text-[10px]">·</span>
                <button
                  onClick={() => onToggleReply(c.id)}
                  className="text-[11px] font-medium text-text-muted hover:text-text-secondary px-2 py-0.5 rounded transition-colors"
                >
                  Trả lời
                </button>
              </div>
            </div>
          </div>

          {c.replies.length > 0 && (
            <div className="ml-10 mt-2 flex flex-col gap-2">
              {c.replies.map((r) => (
                <div key={r.id} className="flex gap-2">
                  <Avatar initials={r.author.initials} color={r.author.color} />
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-50 rounded-2xl rounded-tl-sm px-3 py-2">
                      <span className="text-xs font-semibold text-text-primary">
                        {r.author.name}
                      </span>
                      <span className="text-[10px] text-text-muted ml-1.5">
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {replyingToId === c.id && (
            <ReplyInput
              replyTo={c.author.name}
              onSubmit={(text) => onSubmitReply(c.id, text, c.author.name)}
              onCancel={onCancelReply}
            />
          )}
        </div>
      ))}
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

function useComments(postId: number | string) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const mapComment = useCallback((c: any): Comment => {
    const mentionParse = (content: string) => {
      const m = content.match(/^@\[(.+?)\] ([\s\S]+)$/);
      return m ? { replyTo: m[1], text: m[2] } : { text: content };
    };

    return {
      id: c.id,
      author: {
        name: c.author.profile?.displayName ?? c.author.username ?? "User",
        initials: (c.author.profile?.displayName ?? c.author.username ?? "U")
          .split(" ")
          .map((w: string) => w[0])
          .slice(-2)
          .join("")
          .toUpperCase(),
        color: "bg-primary",
      },
      time: new Date(c.createdAt).toLocaleDateString("vi-VN"),
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
        const { replyTo, text } = mentionParse(r.content);
        return {
          id: r.id,
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
          },
          time: new Date(r.createdAt).toLocaleDateString("vi-VN"),
          content: text,
          replyTo,
          likes: r._count?.likes ?? 0,
          liked: Array.isArray(r.likes) && r.likes.length > 0,
        };
      }),
      showReplyInput: false,
    };
  }, []);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setComments(data.map(mapComment));
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

      if (!res.ok) {
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
      }
    },
    [postId],
  );

  const toggleReplyInput = useCallback((id: string) => {
    setReplyingToId((prev) => (prev === id ? null : id));
  }, []);

  const submitReply = useCallback(
    async (commentId: string, text: string, replyToName: string) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `@[${replyToName}] ${text}`,
          parentId: commentId,
        }),
      });
      if (!res.ok) return;
      const saved = await res.json();
      const currentName = session?.user?.name ?? "User";
      const reply: Reply = {
        id: saved.id,
        author: {
          name: currentName,
          initials: currentName
            .split(" ")
            .map((w: string) => w[0])
            .slice(-2)
            .join("")
            .toUpperCase(),
          color: "bg-primary",
        },
        time: "Vừa xong",
        content: text,
        replyTo: replyToName,
        likes: 0,
        liked: false,
      };
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c,
        ),
      );
      setReplyingToId(null);
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

  return {
    comments,
    replyingToId,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply: () => setReplyingToId(null),
  };
}

type ModalState =
  | { type: "none" }
  | { type: "comment" }
  | { type: "lightbox"; index: number };

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
          <p className="text-xs text-text-muted">{attachment.size}</p>
        </div>
      </div>
      <a
        href={attachment.url ?? "#"}
        download={attachment.name}
        target="_blank"
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
}: {
  images: string[];
  mediaTypes?: string[];
  initialIndex: number;
  post: Post;
  liked: boolean;
  likeCount: number;
  onClose: () => void;
  onLike: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const {
    comments,
    replyingToId,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
  } = useComments(post.id);

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
          <div
            className={clsx(
              "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
              post.author.color,
            )}
          >
            {post.author.initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {post.author.name}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-primary font-medium">
                {post.author.role}
              </span>
              <span className="text-text-muted text-xs">·</span>
              <span className="text-xs text-text-muted">{post.time}</span>
            </div>
          </div>
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
              {comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}
            </span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors ml-auto">
            <Share2 size={15} />
            <span>Chia sẻ</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <CommentList
            comments={comments}
            replyingToId={replyingToId}
            onLike={handleCommentLike}
            onToggleReply={toggleReplyInput}
            onSubmitReply={submitReply}
            onCancelReply={cancelReply}
          />
        </div>
        <div className="border-t border-surface-100 px-4 py-3 shrink-0">
          <CommentInput onSubmit={submitComment} />
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
  onCommentAdded,
}: {
  post: Post;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onClose: () => void;
  onCommentAdded?: () => void;
}) {
  const {
    comments,
    replyingToId,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
  } = useComments(post.id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleSubmitComment = useCallback(
    async (payload: CommentPayload) => {
      await submitComment(payload);
      onCommentAdded?.();
    },
    [submitComment, onCommentAdded],
  );

  const handleSubmitReply = useCallback(
    async (commentId: string, text: string, replyTo: string) => {
      await submitReply(commentId, text, replyTo);
      onCommentAdded?.();
    },
    [submitReply, onCommentAdded],
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
          <Avatar
            initials={post.author.initials}
            color={post.author.color}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              {post.author.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-text-muted">{post.time}</span>
            </div>
          </div>
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
              {comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)}
            </span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors ml-auto">
            <Share2 size={15} />
            <span>Chia sẻ</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
          <CommentList
            comments={comments}
            replyingToId={replyingToId}
            onLike={handleCommentLike}
            onToggleReply={toggleReplyInput}
            onSubmitReply={handleSubmitReply}
            onCancelReply={cancelReply}
          />
        </div>
        <div className="px-4 pb-4 pt-3 border-t border-surface-100 shrink-0">
          <CommentInput onSubmit={handleSubmitComment} />
        </div>
      </div>
    </div>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLikedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : c - 1));
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-surface-200 shadow-card card-hover p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
                post.author.color,
              )}
            >
              {post.author.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {post.author.name}
                </span>
                <span className="text-xs text-primary font-medium">
                  {post.author.role}
                </span>
              </div>
              <p className="text-xs text-text-muted">{post.time}</p>
            </div>
          </div>
          <MoreMenu />
        </div>

        <RichContent
          text={post.content}
          className="text-sm text-text-primary leading-relaxed mb-3"
        />

        {post.images && post.images.length > 0 && (
          <ImageGrid
            images={post.images}
            mediaTypes={post.mediaTypes}
            onImageClick={(index) => setModal({ type: "lightbox", index })}
          />
        )}

        {post.attachment && (
          <AttachmentRow attachment={post.attachment} className="mb-3" />
        )}

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

      {modal.type === "lightbox" && post.images ? (
        <MediaLightbox
          images={post.images}
          mediaTypes={post.mediaTypes}
          initialIndex={modal.index}
          post={post}
          liked={liked}
          likeCount={likeCount}
          onClose={() => setModal({ type: "none" })}
          onLike={handleLike}
        />
      ) : modal.type === "comment" ? (
        <CommentModal
          post={post}
          liked={liked}
          likeCount={likeCount}
          onClose={() => setModal({ type: "none" })}
          onLike={handleLike}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      ) : null}
    </>
  );
}
