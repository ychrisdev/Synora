"use client";

import { clsx } from "clsx";
import { TOP_CONTRIBUTORS } from "@/lib/explore/data";

export default function TopContributorsWidget() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Đóng góp nhiều nhất tuần</h3>
      </div>

      <div className="flex flex-col gap-3">
        {TOP_CONTRIBUTORS.map((user, i) => (
          <div key={user.name} className="flex items-center gap-2.5">
            <span className={clsx(
              "text-xs font-bold w-4 shrink-0 text-center",
              i === 0 ? "text-yellow-500"
                : i === 1 ? "text-slate-400"
                : i === 2 ? "text-orange-300"
                : "text-text-muted",
            )}>
              {i + 1}
            </span>

            <div className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
              user.color,
            )}>
              {user.initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-tight truncate">{user.name}</p>
              <p className="text-[11px] text-text-muted">{user.posts} bài · {user.subject}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}