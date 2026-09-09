---
type: diagram-erd
feature: account-service
status: draft
created: 2026-06-01
updated: 2026-06-02
owner: "@huelinh"
links: [docs/decisions/2026-06-01-user-module-separation.md]
changelog:
  - 2026-06-02 | manual | thêm company, company_owner, owner_package, package, config; đổi tên → Account Service
  - 2026-06-01 | manual | initial ERD for User DB (dbo schema, 7 tables)
---

# ERD — Account Service Database

> Schema: `dbo` | Database: `accountdb` (sau khi tách từ `easyposbackoffice`)

## Sơ đồ quan hệ

```mermaid
erDiagram
    ep_user {
        int id PK
        varchar username
        varchar password
        nvarchar full_name
        varchar email
        varchar phone_number
        nvarchar address
        bit is_manager
        varchar authority
        int status
        varchar type
        int password_version
    }

    otp {
        int id PK
        varchar username FK
        varchar OTP
        datetime expired_time
        int type
        int status
        int send_type
    }

    company_owner {
        int id PK
        nvarchar name
        nvarchar address
        nvarchar tax_code
        nvarchar owner_name
        int owner_id FK
        varchar ikey
        int revenue_group
        int tax_register_status
    }

    company {
        int id PK
        int com_owner_id FK
        nvarchar name
        varchar phone
        nvarchar address
        varchar email
        varchar tax_code
        bit is_parent
        int business_type
        varchar service
        varchar shop_code
    }

    config {
        int id PK
        int company_id FK
        nvarchar code
        nvarchar value
        nvarchar description
        nvarchar platform
    }

    package {
        int id PK
        nvarchar package_code
        nvarchar package_name
        int limit_company
        int limit_user
        int limit_voucher
        int time
        varchar type
        int status
    }

    owner_package {
        int id PK
        int owned_id FK
        int package_id FK
        int status
        datetime start_date
        datetime end_date
        int pack_count
        int voucher_using
    }

    role {
        int id PK
        varchar code
        nvarchar name
        int type
        int com_id FK
        varchar normalized_name
    }

    permission {
        int id PK
        varchar code
        int parent_id FK
        varchar parent_code
        nvarchar name
        nvarchar description
    }

    role_permission {
        int id PK
        int role_id FK
        int permission_id FK
        varchar role_code
        varchar permission_code
        varchar permission_parent_code
    }

    user_role {
        int id PK
        int user_id FK
        int role_id FK
        int com_id FK
    }

    company_user {
        int id PK
        int company_id FK
        int user_id FK
        bit shift_management
        int status
    }

    ep_user         ||--o{ otp             : "otp.username → ep_user.username"
    ep_user         ||--o{ user_role       : "user_role.user_id → ep_user.id"
    ep_user         ||--o{ company_user    : "company_user.user_id → ep_user.id"
    ep_user         ||--o{ company_owner   : "company_owner.owner_id → ep_user.id"
    company_owner   ||--o{ company         : "company.com_owner_id → company_owner.id"
    company_owner   ||--o{ owner_package   : "owner_package.owned_id → company_owner.id"
    package         ||--o{ owner_package   : "owner_package.package_id → package.id"
    company         ||--o{ config          : "config.company_id → company.id"
    company         ||--o{ role            : "role.com_id → company.id"
    company         ||--o{ user_role       : "user_role.com_id → company.id"
    company         ||--o{ company_user    : "company_user.company_id → company.id"
    role            ||--o{ role_permission : "role_permission.role_id → role.id"
    permission      ||--o{ role_permission : "role_permission.permission_id → permission.id"
    permission      ||--o{ permission      : "permission.parent_id → permission.id"
```

---

## Chú thích quan hệ

| Quan hệ | Loại | Ghi chú |
|---|---|---|
| `ep_user` → `otp` | Soft ref by string | `otp.username = ep_user.username`, không phải ID |
| `ep_user` → `company_owner` | FK nội bộ | `company_owner.owner_id = ep_user.id` |
| `ep_user` → `user_role` | FK nội bộ | `user_role.user_id = ep_user.id` |
| `ep_user` → `company_user` | FK nội bộ | `company_user.user_id = ep_user.id` |
| `company_owner` → `company` | FK nội bộ | `company.com_owner_id = company_owner.id` |
| `company_owner` → `owner_package` | FK nội bộ | `owner_package.owned_id = company_owner.id` |
| `package` → `owner_package` | FK nội bộ | `owner_package.package_id = package.id` |
| `company` → `config` | FK nội bộ | `config.company_id = company.id` |
| `company` → `role` | FK nội bộ | `role.com_id = company.id` — **trước đây là soft ref** |
| `company` → `user_role` | FK nội bộ | `user_role.com_id = company.id` — **trước đây là soft ref** |
| `company` → `company_user` | FK nội bộ | `company_user.company_id = company.id` — **trước đây là soft ref** |
| `role` → `role_permission` | FK nội bộ | `role_permission.role_id = role.id` |
| `permission` → `role_permission` | FK nội bộ | `role_permission.permission_id = permission.id` |
| `permission` → `permission` | Self-ref | `permission.parent_id = permission.id` (cây phân quyền) |

---

## Lưu ý: schema trans_hub

Database hiện tại có schema `trans_hub` chứa bản sao của `role`, `permission`, `role_permission` với cấu trúc tương tự nhưng khác tên cột (`created_by`/`updated_by` thay vì `creator`/`updater`).

`trans_hub.*` **không thuộc Account Service này** — là RBAC riêng của TransHub service. Khi tách database, cần làm rõ `trans_hub.*` đi về database nào.

---

## Cột audit (bỏ khỏi ERD cho gọn)

Mọi bảng đều có 4 cột audit chuẩn, không vẽ vào sơ đồ:

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `creator` | int | ID người tạo (soft ref → ep_user.id) |
| `updater` | int | ID người cập nhật cuối (soft ref → ep_user.id) |
| `create_time` | datetime | Thời gian tạo |
| `update_time` | datetime | Thời gian cập nhật cuối |
