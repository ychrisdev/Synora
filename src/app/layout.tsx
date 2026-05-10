import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
