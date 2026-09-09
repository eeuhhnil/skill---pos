---
type: srs
feature: he-so-ton-kho-san-tmdt
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-11
updated: 2026-08-11
links: []
tags: [ecommerce, ton-kho, shopee]
stale_reason: ""
changelog:
  - 2026-08-11 | /ba-write-srs | chuyển tài liệu gốc của @vukhanhhuyen sang mẫu SRS công ty
---

# SRS — Cấu hình hệ số tồn kho hiển thị trên sàn thương mại điện tử

**Mã tài liệu:** SRS-HSTK-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-08-08
**Người soạn:** Vũ Khánh Huyền (khởi tạo) — Dương Thị Huệ Linh (chuẩn hóa theo mẫu)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Loại | Nguồn gốc | Người thực hiện | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|
| 2026-08-08 | A | Cải tiến hệ thống | Vũ Khánh Huyền | Khởi tạo tài liệu | Bản mô tả nghiệp vụ ban đầu |
| 2026-08-11 | M | Cải tiến hệ thống | Dương Thị Huệ Linh | Chuyển sang mẫu SRS công ty; tách thành 4 chức năng; bổ sung quy tắc nghiệp vụ, luồng lỗi và bảng thay đổi CSDL | Đối chiếu với cấu trúc dữ liệu thực tế của `easyposbackoffice` |

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
   - 3.1 Cấu hình hệ số tồn kho đồng bộ lên sàn
   - 3.2 Đồng bộ tồn kho từ POS lên sàn thương mại điện tử
   - 3.3 Đồng bộ tồn kho từ sàn thương mại điện tử về POS
   - 3.4 Cảnh báo sản phẩm chạm mức tồn kho tối thiểu
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Câu hỏi cần làm rõ

---

## 1. NGUỒN GỐC THAY ĐỔI

Cải tiến hệ thống, phát sinh từ phản ánh của nhà bán hàng đang kết nối sàn thương mại điện tử trên EasyPOS.

Tồn kho hiện đồng bộ lên sàn theo đúng số thực trong kho, dẫn tới hai vấn đề:

- Sản phẩm tồn thấp bị thuật toán sàn giảm thứ hạng tìm kiếm. Shopee, TikTok Shop và Lazada đều ưu tiên hiển thị sản phẩm có tồn dồi dào.
- Khách mua nhìn thấy dòng "Còn 2 cái" thì e ngại đặt hàng, tỷ lệ chốt đơn giảm.

Cách xử lý hiện tại của nhà bán hàng là vào từng sàn sửa tay tồn kho lên gấp 2–3 lần số thực, khi hàng gần hết lại sửa xuống. Việc này tốn thời gian, dễ quên, và dễ dẫn tới bán vượt số lượng tồn thực tế.

**Ticket tham chiếu:** Chưa gắn ticket.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Bổ sung khả năng cấu hình **hệ số nhân tồn kho** khi đồng bộ tồn từ EasyPOS lên sàn. Nhà bán hàng cấu hình một lần, sau đó mỗi lần hệ thống đẩy tồn lên sàn sẽ tự động nhân số tồn thực với hệ số đã đặt, không phải sửa tay trên từng sàn nữa.

Số đẩy lên sàn được tính theo công thức **tồn hiển thị = MAX(tồn thực × hệ số, tồn đang giữ chỗ khuyến mãi)**. Vế thứ hai bảo đảm không bị sàn từ chối khi sản phẩm đang chạy Flash Sale hoặc Voucher.

Tài liệu cũng bổ sung một tiện ích đi kèm: cảnh báo ngay trên màn hình Kho hàng sàn thương mại điện tử khi có sản phẩm chạm mức tồn kho tối thiểu, giúp nhà bán hàng nhập hàng trước khi tồn về 0 và bị sàn tự ẩn tin đăng.

**Hai lưu ý chi phối toàn bộ nghiệp vụ:**

1. Sản phẩm là combo hoặc dịch vụ thì **không cập nhật tồn kho** lên sàn — chỉ đồng bộ giá, không đồng bộ số lượng.
2. Điều kiện tiên quyết để một sản phẩm được đồng bộ tồn: sản phẩm trên sàn đã được ghép cặp với sản phẩm bên POS.

**Phạm vi phiên bản này:** sàn Shopee. TikTok Shop và Lazada dùng chung mô hình tính toán nhưng khác API, triển khai ở giai đoạn sau. Cấu hình đa kho (mapping kho POS với kho trên sàn) cũng để giai đoạn sau.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Nhà bán hàng ghép cặp sản phẩm POS với sản phẩm trên sàn.
2. Khi tồn kho trong POS thay đổi, hoặc khi nhà bán hàng chủ động bấm đồng bộ, hệ thống lấy số tồn thực của sản phẩm.
3. Hệ thống gọi API cập nhật tồn của sàn, đẩy đúng số tồn thực lên.
4. Muốn tồn hiển thị cao hơn số thực, nhà bán hàng phải tự vào trang quản trị của từng sàn sửa tay.
5. Khi hàng gần hết, nhà bán hàng lại phải vào từng sàn sửa số xuống để tránh bán vượt tồn.

**Luồng mới (To-Be):**

1. Nhà bán hàng vào màn hình cấu hình kết nối sàn, chọn chế độ đồng bộ tồn và nhập hệ số nhân, ví dụ ×3.
2. Hệ thống lưu cấu hình theo từng gian hàng, đồng thời cảnh báo số lượng sản phẩm sẽ bị ảnh hưởng và hỏi có đồng bộ lại toàn bộ ngay không.
3. Từ lần đồng bộ tiếp theo, hệ thống lấy tồn thực trong POS và cấu hình hệ số trong cùng một lần gọi, tính ra số cần đẩy theo công thức **MAX(tồn thực × hệ số, tồn đang giữ chỗ khuyến mãi)**.
4. Hệ thống gọi API cập nhật tồn của sàn với số đã tính, theo lô tối đa 50 biến thể mỗi lần gọi.
5. Kết thúc, hệ thống hiển thị thông báo số sản phẩm thành công và thất bại. Sản phẩm thất bại được ghi nhật ký để đồng bộ lại.
6. Trên màn hình Kho hàng sàn thương mại điện tử, sản phẩm nào tồn thực đã chạm mức tồn tối thiểu thì hiển thị cảnh báo ngay tại dòng đó.

**Khác biệt cốt lõi:** bước 3 của luồng cũ đẩy nguyên số tồn thực; luồng mới đẩy số đã nhân hệ số, và tồn thực vẫn giữ nguyên trong POS để tính giá vốn, báo cáo và trừ kho khi có đơn.

### 2.3 Yêu cầu người dùng

| StoryID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-001 | Chủ shop | Cấu hình một hệ số nhân tồn kho áp dụng cho toàn bộ sản phẩm đã ghép cặp | Không phải vào từng sàn sửa tay tồn của từng sản phẩm | Cao |
| US-002 | Chủ shop | Hệ thống tự áp hệ số mỗi lần đẩy tồn lên sàn | Cấu hình một lần rồi thôi, không phải nhớ sửa lại khi tồn biến động | Cao |
| US-003 | Chủ shop | Tồn hiển thị trên sàn luôn ở mức đủ cao | Giữ thứ hạng tìm kiếm, không bị thuật toán sàn đẩy xuống vì tồn thấp | Cao |
| US-004 | Chủ shop | Khách mua không nhìn thấy con số tồn quá thấp | Tránh tâm lý e ngại "sắp hết hàng" làm khách bỏ giỏ | Cao |
| US-005 | Chủ shop | Bán nhiều sàn cùng lúc mà chỉ cấu hình ở một chỗ | Không phải lặp lại thao tác cho Shopee, TikTok Shop và Lazada | Trung bình |
| US-006 | Quản lý cửa hàng | Đổi hệ số xong thì toàn bộ sản phẩm được đẩy lại ngay | Không phải chờ tới lần tồn biến động tiếp theo mới thấy số mới trên sàn | Cao |
| US-007 | Quản lý cửa hàng | Biết trước đổi hệ số sẽ ảnh hưởng bao nhiêu sản phẩm | Cân nhắc trước khi lưu, tránh đẩy nhầm hàng loạt | Cao |
| US-008 | Quản lý cửa hàng | Chọn nhiều sản phẩm rồi đồng bộ tồn một lượt | Xử lý hàng trăm sản phẩm mà không phải bấm từng cái | Cao |
| US-009 | Quản lý cửa hàng | Biết sản phẩm nào đồng bộ thành công, sản phẩm nào thất bại | Xử lý lại đúng phần lỗi thay vì đồng bộ lại toàn bộ | Cao |
| US-010 | Quản lý cửa hàng | Thấy cảnh báo khi sản phẩm chạm mức tồn tối thiểu | Nhập hàng trước khi tồn về 0 và bị sàn tự ẩn tin đăng | Cao |
| US-011 | Nhân viên kho | Tồn thực trong POS không bị thay đổi bởi hệ số nhân | Kiểm kê và xuất nhập tồn vẫn đúng số hàng thật trong kho | Cao |
| US-012 | Quản lý cửa hàng | Được cảnh báo khi sản phẩm bán theo cân, lít không phù hợp đăng bán lên sàn | Tránh lỗi đồng bộ do sàn chỉ nhận số nguyên | Trung bình |

