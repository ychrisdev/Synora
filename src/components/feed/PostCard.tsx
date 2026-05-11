"use client";

import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Download,
  MoreHorizontal,
  X,
  ImageIcon,
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
} from "lucide-react";
import { clsx } from "clsx";
import { useState, useRef, useCallback, useEffect } from "react";

const CURRENT_USER = {
  name: "Trần Lê Quỳnh Anh",
  initials: "QA",
  color: "bg-primary",
};

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};

interface Post {
  id: number;
  author: { name: string; initials: string; color: string; role: string };
  time: string;
  content: string;
  images?: string[];
  tags: string[];
  attachment?: { name: string; size: string; type: string };
  likes: number;
  comments: number;
}

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  isImage: boolean;
}

interface Comment {
  id: string;
  author: { name: string; initials: string; color: string };
  time: string;
  content: string;
  image?: string;
  file?: AttachedFile;
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


const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: { name: "Minh Khoa", initials: "MK", color: "bg-emerald-500" },
    time: "1 giờ trước",
    content: "Cảm ơn bạn nhiều lắm! Mình đang cần tài liệu này.",
    likes: 4,
    liked: false,
    replies: [],
    showReplyInput: false,
  },
  {
    id: "c2",
    author: { name: "Bảo Ngọc", initials: "BN", color: "bg-pink-500" },
    time: "45 phút trước",
    content: "Chiều nay mình cũng rảnh, mình đến thư viện cùng nhé! 📚",
    likes: 2,
    liked: false,
    replies: [],
    showReplyInput: false,
  },
];

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

function AttachmentBadge({ file }: { file: AttachedFile }) {
  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-surface-50 rounded-lg border border-surface-200 max-w-[240px]">
      <div
        className={clsx(
          "w-8 h-8 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0",
          fileTypeColors[file.type] ?? "bg-gray-500",
        )}
      >
        {file.isImage ? <ImageIcon size={14} /> : file.type}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary truncate">
          {file.name}
        </p>
        <p className="text-[11px] text-text-muted">{file.size}</p>
      </div>
      <button className="p-1 rounded hover:bg-surface-200 text-text-secondary transition-colors shrink-0">
        <Download size={13} />
      </button>
    </div>
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

function ImageGrid({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const extraCount = images.length - 3;

  if (images.length === 1)
    return (
      <div className="mb-3 rounded-xl overflow-hidden">
        <img
          src={images[0]}
          alt=""
          onClick={() => onImageClick(0)}
          className="w-full max-h-80 object-cover cursor-pointer hover:brightness-95 transition"
        />
      </div>
    );

  if (images.length === 2)
    return (
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            onClick={() => onImageClick(i)}
            className="w-full h-44 object-cover cursor-pointer hover:brightness-95 transition"
          />
        ))}
      </div>
    );

  return (
    <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
      <img
        src={images[0]}
        alt=""
        onClick={() => onImageClick(0)}
        className="w-full row-span-2 h-[244px] object-cover cursor-pointer hover:brightness-95 transition"
      />
      <img
        src={images[1]}
        alt=""
        onClick={() => onImageClick(1)}
        className="w-full h-[120px] object-cover cursor-pointer hover:brightness-95 transition"
      />
      <div className="relative">
        <img
          src={images[2]}
          alt=""
          onClick={() => onImageClick(2)}
          className="w-full h-[120px] object-cover cursor-pointer hover:brightness-95 transition"
        />
        {extraCount > 0 && (
          <button
            onClick={() => onImageClick(2)}
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl"
          >
            +{extraCount}
          </button>
        )}
      </div>
    </div>
  );
}

