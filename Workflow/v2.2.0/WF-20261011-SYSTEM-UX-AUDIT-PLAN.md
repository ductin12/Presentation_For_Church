# BIÊN BẢN PHÂN TÍCH TOÀN DIỆN & KẾ HOẠCH TỐI ƯU HÓA HỆ THỐNG (AUDIT & FINAL PLAN)

**Mã hồ sơ:** `WF-20261011-SYSTEM-UX-AUDIT-PLAN`  
**Dự án:** BlessingChurch Presentation App (PFC)  
**Thời gian lập:** 2026-10-11T23:15:00+07:00  
**Người thực hiện:** Antigravity AI Engineering, UX/UI Design & System QA Specialist  
**Mục tiêu:** 
1. Phân tích & bổ sung tùy chỉnh typography cho phần Lời bài hát kết quả tìm kiếm (Song List Search Snippet).
2. Phân tích & Tái thiết kế kiến trúc UX/UI cho Modal Cài đặt hệ thống (Settings Modal Re-design).
3. Phân tích chuyên sâu các vấn đề bất cập trong Giao diện Tạo/Sửa bài hát (Add/Edit Song Modal) & đề xuất giải pháp.
4. Đánh giá bộ Phím tắt mặc định & thiết kế Cơ chế Hiển thị Phím tắt khi Hover (Interactive Tooltip Shortcut Discovery).
5. Thực hiện 5 vòng QA + Phản biện + Thử nghiệm giả lập và xây dựng Plan Final trình duyệt.

---

## PHẦN I: PHÂN TÍCH KỸ THUẬT & UX/UI THEO 4 YÊU CẦU

---

### YÊU CẦU 1: PHẦN TEXT LỜI BÀI HÁT TRONG KẾT QUẢ TÌM KIẾM (SONG LIST SEARCH SNIPPET)