**Ghi chú:** US-001 và US-003 là hai yêu cầu gốc, các story còn lại phát sinh từ hai yêu cầu này. US-001 là điều kiện tiên quyết — chưa cấu hình hệ số thì US-002, US-006, US-007 không phát sinh. US-010 và US-012 là tiện ích đi kèm, có thể tách giai đoạn sau nếu cần cắt phạm vi. US-005 phụ thuộc việc kết nối TikTok Shop và Lazada, hiện chưa nằm trong phạm vi phiên bản này.

### 2.4 Ngữ cảnh người dùng

Người cấu hình là chủ shop hoặc quản lý cửa hàng, thao tác trên máy tính tại văn phòng hoặc kho, không phải tại quầy bán hàng. Việc cấu hình diễn ra một lần khi thiết lập kết nối sàn, sau đó chỉ chỉnh lại khi thay đổi chiến lược bán hàng, tần suất khoảng vài tháng một lần.

Việc đồng bộ tồn theo lô thường được thực hiện đầu ca sáng hoặc cuối ca tối, sau khi đã nhập hàng hoặc kiểm kê. Số lượng sản phẩm mỗi lần đồng bộ dao động từ vài chục tới vài trăm, nên thời gian xử lý phải nhìn thấy được tiến độ chứ không thể chỉ hiện vòng quay chờ.

Người dùng đa phần không có kiến thức kỹ thuật, không hiểu khái niệm `item_id`, `model_id` hay giới hạn gọi API của sàn. Thông báo lỗi phải diễn đạt bằng ngôn ngữ nghiệp vụ và chỉ rõ phải làm gì tiếp theo.

### 2.5 Mô tả thay đổi về CSDL

Hệ thống đã có sẵn bảng `ecommerce.config` lưu cấu hình kết nối sàn theo từng gian hàng, dạng khóa – giá trị với các cột `company_id`, `platform`, `shop_id`, `code`, `value`, `description`. Các cấu hình hiện có như `update_inventory`, `multi_warehouse`, `auto_product_sync` đều lưu theo cách này. **Cấu hình hệ số tồn kho dùng lại đúng bảng này, chỉ thêm bản ghi mới, không thêm cột và không thêm bảng.**

| Loại | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| A | `ecommerce.config` | *(bản ghi mới)* | — | — | `code` = `stock_sync_mode`, `value` = `"0"` hoặc `"1"` — chế độ đồng bộ tồn lên sàn |
| A | `ecommerce.config` | *(bản ghi mới)* | — | — | `code` = `stock_multiplier`, `value` = số nguyên từ `"1"` đến `"10"` — hệ số nhân tồn kho |
| M | `ecommerce.product` | `total_available_stock` | int | NULL | Đang có sẵn. Từ nay lưu **số tồn đã nhân hệ số** đã đẩy thành công lên sàn, không còn bằng tồn thực |
| M | `ecommerce.variant` | `total_available_stock` | int | NULL | Tương tự, ở mức biến thể |

**Hai bản ghi cấu hình mới:**

| `code` | Giá trị | Ý nghĩa |
|---|---|---|
| `stock_sync_mode` | `"0"` | Đồng bộ theo tồn thực (mặc định, giữ nguyên hành vi hiện tại) |
| `stock_sync_mode` | `"1"` | Đồng bộ theo hệ số nhân |
| `stock_multiplier` | `"1"` … `"10"` | Hệ số nhân, chỉ có hiệu lực khi `stock_sync_mode` = `"1"`. Mặc định `"1"` |

Cột `description` ghi theo đúng cách các bản ghi cấu hình sàn khác đang mô tả giá trị:

- `stock_sync_mode`: `Chế độ đồng bộ tồn lên sàn 0 - Theo tồn thực, 1 - Nhân hệ số`
- `stock_multiplier`: `Hệ số nhân tồn kho khi đồng bộ lên sàn, giá trị từ 1 đến 10`

**Tạo sẵn bản ghi cho toàn bộ gian hàng đang kết nối**, để gian hàng nào cũng có cấu hình ngay khi lên phiên bản mới và giữ nguyên hành vi hiện tại.

```sql
-- Tạo bản ghi chế độ đồng bộ tồn cho mọi gian hàng đang kết nối
INSERT INTO ecommerce.config (company_id, platform, shop_id, code, value, description, create_time, update_time)
SELECT DISTINCT c.company_id, c.platform, c.shop_id,
       'stock_sync_mode', '0',
       N'Chế độ đồng bộ tồn lên sàn 0 - Theo tồn thực, 1 - Nhân hệ số',
       GETDATE(), GETDATE()
FROM   ecommerce.config c
WHERE  NOT EXISTS (
         SELECT 1 FROM ecommerce.config x
         WHERE  x.company_id = c.company_id
           AND  x.platform   = c.platform
           AND  x.shop_id    = c.shop_id
           AND  x.code       = 'stock_sync_mode');

-- Tạo bản ghi hệ số nhân, mặc định bằng 1
INSERT INTO ecommerce.config (company_id, platform, shop_id, code, value, description, create_time, update_time)
SELECT DISTINCT c.company_id, c.platform, c.shop_id,
       'stock_multiplier', '1',
       N'Hệ số nhân tồn kho khi đồng bộ lên sàn, giá trị từ 1 đến 10',
       GETDATE(), GETDATE()
FROM   ecommerce.config c
WHERE  NOT EXISTS (
         SELECT 1 FROM ecommerce.config x
         WHERE  x.company_id = c.company_id
           AND  x.platform   = c.platform
           AND  x.shop_id    = c.shop_id
           AND  x.code       = 'stock_multiplier');
```

**Gian hàng kết nối mới sau này cũng phải sinh hai bản ghi này** với giá trị `"0"` và `"1"` ngay khi hoàn tất kết nối, để mọi gian hàng luôn có sẵn giá trị cấu hình.

**Các bảng được đọc trong nghiệp vụ này, không thay đổi cấu trúc:**

| Bảng | Vai trò trong nghiệp vụ |
|---|---|
| `ecommerce.product` | Bảng ghép cặp sản phẩm sàn với sản phẩm EasyPOS. Lưu `item_id` của sàn và `product_id` của EasyPOS, tên ghép, ngày ghép |
| `ecommerce.variant` | Ghép cặp biến thể sàn với biến thể EasyPOS, qua `model_id` |
| `ecommerce.sync_product` | Dữ liệu sản phẩm kéo về từ sàn. Cột `has_model` xác định sản phẩm có biến thể hay không, `total_reverved_stock` là tồn đang giữ chỗ khuyến mãi |
| `ecommerce.sync_variant` | Dữ liệu biến thể kéo về từ sàn, `model_id` và `model_sku` |
| `ecommerce.product_warehouse` | Số lượng tồn phân bổ theo từng kho cho sản phẩm đã ghép cặp |
| `dbo.product` | Tồn tổng của sản phẩm tại `inventory_count`, mức tồn tối thiểu tại `minimum_stock`, cờ theo dõi tồn tại `inventory_tracking` |
| `dbo.inventory` | Tồn thực theo từng kho và từng đơn vị tính, tại cột `on_hand` |
| `dbo.product_product_unit` | Tồn quy đổi theo đơn vị tính, ví dụ Thùng và Lon, tại `on_hand` và `convert_rate` |
| `dbo.rs_inout_ward` | Phiếu nhập kho khởi tạo sinh tự động khi tồn thay đổi lúc ghép cặp |

> **Lưu ý cho lập trình viên:** tên cột tồn giữ chỗ khuyến mãi trong cơ sở dữ liệu hiện là `total_reverved_stock` — thiếu một chữ `s` so với tên chuẩn `reserved`. Ba bảng `ecommerce.product`, `ecommerce.sync_product`, `ecommerce.sync_variant` đều dùng tên sai chính tả này. Giữ nguyên, không đổi tên trong phạm vi thay đổi lần này.

