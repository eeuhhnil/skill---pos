---
type: srs
feature: thu-no-cong-no
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-21
updated: 2026-08-21
links: []
tags: [cong-no, thu-no, phieu-thu, ngay-chung-tu]
changelog:
  - 2026-08-21 | /ba-write-srs | tạo mới SRS bổ sung ngày thu nợ vào thanh toán công nợ
---

# SRS — Bổ sung ngày thu nợ vào thanh toán công nợ

**Mã tài liệu:** SRS-TNCN-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-08-21
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-08-21 | Toàn bộ | A | Yêu cầu khách hàng | @huelinh | Tạo mới tài liệu | |

---

## MỤC LỤC

1. Nguồn gốc thay đổi
2. Nội dung thay đổi
   - 2.1 Mô tả chung về yêu cầu thay đổi
   - 2.2 Mô tả thay đổi về luồng nghiệp vụ
   - 2.3 Yêu cầu người dùng
   - 2.4 Ngữ cảnh người dùng
   - 2.5 Mô tả thay đổi về CSDL
   - 2.6 Danh sách các chức năng
3. Chi tiết các chức năng thay đổi
   - 3.1 Thu nợ công nợ phải thu
   - 3.2 Ghi nhận ngày phiếu thu / phiếu chi công nợ
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Rủi ro
6. Open Questions
7. Phụ lục — Script chuyển đổi dữ liệu

---

## 1. NGUỒN GỐC THAY ĐỔI

Yêu cầu từ khách hàng sử dụng EPOS. Khách trả nợ trong ngày nhưng cửa hàng chưa kịp nhập phần mềm, hôm sau mới tạo chứng từ thu nợ. Hệ thống hiện lấy thời điểm nhập liệu làm thời gian thu nợ, nên sổ công nợ ghi nhận sai ngày so với ngày tiền thực sự trao tay.

Màn hình Thu nợ đã có sẵn ô "Thời gian" nhưng giá trị người dùng chọn không được lưu xuống bảng thanh toán công nợ.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Bổ sung trường ngày thu nợ vào bảng thanh toán công nợ `dbo.debt_payment`, cho phép người dùng chọn ngày tiền thực tế được thu thay vì bám theo thời điểm nhập liệu. Các khóa phân tích theo ngày và theo quý của bảng này chuyển sang bám trường mới, để mọi báo cáo công nợ theo kỳ phản ánh đúng ngày phát sinh nghiệp vụ.

Kèm theo, sửa lỗi phiếu thu / phiếu chi sinh từ nghiệp vụ thu nợ đang lấy nhầm ngày chứng từ gốc làm ngày lập phiếu, khiến sổ quỹ và sổ công nợ lệch nhau.

Đây là thay đổi trên chức năng đã có, không phát sinh màn hình mới.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Người dùng mở màn hình Thu nợ của một khách hàng.
2. Người dùng chọn ngày ở ô "Thời gian", tích chọn các chứng từ cần thu, nhập số tiền thu, nhấn "Thanh toán".
3. Hệ thống ghi bản ghi vào `dbo.debt_payment` với `create_time = GETDATE()`. **Giá trị ngày người dùng chọn bị bỏ qua.**
4. Hệ thống tính `norm_date` / `norm_quarter` từ `create_time`.
5. Hệ thống sinh phiếu thu `dbo.mc_receipt` với `date` lấy theo ngày chứng từ gốc (hóa đơn / phiếu nhập kho), không phải ngày thu tiền.
6. Báo cáo công nợ theo kỳ đọc `norm_date` → hiển thị khoản thu vào ngày nhập liệu.

**Luồng mới (To-Be):**

