import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50">
      <Topbar />
      <Sidebar />
      <main className="ml-[220px] pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
