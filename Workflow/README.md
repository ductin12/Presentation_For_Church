# Thư Mục Quản Lý Tiến Trình (Workflow Directory)

Nơi lưu trữ có tổ chức toàn bộ các bản sao lưu, nhật ký hành động, kịch bản test và biên bản nghiệm thu của dự án.

## Cấu trúc chuẩn
```
Workflow/
├── README.md                          (Tài liệu chỉ dẫn này)
├── v2.2.0/                            (Lưu trữ toàn bộ hồ sơ nghiệm thu của bản v2.2.0)
│   ├── WF-*-PLAN.md
│   ├── WF-*-EXECUTION-LOG.md
│   ├── WF-*-ACCEPTANCE-REPORT.md
│   ├── test-*-suite.js
│   └── backup-*/
├── backup-<timestamp>/                (Bản sao lưu an toàn của đợt làm việc hiện tại)
└── WF-<timestamp>-<TASK>-*.md         (Hồ sơ làm việc của task hiện tại)
```

## Quy ước đặt tên hồ sơ
1. **Pha 1 (Lập Kế hoạch):** `WF-<YYYYMMDD>-<TÊN_TASK>-PLAN.md`
2. **Pha 2 (Nhật ký thực thi):** `WF-<YYYYMMDD>-<TÊN_TASK>-EXECUTION-LOG.md`
3. **Pha 2 (Kiểm thử tự động):** `test-<tên_task>-suite.js`
4. **Pha 2 (Nghiệm thu bàn giao):** `WF-<YYYYMMDD>-<TÊN_TASK>-ACCEPTANCE-REPORT.md`
5. **Sau khi release thành công:** Toàn bộ hồ sơ của phiên được gom vào thư mục `Workflow/v<X.Y.Z>/`.
