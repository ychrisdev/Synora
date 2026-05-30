"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import NextLink from "next/link";
import Avatar from "@/components/ui/Avatar";

const SUGGEST_COLORS = [
  "bg-violet-500", "bg-teal-500", "bg-pink-500",
  "bg-indigo-500", "bg-amber-500", "bg-cyan-600",
];

interface FriendSuggestPanelProps {
  username: string;
  onClose: () => void;
}

export function FriendSuggestPanel({ username, onClose }: FriendSuggestPanelProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/${username}/friends`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.friends ?? [];
        setSuggestions(list);
        setFollowingIds(
          new Set(list.filter((f: any) => f.isFollowingBack).map((f: any) => f.id)),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const handleFollow = async (friendUsername: string, friendId: string) => {
    const res = await fetch(`/api/profile/${friendUsername}/follow`, { method: "POST" });
    const data = await res.json();
    setFollowingIds((prev) => {
      const next = new Set(prev);
      data.following ? next.add(friendId) : next.delete(friendId);
      return next;
    });
  };

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary">Gợi ý kết bạn</h3>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
          <X size={14} />
        </button>
      </div>
      {loading ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-16 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-3">Chưa có gợi ý nào.</p>
      ) : (
        <div className="flex gap-3 flex-wrap">
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-2.5 bg-surface-50 border border-surface-200 rounded-xl px-3 py-2.5 min-w-[200px] flex-1"
            >
              <NextLink href={`/profile/${s.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                <Avatar
                  src={s.avatarUrl}
                  name={s.displayName}
                  initials={s.displayName.split(" ").map((w: string) => w[0]).slice(-2).join("").toUpperCase()}
                  color={SUGGEST_COLORS[i % SUGGEST_COLORS.length]}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{s.displayName}</p>
                  <p className="text-[10px] text-text-muted">
                    {s.followerCount.toLocaleString("vi-VN")} người theo dõi
                  </p>
                </div>
              </NextLink>
              <button
                onClick={() => handleFollow(s.username, s.id)}
                className={clsx(
                  "shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
                  followingIds.has(s.id)
                    ? "text-text-secondary border-surface-200 bg-white hover:bg-surface-100"
                    : "text-primary border-primary/25 hover:bg-primary/5",
                )}
              >
                {followingIds.has(s.id) ? "Đang theo dõi" : "Kết bạn"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}