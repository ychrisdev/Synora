import Link from "next/link";
import { FileText, Download, Eye, Star } from "lucide-react";
import type { SearchResult } from "@/lib/search/types";

export function DocumentCard({ r }: { r: SearchResult }) {
  return (
    <Link
      href={r.href}
      className="group flex gap-4 p-4 rounded-xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all"
    >
      <div className="shrink-0 w-11 h-13 bg-primary/10 rounded-lg flex items-center justify-center text-primary mt-0.5">
        <FileText size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
          {r.title}
        </h3>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{r.subtitle}</p>
        <p className="text-[11px] text-text-muted mt-1">{r.meta}</p>
        {r.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {r.tags.map((t) => (
              <span key={t} className="text-[10px] font-medium bg-primary/8 text-primary px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
        {r.stats && (
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[11px] text-text-muted">
              <Download size={11} /> {r.stats[0].value} {r.stats[0].label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-muted">
              <Eye size={11} /> {r.stats[1].value} {r.stats[1].label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-500">
              <Star size={11} className="fill-amber-400" /> {r.stats[2].value}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}