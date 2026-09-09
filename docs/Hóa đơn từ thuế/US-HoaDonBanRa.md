# User Stories — Đồng Bộ Hóa Đơn Bán Ra Từ Thuế

> **Phạm vi:** Kéo hóa đơn bán ra từ CQT về EPOS để tạo đơn hàng, phục vụ trường hợp bán hàng ngoài POS (xuất HĐ thẳng trên phần mềm thuế).
> **Actor chính:** Quản lý cửa hàng | **Actor phụ:** Nhân viên

---

## 1. Danh sách User Story

| Story ID | Tên | Actor | I want to | So that | Priority | SP | Dependencies |
|---|---|---|---|---|---|---|---|
| US-01 | Đồng bộ HĐ bán ra từ CQT | Quản lý cửa hàng | đồng bộ hóa đơn bán ra từ CQT theo khoảng ngày | đưa giao dịch bán ngoài POS vào hệ thống mà không nhập tay | Must Have | 5 | tax_account đã cấu hình |
| US-02 | Xem danh sách HĐ bán ra | Quản lý / Nhân viên | xem, lọc và tìm kiếm danh sách HĐ bán ra đã đồng bộ | kiểm soát và đối chiếu dữ liệu hóa đơn từ thuế | Must Have | 3 | US-01 |
| US-03 | Xem file hóa đơn PDF | Quản lý / Nhân viên | xem nội dung file hóa đơn gốc từ CQT | đối chiếu thông tin hàng hóa thực tế với dữ liệu trên hệ thống | Must Have | 2 | US-01 |
| US-04 | Ghép khách hàng khi lập đơn | Quản lý cửa hàng | hệ thống tự động ghép KH từ HĐ bán ra với danh mục KH trong EPOS | không phải tìm kiếm và chọn KH thủ công cho từng hóa đơn | Must Have | 5 | US-01 |
| US-05 | Tạo KH mới trong luồng lập đơn | Quản lý cửa hàng | tạo khách hàng mới ngay trong màn hình lập đơn nếu KH chưa có trong hệ thống | không bị gián đoạn luồng lập đơn để sang màn hình khác tạo KH | Must Have | 3 | US-04 |
| US-06 | Ghép sản phẩm & lập đơn hàng | Quản lý cửa hàng | hệ thống tự động ghép SP theo mã hàng hóa và tạo đơn hàng từ HĐ bán ra | giao dịch bán ngoài POS được ghi nhận chính xác vào EPOS với tồn kho đúng | Must Have | 5 | US-04 |
| US-07 | Tạo SP mới trong luồng lập đơn | Quản lý cửa hàng | tạo sản phẩm mới ngay trong màn hình lập đơn nếu SP chưa có trong hệ thống | không bị gián đoạn luồng lập đơn để sang màn hình khác tạo SP | Must Have | 3 | US-06 |
| US-08 | Xem lịch sử đồng bộ | Quản lý / Nhân viên | xem lịch sử các lần đồng bộ HĐ bán ra | kiểm soát trạng thái và phát hiện lỗi kịp thời | Should Have | 2 | US-01 |

**Tổng Story Points: 28 SP**

---

## 2. Chi tiết User Story & Acceptance Criteria

---

### US-01 — Đồng bộ hóa đơn bán ra từ CQT

```
As a Quản lý cửa hàng,
I want to đồng bộ hóa đơn bán ra từ cơ quan thuế theo khoảng ngày,
So that tôi có thể đưa các giao dịch bán ngoài POS vào hệ thống
         mà không cần nhập tay.
```

