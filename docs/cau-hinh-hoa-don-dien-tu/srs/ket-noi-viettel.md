---
type: srs
feature: cau-hinh-hoa-don-dien-tu
status: draft
lang: vi
owner: "@huelinh"
version: 1.0
created: 2026-08-07
updated: 2026-08-07
links: [docs/cau-hinh-hoa-don-dien-tu/srs/spec.md, docs/Cấu hình/hoa-don-dien-tu.html]
tags: [hoa-don-dien-tu, ket-noi, viettel, vte, tich-hop-api]
stale_reason: ""
changelog:
  - 2026-08-07 | /srs | chốt response API đăng nhập: có refresh_token, expires_in 1199s, thân phản hồi không có session_token
  - 2026-08-07 | /srs | chốt OQ-3: VTE dùng 1 địa chỉ mặc định api-vinvoice.viettel.vn, không có môi trường test riêng
  - 2026-08-07 | /srs | initial draft — kết nối HĐĐT Viettel VTE, 2 bước gọi API + đặc tả kỹ thuật tích hợp
---

# SRS — Kết nối hệ thống hóa đơn điện tử Viettel (VTE)

**Mã tài liệu:** SRS-HDDT-002
**Phiên bản:** 1.0
**Ngày tạo:** 07/08/2026
**Người soạn:** Dương Thị Huệ Linh
**Trạng thái:** Draft
**Tài liệu liên quan:** [SRS-HDDT-001 — Tách bước đăng nhập khỏi cấu hình thông tin hóa đơn](spec.md)

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|---------|----------------|---------|
| 07/08/2026 | Toàn bộ | A | Cải tiến hệ thống | Dương Thị Huệ Linh | Tạo mới tài liệu | |

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
   - 3.1 Kết nối tài khoản Viettel (VTE)
   - 3.2 Cấu hình thông tin hóa đơn cho tài khoản Viettel
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Đặc tả kỹ thuật tích hợp
   - 5.1 Thông tin chung
   - 5.2 API 1 — Đăng nhập / xác thực tài khoản
   - 5.3 API 2 — Lấy danh sách mẫu số, ký hiệu
   - 5.4 Quản lý phiên và token
   - 5.5 Ánh xạ dữ liệu API sang màn hình và CSDL
   - 5.6 Xử lý lỗi
   - 5.7 Biểu đồ tuần tự
   - 5.8 Yêu cầu phi chức năng kỹ thuật
6. Open questions

---

## 1. NGUỒN GỐC THAY ĐỔI

Cải tiến nội bộ, mở rộng phạm vi của [SRS-HDDT-001](spec.md) sang nhà cung cấp **Viettel - VTE** (hệ thống vInvoice). Viettel khác các nhà cung cấp còn lại ở ba điểm: **không cho người dùng nhập đường dẫn** (địa chỉ hệ thống cố định), **tài khoản đăng nhập chính là mã số thuế**, và **mẫu số / ký hiệu lấy về qua một lời gọi riêng** sau khi đăng nhập. Tài liệu này đặc tả phần kết nối và cấu hình dành riêng cho VTE.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

- Bổ sung **Viettel - VTE** vào danh mục *Hệ thống hóa đơn điện tử* tại màn **Cài đặt > Hóa đơn > Hóa đơn điện tử**.
- Chọn VTE thì **ẩn ô Đường dẫn** — hệ thống dùng một địa chỉ mặc định duy nhất `https://api-vinvoice.viettel.vn`, người dùng chỉ nhập **Tài khoản** và **Mật khẩu**.
- Bấm đăng nhập, hệ thống **gọi sang Viettel xác thực ngay**; sai thì báo lỗi và không lưu gì, đúng thì lưu phiên rồi **gọi tiếp lần thứ hai lấy toàn bộ mẫu số + ký hiệu** của chính tài khoản đó.
- Phần cấu hình thông tin hóa đơn bổ sung **2 trường mới**: *Chọn ký hiệu* và *Giá trị phần trăm thuế GTGT*.
- **Loại hình hóa đơn** vẫn tự suy ra từ mẫu số, người dùng không chọn tay (kế thừa BR-hddt-007).

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Người dùng vào **Cài đặt > Hóa đơn > Hóa đơn điện tử**.
2. Chọn hệ thống HĐĐT, nhập một lượt **đường dẫn**, **tài khoản**, **mật khẩu**, **loại hình hóa đơn**, **loại hình phát hành**.
3. Nhấn **Cập nhật** — đến lúc này hệ thống mới gửi thông tin sang hệ thống HĐĐT xác thực; sai thì báo lỗi, người dùng nhập lại.
4. Xác thực thành công: màn hình đổ danh sách mẫu số để chọn; chọn xong hệ thống tự ghi đè loại hình hóa đơn theo mẫu số.
5. Nhấn **Cập nhật** lần nữa để lưu cấu hình.
6. Không có ô **Ký hiệu** và ô **Giá trị phần trăm thuế GTGT** — hai thông tin này chưa được cấu hình ở màn này.

**Luồng mới (To-Be):**

1. Người dùng vào **Cài đặt > Hóa đơn > Hóa đơn điện tử**. Cửa hàng đã liên kết thì hiện luôn trạng thái đã đăng nhập kèm phần cấu hình thông tin hóa đơn; chưa liên kết thì hiện form trống.
2. Chọn **Hệ thống hóa đơn điện tử = Viettel - VTE**. Hệ thống **ẩn ô Đường dẫn**, chỉ còn **Tài khoản** và **Mật khẩu**, kèm dòng hướng dẫn *"Bạn vui lòng nhập thông tin tài khoản và mật khẩu để đăng nhập hệ thống hóa đơn điện tử. Hệ thống này kết nối đẩy dữ liệu lên Tổng cục thuế"*.
3. Nhập **Tài khoản** (mã số thuế cửa hàng, vd `0100109106-990`) và **Mật khẩu**, nhấn **Đăng nhập**.
4. Hệ thống **gọi Viettel xác thực tài khoản** (API 1 — Mục 5.2). Sai tài khoản/mật khẩu hoặc Viettel không phản hồi: hiện nhãn đỏ **Đăng nhập thất bại** kèm thông báo do Viettel trả về, **không lưu** gì, không hiện phần cấu hình thông tin hóa đơn.
5. Xác thực thành công: hệ thống lưu tài khoản, mật khẩu và **phiên đăng nhập** (vé vào cửa gần 20 phút + vé làm mới), hiện nhãn xanh **Đăng nhập thành công**, khóa ô nhập, đổi nút thành **Sửa / Xóa liên kết / Cập nhật**.
6. Ngay sau đó hệ thống **gọi Viettel lần thứ hai lấy toàn bộ mẫu số và ký hiệu** của tài khoản vừa đăng nhập (API 2 — Mục 5.3), đổ vào hai ô chọn ở phần cấu hình thông tin hóa đơn.
7. Người dùng chọn **Mẫu số** — hệ thống lọc danh sách **Ký hiệu** thuộc mẫu số đó và **tự điền Loại hình hóa đơn** tương ứng (chỉ đọc). Chọn tiếp **Ký hiệu**.
8. Nếu loại hình hóa đơn là **Hóa đơn GTGT một thuế**, hệ thống hiện thêm ô **Giá trị phần trăm thuế GTGT** bắt buộc chọn (vd *Thuế suất 5%*). Loại hình khác thì ô này ẩn.
9. Chọn **Loại hình phát hành hóa đơn** (vd *HSM - Phát hành thủ công*).
10. Nhấn **Cập nhật**: thiếu trường bắt buộc nào thì báo lỗi đỏ dưới ô đó; đủ thì lưu cấu hình, hiện thông báo thành công và cửa hàng phát hành hóa đơn bình thường.

