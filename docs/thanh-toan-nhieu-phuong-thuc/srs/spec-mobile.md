---
type: srs
feature: thanh-toan-nhieu-phuong-thuc
platform: mobile
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-04
updated: 2026-08-04
links: [docs/thanh-toan-nhieu-phuong-thuc/srs/spec.md]
tags: [mobile]
stale_reason: ""
changelog:
  - 2026-08-04 | /ba-write-srs | initial draft SRS mobile — cấu hình và công tắc đa phương thức
---

# SRS — Thanh toán nhiều phương thức trên Mobile

**Mã tài liệu:** SRS-MPT-MOB-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-08-04
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft
**Tài liệu gốc (web):** [docs/thanh-toan-nhieu-phuong-thuc/srs/spec.md](spec.md)

> Tài liệu này **chỉ mô tả giao diện và tương tác trên mobile**. Nghiệp vụ, quy tắc, cách ghi dữ liệu và xử lý phía hệ thống kế thừa nguyên vẹn từ SRS web — không viết lại ở đây.
>
> Phạm vi giống web: **chỉ nghiệp vụ bán hàng**. Thu nợ, thu khác, mua hàng, nhập kho, trả hàng hoàn tiền trên mobile giữ nguyên một phương thức mỗi lần.

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-08-04 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu mobile | Chỉ mô tả giao diện |

---

## MỤC LỤC

1. Danh sách chức năng
2. Chi tiết các chức năng
   - FR-M01 — Cấu hình phương thức thanh toán (Mobile)
   - FR-M02 — Thanh toán nhiều phương thức trên màn Xác nhận thanh toán (Mobile)
3. Nghiệp vụ ảnh hưởng

---

## 1. DANH SÁCH CHỨC NĂNG

| Mã | Actor | Màn hình | Chức năng | Quy tắc kế thừa từ web |
|---|---|---|---|---|
| FR-M01 | Quản lý cửa hàng | Thiết lập > Bán hàng | Cấu hình phương thức thanh toán | BR-nhieu-pttt-001, BR-nhieu-pttt-002 |
| FR-M02 | Thu ngân | Xác nhận thanh toán | Thanh toán nhiều phương thức | BR-nhieu-pttt-003 đến BR-nhieu-pttt-012 |

---

## 2. CHI TIẾT CÁC CHỨC NĂNG

### FR-M01 — Cấu hình phương thức thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Cho quản lý cửa hàng bật hoặc tắt tính năng thanh toán nhiều phương thức trên app |
| **Kích hoạt** | Vào Thiết lập > Bán hàng |
| **Tiền điều kiện** | Đã đăng nhập; có quyền cấu hình cửa hàng |
| **Hậu điều kiện** | Cấu hình được lưu; màn Xác nhận thanh toán hiển thị theo giá trị mới ở lần mở tiếp theo |
| **Quy tắc NV** | Kế thừa BR-nhieu-pttt-001, BR-nhieu-pttt-002 |

**Bố cục màn hình Thiết lập > Bán hàng** — danh sách dọc, cuộn được:

```
┌──────────────────────────────────────┐
│ ‹  Bán hàng                           │
├──────────────────────────────────────┤
│ Cho phép xuất quá số lượng tồn    ( )│
│ Áp dụng voucher, CTKM             (●)│
│ Gộp voucher, CTKM                 (●)│
│ Thuế tiêu thụ đặc biệt            ( )│
│ In tem nhãn khi thanh toán        ( )│
├──────────────────────────────────────┤
│ Phương thức thanh toán             › │  ← MỚI
│ Một phương thức                      │
├──────────────────────────────────────┤
│ Danh sách hình thức thanh toán     › │
│ Tiền mặt                             │
│ Cấu hình hiển thị combo trên HĐĐT  › │
│ Chỉ hiển thị tên sản phẩm combo      │
│ Hiển thị danh sách đã lưu         (●)│
│ Chọn nhân viên cho từng SP dịch vụ(●)│
└──────────────────────────────────────┘
```