> **Giai đoạn sau — đa kho:** để mapping kho POS với kho trên sàn, bảng `ecommerce.product_warehouse` cần bổ sung hai cột `platform_warehouse_id` và `location_id`. Hiện bảng chưa có hai cột này. Không nằm trong phạm vi phiên bản này.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Chủ shop, Quản lý cửa hàng | Cấu hình kết nối sàn thương mại điện tử | Cấu hình hệ số tồn kho đồng bộ lên sàn | Chọn chế độ đồng bộ tồn và nhập hệ số nhân cho từng gian hàng | Cao |
| Chủ shop, Quản lý cửa hàng | Kho hàng sàn thương mại điện tử | Đồng bộ tồn kho từ POS lên sàn | Chọn sản phẩm, tính tồn theo hệ số và đẩy lên sàn theo lô | Cao |
| Hệ thống | *(chạy ngầm)* | Đồng bộ tồn kho từ sàn về POS | Lấy tồn hiện tại trên sàn để đối soát với tồn trong POS | Trung bình |
| Chủ shop, Quản lý cửa hàng | Kho hàng sàn thương mại điện tử | Cảnh báo sản phẩm chạm mức tồn kho tối thiểu | Hiển thị cảnh báo tại dòng sản phẩm có tồn thực chạm mức tối thiểu | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Cấu hình hệ số tồn kho đồng bộ lên sàn

#### 3.1.1 Thông tin chung về chức năng

Chức năng cho phép chủ shop hoặc quản lý cửa hàng chọn cách hệ thống tính số tồn đẩy lên sàn: theo đúng tồn thực, hoặc nhân tồn thực với một hệ số. Cấu hình lưu theo từng gian hàng, nghĩa là mỗi kết nối sàn có hệ số riêng.

Cấu hình chỉ tác động tới con số đẩy lên sàn. Tồn thực trong POS không đổi, mọi báo cáo xuất nhập tồn, giá vốn và kiểm kê vẫn chạy trên tồn thực.

Sau khi lưu cấu hình mới, hệ thống chủ động đề nghị đồng bộ lại toàn bộ sản phẩm đã ghép cặp, vì nếu chờ tới lần tồn biến động tiếp theo thì số hiển thị trên sàn sẽ lệch với hệ số vừa đặt trong một khoảng thời gian không xác định.

#### 3.1.2 Màn hình chức năng

Bổ sung nhóm trường **Đồng bộ tồn kho** vào màn hình cấu hình kết nối sàn thương mại điện tử hiện có.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Chế độ đồng bộ tồn | Dropdown | Theo tồn thực | Có | Hai lựa chọn: *Theo tồn thực* và *Nhân hệ số*. Đọc và ghi `ecommerce.config` với `code` = `stock_sync_mode` |
| 2 | Hệ số nhân | Numeric textbox | 1 | Có khi trường 1 = *Nhân hệ số* | Số nguyên từ 1 đến 10. Chỉ mở khi chế độ là *Nhân hệ số*, ngược lại làm mờ và giữ giá trị cũ. Đọc và ghi `ecommerce.config` với `code` = `stock_multiplier` |
| 3 | Dòng minh họa | Label | *(rỗng)* | Không | Cập nhật theo thời gian thực khi người dùng gõ hệ số, dạng: *"Sản phẩm còn 5 cái trong kho sẽ hiển thị 15 cái trên sàn"*. Ẩn khi chế độ là *Theo tồn thực* |
| 4 | Số sản phẩm bị ảnh hưởng | Label | *(rỗng)* | Không | Đếm số sản phẩm đã ghép cặp có theo dõi tồn của gian hàng đang mở, dạng *"Áp dụng cho 128 sản phẩm đã ghép cặp"* |
| 5 | Lưu | Button | — | — | Kiểm tra hợp lệ, ghi cấu hình, sau đó hiện hộp thoại xác nhận đồng bộ lại |
| 6 | Đồng bộ lại tất cả | Button | — | — | Đẩy lại tồn cho toàn bộ sản phẩm đã ghép cặp của gian hàng, dùng cấu hình đang lưu. Làm mờ khi gian hàng chưa có sản phẩm nào ghép cặp |
| 7 | Hủy | Button | — | — | Đóng màn hình, không lưu thay đổi |

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Lưu chế độ đồng bộ tồn và hệ số nhân cho một gian hàng, để các lần đẩy tồn sau đó dùng chung một quy tắc tính |
| **Tác nhân (Actor)** | Chủ shop, Quản lý cửa hàng |
| **Điều kiện kích hoạt (Trigger)** | Người dùng bấm nút **Lưu** trên nhóm trường Đồng bộ tồn kho |
| **Điều kiện tiên quyết (Pre-condition)** | Đã đăng nhập; có quyền cấu hình kết nối sàn; gian hàng đang mở ở trạng thái kết nối thành công |
| **Điều kiện sau khi thực hiện (Post-condition)** | Hai bản ghi `stock_sync_mode` và `stock_multiplier` của gian hàng mang giá trị mới, `updater` và `update_time` được cập nhật. Nếu người dùng đồng ý đồng bộ lại, tiến trình đẩy tồn ở Mục 3.2 được kích hoạt cho toàn bộ sản phẩm đã ghép cặp |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn hình cấu hình kết nối sàn, chọn gian hàng | Đọc `ecommerce.config` lọc theo `company_id`, `platform`, `shop_id` của gian hàng, lấy hai bản ghi `code` = `stock_sync_mode` và `stock_multiplier`. Nếu không tìm thấy thì hiển thị mặc định *Theo tồn thực* và hệ số 1. Đếm số sản phẩm áp dụng: đếm bản ghi `ecommerce.product` ghép cặp với gian hàng, chỉ tính sản phẩm có `dbo.product.inventory_tracking` = 1, đổ vào trường số 4 |
| 2 | Chọn chế độ *Nhân hệ số* | Mở khóa trường Hệ số nhân, hiện dòng minh họa ở trường số 3 với hệ số đang có |
| 3 | Nhập hệ số, ví dụ 3 | Kiểm tra ngay tại chỗ theo BR-he-so-ton-001 và BR-he-so-ton-002. Cập nhật dòng minh họa thành *"Sản phẩm còn 5 cái trong kho sẽ hiển thị 15 cái trên sàn"*. Không gọi máy chủ ở bước này |
| 4 | Bấm **Lưu** | Kiểm tra lại hợp lệ ở máy chủ. Ghi đè `value` của bản ghi `stock_sync_mode` và `stock_multiplier` tương ứng gian hàng, cập nhật `updater` bằng người dùng hiện tại và `update_time` bằng thời điểm hiện tại. Nếu bản ghi chưa tồn tại thì tạo mới kèm `description` theo Mục 2.5 |
| 5 | *(Hệ thống tự động)* | So sánh hệ số mới với hệ số trước khi lưu. Nếu khác, hiện hộp thoại: *"Thay đổi này sẽ cập nhật tồn kho của {N} sản phẩm trên sàn. Đồng bộ lại ngay?"* với hai nút **Đồng bộ ngay** và **Để sau**. `{N}` lấy từ số đếm ở bước 1. Nếu hệ số không đổi thì bỏ qua hộp thoại, chỉ hiện thông báo lưu thành công |
| 6 | Bấm **Đồng bộ ngay** | Chuyển sang tiến trình đẩy tồn mô tả tại Mục 3.2, phạm vi là toàn bộ sản phẩm đã ghép cặp của gian hàng, người dùng không phải chọn tay từng dòng |
| 7 | Bấm **Để sau** | Đóng hộp thoại. Hiển thị dòng nhắc cố định trên màn hình Kho hàng sàn thương mại điện tử: *"Hệ số tồn kho vừa thay đổi, {N} sản phẩm chưa được đồng bộ lại"*, kèm liên kết mở lại tiến trình đồng bộ. Dòng nhắc mất khi lần đồng bộ toàn bộ gần nhất có thời điểm sau thời điểm đổi cấu hình |

**Truy vấn đếm số sản phẩm bị ảnh hưởng dùng ở bước 1 và bước 5:**

