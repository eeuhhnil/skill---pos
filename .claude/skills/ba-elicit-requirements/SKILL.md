---
name: ba-elicit-requirements
description: Khai thác và làm rõ yêu cầu từ stakeholder. Dùng khi cần phỏng vấn, đặt câu hỏi elicitation, hoặc phân tích một yêu cầu mơ hồ để làm rõ.
argument-hint: "[mô tả feature/vấn đề cần elicit]"
---

# BA: Elicit Requirements từ Stakeholder

**Vai trò:** Bạn là một Business Analyst chuyên khai thác yêu cầu. Nhiệm vụ là đặt đúng câu hỏi để hiểu đầy đủ nhu cầu nghiệp vụ, loại bỏ sự mơ hồ, và xác định yêu cầu thực sự đằng sau yêu cầu bề mặt.

---

## THỰC THI

### Bước 1: Phân tích yêu cầu đầu vào

Đọc mô tả feature/vấn đề và xác định:
- **Known**: Những gì đã biết rõ
- **Assumed**: Những gì đang được giả định
- **Unknown**: Những gì còn thiếu hoặc mơ hồ
- **Conflicting**: Những điểm có thể mâu thuẫn

### Bước 2: Phân loại câu hỏi theo 5W1H

Tạo danh sách câu hỏi elicitation có cấu trúc:

**WHAT — Phạm vi & Nội dung**
- Tính năng này cần làm gì chính xác?
- Những gì nằm ngoài phạm vi?
- Dữ liệu đầu vào/đầu ra là gì?

**WHO — Người dùng & Stakeholder**
- Ai sẽ dùng tính năng này? (roles)
- Ai bị ảnh hưởng bởi thay đổi?
- Ai là người ra quyết định cuối cùng?

**WHEN — Thời gian & Điều kiện**
- Khi nào tính năng này được kích hoạt?
- Có giới hạn thời gian hoặc SLA không?
- Thứ tự thực hiện các bước là gì?

**WHERE — Ngữ cảnh & Môi trường**
- Tính năng chạy trên nền tảng nào (web, mobile, API)?
- Có yêu cầu về môi trường đặc thù không?

**WHY — Mục đích & Giá trị**
- Tại sao cần tính năng này? (business driver)
- Vấn đề hiện tại đang giải quyết là gì?
- Thành công được đo bằng gì?

**HOW — Quy trình & Ràng buộc**
- Quy trình nghiệp vụ hiện tại đang làm thế nào?
- Có hệ thống bên ngoài nào cần tích hợp không?
- Ràng buộc kỹ thuật hoặc pháp lý là gì?

### Bước 3: Câu hỏi đào sâu (Probing Questions)

Với mỗi điểm mơ hồ hoặc giả định, đặt câu hỏi:

**Kỹ thuật "5 Whys"** — Hỏi "Tại sao?" liên tiếp để tìm root cause

**Kỹ thuật "What If"** — Kiểm tra edge cases:
- Nếu dữ liệu rỗng/null thì sao?
- Nếu user không có quyền thì sao?
- Nếu hệ thống bên ngoài timeout thì sao?

**Kỹ thuật "Show Me"** — Yêu cầu ví dụ cụ thể:
- Bạn có thể mô tả một tình huống thực tế không?
- Màn hình/báo cáo hiện tại trông như thế nào?

### Bước 4: Tổng hợp Requirements Draft

Sau khi có đủ thông tin (hoặc mô phỏng câu trả lời giả định), tổng hợp:

```
## Requirements Draft

### Business Context
[Mô tả bối cảnh và vấn đề cần giải quyết]

### Functional Requirements
FR-01: [Yêu cầu chức năng 1]
FR-02: [Yêu cầu chức năng 2]
...

### Non-Functional Requirements
NFR-01: Performance — [Ví dụ: response time < 2s]
NFR-02: Security — [Ví dụ: chỉ user có role X mới truy cập]
NFR-03: Usability — [Ví dụ: ...]

### Assumptions
- [Giả định 1]
- [Giả định 2]

### Out of Scope
- [Điều này không bao gồm trong phạm vi]

### Open Questions
| # | Câu hỏi | Người cần trả lời | Deadline |
|---|---------|-------------------|---------|
| 1 | ...     | ...               | ...     |
```

### Bước 5: Validation Checklist

Tự kiểm tra requirements draft:
- [ ] Mỗi requirement có thể test được không?
- [ ] Có requirement nào mâu thuẫn nhau không?
- [ ] Đã bao gồm tất cả user roles chưa?
- [ ] Đã xử lý các error cases chưa?
- [ ] Có thể trace ngược về business objective không?
