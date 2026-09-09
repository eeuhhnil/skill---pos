---
type: api-doc
feature: cau-hinh-api
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-14
updated: 2026-08-14
links: []
tags: [config, api, product]
changelog:
  - 2026-08-14 | manual | điền nhãn specialItemType từ mô tả trong bảng config
  - 2026-08-14 | manual | đổi mã lỗi sang quy ước SCREAMING_SNAKE_CASE của hệ thống
  - 2026-08-14 | manual | tách update-product-config khỏi update-sale-config, đặc tả request/response
---

# API Cấu hình Sản phẩm

## 1. Tổng quan

Endpoint này được tách ra từ `/api/client/page/config/update-sale-config`. Trước khi tách, một endpoint duy nhất phục vụ cả màn **Cấu hình > Sản phẩm** lẫn màn **Cấu hình > Bán hàng**, nhận 39 field cho cả hai màn trong cùng một request.

Sau khi tách, mỗi màn có endpoint riêng và chỉ nhận đúng các field thuộc màn đó.

| Màn | Endpoint | Số field |
|---|---|---|
| Cấu hình > Sản phẩm | `POST /api/client/page/config/update-product-config` | 5 |
| Cấu hình > Bán hàng | `POST /api/client/page/config/update-sale-config` | 15 |

Tài liệu này đặc tả endpoint Sản phẩm. Endpoint Bán hàng đặc tả riêng.

### Phạm vi dữ liệu

Endpoint chỉ ghi 5 khóa cấu hình của màn Sản phẩm. Mọi khóa khác — kể cả khóa đang có mặt trong request của `update-sale-config` hiện tại — đều nằm ngoài phạm vi và bị từ chối.

---

## 2. Cập nhật cấu hình sản phẩm

### 2.1 Thông tin chung

| Hạng mục | Giá trị |
|---|---|
| Method | `POST` |
| URL | `/api/client/page/config/update-product-config` |
| Xác thực | Bearer token, bắt buộc |
| Content-Type | `application/json` |
| Phạm vi tác động | Chi nhánh hiện tại, xác định theo token |

**Header**

| Tên | Bắt buộc | Mô tả |
|---|---|---|
| `Authorization` | Có | `Bearer <access_token>` |
| `Content-Type` | Có | `application/json` |

### 2.2 Request body

| Field | Kiểu | Bắt buộc | Giá trị hợp lệ | Mô tả | Control trên màn | Khóa trong bảng `config` |
|---|---|---|---|---|---|---|
| `batchManger` | int | Có | `0` \| `1` | Quản lý kho sản phẩm theo số lô và hạn dùng. `0` = Không áp dụng, `1` = Áp dụng | Radio | `is_batch_and_expiry_managed` |
| `isImeiSerialManagement` | int | Có | `0` \| `1` | Quản lý sản phẩm theo IMEI / Serial. `0` = Không áp dụng, `1` = Áp dụng | Radio | `is_imei_serial_management` |
| `isWarrantyManaged` | int | Có | `0` \| `1` | Quản lý bảo hành sản phẩm. `0` = Không áp dụng, `1` = Áp dụng | Radio | `is_warranty_managed` |
| `autoGenerateBarcode` | int | Có | `0` \| `1` | Tự động sinh mã barcode khi lưu sản phẩm. `0` = Không áp dụng, `1` = Áp dụng | Radio | `auto_generate_barcode` |
| `specialItemConfig` | object | Có | — | Cấu hình hàng hóa đặc trưng, gồm 2 thuộc tính bên dưới | — | `special_item` |
| `specialItemConfig.isSpecialItem` | int | Có | `0` \| `1` | Cửa hàng có dùng sản phẩm đặc trưng hay không | Radio | `special_item` |
| `specialItemConfig.specialItemType` | int \| null | Điều kiện | `1` \| `2` \| `null` | Loại hàng hóa đặc trưng. `1` = Dịch vụ vận chuyển, `2` = Mua bán xe. Bắt buộc có giá trị khi `isSpecialItem = 1`; bắt buộc là `null` khi `isSpecialItem = 0` | Dropdown | `special_item` |

**Ràng buộc bổ sung**

