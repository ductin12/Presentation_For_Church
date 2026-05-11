# Changelog - BlessingChurch Presentation App

Tất cả các thay đổi và cập nhật quan trọng của dự án được ghi lại tại đây.

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
- **Giao diện (UI):** Đồng bộ cấu trúc 3 ô phím cho cả phím tắt mặc định và tùy chỉnh.

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
