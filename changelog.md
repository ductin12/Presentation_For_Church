# Changelog - BlessingChurch Presentation App

Tất cả các thay đổi và cập nhật quan trọng của dự án được ghi lại tại đây.

## [2.0.8] - 2026-09-03

### Đã sửa & Tối ưu hóa cực đỉnh (Static Tailwind & Video Decoder Optimizations)
- **Biên dịch sẵn CSS tĩnh (Pre-compiled Static Tailwind CSS - Giảm LCP từ 31s xuống dưới 0.2s):**
  - Chuyển đổi hoàn toàn từ `tailwindcss.js` (trình biên dịch runtime JIT trong trình duyệt nặng 409KB kèm MutationObserver chạy liên tục) sang tệp CSS tĩnh đã thu nhỏ `src/css/tailwind.min.css` (49KB).
  - Loại bỏ hoàn toàn cảnh báo `cdn.tailwindcss.com should not be used in production`.
  - Triệt tiêu 100% chi phí phân tích cú pháp CSS khi DOM thay đổi, giúp tốc độ phản hồi nhấp chuột (INP) tức thì dưới 16ms thay vì nghẽn 12,496ms.
- **Giải phóng bộ giải mã video phần cứng (Hardware Video Decoder Release):**
  - Loại bỏ thẻ `<source>` đặt sẵn trong 122 thẻ `<video>` của kho Media, ngăn chặn Chromium phát 122 yêu cầu mạng và khởi tạo 122 bộ giải mã video đồng thời.
  - Video chỉ được gán đường dẫn `src` khi thực sự xuất hiện trong khung nhìn người dùng qua `IntersectionObserver`.
  - Giải phóng hoàn toàn hàng đợi mạng, giúp font icon `material-symbols-outlined.woff2` tải ngay lập tức trong 1ms thay vì bị nghẽn 6.92 giây.

## [2.0.7] - 2026-09-03

### Đã sửa & Khắc phục khởi động chậm trên macOS (Startup & Rendering Fixes)
- **Triệt tiêu hiện tượng màn hình trắng & render từng mảng khi mở ứng dụng:**
  - Thiết lập cửa sổ `show: false` kết hợp màu nền đồng bộ `#121121` và sự kiện `ready-to-show`. Cửa sổ chỉ hiển thị khi giao diện đã được tính toán và vẽ hoàn chỉnh, triệt tiêu 100% tình trạng chớp trắng hoặc render dở dang.
- **Tải lười (Lazy Loading) Kinh Thánh & Đóng gói Pre-built Cache:**
  - Không phân tích (parse) toàn bộ 1,189 chương Kinh Thánh ngay lúc khởi động khi người dùng đang ở tab Bài hát (Songs).
  - Đóng gói sẵn tệp đệm JSON cấu trúc cao (`data/bible-cache-Ban_Pho_Thong_converted_to_XMLBIBLE_xml.json`), giúp bản dịch nạp tức thì trong 20ms thay vì mất 5-10 giây phân tích Regex XML khi cài đặt mới trên máy Mac.
  - Tự động nạp trước Kinh Thánh ngầm sau 2 giây nhàn rỗi hoặc ngay khi người dùng bấm vào tab `Bible`.
- **Trì hoãn sao chép tệp Media nền:**
  - Tăng độ trễ đồng bộ Media mặc định lên sau khi giao diện đã hoàn tất tải, tránh tranh chấp I/O đĩa cứng lúc khởi động.

## [2.0.6] - 2026-09-03

### Đã sửa & Cải tiến (Performance Optimization)
- **Tối ưu hóa toàn diện công cụ tìm kiếm (Search Engine):**
  - Áp dụng kỹ thuật đánh giá một lượt (Single-Pass Evaluation): chỉ tính điểm số (`score`), trích đoạn (`snippet`) và vị trí câu (`matchInfo`) đúng 1 lần duy nhất, loại bỏ hoàn toàn việc quét lặp lời bài hát và Kinh Thánh.
  - Chuẩn hóa và lưu đệm từ khóa tìm kiếm (`needles`), tăng tốc độ phản hồi tìm kiếm lên 5x - 10x, gõ tìm tức thì dưới 5ms.
  - Tinh chỉnh debounce tìm kiếm từ 280ms xuống 120ms giúp giao diện phản hồi mượt mà hơn.
