import { Star, Download, Eye } from "lucide-react";
import clsx from "clsx";
import { FILE_TYPE_COLORS } from "@/lib/library/data";
import type { Document } from "@/lib/library/types";

interface DocumentCardProps {
  doc: Document;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onPreview: (doc: Document) => void;
}

export default function DocumentCard({ doc, isSaved, onToggleSave, onPreview }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card hover:border-primary/30 hover:shadow-md transition-all p-4 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx(
          "w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0",
          FILE_TYPE_COLORS[doc.type],
        )}>
          {doc.type}
        </div>
        <button
          onClick={() => onToggleSave(doc.id)}
          aria-label={isSaved ? "Bỏ lưu tài liệu" : "Lưu tài liệu"}
          className={clsx(
            "p-1.5 rounded-lg transition-colors shrink-0",
            isSaved ? "text-yellow-500" : "text-text-muted hover:text-yellow-500",
          )}
        >
          <Star size={15} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="h-10 mb-3">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
          {doc.title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <div className={clsx(
          "w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
          doc.author.color,
        )}>
          {doc.author.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-secondary truncate">{doc.author.name}</p>
          <p className="text-[10px] text-text-muted">{doc.date}</p>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs px-2 py-0.5 bg-surface-100 rounded-full text-text-secondary font-medium whitespace-nowrap">
            {doc.subject}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted whitespace-nowrap">
            <Download size={11} /> {doc.downloads}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onPreview(doc)}
            aria-label={`Xem trước: ${doc.title}`}
            className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Eye size={12} />
            Xem thử
          </button>
          <button
            aria-label={`Tải xuống: ${doc.title}`}
            className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}