**Khác biệt chính:** As-Is xác thực trễ ở bước bấm Cập nhật và chỉ có mẫu số; To-Be xác thực ngay khi bấm Đăng nhập bằng **hai lời gọi nối tiếp** sang Viettel (xác thực rồi mới lấy mẫu số), đồng thời bổ sung **ký hiệu** và **thuế suất GTGT** vào cấu hình.

**Hình luồng:**

```
   Cài đặt > Hóa đơn > Hóa đơn điện tử
                  │
                  ▼
      Chọn hệ thống HĐĐT = Viettel - VTE
                  │  (ẩn ô Đường dẫn)
                  ▼
   ┌──────────────────────────────────┐
   │ Nhập Tài khoản (MST) + Mật khẩu  │
   └───────────────┬──────────────────┘
                   │ [Đăng nhập]
                   ▼
   ┌──────────────────────────────────┐
   │ API 1: Xác thực tài khoản Viettel│
   └───────────────┬──────────────────┘
                   ▼
           ┌───────────────┐  sai / không phản hồi
           │ Xác thực OK?  ├─────────────────┐
           └───────┬───────┘                 ▼
                   │ OK            Nhãn đỏ "Đăng nhập thất
                   ▼                bại" + thông báo Viettel
   ┌──────────────────────────────────┐  → ở lại, không lưu
   │ • Lưu tài khoản + mật khẩu       │
   │ • Lưu phiên (vé vào cửa ~20 phút │
   │   + vé làm mới)                  │
   │ • Nhãn xanh, khóa ô nhập         │
   └───────────────┬──────────────────┘
                   ▼
   ┌──────────────────────────────────┐  lỗi
   │ API 2: Lấy mẫu số + ký hiệu      ├──────► Cảnh báo "Không lấy
   └───────────────┬──────────────────┘        được danh sách mẫu
                   ▼ OK                        số" + nút Thử lại
   ┌──────────────────────────────────┐
   │ CẤU HÌNH THÔNG TIN HÓA ĐƠN       │
   │  • Mã CQT cấp (chỉ đọc)          │
   │  • Chọn mẫu số (*) ───┐          │
   │  • Chọn ký hiệu (*) ◄─┘ lọc theo │
   │  • Loại hình hóa đơn ◄─ tự nhảy  │
   │  • Giá trị % thuế GTGT (*)       │
   │      (chỉ khi GTGT một thuế)     │
   │  • Loại hình phát hành HĐ (*)    │
   └───────────────┬──────────────────┘
                   │ [Cập nhật]
                   ▼
         ┌──────────────────┐  thiếu
         │ Đủ trường bắt    ├────────► Lỗi đỏ dưới ô
         │ buộc?            │          (ở lại màn hình)
         └────────┬─────────┘
                  ▼ đủ
   ┌──────────────────────────────────┐
   │ Lưu cấu hình + thông báo thành   │
   │ công → Bán hàng phát hành HĐ     │
   └──────────────────────────────────┘
```

### 2.3 Yêu cầu người dùng

| Story ID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-005 | Chủ cửa hàng / kế toán | Kết nối cửa hàng với hệ thống hóa đơn Viettel bằng tài khoản Viettel cấp | Phát hành hóa đơn điện tử qua Viettel | Cao |
| US-006 | Chủ cửa hàng / kế toán | Không phải nhập đường dẫn khi chọn Viettel | Không biết địa chỉ kỹ thuật, dễ nhập sai | Cao |
| US-007 | Chủ cửa hàng / kế toán | Chọn mẫu số rồi chọn ký hiệu tương ứng của mẫu số đó | Phát hành đúng dải hóa đơn đã đăng ký với cơ quan thuế | Cao |
| US-008 | Chủ cửa hàng / kế toán | Chọn sẵn thuế suất GTGT khi dùng hóa đơn GTGT một thuế | Không phải chọn lại thuế suất mỗi lần bán hàng | Trung bình |
| US-009 | Chủ cửa hàng / kế toán | Lấy lại danh sách mẫu số khi Viettel cấp thêm dải mới | Không phải xóa liên kết rồi đăng nhập lại | Trung bình |

### 2.4 Ngữ cảnh người dùng

Người thao tác là **chủ cửa hàng hoặc kế toán**, làm trên máy tính tại quầy, chỉ vào màn này khi **khởi tạo cửa hàng**, khi **đổi nhà cung cấp HĐĐT sang Viettel**, hoặc khi **Viettel cấp thêm dải hóa đơn mới**. Tần suất thấp nhưng bắt buộc đúng — cấu hình sai thì không phát hành được hóa đơn cho khách. Người dùng không có kiến thức kỹ thuật, trong tay chỉ có **tài khoản và mật khẩu do Viettel cấp**.

### 2.5 Mô tả thay đổi về CSDL

Không phát sinh bảng mới. Dùng lại bảng `config` (key–value theo `company_id` / `shop_id`), bổ sung khóa cho ký hiệu và thuế suất.

| Loại thay đổi | Bảng | Khóa (`code`) | Mô tả |
|:---:|---|---|---|
| M | `config` | `einvoice_provider` | Nhà cung cấp HĐĐT đang dùng; giá trị mới **`VTE`** cho Viettel |
| M | `config` | `easyinvoice_url` | Với VTE hệ thống **tự ghi địa chỉ mặc định `https://api-vinvoice.viettel.vn`**, không nhận giá trị người dùng nhập |
| M | `config` | `easyinvoice_account`, `easyinvoice_password` | Tài khoản (mã số thuế) và mật khẩu Viettel — ghi khi đăng nhập thành công. Mật khẩu lưu ở dạng mã hóa hai chiều (BR-vte-009) |
| M | `config` | `tax_machine_code` | Mã CQT cấp — nguồn lấy cho VTE chờ xác nhận (OQ-4) |
| M | `config` | `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_method` | Mẫu số, mã mẫu số, loại hình hóa đơn, loại hình phát hành — ghi khi bấm **Cập nhật** |
| **A** | `config` | `invoice_serial` | **Mới** — ký hiệu hóa đơn người dùng chọn (vd `C25MQA`) |
| **A** | `config` | `invoice_vat_rate` | **Mới** — giá trị phần trăm thuế GTGT, chỉ ghi khi loại hình là hóa đơn GTGT một thuế (vd `5`) |
| — | (bộ nhớ tạm) | `vte_access_token`, `vte_refresh_token` | Vé vào cửa và vé làm mới của Viettel, **không lưu trong `config`** — giữ ở bộ nhớ tạm phía máy chủ theo cửa hàng (BR-vte-008) |

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Kết nối tài khoản Viettel (VTE) | Nhập tài khoản, mật khẩu và xác thực với hệ thống Viettel | Cao |
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Lấy danh sách mẫu số, ký hiệu | Hệ thống tự lấy sau khi đăng nhập; có thao tác lấy lại thủ công | Cao |
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Cấu hình thông tin hóa đơn cho VTE | Chọn mẫu số, ký hiệu, thuế suất GTGT, loại hình phát hành | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Kết nối tài khoản Viettel (VTE)

#### 3.1.1 Thông tin chung về chức năng

Cho phép liên kết cửa hàng với hệ thống hóa đơn điện tử Viettel bằng tài khoản Viettel cấp. Đây là **điều kiện bắt buộc** để mở phần cấu hình thông tin hóa đơn. Khác các nhà cung cấp khác, người dùng **không nhập đường dẫn** — hệ thống dùng địa chỉ cố định của Viettel.