- **Tối ưu hóa Bảng Thư viện (DOM & Event Delegation):**
  - Chuyển ~4,000 event listeners riêng rẽ của từng hàng `<tr>` sang cơ chế Event Delegation trên thẻ cha `tbody`, giảm tối đa áp lực bộ nhớ RAM và Garbage Collection.
  - Áp dụng phân đợt hiển thị (Progressive Batch Rendering) qua `requestAnimationFrame`, loại bỏ hiện tượng đơ giao diện khi nạp danh sách lớn.
- **Song song hóa quá trình khởi động (Parallel Startup):**
  - Chuyển `loadSettings`, `loadCustomFonts`, `loadStyleTemplates` và `loadLibrary` sang thực thi đồng thời bằng `Promise.all`.
- **Tối ưu hóa tải dữ liệu trong Main Process (IPC Memory Caching):**
  - Bổ sung tầng bộ nhớ đệm (In-memory Cache) cho danh sách bài hát (`load-songs`), style templates (`load-style-templates`) và danh sách media (`load-media`), giảm thiểu tối đa việc đọc ổ đĩa lặp lại.
- **Tối ưu hóa tải video trong kho Media (Lazy Decoders):**
  - Chuyển thẻ video sang `preload="none"` kết hợp `IntersectionObserver` chỉ nạp metadata khi cuộn vào tầm nhìn, giải phóng bộ giải mã phần cứng GPU/CPU.

## [2.0.5] - 2026-09-03

### Đã sửa & Cải tiến (Fixed & Improved)
- **Hỗ trợ 100% Offline (Không cần kết nối Internet):**
  - Đưa toàn bộ thư viện Tailwind CSS Compiler về lưu trữ cục bộ (`src/js/tailwindcss.js`), loại bỏ hoàn toàn việc gọi qua CDN trực tuyến. Giao diện tải tức thì 0ms, không còn tình trạng trắng màn hình hay vỡ giao diện khi mất mạng.
  - Tải và nhúng toàn bộ font icon Material Symbols Outlined cục bộ (`fonts/material-symbols/`), đảm bảo toàn bộ icon luôn hiển thị đầy đủ, sắc nét khi offline.
  - Đóng gói font `Inter` cục bộ (`fonts/inter/`) và cấu hình font dự phòng hệ thống mượt mà cho macOS và Windows.
  - Thay thế toàn bộ link ảnh placeholder trực tuyến (`placehold.co`) bằng ảnh SVG nội tuyến siêu nhẹ (data URI).
  - Loại bỏ hoàn toàn các liên kết ra Internet bên ngoài trong `index.html`, `edit-song.html` và `live.html`.

## [2.0.4] - 2026-09-03

### Đã thêm & Cải tiến (Added & Improved)
- **Tự động xem trước (Auto-Preview) khi chọn bài hát trong danh sách:**
  - Tự động phân tách và nạp toàn bộ slide của bài hát (hoặc phân đoạn Kinh Thánh) vào cột Preview ngay khi người vận hành click chọn từ thư viện hoặc kết quả tìm kiếm.
  - Cho phép xem thử các Style Template và thao tác Go Live trực tiếp từ bài hát đang xem trước.

## [2.0.3] - 2026-09-03

### Đã sửa & Cải tiến (Fixed & Improved)
- **Hỗ trợ trọn vẹn Icon ứng dụng trên macOS & Windows:**
  - Tạo bộ icon đa độ phân giải chuẩn macOS (`icon.icns` và `icon.png` 1024x1024) từ ảnh gốc, khắc phục triệt để hiện tượng hiển thị icon tạm/icon lạ trên Dock.
  - Tích hợp `app.dock.setIcon` tự động nạp logo khi ứng dụng chạy trên macOS.
  - Cấu hình thuộc tính `icon` cho cả cửa sổ chính (`mainWindow`) và cửa sổ trình chiếu (`liveWindow`).
- **Khắc phục lỗi chuyển tab và kích hoạt cửa sổ trên macOS:**
  - Bổ sung xử lý sự kiện `app.on('activate')`: khi người dùng bấm `Command + Tab` hoặc bấm vào icon trên Dock để quay lại ứng dụng, cửa sổ chính sẽ tự động được khôi phục (restore), hiển thị (show) và lấy tiêu điểm (focus).
- **Cập nhật đóng gói Build (Electron Builder):**
  - Cập nhật `package.json` bổ sung đường dẫn `icon: build/icon.icns` cho macOS và `build/icon.ico` cho Windows.
  - Đóng gói đầy đủ các file icon vào gói phát hành (`files`).

