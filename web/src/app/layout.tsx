import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "PFC | Presentation For Church",
  description: "Giải pháp trình chiếu thờ phượng chuyên nghiệp, hoàn toàn miễn phí cho Hội Thánh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
