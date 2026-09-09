---
type: decision
status: accepted
created: 2026-06-01
updated: 2026-07-30
owner: "@huelinh"
tags: [architecture, account-service, database-separation]
changelog:
  - 2026-07-30 | manual | bổ sung bảng message vào scope Account Service (13 bảng), thêm bước gửi mã trong Flow B
  - 2026-06-02 | manual | bổ sung API contract, migration plan, JWT detail, Kafka cascade, luồng 3.3/3.4, resilience
  - 2026-06-01 | manual | initial architecture decision for user module separation
---

# Kiến trúc tách Account Service — EasyPOS

## 1. Bối cảnh

Hệ thống EasyPOS hiện đang là monolith với một database duy nhất (`easyposbackoffice`, ~200 bảng). Tất cả dữ liệu người dùng, phân quyền, công ty và nghiệp vụ POS đều nằm chung.

Quyết định: tách **Account Service** thành **database riêng** để:
- Phân tách rõ trách nhiệm: Account Service quản lý danh tính, phân quyền và thông tin công ty; POS Service quản lý nghiệp vụ bán hàng
- Chuẩn bị cho kiến trúc service-oriented trong tương lai
- Cho phép scale Account Service độc lập (auth, SSO nhiều chi nhánh, quản lý gói dịch vụ)

---

## 2. Scope

> **Account Service trả lời 4 câu hỏi: "Anh là ai?" / "Anh có được vào không?" / "Anh được làm gì?" / "Công ty anh đang dùng gói gì?"**

### Trong scope

| Nhóm | Trách nhiệm | Bảng |
|---|---|---|
| **Identity** | Quản lý thông tin danh tính người dùng (tên, email, phone, trạng thái) | `ep_user` |
| **Authentication** | Xác thực đăng nhập, xác thực OTP | `ep_user`, `otp` |
| **Authorization** | Phân quyền RBAC — user được làm gì, tại chi nhánh nào | `role`, `permission`, `role_permission`, `user_role`, `company_user` |
| **Company** | Quản lý công ty cha, chi nhánh, cấu hình chi nhánh | `company_owner`, `company`, `config` |
| **Package** | Gói dịch vụ và subscription của công ty cha | `package`, `owner_package` |
| **Messaging** | Hàng đợi gửi email/SMS phục vụ xác thực và khởi tạo tài khoản | `message` |

### Ngoài scope

- **Nghiệp vụ POS** — bán hàng, kho, thanh toán, công nợ (POS Service)
- **Khách hàng** — customer là đối tượng nghiệp vụ của POS, không phải user hệ thống
- **Thông báo trong ứng dụng** — `notification` / `notification_user` là thông báo nghiệp vụ POS (hàng sắp hết hạn, huỷ đơn, đơn QR, export lỗi), giữ ở POS DB. Chỉ hàng đợi gửi email/SMS phục vụ tài khoản (`message`) thuộc Account Service
- **Quy đổi đơn vị, thuộc tính sản phẩm** — Core/POS tự chịu trách nhiệm

---

## 3. Quyết định kiến trúc

| Hạng mục | Quyết định |
|---|---|
| Phương thức tách | **Database riêng** (không phải schema riêng, không phải microservice hoàn toàn) |
| Cross-DB FK constraint | **Không** — SQL Server không hỗ trợ FK cross-database |
| Tham chiếu chéo | **Soft reference** — chỉ lưu ID, constraint do application đảm bảo |
| Resolve tên khi hiển thị | **Application-level batch API call** — không denormalize tên vào bảng giao dịch |
| Legacy tables | Giữ nguyên trong POS DB, không xóa, không dùng |

---

## 4. Bảng thuộc Account Service DB

### 4.1 Identity & Auth

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `ep_user` | Danh tính người dùng (username, password, full_name, email, phone, is_manager, status) | Thay thế bảng `account` cũ |
| `otp` | Xác thực OTP (username, mã OTP, thời hạn, loại, kênh gửi) | |

### 4.2 RBAC

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `role` | Định nghĩa vai trò RBAC | `com_id` = FK → `company.id` (cùng DB) |
| `permission` | Cây phân quyền (parent_id, parent_code) | |
| `role_permission` | Ánh xạ role ↔ permission | |
| `user_role` | Ánh xạ user ↔ role theo chi nhánh | `com_id` = FK → `company.id` (cùng DB) |
| `company_user` | Quyền truy cập của user theo chi nhánh | `company_id` = FK → `company.id` (cùng DB) |

