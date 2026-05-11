"use client";

import { useState, useRef, useCallback } from "react";
import {
  ImageIcon,
  FileText,
  Hash,
  X,
  Paperclip,
  ChevronDown,
  Users,
  Globe,
  Lock,
} from "lucide-react";

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
}

interface PostComposerProps {
  onPost?: (post: { content: string; tags: string[]; files: AttachedFile[] }) => void;
}

type Visibility = "public" | "friends" | "class";

const VISIBILITY_OPTIONS: {
  value: Visibility;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "public", label: "Mọi người", icon: <Globe size={14} /> },
  { value: "friends", label: "Bạn bè", icon: <Users size={14} /> },
  { value: "class", label: "Lớp tôi", icon: <Lock size={14} /> },
];

const SUGGESTED_TAGS = [
  "#GiaiTich",
  "#LapTrinh",
  "#HoaHoc",
  "#VatLy",
  "#HocNhom",
  "#DeThi",
  "#TaiLieu",
  "#ThiBang",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(file: File): string {
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
  return ext;
}

function getFileIcon(type: string) {
  if (["JPG", "JPEG", "PNG", "GIF", "WEBP"].includes(type))
    return <ImageIcon size={16} className="text-blue-400" />;
  if (["PDF"].includes(type))
    return <FileText size={16} className="text-red-400" />;
  return <Paperclip size={16} className="text-text-muted" />;
}

function Avatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
      QA
    </div>
  );
}

function VisibilityPicker({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = VISIBILITY_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-100 hover:bg-surface-200 px-2.5 py-1.5 rounded-full transition-colors"
      >
        {current.icon}
        {current.label}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-surface-200 rounded-xl shadow-lg z-20 min-w-[140px] overflow-hidden">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-50 transition-colors ${
                opt.value === value
                  ? "text-primary font-semibold"
                  : "text-text-primary"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagChip({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
      {tag}
      <button
        onClick={onRemove}
        className="hover:text-primary transition-colors"
        aria-label={`Xóa ${tag}`}
      >
        <X size={11} />
      </button>
    </span>
  );
}

function FileChip({
  attached,
  onRemove,
}: {
  attached: AttachedFile;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm">
      {getFileIcon(attached.type)}
      <span className="flex-1 truncate text-text-primary font-medium text-xs max-w-[160px]">
        {attached.name}
      </span>
      <span className="text-text-muted text-xs shrink-0">{attached.size}</span>
      <button
        onClick={onRemove}
        className="text-text-muted hover:text-text-secondary transition-colors ml-1"
        aria-label="Xóa file"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charLimit = 1000;
  const charCount = content.length;
  const isOverLimit = charCount > charLimit;
  const canPost = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newFiles: AttachedFile[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      size: formatFileSize(f.size),
      type: getFileType(f),
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) =>
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.startsWith("#") ? raw : `#${raw}`;
      const cleaned = tag.replace(/\s+/g, "").trim();
      if (!cleaned || cleaned === "#") return;
      if (tags.includes(cleaned)) return;
      setTags((prev) => [...prev, cleaned]);
      setTagInput("");
      setShowSuggestions(false);
    },
    [tags],
  );

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    (t) =>
      !tags.includes(t) &&
      t.toLowerCase().includes(tagInput.replace("#", "").toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!canPost) return;
    setIsSubmitting(true);
    onPost?.({ content, tags, files: attachedFiles });
    await new Promise((r) => setTimeout(r, 1200));
    setContent("");
    setTags([]);
    setAttachedFiles([]);
    setTagInput("");
    setShowTagInput(false);
    setIsSubmitting(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-visible">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <Avatar />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-text-primary">
            Trần Lê Quỳnh Anh
          </span>
          <VisibilityPicker value={visibility} onChange={setVisibility} />
        </div>
      </div>

      {/* Textarea */}
      <div className="px-5">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          placeholder="Bạn đang nghĩ gì? Chia sẻ tài liệu, hỏi bài, hay rủ học nhóm..."
          className="w-full resize-none text-sm text-text-primary placeholder:text-text-muted outline-none leading-relaxed min-h-[80px] max-h-[320px] bg-transparent"
          rows={3}
        />

        {charCount > charLimit * 0.8 && (
          <div
            className={`text-xs text-right mb-1 ${
              isOverLimit ? "text-red-500 font-semibold" : "text-text-muted"
            }`}
          >
            {charCount}/{charLimit}
          </div>
        )}
      </div>

      {/* Tags area */}
      {(tags.length > 0 || showTagInput) && (
        <div className="px-5 pb-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {tags.map((tag) => (
              <TagChip
                key={tag}
                tag={tag}
                onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
              />
            ))}

            {showTagInput && (
              <div className="relative">
                <div className="flex items-center gap-1 border border-primary-100 rounded-full px-2.5 py-1 bg-white">
                  <Hash size={11} className="text-primary" />
                  <input
                    autoFocus
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => {
                      if (tagInput) addTag(tagInput);
                      setTimeout(() => {
                        setShowSuggestions(false);
                        if (!tagInput) setShowTagInput(false);
                      }, 150);
                    }}
                    placeholder="nhập tag..."
                    className="text-xs text-primary outline-none w-24 bg-transparent"
                  />
                </div>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-surface-200 rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden">
                    {filteredSuggestions.slice(0, 6).map((s) => (
                      <button
                        key={s}
                        onMouseDown={() => addTag(s)}
                        className="w-full text-left px-3 py-2 text-xs text-text-primary hover:bg-primary-50 hover:text-primary transition-colors font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {attachedFiles.map((f) => (
            <FileChip key={f.id} attached={f} onRemove={() => removeFile(f.id)} />
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="mx-5 border-t border-surface-100" />

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar"
          />
          <ActionButton
            icon={<Paperclip size={18} />}
            label="Đính kèm file"
            onClick={() => fileInputRef.current?.click()}
          />
          <ActionButton
            icon={<ImageIcon size={18} />}
            label="Thêm ảnh"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "image/*";
                fileInputRef.current.click();
                fileInputRef.current.accept =
                  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar";
              }
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canPost}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            canPost
              ? "bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-md active:scale-95"
              : "bg-surface-100 text-text-muted cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang đăng...
            </>
          ) : (
            <>
              Đăng bài
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-150 ${
        active
          ? "bg-primary-50 text-primary"
          : "text-text-secondary hover:bg-surface-100 hover:text-text-primary"
      }`}
    >
      {icon}
      <span className="hidden sm:inline text-xs font-medium">{label}</span>
    </button>
  );
}