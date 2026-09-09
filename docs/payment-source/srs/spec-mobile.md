---
type: srs
feature: payment-source
platform: mobile
status: draft
lang: vi
owner: "@huelinh"
created: 2026-06-29
updated: 2026-06-29
links: [docs/payment-source/srs/spec.md]
tags: [mobile]
stale_reason: ""
changelog:
  - 2026-06-29 | /ba-write-srs | initial draft SRS mobile từ nghiệp vụ web + 3 màn hình (DS PTTT, Thêm PTTT, Xác nhận thanh toán)
---

# SRS — Quản lý nguồn tiền trên Mobile (Phương thức và dịch vụ thanh toán)

**Mã tài liệu:** SRS-PSR-MOB-001  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-06-29  
**Người soạn:** Duong Thi Hue Linh (@huelinh)  
**Trạng thái:** Draft  
**Tài liệu gốc (web):** [docs/payment-source/srs/spec.md](spec.md)

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-06-29 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu mobile, đồng bộ nghiệp vụ với SRS web | |

---

## MỤC LỤC

1. Nguồn gốc thay đổi
2. Nội dung thay đổi
   - 2.1 Mô tả chung
   - 2.2 Luồng nghiệp vụ
   - 2.3 Yêu cầu người dùng
   - 2.4 Ngữ cảnh người dùng
   - 2.5 Thay đổi CSDL
   - 2.6 Danh sách chức năng
3. Chi tiết các chức năng
4. Nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

### 1.1 Bối cảnh

Tính năng **Quản lý nguồn tiền** đã được đặc tả và xây dựng cho bản **web** (xem [SRS web](spec.md)). Người dùng EasyPOS thao tác bán hàng và quản lý cửa hàng phần lớn trên **ứng dụng mobile**, do đó cần đưa tính năng này lên mobile để:

- Cấu hình phương thức và dịch vụ thanh toán (PTTT) ngay trên app, không phải mở web.
- Ghi nhận đúng nguồn tiền khi bán hàng, nhập/xuất kho, thu chi — phục vụ báo cáo dòng tiền thống nhất giữa web và mobile.

### 1.2 Mục tiêu

- Mang toàn bộ nghiệp vụ quản lý nguồn tiền của web lên mobile, **giữ nguyên logic backend** (CSDL, quy tắc sinh `description`/`type`, business rules).
- Thiết kế lại giao diện cho phù hợp màn hình dọc và thao tác chạm (touch) trên mobile.

> **Nguyên tắc:** Tài liệu này chỉ đặc tả **khác biệt về giao diện và tương tác trên mobile**. Mọi logic nghiệp vụ, CSDL, migrate, business rules **kế thừa nguyên** từ [SRS web](spec.md) — không lặp lại ở đây, chỉ tham chiếu.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung

Đưa tính năng **Quản lý nguồn tiền** lên ứng dụng mobile, cho phép quản lý cửa hàng cấu hình linh hoạt PTTT (Cơ bản / VietQR / Cổng thanh toán) và cho phép nhân viên chọn đúng nguồn tiền khi thực hiện giao dịch (bán hàng, nhập/xuất kho, thu chi).

**Phạm vi triển khai (Mobile Ver1):**

| Nhóm | Nội dung |
|---|---|
| **Cấu hình** | Xem danh sách PTTT; thêm/sửa/xóa PTTT (Cơ bản, VietQR); cài đặt PTTT mặc định; kết nối cổng thanh toán điện tử |
| **Giao dịch** | Bán hàng, nhập kho, xuất kho, thu chi — bổ sung lựa chọn nguồn tiền khi thanh toán |

**Không thuộc phạm vi (giữ như web):**
- Thanh toán nhiều PTTT trên 1 đơn hàng (ver2).
- Báo cáo lưu chuyển tiền theo PTTT (đặc tả ở web, chưa triển khai).

### 2.2 Luồng nghiệp vụ

