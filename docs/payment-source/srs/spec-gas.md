---
type: srs
feature: payment-source-gas
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-06
updated: 2026-08-06
links:
  - docs/payment-source/srs/spec.md
tags: [gas, xang-dau, business-type-4]
stale_reason: ""
changelog:
  - 2026-08-06 | /ba-write-srs | initial draft — nghiệp vụ PTTT riêng Gas/Xăng dầu (business_type=4)
---

# SRS — Quản lý nguồn tiền: Nghiệp vụ riêng Gas/Xăng dầu

**Mã tài liệu:** SRS-PSR-GAS-001  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-08-06  
**Người soạn:** Duong Thi Hue Linh (@huelinh)  
**Trạng thái:** Draft  
**Tài liệu gốc:** [[docs/payment-source/srs/spec.md|SRS Quản lý nguồn tiền (chung)]]

> **Phạm vi tài liệu:** Tài liệu này chỉ mô tả các nghiệp vụ **khác biệt hoặc đặc thù** của loại hình kinh doanh Gas/Xăng dầu (`business_type = 4`). Các nghiệp vụ chung (quản lý kết nối VietQR, Cổng TT, phân quyền, báo cáo...) xem tại SRS chính.

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-08-06 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu — tách nghiệp vụ gas khỏi SRS chính | |

---

## MỤC LỤC

1. Nguồn gốc thay đổi
2. Nội dung thay đổi
   - 2.1 Mô tả chung
   - 2.2 Luồng nghiệp vụ
   - 2.3 Yêu cầu người dùng
   - 2.4 Ngữ cảnh người dùng
   - 2.5 Mô tả thay đổi về CSDL
   - 2.6 Danh sách các chức năng
3. Chi tiết các chức năng thay đổi
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Loại hình kinh doanh Gas/Xăng dầu (`business_type = 4`) có cấu trúc quản lý phương thức thanh toán khác biệt so với các loại hình thông thường:

- **Không sử dụng Cổng thanh toán (Cổng TT):** Gas không tích hợp cổng TT ngân hàng. Toàn bộ PTTT của gas thuộc loại cơ bản (`type = 0`).
- **Nguồn dữ liệu PTTT khác:** Các loại hình thông thường khởi tạo PTTT mặc định (Tiền mặt, Điểm, Thẻ KH). Gas lấy danh sách PTTT từ cấu hình hiện tại (`config.code = 'payment_method'`) — vốn đã được cửa hàng gas thiết lập trước khi có tính năng này.
- **HTTT hóa đơn tích hợp vào PTTT:** Với loại hình thông thường, màn hình thanh toán có 2 trường độc lập: "Nguồn tiền" và "HTTT hóa đơn". Với gas, 2 trường này hợp nhất thành 1 — người dùng chỉ chọn 1 lần.

Để tránh làm phức tạp SRS chính và dễ tra cứu cho team phát triển, nghiệp vụ gas được tách thành tài liệu riêng.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung

Với cửa hàng Gas/Xăng dầu (`business_type = 4`), tính năng Quản lý nguồn tiền hoạt động theo nguyên tắc đơn giản hơn so với loại hình thông thường: **toàn bộ PTTT đều là loại cơ bản**, không phân biệt Tiền mặt / Chuyển khoản / Cổng TT theo type.

Danh sách PTTT của gas được khởi tạo từ cấu hình hiện có (`config.code = 'payment_method'`) thay vì tạo mặc định cứng. Sau khi migrate, bảng `payment_source` trở thành nguồn dữ liệu chính (master) cho PTTT của gas. Màn hình cấu hình cũ (`config`) vẫn được giữ đồng bộ để đảm bảo backward compatibility với các phần còn lại của hệ thống đang đọc từ `config`.

Trên màn hình Xác nhận thanh toán, cửa hàng gas chỉ thấy 1 danh sách chọn PTTT — hệ thống tự dùng tên được chọn để điền vào cả 2 trường DB (`payment_history.payment_source_id` và `bill.payment_method`).

### 2.2 Luồng nghiệp vụ

