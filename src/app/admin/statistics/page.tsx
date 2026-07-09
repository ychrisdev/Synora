"use client";
import { useMemo, useState } from "react";
import { TrendingUp, Users, FileText, Activity } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { DateRangeFilter } from "@/components/admin/statistics/DateRangeFilter";
import { MiniLineChart } from "@/components/admin/statistics/MiniLineChart";
import { MiniBarChart } from "@/components/admin/statistics/MiniBarChart";
import { TopList, type TopListItem } from "@/components/admin/statistics/TopList";
import { RANGE_DAYS, type TimeRange } from "@/lib/statistics/types";

function generateSeries(days: number, base: number, variance: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      label: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      value: Math.max(0, Math.round(base + Math.sin(i / 3) * variance + (Math.random() - 0.5) * variance)),
    };
  });
}

const TOP_POSTS: TopListItem[] = [
  { id: "1", avatarUrl: null, title: "Chia sẻ lộ trình tự học React trong 3 tháng", subtitle: "Nguyễn Văn A · @nva123", metricValue: "1.2K", metricLabel: "lượt thích" },
  { id: "2", avatarUrl: null, title: "Tổng hợp đề thi giữa kỳ môn CTDL&GT", subtitle: "Trần Thị B · @ttb", metricValue: 890, metricLabel: "lượt thích" },
  { id: "3", avatarUrl: null, title: "Kinh nghiệm phỏng vấn thực tập Fresher", subtitle: "Lê Văn C · @lvc2003", metricValue: 654, metricLabel: "lượt thích" },
  { id: "4", avatarUrl: null, title: "Review khóa học SQL cho người mới", subtitle: "Phạm Thị D · @ptd_studio", metricValue: 512, metricLabel: "lượt thích" },
  { id: "5", avatarUrl: null, title: "Góc tài liệu: Slide Kiến trúc máy tính", subtitle: "Hoàng Văn E · @hoangv", metricValue: 470, metricLabel: "lượt thích" },
];

const TOP_ACTIVE: TopListItem[] = [
  { id: "1", avatarUrl: null, title: "Nguyễn Văn A", subtitle: "@nva123", metricValue: 342, metricLabel: "hoạt động" },
  { id: "2", avatarUrl: null, title: "Trần Thị B", subtitle: "@ttb", metricValue: 298, metricLabel: "hoạt động" },
  { id: "3", avatarUrl: null, title: "Lê Văn C", subtitle: "@lvc2003", metricValue: 251, metricLabel: "hoạt động" },
  { id: "4", avatarUrl: null, title: "Phạm Thị D", subtitle: "@ptd_studio", metricValue: 190, metricLabel: "hoạt động" },
  { id: "5", avatarUrl: null, title: "Hoàng Văn E", subtitle: "@hoangv", metricValue: 165, metricLabel: "hoạt động" },
];

export default function AdminStatisticsPage() {
  const [range, setRange] = useState<TimeRange>("7D");
  const days = RANGE_DAYS[range];

  const growthData = useMemo(() => generateSeries(days, 40, 15), [days]);
  const activeUsersData = useMemo(() => generateSeries(days, 900, 250), [days]);

  const totalNewUsers = growthData.reduce((sum, d) => sum + d.value, 0);
  const avgActiveUsers = Math.round(activeUsersData.reduce((sum, d) => sum + d.value, 0) / activeUsersData.length);

  return (
    <>
      <PageHeader
        title="Thống kê"
        description="Biểu đồ tăng trưởng, người dùng hoạt động và bài viết nổi bật"
      />

      <DateRangeFilter value={range} onChange={setRange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Users} label="Người dùng mới" value={totalNewUsers.toLocaleString("vi-VN")} colorClass="bg-blue-50 text-blue-500" />
        <StatCard icon={Activity} label="Hoạt động TB/ngày" value={avgActiveUsers.toLocaleString("vi-VN")} colorClass="bg-primary-50 text-purple-500" />
        <StatCard icon={FileText} label="Bài viết nổi bật" value={TOP_POSTS.length} colorClass="bg-orange-50 text-orange-500" />
        <StatCard icon={TrendingUp} label="Tăng trưởng" value="+12.4%" colorClass="bg-emerald-50 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-800 mb-1">Tăng trưởng người dùng mới</p>
          <p className="text-xs text-slate-400 mb-4">Số tài khoản đăng ký mới theo ngày</p>
          <MiniLineChart data={growthData} colorClass="stroke-blue-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-800 mb-1">Người dùng hoạt động</p>
          <p className="text-xs text-slate-400 mb-4">Số lượt đăng nhập/tương tác theo ngày</p>
          <MiniBarChart data={activeUsersData} colorClass="bg-primary-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopList title="Bài viết nổi bật" icon={<FileText size={15} className="text-orange-500" />} items={TOP_POSTS} />
        <TopList title="Người dùng hoạt động nhiều nhất" icon={<Activity size={15} className="text-purple-500" />} items={TOP_ACTIVE} />
      </div>
    </>
  );
}