| # | Quy tắc |
|---|---|
| 1 | Request phải chứa **đủ cả 5 field**. Thiếu bất kỳ field nào thì từ chối, không hiểu là "giữ nguyên giá trị cũ" |
| 2 | Request **không được chứa field ngoài danh sách trên**, kể cả `comId` |
| 3 | `comId` lấy từ token, không nhận từ request |
| 4 | Khi `isSpecialItem = 0`, hệ thống ghi `specialItemType = null` để dọn giá trị cũ |

### 2.3 Ví dụ request

```json
{
  "batchManger": 1,
  "isImeiSerialManagement": 1,
  "isWarrantyManaged": 1,
  "autoGenerateBarcode": 0,
  "specialItemConfig": {
    "isSpecialItem": 1,
    "specialItemType": 2
  }
}
```

Trường hợp không dùng sản phẩm đặc trưng:

```json
{
  "batchManger": 0,
  "isImeiSerialManagement": 0,
  "isWarrantyManaged": 0,
  "autoGenerateBarcode": 1,
  "specialItemConfig": {
    "isSpecialItem": 0,
    "specialItemType": null
  }
}
```

### 2.4 Response thành công

**HTTP 200**

| Field | Kiểu | Mô tả |
|---|---|---|
| `status` | boolean | `true` khi xử lý thành công |
| `reason` | string | Diễn giải kết quả |
| `message` | array | Danh sách thông báo, mỗi phần tử gồm `code` và `message` |
| `data` | object | Trạng thái cấu hình **sau khi lưu**, gồm đúng 5 field của request |
| `count` | int \| null | Không dùng cho endpoint này |

`data` trả lại đúng 5 field vừa lưu để giao diện dựng lại màn mà không cần gọi thêm API đọc.

```json
{
  "message": [
    {
      "code": "SUCCESS",
      "message": "Cập nhật cấu hình sản phẩm thành công"
    }
  ],
  "reason": "Cập nhật cấu hình sản phẩm thành công",
  "status": true,
  "data": {
    "batchManger": 1,
    "isImeiSerialManagement": 1,
    "isWarrantyManaged": 1,
    "autoGenerateBarcode": 0,
    "specialItemConfig": {
      "isSpecialItem": 1,
      "specialItemType": 2
    }
  },
  "count": null
}
```

### 2.5 Mã lỗi

Envelope lỗi theo đúng mẫu chung của hệ thống: `status = false`, `data = null`, `count = null`, `reason` lặp lại nội dung của phần tử đầu trong `message`.

| Mã | HTTP | Điều kiện phát sinh | Thông báo |
|---|---|---|---|
| `CONFIG_FIELD_NOT_ALLOWED` | 400 | Request chứa field không thuộc endpoint này | Trường `{tên}` không thuộc cấu hình sản phẩm |
| `CONFIG_FIELD_REQUIRED` | 400 | Thiếu field bắt buộc | Thiếu trường bắt buộc `{tên}` |
| `CONFIG_FIELD_INVALID_VALUE` | 400 | Sai kiểu dữ liệu hoặc giá trị ngoài danh sách hợp lệ | Giá trị của `{tên}` không hợp lệ |
| `SPECIAL_ITEM_TYPE_REQUIRED` | 400 | `isSpecialItem = 1` nhưng `specialItemType` rỗng | Vui lòng chọn loại hàng hóa đặc trưng |
| `SPECIAL_ITEM_TYPE_NOT_ALLOWED` | 400 | `isSpecialItem = 0` nhưng vẫn gửi `specialItemType` khác `null` | Không được gửi loại hàng hóa đặc trưng khi không dùng sản phẩm đặc trưng |
| (theo mã chung của hệ thống) | 401 | Token thiếu hoặc hết hạn | Phiên đăng nhập đã hết hạn |
| (theo mã chung của hệ thống) | 403 | Tài khoản không có quyền sửa cấu hình | Bạn không có quyền thực hiện thao tác này |

**Ví dụ response lỗi**

Gửi field ngoài phạm vi:

```json
{
  "message": [
    {
      "code": "CONFIG_FIELD_NOT_ALLOWED",
      "message": "Trường paymentMethod không thuộc cấu hình sản phẩm"
    }
  ],
  "reason": "Trường paymentMethod không thuộc cấu hình sản phẩm",
  "status": false,
  "data": null,
  "count": null
}
```

Bật sản phẩm đặc trưng nhưng chưa chọn loại:

```json
{
  "message": [
    {
      "code": "SPECIAL_ITEM_TYPE_REQUIRED",
      "message": "Vui lòng chọn loại hàng hóa đặc trưng"
    }
  ],
  "reason": "Vui lòng chọn loại hàng hóa đặc trưng",
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
| 3 | Gửi trọn nhóm 5 field, không gửi từng phần | Bỏ hẳn cách hiểu "field vắng mặt nghĩa là giữ nguyên" — nguồn gốc của lỗi ghi đè |
| 4 | `comId` lấy từ token, không nhận từ request | Chặn khả năng sửa cấu hình của chi nhánh khác bằng cách đổi số trong request |
| 5 | Mỗi endpoint dùng một cặp lớp Request / Response riêng | Không dùng lại lớp dữ liệu chung của `get-config`, tránh lặp lại tình trạng một thay đổi kéo theo cả cụm |

---

## 4. Thay đổi so với hiện tại

Năm field dưới đây được chuyển khỏi `update-sale-config` sang endpoint mới. Sau khi triển khai, `update-sale-config` gửi kèm các field này sẽ nhận `400 CONFIG_FIELD_NOT_ALLOWED`.

| Field | Trước | Sau |
|---|---|---|
| `batchManger` | `update-sale-config` | `update-product-config` |
| `isImeiSerialManagement` | `update-sale-config` | `update-product-config` |
| `isWarrantyManaged` | `update-sale-config` | `update-product-config` |
| `autoGenerateBarcode` | `update-sale-config` | `update-product-config` |
| `specialItemConfig` | `update-sale-config` | `update-product-config` |

**Thứ tự triển khai**

| Bước | Việc | Bên thực hiện |
|---|---|---|
| 1 | Mở endpoint mới, nhận 5 field, kiểm tra dữ liệu đầy đủ | BE |
| 2 | Màn Sản phẩm chuyển sang gọi endpoint mới | FE |
| 3 | Gỡ 5 field khỏi `update-sale-config`, bật kiểm tra field lạ | BE |
| 4 | Ứng dụng di động cập nhật theo, nếu có gọi endpoint cũ | Mobile |

Bước 3 chỉ chạy sau khi bước 2 và bước 4 đã lên hết, tránh làm hỏng bản cũ đang chạy.

---

## 5. Ghi chú triển khai

### 5.1 Dọn dữ liệu hiện có

Khi bật kiểm tra `SPECIAL_ITEM_TYPE_REQUIRED` và `SPECIAL_ITEM_TYPE_NOT_ALLOWED`, dữ liệu cũ vi phạm cần được dọn trước, nếu không màn Sản phẩm sẽ không lưu được cho tới khi người dùng tự sửa.

| Tình trạng | Số công ty | Hướng dọn |
|---|---|---|
| `isSpecialItem = 0` nhưng `specialItemType` vẫn còn `1` hoặc `2` | 17 | Gán `specialItemType = null` |
| `isSpecialItem = 1` nhưng `specialItemType = null` | 1 | Liên hệ cửa hàng chọn lại loại, hoặc tắt về `isSpecialItem = 0` |
| Giá trị của khóa `special_item` không phải JSON hợp lệ | 2 | Ghi lại giá trị mặc định `{"isSpecialItem": 0, "specialItemType": null}` |

### 5.2 Chuẩn hóa cách ghi

Khóa `special_item` trong bảng `config` hiện đang tồn tại hai cách đặt tên thuộc tính, do có hai chỗ ghi khác nhau. Khi triển khai endpoint mới, thống nhất về dạng `{"isSpecialItem": ..., "specialItemType": ...}` và chuyển đổi các bản ghi cũ.

### 5.3 Lấy dữ liệu cho màn

Màn Sản phẩm hiện đọc dữ liệu từ API lấy cấu hình chung. Việc có tách endpoint đọc riêng cho từng màn hay không chưa được quyết định, nằm ngoài phạm vi tài liệu này.

---

## 6. Câu hỏi mở

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | Ứng dụng di động có gọi `update-sale-config` không? | Quyết định có cần giai đoạn chạy song song hai endpoint hay cắt chuyển một lần |
| 2 | `dayBeforeExpired` — số ngày cảnh báo trước khi sản phẩm hết hạn — thuộc nghiệp vụ quản lý lô và hạn dùng, cùng nhóm với `batchManger`, nhưng không xuất hiện trên màn Sản phẩm hiện tại | Xác định màn nào phụ trách, có cần bổ sung vào endpoint này không |
