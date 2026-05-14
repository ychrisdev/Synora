"use client";

import { useState } from "react";
import UnsupportedPreview from "./UnsupportedPreview";
import type { Document } from "@/lib/library/types";

interface DocumentPreviewContentProps {
  doc: Document;
  onDownload?: () => void;
}

function PdfPreview({ title }: { title: string }) {
  const [loading, setLoading] = useState(true);

  const mockPdfUrl = `https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf`;

  return (
    <div className="relative w-full h-full min-h-[420px]">
      {loading && (
        <div className="absolute inset-0 flex flex-col gap-3 p-6 animate-pulse">
          <div className="h-4 bg-surface-100 rounded-lg w-3/4" />
          <div className="h-4 bg-surface-100 rounded-lg w-full" />
          <div className="h-4 bg-surface-100 rounded-lg w-5/6" />
          <div className="h-4 bg-surface-100 rounded-lg w-2/3" />
          <div className="h-32 bg-surface-100 rounded-xl w-full mt-2" />
          <div className="h-4 bg-surface-100 rounded-lg w-full" />
          <div className="h-4 bg-surface-100 rounded-lg w-4/5" />
        </div>
      )}
      <iframe
        src={`${mockPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        title={title}
        className="w-full h-full min-h-[420px] rounded-lg border-0"
        onLoad={() => setLoading(false)}
        aria-label={`Xem trước PDF: ${title}`}
      />
    </div>
  );
}

export default function DocumentPreviewContent({ doc, onDownload }: DocumentPreviewContentProps) {
  if (doc.type === "PDF") {
    return <PdfPreview title={doc.title} />;
  }

  return <UnsupportedPreview type={doc.type} onDownload={onDownload} />;
}