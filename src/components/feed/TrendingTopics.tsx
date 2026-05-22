import Link from "next/link";

const topics = [
  { rank: 1, tag: "#GiaiTich1",  count: "1.2k bài viết"},
  { rank: 2, tag: "#ThiCuoiKy", count: "856 bài viết"},
  { rank: 3, tag: "#IELTS",      count: "643 bài viết"},
  { rank: 4, tag: "#VanHoc12",   count: "432 bài viết"},
  { rank: 5, tag: "#LapTrinhC",  count: "315 bài viết"},
];

export default function TrendingTopics() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Chủ đề thịnh hành</h3>
      </div>

      <div className="flex flex-col gap-2">
        {topics.map((t) => (
          <div key={t.rank} className="flex items-center gap-3 py-1 cursor-pointer group">
            <span className="text-xs font-semibold text-text-muted w-4">{t.rank}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                {t.tag}
              </p>
              <p className="text-xs text-text-muted">{t.count}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${t.color}`} />
          </div>
        ))}
      </div>

      <Link
        href="/explore"
        className="block mt-3 text-center text-xs text-primary font-medium py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
      >
        Khám phá thêm
      </Link>
    </div>
  );
}