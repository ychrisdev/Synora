type AdminActivity = {
  id: string;
  time: string;
  admin: string;
  action: string;
};

const MOCK_ACTIVITY: AdminActivity[] = [
  { id: "1", time: "08:10", admin: "Admin A", action: "Xóa bài viết #1234" },
  { id: "2", time: "09:20", admin: "Admin B", action: "Khóa tài khoản @abc" },
  { id: "3", time: "10:05", admin: "Admin A", action: "Duyệt tài liệu #556" },
  { id: "4", time: "11:42", admin: "Admin C", action: "Giải tán nhóm 'Test Group'" },
  { id: "5", time: "13:15", admin: "Admin B", action: "Từ chối báo cáo #89" },
];

export function RecentActivity() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">
        Hoạt động gần đây của admin
      </h3>
      <div className="flex flex-col">
        {MOCK_ACTIVITY.map((a, i) => (
          <div
            key={a.id}
            className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-b-0"
          >
            <span className="text-[11px] font-mono text-slate-400 w-10 shrink-0">
              {a.time}
            </span>
            <span className="text-xs font-semibold text-blue-600 shrink-0">
              {a.admin}
            </span>
            <span className="text-xs text-slate-600 truncate">{a.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}