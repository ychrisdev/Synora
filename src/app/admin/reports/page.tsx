"use client";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ReportFilters, type ReportFilterState } from "@/components/admin/reports/ReportFilters";
import { ReportsTable } from "@/components/admin/reports/ReportsTable";
import { ReportDetailModal } from "@/components/admin/reports/ReportDetailModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle2, XCircle } from "lucide-react";
import type { AdminReportRow } from "@/lib/reports/types";

const MOCK_REPORTS: AdminReportRow[] = [
  {
    id: "r1",
    reporter: { name: "Hoàng Văn E", username: "hoangv", avatarUrl: null },
    targetType: "POST",
    targetPreview: "Chia sẻ tài liệu ôn thi giữa kỳ môn Giải tích...",
    targetAuthor: { name: "Nguyễn Văn A", username: "nva123", avatarUrl: null },
    reason: "SPAM",
    detail: "Bài viết đăng lặp lại nhiều lần trong ngày, nghi spam.",
    status: "PENDING",
    createdAt: "07/07/2026",
  },
  {
    id: "r2",
    reporter: { name: "Trần Thị B", username: "ttb", avatarUrl: null },
    targetType: "COMMENT",
    targetPreview: "Ngôn từ xúc phạm, đã báo cáo quản trị viên.",
    targetAuthor: { name: "Lê Văn C", username: "lvc2003", avatarUrl: null },
    reason: "HARASSMENT",
    detail: "Bình luận công kích cá nhân người khác.",
    status: "PENDING",
    createdAt: "05/07/2026",
  },
  {
    id: "r3",
    reporter: { name: "Phạm Thị D", username: "ptd_studio", avatarUrl: null },
    targetType: "USER",
    targetPreview: "Tài khoản giả mạo giảng viên khoa CNTT",
    targetAuthor: { name: "??? Giả mạo", username: "fake_lecturer", avatarUrl: null },
    reason: "SCAM",
    detail: "Sử dụng ảnh và tên giảng viên thật để lừa sinh viên chuyển tiền.",
    status: "RESOLVED",
    createdAt: "01/07/2026",
    resolvedAt: "02/07/2026",
    resolutionNote: "Đã khóa vĩnh viễn tài khoản giả mạo.",
  },
  {
    id: "r4",
    reporter: { name: "Nguyễn Văn A", username: "nva123", avatarUrl: null },
    targetType: "MESSAGE",
    targetPreview: "Nội dung tin nhắn quấy rối trong đoạn chat nhóm",
    targetAuthor: { name: "Trần Thị B", username: "ttb", avatarUrl: null },
    reason: "HARASSMENT",
    detail: "Nhắn tin đe dọa trong nhóm chat lớp.",
    status: "DISMISSED",
    createdAt: "28/06/2026",
    resolvedAt: "29/06/2026",
    resolutionNote: "Đã xác minh là hiểu lầm giữa hai bên, không vi phạm.",
  },
];

type ConfirmState = { kind: "resolve" | "dismiss"; report: AdminReportRow; note: string } | null;

export default function AdminReportsPage() {
  const { showToast } = useToast();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [filters, setFilters] = useState<ReportFilterState>({
    query: "",
    targetType: "ALL",
    status: "ALL",
    reason: "ALL",
  });
  const [detailReport, setDetailReport] = useState<AdminReportRow | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return reports.filter(
      (r) =>
        (!q ||
          r.reporter.username.toLowerCase().includes(q) ||
          r.targetPreview.toLowerCase().includes(q)) &&
        (filters.targetType === "ALL" || r.targetType === filters.targetType) &&
        (filters.status === "ALL" || r.status === filters.status) &&
        (filters.reason === "ALL" || r.reason === filters.reason),
    );
  }, [reports, filters]);

  const applyResolution = async (kind: "resolve" | "dismiss", report: AdminReportRow, note: string) => {
    setConfirmLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? {
                ...r,
                status: kind === "resolve" ? "RESOLVED" : "DISMISSED",
                resolvedAt: new Date().toLocaleDateString("vi-VN"),
                resolutionNote: note || undefined,
              }
            : r,
        ),
      );
      showToast(kind === "resolve" ? "Đã đánh dấu báo cáo là đã xử lý" : "Đã bỏ qua báo cáo", "success");
    } finally {
      setConfirmLoading(false);
      setConfirmState(null);
      setDetailReport(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Quản lý báo cáo"
        description="Xử lý báo cáo về người dùng, bài viết, bình luận và tin nhắn"
      />

      <ReportFilters value={filters} onChange={setFilters} />

      <ReportsTable
        reports={filtered}
        onViewDetail={setDetailReport}
        onQuickResolve={(r) => setConfirmState({ kind: "resolve", report: r, note: "" })}
        onQuickDismiss={(r) => setConfirmState({ kind: "dismiss", report: r, note: "" })}
      />

      {detailReport && (
        <ReportDetailModal
          report={detailReport}
          onClose={() => setDetailReport(null)}
          onResolve={(note) => applyResolution("resolve", detailReport, note)}
          onDismiss={(note) => applyResolution("dismiss", detailReport, note)}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          icon={
            confirmState.kind === "resolve" ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <XCircle size={20} className="text-slate-500" />
            )
          }
          iconBgClass={confirmState.kind === "resolve" ? "bg-emerald-100" : "bg-slate-100"}
          title={confirmState.kind === "resolve" ? "Đánh dấu báo cáo đã xử lý?" : "Bỏ qua báo cáo này?"}
          description="Bạn có thể xem lại ghi chú xử lý trong phần chi tiết báo cáo bất kỳ lúc nào."
          confirmLabel={confirmState.kind === "resolve" ? "Đánh dấu đã xử lý" : "Bỏ qua"}
          confirmVariant="primary"
          loading={confirmLoading}
          onConfirm={() => applyResolution(confirmState.kind, confirmState.report, confirmState.note)}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </>
  );
}