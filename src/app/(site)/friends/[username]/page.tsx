"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { clsx } from "clsx";
import NextLink from "next/link";
import {
  UserCheck,
  UserX,
  UserMinus,
  Users,
  ArrowLeft,
  Bookmark,
  Trash2,
} from "lucide-react";

type Tab = "all" | "requests";

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

interface PersonCard {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  followerCount: number;
  requestId?: string;
}

interface ToastState {
  msg: string;
  type: "action" | "delete";
}

function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 bg-text-primary text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
      {toast.type === "delete" ? <Trash2 size={13} /> : <UserCheck size={13} />}
      {toast.msg}
    </div>
  );
}

function ConfirmDialog({
  icon,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-100 mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-text-primary text-center mb-1">
          {title}
        </h3>
        <p className="text-xs text-text-muted text-center mb-5 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm font-medium text-text-secondary bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AvatarCell({ person, index }: { person: PersonCard; index: number }) {
  return person.avatarUrl ? (
    <img
      src={person.avatarUrl}
      alt={person.displayName}
      className="w-11 h-11 rounded-full object-cover"
    />
  ) : (
    <div
      className={clsx(
        "w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold",
        COLORS[index % COLORS.length],
      )}
    >
      {getInitials(person.displayName)}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mb-3">
        <Users size={22} className="text-text-muted" />
      </div>
      <p className="text-sm font-medium text-text-primary mb-1">{message}</p>
      <p className="text-xs text-text-muted">
        Hãy kết nối với mọi người xung quanh bạn
      </p>
    </div>
  );
}

export default function FriendsPage() {
  const { username } = useParams<{ username: string }>();
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("all");
  const [friends, setFriends] = useState<PersonCard[]>([]);
  const [requests, setRequests] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [confirm, setConfirm] = useState<{
    type: "unfriend" | "reject";
    person: PersonCard;
  } | null>(null);

  const actionInProgress = useRef<Set<string>>(new Set());

  const isOwner = session?.user?.username === username;

  const showToast = useCallback((msg: string, type: ToastState["type"]) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [friendsRes, reqRes] = await Promise.all([
        fetch(`/api/profile/${username}/friends`),
        isOwner
          ? fetch(`/api/profile/${username}/friend-requests`)
          : Promise.resolve(null),
      ]);

      const friendsData = await friendsRes.json();
      const uniqueFriends = Array.from(
        new Map(
          (friendsData.friends ?? []).map((f: PersonCard) => [f.id, f]),
        ).values(),
      ) as PersonCard[];
      setFriends(uniqueFriends);

      if (reqRes) {
        const reqData = await reqRes.json();
        const mapped: PersonCard[] = (reqData.requests ?? []).map((r: any) => ({
          ...r,
          requestId: r.id,
          id: r.senderId,
        }));
        const uniqueRequests = Array.from(
          new Map(mapped.map((r) => [r.requestId, r])).values(),
        );
        setRequests(uniqueRequests);
      }
    } finally {
      setLoading(false);
    }
  }, [username, isOwner]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleUnfriend = (person: PersonCard) => {
    if (actionInProgress.current.has(person.id)) return;
    setConfirm({ type: "unfriend", person });
  };

  const doUnfriend = async (person: PersonCard) => {
    setConfirm(null);
    actionInProgress.current.add(person.id);
    try {
      await fetch(`/api/profile/${person.username}/follow`, { method: "POST" });
      setFriends((prev) => prev.filter((f) => f.id !== person.id));
      showToast("Đã hủy kết bạn", "delete");
    } finally {
      actionInProgress.current.delete(person.id);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "reject",
    person: PersonCard,
  ) => {
    if (action === "reject") {
      setConfirm({ type: "reject", person: { ...person, requestId } });
      return;
    }
    const key = `req_${requestId}`;
    if (actionInProgress.current.has(key)) return;
    actionInProgress.current.add(key);
    try {
      const res = await fetch(`/api/profile/${username}/friend-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (!res.ok) return;
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setFriends((prev) => {
        if (prev.some((f) => f.id === person.id)) return prev;
        return [{ ...person }, ...prev];
      });
      showToast(`Đã chấp nhận kết bạn với ${person.displayName}`, "action");
    } finally {
      actionInProgress.current.delete(key);
    }
  };

  const doReject = async (person: PersonCard) => {
    setConfirm(null);
    const requestId = person.requestId!;
    const key = `req_${requestId}`;
    if (actionInProgress.current.has(key)) return;
    actionInProgress.current.add(key);
    try {
      await fetch(`/api/profile/${username}/friend-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "reject" }),
      });
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      showToast("Đã từ chối yêu cầu", "delete");
    } finally {
      actionInProgress.current.delete(key);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "Tất cả bạn bè", count: friends.length },
    ...(isOwner
      ? [
          {
            key: "requests" as Tab,
            label: "Yêu cầu kết bạn",
            count: requests.length,
          },
        ]
      : []),
  ];

  const currentList = tab === "all" ? friends : requests;

  return (
    <div className="min-h-screen bg-surface-50">
      <Toast toast={toast} />

      {confirm?.type === "unfriend" && (
        <ConfirmDialog
          icon={<UserMinus size={20} className="text-red-500" />}
          title="Hủy kết bạn?"
          description={`Bạn sẽ không còn là bạn bè với ${confirm.person.displayName} nữa.`}
          confirmLabel="Hủy kết bạn"
          onConfirm={() => doUnfriend(confirm.person)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {confirm?.type === "reject" && (
        <ConfirmDialog
          icon={<UserX size={20} className="text-red-500" />}
          title="Từ chối yêu cầu?"
          description={`Từ chối lời mời kết bạn từ ${confirm.person.displayName}.`}
          confirmLabel="Từ chối"
          onConfirm={() => doReject(confirm.person)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <NextLink
            href={`/profile/${username}`}
            className="w-8 h-8 rounded-full bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors shrink-0"
          >
            <ArrowLeft size={14} className="text-text-secondary" />
          </NextLink>
          <div>
            <h1 className="text-base font-semibold text-text-primary leading-tight">
              Bạn bè
            </h1>
            <p className="text-[11px] text-text-muted">@{username}</p>
          </div>
        </div>

        <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden">
          <div className="flex border-b border-surface-100 px-2 pt-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={clsx(
                  "px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px rounded-t-lg",
                  tab === t.key
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-text-muted hover:text-text-primary hover:bg-surface-50",
                )}
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    className={clsx(
                      "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                      tab === t.key
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-100 text-text-muted",
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-surface-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : currentList.length === 0 ? (
              <div className="grid grid-cols-2">
                <EmptyState
                  message={
                    tab === "all"
                      ? "Chưa có bạn bè nào"
                      : "Không có yêu cầu kết bạn"
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {tab === "all" &&
                  friends.map((f, i) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 bg-surface-50 border border-surface-100 rounded-xl px-3 py-3 hover:border-surface-200 transition-colors"
                    >
                      <NextLink
                        href={`/profile/${f.username}`}
                        className="shrink-0"
                      >
                        <AvatarCell person={f} index={i} />
                      </NextLink>
                      <div className="flex-1 min-w-0">
                        <NextLink href={`/profile/${f.username}`}>
                          <p className="text-xs font-semibold text-text-primary hover:text-primary transition-colors truncate">
                            {f.displayName}
                          </p>
                        </NextLink>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {f.followerCount.toLocaleString("vi-VN")} người theo
                          dõi
                        </p>
                        {isOwner && (
                          <button
                            onClick={() => handleUnfriend(f)}
                            className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-text-muted hover:text-red-500 border border-surface-200 hover:border-red-200 px-2 py-1 rounded-full transition-colors"
                          >
                            <UserMinus size={11} /> Hủy kết bạn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {tab === "requests" &&
                  requests.map((r, i) => (
                    <div
                      key={r.requestId}
                      className="flex items-center gap-3 bg-surface-50 border border-surface-100 rounded-xl px-3 py-3 hover:border-surface-200 transition-colors"
                    >
                      <NextLink
                        href={`/profile/${r.username}`}
                        className="shrink-0"
                      >
                        <AvatarCell person={r} index={i} />
                      </NextLink>
                      <div className="flex-1 min-w-0">
                        <NextLink href={`/profile/${r.username}`}>
                          <p className="text-xs font-semibold text-text-primary hover:text-primary transition-colors truncate">
                            {r.displayName}
                          </p>
                        </NextLink>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {r.followerCount.toLocaleString("vi-VN")} người theo
                          dõi
                        </p>
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() =>
                              handleRequestAction(r.requestId!, "accept", r)
                            }
                            className="flex items-center gap-1 text-[10px] font-semibold text-white bg-primary hover:bg-primary/90 px-2 py-1 rounded-full transition-colors"
                          >
                            <UserCheck size={10} /> Chấp nhận
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(r.requestId!, "reject", r)
                            }
                            className="flex items-center gap-1 text-[10px] font-medium text-text-muted hover:text-red-500 border border-surface-200 hover:border-red-200 px-2 py-1 rounded-full transition-colors"
                          >
                            <UserX size={10} /> Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
