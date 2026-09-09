---
type: srs
feature: hoa-don-mua-vao
status: draft
lang: vi
owner: "@huelinh"
created: 2026-06-22
updated: 2026-06-26
links: []
tags: [mapping, dong-bo-hoa-don, nhap-kho]
changelog:
  - 2026-06-26 | /ba-write-srs | quy tắc ĐVT theo direction: mua vào (1000) bắt buộc external_unit + luôn so khớp; bán ra (1100) không bắt buộc (Mục 2, Bước 2/5, Mục 5, A4)
  - 2026-06-23 | /ba-write-srs | đổi khóa sang external_unit (Cách 2, product_unit_id thành output); thêm direction vào khóa + lookup (1000 mua vào); thêm Mục 7 Hiệu năng & Index; A3 viết lại, thêm A4
  - 2026-06-22 | /ba-write-srs | review feedback (Công Thoại/Huệ Linh): Bước 5 deactivate mapping zombie (trỏ SP đã xóa) ngay khi phát hiện; thêm edge case #13
  - 2026-06-22 | /ba-write-srs | chuyển sang MongoDB: external_code luôn lưu "" (không null/missing) + cảnh báo khác biệt null Mongo vs SQL; partial index + transaction + migration dạng Mongo; type string
  - 2026-06-22 | /ba-write-srs | resolve OQ-2; thêm Mục 5.4 (trùng tên+mã = cùng SP) + 5.5 (override theo dòng, lưu dòng đầu, chống flip-flop); guard ghi mapping ở Bước 8
  - 2026-06-22 | /ba-write-srs | is_active là cờ phiên bản mapping (versioning); đổi sang PARTIAL UNIQUE WHERE is_active=1; Bước 8 hạ active cũ + insert mới; tách P3 khỏi is_active
  - 2026-06-22 | /ba-write-srs | thêm mục Vấn đề hiện tại (As-Is): P1 feature 3,4 / P2 duplicate key / P3 mapping trỏ SP đã xóa
  - 2026-06-22 | /ba-write-srs | làm rõ output (product_id, product_product_unit_id) không vào UNIQUE; logic match dạng 8 bước; thêm A3 (ĐVT 1-1)
  - 2026-06-22 | /ba-write-srs | initial draft cơ chế tự động ghép cặp sản phẩm + external_code vào UNIQUE
---

# Tự động ghép cặp sản phẩm khi đồng bộ hóa đơn mua vào

> Tài liệu đặc tả riêng cho cơ chế **auto-mapping** sản phẩm giữa hóa đơn điện tử từ cơ quan thuế (CQT) và danh mục sản phẩm trong POS, phục vụ luồng lập phiếu nhập kho (Mục 6.4 — tài liệu "Hóa đơn mua vào").

## Bối cảnh — Vấn đề hiện tại (As-Is)

| # | Triệu chứng | Nguyên nhân gốc | Xử lý (trong tài liệu này) |
|---|---|---|---|
| P1 | Mapping chạy cho cả dòng `feature = 3, 4` → lỗi vì không map được | feature 3 (chiết khấu TM theo dòng) và 4 (ghi chú/diễn giải) không phải hàng hóa, không có gì để map | **Bước 1** — chỉ map `feature = 1` |
| P2 | Một phiếu nhập có nhiều dòng cùng tên khác mã, ND map ra các sản phẩm khác nhau → **lỗi duplicate key** | UNIQUE `(com_id, product_unit_id, external_normalized_product_name)` thiếu yếu tố phân biệt → 2 dòng cùng tên đụng khóa | **Mục 3** — thêm `external_code` vào UNIQUE |
| P3 | Mapping cũ trỏ tới ppu/sản phẩm đã bị **xóa hoặc sửa** → auto-map lỗi null | Không kiểm tra sản phẩm còn tồn tại/active trước khi dùng mapping | **Bước 5** — kiểm tra tồn tại + `is_active` trước khi auto-map |

