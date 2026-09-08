"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, Monitor, Laptop, HardDrive, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface DownloadProps {
  version: string;
}

export default function DownloadSection({ version }: DownloadProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".download-card",
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const downloadLinks = [
    {
      platform: "macOS",
      chip: "Apple Silicon (M1, M2, M3, M4)",
      filename: `Presentation.For.Church.macOS.arm64.${version}.dmg`,
      url: `https://github.com/ductin12/Presentation_For_Church/releases/download/v${version}/Presentation.For.Church.macOS.arm64.${version}.dmg`,
      icon: <Laptop className="w-8 h-8 text-blue-400" />,
      badge: "Khuyên dùng cho Mac đời mới",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      notes: "Tương thích macOS 11 trở lên. Kéo thả vào Applications để sử dụng.",
    },
    {
      platform: "macOS",
      chip: "Intel Core (x64)",
      filename: `Presentation.For.Church.macOS.x64.${version}.dmg`,
      url: `https://github.com/ductin12/Presentation_For_Church/releases/download/v${version}/Presentation.For.Church.macOS.x64.${version}.dmg`,
      icon: <Laptop className="w-8 h-8 text-purple-400" />,
      badge: "Dành cho Mac dùng chip Intel",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      notes: "Dành cho MacBook và iMac các đời trước năm 2020 chạy Intel.",
    },
    {
      platform: "Windows",
      chip: "Bản Cài Đặt (Setup Installer)",
      filename: `Presentation.For.Church.Setup.${version}.exe`,
      url: `https://github.com/ductin12/Presentation_For_Church/releases/download/v${version}/Presentation.For.Church.Setup.${version}.exe`,
      icon: <Monitor className="w-8 h-8 text-emerald-400" />,
      badge: "Khuyên dùng cho máy thờ phượng",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      notes: "Tạo shortcut ngoài Desktop, tự động cập nhật và chạy mượt mà trên Win 10/11.",
    },
    {
      platform: "Windows",
      chip: "Bản Di Động (Portable USB)",
      filename: `Presentation.For.Church.Portable.${version}.exe`,
      url: `https://github.com/ductin12/Presentation_For_Church/releases/download/v${version}/Presentation.For.Church.Portable.${version}.exe`,
      icon: <HardDrive className="w-8 h-8 text-amber-400" />,
      badge: "Không cần cài đặt",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      notes: "Copy vào USB và cắm chạy ngay trên mọi máy tính Hội Thánh mà không cần Admin.",
    },
  ];

  return (
    <section id="download" ref={containerRef} className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4 text-sm font-medium text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Tải về phiên bản ổn định mới nhất v{version}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trung Tâm Tải Về Ứng Dụng
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hỗ trợ đầy đủ cho cả hai hệ điều hành phổ biến nhất. Hoàn toàn miễn phí, không quảng cáo, cài đặt nhanh chóng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {downloadLinks.map((item, idx) => (
            <div
              key={idx}
              className="download-card glass-strong rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between border border-white/10 group shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">
                  {item.platform}
                </h3>
                <p className="text-sm font-medium text-gray-300 mb-3">
                  {item.chip}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {item.notes}
                </p>
              </div>

              <div>
                <a
                  href={item.url}
                  className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-white/20 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                >
                  <Download className="w-5 h-5" />
                  <span>Tải về {item.platform} ({item.filename.endsWith('.dmg') ? 'DMG' : 'EXE'})</span>
                </a>
                <div className="text-[11px] text-gray-500 text-center mt-2 truncate">
                  {item.filename}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hướng dẫn an tâm & Cài đặt */}
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">An toàn & Bảo mật 100%</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Mã nguồn mở công khai trên GitHub. Nếu macOS hiển thị thông báo &quot;Nhà phát triển chưa xác minh&quot;, bạn chỉ cần vào <strong>Cài đặt hệ thống &gt; Quyền riêng tư & Bảo mật</strong> và nhấn <strong>Mở mọi cách (Open Anyway)</strong>.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/ductin12/Presentation_For_Church/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm font-medium text-gray-300 hover:text-white transition-colors shrink-0"
          >
            <span>Tất cả phiên bản</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