**Luồng hiện tại (As-Is):**
1. Cửa hàng gas cấu hình HTTT tại màn hình Cài đặt → Danh sách hình thức thanh toán.
2. Hệ thống lưu danh sách dưới dạng JSON vào `config.code = 'payment_method'`: `{"payment": ["Tiền mặt", "Chuyển khoản", "TM/CK", "Khác"]}`.
3. Khi thu ngân bán hàng → chọn HTTT từ danh sách radio button lấy từ `config` → lưu vào `bill.payment_method`.
4. Không có bảng `payment_source`, không có liên kết ID.

**Luồng mới (To-Be):**
1. **Migrate một lần (Bước 1B):** Hệ thống đọc `config.code = 'payment_method'` → tạo bản ghi `payment_source` tương ứng (active=1). Sweep lịch sử giao dịch → tạo thêm `payment_source` cho các tên chưa có (active=0).
2. **Runtime — Bán hàng:** Thu ngân chọn PTTT từ danh sách radio lấy từ `payment_source` → hệ thống lưu `payment_history.payment_source_id` VÀ `bill.payment_method = payment_source.name`.
3. **Runtime — Quản lý PTTT:** Quản lý sửa tên hoặc thêm PTTT mới → hệ thống cập nhật đồng thời `payment_source` VÀ overwrite JSON trong `config` (trong 1 transaction).

### 2.3 Yêu cầu người dùng

| StoryID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-GAS-001 | Thu ngân cửa hàng xăng dầu | Chọn một phương thức thanh toán duy nhất khi bán hàng | Không cần chọn 2 lần (nguồn tiền + HTTT hóa đơn) | Cao |
| US-GAS-002 | Quản lý cửa hàng xăng dầu | Thêm mới phương thức thanh toán | Cập nhật PTTT theo nhu cầu thực tế của cửa hàng | Cao |
| US-GAS-003 | Quản lý cửa hàng xăng dầu | Đổi tên phương thức thanh toán đã có | Tên PTTT trên hóa đơn phản ánh đúng cách cửa hàng gọi | Trung bình |
| US-GAS-004 | Hệ thống (migration) | Tự động chuyển danh sách HTTT cũ sang `payment_source` | Không mất dữ liệu lịch sử, không phải nhập lại | Cao |

### 2.4 Ngữ cảnh người dùng

Cửa hàng xăng dầu thường có quy trình thanh toán nhanh, đặc biệt tại các cây xăng đông khách. Thu ngân thao tác trên máy tính bàn hoặc máy tính tiền POS. Danh sách PTTT của gas thường ngắn (3–5 loại), ổn định theo thời gian, ít thay đổi hơn so với nhà hàng hay bán lẻ thời trang.

Quản lý cửa hàng gas đã quen thiết lập HTTT qua màn hình Cài đặt hiện tại. Sau khi có tính năng mới, việc thêm/sửa PTTT sẽ chuyển sang màn hình Quản lý nguồn tiền, nhưng logic cấu hình không thay đổi nhiều.

### 2.5 Mô tả thay đổi về CSDL

Không có bảng mới so với SRS chính. Các bảng liên quan đã được mô tả tại `spec.md` Mục 2.5.

**Cấu trúc config hiện tại (tham chiếu):**

| Bảng | Cột `code` | Cấu trúc `value` |
|---|---|---|
| `config` | `payment_method` | JSON: `{"payment": ["Tiền mặt", "Chuyển khoản", "TM/CK", "Khác"]}` |

> Config lưu toàn bộ danh sách trong 1 dòng duy nhất per `com_id`. Khi update → ghi đè toàn bộ JSON (không update từng phần tử).

**Thay đổi dữ liệu trong migration:**

| Loại | Bảng | Mô tả |
|---|---|---|
| Thêm dữ liệu | `payment_source` | Tạo bản ghi per PTTT cho từng com_id gas (Bước 1B) |
| Cập nhật dữ liệu | `mc_payment`, `mc_receipt`, `payment_history` | Điền `payment_source_id` theo name matching (Bước 2–4 SRS chính) |
| Không thay đổi | `config` | Giữ nguyên, không xóa — tiếp tục sync khi user update qua UI mới |

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Thu ngân | Xác nhận thanh toán (gas) | Chọn PTTT khi bán hàng | Radio list 1 cấp từ `payment_source`; chọn 1 → fill cả 2 DB field | Cao |
| Quản lý | Quản lý nguồn tiền (gas) | Thêm mới PTTT | Tạo `payment_source` + append config JSON | Cao |
| Quản lý | Quản lý nguồn tiền (gas) | Sửa tên PTTT | Update `payment_source.name` + overwrite config JSON | Trung bình |
| Hệ thống | Migration | Bước 1B — migrate gas | Parse config JSON → tạo `payment_source`; sweep lịch sử | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Màn hình Xác nhận thanh toán — Gas

