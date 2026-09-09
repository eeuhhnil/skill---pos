# SRS — Chương Trình Khuyến Mãi (CTKM) — Phiên Bản Mobile

**Mã tài liệu:** SRS-CTKM-MOB-001  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-05-17  
**Người soạn:** BA  
**Trạng thái:** Draft  

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-05-17 | Toàn bộ | A | Yêu cầu phát triển sản phẩm | BA | Tạo mới tài liệu SRS CTKM Mobile v1.0 | |
| 2026-05-17 | 2.1, 2.2, 3.2 | M | Cập nhật nghiệp vụ | BA | Thêm mới CTKM chuyển sang form 2 tab (Thông tin / Phạm vi áp dụng), lưu 1 lần; bổ sung loại CTKM mới 1103, 1202 | |
| 2026-05-17 | 2.1, 2.2, 2.3, 4 | M | Cập nhật nghiệp vụ | BA | Bổ sung phạm vi "Tất cả KH"; làm rõ As-Is; bổ sung mục 4 — luồng bán hàng, huỷ hàng, thay thế | |
| 2026-05-17 | 4.1 | M | Cập nhật nghiệp vụ | BA | Bổ sung giao diện màn hình bán hàng: vị trí hiển thị CTKM hàng hoá vs đơn hàng, màn hình Chọn CTKM (popup), luồng chọn kho/lô sản phẩm | |

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
   - 3.1 Danh sách CTKM  
   - 3.2 Thêm mới CTKM  
   - 3.3 Xem chi tiết CTKM  
   - 3.4 Chỉnh sửa CTKM  
   - 3.5 Xóa CTKM  
4. Chi tiết các nghiệp vụ ảnh hưởng  

---

## 1. NGUỒN GỐC THAY ĐỔI

Phiên bản web CTKM được cập nhật (SRS-CTKM-WEB-001): bổ sung 2 loại CTKM mới (1103, 1202) và thay đổi luồng tạo/sửa CTKM sang form 2 tab. Mobile đồng bộ theo các thay đổi này.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Mobile hiện có đầy đủ CTKM tương tự web (6 loại, CRUD, phạm vi áp dụng, lịch chi tiết). Lần cập nhật này đồng bộ 2 thay đổi từ web:

1. **Bổ sung loại mới:** 1103 (Mua đơn hàng → Giảm giá sản phẩm) và 1202 (Mua sản phẩm → Tặng sản phẩm).
2. **Thay đổi luồng tạo/sửa CTKM:** Form chuyển sang **2 tab** (Thông tin CTKM / Phạm vi áp dụng), lưu một lần duy nhất thay vì quy trình 2 bước như trước.
3. **Bổ sung tùy chọn phạm vi "Tất cả khách hàng":** Trước đây phạm vi áp dụng chỉ có thẻ khách hàng hoặc khách hàng cụ thể, chưa có tùy chọn áp dụng cho tất cả.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**As-Is:**
- Tạo CTKM gồm 2 bước tách biệt: (1) Thêm thông tin CTKM → Lưu; (2) Vào lại → chọn Phạm vi áp dụng → Lưu.
- Phạm vi áp dụng chỉ có 2 tùy chọn: Thẻ khách hàng hoặc Khách hàng cụ thể. Chưa có tùy chọn "Tất cả khách hàng".
- Chưa có loại CTKM 1103 và 1202.

**To-Be:** Tạo/sửa CTKM trên 1 màn hình với **2 tab**. Nhấn **Lưu** 1 lần duy nhất ở cuối (footer cố định, hiển thị ở cả 2 tab).

- **Tab 1 — Thông tin CTKM:** Thông tin chung (tên, mã, loại — gồm cả 1103, 1202 mới — thời gian hiệu lực, trạng thái); cài đặt lịch chi tiết; hình thức khuyến mãi (điều kiện ưu đãi động theo loại).
- **Tab 2 — Phạm vi áp dụng:** Chi nhánh; đối tượng khách hàng (Tất cả / Thẻ KH / Khách hàng cụ thể).

### 2.3 Yêu cầu người dùng

- Quản lý muốn tạo/sửa CTKM trong 1 luồng liền mạch, không cần vào lại màn hình lần 2.
- Quản lý muốn chọn được loại 1103 và 1202 khi tạo CTKM mới.
- Quản lý muốn thiết lập CTKM áp dụng cho tất cả khách hàng mà không phải chọn từng thẻ hoặc từng khách.

### 2.4 Ngữ cảnh người dùng

