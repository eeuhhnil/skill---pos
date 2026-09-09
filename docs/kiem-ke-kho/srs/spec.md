---
type: srs
feature: kiem-ke-kho
status: draft
lang: vi
owner: "@huelinh"
version: 1.8
created: 2026-09-05
updated: 2026-09-07
links: [docs/kiem-ke-kho/urd.md, docs/kiem-ke-kho/brainstorms/phieu-kiem-ke-can-bang-kho.md, docs/kiem-ke-kho/gd1-giai-phap-so-bo.md, docs/sua-ton-lo-san-pham/srs/spec.md]
tags: [ton-kho, kiem-ke, gia-von, phieu-dieu-chinh]
stale_reason: ""
changelog:
  - 2026-09-07 | /srs | gộp lập phiếu và cân bằng kho thành một luồng 21 bước
  - 2026-09-07 | /srs | viết lại 3.2 theo thiết kế: popup chọn kho, 5 tab lọc, nhân đôi dòng, nút Lưu tạm
  - 2026-09-07 | /srs | đánh lại mã BR mục 3.1.4 còn 3 quy tắc; chuyển 3 quy tắc sang 3.2.4
  - 2026-09-07 | /srs | viết lại 3.1.3 và 3.1.4 theo cấu trúc mã bước 1a/2b; thêm 6 mã lỗi phân quyền
  - 2026-09-07 | /srs | thêm cột Từ bước cho toàn bộ bảng luồng rẽ nhánh và ngoại lệ
  - 2026-09-07 | /srs | mô tả popup chi tiết chứng từ; đổi Lý do chênh lệch thành Nguyên nhân
  - 2026-09-07 | /srs | mô tả giao diện màn danh sách theo bản thiết kế; đổi trạng thái sang Chưa xử lý/Đã xử lý
  - 2026-09-07 | /srs | dựng lại mục 3 theo 6 chức năng; tách quyền Cân bằng kho; đổi actor sang Quản lý kho
  - 2026-09-05 | /srs | tạo mới SRS kiểm kê kho từ URD và brainstorm; chốt N11/X12 và gom chứng từ theo phiếu
---

# SRS — Kiểm kê kho

**Mã tài liệu:** SRS-KIEMKEKHO-001
**Phiên bản:** 1.8
**Ngày tạo:** 05/09/2026
**Người soạn:** Dương Thị Huệ Linh
**Trạng thái:** Draft

> Mã quy tắc nghiệp vụ và mã lỗi trong tài liệu dùng tiền tố rút gọn `kiemke` cho feature `kiem-ke-kho`.

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Người thực hiện | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|-----------------|----------------|---------|
| 05/09/2026 | Toàn bộ | A | Cải tiến hệ thống | Dương Thị Huệ Linh | Tạo mới tài liệu | |
| 07/09/2026 | Mục 2.3, 2.6, 3 | M | Rà soát nội bộ | Dương Thị Huệ Linh | Cập nhật danh sách yêu cầu người dùng và danh sách chức năng; tách quyền Cân bằng kho thành quyền riêng | |

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
   - 3.1 Xem, lọc, xóa phiếu nháp
   - 3.2 Tạo phiếu kiểm kê
   - 3.3 Chỉnh sửa phiếu kiểm kê
   - 3.4 Xóa phiếu kiểm kê
   - 3.5 In biên bản kiểm kê
   - 3.6 Cấp quyền kiểm kê kho
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Open Questions

---

## 1. NGUỒN GỐC THAY ĐỔI

Yêu cầu cải tiến nội bộ, xuất phát từ phản ánh trực tiếp của người dùng về việc phần mềm chưa có chức năng kiểm kê kho.

Hiện phần mềm có ba giao dịch kho là **nhập kho, xuất kho, chuyển kho**, cùng chức năng **sửa số lượng tồn trực tiếp trong thông tin sản phẩm** (xem [docs/sua-ton-lo-san-pham/srs/spec.md](../../sua-ton-lo-san-pham/srs/spec.md)). Khi đếm thực tế thấy lệch, quản lý kho phải mở lần lượt từng sản phẩm để sửa tồn; hệ thống có sinh chứng từ điều chỉnh nhưng **không có phiếu kiểm kê làm căn cứ**, nên kế toán không biết chứng từ đó thuộc đợt kiểm nào, ai kiểm, kiểm khi nào, và không quy đổi được chênh lệch ra tiền.

Tài liệu thượng nguồn: [gd1-giai-phap-so-bo.md](../gd1-giai-phap-so-bo.md), [urd.md](../urd.md), [brainstorms/phieu-kiem-ke-can-bang-kho.md](../brainstorms/phieu-kiem-ke-can-bang-kho.md).

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Bổ sung phân hệ **Kiểm kê kho** vào nhóm nghiệp vụ Kho. Quản lý kho lập một phiếu kiểm kê cho **một kho**, đưa hàng vào phiếu bằng cách chọn toàn bộ hàng hóa của kho hoặc chọn tay từng mã, nhập số đếm thực tế cho từng dòng, và bấm **Cân bằng kho** để hệ thống cập nhật tồn theo số đã đếm.

Phiếu hiển thị song song **tồn sổ sách** và **số đếm thực tế**, tự tính chênh lệch cả về **số lượng** lẫn **giá trị bằng tiền** (số lượng nhân giá vốn). Khi cân bằng, hệ thống gom toàn bộ dòng thừa thành **một chứng từ nhập kho mã N11** và toàn bộ dòng thiếu thành **một chứng từ xuất kho mã X12**, cả hai trỏ ngược về phiếu kiểm kê để truy vết.

Trong lúc kiểm kê, hệ thống **không khóa kho và không chặn bán hàng**. Phiếu ở trạng thái Chưa xử lý thì tồn sổ sách được nạp lại theo số hiện tại mỗi lần mở; đến lúc cân bằng, hệ thống nạp tồn lần cuối rồi mới tính chênh lệch, sau đó **ghi cứng toàn bộ số liệu vào phiếu** để phiếu đã hoàn thành luôn đọc ra đúng số tại thời điểm kiểm.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Quản lý kho đếm số lượng thực tế tại kho, ghi ra giấy hoặc file ngoài.
2. So sánh thủ công với số tồn hiển thị trên phần mềm, ghi lại các mã lệch.
3. Mở lần lượt từng sản phẩm, sửa lại số tồn cho khớp số đếm.
4. Hệ thống cập nhật `inventory.on_hand` và sinh chứng từ điều chỉnh N3 (nhập) hoặc X2 (xuất) cho phần chênh lệch của từng mã.

**Luồng mới (To-Be):**

1. Quản lý kho vào **Kho > Kiểm kê kho**, bấm **Thêm phiếu**.
2. Chọn kho cần kiểm; nhập ngày kiểm kê và lý do kiểm kê nếu có.
3. Đưa hàng vào phiếu: tick **Chọn tất cả hàng hóa trong kho** (danh sách hiện theo đơn vị tính chính), hoặc **chọn tay** bằng tìm kiếm và quét mã vạch. Sản phẩm có theo dõi lô được tách thành từng dòng lô.
4. Hệ thống nạp **tồn sổ sách hiện tại** và **giá vốn theo kỳ chứa ngày kiểm kê** cho từng dòng.
5. Quản lý kho nhập hoặc quét để ghi **số đếm thực tế**; hệ thống tính chênh lệch số lượng và chênh lệch giá trị theo thời gian thực.
6. Quản lý kho **Lưu tạm** để đếm tiếp lần sau, hoặc bấm **Cân bằng kho**.
7. Nếu còn dòng chưa nhập số thực tế, hệ thống cảnh báo để người dùng chọn loại bỏ những dòng đó khỏi phiếu hoặc quay lại kiểm tiếp.
8. Người dùng xác nhận cân bằng. Hệ thống nạp tồn lần cuối, tính lại chênh lệch, cập nhật `inventory` và `batches_detail`, sinh **một chứng từ N11** cho toàn bộ phần thừa và **một chứng từ X12** cho toàn bộ phần thiếu.
9. Hệ thống ghi cứng số liệu vào phiếu, chuyển phiếu sang **Đã xử lý** và khóa lại. Người dùng in biên bản kiểm kê để ký và lưu hồ sơ.

**Khác biệt cốt lõi:** thay vì N thao tác sửa tồn rời rạc sinh ra N chứng từ không liên kết, một đợt kiểm kê giờ sinh ra **một phiếu kiểm kê + tối đa hai chứng từ kho**, tất cả liên kết với nhau và tra ngược được.

### 2.3 Yêu cầu người dùng

| Story ID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|----------|---------|-----------|----------|-----------|
| US-01 | Quản lý kho | Tạo một phiếu kiểm kê cho một kho và xác định ngày kiểm kê | Có chứng từ ghi nhận kết quả của một đợt kiểm kê | Cao |
| US-02 | Quản lý kho | Thêm toàn bộ sản phẩm đang được quản lý trong kho vào phiếu kiểm kê | Tiết kiệm thời gian khi cần kiểm kê toàn bộ kho, không phải thêm từng sản phẩm | Cao |
| US-03 | Quản lý kho | Thêm từng sản phẩm vào phiếu kiểm kê bằng cách tìm kiếm hoặc quét mã vạch | Linh hoạt kiểm kê một phần sản phẩm hoặc các sản phẩm cần kiểm tra | Cao |
| US-04 | Quản lý kho | Chọn đơn vị tính để kiểm kê đối với sản phẩm có nhiều đơn vị tính | Cho phép người kiểm kê nhập số lượng theo đơn vị thực tế đang sử dụng và giảm sai sót khi quy đổi | Cao |
| US-05 | Quản lý kho | Kiểm kê số lượng thực tế theo từng lô đối với sản phẩm có theo dõi lô | Xác định chính xác số lượng thừa, thiếu của từng lô | Cao |
| US-06 | Quản lý kho | Xem số tồn trên hệ thống và nhập số lượng thực tế cho từng sản phẩm | So sánh trực tiếp giữa số liệu trên hệ thống và số lượng thực tế khi kiểm kê | Cao |
| US-07 | Quản lý kho | Xóa sản phẩm khỏi phiếu kiểm kê khi phiếu đang được kiểm kê | Loại bỏ sản phẩm thêm nhầm hoặc không cần kiểm kê khỏi phiếu | Cao |
| US-08 | Quản lý kho | Chỉnh sửa thông tin phiếu kiểm kê khi phiếu ở trạng thái Chưa xử lý | Cho phép hoàn thiện hoặc điều chỉnh thông tin trước khi thực hiện cân bằng kho | Cao |
| US-09 | Quản lý kho | Xóa phiếu kiểm kê khi phiếu ở trạng thái Chưa xử lý | Cho phép loại bỏ các phiếu tạo nhầm hoặc không còn nhu cầu thực hiện | Cao |
| US-10 | Quản lý kho | Lưu phiếu kiểm kê ở trạng thái Chưa xử lý và mở lại để tiếp tục kiểm kê | Cho phép kiểm kê theo nhiều lượt/ca mà không mất dữ liệu đã nhập | Cao |
| US-11 | Quản lý kho | Xem số lượng chênh lệch và giá trị chênh lệch của từng sản phẩm và toàn bộ phiếu | Đánh giá mức độ thừa, thiếu và giá trị hàng hóa chênh lệch để đối soát | Cao |
| US-12 | Quản lý kho | Ghi nhận nguyên nhân chênh lệch cho từng sản phẩm | Giúp người đối soát/kế toán xác định nguyên nhân của hàng thừa, thiếu | Trung bình |
| US-13 | Quản lý kho | Cân bằng kho dựa trên kết quả kiểm kê | Điều chỉnh tồn kho theo số lượng thực tế và tạo chứng từ để truy vết thay đổi | Cao |
| US-14 | Quản lý kho | In biên bản kiểm kê theo mẫu được cấu hình | Có hồ sơ phục vụ ký duyệt, lưu trữ và đối soát | Trung bình |
| US-15 | Quản lý cửa hàng | Phân quyền người dùng theo các thao tác Xem, Tạo, Sửa, Xóa và Cân bằng kho | Kiểm soát người được phép thực hiện các thao tác trên phiếu và thao tác ảnh hưởng đến tồn kho | Cao |

### 2.4 Ngữ cảnh người dùng

Quản lý kho thao tác **trực tiếp tại kho**, thường vừa đi giữa các kệ vừa nhập số, dùng **điện thoại hoặc máy tính bảng** để quét mã vạch bằng camera; trường hợp kiểm tại quầy hoặc kho có bàn làm việc thì dùng **máy tính kèm máy quét mã vạch**. Sóng wifi trong kho có thể chập chờn, nên thao tác lưu tạm cần được thực hiện thường xuyên — hệ thống **không tự lưu tạm**.

Đợt kiểm thường kéo dài từ vài chục phút tới vài buổi, trong khi cửa hàng **vẫn bán hàng bình thường**. Kế toán và quản lý cửa hàng không đi kiểm mà chỉ mở phiếu đã hoàn thành trên máy tính để đọc số và in biên bản. Người dùng không có kỹ năng kỹ thuật, nên mọi cảnh báo phải nói bằng ngôn ngữ nghiệp vụ.

