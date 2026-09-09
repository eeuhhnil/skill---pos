---
type: api-doc
feature: cau-hinh-api
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-14
updated: 2026-08-14
links: [docs/cau-hinh-api/api/sale-config.md, docs/cau-hinh-api/api/product-config.md]
tags: [config, api, gas]
changelog:
  - 2026-08-14 | manual | tách update-gaslog-config khỏi update-sale-config, đặc tả request/response
---

# API Cấu hình Nhật ký gas

## 1. Tổng quan

Endpoint này được tách ra từ `/api/client/page/config/update-sale-config`. Hai field cấu hình nhật ký gas trước đây đi chung với 37 field của màn Sản phẩm và màn Bán hàng, dù thuộc nghiệp vụ xăng dầu và không liên quan tới hai màn đó.

| Màn | Endpoint | Số field |
|---|---|---|
| Cấu hình nhật ký gas | `POST /api/client/page/config/update-gaslog-config` | 2 |
| Cấu hình > Sản phẩm | `POST /api/client/page/config/update-product-config` | 5 |
| Cấu hình > Bán hàng | `POST /api/client/page/config/update-sale-config` | 16 |

Đặc tả hai endpoint còn lại tại [product-config.md](product-config.md) và [sale-config.md](sale-config.md).

Đây là endpoint có dữ liệu hỏng nặng nhất trong nhóm cấu hình, xem Mục 5.

---

## 2. Cập nhật cấu hình nhật ký gas

### 2.1 Thông tin chung

| Hạng mục | Giá trị |
|---|---|
| Method | `POST` |
| URL | `/api/client/page/config/update-gaslog-config` |
| Xác thực | Bearer token, bắt buộc |
| Content-Type | `application/json` |
| Phạm vi tác động | Chi nhánh hiện tại, xác định theo token |

**Header**

| Tên | Bắt buộc | Mô tả |
|---|---|---|
| `Authorization` | Có | `Bearer <access_token>` |
| `Content-Type` | Có | `application/json` |

### 2.2 Request body

| Field | Kiểu | Bắt buộc | Giá trị hợp lệ | Mô tả | Control trên màn | Khóa lưu |
|---|---|---|---|---|---|---|
| `visibleDeleteGasLog` | int | Có | `0` \| `1` | Hiển thị chức năng xóa nhật ký. `0` = Không hiển thị, `1` = Hiển thị | Radio | `visible_delete_gas_log` |
| `visibleWarnGasLog` | int | Có | `0` \| `1` | Hiển thị cảnh báo trùng nhật ký. `0` = Không hiển thị, `1` = Hiển thị | Radio | `visible_warn_gas_log` |

**Ràng buộc bổ sung**

| # | Quy tắc |
|---|---|
| 1 | Request phải chứa **đủ cả 2 field**. Thiếu field nào thì từ chối, không hiểu là "giữ nguyên giá trị cũ" |
| 2 | Request **không được chứa field ngoài danh sách trên**, kể cả `comId` |
| 3 | `comId` lấy từ token, không nhận từ request |
| 4 | Chỉ nhận kiểu số nguyên. Chuỗi, mảng hay object đều bị từ chối, kể cả khi nội dung quy đổi được về `0` hoặc `1` |

Quy tắc 4 không thừa. Dữ liệu hiện có cho thấy hai khóa này từng bị ghi cả chuỗi ký tự lẫn mảng JSON, xem Mục 5.1.

### 2.3 Ví dụ request

```json
{
  "visibleDeleteGasLog": 0,
  "visibleWarnGasLog": 1
}
```

### 2.4 Response thành công

**HTTP 200**

| Field | Kiểu | Mô tả |
|---|---|---|
| `status` | boolean | `true` khi xử lý thành công |
| `reason` | string | Diễn giải kết quả |
| `message` | array | Danh sách thông báo, mỗi phần tử gồm `code` và `message` |
| `data` | object | Trạng thái cấu hình **sau khi lưu**, gồm đúng 2 field của request |
| `count` | int \| null | Không dùng cho endpoint này |

