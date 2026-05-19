import { clsx } from "clsx";
import { profileData } from "@/lib/profile/data";

export function SuggestionsWidget() {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-text-primary mb-2.5">Có thể bạn biết</h3>
      <div className="flex flex-col gap-2.5">
        {profileData.suggestions.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div
              className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                s.color
              )}
            >
              {s.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{s.name}</p>
              <p className="text-[10px] text-text-muted">{s.role}</p>
            </div>
            <button className="text-[11px] font-semibold text-primary border border-primary/25 px-2 py-0.5 rounded-full hover:bg-primary/5 transition-colors shrink-0">
              Kết bạn
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}