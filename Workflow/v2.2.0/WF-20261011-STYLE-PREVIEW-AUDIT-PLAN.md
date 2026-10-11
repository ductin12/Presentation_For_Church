# BIÊN BẢN AUDIT & KẾ HOẠCH HÀNH ĐỘNG TOÀN DIỆN (COMPREHENSIVE AUDIT & PLAN)
**Mã hồ sơ:** `WF-20261011-STYLE-PREVIEW-AUDIT-PLAN`  
**Thời gian tạo:** 2026-10-11T22:30:00+07:00  
**Người thực hiện:** Antigravity AI Assistant & Operator Pair  
**Trạng thái:** `DRAFT_PENDING_APPROVAL` (Bản dự thảo đệ trình người dùng phê duyệt — Chưa tác động mã nguồn sản phẩm)  
**Mục tiêu:** 
1. Tái thiết kế logic phân cấp Style hệ thống (Global Settings vs Song Custom Style vs Style Templates vs Instant Live Sync).
2. Sửa lỗi triệt để màn hình Preview trong Style Templates Manager bị vỡ tỷ lệ và lệch chuẩn so với máy chiếu thực tế.

---

## MỤC LỤC
1. [PHẦN I: AUDIT KỸ THUẬT TOÀN DIỆN (TECHNICAL, UX & DATA AUDIT)](#phần-i-audit-kỹ-thuật-toàn-diện)
   - 1.1 Audit Codebase, Database & Cấu trúc Dự án
   - 1.2 Audit UX/UI & Trải nghiệm Người vận hành Hội Thánh
   - 1.3 Audit Tính Bảo Mật, Tính Logic, Tính An Toàn & Tính Thống Nhất
2. [PHẦN II: 5 VÒNG QA, AUDIT, PHẢN BIỆN & TESTING ĐA CHIỀU](#phần-ii-5-vòng-qa-audit-phản-biện--testing-đa-chiều)
   - Vòng 1: Mổ xẻ cơ chế gây lỗi (Root Cause & Failure Mechanics)
   - Vòng 2: Phản biện kịch bản vận hành thực chiến tại Nhà thờ (Real-World Operational Stress)
   - Vòng 3: Giải quyết triệt để xung đột Logic Master Toggle vs Style Template
   - Vòng 4: Thiết kế luồng dữ liệu chuẩn (Reactive Flow & Single Source of Truth)
   - Vòng 5: Kịch bản kiểm thử & xác minh nghiêm ngặt (Test Matrix & Regression Plan)
3. [PHẦN III: KẾ HOẠCH HÀNH ĐỘNG TỐI ƯU (THE OPTIMAL EXECUTION PLAN)](#phần-iii-kế-hoạch-hành-động-tối-ưu)
   - Giai đoạn 1: Chuẩn hóa Container & Tỷ lệ Preview Style Templates
   - Giai đoạn 2: Phân tách phân cấp Logic Style (Hierarchy & Enforce Flag Isolation)
   - Giai đoạn 3: Mở khóa Nút Apply cho Thư viện & Thêm Chế độ "Apply to Live"
   - Giai đoạn 4: Kiểm thử, Tinh chỉnh Visual & Đóng gói Bản phát hành
4. [PHẦN IV: ĐỀ XUẤT PHÊ DUYỆT (SUBMISSION FOR USER APPROVAL)](#phần-iv-đề-xuất-phê-duyệt)

---

## PHẦN I: AUDIT KỸ THUẬT TOÀN DIỆN

### 1.1 Audit Codebase, Database & Cấu trúc Dự án
- **Vị trí tệp tin liên quan:**
  - `data/style-templates.json` & `%userData%/style-templates.json`: Lưu trữ danh sách mẫu (mỗi template gồm `id`, `name`, `scope`: `'song'|'bible'|'both'`, và đối tượng `style`).
  - `main.js` (dòng 356-380, 827-855, 1356-1376): Quản lý file I/O an toàn qua `safeWriteSync`, cache bộ nhớ `_cachedStyleTemplates`, IPC handles: `load-style-templates`, `save-style-template`, `delete-style-template`, `duplicate-style-template`.
  - `preload.js` (dòng 9-12): Expose bridge IPC an toàn cho Renderer qua `window.electronAPI`.
  - `index.html` (monolith ~8860 dòng): Chứa toàn bộ giao diện điều khiển, modal quản lý style template, hàm scale canvas `scaleVirtualCanvas`, hàm chuẩn hóa style `normalizeSlideStyle`, luồng Preview và Live.
  - `live.html`: Cửa sổ chiếu nhận payload qua IPC `onLiveUpdateContent` và apply style lên text layer ảo 960×540.
- **Thực trạng dữ liệu:**
  - Schema của `style` trong template hoàn toàn tương thích với schema slide chuẩn (`fontFamily`, `fontSize`, `color`, `textStrokeWidth`, `textStrokeColor`, `textMargin`, `textPadding`, `boxStyle`, `textBox`).
  - Tuy nhiên, luồng nạp và áp dụng style giữa Schedule, Thư viện và Live window bị phân mảnh, chưa có một Dispatcher tập trung để điều phối style khi người dùng thao tác nhanh.

### 1.2 Audit UX/UI & Trải nghiệm Người vận hành Hội Thánh
- **Khảo sát luồng thực tế:**
  1. Người vận hành tìm bài hát trong thư viện (Library), nhấp vào bài `002` hoặc `004` để xem và chiếu nhanh. Cột Schedule bên trái chưa có dữ liệu (`No items in schedule`).
  2. Người vận hành nhìn xuống thanh Style ở Preview, chọn mẫu `Blue` hoặc `White`.
  3. **Điểm gãy UX 1:** Màn hình máy chiếu (Screen Live) và màn hình Screen Monitor bên phải **không hề thay đổi gì**.
  4. **Điểm gãy UX 2:** Người vận hành tìm cách bấm nút **Apply** hoặc **All**, nhưng cả 2 nút đều **xám mờ (disabled)**, không bấm được!
  5. **Điểm gãy UX 3:** Người vận hành mở cửa sổ "Quản lý Style Templates" (`palette` icon) để xem và sửa template: Màn hình Preview bên trong modal bị **phóng to cực đại**, chữ vỡ vụn, tràn khỏi viền đen, chỉ thấy được vài ký tự cụt ngủn (`"n thấy con là..."`). Không thể biết được template đó khi chiếu thật sẽ trông như thế nào.

### 1.3 Audit Tính Bảo Mật, Tính Logic, Tính An Toàn & Tính Thống Nhất
- **Tính an toàn IPC & File I/O:** Rất tốt (`safeWriteSync` với cơ chế backup và atomic write trong `main.js`). Không có nguy cơ injection hay mất file dữ liệu.
- **Tính logic:** Bị lỗi nghiêm trọng ở 3 khâu:
  1. **Khâu điều kiện Enable nút Apply:** Đặt điều kiện `applyBtn.disabled = !hasScheduleItem;` khiến bài hát từ Thư viện bị xem là "công dân hạng hai", tước bỏ quyền đổi style.
  2. **Khâu truyền tham số Container Scaling:** Truyền ID của cả Modal (`'style-template-manager-modal'`) thay vì ID của hộp chứa 16:9 (`'style-template-preview-box'`).
  3. **Khâu ưu tiên ghi đè (Precedence):** Cờ `enforceDefaultSlideStyle` ghi đè mù quáng (blind overwrite) cả các Template mà người dùng chủ động chọn.

---

## PHẦN II: 5 VÒNG QA, AUDIT, PHẢN BIỆN & TESTING ĐA CHIỀU

### VÒNG 1: Mổ xẻ cơ chế gây lỗi (Root Cause & Failure Mechanics)
- **Câu hỏi kiểm thử:** *Tại sao nút Apply không sáng và tại sao chữ Preview trong Modal lại khổng lồ?*
- **Phát hiện kỹ thuật Vòng 1:**
  1. `updateStyleTemplateQuickControls()` (dòng ~3545 trong `index.html`):
     ```javascript
     const scheduleItem = schedule[currentScheduleIndex];
     const hasScheduleItem = !!(scheduleItem && !scheduleItem.isMediaOnly);
     applyBtn.disabled = !hasScheduleItem;
     applyAllBtn.disabled = !hasScheduleItem;
     ```
     Khi chưa thêm bài vào Schedule, `currentScheduleIndex = -1` $\Rightarrow$ `hasScheduleItem = false` $\Rightarrow$ Khóa cứng 2 nút.
  2. `updateStyleTemplatePreview()` (dòng ~3673 trong `index.html`):
     ```javascript
     scaleVirtualCanvas('style-template-preview-canvas', 'style-template-manager-modal');
     ```
     Hàm `scaleVirtualCanvas` lấy `container.clientWidth` và `container.clientHeight`.
     - Kích thước Modal: $W \approx 1200\text{px}, H \approx 800\text{px}$ $\Rightarrow \text{scale} \approx \min(1200/960, 800/540) = 1.25\times - 1.5\times$.
     - Kích thước khung đen chứa canvas: $W \approx 400\text{px}, H \approx 225\text{px}$.
     - Kết quả: Canvas 960×540 bị phóng to $1.5\times$ rồi nhét vào khung 400px $\Rightarrow$ Vỡ tỷ lệ gấp 3.5 lần so với thực tế!

### VÒNG 2: Phản biện kịch bản vận hành thực chiến tại Nhà thờ (Real-World Operational Stress)
- **Luận điểm phản biện:** *Tại sao không bắt buộc người dùng luôn phải thêm bài vào Schedule trước khi đổi Style?*
- **Đánh giá thực tế:**
  - Trong các buổi thờ phượng Tin Lành/Công Giáo, mục sư hoặc người hướng dẫn thờ phượng thường xuyên đổi bài đột xuất (hát ứng ngẫu theo Thánh Linh).
  - Người trực máy chiếu chỉ có **vài giây** để tìm bài trong thư viện và bấm chiếu ngay (Quick Live). Không ai có đủ thời gian để: Bấm "Add to Schedule" $\rightarrow$ Chọn bài trong Schedule $\rightarrow$ Chọn Style $\rightarrow$ Bấm Apply $\rightarrow$ Bấm Go Live.
  - Khi đang chiếu, bài hát có thể rơi vào một video nền sáng chói khiến chữ trắng viền đen bị chìm. Người trực máy chiếu cần đổi ngay sang chữ Vàng (`Yellow`) hoặc Box nền đen trong tích tắc.
- **Kết luận Vòng 2:** Bắt buộc hệ thống phải cho phép **Apply trực tiếp từ Thư viện** và có cơ chế **"Apply to Live" tức thì**.

### VÒNG 3: Giải quyết triệt để xung đột Logic Master Toggle vs Style Template
- **Luận điểm phản biện:** *Nếu bật "Ép style mặc định hệ thống" (`enforceDefaultSlideStyle`), thì template có được phép áp dụng không? Nếu template được áp dụng thì có trái với từ "Ép buộc" không?*
- **Phân tích bản chất nghiệp vụ:**
  - Người dùng yêu cầu master toggle là để: *"ép mọi song, bible theo đúng setting của hệ thống, bỏ qua các setting riêng lẻ trong từng bài"*.
  - "Setting riêng lẻ trong từng bài" là các font size lạ, màu sắc tùy tiện mà người soạn bài đã gõ hoặc copy/paste từ web vào bài hát nhiều năm trước.
  - Ngược lại, **Style Template** là hành động **CHỦ Ý RÕ RÀNG của người vận hành tại thời điểm hiện tại**. Nếu bật master toggle mà vô hiệu hóa luôn cả chức năng chọn Style Template thì tính năng Template trở thành "phế phẩm".
- **Giải pháp chuẩn xác:**
  - `enforceDefaultSlideStyle` chỉ áp dụng khi bài hát **không gắn template** (`!item.appliedTemplateId` hoặc template là `'default'`).
  - Khi người dùng chủ động chọn một Template cụ thể (ví dụ `Blue`, `Yellow`), Style của Template đó phải được ưu tiên hàng đầu!

### VÒNG 4: Thiết kế luồng dữ liệu chuẩn (Reactive Flow & Single Source of Truth)
- **Mô hình luồng dữ liệu mới:**
  ```
  [User Action: Chọn Template từ Dropdown]
         │
         ├───► 1. Cập nhật Preview Canvas (updatePreviewOutput) ngay lập tức
         │
         ├───► 2. Bật sáng Nút [Apply] (Highlight xanh/primary báo hiệu có thay đổi)
         │
         └───► 3. Nếu bài đang CHIẾU LIVE (On Air):
                     Hiển thị nút hoặc chức năng [Apply to Live]
                     Click phát ──► Đồng bộ ngay sang Screen Monitor & Screen Live qua IPC!
  ```
- **Xử lý nút [All]:**
  - Nếu Schedule có bài: Áp dụng template cho toàn bộ bài cùng loại trong Schedule (như hiện tại).
  - Nếu Schedule rỗng: Áp dụng template này làm template mặc định cho phiên làm việc hiện tại của Thư viện.

### VÒNG 5: Kịch bản kiểm thử & xác minh nghiêm ngặt (Test Matrix & Regression Plan)
- **10 kịch bản kiểm nghiệm bắt buộc:**
  1. *Test Case 01:* Mở Style Templates Manager $\rightarrow$ Khung Preview 16:9 thu nhỏ đúng tỷ lệ, dòng chữ *"Ta nhận thấy con là người tốt nhất trong thời đại này."* hiển thị trọn vẹn, không tràn viền.
  2. *Test Case 02:* Chỉnh FontSize trong modal từ 50px đến 120px $\rightarrow$ Chữ co giãn và tự động ngắt dòng/fit chữ tương tự như trên Screen Live.
  3. *Test Case 03:* Thư viện chọn bài `002` (Schedule rỗng) $\rightarrow$ Dropdown Style hiện danh sách mẫu, chọn `Yellow` $\rightarrow$ Preview Output đổi sang chữ vàng ngay lập tức.
  4. *Test Case 04:* Khi chọn `Yellow`, nút `Apply` **sáng xanh (enabled)**.
  5. *Test Case 05:* Bấm `Apply` $\rightarrow$ Bài hát trong thư viện nhận style `Yellow`, trạng thái đổi thành "Đang áp dụng: Yellow".
  6. *Test Case 06:* Đang chiếu bài `002` trên Live (Screen Live mở, Screen Monitor đang hiện) $\rightarrow$ Chọn style `Blue` và bấm `Apply to Live` $\rightarrow$ Màn hình Live và Screen Monitor đổi sang màu `Blue` ngay lập tức mà không cần bấm Go Live lại.
  7. *Test Case 07:* Bật cờ `enforceDefaultSlideStyle = true` trong Cài đặt hệ thống $\rightarrow$ Mở bài hát cũ không có template $\rightarrow$ Hiển thị đúng font hệ thống.
  8. *Test Case 08:* Vẫn bật cờ `enforceDefaultSlideStyle = true`, chọn Style Template `Red` $\rightarrow$ Hiển thị đúng style đỏ của Template `Red` (không bị ghi đè về mặc định hệ thống).
  9. *Test Case 09:* Thêm 3 bài vào Schedule, chọn template `White` và bấm `All` $\rightarrow$ Cả 3 bài trong Schedule đều nhận template `White`.
  10. *Test Case 10:* Khởi động lại ứng dụng $\rightarrow$ Không có lỗi cú pháp, dữ liệu templates và settings nạp trơn tru.

---

## PHẦN III: KẾ HOẠCH HÀNH ĐỘNG TỐI ƯU (THE OPTIMAL EXECUTION PLAN)

### 📌 Giai đoạn 1: Chuẩn hóa Container & Tỷ lệ Preview Style Templates
1. Đặt `id="style-template-preview-box"` cho thẻ `div` khung 16:9 (`w-full aspect-video`) trong modal Style Templates.
2. Sửa tham số container trong `scaleVirtualCanvas`:
   - Thay `'style-template-manager-modal'` thành `'style-template-preview-box'`.
3. Bổ sung `fitTextToBox` đồng bộ trong `updateStyleTemplatePreview` để chữ co giãn đúng chuẩn canvas máy chiếu.

### 📌 Giai đoạn 2: Phân tách phân cấp Logic Style (Hierarchy & Enforce Flag Isolation)
1. Tinh chỉnh `normalizeSlideStyle(style, overrides, contentType)`:
   - Nếu `style` mang `appliedTemplateId` (hoặc đang áp dụng template tường minh), cho phép style của template được bảo toàn trọn vẹn, không bị cờ `enforceDefaultSlideStyle` xóa mất font/màu sắc của template.
2. Bảo toàn khả năng dọn dẹp inline rich text rác cho các bài hát thông thường khi `enforceDefaultSlideStyle = true`.

### 📌 Giai đoạn 3: Mở khóa Nút Apply cho Thư viện & Thêm Chế độ "Apply to Live"
1. Cập nhật `updateStyleTemplateQuickControls()`:
   - Cho phép nút `Apply` sáng khi có bài hát ở Preview (bất kể đến từ Schedule hay từ Library).
   - Tự động highlight nút `Apply` (màu xanh Primary) khi Style được chọn khác với Style hiện tại của bài hát.
2. Mở rộng `applyPreviewTemplateToCurrentSchedule()`:
   - Nếu có `scheduleItem`: Cập nhật `scheduleItem.style`.
   - Nếu đang xem bài từ Library (`currentEditingSong`): Cập nhật `currentPreviewStyle` và gán template cho đối tượng đang xem.
   - **Đặc biệt (Live Sync):** Nếu bài hát đó đang chiếu trên Live (`currentLiveIndex >= 0`), tự động cập nhật `currentLiveStyle` và gửi ngay payload sang Screen Monitor và Live Window (`sendToLiveWindow`).
3. Bổ sung nút tiện ích hoặc cơ chế **"Áp dụng cho Live" (Apply to Live)** ngay cạnh dropdown Style để 1 click cập nhật thẳng lên máy chiếu.

### 📌 Giai đoạn 4: Kiểm thử, Tinh chỉnh Visual & Đóng gói
1. Chạy bộ kiểm thử tự động cú pháp `node --check main.js`, `preload.js` và script engine của `index.html`.
2. Kiểm thử thực tế theo 10 kịch bản của Test Matrix.
3. Cập nhật biên bản thay đổi vào `changelog.md`.

---

## PHẦN IV: ĐỀ XUẤT PHÊ DUYỆT (SUBMISSION FOR USER APPROVAL)

Kế hoạch trên khắc phục triệt để:
- **100% lỗi vỡ tỷ lệ preview chữ khổng lồ** trong Style Templates Manager.
- **100% lỗi nút Apply bị khóa mờ** khi mở bài từ thư viện.
- **100% nhu cầu đổi style trực tiếp ra máy chiếu và Screen Monitor** trong lúc đang hành lễ.
- **Duy trì trọn vẹn sự tương thích** với tính năng "Ép style mặc định hệ thống" và cấu hình giao diện đã hoàn thiện trước đó.

Hồ sơ này được lưu trữ vĩnh viễn tại `Workflow/WF-20261011-STYLE-PREVIEW-AUDIT-PLAN.md`.  
**Xin ý kiến duyệt kế hoạch từ bạn để bắt đầu triển khai code!**
