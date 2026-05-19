import { BookOpen, Download } from "lucide-react";
import { profileData } from "@/lib/profile/data";

export function RecentDocsWidget() {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-semibold text-text-primary">Tài liệu gần đây</h3>
        <button className="text-[11px] text-primary font-medium hover:text-primary-700 transition-colors">
          Tất cả
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        {profileData.recentDocs.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-surface-50 cursor-pointer group transition-colors"
          >
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen size={12} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {doc.name}
              </p>
              <p className="text-[10px] text-text-muted">
                {doc.pages} · {doc.downloads} lượt tải
              </p>
            </div>
            <Download size={11} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}