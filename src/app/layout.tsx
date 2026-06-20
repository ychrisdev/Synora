import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Synora - Nền tảng học tập cộng đồng",
  description: "Modern collaborative social-learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ToastProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
