---
type: srs
feature: thanh-toan-nhieu-phuong-thuc
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-03
updated: 2026-08-03
links: [docs/payment-source/srs/spec.md]
tags: []
stale_reason: ""
changelog:
  - 2026-08-03 | /ba-write-srs | initial draft — thanh toán nhiều phương thức trong một đơn hàng
---

# SRS — Thanh toán nhiều phương thức trong một đơn hàng

**Mã tài liệu:** SRS-MPT-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-08-03
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Loại | Nguồn gốc | Người thực hiện | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|
| 2026-08-03 | A | Cải tiến hệ thống | Duong Thi Hue Linh | Tạo mới tài liệu | Mục 3.3.2 (màn hình chức năng) tạm để trống |
| 2026-08-03 | M | Cải tiến hệ thống | Duong Thi Hue Linh | Bổ sung chức năng cấu hình bật/tắt đa phương thức; cập nhật cách chọn phương thức theo ô đánh dấu | Theo thiết kế màn hình Xác nhận thanh toán |
| 2026-08-03 | M | Cải tiến hệ thống | Duong Thi Hue Linh | Thống nhất thuật ngữ "phương thức"; điền Mục 3.1.2 màn hình cấu hình | Mã quy tắc đổi từ `BR-nhieu-httt-NNN` sang `BR-nhieu-pttt-NNN` |
| 2026-08-03 | M | Cải tiến hệ thống | Duong Thi Hue Linh | Điền Mục 3.2.2 màn hình Xác nhận thanh toán; thêm quy tắc tự điền số tiền và quy tắc dòng Tiền mặt không có combo-box | Theo thiết kế hai trạng thái bật/tắt công tắc |
| 2026-08-03 | M | Cải tiến hệ thống | Duong Thi Hue Linh | Loại Cơ bản được nhiều dòng; sinh mã nhóm khi bấm Thanh toán; đánh số lại toàn bộ mã quy tắc theo thứ tự đọc | Mã quy tắc chạy từ 001 ở chức năng cấu hình |
| 2026-08-03 | M | Cải tiến hệ thống | Duong Thi Hue Linh | Gộp phần hệ thống ghi nhận thanh toán và sinh phiếu thu vào Mục 3.2; bỏ 4 quy tắc trùng lặp | Còn 3 chức năng và 25 quy tắc |

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
   - 3.1 Cấu hình cho phép thanh toán đa phương thức
   - 3.2 Thanh toán nhiều phương thức trên màn hình bán hàng
   - 3.3 Hiển thị lịch sử thanh toán theo lần thanh toán
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Cải tiến hệ thống, nối tiếp tài liệu [SRS — Quản lý nguồn tiền](../../payment-source/srs/spec.md).

Tài liệu đó đã ghi nhận vướng mắc nhưng chưa xử lý: *"Không hỗ trợ thanh toán nhiều phương thức trong 1 lần: khi khách muốn trả một phần tiền mặt, một phần chuyển khoản, nhân viên phải thực hiện 3 thao tác riêng biệt — thanh toán phần A, tìm lại đơn hàng, thanh toán tiếp phần B — gây mất thời gian và dễ sai sót."*

Tài liệu này đặc tả cách xử lý vướng mắc trên.

**Ticket tham chiếu:** Chưa gắn ticket.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Hiện mỗi lần thanh toán chỉ ghi nhận được một phương thức. Khách trả một phần tiền mặt, phần còn lại chuyển khoản thì thu ngân phải thanh toán làm hai lượt và tìm lại đơn hàng giữa hai lượt.

Thay đổi cho phép nhập **nhiều dòng phương thức thanh toán trong một lần bấm**. Mỗi phương thức thành một dòng lịch sử thanh toán và một phiếu thu riêng, gắn chung một mã nhóm.

**Phạm vi chỉ ở màn hình bán hàng.** Thu nợ, thu khác, mua hàng, nhập kho, trả hàng hoàn tiền giữ nguyên một phương thức mỗi lần.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Thu ngân chọn sản phẩm, bấm **Thanh toán**.
2. Màn hình Xác nhận thanh toán mở ra, thu ngân chọn **một** phương thức thanh toán và nhập số tiền khách đưa.
3. Nếu phương thức là Chuyển khoản hoặc Cổng thanh toán, hệ thống hiện màn hình quét mã QR, chờ xác nhận.
4. Hệ thống ghi **một** dòng lịch sử thanh toán và sinh **một** phiếu thu.
5. Nếu khách còn muốn trả tiếp bằng phương thức khác, thu ngân phải tìm lại đơn hàng và lặp lại từ bước 2.

**Luồng mới (To-Be):**

1. Thu ngân chọn sản phẩm, bấm **Thanh toán**.
2. Màn hình Xác nhận thanh toán mở ra. Hệ thống sinh **mã nhóm thanh toán** cho lần này.
3. Thu ngân thêm các dòng phương thức thanh toán, mỗi dòng chọn nguồn tiền và nhập số tiền. Hệ thống kiểm tra ràng buộc ngay khi thu ngân thao tác (xem BR-nhieu-pttt-006 đến BR-nhieu-pttt-009).
4. Nếu có dòng thuộc Chuyển khoản hoặc Cổng thanh toán, hệ thống hiện màn hình quét mã QR — **tối đa một lần**, vì cả lần thanh toán chỉ được một dòng thuộc nhóm này.
5. Thu ngân bấm **Thanh toán**. Hệ thống cấp toàn bộ số phiếu cần dùng trong một lần, ghi lần lượt từng dòng lịch sử thanh toán kèm phiếu thu tương ứng, tất cả mang cùng mã nhóm.
6. Hệ thống in **một phiếu thu chung** liệt kê các phương thức đã dùng.

**Khác biệt cốt lõi:** bước 5 của luồng cũ chỉ ghi một dòng; luồng mới ghi N dòng trong cùng một giao dịch và gắn chúng vào một mã nhóm.

### 2.3 Yêu cầu người dùng

