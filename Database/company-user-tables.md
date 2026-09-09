# Nhóm 1: Quản lý Công ty & Người dùng

> Database: `easyposbackoffice` | Server: `10.100.110.78`
> Cập nhật: 2026-06-16 — đối chiếu trực tiếp với schema thực tế trên DB.

Nhóm bảng quản lý chủ sở hữu, công ty, người dùng, phân quyền (RBAC), gói dịch vụ, thiết bị và OTP.

---

## Bảng: `company_owner`
**Mô tả:** Chủ sở hữu / tổ chức cấp trên quản lý nhiều công ty con. Mỗi `company_owner` có thể sở hữu nhiều `company`.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | name | nvarchar(512) | YES | Tên tổ chức / chủ sở hữu |
| 3 | address | nvarchar(512) | YES | Địa chỉ |
| 4 | tax_code | nvarchar(14) | YES | Mã số thuế |
| 5 | owner_name | nvarchar(255) | YES | Tên người đại diện / chủ sở hữu |
| 6 | owner_id | int | YES | ID người dùng (ep_user) là chủ sở hữu |
| 7 | ikey | varchar(100) | YES | Khóa định danh tích hợp với cơ quan thuế |
| 8 | tax_machine_code | varchar(10) | YES | Mã máy tính tiền đã đăng ký với cơ quan thuế |
| 9 | tax_register_time | datetime | YES | Thời điểm đăng ký máy tính tiền với cơ quan thuế |
| 10 | tax_register_message | nvarchar(50) | YES | Thông báo kết quả đăng ký thuế (tự cập nhật bởi trigger) |
| 11 | creator | int | YES | ID người tạo (ep_user.id) |
| 12 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 13 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 14 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 15 | is_select_business_type | bit | YES | Đã chọn loại hình kinh doanh hay chưa |
| 16 | info_data | nvarchar(512) | YES | Thông tin bổ sung dạng JSON |
| 17 | crm_ref | nvarchar(512) | YES | Mã/thông tin tham chiếu trong hệ thống CRM |
| 18 | tax_register_status | int | YES | Trạng thái đăng ký thuế (0=chưa đăng ký, 1=thành công, ...) |
| 19 | revenue_group | int | YES | Nhóm doanh thu (phân loại quy mô doanh thu của chủ sở hữu) |

**Primary key:** `PK__company___...` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | INCLUDE | Ghi chú |
|-----------|-----|---------|---------|
| `idx_companyOwner_taxcode_included` | (tax_code) | name, owner_name, tax_machine_code | Tìm kiếm theo MST |
| `idx_companyOwner_ownerName_included` | (owner_name) | name, tax_code, tax_machine_code | Tìm kiếm theo tên người đại diện |
| `idx_companyOwner_ownerId` | (owner_id) | — | Tìm công ty theo chủ sở hữu |

**Triggers:**
| Tên trigger | Sự kiện | Hành động |
|-------------|---------|-----------|
| `trg_update_tax_register_message` | AFTER UPDATE | Khi `tax_register_status` thay đổi, tự cập nhật `tax_register_message` bằng kết quả hàm `fn_get_tax_register_message(tax_register_status)` |

---

