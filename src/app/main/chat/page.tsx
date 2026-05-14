"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Edit,
  Download,
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  Home,
  User,
  Bell,
  BellOff,
  ShieldAlert,
  Flag,
  X,
  Users,
  LogOut,
  ChevronRight,
  Crown,
  Shield,
  Clock,
  MoreHorizontal,
  PhoneCall,
  VideoIcon,
  BanIcon,
  MessageSquare,
  Settings,
  HelpCircle,
  Pin,
  Forward,
  Undo2,
  CornerUpLeft,
  MoreVertical,
} from "lucide-react";
import { clsx } from "clsx";

type Conversation = {
  id: number;
  name: string;
  initials: string;
  color: string;
  isGroup: boolean;
  lastMessage: string;
  time: string;
  unread: number;
};
type Member = {
  initials: string;
  color: string;
  name: string;
  role: "admin" | "mod" | "member";
  active: boolean;
};
type Message = {
  id: number;
  sender: string;
  initials: string;
  color: string;
  time: string;
  content: string | null;
  isMe: boolean;
  attachment: { name: string; size: string; type: string } | null;
};

const ME = { initials: "NA", name: "Nguyễn An", color: "bg-primary" };

const conversations: Conversation[] = [
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

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:20",
    content:
      "Mình gửi đề cương Giải Tích 1 cho cả nhóm nha! Có phần tích phân bội mình note kỹ lắm",
    isMe: false,
    attachment: null,
  },
  {
    id: 2,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:20",
    content: null,
    isMe: false,
    attachment: {
      name: "De_cuong_Giai_Tich_1.pdf",
      size: "1.2 MB",
      type: "PDF",
    },
  },
  {
    id: 3,
    sender: "Minh Tuấn",
    initials: "MT",
    color: "bg-green-500",
    time: "14:25",
    content: "Cảm ơn Anh nhiều lắm! Mình đang vướng phần này ghê",
    isMe: false,
    attachment: null,
  },
  {
    id: 4,
    sender: "Me",
    initials: "NA",
    color: "bg-primary",
    time: "14:26",
    content: "Mình cũng vậy, tối nay mọi người học nhóm ở thư viện không?",
    isMe: true,
    attachment: null,
  },
  {
    id: 5,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:30",
    content: "Ok mình đồng ý! 7h tối nha mọi người",
    isMe: false,
    attachment: null,
  },
];

const groupMembers: Member[] = [
  {
    initials: "NA",
    color: "bg-primary",
    name: "Nguyễn An (Bạn)",
    role: "member",
    active: true,
  },
  {
    initials: "QA",
    color: "bg-purple-500",
    name: "Trần Lê Quỳnh Anh",
    role: "admin",
    active: true,
  },
  {
    initials: "MT",
    color: "bg-green-500",
    name: "Lê Minh Tuấn",
    role: "member",
    active: false,
  },
  {
    initials: "AT",
    color: "bg-teal-500",
    name: "Phạm Anh Tú",
    role: "mod",
    active: false,
  },
];

const sharedImages = [
  { id: 1, bg: "bg-gradient-to-br from-blue-200 to-blue-300" },
  { id: 2, bg: "bg-gradient-to-br from-emerald-200 to-emerald-300" },
  { id: 3, bg: "bg-gradient-to-br from-pink-200 to-pink-300" },
  { id: 4, bg: "bg-gradient-to-br from-amber-200 to-amber-300" },
  { id: 5, bg: "bg-gradient-to-br from-violet-200 to-violet-300" },
  { id: 6, bg: "bg-gradient-to-br from-cyan-200 to-cyan-300" },
];

const sharedFiles = [
  {
    name: "De_cuong_Giai_Tich_1.pdf",
    size: "1.2 MB",
    type: "PDF",
    color: "bg-red-500",
    date: "Hôm nay",
  },
  {
    name: "Bai_tap_tich_phan.pdf",
    size: "840 KB",
    type: "PDF",
    color: "bg-red-500",
    date: "Hôm qua",
  },
  {
    name: "Slide_chuong_3.pptx",
    size: "3.1 MB",
    type: "PPT",
    color: "bg-orange-500",
    date: "2 ngày trước",
  },
  {
    name: "Ghi_chu_chuong_2.docx",
    size: "520 KB",
    type: "DOC",
    color: "bg-blue-500",
    date: "3 ngày trước",
  },
];

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

function RoleBadge({ role }: { role: Member["role"] }) {
  if (role === "admin")
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full leading-none">
        <Crown size={8} />
        Quản trị
      </span>
    );
  if (role === "mod")
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full leading-none">
        <Shield size={8} />
        Mod
      </span>
    );
  return null;
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  cb: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

type MsgActionsProps = {
  isMe: boolean;
  onEmoji: (e: string) => void;
  onReply: () => void;
};