**Priority:** Must Have | **SP:** 5
**Dependencies:** `tax_account` đã được cấu hình (dùng chung từ HĐ mua vào)
**Notes:** Dùng chung API `/sync-tax`, thêm param `type=sale`. Luồng 2 bước: metadata JSON → tải ZIP (invoice.xml, invoice.html). Lưu vào `invoice_tax` với `type='sale'`, lịch sử vào `invoice_tax_sync_history` với `type='sale'`.

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC1-01 | Giới hạn khoảng ngày | Hệ thống **không được** gọi API và **phải** hiển thị lỗi "Khoảng ngày đồng bộ tối đa 30 ngày" | Khoảng ngày từ − đến > 30 ngày | — |
| AC1-02 | Hiển thị tiến trình | Hệ thống **phải** hiển thị progress bar trong suốt quá trình đồng bộ và **không được** block thao tác khác trên UI | Đồng bộ đang chạy | — |
| AC1-03 | Lưu kết quả thành công | Hệ thống **phải** parse XML, kiểm tra trùng số HĐ và lưu vào `invoice_tax` với `type='sale'` cho mỗi HĐ tải thành công | Đồng bộ hoàn tất | — |
| AC1-04 | Thông báo kết quả | Hệ thống **phải** hiển thị tổng kết "Thành công: X, Thất bại: Y hóa đơn" sau khi đồng bộ xong | Luôn áp dụng | Nếu Y = 0 chỉ hiển thị "Thành công: X hóa đơn" |
| AC1-05 | Ghi log thất bại | Hệ thống **phải** ghi lý do lỗi vào `invoice_tax_sync_history` với `type='sale'` cho mỗi HĐ tải thất bại | Có HĐ thất bại | — |
| AC1-06 | Xử lý lỗi kết nối CQT | Hệ thống **phải** hiển thị "Kết nối CQT thất bại, vui lòng kiểm tra lại tài khoản" và **không được** lưu dữ liệu | Token hết hạn hoặc sai tài khoản | — |
| AC1-07 | Không có HĐ trong kỳ | Hệ thống **phải** hiển thị "Không có hóa đơn bán ra trong khoảng thời gian này" | CQT trả về 0 hóa đơn | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-02 — Xem danh sách hóa đơn bán ra

```
As a Quản lý cửa hàng / Nhân viên,
I want to xem, lọc và tìm kiếm danh sách hóa đơn bán ra đã đồng bộ,
So that tôi có thể kiểm soát và đối chiếu dữ liệu hóa đơn từ thuế.
```

**Priority:** Must Have | **SP:** 3
**Dependencies:** US-01

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC2-01 | Cột hiển thị bắt buộc | Danh sách **phải** hiển thị đủ các cột: Số HĐ, Ngày HĐ, Tên KH, Tổng tiền, Trạng thái; mặc định sắp xếp theo Ngày HĐ giảm dần | Luôn áp dụng | — |
| AC2-02 | Lọc theo trạng thái | Hệ thống **phải** cho phép lọc theo từng trạng thái: Chưa lập đơn / Đã lập đơn / Trùng lặp / Hủy / Điều chỉnh | Luôn áp dụng | — |
| AC2-03 | Tìm kiếm | Hệ thống **phải** cho phép tìm kiếm theo số HĐ, tên KH; danh sách **phải** cập nhật ngay khi user nhập | Luôn áp dụng | — |
| AC2-04 | Nhãn trạng thái chính xác | Mỗi HĐ **phải** hiển thị đúng 1 trong 5 nhãn trạng thái; **không được** hiển thị trạng thái trống hoặc không xác định | Luôn áp dụng | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-03 — Xem file hóa đơn PDF

```
As a Quản lý cửa hàng / Nhân viên,
I want to xem nội dung file hóa đơn gốc từ CQT,
So that tôi có thể đối chiếu thông tin hàng hóa thực tế với dữ liệu
         trên hệ thống.
```

**Priority:** Must Have | **SP:** 2
**Dependencies:** US-01
**Notes:** File `invoice.html` được tải về cùng ZIP trong quá trình đồng bộ. Có thể xem từ 2 ngữ cảnh: danh sách HĐ (US-02) và màn hình lập đơn (US-06).

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC3-01 | Mở PDF từ danh sách | Hệ thống **phải** mở `invoice.html` trong popup hoặc tab mới khi user nhấn icon xem trên danh sách HĐ bán ra | Luôn áp dụng | — |
| AC3-02 | Mở PDF từ màn hình lập đơn | Hệ thống **phải** cho phép xem `invoice.html` ngay trong màn hình lập đơn mà **không được** thoát khỏi luồng | Luôn áp dụng trong màn hình lập đơn | — |
| AC3-03 | Xử lý file không tồn tại | Hệ thống **phải** hiển thị thông báo "Không tìm thấy file hóa đơn" và **không được** báo lỗi hệ thống | File `invoice.html` không tồn tại trong ZIP | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-04 — Ghép khách hàng khi lập đơn

