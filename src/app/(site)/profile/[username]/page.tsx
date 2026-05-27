"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import PostComposer from "@/components/feed/PostComposer";
import type { AttachedFile } from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";
import { SubjectsWidget } from "@/components/profile/widgets/SubjectsWidget";
import { FriendsWidget } from "@/components/profile/widgets/FriendsWidget";
import { SuggestionsWidget } from "@/components/profile/widgets/SuggestionsWidget";
import { RecentDocsWidget } from "@/components/profile/widgets/RecentDocsWidget";
import { PROFILE_TABS } from "@/lib/profile/data";
import type { ProfileTab } from "@/lib/profile/data";
import { clsx } from "clsx";
import NextLink from "next/link";
import {
  BookOpen,
  Download,
  ExternalLink,
  MapPin,
  Globe,
  School,
  Calendar,
  X,
} from "lucide-react";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

function mapApiPostToCard(post: any) {
  const displayName =
    post.author?.profile?.displayName ?? post.author?.username ?? "User";

  const mediaDocs = (post.documents ?? []).filter(
    (d: any) => d.type === "IMAGE" || d.type === "VIDEO",
  );
  const images = mediaDocs.map((d: any) => d.fileUrl);
  const mediaTypes = mediaDocs.map((d: any) =>
    d.type === "VIDEO" ? "video" : "image",
  );

  const attachmentDoc = (post.documents ?? []).find(
    (d: any) => d.type !== "IMAGE" && d.type !== "VIDEO",
  );
  const attachment = attachmentDoc
    ? {
        name: attachmentDoc.title ?? attachmentDoc.fileUrl.split("/").pop(),
        size: attachmentDoc.fileSize
          ? `${(attachmentDoc.fileSize / 1024).toFixed(1)} KB`
          : "",
        type: attachmentDoc.type,
        url: attachmentDoc.fileUrl,
      }
    : undefined;

  return {
    id: post.id,
    authorId: post.authorId,
    author: {
      name: displayName,
      initials: displayName
        .split(" ")
        .map((w: string) => w[0])
        .slice(-2)
        .join("")
        .toUpperCase(),
      color: "bg-primary",
      role: post.author?.role ?? "",
      username: post.author?.username,
      avatarUrl: post.author?.profile?.avatarUrl ?? null,
    },
    time: new Date(post.createdAt).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    content: post.content,
    tags: (post.tags ?? []).map((t: any) => t.tag?.name ?? ""),
    likes: post._count?.likes ?? 0,
    comments: post._count?.comments ?? 0,
    isLikedByMe: Array.isArray(post.likes) && post.likes.length > 0,
    images: images.length ? images : undefined,
    mediaTypes: mediaTypes.length ? mediaTypes : undefined,
    attachment,
  };
}

const SUGGEST_COLORS = [
  "bg-violet-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-amber-500",
  "bg-cyan-600",
];

