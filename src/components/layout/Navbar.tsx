"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  MessageCircle,
  X,
  ThumbsUp,
  MessageSquare,
  FileText,
  Users,
  Trophy,
  Share2,
} from "lucide-react";

export type NotifType =
  | "like"
  | "comment"
  | "milestone"
  | "invite"
  | "award"
  | "share"
  | "group";

export interface NotifItem {
  id: number;
  avatars: string[];
  avatarColors: string[];
  text: string;
  sub?: string;
  createdAt: string;
  unread: boolean;
  type: NotifType;
  action?: { accept: string; decline: string } | null;
}

export const initialNotifications: NotifItem[] = [
  {
    id: 1,
    avatars: ["QA", "MT"],
    avatarColors: ["bg-violet-500", "bg-emerald-500"],
    text: "Quỳnh Anh, Minh Tuấn và 6 người khác đã thích bài viết của bạn",
    sub: "Tổng hợp bộ đề thi Hóa hữu cơ các năm 2020–2023",
    createdAt: new Date().toISOString(),
    unread: true,
    type: "like",
    action: null,
  },
  {
    id: 2,
    avatars: ["QA"],
    avatarColors: ["bg-violet-500"],
    text: "Trần Lê Quỳnh Anh đã trả lời bình luận của bạn",
    sub: '"Cảm ơn bạn! Mình cũng vướng phần tích phân bội này..."',
    createdAt: new Date().toISOString(),
    unread: true,
    type: "comment",
    action: null,
  },
  {
    id: 5,
    avatars: [],
    avatarColors: [],
    text: "Bạn được mời vào nhóm Câu lạc bộ Tiếng Anh",
    sub: "Mời bởi Trần Lê Quỳnh Anh · 2,400 thành viên",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    unread: true,
    type: "invite",
    action: { accept: "Chấp nhận", decline: "Từ chối" },
  },
  {
    id: 8,
    avatars: ["NA"],
    avatarColors: ["bg-blue-500"],
    text: "Nguyễn Đức Tuấn đã chia sẻ tài liệu của bạn",
    sub: "Đề cương Giải Tích 1 chi tiết",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    unread: false,
    type: "share",
    action: null,
  },
  {
    id: 10,
    avatars: ["TH"],
    avatarColors: ["bg-orange-500"],
    text: "Thông báo này quá hạn 35 ngày",
    sub: "Sẽ tự động bị ẩn đi khỏi danh sách",
    createdAt: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(),
    unread: false,
    type: "comment",
    action: null,
  },
];

const typeConfig: Record<
  NotifType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  like: { icon: ThumbsUp, bg: "bg-rose-50", color: "text-rose-500" },
  comment: { icon: MessageSquare, bg: "bg-blue-50", color: "text-blue-500" },
  milestone: { icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
  invite: { icon: Users, bg: "bg-emerald-50", color: "text-emerald-500" },
  award: { icon: Trophy, bg: "bg-yellow-50", color: "text-yellow-500" },
  share: { icon: Share2, bg: "bg-violet-50", color: "text-violet-500" },
  group: { icon: Users, bg: "bg-teal-50", color: "text-teal-500" },
};

export function formatVietnameseTime(isoString: string) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60000);
  if (diffMins < 60) return `${diffMins || 1} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return new Date(isoString).toLocaleDateString("vi-VN");
}

export function NotifRow({
  notif,
  compact = false,
}: {
  notif: NotifItem;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">(
    "pending",
  );
  const { icon: Icon, bg, color } = typeConfig[notif.type];

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl cursor-pointer transition-all duration-150 ${compact ? "px-3 py-2.5 hover:bg-slate-50" : "px-4 py-3.5 hover:bg-slate-50/80"} ${notif.unread ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}`}
    >
      <div className="shrink-0 mt-0.5">
        {notif.avatars.length > 0 ? (
          <div className="flex -space-x-2">
            {notif.avatars.slice(0, 2).map((av, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white ${notif.avatarColors[i]}`}
              >
                {av}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
          >
            <Icon size={15} className={color} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug text-slate-700 ${notif.unread ? "font-medium text-slate-900" : ""}`}
        >
          {notif.text}
        </p>
        {notif.sub && (
          <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.sub}</p>
        )}
        <p
          className={`text-[11px] mt-1 ${notif.unread ? "text-blue-500 font-medium" : "text-slate-400"}`}
        >
          {formatVietnameseTime(notif.createdAt)}
        </p>

        {notif.action && !compact && (
          <div className="flex items-center gap-2 mt-2.5">
            {status === "accepted" ? (
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">
                Đã chấp nhận
              </span>
            ) : status === "declined" ? (
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                Đã từ chối
              </span>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus("accepted");
                  }}
                  className="text-xs font-semibold text-white bg-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {notif.action.accept}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus("declined");
                  }}
                  className="text-xs font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {notif.action.decline}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {notif.unread && (
        <div className="shrink-0 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full block" />
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
    const activeNotifs = initialNotifications.filter(
      (n) => new Date(n.createdAt).getTime() >= thirtyDaysAgo,
    );
    setNotifs(activeNotifs);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 z-30">
      <Link
        href="/main/feed"
        className="flex items-center gap-2 w-[220px] shrink-0"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="9" cy="9" r="2" fill="white" />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          Synora
        </span>
      </Link>

      <div className="flex-1 max-w-[480px]">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, bài viết, nhóm học tập..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <Link
          href="/main/chat"
          className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-500 transition-colors block"
          title="Tin nhắn"
        >
          <MessageCircle size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Link>

        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className={`relative p-2.5 rounded-full transition-colors ${
              bellOpen
                ? "bg-blue-50 text-blue-500"
                : "hover:bg-slate-100 text-slate-600 hover:text-blue-500"
            }`}
            title="Thông báo"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full border border-white flex items-center justify-center px-1 shadow-sm">
                <span className="text-[9px] font-bold text-white leading-none">
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Thông báo mới
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBellOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto py-1">
                {notifs.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    Không có thông báo nào trong 30 ngày qua
                  </p>
                ) : (
                  notifs
                    .slice(0, 5)
                    .map((notif) => (
                      <NotifRow key={notif.id} notif={notif} compact />
                    ))
                )}
              </div>

              <Link
                href="/main/notifications"
                onClick={() => setBellOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3 border-t border-slate-200 text-xs font-semibold text-blue-500 hover:bg-blue-50/5 transition-colors"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/main/profile"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            NA
          </div>
        </Link>
      </div>
    </header>
  );
}