function MessageActions({ isMe, onEmoji, onReply }: MsgActionsProps) {
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
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text-primary hover:bg-surface-50 transition-colors">
              <Pin size={14} className="text-text-muted shrink-0" />
              Ghim tin nhắn
            </button>
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text-primary hover:bg-surface-50 transition-colors">
              <Forward size={14} className="text-text-muted shrink-0" />
              Chuyển tiếp
            </button>
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text-primary hover:bg-surface-50 transition-colors">
              <Undo2 size={14} className="text-text-muted shrink-0" />
              Thu hồi
            </button>
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

type BubbleProps = {
  msg: Message;
  replyTarget: Message | null;
  onReply: (m: Message) => void;
};

function MessageBubble({ msg, replyTarget, onReply }: BubbleProps) {
  const [reactions, setReactions] = useState<string[]>([]);

  const addEmoji = (e: string) => {
    setReactions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );
  };

  return (
    <div
      className={clsx(
        "flex items-end gap-2 group",
        msg.isMe ? "flex-row-reverse" : "flex-row",
      )}
    >
      {!msg.isMe && (
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1",
            msg.color,
          )}
        >
          {msg.initials}
        </div>
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

        {replyTarget && (
          <div
            className={clsx(
              "flex items-start gap-2 px-3 py-2 rounded-xl mb-0.5 border-l-2 border-primary/40 max-w-full",
              msg.isMe ? "bg-primary/5" : "bg-surface-100",
            )}
          >
            <CornerUpLeft
              size={11}
              className="text-primary/60 shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-text-muted truncate">
              <span className="font-semibold text-primary/80">
                {replyTarget.sender}{" "}
              </span>
              {replyTarget.content ?? replyTarget.attachment?.name}
            </p>
          </div>
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
              PDF
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

function MediaModal({
  tab: init,
  onClose,
}: {
  tab: "images" | "files";
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"images" | "files">(init);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[380px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <p className="text-sm font-bold text-text-primary">
            Ảnh &amp; File đã chia sẻ
          </p>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex border-b border-surface-100 px-5">
          {(["images", "files"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "py-3 mr-7 text-xs font-semibold border-b-2 transition-colors",
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary",
              )}
            >
              {t === "images" ? "Ảnh" : "File"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "images" ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "aspect-square rounded-xl cursor-pointer hover:opacity-80 transition-opacity",
                    sharedImages[i % 6].bg,
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[...sharedFiles, ...sharedFiles.slice(0, 2)].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors group border border-surface-100"
                >
                  <div
                    className={clsx(
                      "w-9 h-9 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shrink-0",
                      f.color,
                    )}
                  >
                    {f.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {f.name}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {f.size} · {f.date}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-200 rounded-lg transition-all">
                    <Download size={13} className="text-text-muted" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MemberMenu({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);
  const isMe = member.name.includes("Bạn");
  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-50 overflow-hidden"
    >
      {isMe ? (
        <div className="px-3 py-2 text-xs text-text-muted">Đây là bạn</div>
      ) : (
        <>
          <Link
            href="/main/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
          >
            <User size={13} className="text-text-muted shrink-0" />
            Trang cá nhân
          </Link>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
            <MessageSquare size={13} className="text-text-muted shrink-0" />
            Nhắn tin
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
            <PhoneCall size={13} className="text-text-muted shrink-0" />
            Gọi âm thanh
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
            <VideoIcon size={13} className="text-text-muted shrink-0" />
            Gọi video
          </button>
          <div className="h-px bg-surface-100 my-0.5" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
            <BanIcon size={13} className="shrink-0" />
            Chặn
          </button>
        </>
      )}
    </div>
  );
}

function MembersModal({ onClose }: { onClose: () => void }) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[320px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div>
            <p className="text-sm font-bold text-text-primary">
              Thành viên nhóm
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {groupMembers.length} thành viên
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {groupMembers.map((m, i) => (
            <div
              key={i}
              className="relative flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors group"
            >
              <div className="relative shrink-0">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    m.color,
                  )}
                >
                  {m.initials}
                </div>
                {m.active && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {m.name}
                  </p>
                  <RoleBadge role={m.role} />
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  {m.active ? "Đang hoạt động" : "Không hoạt động"}
                </p>
              </div>
              {!m.name.includes("Bạn") && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-200 rounded-lg transition-all text-text-muted"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === i && (
                    <MemberMenu member={m} onClose={() => setOpenMenu(null)} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative w-full flex flex-col items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all",
          ME.color,
          open
            ? "ring-2 ring-primary/40 ring-offset-1"
            : "hover:opacity-90 hover:ring-2 hover:ring-primary/20 hover:ring-offset-1",
        )}
      >
        {ME.initials}
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-56 bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden z-50">
          <div className="px-4 py-3.5 border-b border-surface-100 flex items-center gap-3">
            <div
              className={clsx(
                "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
                ME.color,
              )}
            >
              {ME.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">
                {ME.name}
              </p>
              <p className="text-xs text-green-500 font-medium">
                ● Đang hoạt động
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-surface-100 border-b border-surface-100">
            {[
              {
                icon: <MessageSquare size={13} className="text-primary" />,
                val: "5",
                label: "Tin nhắn",
              },
              {
                icon: <Clock size={13} className="text-amber-500" />,
                val: "2",
                label: "Tin chờ",
              },
              {
                icon: <BanIcon size={13} className="text-red-400" />,
                val: "1",
                label: "Đã chặn",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-2.5 gap-0.5"
              >
                {s.icon}
                <p className="text-xs font-bold text-text-primary">{s.val}</p>
                <p className="text-[9px] text-text-muted leading-none">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="py-1">
            <Link
              href="/main/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
            >
              <User size={14} className="text-text-muted shrink-0" />
              Trang cá nhân
            </Link>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
              <Clock size={14} className="text-text-muted shrink-0" />
              Tin nhắn chờ
              <span className="ml-auto bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full px-1.5 py-0.5">
                2
              </span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
              <BanIcon size={14} className="text-text-muted shrink-0" />
              Danh sách chặn
              <span className="ml-auto bg-red-50 text-red-400 text-[10px] font-bold rounded-full px-1.5 py-0.5">
                1
              </span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
              <Settings size={14} className="text-text-muted shrink-0" />
              Cài đặt
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors">
              <HelpCircle size={14} className="text-text-muted shrink-0" />
              Trợ giúp
            </button>
          </div>
          <div className="border-t border-surface-100 py-1">
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={14} className="shrink-0" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoSidebar({
  conv,
  onClose,
}: {
  conv: Conversation;
  onClose: () => void;
}) {
  const [notifOn, setNotifOn] = useState(true);
  const [mediaModal, setMediaModal] = useState<"images" | "files" | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [confirm, setConfirm] = useState<"block" | "leave" | "report" | null>(
    null,
  );

  return (
    <>
      <div className="w-[280px] shrink-0 border-l border-surface-200 bg-white flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 shrink-0">
          <p className="text-sm font-bold text-text-primary">Thông tin</p>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col items-center pt-5 pb-4 px-4 border-b border-surface-100">
          <div
            className={clsx(
              "w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2.5",
              conv.color,
            )}
          >
            {conv.initials}
          </div>
          <p className="text-sm font-bold text-text-primary text-center">
            {conv.name}
          </p>
          {conv.isGroup ? (
            <p className="text-xs text-text-muted mt-0.5">
              Nhóm · {groupMembers.length} thành viên
            </p>
          ) : (
            <p className="text-xs text-green-500 mt-0.5 font-medium">
              ● Đang hoạt động
            </p>
          )}
          {!conv.isGroup && (
            <Link
              href="/main/profile"
              className="mt-2.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1.5"
            >
              <User size={11} />
              Xem trang cá nhân
            </Link>
          )}
        </div>

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                  notifOn ? "bg-primary/10" : "bg-surface-100",
                )}
              >
                {notifOn ? (
                  <Bell size={14} className="text-primary" />
                ) : (
                  <BellOff size={14} className="text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Thông báo
                </p>
                <p className="text-[11px] text-text-muted">
                  {notifOn ? "Đang bật" : "Đã tắt"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifOn((v) => !v)}
              className={clsx(
                "w-10 h-5 rounded-full transition-all relative shrink-0",
                notifOn ? "bg-primary" : "bg-surface-300",
              )}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  notifOn ? "translate-x-0.5" : "translate-x-[-15px]",
                )}
              />
            </button>
          </div>
        </div>

        {conv.isGroup && (
          <div className="px-4 py-3 border-b border-surface-100">
            <button
              onClick={() => setMembersOpen(true)}
              className="w-full flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={14} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-text-primary">
                  Thành viên
                </p>
                <p className="text-[11px] text-text-muted">
                  {groupMembers.length} người
                </p>
              </div>
              <ChevronRight
                size={13}
                className="text-text-muted group-hover:text-text-secondary transition-colors"
              />
            </button>
          </div>
        )}

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-text-primary">
              Ảnh &amp; File
            </p>
            <button
              onClick={() => setMediaModal("images")}
              className="text-xs text-primary font-semibold hover:underline shrink-0"
            >
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {sharedImages.map((img) => (
              <div
                key={img.id}
                className={clsx(
                  "aspect-square rounded-lg cursor-pointer hover:opacity-75 transition-opacity",
                  img.bg,
                )}
              />
            ))}
          </div>
          <div className="h-px bg-surface-100 mb-2.5" />
          <div className="flex flex-col gap-1">
            {sharedFiles.slice(0, 2).map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-50 transition-colors group cursor-pointer"
              >
                <div
                  className={clsx(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-white text-[8px] font-bold shrink-0",
                    f.color,
                  )}
                >
                  {f.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {f.name}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {f.size} · {f.date}
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-200 rounded-md transition-all shrink-0">
                  <Download size={11} className="text-text-muted" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">
            {conv.isGroup ? "Tuỳ chọn nhóm" : "Tuỳ chọn"}
          </p>
          {!conv.isGroup && (
            <button
              onClick={() => setConfirm("block")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                <ShieldAlert
                  size={13}
                  className="text-text-muted group-hover:text-red-500 transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">
                  Chặn người dùng
                </p>
                <p className="text-[11px] text-text-muted">
                  Ngừng nhận tin từ người này
                </p>
              </div>
            </button>
          )}
          {conv.isGroup && (
            <button
              onClick={() => setConfirm("leave")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors shrink-0">
                <LogOut
                  size={13}
                  className="text-text-muted group-hover:text-orange-500 transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-orange-500 transition-colors">
                  Rời nhóm
                </p>
                <p className="text-[11px] text-text-muted">
                  Bạn sẽ không nhận tin nhắn nữa
                </p>
              </div>
            </button>
          )}
          <button
            onClick={() => setConfirm("report")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
              <Flag
                size={13}
                className="text-text-muted group-hover:text-red-500 transition-colors"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">
                Báo cáo
              </p>
              <p className="text-[11px] text-text-muted">
                Gửi phản ánh đến quản trị viên
              </p>
            </div>
          </button>
        </div>
      </div>

      {mediaModal && (
        <MediaModal tab={mediaModal} onClose={() => setMediaModal(null)} />
      )}
      {membersOpen && <MembersModal onClose={() => setMembersOpen(false)} />}

      {confirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={() => setConfirm(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl shadow-2xl z-[70] p-6">
            <p className="text-sm font-bold text-text-primary mb-1">
              {confirm === "block"
                ? "Chặn người dùng?"
                : confirm === "leave"
                  ? "Rời nhóm?"
                  : "Báo cáo?"}
            </p>
            <p className="text-xs text-text-muted mb-5">
              {confirm === "block"
                ? `Bạn sẽ không nhận được tin nhắn từ ${conv.name} nữa.`
                : confirm === "leave"
                  ? `Bạn sẽ rời ${conv.name}. Cần được mời lại để tham gia tiếp.`
                  : "Mô tả vấn đề sẽ giúp chúng tôi xử lý nhanh hơn."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-surface-200 text-xs font-semibold text-text-secondary hover:bg-surface-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => setConfirm(null)}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors",
                  confirm === "leave"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-red-500 hover:bg-red-600",
                )}
              >
                {confirm === "block"
                  ? "Chặn"
                  : confirm === "leave"
                    ? "Rời nhóm"
                    : "Báo cáo"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [input, setInput] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const currentConv = conversations.find((c) => c.id === activeConv)!;

  const handleReply = (msg: Message) => setReplyingTo(msg);
  const cancelReply = () => setReplyingTo(null);

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
        <div className="flex-1" />
        <AvatarMenu />
      </div>

      <div className="w-[268px] shrink-0 border-r border-surface-200 bg-white flex flex-col">
        <div className="p-4 border-b border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary">Tin nhắn</h2>
            <button
              className="p-1.5 text-text-secondary hover:bg-surface-100 rounded-lg transition-colors"
              title="Tạo trò chuyện"
            >
              <Edit size={15} />
            </button>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-8 pr-3 py-2 bg-surface-100 rounded-lg text-xs placeholder:text-text-muted focus:outline-none border border-transparent focus:border-primary focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConv(conv.id);
                setInfoOpen(false);
                setReplyingTo(null);
              }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                activeConv === conv.id
                  ? "bg-primary/10"
                  : "hover:bg-surface-50",
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
                  conv.color,
                )}
              >
                {conv.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {conv.name}
                  </p>
                  <span className="text-[10px] text-text-muted shrink-0 ml-1">
                    {conv.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-text-muted truncate">
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shrink-0 ml-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white min-w-0">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-200 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
                currentConv.color,
              )}
            >
              {currentConv.initials}
            </div>
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
            {[Phone, Video].map((Icon, i) => (
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
              onReply={handleReply}
            />
          ))}
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              MT
            </div>
            <div className="bg-white border border-surface-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span
                  className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
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
            <button
              onClick={cancelReply}
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

      {infoOpen && (
        <InfoSidebar conv={currentConv} onClose={() => setInfoOpen(false)} />
      )}
    </div>
  );
}
