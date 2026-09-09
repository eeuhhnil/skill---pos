---
type: srs
feature: ban-hang-giam-gia-lo
status: draft
lang: vi
owner: "@huelinh"
created: 2026-06-12
updated: 2026-06-12
links:
  - docs/ban-hang-giam-gia-lo/userstories/us-list.md
  - docs/nhap-kho-giam-gia-lo/srs/spec.md
tags: [ban-hang, giam-gia, lo-hang]
changelog:
  - 2026-06-12 | /ba-write-srs | initial draft tương tự SRS nhập kho, áp cho màn bán hàng
---

# SRS — Giảm giá theo lô hàng khi bán hàng

**Mã tài liệu:** SRS-BHGGL-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-06-12
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-06-12 | Toàn bộ | A | Yêu cầu khách hàng / cải tiến | @huelinh | Tạo mới tài liệu | |

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

Yêu cầu khách hàng cải tiến màn Chi tiết sản phẩm (bán hàng): hiện chỉ nhập được một mức giảm giá chung cho cả dòng sản phẩm, chưa tách giảm giá riêng theo từng lô. Bổ sung giảm giá theo lô khi sản phẩm bán có ≥ 2 lô (Web + Mobile).

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung

Bổ sung phần "Giảm giá theo lô" vào màn Chi tiết sản phẩm (bán hàng), chỉ kích hoạt khi sản phẩm bán có ≥ 2 lô:

- **Số lượng**: disable, auto = tổng SL các lô đã chọn.
- **Kiểu giảm giá**: chọn theo giá trị (VND, mặc định) hoặc theo % — áp cho cả bảng lô.
- **Giảm giá theo lô**: bảng liệt kê từng lô, mỗi lô nhập một mức giảm.
- **Tổng tiền giảm giá**: disable, auto = Σ giảm giá các lô. Chỉ hiển thị khi SP ≥ 2 lô; SP thường giữ giao diện cũ (1 ô "Tiền giảm giá").
- **Tổng tiền thanh toán** (dòng SP): = Thành tiền − Tổng tiền giảm giá (+ thuế nếu có).
- **Mobile**: SP ≥ 2 lô → ô giảm giá hiện mũi tên → bottom sheet "Chọn lô hàng", logic giống Web.

### 2.2 Luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Người dùng mở Chi tiết sản phẩm của một sản phẩm trong giỏ hàng.
2. Người dùng nhập Số lượng; hệ thống tính Thành tiền = Số lượng × Đơn giá.
3. Người dùng nhập một mức giảm giá chung cho cả dòng (theo VND hoặc %).
4. Hệ thống tính Tổng tiền thanh toán ở mức dòng, không tách theo lô.

**Luồng mới (To-Be) — sản phẩm có ≥ 2 lô:**

1. Người dùng chọn lô bán cho sản phẩm (≥ 2 lô).
2. Hệ thống disable trường **Số lượng**, set = tổng SL đã chọn trên các lô.
3. Hệ thống hiển thị **Kiểu giảm giá** (mặc định "Giảm theo giá trị") và bảng **Giảm giá theo lô** (mỗi dòng = 1 lô: mã lô, HSD, số lượng, ô giảm giá).
4. Người dùng nhập giảm giá từng lô theo kiểu đã chọn.
   - VND: nhập số tiền giảm của lô.
   - %: nhập % giảm của lô; tiền giảm lô = (SL lô × đơn giá) × %.
5. Hệ thống cập nhật **Tổng tiền giảm giá** (disable) = Σ giảm giá các lô; cập nhật Tổng tiền thanh toán dòng.
6. Người dùng nhấn **Lưu** → lưu mỗi lô thành một dòng `bill_product` (kèm `batch_id`), quay lại giỏ hàng.

**Luồng mới (To-Be) — Mobile, sản phẩm có ≥ 2 lô:**

1. Trong Chi tiết sản phẩm (mobile), ô **Giảm giá** hiển thị mũi tên điều hướng (arrow right).
2. Chạm vào → mở bottom sheet **"Chọn lô hàng"** (lô + số lượng + ô giảm giá VND/%).
3. Nhập giảm giá từng lô.
4. **Hủy bỏ** → đóng, không lưu. **Lưu** → lưu giảm giá các lô, quay lại Chi tiết sản phẩm.

