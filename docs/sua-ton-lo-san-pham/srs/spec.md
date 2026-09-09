---
type: srs
feature: sua-ton-lo-san-pham
status: draft
lang: vi
owner: "@huelinh"
version: 1.0
created: 2026-07-27
updated: 2026-07-27
links: [docs/sua-ton-lo-san-pham/brainstorms/sua-ton-theo-lo.md, preview/ton-kho-theo-lo-phan-bo.html]
tags: [ton-kho, lo-hang, phieu-dieu-chinh]
stale_reason: ""
changelog:
  - 2026-07-27 | /srs | 3.3 chi tiết logic Lưu: upsert batches_detail + 1 phiếu X2 (tổng tồn cũ) + N3 mỗi lô
  - 2026-07-27 | /srs | kiểm chứng DB: sửa tên rs_inoutward/business_type_id/rs_inout_ward_init/batches_detail; thêm Mục 3.3 chuyển đổi non-lô→lô; đóng OQ-1,2
  - 2026-07-27 | /srs | mỗi lô thay đổi sinh 1 phiếu riêng (bỏ cơ chế gom theo kho)
  - 2026-07-27 | /srs | thêm nguồn danh sách lô = detail phiếu N2; mở OQ-2 về lô phát sinh qua N3
  - 2026-07-27 | /srs | chuyển Mục 2.3 Yêu cầu người dùng sang dạng bảng (Story ID/Tác nhân/Mục đích)
  - 2026-07-27 | /srs | tách màn Thêm/Chi tiết, cập nhật quy tắc thêm-xóa lô-kho theo gating giao dịch
  - 2026-07-27 | /srs | initial draft từ brainstorm sua-ton-theo-lo
---

# SRS — Sửa tồn kho theo lô & phân bổ lại lô

**Mã tài liệu:** SRS-SUATONLO-001
**Phiên bản:** 1.0
**Ngày tạo:** 27/07/2026
**Người soạn:** Dương Thị Huệ Linh
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|---------|----------------|---------|
| 27/07/2026 | Toàn bộ | A | Cải tiến hệ thống | Dương Thị Huệ Linh | Tạo mới tài liệu | |

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
   - 3.1 Sửa tồn theo lô trên màn sản phẩm
   - 3.2 Phân bổ lại lô (tổng không đổi)
   - 3.3 Chuyển đổi sản phẩm non-lô sang theo dõi lô
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Yêu cầu cải tiến nội bộ. Hiện tại sản phẩm có bật theo dõi lô chỉ phân bổ được số lượng vào lô **một lần duy nhất** (lúc chuyển từ không theo dõi lô sang theo dõi lô); muốn sửa tồn sau đó phải vào giao dịch nhập/xuất kho. Yêu cầu: cho sửa tồn theo lô ngay trên màn sản phẩm và phân bổ lại nhiều lần, đồng thời để lại chứng từ truy vết.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Bổ sung khả năng **sửa số lượng tồn theo lô ngay khi chỉnh sửa sản phẩm**. Màn sửa hiển thị **tồn còn lại thực của từng lô** (đã trừ số đã bán) và cho sửa trực tiếp, thay vì phải mở giao dịch kho như hiện tại.

Cho phép **phân bổ lại giữa các lô nhiều lần** kể cả khi tổng số lượng không đổi (bỏ giới hạn "1 lần"). Mọi thay đổi số lượng lô đều **tự sinh chứng từ điều chỉnh** trên bảng `rs_inoutward` để truy vết: tăng → phiếu **N3** (nhập điều chỉnh), giảm → phiếu **X2** (xuất điều chỉnh). Phiếu **khởi tạo N2** giữ nguyên (chỉ sửa được qua giao dịch kho).

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**
1. Thêm sản phẩm, bật theo dõi lô → chọn kho + nhập số lượng → popup phân bổ số lượng vào lô.
2. Convert không-theo-lô → theo-lô mà không đổi tổng: chỉ phân bổ vào lô được 1 lần.
3. Muốn sửa tồn sau đó: phải vào giao dịch nhập/xuất kho, không sửa trực tiếp trên sản phẩm.

