"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import NextLink from "next/link";
import Avatar from "@/components/ui/Avatar";

type RelationStatus = "none" | "pending" | "friends";

const SUGGEST_COLORS = [
  "bg-violet-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-cyan-600",
];

interface SuggestUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  followerCount: number;
}

export function FriendSuggestPanel({
  username,
  onClose,
}: {
  username: string;
  onClose: () => void;
}) {
  const [suggestions, setSuggestions] = useState<SuggestUser[]>([]);
  const [statuses, setStatuses] = useState<Record<string, RelationStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/${username}/friends`)
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data.suggestions ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const handleFollow = async (friendUsername: string, friendId: string) => {
    const res = await fetch(`/api/profile/${friendUsername}/follow`, {
      method: "POST",
    });
    const data = await res.json();
    setStatuses((prev) => ({
      ...prev,
      [friendId]: data.status as RelationStatus,
    }));
  };

  const getLabel = (s: RelationStatus) =>
    s === "pending" ? "Đã gửi yêu cầu" : s === "friends" ? "Bạn bè" : "Kết bạn";

  const getBtnClass = (s: RelationStatus) =>
    clsx(
      "shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
      s === "friends"
        ? "text-primary border-primary/25 bg-primary/5"
        : s === "pending"
          ? "text-text-secondary border-surface-200 bg-surface-50 cursor-default"
          : "text-primary border-primary/25 hover:bg-primary/5",
    );

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary">
          Gợi ý kết bạn
        </h3>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      {loading ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-16 bg-surface-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-3">
          Chưa có gợi ý nào.
        </p>
      ) : (
        <div className="flex gap-3 flex-wrap">
          {suggestions.map((s, i) => {
            const status = statuses[s.id] ?? "none";
            return (
              <div
                key={s.id}
                className="flex items-center gap-2.5 bg-surface-50 border border-surface-200 rounded-xl px-3 py-2.5 min-w-[200px] flex-1"
              >
                <NextLink
                  href={`/profile/${s.username}`}
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                >
                  <Avatar
                    src={s.avatarUrl}
                    name={s.displayName}
                    initials={s.displayName
                      .split(" ")
                      .map((w) => w[0])
                      .slice(-2)
                      .join("")
                      .toUpperCase()}
                    color={SUGGEST_COLORS[i % SUGGEST_COLORS.length]}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {s.displayName}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {s.followerCount.toLocaleString("vi-VN")} người theo dõi
                    </p>
                  </div>
                </NextLink>
                <button
                  onClick={() =>
                    status === "none" && handleFollow(s.username, s.id)
                  }
                  disabled={status === "pending"}
                  className={getBtnClass(status)}
                >
                  {getLabel(status)}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
