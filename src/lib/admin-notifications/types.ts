export type SystemNotifType = "ANNOUNCEMENT" | "MAINTENANCE";

export type SystemNotification = {
  id: string;
  title: string;
  content: string;
  type: SystemNotifType;
  displayFrom: string;
  displayTo: string;
  sentAt: string;
  sentBy: string;
  recipientCount: number;
};

export type UserNotifReason = "VIOLATION" | "DATA_ISSUE" | "OTHER";

export type MiniUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type UserNotification = {
  id: string;
  recipients: MiniUser[];
  title: string;
  content: string;
  reason: UserNotifReason;
  sentAt: string;
  sentBy: string;
};

export const REASON_LABELS: Record<UserNotifReason, string> = {
  VIOLATION: "Vi phạm nội dung",
  DATA_ISSUE: "Vấn đề dữ liệu",
  OTHER: "Khác",
};

export const REASON_BADGE: Record<UserNotifReason, string> = {
  VIOLATION: "bg-red-50 text-red-600",
  DATA_ISSUE: "bg-amber-50 text-amber-600",
  OTHER: "bg-slate-100 text-slate-600",
};

export const SYSTEM_TYPE_LABELS: Record<SystemNotifType, string> = {
  ANNOUNCEMENT: "Thông báo chung",
  MAINTENANCE: "Bảo trì hệ thống",
};

export const SYSTEM_TYPE_BADGE: Record<SystemNotifType, string> = {
  ANNOUNCEMENT: "bg-blue-50 text-blue-600",
  MAINTENANCE: "bg-amber-50 text-amber-600",
};