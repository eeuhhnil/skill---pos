---
type: api-doc
feature: cau-hinh-api
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-14
updated: 2026-08-14
links: [docs/cau-hinh-api/api/product-config.md]
tags: [config, api, sale]
changelog:
  - 2026-08-14 | manual | điền nhãn enum từ cột description, ghi nhận mâu thuẫn hai định nghĩa typeDiscount
  - 2026-08-14 | manual | gộp bảng field đơn và field object thành một bảng, đánh số lại Mục 2.3 đến 2.6
  - 2026-08-14 | manual | thu hẹp update-sale-config còn 16 field, đặc tả request/response
---

# API Cấu hình Bán hàng

## 1. Tổng quan

Trước khi tách, `/api/client/page/config/update-sale-config` nhận 39 field và phục vụ cả màn **Cấu hình > Sản phẩm** lẫn màn **Cấu hình > Bán hàng**.

Sau khi tách, endpoint này chỉ còn phục vụ màn Bán hàng với 16 field. Các field của màn Sản phẩm chuyển sang endpoint riêng, đặc tả tại [product-config.md](product-config.md).

| Màn | Endpoint | Số field |
|---|---|---|
| Cấu hình > Bán hàng | `POST /api/client/page/config/update-sale-config` | 16 |
| Cấu hình > Sản phẩm | `POST /api/client/page/config/update-product-config` | 5 |

Trong 16 field có 1 field chỉ áp dụng cho loại hình kinh doanh xăng dầu, và 3 thuộc tính con chỉ xuất hiện khi field cha được bật. Chi tiết tại Mục 2.3.

---

## 2. Cập nhật cấu hình bán hàng

### 2.1 Thông tin chung

| Hạng mục | Giá trị |
|---|---|
| Method | `POST` |
| URL | `/api/client/page/config/update-sale-config` |
| Xác thực | Bearer token, bắt buộc |
| Content-Type | `application/json` |
| Phạm vi tác động | Chi nhánh hiện tại, xác định theo token |

**Header**

| Tên | Bắt buộc | Mô tả |
|---|---|---|
| `Authorization` | Có | `Bearer <access_token>` |
| `Content-Type` | Có | `application/json` |

### 2.2 Request body

Thuộc tính lồng bên trong viết theo dạng chấm. Dòng của field cha mô tả kiểu và khóa lưu, các dòng con ngay dưới mô tả từng thuộc tính.

