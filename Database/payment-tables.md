# Cấu trúc bảng: payment_history, mc_receipt, mc_payment

> Database: `easyposbackoffice` | Server: `10.100.110.78`  
> Cập nhật: 2026-04-23

---

## 1. dbo.payment_history — Lịch sử thanh toán hóa đơn

Ghi lại từng lần thanh toán được thực hiện cho một hóa đơn. Một hóa đơn có thể có nhiều lần thanh toán (thanh toán nhiều đợt, nhiều phương thức).

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | bigint | NOT NULL (PK) | ID lịch sử thanh toán, tự tăng |
| 2 | com_id | int | YES | ID công ty / chi nhánh |
| 3 | ref_id | int | YES | ID chứng từ gốc tham chiếu (bill.id hoặc chứng từ khác) |
| 4 | type_no | int | YES | Loại chứng từ |
| 5 | payment_method | nvarchar(50) | YES | Phương thức thanh toán (tiền mặt, thẻ, chuyển khoản, ví điện tử...) |
| 6 | amount_received | decimal(21,6) | YES | Số tiền khách đưa / thực nhận |
| 7 | amount | decimal(21,6) | YES | Số tiền cần thanh toán (theo hóa đơn) |
| 8 | refund | decimal(21,6) | YES | Tiền thối lại cho khách (amount_received − amount) |
| 9 | debt | decimal(21,6) | YES | Số tiền còn nợ (amount − amount_received, nếu trả thiếu) |
| 10 | debt_type | int | YES | Loại công nợ phát sinh (xem enum bên dưới) |
| 11 | creator | int | YES | ID nhân viên thực hiện thanh toán |
| 12 | updater | int | YES | ID nhân viên cập nhật cuối |
| 13 | create_time | datetime | YES | Thời gian ghi nhận thanh toán |
| 14 | update_time | datetime | YES | Thời gian cập nhật |
| 15 | norm_date | int | YES | Ngày chuẩn hóa (format YYYYMMDD, dùng phân tích) |
| 16 | norm_quarter | int | YES | Quý chuẩn hóa (format YYYYQ, dùng phân tích) |
| 17 | type_doc | int | YES | Loại chứng từ liên quan (xem enum bên dưới) |
| 18 | bill_id | int | YES | ID hóa đơn (FK → dbo.bill.id) |
| 19 | payment_source_id | int | YES | ID nguồn thanh toán (tài khoản ngân hàng, máy POS...) |

### Enum: payment_history.debt_type — Loại công nợ

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Không phát sinh công nợ (đã thanh toán đủ) |
| 1 | Nợ phải thu |
| -1 | Nợ phải trả |

### Enum: payment_history.type_doc — Loại chứng từ

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Bán hàng |
| 2 | Xuất kho |
| 3 | Nhập kho |

---

## 2. dbo.mc_receipt — Phiếu thu tiền

Ghi nhận các khoản tiền THU vào quỹ (thu từ khách hàng thanh toán hóa đơn, thu các khoản khác).

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID phiếu thu, tự tăng |
| 2 | com_id | int | YES | ID công ty / chi nhánh |
| 4 | type_desc | nvarchar(50) | YES | Mô tả loại phiếu thu (text hiển thị) |
| 5 | date | datetime | YES | Ngày lập phiếu thu |
| 6 | no | nvarchar(25) | YES | Số phiếu thu (mã phiếu) |
| 7 | customer_id | int | YES | ID khách hàng nộp tiền |
| 8 | customer_name | nvarchar(400) | YES | Tên khách hàng nộp tiền |
| 9 | amount | decimal(21,6) | YES | Số tiền thu |
| 10 | description | nvarchar(255) | YES | Diễn giải nội dung thu tiền |
| 11 | creator | int | YES | ID nhân viên lập phiếu |
| 12 | updater | int | YES | ID nhân viên cập nhật cuối |
| 13 | create_time | datetime | YES | Thời gian tạo bản ghi |
| 14 | update_time | datetime | YES | Thời gian cập nhật |
| 15 | business_type_id | int | YES | ID loại nghiệp vụ thu (danh mục nội bộ) |
| 17 | rs_inoutward_id | int | YES | ID bút toán kế toán nhập/xuất quỹ |
| 18 | payment_method | nvarchar(50) | YES | Phương thức thu (tiền mặt, chuyển khoản, thẻ...) |
| 19 | customer_normalized_name | nvarchar(512) | YES | Tên khách đã chuẩn hóa dấu (tìm kiếm) |
| 20 | ref_id | int | YES | ID chứng từ gốc tham chiếu |
| 21 | norm_date | int | YES | Ngày chuẩn hóa (YYYYMMDD) |
| 22 | norm_quarter | int | NOT NULL | Quý chuẩn hóa (YYYYQ), mặc định 20234 |
| 23 | type_doc | int | YES | Loại chứng từ nguồn (xem enum bên dưới) |