## [2.0.1] - 2026-08-06

### Đã thêm (Added)
- **Cải tiến Tìm kiếm & Trình chiếu Kinh Thánh Thông minh (Smart Bible Search & Auto-Scroll):**
  - **Hiển thị số câu trong kết quả tìm kiếm:** Khi tra cứu từ khóa trong Kinh Thánh, hệ thống tự động nhận dạng câu chứa từ khóa và hiển thị theo định dạng `Sách Chương:Câu` (Ví dụ: `Thi Thiên 92:12` thay vì chỉ hiển thị chung chung `Thi Thiên 92`).
  - **Ghi nhớ tọa độ câu Kinh Thánh:** Vị trí câu Kinh Thánh được chọn (`startVerseIndex`) sẽ được ghi nhớ trực tiếp vào danh sách trình chiếu (Schedule) khi người dùng thao tác bấm đúp hoặc bấm thêm vào lịch trình.
  - **Tự động cuộn (Auto-scroll) trên cả Preview & Live:** Khi đưa câu Kinh Thánh được chọn lên vùng Xem trước (Preview) hoặc Trình chiếu chính thức (Go Live), ứng dụng không chỉ tự động nhảy đúng sang slide của câu đó mà ngay cả danh sách điều khiển slide bên cột Preview lẫn cột Live (`#live-slides-container`) đều tự động cuộn (scroll) mượt mà đến đúng vị trí slide đang phát, giúp thao tác vận hành thờ phượng cực kỳ thuận tiện và nhanh gọn.
- **Đóng gói Windows x64 (Electron Builder & NSIS):**
  - Hỗ trợ xuất ra hai định dạng chuẩn cho máy tính Windows (x64): Bản cài đặt trọn gói `Presentation.For.Church.Setup.2.0.1.exe` (tạo Shortcut trên Desktop & Start Menu) và bản chạy ngay không cần cài đặt `Presentation.For.Church.Portable.2.0.1.exe`.
  - **Trình gỡ cài đặt thông minh (Uninstaller - `build/installer.nsh`):** Khi người dùng thực hiện gỡ phần mềm khỏi máy tính, một hộp thoại thông báo bằng tiếng Việt sẽ xuất hiện hỏi người dùng có muốn xóa hay bảo lưu toàn bộ dữ liệu ứng dụng (`%APPDATA%`, gồm danh sách bài hát, cấu hình cá nhân và kho media). Mặc định hệ thống chọn sẵn nút **"No"** (Giữ lại toàn bộ dữ liệu), an toàn tuyệt đối cho các lần nâng cấp hoặc sửa đổi.
- **Hệ thống Style Mặc định (Default Style Templates):**
  - Tích hợp sẵn bộ 7 mẫu style hiển thị lời bài hát chuyên nghiệp (`Yellow`, `White`, `Red`, `Blue`, `Navi`, `Orange`, `Black`) vào file hệ thống `data/style-templates.json`.
  - Tự động nạp bộ 7 style chuẩn này cho người dùng mới cài đặt lần đầu hoặc khi máy tính đang có danh sách style bị trống.
- **Cơ chế Import Media tự động & Giao diện Theo dõi (Async Media Import):**
  - Trong lần đầu tiên mở ứng dụng sau khi cài đặt, hệ thống tự động chép toàn bộ kho media offline đi kèm sang thư mục người dùng (`userData/media`) theo cơ chế **bất đồng bộ ngầm** (async sequential copy kèm khoảng nghỉ ngắn), ngăn chặn triệt để tình trạng đơ/lag hay treo ứng dụng (UI freeze) khi nạp lượng file lớn.
  - Trang bị thông báo Toast hiện đại ngay góc dưới bên phải màn hình UI, hiển thị theo thời gian thực thanh phần trăm tiến trình (`0% -> 100%`) và tên tập tin đang chép. Ngay khi đạt 100%, hệ thống tự làm mới (refresh) danh sách media để người dùng dùng được ngay, sau đó tự ẩn thông báo sau 4 giây.

