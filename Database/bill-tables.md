# Cấu trúc bảng: bill & bill_product


---

## 1. dbo.bill — Hóa đơn bán hàng

Bảng trung tâm lưu toàn bộ giao dịch bán hàng tại điểm bán (POS).

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID hóa đơn, tự tăng |
| 2 | code | varchar(50) | YES | Mã đơn hàng chính (VD: HD2024001) |
| 3 | code2 | varchar(50) | YES |Mã đơn hàng phụ, sử dụng để tạo trong trường hợp app offline |
| 4 | com_id | int | YES | ID công ty / chi nhánh |
| 5 | area_unit_id | int | YES | ID bàn / phòng trong khu vực bán hàng |
| 6 | customer_id | int | YES | ID khách hàng (FK → bảng customer) |
| 7 | customer_name | nvarchar(400) | YES | Tên khách hàng tại thời điểm lập hóa đơn |
| 8 | tax_authority_code | varchar(25) | YES | Mã cơ quan thuế (dùng cho hóa đơn điện tử) |
| 9 | bill_date | datetime | YES | Ngày giờ lập hóa đơn |
| 10 | delivery_type | int | YES | Hình thức bán hàng (xem bảng enum bên dưới) |
| 11 | discount_amount | decimal(21,6) | YES | Tiền chiết khấu chung trên toàn hóa đơn |
| 12 | total_pre_tax | decimal(21,6) | YES | Tổng tiền trước thuế VAT |
| 13 | vat_rate | int | YES | Thuế suất VAT áp dụng (%) |
| 14 | vat_amount | decimal(21,6) | YES | Tiền thuế VAT |
| 15 | total_amount | decimal(21,6) | YES | Tổng tiền khách phải trả (sau thuế, sau giảm giá) |
| 16 | status | int | YES | Trạng thái hóa đơn (xem bảng enum bên dưới) |
| 17 | status_invoice | int | YES | Trạng thái hóa đơn điện tử (xem enum bên dưới) |
| 18 | invoice_error_message | nvarchar(512) | YES | Thông báo lỗi khi phát hành hóa đơn điện tử |
| 19 | type_inv | int | YES | Loại hóa đơn (xem enum bên dưới) |
| 20 | creator | int | YES | ID nhân viên tạo hóa đơn |
| 21 | updater | int | YES | ID nhân viên cập nhật cuối |
| 22 | create_time | datetime | YES | Thời gian tạo bản ghi |
| 23 | update_time | datetime | YES | Thời gian cập nhật bản ghi |
| 24 | reservation_id | int | YES | ID đặt trước (FK → bảng reservation, nếu hóa đơn từ đặt bàn) |
| 25 | amount | decimal(21,6) | YES | Tổng tiền gốc các sản phẩm (chưa trừ chiết khấu hóa đơn) |
| 26 | quantity | decimal(21,6) | YES | Tổng số lượng sản phẩm trong hóa đơn |
| 27 | product_discount_amount | decimal(21,6) | YES | Tổng tiền giảm giá cấp sản phẩm (tổng hợp từ bill_product) |
| 28 | area_name | nvarchar(255) | YES | Tên khu vực (VD: Tầng 1, Sân vườn...) |
| 29 | area_unit_name | nvarchar(255) | YES | Tên bàn / phòng |
| 30 | customer_normalized_name | nvarchar(MAX) | YES | Tên khách hàng đã chuẩn hóa dấu (dùng để tìm kiếm) |
| 31 | description | nvarchar(512) | YES | Ghi chú / mô tả hóa đơn |
| 32 | bill_id_returns | varchar(50) | YES | ID hóa đơn gốc (khi đây là hóa đơn trả hàng) |
| 33 | discount_vat_rate | int | YES | Thuế suất VAT trong giảm trừ thuế đơn hàng
| 34 | discount_vat_amount | decimal(21,6) | YES | Tiền thuế giảm trừ của đơn hàng |
| 35 | buyer_name | nvarchar(400) | YES | Tên người mua ghi trên hóa đơn VAT (có thể khác customer_name) |
| 36 | voucher_amount | decimal(21,6) | YES | Tiền giảm từ voucher / mã khuyến mãi |
| 37 | reservation_code | varchar(100) | YES | Mã đặt trước |
| 38 | fkey | varchar(100) | YES | Khóa tham chiếu hệ thống bên ngoài (external key) |
| 39 | extra | ntext | YES | Dữ liệu mở rộng dạng JSON/text tự do |
| 40 | platform | nvarchar(MAX) | YES | Nền tảng tạo hóa đơn (POS, web, mobile, ecommerce...) |
| 41 | owner_id | int | YES | ID nhân viên phụ trách / chủ bàn |
| 42 | unique_key | varchar(100) | YES | Khóa duy nhất chống trùng (idempotency key) |
| 43 | ikey | varchar(100) | YES | Khóa tích hợp (integration key với hệ thống ngoài) |
| 44 | customer_address | nvarchar(400) | YES | Địa chỉ khách hàng tại thời điểm lập hóa đơn |
| 45 | customer_tax_code | varchar(14) | YES | Mã số thuế khách hàng (dùng xuất hóa đơn VAT) |
| 46 | payment_method | nvarchar(50) | YES | Phương thức thanh toán (tiền mặt, thẻ, chuyển khoản...) |
| 47 | column_name | int | YES | Cột/số thứ tự (mục đích nội bộ, ý nghĩa cần xác nhận) |
| 48 | order_id | varchar(50) | YES | Mã đơn hàng từ hệ thống ngoài (ecommerce, đối tác...) |
| 49 | product_extra | nvarchar(MAX) | YES | Thông tin thêm về sản phẩm dạng JSON |
| 50 | total_amount_product | decimal(21,6) | YES | Tổng tiền sản phẩm (trước chiết khấu hóa đơn, sau chiết khấu SP) |
| 51 | check_in | datetime | YES | Thời gian check-in (dịch vụ tính theo giờ: phòng, bida...) |
| 52 | check_out | datetime | YES | Thời gian check-out (dịch vụ tính theo giờ) |
| 53 | type_price | int | YES | Loại bảng giá áp dụng (bảng giá 1, 2, giờ vàng...) |
| 54 | price_after_seller_discount | decimal(18,2) | YES | Giá sau khi áp chiết khấu từ người bán (ecommerce) |
| 55 | total_surcharge | decimal(21,6) | YES | Tổng phụ phí (phí dịch vụ, phí giao hàng...) |
| 56 | merged_bill_id | varchar(512) | YES | Danh sách ID hóa đơn con được gộp vào đây (JSON/CSV) |
| 57 | split_bill_id | varchar(512) | YES | Danh sách ID hóa đơn được tách ra từ hóa đơn này |
| 58 | discount_rate | int | YES | Tỷ lệ chiết khấu chung của hóa đơn (%) |
| 59 | is_customer_update | int | YES | Cờ: 1 = đã cập nhật thông tin khách hàng |
| 60 | info_customer_old | nvarchar(2000) | YES | Thông tin khách hàng cũ trước khi cập nhật (JSON) |
| 61 | info_custumer_old | nvarchar(2000) | YES | Trùng ý nghĩa với info_customer_old (typo trong tên cột) |
| 62 | shipping_status | nvarchar(300) | YES | Trạng thái vận chuyển (đang giao, đã giao, thất bại...) |
| 63 | shipping_info | nvarchar(MAX) | YES | Chi tiết thông tin giao hàng (JSON: địa chỉ, shipper...) |
| 64 | shipping_type | nvarchar(200) | YES | Hình thức vận chuyển (GHN, GHTK, Nội bộ...) |
| 65 | norm_quarter | int | YES | Quý chuẩn hóa dùng phân tích (format YYYYQ, VD: 20241) |
| 66 | prescription_id | varchar(100) | YES | ID đơn thuốc (dành cho ngành dược) |
| 67 | id_medicine | varchar(100) | YES | ID loại thuốc (dành cho ngành dược) |
| 68 | norm_date | int | YES | Ngày chuẩn hóa dùng phân tích (format YYYYMMDD, VD: 20240115) |
| 69 | extra_info | nvarchar(MAX) | YES | Thông tin bổ sung mở rộng (JSON) |
| 70 | excise_tax_rate | varchar(10) | YES | Thuế suất tiêu thụ đặc biệt (%) |
| 71 | excise_tax_amount | decimal(20,6) | YES | Tiền thuế tiêu thụ đặc biệt |
| 72 | sale_person_id | int | YES | ID nhân viên bán hàng phụ trách |
| 73 | payment_status | int | YES | Trạng thái thanh toán (xem enum bên dưới) |

