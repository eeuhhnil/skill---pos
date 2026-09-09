# Epos – Tài liệu BA

## Cấu trúc thư mục

```
docs/
├── 01-requirements/                  # Yêu cầu nghiệp vụ
│   ├── business-requirements/        # Yêu cầu nghiệp vụ tổng thể (BRD)
│   ├── functional-requirements/      # Yêu cầu chức năng (FRD)
│   └── non-functional-requirements/  # Yêu cầu phi chức năng (hiệu năng, bảo mật...)
│
├── 02-analysis/                      # Phân tích
│   ├── business-process/             # Quy trình nghiệp vụ (BPMN, flowchart)
│   ├── data-analysis/                # Phân tích dữ liệu, báo cáo
│   └── gap-analysis/                 # Phân tích khoảng cách (As-Is vs To-Be)
│
├── 03-specifications/                # Đặc tả chi tiết
│   ├── features/                     # Đặc tả từng tính năng
│   ├── api-specs/                    # Đặc tả API / interface
│   └── data-dictionary/              # Từ điển dữ liệu, định nghĩa trường
│
├── 04-use-cases/                     # Use cases & User stories
│   ├── use-cases/                    # Use case diagram + mô tả
│   └── user-stories/                 # User stories theo module/epic
│
├── 05-ux-ui/                         # Giao diện người dùng
│   ├── wireframes/                   # Wireframe (bản phác thảo)
│   └── mockups/                      # Mockup (bản thiết kế chi tiết)
│
├── 06-testing/                       # Kiểm thử
│   ├── test-plans/                   # Kế hoạch kiểm thử
│   ├── test-cases/                   # Bộ test case
│   └── acceptance-criteria/          # Tiêu chí nghiệm thu (AC)
│
├── 07-meetings/                      # Họp & Giao tiếp
│   ├── meeting-notes/                # Biên bản họp (YYYY-MM-DD_chủ-đề.md)
│   └── action-items/                 # Danh sách việc cần làm sau họp
│
├── 08-stakeholders/                  # Các bên liên quan
│   ├── stakeholder-map/              # Bản đồ stakeholder
│   └── communication/               # Kế hoạch & lịch sử giao tiếp
│
└── 09-releases/                      # Phát hành
    ├── release-notes/                # Ghi chú phát hành theo phiên bản
    └── changelogs/                   # Lịch sử thay đổi
```

## Quy tắc đặt tên file

| Loại file        | Quy tắc đặt tên                              | Ví dụ                                 |
|-----------------|----------------------------------------------|---------------------------------------|
| Tài liệu yêu cầu | `[MODULE]-[loại].md`                        | `checkout-FRD.md`                     |
| Use case        | `UC-[số]-[tên].md`                           | `UC-01-dang-nhap.md`                  |
| User story      | `US-[số]-[tên].md`                           | `US-042-in-hoa-don.md`                |
| Biên bản họp    | `YYYY-MM-DD_[chủ-đề].md`                    | `2026-04-21_kickoff.md`               |
| Test case       | `TC-[MODULE]-[số].md`                        | `TC-POS-001.md`                       |
| Đặc tả tính năng | `FEAT-[tên].md`                             | `FEAT-quan-ly-kho.md`                 |

## Ghi chú

- Dùng Markdown (`.md`) cho mọi tài liệu văn bản.
- Diagram/flowchart: lưu file nguồn (`.drawio`, `.bpmn`) kèm ảnh export (`.png`/`.svg`).
- Mockup/wireframe: lưu link Figma vào file `.md` tương ứng thay vì export ảnh nặng.
