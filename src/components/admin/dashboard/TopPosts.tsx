import { Heart, MessageSquare, Share2 } from "lucide-react";

type TopPost = {
  id: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
};

const MOCK_TOP_POSTS: TopPost[] = [
  { id: "1", title: "Chia sẻ bộ đề thi thử THPT Quốc gia 2026", author: "Nguyễn Văn A", likes: 342, comments: 58, shares: 21 },
  { id: "2", title: "Tổng hợp công thức Vật lý 12", author: "Trần Thị B", likes: 289, comments: 41, shares: 15 },
  { id: "3", title: "Kinh nghiệm ôn thi IELTS đạt 7.5", author: "Lê Văn C", likes: 256, comments: 63, shares: 34 },
  { id: "4", title: "Nhóm học Toán online miễn phí", author: "Phạm Thị D", likes: 198, comments: 27, shares: 12 },
  { id: "5", title: "Tài liệu Hóa học lớp 11 đầy đủ", author: "Hoàng Văn E", likes: 176, comments: 19, shares: 8 },
];

export function TopPosts() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">
        Top 5 bài viết nhiều tương tác
      </h3>
      <div className="flex flex-col gap-3">
        {MOCK_TOP_POSTS.map((post, i) => (
          <div key={post.id} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">
                {post.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{post.author}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Heart size={11} /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MessageSquare size={11} /> {post.comments}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Share2 size={11} /> {post.shares}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}