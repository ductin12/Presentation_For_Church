# Changelog - BlessingChurch Presentation App

Tất cả các thay đổi và cập nhật quan trọng của dự án được ghi lại tại đây.

## [1.1.0] - 2026-05-11

### Đã thêm (Added)
- **Hệ thống Cài đặt (Global Settings):**
    - Thêm mục "Settings" vào menu File của Electron.
    - Hộp thoại Cài đặt hệ thống cho phép tùy chỉnh: Giao diện (Dark/Light), Font chữ mặc định, Kích thước chữ, Màu sắc, Căn lề.
    - Cấu hình phím tắt (Keyboard Shortcuts) cho Slide tiếp theo, Slide trước đó và Xóa màn hình nhanh (Clear).
    - Lưu trữ cài đặt bền vững trong file `settings.json`.
- **Quản lý Media linh hoạt:**
    - Cho phép chọn thư mục Media tùy ý trong Settings.
    - Tự động copy file media vào thư mục đã chọn khi Import.
    - Tự động quét và hiển thị toàn bộ media từ thư mục cấu hình mỗi khi khởi động.
- **Trải nghiệm Kinh Thánh mới (Direct Bible Access):**
    - Liệt kê trực tiếp toàn bộ Chương Kinh Thánh trong thư viện sidebar (tương tự như Bài hát).
    - Thêm ô chọn bản dịch (Version selector) ngay trong tab Bible.
    - Hỗ trợ tìm kiếm nội dung câu gốc trực tiếp từ thanh Search thư viện.
- **Nút Import thông minh:**
    - Tự động chuyển đổi giữa "IMPORT SONG" và "IMPORT BIBLE" tùy theo tab đang chọn.
    - Hỗ trợ import trực tiếp dữ liệu bài hát từ file `.json` và bản dịch Kinh Thánh từ file `.xml`.

### Đã sửa (Fixed)
- **Lỗi hiển thị dữ liệu:** Sửa lỗi cú pháp trong `index.html` gây mất danh sách bài hát và Kinh Thánh.
- **Lỗi lưu trữ Import:** Dữ liệu import hiện đã được ghi đè bền vững vào `songs.json` trong `userData`.
- **Độ tin cậy Bible:** Nâng cấp bộ phân tích XML (Regex) mạnh mẽ hơn, hỗ trợ nhiều định dạng và tự động sửa lỗi cache.
- **Cải tiến tìm kiếm:** Gộp 2 khung tìm kiếm thành 1 khung duy nhất, hỗ trợ tìm kiếm linh hoạt hơn (chứa từ khóa thay vì chỉ bắt đầu bằng).
- **Khôi phục giao diện:** Sửa lỗi vô tình xóa mất hộp thoại chọn Kinh Thánh trong các phiên bản cập nhật trước.


### Thay đổi (Changed)
- **Cơ chế ưu tiên Style:** Cập nhật logic hiển thị để ưu tiên Style riêng của từng bài hát, nếu không có sẽ tự động lấy thông số mặc định từ Settings hệ thống.
- **Dữ liệu bài hát:** Import thành công 286 bài hát từ `data/songs.json` vào cơ sở dữ liệu chính của ứng dụng.

---
*Ghi chú: Phiên bản này tập trung vào tính ổn định của dữ liệu và trải nghiệm người dùng trong việc cấu hình hệ thống.*