1. Người dùng mở màn hình Thu nợ của một khách hàng.
2. Người dùng chọn ngày ở ô "Thời gian" (mặc định là ngày hiện tại), tích chọn các chứng từ cần thu, nhập số tiền thu, nhấn "Thanh toán".
3. Hệ thống kiểm tra ngày chọn không lớn hơn ngày hiện tại (BR-thu-no-001). Nếu vi phạm thì chặn và báo lỗi E-thu-no-001.
4. Hệ thống ghép ngày người dùng chọn với giờ hệ thống tại thời điểm lưu, ghi vào `debt_payment.payment_date` (BR-thu-no-002). `create_time` vẫn ghi `GETDATE()` để giữ dấu vết nhập liệu.
5. Hệ thống tính `norm_date` / `norm_quarter` **từ `payment_date`**.
6. Hệ thống sinh phiếu thu `dbo.mc_receipt` với `date` = `payment_date`, `norm_date` / `norm_quarter` dẫn xuất tương ứng.
7. Báo cáo công nợ theo kỳ đọc `norm_date` → hiển thị khoản thu đúng vào ngày tiền thực thu.

**Điểm khác biệt cốt lõi:** tách bạch *ngày nghiệp vụ* (`payment_date` — tiền trao tay khi nào) khỏi *dấu vết hệ thống* (`create_time` — ai nhập lúc nào). Đây là cách hệ thống đang làm với hóa đơn (`bill.bill_date` vs `bill.create_time`) và phiếu thu (`mc_receipt.date` vs `mc_receipt.create_time`); bảng thanh toán công nợ hiện là chỗ duy nhất chưa áp dụng.

### 2.3 Yêu cầu người dùng

| StoryID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-001 | Thu ngân / Nhân viên cửa hàng | Chọn được ngày khách thực sự trả tiền khi tạo phiếu thu nợ | Ghi nhận đúng ngày phát sinh dù hôm sau mới nhập phần mềm | Cao |
| US-002 | Kế toán | Báo cáo công nợ theo kỳ lấy theo ngày thu tiền thực tế | Đối chiếu công nợ với khách hàng không bị lệch ngày | Cao |
| US-003 | Kế toán | Phiếu thu sinh từ nghiệp vụ thu nợ mang đúng ngày thu tiền | Sổ quỹ và sổ công nợ khớp nhau khi đối chiếu cuối kỳ | Cao |
| US-004 | Thu ngân | Hệ thống chặn khi chọn ngày tương lai | Tránh ghi nhận khoản thu chưa xảy ra | Trung bình |

*Chi tiết acceptance criteria sẽ được sinh qua `/ba-user-story` ở bước tiếp theo.*

### 2.4 Ngữ cảnh người dùng

Thu ngân và chủ cửa hàng thao tác trên màn hình Thu nợ của back-office, chủ yếu bằng máy tính tại quầy. Tình huống điển hình phát sinh yêu cầu này: khách trả nợ vào cuối ngày hoặc ngoài giờ, cửa hàng bận nên hôm sau mới mở phần mềm nhập chứng từ. Người dùng không có kiến thức kỹ thuật, thao tác nhanh, nên ô chọn ngày phải giữ nguyên vị trí và cách dùng hiện tại.

Kế toán là người tiêu thụ dữ liệu ở cuối luồng — không thao tác trên màn hình này nhưng chịu ảnh hưởng trực tiếp khi số liệu lệch ngày.

### 2.5 Mô tả thay đổi về CSDL

| Loại | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| A | dbo.debt_payment | payment_date | datetime | NOT NULL, DEFAULT GETDATE() | Ngày giờ thu / trả nợ theo nghiệp vụ. Ngày do người dùng chọn, giờ do hệ thống gán |
| M | dbo.debt_payment | norm_date | int | — | Đổi nguồn tính: từ `create_time` sang `payment_date` |
| M | dbo.debt_payment | norm_quarter | int | — | Đổi nguồn tính: từ `create_time` sang `payment_date` |

**Ghi chú kỹ thuật:**

- `create_time` / `update_time` / `creator` / `updater` **giữ nguyên ý nghĩa cũ** (dấu vết nhập liệu), không sửa logic ghi.
- Cột `norm_date` nằm trong index `idx_debt_payment_com_customer`. Index không cần đổi định nghĩa, nhưng dữ liệu trong index sẽ được cập nhật khi chạy script chuyển đổi.
- Đã kiểm tra `sys.sql_modules`: **không có view hay stored procedure nào tham chiếu `debt_payment`**. Toàn bộ logic đọc/ghi nằm ở tầng ứng dụng, nên phạm vi sửa tập trung ở service và câu truy vấn báo cáo.
- Bảng hiện có 1.726 bản ghi — khối lượng nhỏ, script chuyển đổi chạy trực tiếp được, không cần chia lô.