#### 3.1.1 Thông tin chung

Với cửa hàng gas, màn hình Xác nhận thanh toán hiển thị danh sách PTTT dưới dạng radio button một cấp — không phân nhóm theo loại (Tiền mặt / Chuyển khoản / Cổng TT) vì toàn bộ PTTT gas đều cùng loại (`type = 0`). Thu ngân chọn 1 PTTT, hệ thống tự ghi nhận vào cả `payment_history` (nguồn tiền) và `bill.payment_method` (HTTT hóa đơn) mà không cần thao tác thêm.

#### 3.1.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Phương thức thanh toán | Radio button (1 cấp, flat list) | PTTT có `default = 1` của com_id; nếu không có → không chọn sẵn | Có | DS lấy từ `payment_source` WHERE `com_id = [hiện tại]` AND `type = 0` AND `active = 1`; sắp xếp theo thứ tự tạo |
| 2 | Khách trả | Textbox (số) | Tổng tiền cần TT | Có | Số tiền khách đưa |
| 3 | Tiền thừa | Text (read-only) | Tự tính: Khách trả − Tổng tiền; hiển thị 0 nếu âm | Không | |
| 4 | Chi tiết thanh toán | Collapsible section | Thu gọn | Không | Tạm tính / chiết khấu / khuyến mại / phụ thu / thuế / tổng cần TT |
| 5 | Hủy bỏ | Button (secondary) | — | — | Đóng màn hình thanh toán, không lưu |
| 6 | Thanh toán | Button (primary) | — | — | Xác nhận TT; xem luồng xử lý bên dưới |

> **Khác biệt với loại hình thông thường:** Không có trường "Phương thức TT hóa đơn" (dropdown cố định 5 loại). Gas chỉ có 1 radio list PTTT duy nhất.

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Thu ngân xác nhận thanh toán đơn hàng cho cửa hàng gas; ghi nhận đúng PTTT vào lịch sử dòng tiền và hóa đơn |
| **Tác nhân** | Thu ngân cửa hàng gas |
| **Trigger** | Thu ngân nhấn nút "Thanh toán" trên màn hình bán hàng |
| **Pre-condition** | Đơn hàng đang ở trạng thái chờ thanh toán; com_id có `business_type = 4`; có ít nhất 1 `payment_source` với `type = 0, active = 1` |
| **Post-condition** | Đơn hàng hoàn thành; `bill.payment_method` = tên PTTT được chọn; `payment_history.payment_source_id` = id PTTT được chọn |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | (Hệ thống tự động) | Kiểm tra `business_type` của `com_id`. Nếu `= 4` → render màn hình thanh toán gas (flat radio list, không có dropdown HTTT). Query: `SELECT id, name FROM payment_source WHERE com_id = ? AND type = 0 AND active = 1 ORDER BY create_time ASC` |
| 2 | Thu ngân chọn 1 PTTT trong danh sách radio | Highlight PTTT được chọn; lưu tạm `selected_payment_source_id` và `selected_payment_source_name` |
| 3 | Thu ngân nhập số tiền khách trả | Hệ thống tính tiền thừa = Khách trả − Tổng cần TT; hiển thị real-time |
| 4 | Thu ngân nhấn "Thanh toán" | Validate: đã chọn PTTT (BR-gas-003); số tiền khách trả ≥ 0. Nếu thiếu → hiển thị lỗi, không tiếp tục |
| 5 | (Hệ thống tự động) | Tạo đơn hàng: `bill.payment_method = selected_payment_source_name` (BR-gas-003). Tạo `payment_history`: `payment_source_id = selected_payment_source_id`. Cập nhật trạng thái đơn → Hoàn thành |
| 6 | (Hệ thống tự động) | Hiển thị màn hình xác nhận thành công; trở về màn hình bán hàng |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Chưa chọn PTTT | "Vui lòng chọn phương thức thanh toán" | Giữ nguyên màn hình, focus vào danh sách PTTT |
| Không có PTTT active nào | "Cửa hàng chưa cấu hình phương thức thanh toán. Vui lòng vào Quản lý nguồn tiền để thiết lập." | Disable nút Thanh toán |
| Lỗi ghi DB | "Xác nhận thanh toán thất bại. Vui lòng thử lại." | Rollback toàn bộ transaction; ghi log lỗi |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-gas-001 | Cửa hàng Gas (`business_type = 4`) không sử dụng Cổng TT (`type = 5`). Không hiển thị tùy chọn "Cổng thanh toán" trên bất kỳ màn hình nào với `business_type = 4`. |
| BR-gas-002 | Toàn bộ `payment_source` của cửa hàng gas có `type = 0`. Không tạo bản ghi `type = 1, 2, 3, 4, 5` cho `business_type = 4`. |
| BR-gas-003 | Màn hình Xác nhận thanh toán gas chỉ có 1 trường chọn PTTT (radio flat list). Khi user xác nhận: `bill.payment_method = payment_source.name` (tên PTTT được chọn); `payment_history.payment_source_id = payment_source.id`. Không có trường "HTTT hóa đơn" riêng. |

