import Link from "next/link";
import type { SearchResult } from "@/lib/search/types";

export function GroupCard({ r }: { r: SearchResult }) {
  return (
    <Link
      href={r.href}
      className="group flex items-center gap-3 p-4 rounded-xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${r.avatarColor}`}
      >
        {r.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
          {r.title}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1">{r.subtitle}</p>
        <p className="text-[11px] text-text-muted mt-0.5">{r.meta}</p>
      </div>
      <button className="shrink-0 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-all">
        Tham gia
      </button>
    </Link>
  );
}