"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  BookOpen,
  MessageCircle,
  Bell,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/main/feed", icon: Home, label: "Trang chủ" },
  { href: "/main/explore", icon: Compass, label: "Khám phá" },
  { href: "/main/library", icon: BookOpen, label: "Tài liệu" },
  { href: "/main/chat", icon: MessageCircle, label: "Chat", badge: 3 },
  { href: "/main/notifications", icon: Bell, label: "Thông báo", badge: 18 },
  { href: "/main/community", icon: Users, label: "Cộng đồng" },
];

const groups = [
  { id: 1, name: "Luyện thi THPT Quốc gia", members: "12k", color: "bg-orange-500", initials: "LT" },
  { id: 2, name: "Hội yêu Toán học", members: "5.4k", color: "bg-blue-500", initials: "HT" },
  { id: 3, name: "Cộng đồng IELTS 7.0+", members: "8.2k", color: "bg-green-500", initials: "IE" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[220px] bg-white border-r border-surface-200 flex flex-col overflow-y-auto z-20">
      <nav className="flex flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-100 hover:text-text-primary"
              )}
            >
              <item.icon
                size={18}
                className={clsx(
                  isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pt-2 pb-1">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
          Nhóm học tập
        </p>
        <div className="flex flex-col gap-1">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/main/community`}
              className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold", group.color)}>
                {group.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{group.name}</p>
                <p className="text-[10px] text-text-muted">{group.members} thành viên</p>
              </div>
            </Link>
          ))}
        </div>
        <button className="mt-2 text-xs text-primary font-medium hover:underline px-1">
          Xem tất cả nhóm
        </button>
      </div>
    </aside>
  );
}
