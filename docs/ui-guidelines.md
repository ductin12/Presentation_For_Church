# Chuẩn Giao Diện

## Nguyên tắc theo cửa sổ

### `index.html` (Operator Window & Modals)

- Là cửa sổ chính điều khiển toàn bộ ứng dụng (Operator Window) và chứa các Modal chức năng (Settings, Edit Song, Style Templates, Shortcuts).
- Dùng phong cách hiện đại, dark-ish, mật độ thông tin cao (dense), trực quan và phản hồi tức thì.
- Ưu tiên tốc độ thao tác và khả năng quan sát nhanh trong môi trường ánh sáng phòng máy chiếu.

### `live.html`

- Là màn hình chiếu
- Tối giản, đen, không chrome
- Chữ và background phải đọc được từ xa

## Virtual canvas

- Live/preview nên giữ logic canvas 16:9 ổn định
- Không tự ý đổi kích thước logic nếu chưa test scale
- Text box và background phải kiểm tra ở màn hình phụ thật

## Typography và màu

- Chỉ đổi font khi có lý do rõ ràng
- Không làm mất tính tương phản của text trên nền media
- Tránh đưa style riêng lẻ không có token hoặc quy tắc

## Khi chỉnh layout

- Giữ khoảng cách thao tác đủ lớn cho live use
- Tránh làm UI cần quá nhiều click
- Kiểm tra trạng thái hover, focus, active nếu có control mới

## Chuẩn hóa Form Controls & Trực quan hóa (Visual-First Standards)

Mọi Modal cấu hình và bảng điều khiển phải tuân thủ ma trận chuẩn hóa tương tác sau:
- **Lựa chọn 2 trạng thái (On/Off, Bật/Tắt):** Bắt buộc dùng iOS-style Toggle Switch. Tuyệt đối không dùng dropdown `<select>`.
- **Lựa chọn 2 - 4 giá trị rời rạc:** Dùng Segmented Pill Buttons (Nút phân đoạn) với trạng thái active tương phản rõ ràng.
- **Căn lề / Phương hướng:** Dùng Icon Button Groups (`[ ⇤ ] [ ≡ ] [ ⇥ ]`).
- **Kích thước số (px, cỡ nút, cỡ chữ):** Kết hợp Preset Pills định sẵn (1-chạm) + Thanh Slider trượt + Ô nhập số + Live Preview hiển thị thay đổi realtime.
- **Lựa chọn màu sắc:** Dùng Color Swatch tròn dạng nút bấm trực quan.
- **Tối giản văn bản (Minimalist UI):** Càng ít chữ càng tốt. Thay thế đoạn văn bản giải thích dài dòng bằng Icon nhận diện và Tooltip hover nhẹ nhàng.
