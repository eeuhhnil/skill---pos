---
type: srs
feature: hoa-don-ban-ra
status: draft
lang: vi
owner: "@huelinh"
created: 2026-05-25
updated: 2026-05-25
links:
  - Nghiệp vụ/Hóa đơn từ thuế/US-HoaDonBanRa.md
tags: []
changelog:
  - 2026-05-28 | /ba-write-srs | thêm mô tả chi tiết hành vi field Kho hàng: dropdown, hint tồn, xử lý config âm tồn, tách kho
  - 2026-05-26 | /ba-write-srs | cập nhật 3.3.2: cột Thuế + Chi tiết thanh toán theo bill_type từ ảnh UI; sửa nhãn Tạm tính/Phụ thu/Tổng tiền cần thanh toán; điền mô tả 2.6 Tạo đơn hàng
  - 2026-05-25 | /ba-write-srs | initial draft từ context brainstorm session
---

# SRS — Đồng bộ hóa đơn bán ra từ CQT để tạo đơn hàng

**Mã tài liệu:** SRS-HDB-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-05-25
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-05-25 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu | |

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

Hệ thống EPOS hiện tại hỗ trợ đồng bộ **hóa đơn mua vào** từ Cơ quan Thuế (CQT) để lập phiếu nhập kho tự động. Tuy nhiên chưa có tính năng tương tự cho **hóa đơn bán ra** — người dùng phải nhập lại thủ công thông tin đơn hàng từ hóa đơn điện tử đã xuất, gây tốn thời gian và dễ sai sót.

Yêu cầu bổ sung tính năng cho phép hệ thống tải hóa đơn bán ra từ CQT về, ghép cặp sản phẩm/khách hàng, rồi tự động tạo đơn hàng trong EPOS — tái sử dụng toàn bộ hạ tầng đồng bộ và mapping đã có của luồng mua vào.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung

Tính năng cho phép quản lý cửa hàng tải hóa đơn điện tử bán ra từ CQT về hệ thống EPOS, sau đó tạo đơn hàng tương ứng mà không cần nhập liệu thủ công.

Sau khi chọn hóa đơn cần lập đơn, hệ thống mở màn **Thông tin đơn hàng** — nơi người dùng vừa ghép cặp sản phẩm/khách hàng vừa xem chi tiết thanh toán và xác nhận tạo đơn ngay trên cùng một màn hình. Không có bước chuyển màn trung gian.

Tính năng tái sử dụng toàn bộ hạ tầng đồng bộ CQT, bảng mapping sản phẩm, và cơ chế tạo đơn hàng đã có của luồng mua vào.

### 2.2 Luồng nghiệp vụ

**Luồng hiện tại (As-Is):**
1. Kế toán/quản lý xem hóa đơn điện tử trên cổng thuế
2. Nhập thủ công thông tin khách hàng, sản phẩm, số lượng, giá vào EPOS
3. Tạo đơn hàng trong EPOS
4. Dễ xảy ra sai sót do nhập tay, tốn 5–15 phút/hóa đơn

**Luồng mới (To-Be):**
1. Quản lý vào màn **Danh sách hóa đơn bán ra** trong EPOS
2. Nhấn **Đồng bộ** → chọn khoảng thời gian (tối đa 30 ngày) → hệ thống tải HĐ từ CQT
3. Chọn hóa đơn cần lập đơn → hệ thống mở màn **Thông tin đơn hàng**
   - Hệ thống tự động ghép sản phẩm (theo tên + ĐVT) và khách hàng (theo CusCode)
   - Người dùng xác nhận/chỉnh sửa ghép cặp các dòng chưa khớp (hiển thị màu đỏ)
   - Chi tiết thanh toán hiển thị ngay phía dưới bảng sản phẩm
4. Nhấn **Thanh toán** → xác nhận phương thức → đơn hàng tạo thành công, tồn kho trừ

### 2.3 Yêu cầu người dùng

