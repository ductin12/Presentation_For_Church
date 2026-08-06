"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="container mx-auto">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="PFC Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="font-bold text-lg tracking-tight">PFC</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#changelog" className="hover:text-white transition-colors">Cập nhật</a>
          </div>

          <div>
            <a
              href="https://github.com/ductin12/Presentation_For_Church"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              Github
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
