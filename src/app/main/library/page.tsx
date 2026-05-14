"use client";

import { useState, useMemo } from "react";
import { DOCUMENTS } from "@/lib/library/data";
import type { SortKey, ViewMode, Document } from "@/lib/library/types";
import LibraryFilters from "@/components/library/LibraryFilters";
import DocumentCard from "@/components/library/DocumentCard";
import EmptyState from "@/components/library/EmptyState";
import FeaturedDocsWidget from "@/components/library/widgets/FeaturedDocsWidget";
import StatsWidget from "@/components/library/widgets/StatsWidget";
import DocumentPreviewModal from "@/components/library/DocumentPreviewModal";
import UploadDocumentModal from "@/components/library/UploadDocumentModal";

export default function LibraryPage() {
  const [activeType, setActiveType]             = useState("Tất cả");
  const [activeSubject, setActiveSubject]       = useState("all");
  const [activeSort, setActiveSort]             = useState<SortKey>("newest");
  const [viewMode, setViewMode]                 = useState<ViewMode>("all");
  const [query, setQuery]                       = useState("");
  const [savedDocs, setSavedDocs]               = useState<number[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadOpen, setUploadOpen]             = useState(false);

  const openPreview  = (doc: Document) => setSelectedDocument(doc);
  const closePreview = () => setSelectedDocument(null);

  const toggleSave = (id: number) =>
    setSavedDocs((p) => p.includes(id) ? p.filter((d) => d !== id) : [...p, id]);

  const filtered = useMemo(() => {
    let docs = DOCUMENTS.filter((doc) => {
      if (viewMode === "saved" && !savedDocs.includes(doc.id)) return false;
      if (activeType !== "Tất cả" && doc.type !== activeType) return false;
      if (activeSubject !== "all" && doc.subjectId !== activeSubject) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.subject.toLowerCase().includes(q) ||
          doc.author.name.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (activeSort === "mostDownloaded") docs = [...docs].sort((a, b) => b.downloadsNum - a.downloadsNum);
    if (activeSort === "oldest")         docs = [...docs].sort((a, b) => a.id - b.id);

    return docs;
  }, [activeType, activeSubject, activeSort, viewMode, query, savedDocs]);

  return (
    <div className="flex gap-5 py-5 max-w-[1100px] mx-auto w-full items-start">

      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <LibraryFilters
          query={query}
          setQuery={setQuery}
          activeSubject={activeSubject}
          setActiveSubject={setActiveSubject}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          activeType={activeType}
          setActiveType={setActiveType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          savedCount={savedDocs.length}
          onUpload={() => setUploadOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {filtered.length > 0 ? (
            filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isSaved={savedDocs.includes(doc.id)}
                onToggleSave={toggleSave}
                onPreview={openPreview}
              />
            ))
          ) : (
            <EmptyState query={query} />
          )}
        </div>
      </div>

      <div className="w-[268px] shrink-0 flex flex-col gap-4">
        <FeaturedDocsWidget />
        <StatsWidget />
      </div>

      {selectedDocument && (
        <DocumentPreviewModal doc={selectedDocument} onClose={closePreview} />
      )}

      {uploadOpen && (
        <UploadDocumentModal
          onClose={() => setUploadOpen(false)}
          onSuccess={() => { setTimeout(() => setUploadOpen(false), 2200); }}
        />
      )}
    </div>
  );
}