Script chuyển đổi xem Mục 7.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Thu ngân, Chủ cửa hàng | Thu nợ (popup) | Thu nợ công nợ phải thu | Ghi nhận khoản khách trả nợ theo ngày người dùng chọn | Cao |
| Hệ thống | (nền) | Ghi nhận ngày phiếu thu / phiếu chi công nợ | Sinh phiếu thu / phiếu chi mang đúng ngày thu nợ | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Thu nợ công nợ phải thu

#### 3.1.1 Thông tin chung về chức năng

Chức năng cho phép thu ngân ghi nhận khoản tiền khách hàng trả cho các khoản công nợ phải thu đang tồn. Phạm vi thay đổi lần này chỉ nằm ở **thời gian ghi nhận**: giá trị ô "Thời gian" trên màn hình được lưu xuống cơ sở dữ liệu thay vì bị bỏ qua như hiện tại.

Bố cục màn hình, cách chọn chứng từ, cách phân bổ số tiền thu và toàn bộ logic tính công nợ còn lại **không thay đổi**.

#### 3.1.2 Màn hình chức năng

Màn hình popup "Thu nợ - {Tên khách hàng}", mở từ danh sách công nợ khách hàng.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Thời gian | Datepicker | Ngày hiện tại | Có | **(Thay đổi)** Ngày khách thực tế trả tiền. Chỉ chọn ngày, không nhập giờ. Không cho chọn ngày lớn hơn ngày hiện tại — xem BR-thu-no-001. Giá trị được lưu vào `debt_payment.payment_date` cùng giờ hệ thống |
| 2 | Nợ hiện tại | Textbox (readonly) | Tổng công nợ còn lại của khách | Không | Không thay đổi |
| 3 | Tiền thu | Textbox số | Trống | Có | Không thay đổi. Dòng chú thích "Còn nợ: {số tiền} vnđ" cập nhật theo số nhập |
| 4 | Chứng từ phải thu — checkbox chọn dòng | Checkbox | Bỏ chọn | Không | Không thay đổi |
| 5 | Chứng từ phải thu — lưới dữ liệu | Grid | Danh sách chứng từ còn nợ | Không | Không thay đổi. Các cột: Mã phiếu, Thời gian tạo, Mô tả, Số nợ, Đã thu, Cần thu, Số tiền thu, Nợ dự kiến |
| 6 | Dòng Tổng | Grid row | Cộng dồn các dòng | Không | Không thay đổi |
| 7 | Phân trang | Dropdown + nút | 20 bản ghi | Không | Không thay đổi |
| 8 | Hủy bỏ | Button | — | — | Không thay đổi. Đóng popup, không ghi dữ liệu |
| 9 | Thanh toán | Button | — | — | Không thay đổi về giao diện. Bổ sung kiểm tra BR-thu-no-001 trước khi gửi yêu cầu |