Số mã hàng mỗi đợt kiểm và thời gian mỗi đợt tùy từng khách hàng, không đặt mốc; màn nhập liệu thiết kế **không giới hạn số dòng**.

### 2.5 Mô tả thay đổi về CSDL

**Bảng mới `stocktaking` — phiếu kiểm kê (header):**

| Loại | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|-----|-------------|------------|-------|
| A | `id` | int | PK, identity | Khóa chính |
| A | `com_id` | int | NOT NULL | Công ty |
| A | `no` | nvarchar(50) | NOT NULL | Số phiếu kiểm kê, sinh tự động theo BR-kiemke-032 |
| A | `date` | datetime | NOT NULL | **Ngày kiểm kê** — mốc để chọn kỳ giá vốn |
| A | `warehouse_id` | int | NOT NULL, FK | Kho được kiểm, mỗi phiếu một kho |
| A | `status` | int | NOT NULL, default 1 | 1 = Chưa xử lý, 2 = Đã xử lý |
| A | `description` | nvarchar(500) | NULL | Lý do kiểm kê, ghi chú đầu phiếu |
| A | `total_diff_quantity` | decimal(18,4) | NULL | Tổng chênh lệch số lượng, chốt khi hoàn thành |
| A | `total_diff_amount` | decimal(18,4) | NULL | Tổng chênh lệch giá trị, chốt khi hoàn thành |
| A | `balance_time` | datetime | NULL | Thời điểm bấm cân bằng kho |
| A | `in_ward_id` | int | NULL, FK `rs_inoutward.id` | Chứng từ nhập N11 sinh ra từ phiếu |
| A | `out_ward_id` | int | NULL, FK `rs_inoutward.id` | Chứng từ xuất X12 sinh ra từ phiếu |
| A | `creator` / `updater` / `create_time` / `update_time` | int / int / datetime / datetime | | Chuẩn hệ thống; `creator` chính là người kiểm |

**Bảng mới `stocktaking_detail` — dòng kiểm:**

| Loại | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|-----|-------------|------------|-------|
| A | `id` | int | PK, identity | Khóa chính |
| A | `com_id` | int | NOT NULL | Công ty |
| A | `stocktaking_id` | int | NOT NULL, FK | Trỏ về `stocktaking.id` |
| A | `product_id` | int | NOT NULL | Sản phẩm |
| A | `product_code` / `product_name` | varchar(50) / nvarchar(255) | | Lưu bản chụp tên và mã tại thời điểm kiểm |
| A | `product_product_unit_id` | int | NOT NULL | Đơn vị tính được kiểm |
| A | `unit_id` / `unit_name` | int / nvarchar(50) | | Bản chụp đơn vị tính |
| A | `batch_id` | int | NULL | Lô; NULL với sản phẩm không theo dõi lô |
| A | `lot_no` | nvarchar(50) | NULL | Bản chụp số lô |
| A | `book_quantity` | decimal(18,4) | NOT NULL | **Tồn sổ sách**; khi Chưa xử lý là số nạp lại mỗi lần mở, khi Đã xử lý là số chốt lúc cân bằng |
| A | `actual_quantity` | decimal(18,4) | **NULL** | **Số đếm thực tế**; NULL nghĩa là **chưa kiểm** (khác với 0) |
| A | `diff_quantity` | decimal(18,4) | NULL | `actual_quantity - book_quantity` |
| A | `cogs` | decimal(18,4) | NULL | Giá vốn áp dụng, lấy theo BR-kiemke-008 |
| A | `book_amount` | decimal(18,4) | NULL | `book_quantity * cogs` |
| A | `actual_amount` | decimal(18,4) | NULL | `actual_quantity * cogs` |
| A | `diff_amount` | decimal(18,4) | NULL | `diff_quantity * cogs` |
| A | `diff_reason` | nvarchar(255) | NULL | Nguyên nhân, **không bắt buộc** |
| A | `position` | int | NULL | Thứ tự hiển thị trên phiếu |
| A | `creator` / `updater` / `create_time` / `update_time` | | | Chuẩn hệ thống |

**Danh mục `business_type` — thêm hai mã cho từng công ty:**

| Loại | Bảng | Giá trị | Mô tả |
|:---:|------|---------|-------|
| A | `business_type` | `business_type_code = 'N11'`, `business_type_name = 'Nhập hàng do kiểm kê'`, `type = 2` (nhập kho) | Chứng từ nhập sinh từ cân bằng kho |
| A | `business_type` | `business_type_code = 'X12'`, `business_type_name = 'Xuất hàng do kiểm kê'`, `type = 3` (xuất kho) | Chứng từ xuất sinh từ cân bằng kho |

**Bảng có sẵn — không đổi cấu trúc, chỉ dùng thêm:**

| Loại | Bảng | Cột | Mô tả cách dùng |
|:---:|------|-----|-----------------|
| M | `rs_inoutward` | `ref_id` | Ghi `stocktaking.id` của phiếu sinh ra chứng từ, để tra ngược từ sổ kho về phiếu kiểm kê |
| M | `rs_inoutward` | `business_type_id` | Trỏ tới bản ghi N11 hoặc X12 của công ty tương ứng |
| M | `rs_inoutward` | `type_desc` | Ghi "Kiểm kê kho" |
| — | `rs_inoutward_detail` | `batch_id`, `cost_amount`, `product_product_unit_id` | Đã có sẵn, dùng nguyên |
| — | `inventory` | `on_hand` | Cập nhật khi cân bằng |
| — | `batches_detail` | `on_hand` | Cập nhật khi cân bằng với sản phẩm theo lô |
| — | `cogs_history` | `from_date`, `to_date`, `warehouse_id`, `product_product_unit_id`, `cogs` | Nguồn giá vốn, tra theo kỳ chứa ngày kiểm kê |

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|-------|---------|-----------|-------|-----------|
| Quản lý kho | Danh sách phiếu kiểm kê | Xem, lọc, xóa phiếu nháp | Xem, tìm kiếm/lọc danh sách phiếu; xem chi tiết | Cao |
| Quản lý kho | Lập phiếu kiểm kê | Tạo phiếu kiểm kê | Chọn kho, đưa sản phẩm vào phiếu, nhập số đếm thực tế, lưu tạm, cân bằng | Cao |
| Quản lý kho | Danh sách phiếu kiểm kê | Chỉnh sửa phiếu kiểm kê | Chỉnh sửa thông tin và kết quả kiểm kê khi phiếu đang ở trạng thái Chưa xử lý | Cao |
| Quản lý kho | Danh sách phiếu kiểm kê | Xóa phiếu kiểm kê | Xóa phiếu kiểm kê khi phiếu đang ở trạng thái Chưa xử lý | Cao |
| Quản lý kho | Danh sách phiếu kiểm kê | In biên bản kiểm kê | In biên bản kiểm kê theo mẫu để ký và lưu trữ | Cao |
| Quản lý kho | Danh sách phiếu kiểm kê | Nhập Excel | Nhập dữ liệu kiểm kê từ file Excel — **chưa đặc tả, chờ chốt phạm vi (Open Question số 6)** | Chờ chốt |
| Quản lý kho | Danh sách phiếu kiểm kê | Xuất Excel | Kết xuất danh sách phiếu đang hiển thị theo bộ lọc ra file Excel | Trung bình |
| Quản lý cửa hàng | Phân quyền | Cấp quyền kiểm kê kho | Cấp quyền Xem, Tạo, Sửa, Xóa và Cân bằng kho | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Xem, lọc, xóa phiếu nháp

#### 3.1.1 Thông tin chung về chức năng

Màn hình cổng vào của phân hệ, đặt tại menu **Kho > Kiểm kê kho**, nằm dưới mục Giao dịch. Cho phép quản lý kho tra cứu toàn bộ phiếu kiểm kê đã lập, lọc theo kho, khoảng thời gian, người kiểm và trạng thái, và mở chi tiết một phiếu: phiếu Chưa xử lý mở sang chức năng Chỉnh sửa (3.3), phiếu Đã xử lý mở ở chế độ chỉ đọc ngay tại màn này. Màn hình cũng là nơi đặt các thao tác Xóa phiếu (chi tiết ở 3.4) và In biên bản (chi tiết ở 3.5). Áp dụng cho mọi tài khoản có quyền Xem chức năng kiểm kê kho.

#### 3.1.2 Màn hình chức năng

Màn hình gồm bốn khối: thanh tiêu đề kèm nhóm nút thao tác chung ở trên cùng, thanh tìm kiếm nhanh, lưới danh sách chiếm phần chính, và bảng Bộ lọc mở ra ở cạnh phải khi bấm biểu tượng phễu. Khối chi tiết của một phiếu Đã xử lý mở ngay trên màn này ở chế độ chỉ đọc.

**Khối 1 — Tiêu đề và nhóm nút thao tác chung**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | Kiểm kê kho | Label | — | — | Tiêu đề màn hình, góc trên bên trái |
| 2 | + Kiểm kê kho | Button (chính) | — | — | Mở màn Lập phiếu kiểm kê (3.2). Chỉ hiện khi tài khoản có quyền Tạo |
| 3 | + Nhập Excel | Button | — | — | Nhập dữ liệu kiểm kê từ file Excel. Chỉ hiện khi có quyền Tạo. **Chi tiết xử lý chờ chốt phạm vi — xem Open Question số 6** |
| 4 | + Xuất Excel | Button | — | — | Kết xuất danh sách phiếu đang hiển thị theo bộ lọc ra file Excel |

**Khối 2 — Thanh tìm kiếm nhanh**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 5 | Từ ngày – Đến ngày | Datepicker khoảng | Trống | Không | Lọc theo `stocktaking.date`. Từ ngày phải nhỏ hơn hoặc bằng Đến ngày (BR-kiemke-001) |
| 6 | Nhập mã kiểm kho | Textbox | Trống | Không | Tìm theo `stocktaking.no`, khớp một phần chuỗi, không phân biệt hoa thường |
| 7 | Tìm kiếm | Button | — | — | Áp hai điều kiện của khối này lên lưới, trả về trang 1 |
| 8 | Biểu tượng phễu | Icon button | — | — | Đóng mở bảng Bộ lọc ở cạnh phải |

**Khối 3 — Lưới danh sách**

| # | Tên cột | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 9 | STT | Label | — | — | Số thứ tự dòng trong trang hiện tại, đánh lại từ 1 mỗi trang |
| 10 | Mã kiểm kho | Label | — | — | `stocktaking.no`, sinh tự động (BR-kiemke-032) |
| 11 | Thời gian | Label | — | — | `stocktaking.date`, định dạng dd/MM/yyyy |
| 12 | Kho hàng | Label | — | — | Tên kho được kiểm |
| 13 | Người kiểm | Label | — | — | Tên nhân viên tạo phiếu, lấy theo `stocktaking.creator` (BR-kiemke-027) |
| 14 | Ghi chú | Label | — | — | `stocktaking.description`, cắt bớt kèm dấu ba chấm nếu quá dài |
| 15 | Trạng thái | Badge | — | — | **Chưa xử lý** nền cam, **Đã xử lý** nền xanh lá |
| 16 | Thao tác — Sửa hoặc Xem | Icon button | — | — | Phiếu **Chưa xử lý**: mở chức năng Chỉnh sửa (3.3), cần quyền Sửa. Phiếu **Đã xử lý**: mở khối chi tiết chỉ đọc, cần quyền Xem |
| 17 | Thao tác — Xóa | Icon button | — | — | **Chỉ hiện với phiếu Chưa xử lý** và tài khoản có quyền Xóa; xử lý ở 3.4 |

**Khối 4 — Bảng Bộ lọc**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 18 | Bộ lọc | Panel | Đóng | — | Mở ra cạnh phải và đẩy hẹp lưới; có nút X để đóng |
| 19 | Kho hàng | Dropdown | Chọn… | Không | Danh sách kho của công ty |
| 20 | Trạng thái | Dropdown | Chọn… | Không | Chưa xử lý / Đã xử lý |
| 21 | Người kiểm | Dropdown | Chọn… | Không | Danh sách nhân viên đã từng lập phiếu |
| 22 | Bỏ lọc | Button (viền) | — | — | Xóa toàn bộ lựa chọn trong bảng, tải lại lưới |
| 23 | Lọc | Button (chính) | — | — | Áp điều kiện của bảng, cộng dồn với khối tìm kiếm nhanh, trả về trang 1 |

**Khối 5 — Phân trang**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 24 | Số bản ghi mỗi trang | Dropdown | **50 bản ghi** | — | Góc dưới bên trái |
| 25 | Phân trang | Pagination | Trang 1 | — | Sắp xếp mặc định theo `date` giảm dần, cùng ngày thì `id` giảm dần |

**Khối 6 — Popup Chi tiết mã chứng từ**

