"use client";
import { clsx } from "clsx";
import { User, Shield, Bell, Palette } from "lucide-react";

export type SettingsTab = "account" | "privacy" | "notifications" | "appearance";

const TABS: {
  id: SettingsTab;
  label: string;
  icon: typeof User;
  subItems: string[];
}[] = [
  {
    id: "account",
    label: "Tài khoản",
    icon: User,
    subItems: ["Email", "Đổi mật khẩu", "Xóa tài khoản"],
  },
  {
    id: "privacy",
    label: "Quyền riêng tư",
    icon: Shield,
    subItems: ["Trạng thái hoạt động", "Danh sách chặn", "Quyền xem hồ sơ"],
  },
  {
    id: "notifications",
    label: "Thông báo",
    icon: Bell,
    subItems: ["Cộng đồng", "Nhóm", "Tài liệu"],
  },
  {
    id: "appearance",
    label: "Giao diện",
    icon: Palette,
    subItems: ["Theme", "Ngôn ngữ"],
  },
];

export function SettingsSidebar({
  active,
  onSelect,
}: {
  active: SettingsTab;
  onSelect: (tab: SettingsTab) => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={clsx(
              "flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-colors",
              isActive ? "bg-primary/10" : "hover:bg-surface-100",
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface-100 text-text-muted",
              )}
            >
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <p
                className={clsx(
                  "text-sm font-semibold",
                  isActive ? "text-primary" : "text-text-primary",
                )}
              >
                {tab.label}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 truncate">
                {tab.subItems.join(" · ")}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}