```sql
SELECT COUNT(DISTINCT ep.product_id)
FROM   ecommerce.product ep
JOIN   dbo.product p ON p.id = ep.product_id
WHERE  ep.com_id   = @com_id
  AND  ep.platform = @platform
  AND  ep.shop_id  = @shop_id
  AND  ep.product_id IS NOT NULL          -- đã ghép cặp
  AND  p.inventory_tracking = 1;          -- loại combo và dịch vụ
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Hệ số để trống khi chế độ là *Nhân hệ số* | "Vui lòng nhập hệ số nhân tồn kho." | Chặn lưu, đặt con trỏ vào ô Hệ số nhân |
| Hệ số nhỏ hơn 1 hoặc lớn hơn 10 | "Hệ số nhân phải là số nguyên từ 1 đến 10." | Chặn lưu, giữ nguyên giá trị người dùng vừa gõ |
| Hệ số có phần thập phân | "Hệ số nhân phải là số nguyên." | Chặn lưu |
| Gian hàng đã mất kết nối với sàn | "Gian hàng đã mất kết nối. Vui lòng kết nối lại trước khi cấu hình." | Chặn lưu, ghi nhật ký, gợi ý mở màn hình kết nối lại |
| Lỗi khi ghi cấu hình | "Không lưu được cấu hình. Vui lòng thử lại." | Hoàn tác toàn bộ thay đổi trong cùng một giao dịch, ghi nhật ký lỗi, giữ nguyên giá trị cũ trên màn hình |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-he-so-ton-001 | Hệ số nhân là số nguyên, giá trị nhỏ nhất 1 và lớn nhất 10. Giá trị ngoài khoảng này bị chặn ngay tại màn hình và không được ghi xuống cấu hình |
| BR-he-so-ton-002 | Hệ số nhân chỉ có hiệu lực khi chế độ đồng bộ tồn là *Nhân hệ số*. Khi chế độ là *Theo tồn thực*, hệ thống bỏ qua giá trị hệ số và đẩy đúng tồn thực |
| BR-he-so-ton-003 | Cấu hình lưu theo bộ ba `company_id` + `platform` + `shop_id`. Mỗi gian hàng có hệ số riêng, không dùng chung giữa các gian hàng của cùng một công ty |
| BR-he-so-ton-004 | Giá trị mặc định khi chưa cấu hình là chế độ *Theo tồn thực* và hệ số 1, giữ nguyên hành vi trước khi có thay đổi này |
| BR-he-so-ton-005 | Mỗi lần hệ số hoặc chế độ đồng bộ thay đổi, hệ thống bắt buộc hỏi người dùng có đồng bộ lại toàn bộ sản phẩm hay không, kèm số lượng sản phẩm bị ảnh hưởng. Không được lưu im lặng |
| BR-he-so-ton-006 | Người dùng chọn *Để sau* thì hệ thống hiển thị dòng nhắc trên màn hình Kho hàng sàn thương mại điện tử cho tới khi có một lần đồng bộ toàn bộ hoàn tất sau thời điểm đổi cấu hình |

---

### 3.2 Đồng bộ tồn kho từ POS lên sàn thương mại điện tử

#### 3.2.1 Thông tin chung về chức năng

Chức năng đẩy tồn kho của các sản phẩm đã ghép cặp từ EasyPOS lên sàn. Người dùng chọn sản phẩm trên màn hình Kho hàng sàn thương mại điện tử rồi bấm đồng bộ; hệ thống tính số tồn cần đẩy theo cấu hình ở Mục 3.1 và gọi API cập nhật tồn của sàn.

Chức năng cũng được kích hoạt tự động từ Mục 3.1 bước 6 khi người dùng đổi hệ số và chọn đồng bộ lại toàn bộ.

Sản phẩm chưa từng đăng lên sàn nhưng đủ dữ liệu bắt buộc thì lần đồng bộ này sẽ tạo mới sản phẩm trên sàn kèm tồn ban đầu. Sản phẩm thiếu dữ liệu bắt buộc bị chặn, không cho chọn, để tránh gọi API chắc chắn lỗi.

#### 3.2.2 Màn hình chức năng

Màn hình **Kho hàng sàn thương mại điện tử**, dạng lưới danh sách sản phẩm kèm thanh công cụ.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Chọn tất cả | Checkbox đầu bảng | Không tick | Không | Tick toàn bộ các dòng đang được phép chọn, tức các dòng *Đã đồng bộ* và *Chưa đồng bộ*. Tự động bỏ qua các dòng *Thiếu thông tin* |
| 2 | Ô chọn từng dòng | Checkbox | Không tick | Không | Làm mờ và không cho tick với dòng ở trạng thái *Thiếu thông tin* |
| 3 | Trạng thái ghép cặp | Label có chấm màu | — | — | Ba trạng thái theo BR-he-so-ton-010: 🟢 *Đã đồng bộ*, 🟡 *Chưa đồng bộ*, 🔴 *Thiếu thông tin* |
| 4 | Tên sản phẩm | Label | — | — | Lấy `pair_name` của bản ghi ghép cặp, nếu rỗng thì lấy `EP_name` |
| 5 | Tồn thực | Label | — | — | Tồn hiện có trong POS, lấy `dbo.product.inventory_count` |
| 6 | Tồn sẽ đẩy lên sàn | Label | — | — | Số tính theo BR-he-so-ton-011. Hiển thị sẵn để người dùng biết trước con số sẽ lên sàn |
| 7 | Tồn hiện tại trên sàn | Label | — | — | Lấy `ecommerce.product.total_available_stock` của lần đồng bộ gần nhất. Rỗng với dòng *Chưa đồng bộ* |
| 8 | Bổ sung | Link chữ, chỉ hiện ở dòng 🔴 | — | — | Mở hộp thoại Chi tiết sản phẩm của màn hình Quản lý sản phẩm để nhập ngành hàng, thuộc tính, ảnh, thương hiệu. Nhập đủ thì dòng tự chuyển từ 🔴 sang 🟡 và chọn được |
| 9 | Đồng bộ đã chọn (N) | Button | Làm mờ | — | Số trong ngoặc là số dòng đang tick. Mở khóa khi có ít nhất một dòng được tick |
| 10 | Hủy | Button | — | — | Đóng màn hình, không thực hiện gì, giữ nguyên trạng thái ban đầu |
| 11 | Thanh tiến độ | Progress bar | Ẩn | — | Hiện trong lúc xử lý, dạng *"Đang đồng bộ 120/350 sản phẩm"* |
| 12 | Cảnh báo tồn tối thiểu | Inline text tại dòng | Ẩn | — | Xem Mục 3.4 |

**Ý nghĩa ba trạng thái:**

| Trạng thái | Điều kiện | Hành vi khi đồng bộ | Có chọn được |
|---|---|---|---|
| 🟢 Đã đồng bộ | Đã có `item_id`, và có `model_id` nếu là sản phẩm có biến thể | Gọi cập nhật tồn | Có |
| 🟡 Chưa đồng bộ | Chưa có trên sàn nhưng đủ dữ liệu bắt buộc | Tạo mới sản phẩm trên sàn kèm tồn ban đầu | Có |
| 🔴 Thiếu thông tin | Chưa có trên sàn và thiếu ngành hàng, thuộc tính, ảnh hoặc thương hiệu bắt buộc | Không xử lý | Không |

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Đẩy tồn kho đã nhân hệ số của các sản phẩm được chọn lên sàn, để tồn hiển thị trên sàn khớp với chiến lược nhà bán hàng đã cấu hình |
| **Tác nhân (Actor)** | Chủ shop, Quản lý cửa hàng. Tác nhân phụ: Shopee Open API |
| **Điều kiện kích hoạt (Trigger)** | Người dùng bấm **Đồng bộ đã chọn**; hoặc người dùng chọn **Đồng bộ ngay** ở Mục 3.1 bước 6 |
| **Điều kiện tiên quyết (Pre-condition)** | Đã đăng nhập và có quyền quản lý kho hàng sàn; gian hàng còn kết nối hợp lệ; có ít nhất một sản phẩm được chọn; sản phẩm được chọn phải đã ghép cặp với sản phẩm POS |
| **Điều kiện sau khi thực hiện (Post-condition)** | Với mỗi sản phẩm thành công: tồn trên sàn bằng số đã tính, `ecommerce.product.total_available_stock` và `ecommerce.variant.total_available_stock` lưu số vừa đẩy, `sync_date` và `sync_user` được cập nhật. Với sản phẩm thất bại: giữ nguyên dữ liệu cũ và ghi nhật ký lỗi vào `ecommerce.task_log`. Tồn thực trong `dbo.inventory` và `dbo.product` không thay đổi trong toàn bộ luồng này |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn hình Kho hàng sàn thương mại điện tử | Đọc danh sách sản phẩm của gian hàng từ `ecommerce.product` nối `ecommerce.sync_product` theo `item_id`, nối `dbo.product` theo `product_id`. Lọc bỏ sản phẩm có `dbo.product.inventory_tracking` = 0 theo BR-he-so-ton-008. Xác định trạng thái từng dòng theo BR-he-so-ton-010. Tính cột *Tồn sẽ đẩy lên sàn* theo BR-he-so-ton-011 |
| 2 | Tick chọn các sản phẩm cần đồng bộ | Cập nhật số đếm trên nút **Đồng bộ đã chọn (N)**. Bỏ qua các dòng 🔴 khi người dùng dùng Chọn tất cả |
| 3 | Bấm **Đồng bộ đã chọn** | Làm mờ nút ngay lập tức, hiện thanh tiến độ và khóa toàn bộ màn hình theo BR-he-so-ton-012, chặn người dùng bấm lặp lại gây gọi đồng bộ hai lần cho cùng một sản phẩm |
| 4 | *(Hệ thống tự động)* | Đọc cấu hình `stock_sync_mode` và `stock_multiplier` của gian hàng từ `ecommerce.config` **một lần duy nhất** cho cả tiến trình. Không gọi lại cấu hình cho từng sản phẩm |
| 5 | *(Hệ thống tự động)* | Tách danh sách đã chọn thành hai nhánh: dòng 🟢 đi nhánh cập nhật tồn, dòng 🟡 đi nhánh tạo mới sản phẩm rồi mới cập nhật tồn |
| 6 | *(Hệ thống tự động — nhánh 🟡)* | Gọi `add_item` tạo sản phẩm trên sàn. Nếu sản phẩm có biến thể thì gọi tiếp `init_tier_variation` và `add_model`. Lưu `item_id` trả về vào `ecommerce.product`, `model_id` vào `ecommerce.variant`. Sau đó dòng này nhập chung vào nhánh cập nhật tồn |
| 7 | *(Hệ thống tự động — nhánh 🟢)* | Với mỗi sản phẩm, lấy tồn thực: sản phẩm không biến thể lấy `dbo.product.inventory_count`; sản phẩm có biến thể lấy `dbo.inventory.on_hand` của từng biến thể theo `ppu_id` đã ghép cặp. Lấy tồn giữ chỗ khuyến mãi từ `ecommerce.sync_product.total_reverved_stock` hoặc `ecommerce.sync_variant.total_reverved_stock`. Tính số cần đẩy theo BR-he-so-ton-011 |
| 8 | *(Hệ thống tự động)* | Gom các biến thể thành lô tối đa 50 phần tử theo BR-he-so-ton-013, gọi `POST /api/v2/product/update_stock` cho từng lô. Cập nhật thanh tiến độ sau mỗi lô |
| 9 | *(Hệ thống tự động)* | Đọc phản hồi. Với mỗi phần tử trong `success_list`: ghi số vừa đẩy vào `total_available_stock` của `ecommerce.product` hoặc `ecommerce.variant`, cập nhật `sync_date` và `sync_user`. Với mỗi phần tử trong `failure_list`: ghi `model_id` và `failed_reason` vào `ecommerce.task_log`, không cập nhật tồn |
| 10 | *(Hệ thống tự động)* | Lô nào lỗi toàn phần do mạng hoặc do sàn trả mã lỗi tạm thời thì thử lại tối đa 3 lần theo BR-he-so-ton-014. Lỗi nghiệp vụ như không tìm thấy sản phẩm thì không thử lại |
| 11 | *(Hệ thống tự động)* | Mở khóa màn hình, ẩn thanh tiến độ. Hiện thông báo dạng dải ngang: *"Tạo mới sản phẩm: {X} thành công / {Y} thất bại"* và *"Cập nhật tồn kho: {Z} thành công / {W} thất bại"*. Nếu có dòng thất bại thì kèm liên kết mở danh sách chi tiết lỗi |
| 12 | Bấm liên kết **Bổ sung** ở dòng 🔴 | Mở hộp thoại Chi tiết sản phẩm để nhập ngành hàng, thuộc tính, ảnh, thương hiệu. Sau khi lưu đủ, tính lại trạng thái dòng; đủ dữ liệu thì chuyển sang 🟡 và cho phép tick |

**Công thức tính tồn đẩy lên sàn:**

```
Chế độ Theo tồn thực (stock_sync_mode = 0):
    stock = FLOOR(ton_thuc)

