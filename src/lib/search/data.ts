import {
  Search,
  BookOpen,
  MessageSquare,
  UserCircle,
  Users,
  Hash,
} from "lucide-react";
import type { TabKey, ResultType, FilterConfig, SearchResult } from "./types";

export const MOCK_RESULTS: SearchResult[] = [
  {
    id: 1,
    type: "document",
    title: "Tổng hợp công thức Hóa hữu cơ lớp 12 đầy đủ nhất",
    subtitle: "Bao gồm toàn bộ phản ứng, cơ chế và bài tập minh họa theo từng chương",
    meta: "Nguyễn Anh Tuấn · PDF · 42 trang",
    tags: ["Hóa học", "Lớp 12", "THPT QG"],
    stats: [
      { label: "lượt tải", value: "2.4k" },
      { label: "lượt xem", value: "8.1k" },
      { label: "sao", value: "4.8" },
    ],
    href: "/main/library/1",
  },
  {
    id: 2,
    type: "document",
    title: "Bộ đề thi thử Hóa học 2023 – 2024 có đáp án chi tiết",
    subtitle: "Tổng hợp 30 đề thi thử từ các trường chuyên trên toàn quốc",
    meta: "Trần Lê Quỳnh Anh · PDF · 120 trang",
    tags: ["Hóa học", "Đề thi", "Ôn luyện"],
    stats: [
      { label: "lượt tải", value: "5.7k" },
      { label: "lượt xem", value: "18k" },
      { label: "sao", value: "4.9" },
    ],
    href: "/main/library/2",
  },
  {
    id: 3,
    type: "document",
    title: "Giáo trình Giải Tích 1 – Đại học Bách Khoa HCM",
    subtitle: "Lý thuyết và bài tập có lời giải chi tiết từng chương",
    meta: "Minh Đức · DOCX · 210 trang",
    tags: ["Toán", "Đại học", "Giải tích"],
    stats: [
      { label: "lượt tải", value: "3.2k" },
      { label: "lượt xem", value: "9.4k" },
      { label: "sao", value: "4.7" },
    ],
    href: "/main/library/3",
  },
  {
    id: 4,
    type: "post",
    title: "Hỏi về phương pháp giải nhanh bài toán tích phân bội",
    subtitle: "Mình đang ôn thi học kỳ nhưng vẫn chưa nắm vững phần này, mọi người có thể chia sẻ phương pháp không?",
    meta: "Phạm Quốc Bảo · 3 giờ trước",
    tags: ["Toán", "Câu hỏi"],
    stats: [
      { label: "trả lời", value: 12 },
      { label: "thích", value: 34 },
    ],
    href: "/main/feed/post-4",
  },
  {
    id: 5,
    type: "post",
    title: "Chia sẻ kinh nghiệm thi đạt 9.25 môn Hóa THPT QG 2024",
    subtitle: "Sau 3 tháng ôn luyện tập trung, mình đã đạt được điểm số mơ ước. Đây là toàn bộ phương pháp của mình...",
    meta: "Lê Ngọc Hân · 1 ngày trước",
    tags: ["Kinh nghiệm", "THPT QG", "Hóa học"],
    stats: [
      { label: "trả lời", value: 89 },
      { label: "thích", value: 412 },
    ],
    badge: "Nổi bật",
    href: "/main/feed/post-5",
  },
  {
    id: 6,
    type: "person",
    title: "Trần Lê Quỳnh Anh",
    subtitle: "Gia sư Hóa học · ĐHSP HCM",
    meta: "124 tài liệu · 3.2k người theo dõi",
    avatar: "QA",
    avatarColor: "bg-violet-500",
    href: "/main/profile/quynh-anh",
  },
  {
    id: 7,
    type: "person",
    title: "Nguyễn Minh Tuấn",
    subtitle: "Sinh viên Bách Khoa · Toán – Tin",
    meta: "57 tài liệu · 890 người theo dõi",
    avatar: "MT",
    avatarColor: "bg-emerald-500",
    href: "/main/profile/minh-tuan",
  },
  {
    id: 8,
    type: "group",
    title: "Luyện thi THPT Quốc gia 2025",
    subtitle: "Cộng đồng ôn luyện, chia sẻ tài liệu và kinh nghiệm thi THPT",
    meta: "12.4k thành viên · Hoạt động hôm nay",
    avatar: "LT",
    avatarColor: "bg-orange-500",
    href: "/main/community/luyen-thi-thpt",
  },
  {
    id: 9,
    type: "group",
    title: "Hóa Học Vui – Chemistry is Fun",
    subtitle: "Nhóm học Hóa theo phương pháp mới, vui và dễ nhớ",
    meta: "4.8k thành viên · Công khai",
    avatar: "HH",
    avatarColor: "bg-cyan-500",
    href: "/main/community/hoa-hoc-vui",
  },
  {
    id: 10,
    type: "topic",
    title: "#HoaHuuCo",
    subtitle: "Chủ đề về Hóa hữu cơ – lý thuyết, bài tập và tài liệu",
    meta: "2.1k bài viết · 340 tài liệu",
    href: "/main/explore?topic=hoa-huu-co",
  },
  {
    id: 11,
    type: "topic",
    title: "#OnThiTHPT",
    subtitle: "Tài nguyên và kinh nghiệm ôn thi tốt nghiệp THPT",
    meta: "8.7k bài viết · 1.2k tài liệu",
    href: "/main/explore?topic=on-thi-thpt",
  },
];

