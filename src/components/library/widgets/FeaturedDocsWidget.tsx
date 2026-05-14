import { Download } from "lucide-react";
import clsx from "clsx";
import { FEATURED_DOCS } from "@/lib/library/data";

export default function FeaturedDocsWidget() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Tài liệu nổi bật</h3>
      </div>
      <div className="flex flex-col gap-2">
        {FEATURED_DOCS.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 py-1 cursor-pointer group">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0",
              doc.color,
            )}>
              {doc.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {doc.title}
              </p>
              <p className="text-[10px] text-text-muted flex items-center gap-1">
                <Download size={9} /> {doc.downloads} lượt tải
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}