Mở khi bấm biểu tượng xem chi tiết trên dòng phiếu **Đã xử lý** ở lưới danh sách. Popup phủ giữa màn hình trên nền mờ, chỉ hiển thị lưới dòng kiểm ở chế độ chỉ đọc, không có ô nhập nào.

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 26 | Chi tiết mã chứng từ: {mã kiểm kho} | Label | — | — | Tiêu đề popup trên nền xanh, ghép chuỗi cố định với `stocktaking.no` |
| 27 | Nút X | Icon button | — | — | Đóng popup, quay lại lưới danh sách giữ nguyên bộ lọc và trang đang xem |
| 28 | STT | Label | — | — | Số thứ tự dòng trong popup, đánh từ 1 |
| 29 | Tên sản phẩm | Label | — | — | `product_name`. Dòng có lô thì xuống dòng thứ hai hiển thị **{mã lô} - {ngày}** cỡ chữ nhỏ hơn, ví dụ `LH1001 - 19/12/2026` |
| 30 | ĐVT | Label | — | — | `unit_name` — đơn vị tính đã dùng để kiểm |
| 31 | Tồn chi nhánh | Label (số) | — | — | `book_quantity` — **tồn của kho được kiểm**, do hệ thống nạp tại thời điểm kiểm kê và đã chốt lúc cân bằng. Căn phải |
| 32 | Tồn thực tế | Label (số) | — | — | `actual_quantity` người dùng đã đếm, căn phải |
| 33 | SL chênh lệch | Label (số) | — | — | `diff_quantity`, mang dấu âm khi thiếu, căn phải |
| 34 | Giá trị chênh lệch | Label (số) | — | — | `diff_amount`, **cùng dấu với SL chênh lệch** (BR-kiemke-031), căn phải, định dạng số có phân tách nghìn |
| 35 | Nguyên nhân | Label | — | — | `diff_reason` do người dùng nhập lúc kiểm; để trống nếu không ghi |
| 36 | Xử lý | Label | — | — | Nhãn suy ra từ dấu chênh lệch: **Nhập kho** khi tăng, **Xuất kho** khi giảm (BR-kiemke-030) |
| 37 | Dòng tổng | Label | — | — | `total_diff_quantity` và `total_diff_amount` ở cuối lưới — *đề xuất bổ sung, chưa có trên bản thiết kế* |
| 38 | Liên kết chứng từ nhập/xuất | Link | — | — | Mở chứng từ N11 hoặc X12 theo `in_ward_id` và `out_ward_id` — *đề xuất bổ sung, chưa có trên bản thiết kế* |
| 39 | Nút In biên bản | Button | — | — | Đặt ở chân popup; xử lý ở 3.5 — *vị trí đề xuất, chưa có trên bản thiết kế* |

**Quy tắc hiển thị:** dòng chưa kiểm đã bị loại khỏi phiếu lúc cân bằng nên không xuất hiện trong popup. Popup cuộn dọc khi phiếu nhiều dòng, hàng tiêu đề cột dính trên.

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Tra cứu danh sách phiếu kiểm kê đã lập; xem chi tiết và thực hiện các thao tác trên phiếu theo quyền được cấp |
| **Tác nhân** | Quản lý kho, Quản lý cửa hàng |
| **Điều kiện kích hoạt** | Người dùng chọn menu Kho > Kiểm kê kho |
| **Điều kiện tiên quyết** | Đã đăng nhập và tài khoản có quyền Xem chức năng kiểm kê kho |
| **Điều kiện sau khi thực hiện** | Hiển thị danh sách phiếu kiểm kê theo bộ lọc |

**Luồng chính:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Chọn menu Kho > Kiểm kê kho | Kiểm tra quyền Xem. Nếu hợp lệ, hệ thống hiển thị danh sách phiếu kiểm kê thuộc công ty của người dùng. Mặc định lọc theo khoảng thời gian từ đầu tháng hiện tại đến ngày hiện tại; danh sách sắp xếp theo Thời gian giảm dần (BR-kiemke-003) |
| 2 | Nhập mã kiểm kho hoặc thay đổi các điều kiện Kho hàng, Khoảng thời gian, Trạng thái và thực hiện tìm kiếm hoặc lọc | Kiểm tra điều kiện của các bộ lọc (BR-kiemke-001). Nếu hợp lệ, hệ thống tải lại danh sách theo điều kiện đã chọn |
| 3 | Click vào một phiếu | Hệ thống mở chi tiết phiếu ở chế độ chỉ đọc, hiển thị đầy đủ thông tin phiếu và kết quả kiểm kê đã được chốt, bao gồm số tồn hệ thống, số thực tế, số lượng chênh lệch, giá trị chênh lệch, nguyên nhân và thông tin xử lý |
| 4 | Bấm Thêm phiếu | Hệ thống kiểm tra quyền Tạo. Nếu có quyền, mở màn hình Lập phiếu kiểm kê ở chế độ tạo mới (3.2) |
| 5 | Bấm Xóa trên phiếu Chưa xử lý | Kiểm tra quyền Xóa; nếu hợp lệ thì thực hiện chức năng Xóa phiếu kiểm kê (3.4) |
| 6 | Bấm In biên bản trên phiếu Đã xử lý | Kiểm tra quyền In biên bản; nếu hợp lệ thì thực hiện chức năng In biên bản kiểm kê (3.5) |
| 7 | Bấm Xuất Excel | Kiểm tra quyền Xuất Excel; nếu hợp lệ thì kết xuất danh sách phiếu đang hiển thị theo bộ lọc ra file Excel |

**Luồng rẽ nhánh:**

| Bước | Điều kiện | Phản hồi hệ thống |
|------|-----------|-------------------|
| 1a, 2a | Không có phiếu nào khớp bộ lọc | Lưới hiển thị dòng trống với text "Không có dữ liệu"; các nút thao tác chung vẫn hoạt động bình thường |
| 2b | Người dùng nhấn Bỏ lọc | Tại bảng Bộ lọc bên phải, hệ thống xóa các điều kiện lọc đang chọn và tải lại danh sách theo bộ lọc mặc định |

**Trường hợp lỗi / ngoại lệ:**

| Bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|------|-----------|-------------------|-------------------|
| 1b | Không có quyền Xem | "Bạn không có quyền xem danh sách kiểm kê kho." | Không hiển thị danh sách; điều hướng người dùng ra khỏi màn hình |
| 4a | Không có quyền Tạo | "Bạn không có quyền tạo phiếu kiểm kê kho." | Không tạo phiếu; giữ người dùng tại màn hình danh sách |
| 5a | Không có quyền Xóa | "Bạn không có quyền xóa phiếu kiểm kê kho." | Không xóa phiếu; giữ người dùng tại màn hình danh sách |
| 6a | Không có quyền In biên bản | "Bạn không có quyền in biên bản kiểm kê kho." | Không thực hiện in hoặc kết xuất biên bản |
| 7a | Không có quyền Xuất Excel | "Bạn không có quyền xuất Excel." | Không thực hiện xuất Excel |
| 7b | Không thể kết xuất Excel | "Không thể xuất dữ liệu. Vui lòng thử lại." | Hủy tiến trình kết xuất, ghi log lỗi, giữ người dùng tại màn hình danh sách |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-001 | Khoảng lọc trên màn danh sách yêu cầu Từ ngày nhỏ hơn hoặc bằng Đến ngày. Nếu vi phạm, **chặn ngay trên giao diện**, không cho chọn Đến ngày nhỏ hơn Từ ngày |
| BR-kiemke-002 | Các thao tác **Xem, Tạo, Sửa, Xóa, Cân bằng kho, In biên bản và Xuất Excel** phải được **Backend kiểm tra quyền tại thời điểm gọi API**. Việc Frontend ẩn hoặc vô hiệu hóa nút **không được coi là cơ chế bảo mật** |
| BR-kiemke-003 | Danh sách mặc định sắp xếp theo Thời gian giảm dần; cùng ngày thì sắp xếp theo `id` giảm dần |

---

### 3.2 Tạo phiếu kiểm kê

#### 3.2.1 Thông tin chung về chức năng

Màn hình chính của nghiệp vụ. Cho phép quản lý kho tạo một phiếu kiểm kê mới: chọn kho, đưa hàng vào phiếu theo hai cách, nhập số đếm thực tế cho từng dòng và theo dõi chênh lệch số lượng cùng chênh lệch giá trị theo thời gian thực; sau đó **Lưu tạm** để đếm tiếp lần sau, hoặc **Cân bằng kho** để chốt phiếu ngay.

Chức năng gồm hai nhóm luồng có mục tiêu và điều kiện khác nhau, mô tả riêng ở 3.2.3: **luồng lập phiếu và lưu tạm** (chưa đụng tới tồn kho) và **luồng cân bằng kho** (thay đổi tồn thật, không hoàn tác). Việc mở lại một phiếu Chưa xử lý đã lưu để đếm tiếp thuộc chức năng Chỉnh sửa phiếu kiểm kê (3.3).

#### 3.2.2 Màn hình chức năng

**Popup Chọn kho hàng** — mở ngay khi bấm Thêm phiếu, trước khi vào màn lập phiếu:

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | Chọn kho hàng | Label | — | — | Tiêu đề popup trên nền xanh, kèm nút X đóng |
| 2 | Kho hàng | Dropdown | Chọn kho hàng | **Có** | Danh sách kho của công ty, có dấu sao đỏ đánh dấu bắt buộc |
| 3 | Thoát | Button (viền) | — | — | Đóng popup, quay lại màn Danh sách, không tạo phiếu |
| 4 | Kiểm kê kho | Button (chính) | — | — | Xác nhận kho và mở màn Lập phiếu kiểm kê. Chưa chọn kho thì chặn (E-kiemke-006) |

**Đầu phiếu:**

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 5 | Kho hàng | Dropdown (khóa) | Kho đã chọn ở popup | — | Hiển thị lại kho đã chọn, **không đổi được** trong suốt phiếu (BR-kiemke-004) |
| 6 | Ngày kiểm kê | Datepicker | Hôm nay | Có | Mốc chọn kỳ giá vốn (BR-kiemke-008); đổi ngày thì nạp lại giá vốn toàn phiếu |

**Thanh lọc và tìm kiếm:**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 7 | Tab lọc dòng | Tab | Tất cả | — | Năm tab kèm số đếm trong ngoặc: **Tất cả**, **Chưa kiểm** (`actual_quantity` NULL), **Đã kiểm** (đã nhập số), **Khớp** (`diff_quantity` = 0), **Lệch** (`diff_quantity` khác 0). Số đếm cập nhật ngay khi nhập liệu (BR-kiemke-034) |
| 8 | Tìm kiếm hàng hóa | Autocomplete | Trống | Không | Tìm theo mã hoặc tên sản phẩm trong kho đã chọn; gợi ý xổ xuống dạng bảng bốn cột **STT, Mã hàng, Tên sản phẩm, ĐVT**. Góc phải ô có biểu tượng quét mã vạch |
| 9 | Kiểm kê tất cả sản phẩm trong kho | Checkbox | Bỏ tick | Không | Tick thì nạp toàn bộ sản phẩm còn hiệu lực của kho, **chỉ theo đơn vị tính chính** (BR-kiemke-005) |

**Lưới dòng kiểm:**

| # | Tên cột | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 10 | STT | Label | — | — | Số thứ tự dòng trong phiếu |
| 11 | Tên sản phẩm | Dropdown | Sản phẩm đã chọn | Có | **Đổi được ngay trên dòng**; đổi sản phẩm thì xóa trắng số thực tế và nguyên nhân (BR-kiemke-035). Dòng có theo dõi lô hiển thị bên dưới: link **Chọn lô** khi chưa chọn, hoặc chip **{mã lô} - {ngày} ✕** khi đã chọn |
| 12 | ĐVT | Dropdown | Đơn vị tính chính | Có | Đổi được với sản phẩm nhiều đơn vị tính; đổi thì nạp lại Tồn chi nhánh theo đơn vị mới |
| 13 | Tồn chi nhánh | Label (số) | Nạp tự động | — | `book_quantity` của kho được kiểm, người dùng **không sửa được** (BR-kiemke-007) |
| 14 | Tồn thực tế | Textbox số | **Trống** | Không | `actual_quantity`; trống nghĩa là **chưa kiểm** (BR-kiemke-009); không nhận số âm (BR-kiemke-010) |
| 15 | SL chênh lệch | Label (số) | Tính tự động | — | `actual_quantity - book_quantity`; để trống khi dòng chưa kiểm |
| 16 | Giá trị chênh lệch | Label (số) | Tính tự động | — | `diff_quantity * cogs`, cùng dấu với SL chênh lệch (BR-kiemke-031) |
| 17 | Nguyên nhân | Textbox | Trống, placeholder "Nhập nguyên nhân ...." | Không | `diff_reason`, tối đa 255 ký tự (BR-kiemke-013) |
| 18 | Xử lý | Label | — | — | **Nhập kho** khi tăng, **Xuất kho** khi giảm, **"-"** khi dòng chưa kiểm (BR-kiemke-030) |
| 19 | Biểu tượng Xóa dòng | Icon button | — | — | Bỏ sản phẩm khỏi phiếu (US-07) |
| 20 | Biểu tượng Nhân đôi dòng | Icon button | — | — | Sao chép dòng sản phẩm đó xuống thành một dòng mới ngay bên dưới (BR-kiemke-036) |

