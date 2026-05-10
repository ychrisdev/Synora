import Topbar from "@/components/layout/Topbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-50">
      <Topbar />
      <main className="pt-14 min-h-screen">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}