**Luồng mới (To-Be):**
1. Vào chỉnh sửa sản phẩm → hệ thống hiển thị **tồn còn lại thực từng lô** theo từng kho.
2. Người dùng sửa số lượng lô đã có (tăng/giảm) hoặc thêm kho mới; **không sửa được kho của dòng đã có**, **không thêm/xóa lô** trong kho đã lưu. Xóa kho chỉ khi kho **chưa phát sinh giao dịch** (xóa kèm phiếu N2, theo logic cũ).
3. Bấm Lưu → hệ thống tính chênh lệch **theo từng lô**:
   - Mỗi lô tăng → sinh **1 phiếu N3 riêng** (1 lô/phiếu).
   - Mỗi lô giảm → sinh **1 phiếu X2 riêng** (1 lô/phiếu).
   - **Không gom** nhiều lô vào 1 phiếu. Chỉ sinh phiếu khi lô có chênh lệch ≠ 0; toàn bộ phiếu của lần Lưu nằm trong 1 giao dịch (transaction).
4. Trường hợp phân bổ lại giữa lô mà **tổng không đổi**: vẫn sinh cặp X2 (lô giảm) + N3 (lô tăng), gắn `type_desc = "Phân bổ lại lô"`.

### 2.3 Yêu cầu người dùng

| Story ID | Tên | Tác nhân | Yêu cầu người dùng | Mục đích | Độ ưu tiên |
|----------|-----|----------|--------------------|----------|-----------|
| US-01 | Sửa tồn theo lô trên màn sản phẩm | NV kho / Quản lý | sửa số lượng tồn theo lô ngay khi chỉnh sửa sản phẩm | không phải thao tác qua giao dịch nhập/xuất kho | Cao |
| US-02 | Xem tồn còn lại thực của lô | NV kho / Quản lý | thấy tồn còn lại thực của từng lô (đã trừ bán) khi sửa | biết chính xác còn bao nhiêu để điều chỉnh đúng | Cao |
| US-03 | Phân bổ lại lô nhiều lần | NV kho / Quản lý | phân bổ lại số lượng giữa các lô nhiều lần khi tổng không đổi | linh hoạt điều phối lô mà không đổi tổng tồn | Cao |
| US-04 | Truy vết thay đổi tồn qua chứng từ | Quản lý cửa hàng | mọi thay đổi tồn theo lô đều tự sinh chứng từ N3/X2 | truy vết ai sửa, khi nào, lô nào | Cao |
| US-05 | Chuyển sản phẩm sang theo dõi lô | NV kho / Quản lý | chuyển sản phẩm đang có tồn từ **không theo dõi lô sang theo dõi lô** và phân bổ tồn hiện có vào các lô | quản lý chi tiết theo lô cho sản phẩm đã có sẵn tồn mà không phải nhập lại | Cao |

### 2.4 Ngữ cảnh người dùng

Thao tác trên màn quản lý sản phẩm của phần mềm EPOS (desktop/web quản trị). Đối tượng: nhân viên kho / quản lý cửa hàng có quyền quản lý kho. Diễn ra song song với hoạt động bán hàng tại quầy — tồn của lô có thể biến động trong lúc người dùng đang mở form sửa.

### 2.5 Mô tả thay đổi về CSDL

> Logic tính tồn kho **giữ nguyên** theo hệ thống hiện có — không định nghĩa lại trong tài liệu này.

**Các bảng liên quan (hiện có, không đổi cấu trúc):**

| Bảng | Cột chính | Vai trò |
|------|-----------|---------|
| `inventory` | `warehouse_id`, `product_id`, `ppu_id`, **`on_hand`**, `batch_id` (nullable), `is_primary` | Tồn theo (kho + sản phẩm). SP không theo dõi lô → tồn nằm ở `on_hand` (không có `batches_detail`) |
| `batches_detail` | `inventory_id` (FK → `inventory.id`), `batch_id` (lô), **`on_hand`** | Tồn **chi tiết theo lô** — breakdown của 1 dòng `inventory`. Quan hệ: `inventory.on_hand` = **Σ `batches_detail.on_hand`** cùng `inventory_id` |
| `rs_inoutward` (header) | `business_type_id` (FK), `type_desc`, `description`, `quantity`, `cost_amount`, `date`, `no` | Chứng từ nhập/xuất. Loại phiếu qua `business_type_id` |
| `rs_inoutward_detail` (detail) | `rs_inoutward_id` (FK header), `product_id`, `batch_id` (lô), `lot_no`, `quantity`, `cost_amount`, `total_cogs`, `from_warehouse_id`/`to_warehouse_id` | Dòng chi tiết theo lô của phiếu |
| `business_type` | `id`, `business_type_code`, `business_type_name`, `type` (2=nhập, 3=xuất) | Ánh xạ loại phiếu **theo từng công ty**: **N2**="Khởi tạo kho", **N3**="Sửa tồn kho" (nhập), **X2**="Sửa tồn kho" (xuất) |
| `rs_inout_ward_init` | `product_id`, `warehouse_id`, `ppu_id`, `rs_inout_ward_id` (FK) | Liên kết sản phẩm → **phiếu khởi tạo N2** của nó (enforce 1 khởi tạo/SP) |

