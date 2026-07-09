"use client";
import { Eye, EyeOff, Trash2, MoreVertical, Flag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import type { AdminPostRow } from "@/lib/content/types";
import { clsx } from "clsx";

function StatusBadge({ status }: { status: AdminPostRow["status"] }) {
  return status === "VISIBLE" ? (
    <span className="text-[11px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
      Hiển thị
    </span>
  ) : (
    <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
      Đã ẩn
    </span>
  );
}

function RowMenu({
  post,
  onViewDetail,
  onToggleVisibility,
  onDelete,
}: {
  post: AdminPostRow;
  onViewDetail: (p: AdminPostRow) => void;
  onToggleVisibility: (p: AdminPostRow) => void;
  onDelete: (p: AdminPostRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[190px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 py-1">
          <button
            onClick={() => {
              onViewDetail(post);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Eye size={14} /> Xem chi tiết
          </button>
          <button
            onClick={() => {
              onToggleVisibility(post);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <EyeOff size={14} />
            {post.status === "VISIBLE" ? "Ẩn bài viết" : "Bỏ ẩn bài viết"}
          </button>
          <div className="h-px bg-slate-100 my-1" />
          <button
            onClick={() => {
              onDelete(post);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} /> Xóa vĩnh viễn
          </button>
        </div>
      )}
    </div>
  );
}

export function PostsTable({
  posts,
  onViewDetail,
  onToggleVisibility,
  onDelete,
}: {
  posts: AdminPostRow[];
  onViewDetail: (p: AdminPostRow) => void;
  onToggleVisibility: (p: AdminPostRow) => void;
  onDelete: (p: AdminPostRow) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-400">
        Không tìm thấy bài viết nào phù hợp
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wide">
            <th className="px-5 py-3 font-medium">Tác giả</th>
            <th className="px-5 py-3 font-medium">Nội dung</th>
            <th className="px-5 py-3 font-medium text-center">Bình luận</th>
            <th className="px-5 py-3 font-medium text-center">Lượt thích</th>
            <th className="px-5 py-3 font-medium text-center">Báo cáo</th>
            <th className="px-5 py-3 font-medium">Trạng thái</th>
            <th className="px-5 py-3 font-medium">Ngày đăng</th>
            <th className="px-5 py-3 font-medium w-10" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar src={post.author.avatarUrl} name={post.author.name} size="sm" />
                  <div>
                    <p className="font-medium text-slate-700 leading-tight">{post.author.name}</p>
                    <p className="text-xs text-slate-400 leading-tight">@{post.author.username}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 max-w-[280px]">
                <p className="text-slate-600 truncate">{post.excerpt}</p>
                {post.imageCount > 0 && (
                  <p className="text-xs text-slate-400">{post.imageCount} ảnh/video</p>
                )}
              </td>
              <td className="px-5 py-3 text-center text-slate-600">{post.commentCount}</td>
              <td className="px-5 py-3 text-center text-slate-600">{post.likeCount}</td>
              <td className="px-5 py-3 text-center">
                {post.reportCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                    <Flag size={12} /> {post.reportCount}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={post.status} />
              </td>
              <td className="px-5 py-3 text-slate-500">{post.createdAt}</td>
              <td className="px-5 py-3">
                <RowMenu
                  post={post}
                  onViewDetail={onViewDetail}
                  onToggleVisibility={onToggleVisibility}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}