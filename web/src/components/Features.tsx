"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layout, BookOpen, Layers, MonitorPlay, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Layout className="w-6 h-6 text-blue-400" />,
    title: "Quản lý Bài hát Thông minh",
    description: "Thêm, sửa, xóa, tìm kiếm từ khóa/alias siêu tốc. Hỗ trợ nhập/xuất dữ liệu (import/export) JSON dễ dàng."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-purple-400" />,
    title: "Kinh Thánh Đa Bản Dịch & Auto-Scroll",
    description: "Tự động bắt số câu, cuộn mượt mà đồng bộ giữa thẻ Xem trước (Preview) và Trình chiếu (Live) cực kỳ mượt mà."
  },
  {
    icon: <Layers className="w-6 h-6 text-emerald-400" />,
    title: "Thư viện Giao diện (Style Templates)",
    description: "7 mẫu thiết kế chuẩn tích hợp sẵn. Tùy chỉnh font chữ, viền chữ, nền theo sở thích của Hội Thánh."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    title: "Quản lý Media Nhẹ Nhàng",
    description: "Import ngầm (Async) qua thanh báo tiến độ (Toast). Không bao giờ làm đơ (lag) giao diện."
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-rose-400" />,
    title: "Hoạt động Đa Nền Tảng",
    description: "Hỗ trợ Windows (Bản cài đặt & Portable) và macOS (Intel & Apple Silicon M-Series)."
  }
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { y: 100, opacity: 0, rotateX: 20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hệ thống sinh ra để tối ưu hóa trải nghiệm vận hành trình chiếu, giúp người dùng tập trung hoàn toàn vào sự thờ phượng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="feature-card glass-strong rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 floating group cursor-default perspective-1000"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