**Thao tác dữ liệu khi sửa tồn theo lô:**
- Đọc danh sách + tồn lô: từ `batches_detail` (theo `inventory_id` của SP theo từng kho).
- Sửa số lượng lô: cập nhật `batches_detail.on_hand` (và `inventory.on_hand` tổng theo logic hiện có) + ghi chứng từ N3/X2.
- Bật theo dõi lô trên SP đang có tồn: **giữ nguyên `inventory.on_hand`**, thêm dòng `batches_detail` sao cho tổng khớp (xem Mục 3.3).

*Không phát sinh cột/bảng mới — tất cả bảng/cột trên đã có sẵn (kiểm chứng DB `easyposbackoffice` 2026-07-31). Phiếu N3/X2 sinh với `business_type_id` trỏ đúng mã N3/X2 **của công ty sản phẩm** (tên loại "Sửa tồn kho" lấy từ `business_type_name`); `description` ghi chú tự do. Không cần nhãn phân biệt riêng.*

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|-------|---------|-----------|-------|-----------|
| NV kho / Quản lý | Chỉnh sửa sản phẩm | Sửa tồn theo lô | Hiển thị tồn còn lại thực từng lô (từ `batches_detail`), cho sửa số lượng, thêm kho mới; mỗi lô thay đổi sinh 1 phiếu N3/X2 riêng | Cao |
| NV kho / Quản lý | Chỉnh sửa sản phẩm | Phân bổ lại lô (tổng không đổi) | Chuyển số lượng giữa các lô đã có cùng kho nhiều lần; mỗi lô 1 phiếu N3/X2 riêng | Cao |
| NV kho / Quản lý | Chỉnh sửa sản phẩm | Chuyển đổi non-lô → theo dõi lô | Bật theo dõi lô cho SP đang có tồn; phân bổ tồn vào lô; ghi dấu vết X2 + N3, không sinh N2 | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Sửa tồn theo lô trên màn sản phẩm

#### 3.1.1 Thông tin chung về chức năng

Cho phép actor có quyền quản lý kho sửa số lượng tồn theo lô của một sản phẩm đang bật theo dõi lô, ngay trên màn chỉnh sửa sản phẩm. Chức năng hiển thị tồn còn lại thực của từng lô theo từng kho, cho phép tăng/giảm số lượng, thêm lô mới, thêm kho mới. Khi lưu, hệ thống tự sinh chứng từ điều chỉnh N3/X2 theo từng kho có phát sinh để cập nhật tồn và truy vết. Không cho sửa kho của các dòng đã có, không cho xóa lô/kho.

#### 3.1.2 Màn hình chức năng

Chức năng liên quan **hai màn**: **Thêm sản phẩm** (tạo mới) và **Chi tiết sản phẩm** (chỉnh sửa). Nguyên tắc xuyên suốt: thành phần **chưa phát sinh giao dịch** (giao dịch = đã bán hoặc đã có phiếu điều chỉnh N3/X2; phiếu khởi tạo N2 không tính) thì thao tác tự do; **đã phát sinh** thì khóa. Tham chiếu mockup: [preview/ton-kho-theo-lo-phan-bo.html](../../../preview/ton-kho-theo-lo-phan-bo.html).

##### 3.1.2a Màn Thêm sản phẩm (tạo mới)