| Field | Kiểu | Bắt buộc | Giá trị hợp lệ | Mô tả | Control trên màn | Khóa lưu |
|---|---|---|---|---|---|---|
| `typeDiscount` | int | Có | `0` \| `1` \| `2` \| `3` | Loại hình giảm giá. Bốn lựa chọn: giá trị đơn hàng, giá trị sản phẩm, cả hai, không giảm giá. **Cách gán giá trị cho từng lựa chọn đang có hai định nghĩa ngược nhau trong dữ liệu thật, chưa chốt được — xem Mục 6** | Radio | `type_discount` |
| `invDynamicDiscountName` | int | Có | `0` \| `1` | Hiển thị nội dung giảm giá trên hóa đơn. `0` = Không hiển thị, `1` = Hiển thị | Radio | `inv_dynamic_discount_name` |
| `enableSavedOrders` | int | Có | `0` \| `1` | Hiển thị danh sách đơn hàng đã lưu tại màn Bán hàng. `0` = Không hiển thị, `1` = Hiển thị | Radio | `enable_saved_orders` |
| `overStock` | int | Có | `0` \| `1` | Cho phép xuất quá số lượng tồn. `0` = Không cho phép, `1` = Cho phép | Radio | `over_stock` |
| `discountVat` | int | Có | `0` \| `1` | Áp dụng giảm trừ thuế theo nghị quyết 43. `0` = Không giảm trừ, `1` = Giảm trừ | Radio | `discount_vat` |
| `taxReductionType` | int | Điều kiện | `0` \| `1` | Cách giảm trừ thuế. `0` = Giảm trừ chung, `1` = Giảm trừ riêng. Chỉ có nghĩa khi `discountVat = 1` | Radio | `tax_reduction_type` |
| `exciseTaxConfig` | object | Có | — | Cấu hình thuế tiêu thụ đặc biệt, gồm 2 thuộc tính bên dưới | — | `excise_tax_config` |
| `exciseTaxConfig.exciseTax` | int | Có | `0` \| `1` | Có áp dụng thuế tiêu thụ đặc biệt hay không. `0` = Không, `1` = Có | Radio | `excise_tax_config` |
| `exciseTaxConfig.exciseTaxType` | int | Điều kiện | `0` \| `1` | Loại thuế tiêu thụ đặc biệt. `0` = Theo đơn hàng, `1` = Theo sản phẩm. Chỉ có nghĩa khi `exciseTax = 1` | Radio | `excise_tax_config` |
| `voucherApply` | int | Có | `0` \| `1` | Cho phép áp dụng voucher. `0` = Không, `1` = Có | Radio | `voucher_apply` |
| `assignStaff` | int | Có | `0` \| `1` | Chọn nhân viên cho từng sản phẩm hoặc dịch vụ. `0` = Không, `1` = Có | Radio | `assign_staff` |
| `combineVoucherApply` | int | Có | `0` \| `1` | Cho phép gộp nhiều voucher trên một đơn. `0` = Không, `1` = Có | Radio | `combine_voucher_apply` |
| `shiftManager` | int | Có | `0` \| `1` | Quản lý giao dịch theo ca. `0` = Không, `1` = Có | Radio | `shift_manager` |
| `paymentMethod` | object | Có | — | Danh sách hình thức thanh toán, gồm 2 thuộc tính bên dưới | — | `payment_method` |
| `paymentMethod.payment` | array\<string\> | Có | Không rỗng, không phần tử trùng nhau, mỗi phần tử không rỗng | Danh sách nhãn các hình thức thanh toán hiển thị tại màn bán hàng. Người dùng sửa được nhãn ngay trên màn | Ô nhập | `payment_method` |
| `paymentMethod.paymentDefault` | string | Có | Phải trùng khớp một phần tử trong `payment` | Hình thức thanh toán được chọn sẵn khi tạo đơn | Radio | `payment_method` |
| `paymentSourceUpdates` | array\<object\> | Có | Có thể rỗng | Danh sách nguồn thanh toán cần đổi tên | — | `dbo.payment_source` |
| `paymentSourceUpdates[].payment_source_id` | int | Có | Phải tồn tại và thuộc chi nhánh hiện tại | Định danh nguồn thanh toán cần đổi tên | — | `dbo.payment_source` |
| `paymentSourceUpdates[].new_name` | string | Có | Không rỗng, không trùng tên nguồn thanh toán khác cùng chi nhánh | Tên mới | Ô nhập | `dbo.payment_source` |
| `configIdBill` | object | Có | — | Cấu hình mã đơn hàng, gồm 5 thuộc tính bên dưới | — | `config_id_bill` |
| `configIdBill.prefix` | string | Có | Không rỗng | Tiền tố mã đơn hàng, ví dụ `DH` | Ô nhập | `config_id_bill` |
| `configIdBill.commonGenerate` | boolean | Có | — | Đánh số theo số thứ tự | Radio | `config_id_bill` |
| `configIdBill.useEpochMilliseconds` | boolean | Có | — | Đánh số theo thời gian thực | Radio | `config_id_bill` |
| `configIdBill.useRandomCharacter` | boolean | Có | — | Đánh số ngẫu nhiên | Radio | `config_id_bill` |
| `configIdBill.randomCharacterFactor` | int | Điều kiện | Số nguyên dương | Số ký tự phần ngẫu nhiên. Chỉ có nghĩa khi `useRandomCharacter = true` | Ô nhập | `config_id_bill` |
| `comboDisplay` | int | Có | `0` \| `1` \| `2` | Cách hiển thị combo trên hóa đơn điện tử. `0` = Chỉ hiển thị tên sản phẩm combo, `1` = Chỉ hiển thị tên sản phẩm thành phần, `2` = Hiển thị cả tên combo và tên thành phần | Dropdown | `combo_display` |
| `petrolimexPrice` | object | Điều kiện | — | Cấu hình giá xăng, chỉ áp dụng cho loại hình kinh doanh xăng dầu | — | Xem Mục 6 |
| `petrolimexPrice.money` | array\<int\> | Điều kiện | Số nguyên dương, không trùng nhau | Danh sách mệnh giá tiền dùng để bơm nhanh | Ô nhập | Xem Mục 6 |
| `petrolimexPrice.liter` | array\<int\> | Điều kiện | Số nguyên dương, không trùng nhau | Danh sách số lít dùng để bơm nhanh | Ô nhập | Xem Mục 6 |

