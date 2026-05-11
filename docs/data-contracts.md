# Chuẩn Dữ Liệu

## Item cơ bản

Item được lưu trong library thường có dạng:

```json
{
  "id": 1234567890,
  "title": "Amazing Grace",
  "lyrics": "Line 1\nLine 2\n\nLine 3",
  "type": "song",
  "style": {
    "fontSize": "80px",
    "fontFamily": "CMG Sans",
    "color": "#ffffff",
    "textAlign": "center",
    "verticalAlign": "middle",
    "textBox": {
      "left": 48,
      "width": 864
    }
  },
  "background": null
}
```

## Quy ước migrate

- `fontColor` là field legacy, phải được chuyển sang `color`
- `fontSize` có thể từng là number hoặc chuỗi `pt`; dữ liệu mới nên là chuỗi `px`
- `migrateItem()` phải giữ tương thích ngược
- `validateItem()` phải chặn item thiếu `id`, `title`, `lyrics`

## Settings

Settings hiện lưu trong `settings.json`. Các field quan trọng gồm:

- `theme`
- `fontFamily`
- `fontSize`
- `color`
- `fontWeight`
- `textAlign`
- `verticalAlign`
- `mediaPath`
- `shortcuts`

## Media

Media object thường có:

- `name`
- `path`
- `type` = `image` hoặc `video`

Media thật nằm trong `userData/media` hoặc folder được cấu hình bởi `mediaPath`.

## Bible cache

- File cache được tạo theo từng XML nguồn
- Không nên coi cache là nguồn dữ liệu duy nhất
- Khi XML đổi, cache phải được rebuild

## Schedule

- File schedule dùng đuôi `.bcsch`
- Nội dung là JSON
- Save/Open đi qua native dialog