> Lưới **không hiển thị** các cột Giá vốn, Giá trị sổ sách và Giá trị thực tế. Ba giá trị này vẫn được tính và lưu vào `stocktaking_detail` để phục vụ popup chi tiết và biên bản kiểm kê.

**Chân phiếu:**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 21 | Ghi chú | Textbox | Trống | Không | `description` của phiếu, kèm biểu tượng đính kèm ở đầu ô, tối đa 500 ký tự |
| 22 | Thoát | Button (viền) | — | — | Rời màn hình; còn dữ liệu chưa lưu thì hỏi xác nhận |
| 23 | Lưu tạm | Button (viền) | — | — | Ghi phiếu ở `status` = 1 (Chưa xử lý) |
| 24 | Cân bằng kho | Button (chính) | — | — | Chỉ hiện khi tài khoản có quyền Cân bằng kho (BR-kiemke-011) |

**Hai popup của luồng cân bằng:**

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 25 | Popup cảnh báo dòng chưa kiểm | Dialog | Ẩn | — | Chỉ hiện khi tab Chưa kiểm còn lớn hơn 0. Nội dung: "Trong phiếu kiểm kho có {N} sản phẩm chưa kiểm. Bạn có muốn loại bỏ các sản phẩm chưa kiểm khỏi phiếu để cân bằng hay tiếp tục kiểm?" Hai nút: **Loại bỏ và cân bằng**, **Tiếp tục kiểm** |
| 26 | Popup **Xử lý kiểm kê kho** | Dialog | Ẩn | — | Nội dung: "Lưu ý: Khi cân bằng kho, phần mềm sẽ tự động tạo phiếu nhập/xuất kho để điều chỉnh số lượng hàng hóa theo kết quả kiểm kê.<br>Bạn có chắc chắn muốn cân bằng kho?" Hai nút: **Thoát**, **Đồng ý** |

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Ghi nhận số đếm thực tế của từng mã và từng lô trong một kho, đối chiếu với tồn chi nhánh, quy đổi chênh lệch ra giá trị, rồi cân bằng kho theo kết quả kiểm kê và để lại chứng từ có truy vết |
| **Tác nhân** | Quản lý kho. Riêng thao tác cân bằng kho yêu cầu **quyền Cân bằng kho** |
| **Điều kiện kích hoạt** | Bấm Thêm phiếu ở màn Danh sách |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền Tạo; công ty có ít nhất một kho. Để cân bằng kho còn cần: có quyền Cân bằng kho, phiếu ở trạng thái Chưa xử lý, có ít nhất một dòng đã nhập `actual_quantity`, kho của phiếu còn hoạt động |
| **Điều kiện sau khi thực hiện** | Dừng ở bước Lưu tạm: bản ghi `stocktaking` với `status` = 1 và các dòng `stocktaking_detail` được ghi, tồn kho **chưa thay đổi**. Đi hết luồng: `inventory.on_hand` và `batches_detail.on_hand` của các dòng đã kiểm bằng đúng `actual_quantity`; tối đa hai bản ghi `rs_inoutward` (N11 và X12) kèm detail được tạo với `ref_id` trỏ về `stocktaking.id`; `stocktaking.status` = 2, `balance_time`, `total_diff_quantity`, `total_diff_amount`, `in_ward_id`, `out_ward_id` được ghi; toàn bộ `stocktaking_detail` giữ số liệu cố định |

**Các bước xử lý:**


| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Bấm Thêm phiếu ở màn Danh sách | Kiểm tra quyền Tạo (BR-kiemke-011). Mở **popup Chọn kho hàng** với dropdown danh sách kho của công ty |
| 2 | Chọn kho và bấm **Kiểm kê kho** | Kiểm tra đã chọn kho. Đóng popup và mở màn Lập phiếu: Kho hàng hiển thị kho vừa chọn ở dạng khóa, Ngày kiểm kê mặc định là hôm nay, lưới rỗng, các tab đều đếm 0 |
| 3 | Chọn Ngày kiểm kê | Nạp lại `cogs` cho toàn bộ dòng đang có theo kỳ chứa ngày mới (BR-kiemke-008), tính lại Giá trị chênh lệch và số đếm các tab |
| 4 | Tick **Kiểm kê tất cả sản phẩm trong kho** | Đọc `inventory` lọc `com_id`, `warehouse_id` = kho đã chọn, `is_primary` = 1, sản phẩm còn hiệu lực. Sản phẩm có theo dõi lô thì join `batches_detail` theo `inventory_id` để tách một dòng cho mỗi lô. Nạp `book_quantity` = `on_hand`, `cogs` theo BR-kiemke-008, `actual_quantity` = NULL. Đổ toàn bộ vào lưới (BR-kiemke-005) |
| 5 | Hoặc gõ vào ô Tìm kiếm hàng hóa rồi chọn từ danh sách gợi ý | Gợi ý xổ xuống dạng bảng STT, Mã hàng, Tên sản phẩm, ĐVT. Chọn xong thêm một dòng vào lưới với `book_quantity` và `cogs` nạp như bước 4 |
| 6 | Hoặc quét mã vạch tại ô tìm kiếm | Tra sản phẩm theo mã vạch trong phạm vi kho đã chọn. Mã chưa có trong lưới thì thêm dòng mới và đặt `actual_quantity` = 1; mã đã có thì cộng thêm 1 vào `actual_quantity` của dòng đó (BR-kiemke-006). Cuộn lưới tới dòng vừa tác động |
| 7 | Chọn lô cho dòng có theo dõi lô | Bấm link **Chọn lô** dưới tên sản phẩm, chọn lô trong danh sách lô của mã đó tại kho. Sau khi chọn, dòng hiển thị chip **{mã lô} - {ngày}** và nạp `book_quantity` theo `batches_detail.on_hand` của lô |
| 8 | Nhập số đếm vào cột Tồn thực tế | Kiểm tra giá trị không âm (BR-kiemke-010). Tính SL chênh lệch, Giá trị chênh lệch, cập nhật nhãn cột Xử lý và số đếm trên các tab ngay trên màn hình, chưa ghi xuống CSDL |
| 9 | Nhập Nguyên nhân nếu cần | Ghi vào bộ nhớ màn hình, không bắt buộc (BR-kiemke-013) |
| 10 | Nhập Ghi chú ở chân phiếu nếu cần | Ghi vào bộ nhớ màn hình, tối đa 500 ký tự |
| 11 | Bấm **Lưu tạm** | Kiểm tra phiếu có ít nhất một dòng (E-kiemke-005). Sinh `no` theo BR-kiemke-032, insert `stocktaking` với `status` = 1, `date`, `warehouse_id`, `description`, `creator`; insert toàn bộ dòng vào `stocktaking_detail`. Hiển thị "Đã lưu phiếu kiểm kê {số phiếu}." và giữ nguyên màn hình |


| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 12 | Bấm **Cân bằng kho** | Kiểm tra **quyền Cân bằng kho** (BR-kiemke-025), kiểm tra phiếu còn ở `status` = 1 (BR-kiemke-015), kiểm tra có ít nhất một dòng đã kiểm. Nếu phiếu chưa từng lưu thì lưu tạm trước để có `stocktaking.id`. Đếm số dòng có `actual_quantity` = NULL |
| 13 | (Hệ thống tự động) | Nếu số dòng chưa kiểm lớn hơn 0 thì hiện popup cảnh báo dòng chưa kiểm (xem A14, A15). Nếu bằng 0 thì đi thẳng bước 14 |
| 14 | (Hệ thống tự động) | Hiện popup **Xử lý kiểm kê kho** |
| 15 | Bấm **Đồng ý** | Mở giao dịch dữ liệu. **Nạp tồn lần cuối**: đọc lại `inventory.on_hand` (và `batches_detail.on_hand` với dòng có `batch_id`) tại thời điểm này, ghi đè vào `book_quantity` của từng dòng đã kiểm (BR-kiemke-016) |
| 16 | (Hệ thống tự động) | Tính lại cho từng dòng đã kiểm: `diff_quantity` = `actual_quantity` − `book_quantity`; `cogs` theo BR-kiemke-008; `book_amount`, `actual_amount`, `diff_amount`. Cộng `total_diff_quantity` và `total_diff_amount` cho header |
| 17 | (Hệ thống tự động) | **Cập nhật tồn**: với dòng không có `batch_id`, đặt `inventory.on_hand` = `actual_quantity`. Với dòng có `batch_id`, đặt `batches_detail.on_hand` = `actual_quantity` rồi tính lại `inventory.on_hand` của mã đó bằng tổng `batches_detail.on_hand` cùng `inventory_id` (BR-kiemke-017) |
| 18 | (Hệ thống tự động) | **Sinh chứng từ nhập**: nếu có ít nhất một dòng `diff_quantity` > 0 thì insert một `rs_inoutward` với `business_type_id` = mã N11 của công ty, `type_desc` = "Kiểm kê kho", `date` = `stocktaking.date`, `ref_id` = `stocktaking.id`, `no` sinh theo quy tắc đánh số chứng từ kho hiện hành; insert `rs_inoutward_detail` mỗi dòng thừa một bản ghi với `quantity` = `diff_quantity`, `batch_id`, `unit_price` = `cogs`, `cost_amount` = `diff_amount`, `to_warehouse_id` = kho của phiếu (BR-kiemke-018) |
| 19 | (Hệ thống tự động) | **Sinh chứng từ xuất**: nếu có ít nhất một dòng `diff_quantity` < 0 thì insert một `rs_inoutward` với `business_type_id` = mã X12, các trường tương tự bước 18, `from_warehouse_id` = kho của phiếu; detail ghi `quantity` = trị tuyệt đối của `diff_quantity` (BR-kiemke-018) |
| 20 | (Hệ thống tự động) | Cập nhật `stocktaking`: `status` = 2, `balance_time` = thời điểm hiện tại, `total_diff_quantity`, `total_diff_amount`, `in_ward_id`, `out_ward_id`. Ghi toàn bộ `stocktaking_detail` với số liệu vừa tính — từ đây phiếu **không đọc số sống nữa** (BR-kiemke-019). Đóng giao dịch |
| 21 | (Hệ thống tự động) | Hiện thông báo "Đã cân bằng kho theo phiếu {số phiếu}. Chênh lệch {tổng SL} đơn vị, tương đương {tổng giá trị}." và chuyển về màn Danh sách, mở khối chi tiết của phiếu vừa hoàn thành |

```sql
-- Bước 4: nạp tồn lần cuối cho các dòng đã kiểm của phiếu @stocktaking_id
SELECT  d.id                AS detail_id,
        d.batch_id,
        CASE WHEN d.batch_id IS NULL THEN i.on_hand ELSE bd.on_hand END AS book_quantity_now
FROM    stocktaking_detail d
        JOIN stocktaking s        ON s.id = d.stocktaking_id
        JOIN inventory   i        ON i.com_id  = d.com_id
                                 AND i.warehouse_id = s.warehouse_id
                                 AND i.product_product_unit_id = d.product_product_unit_id
        LEFT JOIN batches_detail bd ON bd.inventory_id = i.id
                                 AND bd.batch_id      = d.batch_id
WHERE   d.stocktaking_id = @stocktaking_id
  AND   d.actual_quantity IS NOT NULL;
```

```sql
-- Bước 5: lấy giá vốn theo kỳ chứa ngày kiểm kê, không có thì lùi về kỳ gần nhất (BR-kiemke-008)
SELECT TOP 1 c.cogs
FROM   cogs_history c
WHERE  c.com_id                  = @com_id
  AND  c.warehouse_id            = @warehouse_id
  AND  c.product_product_unit_id = @ppu_id
  AND  c.from_date              <= @stocktaking_date
ORDER BY c.from_date DESC;
```


```sql
-- Bước 15: nạp tồn lần cuối cho các dòng đã kiểm của phiếu @stocktaking_id
SELECT  d.id                AS detail_id,
        d.batch_id,
        CASE WHEN d.batch_id IS NULL THEN i.on_hand ELSE bd.on_hand END AS book_quantity_now
FROM    stocktaking_detail d
        JOIN stocktaking s        ON s.id = d.stocktaking_id
        JOIN inventory   i        ON i.com_id  = d.com_id
                                 AND i.warehouse_id = s.warehouse_id
                                 AND i.product_product_unit_id = d.product_product_unit_id
        LEFT JOIN batches_detail bd ON bd.inventory_id = i.id
                                 AND bd.batch_id      = d.batch_id
WHERE   d.stocktaking_id = @stocktaking_id
  AND   d.actual_quantity IS NOT NULL;
```

```sql
-- Bước 16: lấy giá vốn theo kỳ chứa ngày kiểm kê, không có thì lùi về kỳ gần nhất (BR-kiemke-008)
SELECT TOP 1 c.cogs
FROM   cogs_history c
WHERE  c.com_id                  = @com_id
  AND  c.warehouse_id            = @warehouse_id
  AND  c.product_product_unit_id = @ppu_id
  AND  c.from_date              <= @stocktaking_date
ORDER BY c.from_date DESC;
```

