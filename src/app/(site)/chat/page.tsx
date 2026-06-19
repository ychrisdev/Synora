"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  Edit,
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  X,
} from "lucide-react";
import { clsx } from "clsx";

import type {
  Conversation,
  Message,
  FilterChip,
  ApiMessage,
  ReactionGroup,
} from "@/lib/chat/types";
import { adaptApiMessage } from "@/lib/chat/utils";
import { groupMembers } from "@/lib/chat/data";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { Badge } from "@/components/chat/Badge";
import { AvatarMenu } from "@/components/chat/AvatarMenu";
import { NewConversationModal } from "@/components/chat/NewConversationModal";
import { ConversationList } from "@/components/chat/sidebar/ConversationList";
import { InfoSidebar } from "@/components/chat/sidebar/InfoSidebar";
import Avatar from "@/components/ui/Avatar";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ChatPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? "";

  const [convList, setConvList] = useState<Conversation[]>([]);
  const [convLoading, setConvLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("all");

  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [newConvOpen, setNewConvOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [pendingJumpId, setPendingJumpId] = useState<string | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!pendingJumpId) return;
    const el = document.getElementById(`message-${pendingJumpId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedId(pendingJumpId);
      setPendingJumpId(null);
      window.setTimeout(() => setHighlightedId(null), 1500);
    } else if (nextCursor && !loadingMore) {
      loadMore();
    } else {
      setPendingJumpId(null);
    }
  }, [pendingJumpId, messages, nextCursor, loadingMore]);

  const handleJumpToReply = (id: string) => setPendingJumpId(id);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const data: Conversation[] = await res.json();
      setConvList(data);
      if (!activeIdRef.current && data.length > 0) setActiveId(data[0].id);
    } finally {
      setConvLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = useCallback(
    async (convId: string) => {
      setMsgLoading(true);
      setMessages([]);
      setNextCursor(null);
      try {
        const res = await fetch(
          `/api/conversations/${convId}/messages?limit=30`,
        );
        if (!res.ok) return;
        const data = await res.json();
        const adapted = (data.messages as ApiMessage[]).map((m) =>
          adaptApiMessage(m, currentUserId),
        );
        setMessages(adapted);
        setNextCursor(data.nextCursor);
      } finally {
        setMsgLoading(false);
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const pollMessages = useCallback(async () => {
    const convId = activeIdRef.current;
    if (!convId) return;

    try {
      const msgRes = await fetch(
        `/api/conversations/${convId}/messages?limit=30`,
      );
      if (msgRes.ok) {
        const data = await msgRes.json();
        const adapted = (data.messages as ApiMessage[]).map((m) =>
          adaptApiMessage(m, currentUserId),
        );
        setMessages((prev) => {
          const lastPrev = prev[prev.length - 1];
          const lastNew = adapted[adapted.length - 1];
          if (
            adapted.length === prev.length &&
            lastPrev?.id === lastNew?.id &&
            lastPrev?.deletedAt === lastNew?.deletedAt &&
            prev.every((m, i) => {
              const a = adapted[i];
              return (
                m.id === a.id &&
                m.deletedAt === a.deletedAt &&
                m.reactions.length === a.reactions.length &&
                m.reactions.every(
                  (r, j) =>
                    r.emoji === a.reactions[j]?.emoji &&
                    r.count === a.reactions[j]?.count,
                )
              );
            })
          )
            return prev;
          return adapted;
        });
      }

      const convRes = await fetch("/api/conversations");
      if (convRes.ok) {
        const serverConvs: Conversation[] = await convRes.json();
        setConvList((prev) => {
          return serverConvs.map((serverConv) => {
            const localConv = prev.find((c) => c.id === serverConv.id);
            return {
              ...serverConv,
              unreadCount:
                serverConv.id === activeIdRef.current
                  ? 0
                  : serverConv.unreadCount,
              lastMessage:
                localConv &&
                localConv.lastMessageAt &&
                serverConv.lastMessageAt &&
                new Date(localConv.lastMessageAt) >
                  new Date(serverConv.lastMessageAt)
                  ? localConv.lastMessage
                  : serverConv.lastMessage,
              lastMessageAt:
                localConv &&
                localConv.lastMessageAt &&
                serverConv.lastMessageAt &&
                new Date(localConv.lastMessageAt) >
                  new Date(serverConv.lastMessageAt)
                  ? localConv.lastMessageAt
                  : serverConv.lastMessageAt,
            };
          });
        });
      }
    } catch {}
  }, [currentUserId]);

  useEffect(() => {
    pollingRef.current = setInterval(pollMessages, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pollMessages]);

  const loadMore = useCallback(async () => {
    if (!activeId || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/conversations/${activeId}/messages?cursor=${nextCursor}&limit=30`,
      );
      if (!res.ok) return;
      const data = await res.json();
      const adapted = (data.messages as ApiMessage[]).map((m) =>
        adaptApiMessage(m, currentUserId),
      );
      setMessages((prev) => [...adapted, ...prev]);
      setNextCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }, [activeId, nextCursor, loadingMore]);

  const handleReactionsUpdated = (
    messageId: string,
    reactions: ReactionGroup[],
  ) => {
    setMessages((prev) => {
      const isLast = prev[prev.length - 1]?.id === messageId;
      if (isLast && reactions.length > 0) {
        const targetMsg = prev.find((m) => m.id === messageId);
        const latest = reactions[reactions.length - 1];

        const isCrossParty = latest.reactedByMe
          ? !targetMsg?.isMe
          : targetMsg?.isMe;

        if (isCrossParty) {
          const reactorName = latest.reactedByMe
            ? "Bạn"
            : (latest.users[latest.users.length - 1] ?? "");
          setConvList((convs) =>
            convs.map((c) =>
              c.id === activeIdRef.current
                ? { ...c, lastMessage: `${reactorName} đã thả ${latest.emoji}` }
                : c,
            ),
          );
        }
      }
      return prev.map((m) => (m.id === messageId ? { ...m, reactions } : m));
    });
  };

  const handleRecall = (messageId: string) => {
    setMessages((prev) => {
      const isLast = prev[prev.length - 1]?.id === messageId;
      if (isLast) {
        setConvList((convs) =>
          convs.map((c) =>
            c.id === activeIdRef.current
              ? { ...c, lastMessage: "Tin nhắn đã bị thu hồi" }
              : c,
          ),
        );
      }
      return prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              content: null,
              attachment: null,
              deletedAt: new Date().toISOString(),
            }
          : m,
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    const now = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = {
      id: tempId,
      sender: session?.user?.name ?? "Bạn",
      initials: getInitials(session?.user?.name ?? "B"),
      color: "bg-primary",
      avatarUrl: session?.user?.image ?? null,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now,
      content: text,
      isMe: true,
      attachment: null,
      reactions: [],
      deletedAt: null,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            sender: replyingTo.sender,
            content: replyingTo.content ?? "",
            isMe: replyingTo.isMe,
          }
        : null,
    };
    setMessages((prev) => [...prev, optimistic]);

    setConvList((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, lastMessage: text, lastMessageAt: now } : c,
      ),
    );

    setReplyingTo(null);

    try {
      const res = await fetch(`/api/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          replyToId: replyingTo?.id,
        }),
      });
      if (res.ok) {
        const real: ApiMessage = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? adaptApiMessage(real, currentUserId) : m,
          ),
        );
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? { ...c, lastMessage: text, lastMessageAt: real.createdAt }
              : c,
          ),
        );
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setConvList((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  lastMessage: messages[messages.length - 1]?.content ?? "",
                  lastMessageAt:
                    messages[messages.length - 1]?.createdAt ?? null,
                }
              : c,
          ),
        );
        setInput(text);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConv = (id: string) => {
    setActiveId(id);
    setInfoOpen(false);
    setReplyingTo(null);
    setConvList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  const handleConvCreated = (convId: string) => {
    fetchConversations();
    setActiveId(convId);
    setNewConvOpen(false);
  };

  const filtered = convList.filter((c) => {
    if (!c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === "unread") return c.unreadCount > 0;
    if (activeFilter === "group") return c.isGroup;
    return true;
  });

  const totalUnread = convList.reduce((sum, c) => sum + c.unreadCount, 0);
  const currentConv = convList.find((c) => c.id === activeId) ?? null;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[52px] shrink-0 bg-white border-r border-surface-200 flex flex-col items-center py-3 gap-2 z-20">
        <Link
          href="/feed"
          className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-primary/10 flex items-center justify-center text-text-muted hover:text-primary transition-colors"
          title="Về trang chủ"
        >
          <Home size={16} />
        </Link>
        <div className="h-px w-6 bg-surface-200 my-1" />
        <div className="relative">
          <button
            onClick={() => setNewConvOpen(true)}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-primary/10 flex items-center justify-center text-text-muted hover:text-primary transition-colors"
            title="Tạo trò chuyện mới"
          >
            <Edit size={16} />
          </button>
          <Badge
            count={totalUnread}
            variant="unread"
            size="sm"
            className="absolute -top-1 -right-1 pointer-events-none"
          />
        </div>
        <div className="flex-1" />
        <AvatarMenu />
      </div>

      <ConversationList
        conversations={filtered}
        activeId={activeId}
        onSelect={handleSelectConv}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalUnread={totalUnread}
        loading={convLoading}
      />

      <div className="flex-1 flex flex-col bg-white min-w-0">
        {!currentConv ? (
          <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
            {convLoading ? "Đang tải..." : "Chọn một cuộc trò chuyện"}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200 shrink-0">
              <div className="flex items-center gap-3">
                <Avatar
                  src={currentConv.avatarUrl ?? undefined}
                  initials={getInitials(currentConv.name)}
                  size="md"
                  shape="circle"
                />
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {currentConv.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {currentConv.isGroup
                      ? `${groupMembers.length} thành viên`
                      : "Đang hoạt động"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {([Phone, Video] as const).map((Icon, i) => (
                  <button
                    key={i}
                    className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <Icon size={17} />
                  </button>
                ))}
                <button
                  onClick={() => setInfoOpen((v) => !v)}
                  className={clsx(
                    "p-2 rounded-lg transition-colors",
                    infoOpen
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-surface-100",
                  )}
                >
                  <Info size={17} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-surface-50">
              {nextCursor && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="self-center text-xs text-primary font-semibold hover:underline disabled:opacity-50 mb-2"
                >
                  {loadingMore ? "Đang tải..." : "Tải tin cũ hơn"}
                </button>
              )}

              {msgLoading ? (
                <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
                  Đang tải tin nhắn...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    conversationId={activeId!}
                    currentUserId={currentUserId}
                    onReply={(m) => {
                      setReplyingTo(m);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    onJumpToReply={handleJumpToReply}
                    highlighted={highlightedId === msg.id}
                    onReactionsUpdated={handleReactionsUpdated}
                    onRecall={handleRecall}
                  />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {replyingTo && (
              <div className="px-4 py-2 border-t border-surface-100 bg-surface-50 flex items-center gap-3">
                <div className="w-0.5 h-8 bg-primary rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-primary">
                    Trả lời {replyingTo.isMe ? "chính mình" : replyingTo.sender}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {replyingTo.content ?? replyingTo.attachment?.name}
                  </p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="p-1 hover:bg-surface-200 rounded-lg transition-colors text-text-muted shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="px-4 py-3 border-t border-surface-200 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
                  <Paperclip size={17} />
                </button>
                <button className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
                  <ImageIcon size={17} />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-surface-100 rounded-full px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-white transition-colors">
                  <Smile size={16} className="text-text-muted shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {infoOpen && currentConv && (
        <InfoSidebar conv={currentConv} onClose={() => setInfoOpen(false)} />
      )}
      {newConvOpen && (
        <NewConversationModal
          onClose={() => setNewConvOpen(false)}
          onCreated={handleConvCreated}
        />
      )}
    </div>
  );
}