### 4.3 Company

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `company_owner` | Công ty cha (tổ chức sở hữu nhiều chi nhánh) | `owner_id` = FK → `ep_user.id` |
| `company` | Chi nhánh / cửa hàng | `com_owner_id` = FK → `company_owner.id` |
| `config` | Cấu hình per chi nhánh (key-value) | `company_id` = FK → `company.id` |

### 4.4 Package

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `package` | Định nghĩa gói dịch vụ (limit_company, limit_user, limit_voucher) | Master data |
| `owner_package` | Subscription của company_owner → package (start/end date, status) | `owned_id` = FK → `company_owner.id`; `package_id` = FK → `package.id` |

### 4.5 Messaging

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `message` | Hàng đợi gửi email/SMS: người nhận, cc/bcc, tiêu đề, nội dung text/html, trạng thái gửi, thông báo lỗi | `creator` = FK → `ep_user.id` (cùng DB), giá trị `0` = hệ thống tự gửi |

**Vì sao thuộc Account Service:** toàn bộ dữ liệu hiện có trong `message` đều là nội dung tài khoản — thông tin khởi tạo tài khoản, mã xác thực đăng ký dùng thử, mã OTP, đặt lại mật khẩu. Không có bản ghi nào thuộc nghiệp vụ POS. Bảng này là kênh gửi của luồng OTP (Mục 12 Flow B), nên đi cùng `otp` và `ep_user`.

**Giá trị các cột trạng thái:**

| Cột | Giá trị | Ý nghĩa |
|---|---|---|
| `type` | `1` | Gửi qua email — `receive` là địa chỉ email |
| | `2` | Gửi qua SMS — `receive` là số điện thoại |
| `status` | `0` | Mới tạo, chưa cập nhật kết quả gửi |
| | `1` | Gửi thành công |
| | `2` | Gửi lỗi — lý do ghi ở `error_message` (ví dụ "Authentication IP failure", "The Same Content Short Time") |

**Tổng: 13 bảng.**

> **Thay đổi quan trọng:** `role.com_id`, `user_role.com_id`, `company_user.company_id` trước đây là soft reference sang Company DB — nay `company` đã trong cùng Account Service DB nên trở thành **FK thật**, có constraint đảm bảo toàn vẹn dữ liệu.

---

## 5. Bảng giữ nguyên POS DB

### 5.1 Bảng giao dịch có soft ref sang ep_user

Các bảng này lưu `creator`, `updater`, `sale_person_id`, `owner_id`, `user_id` là ID của `ep_user` — sau tách trở thành soft reference, không còn FK constraint.

| Bảng | Cột soft ref sang ep_user |
|---|---|
| `bill` | `creator`, `updater`, `owner_id`, `sale_person_id`, `user_id` |
| `debt` | `creator`, `updater` |
| `debt_payment` | `creator`, `updater` |
| `payment_history` | `creator`, `updater` |
| `mc_receipt` | `creator`, `updater` |
| `mc_payment` | `creator`, `updater` |
| `sys_log` | `creator`, `updater`, `username` |

> `sys_log` log hành động nghiệp vụ POS (bán hàng, nhập kho, sửa giá...) — nội dung thuộc POS domain nên giữ ở POS DB. `username` và `creator` chỉ là metadata "ai thực hiện".

### 5.2 Bảng legacy — giữ nguyên, không dùng, không xóa

| Bảng | Trạng thái |
|---|---|
| `account` | Đã thay bằng `ep_user`, không còn active, không drop |
| `account_role` | Legacy RBAC cũ, đã thay bằng `role`/`user_role`, không drop |

---

## 6. Sơ đồ quan hệ