function CommentInput({
  onSubmit,
  inputRef,
}: {
  onSubmit: (content: string, image?: string, file?: AttachedFile) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = getFileExt(file.name);
    const isImg = isImageFile(file.name);
    const size = formatFileSize(file.size);

    if (isImg) {
      const reader = new FileReader();
      reader.onload = () =>
        setAttachment({
          name: file.name,
          size,
          type: ext,
          dataUrl: reader.result as string,
          isImage: true,
        });
      reader.readAsDataURL(file);
    } else {
      setAttachment({ name: file.name, size, type: ext, isImage: false });
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!text.trim() && !attachment) return;
    onSubmit(
      text.trim(),
      attachment?.isImage ? attachment.dataUrl : undefined,
      !attachment?.isImage ? (attachment ?? undefined) : undefined,
    );
    setText("");
    setAttachment(null);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = !!text.trim() || !!attachment;

  return (
    <div className="flex gap-2.5">
      <Avatar
        initials={CURRENT_USER.initials}
        color={CURRENT_USER.color}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        {attachment && (
          <div className="relative mb-2 inline-block">
            {attachment.isImage && attachment.dataUrl ? (
              <img
                src={attachment.dataUrl}
                alt="preview"
                className="h-20 rounded-xl object-cover border border-surface-200"
              />
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
              onClick={() => setAttachment(null)}
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
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              className="hidden"
              onChange={handleFile}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="p-1 text-text-muted hover:text-primary transition-colors"
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
              <Send size={13} />
            </button>
          </div>
        </div>
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
  return (
    <div className="flex items-center gap-2 ml-10 mt-2">
      <Avatar
        initials={CURRENT_USER.initials}
        color={CURRENT_USER.color}
        size="sm"
      />
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
                {c.image && (
                  <img
                    src={c.image}
                    alt="đính kèm"
                    className="mt-2 rounded-lg max-h-48 object-cover border border-surface-200"
                  />
                )}
                {c.file && <AttachmentBadge file={c.file} />}
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

function useComments(initialLikes: number) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [postLiked, setPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(initialLikes);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handlePostLike = useCallback(() => {
    setPostLiked((p) => !p);
    setPostLikes((c) => (postLiked ? c - 1 : c + 1));
  }, [postLiked]);

  const handleCommentLike = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c,
      ),
    );
  }, []);

  const toggleReplyInput = useCallback((id: string) => {
    setReplyingToId((prev) => (prev === id ? null : id));
  }, []);

  const submitReply = useCallback(
    (commentId: string, text: string, replyToName: string) => {
      const replyTo =
        replyToName === CURRENT_USER.name ? undefined : replyToName;

      const reply: Reply = {
        id: `r-${Date.now()}`,
        author: CURRENT_USER,
        time: "Vừa xong",
        content: text,
        replyTo,
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
    [],
  );

  const submitComment = useCallback(
    (content: string, image?: string, file?: AttachedFile) => {
      setComments((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          author: CURRENT_USER,
          time: "Vừa xong",
          content,
          image,
          file,
          likes: 0,
          liked: false,
          replies: [],
          showReplyInput: false,
        },
      ]);
    },
    [],
  );

  return {
    comments,
    postLiked,
    postLikes,
    replyingToId,
    handlePostLike,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply: () => setReplyingToId(null),
  };
}

function ImageLightbox({
  images,
  initialIndex,
  post,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  post: Post;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const {
    comments,
    postLiked,
    postLikes,
    replyingToId,
    handlePostLike,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
  } = useComments(post.likes);

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

        <img
          src={images[index]}
          alt=""
          className="max-w-full max-h-screen object-contain px-16"
        />

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
        className="w-[380px] shrink-0 bg-white flex flex-col h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100">
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
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-text-secondary hover:bg-surface-200 transition"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-sm text-text-primary leading-relaxed mb-2">
            {post.content}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((t) => (
                <span key={t} className="text-xs text-primary font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}

          {post.attachment && (
            <div className="flex items-center gap-2.5 p-2.5 bg-surface-50 rounded-lg border border-surface-200 mb-3">
              <div
                className={clsx(
                  "w-8 h-8 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                  fileTypeColors[post.attachment.type] ?? "bg-gray-500",
                )}
              >
                {post.attachment.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">
                  {post.attachment.name}
                </p>
                <p className="text-[11px] text-text-muted">
                  {post.attachment.size}
                </p>
              </div>
              <button className="p-1.5 rounded-md hover:bg-surface-200 text-text-secondary transition-colors">
                <Download size={14} />
              </button>
            </div>
          )}

          <div className="border-t border-surface-100 pt-3 flex flex-col gap-3">
            <CommentList
              comments={comments}
              replyingToId={replyingToId}
              onLike={handleCommentLike}
              onToggleReply={toggleReplyInput}
              onSubmitReply={submitReply}
              onCancelReply={cancelReply}
            />
          </div>
        </div>

        <div className="border-t border-surface-100 px-3 py-2">
          <div className="flex items-center gap-1 mb-2">
            <button
              onClick={handlePostLike}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                postLiked
                  ? "text-primary font-semibold"
                  : "text-text-secondary hover:bg-surface-100",
              )}
            >
              <ThumbsUp
                size={15}
                className={clsx(postLiked ? "fill-primary scale-110" : "")}
              />
              <span>{postLikes}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors">
              <MessageCircle size={15} />
              <span>{comments.length}</span>
            </button>
          </div>
          <CommentInput onSubmit={submitComment} />
        </div>
      </div>
    </div>
  );
}

function CommentModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const {
    comments,
    postLiked,
    postLikes,
    replyingToId,
    handlePostLike,
    handleCommentLike,
    toggleReplyInput,
    submitReply,
    submitComment,
    cancelReply,
  } = useComments(post.likes);

  const [lightboxIndex, setLightboxIndex] = useState<number | undefined>(
    undefined,
  );

  if (lightboxIndex !== undefined && post.images) {
    return (
      <ImageLightbox
        images={post.images}
        initialIndex={lightboxIndex}
        post={post}
        onClose={() => setLightboxIndex(undefined)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-start gap-3 px-4 pt-4 pb-2 mt-4">
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
                <span className="text-xs text-primary font-medium">
                  {post.author.role}
                </span>
                <span className="text-text-muted text-xs">·</span>
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

          <div className="px-4 pb-3">
            <p className="text-sm text-text-primary leading-relaxed mb-2">
              {post.content}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.map((t) => (
                  <span key={t} className="text-xs text-primary font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {post.images && post.images.length > 0 && (
              <div className="mb-2">
                <ImageGrid
                  images={post.images}
                  onImageClick={(i) => setLightboxIndex(i)}
                />
              </div>
            )}

            {post.attachment && (
              <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0",
                      fileTypeColors[post.attachment.type] ?? "bg-gray-500",
                    )}
                  >
                    {post.attachment.type}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {post.attachment.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {post.attachment.size}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary transition-colors">
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 px-3 pb-3 border-b border-surface-100">
            <button
              onClick={handlePostLike}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                postLiked
                  ? "text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-100",
              )}
            >
              <ThumbsUp
                size={15}
                className={clsx(
                  "transition-transform duration-150",
                  postLiked ? "scale-110 fill-primary" : "",
                )}
              />
              <span>{postLikes}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors">
              <MessageCircle size={15} />
              <span>{comments.length}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:bg-surface-100 transition-colors ml-auto">
              <Share2 size={15} />
              <span>Chia sẻ</span>
            </button>
          </div>

          <div className="px-4 py-3 flex flex-col gap-3">
            <CommentList
              comments={comments}
              replyingToId={replyingToId}
              onLike={handleCommentLike}
              onToggleReply={toggleReplyInput}
              onSubmitReply={submitReply}
              onCancelReply={cancelReply}
            />
          </div>
        </div>

        <div className="px-4 pb-4 pt-3 border-t border-surface-100 shrink-0">
          <CommentInput onSubmit={submitComment} />
        </div>
      </div>
    </div>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState<
    number | undefined
  >(undefined);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setShowComments(true);
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

        <p className="text-sm text-text-primary leading-relaxed mb-3">
          {post.content}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <ImageGrid images={post.images} onImageClick={handleImageClick} />
        )}

        {post.attachment && (
          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0",
                  fileTypeColors[post.attachment.type] || "bg-gray-500",
                )}
              >
                {post.attachment.type}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {post.attachment.name}
                </p>
                <p className="text-xs text-text-muted">
                  {post.attachment.size}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary transition-colors">
              <Download size={16} />
            </button>
          </div>
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
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors"
            >
              <MessageCircle size={15} />
              <span>{post.comments}</span>
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
            <Share2 size={15} />
            Chia sẻ
          </button>
        </div>
      </div>

      {initialImageIndex !== undefined && post.images ? (
        <ImageLightbox
          images={post.images}
          initialIndex={initialImageIndex}
          post={post}
          onClose={() => {
            setInitialImageIndex(undefined);
            setShowComments(false);
          }}
        />
      ) : (
        showComments && (
          <CommentModal post={post} onClose={() => setShowComments(false)} />
        )
      )}
    </>
  );
}