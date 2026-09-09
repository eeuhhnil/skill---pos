---
type: srs
feature: cau-hinh-hoa-don-dien-tu
status: draft
lang: vi
owner: "@huelinh"
version: 1.0
created: 2026-07-29
updated: 2026-07-29
links: [docs/Cấu hình/hoa-don-dien-tu.html]
tags: [hoa-don-dien-tu, cau-hinh, dang-nhap]
stale_reason: ""
changelog:
  - 2026-07-29 | /srs | ghi lời gọi API validate/lấy mã CQT/mẫu số vào cột phản hồi hệ thống, thêm OQ-4
  - 2026-07-29 | /srs | bổ sung API xác thực {đường dẫn}/api/account/verify + BR-hddt-011
  - 2026-07-29 | /srs | Mục 2.2 gộp còn 5 bước mỗi luồng, ghi rõ thông tin nhập ở bước kết nối
  - 2026-07-29 | /srs | Mục 2.2 viết lại As-Is/To-Be thành các bước đánh số
  - 2026-07-29 | /srs | initial draft — tách bước đăng nhập khỏi cấu hình thông tin hóa đơn
---

# SRS — Tách bước đăng nhập khỏi cấu hình thông tin hóa đơn điện tử

**Mã tài liệu:** SRS-HDDT-001
**Phiên bản:** 1.0
**Ngày tạo:** 29/07/2026
**Người soạn:** Dương Thị Huệ Linh
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|---------|----------------|---------|
| 29/07/2026 | Toàn bộ | A | Cải tiến hệ thống | Dương Thị Huệ Linh | Tạo mới tài liệu | |

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
   - 3.1 Đăng nhập hệ thống hóa đơn điện tử
   - 3.2 Cấu hình thông tin hóa đơn
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Cải tiến nội bộ. Màn **Cài đặt > Hóa đơn > Hóa đơn điện tử** hiện bắt người dùng chọn **loại hình hóa đơn** và **loại hình phát hành** ngay từ đầu, trong khi loại hình hóa đơn thực chất **tự suy ra từ mẫu số** — mà mẫu số chỉ lấy được sau khi đăng nhập thành công vào hệ thống hóa đơn điện tử (HĐĐT). Yêu cầu: tách bước đăng nhập ra riêng, đăng nhập xong mới cấu hình thông tin hóa đơn. Áp dụng cho **tất cả** nhà cung cấp HĐĐT hệ thống đang hỗ trợ.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Tách màn cấu hình thành **2 phần độc lập**:

- **Phần 1 — Cấu hình hóa đơn điện tử:** đường dẫn, hệ thống HĐĐT, tên đăng nhập, mật khẩu. Nút **Đăng nhập**.
- **Phần 2 — Cấu hình thông tin hóa đơn:** mã CQT cấp, mẫu số, loại hình hóa đơn, loại hình phát hành. **Chỉ hiển thị sau khi đăng nhập thành công.**

Thay đổi kèm theo:

- Danh sách mẫu số và mã CQT lấy về từ hệ thống HĐĐT của **chính tài khoản vừa đăng nhập**.
- **Loại hình hóa đơn tự điền theo mẫu số** (chỉ đọc), người dùng không chọn tay nữa.
- Phiên đăng nhập được **lưu vĩnh viễn** — lần sau vào màn hiển thị luôn trạng thái đã liên kết.
- Bổ sung thao tác **Sửa**, **Xóa liên kết** ở phần 1.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Người dùng vào Cài đặt > Hóa đơn > Hóa đơn điện tử.
2. Nhập một lượt toàn bộ thông tin: **đường dẫn**, **hệ thống HĐĐT**, **tên đăng nhập**, **mật khẩu**, **loại hình hóa đơn**, **loại hình phát hành hóa đơn**.
3. Nhấn **Cập nhật** — đến lúc này hệ thống mới gửi thông tin sang hệ thống HĐĐT xác thực; sai thì báo lỗi và người dùng nhập lại.
4. Xác thực thành công: màn hình đổ danh sách mẫu số để chọn. Chọn xong, hệ thống **tự đổi lại loại hình hóa đơn** theo mẫu số — ghi đè lựa chọn ở bước 2.
5. Nhấn **Cập nhật** lần nữa để lưu cấu hình.

**Luồng mới (To-Be):**

