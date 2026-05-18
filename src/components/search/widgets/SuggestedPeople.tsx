
const SUGGESTED = [
  { name: "Lê Ngọc Hân", role: "Gia sư Toán", avatar: "LH", color: "bg-rose-500", followers: "1.2k" },
  { name: "Phạm Đức Anh", role: "Sinh viên ĐHBK", avatar: "PA", color: "bg-blue-500", followers: "670" },
  { name: "Trần Minh", role: "Giảng viên Lý", avatar: "TM", color: "bg-teal-500", followers: "2.8k" },
];

export function SuggestedPeople() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          Gợi ý theo dõi
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {SUGGESTED.map((p, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${p.color}`}
            >
              {p.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{p.name}</p>
              <p className="text-[10px] text-text-muted">{p.role} · {p.followers} followers</p>
            </div>
            <button className="text-[10px] font-semibold text-primary border border-primary/30 px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-all shrink-0">
              Theo dõi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}