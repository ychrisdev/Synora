"use client";

import { User, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Clock,
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
  const diffHours = Math.floor(diffMins / 60);
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

const HISTORY_KEY = (userId: string) => `synora_search_history_${userId}`;
const MAX_HISTORY = 10;

function loadHistory(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY(userId)) ?? "[]");
  } catch {
    return [];
  }
}

function saveToHistory(query: string, userId: string) {
  if (!query.trim()) return;
  const prev = loadHistory(userId).filter(
    (h) => h.toLowerCase() !== query.toLowerCase(),
  );
  const next = [query, ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY(userId), JSON.stringify(next));
}

function removeFromHistory(query: string, userId: string) {
  const next = loadHistory(userId).filter(
    (h) => h.toLowerCase() !== query.toLowerCase(),
  );
  localStorage.setItem(HISTORY_KEY(userId), JSON.stringify(next));
}

function clearHistory(userId: string) {
  localStorage.setItem(HISTORY_KEY(userId), JSON.stringify([]));
}

const CATEGORY_TABS: {
  label: string;
  tab: string;
  isTopic?: boolean;
}[] = [
  { label: "Tài liệu", tab: "documents" },
  { label: "Bài viết", tab: "posts" },
  { label: "Mọi người", tab: "people" },
  { label: "Nhóm", tab: "groups" },
  { label: "Chủ đề", tab: "topics", isTopic: true },
];

function SearchDropdown({
  query,
  history,
  onRemoveHistory,
  onClearHistory,
  onSelect,
  onSelectHistory,
}: {
  query: string;
  history: string[];
  onRemoveHistory: (q: string) => void;
  onClearHistory: () => void;
  onSelect: () => void;
  onSelectHistory: (q: string) => void;
}) {
  const hasQuery = query.trim().length > 0;
  const cleanQuery = query.startsWith("#") ? query.slice(1) : query;

  if (!hasQuery) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
        {history.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-slate-400">
            Chưa có lịch sử tìm kiếm
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={10} /> Tìm kiếm gần đây
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onClearHistory();
                }}
                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
            <div className="px-2 pb-2">
              {history.map((h) => (
                <div
                  key={h}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 group/item transition-colors"
                >
                  <Clock size={13} className="text-slate-300 shrink-0" />
                  <button
                    className="flex-1 text-left text-sm text-slate-700 truncate"
                    onClick={() => {
                      onSelectHistory(h);
                      onSelect();
                    }}
                  >
                    {h}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveHistory(h);
                    }}
                    className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-200 text-slate-400 shrink-0"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <Search size={14} className="text-slate-400 shrink-0" />
        <span className="flex-1 text-sm text-slate-800 font-medium truncate">
          {query}
        </span>
        <span className="text-[10px] text-slate-400 shrink-0">Tìm kiếm</span>
      </Link>

      <div className="px-2 py-1.5">
        <p className="text-[10px] font-semibold text-slate-400 px-2 mb-1 uppercase tracking-wider">
          Tìm theo danh mục
        </p>
        {CATEGORY_TABS.map(({ label, tab, isTopic }) => {
          const searchQ = isTopic ? `#${cleanQuery}` : query;
          const displaySuffix = isTopic ? `#${cleanQuery}` : `"${query}"`;

          return (
            <Link
              key={tab}
              href={`/search?q=${encodeURIComponent(searchQ)}&tab=${tab}`}
              onClick={onSelect}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 group/cat transition-colors"
            >
              <span className="text-sm text-slate-600">
                {label}{" "}
                <span className="text-slate-400 font-normal">
                  {displaySuffix}
                </span>
              </span>
              <span className="text-[10px] text-slate-300 opacity-0 group-hover/cat:opacity-100 transition-opacity shrink-0">
                ↵
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar({
  isLoggedIn = false,
  session,
  status,
}: {
  isLoggedIn?: boolean;
  session?: Session | null;
  status?: string;
}) {
  const router = useRouter();
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const displayName = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "";
  const avatarUrl = session?.user?.image;
  const userId = session?.user?.id ?? "guest";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
    setNotifs(
      initialNotifications.filter(
        (n) => new Date(n.createdAt).getTime() >= thirtyDaysAgo,
      ),
    );
  }, []);

  const refreshHistory = useCallback(() => {
    setHistory(loadHistory(userId));
  }, [userId]);

  useEffect(() => {
    if (searchFocused) refreshHistory();
  }, [searchFocused, refreshHistory]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchFocused(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setAvatarOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      saveToHistory(q.trim(), userId);
      setSearchFocused(false);
      setSearchQuery("");
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    },
    [router, userId],
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") doSearch(searchQuery);
      if (e.key === "Escape") setSearchFocused(false);
    },
    [searchQuery, doSearch],
  );

  const handleRemoveHistory = (q: string) => {
    removeFromHistory(q, userId);
    setHistory(loadHistory(userId));
  };

  const handleClearHistory = () => {
    clearHistory(userId);
    setHistory([]);
  };

  const handleDropdownSelect = () => {
    if (searchQuery.trim()) saveToHistory(searchQuery.trim(), userId);
    setSearchFocused(false);
    setSearchQuery("");
  };

  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center z-30">
      <Link
        href="/feed"
        className="flex items-center gap-2 w-[330px] shrink-0 px-4"
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

      <div className="flex-1 flex items-center px-18">
        <div ref={searchRef} className="w-full max-w-[520px] relative">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Tìm kiếm tài liệu, bài viết, nhóm học tập..."
              className={`w-full pl-9 pr-8 py-2 bg-slate-100 border rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-colors ${
                searchFocused
                  ? "border-blue-400 bg-white shadow-sm shadow-blue-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {searchFocused && (
            <SearchDropdown
              query={searchQuery}
              history={history}
              onRemoveHistory={handleRemoveHistory}
              onClearHistory={handleClearHistory}
              onSelect={handleDropdownSelect}
              onSelectHistory={doSearch}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-5 px-4 shrink-0">
        <Link
          href="/chat"
          className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-500 transition-colors block"
          title="Tin nhắn"
        >
          <MessageCircle size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Link>

        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className={`relative p-2.5 rounded-full cursor-pointer transition-colors ${
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
                <span className="text-sm font-bold text-slate-900">
                  Thông báo mới
                </span>
                <button
                  onClick={() => setBellOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
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
                href="/notifications"
                onClick={() => setBellOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3 border-t border-slate-200 text-xs font-semibold text-blue-500 hover:bg-blue-50/5 transition-colors"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>

        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        ) : isLoggedIn ? (
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={displayName}
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {initials}
                </div>
              )}
            </button>

            {avatarOpen && (
              <div className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      alt={displayName}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="p-1.5">
                  <Link
                    href={`/profile/${session?.user?.username}`}
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <User size={13} className="text-blue-500" />
                    </div>
                    <span className="text-sm text-slate-700">
                      Trang cá nhân
                    </span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Settings size={13} className="text-emerald-500" />
                    </div>
                    <span className="text-sm text-slate-700">Cài đặt</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setAvatarOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <LogOut size={13} className="text-red-500" />
                    </div>
                    <span className="text-sm text-red-500 font-medium">
                      Đăng xuất
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-full transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-colors shadow-sm shadow-blue-200"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