**Thành phần mới:**

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Phương thức thanh toán | Dòng điều hướng | Một phương thức | Có | Dòng trên là nhãn, dòng dưới in đậm là giá trị đang chọn. Chạm vào mở màn hình con chọn giá trị |

**Màn hình con — chọn phương thức thanh toán:**

```
┌──────────────────────────────────────┐
│ ‹  Phương thức thanh toán             │
├──────────────────────────────────────┤
│ Một phương thức                   (◉)│
│ Đa phương thức                    ( )│
└──────────────────────────────────────┘
```

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Một phương thức | Radio | Được chọn | Có | Chọn xong lưu ngay và quay lại màn Bán hàng |
| 2 | Đa phương thức | Radio | — | Có | Chọn xong lưu ngay và quay lại màn Bán hàng |

**Giao diện phải làm gì:**

- Đọc giá trị cấu hình `enable_multi_payment` của cửa hàng khi mở màn Bán hàng, hiển thị ở dòng giá trị: `"0"` → *Một phương thức*, `"1"` → *Đa phương thức*.
- Gửi giá trị mới xuống hệ thống **ngay khi người dùng chọn** ở màn hình con, không chờ thao tác lưu nào khác.
- Sau khi lưu thành công, quay lại màn Bán hàng và cập nhật lại dòng giá trị.
- Màn Xác nhận thanh toán đọc lại cấu hình ở **lần mở tiếp theo**; không cần cập nhật màn đang mở.

**Khác biệt so với web:**

- Web dùng **radio button hiển thị ngay tại chỗ**; mobile dùng **dòng điều hướng mở màn hình con**, theo đúng nếp của các mục "Danh sách hình thức thanh toán" và "Cấu hình hiển thị combo" đang có.
- Mobile **lưu ngay khi chọn**, không có nút Lưu chung như màn Thiết lập trên web.
- Không dùng công tắc bật/tắt cho mục này, để nhãn giá trị khớp với web là *Một phương thức / Đa phương thức*.

---

### FR-M02 — Thanh toán nhiều phương thức trên màn Xác nhận thanh toán (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Cho thu ngân ghi nhận khách trả bằng nhiều phương thức trong một lần thao tác |
| **Kích hoạt** | Thu ngân bấm Thanh toán trên màn bán hàng |
| **Tiền điều kiện** | Đã đăng nhập; có quyền bán hàng; đơn có ít nhất một sản phẩm; cấu hình ở FR-M01 đang là *Đa phương thức* |
| **Hậu điều kiện** | Đơn hàng và các bản ghi thanh toán được sinh theo SRS web Mục 3.2.3 |
| **Quy tắc NV** | Kế thừa BR-nhieu-pttt-003 đến BR-nhieu-pttt-012 |

**Bố cục màn hình** — xếp dọc, cuộn được, nút Thanh toán ghim đáy:

```
┌──────────────────────────────────────┐
│ ‹  Xác nhận thanh toán                │
├──────────────────────────────────────┤
│ Tổng tiền cần thanh toán       50.006 │  ← Vùng 1
│ Khách cần thanh toán           50.006 │
│ Khách trả                      50.006 │
│ ( ) Ghi nợ                            │
├──────────────────────────────────────┤
│ Phương thức thanh toán                │  ← Vùng 2
│                  Đa phương thức   (●) │
│ ☐ Tiền mặt                            │
│ ☑ Chuyển khoản                        │
│ ☐ Cổng thanh toán                     │
│ ☐ Cơ bản                              │
│ ┌──────────────────────────────────┐ │  ← Vùng 3
│ │ 🗑  Chuyển khoản        [   0 ] đ │ │
│ │    [ Vietcombank              ▾ ] │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Phương thức thanh toán hoá đơn     › │  ← Vùng 4
│ Tiền mặt                              │
├──────────────────────────────────────┤
│ [            Thanh toán            ]  │
└──────────────────────────────────────┘
```

