"use client";
import { useId, useMemo } from "react";
import type { ChartPoint } from "@/lib/statistics/types";

export function MiniLineChart({
  data,
  colorClass = "stroke-blue-500",
  fillId,
  height = 180,
}: {
  data: ChartPoint[];
  colorClass?: string;
  fillId?: string;
  height?: number;
}) {
  const gradientId = useId();
  const width = 600;
  const padding = 8;

  const { points, max, min } = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const step = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
    const points = data.map((d, i) => {
      const x = padding + i * step;
      const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
      return { x, y, ...d };
    });
    return { points, max, min };
  }, [data, height]);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${height - padding} L ${points[0]?.x ?? 0} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" className={colorClass.replace("stroke-", "text-")} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={colorClass.replace("stroke-", "text-")} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" className={colorClass} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} className={colorClass.replace("stroke-", "fill-")} />
        ))}
      </svg>
      <div className="flex justify-between mt-2 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-slate-400">
            {i === 0 || i === data.length - 1 || data.length <= 10 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}