### Enum: bill.status — Trạng thái hóa đơn

| Giá trị | Ý nghĩa |
|---------|---------|
| -1 | Đã xóa |
| 0 | Nháp |
| 1 | Hoàn thành |
| 2 | Đã hủy |
| 3 | Bị trả hàng |
| 4 | Trả hàng |
| 5 | Bị thay thế |
| 6 | Thay thế |
| 7 | Đơn gộp |
| 8 | Đơn tách |

### Enum: bill.delivery_type — Hình thức bán hàng

| Giá trị | Ý nghĩa |
|---------|---------|
| 1 | Tại chỗ |
| 2 | mang về |
| 3 | Giao hàng |

### Enum: bill.type_inv — Loại hóa đơn

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Hóa đơn thường (không có VAT) |
| 1 | Hóa đơn bán lẻ / có VAT |
| 2 | Hóa đơn VAT doanh nghiệp (xuất cho công ty) |
| 3 | Hóa đơn trả hàng |

### Enum: bill.status_invoice — Trạng thái hóa đơn điện tử

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Chưa tạo hóa đơn (Bill có mã của cơ quan thuế nhưng chưa đẩy) |
| 1 | Tạo hóa đơn thành công |
| 2 | Tạo hóa đơn thất bại |
| 3 | Không xuất hóa đơn |