## 1. Mục đích

Khi đồng bộ hóa đơn đầu vào từ thuế, mỗi dòng hàng mang **tên sản phẩm do nhà cung cấp (NCC) đặt** — thường khác với tên sản phẩm trong POS. Hệ thống cần ghi nhớ lựa chọn ghép cặp của người dùng để **lần sau tự động map**, không bắt chọn lại.

Bảng `invoice_product_mapping` đóng vai trò "bộ nhớ ánh xạ": một dòng = một quy ước "tên sản phẩm phía thuế (+ ĐVT + mã hàng NCC) → đúng một mã sản phẩm trong POS".

**Ví dụ:**
- Hóa đơn thuế ghi *"Coca Cola lon 330ml"* (ĐVT: Lon).
- POS lưu là *"Nước ngọt Coca 330ml"* (mã `M100`).
- Lần đầu: người dùng map tay → hệ thống lưu mapping.
- Lần sau gặp lại *"Coca Cola lon 330ml" + Lon* → tự động điền `M100`.

## 2. Cấu trúc bảng `invoice_product_mapping`

| Trường | Kiểu | Bắt buộc | Ý nghĩa |
|--------|------|----------|---------|
| `id` | ObjectId | Có | Khóa chính |
| `com_id` | int | Có | Id công ty (multi-tenant) |
| **`direction`** | **int** | **Có** | **Loại nghiệp vụ — thành phần khóa UNIQUE. `1000` = mua vào → nhập kho; `1100` = bán ra → đơn hàng. Tài liệu này dùng `1000`** |
| `product_id` | int | Có | **Kết quả ghép cặp** — id sản phẩm POS (output, KHÔNG nằm trong UNIQUE) |
| `product_product_unit_id` | int | Có | **Kết quả ghép cặp** — id ppu (sản phẩm × ĐVT); nhập kho vào đúng ppu này (output, KHÔNG nằm trong UNIQUE) |
| `product_unit_id` | int | Có | **Kết quả ghép cặp** — id ĐVT POS (output, KHÔNG nằm trong UNIQUE; chỉ có sau khi map vì lấy qua ppu) |
| `internal_product_name` | string | Có | Tên sản phẩm trong POS (gốc) |
| `internal_normalized_product_name` | string | Có | Tên POS đã chuẩn hóa |
| `external_normalized_product_name` | string | Có | Tên sản phẩm phía thuế đã chuẩn hóa — **thành phần khóa UNIQUE** |
| **`external_unit`** | **string** | **Mua vào (1000): bắt buộc có giá trị. Bán ra (1100): cho phép `""`** | **ĐVT từ thuế (`DVTinh`) đã chuẩn hóa — thành phần khóa UNIQUE. Mua vào phải có ĐVT (nhập kho cần ĐVT để tính tồn); bán ra không bắt buộc** |
| **`external_code`** | **string** | **Có (luôn lưu `""`, KHÔNG null/missing)** | **Mã hàng NCC (`MHHDVu`) — thành phần khóa UNIQUE; NCC không điền → `""`** |
| `is_active` | int | Có | **Cờ phiên bản mapping**: 1 = đang hiệu lực; 0 = lịch sử (đã bị thay bởi mapping mới hơn). KHÔNG phải trạng thái sản phẩm POS |
| `creator` / `updater` | int | | Audit |
| `create_time` / `update_time` | datetime | | Audit |

> Trường `external_code` là **bổ sung mới** so với tài liệu gốc. Nguồn: thẻ XML `HDon\DLHDon\NDHDon\DSHHDVu\HHDVu\MHHDVu` (tương ứng `invoice_product_tax.code`).

## 3. Khóa UNIQUE

> DB: **MongoDB**. `external_code` là `string`, app **luôn set `""`** khi không có mã (không để `null`/thiếu field).