---

### 3.2 Thêm mới PTTT — Gas

#### 3.2.1 Thông tin chung

Quản lý cửa hàng gas có thể thêm PTTT mới qua màn hình Quản lý nguồn tiền. Khác với loại hình thông thường (chọn type: Thông thường / Chuyển khoản), gas không có lựa chọn type — mọi PTTT thêm mới đều là `type = 0`. Sau khi lưu, hệ thống tạo bản ghi `payment_source` và đồng thời cập nhật JSON trong `config`.

#### 3.2.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Tên phương thức thanh toán | Textbox | Trống | Có | Tối đa 100 ký tự; không được trùng với `payment_source.name` đang active trong cùng `com_id` |
| 2 | Trạng thái | Toggle | Bật (active = 1) | Không | Bật/tắt PTTT; PTTT tắt không hiển thị tại màn hình thanh toán |
| 3 | Đặt làm mặc định | Checkbox | Không tích | Không | Nếu tích → `default = 1`; các PTTT khác của com_id chuyển về `default = 0` |
| 4 | Hủy | Button (secondary) | — | — | Đóng form, không lưu |
| 5 | Lưu | Button (primary) | — | — | Xem luồng xử lý |

> **Khác biệt với loại hình thông thường:** Không hiển thị dropdown "Loại" (Thông thường / Chuyển khoản / Cổng TT). Gas luôn tạo `type = 0`.

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Thêm PTTT mới cho cửa hàng gas; đồng bộ vào cả `payment_source` và `config` |
| **Tác nhân** | Quản lý cửa hàng gas |
| **Trigger** | Quản lý nhấn "Thêm mới" tại màn hình Quản lý nguồn tiền |
| **Pre-condition** | Đã đăng nhập; có quyền quản lý PTTT; `business_type = 4` |
| **Post-condition** | Bản ghi `payment_source` mới được tạo; JSON trong `config.code = 'payment_method'` được cập nhật bao gồm tên mới |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Quản lý nhập tên PTTT, chọn trạng thái | — |
| 2 | Quản lý nhấn "Lưu" | Validate: tên không rỗng; tên không trùng với `payment_source.name` (active=1) cùng `com_id` (case-insensitive, ignore dấu). Nếu trùng → báo lỗi E-gas-001 |
| 3 | (Hệ thống tự động) | Bắt đầu transaction: **(1)** INSERT `payment_source`: `{com_id, name, type=0, active=[trạng thái chọn], default=[checkbox], status_connect=0, create_time=now}` → lấy `new_id`. **(2)** READ `config` WHERE `com_id = ? AND code = 'payment_method'` → parse JSON array. **(3)** Append tên mới vào cuối array → OVERWRITE `config.value` = JSON mới. **(4)** COMMIT. |
| 4 | (Hệ thống tự động) | Hiển thị thông báo "Thêm phương thức thanh toán thành công"; cập nhật danh sách PTTT trên màn hình |

