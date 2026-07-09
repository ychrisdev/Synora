import { clsx } from "clsx";
import { History } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { EmptyPlaceholder } from "@/components/admin/EmptyPlaceholder";
import {
  REASON_BADGE,
  REASON_LABELS,
  type UserNotification,
} from "@/lib/admin-notifications/types";

export function UserNotificationHistory({ items }: { items: UserNotification[] }) {
  if (items.length === 0) {
    return (
      <EmptyPlaceholder
        icon={History}
        title="Chưa có thông báo nào được gửi cho người dùng"
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left font-semibold text-slate-500 text-xs px-5 py-3">Người nhận</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Lý do</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Tiêu đề</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Người gửi</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Ngày gửi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
              <td className="px-5 py-3">
                <div className="flex items-center -space-x-2">
                  {n.recipients.slice(0, 3).map((r) => (
                    <Avatar
                      key={r.id}
                      src={r.avatarUrl ?? undefined}
                      initials={r.name.slice(0, 2).toUpperCase()}
                      size="sm"
                      className="ring-2 ring-white"
                    />
                  ))}
                  {n.recipients.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 ring-2 ring-white flex items-center justify-center text-[10px] font-semibold text-slate-500">
                      +{n.recipients.length - 3}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {n.recipients.length === 1
                    ? n.recipients[0].name
                    : `${n.recipients.length} người dùng`}
                </p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    REASON_BADGE[n.reason],
                  )}
                >
                  {REASON_LABELS[n.reason]}
                </span>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs font-medium text-slate-800">{n.title}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[220px]">{n.content}</p>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{n.sentBy}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{n.sentAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}