**Ghi chú giao diện:** không bổ sung control mới, không đổi vị trí trường. Thay đổi duy nhất về giao diện là ô "Thời gian" chuyển từ trạng thái không có tác dụng sang có tác dụng thực sự, kèm ràng buộc chặn ngày tương lai.

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Ghi nhận khoản khách trả nợ vào đúng ngày tiền thực sự trao tay, kể cả khi cửa hàng nhập liệu chậm sang ngày hôm sau |
| **Tác nhân (Actor)** | Thu ngân, Chủ cửa hàng (tác nhân chính); Hệ thống (sinh phiếu thu, cập nhật công nợ) |
| **Điều kiện kích hoạt (Trigger)** | Người dùng nhấn nút "Thanh toán" trên popup Thu nợ |
| **Điều kiện tiên quyết (Pre-condition)** | Người dùng đã đăng nhập và có quyền thu nợ (cơ chế phân quyền hiện hành); khách hàng có ít nhất một khoản công nợ phải thu còn dư; số tiền thu lớn hơn 0 |
| **Điều kiện sau khi thực hiện (Post-condition)** | Bản ghi `debt_payment` được tạo với `payment_date` = ngày người dùng chọn + giờ hệ thống, `norm_date` / `norm_quarter` dẫn xuất từ `payment_date`, `create_time` = thời điểm nhập liệu; phiếu thu `mc_receipt` được tạo với `date` = `payment_date`; công nợ còn lại của khách giảm tương ứng |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở popup Thu nợ từ danh sách công nợ khách hàng | Đọc `dbo.debt` lọc `customer_id = {khách đang chọn}`, `com_id = {chi nhánh đang đăng nhập}`, `type_debt = 1` (phải thu) và số dư còn lại lớn hơn 0. Số dư mỗi khoản = `debt.amount` trừ tổng `debt_payment.amount` của các bản ghi có cùng `debt_id`. Hiển thị lưới Chứng từ phải thu sắp xếp theo `debt.create_time` giảm dần, phân trang 20 dòng. Ô "Thời gian" gán mặc định ngày hiện tại |
| 2 | Chọn ngày ở ô "Thời gian" | Không cho chọn ngày lớn hơn ngày hiện tại trên chính datepicker (chặn tại giao diện). Không thay đổi dữ liệu lưới |
| 3 | Tích chọn chứng từ và nhập số tiền thu | Phân bổ số tiền vào các dòng được chọn, cập nhật cột "Số tiền thu" và "Nợ dự kiến" của từng dòng và dòng Tổng. Logic phân bổ giữ nguyên như hiện tại |
| 4 | Nhấn "Thanh toán" | Kiểm tra BR-thu-no-001: nếu ngày ở ô "Thời gian" lớn hơn ngày hiện tại của máy chủ thì dừng xử lý, hiển thị E-thu-no-001, không ghi dữ liệu. Kiểm tra hợp lệ số tiền theo logic hiện hành |
| 5 | (Hệ thống tự động) | Dựng giá trị ngày giờ thu nợ theo BR-thu-no-002: lấy phần ngày từ ô "Thời gian", lấy phần giờ / phút / giây từ đồng hồ máy chủ tại thời điểm xử lý |
| 6 | (Hệ thống tự động) | Ghi vào `dbo.debt_payment` cho từng chứng từ được thu: `payment_date` = giá trị ở bước 5; `norm_date` = định dạng `yyyyMMdd` của `payment_date`; `norm_quarter` = năm nhân 10 cộng số quý của `payment_date`; `create_time` = `GETDATE()`; `creator` = người dùng đang đăng nhập; `amount` = số tiền thu của dòng; `debt_id`, `customer_id`, `com_id`, `type_debt_payment = 1`, `type_doc`, `ref_id`, `no` giữ theo logic hiện hành |
| 7 | (Hệ thống tự động) | Sinh phiếu thu `dbo.mc_receipt` theo Mục 3.2: `date` = `payment_date` của bản ghi vừa tạo, `norm_date` / `norm_quarter` dẫn xuất từ `date`, `create_time` = `GETDATE()`. Cập nhật `debt_payment.receipt_id` trỏ về phiếu thu vừa sinh |
| 8 | (Hệ thống tự động) | Đóng popup, làm mới danh sách công nợ khách hàng. Số dư công nợ hiển thị giảm đúng bằng tổng số tiền vừa thu |

**Truy vấn mẫu cho bước 6:**

```sql
INSERT INTO dbo.debt_payment
    (com_id, type_no, ref_id, receipt_id, debt_id, type_debt_payment,
     customer_id, amount, description,
     payment_date, norm_date, norm_quarter,
     create_time, creator, type_doc, customer_name, customer_normalized_name, no)
VALUES
    (@com_id, @type_no, @ref_id, NULL, @debt_id, 1,
     @customer_id, @amount, @description,
     @payment_date,                                              -- BR-thu-no-002
     CONVERT(int, FORMAT(@payment_date, 'yyyyMMdd')),
     YEAR(@payment_date) * 10 + DATEPART(QUARTER, @payment_date),
     GETDATE(), @creator, @type_doc, @customer_name, @customer_normalized_name, @no);
```