- Quản lý muốn đồng bộ hóa đơn bán ra từ CQT để tự động tạo đơn hàng, tiết kiệm thời gian nhập liệu thủ công.
- Quản lý muốn xem danh sách hóa đơn bán ra đã đồng bộ để tra cứu, đối chiếu.
- Quản lý muốn xem lịch sử đồng bộ hóa đơn bán ra để kiểm soát trạng thái (thành công/thất bại).
- Quản lý muốn ghép cặp sản phẩm trên hóa đơn với sản phẩm trong EPOS để hệ thống ghi nhận đúng mã hàng.
- Quản lý muốn tạo mới sản phẩm ngay trên luồng nếu hàng hóa chưa tồn tại trong EPOS.
- Quản lý muốn xem bản PDF của hóa đơn gốc để đối chiếu trực quan với dữ liệu trên màn hình.

### 2.4 Ngữ cảnh người dùng

Đối tượng sử dụng chủ yếu là **quản lý cửa hàng hộ kinh doanh** — không có kỹ năng kỹ thuật chuyên sâu, thao tác trên máy tính bàn/laptop tại quầy. Thao tác đồng bộ thường diễn ra vào đầu giờ làm việc hoặc cuối ngày để đối chiếu doanh thu với hóa đơn đã xuất. Số lượng hóa đơn bán ra mỗi lần đồng bộ thường từ 1–50 hóa đơn.

### 2.5 Thay đổi CSDL

| Loại | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| A | `invoice_tax` | `typeInvoice` | int | NOT NULL | 1000=mua vào, 1100=bán ra |
| A | `invoice_tax` | `ref_type` | int | NULL | 0=nhập kho, 1=đơn hàng. Dùng kèm `ref_id` để xác định loại chứng từ liên kết |
| A | `invoice_tax` | `customer_name` | nvarchar(255) | NULL | Tên người mua (chỉ có khi typeInvoice=1100) |
| A | `invoice_tax` | `customer_tax_code` | nvarchar(50) | NULL | MST người mua |
| A | `invoice_tax` | `cus_code` | nvarchar(50) | NULL | Mã KH nội bộ EPOS, lấy từ `NMua/TTKhac/TTin[TTruong='CusCode']/DLieu` trong XML |
| A | `invoice_tax` | `bill_type` | int | NULL | Loại bill: 1=Bán hàng, 2=GTGT một mức thuế, 3=GTGT nhiều mức thuế |
| A | `invoice_tax` | `discount_vat_rate` | decimal(18,4) | NULL | Tỷ lệ % giảm trừ thuế: = 0 nếu giảm trừ riêng, ≠ 0 nếu giảm trừ chung |
| A | `invoice_tax` | `discount_vat_amount` | decimal(18,4) | NULL | Tổng tiền giảm trừ thuế (cả giảm trừ riêng và chung) |
| A | `invoice_tax_sync_history` | `typeInvoice` | int | NOT NULL | 1000=mua vào, 1100=bán ra |
| A | `invoice_product_tax` | `code` | nvarchar(50) | NULL | Mã hàng hóa từ thẻ `MHHDVu` trong XML CQT |

**Bảng không thay đổi:** `invoice_product_mapping`, `tax_account`

> **Lưu ý giảm trừ riêng:** Cột `invoice_product_tax.extra` (đã có sẵn, nvarchar) lưu thêm 2 key JSON: `"discount_vat_rate"` và `"discount_vat_amount"` (kiểu chuỗi) khi hóa đơn có giảm trừ riêng theo từng dòng sản phẩm (`Extra.DiscountVatRate = "0"` ở cấp invoice).

> **Lưu ý:** `ref_id` và `ref_type` đi cặp với nhau — khi `ref_id` có giá trị thì `ref_type` phải có giá trị. Không thể đặt FK constraint ở DB vì `ref_id` trỏ sang 2 bảng khác nhau tùy `ref_type` → validate ở application layer.

> **Lưu ý dữ liệu cũ:** Toàn bộ bản ghi hiện có trong `invoice_tax` và `invoice_tax_sync_history` là hóa đơn mua vào → cần migration `UPDATE ... SET typeInvoice = 1000`.

