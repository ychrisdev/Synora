"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PostComposer from "@/components/feed/PostComposer";
import type { AttachedFile } from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";
import { mapFilesToPostFields } from "@/components/feed/PostCard";
import TrendingTopics from "@/components/feed/TrendingTopics";
import WhoToFollow from "@/components/feed/WhoToFollow";

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = {
    name: session?.user?.name ?? "Người dùng",
    username: session?.user?.username ?? "",
    initials: (session?.user?.name ?? "U")
      .split(" ")
      .map((w: string) => w[0])
      .slice(-2)
      .join("")
      .toUpperCase(),
    image: session?.user?.image ?? null,
  };

  useEffect(() => {
    if (session === undefined) return;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const handlePost = async ({
    content,
    tags,
    files,
    uploadedMedia,
    uploadedDocs,
  }: {
    content: string;
    tags: string[];
    files: AttachedFile[];
    uploadedMedia: { url: string; key: string; name: string; type: string }[];
    uploadedDocs: { url: string; key: string; name: string; type: string }[];
  }) => {
    const { images, mediaTypes, attachment } = mapFilesToPostFields(files);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags, uploadedMedia, uploadedDocs }),
    });

    if (!res.ok) return;
    const saved = await res.json();

    const newPost = {
      id: saved.id,
      author: {
        name: currentUser.name,
        initials: currentUser.initials,
        color: "bg-primary",
        role: "",
      },
      time: "Vừa xong",
      content,
      tags,
      images:
        uploadedMedia.length > 0 ? uploadedMedia.map((f) => f.url) : images,
      mediaTypes:
        uploadedMedia.length > 0
          ? uploadedMedia.map((f) =>
              f.type.includes("video") ? "video" : "image",
            )
          : mediaTypes,
      attachment:
        uploadedDocs.length > 0
          ? {
              name: uploadedDocs[0].name,
              size: "",
              type: uploadedDocs[0].type,
              url: uploadedDocs[0].url,
            }
          : attachment,
      likes: 0,
      comments: 0,
    };
    setLocalPosts((prev) => [newPost, ...prev]);
  };

  const mappedPosts = posts.map((p) => {
    console.log("documents:", p.documents);
    const imageDocs = p.documents.filter((d: any) =>
      ["IMAGE"].includes(d.type),
    );
    console.log("imageDocs:", imageDocs);
    const videoDocs = p.documents.filter((d: any) =>
      ["VIDEO"].includes(d.type),
    );
    const fileDocs = p.documents.filter(
      (d: any) => !["IMAGE", "VIDEO"].includes(d.type),
    );

    const mediaDocs = [...imageDocs, ...videoDocs];

    return {
      id: p.id,
      author: {
        name: p.author.profile?.displayName ?? p.author.username ?? "User",
        initials: (p.author.profile?.displayName ?? p.author.username ?? "U")
          .split(" ")
          .map((w: string) => w[0])
          .slice(-2)
          .join("")
          .toUpperCase(),
        color: "bg-primary",
        role: p.author.profile?.major ?? "",
      },
      time: new Date(p.createdAt).toLocaleDateString("vi-VN"),
      content: p.content,
      tags: p.tags.map((t: any) => `#${t.tag.name}`),
      likes: p._count.likes,
      isLikedByMe: Array.isArray(p.likes) && p.likes.length > 0,
      comments: p._count.comments,
      images:
        mediaDocs.length > 0 ? mediaDocs.map((d: any) => d.fileUrl) : undefined,
      mediaTypes:
        mediaDocs.length > 0
          ? mediaDocs.map((d: any) => (d.type === "VIDEO" ? "video" : "image"))
          : undefined,
      attachment:
        fileDocs.length > 0
          ? {
              name: fileDocs[0].title,
              size: "",
              type:
                fileDocs[0].mimeType.split("/").pop()?.toUpperCase() ?? "FILE",
              url: fileDocs[0].fileUrl,
            }
          : undefined,
    };
  });

  return (
    <div className="flex w-full py-5 items-start">
      <div className="flex-1 flex flex-col gap-4 mx-auto max-w-[820px]">
        <PostComposer onPost={handlePost} currentUser={currentUser} />
        {loading ? (
          <div className="text-center text-sm text-slate-400 py-10">
            Đang tải...
          </div>
        ) : [...localPosts, ...mappedPosts].length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-10">
            Chưa có bài viết nào
          </div>
        ) : (
          [...localPosts, ...mappedPosts].map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
      <div className="w-[320px] shrink-0 flex flex-col gap-4">
        <TrendingTopics />
        <WhoToFollow />
      </div>
    </div>
  );
}
