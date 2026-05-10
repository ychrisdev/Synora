const topics = [
  { rank: 1, tag: "#GiaiTich1", count: "1.2k bài viết", color: "bg-red-500" },
  { rank: 2, tag: "#ThiCuoiKy", count: "856 bài viết", color: "bg-orange-500" },
  { rank: 3, tag: "#IELTS", count: "643 bài viết", color: "bg-blue-500" },
  { rank: 4, tag: "#VanHoc12", count: "432 bài viết", color: "bg-purple-500" },
  { rank: 5, tag: "#LapTrinhC", count: "315 bài viết", color: "bg-green-500" },
];

export default function TrendingTopics() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📈</span>
        <h3 className="text-sm font-semibold text-text-primary">Chủ đề thịnh hành</h3>
      </div>
      <div className="flex flex-col gap-2">
        {topics.map((t) => (
          <div key={t.rank} className="flex items-center gap-3 py-1 cursor-pointer group">
            <span className="text-xs font-semibold text-text-muted w-4">{t.rank}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{t.tag}</p>
              <p className="text-xs text-text-muted">{t.count}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${t.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
