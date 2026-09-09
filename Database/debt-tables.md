# Cấu trúc bảng: debt & debt_payment
---

## 1. dbo.debt — Công nợ

Ghi nhận các khoản công nợ phát sinh (phải thu từ khách hàng hoặc phải trả cho nhà cung cấp). Mỗi bản ghi là một khoản nợ được tạo ra từ một chứng từ gốc (hóa đơn bán hàng, đơn mua hàng...).

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID khoản công nợ, tự tăng |
| 2 | com_id | int | YES | ID công ty / chi nhánh |
| 3 | ref_id | int | YES | ID chứng từ gốc phát sinh công nợ (bill.id, đơn mua...) |
| 4 | type_no | int | YES | Loại chứng từ
| 5 | type_debt | int | YES | Loại công nợ (xem enum bên dưới) |
| 6 | customer_id | int | YES | ID khách hàng / nhà cung cấp liên quan |
| 7 | customer_name | nvarchar(400) | YES | Tên khách hàng / nhà cung cấp |
| 8 | customer_normalized_name | nvarchar(524) | YES | Tên đã chuẩn hóa dấu (tìm kiếm) |
| 9 | amount | decimal(21,6) | YES | Số tiền công nợ ban đầu |
| 10 | description | nvarchar(255) | YES | Diễn giải khoản nợ |
| 11 | create_time | datetime | YES | Thời gian phát sinh công nợ |
| 12 | creator | int | YES | ID người tạo bản ghi |
| 13 | update_time | datetime | YES | Thời gian cập nhật |
| 14 | updater | int | YES | ID người cập nhật cuối |
| 15 | norm_date | int | YES | Ngày chuẩn hóa (YYYYMMDD) |
| 16 | norm_quarter | int | YES | Quý chuẩn hóa (YYYYQ) |
| 17 | type_doc | int | YES | Loại chứng từ chi tiết (xem enum bên dưới) |
| 18 | no | nchar(250) | YES | Số chứng từ / mã tham chiếu |

### Enum: debt.type_debt — Loại công nợ

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Công nợ phải thu (khách hàng nợ tiền mình) |
| 2 | Công nợ phải trả (mình nợ tiền nhà cung cấp) |

### Enum: debt.type_doc — Loại chứng từ chi tiết

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Bán hàng |
| 2 | Xuất kho |
| 3 | Nhập kho |

---

## 2. dbo.debt_payment — Thanh toán công nợ

Ghi nhận từng lần thanh toán công nợ. Mỗi bản ghi là một lần thanh toán (một phần hoặc toàn bộ) cho khoản công nợ trong bảng `debt`.

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID bản ghi thanh toán công nợ, tự tăng |
| 2 | com_id | int | YES | ID công ty / chi nhánh |
| 3 | type_no | int | YES | Loại chứng từ: 1=Hóa đơn bán hàng, NULL=Khác |
| 4 | ref_id | int | YES | ID chứng từ gốc (bill.id hoặc đơn mua...) |
| 5 | receipt_id | int | YES | ID phiếu thu liên quan (FK → dbo.mc_receipt.id) |
| 6 | debt_id | int | YES | ID khoản công nợ được thanh toán (FK → dbo.debt.id) |
| 7 | type_debt_payment | int | YES | Loại thanh toán công nợ (xem enum bên dưới) |
| 8 | customer_id | int | YES | ID khách hàng / nhà cung cấp |
| 9 | amount | decimal(21,6) | YES | Số tiền thanh toán trong lần này |
| 10 | description | nvarchar(255) | YES | Diễn giải nội dung thanh toán |
| 11 | create_time | datetime | YES | Thời gian ghi nhận thanh toán |
| 12 | creator | int | YES | ID người tạo bản ghi |
| 13 | update_time | datetime | YES | Thời gian cập nhật |
| 14 | updater | int | YES | ID người cập nhật cuối |
| 15 | norm_date | int | YES | Ngày chuẩn hóa (YYYYMMDD) |
| 16 | norm_quarter | int | YES | Quý chuẩn hóa (YYYYQ) |
| 17 | type_doc | int | YES | Loại chứng từ chi tiết (xem enum bên dưới) |
| 18 | customer_name | nvarchar(255) | YES | Tên khách hàng / nhà cung cấp |
| 19 | customer_normalized_name | nvarchar(255) | YES | Tên đã chuẩn hóa dấu (tìm kiếm) |
| 20 | no | nvarchar(50) | YES | Số phiếu / mã thanh toán công nợ |

### Enum: debt_payment.type_debt_payment — Loại thanh toán công nợ

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Thu tiền công nợ phải thu (khách trả nợ cho mình) |
| 2 | Trả tiền công nợ phải trả (mình trả nợ cho NCC) |
| 1000 | Xử lý đặc biệt (bù trừ công nợ, điều chỉnh...) |

### Enum: debt_payment.type_doc — Loại chứng từ

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Nợ khác, không có chứng từ tham chiếu |
| 1 | Pán hàng |
| 2 | Xuất kho |
| 3 | Nhập kho |

---

## Quan hệ giữa các bảng công nợ

```
dbo.bill (hóa đơn bán hàng)
  └── dbo.debt          (khoản công nợ phát sinh, ref_id → bill.id)
        └── dbo.debt_payment  (thanh toán công nợ, debt_id → debt.id)
                └── dbo.mc_receipt  (phiếu thu kế toán, receipt_id → mc_receipt.id)
```

### Luồng nghiệp vụ điển hình

**Khách mua hàng, trả một phần, nợ phần còn lại:**

1. Tạo `dbo.bill` → hóa đơn với `total_amount = 10.000.000`
2. Khách trả 7.000.000 → ghi vào `payment_history` (`debt = 3.000.000`, `debt_type = 1`)
3. Tạo `dbo.debt` → `amount = 3.000.000`, `type_debt = 1` (phải thu)
4. Hôm sau khách trả nốt 3.000.000:
   - Tạo `dbo.mc_receipt` → phiếu thu 3.000.000
   - Tạo `dbo.debt_payment` → ghi nhận thanh toán công nợ, `debt_id` trỏ vào bước 3
