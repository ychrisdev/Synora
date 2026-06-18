"use client";

import { useState, useRef } from "react";
import {
  Smile,
  CornerUpLeft,
  MoreVertical,
  Pin,
  Forward,
  Undo2,
  Flag,
  Download,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { useOutsideClick } from "@/lib/chat/hooks";
import type { Message, ReactionGroup, ApiReaction } from "@/lib/chat/types";
import { toggleMessageReaction, groupReactions } from "@/lib/chat/utils";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

interface ReactionModalProps {
  reactions: ReactionGroup[];
  onClose: () => void;
}

function ReactionModal({ reactions, onClose }: ReactionModalProps) {
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);

  const displayed = activeEmoji
    ? reactions.filter((r) => r.emoji === activeEmoji)
    : reactions;

  const allUsers = displayed.flatMap((r) =>
    r.users.map((name) => ({ name, emoji: r.emoji })),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-80 max-h-[420px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
          <p className="text-sm font-semibold text-text-primary">Cảm xúc</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-surface-100 flex items-center justify-center text-text-muted transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 border-b border-surface-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveEmoji(null)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeEmoji === null
                ? "bg-primary text-white"
                : "bg-surface-100 text-text-secondary hover:bg-surface-200",
            )}
          >
            Tất cả
            <span className="font-semibold">
              {reactions.reduce((s, r) => s + r.count, 0)}
            </span>
          </button>
          {reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() =>
                setActiveEmoji(activeEmoji === r.emoji ? null : r.emoji)
              }
              className={clsx(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                activeEmoji === r.emoji
                  ? "bg-primary text-white"
                  : "bg-surface-100 text-text-secondary hover:bg-surface-200",
              )}
            >
              <span>{r.emoji}</span>
              <span className="font-semibold">{r.count}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {allUsers.map(({ name, emoji }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {name
                  .split(" ")
                  .slice(-2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <p className="flex-1 text-sm text-text-primary font-medium truncate">
                {name}
              </p>
              <span className="text-lg leading-none">{emoji}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MessageActionsProps {
  isMe: boolean;
  onEmoji: (e: string) => void;
  onReply: () => void;
}

function MessageActions({ isMe, onEmoji, onReply }: MessageActionsProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(emojiRef, () => setEmojiOpen(false));
  useOutsideClick(menuRef, () => setMenuOpen(false));

  return (
    <div
      className={clsx(
        "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
        "self-center",
        isMe ? "flex-row-reverse mr-1" : "ml-1",
      )}
    >
      <div ref={emojiRef} className="relative">
        <button
          onClick={() => {
            setEmojiOpen((v) => !v);
            setMenuOpen(false);
          }}
          className="w-7 h-7 rounded-full hover:bg-surface-200 flex items-center justify-center text-text-muted transition-colors"
          title="Cảm xúc"
        >
          <Smile size={15} />
        </button>
        {emojiOpen && (
          <div
            className={clsx(
              "absolute bottom-9 bg-white rounded-2xl shadow-xl border border-surface-100 px-2 py-1.5 flex gap-1 z-30",
              isMe ? "right-0" : "left-0",
            )}
          >
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => {
                  onEmoji(e);
                  setEmojiOpen(false);
                }}
                className="text-lg hover:scale-125 transition-transform leading-none p-0.5"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onReply}
        className="w-7 h-7 rounded-full hover:bg-surface-200 flex items-center justify-center text-text-muted transition-colors"
        title="Trả lời"
      >
        <CornerUpLeft size={14} />
      </button>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => {
            setMenuOpen((v) => !v);
            setEmojiOpen(false);
          }}
          className="w-7 h-7 rounded-full hover:bg-surface-200 flex items-center justify-center text-text-muted transition-colors"
          title="Thêm"
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <div
            className={clsx(
              "absolute bottom-9 w-44 bg-white rounded-xl shadow-xl border border-surface-100 py-1 z-30 overflow-hidden",
              isMe ? "right-0" : "left-0",
            )}
          >
            {[
              { icon: <Pin size={14} />, label: "Ghim tin nhắn" },
              { icon: <Forward size={14} />, label: "Chuyển tiếp" },
              { icon: <Undo2 size={14} />, label: "Thu hồi" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text-primary hover:bg-surface-50 transition-colors"
              >
                <span className="text-text-muted shrink-0">{icon}</span>
                {label}
              </button>
            ))}
            <div className="h-px bg-surface-100 my-0.5" />
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
              <Flag size={14} className="shrink-0" />
              Báo cáo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ReactionBarProps {
  reactions: ReactionGroup[];
  isMe: boolean;
  onToggle: (emoji: string) => void;
  onOpenModal: () => void;
}

function ReactionBar({
  reactions,
  isMe,
  onToggle,
  onOpenModal,
}: ReactionBarProps) {
  if (reactions.length === 0) return null;

  const totalCount = reactions.reduce((s, r) => s + r.count, 0);

  const visibleEmojis = reactions.slice(0, 3);
  const hiddenCount = reactions.length > 3 ? reactions.length - 3 : 0;

  const allUsers = reactions.flatMap((r) => r.users);
  const tooltipText =
    allUsers.length <= 2
      ? allUsers.join(" và ")
      : `${allUsers.slice(0, 2).join(", ")} và ${allUsers.length - 2} người khác`;

  return (
    <div
      className={clsx(
        "flex items-center mt-0.5",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      <button
        onClick={onOpenModal}
        title={tooltipText}
        className={clsx(
          "flex items-center gap-0.5 rounded-full px-2 py-0.5 border shadow-sm transition-all hover:shadow-md",
          reactions.some((r) => r.reactedByMe)
            ? "bg-primary/10 border-primary/30"
            : "bg-white border-surface-200 hover:bg-surface-50",
        )}
      >
        <span className="flex -space-x-0.5">
          {visibleEmojis.map((r) => (
            <span
              key={r.emoji}
              className="text-sm leading-none"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,.08)" }}
            >
              {r.emoji}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="text-[10px] font-bold text-text-muted leading-none self-center pl-0.5">
              +{hiddenCount}
            </span>
          )}
        </span>
        <span
          className={clsx(
            "text-[11px] font-semibold ml-1",
            reactions.some((r) => r.reactedByMe)
              ? "text-primary"
              : "text-text-secondary",
          )}
        >
          {totalCount}
        </span>
      </button>
    </div>
  );
}

interface MessageBubbleProps {
  msg: Message;
  conversationId: string;
  currentUserId: string;
  onReply: (m: Message) => void;
  onJumpToReply: (id: string) => void;
  highlighted?: boolean;
  onReactionsUpdated: (messageId: string, reactions: ReactionGroup[]) => void;
}

export function MessageBubble({
  msg,
  conversationId,
  currentUserId,
  onReply,
  onJumpToReply,
  highlighted,
  onReactionsUpdated,
}: MessageBubbleProps) {
  const [reacting, setReacting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEmoji = async (emoji: string) => {
    if (reacting) return;
    setReacting(true);

    const prevReactions = msg.reactions;

    const currentReaction = msg.reactions.find((r) => r.reactedByMe);
    const isSameEmoji = currentReaction?.emoji === emoji;

    let optimistic: ReactionGroup[];

    if (isSameEmoji) {
      optimistic = msg.reactions
        .map((r) =>
          r.emoji === emoji
            ? { ...r, count: r.count - 1, reactedByMe: false }
            : r,
        )
        .filter((r) => r.count > 0);
    } else if (currentReaction) {
      const withOldRemoved = msg.reactions
        .map((r) =>
          r.emoji === currentReaction.emoji
            ? { ...r, count: r.count - 1, reactedByMe: false }
            : r,
        )
        .filter((r) => r.count > 0);

      const existingNew = withOldRemoved.find((r) => r.emoji === emoji);
      if (existingNew) {
        optimistic = withOldRemoved.map((r) =>
          r.emoji === emoji
            ? { ...r, count: r.count + 1, reactedByMe: true }
            : r,
        );
      } else {
        optimistic = [
          ...withOldRemoved,
          { emoji, count: 1, reactedByMe: true, users: ["Bạn"] },
        ];
      }
    } else {
      const existing = msg.reactions.find((r) => r.emoji === emoji);
      if (existing) {
        optimistic = msg.reactions.map((r) =>
          r.emoji === emoji
            ? { ...r, count: r.count + 1, reactedByMe: true }
            : r,
        );
      } else {
        optimistic = [
          ...msg.reactions,
          { emoji, count: 1, reactedByMe: true, users: ["Bạn"] },
        ];
      }
    }

    onReactionsUpdated(msg.id, optimistic);

    try {
      const data = await toggleMessageReaction(conversationId, msg.id, emoji);
      const grouped = groupReactions(
        data.reactions as ApiReaction[],
        currentUserId,
      );
      onReactionsUpdated(msg.id, grouped);
    } catch {
      onReactionsUpdated(msg.id, prevReactions);
    } finally {
      setReacting(false);
    }
  };

  return (
    <>
      <div
        id={`message-${msg.id}`}
        className={clsx(
          "flex items-end gap-2 group rounded-2xl transition-all duration-700",
          msg.isMe ? "flex-row-reverse" : "flex-row",
        )}
        style={
          highlighted
            ? {
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              }
            : undefined
        }
      >
        {!msg.isMe && (
          <Avatar
            src={msg.avatarUrl}
            initials={msg.initials}
            color={msg.color}
            size="sm"
            shape="circle"
          />
        )}

        <div
          className={clsx(
            "flex flex-col gap-0.5",
            msg.isMe ? "items-end" : "items-start",
          )}
        >
          {!msg.isMe && (
            <p className="text-xs text-text-muted px-1 mb-0.5 font-medium">
              {msg.sender}
            </p>
          )}

          {msg.replyTo && (
            <button
              type="button"
              onClick={() => onJumpToReply(msg.replyTo!.id)}
              className={clsx(
                "flex items-start gap-2 px-3 py-2 rounded-xl mb-0.5 border-l-2 border-primary/40 max-w-full text-left hover:opacity-80 transition-opacity",
                msg.isMe ? "bg-primary/5" : "bg-surface-100",
              )}
            >
              <CornerUpLeft
                size={11}
                className="text-primary/60 shrink-0 mt-0.5"
              />
              <div className="flex flex-col min-w-0">
                {msg.isMe ? (
                  msg.replyTo.sender !== msg.sender && (
                    <p className="text-[10px] text-primary/60 font-medium leading-tight mb-0.5">
                      {`Bạn đã trả lời ${msg.replyTo.sender}`}
                    </p>
                  )
                ) : msg.replyTo.isMe ? (
                  <p className="text-[10px] text-primary/60 font-medium leading-tight mb-0.5">
                    {`${msg.sender} đã trả lời bạn`}
                  </p>
                ) : (
                  msg.sender !== msg.replyTo.sender && (
                    <p className="text-[10px] text-primary/60 font-medium leading-tight mb-0.5">
                      {`${msg.sender} đã trả lời ${msg.replyTo.sender}`}
                    </p>
                  )
                )}
                <p className="text-[11px] text-text-muted truncate">
                  {msg.replyTo.content}
                </p>
              </div>
            </button>
          )}

          <div
            className={clsx(
              "flex items-end gap-1",
              msg.isMe ? "flex-row-reverse" : "flex-row",
            )}
          >
            <div
              className={clsx(
                "flex flex-col gap-0.5",
                msg.isMe ? "items-end" : "items-start",
              )}
            >
              {msg.content && (
                <div
                  className={clsx(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.isMe
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white border border-surface-200 text-text-primary rounded-bl-sm shadow-sm",
                  )}
                >
                  {msg.content}
                </div>
              )}

              {msg.attachment && (
                <div className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-2xl shadow-sm min-w-[200px]">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {msg.attachment.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {msg.attachment.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {msg.attachment.size}
                    </p>
                  </div>
                  <button className="p-1.5 hover:bg-surface-100 rounded-lg text-text-secondary transition-colors">
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>

            <MessageActions
              isMe={msg.isMe}
              onEmoji={handleEmoji}
              onReply={() => onReply(msg)}
            />
          </div>

          <ReactionBar
            reactions={msg.reactions}
            isMe={msg.isMe}
            onToggle={handleEmoji}
            onOpenModal={() => setModalOpen(true)}
          />

          <p
            className={clsx(
              "text-[11px] text-text-muted px-1 mt-0.5",
              msg.isMe ? "text-right" : "text-left",
            )}
          >
            {msg.isMe ? `Bạn · ${msg.time}` : msg.time}
          </p>
        </div>
      </div>

      {modalOpen && msg.reactions.length > 0 && (
        <ReactionModal
          reactions={msg.reactions}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
