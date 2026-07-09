"use client";
import { useState } from "react";
import { Megaphone, Send, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { SystemNotifType } from "@/lib/admin-notifications/types";

export function SystemNotificationForm({
  onSent,
}: {
  onSent: (data: {
    title: string;
    content: string;
    type: SystemNotifType;
    displayFrom: string;
    displayTo: string;
  }) => void;
}) {
  const { showToast } = useToast();
  const [type, setType] = useState<SystemNotifType>("ANNOUNCEMENT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [displayFrom, setDisplayFrom] = useState("");
  const [displayTo, setDisplayTo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const rangeValid =
    displayFrom.length > 0 &&
    displayTo.length > 0 &&
    new Date(displayFrom).getTime() < new Date(displayTo).getTime();

  const isValid = title.trim().length > 0 && content.trim().length > 0 && rangeValid;

  const handleSend = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSent({ title, content, type, displayFrom, displayTo });
      showToast("Đã gửi thông báo đến toàn bộ người dùng", "success");
      setTitle("");
      setContent("");
      setDisplayFrom("");
      setDisplayTo("");
      setType("ANNOUNCEMENT");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Megaphone size={15} className="text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Soạn thông báo hệ thống</p>
          <p className="text-xs text-slate-400">Gửi đến toàn bộ người dùng trên nền tảng</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => setType("ANNOUNCEMENT")}
          className={clsx(
            "px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left",
            type === "ANNOUNCEMENT"
              ? "border-blue-400 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50",
          )}
        >
          Thông báo chung
        </button>
        <button
          onClick={() => setType("MAINTENANCE")}
          className={clsx(
            "px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left",
            type === "MAINTENANCE"
              ? "border-amber-400 bg-amber-50 text-amber-600"
              : "border-slate-200 text-slate-500 hover:bg-slate-50",
          )}
        >
          Bảo trì hệ thống
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề thông báo..."
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 mb-3"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nội dung thông báo..."
        rows={4}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 resize-none mb-3"
      />

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4">
        <div className="flex items-center gap-1.5 text-slate-500 mb-2.5">
          <Calendar size={13} />
          <span className="text-xs font-medium">Thời gian hiển thị thông báo</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Từ</label>
            <input
              type="datetime-local"
              value={displayFrom}
              onChange={(e) => setDisplayFrom(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Đến</label>
            <input
              type="datetime-local"
              value={displayTo}
              onChange={(e) => setDisplayTo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
        {displayFrom && displayTo && !rangeValid && (
          <p className="text-[11px] text-red-500 mt-2">Thời gian kết thúc phải sau thời gian bắt đầu</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={!isValid}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Send size={14} />
          Gửi đến toàn hệ thống
        </button>
      </div>

      {confirmOpen && (
        <ConfirmDialog
          icon={<Megaphone size={20} className="text-blue-500" />}
          iconBgClass="bg-blue-100"
          title="Gửi thông báo đến toàn bộ người dùng?"
          description="Thông báo sẽ hiển thị cho tất cả người dùng trong khoảng thời gian đã chọn."
          confirmLabel="Gửi ngay"
          confirmVariant="primary"
          loading={loading}
          onConfirm={handleSend}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}