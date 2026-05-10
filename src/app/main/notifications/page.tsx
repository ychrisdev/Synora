"use client";

import { useState } from "react";
import { Settings, CheckCheck, ChevronUp, Bell, Users, ThumbsUp, MessageCircle, FileText, Trophy, Download } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc (18)" },
  { id: "documents", label: "Tài liệu" },
  { id: "groups", label: "Nhóm" },
  { id: "interactions", label: "Tương tác" },
];

const notifications = [
  {
    id: 1,
    group: "HÔM NAY (10)",
    items: [
      {
        id: 1,
        avatars: ["QA", "MT"],
        avatarColors: ["bg-purple-500", "bg-green-500"],
        text: "Quỳnh Anh, Minh Tuấn và 6 người khác đã thích bài viết của bạn",
        sub: "Tổng hợp bộ đề thi Hóa hữu cơ các năm 2020–2023",
        time: "2 phút trước",
        unread: true,
        type: "like",
        action: null,
      },
      {
        id: 2,
        avatars: ["QA"],
        avatarColors: ["bg-purple-500"],
        text: "Trần Lê Quỳnh Anh đã trả lời bình luận của bạn",
        sub: '"Cảm ơn bạn! Mình cũng vướng phần tích phân bội này..."',
        time: "18 phút trước",
        unread: true,
        type: "comment",
        action: null,
      },
      {
        id: 3,
        avatars: ["MT", "LA"],
        avatarColors: ["bg-green-500", "bg-pink-500"],
        text: "Minh Tuấn, Lan Anh và 2 người khác đã bình luận bài đăng của bạn",
        sub: "Slide Kinh tế vĩ mô – Full chương",
        time: "45 phút trước",
        unread: true,
        type: "comment",
        action: null,
      },
      {
        id: 4,
        avatars: [],
        avatarColors: [],
        text: "Tài liệu De_cuong_Giai_Tich_1.pdf vừa đạt mốc 100 lượt tải",
        sub: "Tổng cộng 2,500 lượt tải — Top 5 tài liệu tuần này",
        time: "1 giờ trước",
        unread: true,
        type: "milestone",
        action: null,
      },
      {
        id: 5,
        avatars: [],
        avatarColors: [],
        text: "Bạn được mời vào nhóm Câu lạc bộ Tiếng Anh",
        sub: "Mời bởi Trần Lê Quỳnh Anh — 2,400 thành viên",
        time: "2 giờ trước",
        unread: true,
        type: "invite",
        action: { accept: "Chấp nhận", decline: "Từ chối" },
      },
      {
        id: 6,
        avatars: [],
        avatarColors: [],
        text: "Bài viết của bạn được gắn sao Nổi bật tuần này",
        sub: "Bí kíp IELTS Writing Task 2 — 1,200 lượt xem",
        time: "3 giờ trước",
        unread: false,
        type: "award",
        action: null,
      },
      {
        id: 7,
        avatars: ["TH"],
        avatarColors: ["bg-orange-500"],
        text: "Phạm Thu Hà đã bình luận tài liệu của bạn",
        sub: '"Tài liệu rất chi tiết, cảm ơn bạn nhiều!"',
        time: "4 giờ trước",
        unread: false,
        type: "comment",
        action: null,
      },
    ],
  },
  {
    group: "HÔM QUA (8)",
    items: [
      {
        id: 8,
        avatars: ["NA"],
        avatarColors: ["bg-primary"],
        text: "Nguyễn Đức Tuấn đã chia sẻ tài liệu của bạn",
        sub: "Đề cương Giải Tích 1 chi tiết",
        time: "Hôm qua, 20:15",
        unread: false,
        type: "share",
        action: null,
      },
      {
        id: 9,
        avatars: [],
        avatarColors: [],
        text: "Nhóm Luyện thi THPT Quốc gia vừa đăng tài liệu mới",
        sub: "Đề thi thử môn Toán – Trường THPT Chu Văn An",
        time: "Hôm qua, 18:30",
        unread: false,
        type: "group",
        action: null,
      },
    ],
  },
];

const groupInvitations = [
  { id: 1, name: "Lập trình ReactJS", invitedBy: "Nguyễn Minh Quân", members: "1,240 tv", color: "bg-blue-500", initials: "RJ" },
  { id: 2, name: "CLB Thiết kế đồ họa", invitedBy: "Trần Lê Quỳnh Anh", members: "840 tv", color: "bg-pink-500", initials: "DH" },
  { id: 3, name: "Nhóm Hóa hữu cơ 2k6", invitedBy: "Lê Minh Tuấn", members: "320 tv", color: "bg-orange-500", initials: "HC" },
];