### 2.6 Danh sách chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Quản lý | Danh sách HĐ bán ra | Đồng bộ thủ công | Chọn khoảng thời gian, tải HĐ bán ra từ CQT | Cao |
| Quản lý | Danh sách HĐ bán ra | Xem danh sách HĐ | Tra cứu, lọc HĐ đã đồng bộ | Cao |
| Quản lý | Danh sách HĐ bán ra | Xem PDF HĐ gốc | Xem file HTML/PDF từ ZIP CQT | Trung bình |
| Quản lý | Lịch sử đồng bộ | Xem lịch sử đồng bộ bán ra | Trạng thái các lần đồng bộ typeInvoice=1100 | Trung bình |
| Quản lý | Thông tin đơn hàng | Ghép cặp sản phẩm | Tự động theo code2 (MHHDVu) + ĐVT; thủ công nếu không khớp | Cao |
| Quản lý | Thông tin đơn hàng | Ghép cặp khách hàng | CusCode → KH nội bộ → Khách lẻ | Cao |
| Quản lý | Thông tin đơn hàng | Tạo đơn hàng | Hiển thị giao diện khác nhau theo bill_type; lưu nháp hoặc thanh toán để tạo đơn | Cao |
| Quản lý | Thông tin đơn hàng | Tạo mới sản phẩm | Tạo SP mới trong EPOS nếu chưa tồn tại | Trung bình |
| Quản lý | Thông tin đơn hàng | Tạo mới khách hàng | Tạo khách hàng mới trong EPOS nếu chưa tồn tại | Trung bình |


---

## 3. CHI TIẾT CÁC CHỨC NĂNG

### 3.1 Đồng bộ thủ công hóa đơn bán ra

#### 3.1.1 Thông tin chung

Chức năng cho phép quản lý khởi động quá trình lấy danh sách hóa đơn bán ra từ CQT về hệ thống EPOS trong một khoảng thời gian chỉ định. Tái sử dụng toàn bộ cơ chế đồng bộ của luồng mua vào, phân biệt bằng `typeInvoice=1100`.

#### 3.1.2 Màn hình

**Popup: Đồng bộ hóa đơn** *(modal overlay, hiển thị khi nhấn nút "Đồng bộ" trên màn Danh sách HĐ bán ra)*

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Tiêu đề popup | Label | — | "Đồng bộ hóa đơn", cố định |
| 2 | Nút đóng (×) | Icon Button | — | Đóng popup, không thực hiện đồng bộ |
| 3 | Link tra cứu tiến trình | Hyperlink | — | "Vui lòng truy cập [Đồng bộ hóa đơn từ thuế] để theo dõi tiến trình đồng bộ." — mở màn Lịch sử đồng bộ |
| 4 | Loại hóa đơn | Dropdown | Có | Mặc định: "Hóa đơn điện tử". Giá trị: Hóa đơn điện tử / Hóa đơn từ máy tính tiền |
| 5 | Khoảng thời gian | Dropdown | Có | Lựa chọn nhanh: Hôm nay / Hôm qua / Tuần này / Tháng này / Tùy chọn. Khi chọn → tự động điền field "Chọn thời gian" |
| 6 | Chọn thời gian | Date range picker | Có | Khoảng ngày tương ứng, có thể điều chỉnh thủ công. Định dạng DD/MM/YYYY – DD/MM/YYYY. Tối đa 30 ngày |
| 7 | Nút Hủy bỏ | Button (Secondary) | — | Đóng popup, không thực hiện đồng bộ |
| 8 | Nút Đồng bộ | Button (Primary – xanh) | — | Xác nhận, bắt đầu gọi API CQT |

#### 3.1.3 Luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Chọn khoảng ngày và nhấn Đồng bộ | Validate khoảng ngày | |
| 2 | — | Hiển thị loading, gọi API CQT lấy HĐ bán ra | Tài khoản CQT đã kết nối |
| 3 | — | Lưu kết quả vào `invoice_tax` (typeInvoice=1100), ghi `invoice_tax_sync_history` | |
| 4 | — | Hiển thị thông báo: "Đồng bộ thành công: X hóa đơn" hoặc thông báo lỗi | |

**Trường hợp lỗi:**

| Tình huống | Thông báo | Hành động hệ thống |
|---|---|---|
| Khoảng ngày > 30 ngày | "Chỉ được đồng bộ tối đa 30 ngày" | Không gọi API, highlight field |
| Chưa kết nối tài khoản CQT | "Chưa kết nối tài khoản cơ quan thuế" | Disable nút Đồng bộ hoặc hiển thị cảnh báo |
| API CQT lỗi | "Đồng bộ thất bại. Vui lòng thử lại." | Ghi status=3 (FAILED) vào sync_history |