```
┌──────────────────────────────────────────────────┐    ┌──────────────────────────────────────┐
│              Account Service DB                  │    │              POS DB                  │
│                                                  │    │                                      │
│  ┌─────────────┐    ┌───────────────┐            │    │                                      │
│  │company_owner│    │    package    │            │    │                                      │
│  │─────────────│    │───────────────│            │    │                                      │
│  │ id       PK │    │ id         PK │            │    │                                      │
│  │ owner_id FK─┼─┐  └───────┬───────┘            │    │                                      │
│  └──────┬──────┘ │          │ owner_package       │    │                                      │
│         │        │  ┌───────┴───────┐            │    │                                      │
│   com_owner_id   │  │ owner_package │            │    │                                      │
│         ▼        │  │───────────────│            │    │                                      │
│  ┌──────────────┐│  │ owned_id   FK │            │    │                                      │
│  │   company    ││  │ package_id FK │            │    │                                      │
│  │──────────────││  └───────────────┘            │    │                                      │
│  │ id        PK ││                               │    │                                      │
│  └──┬──┬──┬─────┘│                               │    │                                      │
│     │  │  │      └──► ep_user.id                 │    │                                      │
│     │  │  │                                      │    │                                      │
│  config│ role/user_role/company_user             │    │                                      │
│     │  │  │(com_id/company_id = FK → company.id) │    │                                      │
│     ▼  │  │                                      │    │                                      │
│  config│  └─► RBAC chain                         │    │                                      │
│        │      (role→role_perm→permission)        │    │                                      │
│        │                                         │    │                                      │
│  ┌──────────────┐                                │    │                                      │
│  │   message    │  Outbox email (type=1) / SMS   │    │                                      │
│  │──────────────│  (OTP, khởi tạo TK, reset MK)  │    │                                      │
│  │ id        PK │                                │    │                                      │
│  │ creator   ───┼──► ep_user.id                  │    │                                      │
│  └──────────────┘                                │    │                                      │
│                                                  │    │                                      │
│  ep_user ───────────────────────────────────────────► bill.creator       (soft ref)          │
│  ep_user ───────────────────────────────────────────► bill.sale_person_id(soft ref)          │
│  ep_user ───────────────────────────────────────────► debt.creator       (soft ref)          │
│  ep_user ───────────────────────────────────────────► mc_receipt.creator (soft ref)          │
│  ep_user ───────────────────────────────────────────► sys_log.creator    (soft ref)          │
│                                                  │    │                                      │
│  company ───────────────────────────────────────────► bill.com_id        (soft ref)          │
│  company ───────────────────────────────────────────► debt.com_id        (soft ref)          │
│                                                  │    │  ┌──────────────────────────┐        │
│                                                  │    │  │  Legacy (không dùng)     │        │
│                                                  │    │  │  account, account_role   │        │
│                                                  │    │  └──────────────────────────┘        │
└──────────────────────────────────────────────────┘    └──────────────────────────────────────┘
```

---

## 7. Không denormalize tên nhân viên

**Quyết định:** Các bảng POS DB **không** lưu thêm cột `creator_name`, `sale_person_name` hay tương tự.

**Lý do:** Nhân viên có thể đổi tên — denormalize tên vào hàng triệu bản ghi giao dịch (bill, debt...) gây ra vấn đề update lan rộng trên toàn bộ lịch sử.

Thay vào đó: resolve tên tại tầng application qua batch API call (xem Mục 8).

---

## 8. Luồng báo cáo doanh thu theo nhân viên

### 8.1 Luồng cũ (trước khi tách — cùng DB)

**Các bước thực hiện:**

```
Bước 1 — Người dùng chọn filter
  UI gửi lên: companyIds, salePersonIds (hoặc checkAll=1), fromDate, toDate

Bước 2 — Backend gửi 1 SQL duy nhất xuống DB
  CTE BillFiltered: gom tất cả bill hợp lệ → GROUP BY (sale_person_id, com_id)
  Main query: ep_user → company_user → company → LEFT JOIN BillFiltered

Bước 3 — DB trả kết quả đã đầy đủ: tên nhân viên, tên chi nhánh, số liệu
  Đã ORDER BY amount DESC + LIMIT/OFFSET ngay trong DB

Bước 4 — Backend trả thẳng cho UI, không xử lý thêm
```

**Sơ đồ JOIN:**