### 2.3 Yêu cầu người dùng

- Người dùng muốn áp giảm giá riêng cho từng lô khi bán sản phẩm xuất từ nhiều lô, phản ánh đúng chính sách giá theo lô (hạn sử dụng, hàng cận date).
- Người dùng muốn hệ thống tự cộng tổng giảm giá các lô thành giảm giá dòng sản phẩm.
- Người dùng muốn chọn nhanh kiểu giảm theo VND hoặc % áp cho cả bảng lô.
- Người dùng muốn Số lượng tự khớp với tổng SL các lô đã chọn.
- Người dùng muốn thao tác được trên cả Web và điện thoại (bottom sheet) ngay tại quầy.

### 2.4 Ngữ cảnh người dùng

Đối tượng sử dụng là **nhân viên bán hàng / thu ngân**. Thao tác diễn ra tại quầy trong lúc lên đơn, thường vào giờ cao điểm — yêu cầu nhanh, ít nhập tay. Trên Web dùng máy tính tại quầy; trên Mobile dùng điện thoại/máy POS. Sản phẩm bán theo lô phổ biến ở ngành dược, thực phẩm, mỹ phẩm (hàng có hạn sử dụng).

### 2.5 Thay đổi CSDL

Tận dụng các cột **đã có sẵn** trên bảng chi tiết hóa đơn `dbo.bill_product` — mỗi lô bán được lưu thành một dòng `bill_product` riêng, nhóm theo `group_batch`:

| Loại | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| M | `bill_product` | `discount_rate` | int | NULL | % giảm giá của lô khi kiểu = "Giảm theo phần trăm". Kiểu VND: để trống/0. Xem OQ-02 |
| M | `bill_product` | `discount_amount` | decimal(21,6) | NULL | Tiền giảm giá của lô. Kiểu VND: tiền nhập; kiểu %: tiền = (SL × đơn giá) × % |
| M | `bill_product` | `batch_id` | int | NULL | ID lô hàng của dòng. Mỗi lô = 1 dòng `bill_product`. Xem OQ-03 |
| M | `bill_product` | `group_batch` | varchar(100) | NULL | Nhóm các dòng lô cùng một sản phẩm trong hóa đơn |

> **Lưu ý lưu giá trị (quan trọng):** Khi kiểu giảm = **phần trăm**, lưu **cả hai** cột: `discount_rate` = % nhập, `discount_amount` = (SL × đơn giá) × % giảm. Khi kiểu giảm = **giá trị**, lưu `discount_amount` = tiền nhập (cột `discount_rate` để trống/0).

> **Lưu ý không thêm cột mới:** Dùng đúng các cột sẵn có. Dòng `total_pre_tax` = quantity × unit_price − discount_amount; `amount` = giá gốc trước giảm. Cần dev xác nhận cách gom các dòng lô của cùng sản phẩm để hiển thị 1 dòng trong giỏ (xem OQ-03, OQ-05).

### 2.6 Danh sách chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Nhân viên bán hàng | Chi tiết sản phẩm (Web) | Giảm giá theo lô | Nhập giảm giá riêng từng lô khi SP ≥ 2 lô; chọn kiểu VND/%; tự tổng hợp Tổng tiền giảm giá | Cao |
| Nhân viên bán hàng | Chi tiết sản phẩm (Web) | Đồng bộ Số lượng theo lô | Disable Số lượng, auto = tổng SL các lô đã chọn | Cao |
| Nhân viên bán hàng | Chi tiết sản phẩm (Mobile) | Bottom sheet giảm giá lô | SP ≥ 2 lô: ô giảm giá hiện arrow → bottom sheet chọn giảm giá từng lô (Hủy/Lưu) | Cao |
| Nhân viên bán hàng | Hóa đơn / giỏ hàng | Tổng hợp thành tiền theo giảm giá lô | Tổng tiền thanh toán dòng = Thành tiền − giảm giá; tổng hóa đơn cập nhật theo | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG

### 3.1 Giảm giá theo lô trên màn Chi tiết sản phẩm (Web)

#### 3.1.1 Thông tin chung

