import Link from "next/link";
import { BookOpen } from "lucide-react";

const docs = [
  { id: 1, title: "Bí kíp 8.0+ IELTS Reading", type: "PDF", downloads: "2.4k lượt tải", color: "bg-red-500" },
  { id: 2, title: "Tóm tắt công thức Vật Lý 12", type: "PDF", downloads: "1.8k lượt tải", color: "bg-red-500" },
  { id: 3, title: "Slide thuyết trình Kỹ năng mềm", type: "PPTX", downloads: "956 lượt tải", color: "bg-orange-500" },
];

export default function FeaturedDocs() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">Tài liệu nổi bật</h3>
      </div>
      <div className="flex flex-col gap-2">
        {docs.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 py-1 cursor-pointer group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${doc.color}`}>
              {doc.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate group-hover:text-primary transition-colors">{doc.title}</p>
              <p className="text-[10px] text-text-muted">{doc.downloads}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/main/library" className="block mt-3 text-center text-xs text-primary font-medium py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
        Khám phá thêm thư viện
      </Link>
    </div>
  );
}