## Bảng: `company`
**Mô tả:** Thông tin từng công ty / chi nhánh trong hệ thống. Mỗi công ty thuộc một `company_owner`.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | com_owner_id | int | YES | ID chủ sở hữu của công ty (→ company_owner.id, không ràng buộc FK) |
| 3 | business_type | int | YES | Loại hình kinh doanh (→ business_type.id) |
| 4 | name | nvarchar(255) | YES | Tên công ty |
| 5 | phone | varchar(255) | YES | Số điện thoại liên hệ |
| 6 | address | nvarchar(255) | YES | Địa chỉ |
| 7 | description | nvarchar(255) | YES | Mô tả công ty |
| 8 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 9 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 10 | creator | int | YES | ID người tạo (ep_user.id) |
| 11 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 12 | is_parent | bit | YES | Có phải công ty cha (chuỗi/hệ thống) hay không |
| 13 | eb_id | int | YES | ID trong hệ thống EB (tích hợp ngoài) |
| 14 | business_id | int | YES | ID ngành nghề kinh doanh (→ business.id) |
| 15 | normalized_name | nvarchar(512) | YES | Tên đã chuẩn hóa (bỏ dấu, lowercase) dùng tìm kiếm |
| 16 | service | varchar(50) | YES | Loại dịch vụ đang sử dụng (DEFAULT `'EI'`) |
| 17 | ref_center_unit_id | nvarchar(255) | YES | ID đơn vị trung tâm tham chiếu (xăng dầu, gas...) |
| 18 | email | varchar(255) | YES | Email liên hệ |
| 19 | bank_account | varchar(100) | YES | Số tài khoản ngân hàng mặc định |
| 20 | bank_name | nvarchar(400) | YES | Tên ngân hàng |
| 21 | fax_number | varchar(100) | YES | Số fax |
| 22 | acqId | int | YES | ID ngân hàng thanh toán (acquirer) |
| 23 | account_name | nvarchar(255) | YES | Tên chủ tài khoản ngân hàng |
| 24 | shop_code | varchar(100) | YES | Mã cửa hàng |
| 25 | integration_type | nvarchar(100) | YES | Loại tích hợp bên ngoài |
| 26 | id_pharmaceutical | nvarchar(100) | YES | ID đơn vị dược — dùng cho hệ thống nhà thuốc |
| 27 | password_pharmaceutical | nvarchar(255) | YES | Mật khẩu tích hợp hệ thống dược |
| 28 | tax_code | varchar(255) | YES | Mã số thuế của công ty |
| 29 | website | varchar(255) | YES | Website công ty |
| 30 | business_location_code | nvarchar(255) | YES | Mã địa điểm kinh doanh (đăng ký thuế) |
| 31 | business_location_address | nvarchar(max) | YES | Địa chỉ địa điểm kinh doanh |

**Primary key:** `PK__company__...` CLUSTERED (id)

**Default constraints:**
| Tên | Cột | Giá trị |
|-----|-----|---------|
| `DF_Service_Default` | service | `'EI'` — công ty mới mặc định dùng dịch vụ EI |

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `idx_company_comOwnerId` | (com_owner_id) | Lấy danh sách công ty theo chủ sở hữu |
| `idx_company_id_comOwnerId` | (id, com_owner_id) | Covering index lọc theo công ty + chủ sở hữu |

> ⚠️ Không có FK ràng buộc `com_owner_id → company_owner.id` ở mức DB. `service = 'EI'` được áp qua **DEFAULT constraint**, KHÔNG phải trigger.

---

## Bảng: `ep_user`
**Mô tả:** Tài khoản người dùng hệ thống. Một người dùng có thể thuộc nhiều công ty (qua `company_user`).

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | username | varchar(100) | YES | Tên đăng nhập |
| 3 | password | varchar(100) | YES | Mật khẩu đã hash |
| 4 | full_name | nvarchar(100) | YES | Họ tên đầy đủ |
| 5 | email | varchar(100) | YES | Email |
| 6 | phone_number | varchar(100) | YES | Số điện thoại |
| 7 | address | nvarchar(512) | YES | Địa chỉ |
| 8 | is_manager | bit | YES | Có phải quản lý hay không |
| 9 | authority | varchar(20) | YES | Cấp quyền hạn (ADMIN, USER...) |
| 10 | creator | int | YES | ID người tạo (ep_user.id) |
| 11 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 12 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 13 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 14 | status | int | YES | Trạng thái tài khoản (1=active, 0=inactive) |
| 15 | normalized_name | nvarchar(512) | YES | Họ tên đã chuẩn hóa (bỏ dấu, lowercase) dùng tìm kiếm |
| 16 | password_version | int | YES | Phiên bản thuật toán hash mật khẩu — dùng để migrate khi đổi cơ chế hash |
| 17 | type | varchar(50) | YES | Loại tài khoản người dùng |

**Primary key:** `PK__ep_user__...` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | INCLUDE | Ghi chú |
|-----------|-----|---------|---------|
| `idx_epUser_username_password_included` | (username, password) | full_name, phone_number, is_manager, authority | Hỗ trợ xác thực đăng nhập |

> ⚠️ KHÔNG tồn tại UNIQUE constraint `(username, status)` trên DB thực tế — username không được ràng buộc duy nhất ở mức DB.

