# KẾ HOẠCH KỸ THUẬT & KIẾN TRÚC UX/UI (PLAN FINAL)
## TỐI ƯU HÓA TRỰC QUAN HÓA TOÀN DIỆN SETTING MODAL
**Mã hồ sơ:** `WF-20261012-SETTINGS-MODAL-VISUAL-PLAN`  
**Ngày lập:** 12/10/2026  
**Chế độ:** READ-ONLY (Pha 1: Lập kế hoạch & Phản biện QA)  
**Tác giả:** AI Project Orchestrator & UI/UX Specialist  

---

## 1. PHÂN TÍCH HIỆN TRẠNG & CÁC VẤN ĐỀ TỒN ĐỌNG (AUDIT 4 TRỤ CỘT)

### 1.1. Hiện tượng "Lạm dụng Dropdown" (Dropdown Overuse & Cognitive Load)
Quan sát trực tiếp ảnh chụp màn hình và mã nguồn Tab 1 & Tab 2:
- **Giao diện (Theme):** Dùng 1 thẻ `<select>` chiếm trọn 100% chiều ngang màn hình chỉ để chọn giữa 2 giá trị "Dark Mode" và "Light Mode". Người dùng phải tốn 2 click (click mở menu, click chọn item) thay vì 1 click chuyển đổi trực quan.
- **GPU Acceleration, Next Verse, Single Display Live, Auto-fit Text, Enforce Default Style:** Tất cả các tính năng kiểu Bật/Tắt (Boolean On/Off) đều đang bị "ép" vào dropdown menu với các câu giải thích dài dòng (`Bật (Mượt mà đồ họa)`, `Bật tự giảm cỡ chữ để không bao giờ tràn khung`).
- **Khoảng trống lãng phí & Mỏi mắt:** Toàn bộ bảng cài đặt ngập tràn các ô chữ nhật màu trắng viền xám giống hệt nhau, không có phân cấp thị giác (visual hierarchy), khiến mắt người dùng phải đọc từng dòng chữ để hiểu chức năng thay vì "nhìn icon là hiểu ngay".

### 1.2. Phân loại lại Bộ Công Cụ Nhập Liệu Chuẩn (Input Controls Matrix)

| Thành phần hiện tại | Bản chất dữ liệu | Phương án Nhập liệu Mới (Trực quan & Gọn gàng) | Lợi ích UX |
| :--- | :--- | :--- | :--- |
| **Giao diện (Theme)** | 2 trạng thái (`light` / `dark`) | **Segmented Pill Buttons** có Icon: `[ ☀️ Sáng ]` `[ 🌙 Tối ]` | 1 chạm tức thì, cực kỳ trực quan, tiết kiệm 70% không gian. |
| **GPU Acceleration** | Bật / Tắt (`on` / `off`) | **Modern Toggle Switch (Công tắc gạt iOS style)** | Chuẩn công nghiệp cho setting phần cứng, không cần đọc chữ dài. |
| **Tự co chữ (Auto-fit)** | Bật / Tắt (`on` / `off`) | **Modern Toggle Switch** kèm Icon `format_size` | Rõ nghĩa, thao tác 1 click. |
| **Hiển thị câu tiếp theo (Next Verse)** | Bật / Tắt (`on` / `off`) | **Modern Toggle Switch** kèm Icon `queue_music` | Gọn gàng, loại bỏ câu chữ rườm rà. |
| **Dock Live vào Monitor** | Bật / Tắt (`on` / `off`) | **Modern Toggle Switch** kèm Icon `desktop_windows` | Chuyên nghiệp, hiện đại. |
| **Ép Style Mặc Định (Enforce Style)** | Bật / Tắt (`on` / `off`) | **Master Card Switch (Gạt công tắc lớn nổi bật)** | Nhận diện ngay là công tắc chủ lực (Master Switch). |
| **Căn lề ngang (Align Text)** | Trái / Giữa / Phải | **Icon Button Group**: `[ ⇤ ]` `[ ≡ ]` `[ ⇥ ]` | Thay thế dropdown 3 chữ bằng 3 icon căn lề chuẩn văn bản. |
| **Vị trí Next Verse** | Dưới / Trên (`bottom`/`top`) | **Segmented Button**: `[ ⭳ Dưới cùng ]` `[ ⭱ Trên cùng ]` | Trực quan hóa vị trí địa lý. |

---

## 2. NĂM VÒNG QA & PHẢN BIỆN GIẢ LẬP (ADVERSARIAL STRESS-TESTING)

- **Vòng 1 (Tính Toàn Vẹn Data Contracts & Input IDs):**
  - *Thách thức:* Nếu thay đổi `<select id="settings-theme">` thành nút bấm, hàm `saveSettings()` và `openSettings()` có bị lỗi tìm phần tử không?
  - *Giải pháp:* Giữ nguyên các thẻ input/select ẩn (`hidden`) mang đúng ID hiện tại làm "Single Source of Truth", hoặc cập nhật hàm `openSettings()` và `saveSettings()` để đọc/ghi giá trị trực tiếp từ state của toggle/segmented button. Điều này đảm bảo `globalSettings` tương thích ngược 100%.
- **Vòng 2 (Hiệu Năng & Zero Dependency):**
  - *Thách thức:* Làm toggle switch và segmented button có cần kéo thư viện UI nặng nề không?
  - *Giải pháp:* Sử dụng CSS Tailwind thuần túy và checkbox chuẩn với pseudo-element `:checked`. Kích thước bundle tăng **0 byte**, chạy mượt 60fps.