```
                    ══════════ INNER JOIN chain ══════════
                   (chỉ lấy user có trong company được chọn)

  ┌─────────────┐       ┌────────────────┐       ┌───────────┐
  │   ep_user   │       │  company_user  │       │  company  │
  │─────────────│       │────────────────│       │───────────│
  │ id       PK ├──────►│ user_id     FK │       │ id     PK │
  │ full_name   │       │ company_id  FK ├──────►│ name      │
  │ phone_number│       │                │       │           │
  └─────────────┘       └────────────────┘       └───────────┘
         │                                              │
         │         WHERE cou.company_id IN (:ids)       │
         │         AND (:checkAll=1 OR eu.id IN (...))  │
         │                                              │
         └──────────────────┬───────────────────────────┘
                            │
                       LEFT JOIN
                  (nhân viên không có đơn
                   vẫn xuất hiện, số liệu = 0)
                            │
                            ▼
              ┌─────────────────────────────┐
              │      BillFiltered (CTE)     │
              │─────────────────────────────│
              │ sale_person_id              │
              │ com_id                      │── ON sale_person_id = eu.id
              │ SUM(amount)                 │       AND com_id = c.id
              │ SUM(discount_amount)        │
              │ SUM(total_pre_tax)          │
              │ SUM(vat_amount)             │
              │ SUM(total_amount)           │
              └─────────────────────────────┘
                            ▲
                            │ GROUP BY (sale_person_id, com_id)
              ┌─────────────────────────────┐
              │           bill              │
              │─────────────────────────────│
              │ WHERE status IN (:filter)   │
              │ AND com_id IN (:companyIds) │
              │ AND bill_date BETWEEN ...   │
              └─────────────────────────────┘
```

**Venn diagram — Tập hợp kết quả:**

```
  Tập nhân viên thuộc chi nhánh           Tập bill có doanh thu
  ┌──────────────────────────────┐
  │  ep_user ∩ company_user      │
  │  ∩ company                   │
  │                   ┌──────────┼─────────────────────┐
  │  Nhân viên        │          │  Nhân viên không     │
  │  chưa có đơn      │  Nhân    │  thuộc công ty       │
  │  → amount = 0     │  viên    │  được chọn           │
  │  (COALESCE)       │  có đơn  │  → bị loại           │
  │                   └──────────┼─────────────────────┘
  └──────────────────────────────┘
    ↑ LEFT JOIN giữ lại toàn bộ phần này
```

**Điểm mấu chốt:**

| Đặc điểm | Chi tiết |
|---|---|
| Driving table | `ep_user` — hiển thị tất cả nhân viên dù không có đơn |
| Sort + Paginate | `ORDER BY amount DESC` + `LIMIT/OFFSET` chạy trong DB |
| Round-trip | 1 SQL duy nhất — toàn bộ xử lý trong DB |
| Nguồn dữ liệu | 3 bảng cùng DB → JOIN tự do |

---

### 8.2 Luồng mới (sau khi tách — cross-service)

```
Bước 1 — Chọn nhân viên (UI)
  UI gọi BE → BE gọi User Service: GET /users?com_id={branch}
  → Trả danh sách {id, full_name}
  → User chọn → có user_id

Bước 2 — Lấy dữ liệu báo cáo
  BE query POS DB:
      SELECT sale_person_id, SUM(...) FROM bill
      WHERE sale_person_id = @user_id AND ...
      GROUP BY sale_person_id
  → Trả về danh sách bản ghi (chỉ có ID, không có tên)

Bước 3 — Resolve tên (batch)
  BE thu thập tất cả user IDs từ kết quả
  → Gọi User Service: GET /users?ids=1,2,5,7   (1 lần duy nhất)
  → Merge tên vào response trả về UI
```

---

## 9. Luồng chung báo cáo có tham số nhân viên

Áp dụng cho **mọi báo cáo** có filter chọn chi nhánh + nhân viên. Sau khi tách module, tất cả các luồng này thay đổi theo pattern sau:

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1 — Load tham số (UI)                                     │
└─────────────────────────────────────────────────────────────────┘

Bước 1: Load danh sách chi nhánh
  UI → Company Service: GET /companies?user_id={current_user}
  → Hiển thị dropdown chi nhánh

Bước 2: User chọn chi nhánh (com_id)

Bước 3: Load danh sách nhân viên theo chi nhánh
  UI → User Service: GET /users?com_id={com_id}&status=active
  → Hiển thị dropdown nhân viên (có option "Tất cả nhân viên")

Bước 4: User chọn nhân viên + các filter khác (ngày, trạng thái...)

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2 — Query dữ liệu báo cáo (Report Service → POS DB)      │
└─────────────────────────────────────────────────────────────────┘

Bước 5: Gọi Report API
  params: com_id, sale_person_id (null = tất cả), from_date, to_date, ...

