"use client";
import { useState } from "react";
import { MoreVertical, Users as UsersIcon } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { GroupActionsMenu } from "./GroupActionsMenu";

export type AdminGroupRow = {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  description: string;
  ownerName: string;
  ownerUsername: string;
  privacy: "PUBLIC" | "PRIVATE";
  status: "ACTIVE" | "LOCKED";
  memberCount: number;
  postCount: number;
  createdAt: string;
};

const PRIVACY_BADGE: Record<AdminGroupRow["privacy"], string> = {
  PUBLIC: "bg-blue-50 text-blue-600",
  PRIVATE: "bg-slate-100 text-slate-600",
};

const PRIVACY_LABEL: Record<AdminGroupRow["privacy"], string> = {
  PUBLIC: "Công khai",
  PRIVATE: "Riêng tư",
};

const STATUS_BADGE: Record<AdminGroupRow["status"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  LOCKED: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<AdminGroupRow["status"], string> = {
  ACTIVE: "Đang hoạt động",
  LOCKED: "Đã khóa",
};

export function GroupsTable({
  groups,
  onViewDetail,
  onLock,
  onUnlock,
  onDelete,
}: {
  groups: AdminGroupRow[];
  onViewDetail: (g: AdminGroupRow) => void;
  onLock: (g: AdminGroupRow) => void;
  onUnlock: (g: AdminGroupRow) => void;
  onDelete: (g: AdminGroupRow) => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  if (groups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-16 flex items-center justify-center">
        <p className="text-sm text-slate-400">Không tìm thấy nhóm nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left font-semibold text-slate-500 text-xs px-5 py-3">
              Nhóm
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Chủ nhóm
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Quyền riêng tư
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Thành viên
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Trạng thái
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Ngày tạo
            </th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const menuOpen = menuOpenId === g.id;
            return (
              <tr key={g.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={g.avatarUrl ?? undefined}
                      initials={g.name.slice(0, 2).toUpperCase()}
                      size="sm"
                      shape="rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{g.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{g.memberCount} thành viên · {g.postCount} bài viết</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-slate-700">{g.ownerName}</p>
                  <p className="text-[11px] text-slate-400">@{g.ownerUsername}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      PRIVACY_BADGE[g.privacy],
                    )}
                  >
                    {PRIVACY_LABEL[g.privacy]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <UsersIcon size={13} className="text-slate-400" />
                    {g.memberCount}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      STATUS_BADGE[g.status],
                    )}
                  >
                    {STATUS_LABEL[g.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{g.createdAt}</td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpen ? null : g.id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen && (
                    <GroupActionsMenu
                      group={g}
                      onClose={() => setMenuOpenId(null)}
                      onViewDetail={() => {
                        setMenuOpenId(null);
                        onViewDetail(g);
                      }}
                      onLock={() => {
                        setMenuOpenId(null);
                        onLock(g);
                      }}
                      onUnlock={() => {
                        setMenuOpenId(null);
                        onUnlock(g);
                      }}
                      onDelete={() => {
                        setMenuOpenId(null);
                        onDelete(g);
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}