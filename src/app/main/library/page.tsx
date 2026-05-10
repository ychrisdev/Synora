"use client";

import { useState } from "react";
import { Upload, Search, Star, FileText, Users, Download, SlidersHorizontal, ChevronDown } from "lucide-react";
import clsx from "clsx";

const tabs = ["Tất cả", "PDF", "DOCX", "PPTX", "Đã lưu"];

const documents = [
  { id: 1, title: "Đề cương Giải Tích 1 chi tiết", type: "PDF", subject: "Toán", author: { name: "Trần Quỳnh Anh", initials: "QA", color: "bg-purple-500" }, date: "12/10/2023", downloads: "2.4k" },
  { id: 2, title: "Tổng hợp đề thi Hóa hữu cơ 2020–2023", type: "PDF", subject: "Hóa học", author: { name: "Nguyễn Văn An", initials: "NA", color: "bg-primary" }, date: "05/11/2023", downloads: "1.8k" },
  { id: 3, title: "Slide Kinh tế vĩ mô – Full chương", type: "PPTX", subject: "Kinh tế", author: { name: "Lê Minh Tuấn", initials: "MT", color: "bg-green-500" }, date: "20/09/2023", downloads: "956" },
  { id: 4, title: "Giáo trình Lập trình C++ cơ bản", type: "DOCX", subject: "Lập trình", author: { name: "Phạm Thu Hà", initials: "TH", color: "bg-orange-500" }, date: "15/08/2023", downloads: "1.2k" },
  { id: 5, title: "Bí kíp IELTS Writing Task 2", type: "PDF", subject: "Tiếng Anh", author: { name: "Hoàng Anh Tú", initials: "AT", color: "bg-teal-500" }, date: "02/11/2023", downloads: "3.1k" },
  { id: 6, title: "Tóm tắt công thức Vật Lý 12", type: "PDF", subject: "Vật Lý", author: { name: "Mai Lan Anh", initials: "LA", color: "bg-pink-500" }, date: "28/10/2023", downloads: "2.7k" },
];

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};

/* type FileType = "PDF" | "DOCX" | "PPTX"; */

const stats = [
  { value: "12,540", label: "tài liệu", icon: FileText },
  { value: "8,200", label: "người đóng góp", icon: Users },
  { value: "2.4M", label: "lượt tải", icon: Download },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [savedDocs, setSavedDocs] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedDocs((prev) => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  return (
    <div className="p-5 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Thư viện tài liệu</h1>
          <p className="text-sm text-text-secondary">Kho tàng tài liệu học tập từ cộng đồng Synora</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          <Upload size={15} />
          Tải lên tài liệu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-surface-200 shadow-card p-4 flex items-center gap-3">
            <stat.icon size={18} className="text-primary" />
            <div>
              <p className="text-lg font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu theo tên, môn học, tác giả..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors">
          <SlidersHorizontal size={14} />
          Môn học
          <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors">
          <SlidersHorizontal size={14} />
          Loại file
          <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors">
          Sắp xếp: Mới nhất
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-surface-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Documents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl border border-surface-200 shadow-card card-hover p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold", fileTypeColors[doc.type] || "bg-gray-500")}>
                {doc.type}
              </div>
              <button
                onClick={() => toggleSave(doc.id)}
                className={clsx("p-1.5 rounded-lg transition-colors", savedDocs.includes(doc.id) ? "text-yellow-500" : "text-text-muted hover:text-yellow-500")}
              >
                <Star size={16} fill={savedDocs.includes(doc.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-3 line-clamp-2 leading-snug">{doc.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold", doc.author.color)}>
                {doc.author.initials}
              </div>
              <div>
                <p className="text-xs text-text-secondary">{doc.author.name}</p>
                <p className="text-[10px] text-text-muted">{doc.date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-surface-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 bg-surface-100 rounded-full text-text-secondary font-medium">{doc.subject}</span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Download size={11} /> {doc.downloads}
                </span>
              </div>
              <button className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors">
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
