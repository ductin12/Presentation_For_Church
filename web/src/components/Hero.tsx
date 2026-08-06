"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

interface HeroProps {
  version: string;
}

const mediaItems = [
  { type: "video", src: "/Presentation-for-church-app.mp4" },
  { type: "image", src: "/hero-1.png" },
  { type: "image", src: "/hero-2.png" },
  { type: "image", src: "/hero-3.png" },
];

export default function Hero({ version }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgElementsRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Banner slider interval
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, 6000); // 6 seconds for each slide
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade up content
      gsap.fromTo(
        ".hero-element",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      // Floating glass orbs
      gsap.to(".glass-orb", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });

      // 3D Banner float
      gsap.to(".hero-banner", {
        y: -15,
        rotationX: 2,
        rotationY: -2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 w-full">
      {/* Background Floating Orbs */}
      <div ref={bgElementsRef} className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="glass-orb glass absolute w-64 h-64 rounded-full -top-10 -left-10 bg-blue-500/10 blur-3xl"></div>
        <div className="glass-orb glass absolute w-96 h-96 rounded-full bottom-20 right-10 bg-purple-500/10 blur-3xl"></div>
        <div className="glass-orb glass absolute w-48 h-48 rounded-full top-1/2 left-1/4 bg-emerald-500/10 blur-2xl"></div>
      </div>

      <div ref={textRef} className="relative z-10 w-full px-4 sm:px-6 text-center flex flex-col items-center">
        <div className="hero-element inline-block px-4 py-1.5 rounded-full glass-strong mb-6 text-sm font-medium tracking-wide text-gray-300">
          🎉 Phiên bản mới nhất v{version}
        </div>
        
        {/* Full Width Banners Slider */}
        <div className="hero-element hero-banner w-full max-w-[1600px] mx-auto mb-12 rounded-2xl overflow-hidden glass-strong p-2 shadow-[0_30px_60px_rgba(0,0,0,0.6)] perspective-1000">
          <div className="relative w-full aspect-[16/7] md:aspect-[21/9] rounded-xl overflow-hidden bg-black">
            {mediaItems.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={item.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={`PFC Hero Banner ${index}`}
                      fill
                      className="object-cover"
                      priority={index === 1}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <p className="hero-element text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Giải pháp trình chiếu thờ phượng chuyên nghiệp, hoàn toàn miễn phí cho Hội Thánh.
          Được thiết kế để san sẻ gánh nặng tài chính và nhân sự, giúp việc vận hành trở nên dễ dàng hơn bao giờ hết.
        </p>

        <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/ductin12/Presentation_For_Church/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Tải xuống miễn phí
          </a>
          <a
            href="https://github.com/ductin12/Presentation_For_Church"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl glass hover:bg-white/10 transition-colors duration-300 font-medium"
          >
            Xem mã nguồn Github
          </a>
        </div>
        
        <p className="hero-element mt-12 text-sm text-gray-500">
          Tác giả: Thiên Phước &bull; Cộng tác: Tin Phạm
        </p>
      </div>
    </section>
  );
}