```
As a Quản lý cửa hàng,
I want to hệ thống tự động ghép khách hàng từ hóa đơn bán ra với
         danh mục khách hàng trong EPOS,
So that tôi không phải tìm kiếm và chọn khách hàng thủ công cho
         từng hóa đơn.
```

**Priority:** Must Have | **SP:** 5
**Dependencies:** US-01
**Notes:** Map theo **mã KH trong EPOS** (không phải MST). Kết quả ghép được lưu vào `invoice_customer_mapping` (tên KH từ HĐ thuế → mã KH EPOS) để tái sử dụng tự động. Đa phần HĐ bán ra ghi khách lẻ → gán KH lẻ mặc định.

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC4-01 | Ưu tiên mapping đã lưu | Hệ thống **phải** tự động ghép theo mã KH đã lưu trong `invoice_customer_mapping` mà **không** yêu cầu user xác nhận | Tên KH trong HĐ đã có mapping lưu sẵn | — |
| AC4-02 | Tự động ghép khi 1 kết quả | Hệ thống **phải** tự động ghép và lưu mapping (tên HĐ → mã KH) | Chưa có mapping; EPOS tìm thấy đúng 1 KH trùng tên | — |
| AC4-03 | Yêu cầu chọn khi nhiều kết quả | Hệ thống **phải** hiển thị danh sách KH trùng tên để user chọn; sau khi chọn **phải** lưu mapping (tên HĐ → mã KH được chọn) | Chưa có mapping; EPOS tìm thấy ≥ 2 KH trùng tên | — |
| AC4-04 | Cảnh báo không tìm thấy KH | Hệ thống **phải** hiển thị cảnh báo "Không tìm thấy khách hàng phù hợp" và cho phép user tìm kiếm chọn thủ công hoặc chuyển sang tạo KH mới (US-05) | Chưa có mapping; không tìm thấy KH trùng tên | — |
| AC4-05 | Gán khách lẻ mặc định | Hệ thống **phải** tự động gán vào KH "Khách lẻ" mặc định mà **không** yêu cầu xác nhận và **không** lưu mapping | Tên KH trong HĐ trống hoặc là khách lẻ | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-05 — Tạo KH mới trong luồng lập đơn

```
As a Quản lý cửa hàng,
I want to tạo khách hàng mới ngay trong màn hình lập đơn nếu KH
         chưa có trong hệ thống,
So that tôi không bị gián đoạn luồng lập đơn để sang màn hình
         khác tạo KH.
```

**Priority:** Must Have | **SP:** 3
**Dependencies:** US-04
**Notes:** Được kích hoạt từ AC4-04 (US-04) khi không tìm thấy KH. Sau khi tạo thành công, KH tự động được gán vào đơn đang lập và lưu mapping. Trường bắt buộc khi tạo KH — xem OQ-1.

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC5-01 | Không thoát khỏi luồng lập đơn | Hệ thống **phải** hiển thị form tạo KH trong popup/drawer ngay trên màn hình lập đơn mà **không được** điều hướng sang trang khác | User chọn "Tạo KH mới" | — |
| AC5-02 | Lưu KH vào danh mục | Sau khi tạo thành công, hệ thống **phải** lưu KH mới vào danh mục khách hàng của EPOS | Luôn áp dụng | — |
| AC5-03 | Tự động gán vào đơn | Hệ thống **phải** tự động gán KH mới vào đơn đang lập và lưu mapping (tên HĐ → mã KH mới) mà **không** yêu cầu user chọn lại | Tạo KH thành công | — |
| AC5-04 | Quay lại luồng lập đơn | Sau khi tạo KH thành công, hệ thống **phải** đóng form và trả user về màn hình lập đơn với KH đã được điền sẵn | Tạo KH thành công | — |
| AC5-05 | Hủy tạo KH | Nếu user hủy form tạo KH, hệ thống **phải** giữ nguyên trạng thái màn hình lập đơn và **không được** mất dữ liệu đã nhập | User nhấn Hủy | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-06 — Ghép sản phẩm & lập đơn hàng