Quản lý cửa hàng, thao tác trên smartphone (iOS/Android) trong giờ làm việc. Thao tác thường ngắn (2–5 phút) giữa các đầu việc khác.

### 2.5 Mô tả thay đổi về CSDL

Module CTKM Mobile **sử dụng chung backend và CSDL với phiên bản web**. Không có thay đổi cấu trúc CSDL bổ sung cho phiên bản mobile. Các bảng liên quan:

| Bảng | Vai trò |
|------|---------|
| `voucher` | Lưu thông tin chính của CTKM |
| `voucher_apply` | Lưu phạm vi áp dụng (chi nhánh, khách hàng, thẻ) |
| `voucher_usage` | Lưu lịch sử sử dụng CTKM theo hóa đơn |

Chi tiết cấu trúc các bảng: tham chiếu SRS-CTKM-WEB-001, mục 2.5.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Quản lý cửa hàng | Danh sách CTKM | Xem danh sách | Hiển thị tất cả CTKM, lọc theo trạng thái | Cao |
| Quản lý cửa hàng | Danh sách CTKM | Tìm kiếm | Tìm theo tên hoặc mã CTKM | Cao |
| Quản lý cửa hàng | Danh sách CTKM | Bật/Tắt nhanh | Toggle trạng thái active/inactive | Cao |
| Quản lý cửa hàng | Thêm mới CTKM | Tạo CTKM | Nhập đầy đủ thông tin tạo chương trình mới | Cao |
| Quản lý cửa hàng | Chi tiết CTKM | Xem chi tiết | Xem toàn bộ cấu hình của CTKM | Cao |
| Quản lý cửa hàng | Chi tiết CTKM | Chỉnh sửa | Sửa thông tin CTKM đã tạo | Cao |
| Quản lý cửa hàng | Chi tiết CTKM | Xóa | Xóa CTKM khỏi hệ thống | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Danh sách CTKM

#### 3.1.1 Thông tin chung về chức năng

Màn hình hiển thị toàn bộ danh sách chương trình khuyến mãi của cửa hàng. Quản lý có thể tìm kiếm, lọc theo trạng thái, và bật/tắt nhanh từng chương trình. Đây là màn hình trung tâm để điều hướng vào tạo mới hoặc xem chi tiết.

#### 3.1.2 Màn hình chức năng

*(Tham chiếu: CTKM mobile.png — hàng dưới, 2 màn hình đầu bên trái)*

**Thanh tìm kiếm & lọc:**

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Ô tìm kiếm | Text input | 100 ký tự | Không | Tìm theo tên hoặc mã CTKM, tìm real-time (debounce 300ms) |
| 2 | Bộ lọc trạng thái | Dropdown / Chip | — | Không | Tất cả / Đang hoạt động / Không hoạt động / Hết hạn |
| 3 | Nút Thêm mới | Button (primary) | — | — | Điều hướng đến màn hình Thêm mới CTKM |

**Danh sách (mỗi dòng):**

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 4 | Tên CTKM | Text (bold) | 100 ký tự | Có | Tên chương trình |
| 5 | Mã CTKM | Text (sub) | 20 ký tự | Có | Mã tự sinh dạng KM + STT |
| 6 | Loại CTKM | Badge/Tag | — | Có | Hiển thị nhóm: Theo đơn hàng / Theo sản phẩm |
| 7 | Thời gian hiệu lực | Text (sub) | — | Có | Định dạng: DD/MM/YYYY – DD/MM/YYYY |
| 8 | Trạng thái | Toggle switch | — | Có | Bật = đang hoạt động (xanh), Tắt = không hoạt động (xám) |
| 9 | Toàn bộ dòng | Touchable | — | — | Nhấn vào dòng → điều hướng đến Chi tiết CTKM |