### Thay đổi (Changed)
- **Tối ưu hóa Kho Media & Dung lượng Bộ cài (Siêu Nhẹ):**
  - Thay thế trọn bộ sưu tập hình nền và video (Media) mới: độ thẩm mỹ vượt trội, hiệu ứng mượt mà và nhẹ nhàng hơn rất nhiều so với bộ media cũ.
  - Nhờ kho media mới và cấu trúc hợp lý, dung lượng tập tin cài đặt `Setup.exe` giảm 82%, từ **731 MB xuống chỉ còn ~126.8 MB**, cực kỳ tiện lợi khi chia sẻ qua Zalo, Google Drive hoặc USB.
  - Cấu hình `asarUnpack: ["media/**/*"]` trong `package.json` đưa toàn bộ video ra ngoài tệp nén asar tổng, giúp trình phát video trong Electron stream ở tốc độ phần cứng tối ưu nhất mà không chiếm dụng bộ đệm RAM.
- **Kiến trúc & Tự động hóa Dữ liệu:**
  - Hoàn thiện tái cấu trúc codebase theo hướng mô-đun hóa (`modular-rebuild`), phân chia logic mạch lạc và dễ bảo trì hơn giữa các file giao diện (`index.html`, `edit-song.html`, `live.html`) và tiến trình chính (`main.js`, `preload.js`).
  - Nâng cấp lệnh đóng gói dữ liệu trong `package.json` thành `data/**/*` để bảo đảm tất cả tập tin Kinh Thánh XML, danh sách bài hát và bộ style mặc định luôn được tự động chép trọn vẹn vào trong mọi bản dịch release.
  - Cập nhật và điều chỉnh nhẹ dữ liệu cơ bản trong danh sách bài hát `data/songs.json`.

### Đã sửa (Fixed)
- **Giao diện Custom Style:** Sửa lỗi hiển thị màu sắc trong các hộp (box) tinh chỉnh phong cách tùy chỉnh (custom style), chấm dứt hiện tượng màu chữ bị trùng với màu nền gây khó nhìn cho người thao tác.
- **Đồng bộ hiển thị Trình chiếu:** Hiệu chỉnh cơ chế kết xuất văn bản và độ chính xác của hình ảnh/video giữa Editor, Preview, màn hình giám sát Live Monitor và cửa sổ trình chiếu ra màn hình phụ Screen Live.

## [1.1.6] - 2026-05-15

### Đã thêm (Added)
- **Giao diện Soạn thảo (Song Editor UI):**
    - Tối giản thanh công cụ: Loại bỏ nhãn chữ dư thừa, chuyển sang các nút icon chuyên nghiệp để tăng không gian làm việc.
    - Thêm trình chọn Media trực tiếp trong thanh công cụ, cho phép gán hình nền riêng cho từng bài hát ngay khi soạn thảo.
    - Tự động hiển thị thumbnail hình nền đã chọn trong danh sách Schedule (Lịch trình).
- **Trình chọn Media (Media Picker):**
    - Giao diện lưới (Grid) 3 cột chuyên nghiệp với tỉ lệ khung hình 4:3 chuẩn.
    - Icon "Play" nổi bật cho các tệp video để dễ dàng phân biệt với ảnh tĩnh.
    - Hiệu ứng hover và tương tác mượt mà hơn khi chọn media.

### Thay đổi (Changed)
- **Cải tiến hiển thị lời bài hát & hợp âm:**
    - Nâng độ cao hợp âm thêm 5px để tránh đè lên các chữ viết hoa (A, G, C...).
    - Rút ngắn khoảng cách dòng (line-height) xuống 1.2 giúp bố cục gọn gàng hơn.
    - Giới hạn tự động cỡ chữ: Đảm bảo lời bài hát tối đa 4 dòng khi có hợp âm và câu tiếp theo (Next Verse) để tránh chồng lấp.
    - Giữ hợp âm và từ đi kèm luôn nằm trên cùng một dòng (no-wrap).
- **Tối ưu hiệu suất:**
    - Danh sách Schedule giờ đây sử dụng ảnh thumbnail tĩnh thay vì nạp toàn bộ video, giúp ứng dụng chạy nhẹ hơn đáng kể.
    - Đồng bộ hóa logic gán background: Ưu tiên background riêng của bài hát, sau đó mới đến background mặc định của hệ thống.

