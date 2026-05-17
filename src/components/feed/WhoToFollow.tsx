"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface SuggestedUser {
  name: string;
  initials: string;
  color: string;
  role: string;
  followers: string;
  reason: string;
}

const SUGGESTIONS: SuggestedUser[] = [
  {
    name: "Đào Minh Quang",
    initials: "MQ",
    color: "bg-orange-500",
    role: "Thủ khoa ĐH 2023",
    followers: "4.8k",
    reason: "Được 3 người bạn theo dõi",
  },
  {
    name: "Sarah English",
    initials: "SE",
    color: "bg-green-500",
    role: "Giáo viên IELTS 8.5",
    followers: "3.3k",
    reason: "Nổi bật về Tiếng Anh",
  },
  {
    name: "Phạm Đức Long",
    initials: "DL",
    color: "bg-indigo-500",
    role: "Sinh viên Bách Khoa",
    followers: "1.4k",
    reason: "Học cùng trường bạn",
  },
];

export default function WhoToFollow() {
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setFollowed((p) => ({ ...p, [name]: !p[name] }));

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Gợi ý theo dõi</h3>
        </div>
        <button className="text-[11px] text-primary font-medium hover:underline flex items-center gap-0.5">
          Xem thêm
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {SUGGESTIONS.map((user) => (
          <div key={user.name} className="flex items-center gap-2.5">
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0",
                user.color,
              )}
            >
              {user.initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary leading-tight truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-text-muted truncate">{user.role}</p>
              <p className="text-[11px] text-primary/70">{user.reason}</p>
            </div>

            <button
              onClick={() => toggle(user.name)}
              className={clsx(
                "shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap",
                followed[user.name]
                  ? "bg-surface-100 text-text-secondary hover:bg-surface-200"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white",
              )}
            >
              {followed[user.name] ? "Đang theo dõi" : "Theo dõi"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}