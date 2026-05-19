"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import PostComposer from "@/components/feed/PostComposer";
import type { AttachedFile } from "@/components/feed/PostComposer";
import PostCard, { mapFilesToPostFields } from "@/components/feed/PostCard";
import { SubjectsWidget } from "@/components/profile/widgets/SubjectsWidget";
import { MutualFriendsWidget } from "@/components/profile/widgets/MutualFriendsWidget";
import { SuggestionsWidget } from "@/components/profile/widgets/SuggestionsWidget";
import { RecentDocsWidget } from "@/components/profile/widgets/RecentDocsWidget";
import { posts as initialPosts, PROFILE_TABS, profileData } from "@/lib/profile/data";
import type { ProfileTab } from "@/lib/profile/data";

const PROFILE_AUTHOR = {
  name: profileData.name,
  initials: "QA",
  color: "bg-slate-700",
  role: "Học sinh lớp 12",
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>(PROFILE_TABS[0]);
  const [posts, setPosts] = useState(initialPosts);

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
    setPosts((prev) => [
      {
        id: Date.now(),
        author: PROFILE_AUTHOR,
        time: "Vừa xong",
        content,
        tags,
        images,
        mediaTypes,
        attachment,
        likes: 0,
        comments: 0,
      },
      ...prev,
    ]);
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 pb-12">
      <ProfileHeader />
      <ProfileInfo />
      <ProfileStats />

      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
          <PostComposer onPost={handlePost} />
          <div className="flex flex-col gap-3 mt-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="w-[252px] shrink-0 flex flex-col gap-3">
          <SubjectsWidget />
          <MutualFriendsWidget />
          <SuggestionsWidget />
          <RecentDocsWidget />
        </div>
      </div>
    </div>
  );
}