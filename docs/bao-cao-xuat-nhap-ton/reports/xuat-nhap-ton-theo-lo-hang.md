---
type: srs
feature: bao-cao-xuat-nhap-ton
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-07
updated: 2026-08-07
version: "1.0"
priority: P1
links: [docs/bao-cao-han-su-dung/reports/danh-sach-hang-hoa-theo-lo-han-su-dung.md]
tags: [report, warehouse, batch, inventory]
stale_reason: ""
changelog:
  - 2026-08-07 | /srs | khởi tạo tài liệu báo cáo XNT theo lô hàng
---

# Báo cáo Xuất - Nhập - Tồn kho theo lô hàng

**Mã tài liệu:** SRS-XNT-BATCH-001
**Phiên bản:** 1.0
**Ngày tạo:** 07/08/2026
**Người soạn:** @huelinh (Duong Thi Hue Linh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày | Vị trí | A/M/D | Nguồn gốc | Đầu mối | Mô tả |
|---|---|---|---|---|---|
| 07/08/2026 | Toàn bộ | A | Yêu cầu nội bộ | @huelinh | Khởi tạo tài liệu |

---

## 1. THÔNG TIN CHUNG

| | |
|---|---|
| **Tiêu đề** | Báo cáo Xuất - Nhập - Tồn kho theo lô hàng |
| **Mục đích** | Xem và đối chiếu số lượng, giá trị xuất – nhập – tồn của **từng lô hàng** trong kỳ báo cáo |
| **Chế độ xem** | Báo cáo |
| **Định dạng xuất** | Excel, PDF (khổ A4 ngang) |
| **Phạm vi dữ liệu** | Chỉ các sản phẩm có bật theo dõi tồn kho theo lô (`product.has_batch = 1`) |

Báo cáo này là **biến thể theo lô** của báo cáo "Xuất - Nhập - Tồn kho" hiện có. Khác biệt duy nhất về nghiệp vụ: mỗi dòng không dừng ở mức *sản phẩm + đơn vị tính* mà tách xuống mức *sản phẩm + đơn vị tính + lô hàng*, kèm 2 cột nhận diện lô là **Số lô** và **Hạn sử dụng**.

### 1.1 Phụ thuộc

Báo cáo chỉ cho số liệu đúng khi 2 phần sau đã hoàn thiện:

1. **Nghiệp vụ Nhập kho** — nguồn sinh chứng từ và gán `batch_id` cho từng dòng hàng.
2. **Tính giá xuất kho** — cột giá trị của báo cáo đọc trực tiếp `rs_inoutward_detail.total_cogs`; nếu giá vốn chưa được tính/phân bổ đúng thì mọi cột "Giá trị" đều sai theo.

---

## 2. LUỒNG THAO TÁC

```
        NGƯỜI DÙNG                          HỆ THỐNG
            │
            ▼
   ┌──────────────────┐            ┌──────────────────────────┐
   │ 1. Click chọn    │───────────▶│ 2. Hiển thị droplist DS  │
   │    báo cáo       │            │    các báo cáo nhóm kho  │
   └──────────────────┘            └──────────────────────────┘
            │                                    │
            ▼                                    │
   ┌──────────────────┐            ┌──────────────────────────┐
   │ 3. Chọn "Xuất -  │───────────▶│ 4. Hiển thị báo cáo XNT  │
   │    Nhập - Tồn    │            │    theo lô với bộ lọc    │
   │    kho theo lô"  │            │    mặc định              │
   └──────────────────┘            └──────────────────────────┘
            │                                    │
            ▼                                    │
   ┌──────────────────┐                          │
   │ 5. Thao tác lọc/ │◀─────────────────────────┘
   │    xuất file/    │
   │    xem chi tiết  │
   └──────────────────┘
            │
            ▼
          (kết thúc)
```

**Chi tiết các bước:**

1. Người dùng click menu chọn báo cáo.
2. Hệ thống hiển thị droplist danh sách các báo cáo thuộc nhóm Kho.
3. Người dùng chọn "Báo cáo Xuất - Nhập - Tồn kho theo lô hàng".
4. Hệ thống hiển thị màn hình báo cáo với bộ lọc mặc định (chi nhánh hiện tại, kỳ = Tháng này, kho bán hàng) và tự động nạp dữ liệu.
5. Người dùng thao tác: đổi bộ lọc → bấm *Lấy dữ liệu*, phân trang, hoặc xuất file Excel/PDF.

---

## 3. CHI TIẾT

### 3.1 Bộ lọc tham số

> Giữ nguyên như báo cáo Xuất - Nhập - Tồn kho hiện có, chỉ khác nguồn dữ liệu của popup chọn sản phẩm (xem Mục 3.2).

| STT | Tên trường | Loại control | GT mặc định | Mô tả |
|---|---|---|---|---|
| 1 | Chi nhánh | Combo-box | Chi nhánh hiện tại đang truy cập | - Giá trị: DS chi nhánh được phép truy cập<br>- Cho phép chọn 1<br>- DB: `company.name` |
| 2 | Kỳ báo cáo | Combo-box | Tháng này | Giá trị chọn: hôm nay · hôm qua · tuần này · tuần trước · tháng này · tháng trước · 30 ngày qua · quý này · quý trước · năm nay · năm trước · Tháng 1…Tháng 12 · Tùy chỉnh.<br>Cho phép chọn lại |
| 3 | Từ ngày - Đến ngày | Datepicker | Fill theo kỳ báo cáo | - Cho phép chỉnh sửa lại<br>- Đến ngày ≥ Từ ngày<br>- Từ ngày ≤ Ngày hiện tại |
| 4 | Kho hàng | Combo-box | Kho bán hàng (cửa hàng 1 kho)<br>null (cửa hàng đa kho) | - Giá trị: DS kho hàng của chi nhánh<br>- Cho phép chọn 1<br>- DB: `warehouse.name` (mặc định `warehouse.code = 'WH1'`) |
| 5 | Sản phẩm | Button → popup | Chưa chọn | Click: hiển thị popup chọn sản phẩm (Mục 3.2) |

**Ràng buộc:** Kho hàng là tham số **bắt buộc** — mọi công thức Nhập/Xuất đều xác định theo kho (Mục 3.4). Nếu để trống, hệ thống chặn và báo *"Vui lòng chọn kho hàng"*.

### 3.2 Popup chọn sản phẩm

**Nguồn dữ liệu:** `product p` × `product_product_unit ppu` × `product_unit pu`

**Điều kiện lọc — thay đổi so với báo cáo gốc:**

| | Báo cáo gốc (không lô) | Báo cáo theo lô |
|---|---|---|
| Điều kiện lấy SP | `product.feature IN (1, 5)` | `product.has_batch = 1` |

Chỉ những sản phẩm **có bật theo dõi tồn kho theo lô** mới xuất hiện trong popup. Sản phẩm không theo dõi lô nằm ngoài phạm vi báo cáo này (đã có báo cáo XNT thường phục vụ).

| STT | Tên trường | Loại control | Mô tả |
|---|---|---|---|
| 1 | Tìm kiếm | Textbox | Tìm theo mã hoặc tên sản phẩm của công ty được chọn: `product.code`, `product.name` theo `com_id` |
| 2 | Chọn sản phẩm | Checkbox | Cho phép chọn 1 hoặc nhiều |
| 3 | Chọn tất cả | Button | Click: chọn toàn bộ danh sách sản phẩm |
| 4 | Bỏ chọn tất cả | Button | Hiển thị khi đã chọn ít nhất 1 checkbox |
| 5 | Đã chọn | Text | Hiển thị khi đã chọn ít nhất 1 checkbox. Cú pháp: `Đã chọn + Số_sản_phẩm_được_chọn` |
| 6 | STT | Text | Đánh số theo thứ tự |
| 7 | Mã sản phẩm | Text | `product.code` |
| 8 | Tên SP | Text | `product.name` |
| 9 | Đơn vị tính | Combo-box | - Giá trị: DS đơn vị tính của sản phẩm (`product_product_unit` → `product_unit.name`)<br>- Cho phép chọn 1<br>- Mặc định: đơn vị tính chính (`ppu.is_primary = 1`) |
| 10 | Phân trang | | |

### 3.3 Bảng báo cáo Xuất - Nhập - Tồn theo lô

**Đầu vào:** chi nhánh, kho hàng, kỳ báo cáo (từ ngày a – đến ngày b), danh sách sản phẩm + đơn vị tính đã chọn.

**Đầu ra:** mỗi dòng = **1 sản phẩm + 1 đơn vị tính + 1 lô hàng**. Số lượng và giá trị đều quy về đơn vị tính đã chọn ở popup.

| STT | Tên trường | Công thức / Nguồn | Ghi chú |
|---|---|---|---|
| 1 | STT | Đánh theo STT | |
| 2 | Mã sản phẩm | `p.code` | |
| 3 | Tên sản phẩm | `p.name` | |
| 4 | Đơn vị tính | `pu.unit_name` | ĐVT được chọn ở bộ lọc |
| 5 | Số lô | `batches.code` | Join qua `rs_inoutward_detail.batch_id = batches.id` |
| 6 | HSD | `batches.exp_date` | Hiển thị `dd/MM/yyyy`, **bỏ phần giờ**. NULL → để trống |
| 7 | SL tồn đầu kỳ | Σ`risd.quantity` (nhập) − Σ`risd.quantity` (xuất)<br>**từ khởi tạo đến trước ngày a** | Luỹ kế toàn bộ lịch sử, không giới hạn mốc dưới |
| 8 | Giá trị tồn đầu kỳ | Σ`risd.total_cogs` (nhập) − Σ`risd.total_cogs` (xuất)<br>**từ khởi tạo đến trước ngày a** | |
| 9 | SL nhập trong kỳ | Σ`risd.quantity` (nhập), `rsi.date` trong [a, b] | |
| 10 | Giá trị nhập trong kỳ | Σ`risd.total_cogs` (nhập), `rsi.date` trong [a, b] | |
| 11 | SL xuất trong kỳ | Σ`risd.quantity` (xuất), `rsi.date` trong [a, b] | |
| 12 | Giá trị xuất trong kỳ | Σ`risd.total_cogs` (xuất), `rsi.date` trong [a, b] | |
| 13 | SL tồn cuối kỳ | = (7) + (9) − (11) | Tồn đầu kỳ + Nhập − Xuất |
| 14 | Giá trị tồn cuối kỳ | = (8) + (10) − (12) | GT đầu kỳ + Nhập − Xuất |

**Mốc thời gian:**

- **Tồn đầu kỳ:** `CAST(rsi.date AS date) < a` — mọi chứng từ từ khi khởi tạo đến hết ngày **trước** ngày a.
- **Trong kỳ:** `CAST(rsi.date AS date) BETWEEN a AND b`.

```
 khởi tạo ──────────────────────────┤ a ├──────────── kỳ báo cáo ────────────┤ b ├───▶
 └──────── luỹ kế = Tồn đầu kỳ ─────┘   └─── Nhập trong kỳ / Xuất trong kỳ ───┘
```

**Dòng Tổng (gộp cuối bảng):** Tổng SL tồn đầu kỳ · Tổng GT tồn đầu kỳ · Tổng SL nhập · Tổng GT nhập · Tổng SL xuất · Tổng GT xuất · Tổng SL tồn cuối kỳ · Tổng GT tồn cuối kỳ.

> **Lưu ý:** Tổng cột Số lượng chỉ có ý nghĩa khi các dòng cùng đơn vị tính. Khi báo cáo chứa nhiều ĐVT khác nhau, cột tổng Số lượng mang tính tham khảo; cột tổng Giá trị luôn hợp lệ.

**Phân trang:** áp dụng ở mức dòng (SP + ĐVT + lô).

**Xuất file:** Click → hiển thị menu Excel / PDF.
- Excel: tải xuống bản Excel theo đúng bộ lọc đang áp dụng.
- PDF: tải xuống bản PDF khổ A4 ngang theo đúng bộ lọc đang áp dụng.

### 3.4 Quy tắc xác định Nhập / Xuất theo kho

Đây là quy tắc **cốt lõi** của báo cáo. Loại chứng từ nằm ở bảng cha `rs_inoutward.type`:

| `rsi.type` | Ý nghĩa | Số phiếu trong DB |
|---|---|---|
| 1 | Nhập kho | 326.022 |
| 2 | Xuất kho | 132.453 |
| 3 | Chuyển kho | 306 |

Gọi **X** = `warehouse.id` của kho được chọn ở bộ lọc.

| Chiều | Điều kiện |
|---|---|
| **Nhập tại kho X** | `rsi.type = 1` với kho của dòng = X<br>**hoặc** `rsi.type = 3` với `risd.to_warehouse_id = X` |
| **Xuất tại kho X** | `rsi.type = 2` với kho của dòng = X<br>**hoặc** `rsi.type = 3` với `risd.from_warehouse_id = X` |

**Bản chất phiếu chuyển kho (type = 3):** một phiếu chuyển kho sinh **hai mặt** — kho nguồn ghi nhận **Xuất**, kho đích ghi nhận **Nhập**. Cùng một dòng `rs_inoutward_detail` sẽ xuất hiện ở 2 báo cáo khác nhau tùy kho được chọn.

**Ví dụ:** phiếu CK01 ngày 10/08/2026 chuyển 10 hộp lô LH1 từ Kho A sang Kho B (`from_warehouse_id` = Kho A, `to_warehouse_id` = Kho B):

| Kho được chọn ở bộ lọc | Dòng lô LH1 hiển thị | SL nhập | SL xuất |
|---|---|---|---|
| Kho A | có | 0 | 10 |
| Kho B | có | 10 | 0 |

#### ⚠️ Cảnh báo dữ liệu thực tế — cách xác định "kho của dòng" cho type 1 và 2

Kiểm chứng trên DB `easyposbackoffice` ngày 07/08/2026 cho thấy **phiếu type 1 và type 2 KHÔNG điền `to_warehouse_id`/`from_warehouse_id` theo chiều nghiệp vụ** như tài liệu báo cáo gốc mô tả:

| `rsi.type` | Trạng thái 2 cột kho | Số dòng detail |
|---|---|---|
| 1 (nhập) | `from` SET, `to` NULL | **238.448** |
| 1 (nhập) | `from` SET, `to` SET (2 giá trị **bằng nhau**) | 39.341 |
| 1 (nhập) | `from` NULL, `to` SET | 11.886 |
| 1 (nhập) | cả 2 NULL | 43.362 |
| 2 (xuất) | `from` SET, `to` NULL | **129.448** |
| 2 (xuất) | `from` SET, `to` SET (**bằng nhau**) | 514 |
| 2 (xuất) | cả 2 NULL | 17.587 |
| 3 (chuyển) | `from` SET, `to` SET (**khác nhau**) | 314 |

**Kết luận:**
- Với **type 1 và type 2**, kho tác nghiệp thường được lưu ở `from_warehouse_id` bất kể chiều nhập hay xuất; khi cả 2 cột cùng có giá trị thì chúng **bằng nhau**. Chiều nhập/xuất do `rsi.type` quyết định, **không** do cột kho quyết định.
- Chỉ **type 3** mới dùng `from` ≠ `to` đúng nghĩa kho nguồn → kho đích.

**→ Công thức xác định kho của dòng (áp dụng khi lập trình):**

```
Nhập tại kho X:
    (rsi.type = 1 AND ISNULL(risd.to_warehouse_id, risd.from_warehouse_id) = X)
 OR (rsi.type = 3 AND risd.to_warehouse_id = X)

Xuất tại kho X:
    (rsi.type = 2 AND ISNULL(risd.from_warehouse_id, risd.to_warehouse_id) = X)
 OR (rsi.type = 3 AND risd.from_warehouse_id = X)
```

Nếu chỉ dùng nguyên văn điều kiện `to_warehouse_id = X` cho chiều nhập như tài liệu gốc, báo cáo sẽ **bỏ sót phần lớn phiếu nhập** (riêng nhóm dòng có lô: 5.131 dòng bị sót trên tổng 6.946 dòng type 1).

> **Ghi chú chính tả:** tài liệu báo cáo gốc viết `form_warehouse_id`. Tên cột đúng trong DB là **`from_warehouse_id`**.

### 3.5 Quy tắc quy đổi đơn vị tính

Số lượng trong `rs_inoutward_detail` được ghi theo ĐVT của chứng từ, có thể khác ĐVT người dùng chọn ở báo cáo.

| Trường hợp | Xử lý |
|---|---|
| Sản phẩm không có ĐVT | Lấy dữ liệu theo `product_id`, không quy đổi |
| Dòng có `unit_id = NULL` | Coi như dòng đó dùng **ĐVT chính** của sản phẩm |
| Dòng có `unit_id` khác NULL | Quy đổi tất cả các dòng **về ĐVT chính** trước (`main_quantity` = `quantity` × `convert_rate`), sau đó quy **về ĐVT được chọn** |

Các trường hỗ trợ có sẵn trên dòng chi tiết: `unit_id`, `product_product_unit_id`, `main_unit_id`, `main_unit_name`, `convert_rate`, `main_quantity`.

**Lưu ý:** chỉ **Số lượng** được quy đổi. **Giá trị** (`total_cogs`) là số tiền tuyệt đối của dòng chứng từ, **không nhân/chia theo hệ số quy đổi**.

### 3.6 Quy tắc gom dòng và sắp xếp

- **Khoá gom dòng:** `product_id` + ĐVT được chọn + `batch_id`.
- Chỉ lấy các dòng chi tiết có `batch_id IS NOT NULL`.
- **Sắp xếp mặc định:** Mã sản phẩm tăng dần → HSD tăng dần (lô cận date lên trước) → Số lô tăng dần.
- Lô có `exp_date` NULL xếp **cuối** trong nhóm sản phẩm.

---

## 4. RÀNG BUỘC VÀ TRƯỜNG HỢP ĐẶC BIỆT

| # | Trường hợp | Xử lý |
|---|---|---|
| 1 | Lô không có hạn sử dụng | Cột HSD để trống; dòng vẫn hiển thị đầy đủ số liệu. Trong DB hiện có **1.156/1.598 lô** (72%) chưa nhập `exp_date` → đây là tình huống phổ biến, không phải ngoại lệ hiếm |
| 2 | Lô có tồn đầu kỳ = 0 và không phát sinh trong kỳ | **Không hiển thị** dòng |
| 3 | Lô đã xuất hết trong kỳ (tồn cuối = 0) | **Vẫn hiển thị** — người dùng cần thấy phát sinh xuất trong kỳ |
| 4 | Tồn âm | **Vẫn hiển thị đúng số âm**, không làm tròn về 0. Dữ liệu thật đã ghi nhận tồn âm do bán vượt tồn |
| 5 | Dòng chứng từ không có `batch_id` | Loại khỏi báo cáo. Trong DB có 309 dòng type 1 và 116 dòng type 2 (có lô) mà cả 2 cột kho đều NULL → cũng không quy được về kho nào, bị loại |
| 6 | Sản phẩm bật theo dõi lô giữa kỳ | Giao dịch trước thời điểm bật lô không có `batch_id` → không vào báo cáo, dẫn tới tồn đầu kỳ theo lô có thể nhỏ hơn tồn kho thực tế của sản phẩm |
| 7 | Không có dữ liệu thoả bộ lọc | Hiển thị bảng rỗng kèm thông báo *"Không có dữ liệu"*; dòng Tổng bằng 0 |
| 8 | Chứng từ đã huỷ | Chỉ tính chứng từ `rs_inoutward.status = 1`. Hiện DB có 30 phiếu `status = 0` |

---

## 5. PHỤ LỤC — TỪ ĐIỂN TRƯỜNG DỮ LIỆU

> Đã kiểm chứng trực tiếp trên DB `easyposbackoffice` ngày 07/08/2026.

### 5.1 `rs_inoutward` (chứng từ – bảng cha, bí danh `rsi`)

| Trường | Kiểu | Vai trò trong báo cáo |
|---|---|---|
| `id` | int | Khoá chính, nối với `rs_inoutward_detail.rs_inoutward_id` |
| `com_id` | int | Lọc theo công ty |
| `type` | int | **1 = Nhập, 2 = Xuất, 3 = Chuyển kho** |
| `date` | datetime | Ngày chứng từ — mốc phân kỳ đầu kỳ / trong kỳ |
| `no` | nvarchar | Mã chứng từ |
| `type_desc` | nvarchar | Diễn giải loại chứng từ |
| `status` | bit | 1 = hiệu lực, 0 = huỷ |
| `business_type_id` | int | FK → `business_type` (N1…N4, X1…X4) |

### 5.2 `rs_inoutward_detail` (chi tiết – bí danh `risd`)

| Trường | Kiểu | Vai trò trong báo cáo |
|---|---|---|
| `rs_inoutward_id` | int | FK → chứng từ cha |
| `product_id` | int | Sản phẩm |
| `batch_id` | int | **Lô hàng** — FK → `batches.id`; NULL = không theo lô |
| `quantity` | decimal | **Số lượng** theo ĐVT của dòng chứng từ |
| `total_cogs` | decimal | **Giá trị** (giá vốn) của dòng |
| `from_warehouse_id` | int | Kho xuất (type 3) / kho tác nghiệp (type 1, 2) |
| `to_warehouse_id` | int | Kho nhập (type 3) |
| `unit_id` | int | ĐVT của dòng chứng từ |
| `product_product_unit_id` | int | FK → `product_product_unit` |
| `main_unit_id` / `main_unit_name` | int / nvarchar | ĐVT chính |
| `convert_rate` | decimal | Hệ số quy đổi về ĐVT chính |
| `main_quantity` | decimal | Số lượng đã quy về ĐVT chính |
| `lot_no` | nvarchar | Số lô ghi trên chứng từ (**không dùng** — dùng `batches.code`) |

### 5.3 `batches` (lô hàng)

| Trường | Kiểu | Vai trò trong báo cáo |
|---|---|---|
| `id` | int | Khoá chính |
| `code` | varchar | **Số lô** hiển thị trên báo cáo (VD: LH1, LH2, LH3) |
| `exp_date` | datetime | **Hạn sử dụng** |
| `mfg_date` | datetime | Ngày sản xuất (không dùng ở báo cáo này) |
| `lot_no` | nvarchar | Tên/ghi chú lô, dữ liệu tự do — **không dùng** làm số lô |
| `status` | int | Trạng thái lô |

> **Cảnh báo lệch tài liệu:** báo cáo *"Danh sách hàng hoá theo lô, hạn sử dụng"* đang dùng `batches.lot_no` cho cột Lô, còn báo cáo này dùng `batches.code`. Hai báo cáo sẽ hiển thị giá trị khác nhau cho cùng một lô. Dữ liệu thực tế cho thấy `lot_no` chứa nhiều giá trị không phải mã lô (VD: `"create for update v1"`, `"1"`, `"2"`), nên `code` là lựa chọn đúng. **Cần thống nhất lại hai tài liệu.**

### 5.4 `product` / `product_product_unit` / `product_unit`

| Trường | Vai trò |
|---|---|
| `product.code`, `product.name` | Mã, tên sản phẩm |
| `product.has_batch` | **= 1 → sản phẩm theo dõi tồn theo lô** (DB hiện có 1.201 sản phẩm) |
| `product.feature` | Không dùng làm điều kiện lọc ở báo cáo này |
| `product_product_unit.is_primary` | Xác định ĐVT chính |
| `product_product_unit.convert_rate` | Hệ số quy đổi |
| `product_unit.name` | Tên đơn vị tính |

---

## 6. CÂU HỎI MỞ

| # | Câu hỏi | Trạng thái |
|---|---|---|
| OQ-01 | Phiếu chuyển kho (type = 3) tính vào Nhập/Xuất như thế nào? | ✅ **Đã chốt** — kho nguồn ghi Xuất, kho đích ghi Nhập (Mục 3.4) |
| OQ-02 | Lô đã hết tồn từ trước kỳ và không phát sinh trong kỳ có hiển thị không? | ⏳ Đề xuất: **ẩn** (Mục 4 – TH2). Chờ xác nhận |
| OQ-03 | Lô có HSD trống xếp đầu hay cuối danh sách? | ⏳ Đề xuất: xếp **cuối** nhóm sản phẩm (Mục 3.6). Chờ xác nhận |
| OQ-04 | Có bổ sung bảng "Chi tiết xuất - nhập - tồn theo lô" (drill-down từng chứng từ) như báo cáo gốc không? | ⏳ Chưa có yêu cầu. Nếu cần, làm ở phiên bản sau |
| OQ-05 | `batches.code` vs `batches.lot_no` — thống nhất trường nào là "Số lô" cho toàn hệ thống? | ⏳ Ảnh hưởng cả báo cáo Hạn sử dụng (Mục 5.3) |
