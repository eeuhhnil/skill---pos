# Chương Trình Khuyến Mãi (CTKM) — ver1

---


---

## Thuật ngữ, viết tắt, định nghĩa

| Viết tắt | Định nghĩa |
|---|---|
| CTKM | Chương trình khuyến mãi |
| HKD | Hộ kinh doanh |
| CSDL | Cơ sở dữ liệu |
| KH | Khách hàng |
| SP | Sản phẩm |
| SL | Số lượng |
| KM | Khuyến mại |
| VNĐ | Việt Nam Đồng |
| ND | Người dùng |
| HT | Hệ thống |
| BE | Backend |
| FE | Frontend |
| ĐK | Điều kiện |

---

## 1. Tổng quan

### 1.1. Mục đích

- Thêm 1 số chương trình khuyến mãi cơ bản cho cửa hàng, đáp ứng nhu cầu kinh doanh
- Điều chỉnh, thêm thông tin cho các chương trình khuyến mãi cũ
- Nâng cao trải nghiệm người dùng trong việc cài đặt CTKM thuận tiện, hợp lý

### 1.2. Mục tiêu

- Bổ sung thông tin CTKM hiện tại
- Thêm mới 1 số CTKM mà HKD hay dùng
- Thay đổi giao diện
- CSDL: thay đổi CSDL, cập nhật dữ liệu cũ

### 1.3. Yêu cầu người dùng

| Tác nhân | Yêu cầu người dùng | Độ ưu tiên |
|---|---|---|
| Chủ cửa hàng | Đối với loại hình KM tặng hàng, muốn cấu hình giới hạn SL hàng tặng tự động tăng nếu SL sản phẩm tăng | |
| | Có thể cài đặt tặng hàng hóa cụ thể hoặc theo nhóm để dễ dàng điều chỉnh khi có hàng tặng mới | |
| | Đối với loại hình KM giảm giá, muốn cấu hình giảm giá sản phẩm theo VNĐ hoặc theo % giá trị | |
| | Muốn cài đặt CTKM áp dụng cho sinh nhật KH (ngày / tuần / tháng sinh nhật) | |
| | Muốn giới hạn số lượng áp dụng chương trình cho mỗi khách hàng | |
| | Muốn cài đặt CTKM áp dụng cho từng chi nhánh hoặc nhiều chi nhánh / từng công ty | |
| | Muốn cài đặt CTKM áp dụng cho từng KH, từng thẻ KH hoặc toàn bộ KH | |
| | Muốn cài đặt CTKM được áp dụng gộp cùng nhau hay không | |
| Khách hàng | Muốn được lựa chọn CTKM ưu đãi nhất của cửa hàng | |

### 1.4. Danh sách Use Case

| STT | Tên UC | Độ ưu tiên |
|---|---|---|
| 1 | Cập nhật DB | |
| | Danh sách CTKM | |
| 2 | Lọc CTKM (mới) | |
| 3 | Thêm / Sửa chương trình khuyến mãi (cập nhật + bổ sung) | |
| 4 | Xem chi tiết chương trình khuyến mãi (bổ sung) | |
| 5 | Bán hàng (cập nhật) | |

---

## 2. Cơ sở dữ liệu

### 2.1. Thiết kế

**Quy tắc màu sắc (trong tài liệu gốc):**

| STT | Màu sắc | Ý nghĩa |
|---|---|---|
| 1 | Đen | Cũ, giữ nguyên |
| 2 | Xanh | Thêm mới |
| 3 | Vàng | Thay đổi |
| 4 | Đỏ | Bỏ đi |

**ERD (Entity Relationship Diagram):**

```
bill ──< voucher_usage >── voucher ──< voucher_company >── company
                                  └──< voucher_apply >── customer
                                                      └── logalty_card
```

### 2.2. Chi tiết bảng

#### Bảng `voucher`

**Cập nhật giá trị `type`:**

| Cũ | Mới |
|---|---|
| 100 | 1101 |
| 102 | 1102 |
| 200 | 1201 |

**Thêm thông tin sinh nhật KH vào `ext_time_condition`:**

Sinh nhật KH **không phải type riêng**, được gắn vào type `days` qua trường `is_birthday: true`:

```json
{
  "type": "days",
  "description": "Áp dụng cho các ngày trong tháng",
  "value": [1, 2, 3],
  "is_birthday": true,
  "priority": 2
}
```

**Cấu trúc `diffrent_ext_conditions`:**

```json
{
  "auto_apply_voucher": "true",
  "is_fixed_quantity": "true"
}
```

| Key | Ý nghĩa | Trạng thái |
|---|---|---|
| `auto_apply_voucher` | Tự động áp dụng CTKM khi tạo đơn | Đang dùng |
| `is_fixed_quantity` | Hàng KM không nhân theo SL mua | **Deprecated** — giữ nguyên DB, không dùng; thay bằng `discount_conditions[].is_auto_quantity_increase` |

---

**Cấu trúc `discount_conditions` theo từng loại:**

---

##### 1101 — Mua đơn hàng giảm giá tổng tiền

