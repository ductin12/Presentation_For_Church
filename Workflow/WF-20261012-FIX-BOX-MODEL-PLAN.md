# KẾ HOẠCH KỸ THUẬT: SỬA LỖI VỠ LAYOUT BOX MODEL & TRIỆT TIÊU THANH CUỘN NGANG TRONG SETTINGS MODAL

**Mã Kế Hoạch:** `WF-20261012-FIX-BOX-MODEL-PLAN`  
**Ngày lập:** 12/10/2026  
**Chế độ:** READ-ONLY / CHỜ DUYỆT TỪ TELEGRAM  
**Mục tiêu:** Tái thiết kế khối Box Model trong Tab 2 (Trình chiếu & Slide) thành mô hình 2 hình chữ nhật đồng tâm chuẩn DevTools, cân đối đối xứng 4 hướng, triệt tiêu 100% thanh cuộn ngang ở đáy Modal; bảo toàn 100% các ID nhập liệu.

---

## 1. Hiện Trạng & Nguyên Nhân Lỗi
1. **Lệch trục & tràn viền:** Sử dụng `w-full` kết hợp `justify-between` khiến ô `Phải: [ 0 ]` bị đẩy tràn ra khỏi mép viền bên phải của thẻ card.
2. **Thanh cuộn ngang xuất hiện ở đáy:** Việc tràn viền phía trên kích hoạt thuộc tính `overflow` của container, làm xuất hiện thanh cuộn ngang màu xám dài ở đáy Modal làm mất thẩm mỹ.
3. **Méo khung Padding:** Hai ô Trái và Phải của `PADDING TRONG` bị dính chùm vào nhau ở giữa vì thiếu lõi trung tâm đại diện cho "Văn bản Slide".

---

## 2. Giải Pháp Tối Ưu
- **Cố định kích thước & Căn giữa:** Khung Box Model sử dụng `max-w-[340px] mx-auto` để đảm bảo luôn nằm gọn gàng ở giữa, không bao giờ gây tràn viền hay xuất hiện thanh cuộn ngang.
- **Bố cục 2 Hộp đồng tâm chuẩn:**
  * **Hộp ngoài (MARGIN):** Đường viền nét đứt màu xám nhạt, 4 ô Trên - Trái - Phải - Dưới nằm đều và cân đối ở 4 cạnh.
  * **Hộp trong (PADDING):** Khung nền xanh dương nhạt bo góc, 4 ô Trên - Trái - Phải - Dưới bao quanh lõi trung tâm.
  * **Lõi trung tâm:** Ô nhỏ ghi nhãn `[ TEXT ]` đại diện cho nội dung văn bản.
- **Bảo toàn 100% DOM IDs:** Giữ nguyên các ID `settings-margin-top/bottom/left/right` và `settings-padding-top/bottom/left/right`.

---

## 3. Lộ Trình Thực Thi
- **Bước 1:** Sao lưu an toàn mã nguồn.
- **Bước 2:** Cập nhật lại HTML Box Model trong `index.html`.
- **Bước 3:** Chạy bộ test suite tự động `Workflow/test-settings-modal-visual-suite.js` và `test-system-ux-suite.js` (yêu cầu 100% Pass).
- **Bước 4:** Gửi báo cáo nghiệm thu hoàn tất về Telegram.

---
👉 **LỆNH DUYỆT TỪ XA:** Bạn chỉ cần gửi tin nhắn **`duyệt`** hoặc **`ok`** trên Telegram để hệ thống tự động kích hoạt thực thi!
