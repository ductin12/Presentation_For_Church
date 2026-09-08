import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://presentation-for-church.vercel.app"),
  title: "PFC - Presentation For Church | Phần mềm trình chiếu thờ phượng miễn phí",
  description: "Giải pháp trình chiếu thờ phượng chuyên nghiệp, hoàn toàn miễn phí cho Hội Thánh. Hỗ trợ macOS & Windows, biên tập Rich Text, thư viện 290+ bài hát chuẩn chính tả, tra cứu Kinh Thánh siêu tốc.",
  keywords: [
    "trình chiếu hội thánh",
    "phần mềm trình chiếu nhà thờ",
    "presentation for church",
    "pfc",
    "bài hát thờ phượng",
    "lời bài hát thánh ca",
    "kinh thánh trình chiếu",
    "worship presentation software"
  ],
  authors: [{ name: "Thiên Phước" }, { name: "Tin Phạm" }],
  openGraph: {
    title: "PFC - Presentation For Church | Phần mềm trình chiếu thờ phượng miễn phí",
    description: "Giải pháp trình chiếu thờ phượng chuyên nghiệp, hoàn toàn miễn phí cho Hội Thánh. Hỗ trợ macOS & Windows.",
    url: "https://github.com/ductin12/Presentation_For_Church",
    siteName: "Presentation For Church",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/Presentation-for-church-app-free.png",
        width: 1200,
        height: 630,
        alt: "Presentation For Church App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PFC - Presentation For Church | Phần mềm trình chiếu thờ phượng miễn phí",
    description: "Giải pháp trình chiếu thờ phượng chuyên nghiệp, hoàn toàn miễn phí cho Hội Thánh.",
    images: ["/Presentation-for-church-app-free.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
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
