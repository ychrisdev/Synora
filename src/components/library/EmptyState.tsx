import { Search } from "lucide-react";

interface EmptyStateProps {
  query: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-20 text-center col-span-3">
      <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
        <Search size={24} className="text-text-muted" />
      </div>
      <p className="text-sm font-semibold text-text-primary mb-1.5">
        Không tìm thấy tài liệu nào
      </p>
      <p className="text-xs text-text-muted max-w-[260px] leading-relaxed">
        {query
          ? `Không có kết quả cho "${query}". Thử từ khoá khác hoặc bỏ bộ lọc.`
          : "Chưa có tài liệu phù hợp. Hãy thử chủ đề hoặc loại file khác."}
      </p>
    </div>
  );
}