import { gothamBook } from "@/constants/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New Tab",
  description: "View beautiful album covers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gothamBook.className} antialiased`}>{children}</body>
    </html>
  );
}
