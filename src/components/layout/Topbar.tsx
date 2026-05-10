"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-surface-200 flex items-center px-4 gap-4 z-30">
      {/* Logo */}
      <Link href="/main/feed" className="flex items-center gap-2 w-[220px] shrink-0">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="9" cy="9" r="2" fill="white" />
          </svg>
        </div>
        <span className="text-lg font-bold text-text-primary tracking-tight">Synora</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, bài viết, nhóm học tập..."
            className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-surface-200 rounded-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-full hover:bg-surface-100 transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-primary leading-tight">Nguyễn Văn An</p>
            <p className="text-xs text-primary">Học sinh</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            NA
          </div>
        </div>
      </div>
    </header>
  );
}
