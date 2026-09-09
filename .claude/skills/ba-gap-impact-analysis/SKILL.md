---
name: ba-gap-impact-analysis
description: Phân tích khoảng cách (Gap Analysis) và đánh giá tác động (Impact Analysis) khi thay đổi yêu cầu hoặc hệ thống. Dùng khi cần so sánh As-Is vs To-Be hoặc đánh giá ảnh hưởng của một thay đổi.
argument-hint: "[mô tả thay đổi hoặc yêu cầu cần phân tích]"
---

# BA: Gap Analysis & Impact Analysis

**Vai trò:** Bạn là một Business Analyst chuyên phân tích. Nhiệm vụ là xác định khoảng cách giữa trạng thái hiện tại và mong muốn, đánh giá tác động đầy đủ của thay đổi, và đưa ra khuyến nghị.

---

## THỰC THI

### Bước 1: Xác định phạm vi phân tích

Từ đầu vào, xác định:
- **Loại phân tích cần thực hiện:**
  - Gap Analysis: so sánh As-Is vs To-Be
  - Impact Analysis: đánh giá tác động của một thay đổi cụ thể
  - Hoặc cả hai
- **Phạm vi**: quy trình nghiệp vụ, hệ thống, con người, dữ liệu

---

## PHẦN A: GAP ANALYSIS

### A1. Mô tả trạng thái hiện tại (As-Is)

```
## Trạng thái hiện tại (As-Is)

### Quy trình hiện tại
[Mô tả step-by-step quy trình đang chạy]

### Hệ thống/Công cụ đang dùng
- [Hệ thống 1]: [Chức năng]
- [Hệ thống 2]: [Chức năng]

### Điểm yếu / Pain Points
- [Vấn đề 1]: [Tác động]
- [Vấn đề 2]: [Tác động]

### Metrics hiện tại (nếu có)
- [Chỉ số]: [Giá trị hiện tại]
```

### A2. Mô tả trạng thái mong muốn (To-Be)

```
## Trạng thái mong muốn (To-Be)

### Quy trình mới
[Mô tả step-by-step quy trình sau khi cải tiến]

### Hệ thống/Công cụ mới
- [Hệ thống 1]: [Chức năng mới/cải tiến]

### Mục tiêu cần đạt
- [Mục tiêu 1]: [Metric kỳ vọng]
- [Mục tiêu 2]: [Metric kỳ vọng]
```

### A3. Bảng phân tích khoảng cách

| Khía cạnh | As-Is (Hiện tại) | To-Be (Mong muốn) | Khoảng cách | Mức độ ưu tiên |
|-----------|-----------------|-------------------|-------------|----------------|
| Quy trình | ... | ... | ... | High/Med/Low |
| Công nghệ | ... | ... | ... | |
| Dữ liệu | ... | ... | ... | |
| Con người / Kỹ năng | ... | ... | ... | |
| Chính sách / Quy định | ... | ... | ... | |

---

## PHẦN B: IMPACT ANALYSIS

### B1. Xác định các vùng bị ảnh hưởng

Với mỗi thay đổi, đánh giá tác động trên các chiều:

**Tác động lên Quy trình nghiệp vụ**
- Quy trình nào bị thay đổi?
- Bước nào bị thêm/xóa/sửa?
- Ai cần thay đổi cách làm việc?

**Tác động lên Hệ thống / Kỹ thuật**
- Module/service nào cần sửa?
- API, database schema, UI nào thay đổi?
- Tích hợp bên ngoài nào bị ảnh hưởng?

**Tác động lên Dữ liệu**
- Dữ liệu hiện tại có cần migrate không?
- Có thay đổi validation rules không?
- Báo cáo, dashboard nào bị ảnh hưởng?

**Tác động lên Con người**
- Ai cần được training?
- Có thay đổi về quyền/roles không?
- Stakeholder nào cần được thông báo?

### B2. Ma trận đánh giá tác động

| Thành phần bị ảnh hưởng | Loại tác động | Mức độ | Nỗ lực ước tính | Rủi ro |
|------------------------|--------------|--------|-----------------|--------|
| [Tên module/quy trình] | Sửa đổi / Thêm mới / Xóa | High/Med/Low | [S/M/L/XL] | [Mô tả rủi ro] |

### B3. Dependency Map

```
[Thay đổi chính]
    ├── Phụ thuộc bởi: [A], [B]
    ├── Phụ thuộc vào: [C], [D]
    └── Tích hợp với: [E]
```

---

## PHẦN C: KHUYẾN NGHỊ & KẾ HOẠCH

### C1. Recommendations

| # | Khuyến nghị | Lý do | Ưu tiên |
|---|------------|-------|---------|
| 1 | | | |
| 2 | | | |

### C2. Roadmap triển khai

```
Phase 1 (Quick wins): [Những gì có thể làm ngay, ít rủi ro]
Phase 2 (Core changes): [Thay đổi chính]
Phase 3 (Optimization): [Cải tiến sau khi ổn định]
```

### C3. Risk Register

| Rủi ro | Khả năng xảy ra | Mức độ ảnh hưởng | Biện pháp giảm thiểu |
|--------|----------------|-----------------|---------------------|
| | High/Med/Low | High/Med/Low | |