1. Người dùng vào Cài đặt > Hóa đơn > Hóa đơn điện tử. Cửa hàng đã liên kết thì hiện luôn trạng thái đã đăng nhập kèm phần 2; chưa liên kết thì hiện phần 1 với form trống.
2. **Phần 1 — nhập thông tin kết nối:** đường dẫn hệ thống HĐĐT, hệ thống HĐĐT (EasyInvoice - EI / VNPT / MISA / Viettel), tên đăng nhập, mật khẩu.
3. Nhấn **Đăng nhập** — hệ thống **call API `{đường dẫn}/api/account/verify` để validate** tài khoản với hệ thống HĐĐT (vd `https://test7802.softdreams.vn/api/account/verify`). Thất bại: nhãn đỏ *Đăng nhập thất bại* kèm thông báo do HĐĐT trả về, không lưu gì, phần 2 không hiện. Thành công: lưu thông tin đăng nhập, nhãn xanh *Đăng nhập thành công*, khóa ô nhập, đổi nút thành **Sửa / Xóa liên kết / Cập nhật**, đồng thời nhận **mã CQT** và **danh sách mẫu số** của tài khoản.
4. **Phần 2 hiện ra:** mã CQT cấp (chỉ đọc); chọn **mẫu số** — hệ thống tự điền **loại hình hóa đơn** tương ứng; chọn **loại hình phát hành hóa đơn**.
5. Nhấn **Cập nhật**: thiếu mẫu số hoặc loại hình phát hành thì báo lỗi đỏ dưới ô tương ứng; đủ thì lưu cấu hình, hiện thông báo thành công và cửa hàng phát hành hóa đơn bình thường.

**Khác biệt chính:** As-Is bắt chọn loại hình hóa đơn ngay ở bước 2 rồi mới xác thực ở bước 3; To-Be xác thực ngay ở bước 3 khi mới chỉ nhập thông tin kết nối, và loại hình hóa đơn không còn là lựa chọn của người dùng mà suy ra từ mẫu số.

**Hình luồng:**

```
        Vào Cài đặt > Hóa đơn > Hóa đơn điện tử
                        │
                        ▼
              ┌──────────────────────┐
       không  │ Đã lưu phiên đăng    │  có
    ┌─────────┤ nhập trước đó?       ├─────────┐
    │         └──────────────────────┘         │
    ▼                                          │
┌──────────────────────────────────┐           │
│ PHẦN 1 — Cấu hình HĐĐT           │           │
│  • Đường dẫn (Cập nhật đường dẫn)│           │
│  • Hệ thống HĐĐT (*)             │           │
│  • Tên đăng nhập (*)             │           │
│  • Mật khẩu (*)                  │           │
└───────────────┬──────────────────┘           │
                │ [Đăng nhập]                  │
                ▼                              │
┌──────────────────────────────────┐           │
│ Gửi thông tin sang hệ thống HĐĐT │           │
│ để xác thực                      │           │
└───────────────┬──────────────────┘           │
                ▼                              │
        ┌───────────────┐  sai / không phản hồi │
        │ Xác thực OK?  ├──────────────┐        │
        └───────┬───────┘              ▼        │
                │ OK        Nhãn đỏ "Đăng nhập  │
                ▼           thất bại" + message │
┌──────────────────────────────────┐ do HĐĐT trả│
│ • Lưu phiên (nhớ vĩnh viễn)      │ về, ở lại   │
│ • Nhãn xanh "Đăng nhập thành công"  Phần 1    │
│ • Khóa ô nhập, hiện Sửa /        │            │
│   Xóa liên kết / Cập nhật        │            │
│ • Nhận mã CQT + danh sách mẫu số │            │
│   từ hệ thống HĐĐT               │            │
└───────────────┬──────────────────┘            │
                └──────────────┬────────────────┘
                               ▼
              ┌──────────────────────────────────┐
              │ PHẦN 2 — Cấu hình thông tin HĐ   │
              │  • Mã CQT cấp (chỉ đọc)          │
              │  • Chọn mẫu số (*)  ──┐          │
              │  • Loại hình hóa đơn  ◄┘ tự nhảy │
              │    theo mẫu số (chỉ đọc)         │
              │  • Loại hình phát hành HĐ (*)    │
              └───────────────┬──────────────────┘
                              │ [Cập nhật]
                              ▼
                    ┌──────────────────┐  thiếu
                    │ Đủ mẫu số +      ├────────► Lỗi đỏ dưới ô
                    │ loại hình phát   │          (ở lại Phần 2)
                    │ hành?            │
                    └────────┬─────────┘
                             ▼ đủ
              ┌──────────────────────────────────┐
              │ Lưu cấu hình                     │
              │ Toast "Cập nhật cấu hình hóa đơn │
              │ điện tử thành công"              │
              │ → Bán hàng phát hành HĐ bình     │
              │   thường                         │
              └──────────────────────────────────┘
```