```js
// PARTIAL UNIQUE INDEX — chỉ ràng buộc trên dòng đang hiệu lực (is_active = 1)
db.invoice_product_mapping.createIndex(
  { com_id:1, direction:1, external_normalized_product_name:1, external_unit:1, external_code:1 },
  { unique:true, partialFilterExpression: { is_active: 1 } }
)
```

> **Vì sao PARTIAL chứ không unique thường:** hệ thống giữ lịch sử mapping (mỗi lần đổi map, dòng cũ chỉ bị hạ `is_active = 0` chứ không xóa). Nếu unique thường, dòng cũ (active=0) và dòng mới (active=1) có **cùng giá trị khóa** → ghi dòng mới sẽ **vi phạm unique (lỗi duplicate key)**. Partial index chỉ ràng buộc trên các doc `is_active = 1` → đảm bảo **đúng 1 mapping hiệu lực/khóa**, nhưng cho phép nhiều doc lịch sử.

**Lý do từng thành phần:**

| Thành phần | Vì sao có trong khóa |
|---|---|
| `com_id` | Cô lập dữ liệu theo từng công ty; tránh map đụng chéo tenant |
| `direction` | Bảng dùng chung mua vào (`1000`) và bán ra (`1100`); tách để không lẫn 2 nghiệp vụ |
| `external_normalized_product_name` | Khóa chính theo tên thuế đã chuẩn hóa |
| `external_unit` | Cùng tên nhưng khác ĐVT (Lon vs Thùng) = 2 mapping khác nhau |
| `external_code` | Cho phép **cùng tên thuế map về nhiều mã POS khác nhau**, phân biệt bằng mã hàng NCC |

> **Input vs Output (quan trọng):** mọi thành phần khóa UNIQUE đều **suy ra được từ dòng hóa đơn thuế / ngữ cảnh** lúc tra cứu — KHÔNG cần biết sản phẩm trước:
> - `com_id`, `direction` = ngữ cảnh nghiệp vụ; `external_normalized_product_name`, `external_unit`, `external_code` = lấy thẳng từ XML hóa đơn.
> - Ngược lại `product_id`, `product_product_unit_id`, `product_unit_id` là **kết quả ghép cặp (output)** — **chỉ có sau khi map** (vì lấy qua sản phẩm/ppu). Vì vậy KHÔNG đưa vào khóa: lần đầu chưa map thì chưa hề có các id này; nếu đưa vào sẽ không tra được. Dùng `external_unit` (chuỗi thuế) thay cho `product_unit_id` chính là để tra được ngay từ lần đầu.

**Xử lý mã rỗng (bắt buộc, đặc thù MongoDB):** app **luôn lưu `external_code = ""`** khi NCC không điền mã — KHÔNG để `null` hoặc thiếu field. Lý do:
- Lúc tra cứu, `{ external_code: "" }` **chỉ khớp đúng chuỗi rỗng**, KHÔNG khớp doc `null`/thiếu field. Để hỗn hợp `""` và `missing` → query trượt, tưởng chưa map.
- Partial unique tính `""` và `missing` là **2 khóa khác nhau** → có thể lọt 2 mapping mặc định cho cùng tên.

Khi đã nhất quán `""`:
- NCC **không** điền mã → `external_code = ""` → các doc cùng tên đụng cùng khóa `(…, "")` → index giữ **đúng 1 mapping mặc định theo tên**.
- NCC **có** điền mã → mỗi mã tách thành mapping riêng → lưu được nhiều mapping cùng tên.

> Lưu ý khác biệt với SQL: ở SQL `NULL ≠ NULL` nên nhiều null lọt unique (phải dùng `DEFAULT ''`); ở Mongo `null == null` trong unique index nên null/missing lại bị chặn — nhưng ta **vẫn dùng `""`** để query khớp được và dữ liệu nhất quán.

