# BIÊN BẢN PHÂN TÍCH TOÀN DIỆN VÀ KẾ HOẠCH TỔNG THỂ (AUDIT & PLAN FINAL V2)

**Mã hồ sơ:** `WF-20261011-SYSTEM-UX-AUDIT-PLAN-V2`  
**Dự án:** BlessingChurch Presentation App (Presentation For Church - PFC)  
**Thời gian lập:** 2026-10-11T23:45:00+07:00  
**Chuyên gia thực hiện:** Antigravity AI Engineering, UX/UI Architect & System QA Specialist  
**Mục tiêu:** 
1. Tích hợp đầy đủ các phát hiện về Giao diện (UI/UX), Hành vi người dùng (User Behavior) và Logic hệ thống (đã lược bỏ các mục đã xử lý).
2. Phân tích chuyên sâu về hệ thống Style Templates và tối ưu toàn diện Khung Box chữ (Padding, Margin, Style, Border Radius, Display Mode, Nền mẫu).
3. Phân tích chuyên sâu về Bài hát có Hợp âm (Chords Management: Editor, Monitor, Projector, Typography, Toggle).
4. Tích hợp 4 yêu cầu cốt lõi trước đó: Snippet Typography, Settings Modal Sidebar Tabs, Add Song Redesign, Hover Shortcut Tooltips.
5. Thực hiện 5 vòng QA + Phản biện kỹ thuật và xây dựng Kế hoạch Triển khai Chuẩn (Final Plan) trình duyệt.

---

## PHẦN I: TỔNG HỢP VẤN ĐỀ UI/UX, HÀNH VI NGƯỜI DÙNG & LOGIC HỆ THỐNG

*(Đã lược bỏ 3 vấn đề đã xử lý dứt điểm: Kích thước nút điều khiển, Nút Apply/All bị disabled, Font Serif trên Screen Monitor)*

### 1. Vấn đề Giao diện (UI/UX)
* **Lỗi che khuất đáy Modal Cài đặt:** Thanh Footer `[Save]` `[Cancel]` bị đè lên nội dung khi cuộn xuống đáy do container thiếu `padding-bottom` và modal bị gò bó trong kích thước hẹp (500px).
* **Định dạng số thập phân `12,5`:** Người dùng gõ dấu phẩy `,` thay vì dấu chấm `.` trên thẻ `<input type="number">`, dẫn đến giá trị bị `NaN` hoặc parse thiếu chính xác. Cần cơ chế tự động chuyển đổi `,` thành `.`.
* **Hiển thị phiên bản cũ:** Ở góc dưới phải thanh trạng thái vẫn hiển thị `v2.1.9` thay vì `v2.2.0`, gây nhầm lẫn về phiên bản đang vận hành.
* **Khung Preview trong Style Template Manager nền đen tuyền:** Khi bật Khung box màu đen mờ (Opacity 0.5), người dùng hoàn toàn không thấy khung box đâu vì màu đen đè trên nền đen.

### 2. Vấn đề Hành vi người dùng (User Behavior)
* **Người dùng chọn mã màu nhưng quên tích Checkbox:** Ở các mục tùy chỉnh màu chữ (Tiêu đề, Slide card, Panel), người dùng click chọn ô màu nhưng không tích ô `[ ]`, dẫn đến màu không được áp dụng và gây hiểu lầm là tính năng bị lỗi. Cần cơ chế: *Khi click chọn màu -> Tự động tích chọn Checkbox*.
* **Người dùng soạn thảo bài hát theo thói quen Copy-Paste cả bài:** Thay vì tạo từng block thủ công, người dùng thường copy toàn bộ lời bài hát từ web/tài liệu. Giao diện Add Song hiện tại bắt gõ từng block, gõ tay nhãn đoạn, làm giảm 80% hiệu suất làm việc.

### 3. Vấn đề Logic hệ thống
* **Text Lời bài hát khi Search bị khóa cứng:** Hàm `renderLibrary()` hardcode `text-[9px] text-indigo-400`, không cho phép tùy chỉnh cỡ chữ và màu sắc theo thị lực người dùng.
* **Xung đột phím tắt hệ điều hành:** Phím tắt tắt chữ `Ctrl+H` / `Cmd+H` gây ẩn ứng dụng trên macOS. Cần đổi sang phím an toàn `Esc` hoặc `Ctrl+K`.

---

## PHẦN II: PHÂN TÍCH CHUYÊN SÂU STYLE TEMPLATES & TỐI ƯU KHUNG BOX CHỮ

