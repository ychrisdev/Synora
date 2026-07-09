"use client";
import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { NotificationTabs, type NotifTab } from "@/components/admin/notifications/NotificationTabs";
import { SystemNotificationForm } from "@/components/admin/notifications/SystemNotificationForm";
import { SystemNotificationHistory } from "@/components/admin/notifications/SystemNotificationHistory";
import { UserNotificationForm } from "@/components/admin/notifications/UserNotificationForm";
import { UserNotificationHistory } from "@/components/admin/notifications/UserNotificationHistory";
import type { SystemNotification, UserNotification } from "@/lib/admin-notifications/types";

const MOCK_SYSTEM: SystemNotification[] = [
  { id: "s1", title: "Bảo trì hệ thống 02:00 - 04:00", content: "Synora sẽ bảo trì để nâng cấp hạ tầng, mong người dùng thông cảm.", type: "MAINTENANCE", displayFrom: "05/07/2026 02:00", displayTo: "05/07/2026 04:00", sentAt: "05/07/2026", sentBy: "Admin", recipientCount: 12480 },
  { id: "s2", title: "Ra mắt tính năng Thư viện tài liệu", content: "Từ nay bạn có thể chia sẻ và lưu tài liệu học tập trực tiếp trên Synora.", type: "ANNOUNCEMENT", displayFrom: "28/06/2026 09:00", displayTo: "05/07/2026 09:00", sentAt: "28/06/2026", sentBy: "Admin", recipientCount: 12210 },
];

const MOCK_USER_NOTIFS: UserNotification[] = [
  { id: "u1", recipients: [{ id: "3", name: "Lê Văn C", username: "lvc2003", avatarUrl: null }], title: "Bài viết vi phạm tiêu chuẩn cộng đồng", content: "Bài viết của bạn đã bị ẩn do chứa nội dung vi phạm quy định về ngôn từ.", reason: "VIOLATION", sentAt: "06/07/2026", sentBy: "Admin" },
  { id: "u2", recipients: [{ id: "4", name: "Phạm Thị D", username: "ptd_studio", avatarUrl: null }, { id: "1", name: "Nguyễn Văn A", username: "nva123", avatarUrl: null }], title: "Xác minh lại thông tin tài khoản", content: "Vui lòng cập nhật email xác thực để tránh bị hạn chế tính năng.", reason: "DATA_ISSUE", sentAt: "01/07/2026", sentBy: "Support" },
];

export default function AdminNotificationsPage() {
  const [tab, setTab] = useState<NotifTab>("SYSTEM");
  const [systemNotifs, setSystemNotifs] = useState(MOCK_SYSTEM);
  const [userNotifs, setUserNotifs] = useState(MOCK_USER_NOTIFS);

  return (
    <>
      <PageHeader
        title="Thông báo"
        description="Gửi thông báo hệ thống hoặc thông báo riêng đến người dùng"
      />

      <NotificationTabs active={tab} onChange={setTab} />

      {tab === "SYSTEM" ? (
        <>
          <SystemNotificationForm
            onSent={(data) =>
              setSystemNotifs((prev) => [
                {
                  id: `s${prev.length + 1}`,
                  ...data,
                  sentAt: new Date().toLocaleDateString("vi-VN"),
                  sentBy: "Admin",
                  recipientCount: 12480,
                },
                ...prev,
              ])
            }
          />
          <SystemNotificationHistory items={systemNotifs} />
        </>
      ) : (
        <>
          <UserNotificationForm
            onSent={(data) =>
              setUserNotifs((prev) => [
                {
                  id: `u${prev.length + 1}`,
                  ...data,
                  sentAt: new Date().toLocaleDateString("vi-VN"),
                  sentBy: "Admin",
                },
                ...prev,
              ])
            }
          />
          <UserNotificationHistory items={userNotifs} />
        </>
      )}
    </>
  );
}