"use client";
import {
  Users,
  Activity,
  FileText,
  MessageSquare,
  UsersRound,
  BookOpen,
  Flag,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { TopPosts } from "@/components/admin/dashboard/TopPosts";
import { TopReportedUsers } from "@/components/admin/dashboard/TopReportedUsers";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";

const STATS = {
  totalUsers: 12480,
  newToday: 34,
  newWeek: 210,
  newMonth: 890,
  activeUsers: 3120,
  totalPosts: 8640,
  totalComments: 25300,
  totalGroups: 156,
  totalDocuments: 4210,
  pendingReports: 27,
  pendingContent: 9,
};

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Tổng quan tình trạng hệ thống Synora"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Tổng người dùng"
          value={STATS.totalUsers.toLocaleString("vi-VN")}
          colorClass="bg-blue-50 text-blue-500"
        />
        <StatCard
          icon={Activity}
          label="Đang hoạt động"
          value={STATS.activeUsers.toLocaleString("vi-VN")}
          colorClass="bg-purple-50 text-purple-500"
        />
        <StatCard
          icon={FileText}
          label="Tổng bài viết"
          value={STATS.totalPosts.toLocaleString("vi-VN")}
          colorClass="bg-orange-50 text-orange-500"
        />
        <StatCard
          icon={MessageSquare}
          label="Tổng bình luận"
          value={STATS.totalComments.toLocaleString("vi-VN")}
          colorClass="bg-cyan-50 text-cyan-500"
        />
        <StatCard
          icon={UsersRound}
          label="Tổng nhóm"
          value={STATS.totalGroups}
          colorClass="bg-pink-50 text-pink-500"
        />
        <StatCard
          icon={BookOpen}
          label="Tổng tài liệu"
          value={STATS.totalDocuments.toLocaleString("vi-VN")}
          colorClass="bg-indigo-50 text-indigo-500"
        />
        <StatCard
          icon={Flag}
          label="Báo cáo chưa xử lý"
          value={STATS.pendingReports}
          colorClass="bg-red-50 text-red-500"
        />
        <StatCard
          icon={Clock}
          label="Nội dung đang chờ duyệt"
          value={STATS.pendingContent}
          colorClass="bg-amber-50 text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <TopPosts />
        <TopReportedUsers />
      </div>

      <RecentActivity />
    </>
  );
}