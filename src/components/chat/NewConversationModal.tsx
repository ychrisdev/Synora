"use client";

import { useState } from "react";
import { X, Search, User, Hash, Check } from "lucide-react";
import { clsx } from "clsx";
import { allContacts } from "@/lib/chat/data";
import type { NewConvTab } from "@/lib/chat/types";

interface NewConversationModalProps {
  onClose: () => void;
}

export function NewConversationModal({ onClose }: NewConversationModalProps) {
  const [tab, setTab]           = useState<NewConvTab>("direct");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const filtered = allContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const canCreate =
    tab === "direct"
      ? selected.length === 1
      : selected.length >= 2 && groupName.trim().length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] bg-white rounded-2xl shadow-2xl z-[80] flex flex-col overflow-hidden max-h-[80vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <p className="text-sm font-bold text-text-primary">Tạo trò chuyện</p>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted">
            <X size={15} />
          </button>
        </div>

        <div className="flex border-b border-surface-100 px-5">
          {([
            { key: "direct", icon: <User size={12} />, label: "Trực tiếp" },
            { key: "group",  icon: <Hash size={12} />, label: "Nhóm"      },
          ] as { key: NewConvTab; icon: React.ReactNode; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelected([]); }}
              className={clsx(
                "flex items-center gap-1.5 py-3 mr-7 text-xs font-semibold border-b-2 transition-colors",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary",
              )}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "group" && (
            <div className="px-5 pt-4 pb-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                Tên nhóm
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm..."
                className="w-full px-3 py-2.5 bg-surface-100 rounded-xl text-sm placeholder:text-text-muted focus:outline-none border border-transparent focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          )}

          {selected.length > 0 && (
            <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-surface-100">
              {selected.map((name) => {
                const c = allContacts.find((x) => x.name === name)!;
                return (
                  <button
                    key={name}
                    onClick={() => toggle(name)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-100 text-text-primary border border-surface-200"
                  >
                    <span className={clsx("w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0", c.color)}>
                      {c.initials[0]}
                    </span>
                    {c.name.split(" ").slice(-1)[0]}
                    <X size={10} className="text-text-muted" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="px-5 pt-3 pb-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
              {tab === "direct" ? "Chọn người dùng" : "Thêm thành viên"}
            </label>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bạn bè..."
                className="w-full pl-8 pr-3 py-2 bg-surface-100 rounded-xl text-xs placeholder:text-text-muted focus:outline-none border border-transparent focus:border-primary focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="px-3 pb-3">
            {filtered.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">Không tìm thấy kết quả</p>
            ) : (
              filtered.map((c) => {
                const isSelected  = selected.includes(c.name);
                const isDisabled  = tab === "direct" && selected.length === 1 && !isSelected;
                return (
                  <button
                    key={c.name}
                    onClick={() => !isDisabled && toggle(c.name)}
                    disabled={isDisabled}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                      isSelected  ? "bg-primary/8"
                      : isDisabled ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-surface-50",
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold", c.color)}>
                        {c.initials}
                      </div>
                      {c.active && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{c.name}</p>
                      <p className="text-xs text-text-muted">{c.active ? "Đang hoạt động" : "Không hoạt động"}</p>
                    </div>
                    <div className={clsx(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-primary border-primary" : "border-surface-300",
                    )}>
                      {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-surface-100 flex items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            {selected.length === 0
              ? tab === "direct" ? "Chọn 1 người để nhắn tin" : "Chọn ít nhất 2 người"
              : `Đã chọn ${selected.length} người`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-surface-200 text-xs font-semibold text-text-secondary hover:bg-surface-50 transition-colors"
            >
              Huỷ
            </button>
            <button
              disabled={!canCreate}
              onClick={onClose}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors",
                canCreate ? "bg-primary hover:bg-primary-700" : "bg-surface-300 cursor-not-allowed",
              )}
            >
              {tab === "direct" ? "Nhắn tin" : "Tạo nhóm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}