Bước 6: Report Service query POS DB
  WHERE com_id = @com_id
    AND (@sale_person_id IS NULL OR sale_person_id = @sale_person_id)
    AND [các filter khác]
  GROUP BY sale_person_id
  ORDER BY [tiêu chí]

  → Kết quả: [{sale_person_id, ...số liệu...}, ...]

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3 — Resolve tên nhân viên (Report Service → User Service) │
└─────────────────────────────────────────────────────────────────┘

Bước 7: Thu thập unique sale_person_ids từ kết quả
  ids = [5, 12, 3, ...]

Bước 8: Batch call User Service (1 lần duy nhất)
  GET /users?ids=5,12,3
  → Map {id → full_name}

Bước 9: Merge tên vào kết quả, giữ nguyên thứ tự

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4 — Trả về UI                                             │
└─────────────────────────────────────────────────────────────────┘

Bước 10: Trả kết quả đã có tên nhân viên → UI render bảng / biểu đồ
```

**Xử lý các trường hợp đặc biệt:**

| Trường hợp | Xử lý |
|---|---|
| Chọn "Tất cả nhân viên" | `sale_person_id = null` → bỏ filter, GROUP BY toàn bộ |
| Chọn 1 nhân viên cụ thể | `sale_person_id = {id}` → filter trực tiếp |
| Nhân viên đã nghỉ vẫn có dữ liệu lịch sử | User Service trả cả `status=inactive` khi query theo ids |
| Export Excel async | Resolve tên 1 lần ở đầu job, lưu vào file — không gọi lại lúc render |

### Danh sách báo cáo áp dụng pattern này

| Báo cáo | Cột resolve | Bảng nguồn | Cột ID |
|---|---|---|---|
| 3.1 Doanh thu theo nhân viên | Tên nhân viên, SĐT | `bill` | `sale_person_id` |
| 3.2 Nhân viên theo sản phẩm | Tên nhân viên, SĐT | `bill` | `sale_person_id` |
| 3.3 Danh sách đơn hàng | Người bán | `bill` | `sale_person_id` |
| 3.4 Danh sách ca làm việc | Nhân viên | `shift` | `user_id` |

**Luồng 3.3 — Danh sách đơn hàng:**

```
Bước 1: BE query POS DB
        SELECT bill.id, bill.sale_person_id, bill.total_amount, bill.status, ...
        FROM bill
        WHERE com_id IN (:ids) AND bill_date BETWEEN ... AND status IN (...)

Bước 2: Thu thập distinct sale_person_ids từ kết quả
        ids = [1, 5, 42, ...]

Bước 3: POST /internal/users/batch-resolve { "ids": [1, 5, 42] }
        → Map {id → full_name}

Bước 4: Merge full_name vào từng dòng → trả UI
```

**Luồng 3.4 — Danh sách ca làm việc:**

```
Bước 1: BE query POS DB
        SELECT shift.id, shift.user_id, shift.start_time, shift.end_time, ...
        FROM shift
        WHERE com_id IN (:ids) AND ...

Bước 2: Thu thập distinct user_ids từ kết quả

Bước 3: POST /internal/users/batch-resolve { "ids": [...] }
        → Map {id → full_name, phone_number}

Bước 4: Merge tên vào kết quả → trả UI
```

---

## 10. Lưu ý khi implement

| Vấn đề | Giải pháp |
|---|---|
| N+1 query — gọi User Service nhiều lần | Luôn dùng batch endpoint `GET /users?ids=...`, không gọi từng ID riêng lẻ |
| User Service tạm down → report lỗi | Cache tên nhân viên bằng **Redis**, TTL **5 phút**; circuit breaker mở → fallback hiển thị `—` cho cột tên, báo cáo vẫn load (không block toàn bộ response) |
| Export báo cáo async (file Excel lớn) | Resolve tên 1 lần khi bắt đầu job, lưu vào kết quả export — không re-call lúc render |
| Cross-DB query cùng instance | Vẫn có thể dùng 3-part name (`userdb.dbo.ep_user`) cho query nội bộ nếu cần — chỉ dùng khi thực sự cần thiết, không làm mặc định |
| Tên nhân viên trong lịch sử audit | Dùng `sys_log.username` (varchar đã lưu sẵn) — không cần join sang User DB cho audit trail |

---

## 11. Nguyên tắc thiết kế (Business Rules)

1. **`ep_user.username` là unique và bất biến** — dùng làm định danh đăng nhập, không reuse khi xóa user.
2. **RBAC scope theo `com_id`** — một user có thể có role khác nhau ở từng chi nhánh. Không có "global role" áp dụng toàn hệ thống trừ khi thiết kế riêng.
3. **Mọi thay đổi phân quyền phải có audit trail** — `creator`, `updater`, `create_time`, `update_time` bắt buộc trên `user_role`, `role_permission`, `company_user`.
4. **Soft ref integrity do application đảm bảo** — POS DB không có FK sang User DB. Core/POS Service phải tự validate `user_id` tồn tại và active trước khi ghi giao dịch (`bill`, `debt`...).
5. **User Service không xử lý logic nghiệp vụ POS** — không biết về `bill`, `product`, `inventory`. Core tự chịu trách nhiệm validate đầu vào, tương tự nguyên tắc Warehouse không xử lý quy đổi đơn vị.
6. **OTP một lần duy nhất** — sau khi verify thành công, `otp.status` phải được mark `used` ngay trong cùng transaction, không cho verify lại.

---

## 12. System Design — Các flow chính

### Flow A — Đăng nhập

```
Input: username, password, com_id