### 2.3 Yêu cầu người dùng

| Story ID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-001 | Chủ cửa hàng / kế toán | Đăng nhập hệ thống HĐĐT trước, rồi mới cấu hình thông tin hóa đơn | Không phải chọn thông tin mà hệ thống chưa biết có hợp lệ hay không | Cao |
| US-002 | Chủ cửa hàng / kế toán | Chọn mẫu số thì loại hình hóa đơn tự điền theo mẫu số | Tránh chọn sai loại hình rồi bị hệ thống ghi đè | Cao |
| US-003 | Chủ cửa hàng / kế toán | Đổi tài khoản HĐĐT hoặc xóa liên kết ngay trên màn cấu hình | Chủ động xử lý khi đổi nhà cung cấp hoặc đổi tài khoản | Trung bình |
| US-004 | Chủ cửa hàng / kế toán | Vào lại màn cấu hình là thấy ngay trạng thái đã liên kết | Không phải đăng nhập lại mỗi lần vào | Trung bình |

### 2.4 Ngữ cảnh người dùng

Người thao tác là **chủ cửa hàng hoặc kế toán**, làm trên máy tính tại quầy, thường chỉ vào màn này khi **khởi tạo cửa hàng** hoặc khi **đổi tài khoản / nhà cung cấp HĐĐT** — tần suất thấp nhưng bắt buộc đúng, vì cấu hình sai thì không phát hành được hóa đơn cho khách. Người dùng không có kiến thức kỹ thuật, chỉ có thông tin tài khoản do nhà cung cấp HĐĐT cấp.

### 2.5 Mô tả thay đổi về CSDL

Không phát sinh bảng mới. Dùng lại các khóa cấu hình sẵn có trong bảng `config` (key–value theo `company_id` / `shop_id`), chỉ **thay đổi thời điểm ghi**: nhóm thông tin đăng nhập được ghi khi đăng nhập thành công, nhóm thông tin hóa đơn ghi khi bấm **Cập nhật** ở phần 2.

| Loại thay đổi | Bảng | Khóa (`code`) | Mô tả |
|:---:|---|---|---|
| M | `config` | `easyinvoice_url`, `easyinvoice_account`, `easyinvoice_password` | Thông tin đăng nhập — ghi ở bước **Đăng nhập** (trước đây ghi cùng lúc với thông tin hóa đơn) |
| M | `config` | `tax_machine_code` | Mã CQT cấp — ghi từ giá trị hệ thống HĐĐT trả về sau đăng nhập |
| M | `config` | `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_method` | Mẫu số, loại hình hóa đơn, loại hình phát hành — ghi ở bước **Cập nhật** phần 2. `invoice_type` do hệ thống tự điền theo mẫu số, không nhận giá trị người dùng nhập |
| M | `config` | Toàn bộ khóa trên | **Xóa liên kết** xóa sạch giá trị các khóa này |

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Đăng nhập hệ thống HĐĐT | Nhập đường dẫn, tài khoản, mật khẩu và xác thực với hệ thống HĐĐT | Cao |
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Sửa / Xóa liên kết / Cập nhật đường dẫn | Đổi tài khoản, đổi đường dẫn, hủy liên kết với hệ thống HĐĐT | Trung bình |
| Chủ cửa hàng / kế toán | Cài đặt > Hóa đơn > Hóa đơn điện tử | Cấu hình thông tin hóa đơn | Chọn mẫu số, loại hình phát hành; xem mã CQT và loại hình hóa đơn | Cao |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Đăng nhập hệ thống hóa đơn điện tử

#### 3.1.1 Thông tin chung về chức năng

Cho phép người dùng liên kết cửa hàng với hệ thống HĐĐT bằng tài khoản do nhà cung cấp cấp. Đây là **điều kiện bắt buộc** để mở phần cấu hình thông tin hóa đơn. Sau khi đăng nhập thành công, hệ thống lưu phiên liên kết vĩnh viễn và cho phép **Sửa** thông tin đăng nhập hoặc **Xóa liên kết**.

