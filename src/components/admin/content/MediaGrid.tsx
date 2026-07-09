"use client";
import { EyeOff, Eye, Trash2, PlayCircle, Flag } from "lucide-react";
import type { AdminMediaRow } from "@/lib/content/types";
import { clsx } from "clsx";

export function MediaGrid({
  items,
  onToggleVisibility,
  onDelete,
}: {
  items: AdminMediaRow[];
  onToggleVisibility: (m: AdminMediaRow) => void;
  onDelete: (m: AdminMediaRow) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-400">
        Không tìm thấy media nào phù hợp
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((m) => (
        <div
          key={m.id}
          className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
        >
          <img src={m.url} alt="" className="w-full h-full object-cover" />
          {m.type === "VIDEO" && (
            <PlayCircle size={28} className="absolute inset-0 m-auto text-white drop-shadow" />
          )}
          {m.status === "HIDDEN" && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <span className="text-[11px] font-medium bg-white/90 text-slate-700 px-2 py-0.5 rounded-full">
                Đã ẩn
              </span>
            </div>
          )}
          {m.reportCount > 0 && (
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              <Flag size={10} /> {m.reportCount}
            </span>
          )}

          <div
            className={clsx(
              "absolute inset-x-0 bottom-0 flex items-center justify-between px-2 py-1.5",
              "bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
            )}
          >
            <span className="text-[10px] text-white truncate">@{m.author.username}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleVisibility(m)}
                className="p-1 rounded-md hover:bg-white/20 text-white"
              >
                {m.status === "VISIBLE" ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button
                onClick={() => onDelete(m)}
                className="p-1 rounded-md hover:bg-white/20 text-white"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}