Chế độ Nhân hệ số (stock_sync_mode = 1):
    stock = MAX( FLOOR(ton_thuc × stock_multiplier), total_reverved_stock )

Trong đó:
    ton_thuc = dbo.product.inventory_count            (sản phẩm không biến thể, model_id = 0)
    ton_thuc = dbo.inventory.on_hand                  (từng biến thể, theo ppu_id đã ghép cặp)
    total_reverved_stock = tồn đang giữ chỗ khuyến mãi lấy từ lần đồng bộ gần nhất
```

**Vì sao dùng MAX:** khi sản phẩm đang chạy Flash Sale hoặc Voucher, sàn ràng buộc tổng tồn gửi lên phải lớn hơn hoặc bằng số tồn đang giữ chỗ khuyến mãi tại thời điểm thực tế. Đẩy số nhỏ hơn thì sàn từ chối cả lô. Vế `MAX` bảo đảm mọi trường hợp giảm tồn vẫn hợp lệ, miễn là giá trị mới còn lớn hơn hoặc bằng số giữ chỗ.

**Truy vấn lấy tồn của sản phẩm có biến thể dùng ở bước 7:**

```sql
SELECT ev.model_id,
       i.on_hand                     AS ton_thuc,
       sv.total_reverved_stock       AS ton_giu_cho
FROM   ecommerce.variant ev
JOIN   ecommerce.product ep ON ep.id = ev.product_id
JOIN   dbo.product_product_unit ppu ON ppu.product_id = ep.product_id
JOIN   dbo.inventory i ON i.ppu_id = ppu.id AND i.com_id = ep.com_id
LEFT   JOIN ecommerce.sync_variant sv ON sv.model_id = ev.model_id
WHERE  ep.com_id   = @com_id
  AND  ep.platform = @platform
  AND  ep.shop_id  = @shop_id
  AND  ep.item_id  = @item_id
  AND  ev.model_id IS NOT NULL;       -- biến thể chưa ghép cặp thì bỏ qua