Chức năng cho phép nhân viên bán hàng nhập mức giảm giá riêng cho từng lô của một sản phẩm trong màn Chi tiết sản phẩm. Phần "Giảm giá theo lô" chỉ xuất hiện khi sản phẩm được bán từ **2 lô trở lên**. Với sản phẩm thường (không lô / 1 lô), màn hình giữ nguyên hiện tại: một ô "Tiền giảm giá" duy nhất.

#### 3.1.2 Màn hình chức năng

**Vị trí:** Popup "Chi tiết sản phẩm" (bán hàng) — bổ sung khối "Giảm giá theo lô" dưới ô Kiểu giảm giá; đổi trạng thái 2 trường Số lượng và Tiền giảm giá → Tổng tiền giảm giá.

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Số lượng | Number input — **disable** | — | Auto = tổng SL các lô đã chọn. Không cho nhập tay |
| 2 | Kiểu giảm giá | Dropdown | Có | "Giảm theo giá trị" (mặc định), "Giảm theo phần trăm". Chỉ hiển thị khi SP ≥ 2 lô |
| 3 | Tổng tiền giảm giá | Number — **disable** | — | Auto = Σ giảm giá các lô. Chỉ hiển thị khi SP ≥ 2 lô; SP thường: ô "Tiền giảm giá" như hiện tại |
| 4 | Bảng "Giảm giá theo lô" | Table | — | Cột: Lô hàng (mã + HSD), Số lượng (+/−), Giảm giá. Mỗi dòng = 1 lô đã chọn |
| 4a | — Lô hàng | Link/Text | — | Mã lô + "HSD: dd/MM/yyyy" |
| 4b | — Số lượng | Stepper +/− | — | SL của lô; thay đổi → cập nhật Số lượng + tính lại giảm giá lô (nếu %) |
| 4c | — Giảm giá | Number input | — | Kiểu VND: nhập tiền, hậu tố "đ". Kiểu %: nhập %, hậu tố "%" |
| 5 | Tổng tiền thanh toán | Number — disable | — | = Thành tiền − Tổng tiền giảm giá (+ thuế nếu có) |
| 6 | Nhân viên phục vụ | Dropdown | — | Giữ nguyên hiện tại |
| 7 | Nút Hủy bỏ / Lưu | Button | — | Giữ nguyên hiện tại |

#### 3.1.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Chọn lô cho sản phẩm (≥ 2 lô) | Disable Số lượng = tổng SL lô; hiển thị Kiểu giảm giá + bảng Giảm giá theo lô + Tổng tiền giảm giá | SP có ≥ 2 lô |
| 2 | Thay đổi số lượng một lô (+/−) | Cập nhật Số lượng + Thành tiền; nếu kiểu = %, tính lại tiền giảm lô đó + Tổng tiền giảm giá | |
| 3 | Chọn Kiểu giảm giá = "Giảm theo giá trị" | Mỗi lô nhập tiền; lưu `discount_amount` | Mặc định |
| 4 | Nhập tiền giảm cho một lô (VND) | Cập nhật Tổng tiền giảm giá = Σ tiền giảm; cập nhật Tổng tiền thanh toán | Kiểu = VND |
| 5 | Chọn Kiểu giảm giá = "Giảm theo phần trăm" | **Xóa trắng** giảm giá tất cả lô về 0; đổi hậu tố sang "%" | Đổi kiểu |
| 6 | Nhập % giảm cho một lô | Tiền giảm lô = (SL lô × đơn giá) × %, làm tròn theo cấu hình hệ thống; cập nhật Tổng tiền giảm giá | Kiểu = % |
| 7 | Đổi Kiểu giảm giá % → VND | **Xóa trắng** giảm giá tất cả lô về 0; đổi hậu tố sang "đ" | Đổi kiểu |
| 8 | Nhấn **Lưu** | Lưu mỗi lô thành 1 dòng `bill_product` (kèm `batch_id`); đóng popup, quay lại giỏ hàng; cập nhật tổng hóa đơn | Hợp lệ |
| 9 | Nhấn **Hủy bỏ** | Đóng popup, không lưu thay đổi giảm giá | |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo | Hành động hệ thống |
|---|---|---|
| Giảm giá VND của lô > thành tiền lô (SL × đơn giá) | "Tiền giảm giá không được vượt quá thành tiền của lô." | Chặn, không cập nhật tổng; giữ con trỏ tại ô lỗi |
| Giảm giá % của lô > 100 | "Phần trăm giảm giá không được vượt quá 100%." | Chặn, không tính tiền giảm; giữ con trỏ tại ô lỗi |
| Nhập ký tự không phải số / số âm | "Giá trị giảm giá không hợp lệ." | Chặn nhập, giữ giá trị hợp lệ trước đó |
| SP chỉ còn 1 lô sau khi bỏ bớt lô | — | Ẩn bảng Giảm giá theo lô + Kiểu giảm giá + Tổng tiền giảm giá; về giao diện 1 ô "Tiền giảm giá" |

