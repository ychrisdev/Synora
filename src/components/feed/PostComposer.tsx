"use client";

import { FileText, Image } from "lucide-react";

export default function PostComposer() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
          NA
        </div>
        <input
          type="text"
          placeholder="Chia sẻ câu hỏi hoặc tài liệu học tập của bạn..."
          className="flex-1 bg-surface-100 rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted border border-transparent focus:outline-none focus:border-primary focus:bg-white transition-colors"
        />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
            <FileText size={16} className="text-red-500" />
            Tài liệu
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary rounded-lg hover:bg-surface-100 transition-colors">
            <Image size={16} className="text-green-500" />
            Hình ảnh
          </button>
        </div>
        <button className="px-5 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          Đăng bài
        </button>
      </div>
    </div>
  );
}