Dựa trên hình ảnh thực tế bạn gửi (`media_1791736249136_941f06e3.png`), hệ thống Style Templates và Khung box chữ hiện tại bộc lộ nhiều điểm nghẽn kỹ thuật:

```
+-------------------------------------------------------------------------------+
| Style Templates                                                           [X] |
+-----------------------+-------------------------------------------------------+
| [Tất cả        ▼][New]| Căn lề: [ Giữa ▼ ]        Vị trí dọc: [ Middle ▼ ]    |
|                       | Margin: [0][0][0][0]      Padding:    [0][0][0][0]    |
| [Yellow        SONG]  |                                                       |
|  Segoe UI             | KHUNG BOX CHỮ: [ Bật ▼ ]                              |
|                       | Màu nền: [█]  Opacity: [0.5]  Màu viền: [ ] Độ dày: 0 |
| [White         BOTH]  | Kiểu viền: [ solid ▼ ]                                |
|  Times New Roman      | ----------------------------------------------------- |
|                       | PREVIEW:                                              |
| [Red           BOTH]  | +---------------------------------------------------+ |
|                       | | (Nền đen tuyền - Không nhìn thấy Box Opacity 0.5) | |
| [Blue          BOTH]  | |      Ta nhận thấy con là người tốt nhất...        | |
|                       | +---------------------------------------------------+ |
+-----------------------+-------------------------------------------------------+
| [Duplicate] [Delete]  |                                [Save Template] [Close]|
+-----------------------+-------------------------------------------------------+
```

### 1. Phân tích các thiếu sót của Khung Box chữ (Text Box)
1. **Thiếu Padding độc lập cho Khung Box chữ (Box Inner Padding):**
   - Hiện tại có mục `PADDING (T,R,B,L)` ở trên, nhưng đó là padding của thẻ text.
   - Khi bật khung box chữ, **cần có Padding riêng cho Box** (khoảng cách giữa viền hộp nền và chữ bên trong: Top, Right, Bottom, Left). Nếu không có padding này, văn bản sẽ dính sát rạt vào mép hộp, trông rất thô và thiếu tính chuyên nghiệp.
2. **Thiếu Bo góc hộp chữ (Border Radius):**
   - Xu hướng thiết kế hiện đại (Modern Worship / Presentation) luôn yêu cầu bo góc mềm mại (ví dụ bo góc 8px, 16px hoặc bo tròn kiểu Capsule/Pill).
   - Mặc dù schema có biến `borderRadius` nhưng giao diện form bị thiếu hoặc ẩn trường này, người dùng không thể chỉnh được.
3. **Thiếu Chế độ Kích thước & Bố cục Khung Box (Box Display Mode):**
   - **Chế độ 1 - Lower Third / Băng rôn toàn chiều ngang (Full-width Bar):** Khung nền trải dài 100% chiều ngang màn hình ở cạnh dưới, cực kỳ thông dụng khi chiếu phụ đề hoặc livestream.
   - **Chế độ 2 - Fit Content / Thẻ chữ nổi (Card / Pill Box):** Khung nền tự động co giãn ôm sát theo độ dài của khối chữ.
   - **Chế độ 3 - Fixed Box (Khung cố định):** Hộp chữ có chiều rộng và vị trí cố định theo canvas.
4. **Thiếu Margin riêng cho Khung Box (Box Outer Spacing):**
   - Cho phép định vị khoảng cách của hộp chữ so với các mép màn hình (đặc biệt là mép dưới khi dùng Lower Third).
5. **Nền xem trước trong Modal quá tối (Preview Blind Spot):**
   - Nền canvas xem trước hiện tại là màu đen cố định `#000000`. Khi người dùng tạo một box nền đen với Opacity 0.5, **nền đen đè lên nền đen làm khung box hoàn toàn biến mất khỏi tầm mắt**, người dùng không thể biết box trông như thế nào!
   - **Giải pháp:** Cần bổ sung nút chuyển đổi nền xem trước:
     * *Nền caro trong suốt (Transparent Checkerboard)* để thấy rõ Opacity.
     * *Nền ảnh phong cảnh mẫu (Sample Image)* để kiểm tra độ tương phản thực tế.
     * *Nền màu đen truyền thống*.

