"use client";

import { Upload, Search, Star, X } from "lucide-react";
import clsx from "clsx";
import { TYPE_TABS, SORT_OPTIONS } from "@/lib/library/data";
import type { SortKey, ViewMode } from "@/lib/library/types";
import SubjectTabs from "./SubjectTabs";

interface LibraryFiltersProps {
  query: string;
  setQuery: (v: string) => void;
  activeSubject: string;
  setActiveSubject: (v: string) => void;
  activeSort: SortKey;
  setActiveSort: (v: SortKey) => void;
  activeType: string;
  setActiveType: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  savedCount: number;
  onUpload: () => void;
}

export default function LibraryFilters({
  query, setQuery,
  activeSubject, setActiveSubject,
  activeSort, setActiveSort,
  activeType, setActiveType,
  viewMode, setViewMode,
  savedCount,
  onUpload,
}: LibraryFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tài liệu theo tên, môn học, tác giả..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-surface-200 rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Xoá từ khoá"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shrink-0"
        >
          <Upload size={14} />
          Tải lên
        </button>
      </div>

      <SubjectTabs activeSubject={activeSubject} onSelect={setActiveSubject} />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 border-b border-surface-200">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveType(tab)}
              className={clsx(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeType === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0 bg-surface-100 rounded-lg p-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setActiveSort(opt.key)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                activeSort === opt.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary",
              )}
            >
              {opt.label}
            </button>
          ))}
          <div className="w-px h-4 bg-surface-200 mx-0.5" />
          <button
            onClick={() => setViewMode(viewMode === "saved" ? "all" : "saved")}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
              viewMode === "saved"
                ? "bg-white text-yellow-500 shadow-sm"
                : "text-text-muted hover:text-text-secondary",
            )}
          >
            <Star size={12} fill={viewMode === "saved" ? "currentColor" : "none"} />
            Đã lưu {viewMode === "saved" && savedCount > 0 && `(${savedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}