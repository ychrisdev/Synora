"use client";
import { useRef, useState } from "react";
import { BanIcon } from "lucide-react";
import { useOutsideClick } from "@/lib/chat/hooks";
import { PillBadge } from "@/components/chat/Badge";
import Avatar from "@/components/ui/Avatar";
import { blockedUsers } from "@/lib/chat/data";

export function BlockedList() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-primary/10 flex items-center justify-center text-text-muted hover:text-primary transition-colors relative"
        title="Danh sách chặn"
      >
        <BanIcon size={16} />
        <PillBadge
          count={blockedUsers.length}
          variant="blocked"
          className="absolute -top-1.5 -right-1.5"
        />
      </button>

      {open && (
        <div className="absolute left-full bottom-0 ml-2 w-72 bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden z-50">
          <div className="px-4 py-3.5 border-b border-surface-100 flex items-center justify-between">
            <p className="text-sm font-bold text-text-primary">Danh sách chặn</p>
          </div>
          <div className="py-2 max-h-80 overflow-y-auto">
            {blockedUsers.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2 text-text-muted">
                <BanIcon size={28} className="opacity-40" />
                <p className="text-xs">Chưa chặn ai</p>
              </div>
            ) : (
              blockedUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors group"
                >
                  <Avatar
                    initials={u.initials}
                    color={u.color}
                    size="md"
                    shape="circle"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-text-muted">{u.blockedAt}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-surface-100 text-text-secondary text-[10px] font-semibold rounded-full hover:bg-surface-200 transition-all">
                    Bỏ chặn
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}