Chưa lưu, chưa phát sinh phiếu → thao tác tự do. Khi Lưu sinh **phiếu N2 (khởi tạo)**.

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|-----------|------|------------------|---------|-------|
| 1 | Sử dụng lô hàng | Toggle | — | Có | Bật/tắt theo dõi lô |
| 2 | Kho hàng | Dropdown | — | Có | Chọn tự do; ẩn kho đã dùng |
| 3 | Số lượng tồn (của kho) | Read-only | — | — | Tự tính = tổng số lượng các lô (không nhập tay) |
| 4 | Xóa kho | Icon 🗑️ | — | — | Xóa khối kho |
| 5 | Số lô | Dropdown | — | Có | Chỉ hiện lô **còn tồn** và **chưa quá HSD**; chọn xong tự điền NSX/HSD |
| 6 | Ngày sản xuất (NSX) | Read-only | — | — | Tự điền theo lô đã chọn |
| 7 | Hạn sử dụng (HSD) | Read-only | — | — | Tự điền theo lô đã chọn |
| 8 | Số lượng (của lô) | Number | Theo cấu hình đơn vị/SP | Có | Cho **số thập phân** nếu đơn vị/SP bán lẻ; không vượt tồn khả dụng của lô |
| 9 | Xóa lô | Icon 🗑️ | — | — | Xóa dòng lô |
| 10 | Thêm lô | Button | — | — | Thêm dòng lô mới trong kho |
| 11 | Thêm kho hàng | Button | — | — | Thêm khối kho mới |
| 12 | Lưu | Button | — | — | Sinh phiếu **N2 khởi tạo** |
| 13 | Hủy | Button | — | — | Đóng form, không sinh phiếu |

##### 3.1.2b Màn Chi tiết sản phẩm (chỉnh sửa)

Với **dòng kho/lô đã lưu** (đã có N2): khóa ô chọn kho và mã lô, chỉ sửa được số lượng, **không "Thêm lô"**, **không xóa lô**. **Xóa kho** chỉ khả dụng khi kho **chưa phát sinh giao dịch** → xóa kèm phiếu khởi tạo N2 (theo logic hiện có); đã phát sinh → ẩn/vô hiệu. Khối kho **thêm mới** ngay trong màn này (chưa phát sinh) thao tác tự do như màn Thêm. Khi Lưu sinh **phiếu N3/X2 (điều chỉnh)**.

**Nguồn danh sách lô:** danh sách số lô + số lượng hiển thị được lấy từ bảng **`batches_detail`** (bảng tồn theo lô, live) — theo `inventory_id` của sản phẩm ở từng kho, mỗi dòng cho ra 1 lô (`batch_id`) và tồn thực (`on_hand`). Vì mọi lô — kể cả lô thêm sau qua N3 — đều có dòng `batches_detail`, danh sách luôn phản ánh đầy đủ lô hiện có (không phụ thuộc phiếu khởi tạo N2).

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|-----------|------|------------------|---------|-------|
| 1 | Sử dụng lô hàng | Toggle | — | — | Trạng thái theo dõi lô của SP |
| 2 | Kho hàng (dòng đã có) | Dropdown (khóa) | — | — | **Không chọn lại kho** |
| 3 | Số lượng tồn (của kho) | Read-only | — | — | Tự tính = tổng số lượng các lô |
| 4 | Xóa kho | Icon 🗑️ | — | — | **Chỉ khả dụng khi kho chưa phát sinh giao dịch** → xóa kèm phiếu N2 (logic cũ); đã phát sinh → ẩn/vô hiệu |
| 5 | Số lô (dòng đã có) | Read-only (khóa) | — | — | Không đổi mã lô của dòng đã lưu |
| 6 | Ngày sản xuất / Hạn sử dụng | Read-only | — | — | Theo lô đã chọn |
| 7 | Số lượng (của lô) | Number | Theo cấu hình đơn vị/SP | Có | Hiển thị **tồn còn lại thực** (đã trừ bán); sửa được; **không nhỏ hơn lượng đã bán**, không vượt tồn khả dụng |
| 8 | Thêm kho hàng | Button | — | — | Thêm khối kho mới (bên trong thao tác lô tự do như màn Thêm) |
| 9 | Lưu | Button | — | — | Tính chênh lệch → sinh **N3/X2**, cập nhật tồn |
| 10 | Hủy | Button | — | — | Đóng form, **không sinh phiếu** |