#### 3.1.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Hệ thống hóa đơn điện tử (*) | Dropdown | Theo cấu hình đang lưu | Có | Danh mục nhà cung cấp; bổ sung giá trị **Viettel - VTE** |
| 2 | Tài khoản (*) | Textbox | Trống | Có | Tài khoản Viettel cấp, dạng mã số thuế hoặc mã số thuế kèm mã đơn vị phụ thuộc (vd `0100109106-990`) |
| 3 | Mật khẩu (*) | Textbox (password) + icon hiện/ẩn | Trống | Có | Mật khẩu tài khoản Viettel |
| 4 | Dòng hướng dẫn | Label | Hiện thường trực | – | *"Bạn vui lòng nhập thông tin tài khoản và mật khẩu để đăng nhập hệ thống hóa đơn điện tử. Hệ thống này kết nối đẩy dữ liệu lên Tổng cục thuế"* — cụm **Tổng cục thuế** là liên kết ngoài |
| 5 | Nhãn trạng thái | Label | Ẩn | Không | Nhãn xanh **Đăng nhập thành công** / nhãn đỏ **Đăng nhập thất bại** |
| 6 | Nút **Đăng nhập** | Button | Hiện khi chưa liên kết | – | Gửi tài khoản, mật khẩu sang Viettel xác thực |
| 7 | Nút **Sửa** / **Xóa liên kết** / **Cập nhật** | Button | Hiện khi đã liên kết | – | **Sửa**: mở lại ô nhập. **Xóa liên kết**: hủy liên kết. **Cập nhật**: lưu lại thông tin |

> Ô **Đường dẫn** và nút **Cập nhật đường dẫn** của các nhà cung cấp khác **không hiển thị** khi chọn VTE (BR-vte-001).

**Trạng thái màn hình:**

| Tình huống | Phần kết nối | Phần cấu hình thông tin hóa đơn |
|---|---|---|
| Chưa đăng nhập | Ô nhập mở, nút **Đăng nhập** | Ẩn |
| Đang gọi Viettel | Nút **Đăng nhập** ở trạng thái chờ, khóa thao tác | Ẩn |
| Đăng nhập thành công | Ô nhập khóa, nhãn xanh, nút **Sửa / Xóa liên kết / Cập nhật** | Hiện, đã đổ danh sách mẫu số + ký hiệu |
| Đăng nhập thành công nhưng lấy mẫu số lỗi | Ô nhập khóa, nhãn xanh | Hiện nhưng danh sách rỗng + cảnh báo và nút **Thử lại** |
| Đổi sang tài khoản khác, đăng nhập lại thành công | Nhãn xanh, tài khoản mới | **Xóa trắng**, chọn lại từ đầu (BR-vte-006) |
| **Xóa liên kết** (sau xác nhận) | Về trạng thái chưa đăng nhập | Ẩn + xóa dữ liệu |

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Liên kết cửa hàng với hệ thống hóa đơn điện tử Viettel để mở chức năng cấu hình và phát hành hóa đơn |
| **Tác nhân** | Chủ cửa hàng / kế toán; tác nhân phụ: hệ thống hóa đơn điện tử Viettel (vInvoice) |
| **Điều kiện kích hoạt** | Người dùng nhấn nút **Đăng nhập** |
| **Điều kiện tiên quyết** | Đã đăng nhập EPOS, có quyền vào màn cấu hình, đã chọn hệ thống HĐĐT là **Viettel - VTE** |
| **Điều kiện sau khi thực hiện** | Tài khoản, mật khẩu được lưu vào `config`; phiên Viettel được giữ ở bộ nhớ tạm; danh sách mẫu số + ký hiệu đã sẵn sàng ở phần cấu hình |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn **Cài đặt > Hóa đơn > Hóa đơn điện tử** | Đọc `config` theo cửa hàng hiện tại. Có đủ tài khoản + mật khẩu và `einvoice_provider = VTE` thì hiển thị trạng thái **đã liên kết**; chưa có thì hiện form trống |
| 2 | Chọn **Hệ thống hóa đơn điện tử = Viettel - VTE** | Ẩn ô **Đường dẫn** và nút **Cập nhật đường dẫn**; giữ lại ô **Tài khoản**, **Mật khẩu**; hiện dòng hướng dẫn |
| 3 | Nhập **Tài khoản** và **Mật khẩu** | Kiểm tra hai trường không được để trống (BR-vte-002) |
| 4 | Nhấn **Đăng nhập** | Gọi **API 1 — đăng nhập Viettel** (Mục 5.2) với tài khoản, mật khẩu vừa nhập. Khóa nút, hiện trạng thái chờ, **chờ phản hồi rồi mới xử lý tiếp** |
| 5 | (Hệ thống tự động) | API 1 trả về **thành công**: lưu `easyinvoice_account`, `easyinvoice_password`, `einvoice_provider = VTE` vào `config`; giữ **vé vào cửa** và **vé phiên** ở bộ nhớ tạm theo cửa hàng; hiện nhãn xanh **Đăng nhập thành công**; khóa ô nhập; đổi nút thành **Sửa / Xóa liên kết / Cập nhật** |
| 6 | (Hệ thống tự động) | API 1 trả về **lỗi** (sai tài khoản, sai mật khẩu, tài khoản bị khóa, Viettel không phản hồi): hiện nhãn đỏ **Đăng nhập thất bại** kèm đúng thông báo Viettel trả về; **không** ghi `config`; **không** gọi API 2; giữ nguyên cấu hình cũ nếu trước đó đã có |
| 7 | (Hệ thống tự động, ngay sau bước 5) | Gọi **API 2 — lấy danh sách mẫu số** (Mục 5.3) với mã số thuế của chính tài khoản vừa đăng nhập. Thành công: đổ danh sách vào ô **Chọn mẫu số** và **Chọn ký hiệu**, hiện phần cấu hình thông tin hóa đơn. Lỗi: vẫn giữ trạng thái đã đăng nhập, hiện phần cấu hình với danh sách rỗng kèm cảnh báo **"Không lấy được danh sách mẫu số từ Viettel"** và nút **Thử lại** (BR-vte-004) |
| 8 | Nhấn **Sửa**, đổi tài khoản rồi nhấn **Đăng nhập** lại | Gọi lại API 1 với tài khoản mới. Thành công thì ghi đè thông tin đăng nhập, hủy phiên cũ, gọi lại API 2 và **xóa trắng** `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_serial`, `invoice_vat_rate`, `invoice_method`; phần cấu hình hiển thị rỗng để chọn lại (BR-vte-006) |
| 9 | Nhấn **Xóa liên kết** | Hiện hộp xác nhận: *"Xóa liên kết hệ thống hóa đơn điện tử? Thông tin đăng nhập và toàn bộ cấu hình mẫu số, ký hiệu, loại hình hóa đơn sẽ bị xóa. Cửa hàng sẽ không phát hành được hóa đơn cho tới khi đăng nhập và cấu hình lại."* — nút **Hủy** / **Xóa liên kết** |
| 10 | Xác nhận xóa | Xóa toàn bộ khóa cấu hình HĐĐT trong `config`, hủy phiên Viettel ở bộ nhớ tạm, ẩn phần cấu hình, đưa về trạng thái chưa đăng nhập, hiện thông báo **"Đã xóa liên kết hệ thống hóa đơn điện tử"** |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Bỏ trống tài khoản hoặc mật khẩu | Lỗi đỏ dưới ô tương ứng | Dừng, không gọi Viettel |
| Sai tài khoản hoặc mật khẩu | Theo thông báo Viettel trả về, vd *"Tên đăng nhập hoặc mật khẩu không đúng"* | Nhãn đỏ **Đăng nhập thất bại**, không ghi `config` |
| Tài khoản bị khóa hoặc hết hạn dịch vụ | Theo thông báo Viettel trả về | Nhãn đỏ **Đăng nhập thất bại**, không ghi `config` |
| Viettel không phản hồi trong 30 giây | "Hệ thống hóa đơn điện tử Viettel không phản hồi. Vui lòng thử lại sau." | Hủy lời gọi, nhãn đỏ, không ghi `config` |
| Không có kết nối mạng | "Không kết nối được tới hệ thống hóa đơn điện tử. Vui lòng kiểm tra đường truyền." | Nhãn đỏ, không ghi `config` |
| Đăng nhập OK nhưng lấy mẫu số lỗi | "Không lấy được danh sách mẫu số từ Viettel. Vui lòng thử lại." | Giữ trạng thái đã đăng nhập, hiện nút **Thử lại** |
| Người dùng bấm **Hủy** ở hộp xác nhận xóa liên kết | – | Đóng hộp thoại, giữ nguyên liên kết |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-vte-001 | Chọn **Viettel - VTE** thì ô **Đường dẫn** và nút **Cập nhật đường dẫn** không hiển thị; hệ thống dùng địa chỉ mặc định duy nhất `https://api-vinvoice.viettel.vn` (Mục 5.1) và tự ghi vào `easyinvoice_url`. Người dùng không nhập, không sửa, không có nghiệp vụ đổi đường dẫn với VTE |
| BR-vte-002 | Tài khoản và mật khẩu là bắt buộc; thiếu một trong hai thì nút **Đăng nhập** không gọi sang Viettel |
| BR-vte-003 | Chỉ khi API 1 trả về thành công, hệ thống mới lưu thông tin đăng nhập và mở phần cấu hình thông tin hóa đơn |
| BR-vte-004 | API 2 lỗi **không** làm hỏng kết quả đăng nhập — trạng thái liên kết vẫn giữ, người dùng lấy lại danh sách bằng nút **Thử lại** |
| BR-vte-005 | Mã số thuế gửi sang API 2 lấy từ **chính tài khoản vừa đăng nhập**, không cho người dùng nhập tay (quy tắc tách mã số thuế xem OQ-1) |
| BR-vte-006 | Đăng nhập thành công bằng **tài khoản khác** tài khoản đang lưu thì toàn bộ cấu hình thông tin hóa đơn bị xóa trắng, người dùng phải chọn lại |
| BR-vte-007 | Phiên liên kết được lưu vĩnh viễn ở góc nhìn người dùng: lần sau vào màn hình hiện luôn trạng thái đã liên kết, không bắt đăng nhập lại (hệ thống tự lấy vé mới ở nền — BR-vte-008) |
| BR-vte-008 | Vé Viettel có hạn (Mục 5.4); hết hạn thì hệ thống **tự làm mới vé** bằng vé làm mới, không được nữa thì **tự đăng nhập lại một lần** bằng tài khoản, mật khẩu đã lưu, cả hai đều hỏng mới báo lỗi cho người dùng |
| BR-vte-009 | Mật khẩu Viettel lưu ở dạng mã hóa hai chiều, không hiển thị lại dạng rõ trên màn hình và không ghi vào log |
| BR-vte-010 | **Xóa liên kết** xóa cả thông tin đăng nhập lẫn cấu hình thông tin hóa đơn, đồng thời hủy phiên Viettel đang giữ |