#### 3.1.2 Màn hình chức năng

Mockup: [hoa-don-dien-tu.html](../../Cấu%20hình/hoa-don-dien-tu.html)

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Đường dẫn + nút **Cập nhật đường dẫn** | Link + Button | Đường dẫn đã lưu; trống nếu chưa liên kết | Có | Đường dẫn **gốc** hệ thống HĐĐT của cửa hàng (vd `https://test7802.softdreams.vn`), không kèm đường dẫn con — hệ thống tự ghép khi gọi API (BR-hddt-011). Đổi đường dẫn bắt buộc đăng nhập lại (BR-hddt-005) |
| 2 | Hệ thống hóa đơn điện tử (*) | Dropdown | EasyInvoice - EI | Có | Danh mục nhà cung cấp HĐĐT hệ thống hỗ trợ |
| 3 | Tên đăng nhập (*) | Textbox | Trống | Có | Tài khoản do nhà cung cấp HĐĐT cấp |
| 4 | Mật khẩu (*) | Textbox (password) + icon hiện/ẩn | Trống | Có | Mật khẩu tài khoản HĐĐT |
| 5 | Nhãn trạng thái | Label | Ẩn | Không | Nhãn xanh **Đăng nhập thành công** / nhãn đỏ **Đăng nhập thất bại**, đặt cạnh tiêu đề, hiển thị thường trực |
| 6 | Nút **Đăng nhập** | Button | Hiện khi chưa liên kết | – | Gửi thông tin xác thực sang hệ thống HĐĐT |
| 7 | Nút **Sửa** / **Xóa liên kết** / **Cập nhật** | Button | Hiện khi đã liên kết | – | **Sửa**: mở lại ô nhập. **Xóa liên kết**: hủy liên kết. **Cập nhật**: lưu lại thông tin đăng nhập |

**Trạng thái màn hình:**

