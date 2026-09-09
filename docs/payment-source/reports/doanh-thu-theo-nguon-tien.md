---
type: srs
feature: payment-source
status: draft
lang: vi
owner: "@huelinh"
created: 2026-07-11
updated: 2026-07-11
links: [docs/payment-source/srs/spec.md]
tags: [report, doanh-thu]
stale_reason: ""
changelog:
  - 2026-07-11 | /ba-write-srs | tạo mới báo cáo doanh thu theo nguồn tiền (chuyển nhóm từ payment_method sang payment_source)
---

# Báo cáo doanh thu theo nguồn tiền

**Mã tài liệu:** SRS-PSR-RPT-001  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-07-11  
**Người soạn:** Duong Thi Hue Linh (@huelinh)  
**Trạng thái:** Draft  

> Báo cáo này kế thừa "Báo cáo doanh thu theo hình thức thanh toán" (bản gốc 20/08/2025 — Nguyễn Thị Minh Ánh). Thay đổi cốt lõi: **chuyển chiều nhóm doanh thu từ `payment_history.payment_method` (text tự do) sang nguồn tiền `payment_source` (khóa cứng)** theo feature Quản lý nguồn tiền.

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi |
|---|---|---|---|---|---|
| 2025-08-20 | Toàn bộ (bản gốc) | A | Cải tiến báo cáo | Nguyễn Thị Minh Ánh | Khởi tạo báo cáo doanh thu theo HTTT |
| 2026-07-11 | Mục 4.3 | M | Feature Quản lý nguồn tiền | @huelinh | Nhóm doanh thu theo `payment_source` thay cho `payment_method` |

---

## 1. THÔNG TIN CHUNG

| Mục | Nội dung |
|---|---|
| **Tiêu đề** | Báo cáo doanh thu theo nguồn tiền |
| **Mục đích** | So sánh doanh thu của từng nguồn tiền theo đơn hàng trong kỳ |
| **Chế độ xem** | Bảng biểu; Biểu đồ |
| **Định dạng xuất** | Excel; PDF (A4 ngang) |
| **Mô tả thay đổi** | Nhóm theo nguồn tiền (`payment_source`); thêm bảng biểu; biểu đồ cột dọc; bỏ báo cáo số hóa đơn |

---

## 2. BỐI CẢNH THAY ĐỔI

### 2.1 Vấn đề của bản gốc (nhóm theo `payment_method`)

- `payment_method` là **text tự do** nhập tay lúc bán hàng. Sai lệch 1–2 ký tự (vd "vnpay" vs "VNPAY") làm cùng một hình thức bị **tách thành 2 dòng doanh thu** — báo cáo sai.
- Cửa hàng có nhiều hình thức cố định (>10) phải chọn "Khác" rồi gõ tên → mất thời gian, dễ nhầm.
- Biểu đồ cột ngang: khi một dòng doanh thu cao thì không nhìn được số liệu.
- Không có bảng biểu liệt kê chi tiết.

### 2.2 Giải pháp

- Nhóm doanh thu theo **nguồn tiền** (`payment_source_id`) — khóa cứng do cửa hàng cấu hình, hết rủi ro sai chính tả và tách dòng.
- Bổ sung bảng biểu chi tiết.
- Đổi biểu đồ cột ngang sang **cột dọc**.
- Bỏ báo cáo số hóa đơn (tránh double khi 1 đơn thanh toán nhiều nguồn tiền); vẫn theo dõi được số lượng đơn hàng.

---

## 3. LUỒNG THAO TÁC

```
[Người dùng]                              [Hệ thống]
      |
      | (1) Chọn Báo cáo > Doanh thu theo nguồn tiền
      |----------------------------------------> Hiển thị bộ lọc (mặc định chi nhánh
      |                                          hiện tại, kỳ = Hôm nay)
      |
      | (2) Chỉnh bộ lọc + Lấy dữ liệu
      |----------------------------------------> Truy vấn payment_history join
      |                                          payment_source theo bộ lọc
      |
      |<---------------------------------------- Hiển thị bảng doanh thu theo
      |                                          nguồn tiền + biểu đồ cột đôi dọc
      |
      | (3) Xuất file (Excel / PDF)
      |----------------------------------------> Tải file theo bộ lọc hiện tại
```