| StoryID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-001 | Thu ngân | Nhập nhiều phương thức thanh toán trong một lần bấm | Không phải tách đơn và tìm lại đơn hàng khi khách trả bằng nhiều cách | Cao |
| US-002 | Thu ngân | Nhìn thấy ngay số tiền còn thiếu khi đang nhập từng dòng | Biết cần thu thêm bao nhiêu mà không phải tự tính | Cao |
| US-003 | Thu ngân | Nhập tiền khách đưa dư ở dòng tiền mặt và thấy tiền thừa phải trả lại | Thối tiền chính xác | Cao |
| US-004 | Thu ngân | In một phiếu thu duy nhất cho cả lần thanh toán | Đưa khách một tờ thay vì nhiều tờ rời | Trung bình |
| US-005 | Kế toán | Mỗi phương thức thanh toán có phiếu thu riêng | Đối chiếu sổ quỹ theo từng nguồn tiền | Cao |
| US-006 | Kế toán | Biết được các phiếu thu nào thuộc cùng một lần thanh toán | Đối chiếu chứng từ với hóa đơn bán hàng | Trung bình |
| US-007 | Quản lý cửa hàng | Xem lịch sử thanh toán của đơn hàng theo từng lần, mỗi lần thấy đủ các phương thức | Nắm được khách đã trả bao nhiêu, bằng cách nào, còn nợ bao nhiêu | Cao |
| US-008 | Quản lý cửa hàng | Báo cáo doanh thu theo nguồn tiền tách đúng số tiền của từng phương thức | Biết chính xác tiền vào quỹ tiền mặt và vào từng tài khoản ngân hàng | Cao |
| US-009 | Quản lý cửa hàng | Cấu hình cho phép thanh toán một phương thức hay đa phương thức | Cửa hàng không có nhu cầu thì thu ngân không thấy tính năng, tránh thao tác nhầm | Cao |
| US-010 | Thu ngân | Bật hoặc tắt công tắc Đa phương thức ngay trên màn hình thanh toán | Khách trả một phương thức thì màn hình vẫn gọn như cũ | Cao |
| US-011 | Thu ngân | Đánh dấu loại phương thức rồi chọn nguồn tiền cụ thể trong loại đó | Chọn đúng tài khoản ngân hàng hoặc ví mà khách dùng | Cao |
| US-012 | Thu ngân | Gỡ nhanh một dòng phương thức đã chọn | Sửa lại khi bấm nhầm mà không phải nhập lại từ đầu | Trung bình |
| US-013 | Thu ngân | Đánh dấu Ghi nợ khi khách trả thiếu | Ghi nhận phần còn nợ vào công nợ khách hàng | Cao |

**Ghi chú:** US-001 và US-005 là hai yêu cầu gốc, các story còn lại phát sinh từ hai yêu cầu này. US-009 là điều kiện tiên quyết — không bật cấu hình thì US-010 đến US-012 không xuất hiện trên màn hình. Không có story nào phụ thuộc hệ thống ngoài.

### 2.4 Ngữ cảnh người dùng

Thu ngân thao tác trên máy tính tiền hoặc máy POS Android tại quầy, thường có khách đứng chờ nên cần ít bước và thấy ngay số tiền còn thiếu.

Nhu cầu nhiều phương thức phát sinh khi khách không đủ tiền mặt, hết số dư ví điện tử, hoặc dùng phiếu quà tặng có mệnh giá nhỏ hơn giá trị đơn.

### 2.5 Mô tả thay đổi về CSDL

| Loại | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| A | `payment_history` | `group_payment` | varchar(32) | NULL | Mã nhóm — các dòng cùng một lần thanh toán mang cùng giá trị |
| A | `mc_receipt` | `group_payment` | varchar(32) | NULL | Mã nhóm — các phiếu thu cùng một lần thanh toán mang cùng giá trị |
| A | `mc_payment` | `group_payment` | varchar(32) | NULL | Mã nhóm cho phiếu chi. Hiện mỗi mã chỉ gắn một phiếu vì hoàn tiền chỉ dùng một phương thức; cột để sẵn cho mở rộng sau |
| A | `config` | *(bản ghi mới)* | — | — | Bản ghi cấu hình mới với `code` = `enable_multi_payment`, `value` = `"0"` hoặc `"1"`, mỗi cửa hàng một bản ghi theo `company_id` |

**Cấu hình `enable_multi_payment`:**

| Giá trị | Ý nghĩa |
|---|---|
| `"0"` | Chỉ thanh toán một phương thức (mặc định) |
| `"1"` | Cho phép thanh toán đa phương thức |

Cột `description` ghi `0 = Một phương thức, 1 = Đa phương thức`, theo đúng cách các bản ghi cấu hình khác đang mô tả giá trị.

**Tạo sẵn bản ghi cho toàn bộ công ty** với giá trị `"0"`, để cửa hàng nào cũng có cấu hình ngay khi lên phiên bản mới và giữ nguyên hành vi hiện tại.

```sql
INSERT INTO config (company_id, code, value, description, create_time, update_time)
SELECT  c.id, 'enable_multi_payment', '0',
        N'0 = Một phương thức, 1 = Đa phương thức', GETDATE(), GETDATE()
FROM    company c
WHERE   NOT EXISTS (
          SELECT 1 FROM config cf
          WHERE cf.company_id = c.id AND cf.code = 'enable_multi_payment');
```

**Công ty tạo mới sau này cũng phải sinh bản ghi này với giá trị `"0"`** ngay khi khởi tạo, để mọi công ty luôn có sẵn một giá trị cấu hình.

**Script:**

```sql
ALTER TABLE payment_history ADD group_payment varchar(32) NULL;
ALTER TABLE mc_receipt      ADD group_payment varchar(32) NULL;
ALTER TABLE mc_payment      ADD group_payment varchar(32) NULL;

CREATE INDEX IX_payment_history_group ON payment_history(group_payment)
  WHERE group_payment IS NOT NULL;
CREATE INDEX IX_mc_receipt_group ON mc_receipt(group_payment)
  WHERE group_payment IS NOT NULL;
CREATE INDEX IX_mc_payment_group ON mc_payment(group_payment)
  WHERE group_payment IS NOT NULL;
```

**Chỉ mục có điều kiện lọc bỏ giá trị rỗng** vì toàn bộ dữ liệu cũ đều rỗng — `mc_receipt` có 856.888 dòng và `payment_history` có 170.517 dòng. Lọc đi thì chỉ mục chỉ chứa dữ liệu phát sinh sau khi triển khai.

**Không chuyển đổi dữ liệu cũ.** Dòng cũ để trống mã nhóm, và quy tắc đọc là: mã nhóm rỗng nghĩa là dòng đó tự nó là một lần thanh toán. Quy tắc này đúng với toàn bộ lịch sử, vì trước đây một lần thanh toán chỉ sinh đúng một dòng.

**Không thay đổi cấu trúc nào khác.** Bảng `payment_history` đã hỗ trợ nhiều dòng cho một đơn hàng, bảng `mc_receipt` đã hỗ trợ nhiều phiếu thu cho một đơn hàng.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Quản lý cửa hàng | Thiết lập chung | Cấu hình cho phép thanh toán đa phương thức | Bật hoặc tắt tính năng cho toàn cửa hàng | Cao |
| Thu ngân | Xác nhận thanh toán | Thanh toán nhiều phương thức | Bật công tắc Đa phương thức, đánh dấu các loại phương thức, nhập số tiền từng dòng; hệ thống cấp số phiếu và ghi lịch sử thanh toán kèm phiếu thu cho toàn bộ các dòng | Cao |
| Thu ngân, Quản lý cửa hàng | Chi tiết đơn hàng — tab Lịch sử thanh toán | Hiển thị lịch sử thanh toán theo lần | Gom các dòng cùng một lần thanh toán vào một nhóm khi hiển thị | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Cấu hình cho phép thanh toán đa phương thức

