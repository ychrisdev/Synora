"use client";

import { useState } from "react";
import { Camera, Share2, MessageCircle, UserPlus, UserCheck, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";

export function ProfileHeader() {
  const [following, setFollowing] = useState(false);

  return (
    <div className="relative mb-16">
      <div className="h-40 rounded-2xl bg-slate-200 overflow-hidden relative">
        <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#e2e5ec,#e2e5ec_10px,#eaecf2_10px,#eaecf2_20px)]" />
        <button className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors">
          <Camera size={11} />
          Đổi ảnh bìa
        </button>
      </div>

      <div className="absolute -bottom-12 left-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-md">
            QA
          </div>
          <button className="absolute bottom-1 right-1 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center hover:bg-surface-100 transition-colors shadow-sm">
            <Camera size={11} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="absolute -bottom-10 right-0 flex items-center gap-2">
        <button className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors">
          <Share2 size={13} />
          Chia sẻ
        </button>
        <button className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors">
          <MessageCircle size={13} />
          Nhắn tin
        </button>
        <button
          onClick={() => setFollowing(!following)}
          className={clsx(
            "flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors",
            following
              ? "bg-surface-100 text-text-secondary border border-surface-200 hover:bg-surface-200"
              : "bg-primary text-white hover:bg-primary-700"
          )}
        >
          {following ? (
            <>
              <UserCheck size={13} />
              Đang yêu cầu
            </>
          ) : (
            <>
              <UserPlus size={13} />
              Kết bạn
            </>
          )}
        </button>
        <button className="p-1.5 border border-surface-200 bg-white rounded-lg hover:bg-surface-50 transition-colors">
          <MoreHorizontal size={14} className="text-text-secondary" />
        </button>
      </div>
    </div>
  );
}