#### 3.1.4 Xử lý luồng sự kiện hệ thống

- **Tính tiền giảm theo %:** mỗi lô, tiền giảm = (SL lô × đơn giá) × %, làm tròn theo cấu hình hệ thống (xem OQ-01). Lưu `discount_rate` = %, `discount_amount` = tiền giảm.
- **Tính tiền giảm theo VND:** tiền giảm = giá trị nhập; lưu `discount_amount` = tiền giảm, `discount_rate` = 0/trống.
- **Tổng tiền giảm giá (dòng SP):** = Σ `discount_amount` các lô; tính lại mỗi khi SL lô / giảm giá lô thay đổi.
- **Tổng tiền thanh toán (dòng):** = Thành tiền − Tổng tiền giảm giá (+ thuế nếu có).
- **Đồng bộ Số lượng:** = Σ SL các lô đã chọn.
- **Ràng buộc trần:** tiền giảm lô ≤ SL lô × đơn giá; % ≤ 100. Vi phạm → chặn lưu.

---

### 3.2 Đồng bộ Số lượng theo lô

#### 3.2.1 Thông tin chung

Khi sản phẩm có ≥ 2 lô, trường Số lượng không cho nhập tay mà luôn = tổng số lượng phân bổ cho các lô, tránh lệch giữa số lượng dòng và số lượng từng lô.

#### 3.2.2 Màn hình chức năng

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Số lượng | Number — disable | — | Hiển thị tổng SL lô; không nhận nhập tay |
| 2 | Số lượng từng lô | Stepper +/− (bảng lô / popup chọn lô) | — | Nguồn duy nhất thay đổi tổng Số lượng |

#### 3.2.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Tăng/giảm SL một lô | Cập nhật Số lượng = Σ SL lô; cập nhật Thành tiền | |
| 2 | Thêm/bớt lô trong popup chọn lô | Cập nhật Số lượng tương ứng | |
| 3 | Nhấp ô Số lượng | Không cho sửa (disable) | SP có ≥ 2 lô |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo | Hành động hệ thống |
|---|---|---|
| SL lô bán > tồn của lô | "Số lượng vượt quá tồn kho của lô." | Chặn, giữ giá trị hợp lệ trước đó — xem OQ-04 |
| Giảm SL một lô về 0 | — | Theo nghiệp vụ chọn lô hiện tại (giữ hay loại lô) — xem OQ-04 |

#### 3.2.4 Xử lý luồng sự kiện hệ thống

- Mỗi lần SL lô thay đổi: Số lượng = Σ SL lô; Thành tiền = Số lượng × Đơn giá; nếu kiểu giảm = %, tính lại tiền giảm các lô và Tổng tiền giảm giá.

---

### 3.3 Bottom sheet giảm giá lô (Mobile)

#### 3.3.1 Thông tin chung

Trên Mobile, với sản phẩm có ≥ 2 lô, ô **Giảm giá** trong Chi tiết sản phẩm hiển thị mũi tên điều hướng; chạm vào mở bottom sheet "Chọn lô hàng" để nhập giảm giá từng lô. Logic tính toán giống Web (mục 3.1.4). *(Chưa có mockup mobile bán hàng — xem OQ-06.)*

#### 3.3.2 Màn hình chức năng

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Ô Giảm giá (chi tiết SP) | Row + arrow right | — | SP ≥ 2 lô: hiển thị arrow → mở bottom sheet. SP thường: nhập VND/% inline như hiện tại |
| 2 | Bottom sheet "Chọn lô hàng" | Bottom sheet | — | Header "Chọn lô hàng", ô tìm kiếm, danh sách lô |
| 3 | — Dòng lô | List item | — | Mã lô, HSD, Tồn, Stepper SL, ô Giảm giá (đ hoặc %) |
| 4 | Nút Hủy bỏ | Button | — | Đóng, không lưu |
| 5 | Nút Lưu | Button | — | Lưu giảm giá các lô, quay lại Chi tiết sản phẩm |

