import { clsx } from "clsx";
import type { Stat } from "../_data/community.data";

type CommunityStatsProps = {
  stats: Stat[];
};

export function CommunityStats({ stats }: CommunityStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-surface-200 shadow-card px-4 py-3.5 flex items-center gap-3"
        >
          <div className={clsx("w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0", stat.iconClass)}>
            <stat.icon size={18} />
          </div>
          <div>
            <p className="text-[11px] text-text-muted font-medium">{stat.label}</p>
            <p className="text-lg font-extrabold text-text-primary leading-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}