#### 3.1.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Vào màn hình danh sách | Hiển thị danh sách CTKM, mặc định lọc "Tất cả", sắp xếp theo thời gian tạo giảm dần | |
| 2 | Nhập từ khóa vào ô tìm kiếm | Lọc danh sách real-time theo tên hoặc mã CTKM sau 300ms | |
| 3 | Chọn bộ lọc trạng thái | Lọc lại danh sách theo trạng thái đã chọn | |
| 4 | Toggle trạng thái CTKM | Hiển thị popup xác nhận "Bật/Tắt chương trình [Tên]?" | |
| 4a | Xác nhận toggle | Gọi API cập nhật trạng thái, cập nhật toggle trên UI | |
| 4b | Hủy toggle | Đóng popup, giữ nguyên trạng thái | |
| 5 | Nhấn vào một dòng CTKM | Điều hướng đến màn hình Chi tiết CTKM | |
| 6 | Nhấn nút Thêm mới | Điều hướng đến màn hình Thêm mới CTKM | |
| 7 | Kéo xuống (pull-to-refresh) | Tải lại danh sách từ server | |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Không có CTKM nào | "Chưa có chương trình khuyến mãi nào" + icon minh họa | Hiển thị trạng thái rỗng (empty state) |
| Tìm kiếm không có kết quả | "Không tìm thấy kết quả phù hợp" | Hiển thị trạng thái rỗng |
| Lỗi mạng khi toggle | "Không thể cập nhật. Vui lòng thử lại." | Toast error, rollback toggle về trạng thái cũ |
| Lỗi tải danh sách | "Tải dữ liệu thất bại. Kéo xuống để thử lại." | Hiển thị thông báo lỗi và nút Thử lại |

#### 3.1.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện:** Tự động cập nhật trạng thái "Hết hạn"
  - **Điều kiện kích hoạt:** `end_time` của CTKM < thời gian hiện tại
  - **Xử lý:** Hệ thống backend tự động đánh dấu, mobile lấy trạng thái qua API
  - **Output:** Badge "Hết hạn" hiển thị trên dòng CTKM tương ứng

---

### 3.2 Thêm mới CTKM

#### 3.2.1 Thông tin chung về chức năng

Màn hình cho phép quản lý cửa hàng tạo mới một chương trình khuyến mãi. Form được chia thành **2 tab**:
- **Tab 1 — Thông tin CTKM**: thông tin chung, cài đặt lịch chi tiết, và hình thức khuyến mãi (điều kiện ưu đãi thay đổi động theo loại CTKM).
- **Tab 2 — Phạm vi áp dụng**: chi nhánh và đối tượng khách hàng.

Nút **Lưu** được cố định ở footer, hiển thị ở cả 2 tab. Khi nhấn Lưu, hệ thống validate toàn bộ dữ liệu của cả 2 tab trước khi ghi nhận.

#### 3.2.2 Màn hình chức năng

*(Tham chiếu: CTKM mobile.png — hàng trên, các màn hình từ trái sang phải)*

**--- TAB 1: THÔNG TIN CTKM ---**

**Nhóm 1 — Thông tin chung:**

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Mã CTKM | Text input | 20 ký tự | Không | Tự sinh dạng KM + STT nếu bỏ trống; không chứa ký tự đặc biệt |
| 2 | Tên CTKM | Text input | 100 ký tự | Có | Tên hiển thị cho chương trình |
| 3 | Tự động áp dụng KM khi tạo đơn | Checkbox | — | Không | Bật = tự động áp dụng CTKM khi tạo đơn hàng, không cần chọn thủ công |
| 4 | Hiệu lực | Date range picker | — | Có | Từ ngày – Đến ngày trên cùng 1 dòng; ngày bắt đầu không được sau ngày kết thúc |
| 5 | Áp dụng sinh nhật | Checkbox + detail (>) | — | Không | Bật = mở màn hình cấu hình chi tiết điều kiện sinh nhật khách hàng |
| 6 | Trạng thái | Radio | — | Có | Đang kích hoạt / Chưa kích hoạt; mặc định: Đang kích hoạt |

**Nhóm 2 — Cài đặt lịch chi tiết** *(tùy chọn; mặc định không cấu hình = áp dụng mọi lúc trong khoảng hiệu lực):*

> *Ví dụ: Chương trình khuyến mãi chỉ diễn ra vào 18:00 – 22:00 các ngày thứ Tư trong khoảng thời gian hiệu lực.*

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 7 | Chọn tháng | Multi-select (expandable) | — | Không | Các tháng áp dụng; bỏ trống = mọi tháng |
| 8 | Chọn thứ | Multi-select (expandable) | — | Không | Các ngày trong tuần áp dụng; bỏ trống = mọi ngày |
| 9 | Chọn ngày | Multi-select (expandable) | — | Không | Các ngày trong tháng áp dụng; bỏ trống = mọi ngày |
| 10 | Ngoại trừ ngày | Multi-select (expandable) | — | Không | Các ngày cụ thể không áp dụng CTKM dù thỏa mãn điều kiện lịch |

**Nhóm 3 — Hình thức khuyến mãi** *(hiển thị động theo loại CTKM):*

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 11 | Loại CTKM | Dropdown | — | Có | 6 lựa chọn (xem bảng loại bên dưới) |

**Bảng loại CTKM:**

