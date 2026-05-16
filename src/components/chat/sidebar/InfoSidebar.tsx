"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  X, Bell, BellOff, Users, ChevronRight, ShieldAlert,
  LogOut, Flag, Download, User, MoreHorizontal,
  MessageSquare, PhoneCall, VideoIcon, BanIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Avatar } from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/chat/RoleBadge";
import { useOutsideClick } from "@/lib/chat/hooks";
import { groupMembers, sharedImages, sharedFiles } from "@/lib/chat/data";
import type { Conversation, Member, ConfirmAction } from "@/lib/chat/type";

function MediaModal({ tab: init, onClose }: { tab: "images" | "files"; onClose: () => void }) {
  const [tab, setTab] = useState<"images" | "files">(init);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[380px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <p className="text-sm font-bold text-text-primary">Ảnh &amp; File đã chia sẻ</p>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
            <X size={15} />
          </button>
        </div>
        <div className="flex border-b border-surface-100 px-5">
          {(["images", "files"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "py-3 mr-7 text-xs font-semibold border-b-2 transition-colors",
                tab === t ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-secondary",
              )}
            >
              {t === "images" ? "Ảnh" : "File"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "images" ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={clsx("aspect-square rounded-xl cursor-pointer hover:opacity-80 transition-opacity", sharedImages[i % 6].bg)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[...sharedFiles, ...sharedFiles.slice(0, 2)].map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors group border border-surface-100">
                  <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shrink-0", f.color)}>
                    {f.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{f.name}</p>
                    <p className="text-[10px] text-text-muted">{f.size} · {f.date}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-200 rounded-lg transition-all">
                    <Download size={13} className="text-text-muted" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MemberMenu({ member, onClose }: { member: Member; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);
  const isMe = member.name.includes("Bạn");
  return (
    <div ref={ref} className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-50 overflow-hidden">
      {isMe ? (
        <div className="px-3 py-2 text-xs text-text-muted">Đây là bạn</div>
      ) : (
        <>
          <Link href="/main/profile" onClick={onClose} className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
            <User size={13} className="text-text-muted shrink-0" />Trang cá nhân
          </Link>
          {[
            { icon: <MessageSquare size={13} />, label: "Nhắn tin"       },
            { icon: <PhoneCall     size={13} />, label: "Gọi âm thanh"   },
            { icon: <VideoIcon     size={13} />, label: "Gọi video"      },
          ].map(({ icon, label }) => (
            <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
              <span className="text-text-muted shrink-0">{icon}</span>{label}
            </button>
          ))}
          <div className="h-px bg-surface-100 my-0.5" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
            <BanIcon size={13} className="shrink-0" />Chặn
          </button>
        </>
      )}
    </div>
  );
}

function MembersModal({ onClose }: { onClose: () => void }) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[320px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div>
            <p className="text-sm font-bold text-text-primary">Thành viên nhóm</p>
            <p className="text-xs text-text-muted mt-0.5">{groupMembers.length} thành viên</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {groupMembers.map((m, i) => (
            <div key={i} className="relative flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors group">
              <div className="relative shrink-0">
                <Avatar initials={m.initials} color={m.color} size="md" shape="circle" />
                {m.active && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary truncate">{m.name}</p>
                  <RoleBadge role={m.role} />
                </div>
                <p className="text-xs text-text-muted mt-0.5">{m.active ? "Đang hoạt động" : "Không hoạt động"}</p>
              </div>
              {!m.name.includes("Bạn") && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-200 rounded-lg transition-all text-text-muted"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === i && <MemberMenu member={m} onClose={() => setOpenMenu(null)} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface InfoSidebarProps {
  conv: Conversation;
  onClose: () => void;
}

export function InfoSidebar({ conv, onClose }: InfoSidebarProps) {
  const [notifOn,      setNotifOn]      = useState(true);
  const [mediaModal,   setMediaModal]   = useState<"images" | "files" | null>(null);
  const [membersOpen,  setMembersOpen]  = useState(false);
  const [confirm,      setConfirm]      = useState<ConfirmAction | null>(null);

  return (
    <>
      <div className="w-[280px] shrink-0 border-l border-surface-200 bg-white flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 shrink-0">
          <p className="text-sm font-bold text-text-primary">Thông tin</p>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col items-center pt-5 pb-4 px-4 border-b border-surface-100">
          <Avatar initials={conv.initials} color={conv.color} size="xl" shape="circle" />
          <p className="text-sm font-bold text-text-primary text-center">{conv.name}</p>
          {conv.isGroup ? (
            <p className="text-xs text-text-muted mt-0.5">Nhóm · {groupMembers.length} thành viên</p>
          ) : (
            <p className="text-xs text-green-500 mt-0.5 font-medium">● Đang hoạt động</p>
          )}
          {!conv.isGroup && (
            <Link
              href="/main/profile"
              className="mt-2.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1.5"
            >
              <User size={11} />Xem trang cá nhân
            </Link>
          )}
        </div>

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", notifOn ? "bg-primary/10" : "bg-surface-100")}>
                {notifOn ? <Bell size={14} className="text-primary" /> : <BellOff size={14} className="text-text-muted" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Thông báo</p>
                <p className="text-[11px] text-text-muted">{notifOn ? "Đang bật" : "Đã tắt"}</p>
              </div>
            </div>
            <ToggleSwitch checked={notifOn} onChange={() => setNotifOn((v) => !v)} />
          </div>
        </div>

        {conv.isGroup && (
          <div className="px-4 py-3 border-b border-surface-100">
            <button onClick={() => setMembersOpen(true)} className="w-full flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={14} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-text-primary">Thành viên</p>
                <p className="text-[11px] text-text-muted">{groupMembers.length} người</p>
              </div>
              <ChevronRight size={13} className="text-text-muted group-hover:text-text-secondary transition-colors" />
            </button>
          </div>
        )}

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-text-primary">Ảnh &amp; File</p>
            <button onClick={() => setMediaModal("images")} className="text-xs text-primary font-semibold hover:underline shrink-0">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {sharedImages.map((img) => (
              <div key={img.id} className={clsx("aspect-square rounded-lg cursor-pointer hover:opacity-75 transition-opacity", img.bg)} />
            ))}
          </div>
          <div className="h-px bg-surface-100 mb-2.5" />
          <div className="flex flex-col gap-1">
            {sharedFiles.slice(0, 2).map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-50 transition-colors group cursor-pointer">
                <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[8px] font-bold shrink-0", f.color)}>
                  {f.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{f.name}</p>
                  <p className="text-[11px] text-text-muted">{f.size} · {f.date}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-200 rounded-md transition-all shrink-0">
                  <Download size={11} className="text-text-muted" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">
            {conv.isGroup ? "Tuỳ chọn nhóm" : "Tuỳ chọn"}
          </p>
          {!conv.isGroup && (
            <button
              onClick={() => setConfirm("block")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                <ShieldAlert size={13} className="text-text-muted group-hover:text-red-500 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">Chặn người dùng</p>
                <p className="text-[11px] text-text-muted">Ngừng nhận tin từ người này</p>
              </div>
            </button>
          )}
          {conv.isGroup && (
            <button
              onClick={() => setConfirm("leave")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors shrink-0">
                <LogOut size={13} className="text-text-muted group-hover:text-orange-500 transition-colors" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-orange-500 transition-colors">Rời nhóm</p>
                <p className="text-[11px] text-text-muted">Bạn sẽ không nhận tin nhắn nữa</p>
              </div>
            </button>
          )}
          <button
            onClick={() => setConfirm("report")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
              <Flag size={13} className="text-text-muted group-hover:text-red-500 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">Báo cáo</p>
              <p className="text-[11px] text-text-muted">Gửi phản ánh đến quản trị viên</p>
            </div>
          </button>
        </div>
      </div>

      {mediaModal  && <MediaModal  tab={mediaModal} onClose={() => setMediaModal(null)}  />}
      {membersOpen && <MembersModal onClose={() => setMembersOpen(false)} />}

      {confirm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[70]" onClick={() => setConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl shadow-2xl z-[70] p-6">
            <p className="text-sm font-bold text-text-primary mb-1">
              {confirm === "block" ? "Chặn người dùng?" : confirm === "leave" ? "Rời nhóm?" : "Báo cáo?"}
            </p>
            <p className="text-xs text-text-muted mb-5">
              {confirm === "block"
                ? `Bạn sẽ không nhận được tin nhắn từ ${conv.name} nữa.`
                : confirm === "leave"
                ? `Bạn sẽ rời ${conv.name}. Cần được mời lại để tham gia tiếp.`
                : "Mô tả vấn đề sẽ giúp chúng tôi xử lý nhanh hơn."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-surface-200 text-xs font-semibold text-text-secondary hover:bg-surface-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => setConfirm(null)}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors",
                  confirm === "leave" ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600",
                )}
              >
                {confirm === "block" ? "Chặn" : confirm === "leave" ? "Rời nhóm" : "Báo cáo"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}