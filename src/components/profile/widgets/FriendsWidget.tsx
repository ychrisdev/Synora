"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { UserCheck, ArrowRight } from "lucide-react";
import NextLink from "next/link";
import { useSession } from "next-auth/react";

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  followerCount: number;
}

const COLORS = [
  "bg-violet-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-cyan-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

export function FriendsWidget({ username }: { username: string }) {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const isOwner = session?.user?.username === username;

  useEffect(() => {
    fetch(`/api/profile/${username}/friends`)
      .then((r) => r.json())
      .then((data) => {
        setFriends(data.friends ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const handleUnfriend = async (friendUsername: string, friendId: string) => {
    await fetch(`/api/profile/${friendUsername}/follow`, { method: "POST" });
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  if (loading) {
    return (
      <div className="bg-white border border-surface-200 rounded-2xl p-4">
        <div className="h-3.5 w-20 bg-surface-100 rounded animate-pulse mb-3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-surface-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-surface-100 rounded animate-pulse w-3/4" />
              <div className="h-2.5 bg-surface-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-text-primary">Bạn bè</h3>
          {friends.length > 0 && (
            <span className="text-[10px] text-text-muted bg-surface-100 px-1.5 py-0.5 rounded-full">
              {friends.length}
            </span>
          )}
        </div>
        <NextLink
          href={`/friends/${username}`}
          className="flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline transition-colors"
        >
          Xem tất cả <ArrowRight size={11} />
        </NextLink>
      </div>

      {friends.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-3">
          Chưa có bạn bè nào.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {friends.map((f, i) => (
            <div key={f.id} className="flex items-center gap-2 group">
              <NextLink href={`/profile/${f.username}`} className="shrink-0">
                {f.avatarUrl ? (
                  <img
                    src={f.avatarUrl}
                    alt={f.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                      COLORS[i % COLORS.length],
                    )}
                  >
                    {getInitials(f.displayName)}
                  </div>
                )}
              </NextLink>
              <div className="flex-1 min-w-0">
                <NextLink href={`/profile/${f.username}`}>
                  <p className="text-xs font-medium text-text-primary truncate hover:text-primary transition-colors">
                    {f.displayName}
                  </p>
                </NextLink>
                <p className="text-[10px] text-text-muted">
                  {f.followerCount.toLocaleString("vi-VN")} người theo dõi
                </p>
              </div>
              {isOwner && (
                <button
                  onClick={() => handleUnfriend(f.username, f.id)}
                  className="shrink-0 p-1.5 rounded-full transition-colors text-primary bg-primary/10 hover:bg-red-50 hover:text-red-500"
                  title="Hủy kết bạn"
                >
                  <UserCheck size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