Trong đó `@payment_date` được dựng ở bước 5:

```sql
-- Ngày lấy từ người dùng, giờ lấy từ máy chủ
DECLARE @payment_date datetime =
    CAST(CAST(@ngay_nguoi_dung_chon AS date) AS datetime)
  + CAST(CAST(GETDATE() AS time) AS datetime);
```

**Trường hợp lỗi / Ngoại lệ:**

| Mã | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|---|
| E-thu-no-001 | Ngày ở ô "Thời gian" lớn hơn ngày hiện tại của máy chủ | "Thời gian thu nợ không được lớn hơn ngày hiện tại." | Dừng xử lý, không ghi bất kỳ bản ghi nào, giữ nguyên popup và dữ liệu người dùng đã nhập |
| E-thu-no-002 | Ô "Thời gian" để trống | "Vui lòng chọn thời gian thu nợ." | Dừng xử lý, đưa con trỏ về ô "Thời gian" |

**Ghi chú về kiểm tra ngày:** kiểm tra ở bước 4 thực hiện tại máy chủ, không chỉ tại giao diện. Datepicker chặn ở bước 2 là lớp thuận tiện cho người dùng, không phải lớp bảo vệ dữ liệu — máy trạm có thể lệch giờ so với máy chủ.

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-thu-no-001 | Ngày thu nợ không được lớn hơn ngày hiện tại của máy chủ. Vi phạm thì hệ thống chặn lưu và báo lỗi E-thu-no-001. Không có ràng buộc giới hạn nào khác về ngày — cho phép chọn tự do mọi ngày trong quá khứ |
| BR-thu-no-002 | Giá trị `debt_payment.payment_date` được ghép từ phần ngày do người dùng chọn và phần giờ / phút / giây của đồng hồ máy chủ tại thời điểm lưu, áp dụng thống nhất cho cả trường hợp chọn ngày hiện tại lẫn ngày quá khứ |
| BR-thu-no-003 | `debt_payment.norm_date` và `debt_payment.norm_quarter` luôn dẫn xuất từ `payment_date`, không dẫn xuất từ `create_time`. Áp dụng cho cả bản ghi tạo mới lẫn dữ liệu chuyển đổi |
| BR-thu-no-004 | Phiếu thu và phiếu chi sinh từ nghiệp vụ thu / trả nợ nhận `date` bằng đúng `payment_date` của bản ghi thanh toán công nợ tương ứng |

---

### 3.2 Ghi nhận ngày phiếu thu / phiếu chi công nợ

#### 3.2.1 Thông tin chung về chức năng

Xử lý nền, không có giao diện. Khi hệ thống sinh phiếu thu (`dbo.mc_receipt`) cho nghiệp vụ thu nợ phải thu hoặc phiếu chi (`dbo.mc_payment`) cho nghiệp vụ trả nợ nhà cung cấp, ngày lập phiếu phải bằng ngày thu / trả nợ.

Mục này đồng thời khắc phục một lỗi đang tồn tại trên dữ liệu thật.

#### 3.2.2 Hiện trạng lỗi

Phiếu thu sinh từ nghiệp vụ thu nợ đang lấy ngày chứng từ gốc (hóa đơn hoặc phiếu nhập kho) làm ngày lập phiếu, thay vì ngày thu tiền. Dữ liệu kiểm chứng trên `easyposbackoffice` ngày 21/08/2026:

| debt_payment.id | Số phiếu | debt_payment.create_time | mc_receipt.date |
|---|---|---|---|
| 3314 | TNNKNK17 | 2026-08-21 09:53 | 2025-01-13 |
| 3306 | TNNKNK18 | 2026-08-20 17:00 | 2025-01-13 |
| 3305 | TNNKNK18 | 2026-08-20 16:59 | 2025-01-13 |
| 3304 | TNNKNK19 | 2026-08-20 16:58 | 2025-01-13 |