---

## 4. CHI TIẾT

### 4.1 Bộ lọc tham số

| STT | Tên trường | Loại control | GT mặc định | Mô tả |
|---|---|---|---|---|
| 1 | Chi nhánh | Textbox | Chi nhánh hiện tại đang truy cập | Click: hiển thị popup chọn chi nhánh |
| 2 | Kỳ báo cáo | Combo-box | Hôm nay | Hôm nay / Hôm qua / Tuần này / Tuần trước / Tháng này / Tháng trước / 30 ngày qua / Quý này / Quý trước / Năm nay / Năm trước / Tháng 1–12 / Tùy chỉnh. Cho phép chọn lại |
| 3 | Từ ngày – Đến ngày | Datepicker | Fill theo kỳ báo cáo | Cho phép chỉnh lại; Đến ngày >= Từ ngày; Từ ngày <= Ngày hiện tại |

### 4.2 Popup chọn chi nhánh

> Đầu ra: DS chi nhánh (`company.id`)

| STT | Tên trường | Loại control | Mô tả |
|---|---|---|---|
| 1 | Tìm kiếm | Textbox | Tìm theo tên chi nhánh, SĐT chi nhánh (`company.name`, `company.phone`) |
| 2 | Chọn chi nhánh | Checkbox | Cho phép chọn 1 hoặc nhiều; mặc định: chi nhánh đang truy cập |
| 3 | Chọn tất cả | Button | Click: chọn toàn bộ danh sách |
| 4 | Bỏ chọn tất cả | Button | Hiển thị khi đã chọn ít nhất 1 checkbox |
| 5 | Đã chọn | Text | Hiển thị khi chọn ít nhất 1. Cú pháp: "Đã chọn" + số chi nhánh được chọn |
| 6 | STT | Text | Đánh số theo STT |
| 7 | Tên chi nhánh | Text | Lấy theo chi nhánh được phép truy cập tùy tài khoản |
| 8 | Phân trang | Pager | — |

### 4.3 Bảng doanh thu theo nguồn tiền theo đơn hàng

**Dữ liệu đầu vào:**
- Chi nhánh
- Kỳ báo cáo: từ ngày – đến ngày

**Dữ liệu đầu ra:**
- STT
- Tên nguồn tiền
- Doanh thu theo nguồn tiền
- Số lượng đơn hàng theo nguồn tiền
- Tổng doanh thu, tổng số lượng đơn hàng

**Nguồn:** `payment_history ph`, `bill b`, `payment_source ps` *(bảng thêm mới so với bản gốc)*

**Join:** `ph.payment_source_id = ps.id` và `ph.bill_id = b.id`

**Lưu ý (điều kiện lấy dữ liệu):**
- Lấy thực thu các đơn hàng trong kỳ báo cáo (`từ ngày <= bill.date <= đến ngày`).
- Chỉ lấy `payment_history.type_no = 1` *(giữ nguyên như bản gốc — xem câu hỏi mở OQ-2)*.
- Lấy các bill trạng thái: đã hoàn thành, thay thế, bị trả hàng, trả hàng (`bill.status = 1, 6, 3, 4`).
- **Nhóm (`GROUP BY`) theo `ph.payment_source_id`** thay vì `payment_method`.
- Bản ghi có `payment_source_id IS NULL` (dữ liệu cũ chưa map được nguồn tiền khi migrate) → gộp vào dòng **"Chưa xác định nguồn tiền"**, không loại bỏ để tránh thất thoát doanh thu *(xem OQ-1)*.

**Bảng minh họa:**

| STT | Tên nguồn tiền | Doanh thu | Số lượng đơn hàng |
|---|---|---|---|
| 1 | Tiền mặt | 10.000.000 | 20 |
| 2 | Chuyển khoản | 10.000.000 | 20 |
| 3 | VietQR MB Bank | 10.000.000 | 10 |
| 4 | Cổng thanh toán VCB | 10.000.000 | 10 |
| | **Tổng** | **40.000.000** | **60** |

