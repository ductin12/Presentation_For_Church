# AGENTS.md — Presentation For Church

Tài liệu này là điểm nhập duy nhất cho mọi AI agent hoặc thành viên mới.
Đọc toàn bộ file này trước khi đụng vào bất kỳ dòng code nào.

---

## Tổng quan dự án

Electron desktop app cho trình chiếu nhà thờ (worship presentation).
Người vận hành dùng cửa sổ chính để soạn và điều khiển; nội dung chiếu lên màn hình phụ qua cửa sổ Live.

**Phiên bản hiện tại:** Xem `package.json > version`
**Ngôn ngữ giao diện:** Tiếng Việt
**Nền tảng:** macOS (arm64 + x64) và Windows (x64)
**Stack:** Electron 41, HTML/CSS/JS thuần, Tailwind CSS (compiled offline)

---

## Cấu trúc file quan trọng

```
index.html      — Cửa sổ operator: library, schedule, editor, preview, live control
main.js         — Main process: tạo cửa sổ, IPC handlers, file I/O, protocol
preload.js      — Bridge an toàn: expose window.electronAPI cho renderer
live.html       — Cửa sổ chiếu: chỉ hiển thị text + background, không có logic điều khiển
edit-song.html  — UI chỉnh sửa bài hát (ít dùng, sẽ deprecated)

data/           — Bible XML bundled (01_Ban_Truyen_Thong_1925.xml, v.v.), songs.json, style-templates.json
src/js/         — utils.js và core.js là file tham khảo/draft, KHÔNG phải file chạy thật
docs/           — Tài liệu chi tiết từng mảng
.agents/skills/ — Skills tự động hóa (release workflow, v.v.)
web/            — Landing page Next.js riêng biệt, không liên quan đến app Electron
```

**Quan trọng:** `src/js/core.js` và `src/js/utils.js` KHÔNG được `<script src>` vào app.
Logic thật nằm toàn bộ trong `index.html` (monolith ~8300 dòng).

---

## Luồng dữ liệu

```
Renderer (index.html)
  → window.electronAPI.method()          [preload.js]
  → ipcRenderer.invoke('channel', data)  [preload.js]
  → ipcMain.handle('channel', handler)   [main.js]
  → fs read/write userData               [main.js]
  → webContents.send('channel', result)  [main.js → live.html]
```