Bước 1: Lookup ep_user WHERE username = ? AND status = active
        → Không tìm thấy / status = inactive → lỗi "Tài khoản không tồn tại hoặc đã bị khóa"

Bước 2: Verify password (hash compare)
        → Sai → lỗi "Sai mật khẩu"

Bước 3: Check quyền truy cập chi nhánh
        SELECT 1 FROM company_user
        WHERE user_id = ? AND company_id = ? AND status = active
        → Không có → lỗi "Không có quyền truy cập chi nhánh này"

Bước 4: Load danh sách role theo chi nhánh
        SELECT role_id FROM user_role WHERE user_id = ? AND com_id = ?

Bước 5: Ký JWT và trả về client
        Payload: { user_id, com_ids: [list chi nhánh active], roles: [list role_code], exp }
        TTL khuyến nghị: access token 15–30 phút + refresh token riêng (8–24h)
        → Client lưu token, gửi kèm Authorization: Bearer <token> mọi request
        → Core/POS Service chỉ verify chữ ký + extract payload, KHÔNG cần gọi lại User Service
```

---

### Flow B — Xác thực OTP

```
Input: username, otp_code, type (1=reset password / 2=verify email)

Bước 1: Lookup otp
        SELECT TOP 1 * FROM otp
        WHERE username = ? AND type = ? AND status = active (chưa dùng)
        ORDER BY create_time DESC

Bước 2: Check hết hạn
        → expired_time < NOW() → lỗi "OTP đã hết hạn"

Bước 3: So sánh otp_code
        → Không khớp → lỗi "Mã OTP không đúng"

Bước 4 (trong DB transaction):
        UPDATE otp SET status = used WHERE id = ?
        → Tiếp tục flow nghiệp vụ (đổi mật khẩu / kích hoạt tài khoản)
```

**Bước gửi mã (chạy trước Bước 1):**

```
Bước 0a: Ghi bản ghi otp (username, OTP, expired_time, type, send_type, status = active)

Bước 0b: Ghi 1 bản ghi message
         type    = 1 nếu gửi email / 2 nếu gửi SMS
         receive = email hoặc số điện thoại người nhận
         subject + text_content / html_content = nội dung mã xác thực
         status  = 0 (chưa gửi)

Bước 0c: Job gửi đọc các message có status = 0 → gửi qua nhà cung cấp
         → thành công: UPDATE status = 1
         → lỗi:        UPDATE status = 2, ghi error_message
```

> Cùng cơ chế này áp dụng cho email khởi tạo tài khoản và email đặt lại mật khẩu — đều ghi vào `message`. Xem Mục 4.5.

---

### Flow C — Kiểm tra phân quyền RBAC

```
Input: user_id, com_id, permission_code

Bước 1: Lấy danh sách role của user tại chi nhánh
        SELECT role_id FROM user_role
        WHERE user_id = ? AND com_id = ?

Bước 2: Lấy danh sách permission của các role đó
        SELECT permission_code FROM role_permission
        WHERE role_id IN (...)

Bước 3: Check permission_code IN danh sách
        → Có → allowed
        → Không có → denied "Không có quyền thực hiện thao tác này"