```
As a Quản lý cửa hàng,
I want to hệ thống tự động ghép sản phẩm theo mã hàng hóa và tạo
         đơn hàng từ hóa đơn bán ra,
So that giao dịch bán ngoài POS được ghi nhận chính xác vào EPOS
         với tồn kho đúng.
```

**Priority:** Must Have | **SP:** 5
**Dependencies:** US-04
**Notes:** HĐ bán ra do chính người dùng xuất ra → mã hàng hóa trên HĐ thuế = mã SP trong EPOS → lookup thẳng theo mã, **không cần** bảng `invoice_product_mapping`. Mỗi 1 HĐ tạo 1 đơn hàng; tách nhiều đơn thực hiện thủ công sau khi tạo.

#### Acceptance Criteria

**6A — Ghép sản phẩm**

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC6-01 | Lookup SP theo mã hàng hóa | Hệ thống **phải** lookup trực tiếp theo mã hàng hóa trong `invoice_product_tax` với danh mục SP trong EPOS; **không được** dùng bảng `invoice_product_mapping` | Luôn áp dụng với HĐ bán ra | — |
| AC6-02 | Tự động ghép khi mã khớp | Hệ thống **phải** tự động ghép toàn bộ dòng SP có mã khớp mà **không** yêu cầu user xác nhận | Mã hàng hóa trong HĐ tìm thấy trong EPOS | — |
| AC6-03 | Cảnh báo mã không tìm thấy | Hệ thống **phải** đánh dấu cảnh báo trên dòng SP có mã không tìm thấy và **không được** cho phép lưu đơn khi còn dòng SP chưa được ghép | Mã hàng hóa không khớp bất kỳ SP nào trong EPOS | — |
| AC6-04 | Chọn SP có sẵn thủ công | Hệ thống **phải** cho phép user tìm kiếm và chọn SP có sẵn trong EPOS để gán vào dòng SP chưa ghép | Có dòng SP bị cảnh báo (AC6-03) | — |
| AC6-05 | Chuyển sang tạo SP mới | Hệ thống **phải** cho phép user chuyển sang tạo SP mới (US-07) nếu không tìm thấy SP phù hợp | Có dòng SP bị cảnh báo (AC6-03) | — |

**6B — Lập đơn hàng**

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC6-06 | Bắt buộc chọn trạng thái | Hệ thống **phải** yêu cầu user chọn trạng thái đơn hàng (Hoàn thành / Nháp) trước khi lưu; **không được** có giá trị mặc định | Tất cả SP đã được ghép | — |
| AC6-07 | Trừ tồn kho khi Hoàn thành | Hệ thống **phải** trừ tồn kho ngay tại thời điểm lưu đơn | User chọn trạng thái "Hoàn thành" | — |
| AC6-08 | Không trừ tồn kho khi Nháp | Hệ thống **không được** trừ tồn kho | User chọn trạng thái "Nháp" | — |
| AC6-09 | Cập nhật trạng thái HĐ | Hệ thống **phải** cập nhật trạng thái HĐ bán ra thành "Đã lập đơn" và lưu mã đơn hàng liên kết | Đơn hàng được lưu thành công | — |
| AC6-10 | Cảnh báo trùng lặp | Hệ thống **phải** hiển thị "Hóa đơn này đã được lập đơn hàng [mã đơn]" và **không được** tự động tạo đè; **phải** yêu cầu user xác nhận trước khi tiếp tục | HĐ bán ra đã có đơn hàng liên kết | — |
| AC6-11 | HĐ hủy / điều chỉnh | Hệ thống **phải** hiển thị đúng trạng thái (Hủy / Điều chỉnh) và **không được** tự động tác động vào đơn hàng liên quan | HĐ có trạng thái Hủy hoặc Điều chỉnh từ CQT | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-07 — Tạo SP mới trong luồng lập đơn

```
As a Quản lý cửa hàng,
I want to tạo sản phẩm mới ngay trong màn hình lập đơn nếu SP
         chưa có trong hệ thống,
So that tôi không bị gián đoạn luồng lập đơn để sang màn hình
         khác tạo SP.
```

