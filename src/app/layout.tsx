import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "重庆十一中高2024届成人礼表白墙",
  description: "重庆十一中高2024届成人礼表白墙",
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
