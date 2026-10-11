# AGENTS.md — Presentation For Church (PFC)
Điểm nhập chuẩn hóa duy nhất cho mọi AI Agent. Tuân thủ nghiêm ngặt các rào chắn kỹ thuật sau:

## 1. Ranh giới Codebase & Công nghệ
- **Nền tảng:** Electron 41, Node.js, HTML/JS thuần, Tailwind CSS (offline).
- **Files cốt lõi (Live Code):**
  - `index.html`: Cửa sổ Operator, thư viện, lịch chiếu, editor modal, preview, live control (Monolith ~9.200 dòng).
  - `main.js`: Main process, cửa sổ, menu, 42 IPC handlers, safe-write rotation, protocol `app-media://`.
  - `preload.js`: Cầu nối an toàn `window.electronAPI` (contextBridge).
  - `live.html`: Cửa sổ chiếu Live (Virtual Canvas 960×540, double-buffer crossfade, chỉ nhận IPC, không logic điều khiển).
- **Mã mồ côi (DEAD CODE — TUYỆT ĐỐI KHÔNG SỬA):**
  - `src/schema.js`, `edit-song.html`, `src/js/core.js`, `src/js/utils.js` (không được import/chạy trong app).
- **Phân vùng `web/`:** Landing page Next.js độc lập — TUYỆT ĐỐI KHÔNG sửa khi đang làm việc trên app Electron.
- **Dữ liệu người dùng (Persistence):** Luôn lưu trong `app.getPath('userData')` (`songs.json`, `settings.json`, `style-templates.json`, `bible-versions.json`, `media/`, `bible-cache-*.json`). Tuyệt đối không đọc/ghi dữ liệu runtime vào thư mục gốc dự án.

## 2. Quy trình Tự Hành 3 Giai đoạn (Autonomous Pipeline)
Mọi nhiệm vụ do người dùng yêu cầu phải đi qua 3 giai đoạn tự hành chuẩn hóa:
1. **GIAI ĐOẠN 1: LẬP KẾ HOẠCH (`/pfc-plan` — Skill `pfc-planning-standard`):**
   - Chế độ **READ-ONLY / CẤM ĐỤNG CODE**.
   - Audit 4 trụ cột (Codebase, UI/UX, User Behavior, System Logic).
   - Tổ chức **5 Vòng QA phản biện giả lập** (Data, Memory, Scalability, Edge cases, Phasing).
   - Xuất hồ sơ `Workflow/WF-<YYYYMMDD>-<TASK>-PLAN.md` và trình tóm tắt duyệt 1-chạm.
2. **GIAI ĐOẠN 2: THỰC THI CHUẨN HÓA (`/pfc-action` — Skill `pfc-execution-standard`):**
   - Bắt buộc tuân thủ 7 bước:
     `[1. Backup An toàn] ➔ [2. Action Log] ➔ [3. Phẫu thuật Code] ➔ [4. Test Suite Tự Động (100% Pass)] ➔ [5. Vòng QA/Debug] ➔ [6. Changelog] ➔ [7. Báo cáo Bàn giao PM]`
   - Bắt buộc chạy `node --check` và file test suite `Workflow/test-*.js` đạt 100% Pass trước khi bàn giao.
3. **GIAI ĐOẠN 3: PHÁT HÀNH BẢN MỚI (`/pfc-release` — Skill `pfc-release-workflow`):**
   - Tuân thủ **Release Confirmation Gate**: Luôn dừng lại hỏi xác nhận người dùng trước khi build hoặc push GitHub Release.
   - Build đa nền tảng (`npm run build:all`), dọn dẹp thư mục unpack, git commit, push tag và publish GitHub.

## 3. Cổng Tương Tác Từ Xa 2 Chiều (Remote Telegram Bridge)
- **Đẩy thông báo ra (Outbound):** Gửi báo cáo tóm tắt hoặc xin phê duyệt qua `node scripts/telegram-notify.js`.
- **Lắng nghe lệnh vào (Inbound):** Tự động bắt lệnh duyệt (`duyệt`, `ok`, `action`) từ điện thoại qua `node scripts/telegram-listener.js --check-approval`.

## 4. Chỉ Mục Tài Liệu Sâu (Just-In-Time Knowledge Base)
Khi cần tra cứu sâu từng mảng kỹ thuật cụ thể, Agent đọc file tương ứng (không nạp thừa):
- Kiến trúc chi tiết & IPC Flow: [docs/architecture.md](file:///docs/architecture.md)
- Schema Data Contracts & Normalization: [docs/data-contracts.md](file:///docs/data-contracts.md)
- Sổ tay Debug theo loại lỗi: [docs/debugging-playbook.md](file:///docs/debugging-playbook.md)
- Tiêu chuẩn Giao diện & Canvas 16:9: [docs/ui-guidelines.md](file:///docs/ui-guidelines.md)
- Toàn bộ lịch sử cập nhật: [changelog.md](file:///changelog.md)
