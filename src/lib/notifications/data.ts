import { NotifItem } from "./types";

export const initialNotifications: NotifItem[] = [
  {
    id: 1,
    avatars: ["QA", "MT"],
    avatarColors: ["bg-violet-500", "bg-emerald-500"],
    text: "Quỳnh Anh, Minh Tuấn và 6 người khác đã thích bài viết của bạn",
    sub: "Tổng hợp bộ đề thi Hóa hữu cơ các năm 2020–2023",
    createdAt: new Date().toISOString(),
    unread: true,
    type: "like",
    action: null,
  },
  {
    id: 2,
    avatars: ["QA"],
    avatarColors: ["bg-violet-500"],
    text: "Trần Lê Quỳnh Anh đã trả lời bình luận của bạn",
    sub: '"Cảm ơn bạn! Mình cũng vướng phần tích phân bội này..."',
    createdAt: new Date().toISOString(),
    unread: true,
    type: "comment",
    action: null,
  },
  {
    id: 5,
    avatars: [],
    avatarColors: [],
    text: "Bạn được mời vào nhóm Câu lạc bộ Tiếng Anh",
    sub: "Mời bởi Trần Lê Quỳnh Anh · 2,400 thành viên",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    unread: true,
    type: "invite",
    action: { accept: "Chấp nhận", decline: "Từ chối" },
  },
];