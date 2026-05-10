"use client";

import { useState } from "react";
import { Download, MessageCircle, ThumbsUp, SlidersHorizontal, UserPlus, Star } from "lucide-react";
import { clsx } from "clsx";

const subjects = ["Tất cả", "Toán", "Vật Lý", "Hóa học", "Văn học", "Tiếng Anh", "Lập trình", "Kinh tế"];

const contentCards = [
  {
    id: 1,
    author: { name: "Lê Thị Bích", initials: "LB", color: "bg-purple-500", role: "Giáo viên" },
    content: "Bộ tài liệu ôn thi THPT Quốc gia môn Toán năm 2024 có đủ dáp án và lời giải chi tiết...",
    tags: ["#ToanHoc", "#THPT2024"],
    file: { name: "On_thi_THPT_Toan_2024.pdf", size: "4.2 MB", type: "PDF" },
    likes: "1.2k",
    comments: 145,
  },
  {
    id: 2,
    author: { name: "Trần Minh Hoàng", initials: "TH", color: "bg-teal-500", role: "Sinh viên năm 3" },
    content: "Mình vừa tổng hợp xong danh sách 50 câu hỏi trắc nghiệm Vật lý 12 thường gặp trong...",
    tags: ["#VatLy12", "#DeThi"],
    file: { name: "50_cau_trac_nghiem_Ly12.docx", size: "2.1 MB", type: "DOCX" },
    likes: 856,
    comments: 92,
  },
  {
    id: 3,
    author: { name: "Phạm Ngọc Mai", initials: "PM", color: "bg-pink-500", role: "Học sinh" },
    content: "Đề cương ôn tập Hóa học kì 2 phần Hóa Hữu cơ cho các bạn 2k6. Có tóm tắt lý thuyết rõ...",
    tags: ["#HoaHuuCo", "#KiemTra"],
    file: { name: "De_cuong_Hoa_Huu_co.pdf", size: "1.8 MB", type: "PDF" },
    likes: 642,
    comments: 48,
  },
  {
    id: 4,
    author: { name: "Nguyễn Đức Tuấn", initials: "NT", color: "bg-indigo-500", role: "Sinh viên CNTT" },
    content: "Chia sẻ slide bài giảng cấu trúc dữ liệu và giải thuật từ thầy Dũng đại học Bách Khoa. Slide...",
    tags: ["#LapTrinh", "#CTDLGT"],
    file: { name: "Slide_CTDL_GT.pptx", size: "5.5 MB", type: "PPTX" },
    likes: "1.5k",
    comments: 210,
  },
];

const suggestedUsers = [
  { name: "Giáo viên Nguyễn Tú", initials: "NT", color: "bg-teal-500", role: "Giáo viên Toán" },
  { name: "Đào Minh Quang", initials: "MQ", color: "bg-orange-500", role: "Thủ khoa khối A 2023" },
  { name: "Sarah English", initials: "SE", color: "bg-green-500", role: "Giáo viên IELTS 8.5" },
];

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};

export default function ExplorePage() {
  const [activeSubject, setActiveSubject] = useState("Tất cả");

  return (
    <div className="flex gap-5 p-5 max-w-[1100px] mx-auto">
      {/* Main */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-text-primary mb-1">Khám phá nội dung</h1>
        <p className="text-sm text-text-secondary mb-4">Tìm kiếm tài liệu, bài viết và nhóm học tập phù hợp với bạn</p>

        {/* Subject tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeSubject === s
                  ? "bg-primary text-white"
                  : "bg-white border border-surface-200 text-text-secondary hover:border-primary hover:text-primary"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-surface-200 shadow-card card-hover p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold", card.author.color)}>
                  {card.author.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{card.author.name}</p>
                  <p className="text-xs text-primary">{card.author.role}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-2 line-clamp-2">{card.content}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-xs text-primary font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between p-2.5 bg-surface-50 rounded-lg border border-surface-200 mb-3">
                <div className="flex items-center gap-2">
                  <div className={clsx("w-7 h-7 rounded-md flex items-center justify-center text-white text-[9px] font-bold shrink-0", fileTypeColors[card.file.type] || "bg-gray-500")}>
                    {card.file.type}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-primary truncate max-w-[150px]">{card.file.name}</p>
                    <p className="text-[10px] text-text-muted">{card.file.size}</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-surface-200 rounded-md text-text-secondary transition-colors">
                  <Download size={13} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp size={13} /> {card.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageCircle size={13} /> {card.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[260px] shrink-0 flex flex-col gap-4">
        {/* Advanced search */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={14} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Tìm kiếm nâng cao</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block uppercase tracking-wide">Môn học</label>
              <select className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 text-text-primary bg-white focus:outline-none focus:border-primary">
                <option>Tất cả môn học</option>
                <option>Toán</option>
                <option>Vật Lý</option>
                <option>Hóa học</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block uppercase tracking-wide">Cấp độ</label>
              <select className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 text-text-primary bg-white focus:outline-none focus:border-primary">
                <option>Tất cả cấp độ</option>
                <option>THPT</option>
                <option>Đại học</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block uppercase tracking-wide">Loại tài liệu</label>
              <div className="flex flex-col gap-1.5">
                {["PDF", "DOCX", "PPTX"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={type !== "PPTX"} className="accent-primary" />
                    <span className="text-sm text-text-primary">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        {/* Suggested users */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-yellow-500" />
            <h3 className="text-sm font-semibold text-text-primary">Được đề xuất cho bạn</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {suggestedUsers.map((user) => (
              <div key={user.name} className="flex items-center gap-2.5">
                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", user.color)}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{user.role}</p>
                </div>
                <button className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors">
                  <UserPlus size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