```

**Các trường dữ liệu truyền lên khi gọi `POST /api/v2/product/update_stock`:**

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả ý nghĩa |
|---|---|---|---|
| `item_id` | int64 | Có | ID sản phẩm trên sàn, lấy `item_id` của `ecommerce.sync_product` |
| `stock_list` | object[] | Có | Danh sách biến thể cần cập nhật tồn trong một lần gọi, độ dài từ 1 đến 50 phần tử |
| `stock_list[].model_id` | int64 | Không | ID biến thể, lấy `model_id` của `ecommerce.sync_variant`. Truyền 0 khi sản phẩm không có biến thể |
| `stock_list[].seller_stock` | object[] | Có | Thông tin tồn kho mới. Ràng buộc: tổng tồn gồm cả tồn người bán và tồn của sàn phải lớn hơn hoặc bằng tồn đang giữ chỗ khuyến mãi tại thời điểm thực tế |
| `stock_list[].seller_stock[].location_id` | string | Không | Mã kho vật lý trên sàn, lấy từ `v2.shop.get_warehouse_detail`. Gian hàng không khai báo kho thì không truyền trường này. **Chưa dùng ở phiên bản này** |
| `stock_list[].seller_stock[].stock` | int64 | Có | Số lượng tồn mới, chính là giá trị `stock` tính theo công thức phía trên |

**Ví dụ nội dung gửi lên với sản phẩm có ba biến thể:**

```json
{
  "item_id": 1000,
  "stock_list": [
    { "model_id": 2001, "seller_stock": [{ "stock": 30 }] },
    { "model_id": 2002, "seller_stock": [{ "stock": 45 }] },
    { "model_id": 2003, "seller_stock": [{ "stock": 20 }] }
  ]
}
```

**Ví dụ nội dung nhận về:**

```json
{
  "error": "",
  "message": "",
  "request_id": "...",
  "response": {
    "failure_list": [
      { "model_id": 2003, "failed_reason": "..." }
    ],
    "success_list": [
      { "model_id": 2001, "location_id": "", "stock": 30 },
      { "model_id": 2002, "location_id": "", "stock": 45 }
    ]
  }
}
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Người dùng đổi hệ số ×2 sang ×3 nhưng chưa đồng bộ lại | "Hệ số tồn kho vừa thay đổi, {N} sản phẩm chưa được đồng bộ lại." | Hiện dòng nhắc cố định trên màn hình kèm liên kết mở tiến trình đồng bộ. Xem BR-he-so-ton-006 |
| Tồn thực là số thập phân, ví dụ 12,5 kg gạo | "Sản phẩm bán theo {đơn vị} không phù hợp đăng bán trực tiếp lên sàn. Vui lòng tạo đơn vị đóng gói, ví dụ Túi 5kg, trước khi đăng bán." | Chặn ngay từ khâu ghép cặp và đăng bán theo BR-he-so-ton-016, không để lỗi phát sinh tới lúc gọi API. Sản phẩm đã lỡ ghép cặp thì làm tròn xuống khi đẩy và ghi cảnh báo vào nhật ký |
| Biến thể mới thêm trên POS sau khi đã ghép cặp, chưa có `model_id` | "Biến thể {tên} chưa được ghép cặp với sàn, đã bỏ qua." | Chỉ đồng bộ các biến thể đã có `model_id`. Biến thể mới bị bỏ qua và đưa vào danh sách chi tiết lỗi. Giai đoạn sau hỗ trợ tự tạo biến thể mới qua `add_model` |
| Sản phẩm bị xóa hoặc bị khóa trên sàn nhưng POS chưa biết | Thông báo đẩy tới ứng dụng: "Sản phẩm {tên} không còn tồn tại trên sàn, vui lòng kiểm tra ghép cặp." | Sàn trả `error_item_not_found`. Không thử lại. Đánh dấu bản ghi ghép cặp là mất hiệu lực, loại khỏi các lần đồng bộ sau cho tới khi người dùng ghép lại. Xem BR-he-so-ton-015 |
| Kho POS đang mapping với sàn bị xóa | "Kho {tên kho} đang được dùng để đồng bộ tồn lên sàn. Vui lòng chuyển sang kho khác trước khi xóa." | Chặn xóa kho ngay tại chức năng quản lý kho. Xem Mục 4.1 |
| Sàn trả lỗi vượt giới hạn số lần gọi | "Sàn đang giới hạn số lần gọi. Hệ thống sẽ tự thử lại." | Chờ rồi thử lại theo BR-he-so-ton-014, giữ nguyên thanh tiến độ, không hủy cả tiến trình |
| Thử lại đủ 3 lần vẫn lỗi | "Cập nhật tồn kho: {Z} thành công / {W} thất bại." | Dừng thử lại lô đó, ghi `ecommerce.task_log`, đưa vào danh sách chi tiết lỗi để người dùng đồng bộ lại thủ công |
| Mất kết nối mạng giữa chừng | "Mất kết nối. Đã đồng bộ {số} / {tổng} sản phẩm." | Dừng tiến trình, mở khóa màn hình, giữ nguyên kết quả các lô đã thành công, không hoàn tác |

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-he-so-ton-007 | Chỉ đồng bộ tồn cho sản phẩm đã ghép cặp, tức bản ghi `ecommerce.product` có `product_id` khác rỗng và `item_id` khác rỗng. Sản phẩm chưa ghép cặp không được gọi cập nhật tồn |
| BR-he-so-ton-008 | Sản phẩm là combo hoặc dịch vụ không đồng bộ tồn kho, chỉ đồng bộ giá. Điều kiện nhận biết: `dbo.product.inventory_tracking` = 0 |
| BR-he-so-ton-009 | Hệ số nhân chỉ tác động tới con số gửi lên sàn. Tồn thực tại `dbo.product.inventory_count`, `dbo.inventory.on_hand` và `dbo.product_product_unit.on_hand` không bị thay đổi bởi bất kỳ bước nào của chức năng này |
| BR-he-so-ton-010 | Trạng thái dòng xác định theo thứ tự: có `item_id` thì là *Đã đồng bộ*; không có `item_id` nhưng đủ ngành hàng, thuộc tính, ảnh và thương hiệu bắt buộc thì là *Chưa đồng bộ*; còn lại là *Thiếu thông tin*. Dòng *Thiếu thông tin* không cho tick chọn |
| BR-he-so-ton-011 | Số tồn đẩy lên sàn tính theo công thức: chế độ *Theo tồn thực* thì bằng `FLOOR(tồn thực)`; chế độ *Nhân hệ số* thì bằng `MAX(FLOOR(tồn thực × hệ số), tồn đang giữ chỗ khuyến mãi)`. Làm tròn luôn xuống, không làm tròn lên |
| BR-he-so-ton-012 | Trong lúc tiến trình đồng bộ đang chạy, toàn bộ màn hình bị khóa và nút **Đồng bộ đã chọn** bị làm mờ, để một sản phẩm không bị gọi cập nhật tồn hai lần trong cùng một phiên |
| BR-he-so-ton-013 | Mỗi lần gọi cập nhật tồn chứa tối đa 50 biến thể. Số sản phẩm người dùng chọn không bị giới hạn cứng; hệ thống tự chia lô và xử lý theo tiến độ, thời gian xử lý tăng tuyến tính theo số lượng |
| BR-he-so-ton-014 | Lô gọi thất bại vì lỗi tạm thời — mất mạng, vượt giới hạn số lần gọi, sàn trả lỗi máy chủ — được thử lại tối đa 3 lần. Lỗi nghiệp vụ như không tìm thấy sản phẩm hoặc sai tham số thì không thử lại |
| BR-he-so-ton-015 | Sàn trả lỗi không tìm thấy sản phẩm thì bản ghi ghép cặp bị đánh dấu mất hiệu lực và loại khỏi các lần đồng bộ sau, cho tới khi người dùng ghép cặp lại. Hệ thống gửi thông báo đẩy tới ứng dụng cho người dùng |
| BR-he-so-ton-016 | Sản phẩm có đơn vị tính thuộc nhóm chia nhỏ được — kilogram, gam, lít, mililít, mét — bị cảnh báo và chặn ngay khi người dùng đánh dấu bán trên sàn, vì sàn chỉ nhận số tồn nguyên |
| BR-he-so-ton-017 | Cấu hình hệ số được đọc một lần cho cả tiến trình đồng bộ. Cấu hình đổi giữa chừng không tác động tới tiến trình đang chạy, chỉ có hiệu lực từ lần đồng bộ kế tiếp |

---

### 3.3 Đồng bộ tồn kho từ sàn thương mại điện tử về POS

#### 3.3.1 Thông tin chung về chức năng

Chức năng lấy tồn kho hiện tại của sản phẩm trên sàn về để đối soát với tồn trong POS, giúp phát hiện trường hợp người dùng sửa tay tồn trực tiếp trên trang quản trị của sàn làm hai bên lệch nhau.

Chức năng này chạy ngầm theo lịch đồng bộ hiện có, không có màn hình thao tác riêng. Kết quả đối soát hiển thị dưới dạng chênh lệch tại cột *Tồn hiện tại trên sàn* của màn hình Kho hàng sàn thương mại điện tử.

**Điểm cần lưu ý khi bật hệ số nhân:** tồn lấy về từ sàn lúc này là tồn đã nhân hệ số, không phải tồn thực. Do đó không được ghi thẳng con số này vào tồn POS, nếu không tồn kho thực sẽ bị thổi phồng theo hệ số.

#### 3.3.2 Màn hình chức năng

Không có màn hình thao tác riêng. Kết quả hiển thị tại cột số 7 *Tồn hiện tại trên sàn* của màn hình mô tả ở Mục 3.2.2.

#### 3.3.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Lấy tồn hiện tại trên sàn về để đối soát với tồn trong POS và phát hiện lệch số |
| **Tác nhân (Actor)** | Hệ thống — tiến trình đồng bộ tự động theo lịch |
| **Điều kiện kích hoạt (Trigger)** | Tới giờ đồng bộ tự động đã cấu hình tại `ecommerce.config` với `code` = `time_sync`; hoặc người dùng bấm đồng bộ chủ động từ màn hình Kho hàng sàn thương mại điện tử |
| **Điều kiện tiên quyết (Pre-condition)** | Gian hàng còn kết nối hợp lệ; có ít nhất một sản phẩm đã ghép cặp |
| **Điều kiện sau khi thực hiện (Post-condition)** | `ecommerce.sync_product` và `ecommerce.sync_variant` cập nhật `total_available_stock`, `total_reverved_stock`, `seller_stock` theo dữ liệu mới nhất từ sàn. Tồn thực trong `dbo.inventory` **không** bị ghi đè khi chế độ đồng bộ là *Nhân hệ số*, theo BR-he-so-ton-020 |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | *(Hệ thống tự động)* | Lấy danh sách `item_id` cần đối soát từ `ecommerce.sync_product`, lọc theo gian hàng và trạng thái ghép cặp còn hiệu lực |
| 2 | *(Hệ thống tự động)* | Gọi `GET /api/v2/product/get_item_base_info` theo lô tối đa 50 `item_id` mỗi lần, để lấy thông tin sản phẩm và cờ `has_model` |
| 3 | *(Hệ thống tự động)* | Với sản phẩm có `has_model` = true, gọi tiếp `GET /api/v2/product/get_model_list` **cho từng `item_id` một**, vì API này không nhận nhiều `item_id` trong một lần gọi |
| 4 | *(Hệ thống tự động)* | Ghi dữ liệu nhận về: `model_id` và `model_sku` vào `ecommerce.sync_variant`; `total_available_stock`, `total_reverved_stock` và `seller_stock` vào `ecommerce.sync_product` hoặc `ecommerce.sync_variant`. Chỉ xử lý biến thể có trạng thái `MODEL_NORMAL`, bỏ qua `MODEL_UNAVAILABLE` |
| 5 | *(Hệ thống tự động)* | Đối soát: lấy tồn sàn chia cho hệ số đang cấu hình, so với tồn thực trong `dbo.inventory` theo biến thể tương ứng. Lệch quá 1 đơn vị thì đánh dấu dòng đó lệch tồn và ghi `ecommerce.task_log` |
| 6 | *(Hệ thống tự động)* | Không ghi đè tồn thực trong POS khi chế độ đồng bộ là *Nhân hệ số*. Chỉ hiển thị chênh lệch để người dùng tự quyết định xử lý |

