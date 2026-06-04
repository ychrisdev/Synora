"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  Eye,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  Flag,
} from "lucide-react";
import { clsx } from "clsx";
import { useSession } from "next-auth/react";
import { FILE_TYPE_COLORS } from "@/lib/library/data";

interface DocItem {
  id: string;
  title: string;
  type: string;
  mimeType?: string;
  pageCount: number | null;
  downloadCount: number;
  fileUrl: string;
  fileSize: number | null;
}

type DocTab = "mine" | "saved";

interface DocumentsTabProps {
  username: string;
  isOwner: boolean;
  refreshKey?: number;
  onDownload?: () => void;
}

function resolveType(doc: DocItem): string {
  const mime = doc.mimeType ?? "";
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("presentationml") || mime.includes("powerpoint"))
    return "PPTX";
  if (mime.includes("wordprocessingml") || mime.includes("msword"))
    return "DOCX";
  if (mime.includes("spreadsheetml") || mime.includes("excel")) return "XLSX";
  return doc.type?.toUpperCase() || "FILE";
}

async function triggerDownload(
  docId: string,
  fileUrl: string,
  filename: string,
  onDownload?: () => void,
) {
  try {
    await fetch(`/api/library/documents/${docId}/download`, { method: "POST" });
    onDownload?.();
  } catch {}
  try {
    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    window.open(fileUrl, "_blank");
  }
}