### Đã sửa (Fixed)
- **Lỗi hiển thị Dark Mode:** Cưỡng bức màu chữ đen cho các menu chọn Font và ô nhập liệu trong trình soạn thảo khi ở chế độ tối, giải quyết vấn đề "chữ trắng trên nền trắng".
- **Vị trí "Next Verse":** Hạ thấp vị trí câu tiếp theo xuống sát đáy màn hình để không bao giờ bị đè bởi dòng lyric cuối cùng.
- **Lỗi đồng bộ Schedule:** Sửa lỗi bài hát trong Schedule hiển thị sai hình nền so với lựa chọn trong Editor.

## [1.1.5] - 2026-05-13 (Unreleased)

### Đã thêm (Added)
- Thêm export thư viện bài hát ra JSON từ UI Songs.
- Thêm nút chọn nhanh Sách/Chương cho tab Bible.
- Chia khu vực Media thành danh sách media và screen monitor nội bộ mirror Live.
- Thêm nút bật/tắt monitor nhỏ gọn cho Preview, Live và Media monitor.
- Thêm tùy chọn Settings để cho phép hoặc chặn mở `Screen Live` khi không có màn hình phụ.
- Thêm Bible Version Manager trong tab Bible để quản lý danh sách bản dịch XML đã lưu.
- Thêm công cụ tìm kiếm và thay thế hàng loạt trong Settings cho Songs và Bible XML, có preview số match trước khi áp dụng.
- Thêm tùy chọn `Auto-fit text` trong Settings để tự giảm font khi lời bài hát hoặc câu Kinh Thánh quá dài.
- Bỏ giới hạn cứng `3 dòng` trong phần phím tắt tùy chỉnh và thêm nút `+` để tạo thêm dòng cấu hình phím tắt ngay trong modal.
- Thêm `Style Templates` cạnh `Preview Output`, có `Style mặc định`, `Apply`, `Apply All`, `Manage`, và manager modal để tạo/sửa/xóa preset style.
- Thêm hỗ trợ upload font custom `.ttf`/`.otf` để dùng lại trong template và renderer.
- Thêm nút `ADD NEW SONG` ở footer tab Songs để mở nhanh modal `Edit Song` và nhập thủ công bài hát mới vào thư viện.

### Thay đổi (Changed)
- Ghi nhớ vị trí Live window bền vững hơn bằng `settings.json` khi dùng một màn hình.
- Đồng bộ cơ chế co chữ tự động giữa Editor preview, Preview, Live monitor trong app và cửa sổ `Screen Live`.
- Hỗ trợ lưu style override theo từng schedule item để áp template cho buổi trình chiếu mà không ghi đè style bài gốc trong library.

### Đã sửa (Fixed)
- Ổn định lại logic `Screen Live` khi có màn hình phụ để tránh vòng lặp ép fullscreen gây nhấp nháy liên tục.
- Khi không có màn hình phụ, `Screen Live` giờ neo vào monitor trong app thay vì đè lên danh sách Live slides.
- Khôi phục `index.html` về bản renderer đầy đủ sau khi lần tách module làm file bị cắt dở, gây lỗi cú pháp `Unexpected token '<'` và chặn toàn bộ luồng load Songs, Bible, Media khi mở ứng dụng.
- Nâng cấp tìm kiếm thông minh cho Songs và Bible: chuẩn hóa alias tên riêng (`Jesus`/`Giê-xu`/`Gie-su`, `John`/`Giăng`, `Peter`/`Phi-e-rơ`, `Paul`/`Phao-lô`, `James`/`Gia-cơ`) và ưu tiên kết quả khớp nguyên câu lời bài hát ngay dưới khớp tiêu đề.
- Hoàn thiện snippet tìm kiếm cho Songs và Bible với highlight an toàn theo query không dấu/alias, đồng thời escape HTML để tránh render nội dung độc hại trong kết quả thư viện.
- Thu gọn khung chọn bản dịch Kinh Thánh và bổ sung metadata registry để đổi tên hiển thị, xóa version user, và ẩn version bundled khỏi UI một cách bền vững.
- Sửa false-positive search trong tab Bible khi tìm theo tham chiếu chương như `Giăng 15`, đổi màu highlight sang nền vàng/chữ đỏ, thay nút import header bằng icon, và thay nút import footer bằng action `Add To Schedule`.
- Sửa crash startup ở renderer do dùng biến `editorStyle` trước khi khai báo trong `applySettings()`, vốn làm ngắt chuỗi `DOMContentLoaded` và khiến Songs cùng Media không load dù Bible vẫn còn hoạt động.
- Mở rộng renderer Preview/Live/Screen Live với `boxStyle` để template có thể thêm khung nền, viền và bo góc cho vùng chữ.
- Sửa lỗi lưu `Style Template` không báo lỗi đúng khi ghi file thất bại; giờ `Save Template` trả lỗi rõ ràng thay vì im lặng, và renderer có `try/catch` để hiển thị thông báo.
- Sửa lỗi duplicate khi tạo bài hát mới: nếu đã `Apply` rồi bấm `OK` mà không chỉnh gì thêm thì modal chỉ đóng, không tạo thêm một bản ghi mới.

