import Link from "next/link";
import { Hash, ArrowUpRight } from "lucide-react";
import type { SearchResult } from "@/lib/search/types";

export function TopicCard({ r }: { r: SearchResult }) {
  return (
    <Link
      href={r.href}
      className="group flex items-center gap-3 p-4 rounded-xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Hash size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
          {r.title}
        </p>
        <p className="text-xs text-text-secondary">{r.subtitle}</p>
        <p className="text-[11px] text-text-muted mt-0.5">{r.meta}</p>
      </div>
      <ArrowUpRight size={14} className="shrink-0 text-text-muted group-hover:text-primary transition-colors" />
    </Link>
  );
}