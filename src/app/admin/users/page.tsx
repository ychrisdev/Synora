"use client";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserFilters, type UserFilterState } from "@/components/admin/users/UserFilters";
import { UsersTable, type AdminUserRow } from "@/components/admin/users/UsersTable";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, Ban, Clock } from "lucide-react";

const MOCK_USERS: AdminUserRow[] = [
  { id: "1", name: "Nguyễn Văn A", username: "nva123", email: "a@example.com", avatarUrl: null, role: "USER", status: "ACTIVE", joinedAt: "12/03/2025", postCount: 45 },
  { id: "2", name: "Trần Thị B", username: "ttb", email: "b@example.com", avatarUrl: null, role: "SUPPORT", status: "ACTIVE", joinedAt: "05/01/2025", postCount: 120 },
  { id: "3", name: "Lê Văn C", username: "lvc2003", email: "c@example.com", avatarUrl: null, role: "USER", status: "SUSPENDED", joinedAt: "20/06/2025", postCount: 12 },
  { id: "4", name: "Phạm Thị D", username: "ptd_studio", email: "d@example.com", avatarUrl: null, role: "USER", status: "BANNED", joinedAt: "01/02/2024", postCount: 3 },
  { id: "5", name: "Hoàng Văn E", username: "hoangv", email: "e@example.com", avatarUrl: null, role: "ADMIN", status: "ACTIVE", joinedAt: "10/10/2023", postCount: 8 },
];

type ConfirmState =
  | { type: "suspend"; user: AdminUserRow }
  | { type: "ban"; user: AdminUserRow }
  | { type: "unban"; user: AdminUserRow }
  | null;

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [filters, setFilters] = useState<UserFilterState>({
    query: "",
    role: "ALL",
    status: "ALL",
  });
  const [detailUser, setDetailUser] = useState<AdminUserRow | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = filters.query.toLowerCase();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole = filters.role === "ALL" || u.role === filters.role;
      const matchesStatus = filters.status === "ALL" || u.status === filters.status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  const handleGrantRole = (u: AdminUserRow) => {
    showToast(`Chức năng cấp quyền cho ${u.name} đang được phát triển`, "error");
  };

  const handleResetAvatar = (u: AdminUserRow) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, avatarUrl: null } : x)));
    showToast(`Đã reset ảnh đại diện của ${u.name}`, "success");
  };

  const handleForcePasswordChange = (u: AdminUserRow) => {
    showToast(`${u.name} sẽ phải đổi mật khẩu trong lần đăng nhập tới`, "success");
  };

  const handleConfirm = async () => {
    if (!confirmState) return;
    setConfirmLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const nextStatus =
        confirmState.type === "suspend"
          ? "SUSPENDED"
          : confirmState.type === "ban"
            ? "BANNED"
            : "ACTIVE";
      setUsers((prev) =>
        prev.map((x) => (x.id === confirmState.user.id ? { ...x, status: nextStatus } : x)),
      );
      const message =
        confirmState.type === "suspend"
          ? "Đã tạm khóa tài khoản"
          : confirmState.type === "ban"
            ? "Đã khóa vĩnh viễn tài khoản"
            : "Đã mở khóa tài khoản";
      showToast(message, "success");
    } finally {
      setConfirmLoading(false);
      setConfirmState(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Quản lý người dùng"
        description="Tìm kiếm, lọc và quản lý toàn bộ tài khoản trên hệ thống"
      />

      <UserFilters value={filters} onChange={setFilters} />

      <UsersTable
        users={filtered}
        onViewDetail={setDetailUser}
        onGrantRole={handleGrantRole}
        onResetAvatar={handleResetAvatar}
        onForcePasswordChange={handleForcePasswordChange}
        onSuspend={(u) => setConfirmState({ type: "suspend", user: u })}
        onBan={(u) => setConfirmState({ type: "ban", user: u })}
        onUnban={(u) => setConfirmState({ type: "unban", user: u })}
      />

      {detailUser && (
        <UserDetailModal user={detailUser} onClose={() => setDetailUser(null)} />
      )}

      {confirmState && (
        <ConfirmDialog
          icon={
            confirmState.type === "unban" ? (
              <ShieldCheck size={20} className="text-emerald-500" />
            ) : confirmState.type === "suspend" ? (
              <Clock size={20} className="text-amber-500" />
            ) : (
              <Ban size={20} className="text-red-500" />
            )
          }
          iconBgClass={
            confirmState.type === "unban"
              ? "bg-emerald-100"
              : confirmState.type === "suspend"
                ? "bg-amber-100"
                : "bg-red-100"
          }
          title={
            confirmState.type === "unban"
              ? "Mở khóa tài khoản?"
              : confirmState.type === "suspend"
                ? "Tạm khóa tài khoản?"
                : "Khóa vĩnh viễn tài khoản?"
          }
          description={
            <>
              Áp dụng cho{" "}
              <span className="font-medium text-slate-700">
                {confirmState.user.name}
              </span>
              .
            </>
          }
          confirmLabel={
            confirmState.type === "unban"
              ? "Mở khóa"
              : confirmState.type === "suspend"
                ? "Tạm khóa"
                : "Khóa vĩnh viễn"
          }
          confirmVariant={confirmState.type === "unban" ? "primary" : "danger"}
          loading={confirmLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </>
  );
}