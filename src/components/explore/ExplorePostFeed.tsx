"use client";

import { TrendingUp } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import type { ExplorePost, SortKey } from "@/lib/explore/types";
import { TAG_TO_CATEGORY, TRENDING_POSTS } from "@/lib/explore/data";

interface Props {
  activeTab: string;
  activeSort: SortKey;
  query: string;
}

function sortPosts(posts: ExplorePost[], sort: SortKey): ExplorePost[] {
  const copy = [...posts];
  if (sort === "newest") return copy.sort((a, b) => b.id - a.id);
  if (sort === "rising") return copy.sort((a, b) => (b.comments / (b.likes || 1)) - (a.comments / (a.likes || 1)));
  return copy.sort((a, b) => b.likes - a.likes);
}

function filterPosts(posts: ExplorePost[], tab: string, query: string): ExplorePost[] {
  return posts.filter(post => {
    if (tab !== "Tất cả") {
      const matchesTab = post.tags.some(tag => TAG_TO_CATEGORY[tag] === tab);
      if (!matchesTab) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      return (
        post.content.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q)) ||
        post.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export default function ExplorePostFeed({ activeTab, activeSort, query }: Props) {
  const filtered = filterPosts(TRENDING_POSTS, activeTab, query);
  const sorted = sortPosts(filtered, activeSort);

  return (
    <div className="flex flex-col gap-4">

      {sorted.length > 0 ? (
        sorted.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mb-3">
            <TrendingUp size={22} className="text-text-muted" />
          </div>
          <p className="text-sm font-semibold text-text-primary mb-1">Không có bài viết nào</p>
          <p className="text-xs text-text-muted">Thử chủ đề khác hoặc xóa bộ lọc</p>
        </div>
      )}
    </div>
  );
}