#### 3.1.1 Thông tin chung về chức năng

Chức năng cho phép quản lý cửa hàng bật hoặc tắt tính năng thanh toán nhiều phương thức cho toàn cửa hàng. Cửa hàng không có nhu cầu thì thu ngân không nhìn thấy tính năng trên màn hình bán hàng, tránh thao tác nhầm.

Áp dụng trên màn hình Thiết lập chung, dành cho tài khoản có quyền cấu hình cửa hàng. Mặc định tắt, để các cửa hàng đang chạy không bị đổi cách làm việc sau khi cập nhật phiên bản.

Đây là điều kiện tiên quyết của chức năng 3.2 — không bật cấu hình thì màn hình Xác nhận thanh toán giữ nguyên như hiện tại.

#### 3.1.2 Màn hình chức năng

Cấu hình nằm trong nhóm **Bán hàng** của màn hình Thiết lập chung.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Phương thức thanh toán | Radio button | Một phương thức | Có | Hai lựa chọn loại trừ nhau: **Một phương thức** lưu `config.value = "0"`; **Đa phương thức** lưu `config.value = "1"`. Giá trị hiển thị lấy từ bản ghi cấu hình của cửa hàng — mọi cửa hàng đều có sẵn một giá trị |

Lưu cấu hình dùng nút Lưu chung của màn hình Thiết lập chung, không có nút riêng.

> **Ghi chú cho lập trình:** nhãn hiện tại trên màn hình đang là *"Hình thức thanh toán / Một hình thức / Đa hình thức"*. Theo thống nhất về thuật ngữ, nhãn phải đổi sang *"Phương thức thanh toán / Một phương thức / Đa phương thức"* để khớp với công tắc Đa phương thức trên màn hình Xác nhận thanh toán.

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Cho phép từng cửa hàng tự quyết định có dùng thanh toán đa phương thức hay không |
| **Tác nhân** | Quản lý cửa hàng |
| **Điều kiện kích hoạt** | Mở màn hình Thiết lập chung và thay đổi giá trị cấu hình |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền cấu hình cửa hàng; bản ghi `config` với `code` = `enable_multi_payment` của cửa hàng đã tồn tại |
| **Điều kiện sau khi thực hiện** | Bản ghi cấu hình mang giá trị vừa chọn; màn hình Xác nhận thanh toán hiển thị theo cấu hình mới ở lần mở tiếp theo |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Quản lý cửa hàng mở màn hình Thiết lập chung | Đọc `config` lọc `company_id` = cửa hàng hiện tại và `code` = `enable_multi_payment`, chọn sẵn lựa chọn tương ứng với `value` |
| 2 | Chọn **Một phương thức** hoặc **Đa phương thức**, bấm **Lưu** | Cập nhật `value` của bản ghi cấu hình theo lựa chọn, kèm `updater` và `update_time` theo người thao tác. Hiển thị thông báo lưu thành công |
| 3 | *(Hệ thống tự động)* | Lần mở màn hình Xác nhận thanh toán tiếp theo đọc lại cấu hình: giá trị `"1"` thì hiển thị công tắc Đa phương thức, giá trị `"0"` thì không hiển thị |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Tài khoản không có quyền cấu hình | "Bạn không có quyền thực hiện thao tác này." | Chặn, không lưu |
| Lưu cấu hình thất bại | "Không thể lưu thiết lập. Vui lòng thử lại." | Giữ nguyên giá trị cũ trên màn hình |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-nhieu-pttt-001 | Cấu hình `enable_multi_payment` bằng `"0"` thì màn hình Xác nhận thanh toán **không hiển thị** công tắc Đa phương thức và chỉ cho chọn một phương thức, đúng như hiện tại. Bằng `"1"` thì hiển thị công tắc, **mặc định ở trạng thái tắt** mỗi lần mở màn hình. Mọi cửa hàng luôn có sẵn một giá trị cấu hình |
| BR-nhieu-pttt-002 | Đổi cấu hình từ `"1"` về `"0"` **không ảnh hưởng dữ liệu đã ghi**. Các đơn hàng đã thanh toán nhiều phương thức vẫn hiển thị đầy đủ các dòng trong tab Lịch sử thanh toán và vẫn giữ nguyên các phiếu thu đã sinh |

---

### 3.2 Thanh toán nhiều phương thức trên màn hình bán hàng

#### 3.2.1 Thông tin chung về chức năng

Chức năng cho phép thu ngân ghi nhận việc khách trả tiền bằng nhiều phương thức khác nhau trong một lần thao tác duy nhất, thay vì phải tách thành nhiều lượt thanh toán như hiện tại. Bao gồm cả phần thao tác trên màn hình lẫn phần hệ thống ghi dữ liệu sau khi thu ngân bấm Thanh toán.

Áp dụng cho thu ngân trên màn hình Xác nhận thanh toán của nghiệp vụ bán hàng. Không áp dụng cho bất kỳ nghiệp vụ nào khác.

Kết quả nghiệp vụ: một lần bấm Thanh toán ghi nhận đầy đủ các khoản tiền khách đưa, tách theo từng nguồn, và tính đúng số tiền thừa phải trả lại cũng như số tiền còn nợ.

Phần ghi dữ liệu là thay đổi lớn nhất về mặt xử lý: trước đây một lần thanh toán ghi một dòng lịch sử và một phiếu thu, nay ghi N dòng và N phiếu trong cùng một giao dịch.

#### 3.2.2 Màn hình chức năng

Màn hình có hai trạng thái, chuyển đổi bằng công tắc **Đa phương thức**:

- **Tắt** — khối Phương thức TT là radio button chọn một loại, không có dòng bên dưới. Đây là trạng thái mặc định và cũng là toàn bộ giao diện khi cấu hình `enable_multi_payment` bằng `"0"`.
- **Bật** — khối Phương thức TT chuyển thành ô đánh dấu chọn nhiều loại; mỗi loại được đánh dấu sinh một dòng bên dưới.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Tổng tiền cần thanh toán | Text (chỉ đọc) | Tổng tiền của đơn hàng | — | Hiển thị nổi bật ở đầu màn hình |
| 2 | Đa phương thức | Công tắc bật/tắt | Tắt | Không | Chỉ hiển thị khi cấu hình `enable_multi_payment` bằng `"1"` (BR-nhieu-pttt-001). Bật thì khối Phương thức TT chuyển từ radio button sang ô đánh dấu |
| 3 | Phương thức TT | Radio button khi công tắc tắt; **ô đánh dấu** khi công tắc bật | Tiền mặt | Có | Các loại: Tiền mặt, Chuyển khoản, Cổng thanh toán, Cơ bản. Chỉ hiển thị loại có ít nhất một nguồn tiền `active = 1`; loại Cổng thanh toán còn cần `status_connect = 1`. Ràng buộc loại trừ giữa Chuyển khoản và Cổng thanh toán theo BR-nhieu-pttt-007. Loại Cơ bản được nhiều dòng (BR-nhieu-pttt-008) — cách thêm dòng thứ hai trở đi chờ chốt thiết kế, xem Mục 5 câu hỏi 3 |
| 4 | Dòng phương thức — nút gỡ | Icon button | — | — | Gỡ dòng khỏi danh sách và bỏ đánh dấu loại tương ứng |
| 5 | Dòng phương thức — nguồn tiền | Combo-box | Nguồn mặc định của loại | Có, **trừ dòng Tiền mặt** | Danh sách nguồn thuộc đúng loại của dòng, lọc `com_id` cửa hàng hiện tại và `active = 1`. Dòng Tiền mặt **không có** combo-box (BR-nhieu-pttt-016) |
| 6 | Dòng phương thức — số tiền | Textbox (số) | Theo quy tắc tự điền BR-nhieu-pttt-015 | Có | Lớn hơn 0. Chỉ dòng Tiền mặt được nhập vượt số tiền phân bổ (BR-nhieu-pttt-009) |
| 7 | Phương thức TT hóa đơn | Dropdown | Theo thiết lập hiện hành | Có | Danh sách cố định, lưu `bill.payment_method`. Độc lập với các dòng phương thức (BR-nhieu-pttt-014) |
| 8 | Khách trả | Textbox (số) | Tổng tiền cần thanh toán | Có | Số tiền khách đưa |
| 9 | Ghi nợ | Ô đánh dấu | Bỏ chọn | Không | Đánh dấu khi khách trả thiếu và phần còn lại ghi vào công nợ |
| 10 | Chi tiết thanh toán | Vùng thu gọn | Mở | — | Tạm tính / Chiết khấu / Khuyến mại / Phụ thu / Tổng tiền trước thuế / Thuế giảm trừ / Tổng tiền cần thanh toán |
| 11 | Hủy bỏ | Button (phụ) | — | — | Đóng màn hình, không lưu |
| 12 | Thanh toán | Button (chính) | — | — | Xác nhận thanh toán. Nếu có dòng loại Chuyển khoản hoặc Cổng thanh toán thì mở màn hình quét mã QR trước |

**Lưu ý khi thiết kế:** màn hình Xác nhận thanh toán trong [SRS Quản lý nguồn tiền — Mục 3](../../payment-source/srs/spec.md) đang được thiết kế cho **một** nguồn tiền: trường Phương thức TT là radio button chọn một, trường Khách trả là một ô số, trường Tiền thừa tính bằng *Khách trả trừ Tổng tiền*. Thiết kế mới thay thế phần này, không phải bổ sung thêm vào.

#### 3.2.3 Xử lý luồng sự kiện

> **Sơ đồ luồng:** [luong-thanh-toan-nhieu-phuong-thuc.drawio](../diagrams/luong-thanh-toan-nhieu-phuong-thuc.drawio) — sơ đồ BPMN hai làn Thu ngân / Hệ thống, chia bốn giai đoạn: Mở màn hình, Nhập phương thức, Xác nhận, Ghi dữ liệu.

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Ghi nhận đầy đủ các khoản tiền khách trả bằng nhiều phương thức trong một lần thao tác, tách theo từng nguồn tiền, phục vụ báo cáo dòng tiền và đối chiếu kế toán |
| **Tác nhân** | Thu ngân; hệ thống thực hiện phần ghi dữ liệu ở bước 7 |
| **Điều kiện kích hoạt** | Thu ngân bấm nút **Thanh toán** trên màn hình bán hàng |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền bán hàng; đơn hàng có ít nhất một sản phẩm; cửa hàng đã cấu hình ít nhất một nguồn tiền đang hoạt động; cấu hình `enable_multi_payment` bằng `"1"` (nếu bằng `"0"` thì màn hình chỉ cho một phương thức như hiện tại) |
| **Điều kiện sau khi thực hiện** | Đơn hàng được tạo; mỗi phương thức thanh toán có một dòng trong `payment_history` và một phiếu thu trong `mc_receipt`, tất cả mang cùng `group_payment` và cùng thời điểm; số tiền còn nợ ghi ở dòng cuối; số phiếu không trùng nhau và không trùng phiếu đã có |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Thu ngân bấm **Thanh toán** trên màn hình bán hàng | Mở màn hình Xác nhận thanh toán. Đọc cấu hình `enable_multi_payment` của cửa hàng: bằng `"1"` thì hiển thị công tắc **Đa phương thức** ở trạng thái tắt; bằng `"0"` thì không hiển thị công tắc. Hiển thị mặc định một dòng phương thức thanh toán với nguồn tiền mặc định của cửa hàng (`payment_source` có cờ mặc định, `active = 1`) và số tiền bằng tổng tiền cần thanh toán |
| 2 | Thu ngân bật công tắc **Đa phương thức** | Hiển thị hàng ô đánh dấu theo loại phương thức: Tiền mặt, Chuyển khoản, Cổng thanh toán, Cơ bản. Loại của dòng đang có sẵn được đánh dấu trước. Khi thu ngân tắt công tắc: giữ lại dòng đầu tiên, gỡ các dòng còn lại; nếu các dòng bị gỡ đã nhập số tiền thì hỏi xác nhận trước |
| 3 | Thu ngân đánh dấu một loại phương thức | Thêm một dòng cho loại đó. Dòng loại Tiền mặt gồm nút gỡ, tên loại và ô số tiền; các loại còn lại có thêm combo-box chọn nguồn tiền, danh sách lấy từ `payment_source` lọc `com_id` = cửa hàng hiện tại, `active = 1` và đúng loại đang chọn, riêng loại Cổng thanh toán lọc thêm `status_connect = 1`. Số tiền được tự điền. Nếu loại vừa đánh dấu là Chuyển khoản hoặc Cổng thanh toán mà loại còn lại trong nhóm đang được đánh dấu, thì **bỏ đánh dấu loại kia và gỡ dòng của nó**, kèm thông báo cho thu ngân biết |
| 4 | Thu ngân chọn nguồn tiền cụ thể trong dòng | Cập nhật nguồn tiền của dòng. Với loại Cơ bản có nhiều dòng, kiểm tra không cho hai dòng cùng trỏ về một nguồn tiền; trùng thì báo lỗi và giữ nguyên lựa chọn cũ. Bước này không áp dụng cho dòng Tiền mặt |
| 5 | Thu ngân nhập số tiền cho dòng | Nếu dòng là Tiền mặt: cho phép nhập lớn hơn số tiền phân bổ, phần chênh lệch hiển thị ở ô Tiền thừa. Nếu dòng không phải Tiền mặt: nhập lớn hơn số tiền còn thiếu thì báo lỗi E-nhieu-pttt-005. Sau mỗi lần nhập, tính lại và hiển thị: Tổng đã nhập, Tiền thừa, Số tiền còn nợ |
| 6 | Thu ngân bấm biểu tượng **gỡ dòng** | Gỡ dòng khỏi danh sách và bỏ đánh dấu loại tương ứng, tính lại Tổng đã nhập / Tiền thừa / Số tiền còn nợ. Nếu không còn dòng nào, hiển thị lại một dòng trống mặc định |
| 7 | Thu ngân bấm **Thanh toán** | Kiểm tra lần cuối các ràng buộc về số dòng, tổng số tiền và loại trừ loại phương thức. Nếu có dòng thuộc loại Chuyển khoản hoặc Cổng thanh toán, mở màn hình quét mã QR toàn màn hình cho **dòng đó** và chờ xác nhận — tối đa một lần quét cho mỗi lần thanh toán. Sau khi xác nhận, hoặc nếu không có dòng nào cần quét, giao diện sinh mã nhóm `group_payment` 20 ký tự và gửi yêu cầu thanh toán xuống hệ thống — cách hệ thống xử lý xem phần ngay dưới bảng này. Khi hệ thống trả về thành công: đóng màn hình Xác nhận thanh toán, hiển thị thông báo thành công; đơn hàng `bill`, các phiếu thu `mc_receipt` và các dòng `payment_history` đã được sinh |