Luồng nghiệp vụ **giống hệt web** (xem [SRS web — Mục 2.2](spec.md)). Mobile chỉ thay đổi cách trình bày màn hình:

```
[Người dùng - Mobile]                  [Hệ thống - dùng chung web]
      |
      | (1) Cấu hình nguồn tiền trên app
      |--------------------------------------> Lưu payment_source
      |
      | (2) Giao dịch (bán hàng / nhập-xuất kho / thu chi)
      | (3) Chọn nguồn tiền + nhập số tiền
      |--------------------------------------> Ghi payment_history
      |                                        + mc_payment / mc_receipt
```

### 2.3 Yêu cầu người dùng

| STT | Tác nhân | Tôi muốn... | Để... | Ưu tiên | FR |
|---|---|---|---|---|---|
| US-M01 | Quản lý cửa hàng | Xem danh sách PTTT đã cấu hình và trạng thái kết nối ngay trên app | Theo dõi, phát hiện PTTT lỗi mà không cần mở web | Must Have | FR-M01 |
| US-M02 | Quản lý cửa hàng | Thêm mới PTTT (Cơ bản / VietQR) trên app | Linh hoạt cấu hình hình thức nhận tiền khi đang ở cửa hàng | Must Have | FR-M02 |
| US-M03 | Quản lý cửa hàng | Sửa / xóa PTTT trên app | Cập nhật hoặc dọn dẹp danh sách | Should Have | FR-M03, FR-M04 |
| US-M04 | Quản lý cửa hàng | Cài đặt PTTT mặc định trên app | Giảm thao tác cho nhân viên khi thanh toán | Should Have | FR-M05 |
| US-M05 | Quản lý cửa hàng | Kết nối cổng thanh toán điện tử trên app | Kích hoạt nhận thanh toán qua cổng ngân hàng | Should Have | FR-M06 |
| US-M06 | Nhân viên bán hàng | Chọn nguồn tiền khi xác nhận thanh toán đơn hàng | Ghi nhận đúng nguồn tiền thu vào | Must Have | FR-M07 |
| US-M07 | Nhân viên kho | Chọn nguồn tiền khi thanh toán nhập / xuất kho | Ghi nhận đúng nguồn tiền chi ra / thu vào | Must Have | FR-M08 |
| US-M08 | Nhân viên thu ngân | Chọn nguồn tiền khi tạo / sửa khoản thu, khoản chi | Phân loại đúng dòng tiền theo từng PTTT | Must Have | FR-M09 |

### 2.4 Ngữ cảnh người dùng

- Người dùng thao tác trên **điện thoại** (màn hình dọc), chủ yếu trong lúc bán hàng tại quầy hoặc đi nhập hàng.
- Đối tượng: chủ/quản lý cửa hàng (cấu hình) và nhân viên bán hàng/kho/thu ngân (giao dịch), không có kỹ năng kỹ thuật.
- Yêu cầu thao tác **nhanh, ít bước**, dùng được bằng một tay; ưu tiên danh sách dạng thẻ và chọn nhanh qua dropdown.

### 2.5 Thay đổi CSDL

