# Chuẩn Hợp Đồng Dữ Liệu (Data Contracts v2.2.0)

Tài liệu này định nghĩa cấu trúc dữ liệu chính xác được lưu trữ trong `userData` và truyền tải qua các kênh IPC.

---

## 1. Bài Hát (Song Item)

Được lưu trong file `songs.json` hoặc truyền tải qua `save-song`, `load-songs`:

```json
{
  "id": 1712345678901,
  "title": "Ơn Lạ Lùng",
  "lyrics": "Verse 1\nƠn lạ lùng thay, tha thiết dịu êm\n\nChorus\nChúa chuộc linh hồn con",
  "type": "song",
  "style": {
    "fontFamily": "Times New Roman",
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
    "textBox": { "left": 48, "width": 864, "top": null },
    "boxStyle": {
      "enabled": false,
      "backgroundColor": "#000000",
      "backgroundOpacity": 0.35,
      "borderColor": "#ffffff",
      "borderWidth": 0,
      "borderStyle": "solid",
      "borderRadius": 0,
      "padding": { "top": 0, "right": 0, "bottom": 0, "left": 0 }
    }
  },
  "background": {
    "mediaName": "worship_bg.jpg",
    "mediaType": "image",
    "url": "app-media://worship_bg.jpg"
  }
}
```

*Quy ước:*
- `\n\n` phân tách các block slide.
- Dòng đầu của mỗi block có thể là label (`Verse 1`, `Chorus`, `Bridge`).
- Hợp âm nằm trong ngoặc vuông `[F]`, `[Am]` được render hiển thị trên monitor nội bộ và tự động tách lọc (`stripChords`) khi xuất sang màn hình chiếu Live.

---

## 2. Mẫu Định Dạng (Style Template)

Được lưu trong file `style-templates.json`:

```json
{
  "id": "tpl-1712345678",
  "name": "Nền Box Tối Trọng Thể",
  "scope": "both",
  "style": {
    "fontFamily": "CMG Sans",
    "fontSize": "72px",
    "color": "#ffffff",
    "textStrokeWidth": 3,
    "textStrokeColor": "#000000",
    "textAlign": "center",
    "verticalAlign": "middle",
    "textMargin": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
    "textPadding": { "top": 0, "right": 0, "bottom": 0, "left": 0 },
    "boxStyle": {
      "enabled": true,
      "backgroundColor": "#000000",
      "backgroundOpacity": 0.5,
      "borderColor": "#e2e8f0",
      "borderWidth": 1,
      "borderStyle": "solid",
      "borderRadius": 8,
      "padding": { "top": 12, "right": 16, "bottom": 12, "left": 16 }
    }
  }
}
```

---

## 3. Cài Đặt Hệ Thống (Global Settings)

Được lưu trong file `settings.json`:

```json
{
  "theme": "dark",
  "gpuAcceleration": true,
  "enforceDefaultSlideStyle": false,
  "fontSizeSong": "80px",
  "fontFamilySong": "Times New Roman",
  "colorSong": "#ffffff",
  "fontSizeBible": "48px",
  "fontFamilyBible": "Times New Roman",
  "colorBible": "#ffffff",
  "uiFontFamilyApp": "",
  "uiFontFamilySong": "",
  "uiFontSizeSong": 13,
  "uiColorSong": "",
  "uiFontFamilyBible": "",
  "uiFontSizeBible": 13,
  "uiColorBible": "",
  "uiFontFamilySlideCards": "",
  "uiFontSizeSlideCards": 11.5,
  "uiColorSlideCards": "",
  "uiFontFamilyPanelHeaders": "",
  "uiFontSizePanelHeaders": 10,
  "uiColorPanelHeaders": "",
  "uiSizeControlBtn": 9,
  "uiFontFamilySongSnippet": "",
  "uiFontSizeSongSnippet": 9,
  "uiColorSongSnippet": "#818cf8",
  "shortcuts": {
    "nextSlide": "ArrowRight",
    "prevSlide": "ArrowLeft",
    "clearScreen": "Escape"
  }
}
```

---

## 4. Lịch Chiếu (Schedule File `.bcsch`)

File lưu lịch chiếu có cấu trúc JSON mảng các Schedule Items:
- Kế thừa toàn bộ trường của Song/Bible.
- Bổ sung `scheduleId` (duy nhất trong buổi lễ).
- Bổ sung `appliedTemplateId`, `appliedTemplateName`, `sourceStyle` khi áp dụng mẫu định dạng.