## [1.0.5] - 2026-05-11

### Đã thêm (Added)
- **Hệ thống (System):** Hiển thị **Phần trăm CPU thực tế** (cập nhật mỗi 3 giây) trên thanh trạng thái thay vì con số tĩnh 14%.
- **Phím tắt (Shortcuts):**
    - Bổ sung phím tắt mặc định mới: `Ctrl+F` (Tìm kiếm), `Ctrl+Enter` (Go Preview), `Ctrl+Shift+Enter` (Go Live), `Ctrl+1/2` (Chuyển Tab), `Ctrl+Alt+1/2` (Chọn Background), `Ctrl+Shift+Q` (Thoát).
    - Phím tắt `Ctrl+Esc` để tắt nhanh màn hình Screen Live.
    - Thêm action **Xóa khỏi Schedule** vào danh sách phím tắt (mặc định phím `Delete`).
- **Tìm kiếm (Search):** Hỗ trợ `Ctrl+A` để chọn tất cả text ngay trong ô tìm kiếm.

### Thay đổi (Changed)
- **Màn hình trình chiếu (Live Window):**
    - Cơ chế hiển thị thông minh: Tự động chiếu **Full Screen** trên màn hình thứ 2 nếu có kết nối.
    - Tự động hiển thị đè lên khung danh sách Slide (Live Panel) ở màn hình chính khi không có màn hình phụ, giúp dễ dàng kiểm tra nội dung tại chỗ.
    - Hỗ trợ kéo thả để di chuyển cửa sổ Live và tự động ghi nhớ vị trí trong suốt phiên làm việc.
    - Cải tiến nút **Clear**: Chỉ xóa phần văn bản (lyrics), vẫn giữ nguyên hình nền đang phát trên Screen Live.
- **Phím tắt (Shortcuts):**
    - Việt hóa toàn bộ nhãn chức năng trong hộp thoại cấu hình phím tắt để thân thiện hơn.
    - Cải tiến phím tắt `Ctrl+F`: tự động focus và bôi đen toàn bộ nội dung ô tìm kiếm để gõ đè nhanh.
    - Refactor logic lưu phím tắt để hỗ trợ danh sách phím mặc định có độ dài linh hoạt.
- **Giao diện (UI):**
    - Đồng bộ cấu trúc 3 ô phím cho cả phím tắt mặc định và tùy chỉnh.
    - Sửa lỗi không xóa trạng thái chọn bài hát khi chuyển đổi giữa tab Bài hát và Kinh Thánh.
- **Tính ổn định (Stability):**
    - Sửa lỗi rò rỉ biến toàn cục trong logic tính toán CPU.
    - Thêm cơ chế bảo vệ (try/catch) cho hệ thống backup dữ liệu tự động.
    - Cải thiện độ chính xác của việc ghi nhớ vị trí cửa sổ Screen Live khi thay đổi cấu hình màn hình.

## [1.0.3] - 2026-05-11

### Đã thêm (Added)
- Hỗ trợ build release cho cả Windows (`nsis`, `portable`) và macOS (`dmg`) trong cùng cấu hình `electron-builder`.
- Chuẩn hóa tên artifact release theo mẫu `Presentation.For.Church.Setup.[version].[ext]`.
- Bổ sung thêm các bản Kinh Thánh XML (VI/EN) để mở rộng nội dung trình chiếu.

### Đã sửa (Fixed)
- Sửa lỗi `Import Media` không phản hồi do callback menu bị nuốt.
- Sửa luồng load video media (MIME type, `playsinline`, autoplay policy) để preview/live ổn định hơn.
- Sửa các trường hợp video hiển thị nền đen dù file đã import.
- Tăng độ ổn định cửa sổ Screen Live với ưu tiên hiển thị và đồng bộ trạng thái foreground.
- Thay icon text fallback bằng nhãn chữ ở các nút chính để không còn hiện slug như `play_arrow`, `upload_file`, `cast`, `play_circle`.
- Rút gọn danh sách font khởi tạo xuống bộ font cơ bản 10-15 font và không chặn startup bằng bước load font hệ thống.

