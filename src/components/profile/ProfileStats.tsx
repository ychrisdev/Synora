interface StatsShape {
  followers: string | number;
  following: string | number;
  documents: string | number;
  downloads: string | number;
}

interface ProfileStatsProps {
  stats: StatsShape;
}

const LABELS = [
  { key: "followers" as const, label: "người theo dõi" },
  { key: "documents" as const, label: "tài liệu" },
  { key: "downloads" as const, label: "lượt tải" },
];

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-5 px-1 mb-5 border-b border-surface-100 pb-4">
      {LABELS.map(({ key, label }) => (
        <button
          key={key}
          className="flex items-baseline gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {stats[key]}
          </span>
          <span className="text-xs text-text-muted">{label}</span>
        </button>
      ))}
    </div>
  );
}
