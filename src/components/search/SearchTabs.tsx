"use client";

import { TAB_CONFIG } from "@/lib/search/data";
import type { TabKey } from "@/lib/search/types";
import { SortDropdown } from "@/components/search/SortDropdown";

interface Props {
  activeTab: TabKey;
  tabCounts: Partial<Record<TabKey, number>>;
  sortBy: string;
  onTabChange: (tab: TabKey) => void;
  onSortChange: (value: string) => void;
}

export function SearchTabs({
  activeTab,
  tabCounts,
  sortBy,
  onTabChange,
  onSortChange,
}: Props) {
  return (
    <div className="sticky top-14 z-20 bg-white border-b border-surface-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {TAB_CONFIG.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
                {tabCounts[tab.key] !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.key
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-100 text-text-muted"
                    }`}
                  >
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="shrink-0 pl-4">
            <SortDropdown value={sortBy} onChange={onSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
}