```

> **Tối ưu:** có thể cache kết quả RBAC per `(user_id, com_id)` với TTL ngắn (30–60s) để giảm DB call trong các request liên tiếp.

---

### Vấn đề 4 — Cross-DB FK: Company deactivation cascade

**Mô tả:** `company_user.company_id`, `role.com_id`, `user_role.com_id` là soft reference sang Company DB — không có FK constraint. Khi một company bị deactivate ở POS Module, User DB không tự biết.

**Xử lý — event-driven qua Kafka:**

```
POS Service                  Kafka topic: company.events        User Service
───────────────         ──────────────────────────────────     ─────────────────────────────────
company.deactivate() ──► { event: "COMPANY_DEACTIVATED",  ──► consumer: on COMPANY_DEACTIVATED(X)
                            company_id: X,                      1. UPDATE company_user
                            timestamp: ...         }               SET status = 0
                                                                   WHERE company_id = X

                                                                2. UPDATE role
                                                                   SET status = inactive
                                                                   WHERE com_id = X

                                                                3. Tìm users chỉ thuộc company X
                                                                   (không còn company active nào khác)
                                                                   → UPDATE ep_user SET status = inactive

                                                                4. Publish: user.events
                                                                   → USER_DEACTIVATED (notify downstream)
```

**Lưu ý:**
- Bước 3 dùng logic: `NOT EXISTS (SELECT 1 FROM company_user WHERE user_id = ? AND company_id != X AND status = active)` trước khi deactivate user.
- User có nhiều chi nhánh → chỉ deactivate `company_user` row của chi nhánh X, giữ user active nếu còn chi nhánh khác.
- Event idempotent: consumer phải handle duplicate message an toàn (check `status` trước khi UPDATE).

---

## 14. API Contract — User Service (Internal)

> Prefix `/internal/` — chỉ dùng giữa các service, không expose ra public gateway.

### 14.1 `GET /internal/users/by-company/{company_id}`

Load danh sách nhân viên theo chi nhánh. Dùng ở bước load dropdown nhân viên trước khi xem báo cáo.

**Query params:**

| Param | Kiểu | Mô tả |
|---|---|---|
| `status` | string | `active` (mặc định) / `all` (trả cả inactive — dùng cho lịch sử) |

**Response:**

```json
[
  { "id": 1, "full_name": "Nguyễn Văn A", "phone_number": "0901234567" },
  { "id": 2, "full_name": "Trần Thị B",   "phone_number": "0902345678" }
]
```

---

### 14.2 `POST /internal/users/batch-resolve`

Resolve tên từ danh sách ID. Dùng ở bước merge tên sau khi query POS DB.

**Request:**

```json
{ "ids": [1, 2, 5, 42, 99] }
```

**Response:**

```json
{
  "1":  { "full_name": "Nguyễn Văn A", "phone_number": "0901234567" },
  "2":  { "full_name": "Trần Thị B",   "phone_number": "0902345678" },
  "5":  { "full_name": "Lê Văn C",     "phone_number": "0903456789" },
  "42": { "full_name": "—",            "phone_number": "—" }
}
```

> ID không tìm thấy trong DB → trả `{ "full_name": "—", "phone_number": "—" }`, không lỗi 404.

**Ràng buộc:**
- Max 500 IDs/request.
- Cache phía caller (Redis TTL 5 phút, key: `user:resolve:{id}`).
- Invalidate cache khi nhận Kafka event `user.updated`.

---

### 14.3 `GET /internal/users/{id}`

Lookup đơn lẻ. Dùng cho các trường hợp cần full object (không chỉ tên).

**Response:**

```json
{
  "id": 1,
  "username": "nguyenvana",
  "full_name": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone_number": "0901234567",
  "status": "active"
}
```

**Response 404:** `{ "error": "USER_NOT_FOUND" }`

---

### 14.4 `GET /internal/users/{id}/exists`

Lightweight check — trả `200 OK` nếu tồn tại và active, `404` nếu không. Dùng cho soft-ref integrity check trước khi ghi giao dịch.

---

## 15. Migration Plan

> Mục tiêu: tách User DB khỏi monolith `easyposbackoffice` mà **không downtime**.

### Phase 1 — Dual-write (song song ghi 2 DB)

```
Monolith DB (easyposbackoffice)          User DB (mới tạo)
─────────────────────────────────        ────────────────────────
ep_user, otp, role, permission,    ───► copy schema + migrate data
role_permission, user_role,              (snapshot + CDC hoặc one-time script)
company_user, message              ───► application ghi đồng thời cả 2 DB
                                         Read vẫn từ Monolith DB