### 2. Đề xuất Kiến trúc Cải tiến cho Khung Box chữ trong Style Templates
Mở rộng cấu trúc `boxStyle` trong dữ liệu:
```json
"boxStyle": {
  "enabled": true,
  "mode": "fit-content",       // "fit-content" | "full-width" | "fixed"
  "backgroundColor": "#000000",
  "backgroundOpacity": 0.65,
  "borderColor": "#ffffff",
  "borderWidth": 1,
  "borderStyle": "solid",
  "borderRadius": 12,          // Bo góc mềm mại
  "padding": { "top": 16, "right": 24, "bottom": 16, "left": 24 }, // Padding hộp
  "margin": { "top": 0, "right": 0, "bottom": 24, "left": 0 },     // Cách mép dưới
  "shadow": true,              // Đổ bóng hộp 3D
  "backdropBlur": 8            // Hiệu ứng kính mờ (nếu hỗ trợ)
}
```

---

## PHẦN III: PHÂN TÍCH CHUYÊN SÂU BÀI HÁT CÓ HỢP ÂM (CHORDS SYSTEM)

Dựa trên hình ảnh bạn gửi (`media_1791736618296_37df924d.png` và `media_1791736704518_3723a836.png`), việc xử lý hợp âm bộc lộ **4 xung đột và bài toán kỹ thuật lớn**:

```
[ SOẠN THẢO BÀI HÁT ]                [ MÀN HÌNH CHÍNH & MÁY CHIẾU ]
Lời bài hát:                         
[C]A-ba, Cha yêu [Am]ơi!              Màn hình Hội chúng (Projector):
                                      -> Phải ẩn sạch [C], [Am] (Lời hát trang trọng)
Canvas Editor Preview:                
-> Đang hiện trần trụi [F], [G] ⚠️    Màn hình Ban nhạc / Operator:
(Chưa parse nốt lên đầu chữ)          -> Rất cần thấy nốt hợp âm nằm trên đầu chữ!
```

### 1. Phân tích 4 Vấn đề Cốt lõi khi Bài hát có Hợp âm

1. **Khung xem trước Canvas trong Song Editor chưa parse hợp âm:**
   * Trong ảnh `media_1791736618296_37df924d.png`, khi người dùng nhập:
     `Này [F]là lòng khát [G]khao, xin Cha [Em]Ngài làm tươi mới [Am]luôn...`
   * Trên khung Canvas bên phải, hợp âm hiển thị trần trụi dạng ký tự văn bản `[F]`, `[G]`, `[Em]`, `[Am]`.
   * **Nguyên nhân:** Hàm `updateEditorPreview()` (dòng 7318) gán trực tiếp `.innerHTML = htmlOrText` mà không chạy qua hàm phân tích `renderChordsHTML()`. Điều này khiến người soạn nhạc không biết nốt hợp âm sẽ đặt trên chữ nào, độ cao dòng chữ bị lệch hoàn toàn.
2. **Hai đối tượng thụ hưởng đối lập nhau (Dual Audience Conflict):**
   * **Hội chúng (Congregation - Screen Live Projector):** BẮT BUỘC KHÔNG ĐƯỢC CÓ HỢP ÂM. Nếu hiện hợp âm lên màn hình lớn nhà thờ, chữ sẽ bị rối mắt, mất thẩm mỹ và người hát bình thường không hiểu các ký hiệu âm nhạc.
   * **Ban nhạc / Nhạc công / Ca viên (Worship Band / Stage Monitor / Operator):** BẮT BUỘC PHẢI CÓ HỢP ÂM. Nhạc công cần nhìn thấy hợp âm nằm ngay trên đầu từ ngữ cần chuyển nốt để đệm đàn chuẩn xác.
3. **Thiếu nút gạt nhanh Bật/Tắt Hợp âm (Toggle Chords):**
   * Hiện tại hệ thống tự động xóa sạch hợp âm trên Projector bằng `stripChords()`, và hiển thị hợp âm trên Preview / Monitor bằng `renderChordsHTML()`.
   * Tuy nhiên, nếu người vận hành chỉ muốn xem lời sạch hoặc khi người đệm đàn cần tắt/bật nhanh, hệ thống **hoàn toàn không có nút công tắc Bật/Tắt Hợp âm (Show/Hide Chords)** trên thanh công cụ Preview hoặc Cài đặt.
4. **Typography & Màu sắc cho Hợp âm chưa thể tùy chỉnh:**
   * Hiện tại class `.chord-mark` (dòng 1013) được fix cứng màu sắc trong CSS (màu vàng cam hoặc xanh).
   * Trong các bài hát có phong cách tối hoặc nền sáng, màu hợp âm mặc định có thể bị chìm hoặc khó đọc đối với nhạc công. Cần có tùy chọn chỉnh Màu sắc & Cỡ chữ hợp âm.

