"use client";

import { SlidersHorizontal, X, Check } from "lucide-react";
import { FILTER_CONFIG } from "@/lib/search/data";
import type { TabKey } from "@/lib/search/types";

interface Props {
  tab: TabKey;
  activeFilters: Record<string, string[]>;
  onToggle: (group: string, value: string) => void;
  onClear: () => void;
}

export function FilterPanel({ tab, activeFilters, onToggle, onClear }: Props) {
  const config = FILTER_CONFIG[tab];
  const totalActive = Object.values(activeFilters).flat().length;

  return (
    <div className="bg-white rounded-xl border border-surface-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-primary" />
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Bộ lọc
          </h3>
          {totalActive > 0 && (
            <span className="text-[10px] font-bold bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] text-rose-500 font-medium hover:text-rose-600 flex items-center gap-0.5"
          >
            <X size={10} /> Xóa tất cả
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {config.groups.map((group) => {
          const selected = activeFilters[group.label] ?? [];
          return (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.options.map((opt) => {
                  const isActive = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onToggle(group.label, opt)}
                      className={`flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-secondary hover:bg-surface-50 hover:text-text-primary"
                      }`}
                    >
                      <span>{opt}</span>
                      {isActive && <Check size={11} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}