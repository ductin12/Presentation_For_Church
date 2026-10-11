# Kiến Trúc Hệ Thống (Architecture v2.2.0)

## 1. Tổng quan Kiến trúc

Presentation For Church (PFC) là ứng dụng desktop xây dựng trên nền tảng Electron 41 phục vụ trình chiếu thánh ca, Kinh Thánh và media cho nhà thờ. Ứng dụng hoạt động theo kiến trúc **Hai cửa sổ độc lập (Dual-Window Architecture)**:

```
┌───────────────────────────────────────┐
│     OPERATOR WINDOW (index.html)      │  (Cửa sổ điều khiển chính cho người vận hành)
│  Library, Schedule, Editor, Controls  │
└──────────────────┬────────────────────┘
                   │
                   ▼ window.electronAPI (preload.js)
┌───────────────────────────────────────┐
│        MAIN PROCESS (main.js)         │  (Node.js native runtime, File I/O, IPC Bus)
│  IPC Handlers, Protocol, Safe-Write   │
└──────────────────┬────────────────────┘
                   │
                   ▼ webContents.send('live-update-*')
┌───────────────────────────────────────┐
│       LIVE WINDOW (live.html)         │  (Cửa sổ máy chiếu: Canvas 960x540, Fullscreen)
│   Double-buffer crossfade, Zero-logic │
└───────────────────────────────────────┘
```

---

## 2. Phân công Trách nhiệm Files (File Responsibilities)

| File | Trách nhiệm trong hệ thống |
| :--- | :--- |
| `index.html` | **Operator Monolith (~9.200 dòng):** Quản lý toàn bộ UI, state thư viện bài hát, Kinh Thánh, lịch chiếu, modal soạn thảo bài hát, preview scaling và bộ điều khiển phát Live. |
| `main.js` | **Main Process (~2.200 dòng):** Vòng đời Electron, tạo cửa sổ, quản lý 42 IPC handlers, safe-write với cơ chế xoay vòng 3 bản sao lưu (`.backup.1/2/3`), giao thức `app-media://`, quản lý màn hình phụ và điều phối phím tắt menu. |
| `preload.js` | **Cầu nối bảo mật (Context Bridge):** Expose an toàn `window.electronAPI` sang renderer, không bật `nodeIntegration` trong renderer. |
| `live.html` | **Cửa sổ trình chiếu (~650 dòng):** Virtual canvas 960×540 (16:9), double-buffer crossfade (`buffer-a`, `buffer-b`) chống giật hình, tự động fit font chữ theo box. Hoàn toàn bị động, chỉ nhận dữ liệu hiển thị từ IPC. |

### CẢNH BÁO MÃ MỒ CÔI (DEAD CODE):
- `src/schema.js`: File thử nghiệm cũ, **KHÔNG ĐƯỢC IMPORT** ở bất kỳ đâu. Toàn bộ logic validation và migration nằm trực tiếp trong `main.js` và `index.html`.
- `edit-song.html`: Giao diện cũ, không sử dụng. Giao diện Song Editor thật sự nằm trong `song-editor-modal` tại `index.html`.
- `src/js/core.js` và `src/js/utils.js`: File nháp, không được nạp vào app.

---

## 3. Quản lý Dữ liệu và Lưu trữ (UserData Persistence)

Dữ liệu của người dùng được lưu trữ độc lập tại thư mục `app.getPath('userData')`:
- macOS: `~/Library/Application Support/Presentation For Church/`
- Windows: `%APPDATA%\Presentation For Church\`

### Các tệp dữ liệu chính:
- `songs.json`: Danh mục bài hát thánh ca của người dùng.
- `settings.json`: Cấu hình hệ thống toàn cục (Typography, phím tắt, style mặc định, tỷ lệ nút...).
- `style-templates.json`: Mẫu định dạng slide (font, cỡ chữ, viền, khung box, lề đệm).
- `bible-versions.json`: Danh sách các bản dịch Kinh Thánh đang cài đặt.
- `custom-fonts.json`: Phông chữ tùy chỉnh do người dùng nạp vào.
- `media/`: Thư mục lưu trữ hình ảnh và video làm nền slide.
- `bible-versions/`: Thư mục chứa các file XML Kinh Thánh import thêm.
- `bible-cache-*.json`: Dữ liệu Kinh Thánh đã parse dạng JSON để tăng tốc khởi động.
- `*.backup.1`, `*.backup.2`, `*.backup.3`: Các bản sao lưu tự động xoay vòng an toàn.

---

## 4. Giao thức Truyền thông & Media Protocol

- **Media Protocol (`app-media://`):** File media trong `userData/media/` được nạp qua protocol riêng `app-media://<encodeURIComponent(fileName)>` để đảm bảo an toàn sandbox và bảo mật CSP.
- **Double-Buffer Background Crossfade:** Cửa sổ Live có 2 lớp đệm `buffer-a` và `buffer-b`. Khi đổi background, lớp tiếp theo được nạp ngầm và mờ dần vào (crossfade opacity), lớp cũ ẩn đi sau 500ms giúp trình chiếu mượt mà không chớp đen.
- **Virtual Canvas Matrix:** Canvas chuẩn 960×540 (16:9). Hàm `scaleVirtualCanvas()` tự động tính toán `scale` theo kích thước container thực tế, đảm bảo tỷ lệ hiển thị trên màn hình điều khiển và máy chiếu đồng nhất 100%.
