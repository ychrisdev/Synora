"use client";

import { Flame, Clock, ArrowUp } from "lucide-react";
import { clsx } from "clsx";
import type { SortKey } from "@/lib/explore/types";

const SORT_OPTIONS = [
  { key: "hot",    label: "Nổi bật"},
  { key: "newest", label: "Mới nhất"},
] as const;

interface Props {
  active: SortKey;
  onChange: (key: SortKey) => void;
}

export default function ExploreSortBar({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 shrink-0 bg-surface-100 rounded-lg p-0.5">
      {SORT_OPTIONS.map(opt => {
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
              active === opt.key
                ? "bg-white text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}