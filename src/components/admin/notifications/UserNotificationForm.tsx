"use client";
import { useRef, useState } from "react";
import { Search, X, Send, UserCog } from "lucide-react";
import { clsx } from "clsx";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { useOutsideClickRefs } from "@/lib/chat/hooks";
import {
  REASON_LABELS,
  type MiniUser,
  type UserNotifReason,
} from "@/lib/admin-notifications/types";

const MOCK_SEARCH_USERS: MiniUser[] = [
  { id: "1", name: "Nguyễn Văn A", username: "nva123", avatarUrl: null },
  { id: "2", name: "Trần Thị B", username: "ttb", avatarUrl: null },
  { id: "3", name: "Lê Văn C", username: "lvc2003", avatarUrl: null },
  { id: "4", name: "Phạm Thị D", username: "ptd_studio", avatarUrl: null },
  { id: "5", name: "Hoàng Văn E", username: "hoangv", avatarUrl: null },
];

export function UserNotificationForm({
  onSent,
}: {
  onSent: (data: {
    recipients: MiniUser[];
    title: string;
    content: string;
    reason: UserNotifReason;
  }) => void;
}) {
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recipients, setRecipients] = useState<MiniUser[]>([]);
  const [reason, setReason] = useState<UserNotifReason>("VIOLATION");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useOutsideClickRefs([searchRef], () => setSearchOpen(false));

  const results = MOCK_SEARCH_USERS.filter(
    (u) =>
      !recipients.some((r) => r.id === u.id) &&
      query.length > 0 &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())),
  );

  const addRecipient = (u: MiniUser) => {
    setRecipients((prev) => [...prev, u]);
    setQuery("");
    setSearchOpen(false);
  };

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((u) => u.id !== id));
  };

  const isValid = recipients.length > 0 && title.trim().length > 0 && content.trim().length > 0;

  const handleSend = async () => {
    if (recipients.length === 0) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSent({ recipients, title, content, reason });
      showToast(
        recipients.length === 1
          ? `Đã gửi thông báo đến ${recipients[0].name}`
          : `Đã gửi thông báo đến ${recipients.length} người dùng`,
        "success",
      );
      setRecipients([]);
      setQuery("");
      setTitle("");
      setContent("");
      setReason("VIOLATION");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
          <UserCog size={15} className="text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Soạn thông báo cho người dùng</p>
          <p className="text-xs text-slate-400">Gửi trực tiếp đến trang thông báo của một hoặc nhiều người dùng</p>
        </div>
      </div>

      <div ref={searchRef} className="relative mb-3">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Tìm người nhận theo tên hoặc username..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {searchOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 max-h-64 overflow-y-auto">
            {results.map((u) => (
              <button
                key={u.id}
                onClick={() => addRecipient(u)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 text-left"
              >
                <Avatar
                  src={u.avatarUrl ?? undefined}
                  initials={u.name.slice(0, 2).toUpperCase()}
                  size="sm"
                />
                <div>
                  <p className="text-xs font-medium text-slate-800">{u.name}</p>
                  <p className="text-[11px] text-slate-400">@{u.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-[11px] font-medium text-slate-400 mb-1.5">
          Danh sách người nhận {recipients.length > 0 && `(${recipients.length})`}
        </p>
        {recipients.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl px-3.5 py-4 text-center">
            <p className="text-xs text-slate-400">Chưa chọn người nhận nào</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {recipients.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={u.avatarUrl ?? undefined}
                    initials={u.name.slice(0, 2).toUpperCase()}
                    size="sm"
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{u.name}</p>
                    <p className="text-[11px] text-slate-400">@{u.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeRecipient(u.id)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {(Object.keys(REASON_LABELS) as UserNotifReason[]).map((r) => (
          <button
            key={r}
            onClick={() => setReason(r)}
            className={clsx(
              "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
              reason === r
                ? "border-purple-400 bg-purple-50 text-purple-600"
                : "border-slate-200 text-slate-500 hover:bg-slate-50",
            )}
          >
            {REASON_LABELS[r]}
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề thông báo..."
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-purple-400 mb-3"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nội dung thông báo..."
        rows={4}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-purple-400 resize-none mb-4"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSend}
          disabled={!isValid || loading}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Send size={14} />
          {loading ? "Đang gửi..." : "Gửi thông báo"}
        </button>
      </div>
    </div>
  );
}