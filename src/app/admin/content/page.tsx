"use client";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ContentTabs, type ContentTabKey } from "@/components/admin/content/ContentTabs";
import { ContentFilters, type ContentFilterState } from "@/components/admin/content/ContentFilters";
import { PostsTable } from "@/components/admin/content/PostsTable";
import { CommentsTable } from "@/components/admin/content/CommentsTable";
import { MediaGrid } from "@/components/admin/content/MediaGrid";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { EyeOff, Eye, Trash2 } from "lucide-react";
import type { AdminPostRow, AdminCommentRow, AdminMediaRow } from "@/lib/content/types";

const MOCK_POSTS: AdminPostRow[] = [
  { id: "p1", author: { name: "Nguyễn Văn A", username: "nva123", avatarUrl: null }, excerpt: "Chia sẻ tài liệu ôn thi giữa kỳ môn Giải tích...", imageCount: 2, commentCount: 14, likeCount: 56, reportCount: 2, status: "VISIBLE", createdAt: "07/07/2026" },
  { id: "p2", author: { name: "Lê Văn C", username: "lvc2003", avatarUrl: null }, excerpt: "Nội dung spam quảng cáo khóa học không liên quan...", imageCount: 0, commentCount: 3, likeCount: 1, reportCount: 8, status: "HIDDEN", createdAt: "05/07/2026" },
  { id: "p3", author: { name: "Phạm Thị D", username: "ptd_studio", avatarUrl: null }, excerpt: "Ảnh nhóm sinh hoạt CLB cuối tuần vừa rồi rất vui!", imageCount: 5, commentCount: 22, likeCount: 130, reportCount: 0, status: "VISIBLE", createdAt: "03/07/2026" },
];

const MOCK_COMMENTS: AdminCommentRow[] = [
  { id: "c1", author: { name: "Hoàng Văn E", username: "hoangv", avatarUrl: null }, content: "Bài viết vô căn cứ, xóa giúp mình!!!", postExcerpt: "Chia sẻ tài liệu ôn thi giữa kỳ môn Giải tích...", reportCount: 1, status: "VISIBLE", createdAt: "07/07/2026" },
  { id: "c2", author: { name: "Trần Thị B", username: "ttb", avatarUrl: null }, content: "Ngôn từ xúc phạm, đã báo cáo quản trị viên.", postExcerpt: "Ảnh nhóm sinh hoạt CLB cuối tuần vừa rồi rất vui!", reportCount: 4, status: "HIDDEN", createdAt: "04/07/2026" },
];

const MOCK_MEDIA: AdminMediaRow[] = [
  { id: "m1", url: "https://placehold.co/300x300", type: "IMAGE", author: { name: "Phạm Thị D", username: "ptd_studio", avatarUrl: null }, postExcerpt: "Ảnh nhóm sinh hoạt CLB", status: "VISIBLE", createdAt: "03/07/2026" },
  { id: "m2", url: "https://placehold.co/300x300", type: "VIDEO", author: { name: "Nguyễn Văn A", username: "nva123", avatarUrl: null }, postExcerpt: "Video hướng dẫn giải tích", status: "VISIBLE", createdAt: "07/07/2026" },
];

type ConfirmState =
  | { kind: "hide-post"; item: AdminPostRow }
  | { kind: "hide-comment"; item: AdminCommentRow }
  | { kind: "hide-media"; item: AdminMediaRow }
  | { kind: "delete-post"; item: AdminPostRow }
  | { kind: "delete-comment"; item: AdminCommentRow }
  | { kind: "delete-media"; item: AdminMediaRow }
  | null;