```sql
-- Bước 3 (1): Tạo payment_source
INSERT INTO payment_source (com_id, name, type, active, [default], status_connect, create_time)
VALUES (?, ?, 0, ?, ?, 0, NOW());

-- Bước 3 (3): Overwrite config JSON
UPDATE config
SET value = JSON_REPLACE(value, '$.payment', JSON_ARRAY_APPEND(JSON_EXTRACT(value, '$.payment'), '$', ?))
WHERE com_id = ? AND code = 'payment_method';
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Tên trùng với PTTT đang active | "Tên phương thức thanh toán đã tồn tại" | Giữ nguyên form; focus vào trường tên |
| Transaction fail (1 trong 2 bước ghi lỗi) | "Lưu thất bại. Vui lòng thử lại." | Rollback toàn bộ; không có bản ghi nào được tạo |

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-gas-004 | Thêm mới PTTT cho gas: tạo `payment_source (type=0)` VÀ append tên vào JSON array trong `config.code='payment_method'`. Hai thao tác nằm trong cùng 1 database transaction — nếu 1 thao tác fail thì rollback cả 2. |
| BR-gas-005 | Tên PTTT không được trùng (case-insensitive, bỏ qua dấu tiếng Việt) với bất kỳ `payment_source.name` đang `active = 1` trong cùng `com_id`. |

---

### 3.3 Sửa tên PTTT — Gas

#### 3.3.1 Thông tin chung

Khi quản lý đổi tên một PTTT của cửa hàng gas, hệ thống phải cập nhật đồng thời `payment_source.name` và phần tử tương ứng trong JSON của `config`. Hai thao tác nằm trong 1 transaction để đảm bảo không lệch dữ liệu giữa 2 bảng.

#### 3.3.2 Màn hình chức năng

Tương tự form Thêm mới (Mục 3.2.2), nhưng trường tên hiển thị sẵn giá trị hiện tại để sửa.

#### 3.3.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Đổi tên PTTT; đảm bảo tên mới nhất quán giữa `payment_source` và `config` |
| **Tác nhân** | Quản lý cửa hàng gas |
| **Trigger** | Quản lý chọn "Sửa" trên 1 PTTT trong danh sách |
| **Pre-condition** | PTTT tồn tại trong `payment_source` của `com_id`; `business_type = 4` |
| **Post-condition** | `payment_source.name` = tên mới; JSON trong `config` đã được overwrite với tên mới; tên cũ không còn xuất hiện ở bất kỳ đâu trong dữ liệu hiện tại |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Quản lý sửa tên, nhấn "Lưu" | Validate: tên mới không rỗng; không trùng với PTTT khác đang active cùng `com_id` (trừ chính bản ghi đang sửa) |
| 2 | (Hệ thống tự động) | Bắt đầu transaction: **(1)** Lưu `old_name = payment_source.name` hiện tại. **(2)** UPDATE `payment_source SET name = [tên mới], update_time = now WHERE id = ?`. **(3)** READ `config` WHERE `com_id = ? AND code = 'payment_method'` → parse JSON array. **(4)** Tìm phần tử = `old_name` trong array → thay bằng `[tên mới]`. **(5)** OVERWRITE `config.value` = JSON mới. **(6)** COMMIT. |
| 3 | (Hệ thống tự động) | Hiển thị "Cập nhật thành công"; làm mới danh sách PTTT |

```sql
-- Bước 2 (2): Update payment_source
UPDATE payment_source
SET name = ?, update_time = NOW()
WHERE id = ? AND com_id = ?;

