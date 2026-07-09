"use client";
import { useRef } from "react";
import Link from "next/link";
import { Eye, ExternalLink, Lock, Unlock, Trash2 } from "lucide-react";
import { useOutsideClickRefs } from "@/lib/chat/hooks";
import type { AdminGroupRow } from "./GroupsTable";

export function GroupActionsMenu({
  group,
  onClose,
  onViewDetail,
  onLock,
  onUnlock,
  onDelete,
}: {
  group: AdminGroupRow;
  onClose: () => void;
  onViewDetail: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClickRefs([ref], onClose);

  const isLocked = group.status === "LOCKED";

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-20 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden"
    >
      <button
        onClick={onViewDetail}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Eye size={13} className="text-slate-400 shrink-0" />
        Xem chi tiết
      </button>
      <Link
        href={`/community?group=${group.slug}`}
        target="_blank"
        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <ExternalLink size={13} className="text-slate-400 shrink-0" />
        Xem trang nhóm
      </Link>

      <div className="h-px bg-slate-100 my-0.5" />

      {isLocked ? (
        <button
          onClick={onUnlock}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          <Unlock size={13} className="shrink-0" />
          Mở khóa nhóm
        </button>
      ) : (
        <button
          onClick={onLock}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-amber-600 hover:bg-amber-50 transition-colors"
        >
          <Lock size={13} className="shrink-0" />
          Khóa nhóm
        </button>
      )}

      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={13} className="shrink-0" />
        Xóa nhóm
      </button>
    </div>
  );
}