**Vùng 1 — Số tiền:**

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Tổng tiền cần thanh toán | Text (chỉ đọc) | Tổng tiền đơn | — | |
| 2 | Khách cần thanh toán | Text (chỉ đọc) | Tổng tiền đơn | — | Số tiền còn phải thu sau khi trừ tổng các dòng đã nhập |
| 3 | Khách trả | Textbox (số) | Tổng tiền cần thanh toán | Có | Số tiền khách đưa |
| 4 | Ghi nợ | Công tắc bật/tắt | Tắt | Không | Bật khi khách trả thiếu và phần còn lại ghi vào công nợ |

**Vùng 2 — Chọn loại phương thức:**

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Đa phương thức | Công tắc bật/tắt | Tắt | Không | Chỉ hiển thị khi cấu hình ở FR-M01 là *Đa phương thức*. Tắt thì khối dưới là radio chọn một loại; bật thì chuyển thành ô đánh dấu chọn nhiều loại |
| 2 | Danh sách loại | Radio khi tắt; **ô đánh dấu** khi bật | Tiền mặt | Có | Đúng **bốn loại** như web: Tiền mặt, Chuyển khoản, Cổng thanh toán, Cơ bản. Chỉ hiện loại có ít nhất một nguồn tiền đang hoạt động; loại Cổng thanh toán còn cần đã kết nối thành công |

> **Lưu ý cho lập trình:** bản mockup hiện tại đang liệt kê năm mục *Tiền mặt / Chuyển khoản / TM/CK / Cổng thanh toán / Khác*. Đây là danh sách cố định của trường **Hình thức TT hóa đơn**, không phải danh sách loại nguồn tiền. Phải sửa lại thành đúng bốn loại nêu trên cho khớp web.

**Vùng 3 — Các dòng phương thức đã chọn** (mỗi loại được đánh dấu sinh một thẻ):

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Nút gỡ dòng | Icon thùng rác | — | — | Gỡ thẻ và bỏ đánh dấu loại tương ứng |
| 2 | Tên loại | Text | — | — | Hiển thị tên loại của dòng |
| 3 | Số tiền | Textbox (số) | Theo quy tắc tự điền của web | Có | Loại đầu tiên chọn tự điền toàn bộ tổng tiền; loại chọn thêm sau tự điền phần còn thiếu |
| 4 | Nguồn tiền | Dropdown | Nguồn mặc định của loại | Có, **trừ dòng Tiền mặt** | Đặt ở **dòng thứ hai trong thẻ**, không nằm cùng hàng với số tiền như web. Dòng Tiền mặt không có dropdown |

**Vùng 4 — Hình thức thanh toán hóa đơn và nút hành động:**

| # | Thành phần | Loại | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Phương thức thanh toán hoá đơn | Dòng điều hướng | Theo thiết lập hiện hành | Có | Chạm mở màn hình con chọn giá trị. Trường độc lập, không suy ra từ các dòng phương thức |
| 2 | Thanh toán | Button (chính) | — | — | Ghim đáy màn hình. Nếu có dòng loại Chuyển khoản hoặc Cổng thanh toán thì mở màn hình quét mã QR trước |

**Giao diện phải làm gì:**

*Khi mở màn hình*

- Đọc cấu hình `enable_multi_payment`: `"1"` thì hiển thị công tắc Đa phương thức ở trạng thái tắt, `"0"` thì không hiển thị công tắc.
- Lọc danh sách loại: chỉ hiện loại có ít nhất một nguồn tiền đang hoạt động; loại Cổng thanh toán còn cần đã kết nối thành công.

*Trong lúc thu ngân nhập*

- **Tự điền số tiền**: loại đầu tiên được chọn điền toàn bộ tổng tiền cần thanh toán; loại chọn thêm sau điền phần còn thiếu, tối thiểu bằng 0. Thu ngân sửa tay một dòng thì **không** tính lại các dòng đã có.
- **Chặn chọn đồng thời** Chuyển khoản và Cổng thanh toán: đánh dấu loại này thì bỏ đánh dấu loại kia, gỡ thẻ của nó và báo cho thu ngân biết.
- **Chặn trùng nguồn tiền** giữa hai thẻ loại Cơ bản.
- Chỉ cho dòng Tiền mặt nhập số tiền vượt phần phân bổ; các dòng khác nhập vượt thì báo lỗi và đưa về phần còn thiếu.
- Tính lại **Khách cần thanh toán** và tiền thừa sau mỗi lần thu ngân sửa số tiền hoặc gỡ thẻ.