#### 3.1.4 Luồng sự kiện hệ thống

- **Check trùng HĐ:** So sánh `data.datas.id` với `invoice_tax.id_TCT` (cùng `typeInvoice=1100`). Nếu đã tồn tại → bỏ qua, không insert lại.
- **Tính và lưu `bill_type`:** Khi insert `invoice_tax`, đọc XML xác định loại bill và lưu vào `invoice_tax.bill_type`:
  - Đọc `HDon/DLHDon/TTChung/KHMSHDon`:
    - `= 2` → `bill_type = 1` (Bán hàng)
    - `= 1` → đếm số node `HDon/DLHDon/NDHDon/TToan/THTTLTSuat/LTSuat`:
      - 1 node → `bill_type = 2` (GTGT một thuế)
      - ≥ 2 node → `bill_type = 3` (GTGT nhiều thuế)
- **Lưu giảm trừ thuế:** Khi insert, kiểm tra node `HDon/DLHDon/NDHDon/TToan/TTKhac[TTruong='DiscountVatRate']`:
  - **Giảm trừ chung** — node tồn tại và `DLieu ≠ 0`:
    - `invoice_tax.discount_vat_rate` = `DLieu` (tỷ lệ %)
    - `invoice_tax.discount_vat_amount` = giá trị TotalDiscount từ XML
  - **Giảm trừ riêng** — node không tồn tại hoặc `DLieu = 0`:
    - `invoice_tax.discount_vat_rate = 0`
    - `invoice_tax.discount_vat_amount` = tổng `discount_vat_amount` của các dòng sản phẩm
    - Với mỗi dòng sản phẩm: lưu `discount_vat_rate` và `discount_vat_amount` vào `invoice_product_tax.extra` dạng chuỗi JSON
  - Không có giảm trừ → để NULL, không ghi.
- **Ghi sync history:** Mỗi lần đồng bộ tạo 1 bản ghi `invoice_tax_sync_history` với `typeInvoice=1100`, trạng thái cập nhật theo tiến trình (0→1→2 hoặc 3).

---

### 3.2 Danh sách hóa đơn bán ra

#### 3.2.1 Thông tin chung

Màn hình hiển thị tất cả hóa đơn bán ra đã được đồng bộ về EPOS, cho phép tra cứu và thực hiện các thao tác tiếp theo (lập đơn hàng, xem PDF).

#### 3.2.2 Màn hình

**Khu vực header:**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Tiêu đề trang | Label | — | "Danh sách hóa đơn" |
| 2 | Nút Đồng bộ hóa đơn | Button (Primary – xanh) | — | Góc trên phải — mở popup Đồng bộ hóa đơn (mục 3.1) |

**Thanh tab lọc loại hóa đơn:**

| # | Tab | Mô tả |
|---|---|---|
| 1 | Tất cả | Hiển thị toàn bộ HĐ |
| 2 | Hóa đơn mới | Lọc HĐ trạng thái "Hóa đơn mới" từ CQT |
| 3 | Hóa đơn thay thế | Lọc HĐ thay thế |
| 4 | Hóa đơn điều chỉnh | Lọc HĐ điều chỉnh |
| 5 | Hóa đơn bị thay thế | Lọc HĐ đã bị thay thế |
| 6 | Hóa đơn bị điều chỉnh | Lọc HĐ đã bị điều chỉnh |
| 7 | Hóa đơn bị hủy | Lọc HĐ đã hủy |

**Khu vực lọc & tìm kiếm:**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Khoảng thời gian | Date range picker | Không | Lọc theo ngày hóa đơn. Mặc định: tháng hiện tại |
| 2 | Tìm kiếm | Text input | Không | Tìm theo số HĐ, ký hiệu, tên khách hàng |
| 3 | Icon cài đặt cột | Icon Button | — | Hiển thị/ẩn cột trong bảng |
| 4 | Icon bộ lọc nâng cao | Icon Button | — | Mở bộ lọc bổ sung |

**Bảng danh sách hóa đơn:**