---

### 3.2 Cấu hình thông tin hóa đơn cho tài khoản Viettel

#### 3.2.1 Thông tin chung về chức năng

Cho người dùng chọn **mẫu số**, **ký hiệu**, **thuế suất GTGT** và **loại hình phát hành** sau khi đã kết nối tài khoản Viettel. Danh sách mẫu số và ký hiệu do Viettel trả về theo tài khoản; loại hình hóa đơn tự suy ra từ mẫu số. Cấu hình xong thì cửa hàng phát hành hóa đơn bình thường.

#### 3.2.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Mã CQT cấp + nút **Lấy lại mã** (↺) | Label + icon | Giá trị lấy được sau khi đăng nhập | Không (chỉ đọc) | Người dùng không nhập tay. Nguồn lấy cho VTE xem OQ-4 |
| 2 | Chọn ký hiệu (*) | Dropdown | Trống | Có | Ký hiệu hóa đơn của tài khoản Viettel, vd `C25MQA`. Danh sách lọc theo mẫu số đang chọn (BR-vte-012) |
| 3 | Chọn mẫu số (*) | Dropdown | Trống | Có | Mẫu số hóa đơn của tài khoản Viettel, vd `5/0011`. Nguồn: API 2 |
| 4 | Loại hình hóa đơn (*) | Dropdown (chỉ đọc) | Trống, tự điền sau khi chọn mẫu số | Có (hệ thống tự điền) | Suy ra từ mẫu số (BR-vte-013), người dùng không sửa. Vd *Hóa đơn GTGT một thuế* |
| 5 | Giá trị phần trăm thuế GTGT (*) | Dropdown | Trống | Có, **chỉ khi** loại hình là hóa đơn GTGT một thuế | Danh mục thuế suất hệ thống đang có (vd 0%, 5%, 8%, 10%, không chịu thuế). Loại hình khác thì ô này ẩn (BR-vte-014) |
| 6 | Loại hình phát hành hóa đơn (*) | Dropdown | Trống | Có | Danh mục có sẵn, vd *HSM - Phát hành thủ công* |
| 7 | Nút **Sửa** / **Cập nhật** | Button | – | – | **Sửa**: mở lại các ô chọn. **Cập nhật**: lưu cấu hình |

> Thứ tự hiển thị trên màn hình theo ảnh thiết kế: *Chọn ký hiệu* nằm bên trái, *Chọn mẫu số* nằm bên phải. Về nghiệp vụ, **mẫu số là trường quyết định** — chọn mẫu số trước rồi mới lọc ký hiệu (xem OQ-2 về việc nhãn hai ô có đang bị đảo).

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Chốt mẫu số, ký hiệu, thuế suất và loại hình phát hành để cửa hàng phát hành được hóa đơn điện tử qua Viettel |
| **Tác nhân** | Chủ cửa hàng / kế toán |
| **Điều kiện kích hoạt** | Người dùng nhấn **Cập nhật** ở phần cấu hình thông tin hóa đơn |
| **Điều kiện tiên quyết** | Đã kết nối tài khoản Viettel thành công (BR-vte-003) và đã lấy được danh sách mẫu số |
| **Điều kiện sau khi thực hiện** | `invoice_pattern`, `pattern_id`, `invoice_serial`, `invoice_type`, `invoice_vat_rate`, `invoice_method` được ghi vào `config`; nghiệp vụ phát hành hóa đơn khi bán hàng hoạt động bình thường |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | (Hệ thống tự động, ngay sau khi đăng nhập thành công) | Đổ danh sách mẫu số lấy từ API 2 vào ô **Chọn mẫu số**; ô **Chọn ký hiệu** để trống cho tới khi chọn mẫu số. Hiển thị **Mã CQT cấp** ở dạng chỉ đọc |
| 2 | Chọn **mẫu số** | Lọc danh sách **ký hiệu** thuộc mẫu số vừa chọn và tự điền **Loại hình hóa đơn** tương ứng vào ô chỉ đọc (BR-vte-013). Nếu mẫu số chỉ có một ký hiệu thì chọn sẵn ký hiệu đó |
| 3 | Chọn **ký hiệu** | Ghi nhận lựa chọn |
| 4 | (Hệ thống tự động) | Loại hình hóa đơn là **Hóa đơn GTGT một thuế** thì hiện ô **Giá trị phần trăm thuế GTGT** và đặt là bắt buộc; loại hình khác thì ẩn ô này và bỏ giá trị đang giữ (BR-vte-014) |
| 5 | Chọn **giá trị phần trăm thuế GTGT** (nếu có) | Ghi nhận lựa chọn |
| 6 | Chọn **loại hình phát hành hóa đơn** | Ghi nhận lựa chọn |
| 7 | Nhấn **Cập nhật** | Kiểm tra các trường bắt buộc. Hợp lệ thì ghi `invoice_pattern`, `pattern_id`, `invoice_serial`, `invoice_type`, `invoice_vat_rate`, `invoice_method` vào `config` theo cửa hàng hiện tại; khóa các ô chọn; hiện thông báo **"Cập nhật cấu hình hóa đơn điện tử thành công"** |
| 8 | Nhấn **Sửa** | Mở lại các ô chọn; chọn lại mẫu số thì ký hiệu và loại hình hóa đơn tự cập nhật theo mẫu số mới, ký hiệu cũ bị bỏ |
| 9 | Nhấn **Thử lại** (khi danh sách mẫu số rỗng) hoặc **Lấy lại mã** (↺) | Gọi lại API 2 lấy danh sách mẫu số + ký hiệu mới nhất. Mẫu số đang lưu vẫn còn trong danh sách mới thì giữ nguyên lựa chọn; không còn thì xóa trắng lựa chọn và cảnh báo **"Mẫu số đang cấu hình không còn hiệu lực trên hệ thống Viettel. Vui lòng chọn lại."** (BR-vte-015) |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Bỏ trống mẫu số | "Mẫu số không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Bỏ trống ký hiệu | "Ký hiệu không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Bỏ trống thuế suất GTGT khi loại hình là GTGT một thuế | "Giá trị phần trăm thuế GTGT không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Bỏ trống loại hình phát hành hóa đơn | "Loại hình phát hành hóa đơn không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Danh sách mẫu số rỗng do tài khoản chưa đăng ký dải hóa đơn | "Tài khoản chưa có mẫu số nào trên hệ thống Viettel. Vui lòng đăng ký dải hóa đơn với Viettel trước khi cấu hình." | Khóa nút **Cập nhật** |
| Cập nhật thành công | "Cập nhật cấu hình hóa đơn điện tử thành công" | Khóa các ô chọn |