**Các trường dữ liệu truyền lên khi gọi `get_item_base_info`:**

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả ý nghĩa |
|---|---|---|---|
| `item_id_list` | int64[] | Có | Danh sách ID sản phẩm trên sàn cần lấy thông tin, lấy `item_id` của `ecommerce.sync_product`. Độ dài từ 1 đến 50 phần tử |
| `need_tax_info` | boolean | Không | Có lấy thông tin thuế hay không. Mặc định false, luồng đồng bộ tồn không cần |
| `need_complaint_policy` | boolean | Không | Có lấy chính sách khiếu nại hay không. Mặc định false, luồng đồng bộ tồn không cần |

**Các trường dữ liệu truyền lên khi gọi `get_model_list`:**

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả ý nghĩa |
|---|---|---|---|
| `item_id` | int64 | Có | ID sản phẩm trên sàn, lấy `item_id` của `ecommerce.sync_product`. API chỉ nhận một `item_id` mỗi lần gọi, không hỗ trợ gọi theo lô như `get_item_base_info` |

**Các trường dữ liệu nhận về từ `get_model_list`:**

| Trường dữ liệu | Kiểu dữ liệu | Mô tả ý nghĩa |
|---|---|---|
| `model[].model_id` | int64 | ID biến thể trên sàn, đối chiếu với `model_id` của `ecommerce.sync_variant` để xác định biến thể POS tương ứng |
| `model[].model_sku` | string | Mã hàng của biến thể trên sàn, lưu vào `model_sku` của `ecommerce.sync_variant` |
| `model[].model_status` | string | Trạng thái biến thể: `MODEL_NORMAL` hoặc `MODEL_UNAVAILABLE`. Chỉ đồng bộ tồn với biến thể `MODEL_NORMAL` |
| `model[].stock_info_v2.seller_stock[].location_id` | string | Mã kho trên sàn của biến thể. Chưa dùng ở phiên bản này |
| `model[].stock_info_v2.seller_stock[].stock` | int64 | Số lượng tồn của biến thể, dùng để đối soát với `on_hand` của `dbo.inventory` theo đơn vị tính tương ứng |
| `model[].stock_info_v2.summary_info.total_available_stock` | int64 | Tồn còn bán được của biến thể. Chỉ hiển thị, không dùng đối soát |

**Giai đoạn sau — lấy danh sách kho trên sàn:**

Khi bật cấu hình đa kho, hệ thống gọi thêm `GET /api/v2/shop/get_warehouse_detail`. Nội dung này **không nằm trong phạm vi phiên bản hiện tại**, ghi lại để tham chiếu.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả ý nghĩa |
|---|---|---|---|
| `warehouse_type` | int32 | Có | 1 = kho lấy hàng, dùng cho đồng bộ tồn; 2 = kho nhận hàng trả, không quản tồn bán. Truyền 1 cho luồng đồng bộ tồn |

| Trường nhận về | Kiểu dữ liệu | Mô tả ý nghĩa |
|---|---|---|
| `response[].warehouse_id` | int64 | ID kho trên sàn |
| `response[].warehouse_name` | string | Tên kho người bán đặt khi tạo địa chỉ kho, hiển thị trên màn hình mapping kho |
| `response[].warehouse_type` | int32 | 1 = kho lấy hàng, 2 = kho nhận hàng trả. Chỉ mapping kho POS với kho loại 1 |
| `response[].location_id` | string | Mã định danh vị trí tồn kho, chính là giá trị truyền vào `seller_stock[].location_id` khi gọi `update_stock` |
| `response[].address_id` | int64 | ID địa chỉ kho. Tham khảo, không dùng cho đồng bộ tồn |
| `response[].region`, `state`, `city` | string | Thông tin địa lý của kho, hiển thị hỗ trợ người bán nhận diện kho khi mapping |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Sản phẩm không còn tồn tại trên sàn | Thông báo đẩy tới ứng dụng: "Sản phẩm {tên} không còn tồn tại trên sàn, vui lòng kiểm tra ghép cặp." | Đánh dấu bản ghi ghép cặp mất hiệu lực theo BR-he-so-ton-015 |
| Biến thể ở trạng thái `MODEL_UNAVAILABLE` | Không hiển thị | Bỏ qua biến thể, không đối soát, không ghi log lỗi |
| Tồn sàn lệch tồn POS quá 1 đơn vị | Hiển thị dấu cảnh báo tại cột *Tồn hiện tại trên sàn* kèm chú giải "Lệch {số} so với tồn thực" | Ghi `ecommerce.task_log`, không tự sửa số ở bên nào |
| Vượt giới hạn số lần gọi khi lấy biến thể từng sản phẩm | Không hiển thị, tiến trình chạy ngầm | Chờ rồi thử lại, tối đa 3 lần cho mỗi `item_id` |

#### 3.3.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-he-so-ton-018 | Chỉ đối soát tồn với biến thể có trạng thái `MODEL_NORMAL`. Biến thể `MODEL_UNAVAILABLE` bị bỏ qua hoàn toàn |
| BR-he-so-ton-019 | Khi đối soát, tồn lấy về từ sàn phải chia cho hệ số đang cấu hình trước khi so với tồn thực trong POS. So sánh trực tiếp số thô là sai |
| BR-he-so-ton-020 | Khi chế độ đồng bộ là *Nhân hệ số*, hệ thống không được ghi đè tồn thực trong POS bằng tồn lấy về từ sàn, kể cả khi cấu hình `update_inventory` đang bật. Chỉ hiển thị chênh lệch để người dùng tự quyết |
| BR-he-so-ton-021 | Lệch tồn được ghi nhận khi chênh lệch lớn hơn 1 đơn vị, để bỏ qua sai số làm tròn xuống ở BR-he-so-ton-011 |

---

### 3.4 Cảnh báo sản phẩm chạm mức tồn kho tối thiểu

#### 3.4.1 Thông tin chung về chức năng

Sản phẩm có tồn về 0 bị sàn tự ẩn tin đăng. Bật lại tin đăng vừa mất thời gian vừa mất thứ hạng đã tích lũy. Chức năng này cảnh báo sớm ngay tại màn hình Kho hàng sàn thương mại điện tử để người dùng kịp nhập hàng trước khi tồn về 0.

Cảnh báo dùng lại mức tồn tối thiểu đã có sẵn của sản phẩm trong POS, không tạo thêm mức ngưỡng riêng cho sàn. Sản phẩm chưa đặt mức tồn tối thiểu thì không hiện cảnh báo.

Khi bật hệ số nhân, rủi ro hết hàng còn cao hơn vì tồn hiển thị trên sàn lớn hơn tồn thực, khách có thể đặt vượt số hàng đang có. Cảnh báo này vì vậy càng cần thiết khi đã bật hệ số.

#### 3.4.2 Màn hình chức năng

Bổ sung vào màn hình **Kho hàng sàn thương mại điện tử** mô tả ở Mục 3.2.2.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Cảnh báo tại dòng | Inline text màu cam, dưới tên sản phẩm | Ẩn | — | Nội dung: *"Còn {tồn thực} — đã chạm mức tối thiểu {minimum_stock}"*. Chỉ hiện khi thỏa BR-he-so-ton-022 |
| 2 | Dải cảnh báo tổng đầu màn hình | Banner | Ẩn | — | Nội dung: *"{N} sản phẩm đã chạm mức tồn kho tối thiểu. Tồn về 0 sẽ bị sàn tự ẩn tin đăng."* kèm liên kết lọc nhanh. Chỉ hiện khi N lớn hơn 0 |
| 3 | Lọc sản phẩm chạm tồn tối thiểu | Link trong dải cảnh báo | — | — | Lọc lưới chỉ còn các dòng đang cảnh báo |

#### 3.4.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu (Purpose)** | Cho người dùng thấy ngay sản phẩm sắp hết hàng, để nhập bổ sung trước khi tồn về 0 và bị sàn ẩn tin đăng |
| **Tác nhân (Actor)** | Chủ shop, Quản lý cửa hàng |
| **Điều kiện kích hoạt (Trigger)** | Người dùng mở màn hình Kho hàng sàn thương mại điện tử, hoặc làm mới danh sách |
| **Điều kiện tiên quyết (Pre-condition)** | Sản phẩm đã ghép cặp với sàn; sản phẩm có `dbo.product.minimum_stock` lớn hơn 0 |
| **Điều kiện sau khi thực hiện (Post-condition)** | Không thay đổi dữ liệu. Chức năng chỉ hiển thị |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn hình Kho hàng sàn thương mại điện tử | Cùng lượt truy vấn dựng lưới ở Mục 3.2.3 bước 1, lấy thêm `dbo.product.minimum_stock`. Với mỗi dòng, so `inventory_count` với `minimum_stock` theo BR-he-so-ton-022 |
| 2 | *(Hệ thống tự động)* | Dòng nào thỏa điều kiện thì hiện dòng cảnh báo cam dưới tên sản phẩm. Đếm tổng số dòng cảnh báo, đổ vào dải cảnh báo đầu màn hình |
| 3 | Bấm liên kết lọc trong dải cảnh báo | Lọc lưới chỉ còn các dòng đang cảnh báo, giữ nguyên các ô đang tick nếu có |
| 4 | Nhập hàng ở phân hệ kho rồi quay lại làm mới danh sách | Tính lại điều kiện cảnh báo với tồn mới. Dòng nào hết cảnh báo thì ẩn dòng cam và trừ khỏi số đếm ở dải cảnh báo |