Phiếu thu tạo tháng 8/2026 nhưng mang ngày tháng 1/2025 — chênh hơn 19 tháng. Do `mc_receipt.norm_date` bám theo `mc_receipt.date`, sổ quỹ đang ghi nhận các khoản thu này vào kỳ tháng 1/2025.

Tổng cộng 262 trên 786 bản ghi `debt_payment` có phiếu thu liên quan đang lệch ngày so với thời điểm tạo. 940 bản ghi còn lại không gắn phiếu thu — chủ yếu là nghiệp vụ bù trừ công nợ và các khoản không sinh chứng từ quỹ.

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Bảo đảm sổ quỹ và sổ công nợ ghi nhận cùng một ngày cho cùng một nghiệp vụ thu / trả nợ |
| **Tác nhân (Actor)** | Hệ thống |
| **Điều kiện kích hoạt (Trigger)** | Ngay sau khi bản ghi `debt_payment` được tạo thành công (bước 6 của Mục 3.1.3) |
| **Điều kiện tiên quyết (Pre-condition)** | Bản ghi `debt_payment` đã có `payment_date` hợp lệ; nghiệp vụ thuộc loại có sinh chứng từ quỹ |
| **Điều kiện sau khi thực hiện (Post-condition)** | Phiếu thu / phiếu chi tồn tại với `date` bằng `payment_date`, `norm_date` / `norm_quarter` dẫn xuất từ `date`; `debt_payment.receipt_id` trỏ đúng phiếu vừa sinh |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | (Hệ thống tự động) | Xác định loại chứng từ quỹ theo `debt_payment.type_debt_payment`: giá trị 1 (thu nợ phải thu) sinh phiếu thu `dbo.mc_receipt`; giá trị 2 (trả nợ phải trả) sinh phiếu chi `dbo.mc_payment`; giá trị 1000 (bù trừ công nợ) không sinh chứng từ quỹ, kết thúc xử lý |
| 2 | (Hệ thống tự động) | Ghi `date` = `debt_payment.payment_date`. **Không lấy ngày từ chứng từ gốc** (`bill.bill_date` hoặc ngày phiếu nhập kho) — đây là điểm sửa so với hiện tại |
| 3 | (Hệ thống tự động) | Tính `norm_date` = định dạng `yyyyMMdd` của `date`; `norm_quarter` = năm nhân 10 cộng số quý của `date`. Ghi `create_time` = `GETDATE()`, `creator` = người dùng đang đăng nhập |
| 4 | (Hệ thống tự động) | Cập nhật `debt_payment.receipt_id` trỏ về phiếu vừa sinh (áp dụng cho trường hợp phiếu thu) |

**Trường hợp lỗi / Ngoại lệ:**