| Giá trị | Nhãn hiển thị | Ghi chú |
|---|---|---|
| 1101 | Mua đơn hàng → Giảm giá đơn hàng | |
| 1102 | Mua đơn hàng → Tặng sản phẩm | |
| 1103 | Mua đơn hàng → Giảm giá sản phẩm | **Mới** — bổ sung trong phiên bản này |
| 1201 | Mua sản phẩm → Giảm giá sản phẩm | |
| 1202 | Mua sản phẩm → Tặng sản phẩm | **Mới** — bổ sung trong phiên bản này |
| 1203 | Áp dụng giá bán theo số lượng | |

Điều kiện ưu đãi được nhập theo từng **Điều kiện N** (nhấn **Thêm điều kiện** để thêm nhiều mức). Các trường trong mỗi điều kiện thay đổi theo loại CTKM:

*Khi loại = 1101 / 1102 / 1103 (theo đơn hàng):*

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 12 | Mua từ | Number input | — | Có | Giá trị đơn hàng tối thiểu; đơn vị VND; ≥ 0 |
| 13 | Giảm giá | Radio + Number input | — | Có (trừ 1102) | Chọn VND hoặc %; nếu % thì 1–100; nếu VND thì > 0 |
| 14 | Giảm tối đa | Number input | — | Không | Chỉ hiển thị khi chọn %; giới hạn số tiền giảm tối đa |
| 15 | Sản phẩm áp dụng ưu đãi | Product picker | — | Có (loại 1102, 1103) | Chọn sản phẩm nhận ưu đãi/tặng |
| — | Thêm điều kiện | Button (link) | — | — | Thêm một khối Điều kiện N mới |

*Khi loại = 1201 / 1202 / 1203 (theo sản phẩm):*

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 16 | Sản phẩm mua | Product picker | — | Có | Chọn sản phẩm kích hoạt điều kiện |
| 17 | Nhóm hay sản phẩm | Radio | — | Có | Áp dụng theo nhóm (0) hay sản phẩm cụ thể (1) |
| 18 | Số lượng mua tối thiểu | Number input | — | Có | Số lượng tối thiểu để kích hoạt ưu đãi; ≥ 1 |
| 19 | Sản phẩm nhận ưu đãi | Product picker | — | Có (loại 1201, 1202) | Sản phẩm được giảm giá hoặc được tặng |
| 20 | Số lượng tặng | Number input | — | Có (loại 1202) | Số lượng sản phẩm tặng |
| 21 | Tự động tăng số lượng tặng | Checkbox | — | Không | Nếu bật: tặng thêm khi mua thêm đủ bội số |
| 22 | Bảng giá theo số lượng | Repeatable rows | — | Có (loại 1203) | Mỗi dòng: Số lượng từ — Giá bán |
| — | Thêm điều kiện | Button (link) | — | — | Thêm một khối Điều kiện N mới |

**--- TAB 2: PHẠM VI ÁP DỤNG ---**

**Nhóm 4 — Phạm vi áp dụng:**

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 23 | Áp dụng cho | Radio | — | Có | Tất cả khách hàng / Thẻ khách hàng / Khách hàng cụ thể |
| 24 | Chọn thẻ khách hàng | Multi-select picker | — | Có (khi chọn Thẻ) | Chọn 1 hoặc nhiều loại thẻ |
| 25 | Chọn khách hàng | Search + Multi-select | — | Có (khi chọn Cụ thể) | Tìm và chọn khách hàng theo tên/SĐT |
| 26 | Chi nhánh áp dụng | Multi-select picker | — | Không | Mặc định: tất cả chi nhánh |

**Nút hành động (Footer cố định — hiển thị ở cả 2 tab):**

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 27 | Lưu | Button (primary) | Validate và lưu CTKM |
| 28 | Hủy | Button (secondary) | Hủy và quay về danh sách |

