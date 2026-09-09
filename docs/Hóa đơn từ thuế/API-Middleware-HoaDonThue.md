# Tài liệu API — Đồng bộ Hóa đơn từ Thuế (Qua Middleware)

> **Phạm vi**: Tài liệu này mô tả toàn bộ tích hợp giữa **POS System** và **Middleware** để đồng bộ hóa đơn từ cơ quan thuế.  
> Hệ thống POS **không gọi trực tiếp** lên cổng thuế điện tử mà thông qua một middleware trung gian.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Luồng xử lý](#2-luồng-xử-lý)
3. [POS → Middleware (Outbound APIs)](#3-pos--middleware-outbound-apis)
   - [3.1 Lấy token xác thực](#31-lấy-token-xác-thực)
   - [3.2 Đăng nhập tài khoản thuế](#32-đăng-nhập-tài-khoản-thuế)
   - [3.3 Bắt đầu đồng bộ](#33-bắt-đầu-đồng-bộ)
   - [3.4 Kiểm tra trạng thái đồng bộ](#34-kiểm-tra-trạng-thái-đồng-bộ)
   - [3.5 Hủy tác vụ đang chạy](#35-hủy-tác-vụ-đang-chạy)
   - [3.6 Cấu hình đồng bộ tự động](#36-cấu-hình-đồng-bộ-tự-động)
4. [Middleware → POS (Callback APIs)](#4-middleware--pos-callback-apis)
   - [4.1 Callback kết quả đăng nhập](#41-callback-kết-quả-đăng-nhập)
   - [4.2 Callback danh sách hóa đơn](#42-callback-danh-sách-hóa-đơn)
   - [4.3 Callback chi tiết hóa đơn](#43-callback-chi-tiết-hóa-đơn)
5. [Mã tham chiếu](#5-mã-tham-chiếu)
6. [Xử lý lỗi](#6-xử-lý-lỗi)
7. [Ghi chú nghiệp vụ](#7-ghi-chú-nghiệp-vụ)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────┐          ┌──────────────────┐          ┌──────────────┐
│   POS System    │  ──(1)── │    Middleware     │  ──(2)── │  Cổng Thuế  │
│                 │          │                  │          │  Điện tử    │
│  - Gọi API      │  ←─(3)── │  - Xử lý nền     │          │  (GDT)      │
│  - Nhận callback│          │  - Callback về   │          └──────────────┘
└─────────────────┘          └──────────────────┘
```

**Điểm quan trọng:**
- POS gọi Middleware (đồng bộ — nhận response ngay)
- Middleware gọi Cổng Thuế (bất đồng bộ — nền)
- Middleware callback về POS khi có dữ liệu hóa đơn
- POS **phải expose 3 callback endpoints** để nhận dữ liệu từ Middleware

**Phân loại hóa đơn theo `typeInvoice`:**

| Giá trị | Loại hóa đơn |
|---------|--------------|
| `1000`  | Hóa đơn mua vào (Purchase) |
| `1100`  | Hóa đơn bán ra (Sales) |

---

## 2. Luồng xử lý

### Luồng đồng bộ hóa đơn bán ra (thủ công)

```
Người dùng bấm "Đồng bộ bán ra"
  │
  ├─ [Bước 1] POST /api/integration/gen-token
  │    └─ Nhận: { token: "JWT..." }
  │
  ├─ [Bước 2] POST /api/integration/sync-tax (type=login)
  │    └─ Nhận: { success: true } (kết quả đăng nhập sẽ callback sau)
  │
  ├─ [Bước 3] Middleware callback → POST /api/testApi/integration-login
  │    └─ POS nhận: { loginStatus: "success" }
  │
  ├─ [Bước 4] POST /api/integration/sync-tax (type=syncingsaving, typeInvoice=1100)
  │    └─ Nhận: { taskId: "abc123" } (ngay lập tức)
  │
  ├─ [Bước 5] Middleware xử lý nền (gọi GDT, lấy dữ liệu)
  │
  ├─ [Bước 6] Middleware callback → POST /api/testApi/integration
  │    └─ POS nhận danh sách hóa đơn thô
  │
  └─ [Bước 7] Middleware callback → POST /api/testApi/integration-detail
       └─ POS nhận chi tiết hóa đơn (Base64 ZIP)
       └─ POS giải nén, lưu vào DB với type='sale'
       └─ POS tạo Bill (chứng từ bán hàng)
```

### Giới hạn

- Dữ liệu lịch sử tối đa **31 ngày** tính từ ngày hiện tại
- Chỉ **1 tác vụ đồng bộ** chạy tại một thời điểm trên mỗi tài khoản thuế
- Nếu có tác vụ đang chạy → phải hủy trước khi tạo mới (hoặc chờ hoàn thành)

---

## 3. POS → Middleware (Outbound APIs)

> **Base URL**: Do đội tích hợp cung cấp (cấu hình trong biến môi trường)  
> **Authentication**: Bearer token lấy từ endpoint `gen-token`

### 3.1 Lấy token xác thực

Lấy JWT token để xác thực cho các API tiếp theo.

```
POST /api/integration/gen-token
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Content-Type` | `application/json` |

**Request Body:**

```json
{
  "clientId": "string",       // ID client được cấp
  "clientSecret": "string"    // Secret được cấp
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600         // Thời gian hết hạn (giây)
  }
}
```

**Response lỗi (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Ghi chú:** Token có thời hạn — POS cần lưu cache và refresh khi hết hạn.

---

### 3.2 Đăng nhập tài khoản thuế

Xác thực tài khoản thuế trên cổng GDT thông qua Middleware.  
Kết quả trả về **bất đồng bộ** qua callback `/api/testApi/integration-login`.

```
POST /api/integration/sync-tax
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer {token}` |

**Request Body:**

```json
{
  "type": "login",
  "accountTax": "0123456789",     // Mã số thuế
  "passwordTax": "encrypted_pwd", // Mật khẩu tài khoản thuế (đã mã hóa)
  "callbackUrl": "https://pos.example.com/api/testApi/integration-login"
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Login request accepted"
}
```

**Response lỗi (400) — Tác vụ đang chạy:**

```json
{
  "success": false,
  "code": "TASK_RUNNING",
  "message": "Đang có tác vụ đồng bộ chạy cho tài khoản này",
  "taskId": "current_running_task_id"
}
```

---

### 3.3 Bắt đầu đồng bộ

Khởi động tác vụ đồng bộ hóa đơn. Trả về `taskId` ngay lập tức.  
Dữ liệu hóa đơn thực tế sẽ đến qua callback.

```
POST /api/integration/sync-tax
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer {token}` |

**Request Body:**

```json
{
  "type": "syncingsaving",
  "accountTax": "0123456789",
  "typeInvoice": "1100",           // 1100 = bán ra, 1000 = mua vào
  "fromDate": "2026-04-01",        // Từ ngày (tối đa 31 ngày trước)
  "toDate": "2026-05-01",          // Đến ngày
  "callbackUrl": "https://pos.example.com/api/testApi/integration",
  "callbackDetailUrl": "https://pos.example.com/api/testApi/integration-detail"
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "data": {
    "taskId": "task_abc123xyz",    // ID tác vụ để theo dõi
    "status": "PENDING",
    "message": "Sync task created successfully"
  }
}
```

**Response lỗi (400) — Tác vụ đang chạy:**

```json
{
  "success": false,
  "code": "TASK_ALREADY_RUNNING",
  "message": "Đang có tác vụ đồng bộ cho tài khoản thuế này",
  "data": {
    "runningTaskId": "task_xyz789"
  }
}
```

**Response lỗi (400) — Khoảng thời gian vượt 31 ngày:**

```json
{
  "success": false,
  "code": "DATE_RANGE_EXCEEDED",
  "message": "Khoảng thời gian đồng bộ không được vượt quá 31 ngày"
}
```

---

### 3.4 Kiểm tra trạng thái đồng bộ

Kiểm tra trạng thái của một tác vụ đồng bộ đang chạy.

```
POST /api/task/query?taskId={taskId}
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Authorization` | `Bearer {token}` |

**Query Parameters:**

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `taskId` | string | Có | ID tác vụ cần kiểm tra |

**Response thành công (200):**

```json
{
  "success": true,
  "data": {
    "taskId": "task_abc123xyz",
    "status": "RUNNING",           // PENDING | RUNNING | COMPLETED | FAILED | CANCELLED
    "progress": 45,                // % hoàn thành (0-100)
    "totalInvoices": 120,          // Tổng số hóa đơn tìm thấy
    "processedInvoices": 54,       // Số đã xử lý
    "startedAt": "2026-05-01T10:00:00Z",
    "completedAt": null,           // null nếu chưa hoàn thành
    "error": null
  }
}
```

**Các giá trị `status`:**

| Status | Mô tả |
|--------|-------|
| `PENDING` | Đang chờ xử lý |
| `RUNNING` | Đang chạy |
| `COMPLETED` | Hoàn thành thành công |
| `FAILED` | Thất bại |
| `CANCELLED` | Đã bị hủy |

---

### 3.5 Hủy tác vụ đang chạy

Hủy tác vụ đồng bộ đang chạy của một tài khoản thuế.

```
DELETE /api/task?accountTax={accountTax}
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Authorization` | `Bearer {token}` |

**Query Parameters:**

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `accountTax` | string | Có | Mã số thuế của tài khoản |

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Task cancelled successfully",
  "data": {
    "cancelledTaskId": "task_abc123xyz"
  }
}
```

**Response lỗi (404) — Không có tác vụ đang chạy:**

```json
{
  "success": false,
  "message": "No running task found for this account"
}
```

---

### 3.6 Cấu hình đồng bộ tự động

Cấu hình lịch đồng bộ tự động định kỳ.

```
POST /api/integration/save-auto-syncing
```

**Headers:**

| Header | Giá trị |
|--------|---------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer {token}` |

**Request Body:**

```json
{
  "accountTax": "0123456789",
  "typeInvoice": "1100",          // 1100 = bán ra, 1000 = mua vào
  "enabled": true,                // Bật/tắt đồng bộ tự động
  "scheduleType": "daily",        // daily | weekly
  "scheduleTime": "02:00",        // Giờ chạy (HH:mm)
  "callbackUrl": "https://pos.example.com/api/testApi/integration",
  "callbackDetailUrl": "https://pos.example.com/api/testApi/integration-detail"
}
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Auto sync configuration saved"
}
```

---

## 4. Middleware → POS (Callback APIs)

> POS System **phải implement** các endpoints này để nhận dữ liệu từ Middleware.  
> Middleware gọi các URL này sau khi hoàn thành xử lý.

### 4.1 Callback kết quả đăng nhập

Middleware gọi endpoint này sau khi xác thực xong với cổng thuế.

```
POST /api/testApi/integration-login
```

**Request từ Middleware:**

```json
{
  "accountTax": "0123456789",
  "taskId": "task_abc123xyz",
  "loginStatus": "success",        // success | failed
  "message": "Đăng nhập thành công",
  "timestamp": "2026-05-01T10:00:05Z"
}
```

**Xử lý phía POS:**
- Nếu `loginStatus = "success"` → Tiến hành gọi API đồng bộ (bước 3.3)
- Nếu `loginStatus = "failed"` → Hiển thị lỗi, không tiến hành đồng bộ

**Response POS trả về Middleware (200):**

```json
{
  "received": true
}
```

---

### 4.2 Callback danh sách hóa đơn

Middleware gọi endpoint này gửi danh sách hóa đơn thô.

```
POST /api/testApi/integration
```

**Request từ Middleware:**

```json
{
  "taskId": "task_abc123xyz",
  "accountTax": "0123456789",
  "typeInvoice": "1100",
  "page": 1,
  "totalPages": 5,
  "invoices": [
    {
      "khhdon": "1C25TAA",          // Ký hiệu hóa đơn
      "shdon": "000001234",         // Số hóa đơn
      "ntao": "2026-04-15",         // Ngày tạo
      "nky": "2026-04-15",          // Ngày ký
      "mst": "0123456789",          // Mã số thuế người mua
      "nbmst": "9876543210",        // MST người bán
      "nban": "CÔNG TY ABC",        // Tên người bán
      "nmua": "CÔNG TY XYZ",        // Tên người mua (khách hàng)
      "tgtcthue": 1000000,          // Tổng giá trị chưa thuế
      "tgtthue": 100000,            // Tổng tiền thuế
      "tgtttbso": 1100000,          // Tổng tiền thanh toán
      "tthai": "01",                // Trạng thái hóa đơn
      "hdtrung": "HD_UNIQUE_KEY",   // Key nhận dạng hóa đơn trùng
      "isHDTrung": false            // true nếu là hóa đơn trùng lặp
    }
  ],
  "timestamp": "2026-05-01T10:00:30Z"
}
```

**Xử lý phía POS:**
- Nếu `isHDTrung = true` → Bỏ qua, không lưu (hóa đơn đã tồn tại)
- Nếu `isHDTrung = false` → Lưu vào bảng `invoice_tax` với `type='sale'`
- Dùng `hdtrung` làm key kiểm tra trùng lặp trong DB

**Response POS trả về Middleware (200):**

```json
{
  "received": true,
  "processedCount": 10
}
```

---

### 4.3 Callback chi tiết hóa đơn

Middleware gọi endpoint này gửi chi tiết hóa đơn dạng nén (Base64 ZIP).

```
POST /api/testApi/integration-detail
```

**Request từ Middleware:**

```json
{
  "taskId": "task_abc123xyz",
  "accountTax": "0123456789",
  "typeInvoice": "1100",
  "khhdon": "1C25TAA",             // Ký hiệu hóa đơn
  "shdon": "000001234",            // Số hóa đơn
  "hdtrung": "HD_UNIQUE_KEY",
  "isHDTrung": false,
  "detailData": "UEsDBBQAAAAAA...", // Base64 encoded ZIP chứa XML chi tiết
  "timestamp": "2026-05-01T10:00:32Z"
}
```

**Cấu trúc ZIP sau khi giải nén:**

```
invoice_detail.zip
└── invoice_1C25TAA_000001234.xml   ← File XML chi tiết hóa đơn
```

**Cấu trúc XML chi tiết (các trường quan trọng):**

```xml
<HDon>
  <DLHDon>
    <TTChung>
      <KHHDon>1C25TAA</KHHDon>       <!-- Ký hiệu mẫu hóa đơn -->
      <SHDon>000001234</SHDon>        <!-- Số hóa đơn -->
      <NLap>2026-04-15</NLap>         <!-- Ngày lập -->
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>CÔNG TY ABC</Ten>        <!-- Tên người bán -->
        <MST>9876543210</MST>         <!-- MST người bán -->
      </NBan>
      <NMua>
        <Ten>CÔNG TY XYZ</Ten>        <!-- Tên người mua -->
        <MST>0123456789</MST>         <!-- MST người mua -->
        <DChi>123 Đường ABC</DChi>    <!-- Địa chỉ -->
      </NMua>
      <DSHHDVu>
        <HHDVu>                       <!-- Hàng hóa/dịch vụ (lặp lại) -->
          <TChat>1</TChat>
          <STT>1</STT>
          <Ten>Sản phẩm A</Ten>       <!-- Tên sản phẩm -->
          <DVTinh>Cái</DVTinh>        <!-- Đơn vị tính -->
          <SLuong>2</SLuong>          <!-- Số lượng -->
          <DGia>500000</DGia>         <!-- Đơn giá -->
          <ThTien>1000000</ThTien>    <!-- Thành tiền -->
          <TSuat>10%</TSuat>          <!-- Thuế suất -->
          <TThue>100000</TThue>       <!-- Tiền thuế -->
        </HHDVu>
      </DSHHDVu>
      <TToan>
        <TgTCThue>1000000</TgTCThue>  <!-- Tổng chưa thuế -->
        <TgTThue>100000</TgTThue>     <!-- Tổng thuế -->
        <TgTTTBSo>1100000</TgTTTBSo> <!-- Tổng thanh toán (số) -->
      </TToan>
    </NDHDon>
  </DLHDon>
</HDon>
```

**Xử lý phía POS:**

```
1. Nhận request
2. Kiểm tra isHDTrung → nếu true, bỏ qua
3. Base64 decode → nhận binary ZIP
4. Giải nén ZIP → nhận file XML
5. Parse XML → trích xuất dữ liệu
6. Lưu header hóa đơn vào invoice_tax (type='sale')
7. Lưu từng dòng sản phẩm vào invoice_product_tax
8. Ghép sản phẩm: tìm trong invoice_product_mapping theo tên
9. Ghép khách hàng: tìm theo tên người mua → để trống nếu không tìm thấy
10. Tạo Bill (chứng từ bán hàng) với trạng thái chờ xác nhận
```

**Response POS trả về Middleware (200):**

```json
{
  "received": true,
  "invoiceId": "INV_2026_001234"   // ID hóa đơn đã lưu trong POS
}
```

---

## 5. Mã tham chiếu

### typeInvoice

| Mã | Loại |
|----|------|
| `1000` | Hóa đơn mua vào (Purchase Invoice) |
| `1100` | Hóa đơn bán ra (Sales Invoice) |

### Trạng thái hóa đơn (`tthai`)

| Mã | Mô tả |
|----|-------|
| `01` | Hóa đơn hợp lệ |
| `02` | Hóa đơn đã hủy |
| `03` | Hóa đơn điều chỉnh |
| `04` | Hóa đơn thay thế |

### Trạng thái tác vụ (`status`)

| Mã | Mô tả |
|----|-------|
| `PENDING` | Đang chờ |
| `RUNNING` | Đang chạy |
| `COMPLETED` | Hoàn thành |
| `FAILED` | Thất bại |
| `CANCELLED` | Đã hủy |

### type trong DB

| Giá trị | Bảng | Mô tả |
|---------|------|-------|
| `purchase` | `invoice_tax`, `invoice_tax_sync_history`, `invoice_product_mapping` | Hóa đơn mua vào |
| `sale` | `invoice_tax`, `invoice_tax_sync_history`, `invoice_product_mapping` | Hóa đơn bán ra |

---

## 6. Xử lý lỗi

### Các lỗi phổ biến

| HTTP Code | Mã lỗi | Nguyên nhân | Xử lý |
|-----------|--------|-------------|-------|
| `400` | `TASK_ALREADY_RUNNING` | Có tác vụ đồng bộ đang chạy | Hỏi người dùng: hủy tác vụ cũ hay chờ |
| `400` | `DATE_RANGE_EXCEEDED` | Khoảng ngày > 31 ngày | Giới hạn lại ngày |
| `401` | `UNAUTHORIZED` | Token hết hạn hoặc sai | Gọi lại gen-token |
| `404` | `ACCOUNT_NOT_FOUND` | Tài khoản thuế không tồn tại | Kiểm tra lại cấu hình |
| `500` | `MIDDLEWARE_ERROR` | Lỗi nội bộ middleware | Thử lại sau, liên hệ hỗ trợ |

### Retry policy

```
Lần 1: Gọi API
  └── Lỗi 5xx → Chờ 2s → Lần 2
       └── Lỗi 5xx → Chờ 5s → Lần 3
            └── Lỗi 5xx → Báo lỗi người dùng
```

### Xử lý timeout callback

Nếu sau **30 phút** không nhận được callback:
- POS gọi API kiểm tra trạng thái (endpoint 3.4)
- Nếu tác vụ vẫn `RUNNING` → hiển thị cảnh báo
- Nếu tác vụ `FAILED` → hiển thị lỗi, cho phép thử lại

---

## 7. Ghi chú nghiệp vụ

### Phát hiện hóa đơn trùng

- Dùng trường `hdtrung` từ middleware làm **unique key**
- Nếu `isHDTrung = true` → middleware đã phát hiện là trùng → **bỏ qua hoàn toàn**
- Nếu `isHDTrung = false` → lưu vào DB, dùng `hdtrung` làm index để tránh insert 2 lần

### Ghép sản phẩm

- So khớp **chính xác theo tên** (`Ten` trong XML ↔ tên sản phẩm trong POS)
- Không ghép được → để trống `product_id`, người dùng tự chọn sau
- **Không blocking**: hóa đơn vẫn được lưu dù không ghép được sản phẩm

### Ghép khách hàng

- So khớp **chính xác theo tên** (`NMua.Ten` trong XML ↔ tên khách hàng trong POS)
- Không ghép được → `customer_id = null`, người dùng tự chọn khi tạo Bill
- **Không blocking**: Bill vẫn được tạo với trạng thái chờ xử lý

### Tài khoản thuế (`tax_account`)

- Dùng **chung bảng** `tax_account` với hóa đơn mua vào
- Một tài khoản thuế có thể đồng bộ cả hai loại hóa đơn
- Xác thực (đăng nhập) chỉ cần thực hiện **1 lần** cho mỗi phiên đồng bộ

### Cơ sở dữ liệu — các bảng ảnh hưởng

| Bảng | Thay đổi | Ghi chú |
|------|----------|---------|
| `invoice_tax` | Thêm cột `type VARCHAR(10) DEFAULT 'purchase'` | Phân biệt mua vào/bán ra |
| `invoice_product_tax` | Không thay đổi | Liên kết qua `invoice_tax_id` |
| `invoice_tax_sync_history` | Thêm cột `type VARCHAR(10)` | Lịch sử theo loại hóa đơn |
| `invoice_product_mapping` | Thêm cột `type VARCHAR(10)` | Mapping theo loại hóa đơn |
| `tax_account` | Không thay đổi | Dùng chung |

---

*Tài liệu này được tạo cho nghiệp vụ: **Đồng bộ hóa đơn bán ra từ cổng thuế để lập chứng từ bán hàng (Bill)***  
*Phiên bản: 1.0 — Ngày: 2026-05-19*