| # | Cột | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | STT | Text | — | Số thứ tự, tự sinh |
| 2 | Mẫu số | Text | — | `invoice_tax.form_no` |
| 3 | Ký hiệu | Text | — | `invoice_tax.serial` |
| 4 | Ngày hóa đơn | DateTime | — | `invoice_tax.arising_date` (NLap trong XML). Định dạng DD/MM/YYYY HH:mm |
| 5 | Số hóa đơn | Text | — | `invoice_tax.no` |
| 6 | Khách hàng | Text | — | `invoice_tax.customer_name` |
| 7 | Tổng tiền | Number | — | `invoice_tax.total_amount`. Định dạng số có dấu chấm phân cách nghìn |
| 8 | Mã chứng từ | Link | — | `invoice_tax.ref_id` — link đến đơn hàng EPOS đã lập. Trống nếu chưa lập đơn |
| 9 | Trạng thái hóa đơn | Badge | — | `invoice_tax.invoice_status` (ánh xạ từ tthai CQT: 01=Hóa đơn mới, 02=Bị hủy, 03=Điều chỉnh, 04=Thay thế) |
| 10 | Kết quả kiểm tra CQT | Badge | — | `invoice_tax.cqt_check_result` — VD: Đã cấp mã hóa đơn |
| 11 | Thao tác | Button / Icon | — | Icon Xem HĐ — mở PDF hóa đơn gốc; Nút Lập đơn — chỉ hiển thị khi `ref_id` trống |

> **Lưu ý:** Danh sách chỉ load bản ghi có `invoice_tax.typeInvoice = 1100` (hóa đơn bán ra). Không hiển thị hóa đơn mua vào (`typeInvoice = 1000`).

#### 3.2.3 Luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Vào màn Hóa đơn bán ra | Load danh sách `invoice_tax` WHERE `typeInvoice=1100` |
| 2 | Nhấn **Lập đơn** trên 1 HĐ | Chuyển sang B1 — Ghép cặp |
| 3 | Nhấn **Xem HĐ** | Mở file HTML/PDF từ ZIP CQT trong tab mới |

---

### 3.3 Thông tin đơn hàng (Ghép cặp & Tạo đơn)

#### 3.3.1 Thông tin chung

Màn hình đơn trang mở ra khi người dùng nhấn "Lập đơn" từ danh sách hóa đơn bán ra. Người dùng thực hiện ghép cặp sản phẩm và khách hàng, xem chi tiết thanh toán, rồi xác nhận tạo đơn ngay trên cùng màn hình — không có bước chuyển màn trung gian.

#### 3.3.2 Màn hình

**Banner hướng dẫn (top):**

Nội dung cố định: *"Để tạo đơn hàng, vui lòng kiểm tra và chọn đúng khách hàng, hàng hóa theo hóa đơn. Nếu chưa có trong hệ thống, bạn có thể tạo mới. Lưu ý hàng hóa cần có đơn vị tính giống với hóa đơn từ thuế."*

**Khu vực khách hàng & hình thức:**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Khách hàng | Dropdown + search | Không | Tự động điền nếu ghép được qua CusCode; nếu không tìm thấy → để trống ("Chọn..."), user tự chọn hoặc nhấn [+] tạo mới |
| 2 | Nút [+] | Icon Button | — | Tạo mới khách hàng nhanh |
| 3 | Hình thức | Dropdown | Không | Hình thức giao hàng (Mang về / Tại chỗ / Giao hàng) — dùng lại component hiện có của POS |

**Bảng sản phẩm:**

