"use client";
import { useState } from "react";
import { Ban, MoreVertical } from "lucide-react";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { BlockedUsersModal, BlockedItemMenu, type BlockedUser } from "./BlockModal";
import Avatar from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import { clsx } from "clsx";

const MOCK_BLOCKED: BlockedUser[] = [];

type ProfileVisibility = "public" | "friends" | "private";
const PREVIEW_LIMIT = 5;

export function PrivacySection() {
  const { showToast } = useToast();
  const [showActivity, setShowActivity] = useState(true);
  const [blocked, setBlocked] = useState<BlockedUser[]>(MOCK_BLOCKED);
  const [visibility, setVisibility] = useState<ProfileVisibility>("public");
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const sortedBlocked = [...blocked].sort(
    (a, b) => new Date(b.blockedAt).getTime() - new Date(a.blockedAt).getTime(),
  );
  const preview = sortedBlocked.slice(0, PREVIEW_LIMIT);

  const handleUnblock = (id: string) => {
    setBlocked((prev) => prev.filter((u) => u.id !== id));
    showToast("Đã bỏ chặn người dùng", "success");
  };

  const handleReport = (_id: string) => {
    showToast("Chức năng báo cáo đang được phát triển", "error");
  };

  const visibilityOptions: { value: ProfileVisibility; label: string; desc: string }[] = [
    { value: "public", label: "Công khai", desc: "Mọi người đều xem được hồ sơ của bạn" },
    { value: "friends", label: "Chỉ bạn bè", desc: "Chỉ những người bạn kết nối mới xem được" },
    { value: "private", label: "Riêng tư", desc: "Chỉ mình bạn xem được hồ sơ" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-surface-200 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-text-primary">
            Trạng thái hoạt động
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Cho phép bạn bè thấy chấm xanh và thời điểm bạn online gần nhất
          </p>
        </div>
        <ToggleSwitch
          checked={showActivity}
          onChange={() => setShowActivity((v) => !v)}
        />
      </div>

      <SettingsCard
        title="Danh sách chặn"
        description="Những người bạn đã chặn sẽ không thể nhắn tin hoặc xem hồ sơ của bạn"
      >
        {blocked.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2 text-text-muted">
            <div className="w-11 h-11 rounded-full bg-surface-100 flex items-center justify-center">
              <Ban size={18} className="opacity-50" />
            </div>
            <p className="text-xs">Bạn chưa chặn ai</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {preview.map((u) => {
                const menuOpen = menuOpenId === u.id;
                return (
                  <div key={u.id} className="flex items-center gap-3 py-2 relative">
                    <Avatar
                      src={u.avatarUrl ?? undefined}
                      initials={u.name.slice(0, 2).toUpperCase()}
                      size="sm"
                      shape="circle"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{u.name}</p>
                      <p className="text-xs text-text-muted truncate">@{u.username}</p>
                    </div>
                    <div className="relative shrink-0">
                      <button
                        onClick={() => setMenuOpenId(menuOpen ? null : u.id)}
                        className="p-1.5 rounded-full hover:bg-surface-100 text-text-muted transition-colors"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {menuOpen && (
                        <BlockedItemMenu
                          user={u}
                          onClose={() => setMenuOpenId(null)}
                          onUnblock={() => {
                            setMenuOpenId(null);
                            handleUnblock(u.id);
                          }}
                          onReport={() => {
                            setMenuOpenId(null);
                            handleReport(u.id);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="self-start text-xs font-semibold text-primary hover:underline"
            >
              Xem tất cả ({blocked.length})
            </button>
          </>
        )}
      </SettingsCard>

      <SettingsCard title="Quyền xem hồ sơ" description="Chọn ai có thể xem thông tin hồ sơ của bạn">
        <div className="flex flex-col gap-2">
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVisibility(opt.value)}
              className={clsx(
                "flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors",
                visibility === opt.value ? "border-primary bg-primary/5" : "border-surface-200 hover:bg-surface-50",
              )}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{opt.desc}</p>
              </div>
              <div
                className={clsx(
                  "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                  visibility === opt.value ? "border-primary" : "border-surface-300",
                )}
              >
                {visibility === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>
      </SettingsCard>

      {modalOpen && (
        <BlockedUsersModal
          users={blocked}
          onClose={() => setModalOpen(false)}
          onUnblock={handleUnblock}
          onReport={handleReport}
        />
      )}
    </div>
  );
}