const summary = [
  { label: "Chưa đọc", value: 18, highlight: true },
  { label: "Tương tác hôm nay", value: 34, highlight: false },
  { label: "Lời mời nhóm", value: 3, highlight: false },
  { label: "Lượt tải tài liệu", value: 127, highlight: false },
];

function NotifIcon({ type }: { type: string }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0";
  switch (type) {
    case "like": return <div className={clsx(base, "bg-red-100")}><ThumbsUp size={15} className="text-red-500" /></div>;
    case "comment": return <div className={clsx(base, "bg-blue-100")}><MessageCircle size={15} className="text-blue-500" /></div>;
    case "milestone": return <div className={clsx(base, "bg-orange-100")}><FileText size={15} className="text-orange-500" /></div>;
    case "invite": return <div className={clsx(base, "bg-green-100")}><Users size={15} className="text-green-500" /></div>;
    case "award": return <div className={clsx(base, "bg-yellow-100")}><Trophy size={15} className="text-yellow-500" /></div>;
    case "share": return <div className={clsx(base, "bg-purple-100")}><Download size={15} className="text-purple-500" /></div>;
    case "group": return <div className={clsx(base, "bg-teal-100")}><Users size={15} className="text-teal-500" /></div>;
    default: return <div className={clsx(base, "bg-surface-100")}><Bell size={15} className="text-text-muted" /></div>;
  }
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [accepted, setAccepted] = useState<number[]>([]);
  const [declined, setDeclined] = useState<number[]>([]);

  return (
    <div className="flex gap-5 p-5 max-w-[1100px] mx-auto">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-text-primary">Thông báo</h1>
            <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
              18 chưa đọc
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
              <Settings size={15} />
              Cài đặt
            </button>
            <button className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
              <CheckCheck size={15} />
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-surface-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification groups */}
        <div className="flex flex-col gap-5">
          {notifications.map((group) => (
            <div key={group.group}>
              {/* Group header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-muted tracking-wide">{group.group}</span>
                <button className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
                  Thu gọn <ChevronUp size={13} />
                </button>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-1">
                {group.items.map((notif) => (
                  <div
                    key={notif.id}
                    className={clsx(
                      "flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer",
                      notif.unread
                        ? "bg-primary/5 border-primary/10 hover:bg-primary/10"
                        : "bg-white border-surface-200 hover:bg-surface-50"
                    )}
                  >
                    {/* Icon / Avatars */}
                    <div className="flex items-center shrink-0">
                      {notif.avatars.length > 0 ? (
                        <div className="flex -space-x-2">
                          {notif.avatars.map((av, i) => (
                            <div
                              key={i}
                              className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white", notif.avatarColors[i])}
                            >
                              {av}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <NotifIcon type={notif.type} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary leading-snug">
                        <span className={notif.unread ? "font-semibold" : "font-normal"}>{notif.text}</span>
                      </p>
                      {notif.sub && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">{notif.sub}</p>
                      )}
                      {notif.action && (
                        <div className="flex items-center gap-2 mt-2">
                          {accepted.includes(notif.id) ? (
                            <span className="text-xs text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-lg">✓ Đã chấp nhận</span>
                          ) : declined.includes(notif.id) ? (
                            <span className="text-xs text-text-muted bg-surface-100 px-3 py-1 rounded-lg">Đã từ chối</span>
                          ) : (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setAccepted(p => [...p, notif.id]); }}
                                className="flex items-center gap-1 text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                ✓ {notif.action.accept}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeclined(p => [...p, notif.id]); }}
                                className="flex items-center gap-1 text-xs font-medium text-text-secondary border border-surface-200 px-3 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
                              >
                                ✕ {notif.action.decline}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Time + unread dot */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-text-muted whitespace-nowrap">{notif.time}</span>
                      {notif.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-[260px] shrink-0 flex flex-col gap-4">
        {/* Summary */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">Tóm tắt</h3>
          <div className="flex flex-col gap-2">
            {summary.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-1 border-b border-surface-100 last:border-0">
                <span className="text-sm text-text-secondary">{s.label}</span>
                <span className={clsx("text-sm font-bold", s.highlight ? "text-red-500" : "text-text-primary")}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Group invitations */}
        <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-text-primary">Lời mời nhóm</h3>
            <span className="bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <div className="flex flex-col gap-3">
            {groupInvitations.map((inv) => (
              <div key={inv.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0", inv.color)}>
                    {inv.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{inv.name}</p>
                    <p className="text-[10px] text-text-muted">Mời bởi {inv.invitedBy} · {inv.members}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    Chấp nhận
                  </button>
                  <button className="flex-1 py-1.5 border border-surface-200 text-text-secondary text-xs font-semibold rounded-lg hover:bg-surface-100 transition-colors">
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