**Không áp dụng.** Mobile dùng **chung schema và dữ liệu** với web. Toàn bộ bảng (`payment_source`, `payment_getway`, `payment_history`, `mc_payment`, `mc_receipt`), quy tắc migrate, quy tắc sinh `description` và `type` — xem [SRS web — Mục 2.5](spec.md#25-thay-đổi-csdl).

### 2.6 Danh sách chức năng

| STT | Mã FR | Tên chức năng | Nhóm | FR web tương ứng |
|---|---|---|---|---|
| 1 | FR-M01 | Xem danh sách PTTT + cổng thanh toán điện tử (mobile) | Cấu hình | FR-payment-source-003 |
| 2 | FR-M02 | Thêm mới PTTT (mobile, full-screen) | Cấu hình | FR-payment-source-004 |
| 3 | FR-M03 | Sửa PTTT (mobile) | Cấu hình | FR-payment-source-006 |
| 4 | FR-M04 | Xóa PTTT (mobile) | Cấu hình | FR-payment-source-007 |
| 5 | FR-M05 | Cài đặt PTTT mặc định (mobile) | Cấu hình | FR-payment-source-008 |
| 6 | FR-M06 | Kết nối cổng thanh toán điện tử (mobile) | Cấu hình | FR-payment-source-003 (Vùng 1) |
| 7 | FR-M07 | Bán hàng — chọn nguồn tiền (mobile) | Giao dịch | FR-payment-source-009 |
| 8 | FR-M08 | Nhập / xuất kho — chọn nguồn tiền (mobile) | Giao dịch | FR-payment-source-010, 011 |
| 9 | FR-M09 | Thu chi — chọn nguồn tiền (mobile) | Giao dịch | FR-payment-source-014 → 019 |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG

> Các mục dưới đây chỉ mô tả **giao diện và tương tác trên mobile**. Logic xử lý backend, validation nghiệp vụ và business rules — kế thừa FR web tương ứng (cột cuối bảng 2.6).

### FR-M01 — Xem danh sách phương thức thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Xem toàn bộ PTTT đã cấu hình + danh sách cổng thanh toán điện tử trên app |
| **Kích hoạt** | Người dùng vào Cài đặt cửa hàng > Phương thức thanh toán |
| **Tiền điều kiện** | Đã đăng nhập; có quyền thao tác |
| **Hậu điều kiện** | Màn hình hiển thị danh sách PTTT |
| **Quy tắc NV** | Kế thừa FR-payment-source-003 |

**Bố cục màn hình** — gồm 3 vùng xếp dọc, cuộn được (scroll):

```
┌────────────────────────────────┐
│ ‹  Phương thức thanh toán        │
├────────────────────────────────┤
│  Cổng thanh toán điện tử         │  ← Vùng 1
│ ┌────────────────────────────┐ │
│ │ [VCB]  NH TMCP Ngoại         │ │
│ │        thương VN  ✓ Đã kết nối│ │
│ ├────────────────────────────┤ │
│ │ [TCB]  NH TMCP Kỹ            │ │
│ │        Thương VN   [ Kết nối ]│ │
│ ├────────────────────────────┤ │
│ │ [BIDV] NH TMCP ĐT&PT VN      │ │
│ │                    [ Kết nối ]│ │
│ └────────────────────────────┘ │
│                                │
│  Danh sách PTTT     [+ Thêm mới]│  ← Vùng 2
│ ┌────────────────────────────┐ │
│ │ Tiền mặt                 ⋮  │ │
│ │ Cơ bản                      │ │
│ │ • Đang hoạt động (xanh)      │ │
│ ├────────────────────────────┤ │
│ │ Chuyển khoản             ⋮  │ │
│ │ VietQR                      │ │
│ │ • Đang hoạt động (xanh)      │ │
│ ├────────────────────────────┤ │
│ │ Chuyển khoản             ⋮  │ │
│ │ VietQR                      │ │
│ │ • Ngưng hoạt động (đỏ)       │ │
│ └────────────────────────────┘ │
│                                │
│  Phương thức mặc định            │  ← Vùng 3
│  Phương thức được ưu tiên dùng   │
│  khi xác nhận thanh toán đơn hàng│
│ [ Tiền mặt                  ▾ ] │
└────────────────────────────────┘
```

**Vùng 1 — Cổng thanh toán điện tử** (mỗi ngân hàng là 1 thẻ):

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Logo + tên ngân hàng | Image + Text | — | Logo kèm tên đầy đủ ngân hàng hỗ trợ cổng TT |
| 2 | Trạng thái / nút kết nối | Tag / Button | — | Đã kết nối → tag "✓ Đã kết nối" (xanh); chưa kết nối → nút "Kết nối" (xanh) |

**Vùng 2 — Danh sách PTTT** (mỗi PTTT là 1 thẻ, KHÔNG dùng bảng như web):

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Thêm mới | Button | — | Click: mở **màn hình** Thêm mới PTTT (full-screen, FR-M02) |
| 2 | Tên phương thức | Text | — | Dòng đầu thẻ, in đậm |
| 3 | Phân loại | Text | — | Dòng thứ hai: Cơ bản / VietQR / Cổng thanh toán |
| 4 | Trạng thái hoạt động | Text (màu) | — | • Đang hoạt động (xanh) / • Ngưng hoạt động (đỏ) |
| 5 | Menu thao tác | Icon ⋮ | — | Click: mở menu **Sửa / Xóa** (thay cho 2 icon riêng ở web) |

**Vùng 3 — Phương thức mặc định:**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Tiêu đề phụ | Text | — | "Phương thức thanh toán được ưu tiên sử dụng khi xác nhận thanh toán đơn hàng" |
| 2 | Phương thức mặc định | Dropdown | Y | DS PTTT đang hoạt động; chọn 1; lưu ngay khi chọn (tương đương FR-M05) |

**Khác biệt so với web:**
- Danh sách PTTT dạng **thẻ dọc**, không phải bảng nhiều cột.
- Thao tác Sửa/Xóa gom vào **menu ⋮**, không hiện icon riêng từng dòng.
- Chưa có ô tìm kiếm và phân trang trên màn hình mobile *(xem OQ-1)*.

---

### FR-M02 — Thêm mới phương thức thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Thêm PTTT mới (Cơ bản / VietQR) trên app |
| **Kích hoạt** | Người dùng bấm "+ Thêm mới" ở Vùng 2 |
| **Tiền điều kiện** | Đã đăng nhập; có quyền thao tác |
| **Hậu điều kiện** | PTTT mới được lưu; quay lại danh sách; hiển thị thông báo thành công |
| **Quy tắc NV** | Kế thừa FR-payment-source-004 (tên không trùng; VietQR yêu cầu đủ thông tin NH) |

**Khác biệt cốt lõi so với web:** màn hình thêm mới là **toàn màn hình (full-screen)** có nút back, không phải modal popup.

**Màn hình — Thêm mới PTTT (trạng thái loại VietQR):**

```
┌────────────────────────────────┐
│ ‹  Thêm mới PTTT                 │
├────────────────────────────────┤
│  Loại phương thức TT *           │
│ [ Chọn loại phương thức      ▾ ] │
│  Tên phương thức *               │
│ [ Nhập...                      ] │
│  Ngân hàng *                     │
│ [ Chọn ngân hàng             ▾ ] │
│  Tên ngân hàng hiển thị *        │
│ [ Nhập...                      ] │
│  Số tài khoản *                  │
│ [ Nhập...                      ] │
│  Tên người hưởng thụ *           │
│ [ Nhập...                      ] │
│  ☑ Kích hoạt phương thức         │
│                                │
├────────────────────────────────┤
│    [ Hủy ]        [  Lưu  ]      │  ← cố định đáy
└────────────────────────────────┘
```

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Loại phương thức TT | Dropdown | Y | "Chọn loại phương thức"; giá trị: Cơ bản / VietQR. Loại Cơ bản chỉ hiện trường Tên; loại VietQR hiện thêm 4 trường ngân hàng |
| 2 | Tên phương thức | Textbox | Y | "Nhập..."; không được trùng tên đã tồn tại |
| 3 | Ngân hàng | Dropdown | Y* | Chỉ với VietQR; giá trị lấy từ API `get-vietQR-bank` |
| 4 | Tên ngân hàng hiển thị | Textbox | Y* | Chỉ với VietQR; tự fill khi chọn ngân hàng, cho phép sửa lại |
| 5 | Số tài khoản | Textbox | Y* | Chỉ với VietQR; "Nhập..." |
| 6 | Tên người hưởng thụ | Textbox | Y* | Chỉ với VietQR; "Nhập..." |
| 7 | Kích hoạt phương thức | Checkbox | — | Tích = kích hoạt PTTT; mặc định tích sẵn (theo màn hình mobile) |
| 8 | Hủy | Button | — | Quay lại danh sách, không lưu |
| 9 | Lưu | Button | — | Lưu thông tin; thông báo thành công; về danh sách |

> `Y*` = bắt buộc khi loại = VietQR.

**Khác biệt so với web:**
- Full-screen thay vì modal; nút Hủy/Lưu cố định ở đáy.
- Checkbox **"Kích hoạt phương thức" vẫn hiển thị** ngay cả với loại VietQR (web ẩn checkbox này khi VietQR). *Cần xác nhận hành vi đúng — xem OQ-2.*

**Luồng thao tác:** giống web — chọn loại → nhập thông tin → Lưu → thông báo thành công.

---

### FR-M03 — Sửa phương thức thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Cập nhật thông tin PTTT |
| **Kích hoạt** | Người dùng bấm ⋮ trên thẻ PTTT > chọn **Sửa** |
| **Hậu điều kiện** | Cập nhật thành công; về danh sách |
| **Quy tắc NV** | Kế thừa FR-payment-source-006 |

**Màn hình:** full-screen, bố cục giống FR-M02, **dữ liệu điền sẵn** theo PTTT đang chọn. Tương tác và validation như web.

---

### FR-M04 — Xóa phương thức thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Xóa PTTT chưa phát sinh giao dịch |
| **Kích hoạt** | Người dùng bấm ⋮ trên thẻ PTTT > chọn **Xóa** |
| **Hậu điều kiện** | Xóa thành công hoặc báo lỗi nếu đã có giao dịch |
| **Quy tắc NV** | Kế thừa FR-payment-source-007 + BR-payment-source-001, 002 |

**Màn hình — Popup xác nhận** (bottom-sheet hoặc dialog mobile):

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Thông báo | Text | "Bạn có chắc chắn muốn xóa phương thức và dịch vụ thanh toán này?" |
| 2 | Xóa | Button | Thực hiện xóa; thông báo thành công |
| 3 | Hủy bỏ | Button | Đóng popup, giữ nguyên |

**Logic:** kế thừa web — nếu PTTT đã có bản ghi trong `payment_history` → báo lỗi *"Phương thức [tên] đã được sử dụng. Bạn không thể xóa."*

---

### FR-M05 — Cài đặt phương thức mặc định (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Chọn PTTT mặc định hiển thị sẵn khi thanh toán |
| **Kích hoạt** | Người dùng chọn ở dropdown "Phương thức mặc định" (Vùng 3, FR-M01) |
| **Hậu điều kiện** | Cập nhật PTTT mặc định thành công |
| **Quy tắc NV** | Kế thừa FR-payment-source-008 + BR-payment-source-004 (chỉ 1 mặc định) |

Trên mobile, vùng cài mặc định **hiển thị inline** ở cuối màn hình danh sách (không phải màn riêng). Chọn ở dropdown → lưu ngay.

---

### FR-M06 — Kết nối cổng thanh toán điện tử (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Kết nối cổng thanh toán của ngân hàng để nhận thanh toán qua cổng |
| **Kích hoạt** | Người dùng bấm "Kết nối" trên thẻ ngân hàng (Vùng 1) |
| **Hậu điều kiện** | Kết nối thành công → tag chuyển "✓ Đã kết nối"; tạo / cập nhật `payment_source` (type=5) |
| **Quy tắc NV** | Kế thừa FR-payment-source-003 (logic Vùng 1) + BR-payment-source-009 |

**Luồng & logic backend:** giống web hoàn toàn (mỗi ngân hàng chỉ 1 bản ghi `payment_source` type=5; tạo lần đầu khi `payment_gateway.status = 1` hoặc `4`; các lần sau chỉ cập nhật `status_connect`). Mobile chỉ khác ở việc popup nhập thông tin hiển thị theo dạng màn hình mobile.

---

### FR-M07 — Bán hàng — chọn nguồn tiền (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Ghi nhận đúng nguồn tiền thu vào khi xác nhận thanh toán đơn hàng |
| **Kích hoạt** | Người dùng bấm Thanh toán ở màn hình bán hàng |
| **Tiền điều kiện** | N/A |
| **Hậu điều kiện** | Đơn hàng tạo thành công với nguồn tiền tương ứng; ghi `payment_history` |
| **Quy tắc NV** | Kế thừa FR-payment-source-009 |

**Phân biệt 2 trường** (giống web): *Phương thức thanh toán* = **nguồn tiền** (`payment_history.payment_source_id`, theo dõi dòng tiền) vs *Phương thức thanh toán hóa đơn* = **HTTT in lên hóa đơn** (`bill.payment_method`). Hai trường độc lập.

**Màn hình — Xác nhận thanh toán:**

```
┌────────────────────────────────┐
│ ‹  Xác nhận thanh toán           │
├────────────────────────────────┤
│  Tổng tiền cần thanh toán        │
│                       100.000   │
│  Khách trả            100.000   │
│ ───────────────────────────────│
│  Khách cần thanh toán  100.000  │
│  [ ○──] Ghi nợ                   │
│                                │
│  Phương thức thanh toán          │  ← Nguồn tiền (mới)
│ [ Tiền mặt                  ▾ ] │
│                                │
│  Phương thức thanh toán hóa đơn  │  ← HTTT hóa đơn
│ [ Tiền mặt                  ▾ ] │
├────────────────────────────────┤
│        [   Thanh toán   ]        │
└────────────────────────────────┘
```

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Tổng tiền cần thanh toán | Text | — | Tổng tiền đơn hàng |
| 2 | Khách trả | Textbox / Text | Y | Số tiền khách đưa |
| 3 | Khách cần thanh toán | Text | — | Số tiền còn phải trả |
| 4 | Ghi nợ | Toggle | — | Bật: ghi phần còn thiếu thành công nợ *(làm rõ hành vi — xem OQ-3)* |
| 5 | **Phương thức thanh toán** | Dropdown | Y | DS nguồn tiền đang hoạt động; mặc định = PTTT mặc định; lưu `payment_source_id` |
| 6 | **Phương thức thanh toán hóa đơn** | Dropdown | Y | HTTT in lên hóa đơn; lưu `bill.payment_method` |
| 7 | Thanh toán | Button | — | Xác nhận, tạo đơn, thông báo thành công |

**Khác biệt so với web:**
- Trường **"Phương thức thanh toán hóa đơn" là dropdown** trên mobile (web dùng **radio buttons**).
- Có **toggle "Ghi nợ"** ngay trong màn xác nhận.
- Bước xác nhận QR (khi chọn nguồn tiền loại VietQR) — kế thừa web; thể hiện dưới dạng màn hình QR mobile.

**API ảnh hưởng:** `get-payment-source`, `api/client/page/bill/done-by-id`, `api/client/page/bill/create` (giống web).

---

### FR-M08 — Nhập / xuất kho — chọn nguồn tiền (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Ghi nhận đúng nguồn tiền chi ra (nhập kho) / thu vào (xuất kho) khi thanh toán |
| **Kích hoạt** | Người dùng bấm Thanh toán ở màn hình nhập / xuất kho |
| **Hậu điều kiện** | Phiếu nhập/xuất kho tạo với nguồn tiền tương ứng; ghi `payment_history` + `mc_payment`/`mc_receipt` |
| **Quy tắc NV** | Kế thừa FR-payment-source-010, 011 |

**Giao diện:** **dùng chung pattern với bán hàng (FR-M07)** — màn xác nhận thanh toán bổ sung dropdown **"Phương thức thanh toán"** (= nguồn tiền) để chọn 1. Không thiết kế màn hình riêng.

> Với nhập kho qua ngân hàng/VietQR: **bỏ qua bước hiện QR/gạch nợ** vì đây là dòng tiền đi ra, cửa hàng tự quản lý (kế thừa web).

**Sửa phiếu nhập kho:** khi sửa, cập nhật đồng thời `mc_payment.payment_source_id` và `payment_history` tương ứng (kế thừa FR-payment-source-011).

---

### FR-M09 — Thu chi — chọn nguồn tiền (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Phân loại đúng dòng tiền thu/chi theo từng nguồn tiền |
| **Kích hoạt** | Người dùng thêm / sửa khoản thu hoặc khoản chi |
| **Hậu điều kiện** | Phiếu thu/chi tạo/cập nhật với nguồn tiền tương ứng |
| **Quy tắc NV** | Kế thừa FR-payment-source-014 → 019 + BR-payment-source-007 (chỉ sửa/xóa phiếu do chính mình tạo) |

**Giao diện:** **dùng chung pattern với bán hàng** — màn thêm/sửa khoản thu (hoặc chi) bổ sung dropdown **"Phương thức thanh toán"** (= nguồn tiền), bỏ trường "Hình thức thanh toán" cũ. Không thiết kế màn hình riêng.

- Thêm/Sửa khoản **thu** → ghi `payment_history` (type=1, Thu) + `mc_receipt`.
- Thêm/Sửa khoản **chi** → ghi `payment_history` (type=2, Chi) + `mc_payment`.
- Danh sách phiếu thu chi: ẩn nút Sửa với phiếu hệ thống tạo tự động (`systemCreated=1`), giống web (FR-payment-source-013).

---

## 4. NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình (mobile) | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Bán hàng | Xác nhận thanh toán | Cao | Thêm dropdown nguồn tiền; HTTT hóa đơn đổi radio → dropdown; thêm toggle Ghi nợ |
| Nhập / xuất kho | Xác nhận thanh toán kho | Cao | Thêm dropdown nguồn tiền |
| Thu chi | Thêm/sửa khoản thu, chi | Cao | Thêm dropdown nguồn tiền, bỏ HTTT cũ |
| Cấu hình cửa hàng | Thông tin cửa hàng | Trung bình | Bỏ trường VietQR (đồng bộ web — FR-payment-source-002) |

### 4.2 Chức năng hệ thống khác (API)

Mobile **dùng chung API với web** — không phát sinh API mới:

| STT | API | Chức năng | Loại thay đổi |
|---|---|---|---|
| 1 | `get-payment-source` | Lấy DS PTTT | Dùng lại (đã có từ web) |
| 2 | `get-vietQR-bank` | Lấy DS ngân hàng VietQR | Dùng lại |
| 3 | `api/client/page/bill/done-by-id` | Xác nhận thanh toán đơn | Dùng lại |
| 4 | `api/client/page/bill/create` | Tạo đơn hàng | Dùng lại |
| 5 | `api/page/receipt-payment` (+ /create, /update, /delete) | Thu chi | Dùng lại |

> Toàn bộ thay đổi schema API đã đặc tả ở [SRS web — Mục 4](spec.md). Mobile chỉ gọi lại các API này.

---

## OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người trả lời | Trạng thái |
|---|---|---|---|---|
| OQ-1 | Màn hình danh sách PTTT trên mobile có cần ô **tìm kiếm** và **phân trang** như web không, hay cuộn vô hạn? | FR-M01 | PO / Khách hàng | [ ] |
| OQ-2 | Loại **VietQR** trên mobile có hiển thị checkbox "Kích hoạt phương thức" không (web ẩn)? Hành vi mặc định tích/không tích? | FR-M02 | PO / Designer | [ ] |
| OQ-3 | Toggle **"Ghi nợ"** ở màn xác nhận thanh toán hoạt động thế nào (điều kiện bật, lưu phần nợ ở đâu)? Có nằm trong phạm vi feature nguồn tiền không? | FR-M07 | PO | [ ] |
| OQ-4 | Menu **⋮** trên thẻ PTTT gồm những thao tác nào ngoài Sửa/Xóa (vd: Xem chi tiết, Đặt mặc định)? | FR-M01 | Designer | [ ] |

---

*Hết tài liệu*
