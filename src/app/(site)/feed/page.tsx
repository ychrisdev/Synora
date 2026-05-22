"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import PostComposer from "@/components/feed/PostComposer";
import type { AttachedFile } from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";
import { mapFilesToPostFields } from "@/components/feed/PostCard";
import TrendingTopics from "@/components/feed/TrendingTopics";
import WhoToFollow from "@/components/feed/WhoToFollow";

const INITIAL_POSTS = [
  {
    id: 1,
    author: {
      name: "Trần Lê Quỳnh Anh",
      initials: "QA",
      color: "bg-purple-500",
      role: "Sinh viên năm 2",
    },
    time: "2 giờ trước",
    content:
      "Chào mọi người, tuần sau mình có bài kiểm tra giữa kì môn Giải Tích 1. Mình đã làm xong đề cương nhưng có một số câu phần Tích phân bội còn hơi vướng. Có bạn nào rảnh chiều nay ở thư viện không, mình học nhóm chung nhé!",
    tags: ["#GiaiTich1", "#HocNhom", "#TichPhan"],
    attachment: {
      name: "De_cuong_Giai_Tich_1.pdf",
      size: "1.2 MB",
      type: "PDF",
    },
    likes: 245,
    comments: 34,
  },
  {
    id: 2,
    author: {
      name: "Nguyễn Văn An",
      initials: "NA",
      color: "bg-primary",
      role: "Học sinh",
    },
    time: "5 giờ trước",
    content:
      "Tổng hợp bộ đề thi Hóa hữu cơ các năm từ 2020–2023 có kèm đáp án chi tiết. Mọi người tham khảo nhé, chúc thi tốt!",
    tags: ["#HoaHoc", "#DeThi", "#2k6"],
    attachment: {
      name: "Tong_hop_de_thi_Hoa_Huu_co_2020_2023.docx",
      size: "3.5 MB",
      type: "DOCX",
    },
    likes: 189,
    comments: 22,
  },
];

export default function FeedPage() {
  const { data: session } = useSession();
  const currentUser = {
    name: session?.user?.name ?? "Người dùng",
    username: session?.user?.username ?? "",
    initials: (session?.user?.name ?? "U")
      .split(" ").map((w: string) => w[0]).slice(-2).join("").toUpperCase(),
    image: session?.user?.image ?? null,
  };
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const handlePost = ({
    content,
    tags,
    files,
  }: {
    content: string;
    tags: string[];
    files: AttachedFile[];
  }) => {
    const { images, mediaTypes, attachment } = mapFilesToPostFields(files);
    const newPost = {
      id: Date.now(),
      author: {
      name: currentUser.name,
      initials: currentUser.initials,
      color: "bg-primary",
      role: "",
    },
      time: "Vừa xong",
      content,
      tags,
      images,
      mediaTypes,
      attachment,
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="flex w-full py-5 items-start">
      <div className="flex-1 flex flex-col gap-4 mx-auto max-w-[820px]">
        <PostComposer onPost={handlePost} currentUser={currentUser} />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="w-[320px] shrink-0 flex flex-col gap-4">
        <TrendingTopics />
        <WhoToFollow />
      </div>
    </div>
  );
}