-- Bước 2 (4-5): Tìm và thay thế trong JSON array, sau đó overwrite
-- (Logic xử lý ở application layer: đọc JSON, replace element, ghi lại)
UPDATE config
SET value = ?   -- JSON đã được rebuild với tên mới
WHERE com_id = ? AND code = 'payment_method';
```

> **Lưu ý:** Thay thế tên trong JSON array thực hiện ở application layer (không dùng SQL JSON function để tránh phụ thuộc version DB). Ứng dụng đọc array, replace phần tử khớp `old_name` (case-insensitive), serialize lại rồi ghi đè.

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Tên mới trùng với PTTT khác | "Tên phương thức thanh toán đã tồn tại" | Giữ nguyên form |
| `old_name` không tìm thấy trong JSON config | (Không hiển thị lỗi cho user) | Vẫn update `payment_source.name` thành công; ghi log warning "config sync miss for com_id=[X], old_name=[Y]" để team kỹ thuật xử lý thủ công |
| Transaction fail | "Cập nhật thất bại. Vui lòng thử lại." | Rollback cả 2 thao tác |

#### 3.3.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-gas-006 | Sửa tên PTTT gas: UPDATE `payment_source.name` VÀ overwrite JSON trong `config.code='payment_method'` (thay `old_name` bằng tên mới trong array). Hai thao tác trong cùng 1 transaction. |
| BR-gas-007 | Nếu `old_name` không khớp trong JSON config (dữ liệu lệch), hệ thống vẫn hoàn thành update `payment_source` và ghi log warning — không block người dùng. |

---

### 3.4 Migration Bước 1B — Gas/Xăng dầu

#### 3.4.1 Thông tin chung

Migration Bước 1B chỉ chạy cho các `com_id` có `business_type = 4`. Mục tiêu: đọc danh sách PTTT từ `config.code = 'payment_method'` và lịch sử giao dịch cũ → tạo bản ghi `payment_source` tương ứng. Chạy 1 lần duy nhất, không lặp lại.

#### 3.4.2 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Tạo `payment_source` cho tất cả cửa hàng gas từ dữ liệu cấu hình và lịch sử hiện có |
| **Tác nhân** | Hệ thống (script migration, chạy 1 lần) |
| **Trigger** | Deploy phiên bản mới — script migration tự chạy |
| **Pre-condition** | `payment_source` chưa có bản ghi nào cho `com_id` gas đang xử lý |
| **Post-condition** | Mỗi `com_id` gas có đầy đủ `payment_source`: active=1 từ config, active=0 từ lịch sử giao dịch chưa có trong config |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | (Hệ thống tự động) | Lấy danh sách tất cả `com_id` có `business_type = 4` chưa có bản ghi trong `payment_source` |
| 2 — Bước B1 | (Hệ thống tự động) | Với mỗi `com_id`: READ `config WHERE com_id = ? AND code = 'payment_method'` → parse JSON: `{"payment": [...]}` → lấy array tên PTTT. Với mỗi tên trong array: INSERT `payment_source {com_id, name, type=0, active=1, default=0, status_connect=0}` |
| 3 — Bước B2 | (Hệ thống tự động) | Lấy DISTINCT tên từ lịch sử: `UNION` của `bill.payment_method`, `mc_payment.payment_method`, `mc_receipt.payment_method`, `payment_history.payment_method` trong cùng `com_id`. So sánh (case-insensitive, bỏ dấu) với các `payment_source.name` vừa tạo ở B1. Tên chưa khớp → INSERT `payment_source {type=0, active=0}` (không hiển thị trên UI nhưng giữ để link lịch sử) |
| 4 | (Hệ thống tự động) | Ghi log: số `com_id` đã migrate, số bản ghi `payment_source` tạo mới per `com_id` |

```sql
-- Bước B1: Tạo từ config (active=1)
INSERT INTO payment_source (com_id, name, type, active, [default], status_connect, create_time)
SELECT c.com_id,
       json_value AS name,
       0 AS type,
       1 AS active,
       0 AS [default],
       0 AS status_connect,
       NOW()
FROM config c
-- (Parse JSON array ở application layer, loop từng phần tử)
WHERE c.code = 'payment_method'
  AND c.com_id IN (SELECT com_id FROM company WHERE business_type = 4);

