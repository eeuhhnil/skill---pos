---
type: decision
feature: account-service
status: draft
created: 2026-06-15
updated: 2026-06-16
owner: "@huelinh"
links: [docs/decisions/2026-06-01-user-module-separation.md]
changelog:
  - 2026-06-16 | manual | chia 2 section Cross-DB / Không cross-DB theo service chịu trách nhiệm
  - 2026-06-15 | manual | tạo từ tài liệu phân tích 37 NV + 9 báo cáo; chỉ giữ chức năng cross-DB
---

# Danh sách chức năng ảnh hưởng — Tách Account Service DB

> Cập nhật: 2026-06-16 | Nguồn: 37 tài liệu nghiệp vụ + 9 tài liệu báo cáo

**Quy ước phân loại:**
- **Cross-DB**: POS Service cần gọi sang Account Service để lấy dữ liệu → phải thêm API call
- **Không cross-DB**: Nghiệp vụ thuộc hẳn Account Service, tự xử lý trong DB của mình → không cần join sang POS

**Ký hiệu:**
- 🟠 Đã xác nhận cần sửa
- 🟡 Cần xác nhận thêm

---

## 1. Cross-DB — POS Service cần gọi Account Service

### Chức năng dùng chung

| Chức năng | API | Mô tả |
|---|---|---|
| 🟠 Popup chọn chi nhánh | `GET /api/client/page/company/get-with-paging` | Dùng chung trong nhiều luồng báo cáo — Account Service cần expose API này |

### Đơn hàng

| Chức năng | API | Mô tả |
|---|---|---|
| 🟠 Danh sách đơn hàng | `GET /api/client/page/bill/get-with-paging` | `bill.sale_person_id` → `ep_user.full_name` để hiển thị tên NV |

### Hóa đơn điện tử

| Chức năng | API | Mô tả |
|---|---|---|
| 🟠 Xuất hóa đơn (filter nhân viên) | `POST /api/client/page/invoice/export-excel` `POST /api/client/page/invoice/export-detail-invoice` | `body.employeeId` → resolve từ `ep_user` |

### Cài đặt hệ thống

> Config được cache trong session — cross-DB chỉ xảy ra tại 2 điểm: **(1)** khởi tạo session lần đầu và **(2)** ghi/cập nhật config.

| Chức năng | API | Mô tả |
|---|---|---|
| 🟠 Khởi tạo session (load config) | `GET /api/client/common/config/get-all-config` | Load toàn bộ config từ Account DB khi login — cross-DB một lần duy nhất |
| 🟠 Cập nhật cài đặt hiển thị | `PUT /api/client/page/config/update-display_config` | Ghi vào `config` trong Account DB + cần invalidate cache session |

### Báo cáo

> Tất cả báo cáo đều cross-DB theo 1 trong 2 pattern:
> - **Pattern A** — resolve tên nhân viên: `employeeId → ep_user.full_name`
> - **Pattern B** — popup chọn chi nhánh: `GET /api/client/page/company/get-with-paging`
>
> Mỗi hành động xem / xuất PDF / xuất Excel của cùng 1 báo cáo áp dụng cùng pattern.

| Báo cáo | API chính | Cross-DB |
|---|---|---|
| 🟠 7.1 Doanh thu theo nhân viên | `POST /api/client/page/report/employee-report` và các biến thể `report2/statistic-revenue-by-employee` | Pattern A |
| 🟠 7.2 Nhân viên theo sản phẩm | `POST /api/client/page/report/employee-report-product` và các biến thể `report2/revenue-employee-and-product` | Pattern A |
| 🟠 7.3 Cuối ngày / kết ca | `POST /api/client/page/report/end-day-report` và biến thể `report2/end-the-day` | Pattern A + B |
| 🟠 7.4 Doanh thu theo hình thức thanh toán | `POST /api/client/page/report2/statistic-revenue-by-payment-method` | Pattern B |
| 🟠 7.5 Doanh thu theo sản phẩm | `POST /api/client/page/report2/statistic-revenue-by-product` | Pattern B |
| 🟠 7.6 Hàng hóa bán ra (hot sale) | `POST /api/client/page/report2/statistic-revenue-by-hot-sale-product` | Pattern B |
| 🟠 7.7 Lợi nhuận theo sản phẩm | `POST /api/client/page/report2/product-profit` | Pattern B |
| 🟠 7.8 Xuất nhập tồn kho | `POST /api/client/page/report2/inventory-movement/get-with-paging` | Pattern A + B |
| 🟠 7.9 Hoạt động gần đây | `GET /api/client/page/report/activity-history-stats` | JOIN audit log với `ep_user.full_name` |

### Cần xác nhận thêm

| Chức năng | Mô tả |
|---|---|
| 🟡 Ca làm việc | `GET /api/client/page/shift/get-with-paging` — `param.employeeId` → resolve từ `ep_user` |
| 🟡 Cảnh báo tồn kho | Có thể đọc `config` để lấy ngưỡng cảnh báo theo chi nhánh |
| 🟡 Quản lý kho / chứng từ kho | Mọi chứng từ lưu `com_id` — cần xác nhận có JOIN sang `company` không |
| 🟡 Quản lý bàn / Ghép bàn / Tách bàn | Nếu load danh sách chi nhánh từ `company` |
| 🟡 KARAOKE / BIDA | Nghiệp vụ đặc thù — cần xác nhận có dùng `config` không |

---

## 2. Không cross-DB — Nghiệp vụ thuộc Account Service

> Các nghiệp vụ dưới đây **chuyển hoàn toàn sang Account Service** — không cần join dữ liệu từ POS DB. Backend chỉ cần đổi connection/endpoint sang Account Service, không phát sinh cross-service data join.

### Authentication

| Chức năng | Bảng liên quan |
|---|---|
| Đăng nhập | `ep_user`, `company_user`, `user_role` |
| Đăng xuất | JWT invalidate |
| Quên mật khẩu / xác thực OTP | `otp`, `ep_user` |
| Đổi mật khẩu | `ep_user` |

### Quản lý nhân viên

| Chức năng | Bảng liên quan |
|---|---|
| Thêm nhân viên mới | `ep_user` |
| Sửa thông tin nhân viên | `ep_user` |
| Vô hiệu hóa / kích hoạt nhân viên | `ep_user` |
| Gắn / gỡ nhân viên khỏi chi nhánh | `company_user` |
| Xem danh sách nhân viên theo chi nhánh | `ep_user`, `company_user` |

### Quản lý phân quyền

| Chức năng | Bảng liên quan |
|---|---|
| Tạo / sửa role | `role` |
| Cấu hình permission cho role | `role_permission`, `permission` |
| Gán role cho nhân viên | `user_role` |
| Thu hồi role của nhân viên | `user_role` |

### Quản lý chi nhánh

| Chức năng | Bảng liên quan |
|---|---|
| Thêm / sửa chi nhánh | `company`, `company_owner` |
| Vô hiệu hóa chi nhánh | `company` + cascade `company_user`, `role` |
| Cập nhật cấu hình chi nhánh | `config` |

### Quản lý gói dịch vụ

| Chức năng | Bảng liên quan |
|---|---|
| Xem gói dịch vụ hiện tại | `owner_package`, `package` |
| Gia hạn / mua gói mới | `owner_package` |
| Kiểm tra giới hạn khi thêm nhân viên / chi nhánh | `package.limit_user`, `package.limit_company` |
