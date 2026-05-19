"use client";

import { useState } from "react";
import {
  MapPin,
  School,
  Globe,
  Calendar,
  Share2,
  MessageCircle,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Download,
  FileText,
  ThumbsUp,
  MessageSquare,
  Star,
  Camera,
} from "lucide-react";
import { clsx } from "clsx";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const profileData = {
  name: "Trần Lê Quỳnh Anh",
  username: "@quynhanh.studynet",
  avatar: "QA",
  avatarColor: "from-violet-500 to-purple-600",
  coverColor: "from-violet-500 via-purple-500 to-indigo-600",
  role: "Học sinh",
  badge: "Top Contributor",
  bio: "Học sinh lớp 12 tại THPT Nguyễn Du. Dam mê Hóa học, Toán học và IELTS. Chia sẻ tài liệu miễn phí cho cộng đồng học sinh Việt Nam. 📚✨",
  school: "THPT Nguyễn Du, Hà Nội",
  location: "Hà Nội, Việt Nam",
  joinDate: "Tham gia tháng 3, 2024",
  website: "studynet.vn/quynhanh",
  stats: {
    followers: "4,812",
    following: 231,
    documents: 47,
    downloads: "28.4k",
    points: "1,250",
  },
  subjects: ["Hóa học", "Toán học", "IELTS", "Vật Lý", "Kinh tế"],
  mutualFriends: [
    { initials: "MT", name: "Lê Minh Tuấn", role: "Học sinh", color: "bg-teal-500" },
    { initials: "TH", name: "Phạm Thu Hà", role: "Sinh viên ĐH Bách Khoa", color: "bg-pink-500" },
    { initials: "AT", name: "Hoàng Anh Tú", role: "Giáo viên IELTS", color: "bg-indigo-500" },
  ],
  suggestions: [
    { initials: "MQ", name: "Nguyễn Minh Quân", role: "Học sinh • 820 follow", color: "bg-violet-500" },
    { initials: "LA", name: "Mai Lan Anh", role: "Học sinh • 1.2k follow", color: "bg-rose-500" },
  ],
};

const posts = [
  {
    id: 1,
    time: "2 giờ trước",
    content: "Mình vừa hoàn thành bộ đề thi thử Hóa hữu cơ cho các bạn 12! Bao gồm đầy đủ 5 chương với lời giải chi tiết. Tải miễn phí bên dưới nhé 🎉",
    file: { name: "De_thi_thu_Hoa_huu_co_2024.pdf", pages: "28 trang", size: "4.2MB" },
    likes: 124,
    comments: 38,
    downloads: 89,
  },
  {
    id: 2,
    time: "1 ngày trước",
    content: "Tips IELTS Writing Task 2 mình đúc kết sau 6 tháng luyện thi. Band 7.5 không khó nếu nắm vững cấu trúc và từ vựng học thuật. Cùng mình ôn nhé! 📝",
    file: { name: "IELTS_Writing_Task2_Tips.pdf", pages: "15 trang", size: "2.8MB" },
    likes: 211,
    comments: 54,
    downloads: 143,
  },
  {
    id: 3,
    time: "3 ngày trước",
    content: "Học bài đêm khuya ai ở đây cùng mình không 🥰 Đang cố gắng xong phần Tích phân bội trước 12h. Cần tập trung cao độ! Chúc các bạn học tốt nhé 💪",
    file: null,
    likes: 87,
    comments: 22,
    downloads: 0,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-text-primary leading-tight">{value}</span>
      <span className="text-xs text-text-muted mt-0.5">{label}</span>
    </div>
  );
}

