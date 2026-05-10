"use client";

import { usePathname } from "next/navigation";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/main/profile");

  return (
    <div className="min-h-screen bg-surface-50">
      <Topbar />
      {!hideSidebar && <Sidebar />}
      <main className={hideSidebar ? "pt-14 min-h-screen" : "ml-[300px] pt-14 min-h-screen"}>
        <div className="w-full px-6">{children}</div>
      </main>
    </div>
  );
}