**Migration dữ liệu cũ** (chuẩn hóa doc thiếu field / null về `""`):
```js
db.invoice_product_mapping.updateMany(
  { $or: [ { external_code: { $exists: false } }, { external_code: null } ] },
  { $set: { external_code: "" } }
)
```

## 4. Logic match khi đồng bộ — các bước

Chạy cho **từng dòng hàng** của hóa đơn.

**Bước 1 — Lọc loại dòng.** Chỉ xử lý dòng `feature = 1` (hàng hóa, dịch vụ thật). Bỏ qua `feature = 2` (khuyến mãi), `3` (chiết khấu TM), `4` (ghi chú/diễn giải).

**Bước 2 — Chuẩn hóa input từ thuế** (toàn bộ lấy từ dòng hóa đơn, KHÔNG cần biết sản phẩm POS):
- `external_normalized_product_name` ← chuẩn hóa tên thuế (`THHDVu`): bỏ dấu, viết thường, trim, gộp khoảng trắng.
- `external_unit` ← chuẩn hóa ĐVT thuế (`DVTinh`): bỏ dấu, viết thường, trim.
  - **Mua vào (1000): `external_unit` BẮT BUỘC có giá trị.** Nếu dòng thuế thiếu ĐVT → cảnh báo / yêu cầu người dùng chọn ĐVT trước khi lập phiếu (vì nhập kho cần ĐVT để tính tồn kho). KHÔNG để `""` cho mua vào.
  - (Bán ra (1100): không bắt buộc → cho phép `""`.)
- `external_code` ← chuẩn hóa `MHHDVu`: trim + uppercase; nếu rỗng/chỉ khoảng trắng → gán `""`.
- `direction = 1000` (cố định cho nghiệp vụ mua vào → nhập kho).

**Bước 3 — Tra cứu mapping** theo khóa đầy đủ `(com_id, direction, external_normalized_product_name, external_unit, external_code)` **và `is_active = 1`**:

```js
db.invoice_product_mapping.findOne({
  com_id, direction: 1000,
  external_normalized_product_name, external_unit, external_code,
  is_active: 1                       // BẮT BUỘC để dùng được partial index
})
```

> Lưu ý: query luôn phải kèm `direction: 1000` và `is_active: 1` — vừa lọc đúng nghiệp vụ mua vào (không lẫn bán ra `1100`), vừa là điều kiện để MongoDB dùng partial unique index (xem Mục 7).

**Bước 4 — Rẽ nhánh theo kết quả tra cứu:**
- Có `external_code` và **tra thấy** → sang Bước 5 (kiểm tra hợp lệ).
- Có `external_code` và **tra không thấy** → **KHÔNG fallback theo tên** → sang Bước 7 (ghép tay). *(Tránh map nhầm âm thầm về mapping mặc định cũ.)*
- `external_code = ''` (không có mã), **tra thấy** → sang Bước 5. *(Đây chính là tầng "theo tên".)*
- `external_code = ''`, **tra không thấy** → sang Bước 7 (ghép tay).

**Bước 5 — Kiểm tra target còn hợp lệ (chống P3).** Mapping tìm được trỏ tới `(product_id, product_product_unit_id)` — kiểm tra:

- `product_id` và `product_product_unit_id` **còn tồn tại** trong POS (chưa bị xóa)? Nếu **không** → mapping đã hỏng:
  1. **Đánh dấu mapping hỏng `is_active = 0` ngay** (vô hiệu hóa, để lần sau không tra trúng và lặp lại vô ích — tránh "mapping zombie").
  2. Sang Bước 7 cho người dùng map lại.
  ```js
  db.invoice_product_mapping.updateOne(
    { _id: staleMapping._id },
    { $set: { is_active: 0, update_time: new Date(), updater: user } }
  )
  ```