**Priority:** Must Have | **SP:** 3
**Dependencies:** US-06
**Notes:** Được kích hoạt từ AC6-05 (US-06) khi không tìm thấy SP theo mã. Sau khi tạo thành công, SP tự động được gán vào dòng đang ghép và lưu vào danh mục.

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC7-01 | Không thoát khỏi luồng lập đơn | Hệ thống **phải** hiển thị form tạo SP trong popup/drawer ngay trên màn hình lập đơn mà **không được** điều hướng sang trang khác | User chọn "Tạo SP mới" | — |
| AC7-02 | Lưu SP vào danh mục | Sau khi tạo thành công, hệ thống **phải** lưu SP mới vào danh mục sản phẩm của EPOS | Luôn áp dụng | — |
| AC7-03 | Tự động gán vào dòng đang ghép | Hệ thống **phải** tự động gán SP mới vào đúng dòng SP đang chờ ghép mà **không** yêu cầu user chọn lại | Tạo SP thành công | — |
| AC7-04 | Quay lại luồng lập đơn | Sau khi tạo SP thành công, hệ thống **phải** đóng form và trả user về màn hình lập đơn với SP đã được điền sẵn | Tạo SP thành công | — |
| AC7-05 | Hủy tạo SP | Nếu user hủy form tạo SP, hệ thống **phải** giữ nguyên trạng thái màn hình lập đơn và **không được** mất dữ liệu đã nhập | User nhấn Hủy | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

### US-08 — Xem lịch sử đồng bộ hóa đơn bán ra

```
As a Quản lý cửa hàng / Nhân viên,
I want to xem lịch sử các lần đồng bộ hóa đơn bán ra,
So that tôi có thể kiểm soát trạng thái và phát hiện lỗi kịp thời.
```

**Priority:** Should Have | **SP:** 2
**Dependencies:** US-01

#### Acceptance Criteria

| AC | Tên quy tắc | Rule | Condition | Exception |
|---|---|---|---|---|
| AC8-01 | Hiển thị đúng loại | Danh sách lịch sử **chỉ** hiển thị các lần đồng bộ có `type='sale'`; **không được** lẫn lịch sử HĐ mua vào | Luôn áp dụng | — |
| AC8-02 | Cột bắt buộc | Mỗi dòng lịch sử **phải** hiển thị: Thời gian, Khoảng ngày đồng bộ, Tổng HĐ, Thành công, Thất bại, Trạng thái | Luôn áp dụng | — |
| AC8-03 | Xem chi tiết | Hệ thống **phải** hiển thị chi tiết danh sách HĐ thành công và thất bại (kèm lý do lỗi) khi user nhấn vào 1 dòng lịch sử | Luôn áp dụng | — |

**INVEST:** ✅ I ✅ N ✅ V ✅ E ✅ S ✅ T

---

## 3. INVEST Checklist

| Story | I | N | V | E | S | T | Ghi chú |
|---|---|---|---|---|---|---|---|
| US-01 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-02 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-03 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-04 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-05 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-06 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-07 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| US-08 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |

---

## 4. Database

| Bảng | Thay đổi |
|---|---|
| `invoice_tax` | Thêm cột `type` = `'purchase'` \| `'sale'` |
| `invoice_product_tax` | Dùng chung, không đổi |
| `invoice_tax_sync_history` | Thêm cột `type` = `'purchase'` \| `'sale'` |
| `tax_account` | Dùng chung, không đổi |
| `invoice_product_mapping` | Chỉ dùng cho HĐ mua vào — HĐ bán ra lookup trực tiếp theo mã SP |
| `invoice_customer_mapping` | **Mới** — lưu (tên KH từ HĐ thuế → mã KH EPOS) để tự động ghép lần sau |

---

## 5. Open Questions

| # | Câu hỏi | Ảnh hưởng | Người trả lời |
|---|---|---|---|
| OQ-1 | Khi tạo KH mới (US-05), những trường nào là bắt buộc? | AC5-01 | Product Owner |
| OQ-2 | Đơn Nháp → chuyển Hoàn thành: tồn kho trừ tại thời điểm nào? | AC6-07 | Product Owner |
| OQ-3 | HĐ điều chỉnh: khi xem chi tiết có cần hiển thị link đến HĐ gốc không? | AC6-11 | Product Owner |