function FriendSuggestPanel({
  username,
  onClose,
}: {
  username: string;
  onClose: () => void;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profile/${username}/friends`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.friends ?? [];
        setSuggestions(list);
        setFollowingIds(
          new Set(
            list.filter((f: any) => f.isFollowingBack).map((f: any) => f.id),
          ),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const handleFollow = async (friendUsername: string, friendId: string) => {
    const res = await fetch(`/api/profile/${friendUsername}/follow`, {
      method: "POST",
    });
    const data = await res.json();
    setFollowingIds((prev) => {
      const next = new Set(prev);
      data.following ? next.add(friendId) : next.delete(friendId);
      return next;
    });
  };

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary">
          Gợi ý kết bạn
        </h3>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-16 bg-surface-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-[11px] text-text-muted text-center py-3">
          Chưa có gợi ý nào.
        </p>
      ) : (
        <div className="flex gap-3 flex-wrap">
          {suggestions.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center gap-2.5 bg-surface-50 border border-surface-200 rounded-xl px-3 py-2.5 min-w-[200px] flex-1"
            >
              <NextLink
                href={`/profile/${s.username}`}
                className="flex items-center gap-2.5 flex-1 min-w-0"
              >
                {s.avatarUrl ? (
                  <img
                    src={s.avatarUrl}
                    alt={s.displayName}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0",
                      SUGGEST_COLORS[i % SUGGEST_COLORS.length],
                    )}
                  >
                    {s.displayName
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(-2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {s.displayName}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {s.followerCount.toLocaleString("vi-VN")} người theo dõi
                  </p>
                </div>
              </NextLink>
              <button
                onClick={() => handleFollow(s.username, s.id)}
                className={clsx(
                  "shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors",
                  followingIds.has(s.id)
                    ? "text-text-secondary border-surface-200 bg-white hover:bg-surface-100"
                    : "text-primary border-primary/25 hover:bg-primary/5",
                )}
              >
                {followingIds.has(s.id) ? "Đang theo dõi" : "Kết bạn"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImagesTab({ username }: { username: string }) {
  const [images, setImages] = useState<{ id: string; fileUrl: string; title: string; postId: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${username}/posts`)
      .then((r) => r.json())
      .then((data) => {
        const imgs = (data.posts ?? []).flatMap((post: any) =>
          (post.documents ?? [])
            .filter((d: any) => d.type === "IMAGE" || d.type === "VIDEO")
            .map((d: any) => ({
              id: d.id,
              fileUrl: d.fileUrl,
              title: d.title,
              postId: post.id,
              type: d.type,
            })),
        );
        setImages(imgs);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await fetch(
      `/api/profile/${username}/posts?cursor=${nextCursor}`,
    );
    const data = await res.json();
    const moreImgs = (data.posts ?? []).flatMap((post: any) =>
      (post.documents ?? [])
        .filter((d: any) => d.type === "IMAGE" || d.type === "VIDEO")
        .map((d: any) => ({
          id: d.id,
          fileUrl: d.fileUrl,
          title: d.title,
          postId: post.id,
          type: d.type,
        })),
    );
    setImages((prev) => [...prev, ...moreImgs]);
    setNextCursor(data.nextCursor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-white border border-surface-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white border border-surface-200 rounded-2xl p-8 text-center">
        <p className="text-text-muted text-sm">Chưa có hình ảnh nào.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((img) =>
          img.type === "VIDEO" ? (
            <div
              key={img.id}
              className="aspect-square rounded-2xl overflow-hidden bg-black block group relative"
            >
              <video
                src={img.fileUrl}
                muted
                preload="metadata"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : (
            <a
              key={img.id}
              href={img.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-2xl overflow-hidden bg-surface-100 block group"
            >
              <img
                src={img.fileUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </a>
          ),
        )}
      </div>
      {nextCursor && (
        <button
          onClick={loadMore}
          className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity text-center"
        >
          Tải thêm →
        </button>
      )}
    </div>
  );
}

function getViewUrl(fileUrl: string, type: string): string {
  const docTypes = [
    "PDF",
    "DOC",
    "DOCX",
    "PPT",
    "PPTX",
    "XLS",
    "XLSX",
    "OTHER",
  ];
  if (docTypes.includes(type.toUpperCase())) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`;
  }
  return fileUrl;
}

function DocumentsTab({ username }: { username: string }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/profile/${username}/posts`)
      .then((r) => r.json())
      .then((data) => {
        const allDocs = (data.posts ?? []).flatMap((post: any) =>
          (post.documents ?? [])
            .filter((d: any) => d.type !== "IMAGE" && d.type !== "VIDEO")
            .map((d: any) => ({
              id: d.id,
              title: d.title ?? d.fileUrl.split("/").pop(),
              type: d.type,
              pageCount: d.pageCount ?? null,
              downloadCount: d.downloadCount ?? 0,
              fileUrl: d.fileUrl,
              fileSize: d.fileSize ?? null,
            })),
        );
        setDocs(allDocs);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await fetch(
      `/api/profile/${username}/posts?cursor=${nextCursor}`,
    );
    const data = await res.json();
    const moreDocs = (data.posts ?? []).flatMap((post: any) =>
      (post.documents ?? [])
        .filter((d: any) => d.type !== "IMAGE" && d.type !== "VIDEO")
        .map((d: any) => ({
          id: d.id,
          title: d.title ?? d.fileUrl.split("/").pop(),
          type: d.type,
          pageCount: d.pageCount ?? null,
          downloadCount: d.downloadCount ?? 0,
          fileUrl: d.fileUrl,
          fileSize: d.fileSize ?? null,
        })),
    );
    setDocs((prev) => [...prev, ...moreDocs]);
    setNextCursor(data.nextCursor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-white border border-surface-200 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="bg-white border border-surface-200 rounded-2xl p-8 text-center">
        <p className="text-text-muted text-sm">Chưa có tài liệu nào.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-surface-200 rounded-2xl p-3 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={15} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {doc.pageCount ? `${doc.pageCount} trang · ` : ""}
                  {doc.type}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Download size={9} />
                    {doc.downloadCount}
                  </span>
                  <a
                    href={getViewUrl(doc.fileUrl, doc.type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-medium text-primary border border-primary/25 px-2 py-0.5 rounded-full hover:bg-primary/5 transition-colors"
                  >
                    <ExternalLink size={9} />
                    Xem
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {nextCursor && (
        <button
          onClick={loadMore}
          className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity text-center"
        >
          Tải thêm →
        </button>
      )}
    </div>
  );
}

function AboutTab({ profile, createdAt }: { profile: any; createdAt: string }) {
  const items = [
    profile?.school && { icon: <School size={14} />, label: profile.school },
    profile?.location && {
      icon: <MapPin size={14} />,
      label: profile.location,
    },
    profile?.website && {
      icon: <Globe size={14} />,
      label: profile.website,
      href: profile.website.startsWith("http")
        ? profile.website
        : `https://${profile.website}`,
    },
    { icon: <Calendar size={14} />, label: `Tham gia ${createdAt}` },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    href?: string;
  }[];

  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-5">
      {profile?.bio && (
        <div className="mb-4 pb-4 border-b border-surface-100">
          <p className="text-sm text-text-primary leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-sm text-text-secondary"
          >
            <span className="shrink-0 text-text-muted">{item.icon}</span>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {item.label}
              </a>
            ) : (
              <span className="truncate">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>(PROFILE_TABS[0]);
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showSuggest, setShowSuggest] = useState(false);

  const isOwner = session?.user?.username === username;

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`/api/profile/${username}`)
      .then((r) => r.json())
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!username || activeTab !== "Bài đăng") return;
    setPostsLoading(true);
    fetch(`/api/profile/${username}/posts`)
      .then((r) => r.json())
      .then((data) => {
        setPosts((data.posts ?? []).map(mapApiPostToCard));
        setNextCursor(data.nextCursor);
        setPostsLoading(false);
      })
      .catch(() => setPostsLoading(false));
  }, [username, activeTab]);

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
    uploadedMedia: {
      url: string;
      key: string;
      name: string;
      type: string;
      size: number;
    }[];
    uploadedDocs: {
      url: string;
      key: string;
      name: string;
      type: string;
      size: number;
    }[];
  }) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, tags, uploadedMedia, uploadedDocs }),
    });
    if (res.ok) {
      const newPost = await res.json();
      setPosts((prev) => [mapApiPostToCard(newPost), ...prev]);
    }
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await fetch(
      `/api/profile/${username}/posts?cursor=${nextCursor}`,
    );
    const data = await res.json();
    setPosts((prev) => [...prev, ...(data.posts ?? []).map(mapApiPostToCard)]);
    setNextCursor(data.nextCursor);
  };

  if (loading) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 pb-12 pt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-surface-100 rounded-2xl" />
          <div className="h-6 w-48 bg-surface-100 rounded" />
          <div className="h-4 w-72 bg-surface-100 rounded" />
        </div>
      </div>
    );
  }

  if (!profileData || profileData.error) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 pb-12 pt-20 text-center">
        <p className="text-text-muted text-sm">
          Không tìm thấy người dùng này.
        </p>
      </div>
    );
  }

  const stats = {
    followers: formatCount(profileData.stats.followers),
    following: profileData.stats.following,
    documents: profileData.stats.documents,
    downloads: formatCount(profileData.stats.downloads),
  };

  const joinDate = new Date(profileData.createdAt).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-[1080px] mx-auto px-4 pb-12">
      <ProfileHeader
        coverUrl={profileData.profile?.coverUrl}
        avatarUrl={profileData.profile?.avatarUrl}
        displayName={profileData.profile?.displayName ?? profileData.username}
        username={username}
        isOwner={isOwner}
        isFollowing={profileData.isFollowing}
        onSuggestOpen={() => setShowSuggest((p) => !p)}
      />

      {showSuggest && isOwner && (
        <FriendSuggestPanel
          username={username}
          onClose={() => setShowSuggest(false)}
        />
      )}

      <ProfileInfo
        displayName={profileData.profile?.displayName ?? profileData.username}
        username={profileData.username}
        bio={profileData.profile?.bio}
        school={profileData.profile?.school}
        location={profileData.profile?.location}
        website={profileData.profile?.website}
        joinDate={joinDate}
      />
      <ProfileStats stats={stats} />

      <div className="flex gap-5">
        <div className="flex-1 min-w-0">
          <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "Bài đăng" && (
            <>
              {isOwner && <PostComposer onPost={handlePost} />}
              <div className="flex flex-col gap-3 mt-3">
                {postsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-white border border-surface-200 rounded-2xl animate-pulse"
                    />
                  ))
                ) : posts.length === 0 ? (
                  <div className="bg-white border border-surface-200 rounded-2xl p-8 text-center">
                    <p className="text-text-muted text-sm">
                      Chưa có bài đăng nào.
                    </p>
                  </div>
                ) : (
                  posts.map((post) => <PostCard key={post.id} post={post} />)
                )}
                {nextCursor && (
                  <button
                    onClick={loadMore}
                    className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity"
                  >
                    Tải thêm →
                  </button>
                )}
              </div>
            </>
          )}

          {activeTab === "Hình ảnh" && (
            <div className="mt-3">
              <ImagesTab username={username} />
            </div>
          )}

          {activeTab === "Tài liệu" && (
            <div className="mt-3">
              <DocumentsTab username={username} />
            </div>
          )}

          {activeTab === "Bài viết đã lưu" && (
            <div className="mt-3 bg-white border border-surface-200 rounded-2xl p-8 text-center">
              <p className="text-text-muted text-sm">
                {isOwner
                  ? "Bạn chưa lưu bài viết nào."
                  : "Mục này chỉ hiển thị với chủ trang."}
              </p>
            </div>
          )}

          {activeTab === "Giới thiệu" && (
            <div className="mt-3">
              <AboutTab profile={profileData.profile} createdAt={joinDate} />
            </div>
          )}
        </div>

        <div className="w-[252px] shrink-0 flex flex-col gap-3">
          <SubjectsWidget subjects={profileData.subjects} />
          <FriendsWidget username={username} />
          <SuggestionsWidget username={username} />
          <RecentDocsWidget docs={profileData.recentDocs} username={username} />
        </div>
      </div>
    </div>
  );
}