```json
[
  {
    "min_order_value": 1000,
    "discount_type": 0,
    "discount_percent": 0,
    "percent_discount_max_value": null,
    "discount_value": 10000
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `min_order_value` | Số tiền tối thiểu được áp dụng |
| `discount_type` | Loại giảm giá (0: VNĐ, 1: %) |
| `discount_percent` | Giá trị giảm giá theo % |
| `percent_discount_max_value` | Giá trị tối đa được giảm khi áp dụng % |
| `discount_value` | Giá trị giảm giá theo VNĐ |

---

##### 1102 — Mua đơn hàng tặng hàng

```json
[
  {
    "min_order_value": 1000,
    "gift_quantity": 3,
    "giftt_apply_type": 0,
    "gift_product_ids": [],
    "gift_product_group_ids": [5788, 5786, 5889, 6146, 5711]
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `min_order_value` | Số tiền tối thiểu được áp dụng |
| `gift_quantity` | SL sản phẩm tối đa được tặng |
| `gift_apply_type` | Loại áp dụng (0: nhóm SP, 1: SP) |
| `gift_product_ids` | DS sản phẩm quà tặng |
| `gift_product_group_ids` | DS nhóm sản phẩm quà tặng |

---

##### 1103 — Mua đơn hàng giảm giá sản phẩm

```json
[
  {
    "min_order_value": 1000,
    "discount_type": 0,
    "discount_percent": 0,
    "discount_value": 10000,
    "get_apply_type": 0,
    "get_product_ids": [],
    "get_product_group_ids": [5788, 5786, 5889],
    "get_max_quantity": null
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `min_order_value` | Số tiền tối thiểu được áp dụng |
| `discount_type` | Loại giảm giá (0: VNĐ, 1: %) |
| `discount_percent` | Giá trị giảm giá theo % |
| `discount_value` | Giá trị giảm giá theo VNĐ |
| `get_apply_type` | Loại được KM (0: nhóm SP, 1: SP) |
| `get_product_ids` | DS sản phẩm được KM |
| `get_product_group_ids` | DS nhóm sản phẩm được KM |
| `get_max_quantity` | Số lượng sản phẩm KM tối đa |

---

##### 1201 — Mua hàng giảm giá hàng

```json
[
  {
    "buy_quantity": 3,
    "buy_apply_type": 0,
    "buy_product_group_ids": [5711, 5712, 5888, 6145, 5709],
    "buy_product_ids": [],
    "get_quantity": 3,
    "get_apply_type": 0,
    "get_product_group_ids": [5709, 5890, 6179, 5662],
    "get_product_ids": [],
    "discount_type": 0,
    "discount_percent": 0,
    "discount_value": 10000
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `buy_quantity` | SL mua tối thiểu |
| `buy_apply_type` | Loại áp dụng mua (0: nhóm SP, 1: SP) |
| `buy_product_ids` | DS sản phẩm được áp dụng |
| `buy_product_group_ids` | DS nhóm sản phẩm được áp dụng |
| `get_quantity` | SL KM tối đa |
| `get_apply_type` | Loại được KM (0: nhóm SP, 1: SP) |
| `get_product_ids` | DS sản phẩm được KM |
| `get_product_group_ids` | DS nhóm sản phẩm được KM |
| `discount_type` | Loại giảm giá (0: VNĐ, 1: %) |
| `discount_percent` | Giá trị giảm giá theo % |
| `discount_value` | Giá trị giảm giá theo VNĐ |

---

##### 1202 — Mua hàng tặng hàng

```json
[
  {
    "buy_quantity": 3,
    "buy_apply_type": 0,
    "buy_product_group_ids": [5711, 5712, 5888, 6145, 5709],
    "buy_product_ids": [],
    "gift_quantity": 3,
    "gift_apply_type": 0,
    "gift_product_group_ids": [5709, 5890, 6179, 5662],
    "gift_product_ids": [],
    "is_auto_quantity_increase": false
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `buy_quantity` | SL mua tối thiểu |
| `buy_apply_type` | Loại áp dụng mua (0: nhóm SP, 1: SP) |
| `buy_product_ids` | DS sản phẩm được áp dụng |
| `buy_product_group_ids` | DS nhóm sản phẩm được áp dụng |
| `gift_quantity` | SL tặng tối đa |
| `gift_apply_type` | Loại tặng (0: nhóm SP, 1: SP) |
| `gift_product_ids` | DS sản phẩm tặng |
| `gift_product_group_ids` | DS nhóm sản phẩm tặng |
| `is_auto_quantity_increase` | Tự động nhân SL tặng theo SL mua: `false` = cố định `gift_quantity`; `true` = `floor(actual_buy_qty / buy_quantity) × gift_quantity` |

---

##### 1203 — Áp dụng giá bán theo số lượng

```json
[
  {
    "buy_quantity": 3,
    "buy_apply_type": 0,
    "buy_product_group_ids": [5711, 5712, 5888, 6145, 5709],
    "buy_product_ids": [],
    "discount_type": 2,
    "get_sale_price": 100000,
    "discount_percent": 0,
    "discount_value": 10000
  }
]
```

| Trường | Ý nghĩa |
|---|---|
| `buy_quantity` | SL mua tối thiểu |
| `buy_apply_type` | Loại áp dụng (0: nhóm SP, 1: SP) |
| `buy_product_ids` | DS sản phẩm được áp dụng |
| `buy_product_group_ids` | DS nhóm sản phẩm được áp dụng |
| `discount_type` | Loại KM (0: giảm giá VNĐ, 1: giảm giá %, 2: áp dụng giá sỉ) |
| `get_sale_price` | Giá bán sỉ |
| `discount_percent` | Giảm giá % |
| `discount_value` | Giảm giá VNĐ |

---

#### Bảng `voucher_apply`

**Thay đổi:**
- Bỏ trường `apply_id`
- Cập nhật `apply_type`
- Thêm trường `loyalty_card_id`

| Tên trường | Kiểu DL | Ý nghĩa |
|---|---|---|
| `apply_type` | int | 0: Áp dụng tất cả, 1: Áp dụng thẻ, 2: Áp dụng khách hàng |
| `loyalty_card_id` | int | Mã thẻ khách hàng |

---

#### Bảng `voucher_usage`

**Thay đổi:**
- Bỏ `bill_value`
- Cập nhật `voucher_value`: giá trị được giảm theo CTKM
- Thêm các trường lưu vết

| Tên trường | Kiểu DL | Ý nghĩa |
|---|---|---|
| `discount_conditions` | Text | Lưu cấu hình theo thời điểm mua để truy vết |
| `buy_bill_product_ids[]` | int | Lưu `bill_product_id` sản phẩm được áp dụng CTKM |
| `get_product_ids[]` | int | Lưu `bill_product_id` là dòng sản phẩm khuyến mại |

---

## 3. Cập nhật dữ liệu cũ

### Danh mục `voucher.discount_conditions`

| Loại type | DL mới | Quy tắc update |
|---|---|---|
| **100** | Mảng `[{min_order_value, discount_type, discount_percent, percent_discount_max_value, discount_value}]` | `min_order_value` = cũ; nếu `discount_value=null` → `discount_type=1`; nếu `discount_percent=null` → `discount_type=0`; `percent_discount_max_value=null` |
| **102** | Mảng `[{min_order_value, gift_quantity, gift_apply_type, gift_product_ids, gift_product_group_ids}]` | `gift_apply_type=0` nếu `gift_product_group_ids` khác null; `gift_apply_type=1` nếu `gift_product_ids` khác null |
| **200** | Mảng `[{buy_quantity, buy_apply_type, buy_product_group_ids, buy_product_ids, get_quantity, get_apply_type, get_product_group_ids, get_product_ids, discount_type, discount_percent, discount_value, allow_reward_multiply}]` | Mapping theo quy tắc tương ứng |

### Update bảng `voucher_usage` — thêm bản ghi lịch sử

**Mua sản phẩm – giảm giá sản phẩm (type 1201):**
1. Lấy toàn bộ `bill_product` có:
   - `feature = 1`
   - `voucher_id` khác null
   - `parent_id` khác null
2. Gom theo `(voucher_id, bill_id)` → mỗi nhóm = 1 lần áp CTKM trên 1 đơn hàng
3. Với mỗi nhóm, thêm 1 bản ghi vào `voucher_usage`:
   - `buy_bill_product_ids[]` = `distinct(parent_id)` của nhóm → các SP NV mua để đủ điều kiện
   - `get_product_ids[]` = `id` của tất cả `bill_product` trong nhóm → các SP được giảm giá
   - `voucher_value` = `sum(discount_amount)` của nhóm → tổng tiền giảm

**Mua đơn hàng – tặng sản phẩm (type 1102):**
1. Lấy toàn bộ `bill_product` có:
   - `feature = 2`
   - `voucher_id` khác null
   - `parent_id = null`
2. Gom theo `(voucher_id, bill_id)` → mỗi nhóm = 1 lần áp CTKM trên 1 đơn hàng
3. Với mỗi nhóm, thêm 1 bản ghi vào `voucher_usage`:
   - `buy_bill_product_ids[]` = null → điều kiện dựa trên giá trị đơn hàng, không gắn với SP cụ thể
   - `get_product_ids[]` = `id` của tất cả `bill_product` trong nhóm → các SP được tặng
   - `voucher_value` = `sum(amount)` của nhóm → tổng giá trị hàng tặng

### Migrate `is_auto_quantity_increase` vào `discount_conditions` type 1202

Với mỗi bản ghi `voucher` có `type = 1202`:

1. Đọc `diffrent_ext_conditions.is_fixed_quantity`
2. Áp dụng quy tắc:

| Giá trị `is_fixed_quantity` | → `is_auto_quantity_increase` | Lý do |
|---|---|---|
| `"true"` | `false` | Cố định → không tự tăng |
| `"false"` | `true` | Không cố định → tự tăng |
| Không tồn tại (null / key vắng) | `false` | Default an toàn — tính năng auto-tăng là mới, data cũ mặc định cố định |

3. Cập nhật **từng phần tử** trong mảng `discount_conditions[]` của voucher đó: thêm key `is_auto_quantity_increase` với giá trị tương ứng

> `is_fixed_quantity` trong `diffrent_ext_conditions` giữ nguyên giá trị, không xóa.

---

## 4. Đặc tả chi tiết

### 4.1. Danh sách chương trình khuyến mãi

| Mục | Nội dung |
|---|---|
| Mục Đích | N/A |
| Tác Nhân | N/A |
| Trigger | N/A |
| Tiền Điều Kiện | N/A |
| Hậu Điều Kiện | N/A |
| NF | N/A |
| BR | N/A |

**Mô tả thay đổi:**
- Đổi giao diện
- Bỏ button "Áp dụng", thêm button **Kích hoạt** (với CTKM chưa kích hoạt) và **Bỏ kích hoạt** (với CTKM đang kích hoạt)
- Thêm trường **Hình thức KM**

**Luồng sự kiện chính:**
1. ND click menu "Quản lý voucher"
2. ND click sub-menu "Chương trình khuyến mãi"
3. HT hiển thị màn hình danh sách Chương trình khuyến mãi

**Luồng xử lý hệ thống:**

```
Người dùng → FE: Mở màn hình DS CTKM
FE → BE: GET /promotions?page=1&pageSize=20&filter...
BE: Validate params \ Build query
BE → DB: Query danh sách CTKM
DB → BE: Trả danh sách + tổng bản ghi
BE → FE: Response [data, total, paging]
FE: Render danh sách
```

#### Các thành phần màn hình danh sách

**Danh sách:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | STT | Text | Đánh theo thứ tự |
| 2 | Mã chương trình | Text | `voucher.code` |
| 3 | Tên chương trình | Text | `voucher.name` |
| 4 | Từ ngày | Text | `voucher.start_time`, định dạng DD/MM/YYYY |
| 5 | Đến ngày | Text | `voucher.end_time`, định dạng DD/MM/YYYY |
| 6 | Hình thức | Text | `voucher.type`: 1101/1102/1103/1201/1202/1203 |
| 7 | Trạng thái | Tag | `voucher.status` (bỏ qua status=-1): 0=Không hoạt động, 1=Đang hoạt động |

**Button thao tác bản ghi:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Sửa | button | Click: Hiển thị popup sửa |
| 2 | Xóa | button | Click: Thực hiện xóa |
| 3 | Kích hoạt / Ngừng hoạt động | button | Đổi trạng thái: `voucher.status` 0↔1 |

**Thành phần ngoài danh sách:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Thêm mới | button | Click: Hiển thị popup thêm mới |
| 2 | Lọc | button | Tiêu chí: Trạng thái (Tất cả/Đang hoạt động/Không hoạt động), Hiệu lực (từ ngày – đến ngày) |
| 3 | Thanh tìm kiếm | Textbox | Tìm theo `voucher.code`, `voucher.name`; gọi API khi click tìm kiếm / nhấn Enter |
| 4 | Tìm kiếm | Button | Click: thực hiện tìm kiếm |
| | Phân trang | | Phân trang |

---

### 4.2. Thêm chương trình khuyến mãi

| Mục | Nội dung |
|---|---|
| Mô tả thay đổi | Đổi giao diện; thêm 1 số hình thức KM mới; gộp phạm vi áp dụng vào cùng 1 form |

**So sánh luồng cũ – mới:**

| Hiện tại | Mong muốn |
|---|---|
| (1) Click Thêm mới → (2) Popup → (3) Nhập thông tin → (4) Click thêm mới → (5) Thành công → (6) Hiển thị tab phạm vi áp dụng → (7) Nhập → (8) Xác nhận → (9) Lưu | (1) Click Thêm mới → (2) Popup → (3) Nhập thông tin + phạm vi áp dụng → (4) Click thêm mới → (5) Thành công |

#### Màn hình thêm mới — Thông tin chung

**Thông tin chung:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mã chương trình | Textbox | Bắt buộc; tự động gen `KM+STT` nếu bỏ trống; chỉ nhận chữ số, chữ cái (không dấu, không khoảng trắng, không ký tự đặc biệt); BE: `voucher.code` |
| 2 | Tên chương trình | Textbox | Bắt buộc; free text; BE: `voucher.name` |
| 3 | Từ ngày | Date-picker | DD/MM/YYYY; mặc định ngày hiện tại; BE: `voucher.start_time` |
| 4 | Đến ngày | Date-picker | DD/MM/YYYY; mặc định null; phải ≥ Từ ngày; BE: `voucher.end_time` |
| 5 | Tự động áp dụng khi tạo đơn | Checkbox | Mặc định: false; BE: `voucher.diffrent_ext_conditions/auto_apply_voucher`, `voucher_company.auto_apply` |
| 6 | Áp dụng ngày sinh nhật của KH | Checkbox | Mặc định: false; BE: `ext_time_condition.apply_birthday.value` (0/1) |
| 7 | Giá trị thời gian áp dụng sinh nhật | Drop-down | Ngày / Tuần / Tháng; mặc định: ngày; BE: `ext_time_condition.unit_time` (0/1/2) |
| 8 | Trạng thái | Radio button | Hoạt động / Không hoạt động; mặc định: Hoạt động; bắt buộc; BE: `voucher.status` (0/1) |

**Cài đặt lịch chi tiết:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Ví dụ | Text | "Ví dụ: Chương trình KM chỉ diễn ra vào 18:00–22:00 các ngày thứ Tư trong khoảng thời gian hiệu lực" |
| 2 | Chọn tháng | Drop-down | Tháng 1…12; cho phép chọn nhiều; BE: `ext_time_condition.type="months"` |
| 3 | Chọn thứ | Drop-down | Thứ 2…Chủ nhật; cho phép chọn nhiều; BE: `ext_time_condition.type="days_of_the_week"` |
| 4 | Chọn ngày | Drop-down | Ngày 1…31; cho phép chọn nhiều; BE: `ext_time_condition.type="days"` |
| 5 | Ngoại trừ ngày | Datepicker | Chọn nhiều ngày trên lịch; BE: `ext_time_condition.type="ignore_days"` |
| 6 | Chọn giờ | Time-picker | hh:mm – hh:mm; cho phép nhiều khung giờ; BE: `ext_time_condition.type="time_slots"` |
| 7 | Thêm khung giờ | button | Click: thêm 1 khung giờ |
| 8 | Xóa khung giờ | button | Click: xóa 1 khung giờ |

**Cấu trúc `ext_time_condition` chi tiết:**

> `priority` = thứ tự BE kiểm tra điều kiện — số nhỏ hơn được kiểm tra trước.

```json
[
  {
    "type": "months",
    "description": "Áp dụng cho các tháng trong năm",
    "value": [1, 2],
    "priority": 1
  },
  {
    "type": "ignore_days",
    "description": "Loại trừ các ngày cụ thể (yyyyMMdd)",
    "value": ["20230430", "20230519"],
    "priority": 1
  },
  {
    "type": "days",
    "description": "Áp dụng cho các ngày trong tháng",
    "value": [1, 2, 3],
    "is_birthday": true,
    "priority": 2
  },
  {
    "type": "days_of_the_week",
    "description": "Áp dụng cho các ngày trong tuần",
    "value": ["Wed", "Thu"],
    "priority": 3
  },
  {
    "type": "time_slots",
    "description": "Áp dụng trong các khung giờ (HH-HH)",
    "value": [
      { "from": "10:00", "to": "12:00" },
      { "from": "19:00", "to": "21:00" }
    ],
    "priority": 4
  }
]
```

| Priority | Type | Ghi chú |
|---|---|---|
| 1 | `months` | Kiểm tra tháng áp dụng |
| 1 | `ignore_days` | Kiểm tra ngày loại trừ (cùng mức với months) |
| 2 | `days` | Kiểm tra ngày trong tháng; có `is_birthday: true` nếu áp dụng sinh nhật KH |
| 3 | `days_of_the_week` | Kiểm tra thứ trong tuần |
| 4 | `time_slots` | Kiểm tra khung giờ (kiểm tra sau cùng) |

---

#### Hình thức khuyến mãi

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Hình thức | Combo-box | Bắt buộc; chọn 1; mặc định null; BE: `voucher.type` |

**Giá trị:**

| Giá trị hiển thị | BE (`voucher.type`) |
|---|---|
| Mua đơn hàng – giảm giá đơn hàng | 1101 |
| Mua đơn hàng – tặng sản phẩm | 1102 |
| Mua đơn hàng – giảm giá sản phẩm | 1103 |
| Mua sản phẩm – giảm giá sản phẩm | 1201 |
| Mua sản phẩm – tặng sản phẩm | 1202 |
| Áp dụng giá bán sỉ theo số lượng | 1203 |

> **Điều kiện áp dụng:** Hiển thị theo từng hình thức, BE lưu: `voucher.discount_conditions`

---

#### Điều kiện áp dụng theo từng loại

##### 1101 — Mua đơn hàng – giảm giá đơn hàng

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua từ | Textbox | Số nguyên dương > 0; các giá trị tăng dần, không trùng; bắt buộc; BE: `min_order_value` |
| 2 | Giảm giá | Textbox | % (0-100) hoặc VNĐ > 0; bắt buộc; BE: `discount_percent` / `discount_value` |
| 3 | Loại giảm giá | Button-switch | VNĐ / %; mặc định VNĐ; BE: `discount_type` (0: VNĐ, 1: %) |
| 4 | Giảm tối đa | Textbox | Hiển thị khi chọn %; số nguyên > 0; không bắt buộc; BE: `percent_discount_max_value` |
| 5 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 6 | Thêm điều kiện | button | Click: Thêm điều kiện |

##### 1102 — Mua đơn hàng – tặng sản phẩm

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua từ | Textbox | Bắt buộc; BE: `min_order_value` |
| 2 | Tặng sản phẩm | Combo-box | Cho phép chọn nhiều; bắt buộc; BE: `gift_product_ids` / `gift_product_group_ids` |
| 3 | Loại khuyến mại | Switch-button | Sản phẩm / Nhóm SP; mặc định SP; BE: `giftt_apply_type` (0: nhóm, 1: SP) |
| 4 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 5 | Thêm điều kiện | button | |

##### 1103 — Mua đơn hàng – giảm giá sản phẩm

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua từ | Textbox | Bắt buộc; BE: `min_order_value` |
| 2 | Giảm giá | Textbox | Bắt buộc; BE: `discount_percent` / `discount_value` |
| 3 | Loại giảm giá | Button-switch | VNĐ / %; BE: `discount_type` |
| 4 | Sản phẩm | Combo-box | Cho phép chọn nhiều; bắt buộc; BE: `get_product_ids` / `get_product_group_ids` |
| 5 | Loại khuyến mại | Switch-button | SP / Nhóm SP; BE: `get_apply_type` |
| 6 | Số lượng SP tối đa được áp dụng | Textbox | Số > 0; không bắt buộc; BE: `get_max_quantity` |
| 7 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 8 | Thêm điều kiện | button | |

##### 1201 — Mua sản phẩm – giảm giá sản phẩm

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua sản phẩm | Combo-box | Bắt buộc; BE: `buy_product_ids` / `buy_product_group_ids` |
| 2 | Loại khuyến mại | Button-switch | SP / Nhóm SP; BE: `buy_apply_type` |
| 3 | Số lượng mua tối thiểu | Text-box | Số > 0; mặc định 1; bắt buộc; BE: `buy_quantity` |
| 4 | Giảm giá | Textbox | Bắt buộc; BE: `discount_percent` / `discount_value` |
| 5 | Loại giảm giá | Button-switch | VNĐ / %; BE: `discount_type` |
| 6 | Giảm giá sản phẩm | Combo-box | Bắt buộc; BE: `get_product_ids` / `get_product_group_ids` |
| 7 | Loại khuyến mại | Switch-button | SP / Nhóm SP; BE: `get_apply_type` |
| 8 | Số lượng KM tối đa | Textbox | Số > 0; mặc định 1; bắt buộc; BE: `get_quantity` |
| 9 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 10 | Thêm điều kiện | button | |

##### 1202 — Mua sản phẩm – tặng sản phẩm

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua sản phẩm | Combo-box | Bắt buộc; BE: `buy_product_ids` / `buy_product_group_ids` |
| 2 | Loại khuyến mại | Button-switch | SP / Nhóm SP; BE: `buy_apply_type` |
| 3 | Số lượng mua tối thiểu | Text-box | Số > 0; mặc định 1; bắt buộc; BE: `buy_quantity` |
| 4 | Tặng sản phẩm | Combo-box | Bắt buộc; BE: `gift_product_ids` / `gift_product_group_ids` |
| 5 | Loại khuyến mại | Switch-button | SP / Nhóm SP; BE: `gift_apply_type` |
| 6 | Số lượng tặng | Textbox | Số > 0; mặc định 1; bắt buộc; BE: `gift_quantity` |
| 7 | SL KM tăng theo SL mua | Checkbox | Không bắt buộc; BE: `is_auto_quantity_increase` (0/1) |
| 8 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 9 | Thêm điều kiện | button | |

##### 1203 — Áp dụng giá bán theo số lượng

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Mua sản phẩm | Combo-box | Bắt buộc; BE: `buy_product_ids` / `buy_product_group_ids` |
| 2 | Loại khuyến mại | Button-switch | SP / Nhóm SP; BE: `buy_apply_type` |
| 3 | Số lượng mua | Text-box | Số > 0; mặc định 1; bắt buộc; BE: `buy_quantity` |
| 4 | Giá bán | Switch-button | Giảm giá / Giá bán; mặc định Giá bán; BE: `discount_type` (0: giảm % , 1: giảm VNĐ, 2: giá sỉ) |
| 5 | Giá trị | Textbox | % (0-100) hoặc VNĐ > 0; bắt buộc; BE: `discount_percent` / `discount_value` |
| 6 | Xóa | button | Chỉ hiển thị từ ĐK thứ 2 |
| 7 | Thêm điều kiện | button | |

---

#### Màn hình thêm mới — Phạm vi áp dụng

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Đối tượng áp dụng | Radiobutton | Tất cả KH / Thẻ KH / Khách hàng; mặc định: Tất cả KH; BE: `voucher_apply.apply_type` (0/1/2) |
| 2 | Thẻ khách hàng | Textbox + Popup | Hiển thị khi chọn "Thẻ KH"; popup tìm kiếm tên thẻ; BE: `voucher_apply.loyalty_card_id` |
| 3 | Khách hàng | Textbox + Popup | Hiển thị khi chọn "Khách hàng"; popup tìm kiếm theo tên / mã / SĐT; BE: `voucher_apply.customer_id` |

---

### 4.3. Sửa CTKM

- Tương tự thêm mới
- **Disable hình thức KM** — không cho phép sửa / chọn lại

---

### 4.4. Xem chi tiết CTKM

- Tương tự màn hình thêm mới / sửa
- Chỉ view, không cho phép thao tác

---

### 4.5. Bán hàng

**Nghiệp vụ:**
- ND có thể lựa chọn nhiều CTKM theo cấu hình
- Mỗi 1 CTKM chỉ được phép chọn 1 điều kiện áp dụng nếu thỏa mãn

**Phân tách điểm truy cập CTKM:**

| Nhóm | Điểm truy cập | Types |
|---|---|---|
| CTKM hàng hóa | Click tag quà tặng / KM trên **dòng sản phẩm** trong đơn hàng → hiển thị DS CTKM áp dụng cho SP đó | 1201, 1202 |
| CTKM đơn hàng | **Chi tiết thanh toán → mục Khuyến mãi** → hiển thị DS CTKM đơn hàng | 1101, 1102, 1103, 1203 |

**Luồng thao tác:**
1. ND bán hàng: chọn sản phẩm
2. ND chọn Khuyến mãi
3. HT hiển thị DS CTKM của cửa hàng
4. ND chọn các CTKM (theo cấu hình áp dụng) nếu đơn hàng đủ điều kiện
5. ND click Xác nhận áp dụng
6. HT ghi nhận lựa chọn
7. ND click Thanh toán / Lưu đơn
8. HT thực hiện lưu đơn + CTKM đã chọn

**BE — Điều kiện trả về CTKM hợp lệ:**
- `voucher_apply.apply_type=0`, **hoặc**
- `voucher_apply.apply_type=1` và `voucher_apply.loyalty_card_id = customer_card.card_id`, **hoặc**
- `voucher_apply.apply_type=2` và `voucher_apply.customer_id = customer.id`
- `voucher.status = 1`
- `voucher.start_date <= ngày thanh toán <= voucher.end_date`
- Thỏa mãn lịch `voucher.ext_time_conditions`

**FE:**
- Enable CTKM đạt ít nhất 1 ĐK thỏa mãn
- Disable CTKM không đạt điều kiện

#### Màn hình danh sách CTKM khi bán hàng

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Checkbox / Radio-button | Checkbox / Radio | Checkbox nếu "Áp dụng gộp"; Radio nếu không; tự động chọn nếu đủ ĐK + cài tự động + config gộp = 1 |
| 2 | STT | Text | |
| 3 | Mã CTKM | Text | `voucher.code` |
| 4 | Tên CTKM | Text | `voucher.name` |
| 5 | Hình thức KM | Text | Hiển thị theo `voucher.type` |
| 6 | Thời gian kết thúc | Text | `voucher.end_date` |
| 7 | Lịch chi tiết | button | Hiển thị helptext từ `voucher.ext_time_conditions` |
| 8 | Điều kiện áp dụng | Drop-down | DS điều kiện; mặc định chọn ưu đãi lớn nhất; enable ĐK thỏa mãn, disable ĐK không thỏa mãn |
| 9 | Khuyến mại | Text | Hiển thị KM tương ứng ĐK đã chọn theo từng type |

**Màn hình bán hàng — Tag sản phẩm có quà tặng (type 1202):**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Tag "Quà tặng" | Tag | Nội dung: Quà tặng (SL KM của SP); hiển thị khi SP có KM |
| 2 | Sản phẩm tặng | Text | Hiển thị kèm theo sản phẩm chính |

---

#### Quy tắc FE — Tự động fill điều kiện

| Tình huống | Quy tắc |
|---|---|
| TH1: Đơn không thỏa bất kỳ ĐK nào | Hiển thị CTKM trong danh sách nhưng disable toàn bộ; dropdown điều kiện để trống |
| TH2: Đơn thỏa 1 điều kiện | Mặc định fill ĐK đó |
| TH3: Đơn thỏa ≥2 điều kiện | Mặc định fill ĐK ưu đãi lớn nhất |

**Chi tiết quy tắc TH3 theo từng type:**

| Type | Quy tắc fill TH3 |
|---|---|
| **1101** | 1. HT hiển thị enable DS ĐK thỏa mãn; 2. Tính KM: VNĐ → lấy `discount_value`; % → `discount_percent × bill.amount`, nếu có `percent_discount_max_value` thì lấy `min(KM, percent_discount_max_value)`; 3. Fill ĐK có giá trị KM lớn nhất |
| **1102** | 1. HT hiển thị enable DS ĐK thỏa mãn; 2. Fill ĐK có `min_order_value` cao nhất trong các ĐK thỏa mãn |
| **1103** | 1. HT hiển thị enable DS ĐK thỏa mãn; 2. Fill ĐK có `min_order_value` cao nhất trong các ĐK thỏa mãn; 3. NV chọn SP được giảm giá qua popup |
| **1201** | 1. HT hiển thị enable DS ĐK thỏa mãn; 2. Không auto-pick — để KH/NV tự chọn |
| **1202** | 1. HT hiển thị enable DS ĐK thỏa mãn; 2. Tính `actual_gift` cho mỗi ĐK: `is_auto=1` → `floor(actual_buy_qty / buy_quantity) × gift_quantity`; `is_auto=0` → `gift_quantity`; 3. Fill ĐK có `actual_gift` lớn nhất; nếu bằng nhau → fill ĐK đầu tiên trong mảng |
| **1203** | Hiển thị enable DS ĐK thỏa mãn |

**Nội dung hiển thị cột "Khuyến mại" theo type:**

| Type | Nội dung hiển thị |
|---|---|
| 1101 | `discount_type=0`: "Giảm giá `discount_value` cho đơn hàng từ `min_order_value` đ"; `discount_type=1`: "Giảm giá `discount_percent` tối đa `percent_discount_max_value` đ cho đơn hàng từ `min_order_value` đ" (phần "tối đa `percent_discount_max_value` đ" chỉ hiển thị khi có `percent_discount_max_value`) |
| 1102 | Trước khi chọn: "Tặng `gift_quantity` sản phẩm cho đơn hàng từ `min_order_value` đ"; Sau khi chọn: "Đã chọn x/`gift_quantity` sản phẩm" |
| 1103 | `discount_type=0`: "Giảm `discount_value` đ/SP [sản phẩm*] khi mua từ `min_order_value` đ"; `discount_type=1`: "Giảm `discount_percent`%/SP [sản phẩm*] khi mua từ `min_order_value` đ"; hover [sản phẩm*] → DS SP được giảm |
| 1201 | `discount_type=0`: "Giảm `discount_value` đ [sản phẩm*] khi mua từ `buy_quantity` [sản phẩm**]"; `discount_type=1`: "Giảm `discount_percent`% [sản phẩm*] khi mua từ `buy_quantity` [sản phẩm**]"; hover [sản phẩm*] → DS SP được giảm; hover [sản phẩm**] → DS SP cần mua |
| 1202 | "Tặng `gift_quantity` [sản phẩm*] khi mua từ `buy_quantity` [sản phẩm**]"; hover [sản phẩm*] → DS SP được tặng; hover [sản phẩm**] → DS SP cần mua |
| 1203 | x.xxx VNĐ/1sp (đơn giá sỉ được áp dụng) |

---

#### Popup "Chọn quà tặng khuyến mại" (type 1102, 1202)

Hiển thị khi NV chọn CTKM loại tặng sản phẩm (1102, 1202) để xác nhận sản phẩm tặng cụ thể.

**Tiêu đề popup:** `Chọn quà tặng khuyến mại | {voucher.name}`

**Bộ đếm:** `Đã chọn X/Y quà tặng` — X là tổng SL đã chọn, Y là `gift_quantity` của điều kiện đang áp dụng

**Thành phần bảng sản phẩm:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Checkbox | Checkbox | Chọn / bỏ chọn sản phẩm tặng |
| 2 | STT | Text | Thứ tự trong danh sách |
| 3 | Tên sản phẩm | Text | Tên SP trong danh sách quà tặng của CTKM |
| 4 | Kho hàng | Dropdown | Chọn kho xuất hàng tặng; bắt buộc khi checkbox được tick; mỗi SP chỉ được chọn 1 kho |
| 5 | Tồn kho | Text | SL tồn của SP tại kho đã chọn |
| 6 | Số lượng | Stepper `- n +` | **SP có lô:** click `+` hoặc `-` → mở sub-popup "Chọn lô hàng"; giá trị hiển thị = tổng SL từ các lô đã chọn (read-only, không nhập tay). **SP không lô:** tăng/giảm trực tiếp |

**Quy tắc nghiệp vụ:**
- Mỗi SP chỉ được chọn 1 kho hàng; các SP khác nhau có thể chọn kho khác nhau
- Với SP có lô: cột "Số lượng" chỉ thay đổi thông qua sub-popup "Chọn lô hàng"
- Tổng SL đã chọn không được vượt quá `gift_quantity`

**Nút thao tác:**

| Nút | Hành động |
|---|---|
| Đóng | Đóng popup, không lưu thay đổi |
| Áp dụng | Xác nhận lựa chọn, cập nhật đơn hàng |

---

#### Sub-popup "Chọn lô hàng"

Hiển thị khi NV click stepper `- +` của SP có lô trong popup "Chọn quà tặng khuyến mại".

**Thành phần:**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Tìm kiếm lô hàng | Textbox | Tìm theo tên lô; lọc real-time |
| 2 | Lô hàng | Text | Tên lô + hạn sử dụng (vd: `LH104 : 13/5/2026`); lô đã chọn highlight nền xanh |
| 3 | Số lượng | Stepper | Lô chưa chọn: chỉ hiển thị nút `+`; lô đã chọn: hiển thị đầy đủ `- n +` |
| 4 | Số lượng tồn | Text | Tồn kho của lô |
| 5 | Hủy bỏ | Button | Đóng popup, bỏ mọi thay đổi trong lần mở này |
| 6 | Lưu | Button | Lưu lô đã chọn; cập nhật cột "Số lượng" ở bảng chính = tổng SL các lô |

**Quy tắc nghiệp vụ:**
- Cho phép chọn nhiều lô trong cùng kho đã chọn ở bảng chính
- SL nhập mỗi lô không được vượt quá tồn kho của lô đó
- Click "Hủy bỏ" → giữ nguyên trạng thái trước khi mở sub-popup
- Click "Lưu" → cập nhật tổng SL lên stepper của bảng chính

---

#### Sản phẩm tặng có topping bán kèm (type 1102, 1202)

> **Giá trị trường `feature`:** `1` = hàng bán thường; `2` = hàng KM / tặng (free — trừ tồn kho + reverse khi trả); `3` = dòng KM giảm giá đơn / SP (vd type 1101). SP tặng và mọi SP phụ / thành phần của nó đều lưu `feature=2`.

**Bối cảnh:** Một SP quà tặng có thể có topping bán kèm (vd: tặng trà sữa, trong trà sữa có topping trân châu). Cần cho NV chọn topping cho SP tặng và lưu đúng quan hệ cha–con **nhiều cấp** trong bill.

**Thao tác chọn topping trong popup "Chọn quà tặng khuyến mại":**

| STT | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Chọn topping (Đã chọn: N) | Link | Chỉ hiển thị ở cột "Thao tác" khi SP tặng có cấu hình topping bán kèm; click → mở popup chọn topping (giống luồng chọn topping khi bán hàng); `N` = số topping đã chọn cho SP đó |

**FE gửi xuống BE:**

| Trường hợp | Dữ liệu FE gửi |
|---|---|
| Bán hàng thường (SP có topping) | SP gốc + SP topping (như bán hàng bình thường) |
| Tặng hàng (type 1102, 1202) | SP gốc (`feature=2`) + SP topping (`feature=2`) |

**BE lưu trong bill — quan hệ cha–con nhiều cấp:**

Ví dụ: mua SP A được tặng trà sữa, trà sữa có topping trân châu.

```
A (SP mua)          feature=1, parent_id=NULL,          child_type=NULL, voucher_id=NULL
└─ Trà sữa (quà)    feature=2, parent_id=bill_product.id(A),         child_type=3,    voucher_id=<Id cuat CTKM>
   └─ Trân châu     feature=2, parent_id=bill_product.id(Trà sữa),   child_type=1,    is_topping=1
```

| Dòng bill | feature | parent_id | child_type | Ghi chú |
|---|---|---|---|---|
| SP mua (A) | 1 | NULL | NULL | SP nghiệp vụ mua để đủ điều kiện CTKM |
| SP tặng (trà sữa) | 2 | id(A) | 3 | Quà CTKM, mang `voucher_id` |
| Topping của quà (trân châu) | 2 | id(trà sữa) | 1 | Topping — `parent_id` trỏ tới **SP tặng**, KHÔNG trỏ A |

**Quy tắc lưu:**

| # | Quy tắc |
|---|---|
| 1 | `parent_id` của topping trỏ tới **SP tặng (cha trực tiếp)**, không trỏ SP mua gốc — bill là cây nhiều cấp, không phẳng 2 tầng |
| 2 | `child_type` phân loại theo quan hệ với **cha trực tiếp**: SP tặng = 3 (quà CTKM); topping = 1 (bán kèm). **KHÔNG** gán topping = 3 — sẽ mất thông tin đây là topping |
| 3 | `feature=2` cho **cả** SP tặng lẫn topping của nó — đánh dấu dòng KM để trừ tồn kho + reverse khi trả hàng |
| 4 | Chỉ SP tặng (`child_type=3`) mang `voucher_id` để truy về CTKM; topping không cần |
| 5 | Giá topping của quà = 0 (nằm trong quà tặng) — độc lập với `child_type` |

**Hiển thị màn hình bán hàng:**
- SP tặng hiển thị tag "Quà tặng" (xem mục Tag sản phẩm có quà tặng)
- Topping hiển thị lồng dưới SP tặng

**Trả hàng / hủy:**
- Trả SP tặng → **trả kèm toàn bộ topping** của nó (xóa cả nhánh con của SP tặng)
- Không cho phép trả topping riêng lẻ tách khỏi SP tặng

> `child_type` là trường mới bổ sung cho `bill_product` (từ thiết kế lại `bill_product`: `parent_id` xác định SP phụ kèm theo cha trực tiếp, `child_type` phân loại SP phụ — 1: bán kèm/topping, 2: bảo hành, 3: quà CTKM). Nếu chưa triển khai `child_type`, có thể tạm phân biệt topping qua `is_topping=1`.

---

#### Combo khi được tặng (type 1102, 1202)

**Bối cảnh:** Quà tặng có thể là 1 combo (SP combo + các thành phần). Combo lưu theo cơ chế **riêng** `parent_combo_id`, tách khỏi `parent_id` / `child_type` của topping/quà — thành phần combo nối vào combo header qua `parent_combo_id`, combo header đánh dấu `type=2`.

**Cây bill khi tặng nguyên 1 combo** (vd mua SP A được tặng combo gồm nhiều thành phần):

```
A (SP mua)              feature=1, parent_id=NULL,   parent_combo_id=NULL,       child_type=NULL, type=NULL
└─ Combo (quà, header)  feature=2, parent_id=id(A),  parent_combo_id=NULL,       child_type=3,    type=2,    voucher_id=<mã CTKM>
   ├─ Thành phần 1      feature=2, parent_id=NULL,   parent_combo_id=id(combo),  child_type=NULL, type=NULL
   ├─ Thành phần 2      feature=2, parent_id=NULL,   parent_combo_id=id(combo),  child_type=NULL, type=NULL
   └─ …                 feature=2, parent_id=NULL,   parent_combo_id=id(combo),  child_type=NULL, type=NULL
```

| Dòng bill | feature | parent_id | parent_combo_id | child_type | type | Ghi chú |
|---|---|---|---|---|---|---|
| SP mua (A) | 1 | NULL | NULL | NULL | NULL | SP nghiệp vụ mua để đủ điều kiện |
| Combo header (quà) | 2 | id(A) | NULL | 3 | 2 | Gánh quan hệ "là quà"; mang `voucher_id` |
| Thành phần combo | 2 | NULL | id(combo header) | NULL | NULL | Nối vào header qua `parent_combo_id` |

**Quy tắc:**

| # | Quy tắc |
|---|---|
| 1 | Chỉ **combo header** gắn `parent_id` = SP mua + `child_type=3` + `voucher_id` — header đại diện cho cả combo là quà |
| 2 | **Thành phần combo KHÔNG** gắn `parent_id` / `child_type`; vẫn nối vào header qua `parent_combo_id` (như combo bán thường) |
| 3 | `feature=2` cho **toàn bộ** cụm combo (header + mọi thành phần) — cả cụm là hàng free, để trừ tồn kho + reverse khi trả |
| 4 | Combo dùng cơ chế `parent_combo_id` riêng, **không đụng** `child_type`. `child_type` chỉ dành cho SP phụ nối qua `parent_id` (topping=1, bảo hành=2, quà=3) |

**Trả hàng / hủy combo-quà:**
- Trả combo header → cascade theo **`parent_combo_id`** (kéo theo toàn bộ thành phần), không chỉ theo `parent_id`
- Không cho phép trả riêng lẻ thành phần combo tách khỏi header

---

### 4.6. Hủy hàng / Trả hàng

#### Định nghĩa

| Hành động | Mô tả |
|---|---|
| **Hủy hàng** | Hủy toàn bộ đơn hàng trước khi hoàn tất; luôn hủy toàn bộ, không hủy từng phần |
| **Trả hàng toàn bộ** | Trả lại toàn bộ sản phẩm sau khi đơn đã hoàn tất |
| **Trả hàng một phần** | Trả lại một số sản phẩm sau khi đơn đã hoàn tất |

---

#### Hủy hàng & Trả hàng toàn bộ (tất cả types)

- Xóa toàn bộ `voucher_usage` liên quan đến đơn
- Reverse toàn bộ KM (giá, discount)
- Hàng tặng (`feature=2`) trả lại tồn kho

---

#### Trả hàng một phần — theo từng type

##### 1101 — Mua đơn hàng giảm giá tổng tiền

1. Tính lại `bill.amount` sau trả
2. So sánh với `min_order_value`:
   - Còn ≥ `min_order_value` → tính lại discount; nếu thỏa nhiều tier → lấy tier cao nhất còn thỏa; cập nhật `voucher_usage.voucher_value`
   - < `min_order_value` → xóa `voucher_usage`, bỏ toàn bộ discount

##### 1102 — Mua đơn hàng tặng sản phẩm

1. Tính lại `bill.amount` sau trả
2. So sánh với `min_order_value`:
   - Còn ≥ `min_order_value` → giữ nguyên hàng tặng
   - < `min_order_value` → **bắt buộc trả kèm hàng tặng**; xóa `voucher_usage`
3. Không cho phép trả hàng tặng riêng lẻ mà không trả hàng mua

##### 1103 — Mua đơn hàng giảm giá sản phẩm

1. Tính lại `bill.amount` sau trả
2. So sánh với `min_order_value`:
   - Còn ≥ `min_order_value` → giữ discount
   - < `min_order_value` → bỏ discount toàn bộ SP được KM; cập nhật `voucher_usage`
3. Nếu trả chính SP được giảm giá → bỏ discount của dòng đó; cập nhật `voucher_usage.voucher_value`

##### 1201 — Mua sản phẩm giảm giá sản phẩm

1. Tính lại qty SP mua còn lại (các `bill_product` có `feature=1`, `voucher_id` tương ứng)
2. So sánh với `buy_quantity`:
   - Còn ≥ `buy_quantity` → giữ discount
   - < `buy_quantity` → bỏ discount toàn bộ SP được KM liên quan; cập nhật `voucher_usage`
3. Nếu trả chính SP được giảm giá → bỏ discount của dòng đó; cập nhật `voucher_usage.voucher_value`

##### 1202 — Mua sản phẩm tặng sản phẩm

1. Tính lại qty SP mua còn lại
2. So sánh với `buy_quantity`:
   - Còn ≥ `buy_quantity` → giữ nguyên hàng tặng
   - < `buy_quantity` → **bắt buộc trả kèm hàng tặng**; xóa `voucher_usage`
3. Không cho phép trả hàng tặng riêng lẻ mà không trả hàng mua

##### 1203 — Áp dụng giá bán sỉ theo số lượng

1. Tính lại qty SP còn lại sau trả
2. So sánh với `buy_quantity`:
   - Còn ≥ `buy_quantity` → giữ giá sỉ (hoặc xuống tier thấp hơn nếu có nhiều tier)
   - < `buy_quantity` → hủy giá sỉ; giá bán quay về giá thường; tính lại tổng đơn

---

#### Quy tắc chung — Trả hàng một phần

| # | Quy tắc |
|---|---|
| 1 | Hệ thống tự động kiểm tra lại điều kiện CTKM khi NV tạo phiếu trả |
| 2 | Nếu mất điều kiện → hệ thống thông báo và **bắt buộc trả kèm hàng tặng** (với 1102, 1202) |
| 3 | Không cho phép trả hàng tặng riêng lẻ độc lập với hàng mua |
| 4 | Sau khi xác nhận trả → cập nhật `voucher_usage` tương ứng (xóa hoặc cập nhật `voucher_value`) |

---

### 4.7. Thay thế đơn hàng

**Nghiệp vụ:** Khi NV tạo đơn thay thế từ một đơn gốc (vd: DDH101), hệ thống áp dụng lại CTKM dựa trên **lịch sử `discount_conditions`** đã lưu trong `voucher_usage` của đơn gốc — không dùng cấu hình CTKM hiện tại (live config).

> Lý do: Đơn gốc đã từng áp dụng CTKM → `voucher_usage.discount_conditions` đã lưu snapshot tại thời điểm đó. Đơn thay thế kế thừa chính xác snapshot này để đảm bảo tính nhất quán với giao dịch gốc, bất kể CTKM sau đó có thay đổi hay hết hạn.

**Luồng xử lý:**

1. NV tạo đơn thay thế từ đơn gốc (`bill_id` gốc)
2. HT lấy toàn bộ `voucher_usage` của `bill_id` gốc
3. Với mỗi bản ghi `voucher_usage`:
   - Lấy `discount_conditions` (snapshot) đã lưu
   - Check đơn thay thế có đủ điều kiện theo snapshot đó không
   - Đủ điều kiện → auto-apply CTKM cho đơn thay thế (xử lý như đơn bình thường)
4. Tạo `voucher_usage` mới cho đơn thay thế
5. Void / xóa `voucher_usage` của đơn gốc

**Quy tắc:**

| # | Quy tắc |
|---|---|
| 1 | Luôn dùng `discount_conditions` snapshot từ `voucher_usage` của đơn gốc, không dùng live config |
| 2 | Không cần kiểm tra CTKM còn hiệu lực hay không (`status`, `end_date`) |
| 3 | Nếu đơn thay thế không đủ điều kiện theo snapshot → không áp dụng CTKM đó |
| 4 | Nếu đơn gốc không có `voucher_usage` (không dùng CTKM) → đơn thay thế xử lý như đơn mới bình thường |