function DocCard({
  doc,
  initialSaved,
  onDownload,
  onRemove,
}: {
  doc: DocItem;
  initialSaved: boolean;
  onDownload?: () => void;
  onRemove?: (id: string) => void;
}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [toast, setToast] = useState<{
    msg: string;
    type: "save" | "unsave";
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const type = resolveType(doc);
  const typeColor = FILE_TYPE_COLORS[type] ?? "bg-gray-500";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const showToast = (msg: string, type: "save" | "unsave") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleSave = async () => {
    setMenuOpen(false);
    const res = await fetch(`/api/library/documents/${doc.id}/save`, {
      method: "POST",
    });
    const data = await res.json();
    setIsSaved(data.saved);
    showToast(
      data.saved ? "Đã lưu tài liệu" : "Đã bỏ lưu tài liệu",
      data.saved ? "save" : "unsave",
    );
    if (!data.saved) onRemove?.(doc.id);
  };

  const handlePreview = () => {
    const encoded = encodeURIComponent(doc.fileUrl);
    const viewerUrl =
      type === "PPTX" || type === "DOCX"
        ? `https://view.officeapps.live.com/op/view.aspx?src=${encoded}`
        : `https://docs.google.com/viewer?url=${encoded}`;
    window.open(viewerUrl, "_blank");
  };

  const handleDownload = () =>
    triggerDownload(
      doc.id,
      doc.fileUrl,
      `${doc.title}.${type.toLowerCase()}`,
      onDownload,
    );

  return (
    <>
      <div className="bg-white border border-surface-200 rounded-2xl p-3 hover:shadow-sm transition-shadow group">
        <div className="flex items-start gap-2.5">
          <div
            className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[10px] font-bold",
              typeColor,
            )}
          >
            {type.slice(0, 4)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <p className="text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors flex-1">
                {doc.title}
              </p>
              {isLoggedIn && (
                <div ref={menuRef} className="relative shrink-0">
                  <button
                    onClick={() => setMenuOpen((p) => !p)}
                    className="p-0.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-100 transition-colors"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white border border-surface-200 rounded-xl shadow-lg py-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                      <button
                        onClick={handleToggleSave}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-50 hover:text-text-primary transition-colors"
                      >
                        {isSaved ? (
                          <BookmarkCheck size={12} className="text-primary" />
                        ) : (
                          <Bookmark size={12} />
                        )}
                        {isSaved ? "Bỏ lưu" : "Lưu tài liệu"}
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Flag size={12} />
                        Báo cáo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-[10px] text-text-muted mt-0.5">
              {doc.pageCount ? `${doc.pageCount} trang · ` : ""}
              {type}
              {doc.fileSize ? ` · ${(doc.fileSize / 1024).toFixed(0)} KB` : ""}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Download size={9} />
                {doc.downloadCount}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Eye size={12} />
                  Xem trước
                </button>
                <button
                  onClick={handleDownload}
                  aria-label="Tải xuống"
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 bg-text-primary text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          {toast.type === "save" ? (
            <Bookmark size={13} />
          ) : (
            <BookmarkCheck size={13} />
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}

function MyDocsTab({
  username,
  refreshKey,
  onDownload,
}: {
  username: string;
  refreshKey?: number;
  onDownload?: () => void;
}) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/profile/${username}/documents`)
      .then((r) => r.json())
      .then((data) => {
        setDocs(data.docs ?? []);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, refreshKey]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await fetch(
      `/api/profile/${username}/documents?cursor=${nextCursor}`,
    );
    const data = await res.json();
    setDocs((prev) => [...prev, ...(data.docs ?? [])]);
    setNextCursor(data.nextCursor);
  };

  if (loading) return <LoadingSkeleton />;
  if (docs.length === 0)
    return <EmptyDoc message="Chưa có tài liệu nào được đăng." />;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            initialSaved={false}
            onDownload={onDownload}
          />
        ))}
      </div>
      {nextCursor && (
        <button
          onClick={loadMore}
          className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity text-center w-full"
        >
          Tải thêm
        </button>
      )}
    </>
  );
}

function SavedDocsTab({
  username,
  refreshKey,
  onDownload,
}: {
  username: string;
  refreshKey?: number;
  onDownload?: () => void;
}) {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/profile/${username}/saved-documents`)
      .then((r) => r.json())
      .then((data) => {
        setDocs(data.docs ?? []);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username, refreshKey]);

  const loadMore = async () => {
    if (!nextCursor) return;
    const res = await fetch(
      `/api/profile/${username}/saved-documents?cursor=${nextCursor}`,
    );
    const data = await res.json();
    setDocs((prev) => [...prev, ...(data.docs ?? [])]);
    setNextCursor(data.nextCursor);
  };

  if (loading) return <LoadingSkeleton />;
  if (docs.length === 0) return <EmptyDoc message="Chưa lưu tài liệu nào." />;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            initialSaved={true}
            onDownload={onDownload}
            onRemove={(id) =>
              setDocs((prev) => prev.filter((d) => d.id !== id))
            }
          />
        ))}
      </div>
      {nextCursor && (
        <button
          onClick={loadMore}
          className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity text-center w-full"
        >
          Tải thêm
        </button>
      )}
    </>
  );
}

function LoadingSkeleton() {
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

function EmptyDoc({ message }: { message: string }) {
  return (
    <div className="bg-white border border-surface-200 rounded-2xl p-8 text-center">
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
}

export function DocumentsTab({
  username,
  isOwner,
  refreshKey,
  onDownload,
}: DocumentsTabProps) {
  const [activeTab, setActiveTab] = useState<DocTab>("mine");

  const tabs: { key: DocTab; label: string }[] = [
    { key: "mine", label: "Của tôi" },
    { key: "saved", label: "Đã lưu" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white border border-surface-200 rounded-2xl px-1">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative",
                activeTab === tab.key
                  ? "text-primary"
                  : "text-text-muted hover:text-text-primary",
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "mine" && (
        <MyDocsTab
          username={username}
          refreshKey={refreshKey}
          onDownload={onDownload}
        />
      )}
      {activeTab === "saved" &&
        (isOwner ? (
          <SavedDocsTab
            username={username}
            refreshKey={refreshKey}
            onDownload={onDownload}
          />
        ) : (
          <EmptyDoc message="Bạn không có quyền truy cập." />
        ))}
    </div>
  );
}