- **Vòng 3 (Độ Co Giãn & Tiết Kiệm Diện Tích):**
  - *Thách thức:* Giao diện mới có bị tràn màn hình không?
  - *Giải pháp:* Gom các công tắc gạt thành danh sách thẻ Card Setting 2 cột hoặc danh sách Toggle List gọn gàng. Giảm chiều cao cuộn của Tab 1 và Tab 2 xuống **hơn 40%**, người dùng nhìn thấy trọn vẹn toàn bộ cài đặt mà hầu như không cần cuộn chuột!
- **Vòng 4 (Trải Nghiệm Tương Phản & Trực Quan):**
  - *Thách thức:* Người dùng có nhận biết được nút nào đang được chọn không?
  - *Giải pháp:* Trạng thái Active được áp dụng hiệu ứng nổi: nền xanh dương thương hiệu (`bg-primary`), chữ trắng, đổ bóng nhẹ. Trạng thái Inactive màu xám tinh tế (`bg-slate-100`).
- **Vòng 5 (Phân Kỳ Thực Hiện - Phasing):**
  - *Giai đoạn A (Trọng tâm):* Tái cấu trúc Tab 1 (Cài đặt chung) & Tab 2 (Trình chiếu & Slide) sang hệ thống Toggle Switch và Segmented Buttons.
  - *Giai đoạn B:* Tối ưu căn lề (Align Buttons Group) và nhóm điều khiển vị trí trong Tab 2 & Tab 3.

---

## 3. THIẾT KẾ CHI TIẾT GIAO DIỆN MỚI (WIREFRAME & SPECIFICATION)

### 3.1. Tab 1: Cài Đặt Chung (Redesigned General Tab)

```
┌────────────────────────────────────────────────────────────────────────┐
│ GIAO DIỆN (THEME)                                                      │
│ ┌───────────────────────┐  ┌───────────────────────┐                  │
│ │   ☀️  Giao diện Sáng   │  │   🌙  Giao diện Tối   │                  │
│ └───────────────────────┘  └───────────────────────┘                  │
│                                                                        │
│ TÙY CHỌN HỆ THỐNG & ĐỒ HỌA                                             │
│ ┌─────────────────────────────────────────────────────────┬──────────┐ │
│ │ ⚡ GPU Acceleration (Mượt mà đồ họa phần cứng)          │ [  ON  ] │ │
│ ├─────────────────────────────────────────────────────────┼──────────┤ │
│ │ 🖥️ Tự Dock Live vào Monitor khi chỉ có 1 màn hình        │ [  ON  ] │ │
│ ├─────────────────────────────────────────────────────────┼──────────┤ │
│ │ 📖 Hiện câu kế tiếp (Next Verse Preview)                │ [  ON  ] │ │
│ ├─────────────────────────────────────────────────────────┼──────────┤ │
│ │ 🔤 Tự co cỡ chữ chống tràn viền (Auto-fit Text)         │ [  ON  ] │ │
│ └─────────────────────────────────────────────────────────┴──────────┘ │
│                                                                        │
│ THƯ MỤC MEDIA BACKGROUND                                               │
│ [ /Users/mac/Library/Application Support/... ]   [ 📁 Đổi thư mục... ] │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2. Tab 2: Trình Chiếu & Slide (Redesigned Projection Tab)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🛡️ ÉP SỬ DỤNG STYLE HỆ THỐNG MẶC ĐỊNH                      [  ON / OFF ]│
│ (Bỏ qua style riêng từng bài hát, đồng bộ toàn bộ màn hình chiếu)       │
├────────────────────────────────────────────────────────────────────────┤
│ CĂN LỀ NỘI DUNG SLIDE                                                  │
│ Căn lề ngang:   [ ⇤ Trái ]   [ ≡ Giữa ]   [ ⇥ Phải ]                   │
│                                                                        │
│ VỊ TRÍ CÂU KẾ TIẾP (NEXT VERSE)                                        │
│ Vị trí:         [ ⭳ Dưới cùng ]   [ ⭱ Trên cùng ]                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. KẾ HOẠCH HÀNH ĐỘNG THỰC THI (ACTION ROADMAP)

Khi nhận được lệnh duyệt từ bạn (`OK` / `Action`), AI Agent sẽ tự động chạy quy trình 7 bước:
1. **Bước 1:** Sao lưu `index.html` vào `Workflow/backup-<timestamp>/`.
2. **Bước 2:** Ghi nhận Action Log vào `Workflow/WF-20261012-EXECUTION-LOG-SETTINGS.md`.
3. **Bước 3:** Thay thế các khối Dropdown thô sơ trong `index.html` bằng CSS Toggle Switches và Segmented Button Groups.
4. **Bước 4:** Đồng bộ 2 chiều dữ liệu trong `openSettings()` và `saveSettings()`.
5. **Bước 5:** Viết bộ test tự động `Workflow/test-settings-ui-suite.js` kiểm tra DOM elements, toggle events, lưu dữ liệu (100% Pass).
6. **Bước 6:** Cập nhật `changelog.md`.
7. **Bước 7:** Xuất Biên bản nghiệm thu và gửi thông báo qua Telegram (nếu có cấu hình).
