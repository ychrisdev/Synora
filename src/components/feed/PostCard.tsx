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
  BookmarkCheck,
  Link as LinkIcon,
  ImageIcon,
  Video,
  Download,
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
  Globe,
  Users as UsersIcon,
  Lock as LockIcon,
  ChevronDown,
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
import AuthGuardModal from "@/components/ui/AuthGuardModal";
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
  visibility?: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";
  tags: string[];
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
    docId?: string;
  };
  attachments?: {
    name: string;
    size: string;
    type: string;
    url?: string;
    docId?: string;
  }[];
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

type EditVisibility = "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";

const EDIT_VISIBILITY_OPTIONS: {
  value: EditVisibility;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "PUBLIC", label: "Mọi người", icon: <Globe size={13} /> },
  { value: "FRIENDS_ONLY", label: "Bạn bè", icon: <UsersIcon size={13} /> },
  { value: "PRIVATE", label: "Chỉ mình tôi", icon: <LockIcon size={13} /> },
];

function notifyTagsChanged() {
  window.dispatchEvent(new Event("tags:changed"));
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

const MAX_VIDEO_MB = 64;
const MAX_IMAGE_MB = 8;
const MAX_DOC_MB = 16;

type CommentRole = "own" | "hidden-own" | "post-author" | "viewer";
type CommentSort = "default" | "newest" | "oldest";

type CommentPayload = {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
};

type ModalState =
  | { type: "none" }
  | { type: "comment" }
  | { type: "lightbox"; index: number };

export default function PostCard({
  post,
  onDeleted,
  isSavedInitially = false,
  onSaveToggle,
  autoOpenComments = false,
  targetCommentId = null,
}: {
  post: Post;
  onDeleted?: (id: string | number) => void;
  isSavedInitially?: boolean;
  onSaveToggle?: (id: string | number, saved: boolean) => void;
  autoOpenComments?: boolean;
  targetCommentId?: string | null;
}) {
  const { data: session } = useSession();
  const [sessionAvatarUrl, setSessionAvatarUrl] = useState<
    string | null | undefined
  >(undefined);

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
  >(post.attachments ?? (post.attachment ? [post.attachment] : []));
  const [editedAt, setEditedAt] = useState(post.editedAt ?? null);
  const [currentMediaDocIds, setCurrentMediaDocIds] = useState(
    post.mediaDocIds,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [saved, setSaved] = useState(isSavedInitially);
  const [toast, setToast] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [blockingName, setBlockingName] = useState<string | null>(null);
  const isOwner = session?.user?.id === post.authorId;
  const [currentVisibility, setCurrentVisibility] = useState(post.visibility);
  const [authModal, setAuthModal] = useState<string | null>(null);

  const handleLike = async () => {
    if (!session?.user) {
      setAuthModal("thích bài viết");
      return;
    }
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : c - 1));
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (!res.ok) {
      setLiked(!nextLiked);
      setLikeCount((c) => (nextLiked ? c - 1 : c + 1));
    }
  };

  const handleSave = async () => {
    if (!session?.user) {
      setAuthModal("lưu bài viết");
      return;
    }
    const res = await fetch(`/api/posts/${post.id}/save`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
      setToast(data.saved ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết");
      setTimeout(() => setToast(null), 2500);
      onSaveToggle?.(post.id, data.saved);
    }
  };

  const handleEdit = (result: { content: string; updatedPost: any }) => {
    const updated = result.updatedPost;
    setContent(updated.content);
    setEditedAt(updated.editedAt);
    setCurrentVisibility(updated.visibility);
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
    notifyTagsChanged();
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleted(true);
      onDeleted?.(post.id);
      notifyTagsChanged();
    }
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (session?.user?.id === post.authorId) {
        setSessionAvatarUrl(detail.avatarUrl);
      }
    };
    window.addEventListener("profile:updated", handler);
    return () => window.removeEventListener("profile:updated", handler);
  }, [session?.user?.id, post.authorId]);

  useEffect(() => {
    if (autoOpenComments) {
      setModal({ type: "comment" });
    }
  }, [autoOpenComments]);

  if (deleted) return null;

  const displayPost = {
    ...post,
    content,
    images: currentImages,
    mediaTypes: currentMediaTypes,
    mediaDocIds: currentMediaDocIds,
    attachment: currentAttachment,
    author: {
      ...post.author,
      avatarUrl:
        sessionAvatarUrl !== undefined
          ? sessionAvatarUrl
          : post.author.avatarUrl,
    },
    visibility: currentVisibility,
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
              src={displayPost.author.avatarUrl}
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
              <div className="flex items-center gap-1">
                <p className="text-xs text-text-secondary">{post.time}</p>
                {currentVisibility && (
                  <>
                    <span className="text-text-muted text-xs">·</span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-0.5">
                      {currentVisibility === "PRIVATE" ? (
                        <>
                          <LockIcon size={10} /> Riêng tư
                        </>
                      ) : currentVisibility === "FRIENDS_ONLY" ? (
                        <>
                          <UsersIcon size={10} /> Bạn bè
                        </>
                      ) : (
                        <>
                          <Globe size={10} /> Công khai
                        </>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </NextLink>
          <PostMoreMenu
            isOwner={isOwner}
            isSaved={saved}
            authorName={post.author.name}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
            onSave={handleSave}
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
              onClick={() => {
                setModal({ type: "comment" });
              }}
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
              isSaved={saved}
              authorName={post.author.name}
              onEdit={() => {
                setModal({ type: "none" });
                setShowEditModal(true);
              }}
              onDelete={() => {
                setModal({ type: "none" });
                setShowDeleteConfirm(true);
              }}
              onSave={handleSave}
              onBlock={() => setBlockingName(post.author.name)}
              onReport={() => {
                setModal({ type: "none" });
                setShowReportModal(true);
              }}
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
          onCountChange={(delta) =>
            setCommentCount((c) => Math.max(0, c + delta))
          }
          onAuthRequired={setAuthModal}
          targetCommentId={targetCommentId}
          menuSlot={
            <PostMoreMenu
              isOwner={isOwner}
              isSaved={saved}
              authorName={post.author.name}
              onEdit={() => {
                setModal({ type: "none" });
                setShowEditModal(true);
              }}
              onDelete={() => {
                setModal({ type: "none" });
                setShowDeleteConfirm(true);
              }}
              onSave={handleSave}
              onBlock={() => setBlockingName(post.author.name)}
              onReport={() => {
                setModal({ type: "none" });
                setShowReportModal(true);
              }}
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

      {authModal && (
        <AuthGuardModal onClose={() => setAuthModal(null)} action={authModal} />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 bg-text-primary text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          <Bookmark size={13} />
          {toast}
        </div>
      )}
    </>
  );
}