```json
{
  "message": [
    {
      "code": "SUCCESS",
      "message": "Cập nhật cấu hình nhật ký gas thành công"
    }
  ],
  "reason": "Cập nhật cấu hình nhật ký gas thành công",
  "status": true,
  "data": {
    "visibleDeleteGasLog": 0,
    "visibleWarnGasLog": 1
  },
  "count": null
}
```

### 2.5 Mã lỗi

Envelope lỗi theo đúng mẫu chung của hệ thống: `status = false`, `data = null`, `count = null`, `reason` lặp lại nội dung của phần tử đầu trong `message`.

| Mã | HTTP | Điều kiện phát sinh | Thông báo |
|---|---|---|---|
| `CONFIG_FIELD_NOT_ALLOWED` | 400 | Request chứa field không thuộc endpoint này | Trường `{tên}` không thuộc cấu hình nhật ký gas |
| `CONFIG_FIELD_REQUIRED` | 400 | Thiếu field bắt buộc | Thiếu trường bắt buộc `{tên}` |
| `CONFIG_FIELD_INVALID_VALUE` | 400 | Sai kiểu dữ liệu hoặc giá trị ngoài `0` và `1` | Giá trị của `{tên}` không hợp lệ |
| (theo mã chung của hệ thống) | 401 | Token thiếu hoặc hết hạn | Phiên đăng nhập đã hết hạn |
| (theo mã chung của hệ thống) | 403 | Tài khoản không có quyền sửa cấu hình | Bạn không có quyền thực hiện thao tác này |

Ba mã `CONFIG_*` dùng chung cho mọi endpoint cấu hình. Endpoint này không phát sinh mã riêng.

**Ví dụ response lỗi**

```json
{
  "message": [
    {
      "code": "CONFIG_FIELD_INVALID_VALUE",
      "message": "Giá trị của visibleWarnGasLog không hợp lệ"
    }
  ],
  "reason": "Giá trị của visibleWarnGasLog không hợp lệ",
  "status": false,
  "data": null,
  "count": null
}
```

---

## 3. Quy tắc áp dụng

| # | Quy tắc | Lý do |
|---|---|---|
| 1 | Mỗi màn cấu hình có endpoint riêng, không dùng chung | Phân quyền, kiểm tra dữ liệu và nhật ký chỉnh sửa tách bạch theo màn |
| 2 | Chỉ nhận field nằm trong danh sách của endpoint, field lạ trả `400` | Chặn việc sửa dữ liệu của màn khác qua endpoint không liên quan |
| 3 | Gửi trọn nhóm field, không gửi từng phần | Bỏ hẳn cách hiểu "field vắng mặt nghĩa là giữ nguyên" |
| 4 | `comId` lấy từ token, không nhận từ request | Chặn khả năng sửa cấu hình của chi nhánh khác bằng cách đổi số trong request |
| 5 | Kiểm tra kiểu dữ liệu trước khi ghi | Chặn việc ghi giá trị của khóa khác vào khóa này, xem Mục 5.1 |

---

## 4. Thay đổi so với hiện tại

| Field | Trước | Sau |
|---|---|---|
| `visibleDeleteGasLog` | `update-sale-config` | `update-gaslog-config` |
| `visibleWarnGasLog` | `update-sale-config` | `update-gaslog-config` |

**Thứ tự triển khai**

| Bước | Việc | Bên thực hiện |
|---|---|---|
| 1 | Dọn dữ liệu hỏng của hai khóa, xem Mục 5.1 | BE |
| 2 | Mở endpoint mới, nhận 2 field, kiểm tra kiểu dữ liệu | BE |
| 3 | Màn cấu hình nhật ký gas chuyển sang gọi endpoint mới | FE |
| 4 | Ứng dụng di động cập nhật theo, nếu có gọi endpoint cũ | Mobile |
| 5 | Gỡ 2 field khỏi `update-sale-config`, bật kiểm tra field lạ | BE |