---

## Bảng: `company_user`
**Mô tả:** Bảng trung gian liên kết người dùng với công ty (quan hệ nhiều-nhiều). Xác định nhân viên nào làm việc tại công ty nào.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | company_id | int | YES | FK → company.id — Công ty |
| 3 | user_id | int | YES | FK → ep_user.id — Người dùng |
| 4 | creator | int | YES | ID người tạo (ep_user.id) |
| 5 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 6 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 7 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 8 | shift_management | bit | YES | Người dùng này có quản lý ca làm việc hay không |
| 9 | ref_id | int | YES | ID tham chiếu liên kết với hệ thống ngoài |
| 10 | status | int | YES | Trạng thái (DEFAULT 1 = active, 0 = inactive) |

**Primary key:** `PK__company___...` CLUSTERED (id)

**Default constraints:**
| Tên | Cột | Giá trị |
|-----|-----|---------|
| `DF_company_user_status` | status | `1` (active) |

**Foreign Keys:**
| Tên constraint | Cột | Tham chiếu |
|----------------|-----|-----------|
| `company_user_company_id_fk` | company_id | company(id) |
| `company_user_ep_user_id_fk` | user_id | ep_user(id) |

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `idx_companyUser_companyId` | (company_id) | Lấy danh sách nhân viên của một công ty |
| `idx_companyUser_userId` | (user_id) | Lấy danh sách công ty của một người dùng |
| `idx_companyUser_userId_companyId` | (user_id, company_id) | Covering index tra cứu cặp user-company |

> ⚠️ `company_id`, `user_id`, `status` đều NULLABLE trên DB thực tế (không phải NOT NULL).

---

## Bảng: `role`
**Mô tả:** Vai trò / nhóm quyền trong một công ty. Mỗi role thuộc về một `company` cụ thể (trừ role hệ thống).

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | code | varchar(50) | YES | Mã định danh của role (duy nhất trong công ty) |
| 3 | name | nvarchar(150) | YES | Tên hiển thị của role |
| 4 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 5 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 6 | creator | int | YES | ID người tạo (ep_user.id) |
| 7 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 8 | type | int | YES | Loại role (hệ thống / tùy chỉnh) |
| 9 | com_id | int | YES | ID công ty sở hữu role này (→ company.id, không ràng buộc FK) |
| 10 | normalized_name | varchar(200) | YES | Tên đã chuẩn hóa dùng để tìm kiếm |

**Primary key:** `PK__role__...` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `idx_role_name` | (name) | Tìm kiếm role theo tên |

---

## Bảng: `permission`
**Mô tả:** Danh sách các quyền hệ thống, tổ chức theo cấu trúc cây cha-con. Ví dụ: quyền cha "Quản lý kho" có các quyền con "Xem kho", "Tạo phiếu nhập", v.v.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | code | varchar(50) | YES | Mã quyền (duy nhất trong toàn hệ thống) |
| 3 | parent_id | int | YES | ID quyền cha — NULL nếu là quyền gốc |
| 4 | parent_code | varchar(50) | YES | Mã quyền cha (denormalized để truy vấn nhanh) |
| 5 | name | nvarchar(255) | YES | Tên quyền hiển thị |
| 6 | description | nvarchar(255) | YES | Mô tả ý nghĩa của quyền |
| 7 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 8 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 9 | creator | int | YES | ID người tạo (ep_user.id) |
| 10 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |

**Primary key:** `PK__permissi__...` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `idx_permission_parentId` | (parent_id) | Lấy danh sách quyền con của một quyền cha |
| `PERMISSION_PARENT_ID_INDEX` | (parent_id) | Trùng mục đích với idx_permission_parentId (index dư thừa) |
| `PERMISSION_PARENT_CODE_INDEX` | (parent_code) | Tra cứu quyền con theo mã quyền cha |

---