| Mã | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|---|
| E-thu-no-003 | Sinh phiếu thu / phiếu chi thất bại | "Không tạo được phiếu thu cho khoản thu nợ. Vui lòng thử lại." | Rollback toàn bộ giao dịch gồm cả bản ghi `debt_payment` đã ghi ở Mục 3.1.3, ghi log lỗi |

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-thu-no-004 | Phiếu thu và phiếu chi sinh từ nghiệp vụ thu / trả nợ nhận `date` bằng đúng `payment_date` của bản ghi thanh toán công nợ tương ứng (trùng với BR-thu-no-004 nêu ở Mục 3.1.4) |
| BR-thu-no-005 | Nghiệp vụ bù trừ công nợ (`type_debt_payment = 1000`) không sinh chứng từ quỹ |
| BR-thu-no-006 | Việc ghi bản ghi thanh toán công nợ và sinh chứng từ quỹ nằm trong cùng một giao dịch. Nếu một trong hai thất bại thì hoàn tác cả hai |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Báo cáo công nợ theo kỳ | Báo cáo công nợ | Cao | Câu truy vấn lọc theo `debt_payment.norm_date` giữ nguyên, nhưng giá trị `norm_date` đổi nguồn tính. Cần kiểm thử lại số liệu theo kỳ |
| Báo cáo tuổi nợ (aging) | Báo cáo công nợ | Cao | Số ngày quá hạn tính từ ngày thu thực tế thay vì ngày nhập liệu. Do không còn ràng buộc ngày thu phải sau ngày phát sinh nợ, số ngày có thể ra giá trị âm — xem Mục 5 |
| Sổ quỹ tiền mặt | Sổ quỹ / Thu chi | Cao | Phiếu thu nợ chuyển sang mang ngày thu thực tế thay vì ngày chứng từ gốc. Số dư quỹ theo ngày sẽ thay đổi so với hiện tại đối với các nghiệp vụ thu nợ |
| Đối chiếu công nợ khách hàng | Chi tiết công nợ khách hàng | Trung bình | Danh sách lịch sử thanh toán hiển thị theo ngày thu thực tế. Cột hiển thị ngày cần chuyển từ `create_time` sang `payment_date` |
| Danh sách phiếu thu | Quản lý phiếu thu | Trung bình | Phiếu thu nợ xuất hiện ở kỳ khác so với hiện tại sau khi sửa lỗi ở Mục 3.2 |
| Thu nợ phải trả nhà cung cấp | Công nợ nhà cung cấp | Trung bình | Dùng chung bảng `debt_payment`, hưởng thay đổi tương tự. Cần áp dụng cùng bộ quy tắc cho phiếu chi |
| Nhập liệu thu nợ | Thu nợ (popup) | Thấp | Không đổi bố cục, chỉ ô "Thời gian" có tác dụng và thêm ràng buộc chặn ngày tương lai |

### 4.2 Chức năng của hệ thống khác

Không áp dụng. Đã kiểm tra `sys.sql_modules` — không có view hay stored procedure nào tham chiếu `debt_payment`, và nghiệp vụ thu nợ không tích hợp ra hệ thống ngoài.

---

## 5. RỦI RO

| # | Rủi ro | Mức độ | Cách giảm nhẹ |
|---|---|---|---|
| R-01 | Sổ quỹ tiền mặt bị lùi ngày. Ghi nhận tiền về quỹ vào ngày quá khứ làm số dư quỹ của ngày đã kiểm quỹ thay đổi sau khi đã in báo cáo | Cao | Chấp nhận theo quyết định nghiệp vụ (không giới hạn lùi ngày). Đề xuất bổ sung cảnh báo xác nhận — xem OQ-01 |
| R-02 | Ngày thu nợ có thể sớm hơn ngày phát sinh khoản nợ. Báo cáo tuổi nợ ra số ngày âm; báo cáo công nợ tại một thời điểm quá khứ có thể hiện khoản đã thu trước khi khoản nợ tồn tại | Trung bình | Bên làm báo cáo xử lý hiển thị: hiển thị 0 thay cho số âm, hoặc đánh dấu dòng bất thường để kế toán rà soát |
| R-03 | Nhập sai ngày không sửa được. Hệ thống hiện không cho sửa và không có chức năng hủy phiếu thu nợ (`debt_payment` và `mc_receipt` không có cột trạng thái), nên sai sót ghi vào là vĩnh viễn | Trung bình | Chấp nhận theo quyết định nghiệp vụ. Cảnh báo xác nhận ở OQ-01 là biện pháp phòng ngừa rẻ nhất |
| R-04 | Sổ quỹ đổi số sau khi sửa lỗi ở Mục 3.2. 262 phiếu thu nợ hiện mang ngày chứng từ gốc; nếu sửa dữ liệu cũ thì số dư quỹ các kỳ trước sẽ đổi | Trung bình | Script chuyển đổi ở Mục 7 **không đụng vào dữ liệu `mc_receipt` cũ** — chỉ sửa logic cho phát sinh mới. Việc rà soát 262 bản ghi cũ tách thành công việc riêng, xem OQ-02 |
| R-05 | Bỏ sót đổi nguồn `norm_date`. Nếu chỉ thêm cột `payment_date` mà quên chuyển `norm_date` sang bám cột mới thì báo cáo vẫn sai như cũ, chỉ khác là có thêm một cột không ai đọc | Cao | BR-thu-no-003 quy định rõ. Đưa vào checklist kiểm thử: đối chiếu `norm_date` với `payment_date` trên mọi bản ghi sau khi triển khai |

