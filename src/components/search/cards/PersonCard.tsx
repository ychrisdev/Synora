import Link from "next/link";
import type { SearchResult } from "@/lib/search/types";

export function PersonCard({ r }: { r: SearchResult }) {
  return (
    <Link
      href={r.href}
      className="group flex items-center gap-3 p-4 rounded-xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all"
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${r.avatarColor}`}
      >
        {r.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
          {r.title}
        </p>
        <p className="text-xs text-text-secondary">{r.subtitle}</p>
        <p className="text-[11px] text-text-muted mt-0.5">{r.meta}</p>
      </div>
      <button className="shrink-0 text-xs font-semibold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">
        Theo dõi
      </button>
    </Link>
  );
}