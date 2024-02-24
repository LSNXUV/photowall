import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "2024回忆墙",
  description: "十一中2024级照片墙",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'body'}>{children}</body>
    </html>
  );
}
