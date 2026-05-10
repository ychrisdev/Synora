import PostComposer from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";
import TrendingTopics from "@/components/feed/TrendingTopics";
import FeaturedDocs from "@/components/feed/FeaturedDocs";

const mockPosts = [
  {
    id: 1,
    author: { name: "Trần Lê Quỳnh Anh", initials: "QA", color: "bg-purple-500", role: "Sinh viên năm 2" },
    time: "2 giờ trước",
    content: "Chào mọi người, tuần sau mình có bài kiểm tra giữa kì môn Giải Tích 1. Mình đã làm xong đề cương nhưng có một số câu phần Tích phân bội còn hơi vướng. Có bạn nào rảnh chiều nay ở thư viện không, mình học nhóm chung nhé!",
    tags: ["#GiaiTich1", "#HocNhom", "#TichPhan"],
    attachment: { name: "De_cuong_Giai_Tich_1.pdf", size: "1.2 MB", type: "PDF" },
    likes: 245,
    comments: 34,
  },
  {
    id: 2,
    author: { name: "Nguyễn Văn An", initials: "NA", color: "bg-primary", role: "Học sinh" },
    time: "5 giờ trước",
    content: "Tổng hợp bộ đề thi Hóa hữu cơ các năm từ 2020–2023 có kèm đáp án chi tiết. Mọi người tham khảo nhé, chúc thi tốt!",
    tags: ["#HoaHoc", "#DeThi", "#2k6"],
    attachment: { name: "Tong_hop_de_thi_Hoa_Huu_co_2020_2023.docx", size: "3.5 MB", type: "DOCX" },
    likes: 189,
    comments: 22,
  },
];

export default function FeedPage() {
  return (
    <div className="flex gap-5 p-5 max-w-[1100px] mx-auto">
      {/* Main feed */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <PostComposer />
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Right sidebar */}
      <div className="w-[280px] shrink-0 flex flex-col gap-4">
        <TrendingTopics />
        <FeaturedDocs />
      </div>
    </div>
  );
}
