import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  colorClass = "bg-blue-50 text-blue-500",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  colorClass?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center", colorClass)}>
          <Icon size={16} />
        </div>
        {trend && (
          <span
            className={clsx(
              "text-[11px] font-semibold",
              trend.positive ? "text-emerald-600" : "text-red-500",
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}