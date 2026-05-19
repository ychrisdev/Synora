import { clsx } from "clsx";
import { profileData } from "@/lib/profile/data";

export function MutualFriendsWidget() {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-semibold text-text-primary">Bạn bè chung</h3>
        <span className="text-[10px] text-text-muted bg-surface-100 px-1.5 py-0.5 rounded-full">12</span>
      </div>
      <div className="flex flex-col gap-2">
        {profileData.mutualFriends.map((f) => (
          <div key={f.name} className="flex items-center gap-2 group cursor-pointer">
            <div
              className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                f.color
              )}
            >
              {f.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                {f.name}
              </p>
              <p className="text-[10px] text-text-muted">{f.role}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-2.5 w-full text-[11px] font-medium text-text-muted hover:text-primary transition-colors text-center">
        Xem tất cả →
      </button>
    </div>
  );
}