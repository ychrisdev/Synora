import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import type { Group } from "@/lib/community/data";

type FeaturedGroupsProps = {
  groups: Group[];
  joinedIds: Set<number>;
  showAll: boolean;
  onToggleShowAll: () => void;
  onToggleJoin: (id: number) => void;
};

export function FeaturedGroups({
  groups,
  joinedIds,
  showAll,
  onToggleShowAll,
  onToggleJoin,
}: FeaturedGroupsProps) {
  const displayed = showAll ? groups : groups.slice(0, 2);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-bold text-text-primary">Nhóm học tập nổi bật</h2>
        <button
          onClick={onToggleShowAll}
          className="text-xs text-primary font-semibold hover:cursor-pointer"
        >
          {showAll ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayed.map((group) => {
          const joined = joinedIds.has(group.id);
          return (
            <div
              key={group.id}
              className="bg-white rounded-xl border border-surface-200 shadow-card p-4 flex flex-col gap-3 card-hover"
            >
              <div className="flex items-center gap-2.5">
                <Avatar initials={group.initials} color={group.color} size="md" shape="rounded" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text-primary truncate">{group.name}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{group.members} thành viên</p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed flex-1">{group.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onToggleJoin(group.id)}
                className={clsx(
                  "w-full py-2 text-xs font-bold rounded-[9px] border-[1.5px] transition-colors hover:cursor-pointer",
                  joined
                    ? "border-primary text-primary hover:bg-primary-50"
                    : "bg-primary text-white border-primary hover:bg-primary-600"
                )}
              >
                {joined ? "Đã tham gia" : "Tham gia"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}