**Xử lý phía hệ thống khi nhận yêu cầu thanh toán**

Toàn bộ các bước nằm trong **một giao dịch dữ liệu duy nhất**; lỗi ở bất kỳ bước nào thì hủy hết, không để lại bản ghi nào.

**(1)** Giao diện gửi payload xuống hệ thống, kèm theo `group_payment` của lần thanh toán đó. Payload gồm dữ liệu đơn hàng, danh sách dòng phương thức (nguồn tiền, số tiền phân bổ, số tiền khách đưa), phương thức thanh toán hóa đơn và cờ ghi nợ.

**(2)** Hệ thống tạo `bill`. Trường `bill.payment_method` lấy từ trường Phương thức thanh toán hóa đơn, **không suy ra từ các dòng thanh toán**.

**(3)** Hệ thống tạo **N dòng `payment_history`** nếu thanh toán N phương thức. Mỗi dòng ghi nguồn tiền, `amount`, `amount_received`, `refund`, `group_payment`.

- Tiền thừa `refund` chỉ ghi ở **dòng tiền mặt**.
- Nếu còn nợ thì **chỉ dòng cuối** ghi `debt` và `debt_type`; các dòng trước để trống.
- Số tiền còn nợ ghi ở dòng cuối bằng *tổng tiền đơn hàng trừ tổng `amount` của tất cả các dòng* — trừ theo `amount`, không trừ theo `amount_received`.

**(4)** Hệ thống tạo **N dòng `mc_receipt`** nếu thanh toán N phương thức. Mỗi phiếu mang một số phiếu riêng, `amount` lấy theo `amount` của dòng `payment_history` tương ứng — không phải `amount_received` — cùng `group_payment` và cùng thời điểm với các dòng còn lại.

**Ví dụ minh họa — đơn hàng 200.000, khách trả tiền mặt 100.000 + chuyển khoản 30.000 + ví điện tử 30.000, còn nợ 40.000:**

| Dòng | Số phiếu | Nguồn tiền | amount | amount_received | refund | debt | debt_type | group_payment |
|---|---|---|---|---|---|---|---|---|
| 1 | PT31 | Tiền mặt | 100.000 | 100.000 | 0 | NULL | NULL | `8k24bxaywchs6w8imal2` |
| 2 | PT32 | Chuyển khoản | 30.000 | 30.000 | 0 | NULL | NULL | `8k24bxaywchs6w8imal2` |
| 3 | PT33 | Ví điện tử | 30.000 | 30.000 | 0 | **40.000** | **1** | `8k24bxaywchs6w8imal2` |

**Ví dụ có tiền thừa — đơn hàng 200.000, khách đưa tiền mặt 120.000 cho phần 100.000 (thối 20.000), chuyển khoản 100.000, trả đủ:**

| Dòng | Số phiếu | Nguồn tiền | amount | amount_received | refund | debt | debt_type |
|---|---|---|---|---|---|---|---|
| 1 | PT31 | Tiền mặt | 100.000 | **120.000** | **20.000** | NULL | NULL |
| 2 | PT32 | Chuyển khoản | 100.000 | 100.000 | 0 | **0** | **0** |