## Bảng: `role_permission`
**Mô tả:** Gán quyền (`permission`) cho role. Xác định role nào có những quyền gì.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | role_id | int | YES | FK → role.id — Role được gán quyền |
| 3 | permission_id | int | YES | FK → permission.id — Quyền được gán |
| 4 | role_code | varchar(50) | YES | Mã role (denormalized để truy vấn nhanh) |
| 5 | permission_code | varchar(50) | YES | Mã quyền (denormalized để truy vấn nhanh) |
| 6 | permission_parent_code | varchar(50) | YES | Mã quyền cha (denormalized — hỗ trợ kiểm tra phân cấp) |
| 7 | creator | int | YES | ID người tạo (ep_user.id) |
| 8 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 9 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 10 | update_time | datetime | YES | Thời điểm cập nhật cuối |

**Primary key:** `PK__role_per__...` CLUSTERED (id)

**Foreign Keys:**
| Tên constraint | Cột | Tham chiếu |
|----------------|-----|-----------|
| `role_permission_role_id_fk` | role_id | role(id) |
| `role_permission_permission_id_fk` | permission_id | permission(id) |

**Indexes:**
| Tên index | Cột | INCLUDE | Ghi chú |
|-----------|-----|---------|---------|
| `idx_rolePermission_roleCode` | (role_code) | — | Lấy danh sách quyền theo mã role |
| `role_permission_role_id_index` | (role_id) | permission_code | Lấy quyền của role (covering index) |

---

## Bảng: `user_role`
**Mô tả:** Gán role cho người dùng trong phạm vi một công ty. Một người dùng có thể có nhiều role khác nhau tại các công ty khác nhau.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | user_id | int | YES | FK → ep_user.id — Người dùng được gán role |
| 3 | role_id | int | YES | FK → role.id — Role được gán |
| 4 | com_id | int | YES | ID công ty áp dụng role này (→ company.id, không ràng buộc FK) |
| 5 | creator | int | YES | ID người tạo (ep_user.id) |
| 6 | updater | int | YES | ID người cập nhật cuối (ep_user.id) |
| 7 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 8 | update_time | datetime | YES | Thời điểm cập nhật cuối |

**Primary key:** `PK__user_rol__...` CLUSTERED (id)

**Foreign Keys:**
| Tên constraint | Cột | Tham chiếu |
|----------------|-----|-----------|
| `user_role_ep_user_id_fk` | user_id | ep_user(id) |
| `user_role_role_id_fk` | role_id | role(id) |

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `idx_user_role_userId_roleId` | (user_id, role_id) | Tra cứu role của người dùng |
| `idx_userRole_comId` | (com_id) | Lấy danh sách user-role trong một công ty |

> ⚠️ `com_id` KHÔNG có FK tới company.id (chỉ user_id, role_id được ràng buộc FK).

---

## Bảng: `otp`
**Mô tả:** Mã OTP xác thực (đăng nhập, đổi mật khẩu, xác minh tài khoản...).

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | username | varchar(100) | YES | Tên đăng nhập nhận OTP |
| 3 | OTP | varchar(6) | YES | Mã OTP 6 chữ số |
| 4 | expired_time | datetime | YES | Thời điểm hết hạn |
| 5 | type | int | YES | Loại OTP (đăng nhập, đổi mật khẩu...) |
| 6 | status | int | YES | Trạng thái (đã dùng / chưa dùng / hết hạn) |
| 7 | creator | int | YES | ID người tạo |
| 8 | updater | int | YES | ID người cập nhật cuối |
| 9 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 10 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 11 | send_type | int | YES | Kênh gửi (SMS / Email) |

**Primary key:** `otp_pk` NONCLUSTERED (id)

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `otp_id_uindex` (UNIQUE CLUSTERED) | (id) | Index gom cụm duy nhất theo id |

---

## Bảng: `owner_package`
**Mô tả:** Gói dịch vụ đã đăng ký của `company_owner` (mỗi chủ sở hữu có thể mua nhiều gói/đợt).

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | owned_id | int | YES | → company_owner.id — Chủ sở hữu mua gói |
| 3 | package_id | int | YES | → package.id — Gói dịch vụ |
| 4 | status | int | YES | Trạng thái (đang dùng / hết hạn...) |
| 5 | start_date | datetime | YES | Ngày bắt đầu hiệu lực |
| 6 | end_date | datetime | YES | Ngày kết thúc hiệu lực |
| 7 | pack_count | int | YES | Số lượng gói |
| 8 | voucher_using | int | YES | Số voucher / chứng từ đã sử dụng |
| 9 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 10 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 11 | creator | int | YES | ID người tạo |
| 12 | updater | int | YES | ID người cập nhật cuối |