| Tình huống | Phần 1 | Phần 2 |
|---|---|---|
| Chưa đăng nhập | Ô nhập mở, nút **Đăng nhập** | Ẩn |
| Đăng nhập thành công | Ô nhập khóa, nhãn xanh, nút **Sửa / Xóa liên kết / Cập nhật** | Hiện |
| Bấm **Sửa** | Mở lại ô nhập | Giữ nguyên |
| Đổi sang tài khoản khác, đăng nhập lại thành công | Nhãn xanh, tài khoản mới | **Xóa trắng**, chọn lại từ đầu (BR-hddt-004) |
| Đổi đường dẫn nhưng chưa đăng nhập lại | Toast lỗi, giữ trạng thái cũ | Giữ nguyên |
| **Xóa liên kết** (sau xác nhận) | Về trạng thái chưa đăng nhập | Ẩn + xóa dữ liệu (BR-hddt-006) |

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Liên kết cửa hàng với hệ thống HĐĐT để mở chức năng cấu hình và phát hành hóa đơn |
| **Tác nhân** | Chủ cửa hàng / kế toán; tác nhân phụ: hệ thống HĐĐT của nhà cung cấp |
| **Điều kiện kích hoạt** | Người dùng nhấn nút **Đăng nhập** |
| **Điều kiện tiên quyết** | Đã đăng nhập EPOS và có quyền vào màn cấu hình (giữ theo phân quyền hiện hành) |
| **Điều kiện sau khi thực hiện** | Thông tin đăng nhập được lưu vào `config`; phần 2 hiển thị kèm mã CQT và danh sách mẫu số |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn Cài đặt > Hóa đơn > Hóa đơn điện tử | Đọc `config` các khóa `easyinvoice_url`, `easyinvoice_account`, `easyinvoice_password` theo cửa hàng hiện tại. Có đủ giá trị thì hiển thị trạng thái **đã liên kết** (ô nhập khóa, nhãn xanh, phần 2 hiện); chưa có thì hiển thị form đăng nhập trống |
| 2 | Nhập đường dẫn (nếu cần), chọn hệ thống HĐĐT, nhập tên đăng nhập và mật khẩu | Kiểm tra 3 trường bắt buộc không được để trống (BR-hddt-001) |
| 3 | Nhấn **Đăng nhập** | Hệ thống **call API để validate** tài khoản: ghép đường dẫn người dùng nhập với `/api/account/verify` — nhập `https://test7802.softdreams.vn` thì call `https://test7802.softdreams.vn/api/account/verify`, truyền tên đăng nhập và mật khẩu. Chờ kết quả trả về rồi mới xử lý tiếp (bước 4 / bước 5) |
| 4 | (Hệ thống tự động) | API `{đường dẫn}/api/account/verify` trả về **hợp lệ**: ghi `easyinvoice_url`, `easyinvoice_account`, `easyinvoice_password` vào `config`; call tiếp API lấy **mã CQT** và **danh sách mẫu số** của tài khoản trên cùng đường dẫn, ghi `tax_machine_code`; hiện toast **"Đăng nhập thành công"** + nhãn xanh thường trực; khóa ô nhập; hiện phần 2 |
| 5 | (Hệ thống tự động) | API `{đường dẫn}/api/account/verify` trả về **lỗi** (sai tài khoản/mật khẩu, sai đường dẫn, không phản hồi): hiện nhãn đỏ **Đăng nhập thất bại** kèm đúng thông báo do API trả về; **không** ghi `config`; không call tiếp API lấy mã CQT và mẫu số; giữ nguyên phần 1, không hiện phần 2 |
| 6 | Nhấn **Sửa** rồi đổi tài khoản, nhấn **Đăng nhập** lại | Call lại `{đường dẫn}/api/account/verify` với tài khoản mới. Trả về hợp lệ thì ghi đè thông tin đăng nhập, lấy lại mã CQT + danh sách mẫu số của tài khoản mới và **xóa trắng** các khóa `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_method`; phần 2 hiển thị rỗng để chọn lại (BR-hddt-004) |
| 7 | Nhấn **Cập nhật đường dẫn**, đổi đường dẫn rồi bấm lưu mà không nhập lại tài khoản/mật khẩu | Không lưu; hiện toast lỗi **"Đường dẫn đã thay đổi. Vui lòng nhập tên đăng nhập và mật khẩu để đăng nhập lại."** (BR-hddt-005) |
| 8 | Nhấn **Xóa liên kết** | Hiện hộp xác nhận: *"Xóa liên kết hệ thống hóa đơn điện tử? Thông tin đăng nhập và toàn bộ cấu hình mẫu số, loại hình hóa đơn sẽ bị xóa. Cửa hàng sẽ không phát hành được hóa đơn cho tới khi đăng nhập và cấu hình lại."* — nút **Hủy** / **Xóa liên kết** |
| 9 | Xác nhận xóa | Xóa giá trị toàn bộ khóa cấu hình HĐĐT trong `config` (đăng nhập + thông tin hóa đơn); ẩn phần 2; đưa phần 1 về trạng thái chưa đăng nhập; toast **"Đã xóa liên kết hệ thống hóa đơn điện tử"** |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Bỏ trống tên đăng nhập hoặc mật khẩu | Lỗi đỏ dưới ô tương ứng | Dừng, không gọi hệ thống HĐĐT |
| Sai tài khoản / mật khẩu, sai đường dẫn, hệ thống HĐĐT không phản hồi | Theo **thông báo do hệ thống HĐĐT trả về** (giữ nguyên nghiệp vụ hiện hành) | Hiện nhãn đỏ **Đăng nhập thất bại**, giữ nguyên cấu hình cũ, không ghi `config` |
| Đổi đường dẫn nhưng không đăng nhập lại | "Đường dẫn đã thay đổi. Vui lòng nhập tên đăng nhập và mật khẩu để đăng nhập lại." | Không lưu đường dẫn mới |
| Người dùng bấm **Hủy** ở hộp xác nhận xóa liên kết | – | Đóng hộp thoại, giữ nguyên liên kết |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-hddt-001 | Đường dẫn, hệ thống HĐĐT, tên đăng nhập, mật khẩu là bắt buộc; thiếu bất kỳ trường nào thì nút **Đăng nhập** không gọi sang hệ thống HĐĐT |
| BR-hddt-002 | Phần 2 (Cấu hình thông tin hóa đơn) chỉ hiển thị khi trạng thái là **đã đăng nhập thành công** |
| BR-hddt-003 | Phiên đăng nhập được lưu vĩnh viễn: lần sau vào màn hình, hệ thống hiển thị luôn trạng thái đã liên kết mà không yêu cầu đăng nhập lại |
| BR-hddt-004 | Đăng nhập thành công bằng **tài khoản khác** tài khoản đang lưu thì toàn bộ cấu hình thông tin hóa đơn (mẫu số, loại hình hóa đơn, loại hình phát hành) bị xóa trắng, người dùng phải chọn lại |
| BR-hddt-005 | Đường dẫn thay đổi thì bắt buộc nhập lại tên đăng nhập, mật khẩu và đăng nhập lại; không cho lưu riêng đường dẫn |
| BR-hddt-006 | **Xóa liên kết** xóa cả thông tin đăng nhập lẫn cấu hình thông tin hóa đơn trong CSDL; không chặn dù cửa hàng đã phát hành hóa đơn (hóa đơn đã phát hành nằm trên hệ thống HĐĐT, không phụ thuộc cấu hình hiện tại) |
| BR-hddt-011 | Đường dẫn người dùng nhập là đường dẫn gốc của hệ thống HĐĐT; hệ thống tự ghép đường dẫn con khi gọi API (xác thực: `/api/account/verify`). Người dùng không nhập đường dẫn đầy đủ của API |