- **Mua vào: LUÔN so khớp ĐVT.** `external_unit` đã nằm trong khóa nên tra đã khớp; thêm kiểm tra ĐVT của ppu đích còn đúng với ĐVT thuế. Nếu **lệch** (vd sản phẩm bị sửa ĐVT) → cảnh báo "ĐVT không trùng với ĐVT từ thuế" → cho chọn lại / thêm ĐVT chuyển đổi (Bước 7). *(Bán ra: nếu không có ĐVT thì bỏ qua bước so này.)*

> *Lưu ý phân biệt:* đây là kiểm tra **sản phẩm POS bị xóa/sửa** — khác với `is_active` của mapping đã lọc ở Bước 3. Việc deactivate ở đây thực hiện **ngay khi phát hiện hỏng**, không chờ tới Bước 8 (đề phòng người dùng bỏ qua dòng đó, không map lại → mapping zombie vẫn sống).

**Bước 6 — Auto-map (đường thành công).** Điền cặp kết quả `(product_id, product_product_unit_id)` vào dòng phiếu nhập kho. Người dùng không phải thao tác. **Kết thúc dòng.**

**Bước 7 — Ghép cặp thủ công.** Cảnh báo "Không thấy mặt hàng tương ứng" → người dùng chọn sản phẩm POS (hoặc thêm mới). Lựa chọn xác định cặp `(product_id, product_product_unit_id)` cho **dòng phiếu hiện tại** (override theo dòng — luôn lưu vào chi tiết phiếu).

**Bước 8 — Ghi/cập nhật mapping mặc định (có điều kiện).** Override theo dòng (Bước 7) **không tự động ghi đè** mapping mặc định. Chỉ ghi mapping khi một trong các điều kiện sau:

- Khóa `(com_id, direction, external_normalized_product_name, external_unit, external_code)` **chưa có** dòng `is_active = 1` → lưu lựa chọn của **dòng đầu tiên** xuất hiện (theo `position`) làm mặc định. (Các dòng sau cùng khóa nhưng map khác → chỉ override theo dòng, KHÔNG ghi.)
- Người dùng **chủ động** bấm "Đặt làm mặc định" cho một dòng → đổi hẳn mapping (versioning bên dưới).

> Quy tắc này chống **flip-flop**: nhiều dòng cùng khóa map khác nhau trong 1 phiếu sẽ không liên tục ghi đè lẫn nhau.

Khi ghi mapping, để giữ lịch sử và không vỡ partial unique, thực hiện trong **1 transaction** (MongoDB multi-document transaction):

```js
const key = { com_id, direction: 1000, external_normalized_product_name, external_unit, external_code };

// 1) Hạ phiên bản mapping cũ (nếu có) của cùng khóa
db.invoice_product_mapping.updateMany(
  { ...key, is_active: 1 },
  { $set: { is_active: 0, update_time: new Date(), updater: user } }
);

// 2) Thêm doc mapping mới đang hiệu lực (kèm các id POS kết quả)
db.invoice_product_mapping.insertOne({
  ...key,
  product_id, product_product_unit_id, product_unit_id,
  is_active: 1, create_time: new Date(), creator: user
});
```

> Hạ active cũ **trước** rồi mới insert → tại mọi thời điểm chỉ có 1 doc `is_active = 1`/khóa, partial unique không bị vi phạm. Bọc trong transaction để tránh race giữa các tiến trình đồng bộ song song.

→ Lần đồng bộ sau, dòng này rơi vào Bước 4 (tra thấy, `is_active = 1`) → auto-map.

## 5. Các trường hợp nghiệp vụ

> **Quy tắc ĐVT theo `direction`:** Mua vào (`1000`) **bắt buộc có ĐVT** và **luôn so khớp ĐVT** khi map (vì nhập kho cần ĐVT tính tồn). Bán ra (`1100`) **không bắt buộc** ĐVT (cho phép `""`, không so nếu thiếu).

### 5.1 Trường hợp thường (1-1)
Hóa đơn thuế *"Sản phẩm A"* → POS *"Sản phẩm A"* (`M100`). Lưu 1 mapping; lần sau auto-map. ✅

