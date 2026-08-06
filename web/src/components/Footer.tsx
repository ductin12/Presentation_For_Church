export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 relative z-10 mt-12 glass">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center p-0.5">
            <img src="/logo.png" alt="PFC Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="font-bold text-gray-300">PFC | Presentation For Church</span>
        </div>
        
        <div className="text-sm text-gray-500 text-center md:text-left">
          &copy; {new Date().getFullYear()} PFC. Đây là dự án cộng đồng miễn phí.
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <a href="https://github.com/ductin12/Presentation_For_Church/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Báo lỗi
          </a>
          <a href="https://github.com/ductin12/Presentation_For_Church/releases" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Tải về (Releases)
          </a>
        </div>
      </div>
    </footer>
  );
}
