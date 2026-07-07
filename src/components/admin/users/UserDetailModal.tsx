"use client";
import { useState } from "react";
import { X, User, History, Flag } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import type { AdminUserRow } from "./UsersTable";

type Tab = "profile" | "violations" | "reports";

const MOCK_VIOLATIONS = [
  { id: "1", date: "12/06/2026", action: "Cảnh cáo", reason: "Đăng nội dung spam" },
];

const MOCK_REPORTS_AGAINST = [
  { id: "1", date: "20/06/2026", reporter: "Trần Thị B", reason: "Nội dung không phù hợp" },
  { id: "2", date: "18/06/2026", reporter: "Lê Văn C", reason: "Spam" },
];

export function UserDetailModal({
  user,
  onClose,
}: {
  user: AdminUserRow;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("profile");

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "profile", label: "Hồ sơ", icon: User },
    { key: "violations", label: "Lịch sử vi phạm", icon: History },
    { key: "reports", label: "Lịch sử báo cáo", icon: Flag },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatarUrl ?? undefined}
              initials={user.name.slice(0, 2).toUpperCase()}
              size="md"
              shape="circle"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-1.5 px-5 py-3 border-b border-slate-100 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                tab === t.key
                  ? "bg-blue-500/10 text-blue-600"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              )}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {tab === "profile" && (
            <div className="flex flex-col gap-3">
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Vai trò" value={user.role} />
              <DetailRow label="Trạng thái" value={user.status} />
              <DetailRow label="Ngày tham gia" value={user.joinedAt} />
              <DetailRow label="Tổng bài viết" value={String(user.postCount)} />
            </div>
          )}

          {tab === "violations" && (
            <div className="flex flex-col gap-2.5">
              {MOCK_VIOLATIONS.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  Chưa có vi phạm nào
                </p>
              ) : (
                MOCK_VIOLATIONS.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-800">{v.action}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{v.reason}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{v.date}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "reports" && (
            <div className="flex flex-col gap-2.5">
              {MOCK_REPORTS_AGAINST.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  Chưa từng bị báo cáo
                </p>
              ) : (
                MOCK_REPORTS_AGAINST.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-800">{r.reason}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Báo cáo bởi {r.reporter}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{r.date}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-b-0">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xs font-medium text-slate-800">{value}</p>
    </div>
  );
}