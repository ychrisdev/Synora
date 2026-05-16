"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  User, Clock, BanIcon, Settings, HelpCircle,
  LogOut, ChevronRight, Bell, MessageSquare,
  ArrowLeft, Inbox,
} from "lucide-react";
import { clsx } from "clsx";
import { useOutsideClick } from "@/lib/chat/hooks";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Avatar } from "@/components/ui/Avatar";
import { PillBadge } from "./Badge";
import { pendingMessages, blockedUsers, ME } from "@/lib/chat/data";
import type { AvatarMenuPanel } from "@/lib/chat/type";

export function AvatarMenu() {
  const [open,  setOpen]  = useState(false);
  const [panel, setPanel] = useState<AvatarMenuPanel>("main");
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => { setOpen(false); setPanel("main"); });

  const closeMenu = () => { setOpen(false); setPanel("main"); };

  return (
    <div ref={ref} className="relative w-full flex flex-col items-center">
      <button
        onClick={() => { setOpen((v) => !v); setPanel("main"); }}
        className={clsx(
          "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all",
          ME.color,
          open
            ? "ring-2 ring-primary/40 ring-offset-1"
            : "hover:opacity-90 hover:ring-2 hover:ring-primary/20 hover:ring-offset-1",
        )}
      >
        {ME.initials}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-64 bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden z-50">

          {panel === "main" && (
            <>
              <div className="px-4 py-3.5 border-b border-surface-100 flex items-center gap-3">
                <Avatar initials={ME.initials} color={ME.color} size="md" shape="circle" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{ME.name}</p>
                  <p className="text-xs text-green-700 font-medium">Đang hoạt động</p>
                </div>
              </div>

              <div className="py-1">
                <Link href="/main/profile" onClick={closeMenu} className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
                  <User size={14} className="text-text-muted shrink-0" />
                  Trang cá nhân
                </Link>

                <button
                  onClick={() => setPanel("pending")}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
                >
                  <Clock size={14} className="text-text-muted shrink-0" />
                  Tin nhắn chờ
                  <PillBadge count={pendingMessages.length} variant="pending" className="ml-auto" />
                  <ChevronRight size={12} className="text-text-muted" />
                </button>

                <button
                  onClick={() => setPanel("blocked")}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
                >
                  <BanIcon size={14} className="text-text-muted shrink-0" />
                  Danh sách chặn
                  <PillBadge count={blockedUsers.length} variant="blocked" className="ml-auto" />
                  <ChevronRight size={12} className="text-text-muted" />
                </button>

                <button
                  onClick={() => setPanel("settings")}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
                >
                  <Settings size={14} className="text-text-muted shrink-0" />
                  Cài đặt
                  <ChevronRight size={12} className="text-text-muted ml-auto" />
                </button>

                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
                  <HelpCircle size={14} className="text-text-muted shrink-0" />
                  Trợ giúp
                </button>
              </div>

              <div className="border-t border-surface-100 py-1">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={14} className="shrink-0" />
                  Đăng xuất
                </button>
              </div>
            </>
          )}

          {panel === "pending" && (
            <>
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-surface-100">
                <button onClick={() => setPanel("main")} className="p-1 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
                  <ArrowLeft size={14} />
                </button>
                <p className="text-sm font-bold text-text-primary">Tin nhắn chờ</p>
                <PillBadge count={pendingMessages.length} variant="pending" className="ml-auto" />
              </div>
              <div className="py-2">
                {pendingMessages.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2 text-text-muted">
                    <Inbox size={28} className="opacity-40" />
                    <p className="text-xs">Không có tin nhắn chờ</p>
                  </div>
                ) : (
                  pendingMessages.map((msg) => (
                    <div key={msg.id} className="px-4 py-3 hover:bg-surface-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", msg.color)}>
                          {msg.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-bold text-text-primary">{msg.sender}</p>
                            <p className="text-[10px] text-text-muted shrink-0 ml-2">{msg.time}</p>
                          </div>
                          <p className="text-[11px] text-text-muted truncate">{msg.content}</p>
                          <div className="flex gap-1.5 mt-2">
                            <button className="px-2.5 py-1 bg-primary text-white text-[10px] font-semibold rounded-full hover:bg-primary-700 transition-colors">
                              Chấp nhận
                            </button>
                            <button className="px-2.5 py-1 bg-surface-100 text-text-secondary text-[10px] font-semibold rounded-full hover:bg-surface-200 transition-colors">
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {panel === "blocked" && (
            <>
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-surface-100">
                <button onClick={() => setPanel("main")} className="p-1 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
                  <ArrowLeft size={14} />
                </button>
                <p className="text-sm font-bold text-text-primary">Danh sách chặn</p>
                <PillBadge count={blockedUsers.length} variant="blocked" className="ml-auto" />
              </div>
              <div className="py-2">
                {blockedUsers.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2 text-text-muted">
                    <BanIcon size={28} className="opacity-40" />
                    <p className="text-xs">Chưa chặn ai</p>
                  </div>
                ) : (
                  blockedUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors group">
                      <Avatar initials={u.initials} color={u.color} size="md" shape="circle" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary">{u.name}</p>
                        <p className="text-[10px] text-text-muted">{u.blockedAt}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-surface-100 text-text-secondary text-[10px] font-semibold rounded-full hover:bg-surface-200 transition-all">
                        Bỏ chặn
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {panel === "settings" && (
            <>
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-surface-100">
                <button onClick={() => setPanel("main")} className="p-1 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
                  <ArrowLeft size={14} />
                </button>
                <p className="text-sm font-bold text-text-primary">Cài đặt</p>
              </div>
              <div className="py-2">
                {[
                  { label: "Thông báo đẩy",     desc: "Nhận thông báo tin nhắn mới",  icon: <Bell size={13} className="text-primary" />,         val: true  },
                  { label: "Âm thanh",           desc: "Phát âm khi có tin nhắn",      icon: <Bell size={13} className="text-amber-500" />,        val: true  },
                  { label: "Xem trước tin nhắn", desc: "Hiện nội dung ở thông báo",   icon: <MessageSquare size={13} className="text-teal-500" />, val: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                      <p className="text-[10px] text-text-muted">{item.desc}</p>
                    </div>
                    <ToggleSwitch checked={item.val} onChange={() => {}} />
                  </div>
                ))}
                <div className="h-px bg-surface-100 my-1 mx-4" />
                {[
                  { label: "Ngôn ngữ", value: "Tiếng Việt" },
                  { label: "Chủ đề",   value: "Sáng"       },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center shrink-0">
                      <Settings size={13} className="text-text-muted" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-text-primary">{item.label}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-text-muted">{item.value}</span>
                      <ChevronRight size={12} className="text-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}