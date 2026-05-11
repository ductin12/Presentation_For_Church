# EasyWorship App

Ứng dụng trình chiếu cho nhà thờ — quản lý bài hát, Kinh Thánh (Tiếng Việt), media và lịch trình thờ phượng.

## Tính năng

- Quản lý thư viện bài hát (thêm, sửa, xóa)
- Tra cứu Kinh Thánh Tiếng Việt
- Quản lý media (ảnh, video) làm background
- Lịch trình thờ phượng (Schedule) với drag & drop
- Trình chiếu trực tiếp qua Screen Live (HDMI/VGA)
- Tùy chỉnh font, màu sắc, kích thước text
- Lưu/mở file schedule (.bcsch)

## Git Clone Project
```bash
git clone https://github.com/PhuocTDT/Presentation_For_Church.git
```

## Cài đặt và chạy

```bash
cd Presentation_For_Church
npm install
npm start
```

### Xử lý lỗi thường gặp

**1. Lỗi timeout khi `npm install` (ETIMEDOUT):**
Nếu bạn gặp lỗi mạng khi cài đặt, hãy thử sử dụng registry mirror tại Việt Nam/Châu Á:
```bash
npm install --registry=https://registry.npmmirror.com
```

**2. Lỗi không tìm thấy package.json (ENOENT):**
Hãy chắc chắn bạn đã vào đúng thư mục dự án trước khi chạy lệnh:
```bash
cd Presentation_For_Church
```

## Yêu cầu

- [Node.js](https://nodejs.org/) (v18+)
