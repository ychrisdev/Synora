export type AuditActionType =
  | "USER_SUSPEND"
  | "USER_BAN"
  | "USER_UNBAN"
  | "USER_GRANT_ROLE"
  | "USER_RESET_AVATAR"
  | "GROUP_LOCK"
  | "GROUP_UNLOCK"
  | "GROUP_DELETE"
  | "POST_HIDE"
  | "POST_DELETE"
  | "COMMENT_HIDE"
  | "REPORT_RESOLVE"
  | "REPORT_DISMISS"
  | "NOTIF_SYSTEM_SEND"
  | "NOTIF_USER_SEND";

export type AdminActor = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: "ADMIN" | "SUPPORT";
};

export type AuditLogEntry = {
  id: string;
  actor: AdminActor;
  action: AuditActionType;
  targetLabel: string;
  targetType: "USER" | "GROUP" | "POST" | "COMMENT" | "REPORT" | "SYSTEM";
  detail?: string;
  ipAddress: string;
  createdAt: string;
};

export const ACTION_LABELS: Record<AuditActionType, string> = {
  USER_SUSPEND: "Tạm khóa người dùng",
  USER_BAN: "Khóa vĩnh viễn người dùng",
  USER_UNBAN: "Mở khóa người dùng",
  USER_GRANT_ROLE: "Cấp quyền người dùng",
  USER_RESET_AVATAR: "Reset ảnh đại diện",
  GROUP_LOCK: "Khóa nhóm",
  GROUP_UNLOCK: "Mở khóa nhóm",
  GROUP_DELETE: "Xóa nhóm",
  POST_HIDE: "Ẩn bài viết",
  POST_DELETE: "Xóa bài viết",
  COMMENT_HIDE: "Ẩn bình luận",
  REPORT_RESOLVE: "Xử lý báo cáo",
  REPORT_DISMISS: "Bỏ qua báo cáo",
  NOTIF_SYSTEM_SEND: "Gửi thông báo hệ thống",
  NOTIF_USER_SEND: "Gửi thông báo người dùng",
};

export const ACTION_GROUP: Record<AuditActionType, "USER" | "GROUP" | "CONTENT" | "REPORT" | "NOTIF"> = {
  USER_SUSPEND: "USER",
  USER_BAN: "USER",
  USER_UNBAN: "USER",
  USER_GRANT_ROLE: "USER",
  USER_RESET_AVATAR: "USER",
  GROUP_LOCK: "GROUP",
  GROUP_UNLOCK: "GROUP",
  GROUP_DELETE: "GROUP",
  POST_HIDE: "CONTENT",
  POST_DELETE: "CONTENT",
  COMMENT_HIDE: "CONTENT",
  REPORT_RESOLVE: "REPORT",
  REPORT_DISMISS: "REPORT",
  NOTIF_SYSTEM_SEND: "NOTIF",
  NOTIF_USER_SEND: "NOTIF",
};

export const GROUP_LABELS: Record<string, string> = {
  ALL: "Tất cả nhóm hành động",
  USER: "Người dùng",
  GROUP: "Nhóm",
  CONTENT: "Nội dung",
  REPORT: "Báo cáo",
  NOTIF: "Thông báo",
};

export const GROUP_BADGE: Record<string, string> = {
  USER: "bg-blue-50 text-blue-600",
  GROUP: "bg-purple-50 text-purple-600",
  CONTENT: "bg-orange-50 text-orange-600",
  REPORT: "bg-red-50 text-red-600",
  NOTIF: "bg-cyan-50 text-cyan-600",
};