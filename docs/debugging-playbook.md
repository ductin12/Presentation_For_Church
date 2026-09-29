# Debugging Playbook

## 1. Xác định lỗi ở đâu

- Main process: lỗi file I/O, IPC, protocol, menu, tạo cửa sổ
- Renderer: lỗi UI, state, render lại, sự kiện DOM
- Live window: lỗi scale, background, text overlay, crossfade
- Data layer: lỗi JSON, migration, cache, import

## 2. Thu hẹp phạm vi

- Reproduce bằng bước ngắn nhất có thể
- Ghi lại file, action, và window gây lỗi
- Kiểm tra console/log ở đúng process
- Xem dữ liệu đầu vào có hợp lệ không

## 3. Checklist theo loại lỗi

### Nếu lỗi dữ liệu

- Mở file trong `userData`
- Kiểm tra JSON có hỏng không
- Kiểm tra item có qua `migrateItem()` chưa
- Kiểm tra backup `.backup.*`

### Nếu lỗi IPC

- Kiểm tra tên method ở renderer
- Kiểm tra `preload.js` đã expose chưa
- Kiểm tra `ipcMain.handle(...)` có đúng tên không
- Kiểm tra payload có đúng shape không

### Nếu lỗi slide card list (bị tràn chữ, font quá to)

- Kiểm tra xem nội dung bài hát có chứa rich text inline style (`font-size: ...`) không
- Kiểm tra hàm `formatSlideCardLyrics()` đã được áp dụng trước khi gán HTML vào slide card chưa
- Kiểm tra container có class `slide-card-body` và CSS `font-size: 11.5px !important` có hiệu lực không

### Nếu lỗi chỉ xuất hiện ở bản Packaged mà npm start không bị

- Kiểm tra git status / git diff xem fix đã được commit và merge vào nhánh build chưa
- Kiểm tra bản cài đặt có được build lại bằng `npm run build:all` sau khi sửa code hay vẫn dùng file build cũ trong `dist/`
- Kiểm tra userData giữa môi trường dev (Electron dev profile) và packaged app (Application Support / AppData)

### Nếu lỗi live window

- Kiểm tra đã mở live window chưa
- Kiểm tra chế độ 1 màn hình (dock vào monitor) hay nhiều màn hình (fullscreen display ngoài)
- Kiểm tra `app-media://` có trỏ đúng file không
- Kiểm tra scale/canvas và style text truyền sang live window qua `sendToLiveWindow()`

### Nếu lỗi media

- Kiểm tra file có nằm trong `userData/media`
- Kiểm tra extension có được hỗ trợ
- Kiểm tra tên file, ký tự đặc biệt và khoảng trắng
- Kiểm tra protocol custom có phục vụ file không

## 4. Sau khi sửa

- Chạy lại đúng luồng đã hỏng
- Kiểm tra log cho cả main và renderer
- Kiểm tra không sinh lỗi mới
- Nếu lỗi liên quan contract, cập nhật docs
