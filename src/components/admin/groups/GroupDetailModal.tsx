"use client";
import { X, Users as UsersIcon, FileText, Calendar, Globe, Lock as LockIcon } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import type { AdminGroupRow } from "./GroupsTable";

export function GroupDetailModal({
  group,
  onClose,
}: {
  group: AdminGroupRow;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Chi tiết nhóm</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <Avatar
              src={group.avatarUrl ?? undefined}
              initials={group.name.slice(0, 2).toUpperCase()}
              size="lg"
              shape="rounded"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{group.name}</p>
              <p className="text-xs text-slate-400 truncate">Chủ nhóm: {group.ownerName} (@{group.ownerUsername})</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-5">{group.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <UsersIcon size={13} />
                <span className="text-[11px] font-medium">Thành viên</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{group.memberCount}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FileText size={13} />
                <span className="text-[11px] font-medium">Bài viết</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{group.postCount}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                {group.privacy === "PUBLIC" ? <Globe size={13} /> : <LockIcon size={13} />}
                <span className="text-[11px] font-medium">Quyền riêng tư</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Calendar size={13} />
                <span className="text-[11px] font-medium">Ngày tạo</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{group.createdAt}</p>
            </div>
          </div>

          <div
            className={clsx(
              "text-xs font-medium px-3.5 py-2.5 rounded-xl text-center",
              group.status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600",
            )}
          >
            {group.status === "ACTIVE" ? "Nhóm đang hoạt động" : "Nhóm đã bị khóa"}
          </div>
        </div>
      </div>
    </div>
  );
}