#### 3.3.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Chạm ô Giảm giá (SP ≥ 2 lô) | Mở bottom sheet "Chọn lô hàng" | SP có ≥ 2 lô |
| 2 | Nhập giảm giá từng lô (đ hoặc %) | Tính tiền giảm như Web; áp ràng buộc trần | |
| 3 | Nhấn **Hủy bỏ** | Đóng, không lưu, quay lại Chi tiết sản phẩm | |
| 4 | Nhấn **Lưu** | Lưu giảm giá các lô, quay lại Chi tiết sản phẩm | Hợp lệ |

**Trường hợp lỗi / Ngoại lệ:** giống mục 3.1.3.

#### 3.3.4 Xử lý luồng sự kiện hệ thống

- Giống mục 3.1.4. Bottom sheet chỉ là giao diện nhập trên Mobile; công thức và quy tắc lưu `discount_rate` / `discount_amount` không đổi.

---

## 4. NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Tính tổng hóa đơn | Bán hàng / giỏ hàng | Cao | Tổng tiền hàng = Σ(thành tiền SP − giảm giá SP); giảm giá SP ≥ 2 lô = Tổng tiền giảm giá tổng hợp từ lô |
| Hiển thị dòng SP trong giỏ hàng | Bán hàng (list) | Trung bình | Một SP nhiều lô lưu thành nhiều dòng `bill_product` — cần gom hiển thị thế nào (1 dòng tổng / nhiều dòng lô) — xem OQ-05 |
| Bán SP thường (không lô / 1 lô) | Chi tiết sản phẩm | Thấp | Giữ nguyên: 1 ô "Tiền giảm giá", không bảng theo lô |
| Chọn lô hàng khi bán | Popup/bottom sheet chọn lô | Trung bình | Số lượng chọn đồng bộ với Số lượng dòng; bổ sung nhập giảm giá theo lô |
| Chiết khấu / voucher toàn đơn | Bán hàng | Trung bình | Cần xác nhận thứ tự áp giảm giá lô vs chiết khấu đơn (`discount_allocated`) — xem OQ-07 |

### 4.2 Chức năng của hệ thống khác

Không áp dụng — tính năng nội bộ, không tích hợp hệ thống ngoài.

---

## OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| ~~OQ-A~~ | **Giả định (kế thừa SRS nhập kho):** làm tròn theo cấu hình hệ thống. Cần xác nhận áp dụng cho bán hàng | 2.5, 3.1.4 | Product | |
| ~~OQ-B~~ | **Giả định:** đổi Kiểu giảm giá (VND ↔ %) → xóa trắng giảm giá tất cả lô. Cần xác nhận | 3.1.3 | Product | |
| ~~OQ-C~~ | **Giả định:** giảm giá lô không vượt thành tiền lô; % ≤ 100 → chặn. Cần xác nhận | 3.1.3 | Product | |
| OQ-01 | Cấu hình làm tròn chung áp cho tiền giảm giá lô là gì và lưu ở đâu? | 3.1.4 | Dev | |
| OQ-02 | Kiểu giảm = VND, cột `discount_rate` lưu NULL hay 0? Có cần cờ phân biệt kiểu giảm cấp dòng không? | 2.5 | Dev | |
| OQ-03 | Mỗi lô bán lưu một dòng `bill_product` riêng (`batch_id` + `group_batch`) đúng không? | 2.5 | Dev | |
| OQ-04 | Bán: SL lô có bị chặn theo tồn kho lô không? Giảm SL lô về 0 → giữ hay loại lô? | 3.2.3 | Product | |
| OQ-05 | Giỏ hàng hiển thị SP nhiều lô thế nào (1 dòng gộp / nhiều dòng lô)? | 4.1 | Product |
| OQ-06 | Mobile bán hàng: cần mockup bottom sheet giảm giá lô (hiện chưa có) | 3.3 | Product/Design | |
| OQ-07 | Thứ tự áp giảm giá lô so với chiết khấu/voucher toàn đơn (`discount_allocated`)? | 4.1 | Product | |
