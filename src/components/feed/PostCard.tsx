"use client";

import { ThumbsUp, MessageCircle, Share2, Download, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";

interface Post {
  id: number;
  author: { name: string; initials: string; color: string; role: string };
  time: string;
  content: string;
  tags: string[];
  attachment?: { name: string; size: string; type: string };
  likes: number;
  comments: number;
}

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card card-hover p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", post.author.color)}>
            {post.author.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">{post.author.name}</span>
              <span className="text-xs text-primary font-medium">{post.author.role}</span>
            </div>
            <p className="text-xs text-text-muted">{post.time}</p>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-surface-100 text-text-muted">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-text-primary leading-relaxed mb-3">{post.content}</p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-primary font-medium hover:underline cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Attachment */}
      {post.attachment && (
        <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-200 mb-3">
          <div className="flex items-center gap-3">
            <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", fileTypeColors[post.attachment.type] || "bg-gray-500")}>
              {post.attachment.type}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{post.attachment.name}</p>
              <p className="text-xs text-text-muted">{post.attachment.size}</p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-surface-200 text-text-secondary transition-colors">
            <Download size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-100">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
            <ThumbsUp size={15} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
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
  );
}
