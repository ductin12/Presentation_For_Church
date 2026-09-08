"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileEdit, BookOpen, Tv, Sparkles, Library, Gift } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <FileEdit className="w-6 h-6 text-blue-400" />,
    title: "Soạn Thảo Bài Hát & Rich Text",
    description: "Tô màu, đổi font/cỡ chữ, in đậm nghiêng linh hoạt. Kéo thả (Drag & Drop) đổi vị trí slide và nhấn Enter 2 lần tự động ngắt khổ mới cực kỳ tiện lợi."
  },
  {
    icon: <Library className="w-6 h-6 text-emerald-400" />,
    title: "Kho 290+ Bài Hát Chuẩn Chính Tả",
    description: "Thư viện thánh ca phong phú đã được rà soát và hiệu đính lỗi chính tả tiếng Việt tỉ mỉ từng dấu câu, sẵn sàng thờ phượng ngay mà không lo sai từ."
  },
  {
    icon: <Tv className="w-6 h-6 text-purple-400" />,
    title: "Live Screen Đồng Bộ 2 Màn Hình",
    description: "Xuất tín hiệu ra máy chiếu/TV phụ độc lập với bảng điều khiển. Tự động đồng bộ tắt bật triệt để trên cả macOS và Windows khi thoát ứng dụng."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-amber-400" />,
    title: "Tra Cứu Kinh Thánh Siêu Tốc",
    description: "Tìm kiếm nhanh các phân đoạn Kinh Thánh theo sách, chương, câu. Giao diện hiển thị trang trọng, dễ đọc cho toàn thể hội chúng."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-rose-400" />,
    title: "Hình Ảnh & Video Nền Mượt Mà",
    description: "Tích hợp video nền chuyển động và hình ảnh chủ đề phong phú. Cơ chế giải mã tối ưu giúp chuyển slide mượt mà, không bao giờ giật lag."
  },
  {
    icon: <Gift className="w-6 h-6 text-pink-400" />,
    title: "Đa Nền Tảng & 100% Miễn Phí",
    description: "Hỗ trợ đầy đủ macOS (Apple Silicon & Intel) và Windows (Setup & Portable USB). Dự án phụng sự cộng đồng, hoàn toàn miễn phí mãi mãi."
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
