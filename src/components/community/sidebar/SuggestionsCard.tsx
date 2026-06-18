import { clsx } from "clsx";
import { Plus, Check } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import type { Suggestion } from "@/lib/community/data";

type SuggestionsCardProps = {
  suggestions: Suggestion[];
  joinedNames: Set<string>;
  onToggle: (name: string) => void;
};

export function SuggestionsCard({ suggestions, joinedNames, onToggle }: SuggestionsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <h3 className="text-[13px] font-bold text-text-primary mb-3">Gợi ý cho bạn</h3>
      <div className="flex flex-col divide-y divide-surface-100">
        {suggestions.map((s) => {
          const joined = joinedNames.has(s.name);
          return (
            <div key={s.name} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
              <Avatar initials={s.initials} color={s.color} size="sm" shape="rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{s.name}</p>
                <p className="text-[10px] text-text-muted">{s.members}</p>
              </div>
              <button
                onClick={() => onToggle(s.name)}
                title={joined ? "Đã tham gia" : "Tham gia"}
                className={clsx(
                  "w-7 h-7 flex items-center justify-center rounded-lg transition-colors shrink-0 hover:cursor-pointer",
                  joined
                    ? "bg-primary text-white hover:bg-primary-600"
                    : "bg-primary-50 text-primary hover:bg-primary-100"
                )}
              >
                {joined ? <Check size={13} /> : <Plus size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}