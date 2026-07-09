import { ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import { EmptyPlaceholder } from "@/components/admin/EmptyPlaceholder";
import { Inbox } from "lucide-react";

export type TopListItem = {
  id: string;
  avatarUrl: string | null;
  title: string;
  subtitle: string;
  metricValue: string | number;
  metricLabel: string;
};

export function TopList({
  title,
  icon,
  items,
  emptyLabel = "Chưa có dữ liệu",
}: {
  title: string;
  icon?: ReactNode;
  items: TopListItem[];
  emptyLabel?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <p className="text-sm font-semibold text-slate-800">{title}</p>
      </div>

      {items.length === 0 ? (
        <EmptyPlaceholder icon={Inbox} title={emptyLabel} />
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="w-5 text-xs font-semibold text-slate-300 text-center shrink-0">
                {i + 1}
              </span>
              <Avatar
                src={item.avatarUrl ?? undefined}
                initials={item.title.slice(0, 2).toUpperCase()}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-slate-700">{item.metricValue}</p>
                <p className="text-[10px] text-slate-400">{item.metricLabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}