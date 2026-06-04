"use client";

import { useState, useRef, useEffect } from "react";
import {
  Download,
  Eye,
  MoreHorizontal,
  Bookmark,
  Flag,
  BookmarkCheck,
} from "lucide-react";
import clsx from "clsx";
import { FILE_TYPE_COLORS } from "@/lib/library/data";
import type { Document } from "@/lib/library/types";

interface DocumentCardProps {
  doc: Document;
  isSaved: boolean;
  isLoggedIn: boolean;
  onToggleSave: (id: string) => void;
  onReport: (id: string) => void;
  onDownload?: () => void;
}

function getGoogleViewerUrl(fileUrl: string) {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`;
}

export default function DocumentCard({
  doc,
  isSaved,
  isLoggedIn,
  onToggleSave,
  onReport,
  onDownload,
}: DocumentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "save" | "unsave";
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const showToast = (msg: string, type: "save" | "unsave") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleSaveWithToast = () => {
    onToggleSave(doc.id);
    setMenuOpen(false);
    showToast(
      isSaved ? "Đã bỏ lưu tài liệu" : "Đã lưu tài liệu",
      isSaved ? "unsave" : "save",
    );
  };

  const handleDownload = async () => {
    try {
      await fetch(`/api/library/documents/${doc.id}/download`, {
        method: "POST",
      });
      onDownload?.();
    } catch {}

    try {
      const res = await fetch(doc.fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.title + "." + (doc.type?.toLowerCase() ?? "pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(doc.fileUrl, "_blank");
    }
  };

  const handlePreview = () => {
    const encoded = encodeURIComponent(doc.fileUrl);
    const type = doc.type?.toUpperCase();

    let viewerUrl: string;
    if (type === "PPTX" || type === "DOCX") {
      viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encoded}`;
    } else {
      viewerUrl = `https://docs.google.com/viewer?url=${encoded}`;
    }

    window.open(viewerUrl, "_blank");
  };

  const displayName =
    doc.uploader.profile?.displayName ?? doc.uploader.username;
  const initials = displayName.slice(0, 2).toUpperCase();
  const typeColor = FILE_TYPE_COLORS[doc.type.toUpperCase()] ?? "bg-gray-500";
  const formattedDownloads =
    doc.downloadCount >= 1000
      ? `${(doc.downloadCount / 1000).toFixed(1)}k`
      : String(doc.downloadCount);
  const formattedDate = new Date(doc.createdAt).toLocaleDateString("vi-VN");

  return (
    <>
      <div className="bg-white rounded-xl border border-surface-200 shadow-card hover:border-primary/30 hover:shadow-md transition-all p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0",
              typeColor,
            )}
          >
            {doc.type.toUpperCase().slice(0, 4)}
          </div>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Tùy chọn"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-white border border-surface-200 rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleToggleSaveWithToast}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:bg-surface-50 hover:text-text-primary transition-colors"
                    >
                      {isSaved ? (
                        <BookmarkCheck size={14} className="text-primary" />
                      ) : (
                        <Bookmark size={14} />
                      )}
                      {isSaved ? "Bỏ lưu" : "Lưu tài liệu"}
                    </button>
                    <button
                      onClick={() => {
                        onReport(doc.id);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Flag size={14} />
                      Báo cáo
                    </button>
                  </>
                ) : (
                  <p className="px-3.5 py-2 text-xs text-text-muted">
                    Đăng nhập để dùng tính năng này
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-10 mb-3">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
            {doc.title}
          </h3>
        </div>

        <p className="text-xs text-text-muted line-clamp-2 mb-2 leading-relaxed min-h-[2rem]">
          {doc.description ?? ""}
        </p>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-text-secondary truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-text-muted">{formattedDate}</p>
          </div>
        </div>

        {doc.tags && doc.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 min-h-[1.5rem]">
            {doc.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-surface-100 rounded text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {doc.subject && (
              <span className="text-xs px-2 py-0.5 bg-surface-100 rounded-full text-text-secondary font-medium whitespace-nowrap">
                {doc.subject}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-text-muted whitespace-nowrap">
              <Download size={11} /> {formattedDownloads}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePreview}
              className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              <Eye size={12} />
              Xem trước
            </button>
            <button
              onClick={handleDownload}
              aria-label="Tải xuống"
              className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 bg-text-primary text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          {toast.type === "save" ? (
            <Bookmark size={13} />
          ) : (
            <BookmarkCheck size={13} />
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}