---

### 3.2 Cấu hình thông tin hóa đơn

#### 3.2.1 Thông tin chung về chức năng

Cho người dùng chọn **mẫu số** dùng để phát hành và **loại hình phát hành hóa đơn**, sau khi đã đăng nhập hệ thống HĐĐT. Mã CQT cấp và danh sách mẫu số do hệ thống HĐĐT trả về; loại hình hóa đơn tự điền theo mẫu số. Cấu hình xong thì cửa hàng phát hành hóa đơn bình thường.

#### 3.2.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Mã CQT cấp + nút **Lấy lại mã** | Label + icon ↺ | Giá trị hệ thống HĐĐT trả về sau khi đăng nhập | Không (chỉ đọc) | Người dùng không nhập tay. Nút ↺ để lấy lại mã từ hệ thống HĐĐT |
| 2 | Chọn mẫu số (*) | Dropdown | Trống | Có | Nguồn: danh sách mẫu số của **chính tài khoản đã đăng nhập** trên hệ thống HĐĐT. Chỉ chọn **1 mẫu số** để phát hành |
| 3 | Loại hình hóa đơn (*) | Dropdown (chỉ đọc) | Trống, tự điền sau khi chọn mẫu số | Có (hệ thống tự điền) | Suy ra từ mẫu số (BR-hddt-007), người dùng không sửa |
| 4 | Loại hình phát hành hóa đơn (*) | Dropdown | Trống | Có | Danh mục có sẵn trong hệ thống, người dùng tự chọn |
| 5 | Nút **Sửa** / **Cập nhật** | Button | – | – | **Sửa**: mở lại các ô chọn. **Cập nhật**: lưu cấu hình |

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Chốt mẫu số và loại hình phát hành để cửa hàng phát hành được hóa đơn điện tử |
| **Tác nhân** | Chủ cửa hàng / kế toán |
| **Điều kiện kích hoạt** | Người dùng nhấn **Cập nhật** ở phần 2 |
| **Điều kiện tiên quyết** | Đã đăng nhập hệ thống HĐĐT thành công (BR-hddt-002) |
| **Điều kiện sau khi thực hiện** | `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_method` được ghi vào `config`; nghiệp vụ phát hành hóa đơn khi bán hàng hoạt động bình thường |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | (Hệ thống tự động, ngay sau khi đăng nhập thành công) | Call API lấy **mã CQT** và API lấy **danh sách mẫu số** trên cùng đường dẫn đã đăng nhập (đường dẫn con — xem OQ-4); hiển thị mã CQT ở dạng chỉ đọc và đổ danh sách mẫu số vào ô chọn. Mỗi mẫu số kèm sẵn loại hình hóa đơn tương ứng để bước 2 tự điền |
| 2 | Chọn mẫu số | Tự điền **loại hình hóa đơn** tương ứng với mẫu số vào ô chỉ đọc (BR-hddt-007) |
| 3 | Chọn loại hình phát hành hóa đơn | Ghi nhận lựa chọn |
| 4 | Nhấn **Cập nhật** | Kiểm tra mẫu số và loại hình phát hành không được để trống. Hợp lệ thì ghi `invoice_pattern`, `pattern_id`, `invoice_type`, `invoice_method` vào `config` theo cửa hàng hiện tại; khóa các ô chọn; hiện toast **"Cập nhật cấu hình hóa đơn điện tử thành công"** |
| 5 | Nhấn **Sửa** | Mở lại các ô chọn để sửa; chọn lại mẫu số thì loại hình hóa đơn tự cập nhật theo mẫu số mới |
| 6 | Nhấn **Lấy lại mã** (↺) cạnh mã CQT | Call lại API lấy mã CQT trên đường dẫn đã đăng nhập, cập nhật giá trị hiển thị và ghi đè `tax_machine_code` trong `config` |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Bỏ trống mẫu số | "Mẫu số ký hiệu không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Bỏ trống loại hình phát hành hóa đơn | "Loại hình phát hành hóa đơn không được bỏ trống" (lỗi đỏ dưới ô) | Không lưu, giữ nguyên màn hình |
| Cập nhật thành công | "Cập nhật cấu hình hóa đơn điện tử thành công" (toast) | Khóa các ô chọn |