**Chi tiết trường:**

| STT | Tên trường | Công thức | Ghi chú |
|---|---|---|---|
| 1 | STT | Đánh theo STT | |
| 2 | Tên nguồn tiền | `ps.name` (join `ph.payment_source_id = ps.id`) | **Thay `payment_history.payment_method` của bản gốc** |
| 3 | Doanh thu theo nguồn tiền | `= sum(ph.amount đã hoàn thành) + sum(ph.amount thay thế) + sum(ph.amount bị trả hàng) − sum(ph.amount trả hàng)`, `GROUP BY ph.payment_source_id` | Tổng doanh thu theo nguồn tiền trong kỳ. Đã hoàn thành `bill.status=1`; Thay thế `=6`; Bị trả hàng `=3`; Trả hàng `=4` |
| 4 | Số lượng đơn hàng theo nguồn tiền | `COUNT(DISTINCT ph.bill_id)` `GROUP BY ph.payment_source_id` | Đếm đơn theo từng nguồn tiền |
| 5 | Tổng doanh thu | `= Sum(ph.amount đã hoàn thành, thay thế, bị trả hàng) − sum(ph.amount trả hàng)` | Tổng thực thu tất cả nguồn tiền trong kỳ |
| 6 | Tổng số lượng đơn hàng | `COUNT(DISTINCT ph.bill_id)` trên toàn kỳ (không cộng dồn từng dòng) | Tránh đếm trùng khi 1 đơn thanh toán bằng nhiều nguồn tiền |
| 7 | Phân trang | — | Giữ nguyên |
| 8 | Xuất file | Click: hiển thị menu Excel / PDF | Xem Mục 4.5 |

### 4.4 Biểu đồ

- Biểu đồ **cột đôi, dọc** (thay biểu đồ cột ngang của bản gốc).
- Trục hoành: tên nguồn tiền. Cột đôi: doanh thu và số lượng đơn hàng theo từng nguồn tiền.
- Tham khảo bố cục: báo cáo tổng hợp bán hàng theo ngày (CukCuk).

### 4.5 Xuất file

| Thao tác | Kết quả |
|---|---|
| Click "Xuất file" | Hiển thị menu: Excel, PDF |
| Chọn Excel | Tải xuống bản Excel theo bộ lọc hiện tại |
| Chọn PDF | Tải xuống bản PDF khổ A4 ngang theo bộ lọc hiện tại |

---

## 5. SO SÁNH VỚI BẢN GỐC

| Bản gốc (nhóm theo `payment_method`) | Bản mới (nhóm theo `payment_source`) |
|---|---|
| Cột "Tên HTTT" = `payment_history.payment_method` (text tự do) | Cột "Tên nguồn tiền" = `payment_source.name` qua `payment_source_id` (khóa cứng) |
| `GROUP BY payment_method` → rủi ro tách dòng "vnpay" vs "VNPAY" | `GROUP BY payment_source_id` → hết rủi ro sai chính tả |
| Nguồn: `payment_history`, `bill` | Thêm join `payment_source` |
| Đếm số đơn hàng ngầm định | `COUNT(DISTINCT bill_id)`; tổng dùng distinct toàn kỳ |

---

## 6. CÂU HỎI MỞ

- [ ] **OQ-1:** Bản ghi `payment_source_id IS NULL` (đơn cũ trước migrate không map được tên nguồn tiền) — gộp vào dòng "Chưa xác định nguồn tiền" *(mặc định đang áp dụng, không mất doanh thu)*, hay ẩn hẳn khỏi báo cáo? *(chờ xác nhận)*
- [ ] **OQ-2:** Điều kiện lọc `payment_history.type_no = 1` giữ nguyên theo bản gốc. SRS hiện tại dùng `type_doc = 1` cho "bán hàng" — cần xác nhận `type_no` và `type_doc` có phải cùng một ý nghĩa không, hay phải đồng bộ sang `type_doc = 1`. *(chờ xác nhận)*

---

*Hết tài liệu*