### 5.2 Nhiều dòng cùng tên, khác mã POS
Hóa đơn thuế có 3 dòng cùng tên *"Sản phẩm A"* + cùng ĐVT, cần map về `M100`, `M200`, `M300`:

| Dòng thuế | Tên | ĐVT | `MHHDVu` (code) | → map ra |
|---|---|---|---|---|
| 1 | Sản phẩm A | Cái | A-001 | M100 |
| 2 | Sản phẩm A | Cái | A-002 | M200 |
| 3 | Sản phẩm A | Cái | A-003 | M300 |

- **Có `MHHDVu` khác nhau** → mỗi dòng là 1 mapping riêng (UNIQUE phân biệt theo `external_code`) → auto-map đúng từng mã. ✅
- **`MHHDVu` rỗng hoặc giống nhau** → không có dấu hiệu phân biệt → auto-map về mapping mặc định (nếu có), người dùng **sửa tay từng dòng** trên màn lập phiếu (override chỉ áp cho phiếu hiện tại).

### 5.3 NCC đổi mã hàng
NCC đổi `MHHDVu` cho cùng sản phẩm (A-001 → A-009) → tra không thấy → coi như sản phẩm mới → người dùng map tay → ghi thêm 1 mapping cho mã mới. Mapping cũ giữ nguyên.

### 5.4 Trùng tên + trùng mã = CÙNG một sản phẩm
Quy luật nghiệp vụ: nếu một dòng trùng cả `external_normalized_product_name` lẫn `external_code` thì đó là **cùng một sản phẩm**. Khác giá / khác lô chỉ là các **đợt nhập khác nhau** của cùng sản phẩm đó.

→ Nhiều dòng `(sp a, 100)` trên cùng phiếu (khác giá/lô) → tất cả auto-map về **cùng `product_id`**, rồi **tách thành nhiều dòng chi tiết** trên phiếu (phân biệt bằng `lot_no` / `unit_price`). Sản phẩm là một; không merge, không cần thêm giá/lô vào khóa.

### 5.5 Xung đột thật (hiếm): trùng khóa nhưng cần map khác sản phẩm
Nếu thực tế vẫn phát sinh 2 dòng cùng khóa `(tên, mã, ĐVT)` mà cần map ra 2 sản phẩm POS khác nhau (B, C) — input giống hệt nhau nên **không thể auto phân biệt**. Xử lý theo **Mức 1 (override theo dòng)**:

- **Override theo dòng:** mỗi dòng giữ sản phẩm riêng trên **chi tiết phiếu** (dòng 1 = B, dòng 2 = C) → đúng cho phiếu hiện tại.
- **Mapping mặc định = dòng đầu:** nếu khóa **chưa có** mapping → lưu lựa chọn của **dòng đầu tiên** (theo `position`) làm mặc định (B). Các dòng sau map khác → **KHÔNG ghi đè** mặc định.
- **Không flip-flop:** sửa lẻ trên phiếu không làm đổi mapping mặc định. Muốn đổi hẳn mặc định phải là hành động riêng ("Đặt làm mặc định").
- **Lần đồng bộ sau:** cả 2 dòng auto về mặc định (B); dòng cần C → người dùng sửa tay lại.

## 6. Edge case & cách chặn

