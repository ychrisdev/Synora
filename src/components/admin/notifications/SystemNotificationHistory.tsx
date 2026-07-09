import { clsx } from "clsx";
import { History } from "lucide-react";
import { EmptyPlaceholder } from "@/components/admin/EmptyPlaceholder";
import {
  SYSTEM_TYPE_BADGE,
  SYSTEM_TYPE_LABELS,
  type SystemNotification,
} from "@/lib/admin-notifications/types";

export function SystemNotificationHistory({ items }: { items: SystemNotification[] }) {
  if (items.length === 0) {
    return (
      <EmptyPlaceholder
        icon={History}
        title="Chưa có thông báo hệ thống nào được gửi"
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left font-semibold text-slate-500 text-xs px-5 py-3">Tiêu đề</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Loại</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Thời gian hiển thị</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Người gửi</th>
            <th className="text-left font-semibold text-slate-500 text-xs px-4 py-3">Người nhận</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50">
              <td className="px-5 py-3">
                <p className="text-xs font-medium text-slate-800">{n.title}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{n.content}</p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    SYSTEM_TYPE_BADGE[n.type],
                  )}
                >
                  {SYSTEM_TYPE_LABELS[n.type]}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {n.displayFrom} → {n.displayTo}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{n.sentBy}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{n.recipientCount.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}