import { FileX, Download } from "lucide-react";

interface UnsupportedPreviewProps {
  type: string;
  onDownload?: () => void;
}

const MESSAGES: Record<string, string> = {
  DOCX: "Không thể xem trước đầy đủ file DOCX",
  PPTX: "Xem trước slide chưa được hỗ trợ đầy đủ",
};

export default function UnsupportedPreview({ type, onDownload }: UnsupportedPreviewProps) {
  const message = MESSAGES[type] ?? "Định dạng này chưa hỗ trợ xem trước";

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center">
        <FileX size={28} className="text-text-muted" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-text-primary">{message}</p>
        <p className="text-xs text-text-muted max-w-[240px] leading-relaxed">
          Tải file về máy để xem đầy đủ nội dung với ứng dụng phù hợp.
        </p>
      </div>
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Download size={14} />
          Tải xuống
        </button>
      )}
    </div>
  );
}