userData location:
- macOS: `~/Library/Application Support/Presentation For Church/`
- Windows: `%APPDATA%\Presentation For Church\`

Files trong userData: `songs.json`, `settings.json`, `bible-versions.json`, `style-templates.json`, `custom-fonts.json`, `media/`, `bible-versions/`, `bible-cache-*.json`, `*.backup.1/2/3`

---

## Dữ liệu và schema

### Song item

```json
{
  "id": 1234567890,
  "title": "Amazing Grace",
  "lyrics": "Verse 1\nLine 2\n\nChorus\nLine 2",
  "type": "song",
  "style": {
    "fontFamily": "CMG Sans",
    "fontSize": "80px",
    "color": "#ffffff",
    "fontWeight": "bold",
    "textAlign": "center",
    "verticalAlign": "middle",
    "textStrokeWidth": 5,
    "textStrokeColor": "#000000",
    "textBox": { "left": 48, "width": 864, "top": null }
  },
  "background": null
}
```

Quy tắc lyrics: các slides cách nhau bằng dòng trống (`\n\n`).
Label slide (Verse, Chorus, Bridge, v.v.) nằm ở dòng đầu tiên của mỗi block.
Song lưu HTML rich text khi có định dạng (in đậm, màu sắc). `serializeSlideContent()` strip font-size/line-height khi lưu.

### Background object

```json
{
  "mediaName": "background.jpg",
  "mediaType": "image",
  "url": "app-media://background.jpg"
}
```

`mediaType` là `"image"` hoặc `"video"`. Luôn gọi `normalizeSlideBackground()` trước khi truyền vào bất kỳ đâu.

### Style object (đầy đủ fields)

```json
{
  "fontFamily": "CMG Sans",
  "fontSize": "80px",
  "color": "#ffffff",
  "fontWeight": "bold",
  "fontStyle": "normal",
  "textDecoration": "none",
  "textAlign": "center",
  "verticalAlign": "middle",
  "textStrokeWidth": 5,
  "textStrokeColor": "#000000",
  "textMargin": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
  "textPadding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
  "textBox": { "left": 48, "width": 864, "top": null }
}
```

Luôn dùng `normalizeSlideStyle(style, overrides, contentType)` để tạo style đầy đủ.
Field legacy: `fontColor` → migrate sang `color`. `fontSize` dạng số hoặc `pt` → migrate sang chuỗi `px`.

### Schedule item

Schedule item là song/bible item với thêm `scheduleId` và có thể có `style` override riêng.
Khi áp Style Template: lưu thêm `sourceStyle`, `appliedTemplateId`, `appliedTemplateName`.
File schedule đuôi `.bcsch`, nội dung JSON, đọc/ghi qua native file dialog.

---

## Các hàm quan trọng

| Hàm | Vị trí trong index.html | Mục đích |
|-----|------------------------|----------|
| `normalizeSlideStyle(style, overrides, contentType)` | ~2946 | Chuẩn hóa style, luôn gọi trước khi apply |
| `normalizeSlideBackground(bg)` | ~3004 | Chuẩn hóa background object |
| `sendToLiveWindow(payload)` | ~3110 | Gửi content/style/background sang live.html |
| `formatSlideCardLyrics(content)` | ~6872 | Strip font-size khỏi HTML khi render vào slide card list |
| `serializeSlideContent(contentDiv)` | ~6305 | Serialize HTML editor → lyrics string, strip style |
| `applyStyleToElement(el, styleOverride)` | ~7074 | Apply style lên DOM text element trong canvas |
| `renderPreview()` | ~6885 | Render danh sách slide cards ở Preview panel |
| `renderLiveSlides()` | ~7052 | Render danh sách slide cards ở Live panel |
| `scaleVirtualCanvas(canvasId, containerId)` | ~350 | Scale canvas 960×540 theo container |
| `stripLabel(text)` | ~43 (utils) | Tách label (Verse, Chorus...) khỏi nội dung |
| `getLabelColor(label)` | ~52 (utils) | Màu header card theo loại label |

---

## Kiến trúc Live Window

`live.html` nhận content qua IPC, không có state riêng. Virtual canvas 960×540 (16:9).

**Single display mode:** Live window neo vào ô Monitor trong cửa sổ chính. Đồng bộ vị trí khi move/resize. Ẩn khi minimize, hiện khi restore.

**Multi display mode:** Live window toàn màn hình màn hình phụ. `alwaysOnTop: true`, `visibleOnAllWorkspaces: true`.

Payload gửi sang live: `{ text, style, background }`. Gọi `sendToLiveWindow()` không gọi trực tiếp IPC.

---

## Quy tắc bắt buộc

1. Đọc file liên quan trước khi sửa. Không suy đoán từ tên hàm.
2. Kiểm tra `git status` trước. Không overwrite thay đổi chưa commit của user.
3. Chỉ sửa file liên quan đến task. Không refactor ngoài phạm vi.
4. Nếu thêm field mới vào data: phải có migration tương thích ngược trong main.js.
5. Nếu thêm IPC channel: sửa cả `main.js` (ipcMain.handle) và `preload.js` (expose).
6. Nếu thay đổi UI render: kiểm tra cả operator window và live window.
7. Kiểm tra syntax trước khi commit (xem lệnh ở phần "Lệnh thường dùng").
8. Cập nhật `changelog.md` sau mỗi thay đổi.
9. "Done" nghĩa là: code đúng + docs cập nhật + app chạy được + luồng chính đã kiểm tra + log không có lỗi mới.

---

## Cạm bẫy thường gặp

**CSS và Rich Text trong slide card list (v2.1.8+)**
Slide content chứa HTML rich text (ví dụ `<span style="font-size:80px">`).
Khi render vào danh sách slide card: PHẢI gọi `formatSlideCardLyrics(content)` để strip sạch font-size, line-height, text-stroke trước khi render.
PHẢI bọc nội dung trong container có class `slide-card-body` và duy trì CSS rule `font-size: 11.5px !important` cho `#preview-slides-container`, `#live-slides-container` để tránh vỡ kích thước thẻ card.