> Không dùng thông báo tổng khi thiếu dữ liệu — chỉ báo lỗi đỏ dưới từng ô.

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-vte-011 | Danh sách mẫu số và ký hiệu chỉ lấy từ hệ thống Viettel theo tài khoản đã đăng nhập; người dùng không nhập tay |
| BR-vte-012 | Ký hiệu phụ thuộc mẫu số: chọn mẫu số nào thì ô ký hiệu chỉ liệt kê ký hiệu thuộc mẫu số đó; đổi mẫu số thì ký hiệu đang chọn bị bỏ |
| BR-vte-013 | Loại hình hóa đơn xác định theo mẫu số, không do người dùng chọn (kế thừa BR-hddt-007 của [SRS-HDDT-001](spec.md)) |
| BR-vte-014 | Ô **Giá trị phần trăm thuế GTGT** chỉ hiện và chỉ bắt buộc khi loại hình hóa đơn là **Hóa đơn GTGT một thuế**; loại hình nhiều thuế suất thì thuế suất lấy theo từng dòng hàng lúc bán, không cấu hình ở đây |
| BR-vte-015 | Mỗi cửa hàng chỉ chọn **một cặp mẫu số + ký hiệu** để phát hành tại một thời điểm. Cặp đang lưu không còn trong danh sách Viettel trả về thì hệ thống cảnh báo và bắt chọn lại |
| BR-vte-016 | Cửa hàng chỉ phát hành được hóa đơn điện tử khi đã lưu đủ mẫu số, ký hiệu, loại hình phát hành và (nếu áp dụng) thuế suất GTGT |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Phát hành hóa đơn điện tử khi bán hàng | Bán hàng | Cao | Hóa đơn phát hành theo cặp **mẫu số + ký hiệu** đã cấu hình; hóa đơn GTGT một thuế lấy thuế suất từ `invoice_vat_rate`. Xóa liên kết hoặc đổi tài khoản làm cấu hình rỗng, phải cấu hình lại trước khi phát hành (BR-vte-016) |
| Cấu hình HĐĐT của các nhà cung cấp khác | Cài đặt > Hóa đơn > Hóa đơn điện tử | Trung bình | Màn hình dùng chung; cần hiện/ẩn ô **Đường dẫn**, **Ký hiệu**, **Thuế suất GTGT** theo nhà cung cấp đang chọn (BR-vte-001) |
| Kết nối cơ quan thuế | Cài đặt > Hóa đơn > Kết nối cơ quan thuế | Trung bình | Dùng chung **Mã CQT cấp** lấy từ hệ thống HĐĐT |
| Cấu hình cách ký hóa đơn (HSM / USB token) | Cài đặt > Hóa đơn | Thấp | Giữ nguyên logic hiện hành; **Loại hình phát hành hóa đơn** vẫn do người dùng chọn |
| Báo cáo, tra cứu hóa đơn đã phát hành | Hóa đơn bán ra | Thấp | Hóa đơn cũ giữ nguyên mẫu số, ký hiệu tại thời điểm phát hành; đổi cấu hình không hồi tố |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Hóa đơn điện tử Viettel (vInvoice) | `POST /auth/login` | Cao | Lời gọi mới, dùng ở bước **Đăng nhập** để xác thực tài khoản và lấy vé phiên |
| Hóa đơn điện tử Viettel (vInvoice) | `POST /services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/getAllInvoiceTemplates` | Cao | Lời gọi mới, chạy ngay sau khi đăng nhập thành công để lấy danh sách mẫu số + ký hiệu |

---

## 5. ĐẶC TẢ KỸ THUẬT TÍCH HỢP

### 5.1 Thông tin chung

| Hạng mục | Giá trị |
|---|---|
| Tên hệ thống đối tác | Viettel vInvoice (hóa đơn điện tử Viettel) |
| Mã nhà cung cấp trong EPOS | `VTE` |
| Địa chỉ gốc | `https://api-vinvoice.viettel.vn` — **giá trị mặc định duy nhất**, dùng chung cho mọi cửa hàng, người dùng không nhập và không sửa được |
| Môi trường test riêng | Không có. VTE chỉ dùng địa chỉ trên (chốt ngày 07/08/2026) |
| Giao thức | HTTPS, REST |
| Định dạng trao đổi | JSON (`Content-Type: application/json`, `Accept: application/json`) |
| Cơ chế xác thực | OAuth2 password grant, trả về **JWT** ký RS256; các lời gọi nghiệp vụ gửi kèm `Authorization: Bearer <access_token>` |
| Bên gọi | Máy chủ EPOS gọi sang Viettel (**không** gọi trực tiếp từ trình duyệt, tránh lộ mật khẩu và vướng CORS) |
| Timeout | 30 giây mỗi lời gọi |

> **Lưu ý về cookie:** bản `curl` mẫu do trình duyệt xuất ra có kèm `Cookie: access_token=...; session_token=...; JSESSIONID=...`. Khi gọi từ máy chủ EPOS, phần xác thực đã nằm ở header `Authorization: Bearer`, nên **không cần gửi cookie**. Đề nghị dev thử bỏ cookie khi tích hợp; nếu Viettel vẫn bắt buộc thì phải giữ nguyên cookie jar giữa hai lời gọi (xem OQ-5).

### 5.2 API 1 — Đăng nhập / xác thực tài khoản

**Mục đích nghiệp vụ:** kiểm tra tài khoản, mật khẩu người dùng nhập có đúng trên hệ thống Viettel không, đồng thời lấy vé phiên để gọi các API nghiệp vụ.

| Hạng mục | Giá trị |
|---|---|
| Phương thức | `POST` |
| Đường dẫn | `/auth/login` |
| Đầy đủ | `https://api-vinvoice.viettel.vn/auth/login` |
| Xác thực | Không cần token (đây là lời gọi lấy token) |

**Header:**

| Tên header | Giá trị |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

**Dữ liệu gửi (request body):**

```json
{
  "username": "0100109106-990",
  "password": "<mật khẩu người dùng nhập>"
}
```

