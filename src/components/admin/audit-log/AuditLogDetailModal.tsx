"use client";
import { X } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { ACTION_GROUP, ACTION_LABELS, GROUP_BADGE, type AuditLogEntry } from "@/lib/audit-log/types";

export function AuditLogDetailModal({
  entry,
  onClose,
}: {
  entry: AuditLogEntry;
  onClose: () => void;
}) {
  const group = ACTION_GROUP[entry.action];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Chi tiết nhật ký</h3>
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
              src={entry.actor.avatarUrl ?? undefined}
              initials={entry.actor.name.slice(0, 2).toUpperCase()}
              size="lg"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{entry.actor.name}</p>
              <p className="text-xs text-slate-400 truncate">@{entry.actor.username} · {entry.actor.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <p className="text-[11px] font-medium text-slate-400 mb-1">Thao tác</p>
              <span
                className={clsx(
                  "inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full",
                  GROUP_BADGE[group],
                )}
              >
                {ACTION_LABELS[entry.action]}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl px-3.5 py-3">
              <p className="text-[11px] font-medium text-slate-400 mb-1">Đối tượng tác động</p>
              <p className="text-xs text-slate-700">{entry.targetLabel}</p>
            </div>

            {entry.detail && (
              <div className="bg-slate-50 rounded-xl px-3.5 py-3">
                <p className="text-[11px] font-medium text-slate-400 mb-1">Chi tiết</p>
                <p className="text-xs text-slate-600 leading-relaxed">{entry.detail}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl px-3.5 py-3">
                <p className="text-[11px] font-medium text-slate-400 mb-1">Địa chỉ IP</p>
                <p className="text-xs text-slate-700 font-mono">{entry.ipAddress}</p>
              </div>
              <div className="bg-slate-50 rounded-xl px-3.5 py-3">
                <p className="text-[11px] font-medium text-slate-400 mb-1">Thời gian</p>
                <p className="text-xs text-slate-700">{entry.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}