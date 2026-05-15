import { Users, FileText, PanelsTopLeft } from "lucide-react";

export type Group = {
  id: number;
  name: string;
  initials: string;
  color: string;
  members: string;
  description: string;
  tags: string[];
  joined: boolean;
};

export type Member = {
  name: string;
  initials: string;
  color: string;
  role: string;
  docs: number;
  followers: number;
};

export type MyGroup = {
  name: string;
  members: string;
  color: string;
  initials: string;
  unread: number;
};

export type Invitation = {
  id: number;
  name: string;
  invitedBy: string;
  color: string;
  initials: string;
};

export type Suggestion = {
  name: string;
  members: string;
  color: string;
  initials: string;
};

export type Stat = {
  label: string;
  value: string;
  icon: any;
  iconClass: string;
};

export const MEMBERS_PER_PAGE = 4;

export const featuredGroups: Group[] = [
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
  {
    id: 3,
    name: "Cộng đồng IELTS 7.0+",
    initials: "IE",
    color: "bg-green-500",
    members: "8.2k",
    description: "Chia sẻ tài liệu, tips luyện thi IELTS và kinh nghiệm đạt band cao",
    tags: ["#IELTS", "#TiengAnh", "#Study"],
    joined: true,
  },
  {
    id: 4,
    name: "Lập trình C/C++ cơ bản",
    initials: "LP",
    color: "bg-indigo-500",
    members: "3.2k",
    description: "Học lập trình từ cơ bản đến nâng cao với ngôn ngữ C và C++",
    tags: ["#LapTrinh", "#C++", "#Code"],
    joined: false,
  },
];

export const allActiveMembers: Member[] = [
  { name: "Trần Lê Quỳnh Anh", initials: "QA", color: "bg-purple-500", role: "Sinh viên năm 2", docs: 24, followers: 132 },
  { name: "Lê Minh Tuấn", initials: "MT", color: "bg-green-500", role: "Sinh viên năm 3", docs: 18, followers: 87 },
  { name: "Phạm Thu Hà", initials: "TH", color: "bg-orange-500", role: "Giáo viên", docs: 52, followers: 310 },
  { name: "Hoàng Anh Tú", initials: "AT", color: "bg-teal-500", role: "Sinh viên năm 4", docs: 31, followers: 214 },
  { name: "Nguyễn Bảo Châu", initials: "BC", color: "bg-pink-500", role: "Giáo viên", docs: 67, followers: 489 },
  { name: "Vũ Thị Mai Linh", initials: "ML", color: "bg-cyan-500", role: "Sinh viên năm 1", docs: 9, followers: 45 },
  { name: "Đặng Quốc Huy", initials: "QH", color: "bg-amber-500", role: "Sinh viên năm 3", docs: 41, followers: 178 },
  { name: "Trịnh Thảo Nhi", initials: "TN", color: "bg-rose-500", role: "Sinh viên năm 2", docs: 15, followers: 92 },
];

export const myGroups: MyGroup[] = [
  { name: "Luyện thi THPT Quốc gia", members: "12k thành viên", color: "bg-orange-500", initials: "LT", unread: 3 },
  { name: "Hội yêu Toán học", members: "5.4k thành viên", color: "bg-blue-500", initials: "HT", unread: 0 },
  { name: "Cộng đồng IELTS 7.0+", members: "8.2k thành viên", color: "bg-green-500", initials: "IE", unread: 7 },
  { name: "Lập trình Web Frontend", members: "2.1k thành viên", color: "bg-violet-500", initials: "WF", unread: 0 },
  { name: "Hóa học vui", members: "1.8k thành viên", color: "bg-yellow-500", initials: "HH", unread: 1 },
];

export const initialInvitations: Invitation[] = [
  { id: 1, name: "Câu lạc bộ Tiếng Anh", invitedBy: "Trần Lê Quỳnh Anh", color: "bg-blue-500", initials: "CA" },
  { id: 2, name: "Nhóm giải đề Sinh 12", invitedBy: "Lê Minh Tuấn", color: "bg-green-500", initials: "GD" },
  { id: 3, name: "Vật lý nâng cao 2k7", invitedBy: "Phạm Thu Hà", color: "bg-orange-500", initials: "VL" },
];

export const suggestions: Suggestion[] = [
  { name: "Lập trình C/C++ cơ bản", members: "3.2k thành viên", color: "bg-indigo-500", initials: "LP" },
  { name: "Hội du học sinh Mỹ", members: "15k thành viên", color: "bg-red-500", initials: "DH" },
  { name: "Toán olympiad", members: "2.7k thành viên", color: "bg-amber-500", initials: "TO" },
  { name: "Cộng đồng làm thơ", members: "980 thành viên", color: "bg-pink-500", initials: "LT" },
];

export const stats: Stat[] = [
  {
    label: "Thành viên",
    value: "48.2k",
    icon: Users,
    iconClass: "text-primary bg-primary-50",
  },
  {
    label: "Tài liệu chia sẻ",
    value: "12.4k",
    icon: FileText,
    iconClass: "text-green-600 bg-green-50",
  },
  {
    label: "Nhóm học tập",
    value: "320",
    icon: PanelsTopLeft,
    iconClass: "text-amber-600 bg-amber-50",
  },
];