**Luồng rẽ nhánh:**


| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| A1 | 1 | Người dùng bấm **Thoát** ở popup Chọn kho hàng | Đóng popup, quay lại màn Danh sách, không tạo phiếu |
| A2 | 4 | Bỏ tick **Kiểm kê tất cả sản phẩm trong kho** sau khi đã nạp | Hiện xác nhận "Bỏ chọn tất cả sẽ xóa các dòng chưa nhập số thực tế khỏi phiếu. Tiếp tục?". Xác nhận thì giữ lại các dòng đã có `actual_quantity`, xóa các dòng còn trống |
| A3 | 4, 5, 7 | Sản phẩm có theo dõi lô | Tick kiểm kê tất cả thì mỗi lô một dòng riêng; thêm bằng tay thì dòng hiện link Chọn lô để người dùng tự chọn. `book_quantity` lấy từ `batches_detail.on_hand` của lô |
| A4 | 5, 12 | Sản phẩm nhiều đơn vị tính | Cột ĐVT là dropdown, đổi được ngay trên dòng; đổi đơn vị thì nạp lại Tồn chi nhánh theo `product_product_unit_id` mới. Khi tick kiểm kê tất cả thì chỉ nạp đơn vị tính chính (BR-kiemke-005) |
| A5 | 8 | Người dùng để trống ô Tồn thực tế | Dòng giữ `actual_quantity` = NULL, cột SL chênh lệch để trống, cột Xử lý hiển thị "-", dòng nằm ở tab Chưa kiểm và bị bỏ qua khi cân bằng (BR-kiemke-009) |
| A6 | 8 | Nhập Tồn thực tế bằng 0 | Coi là **đã kiểm và đếm được 0**; SL chênh lệch bằng 0 trừ Tồn chi nhánh, dòng vẫn được cân bằng (BR-kiemke-009) |
| A7 | 6 | Quét trúng mã đã có trong lưới | Cộng dồn 1 vào `actual_quantity` thay vì thêm dòng trùng (BR-kiemke-006) |
| A8 | Sau bước 4 | Chuyển giữa các tab Tất cả, Chưa kiểm, Đã kiểm, Khớp, Lệch | Lưới chỉ hiện các dòng thuộc tab đang chọn; dòng bị ẩn vẫn nằm trong phiếu và vẫn được lưu (BR-kiemke-034) |
| A9 | Sau bước 5 | Đổi sản phẩm bằng dropdown trên dòng đã nhập liệu | **Xóa trắng** Tồn thực tế và Nguyên nhân của dòng, nạp lại Tồn chi nhánh và giá vốn theo sản phẩm mới (BR-kiemke-035) |
| A10 | Sau bước 5 | Bấm biểu tượng **Nhân đôi dòng** | Chèn một dòng mới ngay dưới dòng đang chọn, giữ nguyên sản phẩm và đơn vị tính, để trống lô, Tồn thực tế và Nguyên nhân (BR-kiemke-036) |
| A11 | Sau bước 5 | Bấm biểu tượng **Xóa dòng** | Bỏ dòng khỏi lưới, cập nhật lại số đếm trên các tab |
| A12 | Sau bước 7 | Bấm dấu **✕** trên chip lô | Bỏ lô đã chọn, dòng quay về trạng thái chưa chọn lô, Tồn chi nhánh về trống |
| A13 | Trước bước 11 | Bấm **Thoát** khi còn dữ liệu chưa lưu | Hiện xác nhận "Dữ liệu chưa lưu sẽ bị mất. Bạn có chắc chắn muốn thoát?"; xác nhận thì bỏ toàn bộ dữ liệu đang nhập và quay lại màn Danh sách |


| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| A14 | 13 | Còn dòng chưa kiểm, người dùng chọn **Loại bỏ và cân bằng** | Xóa các dòng có `actual_quantity` = NULL khỏi phiếu, rồi đi tiếp bước 14. Các dòng bị loại **không** ảnh hưởng tới tồn kho |
| A15 | 13 | Còn dòng chưa kiểm, người dùng chọn **Tiếp tục kiểm** | Đóng hộp thoại, quay lại lưới nhập liệu, giữ nguyên mọi dữ liệu đang có, không thay đổi tồn |
| A16 | 14 | Người dùng bấm **Thoát** ở popup Xử lý kiểm kê kho | Đóng hộp thoại, quay lại lưới nhập liệu, phiếu vẫn ở trạng thái Chưa xử lý |
| A17 | 16 | Sau khi nạp tồn lần cuối, **không còn dòng nào lệch** | Không sinh chứng từ nào; vẫn cập nhật `stocktaking` sang Đã xử lý với `total_diff_quantity` = 0, `in_ward_id` và `out_ward_id` để NULL. Thông báo "Đã cân bằng kho theo phiếu {số phiếu}. Không có chênh lệch." |
| A18 | 18, 19 | Chỉ có dòng thừa, không có dòng thiếu | Chỉ sinh chứng từ N11; `out_ward_id` để NULL |
| A19 | 18, 19 | Chỉ có dòng thiếu, không có dòng thừa | Chỉ sinh chứng từ X12; `in_ward_id` để NULL |
| A20 | 18, 19 | Phiếu có cả dòng theo lô lẫn dòng không theo lô | Vẫn gom vào cùng hai chứng từ; detail của dòng theo lô mang `batch_id`, dòng không theo lô để `batch_id` NULL |
| A21 | 17 | Một mã có nhiều lô nhưng chỉ vài lô được đưa vào phiếu | Chỉ cân bằng các lô có trong phiếu; `inventory.on_hand` của mã đó được tính lại bằng tổng toàn bộ `batches_detail.on_hand`, nên các lô ngoài phiếu giữ nguyên số của chúng |


**Luồng ngoại lệ:**


| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 2 | Bấm **Kiểm kê kho** khi chưa chọn kho | "Vui lòng chọn kho cần kiểm kê." (E-kiemke-006) | Không đóng popup, đánh dấu đỏ ô Kho hàng |
| E2 | 8 | Nhập số âm vào ô Tồn thực tế | "Số thực tế không được nhỏ hơn 0." (E-kiemke-004) | Không nhận giá trị, giữ lại giá trị trước đó, focus vào ô vừa nhập |
| E3 | 11 | Bấm Lưu tạm khi phiếu chưa có dòng nào | "Phiếu kiểm kê phải có ít nhất một sản phẩm." (E-kiemke-005) | Không ghi CSDL |
| E4 | Trước bước 11 | Mất kết nối hoặc đóng trình duyệt khi **chưa bấm Lưu tạm** | Không có thông báo | Số đã nhập **mất hoàn toàn**, hệ thống không tự lưu tạm (BR-kiemke-014); người dùng phải nhập lại |
| E5 | 6 | Quét mã vạch không tìm thấy sản phẩm trong kho đã chọn | "Không tìm thấy sản phẩm có mã vạch {mã} trong kho {tên kho}." (E-kiemke-007) | Không thêm dòng, xóa nội dung ô quét để quét tiếp |
| E6 | 4, 5 | Không tìm thấy giá vốn ở bất kỳ kỳ nào cho một sản phẩm | Cột Giá trị chênh lệch hiển thị 0 kèm biểu tượng cảnh báo, tooltip "Chưa có dữ liệu giá vốn cho sản phẩm này." | Ghi `cogs` = 0, Giá trị chênh lệch của dòng bằng 0; vẫn cho kiểm và cân bằng theo số lượng (BR-kiemke-008) |
| E7 | 7 | Sản phẩm có theo dõi lô nhưng kho không còn lô nào | "Sản phẩm {tên} không còn lô nào trong kho {tên kho}." (E-kiemke-027) | Không mở danh sách lô; người dùng tự xóa dòng nếu không kiểm |
| E8 | 11 | Tài khoản bị thu hồi quyền Tạo trong lúc đang nhập dở | "Bạn không còn quyền chỉnh sửa phiếu kiểm kê." (E-kiemke-003) | Chặn Lưu tạm và Cân bằng kho, chuyển màn hình sang chế độ chỉ đọc |

| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 7 | Nhập số âm vào ô Số thực tế | "Số thực tế không được nhỏ hơn 0." (E-kiemke-004) | Không nhận giá trị, giữ lại giá trị trước đó, focus vào ô vừa nhập |
| E2 | 9 | Bấm Lưu tạm khi phiếu chưa có dòng nào | "Phiếu kiểm kê phải có ít nhất một sản phẩm." (E-kiemke-005) | Không ghi CSDL |
| E3 | 9 | Bấm Lưu tạm khi chưa chọn Kho | "Vui lòng chọn kho cần kiểm kê." (E-kiemke-006) | Không ghi CSDL, focus vào ô Kho |
| E4 | Trước bước 9 | Mất kết nối hoặc đóng trình duyệt khi **chưa bấm Lưu tạm** | Không có thông báo | Số đã nhập **mất hoàn toàn**, hệ thống không tự lưu tạm (BR-kiemke-014); người dùng phải nhập lại |
| E5 | 6 | Quét mã vạch không tìm thấy sản phẩm trong kho đã chọn | "Không tìm thấy sản phẩm có mã vạch {mã} trong kho {tên kho}." (E-kiemke-007) | Không thêm dòng, xóa nội dung ô quét để quét tiếp |
| E6 | 4, 5 | Không tìm thấy giá vốn ở bất kỳ kỳ nào cho một sản phẩm | Không chặn thao tác; cột Giá vốn hiển thị 0 kèm biểu tượng cảnh báo, tooltip "Chưa có dữ liệu giá vốn cho sản phẩm này." | Ghi `cogs` = 0, ba cột giá trị của dòng bằng 0; vẫn cho kiểm và cân bằng theo số lượng (BR-kiemke-008) |
| E7 | 9 | Tài khoản bị thu hồi quyền Tạo trong lúc đang nhập dở | "Bạn không còn quyền chỉnh sửa phiếu kiểm kê." (E-kiemke-003) | Chặn Lưu tạm và Cân bằng kho, chuyển màn hình sang chế độ chỉ đọc |


| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E9 | 12 | Tài khoản không có quyền Cân bằng kho | Nút Cân bằng kho không hiển thị; nếu gọi trực tiếp thì "Bạn không có quyền cân bằng kho." (E-kiemke-016) | Không mở giao dịch, giữ phiếu ở trạng thái Chưa xử lý (BR-kiemke-025) |
| E10 | 12 | Phiếu không có dòng nào đã nhập số thực tế | "Chưa có sản phẩm nào được kiểm. Không thể cân bằng kho." (E-kiemke-010) | Không mở giao dịch, giữ phiếu ở trạng thái Chưa xử lý |
| E11 | 12 | Phiếu đã bị người khác cân bằng trước đó, `status` đã là 2 | "Phiếu kiểm kê này đã được cân bằng kho." (E-kiemke-011) | Không xử lý lại, tải lại phiếu ở chế độ chỉ đọc (BR-kiemke-015) |
| E12 | 15 | Kho của phiếu bị ngừng hoạt động giữa lúc thao tác | "Kho {tên kho} không còn hoạt động. Không thể cân bằng kho." (E-kiemke-009) | Hủy giao dịch, giữ phiếu ở trạng thái Chưa xử lý |
| E13 | 15 | Sản phẩm trong phiếu không còn dòng `inventory` tương ứng (bị xóa khỏi kho) | "Sản phẩm {tên} không còn trong kho {tên kho} và đã được bỏ khỏi phiếu." (E-kiemke-008) | Loại dòng đó khỏi phiếu, ghi log, tiếp tục cân bằng các dòng còn lại |
| E14 | 18, 19 | Không tìm thấy mã nghiệp vụ N11 hoặc X12 trong danh mục của công ty | "Chưa khai báo nghiệp vụ kiểm kê kho cho đơn vị. Liên hệ quản trị để bổ sung." (E-kiemke-012) | Hủy toàn bộ giao dịch, không đụng tới tồn kho, giữ phiếu ở trạng thái Chưa xử lý |
| E15 | 17 đến 20 | Lỗi khi ghi chứng từ hoặc cập nhật tồn ở bất kỳ bước nào từ 17 đến 20 | "Cân bằng kho không thành công. Vui lòng thử lại." (E-kiemke-013) | **Rollback toàn bộ giao dịch**: tồn kho, chứng từ và trạng thái phiếu trở về nguyên trạng trước khi bấm; ghi log lỗi (BR-kiemke-020) |
| E16 | 15 | Hai phiếu cùng kho cùng chứa một mã, phiếu thứ hai cân bằng sau | Không có cảnh báo | Phiếu sau nạp tồn lần cuối tại bước 4 nên lấy đúng số mà phiếu trước vừa để lại, rồi **ghi đè bằng số đếm của mình**. Hệ thống chấp nhận hành vi này, không chặn và không cảnh báo (BR-kiemke-021) |
| E17 | 15 đến 20 | Mất kết nối sau khi bấm Đồng ý, trước khi giao dịch hoàn tất | "Cân bằng kho không thành công. Vui lòng thử lại." (E-kiemke-013) | Giao dịch tự rollback ở phía máy chủ; khi vào lại, phiếu vẫn ở trạng thái Chưa xử lý với dữ liệu như trước khi bấm |