| Trường | Kiểu | Bắt buộc | Nguồn | Mô tả |
|---|---|:---:|---|---|
| `username` | string | Có | Ô **Tài khoản** trên màn hình | Tài khoản Viettel cấp, thường là mã số thuế hoặc mã số thuế kèm mã đơn vị phụ thuộc |
| `password` | string | Có | Ô **Mật khẩu** trên màn hình | Gửi ở dạng rõ qua HTTPS; **không ghi vào log** |

**Dữ liệu nhận (response thành công, HTTP 200):**

Đã xác nhận bằng lần gọi thử ngày **07/08/2026** với tài khoản thật (HTTP 200, thời gian phản hồi 292 ms, dung lượng 3.07 KB):

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 1199,
  "scope": "openid",
  "iat": 1786073203,
  "invoice_cluster": "cluster3",
  "type": 1,
  "jti": "9c6893d9-c76a-4743-95fe-976ea742ec1d"
}
```

| Trường | Kiểu | Ý nghĩa và cách EPOS dùng |
|---|---|---|
| `access_token` | string | **Vé vào cửa** — gửi ở header `Authorization: Bearer` của mọi lời gọi nghiệp vụ |
| `token_type` | string | Luôn là `bearer` |
| `refresh_token` | string | **Vé làm mới** — lấy vé vào cửa mới mà không phải gửi lại mật khẩu (cách gọi xem OQ-9) |
| `expires_in` | number | Số giây vé vào cửa còn hiệu lực — **1199 giây, tức gần 20 phút**. EPOS lấy đúng giá trị này, không viết cứng |
| `scope` | string | `openid` |
| `iat` | number | Thời điểm cấp vé (giây epoch) |
| `invoice_cluster` | string | Cụm máy chủ phục vụ tài khoản (`cluster3`) — nên ghi log để tra soát với Viettel khi có sự cố |
| `type` | number | Loại tài khoản |
| `jti` | string | Mã định danh vé — dùng đối chiếu log khi Viettel hỗ trợ xử lý sự cố |

> **Lưu ý quan trọng:** phần thân phản hồi **không chứa `session_token`**. Vé phiên 7 ngày chỉ được Viettel đặt qua cookie — phản hồi kèm **3 cookie** (`access_token`, `session_token`, `JSESSIONID`) và 14 header. EPOS chỉ dùng `access_token` và `refresh_token` lấy từ thân phản hồi, không phụ thuộc cookie.

**Nội dung bên trong vé (giải mã từ token mẫu — dùng để hiểu vòng đời, không cần EPOS tự xử lý):**

| Trường trong token | Ví dụ | Ý nghĩa |
|---|---|---|
| `user_name` | `4100439038` | Tài khoản đã đăng nhập, chính là **mã số thuế** dùng cho API 2 |
| `type` | `1` | Loại tài khoản |
| `invoice_cluster` | `cluster3` | Cụm máy chủ phục vụ tài khoản này |
| `authorities` | `["ROLE_USER"]` | Quyền của tài khoản |
| `client_id` | `web_app` | Ứng dụng gọi |
| `iat` / `exp` | `1758336315` / `1758337515` | Thời điểm cấp và hết hạn — chênh **1200 giây (20 phút)** với vé vào cửa |
| `ati` (chỉ có ở `session_token`) | `ad4b1811-...` | Trỏ về vé vào cửa tương ứng; vé phiên hết hạn sau **604800 giây (7 ngày)** |

**Dữ liệu nhận (response lỗi):**

| Tình huống | HTTP | Xử lý phía EPOS |
|---|:---:|---|
| Sai tài khoản hoặc mật khẩu | 400 / 401 | Hiện nhãn đỏ **Đăng nhập thất bại** kèm thông báo Viettel trả về; không lưu `config` |
| Tài khoản bị khóa, hết hạn dịch vụ | 400 / 403 | Như trên |
| Lỗi phía Viettel | 5xx | "Hệ thống hóa đơn điện tử Viettel đang bận. Vui lòng thử lại sau." |
| Quá 30 giây không phản hồi | – | Hủy lời gọi, báo lỗi không phản hồi |

**Lệnh gọi mẫu:**

```bash
curl --location 'https://api-vinvoice.viettel.vn/auth/login' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "username": "0100109106-990",
    "password": "********"
  }'
```

### 5.3 API 2 — Lấy danh sách mẫu số, ký hiệu

**Mục đích nghiệp vụ:** lấy toàn bộ mẫu số và ký hiệu hóa đơn mà tài khoản vừa đăng nhập đang được phép phát hành, để đổ vào hai ô **Chọn mẫu số** và **Chọn ký hiệu**.

| Hạng mục | Giá trị |
|---|---|
| Phương thức | `POST` |
| Đường dẫn | `/services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/getAllInvoiceTemplates` |
| Đầy đủ | `https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/getAllInvoiceTemplates` |
| Xác thực | `Authorization: Bearer <access_token>` lấy từ API 1 |
| Thời điểm gọi | Ngay sau khi API 1 thành công; và khi người dùng bấm **Thử lại** / **Lấy lại mã** |

**Header:**

| Tên header | Giá trị |
|---|---|
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |
| `Authorization` | `Bearer <access_token>` |

**Dữ liệu gửi (request body):**

```json
{
  "taxCode": "4100439038",
  "invoiceType": "all"
}
```

| Trường | Kiểu | Bắt buộc | Nguồn | Mô tả |
|---|:---:|:---:|---|---|
| `taxCode` | string | Có | Tài khoản vừa đăng nhập (`user_name` trong vé) | Mã số thuế của cửa hàng. Tài khoản dạng `0100109106-990` gửi cả chuỗi hay chỉ phần `0100109106` — xem OQ-1 |
| `invoiceType` | string | Có | Cố định `"all"` | Lấy tất cả loại hóa đơn để màn hình tự lọc theo mẫu số |

**Dữ liệu nhận (response thành công, HTTP 200):**

Phản hồi trả về danh sách cặp **mẫu số + ký hiệu**. Theo chuẩn vInvoice, mỗi phần tử có dạng chuỗi `<mẫu số>;<ký hiệu>`; cấu trúc chính xác cần dev xác nhận bằng một lần gọi thử với tài khoản thật (OQ-5). Cấu trúc tham chiếu:

```json
{
  "errorCode": null,
  "description": null,
  "data": [
    "5/0011;C25MQA",
    "1/001;C25TAA"
  ]
}
```

**Quy tắc bóc tách dữ liệu:**

1. Tách mỗi phần tử theo dấu `;` — phần trước là **mẫu số**, phần sau là **ký hiệu**.
2. Gom nhóm theo mẫu số để dựng quan hệ **1 mẫu số → nhiều ký hiệu** (phục vụ BR-vte-012).
3. Suy **loại hình hóa đơn** từ ký tự đầu của mẫu số theo Nghị định 123/2020 và Thông tư 78/2021:

   | Ký tự đầu mẫu số | Loại hình hóa đơn |
   |:---:|---|
   | `1` | Hóa đơn giá trị gia tăng |
   | `2` | Hóa đơn bán hàng |
   | `3` | Hóa đơn bán tài sản công |
   | `4` | Hóa đơn bán hàng dự trữ quốc gia |
   | `5` | Các loại hóa đơn khác (tem, vé, thẻ, phiếu thu…) |
   | `6` | Chứng từ được in, phát hành, sử dụng như hóa đơn |

   Riêng phân biệt **GTGT một thuế** với **GTGT nhiều thuế** không suy được từ mẫu số — chờ chốt cách xác định (OQ-6).
4. Danh sách rỗng thì hiện thông báo tài khoản chưa có mẫu số (Mục 3.2.3).

**Dữ liệu nhận (response lỗi):**

| Tình huống | HTTP / `errorCode` | Xử lý phía EPOS |
|---|:---:|---|
| Vé vào cửa hết hạn hoặc không hợp lệ | 401 | Làm mới vé bằng `refresh_token`, không được thì tự đăng nhập lại một lần (Mục 5.4) rồi gọi lại; vẫn lỗi thì báo người dùng đăng nhập lại |
| Mã số thuế không hợp lệ hoặc không thuộc tài khoản | 400 kèm `errorCode` | Hiện đúng `description` Viettel trả về |
| Lỗi phía Viettel | 5xx | "Không lấy được danh sách mẫu số từ Viettel. Vui lòng thử lại." + nút **Thử lại** |

**Lệnh gọi mẫu:**

```bash
curl --location 'https://api-vinvoice.viettel.vn/services/einvoiceapplication/api/InvoiceAPI/InvoiceUtilsWS/getAllInvoiceTemplates' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <access_token>' \
  --data '{
    "taxCode": "4100439038",
    "invoiceType": "all"
  }'