#### 3.1.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Mở chỉnh sửa sản phẩm (đang bật lô) | Hiển thị các kho + bảng lô, cột số lượng = **tồn còn lại thực** từng lô (theo logic tồn hiện có); ô chọn kho + mã lô của dòng đã lưu **bị khóa** | SP đã có phân bổ lô |
| 2 | Sửa số lượng của một lô đã có | Cập nhật tạm số tổng của kho; chặn nhập vượt tồn khả dụng / dưới lượng đã bán | — |
| 3 | Bấm "Thêm kho hàng" | Thêm khối kho mới, cho chọn kho (ẩn kho đã dùng); khối mới có "Thêm lô"/"Xóa lô" tự do | — |
| 4 | Trong khối kho **mới thêm**: bấm "Thêm lô", chọn mã lô, nhập SL | Tự điền NSX/HSD; chỉ liệt kê lô còn tồn, chưa hết hạn | Dòng kho đã lưu **không có** "Thêm lô"; mã lô chưa trùng trong cùng kho |
| 5 | Bấm 🗑️ xóa kho | Nếu kho **chưa phát sinh giao dịch** → xóa khối + xóa phiếu khởi tạo N2 (logic cũ); nếu **đã phát sinh** → nút ẩn/vô hiệu | — |
| 6 | Bấm "Lưu" | Tính chênh lệch **từng lô** → **mỗi lô thay đổi sinh 1 phiếu riêng** (N3 nếu tăng, X2 nếu giảm, 1 lô/phiếu, không gom), trong 1 transaction; cập nhật tồn | Có ít nhất 1 chênh lệch ≠ 0 |
| 7 | Bấm "Hủy" | Đóng form, không ghi gì | — |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|-----------|-------------------|-------------------|
| Giảm số lượng lô xuống dưới lượng đã bán/đã xuất (guard) | "Không thể giảm dưới số lượng đã bán của lô {mã lô} ({đã bán})." | Chặn lưu dòng đó |
| Nhập số lượng vượt tồn khả dụng của mã lô (dùng chung nhiều kho) | "Số lượng vượt tồn khả dụng còn lại của lô {mã lô} ({còn lại})." | Chặn, giới hạn về mức tối đa |
| Thêm lô trùng mã lô trong cùng kho (khối kho mới) | "Lô {mã lô} đã tồn tại trong kho này." | Chặn thêm dòng trùng |
| Cố xóa kho đã phát sinh giao dịch (đã bán / đã có N3/X2) | Nút xóa ẩn/vô hiệu; nếu vẫn gọi: "Không thể xóa kho đã phát sinh giao dịch." | Chặn xóa |
| Tồn thực đã thay đổi do bán hàng khi form đang mở (concurrency) | "Tồn của lô {mã lô} đã thay đổi. Vui lòng tải lại số liệu." | Re-check tồn lúc Lưu; không ghi theo số cũ |
| Dòng lô/kho mới để trống (chưa chọn mã lô / SL = 0) | "Vui lòng chọn số lô và nhập số lượng." | Không lưu dòng/kho rỗng, không sinh phiếu |
| Không có thay đổi nào (chênh lệch = 0 toàn bộ) | — (đóng bình thường) | Không sinh phiếu rỗng |
| Người dùng không có quyền tạo phiếu nhập/xuất kho | "Bạn không có quyền điều chỉnh tồn kho." | Chặn lưu thay đổi số lượng |
| Nhập số thập phân với đơn vị chỉ cho số nguyên | "Số lượng phải là số nguyên." | Chặn |

#### 3.1.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện: Sinh phiếu điều chỉnh khi Lưu**
  - **Điều kiện kích hoạt:** Bấm Lưu và có ≥ 1 lô chênh lệch số lượng ≠ 0.
  - **Xử lý:** Duyệt **từng lô** có chênh lệch. **Mỗi lô sinh 1 phiếu riêng** (1 header + 1 detail của đúng lô đó, gắn kho tương ứng): lô tăng → phiếu **N3**, lô giảm → phiếu **X2**. **Không gom** nhiều lô vào 1 phiếu. Giá vốn = **giá vốn hiện tại của sản phẩm**. `business_type_id` = mã **N3** (tăng) / **X2** (giảm) — loại "Sửa tồn kho" — **của công ty sản phẩm**; `description` ghi chú tự do. Cập nhật tồn theo logic hệ thống hiện có. Toàn bộ phiếu của lần Lưu trong **1 transaction** — lỗi ở bất kỳ phiếu nào → rollback tất cả.
  - **Output:** Nhiều phiếu N3/X2 (mỗi lô 1 phiếu) trên `rs_inoutward`; tồn lô/kho cập nhật.

