import type { ProfileData } from "./types";

export const profileData: ProfileData = {
  name: "Trần Lê Quỳnh Anh",
  username: "@quynhanh.studynet",
  bio: "Học sinh lớp 12 tại THPT Nguyễn Du. Đam mê Hóa học, Toán học và IELTS. Chia sẻ tài liệu miễn phí cho cộng đồng học sinh Việt Nam 📚",
  school: "THPT Nguyễn Du, Hà Nội",
  location: "Hà Nội, Việt Nam",
  joinDate: "Tháng 3, 2024",
  website: "studynet.vn/quynhanh",
  stats: {
    followers: "4.812",
    following: 231,
    documents: 47,
    downloads: "28.4k",
  },
  subjects: ["Hóa học", "Toán học", "IELTS", "Vật Lý", "Kinh tế", "Sinh học"],
  mutualFriends: [
    { initials: "MT", name: "Lê Minh Tuấn", role: "Học sinh · Lớp 12A3", color: "bg-teal-500" },
    { initials: "TH", name: "Phạm Thu Hà", role: "Sinh viên ĐH Bách Khoa", color: "bg-pink-500" },
    { initials: "AT", name: "Hoàng Anh Tú", role: "Giáo viên IELTS", color: "bg-indigo-500" },
    { initials: "NL", name: "Trần Ngọc Linh", role: "Học sinh · Lớp 12B1", color: "bg-amber-500" },
  ],
  suggestions: [
    { initials: "MQ", name: "Nguyễn Minh Quân", role: "Học sinh · 820 follow", color: "bg-violet-500" },
    { initials: "LA", name: "Mai Lan Anh", role: "Học sinh · 1.2k follow", color: "bg-rose-500" },
    { initials: "DH", name: "Vũ Đức Hiếu", role: "Sinh viên · 560 follow", color: "bg-cyan-600" },
  ],
  recentDocs: [
    { name: "Hóa hữu cơ — Đề thi thử 2024", pages: "28 trang", downloads: 89 },
    { name: "IELTS Writing Task 2 Tips", pages: "15 trang", downloads: 143 },
    { name: "Tích phân bội — Giải tích 12", pages: "20 trang", downloads: 61 },
    { name: "Vật lý — Sóng điện từ tổng hợp", pages: "12 trang", downloads: 44 },
  ],
};

export const posts = [
  {
    id: 1,
    author: {
      name: "Trần Lê Quỳnh Anh",
      initials: "QA",
      color: "bg-slate-700",
      role: "Học sinh lớp 12",
    },
    time: "2 giờ trước",
    content:
      "Mình vừa hoàn thành bộ đề thi thử Hóa hữu cơ cho các bạn lớp 12! Bao gồm đầy đủ 5 chương với lời giải chi tiết. Tải miễn phí bên dưới nhé 🎉",
    tags: ["#HoaHuuCo", "#LopHoc", "#DeThi"],
    attachment: { name: "De_thi_thu_Hoa_huu_co_2024.pdf", size: "4.2MB", type: "PDF" },
    likes: 124,
    comments: 38,
  },
  {
    id: 2,
    author: {
      name: "Trần Lê Quỳnh Anh",
      initials: "QA",
      color: "bg-slate-700",
      role: "Học sinh lớp 12",
    },
    time: "1 ngày trước",
    content:
      "Tips IELTS Writing Task 2 mình đúc kết sau 6 tháng luyện thi. Band 7.5 không khó nếu nắm vững cấu trúc và từ vựng học thuật. Cùng mình ôn nhé! 📝",
    tags: ["#IELTS", "#Writing", "#TiengAnh"],
    attachment: { name: "IELTS_Writing_Task2_Tips.pdf", size: "2.8MB", type: "PDF" },
    likes: 211,
    comments: 54,
  },
  {
    id: 3,
    author: {
      name: "Trần Lê Quỳnh Anh",
      initials: "QA",
      color: "bg-slate-700",
      role: "Học sinh lớp 12",
    },
    time: "3 ngày trước",
    content:
      "Học bài đêm khuya ai ở đây cùng mình không 🥰 Đang cố gắng xong phần Tích phân bội trước 12h. Chúc các bạn học tốt nhé 💪",
    tags: ["#HocBai", "#GiaiTich"],
    likes: 87,
    comments: 22,
  },
];

export const PROFILE_TABS = ["Bài đăng", "Tài liệu", "Đã lưu", "Giới thiệu"] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number];