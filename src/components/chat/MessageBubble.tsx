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
} from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { useOutsideClick } from "@/lib/chat/hooks";
import type { Message } from "@/lib/chat/types";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

interface MessageActionsProps {
  isMe: boolean;
  onEmoji: (e: string) => void;
  onReply: () => void;
}

export function MessageActions({
  isMe,
  onEmoji,
  onReply,
}: MessageActionsProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(emojiRef, () => setEmojiOpen(false));
  useOutsideClick(menuRef, () => setMenuOpen(false));

  return (
    <div
      className={clsx(
        "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center",
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

interface MessageBubbleProps {
  msg: Message;
  onReply: (m: Message) => void;
  onJumpToReply: (id: string) => void;
  highlighted?: boolean;
}

export function MessageBubble({
  msg,
  onReply,
  onJumpToReply,
  highlighted,
}: MessageBubbleProps) {
  const [reactions, setReactions] = useState<string[]>([]);

  const addEmoji = (e: string) =>
    setReactions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );

  return (
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
          "max-w-[62%] flex flex-col gap-0.5",
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
              <p className="text-[10px] text-primary/60 font-medium leading-tight mb-0.5">
                {msg.isMe
                  ? msg.replyTo.sender === msg.sender
                    ? "Bạn đã trả lời chính mình"
                    : `Bạn đã trả lời ${msg.replyTo.sender}`
                  : msg.replyTo.isMe
                    ? `${msg.sender} đã trả lời bạn`
                    : `${msg.sender} đã trả lời ${msg.replyTo.sender}`}
              </p>
              <p className="text-[11px] text-text-muted truncate">
                {msg.replyTo.content}
              </p>
            </div>
          </button>
        )}

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
              <p className="text-xs text-text-muted">{msg.attachment.size}</p>
            </div>
            <button className="p-1.5 hover:bg-surface-100 rounded-lg text-text-secondary transition-colors">
              <Download size={14} />
            </button>
          </div>
        )}

        {reactions.length > 0 && (
          <div
            className={clsx(
              "flex gap-1 mt-0.5 flex-wrap",
              msg.isMe ? "justify-end" : "justify-start",
            )}
          >
            {reactions.map((e) => (
              <button
                key={e}
                onClick={() => addEmoji(e)}
                className="text-sm bg-white border border-surface-200 rounded-full px-2 py-0.5 hover:bg-surface-50 shadow-sm transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        <p
          className={clsx(
            "text-[11px] text-text-muted px-1 mt-0.5",
            msg.isMe ? "text-right" : "text-left",
          )}
        >
          {msg.isMe ? `Bạn · ${msg.time}` : msg.time}
        </p>
      </div>

      <MessageActions
        isMe={msg.isMe}
        onEmoji={addEmoji}
        onReply={() => onReply(msg)}
      />
    </div>
  );
}