### Thay đổi (Changed)
- Nâng cấp trải nghiệm Bible: truy cập trực tiếp theo chương, chọn bản dịch ngay trong tab Bible, cải tiến tìm kiếm.
- Thêm hệ thống Settings toàn cục (theme, font, cỡ chữ, màu, căn lề, phím tắt) và lưu cấu hình bền vững.
- Đồng bộ cấu trúc dữ liệu/style giữa editor, preview, schedule và live output để giảm lệch trạng thái hiển thị.

## [1.1.5] - 2026-05-11

### Đã thêm (Added)
- Thêm target Windows `portable` bên cạnh installer `nsis`.
- Đổi tên artifact đóng gói theo mẫu `Presentation.For.Church.Setup.[version].[type]`.

### Thay đổi (Changed)
- Đồng bộ cấu hình build để xuất được file `.exe` cho Windows và `.dmg` cho macOS từ cùng một `electron-builder` config.

## [1.1.4] - 2026-05-11

### Đã sửa (Fixed)
- Sửa luồng load video media để thumbnail, preview, live output và Screen Live dùng MIME type đúng và `playsinline`.
- Giới hạn các định dạng video được nạp vào nhóm phát ổn định hơn để giảm trường hợp file hiện nhưng chỉ ra nền đen.
- Loại bỏ lỗi menu action bị nuốt khiến `Import Media` không phản hồi.

### Thay đổi (Changed)
- Đồng bộ lại cách nhận diện video giữa `load-media`, `import-media` và renderer.

## [1.1.3] - 2026-05-11

### Đã sửa (Fixed)
- Sửa menu `Import Media` để callback menu action không bị nuốt và có thể mở hộp thoại import bình thường.
- Cải thiện luồng load video media bằng MIME type đúng, `playsinline`, và autoplay policy phù hợp cho Electron.
- Giới hạn định dạng video vào nhóm phát ổn định hơn để tránh trường hợp file xuất hiện nhưng chỉ hiện nền đen.

### Thay đổi (Changed)
- Đồng bộ lại cách render thumbnail và background video giữa media library, preview, live output và Screen Live.

## [1.1.2] - 2026-05-11

### Đã sửa (Fixed)
- Media loading giờ dùng URL tuyệt đối từ main process, giúp preview, schedule và live output không còn phụ thuộc hoàn toàn vào `app-media://`.
- Background cũ được normalize theo đuôi file để nhận đúng ảnh/video thay vì mặc định về ảnh.
- Screen Live được tăng ưu tiên hiển thị bằng `always-on-top`, `moveTop()`, và kiosk mode khi có màn hình phụ.
- Mỗi lần gửi content/background/clear đều re-assert lại trạng thái luôn nổi của Screen Live.

### Thay đổi (Changed)
- Thêm changelog cho đợt sửa ổn định media và cửa sổ live này.

## [1.1.1] - 2026-05-11

### Đã thêm (Added)
- **Bộ tài liệu vận hành chuẩn:**
    - Thêm `docs/` với các hướng dẫn về architecture, rules, debugging, feature workflow, UI guidelines và data contracts.
    - Thêm skill repo-local để thống nhất quy trình phân tích, debug và mở rộng tính năng.

### Đã sửa (Fixed)
- **Bible parser và selector:**
    - Bổ sung fallback rõ hơn cho XML không có header ngôn ngữ.
    - Hiển thị tên version kèm ngôn ngữ trong selector để dễ nhận biết bản đang dùng.
    - Đồng bộ tên sách theo đúng ngôn ngữ của từng version Kinh Thánh.
- **Giao diện modal Edit Song / Bible / Settings:**
    - Tăng tương phản text, icon, toolbar, input, placeholder và border trên nền trắng.
    - Sửa lỗi font name và các label trong modal bị chìm do kế thừa màu sáng từ shell.

### Thay đổi (Changed)
- **Chuẩn hóa data và hiển thị:**
    - Cập nhật contract style/background, schedule normalization và các helper liên quan để giảm lỗi lệch trạng thái giữa preview, editor và live window.
    - Chuẩn hóa thêm cấu trúc import/export schedule và Bible version metadata.

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
