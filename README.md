# Presentation For Church (EasyWorship App) - v2.0.1

Ứng dụng trình chiếu chuyên nghiệp dành cho nhà thờ — quản lý bài hát, Kinh Thánh Tiếng Việt, kho media (video, ảnh nền) và lịch trình thờ phượng. Phiên bản mới nhất **2.0.1** được tinh chỉnh tối đa về hiệu năng, dung lượng nhẹ gọn và có sẵn trình cài đặt cho hệ điều hành Windows x64.

## Tài liệu chuẩn

Các tài liệu vận hành và quy ước phát triển nằm trong `docs/`:

- `docs/README.md` - Trang mục lục
- `docs/architecture.md` - Kiến trúc và luồng dữ liệu
- `docs/rules.md` - Quy tắc làm việc bắt buộc
- `docs/debugging-playbook.md` - Quy trình debug
- `docs/feature-workflow.md` - Quy trình thêm tính năng
- `docs/ui-guidelines.md` - Chuẩn giao diện
- `docs/data-contracts.md` - Chuẩn dữ liệu và migration
- `changelog.md` - Nhật ký toàn bộ các thay đổi qua từng phiên bản

## Tính năng Nổi bật (v2.0.1)

- **Quản lý Thư viện Bài hát**: Thêm, sửa, xóa, tìm kiếm thông minh có hỗ trợ từ khóa/alias và xuất thư viện ra JSON.
- **Tra cứu & Trình chiếu Kinh Thánh Tiếng Việt Thông minh**: Tích hợp nhiều bản dịch phổ biến (Bản Dịch Mới, Bản Phổ Thông, 1925, English NIV...). Khi tìm kiếm từ khóa, hệ thống tự động nhận diện và hiển thị rõ số câu (vd: `Thi Thiên 92:12`), đồng thời tự động cuộn (auto-scroll) và chọn đúng câu Kinh Thánh đó trên cả màn hình điều khiển Preview lẫn Live khi đưa vào danh sách trình chiếu.
- **Hệ thống Style Templates (Mới)**:
  - Tích hợp sẵn **7 mẫu Style trình chiếu chuẩn đẹp** (`Yellow`, `White`, `Red`, `Blue`, `Navi`, `Orange`, `Black`).
  - Hỗ trợ tải lên và sử dụng các font chữ tùy chỉnh (`.ttf`, `.otf`), tùy biến khung nền (boxStyle), độ dày viền chữ (textStroke) và căn lề linh hoạt.
- **Kho Media Offline Siêu Nhẹ & Mượt mà (Mới)**:
  - Bộ cài đặt gọn nhẹ (chỉ **~126 MB**), đã tích hợp trọn gói kho media offline video & ảnh nền sống động, thẩm mỹ cao.
  - **Tự động Import ngầm khi chạy lần đầu**: Cơ chế bất đồng bộ không gây đơ/lag máy, kèm thanh thông báo phần trăm (%) tiến trình ngay trên góc giao diện.
- **Lịch trình Thờ phượng (Schedule)**: Kéo thả linh hoạt, hỗ trợ lưu/mở tập tin lịch trình (`.bcsch`), tối ưu hiển thị thumbnail tĩnh giúp ứng dụng chạy nhẹ.
- **Trình chiếu Đa màn hình (Screen Live)**: Tự động kết xuất ra màn hình phụ (HDMI/VGA), điều khiển dễ dàng bằng phím tắt tùy chỉnh và cơ chế hiển thị màn hình kép monitor.

## Trình Cài Đặt & Gỡ Cài Đặt (Windows x64)

Phiên bản **v2.0.1** xuất xưởng 2 dạng bộ cài chuẩn tại thư mục `dist/` sau khi build:
1. **`Presentation.For.Church.Setup.2.0.1.exe` (~126 MB - Khuyên Dùng)**:
   - Bản cài đặt trọn gói offline cho máy Windows x64.
   - Tự động tạo Shortcut trên Desktop và Start Menu.
   - **Trình gỡ cài đặt (Uninstaller) an toàn dữ liệu**: Khi gỡ phần mềm khỏi máy tính, ứng dụng sẽ có hộp thoại thông báo hỏi bạn có muốn xóa hay giữ lại toàn bộ dữ liệu (danh sách bài hát, media, cấu hình) hay không. Mặc định trỏ sẵn nút **"No"** (Giữ lại dữ liệu) để bạn an tâm nâng cấp.
2. **`Presentation.For.Church.Portable.2.0.1.exe` (~106 MB)**:
   - Bản rút gọn chạy thẳng trực tiếp không cần cài đặt vào hệ thống (Portable).

## Đóng gói ứng dụng (Build & Release)

Dự án sử dụng `electron-builder` để tạo bộ cài. Để tiến hành biên dịch ứng dụng ra file `.exe` (hoặc `.dmg` cho macOS), chạy lệnh:

```bash
# Đóng gói ra bản cài đặt cho Windows x64 (.exe)
npm run build:win

# Đóng gói ra bản cho macOS (.dmg)
npm run build:mac
```

Tập tin bộ cài đặt sau khi hoàn thiện sẽ nằm trong thư mục `dist/`.

## Git Clone Project
```bash
git clone https://github.com/ductin12/Presentation_For_Church.git
```

## Cài đặt và Chạy môi trường Dev

```bash
cd Presentation_For_Church
npm install
npm start
```

### Xử lý lỗi thường gặp khi Dev / Cài đặt

**1. Lỗi timeout khi `npm install` (ETIMEDOUT):**
Nếu bạn gặp lỗi mạng khi cài đặt các gói phụ thuộc, hãy thử sử dụng registry mirror tại khu vực Châu Á:
```bash
npm install --registry=https://registry.npmmirror.com
```

**2. Lỗi không tìm thấy package.json (ENOENT):**
Hãy chắc chắn bạn đã truy cập đúng vào thư mục của dự án trước khi thực hiện lệnh:
```bash
cd Presentation_For_Church
```

## Yêu cầu Hệ thống

- [Node.js](https://nodejs.org/) (v18+ cho môi trường lập trình/build)
- Hệ điều hành: Windows 10/11 (x64) hoặc macOS (ARM/Intel).
