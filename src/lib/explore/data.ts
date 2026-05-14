import type { ActiveGroup, TopContributor, ExplorePost } from "./types";

export const CATEGORY_TABS = [
  "Tất cả", "Toán", "Vật Lý", "Hóa học",
  "Tiếng Anh", "Lập trình", "Kinh tế",
];

export const TAG_TO_CATEGORY: Record<string, string> = {
  "#GiaiTich1":  "Toán",
  "#THPT2024":   "Toán",
  "#VatLy12":    "Vật Lý",
  "#DeThi":      "Vật Lý",
  "#HoaHuuCo":  "Hóa học",
  "#HocTot":     "Hóa học",
  "#IELTS7Plus": "Tiếng Anh",
  "#TiengAnh":   "Tiếng Anh",
  "#LapTrinh":   "Lập trình",
  "#CTDLGT":     "Lập trình",
  "#KinhTeViMo": "Kinh tế",
};

export const TRENDING_POSTS: ExplorePost[] = [
  {
    id: 101,
    author: { name: "Giáo viên Nguyễn Tú", initials: "NT", color: "bg-teal-500", role: "Giáo viên Toán" },
    time: "3 giờ trước",
    content:
      "Các em lưu ý: phần tích phân bội trong đề thi năm nay sẽ tập trung vào đổi biến và tích phân suy rộng. Mình vừa cập nhật tài liệu ôn tập theo đúng cấu trúc đề mới. Ai cần thì inbox nhé! #GiaiTich1 #THPT2024",
    tags: ["#GiaiTich1", "#THPT2024"],
    attachment: { name: "On_thi_THPT_Toan_2024.pdf", size: "1.2 MB", type: "PDF" },
    likes: 312,
    comments: 47,
  },
  {
    id: 102,
    author: { name: "Trần Minh Hoàng", initials: "TH", color: "bg-teal-500", role: "Sinh viên năm 3" },
    time: "5 giờ trước",
    content:
      "Sau 2 tuần ôn luyện, mình tổng hợp được 50 câu trắc nghiệm Vật lý 12 hay gặp nhất. Từng câu đều có giải thích tại sao các đáp án kia sai — cái này giúp mình rất nhiều khi ôn thi. #VatLy12 #DeThi",
    tags: ["#VatLy12", "#DeThi"],
    attachment: { name: "50_cau_trac_nghiem_Ly12.docx", size: "3.5 MB", type: "DOCX" },
    likes: 856,
    comments: 92,
  },
  {
    id: 103,
    author: { name: "Phạm Ngọc Mai", initials: "PM", color: "bg-pink-500", role: "Học sinh" },
    time: "2 ngày trước",
    content:
      "Tips học Hóa Hữu cơ: thay vì học thuộc từng phản ứng, hãy hiểu cơ chế — nhóm chức nào thì có tính chất nào. Mình đã thi đạt 9.5 bằng cách này sau 3 tuần ôn! 🎉 #HoaHuuCo #HocTot",
    tags: ["#HoaHuuCo", "#HocTot"],
    likes: 1420,
    comments: 183,
  },
  {
    id: 104,
    author: { name: "Nguyễn Đức Tuấn", initials: "NT", color: "bg-indigo-500", role: "Sinh viên CNTT" },
    time: "Hôm qua",
    content:
      "Ai đang học môn CTDL & GT không? Mình vừa tóm tắt lại toàn bộ các thuật toán sắp xếp với độ phức tạp và ví dụ minh họa. Nếu có bạn muốn học nhóm cuối tuần thì inbox mình nhé! #LapTrinh #CTDLGT",
    tags: ["#LapTrinh", "#CTDLGT"],
    likes: 234,
    comments: 38,
  },
  {
    id: 105,
    author: { name: "Hoàng Anh Tú", initials: "AT", color: "bg-orange-500", role: "Giáo viên IELTS" },
    time: "4 giờ trước",
    content:
      "Writing Task 2 tip: đừng chỉ nêu ý kiến, hãy phân tích *tại sao* và cho ví dụ cụ thể. Examiner chấm điểm coherence cao hơn vocabulary. Mình có 30 đề mẫu band 7.0+ nếu ai cần. #IELTS7Plus #TiengAnh",
    tags: ["#IELTS7Plus", "#TiengAnh"],
    likes: 543,
    comments: 61,
  },
  {
    id: 106,
    author: { name: "Trần Hùng", initials: "TH", color: "bg-blue-500", role: "Giảng viên Kinh tế" },
    time: "1 ngày trước",
    content:
      "Sinh viên hay nhầm lẫn giữa GDP và GNP. Đơn giản mà nhớ: GDP = sản xuất *trong lãnh thổ*, GNP = sản xuất của *công dân*. Apple tại VN → vào GDP của VN, không vào GNP. #KinhTeViMo #HocTot",
    tags: ["#KinhTeViMo", "#HocTot"],
    likes: 389,
    comments: 44,
  },
];

export const ACTIVE_GROUPS: ActiveGroup[] = [
  { name: "Luyện thi THPT 2024", initials: "LT", color: "bg-orange-500", members: "12.4k", activity: "847 bài tuần này" },
  { name: "IELTS 7.0+",          initials: "IE", color: "bg-teal-500",   members: "8.2k",  activity: "523 bài tuần này" },
  { name: "Hội yêu Lập trình",   initials: "LP", color: "bg-indigo-500", members: "5.6k",  activity: "312 bài tuần này" },
  { name: "Hóa học vui",         initials: "HH", color: "bg-pink-500",   members: "3.1k",  activity: "198 bài tuần này" },
];

export const TOP_CONTRIBUTORS: TopContributor[] = [
  { name: "Phạm Ngọc Mai",   initials: "PM", color: "bg-pink-500",   role: "Học sinh",        posts: 24, subject: "Hóa học"   },
  { name: "Hoàng Anh Tú",    initials: "AT", color: "bg-orange-500", role: "Giáo viên IELTS", posts: 18, subject: "Tiếng Anh" },
  { name: "Trần Minh Hoàng", initials: "TH", color: "bg-teal-500",   role: "Sinh viên năm 3", posts: 15, subject: "Vật Lý"    },
  { name: "Nguyễn Đức Tuấn", initials: "NT", color: "bg-indigo-500", role: "Sinh viên CNTT",  posts: 11, subject: "Lập trình" },
];