**Ba ghi chú kèm theo bảng**

| # | Nội dung |
|---|---|
| 1 | `configIdBill` — ba thuộc tính `commonGenerate`, `useEpochMilliseconds`, `useRandomCharacter` cùng biểu diễn **một** lựa chọn loại trừ nhau trên màn, nên **bắt buộc đúng một thuộc tính bằng `true`**. Vi phạm thì trả lỗi, xem Mục 2.6 |
| 2 | `paymentSourceUpdates` — ghi vào bảng `dbo.payment_source`, **không** lưu trong bảng `config`. Đây là field duy nhất trong request tác động ra ngoài bảng cấu hình |
| 3 | `petrolimexPrice` — màn hình chỉ cho chọn **một** đơn vị tại một thời điểm, Tiền hoặc Lít. Cấu trúc hiện tại có hai mảng song song mà không có thuộc tính nào cho biết đơn vị đang được chọn, xem Mục 6 |

### 2.3 Nhóm field điều kiện

| Field | Điều kiện xuất hiện | Khi thỏa điều kiện | Khi không thỏa |
|---|---|---|---|
| `taxReductionType` | `discountVat = 1` | Bắt buộc, giá trị `0` hoặc `1` | Ghi `0` |
| `exciseTaxConfig.exciseTaxType` | `exciseTaxConfig.exciseTax = 1` | Bắt buộc | Ghi `0` |
| `configIdBill.randomCharacterFactor` | `configIdBill.useRandomCharacter = true` | Bắt buộc, số nguyên dương | Bỏ qua giá trị gửi lên |
| `petrolimexPrice` | Chi nhánh thuộc loại hình kinh doanh xăng dầu | Bắt buộc | **Cấm gửi**, gửi lên thì trả lỗi |

Loại hình kinh doanh lấy từ dữ liệu chi nhánh phía máy chủ, **không** lấy từ request. Giao diện quyết định ẩn hiện khối giá xăng, nhưng việc chấp nhận hay từ chối dữ liệu do máy chủ quyết.

### 2.4 Ví dụ request

**Cửa hàng thường**

```json
{
  "typeDiscount": 2,
  "invDynamicDiscountName": 0,
  "enableSavedOrders": 0,
  "overStock": 0,
  "discountVat": 0,
  "taxReductionType": 0,
  "exciseTaxConfig": { "exciseTax": 0, "exciseTaxType": 0 },
  "voucherApply": 1,
  "combineVoucherApply": 1,
  "assignStaff": 0,
  "shiftManager": 0,
  "paymentMethod": {
    "payment": ["Tiền mặt", "Chuyển khoản", "TM/CK", "Cổng thanh toán", "Khác"],
    "paymentDefault": "Chuyển khoản"
  },
  "paymentSourceUpdates": [],
  "configIdBill": {
    "prefix": "DH",
    "commonGenerate": true,
    "useEpochMilliseconds": false,
    "useRandomCharacter": false,
    "randomCharacterFactor": 8
  },
  "comboDisplay": 0
}
```

