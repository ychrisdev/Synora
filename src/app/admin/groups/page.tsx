"use client";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { GroupFilters, type GroupFilterState } from "@/components/admin/groups/GroupFilters";
import { GroupsTable, type AdminGroupRow } from "@/components/admin/groups/GroupsTable";
import { GroupDetailModal } from "@/components/admin/groups/GroupDetailModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Lock, Unlock, Trash2 } from "lucide-react";

const MOCK_GROUPS: AdminGroupRow[] = [
  { id: "1", name: "CLB Lập trình FIT", slug: "clb-lap-trinh-fit", avatarUrl: null, description: "Cộng đồng chia sẻ kiến thức lập trình, dự án và cơ hội thực tập.", ownerName: "Nguyễn Văn A", ownerUsername: "nva123", privacy: "PUBLIC", status: "ACTIVE", memberCount: 320, postCount: 154, createdAt: "12/01/2025" },
  { id: "2", name: "Đồ án tốt nghiệp K19", slug: "do-an-tot-nghiep-k19", avatarUrl: null, description: "Nhóm trao đổi tiến độ và tài liệu đồ án tốt nghiệp khóa 19.", ownerName: "Trần Thị B", ownerUsername: "ttb", privacy: "PRIVATE", status: "ACTIVE", memberCount: 48, postCount: 62, createdAt: "03/03/2025" },
  { id: "3", name: "Học tiếng Anh mỗi ngày", slug: "hoc-tieng-anh-moi-ngay", avatarUrl: null, description: "Chia sẻ tài liệu, luyện nói và phản hồi bài viết tiếng Anh.", ownerName: "Lê Văn C", ownerUsername: "lvc2003", privacy: "PUBLIC", status: "LOCKED", memberCount: 890, postCount: 410, createdAt: "20/08/2024" },
  { id: "4", name: "Trading & Đầu tư", slug: "trading-dau-tu", avatarUrl: null, description: "Nhóm bị khóa do vi phạm quy định quảng cáo tài chính.", ownerName: "Phạm Thị D", ownerUsername: "ptd_studio", privacy: "PUBLIC", status: "LOCKED", memberCount: 1200, postCount: 890, createdAt: "01/02/2024" },
];

type ConfirmState =
  | { type: "lock"; group: AdminGroupRow }
  | { type: "unlock"; group: AdminGroupRow }
  | { type: "delete"; group: AdminGroupRow }
  | null;

export default function AdminGroupsPage() {
  const { showToast } = useToast();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [filters, setFilters] = useState<GroupFilterState>({
    query: "",
    privacy: "ALL",
    status: "ALL",
  });
  const [detailGroup, setDetailGroup] = useState<AdminGroupRow | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const q = filters.query.toLowerCase();
      const matchesQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.ownerName.toLowerCase().includes(q) ||
        g.ownerUsername.toLowerCase().includes(q);
      const matchesPrivacy = filters.privacy === "ALL" || g.privacy === filters.privacy;
      const matchesStatus = filters.status === "ALL" || g.status === filters.status;
      return matchesQuery && matchesPrivacy && matchesStatus;
    });
  }, [groups, filters]);

  const handleConfirm = async () => {
    if (!confirmState) return;
    setConfirmLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (confirmState.type === "delete") {
        setGroups((prev) => prev.filter((x) => x.id !== confirmState.group.id));
        showToast("Đã xóa nhóm", "success");
      } else {
        const nextStatus = confirmState.type === "lock" ? "LOCKED" : "ACTIVE";
        setGroups((prev) =>
          prev.map((x) => (x.id === confirmState.group.id ? { ...x, status: nextStatus } : x)),
        );
        showToast(confirmState.type === "lock" ? "Đã khóa nhóm" : "Đã mở khóa nhóm", "success");
      }
    } finally {
      setConfirmLoading(false);
      setConfirmState(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Quản lý nhóm"
        description="Xem, khóa hoặc xóa nhóm khi cần thiết"
      />

      <GroupFilters value={filters} onChange={setFilters} />

      <GroupsTable
        groups={filtered}
        onViewDetail={setDetailGroup}
        onLock={(g) => setConfirmState({ type: "lock", group: g })}
        onUnlock={(g) => setConfirmState({ type: "unlock", group: g })}
        onDelete={(g) => setConfirmState({ type: "delete", group: g })}
      />

      {detailGroup && (
        <GroupDetailModal group={detailGroup} onClose={() => setDetailGroup(null)} />
      )}

      {confirmState && (
        <ConfirmDialog
          icon={
            confirmState.type === "unlock" ? (
              <Unlock size={20} className="text-emerald-500" />
            ) : confirmState.type === "lock" ? (
              <Lock size={20} className="text-amber-500" />
            ) : (
              <Trash2 size={20} className="text-red-500" />
            )
          }
          iconBgClass={
            confirmState.type === "unlock"
              ? "bg-emerald-100"
              : confirmState.type === "lock"
                ? "bg-amber-100"
                : "bg-red-100"
          }
          title={
            confirmState.type === "unlock"
              ? "Mở khóa nhóm?"
              : confirmState.type === "lock"
                ? "Khóa nhóm?"
                : "Xóa nhóm vĩnh viễn?"
          }
          description={
            <>
              Áp dụng cho{" "}
              <span className="font-medium text-slate-700">{confirmState.group.name}</span>
              {confirmState.type === "delete" && " và toàn bộ bài viết, thành viên bên trong"}.
            </>
          }
          confirmLabel={
            confirmState.type === "unlock"
              ? "Mở khóa"
              : confirmState.type === "lock"
                ? "Khóa nhóm"
                : "Xóa nhóm"
          }
          confirmVariant={confirmState.type === "unlock" ? "primary" : "danger"}
          loading={confirmLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </>
  );
}