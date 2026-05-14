"use client";

import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ExploreSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Tìm bài viết, chủ đề, người dùng..."
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-surface-200 rounded-xl text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}