---
name: pfc-release-workflow
description: >-
  Quy trình tự động hóa toàn diện cho việc đóng gói, cập nhật tài liệu, build và phát hành (release) phiên bản mới của ứng dụng Presentation For Church (PFC).
  Kích hoạt skill này khi người dùng yêu cầu:
  - "release phiên bản mới", "phát hành bản mới", "publish release", "PR ngay"
  - "viết changelog, update readme, đóng gói ứng dụng cho mac và win, cập nhật lên github và release"
  - "đóng gói và push release"
  - "tạo bản release mới lên github"
---
# PFC Release & Publishing Workflow

Skill này cung cấp quy trình chuẩn hóa và tự động hóa từng bước để đóng gói, cập nhật phiên bản, tạo tài liệu, build bộ cài đặt cho cả macOS và Windows, rồi phát hành lên GitHub Release.

---

## 📋 Các Bước Thực Hiện Chuẩn

### Bước 1: Kiểm Tra Cú Pháp & Kiểm Thử Nhanh (Preflight Check)

Trước khi nâng version và build, đảm bảo toàn bộ mã nguồn không có lỗi cú pháp để tránh lỗi runtime:

```bash
# 1. Kiểm tra cú pháp main.js
node --check main.js

# 2. Kiểm tra cú pháp các thẻ script trong index.html
node -e '
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const matches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
matches.forEach((m, i) => {
  const code = m[1].trim();
  if (!code) return;
  const tmp = `__tmp_test_${i}.js`;
  fs.writeFileSync(tmp, code);
  try {
    require("child_process").execSync(`node --check ${tmp}`);
  } catch (e) {
    console.error(`Script ${i} syntax error!`);
    process.exit(1);
  } finally {
    fs.unlinkSync(tmp);
  }
});
console.log("All scripts passed syntax check!");
'
```

---

### Bước 2: Nâng Số Phiên Bản Trong `package.json`

1. Đọc trường `"version"` hiện tại trong `package.json`.
2. Tăng số phiên bản tương ứng (thường là patch hoặc minor, ví dụ `2.0.6` -> `2.0.7`).
3. Cập nhật trường `"version"` trong `package.json`.

---

### Bước 3: Cập Nhật Tài Liệu (`changelog.md` & `README.md`)

1. Mở `changelog.md` và thêm đề mục phát hành mới nhất lên đầu danh sách:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### Đã sửa & Cải tiến (Fixed & Improved)
   - Tóm tắt các thay đổi, sửa lỗi, tính năng mới hoặc tối ưu hóa vừa thực hiện...
   ```
2. Kiểm tra và đồng bộ số phiên bản trong `README.md` nếu cần.

---

### Bước 4: Đóng Gói Ứng Dụng Cho macOS & Windows (Build)

Chạy lệnh build trọn gói cho cả macOS (Apple Silicon arm64 + Intel x64) và Windows (Setup NSIS + Portable):

```bash
npm run build:all
```

*(Nếu cần tiết kiệm thời gian hoặc người dùng chỉ yêu cầu 1 hệ điều hành, có thể dùng `npm run build:mac` hoặc `npm run build:win`).*

---

### Bước 5: Dọn Dẹp Dung Lượng Đĩa

Xóa các thư mục giải nén tạm và các tệp build của phiên bản cũ hơn trong `dist/` để tiết kiệm dung lượng ổ cứng:

```bash
# Xóa thư mục giải nén tạm thời
rm -rf dist/mac dist/mac-arm64 dist/win-unpacked

# Xóa các file build của các version cũ hơn
# (Chỉ giữ lại file của version X.Y.Z vừa build)
```

---

### Bước 6: Git Commit & Đẩy Lên GitHub

Lưu lại toàn bộ mã nguồn, tài liệu và cấu hình mới vào nhánh `main`:

```bash
git add -A
git commit -m "release: vX.Y.Z - <tóm tắt ngắn gọn>"
git push origin main
```

---

### Bước 7: Tự Động Tạo GitHub Release & Tải Lên 4 Bộ Cài Đặt

Chạy kịch bản tự động hóa đi kèm skill:

```bash
node .agents/skills/pfc-release-workflow/scripts/publish-release.js
```

Kịch bản này sẽ:

1. Đọc số version mới từ `package.json`.
2. Trích xuất ghi chú phát hành tương ứng từ `changelog.md`.
3. Tự động lấy GitHub token an toàn từ hệ thống (Keychain).
4. Tạo GitHub Release với thẻ `vX.Y.Z`.
5. Upload trực tiếp cả 4 bộ cài đặt:
   - `Presentation.For.Church.macOS.arm64.X.Y.Z.dmg`
   - `Presentation.For.Church.macOS.x64.X.Y.Z.dmg`
   - `Presentation.For.Church.Setup.X.Y.Z.exe`
   - `Presentation.For.Church.Portable.X.Y.Z.exe`
6. Tự động dọn dẹp các tệp tạm trong `dist/`.

---

### Bước 8: Báo Cáo Kết Quả Cho Người Dùng

Cung cấp bảng tổng kết rõ ràng bao gồm:

- Số phiên bản mới phát hành.
- Tóm tắt các tính năng/sửa lỗi chính.
- Đường dẫn trực tiếp tới GitHub Release.
- Danh sách 4 tệp cài đặt kèm dung lượng.
