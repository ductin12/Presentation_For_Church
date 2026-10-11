# Quy Tắc Kỹ Thuật Bắt Buộc (Engineering Standards)

Tài liệu này chi tiết hóa các chuẩn mực kỹ thuật cho mọi thay đổi mã nguồn trong Presentation For Church:

## 1. Nguyên Tắc Sống Còn (Core Invariants)
1. **Kiểm tra trạng thái Git trước khi làm việc:** Không ghi đè hoặc revert thay đổi chưa commit của người dùng.
2. **Khu vực cấm (Dead Code Isolation):** Tuyệt đối không chỉnh sửa `src/schema.js`, `edit-song.html`, `src/js/core.js`, `src/js/utils.js`.
3. **Cách ly Workspace `web/`:** Thư mục `web/` là Next.js độc lập, không can thiệp khi đang làm app Electron.
4. **Bảo toàn dữ liệu người dùng (`userData`):** Mọi thay đổi về cấu trúc JSON phải có fallback hoặc migration an toàn trong `main.js`.
5. **Đồng bộ IPC 3 điểm:** Mọi thay đổi về IPC phải cập nhật đồng thời ở `main.js` (`ipcMain.handle`), `preload.js` (`contextBridge`) và `index.html`.
6. **Kiểm tra hai cửa sổ:** Mọi thay đổi về hiển thị phải kiểm tra cả màn hình Operator (`index.html`) và màn hình chiếu (`live.html`).

## 2. Tiêu Chuẩn "Hoàn Thành" (Definition of Done - DoD)
Một task chỉ được coi là hoàn thành khi:
- Mã nguồn đã được sửa phẫu thuật đúng phạm vi cho phép.
- Có bản sao lưu an toàn tại `Workflow/backup-*`.
- Có nhật ký hành động tại `Workflow/WF-*-EXECUTION-LOG.md`.
- Đã viết và chạy file test suite tự động `Workflow/test-*.js` đạt **100% PASS**.
- `node --check main.js` và `node --check preload.js` không có lỗi cú pháp.
- Đã cập nhật `changelog.md`.
- Đã lập Biên bản Nghiệm thu kèm Đề xuất cho PM tại `Workflow/WF-*-ACCEPTANCE-REPORT.md`.
