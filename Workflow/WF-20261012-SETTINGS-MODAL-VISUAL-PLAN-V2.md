# KẾ HOẠCH TOÀN DIỆN: TỐI ƯU HÓA TRỰC QUAN TOÀN BỘ 6 TAB TRONG SETTINGS MODAL (V2)

**Mã Kế Hoạch:** `WF-20261012-SETTINGS-MODAL-VISUAL-PLAN-V2`  
**Ngày lập:** 12/10/2026  
**Chế độ:** READ-ONLY / PHÊ DUYỆT TRƯỚC KHI THỰC THI  
**Mục tiêu:** Tái thiết kế toàn bộ 6 Tab của `settings-modal` theo tôn chỉ **"Visual-First & Minimalist"** — Tối đa hóa trực quan bằng Toggle Switches, Segmented Buttons, Icon Groups, Preset Pills, Color Swatches; loại bỏ triệt để các dropdown `<select>` không cần thiết; giảm thiểu chữ dư thừa; bảo toàn 100% logic dữ liệu nền tảng `globalSettings`.

---

## 1. Phân Tích Sự Cố Quy Trình & Khắc Phục (Root-Cause & Process Enhancement)

### 1.1. Nguyên nhân gốc rễ dẫn đến việc "bỏ sót các tab khác"
1. **Bẫy Neo Thị Giác (Visual Anchoring Bias):** Khi người dùng tải lên hình ảnh chụp màn hình Tab 1 ("Cài đặt chung"), Agent đã vô thức coi nội dung trong bức ảnh là toàn bộ phạm vi vấn đề, dẫn đến tư duy cục bộ (tunnel-vision) thay vì bao quát cả thực thể cha `settings-modal`.
2. **Thiếu Bước Quét Trọn Vẹn Ranh Giới (Missing Holistic Scope Scan):** Trong kỹ năng lập kế hoạch trước đây, chưa có quy tắc bắt buộc Agent phải lập danh mục (inventory) toàn bộ cây thành phần con (sub-tabs, sub-sections) trước khi đề xuất giải pháp.
3. **Mất Tính Nhất Quán (UI Inconsistency Risk):** Nếu chỉ đổi Tab 1 sang nút bấm và toggle trong khi Tab 2 và Tab 6 vẫn giữ nguyên các thẻ `<select>` dropdown cũ, người dùng sẽ gặp trải nghiệm bị phân mảnh và rời rạc.

### 1.2. Biện pháp chuẩn hóa quy trình (Đã cập nhật vào `.agents/skills/pfc-planning-standard/SKILL.md`)
- **Quy tắc Holistic Scope Scan:** Bắt buộc phải mở file code cha và kiểm kê 100% các tab/sub-views của component trước khi phân tích.
- **Quy tắc Visual-First Form Control Matrix:**
  * **On/Off (2 trạng thái):** 100% dùng iOS-style Toggle Switch.
  * **2 - 4 giá trị rời rạc:** 100% dùng Segmented Pill Buttons (Nút phân đoạn).
  * **Căn lề / Phương hướng:** 100% dùng Icon Groups trực quan.
  * **Kích thước số (px):** Kết hợp Preset Pills + Thanh Slider + Number Input + Nút Live Preview mẫu.
  * **Chọn màu:** Color Swatch tròn dạng nút bấm trực quan.
  * **Tối giản văn bản:** Thay thế câu văn giải thích bằng Icon và Tooltip gợi ý nhẹ nhàng.

---

## 2. Kiểm Kê Toàn Bộ 6 Tab Hiện Tại vs. Giải Pháp Tối Ưu Mới