#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-004 | Mỗi phiếu kiểm kê chỉ gắn với **một kho**. Kho được chọn ở **popup Chọn kho hàng trước khi vào màn lập phiếu** và **khóa trong suốt vòng đời phiếu**; muốn đổi kho phải lập phiếu mới |
| BR-kiemke-005 | Khi tick "Chọn tất cả hàng hóa trong kho", hệ thống chỉ nạp các dòng `inventory` có `is_primary` = 1, tức **chỉ đơn vị tính chính**. Khi thêm sản phẩm bằng tay, người dùng **chọn được đơn vị tính** muốn kiểm trong số các đơn vị của sản phẩm đó |
| BR-kiemke-006 | Mỗi lần quét trúng một mã vạch đã có trong lưới, hệ thống **cộng thêm 1** vào `actual_quantity` của dòng đó, không tạo dòng trùng |
| BR-kiemke-007 | `book_quantity` do hệ thống nạp, người dùng không sửa được. Khi phiếu ở trạng thái Chưa xử lý, mỗi lần mở lại phiếu là nạp lại theo `inventory.on_hand` hoặc `batches_detail.on_hand` hiện tại — **hệ thống không đóng băng tồn và không khóa kho** |
| BR-kiemke-008 | Giá vốn của một dòng lấy từ `cogs_history` theo `warehouse_id` và `product_product_unit_id` của dòng, chọn bản ghi có `from_date <= stocktaking.date <= to_date`. Nếu kỳ chứa ngày kiểm kê không có bản ghi thì **lùi về kỳ gần nhất trước đó có giá**. Nếu mọi kỳ đều không có thì `cogs` = 0 và hiển thị cảnh báo E-kiemke-008. Quy tắc áp dụng chung cho cả dòng thừa lẫn dòng thiếu |
| BR-kiemke-009 | `actual_quantity` = NULL nghĩa là **chưa kiểm**: dòng không tính vào tổng và bị bỏ qua khi cân bằng. `actual_quantity` = 0 nghĩa là **đã kiểm, đếm được 0**: dòng được cân bằng và làm tồn về 0 |
| BR-kiemke-010 | `actual_quantity` không nhận giá trị âm; **chấp nhận số lẻ** để phục vụ hàng cân ký và hàng đong theo lít |
| BR-kiemke-011 | Chức năng kiểm kê kho có **năm quyền**: Xem, Tạo, Sửa, Xóa và **Cân bằng kho**. Tài khoản có quyền là thao tác được trên **mọi kho của công ty**, không giới hạn theo chi nhánh |
| BR-kiemke-012 | Chỉ xóa được phiếu ở trạng thái Chưa xử lý; phiếu Đã xử lý không xóa, không sửa, không hủy |
| BR-kiemke-013 | `diff_reason` là trường **không bắt buộc**, người dùng tự quyết ghi hay không cho từng dòng |
| BR-kiemke-014 | Hệ thống **không tự lưu tạm** dữ liệu đang nhập; số liệu chỉ an toàn sau khi bấm Lưu tạm |
| BR-kiemke-015 | Cân bằng kho chỉ thực hiện được trên phiếu có `status` = 1; phiếu Đã xử lý không cân bằng lại, không hủy, không đảo ngược |
| BR-kiemke-016 | Ngay trước khi cập nhật tồn, hệ thống **nạp lại `book_quantity` theo tồn hiện tại** và tính lại chênh lệch trên số vừa nạp, để giao dịch bán hàng phát sinh trong lúc đếm không bị tính oan vào chênh lệch |
| BR-kiemke-017 | Dòng không có `batch_id`: `inventory.on_hand` được đặt bằng `actual_quantity`. Dòng có `batch_id`: `batches_detail.on_hand` được đặt bằng `actual_quantity`, sau đó `inventory.on_hand` của mã đó được tính lại bằng tổng `batches_detail.on_hand` cùng `inventory_id` |
| BR-kiemke-018 | Một phiếu kiểm kê sinh **tối đa hai chứng từ kho**: một `rs_inoutward` mã **N11 — Nhập hàng do kiểm kê** gom mọi dòng `diff_quantity` > 0, và một `rs_inoutward` mã **X12 — Xuất hàng do kiểm kê** gom mọi dòng `diff_quantity` < 0. Cả hai ghi `ref_id` = `stocktaking.id` và `type_desc` = "Kiểm kê kho". Dòng `diff_quantity` = 0 không sinh detail |
| BR-kiemke-019 | Sau khi hoàn thành, toàn bộ số liệu của phiếu (`book_quantity`, `actual_quantity`, `diff_quantity`, `cogs`, ba cột giá trị) được **giữ cố định trong `stocktaking_detail`**; màn xem chi tiết và biên bản in ra đọc từ đây, không truy vấn lại tồn hiện tại |
| BR-kiemke-020 | Toàn bộ bước cập nhật tồn, sinh chứng từ và chốt phiếu chạy trong **một giao dịch dữ liệu duy nhất**; lỗi ở bất kỳ bước nào thì rollback tất cả, không để tồn đã đổi mà chứng từ chưa sinh |
| BR-kiemke-021 | Hệ thống **không chặn và không cảnh báo** khi nhiều phiếu Chưa xử lý cùng kho chứa cùng một mã sản phẩm; phiếu cân bằng sau ghi đè kết quả của phiếu cân bằng trước. Việc chia mã giữa những người cùng kiểm là thỏa thuận vận hành, không phải ràng buộc hệ thống |
| BR-kiemke-032 | Mã phiếu kiểm kê sinh tự động theo định dạng `KK{NNN}`. Số thứ tự tăng dần riêng theo từng công ty, bắt đầu từ 001. Số đã sử dụng không được tái sử dụng, kể cả khi phiếu bị xóa |
| BR-kiemke-030 | Cột **Xử lý** trên popup chi tiết là nhãn **suy ra từ dấu của `diff_quantity`**, không phải trường người dùng chọn và không lưu vào CSDL: lớn hơn 0 hiển thị "Nhập kho", nhỏ hơn 0 hiển thị "Xuất kho", bằng 0 để trống. Nhãn này khớp đúng loại chứng từ mà dòng đó đã góp vào khi cân bằng (BR-kiemke-018) |
| BR-kiemke-031 | Cột **Giá trị chênh lệch** hiển thị **cùng dấu** với cột SL chênh lệch: thiếu hàng thì cả hai đều âm, thừa hàng thì cả hai đều dương; không hiển thị trị tuyệt đối |
| BR-kiemke-034 | Năm tab **Tất cả / Chưa kiểm / Đã kiểm / Khớp / Lệch** chỉ lọc hiển thị trên lưới, không tác động tới nội dung phiếu: dòng bị ẩn vẫn nằm trong phiếu và vẫn được lưu. Số đếm trên mỗi tab cập nhật ngay khi người dùng nhập liệu, không cần lưu |
| BR-kiemke-035 | Đổi sản phẩm bằng dropdown trên một dòng đã nhập liệu thì hệ thống **xóa trắng Tồn thực tế và Nguyên nhân** của dòng đó, đồng thời nạp lại Tồn chi nhánh và giá vốn theo sản phẩm mới |
| BR-kiemke-036 | Biểu tượng **Nhân đôi dòng** chèn một dòng mới ngay dưới dòng đang chọn, **giữ nguyên sản phẩm và đơn vị tính**, để trống lô, Tồn thực tế và Nguyên nhân. Dùng khi cần kiểm cùng một sản phẩm ở nhiều lô |

---

### 3.3 Chỉnh sửa phiếu kiểm kê

#### 3.3.1 Thông tin chung về chức năng

Cho phép quản lý kho mở lại một phiếu đang ở trạng thái **Chưa xử lý** từ màn Danh sách để hoàn thiện: sửa ngày kiểm kê và lý do kiểm kê, thêm hoặc bớt sản phẩm, nhập tiếp số đếm thực tế cho những dòng còn trống, sửa số đã nhập và ghi nguyên nhân chênh lệch. Đây là chức năng phục vụ việc kiểm kê nhiều lượt hoặc nhiều ca trên cùng một phiếu. Phiếu **Đã xử lý** không sửa được dưới bất kỳ hình thức nào.

Màn hình dùng chung với màn Lập phiếu (3.2.2), khác ở chỗ phiếu đã có số phiếu và đã có dữ liệu.

#### 3.3.2 Màn hình chức năng

Dùng lại toàn bộ bố cục màn Lập phiếu ở mục 3.2.2, với các khác biệt:

| # | Thành phần | Khác biệt so với 3.2.2 |
|---|-----------|------------------------|
| 1 | Số phiếu | Hiển thị số phiếu đã sinh, không sửa |
| 2 | Kho | **Khóa** vì phiếu đã có dòng (BR-kiemke-004); chỉ mở lại nếu người dùng xóa hết dòng |
| 3 | Người kiểm | Giữ nguyên `creator` của phiếu, **không đổi theo người đang sửa** (BR-kiemke-027) |
| 4 | Tồn sổ sách | **Nạp lại theo số hiện tại** mỗi lần mở phiếu (BR-kiemke-007); số đếm thực tế và nguyên nhân chênh lệch người dùng đã nhập được giữ nguyên |
| 5 | Nút Lưu tạm | Cập nhật phiếu thay vì tạo mới |

#### 3.3.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Hoàn thiện một phiếu kiểm kê đang dở: bổ sung số đếm, sửa số đã nhập, thêm bớt sản phẩm |
| **Tác nhân** | Quản lý kho có quyền Sửa |
| **Điều kiện kích hoạt** | Bấm vào một phiếu có `status` = 1 ở màn Danh sách |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền Sửa; phiếu tồn tại và đang ở trạng thái Chưa xử lý; kho của phiếu còn hoạt động |
| **Điều kiện sau khi thực hiện** | `stocktaking` và `stocktaking_detail` được cập nhật, `status` vẫn là 1; tồn kho **chưa thay đổi** |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Bấm vào phiếu Chưa xử lý ở màn Danh sách | Kiểm tra quyền Sửa (BR-kiemke-011) và `status` = 1 (BR-kiemke-012). Đọc `stocktaking` và `stocktaking_detail` theo `id`. **Nạp lại `book_quantity` và `cogs` theo số hiện tại** (BR-kiemke-007, BR-kiemke-008), giữ nguyên `actual_quantity` và `diff_reason` đã nhập. Hiển thị màn Lập phiếu ở chế độ sửa |
| 2 | Sửa Ngày kiểm kê hoặc Lý do kiểm kê | Đổi ngày thì nạp lại `cogs` toàn phiếu theo kỳ mới (BR-kiemke-008) và tính lại ba cột giá trị |
| 3 | Thêm sản phẩm bằng tìm kiếm hoặc quét mã | Xử lý như bước 5 và 6 của mục 3.2.3 |
| 4 | Bấm Xóa dòng để bỏ sản phẩm khỏi phiếu | Bỏ dòng khỏi lưới (US-07); dòng bị bỏ không ảnh hưởng tồn kho |
| 5 | Nhập hoặc sửa Số thực tế, ghi Nguyên nhân | Kiểm tra không âm (BR-kiemke-010); tính lại chênh lệch của dòng và dòng tổng |
| 6 | Bấm **Lưu tạm** | Update `stocktaking` (ngày, lý do, `updater`, `update_time`) và ghi đè lại toàn bộ dòng theo `stocktaking_id`. Hiển thị "Đã lưu phiếu kiểm kê {số phiếu}." |
| 7 | Hoặc bấm **Cân bằng kho** | Chuyển sang bước 12 của mục 3.2.3 |

**Luồng rẽ nhánh:**

| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| C1 | 1 | Mở phiếu Chưa xử lý bằng tài khoản chỉ có quyền Xem | Mở khối chi tiết ở chế độ chỉ đọc, ẩn mọi nút thao tác |
| C2 | 6 | Xóa hết dòng của phiếu rồi Lưu tạm | Báo lỗi E-kiemke-005; phiếu phải có ít nhất một sản phẩm. Muốn bỏ hẳn phiếu thì dùng chức năng Xóa phiếu (3.4) |
| C3 | 1 | Tồn sổ sách thay đổi so với lần mở trước do phát sinh bán hàng | Cột Tồn sổ sách và các cột giá trị tự cập nhật theo số mới; cột Số thực tế giữ nguyên số người dùng đã đếm; chênh lệch được tính lại. Không có cảnh báo (BR-kiemke-007) |
| C4 | 1 | Sản phẩm trong phiếu có thêm lô mới phát sinh sau khi lập phiếu | Lô mới **không tự thêm** vào phiếu; người dùng phải thêm bằng tay nếu muốn kiểm |

**Luồng ngoại lệ:**

| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 1 | Phiếu vừa được người khác cân bằng, `status` đã chuyển sang 2 | "Phiếu kiểm kê này đã được cân bằng kho." (E-kiemke-011) | Mở phiếu ở chế độ chỉ đọc, không cho sửa |
| E2 | 1 | Phiếu vừa bị người khác xóa | "Phiếu kiểm kê không còn tồn tại." (E-kiemke-017) | Quay về màn Danh sách và tải lại |
| E3 | 1 | Sản phẩm trong phiếu bị ngừng kinh doanh hoặc bị xóa sau khi đã đưa vào phiếu | "Sản phẩm {tên} không còn hiệu lực và đã được bỏ khỏi phiếu." (E-kiemke-008) | Loại dòng đó khỏi lưới khi mở phiếu, ghi log, các dòng khác giữ nguyên |
| E4 | 1 | Kho của phiếu bị xóa hoặc ngừng hoạt động | "Kho {tên kho} không còn hoạt động. Không thể tiếp tục phiếu kiểm kê này." (E-kiemke-009) | Mở phiếu ở chế độ chỉ đọc, chặn Lưu tạm và Cân bằng kho, gợi ý xóa phiếu |
| E5 | 6 | Tài khoản bị thu hồi quyền Sửa trong lúc đang nhập dở | "Bạn không còn quyền chỉnh sửa phiếu kiểm kê." (E-kiemke-003) | Chặn Lưu tạm, chuyển màn sang chế độ chỉ đọc |
| E6 | 6 | Hai người cùng mở một phiếu Chưa xử lý và cùng bấm Lưu tạm | Người lưu sau nhận: "Phiếu đã được cập nhật bởi {tên người}. Vui lòng tải lại phiếu." (E-kiemke-018) | Không ghi đè; tải lại phiếu theo dữ liệu mới nhất để người dùng nhập lại phần của mình (BR-kiemke-026) |

#### 3.3.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-026 | Khi hai tài khoản cùng mở một phiếu Chưa xử lý, hệ thống áp dụng cơ chế **người lưu sau bị chặn**: so `update_time` của phiếu trên màn hình với `update_time` trong CSDL tại thời điểm lưu; lệch nhau thì không ghi và báo E-kiemke-018 |
| BR-kiemke-027 | Người kiểm ghi trên phiếu luôn là **người tạo phiếu** (`creator`), không đổi khi người khác vào sửa; người sửa gần nhất được ghi vào `updater` |

---

### 3.4 Xóa phiếu kiểm kê

#### 3.4.1 Thông tin chung về chức năng

Cho phép quản lý kho loại bỏ những phiếu tạo nhầm hoặc không còn nhu cầu thực hiện. Chỉ áp dụng cho phiếu ở trạng thái **Chưa xử lý**; phiếu Đã xử lý là chứng từ kế toán nên không xóa được. Thao tác thực hiện từ màn Danh sách phiếu kiểm kê.

#### 3.4.2 Màn hình chức năng

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | Nút Xóa trên dòng phiếu | Button | — | — | Chỉ hiện với phiếu `status` = 1 và tài khoản có quyền Xóa |
| 2 | Hộp thoại xác nhận xóa | Dialog | Ẩn | — | Nội dung: "Bạn có chắc chắn muốn xóa phiếu kiểm kê {số phiếu}?" Hai nút: **Xác nhận**, **Hủy** |

#### 3.4.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Loại bỏ phiếu kiểm kê nháp không còn nhu cầu, giữ danh sách gọn |
| **Tác nhân** | Quản lý kho có quyền Xóa |
| **Điều kiện kích hoạt** | Bấm nút Xóa trên một dòng phiếu ở màn Danh sách |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền Xóa; phiếu đang ở `status` = 1 |
| **Điều kiện sau khi thực hiện** | Bản ghi `stocktaking` và toàn bộ `stocktaking_detail` của phiếu bị xóa khỏi hệ thống; tồn kho **không thay đổi**; số phiếu đã dùng không được cấp lại (BR-kiemke-032) |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Bấm nút Xóa trên dòng phiếu | Kiểm tra quyền Xóa (BR-kiemke-011) và `status` = 1 (BR-kiemke-012). Hiện hộp thoại xác nhận kèm số phiếu |
| 2 | Bấm **Xác nhận** | Mở giao dịch: xóa toàn bộ `stocktaking_detail` theo `stocktaking_id`, rồi xóa bản ghi `stocktaking` (BR-kiemke-028). Đóng giao dịch. Hiển thị "Đã xóa phiếu kiểm kê {số phiếu}." và tải lại danh sách |

**Luồng rẽ nhánh:**

| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| D1 | 1 | Người dùng bấm **Hủy** ở hộp thoại | Đóng hộp thoại, không xóa gì, giữ nguyên danh sách |
| D2 | 1 | Tài khoản không có quyền Xóa | Nút Xóa không hiển thị trên bất kỳ dòng nào |
| D3 | 1 | Phiếu đang ở trạng thái Đã xử lý | Nút Xóa không hiển thị trên dòng đó (BR-kiemke-012) |

**Luồng ngoại lệ:**

| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 2 | Phiếu vừa được người khác cân bằng trước khi bấm Xác nhận | "Phiếu kiểm kê đã được cân bằng kho, không thể xóa." (E-kiemke-002) | Không xóa, tải lại danh sách để hiện trạng thái mới nhất |
| E2 | 2 | Phiếu vừa bị người khác xóa | "Phiếu kiểm kê không còn tồn tại." (E-kiemke-017) | Đóng hộp thoại, tải lại danh sách |
| E3 | 2 | Lỗi khi xóa giữa chừng | "Xóa phiếu kiểm kê không thành công. Vui lòng thử lại." (E-kiemke-019) | Rollback giao dịch, phiếu và các dòng giữ nguyên |
| E4 | 2 | Tài khoản bị thu hồi quyền Xóa giữa lúc mở hộp thoại | "Bạn không còn quyền chỉnh sửa phiếu kiểm kê." (E-kiemke-003) | Đóng hộp thoại, không xóa, tải lại danh sách |

#### 3.4.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-028 | Xóa phiếu kiểm kê là **xóa vật lý** cả header và detail; phiếu Chưa xử lý chưa từng làm đổi tồn kho nên không cần lưu vết. Phiếu Đã xử lý không nằm trong phạm vi chức năng này |

---

### 3.5 In biên bản kiểm kê

#### 3.5.1 Thông tin chung về chức năng

Kết xuất biên bản kiểm kê của một phiếu Đã xử lý ra file để in, ký xác nhận và lưu hồ sơ. Biên bản dùng **mẫu chung sẵn có của phần mềm** và cho từng công ty **chỉnh lại mẫu**. Toàn bộ số liệu trên biên bản lấy từ `stocktaking` và `stocktaking_detail` đã chốt, nên biên bản in lại sau nhiều tháng vẫn trùng khít với bản in lần đầu.

#### 3.5.2 Màn hình chức năng

| # | Tên thành phần | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | Nút In biên bản | Button | — | — | Đặt ở chân **popup Chi tiết mã chứng từ**, không đặt trên dòng lưới; chỉ hiện với phiếu `status` = 2. Vị trí này là đề xuất, chưa có trên bản thiết kế — xem Open Question số 7 |
| 2 | Khung xem trước bản in | Preview | — | — | Hiển thị biên bản trước khi in hoặc tải về |
| 3 | Nút Tải PDF | Button | — | — | Tải biên bản dạng PDF, tên file `BBKK-{số phiếu}.pdf` |

**Nội dung biên bản:**

| # | Khối | Nội dung |
|---|------|---------|
| 1 | Tiêu đề | Tên công ty, địa chỉ, tiêu đề "BIÊN BẢN KIỂM KÊ KHO" |
| 2 | Thông tin chung | Số phiếu, ngày kiểm kê, tên kho, người kiểm, lý do kiểm kê, thời điểm cân bằng |
| 3 | Bảng dòng kiểm | Số thứ tự, Mã SP, Tên SP, ĐVT, Lô, Tồn sổ sách, Số thực tế, Chênh lệch SL, Giá vốn, Chênh lệch giá trị, Nguyên nhân |
| 4 | Dòng tổng | Tổng chênh lệch số lượng, tổng chênh lệch giá trị |
| 5 | Khối chữ ký | Người kiểm kê, kế toán, thủ trưởng đơn vị |

#### 3.5.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Sinh hồ sơ giấy của một đợt kiểm kê phục vụ ký duyệt và lưu trữ |
| **Tác nhân** | Quản lý kho; kế toán và quản lý cửa hàng có quyền Xem |
| **Điều kiện kích hoạt** | Bấm nút In biên bản trên một phiếu Đã xử lý |
| **Điều kiện tiên quyết** | Có quyền Xem; phiếu ở `status` = 2; công ty đã có mẫu biên bản kiểm kê |
| **Điều kiện sau khi thực hiện** | Sinh file biên bản; không thay đổi dữ liệu nào |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Bấm **In biên bản** | Kiểm tra quyền Xem và `status` = 2 (BR-kiemke-029). Đọc `stocktaking` theo `id` và `stocktaking_detail` sắp xếp theo `position`; lấy mẫu biên bản của công ty. **Không truy vấn `inventory`** (BR-kiemke-023) |
| 2 | (Hệ thống tự động) | Đổ dữ liệu vào mẫu, hiển thị khung xem trước |
| 3 | Bấm In hoặc **Tải PDF** | Gửi lệnh in tới trình duyệt, hoặc sinh file PDF tên `BBKK-{số phiếu}.pdf` |

**Luồng rẽ nhánh:**

| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| F1 | 2 | Phiếu không có dòng nào lệch | Biên bản vẫn in đủ danh sách sản phẩm với cột chênh lệch bằng 0; dòng tổng ghi 0 |
| F2 | 1 | Công ty đã chỉnh mẫu biên bản riêng | Dùng mẫu riêng thay cho mẫu chung, dữ liệu đổ vào không đổi (BR-kiemke-022) |
| F3 | 2 | Phiếu có dòng theo lô | Cột Lô hiển thị số lô; cùng một mã có nhiều lô thì in thành nhiều dòng liên tiếp |
| F4 | 1 | Phiếu ở trạng thái Chưa xử lý | Nút In biên bản không hiển thị |

**Luồng ngoại lệ:**

| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 1 | Không có mẫu in biên bản được cấu hình cho công ty | "Chưa cấu hình mẫu biên bản kiểm kê. Vui lòng liên hệ quản trị." (E-kiemke-015) | Không kết xuất, giữ nguyên màn hình |
| E2 | 3 | Phiếu có quá nhiều dòng khiến kết xuất quá lâu | "Đang chuẩn bị file, vui lòng đợi." | Kết xuất chạy nền, thông báo khi có file tải về |
| E3 | 3 | Lỗi khi sinh file PDF | "Không tạo được biên bản. Vui lòng thử lại." (E-kiemke-020) | Ghi log, giữ nguyên màn hình |

#### 3.5.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-022 | Biên bản kiểm kê in theo **mẫu chung sẵn có của phần mềm**, và cho phép từng công ty **chỉnh lại mẫu**; biên bản phải có tối thiểu: số phiếu, ngày kiểm kê, kho, người kiểm, bảng dòng kiểm với tồn sổ sách, số thực tế, chênh lệch số lượng và chênh lệch giá trị, dòng tổng, khối chữ ký |
| BR-kiemke-023 | Khối chi tiết phiếu và biên bản chỉ đọc dữ liệu từ `stocktaking` và `stocktaking_detail`; nghiêm cấm truy vấn `inventory` để hiển thị lại tồn sổ sách của phiếu đã hoàn thành |
| BR-kiemke-029 | Chỉ in được biên bản của phiếu ở trạng thái Đã xử lý; phiếu Chưa xử lý chưa chốt số nên không có biên bản |

---

### 3.6 Cấp quyền kiểm kê kho

#### 3.6.1 Thông tin chung về chức năng

Bổ sung nhóm quyền **Kiểm kê kho** vào màn phân quyền hiện có, gồm **năm quyền** thao tác. Quản lý cửa hàng gán các quyền này cho từng vai trò theo mô hình phân quyền sẵn có của phần mềm. Quyền **Cân bằng kho** tách riêng vì đây là thao tác duy nhất làm thay đổi tồn kho thật và không hoàn tác được.

#### 3.6.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | Nhóm quyền Kiểm kê kho | Nhóm checkbox | Bỏ tick toàn bộ | Không | Nằm trong nhóm quyền Kho |
| 2 | Quyền Xem | Checkbox | Bỏ tick | Không | Mở danh sách, xem chi tiết phiếu, in biên bản |
| 3 | Quyền Tạo | Checkbox | Bỏ tick | Không | Tạo phiếu kiểm kê mới |
| 4 | Quyền Sửa | Checkbox | Bỏ tick | Không | Mở phiếu Chưa xử lý để chỉnh sửa và lưu tạm |
| 5 | Quyền Xóa | Checkbox | Bỏ tick | Không | Xóa phiếu Chưa xử lý |
| 6 | Quyền Cân bằng kho | Checkbox | Bỏ tick | Không | Thực hiện cân bằng kho, chốt phiếu và sinh chứng từ điều chỉnh |

