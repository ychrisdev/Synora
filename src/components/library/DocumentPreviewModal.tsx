"use client";

import { useEffect, useRef } from "react";
import { X, Download, ExternalLink, Download as DownloadIcon } from "lucide-react";
import clsx from "clsx";
import { FILE_TYPE_COLORS } from "@/lib/library/data";
import DocumentPreviewContent from "./DocumentPreviewContent";
import type { Document } from "@/lib/library/types";

interface DocumentPreviewModalProps {
  doc: Document;
  onClose: () => void;
}

export default function DocumentPreviewModal({ doc, onClose }: DocumentPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Xem trước: ${doc.title}`}
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        "animate-in fade-in duration-200",
        "sm:p-6"
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={clsx(
          "relative flex flex-col bg-white shadow-2xl overflow-hidden",
          "w-full max-w-3xl max-h-[90vh]",
          "rounded-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
          "max-sm:fixed max-sm:inset-0 max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-200 shrink-0">
          <div className={clsx(
            "w-9 h-9 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0",
            FILE_TYPE_COLORS[doc.type]
          )}>
            {doc.type}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-text-primary truncate leading-snug">
              {doc.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] px-2 py-0.5 bg-surface-100 rounded-full text-text-secondary font-medium">
                {doc.subject}
              </span>
              <span className={clsx(
                "text-[11px] px-2 py-0.5 rounded-full font-semibold text-white",
                FILE_TYPE_COLORS[doc.type]
              )}>
                {doc.type}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Đóng xem trước"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-surface-50 min-h-0">
          <DocumentPreviewContent doc={doc} onDownload={() => {}} />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-surface-200 shrink-0 bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className={clsx(
              "w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0",
              doc.author.color
            )}>
              {doc.author.initials}
            </div>
            <span className="text-xs text-text-secondary truncate">{doc.author.name}</span>
            <span className="text-text-muted text-xs shrink-0">·</span>
            <span className="text-xs text-text-muted shrink-0">{doc.date}</span>
            <span className="text-text-muted text-xs shrink-0">·</span>
            <span className="text-xs text-text-muted shrink-0 flex items-center gap-1">
              <DownloadIcon size={10} />
              {doc.downloads}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              aria-label="Mở tài liệu đầy đủ"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-secondary border border-surface-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
            >
              <ExternalLink size={12} />
              Mở đầy đủ
            </button>
            <button
              aria-label="Tải xuống tài liệu"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download size={12} />
              Tải xuống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}