function PostCard({ post }: { post: (typeof posts)[0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx("w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold shrink-0", profileData.avatarColor)}>
            QA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">{profileData.name}</span>
              <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                Top Contributor
              </span>
            </div>
            <span className="text-xs text-text-muted">{post.time}</span>
          </div>
        </div>
        <button className="p-1.5 hover:bg-surface-100 rounded-full transition-colors">
          <MoreHorizontal size={16} className="text-text-muted" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm text-text-primary leading-relaxed mb-3">{post.content}</p>

      {/* File attachment */}
      {post.file && (
        <div className="flex items-center justify-between bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{post.file.name}</p>
              <p className="text-xs text-text-muted">{post.file.pages} · {post.file.size}</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors">
            <Download size={13} />
            Tải về
          </button>
        </div>
      )}

      {/* Reactions row */}
      <div className="flex items-center justify-between pt-1 pb-3 border-b border-surface-100">
        <div className="flex items-center gap-1">
          <span className="text-xs text-text-muted ml-1">{post.likes} lượt thích</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>{post.comments} bình luận</span>
          {post.downloads > 0 && <span>{post.downloads} lượt tải</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around pt-2">
        {[
          { icon: ThumbsUp, label: "Thích", action: () => setLiked(!liked), active: liked },
          { icon: MessageSquare, label: "Bình luận", action: () => {}, active: false },
          { icon: Share2, label: "Chia sẻ", action: () => {}, active: false },
        ].map(({ icon: Icon, label, action, active }) => (
          <button
            key={label}
            onClick={action}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              active ? "text-primary bg-primary/5" : "text-text-secondary hover:bg-surface-100"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ["Bài đăng", "Tài liệu", "Đã lưu", "Thành tích", "Giới thiệu"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Bài đăng");
  const [following, setFollowing] = useState(false);

  return (
    <div className="max-w-[1100px] mx-auto px-4 pb-12">
      {/* ── Cover + Avatar ── */}
      <div className="relative mb-4">
        {/* Cover */}
        <div className={clsx("h-52 rounded-b-2xl bg-gray-600", profileData.coverColor)} />

        {/* Change cover btn */}
        <button className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/30 hover:bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors">
          <Camera size={12} />
          Đổi ảnh bìa
        </button>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-8">
          <div className="relative">
            <div className={clsx("w-24 h-24 rounded-full bg-gray-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg", profileData.avatarColor)}>
              {profileData.avatar}
            </div>
            <button className="absolute bottom-1 right-1 w-7 h-7 bg-surface-100 border-2 border-white rounded-full flex items-center justify-center hover:bg-surface-200 transition-colors">
              <Camera size={12} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Profile Info Row ── */}
      <div className="flex items-start justify-between mt-14 mb-5 px-2">
        {/* Left: name + meta */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-bold text-text-primary">{profileData.name}</h1>
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              Top Contributor
            </span>
          </div>
          <p className="text-sm text-text-muted mb-3">{profileData.username}</p>
          <p className="text-sm text-text-primary max-w-[520px] leading-relaxed mb-3">{profileData.bio}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1"><School size={13} />{profileData.school}</span>
            <span className="flex items-center gap-1"><MapPin size={13} />{profileData.location}</span>
            <span className="flex items-center gap-1"><Calendar size={13} />{profileData.joinDate}</span>
            <span className="flex items-center gap-1 text-primary"><Globe size={13} />{profileData.website}</span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <button className="flex items-center gap-1.5 border border-surface-200 text-text-secondary text-sm font-medium px-3 py-2 rounded-lg hover:bg-surface-100 transition-colors">
            <Share2 size={14} />
            Chia sẻ
          </button>
          <button className="flex items-center gap-1.5 border border-surface-200 text-text-secondary text-sm font-medium px-3 py-2 rounded-lg hover:bg-surface-100 transition-colors">
            <MessageCircle size={14} />
            Nhắn tin
          </button>
          <button
            onClick={() => setFollowing(!following)}
            className={clsx(
              "flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors",
              following
                ? "bg-surface-100 text-text-secondary hover:bg-surface-200"
                : "bg-primary text-white hover:bg-primary-700"
            )}
          >
            {following ? <><UserCheck size={14} /> Đang theo dõi</> : <><UserPlus size={14} /> Theo dõi</>}
          </button>
          <button className="p-2 border border-surface-200 rounded-lg hover:bg-surface-100 transition-colors">
            <MoreHorizontal size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white border border-surface-200 rounded-2xl px-6 py-4 mb-6 flex items-center justify-around">
        <StatItem value={profileData.stats.followers} label="Người theo dõi" />
        <div className="w-px h-8 bg-surface-200" />
        <StatItem value={profileData.stats.following} label="Đang theo dõi" />
        <div className="w-px h-8 bg-surface-200" />
        <StatItem value={profileData.stats.documents} label="Tài liệu" />
        <div className="w-px h-8 bg-surface-200" />
        <StatItem value={profileData.stats.downloads} label="Lượt tải" />
        <div className="w-px h-8 bg-surface-200" />
        <div className="flex items-center gap-1.5">
          <StatItem value={profileData.stats.points} label="Điểm chia sẻ" />
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="flex gap-5">
        {/* Left column: tabs + posts */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="bg-white border border-surface-200 rounded-2xl mb-4 px-2">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "flex-1 py-3.5 text-sm font-medium transition-colors relative",
                    activeTab === tab
                      ? "text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right column: sidebar panels */}
        <div className="w-[280px] shrink-0 flex flex-col gap-4">
          {/* Subjects */}
          <div className="bg-white border border-surface-200 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Môn học</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.subjects.map((s) => (
                <span
                  key={s}
                  className="text-xs font-medium bg-surface-100 text-text-secondary px-3 py-1.5 rounded-full hover:bg-surface-200 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Mutual friends */}
          <div className="bg-white border border-surface-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Bạn bè chung</h3>
              <span className="text-xs text-text-muted">12 người</span>
            </div>
            <div className="flex flex-col gap-2">
              {profileData.mutualFriends.map((f) => (
                <div key={f.name} className="flex items-center gap-2.5">
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", f.color)}>
                    {f.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{f.name}</p>
                    <p className="text-[10px] text-text-muted">{f.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-xs font-medium text-primary hover:text-primary-700 text-center transition-colors">
              Xem tất cả
            </button>
          </div>

          {/* Suggestions */}
          <div className="bg-white border border-surface-200 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Có thể bạn biết</h3>
            <div className="flex flex-col gap-3">
              {profileData.suggestions.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5">
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", s.color)}>
                    {s.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{s.name}</p>
                    <p className="text-[10px] text-text-muted">{s.role}</p>
                  </div>
                  <button className="text-[11px] font-semibold text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary/5 transition-colors shrink-0">
                    Theo dõi
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Documents quick access */}
          <div className="bg-white border border-surface-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">Tài liệu gần đây</h3>
              <button className="text-xs text-primary font-medium flex items-center gap-0.5 hover:text-primary-700">
                Tất cả
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: "Hóa hữu cơ 2024", size: "4.2MB"},
                { name: "IELTS Writing Tips", size: "2.8MB"},
                { name: "Tích phân - Giải tích", size: "3.1MB"},
              ].map((doc) => (
                <div key={doc.name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-50 cursor-pointer group transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{doc.name}</p>
                    <p className="text-[10px] text-text-muted">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}