"use client";

import { X, Flag } from "lucide-react";

export default function ReportPostModal({
  postId,
  onClose,
}: {
  postId: string | number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Flag size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Báo cáo bài viết</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Cảm ơn bạn đã giúp cộng đồng an toàn hơn.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-surface-200 text-sm text-text-secondary hover:bg-surface-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-orange-500 text-sm text-white font-medium hover:bg-orange-600 transition-colors"
          >
            Báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}