**Primary key:** `owner_package_pk` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | INCLUDE | Ghi chú |
|-----------|-----|---------|---------|
| `idx_owner_package_owned_id_id_desc` | (owned_id, id) | end_date, status | Lấy gói mới nhất + hạn dùng của một chủ sở hữu |

---

## Bảng: `package`
**Mô tả:** Định nghĩa các gói dịch vụ và hạn mức đi kèm.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | package_code | nvarchar(50) | YES | Mã gói |
| 3 | package_name | nvarchar(255) | YES | Tên gói |
| 4 | description | nvarchar(400) | YES | Mô tả gói |
| 5 | limit_company | int | YES | Giới hạn số công ty |
| 6 | limit_user | int | YES | Giới hạn số người dùng |
| 7 | limit_voucher | int | YES | Giới hạn số chứng từ |
| 8 | time | int | YES | Thời hạn tháng (-1 = không giới hạn) |
| 9 | type | varchar(100) | YES | Loại gói |
| 10 | status | int | YES | Trạng thái gói |

**Primary key:** `package_pk` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `package_ id_uindex` (UNIQUE) | (id) | Index duy nhất theo id |

---

## Bảng: `owner_device`
**Mô tả:** Thiết bị in / POS của `company_owner`.

| # | Cột | Kiểu | Null | Mô tả |
|---|-----|------|------|-------|
| 1 | **id** | int IDENTITY | NOT NULL (PK) | Khóa chính, tự tăng |
| 2 | owner_id | int | YES | → company_owner.id — Chủ sở hữu thiết bị |
| 3 | name | nvarchar(512) | YES | Tên thiết bị |
| 4 | device_code | varchar(3) | YES | Mã thiết bị |
| 5 | creator | int | YES | ID người tạo |
| 6 | updater | int | YES | ID người cập nhật cuối |
| 7 | create_time | datetime | YES | Thời điểm tạo bản ghi |
| 8 | update_time | datetime | YES | Thời điểm cập nhật cuối |
| 9 | normalized_name | nvarchar(512) | YES | Tên thiết bị đã chuẩn hóa dùng tìm kiếm |

**Primary key:** `owner_device_pk` CLUSTERED (id)

**Indexes:**
| Tên index | Cột | Ghi chú |
|-----------|-----|---------|
| `owner_device_id_uindex` (UNIQUE) | (id) | Index duy nhất theo id |

---

## Quan hệ giữa các bảng trong nhóm

```
company_owner (1) ──< company            (com_owner_id — không FK)
company_owner (1) ──< owner_package >── (1) package
company_owner (1) ──< owner_device

company       (1) ──< company_user >── (1) ep_user   (FK 2 chiều)
company       (1) ──< role               (com_id — không FK)
ep_user       (1) ──< user_role >── (1) role         (FK user_id, role_id)
                          └─ com_id (công ty áp dụng — không FK)
role          (1) ──< role_permission >── (1) permission  (FK 2 chiều)
permission    (1) ──< permission         (self-ref: parent_id — không FK)

ep_user / otp : liên kết lỏng qua username (không FK)
```

**Luồng phân quyền (RBAC):**
1. `ep_user` được liên kết với `company` qua `company_user`.
2. `ep_user` được gán `role` trong từng `company` qua `user_role` (com_id xác định phạm vi).
3. `role` được gán danh sách `permission` qua `role_permission`.
4. Kiểm tra quyền: `user_role` → `role_permission` → `permission.code`.

**FK thực tế được ràng buộc ở mức DB (chỉ 6 FK):**
`company_user → company`, `company_user → ep_user`, `role_permission → role`, `role_permission → permission`, `user_role → ep_user`, `user_role → role`.
Các quan hệ còn lại (`company.com_owner_id`, `role.com_id`, `user_role.com_id`, `owner_package`, `owner_device`...) chỉ liên kết logic, KHÔNG có FK enforce.

**Bảng master được tham chiếu nhưng nằm ngoài nhóm:**
`business`, `business_type` (company.business_id / business_type tham chiếu tới — thuộc nhóm Danh mục).