### Enum: bill.payment_status — Trạng thái thanh toán

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Đã thanh toán hết |
| 1 | Còn nợ |
| NULL | Chưa xác định |

---

## 2. dbo.bill_product — Chi tiết sản phẩm trong hóa đơn

Mỗi dòng là một sản phẩm / dịch vụ trong hóa đơn. Một `bill` có nhiều `bill_product`.

| # | Cột | Kiểu | Nullable | Ý nghĩa |
|---|-----|------|----------|---------|
| 1 | **id** | int | NOT NULL (PK) | ID dòng sản phẩm, tự tăng |
| 2 | bill_id | int | YES | ID hóa đơn (FK → dbo.bill.id) |
| 3 | product_id | int | YES | ID sản phẩm (FK → bảng product) |
| 4 | product_name | nvarchar(MAX) | YES | Tên sản phẩm tại thời điểm bán |
| 5 | quantity | decimal(21,6) | YES | Số lượng bán |
| 6 | unit | nvarchar(50) | YES | Đơn vị tính (cái, kg, hộp...) |
| 7 | unit_price | decimal(21,6) | YES | Đơn giá bán  |
| 8 | discount_amount | decimal(21,6) | YES | Tiền giảm giá trên dòng sản phẩm này |
| 9 | total_pre_tax | decimal(21,6) | YES | Thành tiền trước thuế (quantity × unit_price − discount) |
| 10 | vat_rate | int | YES | Thuế suất VAT của sản phẩm (%) |
| 11 | vat_amount | decimal(21,6) | YES | Tiền thuế VAT của dòng sản phẩm |
| 12 | total_amount | decimal(21,6) | YES | Thành tiền sau thuế |
| 13 | feature | int | YES | Tính chất sản phẩm trong hóa đơn (xem enum bên dưới) |
| 14 | creator | int | YES | ID nhân viên tạo dòng |
| 15 | updater | int | YES | ID nhân viên cập nhật cuối |
| 16 | create_time | datetime | YES | Thời gian tạo |
| 17 | update_time | datetime | YES | Thời gian cập nhật |
| 18 | amount | decimal(21,6) | YES | Giá gốc trước giảm giá (quantity × đơn giá) |
| 19 | product_code | varchar(50) | YES | Mã sản phẩm |
| 20 | position | int | YES | Thứ tự hiển thị trong hóa đơn |
| 21 | unit_id | int | YES | ID đơn vị tính (FK → bảng unit) |
| 22 | product_normalized_name | nvarchar(512) | YES | Tên sản phẩm đã chuẩn hóa dấu (để tìm kiếm) |
| 23 | is_topping | bit | YES | 1 = đây là topping / thêm phần cho sản phẩm cha |
| 24 | parent_id | int | YES | ID sản phẩm cha (khi đây là topping/combo con) |
| 25 | product_product_unit_id | int | YES | ID đơn vị tính trong bảng product_unit |
| 26 | area_unit_id | int | YES | ID bàn/phòng (sao chép từ bill) |
| 27 | extra | nvarchar(MAX) | YES | Thông tin mở rộng (JSON: ghi chú bếp, lựa chọn...) |
| 28 | processing_status | int | YES | Trạng thái chế biến: 0=Chưa làm, 1=Đã làm xong |
| 29 | processing_status_desc | nvarchar(300) | YES | Mô tả trạng thái chế biến |
| 30 | voucher_id | int | YES | ID voucher được áp dụng cho dòng này |
| 31 | product_extra | nvarchar(MAX) | YES | Thông tin thêm về sản phẩm (JSON) |
| 32 | total_amount_product | decimal(18,0) | YES | Thành tiền sản phẩm (không tính topping) |
| 33 | description | nvarchar(MAX) | YES | Ghi chú cho dòng sản phẩm (yêu cầu đặc biệt) |
| 34 | out_price_tax | decimal(21,6) | YES | Giá xuất có thuế (dùng cho hóa đơn VAT) |
| 35 | warehouse_id | int | YES | ID kho xuất hàng |
| 36 | product_code2 | nvarchar(50) | YES | Mã sản phẩm do người dùng nhập / mã barcode |
| 37 | discount_rate | int | YES | Tỷ lệ chiết khấu trên dòng (%) |
| 38 | batch_id | int | YES | ID lô hàng (dùng theo dõi lô/hạn sử dụng) |
| 39 | user_id | int | YES | ID nhân viên phụ trách dòng sản phẩm |
| 40 | full_name | nvarchar(512) | YES | Tên đầy đủ sản phẩm (bao gồm biến thể) |
| 41 | group_batch | varchar(100) | YES | Nhóm lô hàng |
| 42 | info_data | nvarchar(MAX) | YES | Dữ liệu thông tin bổ sung (JSON) |
| 43 | norm_quarter | int | YES | Quý chuẩn hóa (YYYYQ) |
| 44 | id_medicine | varchar(100) | YES | ID thuốc (ngành dược) |
| 45 | id_medicine_sale | varchar(100) | YES | ID thuốc bán (mã theo cơ quan y tế) |
| 46 | norm_date | int | YES | Ngày chuẩn hóa (YYYYMMDD) |
| 47 | purchase_price | decimal(21,6) | YES | Giá vốn / giá nhập kho tại thời điểm bán |
| 48 | parent_combo_id | int | YES | ID combo cha (khi sản phẩm là thành phần của combo) |
| 49 | checkin | datetime | YES | Thời gian check-in dịch vụ theo giờ |
| 50 | checkout | datetime | YES | Thời gian check-out dịch vụ theo giờ |
| 51 | discount_allocated | decimal(21,6) | YES | Phần chiết khấu đơn hàng được phân bổ xuống dòng này |
| 52 | type | int | YES | Loại dòng sản phẩm (xem enum bên dưới) |
| 53 | time_pricing_type | int | YES | Loại tính giá theo thời gian (giờ thường, giờ vàng...) |
| 54 | service_status | int | YES | Trạng thái phục vụ: 0=Đang phục vụ, 1=Hoàn thành |
| 55 | main_unit_id | int | YES | ID đơn vị tính chính |
| 56 | main_unit_name | nvarchar(100) | YES | Tên đơn vị tính chính |
| 57 | convert_rate | decimal(21,6) | YES | Hệ số quy đổi giữa đơn vị của đvt chuyển đổi về đơn vị tính chính |
| 58 | main_quantity | decimal(21,6) | YES | Số lượng quy đổi về đơn vị chính |
| 59 | career_tax | nvarchar(MAX) | YES | Thông tin thuế nghề nghiệp đặc thù (JSON) |
| 60 | child_type | tinyint | YES | Loại con trong combo/bundle |
| 61 | warranty_id | int | YES | ID phiếu bảo hành gắn với sản phẩm |
| 62 | total_cogs | decimal(21,6) | YES | Tổng giá vốn (Cost of Goods Sold) của dòng |

### Enum: bill_product.feature — Tính chất sản phẩm

| Giá trị | Ý nghĩa |
|---------|---------|
| 0 | Hàng hóa dịch vụ |
| 1 | Sản phẩm bán thường (mặc định) |
| 2 | Sản phẩm khuyến mãi  |
| 3 | Chiết khấu thương mại |
| 4 | Ghi chú |
| 5 | Hàng hóa đặc trưng |

### Enum: bill_product.type — Loại dòng sản phẩm

| Giá trị | Ý nghĩa |
|---------|---------|
| nul | Thành phẩm |
| 0 | Thành phẩm |
| 1 | Nguyên vật liệu |
| 2 | Combo |
| 4 | Dịch vụ |

