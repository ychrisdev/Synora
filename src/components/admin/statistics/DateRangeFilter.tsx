"use client";
import { clsx } from "clsx";
import { RANGE_LABELS, type TimeRange } from "@/lib/statistics/types";

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
}) {
  const ranges = Object.keys(RANGE_LABELS) as TimeRange[];

  return (
    <div className="inline-flex items-center bg-slate-100 rounded-full p-1 mb-5">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            value === r
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {RANGE_LABELS[r]}
        </button>
      ))}
    </div>
  );
}