#### 3.2.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Mở màn hình Thêm mới | Hiển thị Tab 1 (Thông tin CTKM) với form rỗng, focus vào trường Tên CTKM | |
| 2 | Chọn Loại CTKM | Hiển thị/ẩn nhóm hình thức khuyến mãi phù hợp theo loại ngay bên dưới | |
| 3 | Nhấn vào Product picker | Mở màn hình chọn sản phẩm (search + list) | Ở Tab 1 |
| 4 | Bật checkbox "Áp dụng sinh nhật" | Mở màn hình cấu hình chi tiết điều kiện sinh nhật | Ở Tab 1 — nhóm Thông tin chung |
| 5 | Nhấn Tab 2 "Phạm vi áp dụng" | Chuyển sang Tab 2, dữ liệu Tab 1 được giữ nguyên | |
| 6 | Chọn đối tượng khách hàng | Hiển thị/ẩn picker thẻ hoặc picker khách hàng tương ứng | Ở Tab 2 |
| 7 | Nhấn Lưu (ở bất kỳ tab nào) | Validate toàn bộ dữ liệu cả 2 tab | |
| 7a | Validate thành công | Gọi API tạo CTKM → toast "Tạo thành công" → điều hướng về Danh sách | |
| 7b | Validate thất bại — lỗi ở Tab 1 | Tự động chuyển về Tab 1, highlight trường lỗi, cuộn đến lỗi đầu tiên | |
| 7c | Validate thất bại — lỗi ở Tab 2 | Ở lại Tab 2, highlight trường lỗi | |
| 8 | Nhấn Hủy | Hiển thị popup "Hủy thao tác? Thông tin chưa được lưu sẽ bị mất." | |
| 8a | Xác nhận hủy | Quay về màn hình Danh sách | |
| 8b | Tiếp tục chỉnh sửa | Đóng popup, giữ nguyên form và tab hiện tại | |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Tên CTKM trống | "Tên CTKM không được để trống" | Chuyển về Tab 1, highlight ô, không cho lưu |
| Ngày kết thúc < Ngày bắt đầu | "Ngày kết thúc phải sau ngày bắt đầu" | Chuyển về Tab 1, highlight date picker, không cho lưu |
| Giá trị giảm % > 100 | "Phần trăm giảm không được vượt quá 100%" | Chuyển về Tab 1, highlight ô, không cho lưu |
| Mã CTKM đã tồn tại | "Mã CTKM đã được sử dụng. Vui lòng nhập mã khác." | Toast error sau khi gọi API |
| Lỗi mạng khi lưu | "Lưu thất bại. Vui lòng thử lại." | Toast error, giữ nguyên form và tab hiện tại |
| Không chọn sản phẩm (bắt buộc) | "Vui lòng chọn ít nhất 1 sản phẩm" | Chuyển về Tab 1, highlight picker, không cho lưu |

#### 3.2.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện:** Tự sinh mã CTKM
  - **Điều kiện kích hoạt:** Người dùng bỏ trống trường Mã CTKM khi lưu
  - **Xử lý:** Backend tự sinh mã theo định dạng KM + số thứ tự tăng dần
  - **Output:** Mã được lưu vào `voucher.code`

---

### 3.3 Xem chi tiết CTKM

#### 3.3.1 Thông tin chung về chức năng

Màn hình hiển thị toàn bộ cấu hình của một chương trình khuyến mãi ở chế độ chỉ đọc. Từ màn hình này, quản lý có thể điều hướng sang Chỉnh sửa hoặc thực hiện Xóa.

#### 3.3.2 Màn hình chức năng

*(Tham chiếu: CTKM mobile.png — hàng dưới, các màn hình giữa và phải)*

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Tên CTKM | Text (h1) | Hiển thị tên chương trình |
| 2 | Mã CTKM | Text (sub) | Hiển thị mã |
| 3 | Loại | Badge | Nhãn loại CTKM |
| 4 | Trạng thái | Badge màu | Đang hoạt động (xanh) / Không hoạt động (xám) / Hết hạn (đỏ) |
| 5 | Thời gian hiệu lực | Text | Từ ngày – đến ngày |
| 6 | Điều kiện áp dụng | Section | Hiển thị điều kiện tương ứng loại CTKM |
| 7 | Danh sách sản phẩm | List với ảnh | Tên sản phẩm, ảnh thumbnail, đơn vị (nếu có) |
| 8 | Phạm vi áp dụng | Section | Chi nhánh, đối tượng khách hàng |
| 9 | Lịch chi tiết | Section | Hiển thị nếu có cấu hình; ẩn nếu không cấu hình |
| 10 | Nút Chỉnh sửa | Button (primary) | Điều hướng sang màn hình Chỉnh sửa |
| 11 | Nút Xóa | Button (danger/outline) | Kích hoạt luồng Xóa CTKM |

#### 3.3.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Vào màn hình chi tiết | Gọi API lấy chi tiết CTKM, hiển thị loading skeleton | |
| 2 | Nhấn Chỉnh sửa | Điều hướng đến màn hình Chỉnh sửa, form điền sẵn dữ liệu hiện tại | |
| 3 | Nhấn Xóa | Hiển thị popup xác nhận xóa | |
| 4 | Nhấn nút Back | Quay về màn hình Danh sách | |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Lỗi tải chi tiết | "Tải dữ liệu thất bại. Vui lòng thử lại." | Hiển thị nút Thử lại |
| CTKM không còn tồn tại | "Chương trình khuyến mãi không tồn tại." | Quay về danh sách sau 2 giây |

