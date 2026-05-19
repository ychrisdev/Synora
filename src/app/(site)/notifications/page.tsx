"use client";

import { useState, useEffect } from "react";
import { Bell} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { NotifRow } from "@/components/notifications/NotifRow";
import { SettingItem } from "@/components/notifications/SettingItem";
import { initialNotifications } from "@/lib/notifications/data";
import { NotifItem, NotifSettings } from "@/lib/notifications/types";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
  { id: "interactions", label: "Tương tác" },
  { id: "groups", label: "Nhóm" },
  { id: "documents", label: "Tài liệu" },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [settings, setSettings] = useState<NotifSettings>({
    interactions: true, mentions: true, uploads: true, groups: true, emailDigest: false, system: true
  });

  const toggleSetting = (key: keyof NotifSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
    setNotifs(initialNotifications.filter(n => new Date(n.createdAt).getTime() >= thirtyDaysAgo));
  }, []);

  const filteredNotifs = notifs.filter(n => {
    if (activeTab === "unread") return n.unread;
    if (activeTab === "interactions") return ["like", "comment", "share"].includes(n.type);
    if (activeTab === "groups") return ["invite", "group"].includes(n.type);
    if (activeTab === "documents") return ["milestone", "award"].includes(n.type);
    return true;
  });

  const totalUnread = notifs.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Trung tâm thông báo</h1>
                <p className="text-xs text-slate-400 mt-0.5">Hiển thị thông báo 30 ngày gần nhất</p>
              </div>
              <button className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-2 rounded-xl">
                Đọc tất cả ({totalUnread})
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id ? "bg-blue-500 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-2 space-y-1">
              {filteredNotifs.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Không có thông báo phù hợp</p>
                </div>
              ) : (
                filteredNotifs.map(notif => <NotifRow key={notif.id} notif={notif} />)
              )}
            </div>
          </div>

          <aside className="hidden lg:block space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h2 className="text-sm font-bold mb-4">Cấu hình nhận tin</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài liệu</h3>
                  <SettingItem title="Tương tác tài liệu" desc="Khi có người tải về hoặc lưu tài liệu" checked={settings.uploads} onChange={() => toggleSetting('uploads')} />
                  <SettingItem title="Bản tin học tập" desc="Gợi ý tài liệu hay hàng tuần qua Email" checked={settings.emailDigest} onChange={() => toggleSetting('emailDigest')} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cộng đồng</h3>
                  <SettingItem title="Phản hồi & Nhắc tên" desc="Bình luận và nhắc tên @bạn" checked={settings.interactions} onChange={() => toggleSetting('interactions')} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}