Số tiền ghi nhận vào quỹ tiền mặt là 100.000 theo cột `amount`, không phải 120.000.

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Tổng số tiền các dòng bằng 0 | "Vui lòng nhập số tiền thanh toán." | Chặn, không cho bấm Thanh toán |
| Có dòng chưa chọn nguồn tiền | "Vui lòng chọn nguồn tiền cho tất cả các dòng." | Chặn, tô đỏ dòng thiếu |
| Dòng không phải tiền mặt nhập vượt số tiền còn thiếu (E-nhieu-pttt-005) | "Chỉ phương thức tiền mặt mới được nhập vượt số tiền cần thanh toán." | Chặn, đưa giá trị về số tiền còn thiếu |
| Đánh dấu loại thuộc nhóm loại trừ khi loại còn lại đang được đánh dấu | "Đã bỏ {tên loại cũ}. Chuyển khoản và Cổng thanh toán chỉ được chọn một." | Bỏ đánh dấu loại cũ, gỡ dòng của nó, giữ loại vừa chọn |
| Hai dòng loại Cơ bản cùng trỏ về một nguồn tiền | "Nguồn tiền này đã được chọn ở dòng khác." | Giữ nguyên lựa chọn cũ của dòng |
| Tắt công tắc Đa phương thức khi các dòng phía sau đã nhập số tiền | "Tắt đa phương thức sẽ bỏ các phương thức đã nhập. Tiếp tục?" | Chờ xác nhận; đồng ý thì giữ dòng đầu tiên và gỡ phần còn lại |
| Quét mã QR thất bại hoặc quá thời gian chờ | Theo thông báo hiện có của luồng QR | Quay lại màn hình Xác nhận thanh toán, giữ nguyên các dòng đã nhập; chưa sinh mã nhóm nên không phát sinh gì thêm |
| Giao diện không gửi mã nhóm | Không hiển thị cho thu ngân | Hệ thống tự sinh mã thay, ghi log cảnh báo |
| Cấp số phiếu thất bại | "Không thể tạo phiếu thu. Vui lòng thử lại." | Hủy toàn bộ giao dịch, không ghi dòng nào |
| Ghi dòng thứ *i* thất bại | "Không thể lưu thanh toán. Vui lòng thử lại." | Hủy toàn bộ giao dịch, kể cả các dòng đã ghi trước đó |
| Mất kết nối khi đang ghi dữ liệu | "Không thể kết nối máy chủ. Vui lòng thử lại." | Giữ nguyên màn hình và các dòng đã nhập. Lần bấm Thanh toán tiếp theo sinh mã nhóm mới |

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-nhieu-pttt-003 | Chỉ màn hình bán hàng được nhập nhiều phương thức thanh toán trong một lần. Các nghiệp vụ thu nợ, thu khác, mua hàng, nhập kho, trả hàng hoàn tiền giữ nguyên một phương thức cho mỗi lần thao tác |
| BR-nhieu-pttt-004 | Phương thức thanh toán được chọn bằng ô đánh dấu theo loại. Số dòng tối đa của một lần thanh toán bằng: 1 dòng Tiền mặt + 1 dòng thuộc nhóm Chuyển khoản/Cổng thanh toán + số nguồn tiền loại Cơ bản đang hoạt động của cửa hàng. **Hai dòng loại Cơ bản không được cùng trỏ về một nguồn tiền** |
| BR-nhieu-pttt-005 | Tổng số tiền của các dòng không được vượt quá tổng tiền cần thanh toán của đơn hàng, ngoại trừ phần vượt của dòng tiền mặt được tính là tiền thừa |
| BR-nhieu-pttt-006 | Loại Chuyển khoản và loại Cổng thanh toán **loại trừ lẫn nhau**: cả lần thanh toán chỉ được đánh dấu một trong hai. Khi thu ngân đánh dấu loại này thì hệ thống bỏ đánh dấu loại kia, gỡ dòng của nó và thông báo. Trong loại Chuyển khoản chỉ được chọn một tài khoản; trong loại Cổng thanh toán chỉ được chọn một cổng |
| BR-nhieu-pttt-007 | Mã nhóm thanh toán do giao diện sinh, gồm đúng 20 ký tự lấy từ bộ `abcdefghijklmnopqrstuvwxyz0123456789`. Sinh **tại thời điểm thu ngân bấm Thanh toán**, ngay trước khi gửi yêu cầu xuống hệ thống, và gửi kèm trong cùng yêu cầu đó. **Cấm** sinh mã ở tầng khởi tạo dùng chung, biến toàn cục, hay bất kỳ nơi nào giữ lại giá trị để dùng cho lần bấm sau |
| BR-nhieu-pttt-008 | Mỗi lần bấm Thanh toán sinh một mã nhóm mới. Bấm hai lần liên tiếp tạo ra hai lần thanh toán riêng biệt với hai mã khác nhau — đúng như hành vi hiện tại của hệ thống |
| BR-nhieu-pttt-009 | Một lần thanh toán mở tối đa một màn hình quét mã QR, vì nhóm Chuyển khoản và Cổng thanh toán chỉ được một dòng (BR-nhieu-pttt-006) |
| BR-nhieu-pttt-010 | Trường Phương thức thanh toán hóa đơn (`bill.payment_method`) giữ nguyên là trường độc lập do thu ngân tự chọn, phục vụ in hóa đơn. Hệ thống **không** suy ra giá trị này từ các dòng phương thức thanh toán |
| BR-nhieu-pttt-011 | **Quy tắc tự điền số tiền.** Loại đầu tiên được chọn tự điền **toàn bộ** tổng tiền cần thanh toán. Mỗi loại được đánh dấu thêm sau đó tự điền bằng **số tiền còn thiếu** — tổng tiền cần thanh toán trừ tổng số tiền của các dòng đang có, tối thiểu bằng 0. Thu ngân sửa tay được; sửa một dòng **không** làm hệ thống tính lại số tiền của các dòng đã có trước đó. *Ví dụ: đơn 150.000, đánh dấu Tiền mặt tự điền 150.000; thu ngân sửa xuống 130.000; đánh dấu thêm Chuyển khoản thì dòng này tự điền 20.000* |
| BR-nhieu-pttt-012 | Dòng loại **Tiền mặt không có combo-box** chọn nguồn tiền, vì loại này chỉ có một nguồn. Các loại còn lại (Chuyển khoản, Cổng thanh toán, Cơ bản) bắt buộc chọn một nguồn tiền cụ thể trong combo-box của dòng |
| BR-nhieu-pttt-013 | Mỗi phương thức thanh toán sinh đúng một dòng `payment_history` và đúng một phiếu thu `mc_receipt` |
| BR-nhieu-pttt-014 | Toàn bộ số phiếu của một lần thanh toán phải được cấp trong **một lần gọi duy nhất**, đảm bảo các số không trùng nhau và không trùng phiếu đã có. Cấm gọi lặp cơ chế cấp số một-phiếu-một-lần nhiều lần liên tiếp trong cùng giao dịch |
| BR-nhieu-pttt-015 | Số phiếu thu tăng dần liên tục theo quy tắc hiện hành, **không có hậu tố**. Ba phương thức trong một lần thanh toán nhận `PT31`, `PT32`, `PT33`; phiếu tiếp theo của cửa hàng là `PT34` |
| BR-nhieu-pttt-016 | Cột `debt` và `debt_type` để **trống (NULL)** ở tất cả các dòng trung gian. Dòng cuối cùng của lần thanh toán mang giá trị `debt` bằng **tổng tiền đơn hàng trừ tổng `amount` của tất cả các dòng trong lần thanh toán đó**, và `debt_type` bằng 1 nếu `debt` lớn hơn 0, bằng 0 nếu `debt` bằng 0. **Cấm** ghi giá trị 0 vào các dòng trung gian, vì 0 mang nghĩa "đã trả hết" |
| BR-nhieu-pttt-017 | Số tiền còn nợ trừ theo cột `amount`, **không** trừ theo `amount_received`. Phần tiền thừa đã trả lại khách không làm giảm công nợ |
| BR-nhieu-pttt-018 | Các dòng của một lần thanh toán được ghi **tuần tự trong một giao dịch dữ liệu**, không ghi song song. Thứ tự ghi phải trùng thứ tự thu ngân đã nhập trên màn hình, để dòng đầu tiên có `id` nhỏ nhất và dòng cuối cùng có `id` lớn nhất |
| BR-nhieu-pttt-019 | Toàn bộ các dòng của một lần thanh toán mang **cùng một giá trị thời điểm** ở `payment_history.create_time`, `mc_receipt.date` và `mc_receipt.create_time`. Thời điểm được lấy một lần khi bắt đầu giao dịch, **cấm** lấy lại giờ hệ thống trong vòng lặp ghi từng dòng |
| BR-nhieu-pttt-020 | Nếu bất kỳ dòng nào ghi thất bại, hủy toàn bộ giao dịch. Không được để tình trạng ghi được một phần |
| BR-nhieu-pttt-021 | Phiếu thu và phiếu chi **không dùng chung mã nhóm**. Khi trả hàng hoàn tiền, giao diện sinh mã nhóm mới cho lần hoàn đó; cấm gán lại mã nhóm của lần thu ban đầu cho phiếu chi |

---

### 3.3 Hiển thị lịch sử thanh toán theo lần thanh toán

#### 3.3.1 Thông tin chung về chức năng