---

### 3.4 Chỉnh sửa CTKM

#### 3.4.1 Thông tin chung về chức năng

Màn hình cho phép quản lý cửa hàng cập nhật thông tin của một CTKM đã tạo. Form giống với màn hình Thêm mới nhưng được điền sẵn dữ liệu hiện tại. Loại CTKM không cho phép thay đổi sau khi đã tạo.

#### 3.4.2 Màn hình chức năng

Giống cấu trúc mục 3.2.2, với các điểm khác biệt:

| # | Thành phần | Khác biệt so với Thêm mới |
|---|---|---|
| 3 | Loại CTKM | **Disabled** — không cho phép thay đổi loại sau khi tạo |
| Tất cả trường còn lại | Điền sẵn giá trị hiện tại | Người dùng có thể sửa |

#### 3.4.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Mở màn hình Chỉnh sửa | Form điền sẵn dữ liệu CTKM hiện tại | |
| 2 | Sửa các trường | Cập nhật giá trị trên UI | |
| 3 | Nhấn Lưu | Validate → Gọi API cập nhật | |
| 3a | Thành công | Toast "Cập nhật thành công" → quay về Chi tiết | |
| 3b | Thất bại validation | Highlight lỗi, cuộn đến lỗi đầu tiên | |
| 4 | Nhấn Hủy | Popup xác nhận nếu có thay đổi chưa lưu | |

**Trường hợp lỗi / Ngoại lệ:** Tương tự mục 3.2.3, bổ sung:

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| CTKM bị xóa bởi người khác trong khi đang sửa | "Chương trình khuyến mãi không còn tồn tại." | Đóng form, quay về danh sách |

---

### 3.5 Xóa CTKM

#### 3.5.1 Thông tin chung về chức năng

Cho phép quản lý cửa hàng xóa vĩnh viễn một chương trình khuyến mãi. Thao tác yêu cầu xác nhận để tránh xóa nhầm. Sau khi xóa, dữ liệu lịch sử sử dụng (`voucher_usage`) vẫn được giữ lại để phục vụ báo cáo.

#### 3.5.2 Màn hình chức năng

Xóa được thực hiện qua popup xác nhận, không có màn hình riêng.

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Tiêu đề popup | Text | "Xác nhận xóa" |
| 2 | Nội dung popup | Text | "Bạn có chắc muốn xóa chương trình **[Tên CTKM]**? Thao tác này không thể hoàn tác." |
| 3 | Nút Xóa | Button (danger) | Thực hiện xóa |
| 4 | Nút Hủy | Button (secondary) | Đóng popup, không xóa |

#### 3.5.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Nhấn Xóa (từ Chi tiết) | Hiển thị popup xác nhận | |
| 2 | Nhấn Xóa trong popup | Gọi API xóa, hiển thị loading | |
| 2a | Xóa thành công | Toast "Xóa thành công" → quay về Danh sách | |
| 2b | Xóa thất bại | Toast "Xóa thất bại. Vui lòng thử lại." | |
| 3 | Nhấn Hủy trong popup | Đóng popup, giữ nguyên | |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Lỗi mạng | "Xóa thất bại. Kiểm tra kết nối và thử lại." | Toast error, đóng popup |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Bán hàng

Khi thu ngân tạo đơn hàng, hệ thống kiểm tra các CTKM đang hoạt động và đủ điều kiện để hiển thị hoặc tự động áp dụng.

**Thay đổi ảnh hưởng:**
- Bổ sung loại **1103**: Khi đơn hàng đạt giá trị tối thiểu, hệ thống giảm giá trên các sản phẩm chỉ định (gửi `feature=1` kèm đơn giá giảm).
- Bổ sung loại **1202**: Khi mua đủ số lượng sản phẩm điều kiện, hệ thống thêm sản phẩm tặng vào đơn với `feature=2` và `amount=0`.
- Phạm vi **"Tất cả khách hàng"**: CTKM hiển thị/áp dụng cho mọi khách hàng kể cả không có thẻ, không cần định danh.

#### 4.1.1 Màn hình Bán hàng — Hiển thị CTKM

CTKM được phân thành 2 vị trí hiển thị khác nhau trên màn hình bán hàng:

| Loại CTKM | Vị trí hiển thị | Cách nhận biết |
|---|---|---|
| CTKM hàng hoá (1201, 1202, 1203) | Hiển thị trực tiếp dưới dòng sản phẩm trong danh sách | Icon quà tặng (🎁) kèm mô tả ưu đãi |
| CTKM đơn hàng (1101, 1102, 1103) | Hiển thị trong mục **Khuyến mãi** thuộc phần Chi tiết thanh toán | Dòng "Khuyến mãi (N)" có thể nhấn để mở màn hình chọn CTKM |

**Phần Chi tiết thanh toán:**

| # | Thành phần | Mô tả |
|---|---|---|
| 1 | Tạm tính | Tổng tiền sản phẩm trước ưu đãi |
| 2 | Giảm giá | Giảm trực tiếp theo VND hoặc % |
| 3 | Khuyến mãi (N) | N = số CTKM đơn hàng đang áp dụng; nhấn để mở màn hình Chọn CTKM |
| 4 | Vận chuyển | Phí giao hàng |
| 5 | Giảm trừ thuế | Phần trăm thuế được giảm |
| 6 | Tổng tiền thanh toán | Số tiền cuối cùng sau tất cả ưu đãi |

#### 4.1.2 Màn hình Chọn CTKM (popup)

*(Tham chiếu mockup: 3 màn hình "Chọn CTKM" — cấu hình áp dụng riêng / gộp / không gộp)*

Thu ngân nhấn vào dòng "Khuyến mãi" → mở màn hình Chọn CTKM dạng bottom sheet/modal.

**Thành phần màn hình:**

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Thanh tiêu đề | Text | "Chọn CTKM" |
| 2 | Ô tìm kiếm | Text input | Tìm theo tên CTKM |
| 3 | Đã chọn (N) | Label | Hiển thị số CTKM đang được chọn |
| 4 | Chọn tất cả | Checkbox | Chọn/bỏ chọn toàn bộ CTKM trong danh sách |
| 5 | Danh sách CTKM | List | Mỗi item hiển thị: Tên, loại, thời gian hiệu lực, mô tả điều kiện, ưu đãi áp dụng |
| 6 | Xem thêm / Thu gọn | Link | Mở rộng hoặc thu gọn danh sách khi có nhiều CTKM |
| 7 | Nút Hủy | Button (secondary) | Đóng popup, không áp dụng thay đổi |
| 8 | Nút Xác nhận (N) | Button (primary) | Xác nhận áp dụng N CTKM đã chọn |

**Hiển thị theo cấu hình gộp CTKM:**

| Cấu hình | Hành vi |
|---|---|
| Áp dụng riêng lẻ (không gộp) | Chỉ chọn được 1 CTKM; CTKM chưa chọn quà KM hiển thị icon xoá (🗑); chọn CTKM khác sẽ bỏ chọn cái trước |
| Gộp CTKM | Cho phép chọn nhiều CTKM đồng thời; tất cả có checkbox; "Chọn tất cả" hoạt động |
| Không gộp (mặc định) | Tương tự riêng lẻ nhưng không có nút xoá; chỉ tick chọn 1 |

**Thông tin mỗi dòng CTKM trong danh sách:**

| # | Thành phần | Mô tả |
|---|---|---|
| 1 | Tên CTKM | In đậm, màu xanh |
| 2 | Loại | Ví dụ: "Mua đơn hàng – giảm giá tổng tiền" |
| 3 | Thời gian | Từ DD/MM/YYYY – DD/MM/YYYY |
| 4 | Mô tả điều kiện | Ví dụ: "Giảm 20% cho đơn hàng từ 100.000đ" |
| 5 | Ưu đãi áp dụng | Badge xanh lá: "Giảm giá 20%" hoặc icon quà: "Chọn quà KM" (loại 1102) |
| 6 | Checkbox / Tick | Trạng thái chọn của CTKM |

**Luồng tương tác:**

| Bước | Hành động | Phản hồi hệ thống |
|---|---|---|
| 1 | Nhấn vào "Khuyến mãi" trên màn hình bán hàng | Mở màn hình Chọn CTKM, hiển thị danh sách CTKM đủ điều kiện |
| 2 | Tick chọn CTKM | Đánh dấu chọn, cập nhật đếm "Đã chọn (N)" |
| 3 | Nhấn "Chọn tất cả" | Tick toàn bộ CTKM trong danh sách |
| 4 | Nhấn "Xác nhận (N)" | Đóng popup, áp dụng CTKM đã chọn, cập nhật dòng "Khuyến mãi (N)" và tổng tiền |
| 5 | Nhấn "Hủy" | Đóng popup, giữ nguyên trạng thái CTKM trước đó |