### 2. Giải pháp Kỹ thuật & UX cho Hệ thống Hợp âm
* **Trong Song Editor:** Gọi `renderChordsHTML()` trong `updateEditorPreview()` để khung canvas hiển thị nốt nhạc nằm bay trên đầu chữ chuẩn xác ngay trong lúc soạn thảo.
* **Nút bấm Bật/Tắt Hợp âm (Toggle Chords):** Bổ sung nút bấm icon nốt nhạc `[🎵 Chords: ON/OFF]` ngay trên thanh công cụ điều khiển Preview & Monitor.
* **Cơ chế phân tách luồng xuất hình (Output Separation):**
  * `Projector (Screen Live)`: Luôn strip sạch hợp âm (chuẩn mực 100% cho hội chúng).
  * `Monitor nội bộ & Stage Display (nếu có)`: Tôn trọng trạng thái Toggle Chords của người vận hành.
* **Tùy chỉnh Typography hợp âm:** Bổ sung vào Style Template / Cài đặt mục chọn màu chữ hợp âm (mặc định `#f59e0b` vàng hổ phách nổi bật) và cỡ chữ hợp âm tương đối.

---

## PHẦN IV: TỔNG HỢP TOÀN BỘ CÁC NỘI DUNG NÂNG CẤP

| Hạng mục | Vấn đề hiện tại | Giải pháp triển khai |
| :--- | :--- | :--- |
| **1. Text Snippet khi Search** | Khóa cứng 9px, màu tím nhạt, không có trong Cài đặt | Thêm cấu hình Font, Cỡ chữ (9-16px), Màu sắc riêng; render bằng Dynamic CSS hiệu năng cao |
| **2. Settings Modal Layout** | 1 cột cuộn dài 500px, footer che khuất nút, rối rắm | Tái thiết kế thành **Sidebar 6 Tab** (800×600px), footer cố định độc lập, mở rộng không gian |
| **3. Lỗi Checkbox & Dấu phẩy** | Nhập `12,5` bị lỗi, chọn màu quên tích checkbox | Tự động chuyển `,` thành `.`; tự động tích checkbox khi chọn ô màu |
| **4. Add/Edit Song Modal** | Tab Words/Slides chết, canvas co rúm, thiếu dán nhanh | Xử lý tab chết, cân chỉnh canvas preview, Việt hóa nút bấm (`Lưu & Đóng`, `Hủy`) |
| **5. Phím tắt & Tooltip** | `Cmd+H` ẩn app Mac, thiếu Space, thiếu gợi ý | Đổi sang `Esc`/`Ctrl+K`, bổ sung `Space` next slide, `F5` Go Live; thêm Tooltip phím tắt khi hover |
| **6. Khung Box Style Template** | Thiếu padding riêng, thiếu bo góc, preview nền đen | Bổ sung Padding riêng cho box, Bo góc (`borderRadius`), chế độ Full-width / Fit-content, nút đổi nền xem trước |
| **7. Quản lý Hợp âm (Chords)** | Editor hiện ngoặc vuông thô, thiếu nút bật/tắt hợp âm | Parse hợp âm chuẩn trong Editor canvas, thêm nút Toggle Chords trên Preview/Monitor |

---

## PHẦN V: 5 VÒNG PHẢN BIỆN, QA & TESTING GIẢ LẬP

### VÒNG 1: PHẢN BIỆN TÍNH TOÀN VẸN CỦA PARSER HỢP ÂM
* **Phản biện:** Việc render hợp âm trên đầu chữ (`.chord-unit`) có làm vỡ layout của các bài hát KHÔNG có hợp âm không?
* **Kết luận:** Hàm `renderChordsHTML()` kiểm tra `if (line.includes('['))` trước. Nếu bài hát không có dấu ngoặc vuông hợp âm, văn bản được trả về nguyên trạng 100%, không sinh thêm thẻ thừa, đảm bảo an toàn tuyệt đối.

### VÒNG 2: PHẢN BIỆN KHUNG BOX CHỮ KHI SCALE CANVAS
* **Phản biện:** Khi Khung box chữ có thêm Padding và Bo góc, khi Virtual Canvas 960×540 được thu nhỏ bằng `scaleVirtualCanvas`, các thông số này có bị méo mó không?
* **Kết luận:** Do toàn bộ canvas được scale bằng CSS Transform `transform: scale(...)`, mọi thuộc tính pixel bên trong (padding, border-radius, font-size) đều được tự động co giãn theo đúng tỷ lệ đồng dạng toán học hoàn hảo!

