"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marked } from "marked";

gsap.registerPlugin(ScrollTrigger);

interface ChangelogProps {
  content: string;
}

export default function Changelog({ content }: ChangelogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".changelog-box",
        { opacity: 0, scale: 0.95, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const htmlContent = marked.parse(content);

  return (
    <section id="changelog" ref={containerRef} className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Bản Cập Nhật Mới Nhất
          </h2>
          <p className="text-gray-400">
            Liên tục hoàn thiện để đem lại trải nghiệm vận hành tối ưu nhất.
          </p>
        </div>

        <div className="changelog-box glass-strong rounded-2xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div 
            className="prose prose-invert prose-blue max-w-none 
                       prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-0 
                       prose-a:text-blue-400 hover:prose-a:text-blue-300
                       prose-li:text-gray-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </section>
  );
}
