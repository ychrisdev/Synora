"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { AuditLogFilters, type AuditLogFilterState } from "@/components/admin/audit-log/AuditLogFilters";
import { AuditLogTable } from "@/components/admin/audit-log/AuditLogTable";
import { AuditLogDetailModal } from "@/components/admin/audit-log/AuditLogDetailModal";
import { ACTION_GROUP, type AuditLogEntry } from "@/lib/audit-log/types";

const MOCK_ENTRIES: AuditLogEntry[] = [
  { id: "1", actor: { id: "5", name: "Hoàng Văn E", username: "hoangv", avatarUrl: null, role: "ADMIN" }, action: "USER_BAN", targetLabel: "Phạm Thị D (@ptd_studio)", targetType: "USER", detail: "Khóa vĩnh viễn do vi phạm nhiều lần điều khoản sử dụng.", ipAddress: "118.70.23.11", createdAt: "08/07/2026 09:12" },
  { id: "2", actor: { id: "2", name: "Trần Thị B", username: "ttb", avatarUrl: null, role: "SUPPORT" }, action: "GROUP_LOCK", targetLabel: "Trading & Đầu tư", targetType: "GROUP", detail: "Khóa nhóm do vi phạm quy định quảng cáo tài chính.", ipAddress: "27.72.145.90", createdAt: "07/07/2026 16:40" },
  { id: "3", actor: { id: "5", name: "Hoàng Văn E", username: "hoangv", avatarUrl: null, role: "ADMIN" }, action: "NOTIF_USER_SEND", targetLabel: "Lê Văn C (@lvc2003)", targetType: "USER", detail: "Gửi thông báo vi phạm nội dung.", ipAddress: "118.70.23.11", createdAt: "06/07/2026 14:05" },
  { id: "4", actor: { id: "2", name: "Trần Thị B", username: "ttb", avatarUrl: null, role: "SUPPORT" }, action: "REPORT_RESOLVE", targetLabel: "Báo cáo #204 - bài viết vi phạm", targetType: "REPORT", ipAddress: "27.72.145.90", createdAt: "06/07/2026 10:22" },
  { id: "5", actor: { id: "5", name: "Hoàng Văn E", username: "hoangv", avatarUrl: null, role: "ADMIN" }, action: "NOTIF_SYSTEM_SEND", targetLabel: "Toàn bộ hệ thống (12,480 người dùng)", targetType: "SYSTEM", detail: "Thông báo bảo trì hệ thống 02:00 - 04:00.", ipAddress: "118.70.23.11", createdAt: "05/07/2026 22:00" },
  { id: "6", actor: { id: "2", name: "Trần Thị B", username: "ttb", avatarUrl: null, role: "SUPPORT" }, action: "POST_HIDE", targetLabel: "Bài viết của Lê Văn C", targetType: "POST", detail: "Ẩn do bị báo cáo nhiều lần.", ipAddress: "27.72.145.90", createdAt: "04/07/2026 08:30" },
  { id: "7", actor: { id: "5", name: "Hoàng Văn E", username: "hoangv", avatarUrl: null, role: "ADMIN" }, action: "USER_UNBAN", targetLabel: "Lê Văn C (@lvc2003)", targetType: "USER", ipAddress: "118.70.23.11", createdAt: "02/07/2026 11:15" },
];

export default function AdminAuditLogPage() {
  const [filters, setFilters] = useState<AuditLogFilterState>({
    query: "",
    group: "ALL",
    dateFrom: "",
    dateTo: "",
  });
  const [detailEntry, setDetailEntry] = useState<AuditLogEntry | null>(null);

  const filtered = useMemo(() => {
    return MOCK_ENTRIES.filter((e) => {
      const q = filters.query.toLowerCase();
      const matchesQuery =
        !q ||
        e.actor.name.toLowerCase().includes(q) ||
        e.actor.username.toLowerCase().includes(q) ||
        e.targetLabel.toLowerCase().includes(q);
      const matchesGroup = filters.group === "ALL" || ACTION_GROUP[e.action] === filters.group;
      return matchesQuery && matchesGroup;
    });
  }, [filters]);

  return (
    <>
      <PageHeader
        title="Nhật ký quản trị"
        description="Ghi lại mọi thao tác của quản trị viên trên hệ thống"
      />

      <AuditLogFilters value={filters} onChange={setFilters} />

      <AuditLogTable entries={filtered} onViewDetail={setDetailEntry} />

      {detailEntry && (
        <AuditLogDetailModal entry={detailEntry} onClose={() => setDetailEntry(null)} />
      )}
    </>
  );
}