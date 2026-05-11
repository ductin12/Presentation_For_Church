# Chuẩn Giao Diện

## Nguyên tắc theo cửa sổ

### `index.html`

- Là cửa sổ operator
- Dùng phong cách hiện đại, dark-ish, dense
- Ưu tiên tốc độ thao tác và mật độ thông tin

### `edit-song.html`

- Là modal/chỉnh sửa
- Dùng phong cách Windows cổ điển, Tahoma, controls nhỏ
- Không kéo phong cách hiện đại vào đây

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
