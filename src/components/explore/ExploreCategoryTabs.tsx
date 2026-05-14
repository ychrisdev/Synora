"use client";

import { clsx } from "clsx";
import { CATEGORY_TABS } from "@/lib/explore/data";

interface Props {
  active: string;
  onChange: (tab: string) => void;
}

export default function ExploreCategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
      {CATEGORY_TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
            active === tab
              ? "bg-primary text-white shadow-sm"
              : "bg-white border border-surface-200 text-text-secondary hover:border-primary hover:text-primary",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}