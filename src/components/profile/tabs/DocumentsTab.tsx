"use client";

import { useState, useEffect } from "react";
import { BookOpen, Download, ExternalLink } from "lucide-react";
import { getViewUrl } from "@/lib/profile/utils";

interface DocItem {
  id: string;
  title: string;
  type: string;
  pageCount: number | null;
  downloadCount: number;
  fileUrl: string;
  fileSize: number | null;
}

export function DocumentsTab({ username }: { username: string }) {
  const [docs, setDocs] = useState<DocItem[]>([]);
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
    const res = await fetch(`/api/profile/${username}/posts?cursor=${nextCursor}`);
    const data = await res.json();
    const more = (data.posts ?? []).flatMap((post: any) =>
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
    setDocs((prev) => [...prev, ...more]);
    setNextCursor(data.nextCursor);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white border border-surface-200 rounded-2xl animate-pulse" />
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
          <div key={doc.id} className="bg-white border border-surface-200 rounded-2xl p-3 hover:shadow-sm transition-shadow group">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={15} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {doc.pageCount ? `${doc.pageCount} trang · ` : ""}{doc.type}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Download size={9} />{doc.downloadCount}
                  </span>
                  <a href={getViewUrl(doc.fileUrl, doc.type)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-medium text-primary border border-primary/25 px-2 py-0.5 rounded-full hover:bg-primary/5 transition-colors">
                    <ExternalLink size={9} />Xem
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {nextCursor && (
        <button onClick={loadMore} className="text-xs text-primary font-medium py-2 hover:opacity-70 transition-opacity text-center">
          Tải thêm →
        </button>
      )}
    </div>
  );
}