"use client";

import { UserPlus, Check, X, Plus } from "lucide-react";
import { clsx } from "clsx";

const featuredGroups = [
  {
    id: 1,
    name: "Luyện thi THPT Quốc gia",
    initials: "LT",
    color: "bg-orange-500",
    members: "12k",
    description: "Chia sẻ kiến thức, đề thi và kinh nghiệm luyện thi THPT Quốc gia",
    tags: ["#THPT", "#LuyenThi", "#ThiQuocGia"],
    joined: true,
  },
  {
    id: 2,
    name: "Hội yêu Toán học",
    initials: "HT",
    color: "bg-blue-500",
    members: "5.4k",
    description: "Thảo luận và giải đáp các bài toán từ cơ bản đến nâng cao",
    tags: ["#Toan", "#GiaiTich", "#DaiSo"],
    joined: false,
  },
];

const activeMembers = [
  { name: "Trần Lê Quỳnh...", initials: "QA", color: "bg-purple-500", role: "Sinh viên năm 2", docs: 24 },
  { name: "Lê Minh Tuấn", initials: "MT", color: "bg-green-500", role: "Sinh viên năm 3", docs: 18 },
  { name: "Phạm Thu Hà", initials: "TH", color: "bg-orange-500", role: "Giáo viên", docs: 52 },
  { name: "Hoàng Anh Tú", initials: "AT", color: "bg-teal-500", role: "Sinh viên năm 4", docs: 31 },
];

const myGroups = [
  { name: "Luyện thi THPT Quốc gia", members: "12k thành viên", color: "bg-orange-500", initials: "LT" },
  { name: "Hội yêu Toán học", members: "5.4k thành viên", color: "bg-blue-500", initials: "HT" },
  { name: "Cộng đồng IELTS 7.0+", members: "8.2k thành viên", color: "bg-green-500", initials: "IE" },
];

const invitations = [
  { id: 1, name: "Câu lạc bộ Tiếng Anh", invitedBy: "Trần Lê Quỳnh Anh", color: "bg-blue-500", initials: "CA" },
  { id: 2, name: "Nhóm giải đề Sinh 12", invitedBy: "Lê Minh Tuấn", color: "bg-green-500", initials: "GD" },
];

const suggestions = [
  { name: "Lập trình C/C++ cơ bản", members: "3.2k thành viên", color: "bg-indigo-500", initials: "LP" },
  { name: "Hội du học sinh Mỹ", members: "15k thành viên", color: "bg-red-500", initials: "DH" },
];

export default function CommunityPage() {
  return (
    <div className="flex gap-5 p-5 max-w-[1100px] mx-auto">
      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {/* Hero banner */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Cộng đồng học tập Synora</h1>
          <p className="text-sm text-blue-100 mb-4">Kết nối với hàng nghìn bạn học trên toàn quốc</p>
          <button className="px-5 py-2 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            Khám phá nhóm
          </button>
        </div>

        {/* Featured groups */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary">Nhóm học tập nổi bật</h2>
            <button className="text-xs text-primary font-medium hover:underline">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold", group.color)}>
                    {group.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{group.name}</p>
                    <p className="text-xs text-text-muted">{group.members} thành viên</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">{group.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {group.tags.map((tag) => (
                    <span key={tag} className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <button className={clsx(
                  "w-full py-2 text-sm font-semibold rounded-lg border-2 transition-colors",
                  group.joined
                    ? "border-primary text-primary hover:bg-primary/5"
                    : "bg-primary text-white border-primary hover:bg-primary-700"
                )}>
                  {group.joined ? "Đã tham gia" : "Tham gia"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-text-primary">Thành viên tích cực</h2>
            <div className="flex gap-1">
              <button className="p-1 border border-surface-200 rounded-md hover:bg-surface-100 text-text-secondary">‹</button>
              <button className="p-1 border border-surface-200 rounded-md hover:bg-surface-100 text-text-secondary">›</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-surface-200 shadow-card p-4 text-center">
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2", member.color)}>
                  {member.initials}
                </div>
                <p className="text-xs font-semibold text-text-primary truncate">{member.name}</p>
                <p className="text-[10px] text-primary mb-2">{member.role}</p>
                <p className="text-[10px] text-text-muted mb-2">{member.docs} tài liệu đã chia sẻ</p>
                <button className="w-full text-xs text-primary border border-primary/30 rounded-lg py-1 hover:bg-primary/5 transition-colors">
                  Theo dõi
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[260px] shrink-0 flex flex-col gap-4">
        {/* My groups */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">Nhóm của bạn</h3>
          <div className="flex flex-col gap-2">
            {myGroups.map((group) => (
              <div key={group.name} className="flex items-center gap-2.5">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", group.color)}>
                  {group.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{group.name}</p>
                  <p className="text-[10px] text-text-muted">{group.members}</p>
                </div>
                <button className="text-xs text-primary font-medium hover:underline shrink-0">Vào</button>
              </div>
            ))}
          </div>
        </div>

        {/* Invitations */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-primary">Lời mời tham gia</h3>
            <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </div>
          <div className="flex flex-col gap-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", inv.color)}>
                    {inv.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">{inv.name}</p>
                    <p className="text-[10px] text-text-muted">Mời bởi {inv.invitedBy}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    <Check size={12} /> Chấp nhận
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-surface-200 text-text-secondary text-xs font-semibold rounded-lg hover:bg-surface-100 transition-colors">
                    <X size={12} /> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">Gợi ý cho bạn</h3>
          <div className="flex flex-col gap-2.5">
            {suggestions.map((s) => (
              <div key={s.name} className="flex items-center gap-2.5">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", s.color)}>
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{s.name}</p>
                  <p className="text-[10px] text-text-muted">{s.members}</p>
                </div>
                <button className="p-1 text-primary hover:bg-primary/10 rounded-md transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