- **Sự kiện: Thêm kho mới (kèm lô) khi sửa**
  - **Điều kiện kích hoạt:** Có khối kho mới (với lô + số lượng > 0) khi Lưu. *(Không thêm lô mới vào kho đã lưu — lô mới của kho hiện có đi qua giao dịch nhập kho.)*
  - **Xử lý:** Ghi nhận là **N3 (nhập điều chỉnh)** cho kho mới — **không** ghi vào detail của N2, **không** tạo N2 thứ hai (mỗi sản phẩm chỉ 1 N2).
  - **Output:** Phiếu N3 cho kho mới.

- **Sự kiện: Tải danh sách lô khi mở màn Chi tiết**
  - **Điều kiện kích hoạt:** Mở chỉnh sửa sản phẩm đang bật theo dõi lô.
  - **Xử lý:** Đọc bảng **`batches_detail`** theo `inventory_id` của sản phẩm ở từng kho → lấy danh sách lô (`batch_id`, NSX, HSD) và tồn thực (`on_hand`) từng lô.
  - **Output:** Bảng lô theo kho trên màn Chi tiết.

- **Sự kiện: Khởi tạo N2 khi TẠO sản phẩm**
  - **Điều kiện kích hoạt:** Tạo mới sản phẩm (màn Thêm) có tồn ban đầu.
  - **Xử lý:** Sinh phiếu **N2 (business_type "Khởi tạo kho")** — gắn với thời điểm tạo SP, liên kết qua `rs_inout_ward_init` (product → phiếu khởi tạo). **Mỗi sản phẩm chỉ 1 N2**. Bật theo dõi lô *sau khi đã tạo SP* **KHÔNG** sinh N2 mới → dùng X2 + N3 (xem Mục 3.3).
  - **Output:** Phiếu N2 (một lần duy nhất/sản phẩm).

---

### 3.2 Phân bổ lại lô (tổng không đổi)

#### 3.2.1 Thông tin chung về chức năng

Cho phép chuyển số lượng giữa **các lô đã có trong cùng một kho** mà **tổng số lượng của kho không đổi**, thực hiện **nhiều lần** (bỏ giới hạn 1 lần của hệ thống hiện tại). Chỉ điều phối giữa các lô sẵn có (màn sửa không thêm lô mới vào kho đã lưu). Mỗi lần phân bổ lại để lại cặp chứng từ điều chỉnh để truy vết lịch sử.

#### 3.2.2 Màn hình chức năng

Dùng chung màn 3.1.2 (không có màn riêng). Người dùng giảm số lượng lô nguồn và tăng số lượng lô đích (hoặc thêm lô đích mới) sao cho tổng của kho giữ nguyên.

#### 3.2.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Giảm số lượng lô A, tăng số lượng lô B (đều là lô đã có trong kho) | Cập nhật số tổng của kho (không đổi) | Tổng kho sau = tổng kho trước |
| 2 | Bấm Lưu | **Mỗi lô 1 phiếu riêng**: lô A giảm → X2, lô B tăng → N3, gắn `type_desc = "Phân bổ lại lô"` (không gom) | Chênh lệch từng lô ≠ 0 |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|-----------|-------------------|-------------------|
| Chuyển từ lô nguồn nhiều hơn tồn khả dụng còn lại | "Lô {mã lô} chỉ còn {còn lại} để phân bổ." | Chặn |
| Tổng kho sau ≠ tổng kho trước | — (không phải phân bổ lại) | Xử lý theo 3.1.4 như sửa tổng (N3/X2 net ≠ 0) |

#### 3.2.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện: Sinh cặp phiếu phân bổ lại**
  - **Điều kiện kích hoạt:** Lưu với `Σ lô sau = Σ lô trước` trong một kho và có lô chênh lệch.
  - **Xử lý:** **Mỗi lô 1 phiếu riêng** — lô giảm → X2, lô tăng → N3 (1 lô/phiếu, không gom), `type_desc = "Phân bổ lại lô"`, trong 1 transaction. Giá vốn theo giá vốn SP hiện tại.
  - **Output:** Cặp phiếu N3/X2; chuỗi phiếu là lịch sử phân bổ (ai, khi nào, từ lô → lô, bao nhiêu).

