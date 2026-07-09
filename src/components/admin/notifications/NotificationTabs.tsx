"use client";
import { clsx } from "clsx";

export type NotifTab = "SYSTEM" | "USER";

export function NotificationTabs({
  active,
  onChange,
}: {
  active: NotifTab;
  onChange: (tab: NotifTab) => void;
}) {
  const tabs: { value: NotifTab; label: string }[] = [
    { value: "SYSTEM", label: "Thông báo hệ thống" },
    { value: "USER", label: "Thông báo người dùng" },
  ];

  return (
    <div className="inline-flex items-center bg-slate-100 rounded-full p-1 mb-5">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === t.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}