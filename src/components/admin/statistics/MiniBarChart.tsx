"use client";
import { useMemo } from "react";
import { clsx } from "clsx";
import type { ChartPoint } from "@/lib/statistics/types";

export function MiniBarChart({
  data,
  colorClass = "bg-purple-500",
  height = 180,
}: {
  data: ChartPoint[];
  colorClass?: string;
  height?: number;
}) {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            <div
              className={clsx("w-full rounded-t-md transition-all", colorClass, "hover:opacity-80")}
              style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
            />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {d.value.toLocaleString("vi-VN")}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-slate-400 truncate">
            {data.length <= 14 ? d.label : i % Math.ceil(data.length / 10) === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}