---

### 3.3 Chuyển đổi sản phẩm non-lô sang theo dõi lô

#### 3.3.1 Thông tin chung về chức năng

Cho phép bật theo dõi lô cho sản phẩm **đang có tồn** ở dạng không theo dõi lô (`inventory.on_hand`), và phân bổ tồn hiện có vào các lô. Đây là **tái phân loại tồn** (non-lô → lô) giữ nguyên tổng tồn, không phải nhập/xuất thật. Vì mỗi sản phẩm chỉ có 1 phiếu khởi tạo N2 (gắn lúc tạo SP), thao tác này **không sinh N2**; hệ ghi dấu vết bằng **X2 (xuất) + N3 (nhập vào lô)**.

#### 3.3.2 Màn hình chức năng

Trên màn Chi tiết sản phẩm, khi bật toggle **"Sử dụng lô hàng"** cho SP đang có tồn non-lô: hiển thị khối kho kèm tồn hiện có (`inventory.on_hand`) và bảng phân bổ lô để ND chia số lượng đó vào các lô. Dùng lại bố cục bảng lô ở Mục 3.1.2.

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|-----------|------|------------------|---------|-------|
| 1 | Sử dụng lô hàng | Toggle | — | Có | Bật để chuyển SP sang theo dõi lô; trigger màn phân bổ |
| 2 | Kho hàng | Read-only | — | — | Kho đang có tồn non-lô (không cho đổi kho) |
| 3 | Tồn cần phân bổ | Read-only | — | — | = `inventory.on_hand` hiện có của kho — đích để đối chiếu tổng phân bổ |
| 4 | Số lô | Dropdown | — | Có | Chọn/tạo lô; chỉ hiện lô còn tồn, chưa quá HSD; chọn xong tự điền NSX/HSD |
| 5 | Ngày sản xuất (NSX) | Read-only | — | — | Tự điền theo lô đã chọn |
| 6 | Hạn sử dụng (HSD) | Read-only | — | — | Tự điền theo lô đã chọn |
| 7 | Số lượng (của lô) | Number | Theo cấu hình đơn vị/SP | Có | Số phân bổ vào lô; cho số thập phân nếu đơn vị/SP bán lẻ |
| 8 | Đã phân bổ / Còn lại | Read-only | — | — | Tổng đã phân bổ vs tồn cần phân bổ; phải khớp mới cho Lưu |
| 9 | Thêm lô | Button | — | — | Thêm dòng lô mới trong kho |
| 10 | Lưu | Button | — | — | Tạo `batches_detail` + ghi X2/N3 (1 transaction) |
| 11 | Hủy | Button | — | — | Đóng form, không ghi gì |

#### 3.3.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Bật toggle "Sử dụng lô hàng" trên màn Chi tiết SP đang có tồn non-lô | Hiện khối kho với "Tồn cần phân bổ" = `inventory.on_hand` từng kho + bảng lô rỗng; ô kho khóa (không đổi kho) | SP chưa theo dõi lô, có tồn |
| 2 | Bấm "Thêm lô" | Thêm 1 dòng lô trống, chờ chọn mã lô | — |
| 3 | Chọn mã lô cho dòng | Tự điền NSX/HSD; chỉ liệt kê lô còn tồn, chưa quá HSD | Mã lô chưa trùng trong cùng kho |
| 4 | Nhập số lượng phân bổ cho lô | Cập nhật "Đã phân bổ / Còn lại"; chặn nếu vượt tồn cần phân bổ | — |
| 5 | Lặp bước 2–4 cho các lô còn lại | Cập nhật liên tục "Đã phân bổ / Còn lại" | Cho tới khi Còn lại = 0 |
| 6 | Bấm "Lưu" | **Upsert `batches_detail`** từng lô (chưa có → tạo mới; đã có → cập nhật `on_hand`) + ghi **1 phiếu X2 (tổng tồn cũ) + N3 mỗi lô 1 phiếu**; giữ nguyên `inventory.on_hand`; 1 transaction; đóng form | "Đã phân bổ" = "Tồn cần phân bổ" |
| 7 | Bấm "Hủy" | Đóng form, không ghi gì; SP giữ trạng thái non-lô | — |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|-----------|-------------------|-------------------|
| Bấm Lưu khi tổng phân bổ ≠ tồn cần phân bổ (thừa/thiếu) | "Tổng số lượng phân bổ vào lô phải bằng tồn hiện có ({tồn})." | Chặn Lưu |
| Nhập số lượng lô vượt tồn cần phân bổ còn lại | "Vượt số lượng còn lại để phân bổ ({còn lại})." | Chặn, giới hạn về mức tối đa |
| Thêm lô trùng mã lô trong cùng kho | "Lô {mã lô} đã tồn tại trong kho này." | Chặn thêm dòng trùng |
| Dòng lô để trống (chưa chọn mã lô / SL = 0) khi Lưu | "Vui lòng chọn số lô và nhập số lượng." | Không lưu dòng rỗng |
| Tồn non-lô đổi do bán khi form đang mở (concurrency) | "Tồn đã thay đổi. Vui lòng tải lại số liệu." | Re-check tồn lúc Lưu; không ghi theo số cũ |
| Tồn non-lô = 0 khi bật lô | "Sản phẩm không còn tồn để phân bổ." | Không có gì để phân bổ; bật lô nhưng không sinh phiếu |
| Tồn non-lô âm (oversold) | "Tồn hiện âm, không thể phân bổ vào lô." | Chặn (xử lý tồn âm trước) |
| Nhập số thập phân với đơn vị chỉ cho số nguyên | "Số lượng phải là số nguyên." | Chặn |