Tab Lịch sử thanh toán trong màn hình Chi tiết đơn hàng hiện đang liệt kê mỗi dòng `payment_history` thành một dòng lưới, với cột "Lần thanh toán" đánh số thứ tự tăng dần. Khi một lần thanh toán sinh nhiều dòng, cách hiển thị này sẽ đếm sai số lần khách đã trả.

Chức năng điều chỉnh cách hiển thị: gom các dòng cùng mã nhóm thành một lần thanh toán.

#### 3.3.2 Màn hình chức năng

> *Nội dung mục này tạm để trống, sẽ bổ sung sau khi thống nhất thiết kế giao diện.*

*(Đính kèm wireframe/mockup sau)*

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| | | | | | |

**Dạng hiển thị mong muốn.** Mỗi dòng `payment_history` là một dòng lưới, **không gộp ô**. Các dòng thuộc cùng một lần thanh toán mang **cùng số thứ tự** ở cột Lần thanh toán và cùng giá trị ở các cột Thời gian, Thu ngân — giá trị được lặp lại trên từng dòng.

Ví dụ — đơn hàng 200.000 trả hai đợt. Đợt 1 dùng ba phương thức, đợt 2 trả nốt phần còn nợ:

| Lần thanh toán | Thời gian thanh toán | Phương thức thanh toán | Thu ngân | Số tiền thanh toán | Số tiền còn lại |
|---|---|---|---|---|---|
| 1 | 12/12/2025 13:40 | Tiền mặt | Hồng Nhật | 100.000 | |
| 1 | 12/12/2025 13:40 | Chuyển khoản | Hồng Nhật | 30.000 | |
| 1 | 12/12/2025 13:40 | Ví điện tử | Hồng Nhật | 30.000 | 40.000 |
| 2 | 13/12/2025 09:15 | Tiền mặt | Hồng Nhật | 40.000 | 0 |

Ba dòng đầu cùng thuộc lần thanh toán 1 nên cùng mang số **1**; dòng thứ tư thuộc lần thanh toán sau nên mang số **2**. Cột Số tiền còn lại chỉ có giá trị ở dòng cuối của mỗi lần, đúng theo cách ghi dữ liệu tại BR-nhieu-pttt-016.

#### 3.3.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Cho người dùng thấy đúng số lần khách đã thanh toán và các phương thức đã dùng trong mỗi lần |
| **Tác nhân** | Thu ngân, Quản lý cửa hàng |
| **Điều kiện kích hoạt** | Mở màn hình Chi tiết đơn hàng, chọn tab **Lịch sử thanh toán** |
| **Điều kiện tiên quyết** | Đã đăng nhập; có quyền xem chi tiết đơn hàng |
| **Điều kiện sau khi thực hiện** | Lưới hiển thị các lần thanh toán, mỗi lần gồm một hoặc nhiều dòng phương thức |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Người dùng mở tab Lịch sử thanh toán | Đọc `payment_history` lọc `ref_id` = mã đơn hàng và `type_doc` = 1, sắp xếp theo `id` tăng dần |
| 2 | *(Hệ thống tự động)* | **Gom nhóm theo `group_payment`**: các dòng có cùng giá trị `group_payment` khác rỗng thuộc cùng một lần thanh toán; dòng có `group_payment` rỗng tự nó là một lần thanh toán độc lập. Đánh số cột "Lần thanh toán" theo thứ tự nhóm, bắt đầu từ 1 |
| 3 | *(Hệ thống tự động)* | Hiển thị mỗi dòng `payment_history` thành một dòng lưới, không gộp ô. Cột Lần thanh toán ghi số thứ tự của nhóm, lặp lại trên mọi dòng cùng nhóm. Cột Thời gian lấy `create_time`, cột Thu ngân lấy `ep_user.name` theo `payment_history.creator` — hai cột này cũng lặp lại giá trị trên từng dòng. Cột Phương thức lấy `payment_source_name`, cột Số tiền thanh toán lấy `amount`. Cột Số tiền còn lại chỉ hiển thị ở dòng cuối của mỗi nhóm, các dòng khác để trống |

