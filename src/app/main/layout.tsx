"use client";

import { usePathname } from "next/navigation";
import Topbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideAll =
    pathname.startsWith("/main/chat") ||
    pathname.startsWith("/main/profile");

  const hideSidebar = hideAll;

  if (hideAll) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <Topbar />
      {!hideSidebar && <Sidebar />}
      <main className="ml-[300px] pt-14 min-h-screen">
        <div className="w-full px-6">{children}</div>
      </main>
    </div>
  );
}