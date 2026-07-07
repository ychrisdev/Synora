"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  ImageOff,
  KeyRound,
  Clock,
  Ban,
  Undo2,
  History,
  Flag,
} from "lucide-react";
import { useOutsideClickRefs } from "@/lib/chat/hooks";
import type { AdminUserRow } from "./UsersTable";

export function UserActionsMenu({
  user,
  onClose,
  onViewDetail,
  onGrantRole,
  onResetAvatar,
  onForcePasswordChange,
  onSuspend,
  onBan,
  onUnban,
}: {
  user: AdminUserRow;
  onClose: () => void;
  onViewDetail: () => void;
  onGrantRole: () => void;
  onResetAvatar: () => void;
  onForcePasswordChange: () => void;
  onSuspend: () => void;
  onBan: () => void;
  onUnban: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClickRefs([ref], onClose);

  const isLocked = user.status === "SUSPENDED" || user.status === "BANNED";

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-20 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden"
    >
      <button
        onClick={onViewDetail}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <User size={13} className="text-slate-400 shrink-0" />
        Xem hồ sơ chi tiết
      </button>
      <Link
        href={`/profile/${user.username}`}
        target="_blank"
        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <User size={13} className="text-slate-400 shrink-0" />
        Xem trang cá nhân
      </Link>

      <div className="h-px bg-slate-100 my-0.5" />

      <button
        onClick={onGrantRole}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ShieldCheck size={13} className="text-slate-400 shrink-0" />
        Cấp quyền
      </button>
      <button
        onClick={onResetAvatar}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ImageOff size={13} className="text-slate-400 shrink-0" />
        Reset ảnh đại diện
      </button>
      <button
        onClick={onForcePasswordChange}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <KeyRound size={13} className="text-slate-400 shrink-0" />
        Buộc đổi mật khẩu
      </button>

      <div className="h-px bg-slate-100 my-0.5" />

      {isLocked ? (
        <button
          onClick={onUnban}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <Undo2 size={13} className="shrink-0" />
          Mở khóa
        </button>
      ) : (
        <>
          <button
            onClick={onSuspend}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Clock size={13} className="shrink-0" />
            Tạm khóa
          </button>
          <button
            onClick={onBan}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
          >
            <Ban size={13} className="shrink-0" />
            Khóa vĩnh viễn
          </button>
        </>
      )}
    </div>
  );
}