| # | Cột | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | STT | Text (readonly) | — | Số thứ tự |
| 2 | Sản phẩm từ thuế | Text (readonly) | — | Dòng 1: tên hàng hóa từ XML CQT. Dòng 2: "ĐVT: {DVTinh}" |
| 3 | Sản phẩm từ POS | Dropdown + search | Có | Sản phẩm EPOS tương ứng; nút [+] thêm SP mới nhanh. Dòng phụ bên dưới dropdown: **(1)** ĐVT; **(2)** Kho: để trống, chỉ hiển thị sau khi người dùng chọn kho; **(3)** Nếu SP có số lô: hiện link "Chọn lô" — click mở popup chọn lô. Tổng SL các lô đã chọn phải bằng SL từ hóa đơn thuế; nếu tổng SL đạt đủ, FE disable nút [+] trong popup, không cho chọn thêm. |
| 4 | SL | Number (readonly) | — | Số lượng từ hóa đơn CQT |
| 5 | Đơn giá | Number (readonly) | — | Đơn giá từ hóa đơn CQT |
| 6 | Giảm giá | Number | Không | Chiết khấu dòng sản phẩm |
| 7 | Thuế *(tên thay đổi theo bill_type — xem bảng bên dưới)* | Text (readonly) | — | Giá trị thay đổi theo loại hóa đơn |
| 8 | Thành tiền | Number (auto) | — | Tự tính: SL × Đơn giá × (1 – Giảm giá%) |
| 9 | Kho hàng | Dropdown | Có | Để trống, người dùng tự chọn; xem mô tả chi tiết bên dưới |
| 10 | Thao tác | Icon Button | — | Nút xóa dòng |

**Hành vi field Kho hàng:**

- **Mặc định:** Để trống — người dùng tự chọn.
- **Khi mở dropdown:** Hiển thị danh sách kho có tồn kho của sản phẩm hiện tại. Mỗi dòng gồm: Tên kho + Tồn kho hiện tại. Kho hết hàng (tồn = 0) bị disable, không thể chọn. Có ô tìm kiếm lọc nhanh theo tên kho.
- **Sau khi chọn kho — tồn đủ (tồn ≥ SL cần):** Hiển thị tên kho, không hiện thêm thông báo.
- **Sau khi chọn kho — tồn không đủ (tồn < SL cần):** Hiển thị hint text ngay bên dưới chip kho: `Tồn: {tồn của SP trong kho đó} · Cần: {SL từ hóa đơn thuế} · Thiếu: {Cần − Tồn}`
- **Xử lý tồn không đủ theo cấu hình:**

  | Cấu hình | Hiển thị chip kho | Ảnh hưởng thanh toán |
  |---|---|---|
  | Cho phép xuất quá tồn | Màu vàng — cảnh báo | Vẫn cho phép thanh toán |
  | Không cho phép xuất quá tồn | Màu đỏ — lỗi | Khóa nút Thanh toán |

- **Tách kho:** Khi tồn không đủ, dropdown hiển thị thêm nút "Tách sang kho khác". Khi nhấn, dòng sản phẩm được tách thành 2 dòng:
  - **Dòng gốc:** SL = `MIN(Tồn kho, SL cần)` = tồn hiện có của kho đó
  - **Dòng mới:** SL = SL từ hóa đơn thuế − Tồn kho (phần còn thiếu); kho để trống, người dùng chọn kho khác
  - STT toàn bảng tự cập nhật tuần tự sau khi tách (ví dụ: tách từ dòng 1 → dòng mới thành STT 2, các dòng cũ dịch xuống 3, 4...)

**Trạng thái dòng sản phẩm:**

| Trạng thái | Biểu hiện | Ý nghĩa |
|---|---|---|
| Bình thường | Nền trắng | Đã ghép SP POS thành công |
| Đỏ (row-error) | Dropdown SP POS nền đỏ, icon cảnh báo (!) bên trái tên SP | Chưa ghép được — cần user chọn thủ công |
| Tím (row-disc) | Nền tím | Dòng chiết khấu (`TChat=3`) — user có thể xóa |

**Hiển thị theo loại hóa đơn (`bill_type`):**

| Trường | bill_type=1 — Bán hàng | bill_type=2 — GTGT một thuế | bill_type=3 — GTGT nhiều thuế |
|---|---|---|---|
| Tên cột 7 (bảng SP) | "Thuế giảm trừ" | "Thuế" | "Thuế" |
| Giá trị cột 7 per dòng SP | % giảm trừ thuế (ví dụ: 10%) | % thuế suất (ví dụ: 10%) | 0 |
| Dòng thuế trong Chi tiết thanh toán | **Thuế giảm trừ**: {số tiền} | **Tổng tiền thuế**: {số tiền} | **Thuế đơn hàng**: {X%} + **Tổng tiền thuế**: {số tiền} |

**Khu vực Chi tiết thanh toán (bên dưới bảng SP):**

Dòng cố định:

| # | Dòng | Mô tả |
|---|---|---|
| 1 | Tạm tính | Tổng thành tiền các dòng SP |
| 2 | Chiết khấu | Tổng chiết khấu; có icon bút chì để chỉnh sửa inline |
| 3 | Phụ thu | Phí phát sinh nếu có; có icon bút chì để chỉnh sửa inline |
| 4 | Tổng tiền trước thuế | Tổng sau chiết khấu, trước thuế |
| — | *(dòng thuế — xem bảng "Hiển thị theo loại hóa đơn" bên trên)* | |
| 5 | **Tổng tiền cần thanh toán** | **Số tiền cuối, bold, màu xanh** |

**Bottom bar (cố định cuối màn):**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Ngày tạo | Date (inline edit) | Có | Mặc định = `NLap` từ XML HĐ; hiển thị dạng DD/MM/YYYY; có icon bút chì để chỉnh sửa |
| 2 | Ghi chú | Text (inline edit) | Không | Placeholder "Nhập ghi chú"; có icon bút chì |
| 3 | Nút Lưu đơn | Button (Secondary) | — | Lưu nháp, chưa trừ tồn kho |
| 4 | Nút Thanh toán | Button (Primary – xanh) | — | Mở popup thanh toán → xác nhận → tạo đơn hoàn thành |

#### 3.3.3 Luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Vào màn Thông tin đơn hàng | Tự động ghép SP theo `code` (`MHHDVu`) + `unit` (`DVTinh`); tự động điền KH từ CusCode | |
| 2 | Người dùng chọn SP cho dòng đỏ | Cập nhật dropdown, đổi row sang trạng thái bình thường | |
| 3 | Người dùng nhấn "Chọn lô" | Mở popup chọn lô; sau khi chọn hiển thị chip "Lô: {ngày hết hạn}" dưới dropdown SP | |
| 4 | Người dùng xóa dòng chiết khấu (tím) | Xóa dòng, recalculate Chi tiết thanh toán | |
| 5 | Nhấn Lưu đơn | Tạo đơn hàng trạng thái "Nháp", `ref_id` = order ID, `ref_type = 1` | |
| 6 | Nhấn Thanh toán | Mở popup thanh toán (tiền mặt / chuyển khoản / thẻ) | Không còn dòng đỏ |
| 7 | Xác nhận thanh toán | Tạo đơn hàng trạng thái "Hoàn thành", trừ tồn kho, cập nhật `invoice_tax.ref_id` | |

**Trường hợp lỗi:**

| Tình huống | Thông báo | Hành động |
|---|---|---|
| Còn dòng đỏ (chưa ghép) | "Còn X sản phẩm chưa ghép cặp" | Disable nút Thanh toán |
| Sản phẩm là combo trong POS | Không trigger popup chọn combo | Nhập thẳng như SP thường |

#### 3.3.4 Luồng sự kiện hệ thống

- **Ghép sản phẩm tự động:** Thực hiện theo 2 bước:
  1. Tìm `product` theo `product.code2 = ipt.code`
  2. Từ `product.id` tìm dòng `product_product_unit` theo `ppu.product_id = product.id` AND `ISNULL(ppu.unit_name, '') = ISNULL(ipt.unit, '')`
     *(SP không có ĐVT thì `ppu.unit_name = NULL`; HĐ thuế không có `DVTinh` thì `ipt.unit = NULL` — cả 2 NULL vẫn khớp)*

  Kết quả: lấy `ppu.product_id` + `ppu.id` (`product_product_unit_id`) điền vào dòng đơn hàng.

  | TH | Điều kiện | Kết quả |
  |---|---|---|
  | 1 | `code2` khớp + `unit_name` khớp (cả 2 có giá trị) | Tự động điền SP POS, row bình thường |
  | 2 | `code2` khớp + cả 2 phía `unit` đều NULL/rỗng | Tự động điền SP POS, row bình thường |
  | 3 | `code2` không tìm thấy hoặc `unit` không khớp | Row đỏ, user chọn SP thủ công từ dropdown |
  | 4 | Dòng `TChat=3` (chiết khấu) | Row tím; user có thể xóa dòng |
  | 5 | SP POS được ghép là combo/topping | Nhập thẳng như SP đơn, không mở popup chọn thành phần combo |

