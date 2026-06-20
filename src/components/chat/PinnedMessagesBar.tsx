"use client";

import { useState } from "react";
import { Pin, X, ChevronDown, ChevronUp } from "lucide-react";
import type { PinnedMessage } from "@/lib/chat/types";

interface PinnedMessagesBarProps {
  pinned: PinnedMessage[];
  onJump: (id: string) => void;
  onUnpin: (id: string) => void;
}

export function PinnedMessagesBar({
  pinned,
  onJump,
  onUnpin,
}: PinnedMessagesBarProps) {
  const [expanded, setExpanded] = useState(false);
  if (pinned.length === 0) return null;

  const visible = expanded ? pinned : pinned.slice(0, 1);

  const getPreview = (m: PinnedMessage) => {
    if (m.deletedAt) return "Tin nhắn đã bị thu hồi";
    if (m.content) return m.content;
    if (m.fileType) return "Đã gửi một tệp";
    return "";
  };

  const getSenderName = (m: PinnedMessage) =>
    m.sender.profile?.displayName ?? m.sender.username;

  return (
    <div className="border-b border-surface-200 bg-surface">
      {visible.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-2.5 px-4 py-2 border-b border-primary/10 last:border-b-0 hover:bg-primary/10"
        >
          <Pin size={13} className="text-primary shrink-0" />
          <button
            onClick={() => onJump(m.id)}
            className="flex-1 min-w-0 text-left cursor-pointer"
          >
            <p className="text-[11px] font-semibold text-primary leading-tight">
              {getSenderName(m)}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {getPreview(m)}
            </p>
          </button>
          <button
            onClick={() => onUnpin(m.id)}
            title="Bỏ ghim"
            className="p-1 hover:bg-primary/10 rounded-lg text-primary/70 transition-colors shrink-0 cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      ))}

      {pinned.length > 1 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 py-1 text-[11px] text-primary font-medium hover:bg-primary/[0.06] transition-colors"
        >
          {expanded ? (
            <>
              Thu gọn <ChevronUp size={12} />
            </>
          ) : (
            <>
              Xem {pinned.length - 1} tin ghim khác <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