**Cửa hàng xăng dầu, có đổi tên nguồn thanh toán**

```json
{
  "typeDiscount": 3,
  "invDynamicDiscountName": 1,
  "enableSavedOrders": 1,
  "overStock": 1,
  "discountVat": 1,
  "taxReductionType": 1,
  "exciseTaxConfig": { "exciseTax": 1, "exciseTaxType": 0 },
  "voucherApply": 1,
  "combineVoucherApply": 0,
  "assignStaff": 1,
  "shiftManager": 1,
  "paymentMethod": {
    "payment": ["Tiền mặt", "Chuyển khoản", "TM/CK", "Khác"],
    "paymentDefault": "Tiền mặt"
  },
  "paymentSourceUpdates": [
    { "payment_source_id": 36063, "new_name": "Tài khoản TPBank" }
  ],
  "configIdBill": {
    "prefix": "XD",
    "commonGenerate": false,
    "useEpochMilliseconds": false,
    "useRandomCharacter": true,
    "randomCharacterFactor": 6
  },
  "comboDisplay": 0,
  "petrolimexPrice": {
    "money": [30000, 50000, 100000, 150000, 200000, 500000],
    "liter": []
  }
}
```

### 2.5 Response thành công

**HTTP 200**

| Field | Kiểu | Mô tả |
|---|---|---|
| `status` | boolean | `true` khi xử lý thành công |
| `reason` | string | Diễn giải kết quả |
| `message` | array | Danh sách thông báo, mỗi phần tử gồm `code` và `message` |
| `data` | object | Trạng thái cấu hình **sau khi lưu**, gồm đúng các field của request |
| `count` | int \| null | Không dùng cho endpoint này |

`data` trả lại đúng nhóm field vừa lưu để giao diện dựng lại màn mà không cần gọi thêm API đọc. Với chi nhánh không thuộc loại hình xăng dầu thì `data` không chứa `petrolimexPrice`.

```json
{
  "message": [
    {
      "code": "SUCCESS",
      "message": "Cập nhật cấu hình bán hàng thành công"
    }
  ],
  "reason": "Cập nhật cấu hình bán hàng thành công",
  "status": true,
  "data": {
    "typeDiscount": 2,
    "invDynamicDiscountName": 0,
    "enableSavedOrders": 0,
    "overStock": 0,
    "discountVat": 0,
    "taxReductionType": 0,
    "exciseTaxConfig": { "exciseTax": 0, "exciseTaxType": 0 },
    "voucherApply": 1,
    "combineVoucherApply": 1,
    "assignStaff": 0,
    "shiftManager": 0,
    "paymentMethod": {
      "payment": ["Tiền mặt", "Chuyển khoản", "TM/CK", "Cổng thanh toán", "Khác"],
      "paymentDefault": "Chuyển khoản"
    },
    "paymentSourceUpdates": [],
    "configIdBill": {
      "prefix": "DH",
      "commonGenerate": true,
      "useEpochMilliseconds": false,
      "useRandomCharacter": false,
      "randomCharacterFactor": 8
    },
    "comboDisplay": 0
  },
  "count": null
}
```

### 2.6 Mã lỗi

Envelope lỗi theo đúng mẫu chung của hệ thống: `status = false`, `data = null`, `count = null`, `reason` lặp lại nội dung của phần tử đầu trong `message`.

**Mã dùng chung cho mọi endpoint cấu hình**

| Mã | HTTP | Điều kiện phát sinh | Thông báo |
|---|---|---|---|
| `CONFIG_FIELD_NOT_ALLOWED` | 400 | Request chứa field không thuộc endpoint này | Trường `{tên}` không thuộc cấu hình bán hàng |
| `CONFIG_FIELD_REQUIRED` | 400 | Thiếu field bắt buộc | Thiếu trường bắt buộc `{tên}` |
| `CONFIG_FIELD_INVALID_VALUE` | 400 | Sai kiểu dữ liệu hoặc giá trị ngoài danh sách hợp lệ | Giá trị của `{tên}` không hợp lệ |