| # | Tình huống | Hậu quả nếu không chặn | Cách chặn |
|---|---|---|---|
| 1 | Lưu nhiều dòng cùng tên khác code mà UNIQUE thiếu `external_code` | Vi phạm UNIQUE, không lưu được | Đưa `external_code` vào UNIQUE (Mục 3) |
| 2 | Có code, tra trượt, fallback theo tên | Auto-map nhầm âm thầm | Không fallback khi có code (Bước 4) |
| 3 | NCC đổi mã hàng | Tạo mapping/sản phẩm trùng | Cho map tay, ghi mapping mới (Mục 5.3) |
| 4 | `external_code` = `null`/missing vs `""` vs khoảng trắng | Query `""` trượt doc null/missing; lọt 2 mapping mặc định | Luôn lưu `""` (Mục 3), migration doc cũ, trim→rỗng = `""` |
| 5 | Code khác nhau chỉ ở hoa/thường/khoảng trắng | Cùng SP bị tách nhiều mapping | Chuẩn hóa code: trim + uppercase (Bước 2) |
| 6 | Dòng `feature` ≠ 1 (chiết khấu/khuyến mãi/ghi chú) | Tra mapping cho thứ không phải hàng hóa | Chỉ match khi `feature = 1` (Bước 1) |
| 7 | `product_id`/ppu mà mapping trỏ tới đã bị xóa trong POS | Map về sản phẩm chết, phiếu lỗi null | Kiểm tra target còn tồn tại (Bước 5) |
| 13 | Mapping hỏng (trỏ SP đã xóa) vẫn `is_active = 1` | Lần nào tra cũng trúng rồi bỏ qua → lặp vô ích mãi | Deactivate `is_active = 0` ngay khi phát hiện ở Bước 5 |
| 8 | ĐVT hóa đơn ≠ ĐVT mapping | Sai số lượng / tồn kho | Khớp ĐVT, lệch → cảnh báo (Bước 5) |
| 9 | 2 tiến trình đồng bộ tạo mapping cùng khóa | Duplicate key / tạo trùng | Hạ active cũ → insert mới trong transaction (Bước 8) |
| 10 | `external_code` quá dài (mã lạ) | Index phình, so khớp chậm | Giới hạn độ dài hợp lý ở app trước khi lưu (Mongo string không cố định độ dài) |
| 11 | Nhiều dòng trùng tuyệt đối (cả code) trên 1 hóa đơn | Nhiều dòng nhập kho trùng | Giữ riêng theo lô/giá hoặc gộp — xem OQ-2 |
| 12 | Re-map cùng khóa nhưng giữ lịch sử (active cũ chưa hạ) | Insert dòng active mới → duplicate key | Partial unique `WHERE is_active = 1` + hạ active cũ trước (Mục 3, Bước 8) |
| 14 | Query mapping thiếu `direction` | Lẫn dữ liệu bán ra (`1100`) vào mua vào | Luôn lọc `direction = 1000` (Bước 3, A4) |
| 15 | Query thiếu `is_active: 1` | Mongo bỏ partial index → quét toàn bộ collection | Luôn kèm `is_active: 1` trong mọi lệnh tra (Mục 7.2) |

## 7. Hiệu năng & Index

### 7.1 Index dùng cho tra cứu
Partial unique index ở Mục 3 vừa **ràng buộc duy nhất** vừa **phục vụ tra cứu**:
```js
{ com_id:1, direction:1, external_normalized_product_name:1, external_unit:1, external_code:1 }
// unique, partialFilterExpression: { is_active: 1 }
```
Query Bước 3 lọc equality trên đúng các trường này → dùng index tra thẳng `O(log n)`, trả 1 doc → tối ưu.

### 7.2 Bắt buộc kèm `is_active: 1` và `direction`
- Partial index chỉ được MongoDB chọn nếu query **chứa `is_active: 1`** (khớp `partialFilterExpression`). Thiếu → Mongo bỏ index, **quét toàn collection** (chậm).
- Luôn kèm `direction: 1000` để (a) lọc đúng nghiệp vụ mua vào, (b) khớp prefix index ngay từ đầu.

### 7.3 Chuẩn hóa sẵn → tra equality, không `$regex`
Tên/ĐVT/mã được chuẩn hóa **trước khi lưu**, nên tra bằng so bằng (`:"coca cola 330ml"`), KHÔNG dùng `$regex`/collation case-insensitive lúc tra (vì `$regex` không tận dụng index tốt).

