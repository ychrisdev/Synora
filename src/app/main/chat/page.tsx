"use client";

import { useState } from "react";
import { Search, Edit, Download, Phone, Video, Info, Send, Paperclip, Smile } from "lucide-react";
import { clsx } from "clsx";

const conversations = [
  {
    id: 1,
    name: "Nhóm Giải Tích 1",
    initials: "GT",
    color: "bg-primary",
    isGroup: true,
    lastMessage: "Quỳnh Anh: Mọi người di bài tập...",
    time: "2 phút",
    unread: 3,
  },
  {
    id: 2,
    name: "Hội yêu Toán học",
    initials: "HT",
    color: "bg-orange-500",
    isGroup: true,
    lastMessage: "Minh Tuấn: Ai làm xong đề chưa...",
    time: "15 phút",
    unread: 1,
  },
  {
    id: 3,
    name: "Trần Lê Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    isGroup: false,
    lastMessage: "Mình gửi file đề cương rồi nhé!",
    time: "1 giờ",
    unread: 0,
  },
  {
    id: 4,
    name: "Lê Minh Tuấn",
    initials: "MT",
    color: "bg-green-500",
    isGroup: false,
    lastMessage: "Tối nay học nhóm không bạn?",
    time: "3 giờ",
    unread: 0,
  },
  {
    id: 5,
    name: "Nhóm IELTS 7.0+",
    initials: "IE",
    color: "bg-teal-500",
    isGroup: true,
    lastMessage: "Anh Tú: Bài reading hôm nay...",
    time: "Hôm qua",
    unread: 0,
  },
];

const messages = [
  { id: 1, sender: "Quỳnh Anh", initials: "QA", color: "bg-purple-500", time: "14:20", content: "Mình gửi đề cương Giải Tích 1 cho cả nhóm nha! Có phần tích phân bội mình note kỹ lắm", isMe: false, attachment: null },
  { id: 2, sender: "Quỳnh Anh", initials: "QA", color: "bg-purple-500", time: "14:20", content: null, isMe: false, attachment: { name: "De_cuong_Giai_Tich_...", size: "1.2 MB", type: "PDF" } },
  { id: 3, sender: "Minh Tuấn", initials: "MT", color: "bg-green-500", time: "14:25", content: "Cảm ơn Anh nhiều lắm! Mình đang vướng phần này ghê", isMe: false, attachment: null },
  { id: 4, sender: "Me", initials: "NA", color: "bg-primary", time: "14:26", content: "Mình cũng vậy, tối nay mọi người học nhóm ở thư viện không?", isMe: true, attachment: null },
  { id: 5, sender: "Quỳnh Anh", initials: "QA", color: "bg-purple-500", time: "14:30", content: "Ok mình đồng ý! 7h tối nha mọi người", isMe: false, attachment: null },
];

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Conversation list */}
      <div className="w-[280px] shrink-0 border-r border-surface-200 bg-white flex flex-col">
        <div className="p-4 border-b border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary">Tin nhắn</h2>
            <button className="p-1.5 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
              <Edit size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full pl-8 pr-3 py-2 bg-surface-100 rounded-lg text-sm placeholder:text-text-muted focus:outline-none border border-transparent focus:border-primary focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                activeConv === conv.id ? "bg-primary/10" : "hover:bg-surface-50"
              )}
            >
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0", conv.color)}>
                {conv.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary truncate">{conv.name}</p>
                  <span className="text-[10px] text-text-muted shrink-0 ml-1">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center shrink-0 ml-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">GT</div>
            <div>
              <p className="text-sm font-bold text-text-primary">Nhóm Giải Tích 1</p>
              <p className="text-xs text-text-muted">4 thành viên</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[Phone, Video, Info].map((Icon, i) => (
              <button key={i} className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
                <Icon size={17} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-surface-50">
          {/* Date separator */}
          <div className="flex items-center justify-center">
            <span className="text-xs text-text-muted bg-surface-200 px-3 py-1 rounded-full">Quỳnh Anh đã chia sẻ một tài liệu</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={clsx("flex items-end gap-2", msg.isMe ? "flex-row-reverse" : "flex-row")}>
              {!msg.isMe && (
                <div className={clsx("w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0", msg.color)}>
                  {msg.initials}
                </div>
              )}
              <div className={clsx("max-w-[65%]", msg.isMe ? "items-end" : "items-start", "flex flex-col gap-1")}>
                {!msg.isMe && <p className="text-[11px] text-text-muted px-1">{msg.sender}, {msg.time}</p>}
                {msg.content && (
                  <div className={clsx("px-4 py-2.5 rounded-2xl text-sm", msg.isMe ? "bg-primary text-white rounded-br-sm" : "bg-white border border-surface-200 text-text-primary rounded-bl-sm")}>
                    {msg.content}
                  </div>
                )}
                {msg.attachment && (
                  <div className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-xl">
                    <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center text-white text-[9px] font-bold">PDF</div>
                    <div>
                      <p className="text-xs font-medium text-text-primary">{msg.attachment.name}</p>
                      <p className="text-[10px] text-text-muted">{msg.attachment.size}</p>
                    </div>
                    <button className="ml-2 p-1.5 hover:bg-surface-100 rounded-lg text-text-secondary transition-colors">
                      <Download size={13} />
                    </button>
                  </div>
                )}
                {msg.isMe && <p className="text-[11px] text-text-muted px-1 text-right">Bạn, {msg.time}</p>}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">MT</div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-bl-sm px-4 py-2.5">
              <p className="text-xs text-text-muted italic">Minh Tuấn đang nhập...</p>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 py-3 border-t border-surface-200 bg-white">
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors">
              <Paperclip size={17} />
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
    </div>
  );
}