### Enum: mc_receipt.type_doc — Nguồn phiếu thu

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Phiếu thu từ hóa đơn bán hàng (chiếm phần lớn) |
| 2 | Phiếu thu từ nguồn khác |
| 3 | Phiếu thu đặc thù |
| NULL | Chưa phân loại |

### Enum: mc_receipt.funds — Quỹ tiền

| Giá trị | Ý nghĩa |
|---------|---------|
| 3 | Quỹ tiền mặt |
| NULL | Không gắn quỹ (thanh toán online, thẻ...) |

---

## 3. dbo.mc_payment — Phiếu chi tiền

Ghi nhận các khoản tiền CHI ra từ quỹ (chi trả nhà cung cấp, chi hoàn tiền khách, chi khác).

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID phiếu chi, tự tăng |
| 2 | com_id | int | YES | ID công ty / chi nhánh |
| 3 | rs_inoutward_id | int | YES | ID bút toán kế toán nhập/xuất quỹ |
| 4 | type_desc | nvarchar(50) | YES | Mô tả loại phiếu chi (text hiển thị) |
| 5 | date | datetime | YES | Ngày lập phiếu chi |
| 6 | no | nvarchar(25) | YES | Số phiếu chi (mã phiếu) |
| 7 | customer_id | varchar(26) | YES | ID đối tượng nhận tiền (khách hàng hoặc NCC) |
| 8 | customer_name | nvarchar(400) | YES | Tên đối tượng nhận tiền |
| 9 | amount | decimal(21,6) | YES | Số tiền chi |
| 10 | description | nvarchar(255) | YES | Diễn giải nội dung chi tiền |
| 11 | business_type_id | int | YES | ID loại nghiệp vụ chi (danh mục nội bộ) |
| 12 | funds | int | YES | Quỹ tiền: 3=Tiền mặt, NULL=Không xác định |
| 13 | creator | int | YES | ID nhân viên lập phiếu chi |
| 14 | updater | int | YES | ID nhân viên cập nhật cuối |
| 15 | create_time | datetime | YES | Thời gian tạo bản ghi |
| 16 | update_time | datetime | YES | Thời gian cập nhật |
| 17 | code | varchar(50) | YES | Mã phiếu chi (mã khác với no) |
| 18 | payment_method | nvarchar(50) | YES | Phương thức chi (tiền mặt, chuyển khoản, thẻ...) |
| 19 | customer_normalized_name | nvarchar(512) | YES | Tên đã chuẩn hóa dấu (tìm kiếm) |
| 20 | bill_id | int | YES | ID hóa đơn liên quan (nếu chi hoàn tiền khách) |
| 21 | ref_id | int | YES | ID chứng từ gốc tham chiếu (đơn mua hàng...) |
| 22 | type_doc | int | NOT NULL | Loại chứng từ nguồn (xem enum), mặc định 0 |

### Enum: mc_payment.type_doc — Nguồn phiếu chi

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Phiếu chi thường / chi khác (chiếm phần lớn) |
| 1 | Phiếu chi từ đơn mua hàng |
| 2 | Phiếu chi hoàn tiền / thanh toán công nợ |
| NULL | Chưa phân loại |



## Quan hệ giữa các bảng thanh toán

```
dbo.bill (hóa đơn)
  ├── dbo.payment_history   (lịch sử từng lần thanh toán, bill_id → bill.id)
  ├── dbo.mc_receipt        (phiếu thu kế toán, bill_id → bill.id)
  └── dbo.mc_payment        (phiếu chi hoàn tiền, bill_id → bill.id)
```

- **payment_history**: góc nhìn **nghiệp vụ bán hàng** — ghi nhận ai trả bao nhiêu, bằng gì, còn nợ không
- **mc_receipt**: góc nhìn **kế toán** — phiếu thu chính thức vào sổ quỹ
- **mc_payment**: góc nhìn **kế toán** — phiếu chi chính thức ra sổ quỹ