- **Ghép khách hàng tự động:** Đọc `CusCode` từ `NMua/TTKhac/TTin[TTruong='CusCode']/DLieu` trong XML → tra KH nội bộ EPOS theo mã này. Nếu khớp → tự động điền dropdown. Nếu không khớp hoặc CusCode trống → dropdown để trống, user tự chọn hoặc tạo mới.

  | TH | Điều kiện | Kết quả |
  |---|---|---|
  | 1 | CusCode có trong XML, tìm thấy KH nội bộ theo mã | Tự động điền KH vào dropdown |
  | 2 | CusCode không khớp hoặc CusCode trống | Dropdown để trống ("Chọn..."); user tự chọn KH từ danh sách hoặc nhấn [+] tạo mới |
  | 3 | User thay đổi KH thủ công (kể cả khi đã tự động điền) | Ghi đè kết quả tự động, lưu theo lựa chọn của user |

- **Xác định loại bill:** Đọc `invoice_tax.bill_type` từ DB (đã tính và lưu lúc đồng bộ — xem mục 3.1.4).
- **Xử lý combo:** Khi sản phẩm POS được ghép là combo/topping → KHÔNG mở popup chọn thành phần. Nhập thẳng như sản phẩm đơn. Thành phần cố định tự trừ kho theo cấu hình mặc định; thành phần tùy chọn bỏ qua.

**Lưu ý:**
- **Mã đơn hàng:** EPOS tự sinh, không lấy từ hóa đơn thuế.
- **Ngày tạo đơn:** Mặc định = `NLap` (ngày lập hóa đơn), không phải ngày hôm nay.
- **Trừ tồn kho:** Chỉ thực hiện khi đơn hàng được xác nhận thanh toán (trạng thái "Hoàn thành").
- **Trạng thái hóa đơn bán hàng EPOS:** Hóa đơn bán hàng sinh ra từ luồng này tự động được đặt `status = 1` và `tax_check_status = 1` (hợp lệ). Hệ thống **không** đẩy hóa đơn lên CQT — vì dữ liệu đã được lấy từ CQT xuống, không phải hóa đơn mới cần phát hành.

#### 3.3.5 Popup Thanh toán

Dùng lại form thanh toán hiện có của EPOS. Hỗ trợ:
- Tiền mặt (tính tiền thừa)
- Chuyển khoản
- Thẻ

---

## 4. NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Popup thanh toán | Thông tin đơn hàng | Không đổi | Dùng nguyên component hiện có |
| Quản lý tồn kho | Background | Thấp | Tồn kho bị trừ khi đơn hàng từ HĐ thuế hoàn thành — cùng cơ chế đơn hàng thường |
| Đồng bộ hóa đơn mua vào | Danh sách HĐ mua vào | Thấp | Dùng chung `tax_account`, `invoice_product_mapping`. Phân biệt bằng `typeInvoice` |
| Lịch sử đồng bộ | Lịch sử đồng bộ | Thấp | Thêm filter `typeInvoice` để hiển thị đúng tab |

### 4.2 Hệ thống ngoài

| Hệ thống | API / Webservice | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Cơ quan Thuế (CQT) | POST /api/integration/gen-token | Không đổi | Dùng chung token với luồng mua vào |
| Cơ quan Thuế (CQT) | POST /api/integration/sync-tax | Thấp | Cùng endpoint, bổ sung parameter để lọc HĐ bán ra (type=sale hoặc tương đương) |

---

## Open Questions

| # | Câu hỏi | Ảnh hưởng đến mục | Người trả lời | Deadline |
|---|---|---|---|---|
| 1 | API CQT có hỗ trợ filter riêng HĐ bán ra hay trả về tất cả rồi FE filter theo `typeInvoice`? | 3.1 Đồng bộ | Dev/Tech Lead | — |
| 2 | Khi combo được nhập thẳng (không popup), thành phần cố định trừ kho theo cấu hình mặc định — cấu hình này lấy từ đâu nếu sản phẩm combo chưa có cấu hình? | 3.3 Xử lý combo | BA + Dev | — |
| 3 | Đơn hàng tạo từ HĐ thuế có hiển thị trên các báo cáo doanh thu hiện có không, hay cần report riêng? | 4.1 Ảnh hưởng | Product Owner | — |
