"use client";

import { Search, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/chat/Badge";
import type { Conversation, FilterChip } from "@/lib/chat/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: number;
  onSelect: (id: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterChip;
  onFilterChange: (f: FilterChip) => void;
  totalUnread: number;
}

const FILTER_CHIPS: { key: FilterChip; label: string }[] = [
  { key: "all",    label: "Tất cả"  },
  { key: "unread", label: "Chưa đọc" },
  { key: "group",  label: "Nhóm"    },
];

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  totalUnread,
}: ConversationListProps) {
  return (
    <div className="w-[268px] shrink-0 border-r border-surface-200 bg-white flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-surface-100">
        <h2 className="text-base font-bold text-text-primary mb-3">Tin nhắn</h2>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-8 pr-3 py-2 bg-surface-100 rounded-lg text-xs placeholder:text-text-muted focus:outline-none border border-transparent focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-1.5 px-4 py-2.5 border-b border-surface-100">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onFilterChange(chip.key)}
            className={clsx(
              "px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors",
              activeFilter === chip.key
                ? "bg-primary text-white"
                : "bg-surface-100 text-text-muted hover:bg-surface-200",
            )}
          >
            {chip.label}
            {chip.key === "unread" && totalUnread > 0 && activeFilter !== "unread" && (
              <span className="ml-1 text-[9px] text-amber-600 font-bold">{totalUnread}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 gap-2">
            <MessageSquare size={28} className="text-surface-300" />
            <p className="text-xs text-text-muted text-center">
              {activeFilter === "unread"
                ? "Không có tin nhắn chưa đọc"
                : activeFilter === "group"
                ? "Không có nhóm nào"
                : "Không tìm thấy cuộc trò chuyện"}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => onFilterChange("all")}
                className="text-[10px] text-primary font-semibold hover:underline"
              >
                Xem tất cả
              </button>
            )}
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                activeId === conv.id ? "bg-primary/10" : "hover:bg-surface-50",
              )}
            >
              <div className="relative shrink-0">
                <Avatar initials={conv.initials} color={conv.color} size="md" shape="circle" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={clsx("text-xs truncate", conv.unread > 0 ? "font-bold text-text-primary" : "font-semibold text-text-primary")}>
                    {conv.name}
                  </p>
                  <span className={clsx("text-[10px] shrink-0 ml-1", conv.unread > 0 ? "text-primary font-semibold" : "text-text-muted")}>
                    {conv.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={clsx("text-[11px] truncate", conv.unread > 0 ? "text-text-secondary font-medium" : "text-text-muted")}>
                    {conv.lastMessage}
                  </p>
                  <Badge count={conv.unread} variant="unread" size="md" className="ml-1" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}