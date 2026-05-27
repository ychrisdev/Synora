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
  const { data: session, status } = useSession();

  const hideAll = pathname.startsWith("/chat");
  const hideSidebar =
    hideAll ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/profile");
  const isFullWidth =
    pathname.startsWith("/search") || pathname.startsWith("/profile");

  if (hideAll) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar
        isLoggedIn={status === "authenticated"}
        session={session}
        status={status}
      />
      {!hideSidebar && <Sidebar />}
      <main className={`pt-14 min-h-screen ${hideSidebar ? "" : "ml-[300px]"}`}>
        <div className={isFullWidth ? "w-full" : "w-full px-6"}>{children}</div>
      </main>
    </div>
  );
}