-- Bước B2: Sweep lịch sử (active=0)
-- Lấy DISTINCT tên từ lịch sử giao dịch, loại trừ tên đã có trong payment_source (B1)
INSERT INTO payment_source (com_id, name, type, active, [default], status_connect, create_time)
SELECT DISTINCT h.com_id, h.payment_method, 0, 0, 0, 0, NOW()
FROM (
    SELECT com_id, payment_method FROM bill WHERE payment_method IS NOT NULL
    UNION
    SELECT com_id, payment_method FROM mc_payment WHERE payment_method IS NOT NULL
    UNION
    SELECT com_id, payment_method FROM mc_receipt WHERE payment_method IS NOT NULL
    UNION
    SELECT com_id, payment_method FROM payment_history WHERE payment_method IS NOT NULL
) h
JOIN company co ON co.com_id = h.com_id AND co.business_type = 4
WHERE NOT EXISTS (
    SELECT 1 FROM payment_source ps
    WHERE ps.com_id = h.com_id
      AND LOWER(TRIM(ps.name)) = LOWER(TRIM(h.payment_method))
);
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| `com_id` gas không có bản ghi `config.code='payment_method'` | — (không hiển thị UI) | Bỏ qua Bước B1, chỉ chạy Bước B2 từ lịch sử; ghi log warning |
| `payment_method` trong lịch sử là chuỗi rỗng hoặc NULL | — | Bỏ qua bản ghi đó, không tạo `payment_source` |

#### 3.4.3 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-gas-008 | Migration Bước B1: mỗi phần tử trong JSON array `config.code='payment_method'` tạo 1 bản ghi `payment_source (type=0, active=1)` trong cùng `com_id`. |
| BR-gas-009 | Migration Bước B2: tên PTTT từ lịch sử giao dịch (DISTINCT across bill/mc_payment/mc_receipt/payment_history) chưa khớp với B1 → tạo `payment_source (type=0, active=0)`. So sánh case-insensitive, bỏ dấu tiếng Việt. |
| BR-gas-010 | Khi user nhập tên PTTT tại màn hình thanh toán (runtime) chưa tồn tại trong `payment_source` của `com_id` → hệ thống auto-tạo `payment_source (type=0, active=1, name=[giá trị nhập])`. |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Xác nhận thanh toán (chung) | Bán hàng | Cao | Gas render UI khác (flat radio, không chia loại); cần phân nhánh theo `business_type` tại component |
| Quản lý nguồn tiền (chung) | Quản lý | Cao | Gas không hiển thị dropdown "Loại PTTT"; form thêm/sửa PTTT đơn giản hơn |
| Cấu hình HTTT — màn hình cài đặt cũ | Cài đặt | Trung bình | Sau khi có feature mới, cân nhắc ẩn section "Danh sách hình thức thanh toán" với gas và redirect sang màn hình Quản lý nguồn tiền |
| Báo cáo doanh thu theo HTTT | Báo cáo | Thấp | `bill.payment_method` cho gas = `payment_source.name`; logic báo cáo không đổi, nhưng tên HTTT sẽ linh hoạt hơn (không cố định 5 loại) |
| Import đơn hàng Excel (FR-021) | Import | Thấp | Cột HTTT trong Excel của gas map vào `payment_source.name`; cùng logic với loại hình thông thường |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| API bán hàng | `api/client/page/bill/done-by-id` | Cao | Cần nhận thêm `payment_source_id`; tự fill `bill.payment_method` từ `payment_source.name` phía server nếu là gas |
| API lấy DS PTTT | `get-payment-source` | Trung bình | Cần trả về flat list (không chia loại) khi `business_type = 4` |
| API thêm/sửa PTTT | (endpoint quản lý nguồn tiền) | Cao | Cần logic riêng cho gas: không nhận `type` từ client; tự set `type=0`; sync config sau khi ghi `payment_source` |

---

## Open Questions

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-1 | Màn hình cài đặt cũ "Danh sách hình thức thanh toán" với gas sau migration: ẩn hẳn hay vẫn hiển thị song song? Nếu giữ → khi user sửa ở đó có sync ngược về `payment_source` không? | Mục 4.1, BR-gas-006 | Product Owner | — |
| OQ-2 | Thứ tự hiển thị PTTT trong radio list tại màn hình thanh toán: theo `create_time`, theo thứ tự trong config JSON, hay cho phép drag-and-drop sắp xếp? | Mục 3.1.2 | BA + Dev | — |
| OQ-3 | BR-gas-010 (auto-tạo payment_source khi nhập PT khác tại runtime): áp dụng cho màn hình nào cụ thể? Màn hình bán hàng web? App mobile? Nhập kho? | BR-gas-010 | BA | — |