```
+---------------------------------------------------------------------------------------------------+
| SETTINGS MODAL ARCHITECTURE (ALL 6 TABS)                                                          |
+---------------------------------------------------------------------------------------------------+
| Tab 1: Cài đặt chung (General)          --> [☀️ Sáng | 🌙 Tối] + 4 iOS Toggles + Thư mục Media    |
| Tab 2: Trình chiếu & Slide (Projection) --> Master Card + [⇤ | ≡ | ⇥] + [⭳ Dưới | ⭱ Trên] + Box Model|
| Tab 3: Kiểu chữ Giao diện (Typography)  --> 5 Compact Cards + Swatch Toggles + Preview Mini      |
| Tab 4: Nút bấm & Đ/khiển (Controls)     --> Preset Pills [9px|12px|15px] + Slider + Live Preview  |
| Tab 5: Style Templates (Templates)      --> Template Count Badge + Hero Action Card + Icon        |
| Tab 6: Phím tắt & Dữ liệu (Tools)       --> Shortcuts Hero Card + Bulk Replace Segmented Pills    |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Chi Tiết Phương Án Tối Ưu Cho Từng Tab

### TAB 1: CÀI ĐẶT CHUNG (`settings-tab-pane-general`)
- **Theme Giao diện:** Chuyển `<select id="settings-theme">` thành **Segmented Button Group**:
  `[ ☀️ Sáng ]` `[ 🌙 Tối ]` (Hiển thị active rõ ràng, đổi màu nền theme ngay lập tức).
- **GPU Acceleration:** Chuyển `<select id="settings-gpu-acceleration">` thành **iOS-style Toggle Switch**:
  Nhãn gọn: `Tăng tốc phần cứng GPU` kèm icon `bolt` và toggle bật/tắt (xanh/xám).
- **Màn hình Live & Monitor:** Tách bạch 2 tính năng thành 2 hàng với Toggle Switch riêng:
  1. `Hiển thị câu tiếp theo (Next Verse)` ➔ Toggle Switch.
  2. `Monitor khi không có màn hình phụ` ➔ Toggle Switch.
- **Tự co chữ (Auto-fit Text):** Chuyển `<select id="settings-auto-fit-text">` thành **Toggle Switch**:
  Nhãn: `Tự co cỡ chữ chống tràn khung` kèm badge `Khuyên dùng`.
- **Thư mục Media:** Giữ ô đường dẫn chỉ đọc dạng pill xám nhạt, thay nút bằng icon `folder_open` `[ Đổi thư mục... ]`.

---

### TAB 2: TRÌNH CHIẾU & SLIDE (`settings-tab-pane-projection`)
- **Master Switch (Ép sử dụng cài đặt mặc định):**
  - Chuyển thành **Master Card Switch**: Một card bo góc nền xanh dương nhạt với Toggle Switch to bản bên góc phải.
  - Khi Tắt: Toàn bộ vùng cấu hình chi tiết bên dưới mờ nhẹ (opacity 60%) với thông báo trực quan: "Hệ thống đang ưu tiên style riêng của từng bài hát".
  - Khi Bật: Toàn bộ vùng cấu hình sáng rõ 100%.
- **Căn lề ngang slide (`settings-text-align`):**
  - Chuyển dropdown `[ Trái / Giữa / Phải ]` thành **Segmented Icon Group**:
    `[ ⇤ Trái ]` `[ ≡ Giữa ]` `[ ⇥ Phải ]` (Active nổi bật màu xanh dương PFC).
- **Vị trí hiển thị Next Verse (`settings-next-verse-position`):**
  - Chuyển dropdown `[ Dưới cùng / Trên cùng ]` thành **Segmented Pill Group**:
    `[ ⭳ Dưới cùng ]` `[ ⭱ Trên cùng ]`.
- **Box Model trực quan cho Margin & Padding:**
  - Thay vì 8 ô nhập số rời rạc không trực quan (`margin-top/right/bottom/left` và `padding-...`), thiết kế một **Diagram Box Model 4 chiều** (như Inspect Element của Chrome DevTools):
    * Khung ngoài (Margin): 4 ô nhập số xung quanh viền.
    * Khung trong (Padding): 4 ô nhập số xung quanh vùng nội dung.
    * Trực quan, người dùng nhìn vào là biết ngay lề trên dưới trái phải!
- **Màu chữ & Viền chữ (Stroke):**
  - Tích hợp ô màu (Color Swatch) dạng tròn hiện đại, click vào là mở bảng chọn màu ngay lập tức.

---

### TAB 3: KIỂU CHỮ GIAO DIỆN UI (`settings-tab-pane-typography`)
- **Hiện trạng:** 5 khối lặp đi lặp lại rất nhiều chữ và ô checkbox bé tí để bật đổi màu chữ:
  1. Tiêu đề Bài hát (Song Title)
  2. Lời bài hát khi tìm kiếm (Song Snippet)
  3. Tiêu đề Kinh Thánh (Bible Title)
  4. Thẻ Slide xem trước (Slide Cards)
  5. Tiêu đề Bảng điều khiển (Panel Headers)
- **Tối ưu hóa trực quan:**
  - Gom 5 mục thành **5 Thẻ Mini (Compact Cards)** có bố cục đồng nhất:
    * Cột 1: Tên thành phần + Icon đại diện.
    * Cột 2: Dropdown chọn Font (gọn gàng).
    * Cột 3: Kích thước cỡ chữ (px) kèm nút tăng giảm `[-]` `[+]`.
    * Cột 4: **Color Swatch Button**: Nút tròn hiển thị màu hiện tại. Nếu đang tắt màu tùy chỉnh, hiển thị icon gạch chéo `Mặc định`. Khi click vào nút màu, tự động kích hoạt chế độ màu riêng!
  - **Live Preview Strip (Thanh xem trước giao diện trực tiếp):**
    * Đặt một dải xem trước mini ngay dưới cùng Tab 3, phản ánh ngay lập tức thay đổi của Song Title, Snippet, Bible Title khi người dùng vừa chỉnh, không cần lưu mới thấy!

---

### TAB 4: NÚT BẤM & BẢNG ĐIỀU KHIỂN (`settings-tab-pane-controls`)
- **Hiện trạng:** Một ô input số trơ trọi `9px` với đoạn văn bản dài giải thích "Mặc định 9px... tăng kích thước 11-14px...".
- **Tối ưu hóa trực quan:**
  - **Preset Pills:** Cung cấp 3 nút bấm kích thước định sẵn:
    `[ Nhỏ (9px) ]` `[ Tiêu chuẩn (12px) ]` `[ Lớn (15px) ]` (Click 1 chạm là ăn ngay).
  - **Thanh trượt Slider + Number Box:** Cho phép kéo mượt từ 8px đến 24px cho người dùng thích tinh chỉnh sâu.
  - **Live Button Preview:** Đặt ngay 2 nút mẫu thực tế bên cạnh:
    `[ 🔴 LIVE ]` `[ ⚡ GO LIVE ]`
    Hai nút này sẽ co giãn kích thước realtime theo thanh trượt để người dùng thấy ngay cảm giác thị giác trước khi bấm Save!

---

### TAB 5: MẪU STYLE TEMPLATES (`settings-tab-pane-templates`)
- **Hiện trạng:** Chỉ có đoạn văn bản dài và 1 nút `Mở Quản lý Template Style...`.
- **Tối ưu hóa trực quan:**
  - Thiết kế thành **Hero Management Card**:
    * Icon lớn `palette` mang tính nhận diện cao.
    * Huy hiệu trạng thái (Badge): `Đang có X mẫu Style lưu trữ`.
    * Nút hành động chính: `[ 🎨 Quản lý Thư viện Template ]` nổi bật.
    * Nút hành động phụ: `[ ➕ Tạo Mẫu Nhanh ]` mở ngay modal tạo mẫu mới.

---

### TAB 6: PHÍM TẮT & DỮ LIỆU (`settings-tab-pane-tools`)
- **Phần 1: Cấu hình Phím tắt:**
  - Nâng cấp thành **Shortcuts Quick Card**:
    * Icon `keyboard` kèm số lượng phím tắt đang hoạt động.
    * Nút mở trực quan: `[ ⌨️ Tùy chỉnh Phím tắt nâng cao... ]`.
- **Phần 2: Tìm kiếm & Thay thế Hàng loạt (Bulk Replace):**
  - **Phạm vi (`bulk-replace-target`):** Chuyển `<select>` thành **Segmented Pills**:
    `[ 🎵 Bài hát ]` `[ 📖 Kinh Thánh ]` `[ 🌐 Tất cả ]`.
  - **Phần dữ liệu (`bulk-replace-field`):** Chuyển `<select>` thành **Segmented Pills**:
    `[ Tất cả ]` `[ Tiêu đề ]` `[ Lời / Nội dung ]`.
  - **Hoa / thường (`bulk-replace-case-sensitive`):** Chuyển `<select>` thành **Toggle Button / Micro Switch**:
    Nút nhấn `[ Aa Phân biệt hoa/thường ]` (Bật sáng khi kích hoạt).
  - **Nút hành động Preview & Replace:** Thêm icon `visibility` và `published_with_changes` nổi bật, kèm khu vực hiển thị preview kết quả thay thế có thẻ đếm số lượng tìm thấy.

---

## 4. Bảo Toàn Kiến Trúc & Tương Thích Dữ Liệu (100% Zero-Breakage)

1. **Giữ nguyên 100% ID và Contract DOM:**
   - Tất cả các `<input>` hoặc `<select>` cũ (`settings-theme`, `settings-gpu-acceleration`, `settings-auto-fit-text`, `settings-text-align`, `settings-next-verse-position`, `bulk-replace-target`, v.v.) sẽ được giữ nguyên ID làm phần tử ẩn (Hidden Bridge Elements).
   - Khi người dùng bấm Toggle hoặc Segmented Pill, giao diện vừa cập nhật hiệu ứng active vừa đồng bộ giá trị vào element gốc.
2. **Hàm `openSettings()` và `saveSettings()` hoạt động nguyên vẹn:**
   - `openSettings()` đọc `globalSettings` và đồng bộ ngược ra các visual component mới.
   - `saveSettings()` tiếp tục đọc từ các element ID quen thuộc, lưu đúng schema JSON vào `userData/settings.json`.
3. **Không dùng thư viện ngoài:**
   - 100% code CSS dùng Tailwind CSS có sẵn trong dự án và HTML/JS thuần (Vanilla JS), không cài thêm bất kỳ gói npm nào.

---

## 5. Kế Hoạch Phân Kỳ Thực Thi (Action Phases)

- **Phase 1: Xây dựng Bộ Visual Components thuần Tailwind:**
  - Component Toggle Switch (iOS style).
  - Component Segmented Button / Pill Group.
  - Component Box Model 4 chiều cho Margin/Padding.
  - Component Preset Pills + Slider cho Size Controls.
- **Phase 2: Áp dụng vào Tab 1 (Cài đặt chung) & Tab 2 (Trình chiếu & Slide):**
  - Chuyển đổi Theme, GPU, Next Verse, Monitor, Auto-fit, Master Switch, Text Align, Next Verse Position, Box Model.
- **Phase 3: Áp dụng vào Tab 3 (Typography) & Tab 4 (Controls):**
  - Đóng gói 5 compact typography cards + color swatch toggles + live button preview slider.
- **Phase 4: Áp dụng vào Tab 5 (Templates) & Tab 6 (Tools & Bulk Replace):**
  - Hero cards, Segmented pills cho bulk replace scope/field, Aa toggle button.
- **Phase 5: Kiểm thử tự động & Bàn giao:**
  - Viết test suite `Workflow/test-settings-modal-visual.js` kiểm tra DOM IDs, two-way sync, lưu và nạp `globalSettings`.
  - Chạy `node --check` và kiểm tra toàn diện 100% Pass trước khi bàn giao.
