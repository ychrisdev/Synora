import { Avatar } from "@/components/ui/Avatar";
import type { MyGroup } from "@/lib/community/data";

type MyGroupsCardProps = {
  groups: MyGroup[];
};

export function MyGroupsCard({ groups }: MyGroupsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-text-primary">Nhóm của bạn</h3>
        <span className="text-[11px] text-text-muted">{groups.length} nhóm</span>
      </div>

      <div className="flex flex-col divide-y divide-surface-100 max-h-[200px] overflow-y-auto scrollbar-hide">
        {groups.map((group) => (
          <div key={group.name} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
            <Avatar initials={group.initials} color={group.color} size="sm" shape="rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{group.name}</p>
              <p className="text-[10px] text-text-muted">{group.members}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="text-[11px] text-primary font-bold hover:cursor-pointer">Tham gia</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}