export default function AdminContentPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<ContentTabKey>("posts");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [media, setMedia] = useState(MOCK_MEDIA);
  const [filters, setFilters] = useState<ContentFilterState>({ query: "", status: "ALL", onlyReported: false });
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    const q = filters.query.toLowerCase();
    return posts.filter(
      (p) =>
        (!q || p.excerpt.toLowerCase().includes(q) || p.author.username.toLowerCase().includes(q)) &&
        (filters.status === "ALL" || p.status === filters.status) &&
        (!filters.onlyReported || p.reportCount > 0),
    );
  }, [posts, filters]);

  const filteredComments = useMemo(() => {
    const q = filters.query.toLowerCase();
    return comments.filter(
      (c) =>
        (!q || c.content.toLowerCase().includes(q) || c.author.username.toLowerCase().includes(q)) &&
        (filters.status === "ALL" || c.status === filters.status) &&
        (!filters.onlyReported || c.reportCount > 0),
    );
  }, [comments, filters]);

  const filteredMedia = useMemo(() => {
    const q = filters.query.toLowerCase();
    return media.filter(
      (m) =>
        (!q || m.author.username.toLowerCase().includes(q)) &&
        (filters.status === "ALL" || m.status === filters.status),
    );
  }, [media, filters]);

  const searchPlaceholder =
    tab === "posts" ? "Tìm theo nội dung, tác giả..." : tab === "comments" ? "Tìm theo nội dung bình luận..." : "Tìm theo tác giả...";

  const handleConfirm = async () => {
    if (!confirmState) return;
    setConfirmLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      switch (confirmState.kind) {
        case "hide-post": {
          const nextStatus = confirmState.item.status === "VISIBLE" ? "HIDDEN" : "VISIBLE";
          setPosts((prev) => prev.map((p) => (p.id === confirmState.item.id ? { ...p, status: nextStatus } : p)));
          showToast(nextStatus === "HIDDEN" ? "Đã ẩn bài viết" : "Đã bỏ ẩn bài viết", "success");
          break;
        }
        case "hide-comment": {
          const nextStatus = confirmState.item.status === "VISIBLE" ? "HIDDEN" : "VISIBLE";
          setComments((prev) => prev.map((c) => (c.id === confirmState.item.id ? { ...c, status: nextStatus } : c)));
          showToast(nextStatus === "HIDDEN" ? "Đã ẩn bình luận" : "Đã bỏ ẩn bình luận", "success");
          break;
        }
        case "hide-media": {
          const nextStatus = confirmState.item.status === "VISIBLE" ? "HIDDEN" : "VISIBLE";
          setMedia((prev) => prev.map((m) => (m.id === confirmState.item.id ? { ...m, status: nextStatus } : m)));
          showToast(nextStatus === "HIDDEN" ? "Đã ẩn media" : "Đã bỏ ẩn media", "success");
          break;
        }
        case "delete-post":
          setPosts((prev) => prev.filter((p) => p.id !== confirmState.item.id));
          showToast("Đã xóa bài viết", "success");
          break;
        case "delete-comment":
          setComments((prev) => prev.filter((c) => c.id !== confirmState.item.id));
          showToast("Đã xóa bình luận", "success");
          break;
        case "delete-media":
          setMedia((prev) => prev.filter((m) => m.id !== confirmState.item.id));
          showToast("Đã xóa media", "success");
          break;
      }
    } finally {
      setConfirmLoading(false);
      setConfirmState(null);
    }
  };

  const isDelete = confirmState?.kind.startsWith("delete");
  const isUnhide =
    confirmState?.kind === "hide-post"
      ? confirmState.item.status === "HIDDEN"
      : confirmState?.kind === "hide-comment"
        ? confirmState.item.status === "HIDDEN"
        : confirmState?.kind === "hide-media"
          ? confirmState.item.status === "HIDDEN"
          : false;

  return (
    <>
      <PageHeader
        title="Quản lý nội dung"
        description="Quản lý bài viết, bình luận và media trên toàn hệ thống"
      />

      <ContentTabs
        value={tab}
        onChange={setTab}
        counts={{ posts: posts.length, comments: comments.length, media: media.length }}
      />

      <ContentFilters value={filters} onChange={setFilters} searchPlaceholder={searchPlaceholder} />

      {tab === "posts" && (
        <PostsTable
          posts={filteredPosts}
          onViewDetail={() => {}}
          onToggleVisibility={(p) => setConfirmState({ kind: "hide-post", item: p })}
          onDelete={(p) => setConfirmState({ kind: "delete-post", item: p })}
        />
      )}
      {tab === "comments" && (
        <CommentsTable
          comments={filteredComments}
          onToggleVisibility={(c) => setConfirmState({ kind: "hide-comment", item: c })}
          onDelete={(c) => setConfirmState({ kind: "delete-comment", item: c })}
        />
      )}
      {tab === "media" && (
        <MediaGrid
          items={filteredMedia}
          onToggleVisibility={(m) => setConfirmState({ kind: "hide-media", item: m })}
          onDelete={(m) => setConfirmState({ kind: "delete-media", item: m })}
        />
      )}

      {confirmState && (
        <ConfirmDialog
          icon={
            isDelete ? (
              <Trash2 size={20} className="text-red-500" />
            ) : isUnhide ? (
              <Eye size={20} className="text-emerald-500" />
            ) : (
              <EyeOff size={20} className="text-amber-500" />
            )
          }
          iconBgClass={isDelete ? "bg-red-100" : isUnhide ? "bg-emerald-100" : "bg-amber-100"}
          title={isDelete ? "Xóa nội dung vĩnh viễn?" : isUnhide ? "Bỏ ẩn nội dung?" : "Ẩn nội dung này?"}
          description="Hành động này sẽ áp dụng ngay lập tức và người dùng khác sẽ nhận thấy thay đổi."
          confirmLabel={isDelete ? "Xóa vĩnh viễn" : isUnhide ? "Bỏ ẩn" : "Ẩn nội dung"}
          confirmVariant={isDelete ? "danger" : "primary"}
          loading={confirmLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </>
  );
}