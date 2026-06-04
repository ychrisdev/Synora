export const LEVEL_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "academic", label: "Trung học" },
  { id: "university", label: "Cao đẳng / ĐH" },
  { id: "other", label: "Khác" },
];

export const ACADEMIC_GRADES = [
  { id: "6", label: "Lớp 6" },
  { id: "7", label: "Lớp 7" },
  { id: "8", label: "Lớp 8" },
  { id: "9", label: "Lớp 9" },
  { id: "10", label: "Lớp 10" },
  { id: "11", label: "Lớp 11" },
  { id: "12", label: "Lớp 12" },
];

export const ACADEMIC_SUBJECTS = [
  { id: "math", label: "Toán" },
  { id: "literature", label: "Ngữ văn" },
  { id: "english", label: "Tiếng Anh" },
  { id: "physics", label: "Vật lý" },
  { id: "chemistry", label: "Hóa học" },
  { id: "biology", label: "Sinh học" },
  { id: "history", label: "Lịch sử" },
  { id: "geography", label: "Địa lý" },
  { id: "informatics", label: "Tin học" },
  { id: "technology", label: "Công nghệ" },
  { id: "civics", label: "Giáo dục công dân" },
  { id: "economics", label: "Giáo dục kinh tế và pháp luật" },
];

export const UNIVERSITY_MAJORS = [
  { id: "it", label: "CNTT & Máy tính" },
  { id: "engineering", label: "Kỹ thuật" },
  { id: "business", label: "Kinh doanh" },
  { id: "economics", label: "Kinh tế" },
  { id: "finance", label: "Tài chính" },
  { id: "law", label: "Luật" },
  { id: "education", label: "Sư phạm" },
  { id: "medicine", label: "Y Dược" },
  { id: "languages", label: "Ngôn ngữ" },
  { id: "social", label: "Khoa học xã hội" },
  { id: "media", label: "Truyền thông" },
  { id: "tourism", label: "Du lịch" },
  { id: "agriculture", label: "Nông nghiệp" },
  { id: "architecture", label: "Kiến trúc" },
  { id: "arts", label: "Thiết kế" },
];

export const TYPE_TABS = ["Tất cả", "PDF", "DOCX", "PPTX"];

export const SORT_OPTIONS: { key: import("./types").SortKey; label: string }[] = [
  { key: "newest",         label: "Mới nhất" },
  { key: "mostDownloaded", label: "Tải nhiều nhất" },
  { key: "mine",           label: "Của tôi" },
  { key: "saved",          label: "Đã lưu" },
];

export const FILE_TYPE_COLORS: Record<string, string> = {
  PDF:  "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};