---

## 6. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-01 | Có bổ sung cảnh báo xác nhận khi người dùng chọn ngày lùi quá 7 ngày không? Dạng: "Ngày thu nợ là {ngày}, cách hôm nay {N} ngày. Xác nhận?" — vẫn cho qua, chỉ thêm một nhịp dừng để giảm sai sót | 3.1.3, R-01, R-03 | Nghiệp vụ / Khách hàng | Trước khi chốt spec |
| OQ-02 | Có rà soát và sửa ngày cho 262 phiếu thu nợ cũ đang mang ngày chứng từ gốc không? Sửa thì số dư quỹ các kỳ đã báo cáo sẽ đổi; không sửa thì dữ liệu lịch sử giữ nguyên sai | 3.2.2, R-04, Mục 7 | Kế toán | Trước khi triển khai |

---

## 7. PHỤ LỤC — SCRIPT CHUYỂN ĐỔI DỮ LIỆU

> Chạy trên database `easyposbackoffice`. Sao lưu bảng `dbo.debt_payment` trước khi chạy.

**Nguyên tắc chuyển đổi:** gán `payment_date = create_time` cho toàn bộ 1.726 bản ghi cũ. Không lấy `mc_receipt.date` làm nguồn vì cột này đang chứa ngày chứng từ gốc không đáng tin (xem Mục 3.2.2). Cách này giữ nguyên `norm_date` hiện tại, nên **số liệu báo cáo các kỳ đã qua không thay đổi** sau khi triển khai.

```sql
-- B0. Sao lưu
SELECT * INTO dbo.debt_payment_bak_20260821 FROM dbo.debt_payment;
GO

-- B1. Thêm cột, cho phép NULL tạm thời
ALTER TABLE dbo.debt_payment ADD payment_date datetime NULL;
GO

-- B2. Chuyển đổi dữ liệu cũ: giữ nguyên hiện trạng, không làm đổi số báo cáo
UPDATE dbo.debt_payment
SET payment_date = create_time
WHERE payment_date IS NULL;
GO

-- B3. Đồng bộ khóa phân tích theo BR-thu-no-003
UPDATE dbo.debt_payment
SET norm_date    = CONVERT(int, FORMAT(payment_date, 'yyyyMMdd')),
    norm_quarter = YEAR(payment_date) * 10 + DATEPART(QUARTER, payment_date);
GO

-- B4. Siết ràng buộc
ALTER TABLE dbo.debt_payment
    ADD CONSTRAINT DF_debt_payment_payment_date DEFAULT (GETDATE()) FOR payment_date;
GO
ALTER TABLE dbo.debt_payment ALTER COLUMN payment_date datetime NOT NULL;
GO
```

**Câu lệnh kiểm tra sau khi chạy** (kỳ vọng: cả ba cột đều trả về 0):

```sql
SELECT
    SUM(CASE WHEN payment_date IS NULL THEN 1 ELSE 0 END)                              AS con_null,
    SUM(CASE WHEN norm_date <> CONVERT(int, FORMAT(payment_date,'yyyyMMdd'))
             THEN 1 ELSE 0 END)                                                        AS lech_norm_date,
    SUM(CASE WHEN norm_quarter <> YEAR(payment_date)*10 + DATEPART(QUARTER, payment_date)
             THEN 1 ELSE 0 END)                                                        AS lech_norm_quarter
FROM dbo.debt_payment;
```

**Câu lệnh hoàn tác** (nếu cần quay lại):

```sql
ALTER TABLE dbo.debt_payment DROP CONSTRAINT DF_debt_payment_payment_date;
ALTER TABLE dbo.debt_payment DROP COLUMN payment_date;
UPDATE dp
SET norm_date    = b.norm_date,
    norm_quarter = b.norm_quarter
FROM dbo.debt_payment dp
JOIN dbo.debt_payment_bak_20260821 b ON b.id = dp.id;
```