#### 4.1.3 Chọn sản phẩm có nhiều kho / lô

Khi sản phẩm trong đơn hàng có nhiều kho hoặc nhiều lô, thu ngân phải chỉ định kho và lô cụ thể.

**Hiển thị trong danh sách sản phẩm:**

| # | Thành phần | Mô tả |
|---|---|---|
| 1 | Tên sản phẩm | Tên và đơn vị tính |
| 2 | Giá bán | Giá × số lượng |
| 3 | Kho | Tên kho đang lấy hàng (ví dụ: "Kho bán hàng", "Newjust") |
| 4 | Lô hàng | Mã lô kèm HSD (ví dụ: "2× Lô 112233 \| HSD: 24/03/2025") |
| 5 | Ghi chú | Trường ghi chú thêm cho sản phẩm |

**Luồng chọn kho / lô:**

| Bước | Hành động | Phản hồi hệ thống |
|---|---|---|
| 1 | Thu ngân thêm sản phẩm vào đơn | Nếu sản phẩm có 1 kho và 1 lô → tự động chọn |
| 2 | Sản phẩm có nhiều kho hoặc nhiều lô | Hệ thống yêu cầu chọn kho/lô; hiển thị danh sách kho-lô kèm số lượng tồn và HSD |
| 3 | Thu ngân chọn kho và lô | Cập nhật dòng sản phẩm với thông tin kho-lô đã chọn |
| 4 | CTKM hàng hoá đủ điều kiện | Hiển thị icon quà tặng và dòng mô tả ưu đãi ngay dưới sản phẩm tương ứng |

---

### 4.2 Huỷ hàng

Khi thu ngân huỷ đơn hàng đã áp dụng CTKM:

| Xử lý | Mô tả |
|---|---|
| Hoàn tác ưu đãi | Hệ thống không hoàn tác CTKM theo cấu hình hiện tại mà theo snapshot đã lưu trong `voucher_usage` |
| Sản phẩm tặng (1102, 1202) | Sản phẩm tặng bị xoá khỏi đơn khi huỷ |
| Giảm giá (1101, 1103, 1201) | Giá trị giảm được hoàn trả, tổng tiền trở về giá gốc |
| Ghi nhận | Bản ghi `voucher_usage` bị xoá hoặc đánh dấu huỷ tương ứng với đơn hàng |

---

### 4.3 Thay thế đơn hàng

Khi tạo đơn thay thế (đổi trả), CTKM **không tính lại theo cấu hình hiện tại** mà sử dụng snapshot từ đơn gốc:

| Xử lý | Mô tả |
|---|---|
| Nguồn dữ liệu | Lấy `discount_conditions` từ `voucher_usage` của đơn gốc |
| Áp dụng | Tái áp dụng đúng ưu đãi như đơn gốc, bất kể CTKM đã bị sửa/xóa sau đó |
| Sản phẩm tặng (1102, 1202) | Giữ nguyên sản phẩm tặng và số lượng theo đơn gốc |
| Lưu mới | Tạo bản ghi `voucher_usage` mới liên kết với đơn thay thế |

---

### 4.4 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Backend CTKM (Web) | REST API `/voucher` | Cao | Mobile dùng chung API với web; thay đổi phản ánh ngay trên cả 2 nền tảng |
| Hệ thống quản lý khách hàng | API `/customers`, `/loyalty-cards` | Thấp | Gọi khi cấu hình phạm vi Thẻ KH hoặc Khách hàng cụ thể; không gọi khi chọn "Tất cả" |

---

## 5. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| 1 | Khi xóa CTKM đang có hóa đơn chưa thanh toán đang áp dụng, hệ thống xử lý thế nào? | 3.5 | BA / Dev Backend | |
| 2 | Loại CTKM có được phép thay đổi sau khi tạo không? (Tài liệu web chưa đề cập rõ) | 3.4 | Product Owner | |
| 3 | Giới hạn số lượng dòng trong bảng giá theo số lượng (loại 1203) là bao nhiêu? | 3.2 | Dev | |
| 4 | Toggle bật/tắt nhanh từ danh sách có áp dụng cho CTKM đã hết hạn không? | 3.1 | Product Owner | |
| 5 | Có cần phân quyền (permission) riêng cho thao tác Xóa CTKM không? | 3.5 | Product Owner / Dev | |
| 6 | Màn hình chọn sản phẩm (product picker) có hỗ trợ phân trang hay load-more không? | 3.2 | Dev | |