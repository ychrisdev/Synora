import clsx from "clsx";
import { STATS } from "@/lib/library/data";

export default function StatsWidget() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Thống kê thư viện
        </h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className={clsx(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                s.iconClass,
              )}
            >
              <s.icon size={13} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">
                {s.value}
              </p>
              <p className="text-[11px] text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