**Truy vấn xác định dòng cảnh báo dùng ở bước 1:**

```sql
SELECT ep.product_id, p.name, p.inventory_count, p.minimum_stock
FROM   ecommerce.product ep
JOIN   dbo.product p ON p.id = ep.product_id
WHERE  ep.com_id   = @com_id
  AND  ep.platform = @platform
  AND  ep.shop_id  = @shop_id
  AND  p.inventory_tracking = 1
  AND  ISNULL(p.minimum_stock, 0) > 0
  AND  p.inventory_count <= p.minimum_stock;
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Sản phẩm chưa đặt mức tồn tối thiểu | Không hiển thị | Bỏ qua dòng, không cảnh báo, không nhắc người dùng đi đặt ngưỡng |
| Sản phẩm là combo hoặc dịch vụ | Không hiển thị | Bỏ qua vì không theo dõi tồn, theo BR-he-so-ton-008 |
| Tồn thực bằng 0 | *"Đã hết hàng — sàn có thể đã ẩn tin đăng."* | Đổi cảnh báo từ màu cam sang màu đỏ để phân biệt với trạng thái sắp hết |

#### 3.4.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-he-so-ton-022 | Dòng hiện cảnh báo chạm tồn tối thiểu khi thỏa đồng thời ba điều kiện: sản phẩm đã ghép cặp với sàn, `dbo.product.minimum_stock` lớn hơn 0, và `dbo.product.inventory_count` nhỏ hơn hoặc bằng `minimum_stock` |
| BR-he-so-ton-023 | Cảnh báo so sánh trên **tồn thực**, không so trên tồn đã nhân hệ số. Hệ số không tác động tới ngưỡng cảnh báo |
| BR-he-so-ton-024 | Sản phẩm chưa đặt mức tồn tối thiểu thì không cảnh báo và không nhắc người dùng đi đặt ngưỡng, để tránh làm nhiễu màn hình |
| BR-he-so-ton-025 | Tồn thực bằng 0 thì cảnh báo chuyển sang mức nặng hơn, phân biệt rõ với trạng thái sắp hết hàng |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Ghép cặp sản phẩm với sàn | Kho hàng sàn thương mại điện tử | Cao | Bổ sung kiểm tra đơn vị tính khi người dùng đánh dấu bán trên sàn: đơn vị chia nhỏ được thì cảnh báo và chặn theo BR-he-so-ton-016. Bổ sung trạng thái mất hiệu lực cho bản ghi ghép cặp theo BR-he-so-ton-015 |
| Quản lý kho — xóa kho | Danh mục kho | Trung bình | Chặn xóa kho đang được dùng để đồng bộ tồn lên sàn. Muốn xóa thì phải chuyển mapping sang kho khác trước |
| Tạo và sửa sản phẩm | Chi tiết sản phẩm | Trung bình | Sản phẩm đơn vị tính là kilogram, gam, lít, mililít, mét không cho đánh dấu bán trên sàn cho tới khi tạo đơn vị đóng gói quy đổi |
| Đồng bộ đơn hàng từ sàn về POS | *(chạy ngầm)* | Cao | Đơn từ sàn vẫn trừ đúng số lượng thực khách đặt vào tồn thực. Hệ số nhân không được nhân vào số lượng trừ kho. Sau khi trừ, lần đẩy tồn kế tiếp mới tính lại theo hệ số |
| Báo cáo xuất nhập tồn | Báo cáo | Thấp | Không đổi. Báo cáo chạy trên tồn thực, không đọc số đã nhân hệ số |
| Đồng bộ giá lên sàn | Kho hàng sàn thương mại điện tử | Thấp | Không đổi. Combo và dịch vụ vẫn đồng bộ giá bình thường, chỉ không đồng bộ số lượng |
| Cấu hình kết nối sàn | Cấu hình kết nối sàn thương mại điện tử | Trung bình | Bổ sung nhóm trường Đồng bộ tồn kho. Cấu hình `update_inventory` sẵn có bị vô hiệu hóa một phần khi bật hệ số nhân, theo BR-he-so-ton-020 |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Shopee Open API | `POST /api/v2/product/update_stock` | Cao | Giá trị `stock` gửi lên là số đã nhân hệ số, không còn là tồn thực. Phải bảo đảm luôn lớn hơn hoặc bằng tồn giữ chỗ khuyến mãi |
| Shopee Open API | `GET /api/v2/product/get_item_base_info` | Trung bình | Dùng lấy thông tin sản phẩm và cờ `has_model` phục vụ đối soát, gọi theo lô 50 |
| Shopee Open API | `GET /api/v2/product/get_model_list` | Trung bình | Dùng lấy biến thể và tồn từng biến thể. Gọi một `item_id` mỗi lần nên tốn nhiều lượt gọi, cần cân nhắc giới hạn tần suất |
| Shopee Open API | `POST /api/v2/product/add_item`, `init_tier_variation`, `add_model` | Trung bình | Dùng cho nhánh tạo mới sản phẩm ở Mục 3.2.3 bước 6 |
| Shopee Open API | `GET /api/v2/shop/get_warehouse_detail` | Thấp | Chỉ dùng khi triển khai đa kho ở giai đoạn sau |
| TikTok Shop API | `stocks` | Trung bình | Cùng mô hình nhận giá trị tuyệt đối. Chưa triển khai ở phiên bản này |
| Lazada Open API | `UpdatePriceQuantity` | Trung bình | Cùng mô hình nhận giá trị tuyệt đối. Chưa triển khai ở phiên bản này |
| Dịch vụ thông báo đẩy | *(gửi thông báo tới ứng dụng)* | Thấp | Bổ sung một loại thông báo mới: sản phẩm không còn tồn tại trên sàn |

---

## 5. CÂU HỎI CẦN LÀM RÕ

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| 1 | Hệ số nhân áp dụng chung cho cả gian hàng, hay cho phép đặt riêng theo từng sản phẩm hoặc nhóm sản phẩm? Tài liệu hiện đặc tả theo gian hàng | 3.1, BR-he-so-ton-003 | Chủ shop, Product Owner | |
| 2 | Khoảng cách giữa các lần thử lại là bao lâu? Hệ thống hiện chưa có cơ chế thử lại khi đồng bộ sản phẩm với sàn nên chưa có tiền lệ để theo | 3.2.3 bước 10, BR-he-so-ton-014 | Kỹ thuật | |
| 3 | Khi chế độ là *Nhân hệ số* và cấu hình `update_inventory` đang bật, có chắc chắn chặn ghi đè tồn POS như BR-he-so-ton-020 không, hay cho người dùng tự chọn? | 3.3, BR-he-so-ton-020 | Product Owner | |
| 4 | Giá trị `dbo.product.type` nào tương ứng combo và dịch vụ? Tài liệu đang dùng `inventory_tracking` = 0 làm điều kiện nhận biết, cần xác nhận đây là cách đúng | BR-he-so-ton-008 | Kỹ thuật | |
| 5 | Tồn giữ chỗ khuyến mãi lấy từ lần đồng bộ gần nhất có đủ tin cậy không, hay phải gọi lấy số theo thời gian thực ngay trước khi đẩy tồn? | BR-he-so-ton-011 | Kỹ thuật | |
| 6 | TikTok Shop và Lazada triển khai ở giai đoạn nào? Hệ số dùng chung một cấu hình cho cả ba sàn hay mỗi sàn một hệ số riêng? | 2.1, 4.2 | Product Owner | |
| 7 | Giới hạn trên của hệ số là 10 có phù hợp nhu cầu thực tế không? Con số này hiện là đề xuất, chưa có căn cứ từ người dùng | BR-he-so-ton-001 | Chủ shop | |
| 8 | Sản phẩm đã lỡ ghép cặp mà có tồn thập phân thì làm tròn xuống rồi vẫn đẩy, hay chặn hẳn không đẩy? | 3.2.3 ngoại lệ, BR-he-so-ton-016 | Product Owner | |

---