Bước 1 đặt lên đầu vì có công ty đang lưu giá trị không phải số. Nếu mở endpoint mới mà chưa dọn, màn cấu hình đọc lên sẽ hỏng ngay lần đầu người dùng mở.

---

## 5. Ghi chú triển khai

### 5.1 Dữ liệu hiện có đang hỏng

Đây là hai khóa có tỷ lệ dữ liệu sai cao nhất trong toàn bộ nhóm cấu hình.

| Khóa | Giá trị đang lưu | Số công ty | Đánh giá |
|---|---|---|---|
| `visible_warn_gas_log` | `1` | 496 | Hợp lệ |
| | `0` | 12 | Hợp lệ |
| | `1C26MTT` — ký hiệu mẫu hóa đơn | **21** | Sai |
| | Nguyên mảng JSON cấu hình menu, bắt đầu bằng `[{"code":"HOME",…` | **10** | Sai |
| `visible_delete_gas_log` | `0` | 1.019 | Hợp lệ |
| | `1` | 2 | Hợp lệ |
| | `1C26MTT` | 2 | Sai |
| | Nguyên mảng JSON cấu hình menu | 2 | Sai |

Tổng cộng **35 công ty** đang lưu giá trị không phải số ở một trong hai khóa. Riêng nhóm 12 công ty mang mảng menu, giao diện đọc lên sẽ nhận một mảng thay vì số — chức năng cảnh báo trùng nhật ký và nút xóa nhật ký gần như chắc chắn đang không hoạt động đúng ở các cửa hàng này.

**Hướng dọn:** đưa mọi giá trị không thuộc `0` và `1` về mặc định `0`, sau đó thông báo cho các cửa hàng liên quan đặt lại theo nhu cầu.

### 5.2 Vì sao dữ liệu hỏng theo cách này

Giá trị của mảng menu nằm trong khóa `display_config`. Việc nội dung của khóa đó xuất hiện trong `visible_warn_gas_log` chỉ có thể xảy ra khi một request mang cả cụm cấu hình, phía máy chủ lặp ghi từng khóa mà không kiểm tra kiểu, và giá trị bị gán lệch khóa.

Tương tự, chuỗi `1C26MTT` là ký hiệu mẫu hóa đơn, không có lý do nghiệp vụ nào để nằm trong một cờ hiển thị.

Hệ thống còn một chuỗi rác thứ hai là `1C26THA`, ghi vào 64 trong tổng số 75 bản ghi cấu hình của công ty `9915` chỉ trong một lần lưu. Hai sự cố riêng biệt, cùng một nguyên nhân.

Đây là căn cứ chính cho quy tắc 2 và quy tắc 5 tại Mục 3: chỉ nhận field trong danh sách, và kiểm tra kiểu trước khi ghi.

### 5.3 Lấy dữ liệu cho màn

Màn cấu hình nhật ký gas hiện đọc dữ liệu từ API lấy cấu hình chung. Việc có tách endpoint đọc riêng hay không chưa được quyết định, nằm ngoài phạm vi tài liệu này.

---

## 6. Câu hỏi mở

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | Bốn khóa xăng dầu khác có thuộc cùng màn này không: `edit_product_gaslog_bill` (cho sửa thông tin gasLog khi tạo đơn), `gas_invoice` (đẩy cột bơm, lượt bơm, thời gian bơm lên EasyInvoice), `default_product` và `default_user` (gán theo trụ bơm hay vòi bơm) | Nếu cùng màn thì gộp vào endpoint này, nếu khác màn thì tách endpoint riêng |
| 2 | Bảng `dbo.gas_config` có 11 khóa riêng cho việc tự động tạo đơn xăng dầu, hiện chưa có endpoint nào trong nhóm cấu hình quản lý | Xác định màn nào phụ trách, có cần tài liệu API riêng không |
| 3 | Ứng dụng di động có gọi `update-sale-config` không? | Quyết định độ dài giai đoạn chạy song song trước khi gỡ 2 field khỏi endpoint cũ |
