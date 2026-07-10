"use client";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { UserActionsMenu } from "./UserActionsMenu";

export type AdminUserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  joinedAt: string;
  postCount: number;
};

const ROLE_BADGE: Record<AdminUserRow["role"], string> = {
  USER: "bg-slate-100 text-slate-600",
  ADMIN: "bg-blue-50 text-blue-600",
};

const STATUS_BADGE: Record<AdminUserRow["status"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  SUSPENDED: "bg-amber-50 text-amber-600",
  BANNED: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<AdminUserRow["status"], string> = {
  ACTIVE: "Đang hoạt động",
  SUSPENDED: "Tạm khóa",
  BANNED: "Khóa vĩnh viễn",
};

export function UsersTable({
  users,
  onViewDetail,
  onGrantRole,
  onResetAvatar,
  onForcePasswordChange,
  onSuspend,
  onBan,
  onUnban,
}: {
  users: AdminUserRow[];
  onViewDetail: (u: AdminUserRow) => void;
  onGrantRole: (u: AdminUserRow) => void;
  onResetAvatar: (u: AdminUserRow) => void;
  onForcePasswordChange: (u: AdminUserRow) => void;
  onSuspend: (u: AdminUserRow) => void;
  onBan: (u: AdminUserRow) => void;
  onUnban: (u: AdminUserRow) => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  if (users.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl py-16 flex items-center justify-center">
        <p className="text-sm text-slate-400">Không tìm thấy người dùng nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left font-semibold text-slate-500 text-xs px-5 py-3">
              Người dùng
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Vai trò
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Trạng thái
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Ngày tham gia
            </th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">
              Bài viết
            </th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const menuOpen = menuOpenId === u.id;
            return (
              <tr key={u.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={u.avatarUrl ?? undefined}
                      initials={u.name.slice(0, 2).toUpperCase()}
                      size="sm"
                      shape="circle"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      ROLE_BADGE[u.role],
                    )}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      STATUS_BADGE[u.status],
                    )}
                  >
                    {STATUS_LABEL[u.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.joinedAt}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.postCount}</td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpen ? null : u.id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen && (
                    <UserActionsMenu
                      user={u}
                      onClose={() => setMenuOpenId(null)}
                      onViewDetail={() => {
                        setMenuOpenId(null);
                        onViewDetail(u);
                      }}
                      onGrantRole={() => {
                        setMenuOpenId(null);
                        onGrantRole(u);
                      }}
                      onResetAvatar={() => {
                        setMenuOpenId(null);
                        onResetAvatar(u);
                      }}
                      onForcePasswordChange={() => {
                        setMenuOpenId(null);
                        onForcePasswordChange(u);
                      }}
                      onSuspend={() => {
                        setMenuOpenId(null);
                        onSuspend(u);
                      }}
                      onBan={() => {
                        setMenuOpenId(null);
                        onBan(u);
                      }}
                      onUnban={() => {
                        setMenuOpenId(null);
                        onUnban(u);
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