**Mã riêng của cấu hình bán hàng**

| Mã | HTTP | Điều kiện phát sinh | Thông báo |
|---|---|---|---|
| `PAYMENT_DEFAULT_NOT_IN_LIST` | 400 | `paymentDefault` không trùng khớp phần tử nào trong `payment` | Hình thức thanh toán mặc định phải nằm trong danh sách |
| `PAYMENT_METHOD_DUPLICATED` | 400 | `payment` có phần tử trùng nhau hoặc phần tử rỗng | Tên hình thức thanh toán không được trùng hoặc để trống |
| `PAYMENT_SOURCE_NOT_FOUND` | 400 | `payment_source_id` không tồn tại hoặc không thuộc chi nhánh hiện tại | Không tìm thấy nguồn thanh toán |
| `PAYMENT_SOURCE_NAME_DUPLICATED` | 400 | `new_name` trùng tên nguồn thanh toán khác trong cùng chi nhánh | Tên nguồn thanh toán đã tồn tại |
| `BILL_NUMBERING_TYPE_INVALID` | 400 | Trong `configIdBill`, số thuộc tính bằng `true` khác 1 | Vui lòng chọn đúng một cách đánh số mã đơn hàng |
| `RANDOM_FACTOR_REQUIRED` | 400 | `useRandomCharacter = true` nhưng `randomCharacterFactor` rỗng hoặc không dương | Vui lòng nhập số ký tự cho mã ngẫu nhiên |
| `PETROL_PRICE_REQUIRED` | 400 | Chi nhánh thuộc loại hình xăng dầu nhưng thiếu `petrolimexPrice` | Vui lòng nhập cấu hình giá xăng |
| `PETROL_PRICE_NOT_ALLOWED` | 400 | Chi nhánh không thuộc loại hình xăng dầu nhưng vẫn gửi `petrolimexPrice` | Chi nhánh không áp dụng cấu hình giá xăng |
| (theo mã chung của hệ thống) | 401 | Token thiếu hoặc hết hạn | Phiên đăng nhập đã hết hạn |
| (theo mã chung của hệ thống) | 403 | Tài khoản không có quyền sửa cấu hình | Bạn không có quyền thực hiện thao tác này |

**Ví dụ response lỗi**