*Khi bấm Thanh toán*

- Kiểm tra lần cuối các ràng buộc về số dòng, tổng số tiền và loại trừ loại.
- Nếu có dòng thuộc loại Chuyển khoản hoặc Cổng thanh toán thì mở màn hình quét mã QR cho **dòng đó** và chờ xác nhận — tối đa một lần quét cho mỗi lần thanh toán.
- **Sinh mã `group_payment`** gồm đúng 20 ký tự lấy từ bộ `abcdefghijklmnopqrstuvwxyz0123456789`, sinh **ngay tại thời điểm bấm Thanh toán** sau khi đã qua bước quét mã.
- **Gửi `group_payment` kèm payload** xuống hệ thống trong cùng một yêu cầu: dữ liệu đơn hàng, danh sách dòng phương thức (nguồn tiền, số tiền phân bổ, số tiền khách đưa), phương thức thanh toán hóa đơn và cờ Ghi nợ.
- **Không giữ lại mã** cho lần bấm sau. Mỗi lần bấm Thanh toán sinh một mã mới; cấm sinh mã ở biến dùng chung hay bất kỳ nơi nào sống lâu hơn màn hình.
- Hệ thống trả về thành công thì đóng màn hình và hiển thị thông báo.

**Khác biệt so với web:**

| Điểm | Web | Mobile |
|---|---|---|
| Thứ tự khối | Khối phương thức ở trên, Khách trả và Ghi nợ ở dưới | **Khách trả và Ghi nợ ở trên**, khối phương thức ở dưới |
| Ghi nợ | Ô đánh dấu cạnh ô Khách trả | **Công tắc bật/tắt** đứng riêng một dòng |
| Số tiền hiển thị | Một dòng Tổng tiền cần thanh toán | Thêm dòng **Khách cần thanh toán** hiển thị phần còn phải thu |
| Nguồn tiền của dòng | Cùng hàng với tên loại và số tiền | **Xuống dòng thứ hai** trong thẻ, do màn hình hẹp |
| Hình thức TT hóa đơn | Dropdown đổ tại chỗ | **Dòng điều hướng** mở màn hình con |
| Nút Thanh toán | Nằm cuối hộp thoại cùng nút Hủy bỏ | **Ghim đáy màn hình**, không có nút Hủy bỏ — thoát bằng nút quay lại ở đầu màn hình |

---

## 3. NGHIỆP VỤ ẢNH HƯỞNG

| Chức năng bị ảnh hưởng | Màn hình | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Xác nhận thanh toán | Xác nhận thanh toán (mobile) | **Cao** | Bổ sung công tắc Đa phương thức và khối dòng phương thức |
| Thiết lập bán hàng | Thiết lập > Bán hàng | **Trung bình** | Thêm một dòng điều hướng cấu hình mới |
| Lịch sử thanh toán | Chi tiết đơn hàng (mobile) | **Trung bình** | Một lần thanh toán nay có nhiều dòng; cách gom nhóm và đánh số theo SRS web Mục 3.3 |
| Thu nợ, thu khác, mua hàng, nhập kho, trả hàng | Các màn hình liên quan | **Thấp** | Không đổi — vẫn một phương thức mỗi lần |

---

## OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời |
|---|---|---|---|
| 1 | Dòng **Khách cần thanh toán** trên mobile mà web không có. Giá trị này là phần còn phải thu sau khi trừ các dòng đã nhập, hay là tổng tiền đơn lặp lại? | FR-M02 Vùng 1 | Chủ nhiệm sản phẩm |
| 2 | Màn hình hẹp, thu ngân chọn cả bốn loại thì khối dòng phương thức có cuộn riêng hay cuộn chung cả màn hình? | FR-M02 Vùng 3 | Thiết kế giao diện |
