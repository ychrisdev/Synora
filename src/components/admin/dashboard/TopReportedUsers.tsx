import Avatar from "@/components/ui/Avatar";

type ReportedUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  reportCount: number;
};

const MOCK_REPORTED: ReportedUser[] = [
  { id: "1", name: "Nguyễn Văn X", username: "nvx123", avatarUrl: null, reportCount: 12 },
  { id: "2", name: "Trần Thị Y", username: "tty_official", avatarUrl: null, reportCount: 8 },
  { id: "3", name: "Lê Văn Z", username: "lvz2003", avatarUrl: null, reportCount: 6 },
  { id: "4", name: "Phạm Thị W", username: "ptw_studio", avatarUrl: null, reportCount: 5 },
  { id: "5", name: "Hoàng Văn V", username: "hoangv", avatarUrl: null, reportCount: 4 },
];

export function TopReportedUsers() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">
        Top người dùng bị báo cáo nhiều nhất
      </h3>
      <div className="flex flex-col gap-3">
        {MOCK_REPORTED.map((u) => (
          <div key={u.id} className="flex items-center gap-3">
            <Avatar
              src={u.avatarUrl ?? undefined}
              initials={u.name.slice(0, 2).toUpperCase()}
              size="sm"
              shape="circle"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{u.name}</p>
              <p className="text-[11px] text-slate-400 truncate">@{u.username}</p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
              {u.reportCount} báo cáo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}