> Không dùng toast tổng khi thiếu dữ liệu — chỉ báo lỗi đỏ dưới từng ô.

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-hddt-007 | Loại hình hóa đơn được xác định theo mẫu số, không do người dùng chọn: mẫu số hóa đơn bán hàng ứng với **một** loại hình là hóa đơn bán hàng; hóa đơn GTGT nhiều thuế suất và một thuế suất có thể dùng chung một mẫu số |
| BR-hddt-008 | Mỗi cửa hàng chỉ chọn **một mẫu số** để phát hành tại một thời điểm, kể cả khi tài khoản HĐĐT có nhiều mẫu số |
| BR-hddt-009 | Mã CQT cấp là giá trị do hệ thống HĐĐT trả về, chỉ đọc; người dùng chỉ có thể yêu cầu lấy lại, không sửa tay |
| BR-hddt-010 | Cửa hàng chỉ phát hành được hóa đơn điện tử khi đã lưu đủ mẫu số và loại hình phát hành |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Phát hành hóa đơn điện tử khi bán hàng | Bán hàng | Cao | Phụ thuộc cấu hình mẫu số + loại hình phát hành. Xóa liên kết hoặc đổi tài khoản khiến cấu hình rỗng, phải cấu hình lại trước khi phát hành (BR-hddt-010) |
| Kết nối cơ quan thuế | Cài đặt > Hóa đơn > Kết nối cơ quan thuế | Trung bình | Dùng chung mã CQT cấp lấy từ hệ thống HĐĐT |
| Cấu hình cách ký hóa đơn (HSM / USB token) | Cài đặt > Hóa đơn | Thấp | Giữ nguyên logic hiện hành, không nằm trong phạm vi thay đổi này |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Hệ thống HĐĐT của nhà cung cấp (EasyInvoice - EI, VNPT, MISA, Viettel...) | `POST {đường dẫn}/api/account/verify` — xác thực tài khoản; API lấy mã CQT; API lấy danh sách mẫu số | Cao | Bổ sung lời gọi xác thực riêng ở bước **Đăng nhập** (`{đường dẫn}/api/account/verify`, vd `https://test7802.softdreams.vn/api/account/verify`) và lời gọi lấy danh sách mẫu số + mã CQT ngay sau khi xác thực thành công, thay vì gọi một lần khi bấm Cập nhật như hiện tại |

---

## 5. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-1 | Cửa hàng đang chạy đã có sẵn tài khoản + mẫu số: sau khi nâng cấp có tự nhận là **đã đăng nhập** (hiện luôn nhãn xanh + phần 2) hay bắt đăng nhập lại một lần? | 2.5, 3.1.3 bước 1 | Dev / Team lead | Trước khi code |
| OQ-2 | Loại hình phát hành hóa đơn có đúng lưu ở khóa `invoice_method` trong bảng `config` không, hay dùng khóa khác? | 2.5, 3.2.3 bước 4 | Dev | Trước khi code |
| OQ-3 | Nút **Lấy lại mã** (↺) cạnh mã CQT có cần thiết không, hay mã CQT chỉ lấy tự động sau đăng nhập? | 3.2.2, 3.2.3 bước 6 | BA / khách hàng | Trước khi code |
| OQ-4 | Đường dẫn con của API lấy **mã CQT** và API lấy **danh sách mẫu số** là gì (tương tự `/api/account/verify`)? | 3.1.3 bước 4, 3.2.3 bước 1 và 6, 4.2 | Dev / nhà cung cấp HĐĐT | Trước khi code |
