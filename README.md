# Presentation For Church (PFC) - Worship Presentation App

[![GitHub Release](https://img.shields.io/github/v/release/ductin12/Presentation_For_Church?color=5048e5&label=Phi%C3%AAn%20b%E1%BA%A3n%20m%E1%BB%9Bi%20nh%E1%BA%A5t)](https://github.com/ductin12/Presentation_For_Church/releases/latest)
[![Platform](https://img.shields.io/badge/N%E1%BB%81n%20t%E1%BA%A3ng-macOS%20%7C%20Windows-blue)](https://github.com/ductin12/Presentation_For_Church/releases/latest)
[![Offline Ready](https://img.shields.io/badge/Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng-Offline%20100%25-success)](https://github.com/ductin12/Presentation_For_Church)

Ứng dụng trình chiếu chuyên nghiệp, hiện đại và siêu tốc dành cho nhà thờ — tích hợp sẵn quản lý bài hát, Kinh Thánh Tiếng Việt nhiều bản dịch, kho media động (video, ảnh nền) trọn gói offline, hệ thống mẫu style đa dạng và trình chiếu đa màn hình (Screen Live).

---

## 📥 Tải Về Phiên Bản Mới Nhất

Bạn có thể tải ngay bộ cài đặt tương ứng với hệ điều hành của mình từ mục [Releases](https://github.com/ductin12/Presentation_For_Church/releases/latest):

| Hệ điều hành | Loại tệp cài đặt | Mô tả |
| :--- | :--- | :--- |
| **macOS (Apple Silicon)** | `.dmg (arm64)` | Dành cho MacBook M1, M2, M3, M4 |
| **macOS (Intel)** | `.dmg (x64)` | Dành cho các dòng máy Mac chạy chip Intel |
| **Windows x64** | `Setup.exe` | Trình cài đặt tự động (Khuyên dùng, an toàn dữ liệu) |
| **Windows x64** | `Portable.exe` | Bản chạy trực tiếp không cần cài đặt |

---

## 🌟 Tính Năng Nổi Bật

- **Quản lý Thư viện Bài hát Siêu tốc**:
  - Tìm kiếm thông minh tức thì, hỗ trợ tiếng Việt có dấu và không dấu, tìm theo số thứ tự, tựa đề hoặc lời bài hát.
  - Tự động nhảy vào khung Preview xem trước toàn bộ các khổ thơ ngay khi bấm chọn bài.
  - Hỗ trợ nhập (Import) bài hát từ Word (`.docx`), Văn bản (`.txt`), JSON và xuất (Export) thư viện nhanh chóng.
- **Kinh Thánh Tiếng Việt & Đa Bản Dịch**:
  - Nạp sẵn các bản dịch phổ biến: Bản Phổ Thông, Bản Dịch Mới, Truyền Thống 1925, NIV Tiếng Anh,...
  - Bộ nhớ đệm dữ liệu JSON tạo sẵn giúp nạp 1,189 chương Kinh Thánh trong **20ms**.
  - Cơ chế tự động cuộn (Auto-scroll) và đánh dấu câu tra cứu chính xác trên cả màn hình Preview lẫn Live.
- **Hệ Thống Mẫu Trình Chiếu (Style Templates)**:
  - Tích hợp sẵn nhiều mẫu style chuẩn phụng vụ (`Yellow`, `White`, `Red`, `Blue`, `Navi`, `Orange`, `Black`).
  - Hỗ trợ đổi font chữ tùy chỉnh (`.ttf`, `.otf`), viền chữ phát sáng (text-stroke), đổ bóng đa lớp và hộp nền trong mờ (box-style).
- **Kho Media Offline 100%**:
  - Không phụ thuộc internet, tích hợp sẵn hàng chục video loop và hình ảnh nền chất lượng cao.
  - Cơ chế tải theo nhu cầu (Lazy Loading qua IntersectionObserver) giúp tiết kiệm 100% RAM và CPU khi duyệt kho media.
- **Trình Chiếu Đa Màn Hình (Screen Live)**:
  - Tự động nhận diện màn hình phụ/máy chiếu (HDMI, VGA, Không dây).
  - Tự động đưa nội dung ra toàn màn hình máy chiếu mà không ảnh hưởng tới cửa sổ điều khiển của người chỉnh.
  - Giữ cố định tiêu điểm thao tác, không bị mất icon trên Dock hay Command + Tab trên macOS.

---

## 📋 Nhật Ký Cập Nhật & Thay Đổi (Changelog Highlights)

> 💡 *Để xem toàn bộ chi tiết mã nguồn và lịch sử phát triển, vui lòng xem tệp [`changelog.md`](changelog.md).*

### 🚀 [2.1.2] - 2026-09-03
- **Giao diện & Trải nghiệm (UI/UX):** Khắc phục triệt để lỗi biểu tượng kính lúp và chữ `Search...` bị đè lên nhau tại ô tìm kiếm thư viện bài hát.
- **Tài liệu dự án:** Tích hợp trực tiếp bảng tổng hợp cập nhật Changelog vào `README.md` giúp người dùng dễ dàng theo dõi các phiên bản mới nhất ngay trên trang chủ GitHub.

### 🛡️ [2.1.1] - 2026-09-03
- **Ổn định macOS:** Khắc phục lỗi khi bấm *Screen Live* làm ẩn mất cửa sổ chính, biến mất icon trên thanh Dock và mất khỏi danh sách `Command + Tab`.
- **Tối ưu hiển thị:** Cửa sổ Screen Live mở ở chế độ `showInactive`, duy trì tiêu điểm và cửa sổ điều khiển luôn ở phía trước người vận hành.
- **Cấp độ nổi thông minh:** Tự động điều chỉnh cấp độ nổi (`alwaysOnTop`) theo số lượng màn hình kết nối.

### ⚡ [2.1.0] - 2026-09-03
- **Khởi động:** Loại bỏ hoàn toàn cảnh báo lỗi *"Cannot create BrowserWindow before app is ready"* khi khởi động ứng dụng trên macOS.
- **Đồng bộ đa nền tảng:** Xác thực đồng bộ 100% tất cả các tối ưu hóa và tính năng mới nhất trên cả hai hệ điều hành macOS và Windows.

### 🎨 [2.0.9] - 2026-09-03
- **Chuẩn hóa Icon Apple:** Tái tạo toàn bộ icon theo chuẩn Squircle của Apple macOS (bo góc mịn 185px, kênh Alpha trong suốt 100%, bóng đổ đa tầng tự nhiên).
- **Hỗ trợ Retina:** Biên dịch tệp `icon.icns` đa độ phân giải bằng Apple `iconutil`, giúp icon trên Dock, Command + Tab, Finder và Mission Control hiển thị sắc nét đồng nhất.

### 🏎️ [2.0.8] - 2026-09-03
- **Biên dịch CSS Tĩnh (Pre-compiled Tailwind CSS):** Thay thế trình biên dịch runtime `tailwindcss.js` nặng 409KB bằng tệp CSS tĩnh đã nén `tailwind.min.css` (49KB). Giảm thời gian vẽ lớn nhất (LCP) từ 31 giây xuống **dưới 0.2 giây**!
- **Giải phóng Bộ Giải Mã Video Phần Cứng:** Xóa bỏ thẻ nạp video đồng loạt trong kho media, triệt tiêu 122 kết nối mạng ngầm, giúp font chữ nạp trong 1ms và CPU giảm về 0%.

### 🚀 [2.0.7] - 2026-09-03
- **Triệt tiêu Màn hình Trắng khi Mở App:** Cấu hình cửa sổ với `show: false`, màu nền `#121121` và sự kiện `ready-to-show`.
- **Pre-built Bible Cache:** Tạo sẵn bộ nhớ đệm JSON 1,189 chương Kinh Thánh, nạp tức thì trong **20ms** thay vì phải phân tích XML mất 5-10 giây.
- **Lazy Loading Kinh Thánh:** Hoãn nạp Kinh Thánh ngầm sau 2 giây nhàn rỗi để ưu tiên mở ứng dụng mượt mà.

### 📦 [2.0.6] & [2.0.5] - 2026-09-03
- **Tự động hóa phát hành:** Tích hợp Skill đóng gói ứng dụng tự động (`pfc-release-workflow`) đồng thời cho Mac và Windows.
- **Xem trước bài hát tức thì:** Bổ sung tính năng tự động hiển thị bài hát vào khung Preview ngay khi click chuột vào danh sách thư viện.
- **Dọn dẹp dung lượng:** Tự động xóa các bản build cũ và file rác sau khi phát hành.

### 🌐 [2.0.4] & [2.0.3] - 2026-09-03
- **Chạy Offline 100%:** Chuyển đổi toàn bộ font chữ (Inter, Material Symbols) và thư viện từ CDN trực tuyến về lưu trữ cục bộ nội bộ, ứng dụng hoạt động hoàn hảo khi không có kết nối internet.

---

## 🛠️ Cài Đặt & Phát Triển (Development)

### Yêu cầu môi trường
- [Node.js](https://nodejs.org/) (khuyên dùng phiên bản v18 trở lên).
- Trình quản lý gói `npm`.

### Hướng dẫn cài đặt
```bash
# 1. Clone mã nguồn dự án
git clone https://github.com/ductin12/Presentation_For_Church.git

# 2. Truy cập thư mục dự án
cd Presentation_For_Church

# 3. Cài đặt các gói phụ thuộc
npm install

# 4. Chạy ứng dụng trong môi trường phát triển
npm start
```

### Đóng gói ứng dụng (Build Release)
```bash
# Đóng gói tự động cho cả macOS (.dmg) và Windows (.exe):
npm run build:all

# Hoặc đóng gói riêng cho từng hệ điều hành:
npm run build:mac   # macOS ARM64 & x64
npm run build:win   # Windows Setup & Portable
```

---

## 📖 Tài Liệu Tham Khảo

Toàn bộ tài liệu quy chuẩn kỹ thuật nằm trong thư mục `docs/`:
- [`docs/README.md`](docs/README.md) - Mục lục tài liệu kỹ thuật
- [`docs/architecture.md`](docs/architecture.md) - Kiến trúc hệ thống và luồng dữ liệu
- [`docs/rules.md`](docs/rules.md) - Các quy tắc phát triển bắt buộc
- [`docs/debugging-playbook.md`](docs/debugging-playbook.md) - Cẩm nang xử lý lỗi và debug
- [`docs/feature-workflow.md`](docs/feature-workflow.md) - Quy trình thêm tính năng mới
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) - Quy chuẩn thiết kế giao diện UI/UX
- [`changelog.md`](changelog.md) - Toàn văn nhật ký thay đổi qua từng phiên bản

---

## 📄 Bản Quyền & Giấy Phép

Phần mềm được phát triển phục vụ cho công tác thờ phượng và các hoạt động của Hội Thánh Chúa. Mọi đóng góp phát triển đều được hoan nghênh.
