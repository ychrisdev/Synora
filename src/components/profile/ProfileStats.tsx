import { profileData } from "@/lib/profile/data";

const STATS = [
  { key: "followers", label: "người theo dõi" },
  { key: "following", label: "đang theo dõi" },
  { key: "documents", label: "tài liệu" },
  { key: "downloads", label: "lượt tải" },
] as const;

export function ProfileStats() {
  return (
    <div className="flex items-center gap-5 px-1 mb-5 border-b border-surface-100 pb-4">
      {STATS.map(({ key, label }) => (
        <button key={key} className="flex items-baseline gap-1 hover:opacity-70 transition-opacity">
          <span className="text-sm font-bold text-text-primary tabular-nums">
            {profileData.stats[key]}
          </span>
          <span className="text-xs text-text-muted">{label}</span>
        </button>
      ))}
    </div>
  );
}