```sql
-- Truy vấn lấy lịch sử thanh toán của một đơn hàng
SELECT  ph.id,
        ph.group_payment,
        ph.create_time,
        ph.payment_source_name,
        ph.amount,
        ph.debt,
        u.name AS cashier_name
FROM    payment_history ph
LEFT JOIN ep_user u ON u.id = ph.creator
WHERE   ph.ref_id   = @bill_id
  AND   ph.type_doc = 1
ORDER BY ph.id ASC;
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Đơn hàng chưa có lần thanh toán nào | "Chưa có lịch sử thanh toán." | Hiển thị lưới rỗng |

#### 3.3.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-nhieu-pttt-022 | Hai dòng `payment_history` thuộc cùng một lần thanh toán khi có **cùng giá trị `group_payment` khác rỗng**. Dòng có `group_payment` rỗng tự nó là một lần thanh toán độc lập — áp dụng cho toàn bộ dữ liệu phát sinh trước khi triển khai |
| BR-nhieu-pttt-023 | **Cấm** gom nhóm dựa trên thời gian hoặc mã đơn hàng. Trong dữ liệu hiện có, 90% bản ghi `mc_receipt` và 34% bản ghi `payment_history` chỉ lưu thời gian tới đơn vị giây, và đã tồn tại đơn hàng có nhiều lần thanh toán trùng nhau tới từng giây |
| BR-nhieu-pttt-024 | Lưới hiển thị **mỗi dòng `payment_history` thành một dòng**, không gộp ô. Cột "Lần thanh toán" ghi số thứ tự của nhóm và **lặp lại cùng một số trên mọi dòng thuộc nhóm đó**: ba phương thức trả cùng một lần đều mang số 1, lần thanh toán tiếp theo của đơn mang số 2. Các cột Thời gian thanh toán và Thu ngân cũng lặp lại giá trị trên từng dòng |
| BR-nhieu-pttt-025 | Cột "Số tiền còn lại" chỉ hiển thị ở **dòng cuối của mỗi lần thanh toán** — dòng có `id` lớn nhất trong nhóm. Các dòng còn lại để trống, không hiển thị 0, vì 0 mang nghĩa "đã trả hết" |
| BR-nhieu-pttt-026 | Cột "Phương thức" lấy từ `payment_history.payment_source_name`. Không dùng `payment_history.payment_method` — trường này đã ngừng sử dụng theo [SRS Quản lý nguồn tiền](../../payment-source/srs/spec.md) và đang rỗng ở dữ liệu mới |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Xác nhận thanh toán | Màn hình Xác nhận thanh toán | **Cao** | Thiết kế hiện tại trong [SRS Quản lý nguồn tiền](../../payment-source/srs/spec.md) dùng radio button chọn một nguồn tiền, một ô Khách trả, và công thức Tiền thừa bằng *Khách trả trừ Tổng tiền*. Toàn bộ phần này bị thay thế bằng danh sách nhiều dòng, mỗi dòng một ô số tiền, và tiền thừa chỉ tính trên dòng tiền mặt |
| Lịch sử thanh toán | Chi tiết đơn hàng — tab Lịch sử thanh toán | **Cao** | Cách đếm "Lần thanh toán" và cách hiển thị cột "Số tiền còn lại" thay đổi theo Mục 3.3. Ngoài ra nguồn dữ liệu cột Phương thức phải đổi sang `payment_source_name` |
| Thiết lập chung | Màn hình Thiết lập chung | **Trung bình** | Bổ sung một mục cấu hình mới cho phép bật/tắt thanh toán đa phương thức (Mục 3.1) |
| In phiếu thu | Mẫu in phiếu thu | **Trung bình** | Một lần thanh toán nay sinh nhiều phiếu thu. Cách in — mỗi phiếu một tờ hay gộp các phiếu cùng `group_payment` vào một tờ — nằm ngoài phạm vi tài liệu này, cần thống nhất riêng |
| Báo cáo doanh thu theo nguồn tiền | Báo cáo | **Trung bình** | Được lợi từ thay đổi: trước đây thanh toán hỗn hợp gộp thành một phiếu với phương thức `TM/CK` nên không tách được số tiền từng nguồn; từ nay tách đúng. Lưu ý dữ liệu cũ vẫn ở dạng gộp, báo cáo sẽ có hai thế hệ dữ liệu khác nhau |
| Sổ quỹ tiền mặt | Kế toán | **Trung bình** | Số phiếu thu phát sinh nhiều hơn trước, mỗi phiếu một nguồn tiền. Số tiền vào quỹ tiền mặt lấy theo `amount`, không phải `amount_received` (BR-nhieu-pttt-021) |
| Thu nợ, thu khác | Màn hình thu tiền | **Thấp** | Không đổi — vẫn một phương thức cho mỗi lần thu (BR-nhieu-pttt-003). Cột `group_payment` để rỗng |
| Trả hàng hoàn tiền | Màn hình trả hàng | **Thấp** | Không đổi — thu ngân vẫn chọn một phương thức hoàn tiền. Cột `group_payment` được ghi nhưng mỗi mã chỉ gắn một phiếu chi. Lưu ý nghiệp vụ: phương thức hoàn do thu ngân chọn, không tự ánh xạ theo phương thức đã thu, nên có thể tiền vào bằng chuyển khoản mà hoàn ra bằng tiền mặt — báo cáo dòng tiền theo nguồn sẽ lệch tương ứng |
| Mua hàng, nhập kho | Các màn hình liên quan | **Thấp** | Không đổi (BR-nhieu-pttt-003) |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Hóa đơn điện tử | Đẩy hóa đơn lên cơ quan thuế | **Thấp** | Không đổi. Trường Phương thức thanh toán trên hóa đơn lấy từ `bill.payment_method` do thu ngân tự chọn, độc lập với các dòng phương thức thanh toán (BR-nhieu-pttt-014) |
| Cổng thanh toán | Luồng tạo và xác nhận mã QR | **Thấp** | Không đổi. Một lần thanh toán chỉ mở tối đa một màn hình quét mã (BR-nhieu-pttt-012), nên luồng hiện tại dùng lại nguyên vẹn |

---

## 5. CÂU HỎI MỞ

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| 1 | Ô **Khách trả** ở cuối màn hình Xác nhận thanh toán mang nghĩa gì khi bật đa phương thức? Tiền thừa lấy từ ô này, hay từ ô số tiền của dòng tiền mặt? Tài liệu đang viết theo dòng tiền mặt | Mục 3.2.3 bước 5, BR-nhieu-pttt-009 | Chủ nhiệm sản phẩm | Trước khi chốt thiết kế màn hình |
| 2 | Ô đánh dấu **Ghi nợ** hoạt động ra sao khi tổng các dòng nhỏ hơn tổng tiền: thu ngân phải tự đánh dấu, hay hệ thống tự bật? | Mục 3.2.3, BR-nhieu-pttt-020 | Chủ nhiệm sản phẩm | Trước khi chốt thiết kế màn hình |
| 3 | Loại **Cơ bản** được nhiều dòng, nhưng thiết kế hiện chỉ có một ô đánh dấu cho loại này. Thêm dòng Cơ bản thứ hai bằng cách nào — nút Thêm riêng trong khối, chọn nguồn khác thì tự sinh dòng mới, hay ô đánh dấu mở ra danh sách nguồn để tích từng cái? | Mục 3.2.2 thành phần 3, Mục 3.2.3 bước 3 | Chủ nhiệm sản phẩm | Trước khi chốt thiết kế màn hình |

---

## PHỤ LỤC A — Hàm sinh mã nhóm thanh toán

Mã nhóm do giao diện sinh theo BR-nhieu-pttt-010. Bản đề xuất:

```js
export function generateRandomUniQueString(length = 12) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters[values[i] % characters.length];
  }
  return randomString;
}

// Dùng cho mã nhóm thanh toán:
const groupPayment = generateRandomUniQueString(20);
```

**Hai điểm cần lưu ý khi hiện thực:**

1. **Độ dài phải cố định 20 ký tự.** Cách viết cũ dùng `Math.random().toString(36).slice(2)` không đảm bảo độ dài — gặp số ngẫu nhiên tận cùng bằng 0 thì chuỗi ngắn hơn. Trong dữ liệu hiện có của cột `bill_product.group_batch` đang lẫn lộn mã dài 10, 13, 20 và 36 ký tự vì lý do này. Cần có kiểm thử xác nhận kết quả luôn đúng 20 ký tự.

2. **Dùng `crypto.getRandomValues()` thay cho `Math.random()`.** Máy POS tại cửa hàng thường là thiết bị Android cùng dòng, cùng phiên bản; một số môi trường khởi tạo bộ sinh ngẫu nhiên yếu, hai máy bật cùng lúc có thể cho ra dãy số giống nhau.

**Cảnh báo từ dữ liệu hiện có:** cột `bill_product.group_batch` đang dùng cùng cơ chế mã nhóm cho nghiệp vụ lô hàng, và đang bị tái sử dụng mã nghiêm trọng — 1.756 trên 50.224 mã (3,5%) được dùng cho nhiều hóa đơn khác nhau, mã tệ nhất xuất hiện trên 8.052 hóa đơn. Nguyên nhân nhiều khả năng là mã được sinh một lần rồi giữ lại dùng tiếp. Đây chính là lý do BR-nhieu-pttt-010 quy định rõ mã phải được sinh ngay tại thời điểm bấm Thanh toán và không được giữ lại cho lần bấm sau.

**Ví dụ giá trị hợp lệ:**

```
8k24bxaywchs6w8imal2
6dlq7svk5tu299twvdcl
l7wjzk1zxc8aitep941y
```
