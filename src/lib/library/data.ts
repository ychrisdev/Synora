import { FileText, Users, Download } from "lucide-react";
import type { Document, FeaturedDoc, Stat } from "./types";

export const PRIMARY_SUBJECT_TABS = [
  { id: "all",         label: "Tất cả" },
  { id: "math",        label: "Toán" },
  { id: "physics",     label: "Vật Lý" },
  { id: "chemistry",   label: "Hóa học" },
  { id: "english",     label: "Tiếng Anh" },
  { id: "coding",      label: "Lập trình" },
  { id: "economics",   label: "Kinh tế" },
];
export const SECONDARY_SUBJECT_TABS = [
  { id: "biology",     label: "Sinh học" },
  { id: "literature",  label: "Ngữ văn" },
  { id: "history",     label: "Lịch sử" },
  { id: "geography",   label: "Địa lý" },
  { id: "marketing",     label: "Marketing" },
  { id: "design",      label: "Thiết kế" },
  { id: "ielts",   label: "IELTS" },
  { id: "soft-skills",   label: "Kỹ năng mềm" },
  { id: "business",   label: "Quản trị" },
  { id: "university",   label: "Đại học" },
];
export const ALL_SUBJECT_TABS = [
  ...PRIMARY_SUBJECT_TABS,
  ...SECONDARY_SUBJECT_TABS,
];

export const TYPE_TABS = ["Tất cả", "PDF", "DOCX", "PPTX"];

export const SORT_OPTIONS: { key: import("./types").SortKey; label: string }[] = [
  { key: "newest",         label: "Mới nhất" },
  { key: "mostDownloaded", label: "Nhiều tải nhất" },
  { key: "oldest",         label: "Cũ nhất" },
];

export const FILE_TYPE_COLORS: Record<string, string> = {
  PDF:  "bg-red-500",
  DOCX: "bg-blue-600",
  PPTX: "bg-orange-500",
};

export const DOCUMENTS: Document[] = [
  {
    id: 1,
    title: "Đề cương Giải Tích 1 chi tiết",
    type: "PDF", subject: "Toán", subjectId: "math",
    author: { name: "Trần Quỳnh Anh", initials: "QA", color: "bg-purple-500" },
    date: "12/10/2023", downloads: "2.4k", downloadsNum: 2400,
  },
  {
    id: 2,
    title: "Tổng hợp đề thi Hóa hữu cơ 2020–2023",
    type: "PDF", subject: "Hóa học", subjectId: "chemistry",
    author: { name: "Nguyễn Văn An", initials: "NA", color: "bg-primary" },
    date: "05/11/2023", downloads: "1.8k", downloadsNum: 1800,
  },
  {
    id: 3,
    title: "Slide Kinh tế vĩ mô – Full chương",
    type: "PPTX", subject: "Kinh tế", subjectId: "economics",
    author: { name: "Lê Minh Tuấn", initials: "MT", color: "bg-green-500" },
    date: "20/09/2023", downloads: "956", downloadsNum: 956,
  },
  {
    id: 4,
    title: "Giáo trình Lập trình C++ cơ bản",
    type: "DOCX", subject: "Lập trình", subjectId: "coding",
    author: { name: "Phạm Thu Hà", initials: "TH", color: "bg-orange-500" },
    date: "15/08/2023", downloads: "1.2k", downloadsNum: 1200,
  },
  {
    id: 5,
    title: "Bí kíp IELTS Writing Task 2",
    type: "PDF", subject: "Tiếng Anh", subjectId: "english",
    author: { name: "Hoàng Anh Tú", initials: "AT", color: "bg-teal-500" },
    date: "02/11/2023", downloads: "3.1k", downloadsNum: 3100,
  },
  {
    id: 6,
    title: "Tóm tắt công thức Vật Lý 12",
    type: "PDF", subject: "Vật Lý", subjectId: "physics",
    author: { name: "Mai Lan Anh", initials: "LA", color: "bg-pink-500" },
    date: "28/10/2023", downloads: "2.7k", downloadsNum: 2700,
  },
];

export const FEATURED_DOCS: FeaturedDoc[] = [
  { id: 1, title: "Bí kíp 8.0+ IELTS Reading",      type: "PDF",  downloads: "2.4k", color: "bg-red-500" },
  { id: 2, title: "Tóm tắt công thức Vật Lý 12",    type: "PDF",  downloads: "1.8k", color: "bg-red-500" },
  { id: 3, title: "Slide thuyết trình Kỹ năng mềm", type: "PPTX", downloads: "956",  color: "bg-orange-500" },
];

export const STATS: (Stat & { icon: React.ElementType })[] = [
  { value: "12,540", label: "tài liệu",       icon: FileText },
  { value: "8,200",  label: "người đóng góp", icon: Users    },
  { value: "2.4M",   label: "lượt tải",       icon: Download },
];