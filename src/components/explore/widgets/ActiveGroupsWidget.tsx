"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { ACTIVE_GROUPS } from "@/lib/explore/data";

export default function ActiveGroupsWidget() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setJoined(p => ({ ...p, [name]: !p[name] }));

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Nhóm đang sôi động</h3>
        <button className="text-[11px] text-primary font-medium hover:underline">
          Tất cả
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {ACTIVE_GROUPS.map(group => (
          <div key={group.name} className="flex items-center gap-2.5">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0",
              group.color,
            )}>
              {group.initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-tight truncate">{group.name}</p>
              <p className="text-[11px] text-text-muted">{group.members} thành viên · {group.activity}</p>
            </div>

            <button
              onClick={() => toggle(group.name)}
              className={clsx(
                "shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap",
                joined[group.name]
                  ? "bg-surface-100 text-text-secondary hover:bg-surface-200"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white",
              )}
            >
              {joined[group.name] ? "Đã vào" : "Tham gia"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}