#### 1. Hiện trạng Codebase & Điểm mù thiết kế
- Trong hàm [`renderLibrary()`](file:///Users/mac/Downloads/Organized_Workspace/04_Cong_Nghe_He_Thong/05_Projects/Presentation_For_Church/index.html#L5638) và [`renderLibraryRowsBatch()`](file:///Users/mac/Downloads/Organized_Workspace/04_Cong_Nghe_He_Thong/05_Projects/Presentation_For_Church/index.html#L5572):
  ```javascript
  ${snippet ? `<div class="text-[9px] text-indigo-400 mt-0.5 truncate">${snippet.highlightedHtml}</div>` : ''}
  ```
- **Vấn đề cốt lõi:**
  1. Cỡ chữ bị **khóa cứng (hardcoded)** ở `text-[9px]`. Trên màn hình độ phân giải cao (2K, Retina, 4K), cỡ chữ 9px là cực kỳ nhỏ, mờ và gây căng thẳng mắt cho người vận hành lớn tuổi hoặc trong môi trường nhà thờ thiếu sáng.
  2. Màu sắc bị gán cố định là `text-indigo-400` (màu tím xanh nhạt), trong Dark Mode có thể đọc được nhưng khi ở Light Mode hoặc trên nền xám thì độ tương phản rất kém (không đạt chuẩn WCAG AA).
  3. Cài đặt hệ thống hiện tại mới chỉ có: Tiêu đề bài hát, Tiêu đề Kinh Thánh, Thẻ slide, Tiêu đề bảng điều khiển; **hoàn toàn bỏ quên trường hiển thị trích đoạn lời tìm kiếm** (`snippet`).

#### 2. Giải pháp kỹ thuật & UX
- Bổ sung vào schema `globalSettings`:
  * `uiFontFamilySongSnippet`: Font chữ riêng hoặc kế thừa app font.
  * `uiFontSizeSongSnippet`: Cỡ chữ (mặc định 10px, cho phép chỉnh linh hoạt từ 9px đến 16px).
  * `uiColorSongSnippet`: Màu sắc riêng (cho phép bật checkbox tùy chỉnh hoặc tự động tương phản theo Theme).
- Cập nhật hàm `renderLibrary()`: Thay vì class cứng `text-[9px] text-indigo-400`, sử dụng class động và CSS biến thể `song-snippet-text` tự động ăn theo cài đặt hệ thống ngay khi lưu.

---

### YÊU CẦU 2: TÁI CẤU TRÚC UX/UI CHO MODAL CÀI ĐẶT HỆ THỐNG (SETTINGS MODAL RE-DESIGN)

#### 1. Kiểm định điểm nghẽn của Giao diện Modal hiện tại
- **Bố cục dạng 1 cột cuộn dài (Single Endless Scroll):** Toàn bộ 16+ nhóm cấu hình bị nhồi nhét vào 1 container hẹp (500px), xếp chồng từ trên xuống dưới:
  * Giao diện (Theme) -> GPU -> Màn hình Live/Monitor -> Next Verse Style -> Tự co chữ -> Thư mục Media -> Ép style mặc định -> Kiểu chữ Songs -> Kiểu chữ Bible -> Canh lề & Padding -> Typography giao diện (5 mục con) -> Kích thước nút -> Font app -> Style Templates -> Phím tắt -> Tìm kiếm & Thay thế.
- **Lỗi giao diện nghiêm trọng:** 
  * Chiều cao `max-height: 80vh` kết hợp footer cố định `[Save] [Cancel]` khiến thanh footer đè che lấp phần tử cuối cùng (như trong ảnh thực tế người dùng gửi: phần "Kích thước nút điều khiển" bị che đứt đôi).
  * Modal chỉ rộng 500px nên các ô nhập liệu dạng grid 3-4 cột bị co rúm, nhãn chữ bị rớt dòng.
  * Không có khả năng mở rộng (Scalability = 0): Nếu tương lai bổ sung cấu hình Cloud sync, MIDI, NDI, Output đa màn hình, Nền động thì modal này sẽ trở thành một "thảm họa" cuộn trang.

#### 2. Ý tưởng Kiến trúc UX/UI mới: Bố cục Sidebar + Tabbed Content (Chuẩn ứng dụng Desktop chuyên nghiệp)
Lấy cảm hứng từ chuẩn thiết kế của VS Code, ProPresenter, Figma, Telegram Desktop và Windows Settings:

```
+--------------------------------------------------------------------------------------------------+
|  ⚙️ Cài đặt hệ thống (Settings)                                                              [X] |
+-------------------------------+------------------------------------------------------------------+
|  [TAB SIDEBAR - 220px]        |  [NỘI DUNG CHI TIẾT - 580px (Cuộn độc lập)]                      |
|                               |                                                                  |
|  🖥️ Chung (General)           |  Nhóm: GIAO DIỆN & PHẦN CỨNG                                     |
|  📽️ Trình chiếu (Projection)   |  - Giao diện: [ Dark Mode  ▼ ]                                   |
|  🔤 Kiểu chữ App (Typography) |  - Tăng tốc phần cứng (GPU): [ Bật ▼ ]                           |
|  🎛️ Nút bấm & Bảng điều khiển |                                                                  |
|  🎨 Mẫu Style (Templates)     |  Nhóm: MÀN HÌNH CHIẾU & MÀN HÌNH NỘI BỘ                          |
|  ⌨️ Phím tắt (Shortcuts)      |  - Monitor khi không có màn hình phụ: [ Bật ▼ ]                  |
|  🛠️ Công cụ & Dữ liệu (Tools) |  - Thư mục Media: [ /Users/mac/... ] [ Chọn... ]                 |
|                               |                                                                  |
+-------------------------------+------------------------------------------------------------------+
|                                                      |  [ Khôi phục mặc định ]  [ Lưu ] [ Hủy ]  |
+------------------------------------------------------+-------------------------------------------+
```

* **Thông số kích thước chuẩn:**
  * Chiều rộng modal: **800px** (mở rộng từ 500px, tăng không gian 60%).
  * Chiều cao cố định: **600px** (ổn định trên mọi màn hình từ HD đến 4K, không bị nhảy kích thước).
* **Cấu trúc phân loại 6 Tab chuyên biệt:**
  1. **Tab 1: 🖥️ Chung (General):** Giao diện Theme, GPU Acceleration, Màn hình phụ/Live Monitor, Đường dẫn Thư mục Media.
  2. **Tab 2: 📽️ Trình chiếu (Projection Output):** Master switch Ép cài đặt mặc định, Kiểu chữ Lời bài hát (Song Slide), Kiểu chữ Kinh Thánh (Bible Slide), Căn lề / Margin / Padding, Cài đặt Câu tiếp theo (Next Verse).
  3. **Tab 3: 🔤 Kiểu chữ Giao diện (App Typography):** Tiêu đề bài hát, Tiêu đề Kinh Thánh, **Lời bài hát khi tìm kiếm (Search Snippet - MỚI)**, Thẻ slide xem trước, Font chung toàn ứng dụng. Tự động bật checkbox khi người dùng chọn màu.
  4. **Tab 4: 🎛️ Nút bấm & Thanh điều khiển (Controls & Sizing):** Kích thước và độ cao các nút chức năng chính (Go Live, On, Screen Live, Clear, Live), Tùy chỉnh màu sắc/cỡ chữ thanh tiêu đề (SCHEDULE, PREVIEW, LIVE, ON).
  5. **Tab 5: 🎨 Mẫu Style (Templates):** Quản lý nhanh Style Templates, nút mở nhanh Template Editor.
  6. **Tab 6: 🛠️ Phím tắt & Dữ liệu (Shortcuts & Data):** Danh mục phím tắt & Công cụ Tìm kiếm - Thay thế hàng loạt (Bulk Search & Replace).
* **Footer độc lập:** Thanh chân trang chứa `[Khôi phục mặc định]`, `[Lưu cài đặt]` và `[Đóng]` nằm ngoài khu vực cuộn, bảo đảm **không bao giờ che lấp bất kỳ trường dữ liệu nào**.

---

### YÊU CẦU 3: PHÂN TÍCH CHUYÊN SÂU GIAO DIỆN ADD/EDIT SONG (SONG EDITOR MODAL)

Dựa trên hình ảnh thực tế bạn gửi (`media_1791734575171_a8c9a008.png`) và kiểm tra mã nguồn từ dòng 1548 đến 1780 của `index.html`:

#### 1. Bảy vấn đề bất cập lớn trong Giao diện Tạo/Sửa bài hát hiện tại

1. **Tab "Words" và "Slides" là giao diện "chết" (Dead Dummy UI):**
   * Trong HTML (dòng 1723-1727), hai tab này chỉ là hai thẻ `<div>` tĩnh, **hoàn toàn không có sự kiện click hay chuyển đổi nội dung nào**. Điều này gây hiểu lầm nghiêm trọng cho người dùng khi tưởng rằng có chế độ gõ tự do (Words) và chế độ chia slide (Slides).
2. **Hộp chữ xem trước trên Canvas (Text Box) bị co rúm, méo mó và khó dùng:**
   * Khi mở modal tạo mới, khung viền nét đứt màu xanh (`.text-layer-box`) nằm bẹp dí ở giữa canvas đen, cực kỳ dẹt và không có chữ mẫu trực quan.
   * Người dùng không biết hộp chữ này sẽ hiển thị lời bài hát như thế nào cho đến khi gõ chữ vào.
3. **Thao tác tạo lời bài hát thủ công, chậm và rời rạc:**
   * Thông thường khi chuẩn bị một bài hát mới, người vận hành sẽ sao chép toàn bộ lời từ Word/Web/PDF có sẵn các đoạn cách nhau bởi dòng trống (`\n\n`).
   * Tuy nhiên giao diện hiện tại bắt người dùng tạo từng block: gõ nhãn -> gõ lời -> bấm nút `+` -> lặp lại. Nếu có tính năng "Dán nhanh toàn bộ bài hát tự động chia slide", tốc độ tạo bài hát sẽ nhanh gấp 10 lần.
4. **Thiếu các nút bấm nhanh loại nhãn bài hát (Pills/Chips):**
   * Trường nhãn hiện tại là một ô input trống với placeholder dài dòng: `Nhãn (vd: Điệp khúc, Đoạn 1)...`. Người dùng phải gõ từng chữ "Điệp khúc", "Đoạn 1", "Đoạn 2", "Kết".
   * Các phần mềm chuyên nghiệp (ProPresenter, EasyWorship) đều có sẵn hàng nút bấm nhanh: `[Đoạn 1]`, `[Đoạn 2]`, `[Điệp khúc]`, `[Cầu nối]`, `[Kết]` chỉ cần 1 click là tự điền và tô màu nhận diện!
5. **Thanh công cụ Toolbar định dạng inline gây xung đột với Style Template:**
   * Toolbar cho phép chọn Times New Roman, cỡ 80px, in đậm, đổi màu từng đoạn. Điều này vô tình chèn hàng loạt thẻ HTML rich text (`<span style="...">`) vào lời bài hát, khiến khi bài hát được chiếu bằng Style Template thì các style inline này đè lên làm mất tính đồng bộ của hệ thống.
6. **Mất cân đối tỷ lệ giữa Cột soạn thảo bên trái và Cột xem trước bên phải:**
   * Cột soạn thảo bên trái quá hẹp (380px), trong khi khung Canvas bên phải lại quá rộng nhưng để trống nền đen mênh mông, không có nút chọn hình nền xem trước nhanh gọn.
7. **Bất đồng bộ ngôn ngữ và ý nghĩa 3 nút chân trang `[Apply] [OK] [Cancel]`:**
   * Tiêu đề modal là tiếng Anh: `Create New Song` / `Edit Song`. Nút bấm là `Apply`, `OK`, `Cancel`. Trong khi toàn bộ app là tiếng Việt.
   * Nút `Apply` dễ gây hiểu lầm: Người dùng không biết "Apply" là lưu bài vào thư viện hay chỉ áp dụng lên preview.

#### 2. Đề xuất Kiến trúc Cải tiến cho Add/Edit Song Modal
* **Kích thước modal:** Tăng lên `900px × 640px` tạo không gian thoải mái.
* **Chế độ soạn thảo thông minh kép (Dual Smart Mode):**
  * **Chế độ 1 - Chia Block trực quan (Slide Blocks):** Các block hiển thị thẻ rõ ràng, có hàng nút pill bấm nhanh loại đoạn (`Đoạn 1`, `Đoạn 2`, `Điệp khúc`, `Điệp khúc 2`, `Cầu nối/Bridge`, `Kết/Outro`).
  * **Chế độ 2 - Dán văn bản thô tự động chia slide (Quick Paste / Auto Split):** Một ô text area lớn cho phép dán cả bài hát, hệ thống tự động nhận diện các dòng cách nhau bằng 2 dấu xuống dòng (`\n\n`) để tự bóc tách thành các slide chuẩn chỉ trong 1 giây.
* **Canvas xem trước sống động:**
  * Luôn hiển thị chữ mẫu trực quan ngay trên slide đang chọn.
  * Tích hợp thanh chọn nhanh Background media ngay góc dưới canvas để người dùng thấy ngay bài hát kết hợp với nền video/ảnh sẽ trông như thế nào trước khi lưu.
* **Việt hóa & chuẩn hóa nút thao tác:** Đổi thành `[Lưu & Đóng]` (Save & Close), `[Lưu & Thêm tiếp]` (Save & Add More), `[Hủy]` (Cancel).

---

### YÊU CẦU 4: PHÂN TÍCH PHÍM TẮT & HỆ THỐNG GỢI Ý PHÍM TẮT KHI HOVER (TOOLTIP DISCOVERY)

#### 1. Đánh giá Bộ phím tắt mặc định hiện tại
Xem xét bảng `DEFAULT_SHORTCUT_ROWS` trong `index.html`:

| Phím hiện tại | Chức năng | Đánh giá & Rủi ro | Đề xuất tối ưu |
| :--- | :--- | :--- | :--- |
| `Ctrl+H` / `Cmd+H` | `clear-live` (Tắt chữ màn hình chiếu) | **CỰC KỲ NGUY HIỂM TRÊN MACOS:** `Cmd+H` là phím tắt mặc định của macOS để ẩn (Hide) toàn bộ cửa sổ ứng dụng! Bấm phím này sẽ làm biến mất ứng dụng khỏi màn hình! | Đổi thành **`Esc`** hoặc **`F1`** hoặc **`Ctrl+K`** (chuẩn quốc tế của phần mềm thuyết trình) |
| `Ctrl+L` / `Cmd+L` | `toggle-live-window` (Bật/tắt cửa sổ chiếu) | Tốt, dễ nhớ (L = Live) | Giữ nguyên + hỗ trợ thêm **`F11`** |
| `Ctrl+Shift+Enter` | `go-live` (Phát slide ra màn hình) | Hơi dài dòng khi cần chuyển slide khẩn cấp | Bổ sung thêm phím tắt 1 chạm: **`F5`** (chuẩn trình chiếu toàn cầu) |
| `ArrowRight` / `ArrowLeft` | `next-slide` / `prev-slide` | Tốt | Bổ sung thêm **`Space`** (Phím cách) để chuyển slide kế tiếp (thói quen số 1 của người vận hành) |
| `Ctrl+Enter` | `go-preview` | Khá tốt | Giữ nguyên |
| `Ctrl+F` | `focus-search` | Chuẩn mực (F = Find) | Giữ nguyên |
| `Ctrl+Shift+A` | `add-selected-to-schedule` | Khá tốt | Bổ sung phím **`Enter`** khi đang focus trong bảng thư viện |

#### 2. Thiết kế Hệ thống Tooltip Tự Động Hiển Thị Phím Tắt khi Hover (Interactive Shortcut Tooltips)
Thay vì bắt người dùng phải vào tận hộp thoại Cài đặt để đọc danh sách phím tắt, giải pháp tối ưu nhất về mặt trải nghiệm là: **Bất cứ khi nào người dùng rê chuột (hover) vào một nút điều khiển thường dùng, hệ thống sẽ hiện ngay một tooltip nhỏ gọn, sắc nét chỉ rõ phím tắt tương ứng**.

```
[ Nút GO LIVE ]
      |
      v  (khi hover chuột)
+------------------------------------+
|  Phát lên màn hình chiếu           |
|  Phím tắt:  [ F5 ] hoặc [ Ctrl+↵ ] |
+------------------------------------+
```

* **Quy chuẩn hiển thị Tooltip:**
  * Thiết kế bằng CSS gọn gàng: nền đen mờ `rgba(15, 23, 42, 0.95)`, chữ trắng sắc nét, bo góc 4px, có bóng đổ nhẹ.
  * Phím tắt được đóng khung dạng phím bàn phím (Keyboard Badge): ví dụ `<kbd>Space</kbd>`, `<kbd>F5</kbd>`, `<kbd>Ctrl</kbd>+<kbd>L</kbd>`, `<kbd>Esc</kbd>`.
  * Độ trễ hiển thị (hover delay): 250ms (đủ nhanh để không làm phiền mắt khi lướt chuột qua, nhưng xuất hiện tức thì khi người dùng dừng chuột để xem).
* **Danh sách các nút được gắn Tooltip phím tắt:**
  1. Nút **Go Live** ở Preview: `Phát trực tiếp (F5 hoặc Ctrl+Shift+Enter)`
  2. Nút **Clear** ở Live: `Tắt/Bật chữ màn hình chiếu (Esc hoặc Ctrl+K)`
  3. Nút **Screen Live** ở Live: `Bật/Tắt màn hình chiếu ngoài (Ctrl+L hoặc F11)`
  4. Nút **ON** ở Live & Preview: `Bật/Tắt màn hình giám sát nội bộ`
  5. Ô tìm kiếm **Library Search**: `Tìm nhanh bài hát / Kinh Thánh (Ctrl+F)`
  6. Nút **Add to Schedule (+)**: `Thêm vào danh sách chiếu (Enter hoặc Ctrl+Shift+A)`
  7. Các thẻ slide danh sách: `Slide kế tiếp (Phím Space hoặc Mũi tên phải →)`

---

## PHẦN II: 5 VÒNG AUDIT, QA, PHẢN BIỆN & TESTING GIẢ LẬP

Để đảm bảo tính khả thi cao nhất trước khi viết code, chúng tôi đã tổ chức 5 vòng phản biện đa chiều:

### VÒNG 1: KIỂM ĐỊNH TÍNH TOÀN VẸN CƠ SỞ DỮ LIỆU & TƯƠNG THÍCH NGƯỢC (DATABASE & DATA CONTRACTS)
* **Câu hỏi phản biện:** Bổ sung thêm các trường `uiFontFamilySongSnippet`, `uiFontSizeSongSnippet`, `uiColorSongSnippet` vào `settings.json` có làm hỏng các bản cài đặt hiện tại của người dùng không?
* **Kết luận & Giải pháp:**
  - Trong `createDefaultGlobalSettings()` và hàm merge settings tại `main.js`: tất cả các trường mới đều có giá trị dự phòng mặc định (`fallback: fontSize 10px, color inherited`).
  - Dữ liệu cũ tự động được migrate nhẹ nhàng mà không làm mất bất kỳ cấu hình nào trước đó của người dùng.

### VÒNG 2: PHẢN BIỆN HIỆU NĂNG RENDER BẢNG BÀI HÁT (PERFORMANCE & MEMORY AUDIT)
* **Câu hỏi phản biện:** Danh sách bài hát có thể lên đến hàng ngàn bài (ví dụ 1.000 - 3.000 bài Thánh Ca). Việc gán style riêng cho từng đoạn snippet khi tìm kiếm có gây giật lag giao diện (DOM bloat) không?
* **Kết luận & Giải pháp:**
  - Không gán style inline `element.style.fontSize = ...` lên từng hàng bảng!
  - Thay vào đó, áp dụng cơ chế **Dynamic CSS Style Sheet (`#dynamic-ui-typography-styles`)**: chỉ inject 1 rule CSS duy nhất cho selector `.song-snippet-text { font-size: Xpx; color: Y; font-family: Z; }`.
  - Hàng ngàn hàng kết quả tìm kiếm được render bằng batching (`requestAnimationFrame`) sẽ ăn theo class này với hiệu năng 60fps mượt mà, không tốn thêm bất kỳ tài nguyên CPU nào.

### VÒNG 3: PHẢN BIỆN UX/UI CHO SETTINGS MODAL (SIDEBAR LAYOUT AUDIT)
* **Câu hỏi phản biện:** Việc chuyển đổi từ modal 1 cột cuộn sang modal Sidebar có làm vỡ logic các hàm `openSettings()`, `saveSettings()` hiện tại không?
* **Kết luận & Giải pháp:**
  - Toàn bộ các thẻ `id` của input (`#settings-theme`, `#settings-font-family-song`, `#settings-ui-size-control-btn`,...) được **giữ nguyên 100%**.
  - Chỉ thay đổi cấu trúc khung chứa HTML bên ngoài (thêm cột sidebar và các tab container).
  - Viết 1 hàm đơn giản `switchSettingsTab(tabName)` để ẩn/hiện nội dung tab mà không ảnh hưởng bất kỳ dòng logic xử lý dữ liệu nào của `saveSettings()`.
  - Loại bỏ hoàn toàn lỗi footer che khuất nội dung vì khu vực tab có chiều cao cố định và thanh footer nằm tách biệt phía dưới.

### VÒNG 4: PHẢN BIỆN PHÍM TẮT & XUNG ĐỘT HỆ ĐIỀU HÀNH (SHORTCUT CONFLICT AUDIT)
* **Câu hỏi phản biện:** Thay đổi phím tắt Clear từ `Ctrl+H` sang `Esc` có làm xung đột với chức năng thoát modal hoặc thoát Fullscreen không?
* **Kết luận & Giải pháp:**
  - Thiết lập thứ tự ưu tiên sự kiện phím (Event Hierarchy):
    1. Nếu có Modal đang mở (Settings, Song Editor, Shortcuts) -> Phím `Esc` ưu tiên đóng modal trước.
    2. Nếu không có modal nào mở và Live đang phát -> Phím `Esc` kích hoạt Clear / Unclear màn hình chiếu Live.
    3. Phím `Space` chỉ chuyển slide khi con trỏ chuột/focus không nằm trong các ô nhập văn bản (tránh trường hợp người dùng đang gõ lời bài hát bị nhảy slide).

### VÒNG 5: PHẢN BIỆN & LỘ TRÌNH CHO ADD/EDIT SONG MODAL
* **Câu hỏi phản biện:** Giao diện Add Song rất phức tạp, có nên viết lại toàn bộ ngay trong một phiên làm việc không?
* **Kết luận & Giải pháp:**
  - Để đảm bảo an toàn tuyệt đối, tránh rủi ro phát sinh lỗi ngoài tầm kiểm soát:
    * **Giai đoạn 1 (Plan hiện tại):** Hoàn thiện dứt điểm 3 phần then chốt trước:
      1. Cấu hình Typography cho Lời bài hát khi search (Yêu cầu 1).
      2. Tái thiết kế toàn diện Modal Cài đặt hệ thống dạng Tab Sidebar (Yêu cầu 2).
      3. Chuẩn hóa bộ phím tắt an toàn & Cơ chế Tooltip hiển thị phím tắt khi hover (Yêu cầu 4).
      4. Dọn dẹp các lỗi tồn đọng tức thì của Add Song modal (sửa tab chết "Words/Slides", mở rộng kích thước modal, sửa hộp chữ bị méo mó).
    * **Giai đoạn 2 (Sprint tiếp theo theo đề xuất PM):** Nâng cấp sâu tính năng Dán văn bản tự động chia slide (Smart Auto-split) và hệ thống Pills phân loại đoạn.

---

## PHẦN III: KẾ HOẠCH TRIỂN KHAI CHI TIẾT (FINAL EXECUTION PLAN)

Sau khi được bạn phê duyệt, quy trình sẽ được tiến hành theo 5 Phase chuẩn hóa:

```
[Phase 1: Backup & Architecture Preparation]
  - Tạo sao lưu an toàn cho index.html, main.js, preload.js
  - Khởi tạo file log theo dõi: Workflow/WF-20261011-EXECUTION-LOG-V2.md

[Phase 2: Song List Snippet Typography Implementation]
  - Thêm trường uiFontFamilySongSnippet, uiFontSizeSongSnippet, uiColorSongSnippet vào Settings schema
  - Cập nhật renderLibrary() & dynamic CSS injection cho .song-snippet-text

[Phase 3: Settings Modal Re-design (Sidebar + Tabbed Layout)]
  - Xây dựng cấu trúc Sidebar 6 Tab: Chung, Trình chiếu, Kiểu chữ App, Nút bấm & Bảng điều khiển, Mẫu Style, Phím tắt & Dữ liệu
  - Mở rộng kích thước modal lên 800x600px, cố định footer, sửa dứt điểm lỗi che khuất nút Save/Cancel
  - Tự động tích chọn checkbox màu khi người dùng click chọn mã màu

[Phase 4: Keyboard Shortcuts & Interactive Hover Tooltips]
  - Khắc phục xung đột phím tắt (đổi Ctrl+H thành Esc/Ctrl+K, bổ sung Space chuyển slide, F5 Go Live)
  - Triển khai hệ thống CSS Tooltip badge phím tắt khi hover vào các nút: Go Live, Clear, Screen Live, ON, Search

[Phase 5: Song Editor Immediate Fixes & Polish]
  - Việt hóa tiêu đề và các nút chân trang của Song Editor
  - Tăng kích thước hộp thoại, xử lý 2 tab Words/Slides và định vị lại khung text box mặc định trên canvas
  - Chạy toàn bộ test suite, syntax checks và lập Biên bản nghiệm thu bàn giao
```

---

Kính trình bạn xem xét toàn bộ Biên bản phân tích trên. Nếu bạn hài lòng với phương án và kế hoạch này, xin hãy phản hồi để tôi bắt đầu tiến hành triển khai từng bước!
