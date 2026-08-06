"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layout, BookOpen, Layers, MonitorPlay, Sparkles, Gift } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Layout className="w-6 h-6 text-blue-400" />,
    title: "Quản lý Bài Hát Dễ Dàng",
    description: "Thêm, sửa và tìm kiếm bài hát cực kỳ nhanh chóng. Dễ dàng lưu trữ và chia sẻ kho lời nhạc của Hội Thánh chỉ với vài thao tác."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-purple-400" />,
    title: "Kinh Thánh Thông Minh",
    description: "Tra cứu siêu tốc nhiều bản dịch Kinh Thánh. Màn hình tự động cuộn nhịp nhàng theo câu chữ, giúp hội chúng dễ dàng theo dõi lời Chúa."
  },
  {
    icon: <Layers className="w-6 h-6 text-emerald-400" />,
    title: "Giao Diện Đẹp Mắt, Sẵn Sàng",
    description: "Cung cấp nhiều mẫu trình chiếu tuyệt đẹp. Bạn có thể thoải mái tùy chỉnh phông chữ, màu sắc và hình nền cho phù hợp với phong cách của Hội Thánh."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    title: "Trình Chiếu Hình Ảnh & Video Mượt Mà",
    description: "Thêm hình ảnh, video vào danh sách trình chiếu một cách trơn tru. Hệ thống xử lý thông minh đảm bảo không bao giờ gây giật lag khi đang nhóm lại."
  },
  {
    icon: <MonitorPlay className="w-6 h-6 text-rose-400" />,
    title: "Hỗ Trợ Mọi Loại Máy Tính",
    description: "Dù Hội Thánh đang sử dụng máy tính Windows đời cũ hay MacBook mới nhất, ứng dụng đều hoạt động cực kỳ mượt mà và ổn định."
  },
  {
    icon: <Gift className="w-6 h-6 text-pink-400" />,
    title: "Hoàn Toàn Miễn Phí",
    description: "Sứ mệnh của chúng tôi là phục vụ cộng đồng. Trải nghiệm trọn vẹn mọi tính năng chuyên nghiệp nhất mà không yêu cầu bất kỳ khoản phí nào."
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