export const TAB_CONFIG: {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "all", label: "Tất cả", icon: Search },
  { key: "documents", label: "Tài liệu", icon: BookOpen },
  { key: "posts", label: "Bài viết", icon: MessageSquare },
  { key: "people", label: "Mọi người", icon: UserCircle },
  { key: "groups", label: "Nhóm học tập", icon: Users },
  { key: "topics", label: "Chủ đề", icon: Hash },
];

export const TYPE_TO_TAB: Record<ResultType, TabKey> = {
  document: "documents",
  post: "posts",
  person: "people",
  group: "groups",
  topic: "topics",
};

export const SECTION_LABELS: Record<ResultType, string> = {
  document: "Tài liệu",
  post: "Bài viết",
  person: "Mọi người",
  group: "Nhóm học tập",
  topic: "Chủ đề",
};

export const RESULT_SECTION_ORDER: ResultType[] = [
  "document",
  "post",
  "person",
  "group",
  "topic",
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "relevant", label: "Liên quan nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "rating", label: "Đánh giá cao" },
];

export const FILTER_CONFIG: Record<TabKey, FilterConfig> = {
  all: {
    groups: [
      {
        label: "Môn học",
        options: ["Toán", "Hóa học", "Vật lý", "Tiếng Anh", "Sinh học", "Lịch sử", "Địa lý"],
      },
      {
        label: "Cấp học",
        options: ["Lớp 10", "Lớp 11", "Lớp 12", "Đại học"],
      },
    ],
  },
  documents: {
    groups: [
      {
        label: "Loại tài liệu",
        options: ["PDF", "Word", "PowerPoint", "Đề thi", "Giáo trình", "Tóm tắt"],
      },
      {
        label: "Môn học",
        options: ["Toán", "Hóa học", "Vật lý", "Tiếng Anh", "Sinh học"],
      },
      {
        label: "Cấp học",
        options: ["Lớp 10", "Lớp 11", "Lớp 12", "Đại học"],
      },
    ],
  },
  posts: {
    groups: [
      {
        label: "Loại bài viết",
        options: ["Câu hỏi", "Chia sẻ", "Thảo luận", "Kinh nghiệm"],
      },
      {
        label: "Thời gian",
        options: ["Hôm nay", "Tuần này", "Tháng này", "Năm nay"],
      },
    ],
  },
  people: {
    groups: [
      {
        label: "Vai trò",
        options: ["Học sinh", "Sinh viên", "Gia sư", "Giảng viên"],
      },
      {
        label: "Chuyên môn",
        options: ["Toán", "Hóa học", "Vật lý", "Tiếng Anh"],
      },
    ],
  },
  groups: {
    groups: [
      {
        label: "Loại nhóm",
        options: ["Công khai", "Riêng tư", "Ôn thi", "Học thuật"],
      },
      {
        label: "Quy mô",
        options: ["< 100", "100–1k", "1k–10k", "> 10k"],
      },
    ],
  },
  topics: {
    groups: [
      {
        label: "Danh mục",
        options: ["Thi cử", "Học thuật", "Kỹ năng", "Ngoại ngữ"],
      },
    ],
  },
};