**Single display vs Multi display mode của Live window**
Single display: Cửa sổ Live dock vào tọa độ ô Monitor của cửa sổ chính, tự sync vị trí khi main di chuyển/resize, ẩn khi minimize.
Multi display: Cửa sổ Live fullscreen trên màn hình phụ (secondary display), `alwaysOnTop: true`, `visibleOnAllWorkspaces: true`.
Khi thoát app: gọi `safelyDestroyLiveWindow()` trong main.js để gỡ fullscreen và destroy cửa sổ sạch sẽ.

**Packaged app vs npm start**
`npm start` chạy mã nguồn trực tiếp trong working directory. Bản DMG/EXE chạy bundle đã đóng gói trong `dist/`.
Sửa code nhưng chưa build lại release thì bản cài đặt vẫn dính lỗi cũ. Sau khi sửa lỗi quan trọng cần thực hiện release workflow chuẩn.

**userData giữa dev và production**
Dev: userData ở Electron dev profile. Production: Application Support hoặc AppData.
Dữ liệu không shared. Test userData issues bằng bản packaged thật.

**IPC channel naming**
`ipcRenderer.invoke('channel-name')` phải khớp chính xác `ipcMain.handle('channel-name')`.
Tên method trong `preload.js` có thể khác tên channel. Kiểm tra cả 3 chỗ khi debug IPC.

**Bible cache**
Cache tên: `bible-cache-<xmlFileName>.json` trong userData.
Khi bulk replace nội dung XML, cache phải bị xóa để rebuild. Cache ở userData, không phải project folder.

**Media protocol**
Media serve qua `app-media://` (không phải `file://`).
URL: `app-media://<encodeURIComponent(mediaName)>`.
Nếu media không load: kiểm tra `protocol.handle('app-media', ...)` trong main.js và tên file đúng chưa.

**Monolith index.html**
~8300 dòng, không có module. Khi tìm một hàm, dùng `grep -n "functionName" index.html`.
Không tự ý extract ra file riêng mà chưa cân nhắc kỹ impact.

---

## Quy trình release

Đọc skill đầy đủ: `.agents/skills/pfc-release-workflow/SKILL.md`

Tóm tắt 7 bước:
1. Syntax check: `node --check main.js` + check scripts trong `index.html`
2. Bump `version` trong `package.json` và static display `v2.x.x` trong `index.html` (~line 1435)
3. Thêm entry mới vào đầu `changelog.md`
4. `npm run build:all` → tạo 4 file trong `dist/`
5. `rm -rf dist/mac dist/mac-arm64 dist/win-unpacked` (xóa thư mục giải nén)
6. `git add -A && git commit -m "release: vX.Y.Z - <tóm tắt>" && git push origin main`
7. `node .agents/skills/pfc-release-workflow/scripts/publish-release.js` → GitHub Release

---

## Tài liệu chi tiết

| File | Nội dung |
|------|----------|
| `docs/architecture.md` | Kiến trúc, luồng dữ liệu, files chịu trách nhiệm |
| `docs/data-contracts.md` | Schema đầy đủ: song, settings, media, bible, schedule, templates |
| `docs/rules.md` | Quy tắc làm việc chi tiết |
| `docs/debugging-playbook.md` | Hướng dẫn debug theo từng loại lỗi |
| `docs/feature-workflow.md` | Quy trình thêm tính năng mới |
| `docs/ui-guidelines.md` | Chuẩn giao diện từng cửa sổ |
| `changelog.md` | Lịch sử thay đổi toàn bộ |
| `swot_architecture_analysis.md` | Phân tích điểm mạnh/yếu, roadmap cải tiến |

---

## Lệnh thường dùng

```bash
npm start               # Chạy dev
npm run build:mac       # Build macOS
npm run build:win       # Build Windows
npm run build:all       # Build tất cả

# Syntax check trước khi commit
node --check main.js
node --check preload.js

# Tìm hàm trong index.html
grep -n "functionName" index.html

# Xem lịch sử
git log --oneline -10
```
