# Quy Trình Thêm Tính Năng

## Mẫu chung

1. Xác định tính năng chạm vào phần nào: data, IPC, renderer, live, settings hay media.
2. Liệt kê file cần sửa trước khi code.
3. Sửa theo thứ tự từ dưới lên:
   - data/schema
   - main process / IPC
   - preload
   - renderer / live UI
   - docs
4. Chạy thử luồng liên quan.

## Nếu là tính năng dữ liệu

- Sửa contract trong `src/schema.js`
- Cập nhật migrate để đọc được dữ liệu cũ
- Lưu và load qua `main.js`
- Kiểm tra file trong `userData`

## Nếu là tính năng UI

- Giữ đúng kiểu giao diện của cửa sổ đó
- Không trộn styling giữa operator, editor và live
- Nếu đổi canvas/text layout, test ở tỉ lệ 16:9

## Nếu là tính năng IPC

- Đặt tên method rõ ràng, nhất quán
- Expose tối thiểu cần thiết ở `preload.js`
- Không đưa logic nghiệp vụ vào preload

## Nếu là tính năng live

- Kiểm tra content update và background update riêng
- Kiểm tra clear state
- Kiểm tra màn hình phụ và fullscreen behavior

## Nếu là tính năng import/export

- Xác định format file
- Xử lý lỗi parse rõ ràng
- Không ghi file trực tiếp nếu chưa qua backup/safe write