```

**Mục tiêu:** đảm bảo User DB luôn có data đồng bộ với Monolith DB.
**Tiêu chí qua phase:** chạy song song ≥ 3 ngày không có data diff.

---

### Phase 2 — Switch read sang User DB

```
Monolith DB        User DB
──────────         ────────────────────────
Vẫn ghi    ───►    Read: ep_user, roles, permissions → từ User DB
                   Write: vẫn ghi cả 2 (safety net)
```

**Mục tiêu:** verify kết quả read từ User DB khớp với Monolith DB.
**Tiêu chí qua phase:** ≥ 2 ngày không có inconsistency được report.

---

### Phase 3 — Cutover (User Service là primary)

```
User Service        Core/POS Service
────────────        ─────────────────────────────────────────
Primary write  ←── Gọi User Service API thay vì query DB trực tiếp
User DB only        Không còn ghi trực tiếp vào ep_user/otp/...
```

**Mục tiêu:** hoàn toàn tách biệt — POS Service không còn kết nối User DB.
**Rollback plan:** giữ Monolith DB write trong 1 tuần sau cutover, enable lại nếu có sự cố.

---

### Phase 4 — Cleanup (sau 30 ngày ổn định)

- Xóa user tables khỏi Monolith DB (`ep_user`, `otp`, `role`, `permission`, `role_permission`, `user_role`, `company_user`, `message`).
- Xóa connection string User DB khỏi Monolith service config.
- Archive migration scripts.

---

### Checklist trước khi bắt đầu Phase 1

- [ ] User DB server được provision và accessible từ application
- [ ] Migration script đã test trên staging
- [ ] Dual-write code đã có feature flag để tắt nhanh nếu cần
- [ ] Monitoring alert cho data diff giữa 2 DB đã setup
- [ ] Rollback plan đã được review bởi tech lead

---

### Flow D — Resolve tên người dùng (cross-service batch)

```
Input: list user_ids (POS Service gom từ kết quả query)

Bước 1: POS Service gom tất cả user IDs cần resolve
        (creator, updater, sale_person_id... từ toàn bộ tập kết quả)

Bước 2: Gọi User Service 1 lần duy nhất
        GET /users?ids=1,2,5,7

Bước 3: User Service query
        SELECT id, full_name, username FROM ep_user WHERE id IN (1,2,5,7)
        → Trả map { 1: {full_name, username}, 2: {...}, ... }

Bước 4: POS Service merge tên vào response trả về UI
```

> **Ràng buộc:** KHÔNG gọi từng ID riêng lẻ (N+1). Mọi resolve phải là batch trong 1 request.

---

## 13. Vấn đề kỹ thuật

### Vấn đề 1 — Soft ref integrity (không có FK cross-DB)

**Mô tả:** POS DB không có FK constraint sang User DB → có thể ghi `bill.creator = 999` dù `ep_user.id = 999` không tồn tại hoặc đã bị xóa.

**Xử lý:**
- Application (Core/POS) validate user tồn tại và active qua User Service **trước khi ghi** giao dịch.
- User Service cung cấp endpoint nhẹ `GET /users/{id}/exists` (trả `200/404`) để check nhanh, không trả full object.
- Không xóa vật lý `ep_user` — chỉ set `status = inactive`. Giữ nguyên lịch sử tham chiếu.

---

### Vấn đề 2 — Cache invalidation tên người dùng

**Mô tả:** POS Service cache tên nhân viên (TTL 5–15 phút). Nếu admin đổi tên user trong khoảng TTL, report hiện tên cũ.

**Xử lý:**
- Chấp nhận được — tên nhân viên hiếm thay đổi, không ảnh hưởng nghiệp vụ.
- User Service publish event `user.updated` lên Kafka → POS/Core Service consumer tự invalidate cache key `user:resolve:{id}` ngay lập tức, không chờ TTL hết hạn.

---

### Vấn đề 3 — RBAC cache consistency

**Mô tả:** Cache RBAC per `(user_id, com_id)` giúp giảm DB call. Nhưng khi admin thu hồi quyền, user đang active session vẫn được phép trong TTL còn lại.

**Xử lý:**
- Dùng TTL ngắn (30–60s) cho RBAC cache — window rủi ro nhỏ.
- Khi thu hồi quyền nhạy cảm (admin, finance): User Service publish event `role_revoked` → consumer invalidate cache ngay lập tức, không chờ TTL.