```json
{
  "message": [
    {
      "code": "BILL_NUMBERING_TYPE_INVALID",
      "message": "Vui lòng chọn đúng một cách đánh số mã đơn hàng"
    }
  ],
  "reason": "Vui lòng chọn đúng một cách đánh số mã đơn hàng",
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
| 3 | Gửi trọn nhóm field, không gửi từng phần | Bỏ hẳn cách hiểu "field vắng mặt nghĩa là giữ nguyên" — nguồn gốc của lỗi ghi đè |
| 4 | `comId` lấy từ token, không nhận từ request | Chặn khả năng sửa cấu hình của chi nhánh khác bằng cách đổi số trong request |
| 5 | Loại hình kinh doanh lấy từ máy chủ, không nhận từ request | Chặn việc ghi cấu hình giá xăng cho chi nhánh không phải xăng dầu |
| 6 | Mỗi endpoint dùng một cặp lớp Request / Response riêng | Không dùng lại lớp dữ liệu chung của `get-config` |

---

## 4. Thay đổi so với hiện tại

Endpoint hiện nhận 39 field. Sau khi tách còn 16. Bảng dưới liệt kê 23 field bị gỡ, chia theo hướng xử lý.

### 4.1 Chuyển sang endpoint Sản phẩm

| Field | Endpoint mới |
|---|---|
| `batchManger` | `update-product-config` |
| `isImeiSerialManagement` | `update-product-config` |
| `isWarrantyManaged` | `update-product-config` |
| `autoGenerateBarcode` | `update-product-config` |
| `specialItemConfig` | `update-product-config` |

### 4.2 Thuộc màn hoặc nghiệp vụ khác

| Field | Ghi chú |
|---|---|
| `comId` | Lấy từ token, bỏ khỏi request |
| `companyCode` | Thuộc màn Thông tin cửa hàng, đã có endpoint riêng |
| `countryCode` | Thuộc màn Thông tin cửa hàng, đã có endpoint riêng |
| `isBuyer` | Thuộc cấu hình hóa đơn điện tử |
| `pharmaConfig` | Thuộc cấu hình kết nối Dược Quốc gia. Chứa mật khẩu, không được đi qua endpoint bán hàng |
| `visibleDeleteGasLog` | Chuyển sang `update-gaslog-config`, xem [gas-log-config.md](gas-log-config.md) |
| `visibleWarnGasLog` | Chuyển sang `update-gaslog-config`, xem [gas-log-config.md](gas-log-config.md) |
| `defaultProduct` | Sản phẩm gán theo trụ bơm hay vòi bơm. `0` = Trụ bơm, `1` = Vòi bơm. Thuộc nhóm cấu hình xăng dầu |
| `defaultUser` | Tài khoản người dùng gán theo trụ bơm hay vòi bơm. `0` = Trụ bơm, `1` = Vòi bơm. Thuộc nhóm cấu hình xăng dầu |
| `setupUpdateSaleQuantity` | Tự động đẩy số lượng bán lên Cơ sở dữ liệu Dược Quốc gia. Thuộc cấu hình Dược, cùng nhóm với `pharmaConfig` |
| `pushVoucherDiscountInvoice` | Đẩy dòng giảm giá đơn hàng và dòng khuyến mại lên hóa đơn thành dòng chiết khấu chung hay đẩy riêng. `0` = Riêng, `1` = Chung. Thuộc cấu hình hóa đơn điện tử |
| `inOutTime` | Giờ nhận và trả phòng, thuộc loại hình lưu trú |
| `dayBeforeExpired` | Số ngày cảnh báo trước khi sản phẩm hết hạn. Thuộc nghiệp vụ quản lý lô và hạn dùng, cùng nhóm với `batchManger` |
| `barcodeType` | Thuộc cấu hình sinh mã barcode, quyết định riêng |
| `barcodeGenerateType` | `0` = Sinh bằng mã sản phẩm, `1` = Tự chọn. Thuộc cấu hình sinh mã barcode, quyết định riêng |
| `isElectronicScaleUsed` | Tích hợp cân điện tử. Chưa xác định thuộc màn nào |
| `scalesCodePrefix` | Tiền tố mã vạch hàng hóa dùng cân điện tử. Chưa xác định thuộc màn nào |

### 4.3 Mức độ sử dụng thực tế

Các field ở Mục 4.2 đều có ý nghĩa nghiệp vụ rõ ràng, nhưng phần lớn cửa hàng không dùng tới. Số liệu dưới đây phục vụ việc xếp thứ tự ưu tiên khi xây màn mới cho từng nhóm, **không** phải căn cứ để xóa field.

| Field | Phân bố giá trị thực tế |
|---|---|
| `pushVoucherDiscountInvoice` | `0` là "đẩy riêng" — toàn bộ 5.881 công ty đang ở giá trị này, chưa cửa hàng nào chuyển sang "đẩy chung" |
| `defaultProduct` | `0` là "gán theo trụ bơm" — toàn bộ 1.176 công ty có bản ghi đều ở giá trị này |
| `defaultUser` | `0` ở 5.888 công ty, `1` ở 2 công ty |
| `payLabel` | `0` ở 5.920 công ty, `1` ở 5 công ty |
| `setupUpdateSaleQuantity` | `0` ở 5.945 công ty, `1` ở 7 công ty, `-1` ở 6 công ty. Giá trị `-1` không có trong mô tả, cần xác nhận |
| `inOutTime` | Toàn bộ 368 công ty giữ nguyên một giá trị mặc định `{"checkIn": "14:00", "checkOut": "12:00"}`, chưa ai từng sửa |

### 4.4 Thứ tự triển khai

| Bước | Việc | Bên thực hiện |
|---|---|---|
| 1 | Mở endpoint `update-product-config`, thu hẹp `update-sale-config` còn 16 field nhưng **tạm chấp nhận** field cũ | BE |
| 2 | Màn Sản phẩm và màn Bán hàng chuyển sang gửi đúng nhóm field của mình | FE |
| 3 | Ứng dụng di động cập nhật theo, nếu có gọi endpoint cũ | Mobile |
| 4 | Bật kiểm tra field lạ, gỡ hẳn 23 field khỏi `update-sale-config` | BE |

Bước 4 chỉ chạy sau khi bước 2 và bước 3 đã lên hết, tránh làm hỏng bản đang chạy.

---

## 5. Ghi chú triển khai

### 5.1 Dữ liệu hiện có không đồng nhất

Trước khi bật kiểm tra dữ liệu, cần dọn các trường hợp sau, nếu không màn Bán hàng sẽ không lưu được cho tới khi người dùng tự sửa.

| Khóa | Tình trạng | Số công ty | Hướng dọn |
|---|---|---|---|
| `config_id_bill` | Chỉ lưu 2 khóa `{"useEpochMilliseconds": ..., "prefix": ...}`, thiếu `commonGenerate`, `useRandomCharacter`, `randomCharacterFactor` | 2.792 | Bổ sung đủ 5 khóa, đặt `commonGenerate = true` làm mặc định |
| `excise_tax_config` | Đặt tên thuộc tính theo snake_case `{"excise_tax": ..., "excise_tax_type": ...}` thay vì camelCase | 4.907 | Chuyển sang camelCase |
| `combine_voucher_apply` | Giá trị `2`, ngoài danh sách `0` và `1` | 1 | Đưa về `0` |
| `voucher_apply` | Giá trị `2`, ngoài danh sách `0` và `1` | 1 | Đưa về `0` |
| Nhiều khóa | Giá trị là chuỗi `1C26THA` — ký hiệu mẫu hóa đơn ghi nhầm | 64 khóa của công ty `9915`, và 1 khóa lẻ ở 5 công ty khác | Khôi phục về giá trị mặc định của từng khóa |

Dòng cuối là lý do trực tiếp của việc tách endpoint và lọc field: một lần lưu duy nhất đã ghi cùng một chuỗi vô nghĩa vào 64 trong tổng số 75 bản ghi cấu hình của công ty đó, xóa sạch thiết lập của cửa hàng mà không ai phát hiện.

### 5.2 Chuẩn hóa cách ghi

Cùng một khóa hiện có nhiều biến thể do nhiều chỗ cùng ghi:

- `config_id_bill` có ba biến thể khoảng trắng của cùng một nội dung
- `excise_tax_config` có hai kiểu đặt tên thuộc tính
- `payment_method` và `excise_tax_config` trả về dạng chuỗi JSON trong API lấy cấu hình, nhưng nhận vào dạng object trong API cập nhật

Khi triển khai, thống nhất một dạng duy nhất: object ở cả hai chiều, tên thuộc tính theo camelCase.

### 5.3 Lấy dữ liệu cho màn

Màn Bán hàng hiện đọc dữ liệu từ API lấy cấu hình chung. Việc có tách endpoint đọc riêng cho từng màn hay không chưa được quyết định, nằm ngoài phạm vi tài liệu này.

---

## 6. Câu hỏi mở

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | **`typeDiscount` đang có hai định nghĩa ngược nhau trong production** — xem bảng ngay dưới. Mã nguồn đọc theo định nghĩa nào? | Chưa chốt được thì không viết nổi bảng enum tại Mục 2.2, và giao diện không hiển thị đúng lựa chọn đang lưu |
| 2 | `paymentSourceUpdates` đặt tên khóa theo snake_case, lệch với toàn bộ phần còn lại của request dùng camelCase | Thống nhất về camelCase hay chấp nhận ngoại lệ |
| 3 | `paymentMethod.payment[]` và `paymentSourceUpdates[].new_name` đều đổi tên hình thức thanh toán. Khi cả hai cùng có mặt trong một request thì cái nào có hiệu lực? | Quyết định nguồn dữ liệu chuẩn, tránh hai đường ghi cho cùng một thông tin |
| 4 | `paymentDefault` tham chiếu hình thức thanh toán bằng nhãn, mà nhãn thì người dùng sửa được ngay trên màn. Đổi tên xong thì tham chiếu trỏ vào chuỗi không còn tồn tại | Nên đổi sang tham chiếu bằng định danh. Dữ liệu trả về của API lấy cấu hình đã có sẵn danh sách kèm `id` |
| 5 | `petrolimexPrice` có hai mảng `money` và `liter` song song nhưng không có thuộc tính nào cho biết màn đang chọn đơn vị nào | Nên gộp thành một thuộc tính đơn vị kèm một mảng giá trị. Nếu giữ cấu trúc cũ thì cần quy ước rõ mảng không dùng phải rỗng |
| 6 | `petrolimexPrice` lưu ở đâu? Không tìm thấy khóa tương ứng trong bảng `config` lẫn bảng `gas_config` | Nếu ghi sang bảng khác thì cần xác định phạm vi giao dịch, tránh trường hợp ghi một nơi thành công một nơi thất bại |
| 7 | `setupUpdateSaleQuantity` có giá trị `-1` ở 6 công ty, không nằm trong mô tả của khóa | Xác định `-1` có ý nghĩa hay là dữ liệu sai cần dọn |
| 8 | Ứng dụng di động có gọi `update-sale-config` không? | Quyết định độ dài giai đoạn chạy song song trước khi bật kiểm tra field lạ |

### 6.1 Chi tiết câu hỏi 1 — hai định nghĩa của `typeDiscount`

Cột `description` của khóa `type_discount` trong bảng `config` đang tồn tại hai cách gán giá trị **ngược nhau**:

| Giá trị | Định nghĩa A — 5.241 công ty | Định nghĩa B — 363 công ty |
|---|---|---|
| `0` | Không giảm giá | Giảm giá hoá đơn |
| `1` | Giảm giá theo sản phẩm | Giảm giá sản phẩm |
| `2` | Giảm giá theo đơn hàng | Giảm giá cả 2 loại hình |
| `3` | Giảm giá cả 2 loại | Không giảm giá |

Hai bảng không phải cách diễn đạt khác nhau của cùng một thứ. Giá trị `3` nghĩa là "giảm giá cả hai loại" theo định nghĩa A nhưng là "không giảm giá" theo định nghĩa B — hoàn toàn trái ngược. Hiện có **3.528 công ty đang mang giá trị `3`** và **2.088 công ty mang giá trị `2`**.

Thứ tự bốn lựa chọn trên màn Bán hàng — Giá trị đơn hàng, Giá trị sản phẩm, Cả hai, Không giảm giá — khớp với **định nghĩa B**, trong khi 93% bản ghi lại mang mô tả theo **định nghĩa A**.

Cần bộ phận phát triển xác nhận mã nguồn đang đọc theo định nghĩa nào. Nếu đọc theo B thì các cửa hàng mang mô tả A đang áp dụng sai chính sách giảm giá so với những gì người dùng chọn trên màn.

Lưu ý: cột `description` là chú thích do người nhập, không phải ràng buộc hệ thống, nên chỉ dùng làm đầu mối. Cùng khóa này còn có 7 biến thể mô tả khác nhau, trong đó vài bản chỉ ghi chung chung "Loại giảm giá".