```

### 5.4 Quản lý phiên và token

**Vòng đời vé (giải mã từ token mẫu):**

| Loại vé | Thời hạn | Dùng để |
|---|---|---|
| `access_token` (vé vào cửa) | **1199 giây, gần 20 phút** — lấy đúng theo `expires_in` API 1 trả về, không viết cứng | Gửi ở header `Authorization` của mọi lời gọi nghiệp vụ |
| `refresh_token` (vé làm mới) | Chưa rõ, cần Viettel xác nhận (OQ-9) | Lấy vé vào cửa mới mà không cần gửi lại mật khẩu |
| `session_token` (cookie) | **7 ngày** kể từ lúc cấp; trỏ về vé vào cửa qua trường `ati` | Viettel dùng cho phiên trình duyệt — **EPOS không dùng**, chỉ ghi nhận để hiểu cơ chế |

**Quy tắc xử lý:**

1. Máy chủ EPOS giữ **vé vào cửa** và **vé làm mới** ở **bộ nhớ tạm theo cửa hàng** (Redis hoặc cache tương đương), khóa dạng `vte:token:{shop_id}`, thời gian sống bằng thời hạn vé. **Không** ghi vé vào bảng `config`.
2. Trước mỗi lời gọi nghiệp vụ, kiểm tra vé vào cửa còn hạn không. Áp dụng **biên an toàn 60 giây** — còn dưới 60 giây thì coi như đã hết hạn.
3. Vé hết hạn hoặc Viettel trả 401, xử lý theo **hai nấc**:
   - **Nấc 1 — làm mới vé:** dùng `refresh_token` lấy vé vào cửa mới rồi gọi lại lời gọi vừa lỗi. Không phải gửi lại mật khẩu.
   - **Nấc 2 — đăng nhập lại:** làm mới thất bại (vé làm mới cũng hết hạn) thì **tự đăng nhập lại đúng một lần** bằng tài khoản và mật khẩu đã lưu trong `config`, rồi gọi lại (BR-vte-008).

   Cả hai nấc chạy ngầm, người dùng không thấy gì bất thường.
4. Cả hai nấc đều thất bại (mật khẩu đã bị đổi phía Viettel, tài khoản bị khóa): đổi nhãn trạng thái thành **Đăng nhập thất bại**, hiện thông báo *"Phiên kết nối với Viettel không còn hiệu lực. Vui lòng nhập lại mật khẩu và đăng nhập."*, mở lại ô nhập; **không** xóa cấu hình mẫu số đang lưu.
5. Mỗi lời gọi nghiệp vụ chỉ được chạy **tối đa 1 lần làm mới và 1 lần đăng nhập lại** để tránh vòng lặp.
6. Người dùng bấm **Xóa liên kết** hoặc đăng nhập bằng tài khoản khác: xóa ngay vé đang giữ trong bộ nhớ tạm.

### 5.5 Ánh xạ dữ liệu API sang màn hình và CSDL

| Dữ liệu Viettel | Nguồn | Trường trên màn hình | Khóa trong `config` |
|---|---|---|---|
| Tài khoản đăng nhập | Ô nhập của người dùng, xác thực qua API 1 | Tài khoản | `easyinvoice_account` |
| Mật khẩu | Ô nhập của người dùng | Mật khẩu | `easyinvoice_password` (mã hóa) |
| Nhà cung cấp | Người dùng chọn | Hệ thống hóa đơn điện tử | `einvoice_provider` = `VTE` |
| Địa chỉ hệ thống | Hằng số trong EPOS | (không hiển thị) | `easyinvoice_url` |
| `access_token`, `refresh_token` | API 1 (thân phản hồi) | (không hiển thị) | **Bộ nhớ tạm**, không ghi `config` |
| Mẫu số (phần trước dấu `;`) | API 2 | Chọn mẫu số | `invoice_pattern`, `pattern_id` |
| Ký hiệu (phần sau dấu `;`) | API 2 | Chọn ký hiệu | `invoice_serial` |
| Loại hình hóa đơn | Suy từ mẫu số (Mục 5.3) | Loại hình hóa đơn (chỉ đọc) | `invoice_type` |
| Thuế suất GTGT | Người dùng chọn | Giá trị phần trăm thuế GTGT | `invoice_vat_rate` |
| Loại hình phát hành | Người dùng chọn | Loại hình phát hành hóa đơn | `invoice_method` |
| Mã CQT cấp | Chờ xác nhận nguồn (OQ-4) | Mã CQT cấp (chỉ đọc) | `tax_machine_code` |

### 5.6 Xử lý lỗi

| Mã lỗi EPOS | Tình huống | Thông báo cho người dùng | Ghi log |
|---|---|---|---|
| E-vte-001 | Thiếu tài khoản hoặc mật khẩu | Lỗi đỏ dưới ô tương ứng | Không |
| E-vte-002 | API 1 trả 400/401 — sai tài khoản hoặc mật khẩu | Theo `description` Viettel trả về | Có (không kèm mật khẩu) |
| E-vte-003 | API 1 trả 403 — tài khoản bị khóa hoặc hết hạn dịch vụ | Theo `description` Viettel trả về | Có |
| E-vte-004 | API 1 hoặc API 2 quá 30 giây không phản hồi | "Hệ thống hóa đơn điện tử Viettel không phản hồi. Vui lòng thử lại sau." | Có |
| E-vte-005 | Không có kết nối mạng tới Viettel | "Không kết nối được tới hệ thống hóa đơn điện tử. Vui lòng kiểm tra đường truyền." | Có |
| E-vte-006 | API 2 trả lỗi sau khi đăng nhập thành công | "Không lấy được danh sách mẫu số từ Viettel. Vui lòng thử lại." + nút **Thử lại** | Có |
| E-vte-007 | API 2 trả danh sách rỗng | "Tài khoản chưa có mẫu số nào trên hệ thống Viettel. Vui lòng đăng ký dải hóa đơn với Viettel trước khi cấu hình." | Có |
| E-vte-008 | Vé hết hạn, làm mới bằng `refresh_token` và đăng nhập lại đều thất bại | "Phiên kết nối với Viettel không còn hiệu lực. Vui lòng nhập lại mật khẩu và đăng nhập." | Có |
| E-vte-009 | Phản hồi API 2 sai định dạng, không bóc tách được | "Không đọc được danh sách mẫu số từ Viettel. Vui lòng liên hệ hỗ trợ." | Có (kèm nguyên văn phản hồi) |
| E-vte-010 | Mẫu số đang lưu không còn trong danh sách mới | "Mẫu số đang cấu hình không còn hiệu lực trên hệ thống Viettel. Vui lòng chọn lại." | Có |

### 5.7 Biểu đồ tuần tự

```mermaid
sequenceDiagram
    autonumber
    actor U as Chủ cửa hàng / kế toán
    participant W as Màn hình EPOS
    participant S as Máy chủ EPOS
    participant C as Bộ nhớ tạm (token)
    participant V as Viettel vInvoice
    participant DB as CSDL (config)

    U->>W: Chọn "Viettel - VTE"
    W-->>U: Ẩn ô Đường dẫn, hiện Tài khoản + Mật khẩu
    U->>W: Nhập tài khoản, mật khẩu, bấm "Đăng nhập"
    W->>S: Yêu cầu kết nối HĐĐT (tài khoản, mật khẩu)
    S->>V: POST /auth/login {username, password}

    alt Xác thực thất bại
        V-->>S: 400/401 + description
        S-->>W: Lỗi kèm thông báo của Viettel
        W-->>U: Nhãn đỏ "Đăng nhập thất bại"
    else Xác thực thành công
        V-->>S: 200 + access_token (expires_in 1199s) + refresh_token
        S->>C: Lưu vé vào cửa + vé làm mới theo shop_id
        S->>DB: Ghi tài khoản, mật khẩu (mã hóa), provider = VTE
        S->>V: POST getAllInvoiceTemplates {taxCode, invoiceType:"all"}
        alt Lấy danh sách thành công
            V-->>S: 200 + data ["mẫu số;ký hiệu", ...]
            S->>S: Tách mẫu số / ký hiệu, suy loại hình hóa đơn
            S-->>W: Trạng thái đã liên kết + danh sách mẫu số, ký hiệu
            W-->>U: Nhãn xanh + hiện phần cấu hình thông tin hóa đơn
        else Lấy danh sách thất bại
            V-->>S: Lỗi
            S-->>W: Đã liên kết nhưng danh sách rỗng
            W-->>U: Cảnh báo + nút "Thử lại"
        end
    end

    U->>W: Chọn mẫu số
    W-->>U: Lọc ký hiệu theo mẫu số, tự điền loại hình hóa đơn
    U->>W: Chọn ký hiệu, thuế suất GTGT (nếu có), loại hình phát hành
    U->>W: Bấm "Cập nhật"
    W->>S: Lưu cấu hình
    S->>DB: Ghi mẫu số, ký hiệu, loại hình, thuế suất, loại hình phát hành
    S-->>W: Thành công
    W-->>U: "Cập nhật cấu hình hóa đơn điện tử thành công"
