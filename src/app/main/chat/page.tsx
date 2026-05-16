"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Edit, Phone, Video, Info, Send, Paperclip, ImageIcon, Smile, X } from "lucide-react";
import { clsx } from "clsx";

import { conversations, initialMessages, groupMembers } from "@/lib/chat/data";
import type { Message, FilterChip } from "@/lib/chat/type";

import { MessageBubble } from "@/components/chat/MessageBubble";
import { Badge } from "@/components/chat/Badge";
import { AvatarMenu } from "@/components/chat/AvatarMenu";
import { NewConversationModal } from "@/components/chat/NewConversationModal";

import { ConversationList } from "@/components/chat/sidebar/ConversationList";
import { InfoSidebar } from "@/components/chat/sidebar/InfoSidebar";

export default function ChatPage() {
  const [activeConv,    setActiveConv]    = useState(1);
  const [input,         setInput]         = useState("");
  const [infoOpen,      setInfoOpen]      = useState(false);
  const [replyingTo,    setReplyingTo]    = useState<Message | null>(null);
  const [newConvOpen,   setNewConvOpen]   = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeFilter,  setActiveFilter]  = useState<FilterChip>("all");

  const currentConv = conversations.find((c) => c.id === activeConv)!;

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "unread") return c.unread > 0;
    if (activeFilter === "group")  return c.isGroup;
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const handleSelectConv = (id: number) => {
    setActiveConv(id);
    setInfoOpen(false);
    setReplyingTo(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[52px] shrink-0 bg-white border-r border-surface-200 flex flex-col items-center py-3 gap-2 z-20">
        <Link
          href="/main/feed"
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
          <Badge count={totalUnread} variant="unread" size="sm" className="absolute -top-1 -right-1 pointer-events-none" />
        </div>

        <div className="flex-1" />
        <AvatarMenu />
      </div>

      <ConversationList
        conversations={filteredConversations}
        activeId={activeConv}
        onSelect={handleSelectConv}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalUnread={totalUnread}
      />

      <div className="flex-1 flex flex-col bg-white min-w-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold", currentConv.color)}>
              {currentConv.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{currentConv.name}</p>
              <p className="text-xs text-text-muted">
                {currentConv.isGroup ? `${groupMembers.length} thành viên` : "Đang hoạt động"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            {[Phone, Video].map((Icon, i) => (
              <button key={i} className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
                <Icon size={17} />
              </button>
            ))}
            <button
              onClick={() => setInfoOpen((v) => !v)}
              className={clsx("p-2 rounded-lg transition-colors", infoOpen ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-100")}
              title="Thông tin cuộc trò chuyện"
            >
              <Info size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-surface-50">
          <div className="flex items-center justify-center">
            <span className="text-xs text-text-muted bg-surface-200 px-3 py-1 rounded-full">
              Quỳnh Anh đã chia sẻ một tài liệu
            </span>
          </div>

          {initialMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              replyTarget={null}
              onReply={setReplyingTo}
            />
          ))}

          <div className="flex items-end gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              MT
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
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
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-surface-200 rounded-lg transition-colors text-text-muted shrink-0">
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
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <button className="p-2 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {infoOpen && <InfoSidebar conv={currentConv} onClose={() => setInfoOpen(false)} />}

      {newConvOpen && <NewConversationModal onClose={() => setNewConvOpen(false)} />}
    </div>
  );
}