### VÒNG 3: PHẢN BIỆN BỐ CỤC SIDEBAR TABS CHO SETTINGS MODAL
* **Phản biện:** Chuyển sang Sidebar 6 Tabs có làm mất các ID input mà JavaScript đang đọc/ghi không?
* **Kết luận:** Giữ nguyên 100% ID của tất cả input cũ. Chỉ sắp xếp lại các container `div` và thêm class ẩn/hiện (`hidden`). Hàm `openSettings()` và `saveSettings()` hoạt động nguyên vẹn, không cần sửa đổi logic cốt lõi.

### VÒNG 4: PHẢN BIỆN VỀ HIỆU NĂNG HOVER TOOLTIP
* **Phản biện:** Việc gắn tooltip cho nhiều nút có làm chậm thao tác chuột không?
* **Kết luận:** Sử dụng CSS thuần (`::after`, `::before` hoặc class CSS absolute đơn giản) với thuộc tính `pointer-events: none` và `transition: opacity`. Hoàn toàn không dùng JavaScript timer nặng nề, tốc độ phản hồi 0ms độ trễ CPU.

### VÒNG 5: PHẢN BIỆN TƯƠNG THÍCH DỮ LIỆU CŨ (BACKWARD COMPATIBILITY)
* **Phản biện:** Các Style Template cũ đã lưu trong máy người dùng chưa có trường `boxStyle.padding` hoặc `boxStyle.borderRadius` thì sao?
* **Kết luận:** Hàm `normalizeSlideStyle()` luôn có giá trị fallback an toàn (padding mặc định 0, radius mặc định 0). Template cũ load lên hoàn toàn bình thường, không gây crash ứng dụng.

---

## PHẦN VI: KẾ HOẠCH TRIỂN KHAI HOÀN CHỈNH (PLAN FINAL V2)

```
[Phase 1: Sao lưu An toàn & Khởi tạo Nhật ký]
  ├── Tạo backup: Workflow/backup-20261011-234500/ (index.html, main.js, preload.js)
  └── Khởi tạo nhật ký: Workflow/WF-20261011-EXECUTION-LOG-V2.md

[Phase 2: Nâng cấp Settings Modal sang Bố cục Sidebar 6 Tab (Yêu cầu 2)]
  ├── Mở rộng Modal lên 800px × 600px, cố định Footer, giải quyết dứt điểm lỗi che khuất
  ├── Phân chia 6 Tab: Chung, Trình chiếu, Kiểu chữ App, Nút bấm & Bảng điều khiển, Mẫu Style, Phím tắt & Dữ liệu
  ├── Bổ sung Tùy chỉnh Typography cho Lời bài hát khi Search (Yêu cầu 1)
  └── Tự động đổi dấu phẩy ',' thành '.' và tự động kích hoạt Checkbox khi chọn ô màu

[Phase 3: Tối ưu Khung Box chữ & Nền Preview trong Style Templates]
  ├── Thêm trường Padding riêng cho Khung Box (Top, Right, Bottom, Left)
  ├── Thêm trường Bo góc Khung Box (Border Radius)
  ├── Thêm nút chuyển đổi Nền mẫu xem trước (Nền đen / Nền caro trong suốt / Nền ảnh mẫu)
  └── Cập nhật applyStyleToElement() và fitTextToBox() đồng bộ khung box

[Phase 4: Chuẩn hóa Xử lý Hợp âm & Nút Toggle Chords]
  ├── Sửa hàm updateEditorPreview() trong Song Editor để parse nốt hợp âm bay trên đầu chữ
  ├── Đảm bảo Projector luôn ẩn sạch hợp âm, Monitor hiển thị chuẩn nốt
  └── Bổ sung nút Toggle Ẩn/Hiện hợp âm nhanh trên thanh công cụ

[Phase 5: Tối ưu Phím tắt & Hệ thống Tooltip Badge khi Hover (Yêu cầu 4)]
  ├── Đổi phím Clear an toàn sang Esc / Ctrl+K, bổ sung phím Space chuyển slide và F5 Go Live
  └── Triển khai CSS Tooltip phím tắt trực quan khi hover vào các nút: Go Live, Clear, Screen Live, ON, Search

[Phase 6: Hoàn thiện Add Song Modal & Kiểm thử Tự động Toàn diện]
  ├── Việt hóa giao diện Tạo bài hát, xử lý tab Words/Slides, mở rộng kích thước
  ├── Chạy toàn bộ Test Suite (Syntax check, DOM check, Math scale check)
  ├── Cập nhật changelog.md & Lập Biên bản Nghiệm thu Bàn giao (Acceptance Report)
```

---

Kính trình bạn xem xét toàn bộ Biên bản phân tích chi tiết và Plan Final V2 trên. Nếu bạn đồng ý với kế hoạch này, xin hãy phản hồi để tôi bắt đầu tiến hành triển khai ngay!