### 7.4 Đồng bộ nhiều dòng → gom 1 query, đừng N lần
Một hóa đơn có thể 50–100 dòng. Thay vì mỗi dòng một `findOne` (N round-trip), gom **1 query** cho cả hóa đơn:
```js
const keys = lines
  .filter(l => l.feature === 1)
  .map(l => ({
    com_id, direction: 1000,
    external_normalized_product_name: l.name,
    external_unit: l.unit,
    external_code: l.code,           // "" nếu không mã
    is_active: 1
  }));
const found = db.invoice_product_mapping.find({ $or: keys }).toArray();
// map kết quả về từng dòng trong bộ nhớ
```
→ Từ ~100 round-trip xuống 1; mỗi nhánh `$or` vẫn dùng compound index.

### 7.5 Partial index nhẹ hơn
Index chỉ chứa doc `is_active = 1` (bỏ qua lịch sử) → nhỏ gọn, dễ nằm trong RAM, tra nhanh hơn.

## 8. Giả định (Assumptions)

- **A1 — Không dùng `seller_tax_code` trong khóa.** Chấp nhận giả định mã hàng NCC (`MHHDVu`) đủ phân biệt sản phẩm trong phạm vi 1 công ty. **Rủi ro:** nếu 2 NCC khác nhau dùng trùng một mã (vd cùng "A-001") cho 2 sản phẩm khác nhau, mapping sẽ đụng chéo. Quyết định bởi `@huelinh` ngày 2026-06-22.
- **A2 — Chuẩn hóa tên** (`*_normalized_*`) là bản tên bỏ dấu, viết thường, trim, gộp khoảng trắng. Quy tắc chuẩn hóa cụ thể thống nhất cùng dev.
- **A3 — Khóa dùng `external_unit` (chuỗi ĐVT thuế), KHÔNG dùng `product_unit_id`.** Vì `product_unit_id` là id POS lấy qua sản phẩm/ppu → chỉ có **sau khi** map, không thể đưa vào khóa tra cứu lần đầu. Dùng chuỗi `external_unit` chuẩn hóa (lấy thẳng từ thuế) để tra được ngay. Chuẩn hóa ĐVT (bỏ dấu/thường/trim) cần thống nhất cùng dev để cùng một ĐVT không bị tách (vd "Lon" vs "lon"). Cập nhật theo phản hồi `@huelinh` ngày 2026-06-23.
- **A4 — Bảng dùng chung qua `direction`.** `invoice_product_mapping` chứa cả mapping mua vào (`direction = 1000`) lẫn bán ra (`direction = 1100`). Mọi truy vấn/ràng buộc của nghiệp vụ mua vào đều phải kèm `direction = 1000`. **Quy tắc ĐVT khác nhau:** mua vào bắt buộc có `external_unit` (không `""`) và luôn so khớp ĐVT; bán ra không bắt buộc (cho phép `""`). Xác nhận bởi `@huelinh` ngày 2026-06-26.

## 9. Open Questions

- [ ] OQ-1: Quy tắc chuẩn hóa `external_code` có bỏ số 0 đầu (zero-pad) không? (vd "001" ≡ "1"?)
- [x] OQ-2: ~~Nhiều dòng trùng tuyệt đối (cùng tên + ĐVT + code) trên cùng 1 hóa đơn → gộp hay giữ riêng theo lô/giá?~~ **Resolved (2026-06-22):** trùng tên+mã = cùng sản phẩm → giữ riêng từng dòng chi tiết theo lô/giá, cùng một `product_id` (Mục 5.4). Trường hợp hiếm cần map khác sản phẩm → override theo dòng, lưu dòng đầu làm mặc định (Mục 5.5, Bước 8).
- [ ] OQ-3: Khi A1 xảy ra đụng chéo NCC trong thực tế, có nâng cấp thêm `seller_tax_code` vào khóa không?