#### 3.6.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu** | Kiểm soát ai được lập, sửa, xóa, xem phiếu kiểm kê và ai được chốt phiếu làm đổi tồn kho |
| **Tác nhân** | Quản lý cửa hàng |
| **Điều kiện kích hoạt** | Mở màn phân quyền, chọn vai trò cần cấu hình |
| **Điều kiện tiên quyết** | Có quyền quản trị phân quyền |
| **Điều kiện sau khi thực hiện** | Cấu hình quyền của vai trò được cập nhật, áp dụng ngay cho phiên đăng nhập kế tiếp của các tài khoản thuộc vai trò |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | Mở màn phân quyền, chọn vai trò | Hiển thị cây quyền có thêm nhánh Kiểm kê kho với năm quyền |
| 2 | Tick hoặc bỏ tick các quyền, bấm Lưu | Áp quy tắc kéo theo (BR-kiemke-024), ghi cấu hình quyền của vai trò, hiển thị "Đã lưu phân quyền." |

**Luồng rẽ nhánh:**

| Mã | Từ bước | Điều kiện | Xử lý |
|----|------|-----------|-------|
| G1 | 2 | Tick Tạo, Sửa, Xóa hoặc Cân bằng kho mà chưa tick Xem | Tự động tick kèm quyền Xem, vì không xem được thì không thao tác được (BR-kiemke-024) |
| G2 | 2 | Tick Cân bằng kho mà chưa tick Sửa | Tự động tick kèm quyền Sửa, vì cân bằng thao tác trên phiếu đang mở ở chế độ sửa (BR-kiemke-024) |
| G3 | 2 | Bỏ tick Xem khi các quyền khác đang bật | Tự động bỏ tick toàn bộ nhóm quyền Kiểm kê kho |
| G4 | 2 | Cấp Xem, Tạo, Sửa nhưng **không** cấp Cân bằng kho | Vai trò đó lập và nhập được phiếu nhưng không thấy nút Cân bằng kho; phiếu phải chờ người có quyền chốt |

**Luồng ngoại lệ:**

| Mã | Từ bước | Tình huống | Thông báo hiển thị | Hành động hệ thống |
|----|------|-----------|-------------------|-------------------|
| E1 | 2 | Bỏ toàn bộ quyền kiểm kê của vai trò đang có người dùng làm phiếu dở | Không có thông báo tại màn phân quyền | Phiếu Chưa xử lý của những người đó vẫn còn trong hệ thống; họ mở ra sẽ gặp E-kiemke-003 và phiếu chuyển sang chỉ đọc |
| E2 | 2 | Thu hồi riêng quyền Cân bằng kho khi có phiếu đang chờ chốt | Không có thông báo tại màn phân quyền | Nút Cân bằng kho biến mất ở phiên đăng nhập kế tiếp; phiếu vẫn ở trạng thái Chưa xử lý, chờ tài khoản khác có quyền |

#### 3.6.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|-------|-------|
| BR-kiemke-024 | Quyền Tạo, Sửa, Xóa hoặc Cân bằng kho đều kéo theo quyền **Xem**; riêng quyền **Cân bằng kho** kéo theo cả quyền **Sửa**. Bỏ quyền Xem thì bỏ toàn bộ nhóm quyền kiểm kê kho |
| BR-kiemke-025 | Hành động cân bằng kho **yêu cầu quyền Cân bằng kho**; tài khoản chỉ có quyền Sửa thì lập và nhập được phiếu nhưng **không chốt được phiếu** và không thấy nút Cân bằng kho |

---

## PHỤ LỤC — BẢNG MÃ LỖI

| Mã lỗi | Thông báo | Xuất hiện tại |
|--------|-----------|---------------|
| E-kiemke-001 | *(Không còn dùng — điều kiện ngày bị chặn ngay trên giao diện theo BR-kiemke-001)* | — |
| E-kiemke-002 | Phiếu kiểm kê đã được cân bằng kho, không thể xóa. | 3.4.3 E1 |
| E-kiemke-003 | Bạn không còn quyền chỉnh sửa phiếu kiểm kê. | 3.2.3 E8, 3.3.3 E5, 3.4.3 E4 |
| E-kiemke-004 | Số thực tế không được nhỏ hơn 0. | 3.2.3 E2 |
| E-kiemke-005 | Phiếu kiểm kê phải có ít nhất một sản phẩm. | 3.2.3 E3, 3.3.3 C2 |
| E-kiemke-006 | Vui lòng chọn kho cần kiểm kê. | 3.2.3 E1 |
| E-kiemke-007 | Không tìm thấy sản phẩm có mã vạch {mã} trong kho {tên kho}. | 3.2.3 E5 |
| E-kiemke-008 | Sản phẩm {tên} không còn hiệu lực và đã được bỏ khỏi phiếu. / Chưa có dữ liệu giá vốn cho sản phẩm này. | 3.2.3 E6, 3.2.3 E13, 3.3.3 E3 |
| E-kiemke-009 | Kho {tên kho} không còn hoạt động. Không thể tiếp tục phiếu kiểm kê này. | 3.2.3 E12, 3.3.3 E4 |
| E-kiemke-010 | Chưa có sản phẩm nào được kiểm. Không thể cân bằng kho. | 3.2.3 E10 |
| E-kiemke-011 | Phiếu kiểm kê này đã được cân bằng kho. | 3.2.3 E11, 3.3.3 E1 |
| E-kiemke-012 | Chưa khai báo nghiệp vụ kiểm kê kho cho đơn vị. Liên hệ quản trị để bổ sung. | 3.2.3 E14 |
| E-kiemke-013 | Cân bằng kho không thành công. Vui lòng thử lại. | 3.2.3 E15, E17 |
| E-kiemke-014 | Chứng từ liên kết không còn tồn tại. | 3.1.2 khối 6 mục 38 |
| E-kiemke-015 | Chưa cấu hình mẫu biên bản kiểm kê. Vui lòng liên hệ quản trị. | 3.5.3 E1 |
| E-kiemke-016 | Bạn không có quyền cân bằng kho. | 3.2.3 E9 |
| E-kiemke-017 | Phiếu kiểm kê không còn tồn tại. | 3.3.3 E2, 3.4.3 E2 |
| E-kiemke-018 | Phiếu đã được cập nhật bởi {tên người}. Vui lòng tải lại phiếu. | 3.3.3 E6 |
| E-kiemke-019 | Xóa phiếu kiểm kê không thành công. Vui lòng thử lại. | 3.4.3 E3 |
| E-kiemke-020 | Không tạo được biên bản. Vui lòng thử lại. | 3.5.3 E3 |
| E-kiemke-021 | Bạn không có quyền xem danh sách kiểm kê kho. | 3.1.3 bước 1b |
| E-kiemke-022 | Bạn không có quyền tạo phiếu kiểm kê kho. | 3.1.3 bước 4a |
| E-kiemke-023 | Bạn không có quyền xóa phiếu kiểm kê kho. | 3.1.3 bước 5a |
| E-kiemke-024 | Bạn không có quyền in biên bản kiểm kê kho. | 3.1.3 bước 6a |
| E-kiemke-025 | Bạn không có quyền xuất Excel. | 3.1.3 bước 7a |
| E-kiemke-026 | Không thể xuất dữ liệu. Vui lòng thử lại. | 3.1.3 bước 7b |
| E-kiemke-027 | Sản phẩm {tên} không còn lô nào trong kho {tên kho}. | 3.2.3 E7 |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|------------------------|---------|-----------------|----------------|
| Báo cáo xuất nhập tồn | Báo cáo xuất nhập tồn | **Cao** | Xuất hiện thêm chứng từ N11 và X12 trong kỳ. Cần bổ sung hai mã này vào bộ lọc loại nghiệp vụ và vào phần diễn giải, đồng thời là nơi thể hiện số liệu chênh lệch kiểm kê theo kỳ (không làm màn báo cáo riêng) |
| Báo cáo lợi nhuận | Báo cáo lợi nhuận | **Cao** | Chứng từ X12 làm giảm tồn theo giá vốn nên ảnh hưởng trực tiếp tới giá vốn hàng bán trong kỳ; cần xác nhận cách hạch toán phần thừa thiếu để số liệu lợi nhuận không lệch |
| Tồn kho theo lô | Sản phẩm, tồn theo lô | **Cao** | Cân bằng kho ghi thẳng vào `batches_detail.on_hand` rồi tính lại `inventory.on_hand`; phải giữ đúng ràng buộc `inventory.on_hand` bằng tổng `batches_detail.on_hand` |
| Sửa tồn trực tiếp trên sản phẩm | Thông tin sản phẩm | **Trung bình** | Hai đường cùng thay đổi tồn cùng lúc. Chức năng cũ vẫn giữ nguyên, nhưng chứng từ sinh ra mang mã N3/X2 nên phân biệt được với N11/X12 của kiểm kê |
| Danh mục nghiệp vụ kho | Danh mục | **Trung bình** | Phải bổ sung hai bản ghi N11 và X12 cho **từng công ty**; thiếu là chặn cân bằng kho (E-kiemke-012) |
| Sổ kho, tra cứu chứng từ | Danh sách chứng từ kho | **Trung bình** | Chứng từ mới có `ref_id` trỏ về phiếu kiểm kê; nên bổ sung liên kết mở ngược về phiếu để đối soát hai chiều |
| Phân quyền | Phân quyền vai trò | **Trung bình** | Thêm nhánh quyền Kiểm kê kho với **năm quyền**, trong đó Cân bằng kho là quyền riêng |
| Bán hàng | Màn bán hàng | **Thấp** | Không bị chặn trong lúc kiểm kê. Chỉ lưu ý: giao dịch bán phát sinh giữa lúc đếm sẽ được phản ánh vào tồn sổ sách khi hệ thống nạp lại lần cuối tại bước cân bằng |

### 4.2 Chức năng của hệ thống khác

Không áp dụng. Nghiệp vụ kiểm kê kho chạy hoàn toàn trong nội bộ phần mềm, không gọi dịch vụ ngoài. Việc quét mã vạch dùng thiết bị đầu vào (máy quét USB, camera điện thoại) chứ không tích hợp hệ thống bên thứ ba.

---

## 5. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---------|------------------|------------------|---------|
| 1 | Phần hàng thừa và hàng thiếu hạch toán vào tài khoản kế toán nào, và có cần loại khỏi giá vốn hàng bán khi tính báo cáo lợi nhuận không? | 4.1 Báo cáo lợi nhuận, BR-kiemke-018 | Kế toán | Trước khi bắt đầu code |
| 2 | Hai mã nghiệp vụ N11 và X12 được tạo sẵn cho mọi công ty khi nâng cấp, hay để quản trị từng đơn vị tự khai báo? | 2.5, E-kiemke-012 | Nội bộ kỹ thuật | Trước khi bắt đầu code |
| 3 | Biên bản kiểm kê chỉnh mẫu ở mức nào — chỉ đổi tiêu đề và khối chữ ký, hay chỉnh được cả cột hiển thị? | BR-kiemke-022, 3.5.2 | Khách hàng / sale | Trước khi thiết kế màn in |
| 4 | Quét mã vạch trên mobile dùng camera có cần làm ngay trong đợt này không, hay giai đoạn đầu chỉ hỗ trợ máy quét USB trên bản web? | 3.2.2 mục 9, 2.4 | Nội bộ / sale | Trước khi chốt phạm vi sprint |
| 5 | Khi hai người cùng sửa một phiếu Chưa xử lý, chặn người lưu sau (BR-kiemke-026) đã đủ chưa, hay cần khóa phiếu cho người mở trước? | BR-kiemke-026, 3.3.3 E6 | Khách hàng / nội bộ | Trước khi bắt đầu code |
| 6 | **Nút "Nhập Excel" trên màn danh sách chưa có đặc tả.** Nhập cái gì — danh sách sản phẩm cần kiểm, hay cả số đếm thực tế? Nhập vào phiếu mới hay phiếu đang mở? File mẫu gồm những cột nào và khớp sản phẩm theo mã hàng hay mã vạch? Dòng sai dữ liệu thì bỏ qua hay chặn cả file? | 2.6, 3.1.2 khối 1, cần thêm mục 3.7 | Khách hàng / nội bộ | Trước khi bắt đầu code |
| 7 | Popup Chi tiết mã chứng từ trên bản thiết kế **không có** dòng tổng chênh lệch, liên kết sang chứng từ N11/X12, và nút In biên bản. Ba thứ này bổ sung vào popup hay bỏ hẳn? Nếu bỏ thì gọi In biên bản từ đâu? | 3.1.2 khối 6, 3.5.2 | Khách hàng / thiết kế | Trước khi thiết kế chi tiết màn hình |
| 8 | Mã phiếu hiển thị 3 chữ số ở màn danh sách (`KK001`) nhưng 4 chữ số trên popup (`KK0001`). Chốt dùng mấy chữ số? SRS đang viết `KK{NNN}` theo màn danh sách | BR-kiemke-032 | Nội bộ / thiết kế | Trước khi bắt đầu code |
