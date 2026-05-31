"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  followerCount: number;
}

function formatFollowers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function getAvatarColor(username: string): string {
  const colors = [
    "bg-rose-500", "bg-blue-500", "bg-teal-500",
    "bg-violet-500", "bg-orange-500", "bg-emerald-500", "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
  return colors[hash % colors.length];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase();
}

interface Props {
  variant?: "feed" | "search";
}

export default function SuggestedPeople({ variant = "feed" }: Props) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/users/suggested")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); })
      .finally(() => setLoading(false));
  }, [session]);

  const handleFollow = async (userId: string, username: string) => {
    if (!session?.user) return;
    const isFollowed = followed[userId];
    setFollowed((prev) => ({ ...prev, [userId]: !isFollowed }));
    try {
      await fetch(`/api/profile/${username}/follow`, {
        method: isFollowed ? "DELETE" : "POST",
      });
    } catch {
      setFollowed((prev) => ({ ...prev, [userId]: isFollowed }));
    }
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-surface-200 p-4",
        variant === "feed" && "shadow-card",
      )}
    >
      <div className="flex items-center justify-between mb-3">
        {variant === "feed" ? (
          <>
            <h3 className="text-sm font-semibold text-text-primary">Gợi ý theo dõi</h3>
            <Link
              href="/search?tab=people"
              className="text-[11px] text-primary font-medium hover:underline"
            >
              Xem thêm
            </Link>
          </>
        ) : (
          <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Gợi ý theo dõi
          </h3>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={16} className="animate-spin text-text-muted" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-3">Không có gợi ý nào</p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-2.5">
              {u.avatarUrl ? (
                <img
                  src={u.avatarUrl}
                  alt={u.displayName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0",
                    getAvatarColor(u.username),
                  )}
                >
                  {getInitials(u.displayName)}
                </div>
              )}

              <Link
                href={`/profile/${u.username}`}
                className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <p className="text-xs font-semibold text-text-primary leading-tight truncate">
                  {u.displayName}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {u.role} · {formatFollowers(u.followerCount)} followers
                </p>
              </Link>

              {session?.user && (
                <button
                  onClick={() => handleFollow(u.id, u.username)}
                  className={clsx(
                    "shrink-0 text-[10px] font-semibold transition-all whitespace-nowrap",
                    variant === "feed"
                      ? "px-2.5 py-1.5 rounded-full"
                      : "px-2 py-1 rounded-md",
                    followed[u.id]
                      ? "bg-surface-100 text-text-secondary hover:bg-surface-200"
                      : variant === "feed"
                        ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                        : "text-primary border border-primary/30 hover:bg-primary hover:text-white",
                  )}
                >
                  {followed[u.id] ? "Đang theo dõi" : "Theo dõi"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}