```

### 5.8 Yêu cầu phi chức năng kỹ thuật

| Mã | Yêu cầu |
|---|---|
| NFR-vte-001 | Mọi lời gọi sang Viettel thực hiện **từ máy chủ EPOS**, không gọi trực tiếp từ trình duyệt |
| NFR-vte-002 | Timeout mỗi lời gọi **30 giây**; quá hạn thì hủy và báo lỗi, không để màn hình chờ vô hạn |
| NFR-vte-003 | Không tự thử lại với lỗi xác thực (4xx). Lỗi mạng hoặc 5xx được thử lại tối đa **2 lần**, giãn cách 2 giây và 4 giây |
| NFR-vte-004 | **Không ghi log** mật khẩu, `access_token`, `refresh_token`, `session_token` ở bất kỳ mức log nào. Log chỉ giữ tài khoản, thời điểm gọi, mã HTTP, mã lỗi, `jti`, `invoice_cluster` và thời gian phản hồi |
| NFR-vte-005 | Mật khẩu lưu trong `config` ở dạng mã hóa hai chiều bằng khóa của hệ thống, không lưu dạng rõ |
| NFR-vte-006 | Thời gian phản hồi kỳ vọng: đăng nhập dưới **5 giây**, lấy danh sách mẫu số dưới **5 giây** trong điều kiện mạng bình thường. Mốc đo thực tế ngày 07/08/2026: đăng nhập **292 ms** |
| NFR-vte-007 | Trong lúc chờ Viettel, nút **Đăng nhập** bị khóa để tránh người dùng bấm nhiều lần sinh nhiều phiên |
| NFR-vte-008 | Địa chỉ gốc `https://api-vinvoice.viettel.vn` và các đường dẫn con đặt ở **cấu hình hệ thống**, không viết cứng trong mã nguồn. Hiện chỉ có một giá trị mặc định; đặt ở cấu hình để đổi được khi Viettel thay địa chỉ mà không phải sửa mã |
| NFR-vte-009 | Danh sách mẫu số lấy về được lưu tạm theo cửa hàng tối đa **15 phút**; hết hạn hoặc người dùng bấm **Thử lại** thì gọi lại Viettel |

---

## 6. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-1 | Tài khoản dạng `0100109106-990` (mã số thuế kèm mã đơn vị phụ thuộc) thì trường `taxCode` gửi sang API 2 là **cả chuỗi** hay chỉ phần mã số thuế `0100109106`? Bản mẫu dùng tài khoản `4100439038` không có phần đuôi nên chưa kết luận được | 3.1.4 BR-vte-005, 5.3 | Dev / Viettel | Trước khi code |
| OQ-2 | Trên ảnh thiết kế, ô **Chọn ký hiệu** đang hiện `5/0011` còn ô **Chọn mẫu số** hiện `C25MQA`. Theo Thông tư 78/2021, `5/0011` là **mẫu số** còn `C25MQA` là **ký hiệu** (chữ `C` là hóa đơn có mã cơ quan thuế, `25` là năm 2025). Nhãn hai ô có đang bị đảo không? | 3.2.2, 3.2.3, 5.5 | BA / thiết kế | Trước khi code |
| ~~OQ-3~~ | **Đã chốt 07/08/2026:** VTE chỉ có **một địa chỉ mặc định duy nhất** `https://api-vinvoice.viettel.vn`, không có môi trường test riêng, người dùng không nhập đường dẫn | 2.1, 2.5, 3.1.4, 5.1, 5.8 | @huelinh | Đã đóng |
| OQ-4 | **Mã CQT cấp** với tài khoản Viettel lấy từ đâu — có API riêng, nằm trong phản hồi của một trong hai lời gọi trên, hay suy từ ký hiệu (chữ đầu `C` / `K`)? | 2.5, 3.2.2, 5.5 | Dev / Viettel | Trước khi code |
| OQ-5 | **Đã chốt một phần 07/08/2026** — cấu trúc phản hồi API 1 đã xác nhận (Mục 5.2). **Còn lại:** cấu trúc phản hồi chính xác của **API 2** (tên trường, kiểu dữ liệu, dấu phân tách giữa mẫu số và ký hiệu trong `data`) và xác nhận API 2 có bắt buộc gửi kèm cookie hay chỉ cần header `Authorization` | 5.3, 5.1 | Dev | Trước khi code |
| OQ-9 | Làm mới vé bằng `refresh_token` gọi vào đường dẫn nào, tham số gì (thường là `POST /auth/oauth/token` với `grant_type=refresh_token`)? Vé làm mới có hạn bao lâu? Quyết định này chi phối Mục 5.4 nấc 1 | 5.2, 5.4, 5.6 | Dev / Viettel | Trước khi code |
| OQ-6 | Phân biệt **Hóa đơn GTGT một thuế** với **Hóa đơn GTGT nhiều thuế** dựa vào đâu — Viettel có trả về trong danh sách mẫu số, hay do người dùng chọn, hay theo cấu hình khác? Quyết định này chi phối việc hiện ô **Giá trị phần trăm thuế GTGT** | 3.2.2, 3.2.4 BR-vte-014, 5.3 | BA / Dev | Trước khi code |
| OQ-7 | Cửa hàng đang dùng nhà cung cấp khác, chuyển sang Viettel thì hóa đơn đã phát hành và các cấu hình cũ xử lý thế nào — giữ nguyên hay cảnh báo trước khi đổi? | 3.1.3 bước 8, 4.1 | BA / khách hàng | Trước khi code |
| OQ-8 | Danh mục **Giá trị phần trăm thuế GTGT** lấy từ danh mục thuế suất sẵn có của EPOS hay danh mục riêng theo quy định hóa đơn (0%, 5%, 8%, 10%, không chịu thuế, không kê khai)? | 3.2.2 | BA / Dev | Trước khi code |
