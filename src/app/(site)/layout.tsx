"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const hideAll =
    pathname.startsWith("/chat") || pathname.startsWith("/profile");
  const hideSidebar = hideAll || pathname.startsWith("/search");
  const isFullWidth = pathname.startsWith("/search");

  if (hideAll) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar isLoggedIn={!!session} session={session} />
      {!hideSidebar && <Sidebar />}
      <main className={`pt-14 min-h-screen ${hideSidebar ? "" : "ml-[300px]"}`}>
        <div className={isFullWidth ? "w-full" : "w-full px-6"}>{children}</div>
      </main>
    </div>
  );
}
