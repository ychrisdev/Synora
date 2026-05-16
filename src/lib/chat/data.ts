import type {
  Conversation,
  Member,
  Message,
  PendingMessage,
  BlockedUser,
  SharedFile,
  SharedImage,
  Contact,
} from "@/lib/chat/type";

export const ME = { initials: "NA", name: "Nguyễn An", color: "bg-primary" };

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Nhóm Giải Tích 1",
    initials: "GT",
    color: "bg-primary",
    isGroup: true,
    lastMessage: "Quỳnh Anh: Mọi người ôn bài tập chương 3 chưa?",
    time: "2 phút",
    unread: 3,
  },
  {
    id: 2,
    name: "Hội yêu Toán học",
    initials: "HT",
    color: "bg-orange-500",
    isGroup: true,
    lastMessage: "Minh Tuấn: Ai làm xong đề chưa, share mình với",
    time: "15 phút",
    unread: 1,
  },
  {
    id: 3,
    name: "Trần Lê Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    isGroup: false,
    lastMessage: "Mình gửi file đề cương rồi nhé!",
    time: "1 giờ",
    unread: 0,
  },
  {
    id: 4,
    name: "Lê Minh Tuấn",
    initials: "MT",
    color: "bg-green-500",
    isGroup: false,
    lastMessage: "Tối nay học nhóm không bạn?",
    time: "3 giờ",
    unread: 0,
  },
  {
    id: 5,
    name: "Nhóm IELTS 7.0+",
    initials: "IE",
    color: "bg-teal-500",
    isGroup: true,
    lastMessage: "Anh Tú: Bài reading hôm nay khó vãi",
    time: "Hôm qua",
    unread: 0,
  },
  {
    id: 6,
    name: "Hoàng Ngọc Nhi",
    initials: "HN",
    color: "bg-pink-500",
    isGroup: false,
    lastMessage: "Bạn có rảnh chiều nay không?",
    time: "Hôm qua",
    unread: 2,
  },
  {
    id: 7,
    name: "Nhóm Lập Trình Web",
    initials: "LW",
    color: "bg-indigo-500",
    isGroup: true,
    lastMessage: "Long: Ai biết fix lỗi CORS không?",
    time: "2 ngày",
    unread: 0,
  },
  {
    id: 8,
    name: "Bùi Thanh Long",
    initials: "BL",
    color: "bg-indigo-400",
    isGroup: false,
    lastMessage: "Ok mình gửi source code cho bạn nhé",
    time: "3 ngày",
    unread: 0,
  },
];

export const pendingMessages: PendingMessage[] = [
  {
    id: 1,
    sender: "Trịnh Xuân Vinh",
    initials: "TV",
    color: "bg-amber-500",
    content: "Chào bạn, mình muốn hỏi về bài tập nhóm tuần này...",
    time: "30 phút trước",
  },
  {
    id: 2,
    sender: "Phạm Thị Lan",
    initials: "PL",
    color: "bg-rose-500",
    content: "Bạn có thể giới thiệu mình vào nhóm học không?",
    time: "2 giờ trước",
  },
];

export const blockedUsers: BlockedUser[] = [
  {
    id: 1,
    name: "Nguyễn Văn Spam",
    initials: "NS",
    color: "bg-gray-400",
    blockedAt: "Đã chặn 5 ngày trước",
  },
];

export const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:20",
    content: "Mình gửi đề cương Giải Tích 1 cho cả nhóm nha! Có phần tích phân bội mình note kỹ lắm",
    isMe: false,
    attachment: null,
  },
  {
    id: 2,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:20",
    content: null,
    isMe: false,
    attachment: { name: "De_cuong_Giai_Tich_1.pdf", size: "1.2 MB", type: "PDF" },
  },
  {
    id: 3,
    sender: "Minh Tuấn",
    initials: "MT",
    color: "bg-green-500",
    time: "14:25",
    content: "Cảm ơn Anh nhiều lắm! Mình đang vướng phần này ghê",
    isMe: false,
    attachment: null,
  },
  {
    id: 4,
    sender: "Me",
    initials: "NA",
    color: "bg-primary",
    time: "14:26",
    content: "Mình cũng vậy, tối nay mọi người học nhóm ở thư viện không?",
    isMe: true,
    attachment: null,
  },
  {
    id: 5,
    sender: "Quỳnh Anh",
    initials: "QA",
    color: "bg-purple-500",
    time: "14:30",
    content: "Ok mình đồng ý! 7h tối nha mọi người",
    isMe: false,
    attachment: null,
  },
];

export const groupMembers: Member[] = [
  { initials: "NA", color: "bg-primary",     name: "Nguyễn An (Bạn)",     role: "member", active: true  },
  { initials: "QA", color: "bg-purple-500",  name: "Trần Lê Quỳnh Anh",  role: "admin",  active: true  },
  { initials: "MT", color: "bg-green-500",   name: "Lê Minh Tuấn",        role: "member", active: false },
  { initials: "AT", color: "bg-teal-500",    name: "Phạm Anh Tú",         role: "mod",    active: true  },
  { initials: "HN", color: "bg-pink-500",    name: "Hoàng Ngọc Nhi",      role: "member", active: false },
];

export const allContacts: Contact[] = [
  { initials: "QA", color: "bg-purple-500", name: "Trần Lê Quỳnh Anh", active: true  },
  { initials: "MT", color: "bg-green-500",  name: "Lê Minh Tuấn",      active: false },
  { initials: "AT", color: "bg-teal-500",   name: "Phạm Anh Tú",       active: true  },
  { initials: "HN", color: "bg-pink-500",   name: "Hoàng Ngọc Nhi",    active: true  },
  { initials: "BL", color: "bg-indigo-400", name: "Bùi Thanh Long",    active: false },
  { initials: "TV", color: "bg-amber-500",  name: "Trịnh Xuân Vinh",   active: true  },
  { initials: "PL", color: "bg-rose-500",   name: "Phạm Thị Lan",      active: false },
];

export const sharedImages: SharedImage[] = [
  { id: 1, bg: "bg-gradient-to-br from-blue-200 to-blue-300"    },
  { id: 2, bg: "bg-gradient-to-br from-emerald-200 to-emerald-300" },
  { id: 3, bg: "bg-gradient-to-br from-pink-200 to-pink-300"    },
  { id: 4, bg: "bg-gradient-to-br from-amber-200 to-amber-300"  },
  { id: 5, bg: "bg-gradient-to-br from-violet-200 to-violet-300" },
  { id: 6, bg: "bg-gradient-to-br from-cyan-200 to-cyan-300"    },
];

export const sharedFiles: SharedFile[] = [
  { name: "De_cuong_Giai_Tich_1.pdf", size: "1.2 MB",  type: "PDF", color: "bg-red-500",    date: "Hôm nay"      },
  { name: "Bai_tap_tich_phan.pdf",    size: "840 KB",  type: "PDF", color: "bg-red-500",    date: "Hôm qua"      },
  { name: "Slide_chuong_3.pptx",      size: "3.1 MB",  type: "PPT", color: "bg-orange-500", date: "2 ngày trước" },
  { name: "Ghi_chu_chuong_2.docx",    size: "520 KB",  type: "DOC", color: "bg-blue-500",   date: "3 ngày trước" },
];