#### 3.3.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện: Chuyển đổi non-lô → lô khi Lưu**
  - **Điều kiện kích hoạt:** Bật theo dõi lô cho SP đang có tồn, tổng phân bổ = tồn non-lô.
  - **Xử lý:** Với mỗi kho:
    1. **Upsert `batches_detail`** cho từng lô: lô **chưa có** dòng `batches_detail` → INSERT (`on_hand` = số lượng vừa nhập của lô); lô **đã có** → UPDATE `on_hand` của lô đó. Tổng các lô = `inventory.on_hand` (giữ nguyên tổng, `inventory.on_hand` không đổi).
    2. Ghi dấu vết chứng từ:
       - **1 phiếu xuất `business_type = X2`** ("Sửa tồn kho"), số lượng = **tổng tồn cũ** (`inventory.on_hand` của kho).
       - **Phiếu nhập `business_type = N3`** ("Sửa tồn kho") — **mỗi lô 1 phiếu**, số lượng = số đã nhập vào lô đó.
       - Giá vốn = giá vốn SP hiện tại.
    3. Toàn bộ trong **1 transaction**. **Không sinh N2**.
  - **Output:** Các dòng `batches_detail` (mới/cập nhật); 1 phiếu X2 + N3 mỗi lô trên `rs_inoutward`.

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|------------------------|---------|-----------------|----------------|
| Giao dịch nhập/xuất kho | Danh sách/chi tiết phiếu kho | Cao | Xuất hiện phiếu N3/X2 tự sinh; phiếu N2 khởi tạo vẫn sửa được tại đây. Guard "không hạ dưới lượng đã bán" áp cả khi sửa N2 ở màn này |
| Quản lý sản phẩm | Chỉnh sửa sản phẩm | Cao | Thêm khả năng sửa tồn theo lô trực tiếp |
| Báo cáo tồn kho theo lô | Báo cáo | Trung bình | Số liệu tồn phản ánh N3/X2; có thể lọc phiếu "Phân bổ lại lô" khỏi nhập/xuất thật qua `type_desc` |
| Phân quyền | Quản lý người dùng/quyền | Trung bình | Cần quyền tạo phiếu nhập/xuất kho để sửa tồn theo lô |
| Bán hàng | POS | Thấp | Concurrency: bán hàng làm biến động tồn lô khi form sửa đang mở → re-check khi Lưu |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---------|----------------|-----------------|----------------|
| — | — | — | Không áp dụng |

---

## Open Questions

Không còn câu hỏi mở — đã kiểm chứng schema DB `easyposbackoffice` (2026-07-31):
- ~~OQ-1~~ **Đóng**: `rs_inoutward` đã có sẵn `type_desc`, `description`, `business_type_id`; không cần bổ sung cột.
- ~~OQ-2~~ **Đóng**: danh sách lô đọc từ `batches_detail` (bảng sống) → mọi lô kể cả phát sinh qua N3 đều hiển thị đủ.
