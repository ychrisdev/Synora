import Link from "next/link";

const TRENDING = [
  { tag: "#OnThiTHPT2025", count: "8.7k" },
  { tag: "#HoaHuuCo", count: "2.1k" },
  { tag: "#IELTSPrep", count: "4.3k" },
  { tag: "#GiaiTich1", count: "1.5k" },
  { tag: "#VatLy12", count: "920" },
];

export function TrendingTopics() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          Chủ đề nổi bật
        </h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {TRENDING.map((t, i) => (
          <Link
            key={i}
            href={`/main/explore?topic=${t.tag.slice(1)}`}
            className="flex items-center justify-between group"
          >
            <span className="text-sm font-medium text-primary group-hover:underline">
              {t.tag}
            </span>
            <span className="text-[11px] text-text-muted">{t.count} bài</span>
          </Link>
        ))}
      </div>
    </div>
  );
}