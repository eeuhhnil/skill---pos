---
type: srs
feature: quan-ly-kho
platform: mobile
status: draft
lang: vi
owner: "@huelinh"
created: 2026-07-13
updated: 2026-07-13
links: []
tags: [mobile, kho]
stale_reason: ""
changelog:
  - 2026-07-13 | /ba-write-srs | initial draft SRS mobile Quản lý kho (danh sách, thêm mới, chi tiết/sửa, ngừng hoạt động, xóa) từ nghiệp vụ web + prototype mobile
---

# SRS — Quản lý kho trên Mobile

**Mã tài liệu:** SRS-WH-MOB-001  
**Phiên bản:** 1.0  
**Ngày tạo:** 2026-07-13  
**Người soạn:** Duong Thi Hue Linh (@huelinh)  
**Trạng thái:** Draft  
**Nguồn tham chiếu:** Chức năng Quản lý kho trên bản **web** đang vận hành (chưa có SRS web); prototype mobile `giao diện/quan-ly-kho-mobile.html`

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-07-13 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu Quản lý kho cho mobile, đồng bộ nghiệp vụ với bản web | |

---

## MỤC LỤC

1. Nguồn gốc thay đổi
2. Nội dung thay đổi
   - 2.1 Mô tả chung
   - 2.2 Luồng nghiệp vụ
   - 2.3 Yêu cầu người dùng
   - 2.4 Ngữ cảnh người dùng
   - 2.5 Thay đổi CSDL
   - 2.6 Danh sách chức năng
3. Chi tiết các chức năng
4. Nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Chức năng **tạo và quản lý kho** hiện chỉ có trên bản **web**; ứng dụng **mobile** chưa có. Quản lý cửa hàng thao tác phần lớn trên app nên cần đưa nghiệp vụ này lên mobile để tạo, tra cứu, chỉnh sửa và quản lý trạng thái kho ngay trên điện thoại, không phải mở web.

**Mục tiêu:** mang toàn bộ nghiệp vụ quản lý kho của web lên mobile, **giữ nguyên logic backend** (CSDL, business rules), chỉ thiết kế lại giao diện cho màn hình dọc và thao tác chạm.

> **Nguyên tắc:** Tài liệu này đặc tả **giao diện và tương tác trên mobile**. Logic nghiệp vụ, CSDL, ràng buộc dữ liệu **kế thừa nguyên** từ bản web — không lặp lại, chỉ nêu điểm khác biệt của mobile.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung

Bổ sung một **tab "Quản lý kho"** vào màn hình **Kho hàng** trên mobile (đặt **trước** tab Nhập kho). Tab này cho phép người quản lý:

- Xem danh sách kho của cửa hàng (dạng thẻ dọc).
- Tìm kiếm kho theo tên/mã.
- Thêm mới kho.
- Xem và chỉnh sửa chi tiết một kho.
- Ngừng hoạt động / Xóa kho (trừ kho mặc định).

**Phạm vi triển khai (Mobile Ver1):**

| Nhóm | Nội dung |
|---|---|
| **Danh sách & tìm kiếm** | Xem danh sách kho; tìm kiếm theo tên/mã kho |
| **Quản lý kho** | Thêm mới kho; xem & sửa chi tiết; ngừng hoạt động; xóa |

**Không thuộc phạm vi (Ver1):**
- Cột **Thao tác** dạng nhiều icon như web (mobile gom vào menu ⋮ + hành động trong màn chi tiết).
- Báo cáo tồn kho theo kho (thuộc nghiệp vụ khác).

### 2.2 Luồng nghiệp vụ

Luồng nghiệp vụ **giống bản web**, mobile chỉ thay đổi cách trình bày:

```
[Người quản lý - Mobile]                [Hệ thống - dùng chung web]
      |
      | (1) Kho hàng > tab Quản lý kho
      |------------------------------------> Lấy danh sách kho
      |
      | (2) Thêm mới / Sửa kho
      |------------------------------------> Lưu thông tin kho
      |
      | (3) Ngừng hoạt động / Xóa kho
      |------------------------------------> Cập nhật trạng thái / Xóa
      |                                       (kiểm tra ràng buộc)
```

### 2.3 Yêu cầu người dùng

| STT | Tác nhân | Tôi muốn... | Để... | Ưu tiên | FR |
|---|---|---|---|---|---|
| US-M01 | Quản lý cửa hàng | Xem danh sách các kho của cửa hàng | Nắm được cửa hàng đang có những kho nào và kho nào đang hoạt động | Must Have | FR-M01 |
| US-M02 | Quản lý cửa hàng | Tìm kiếm kho theo tên hoặc mã | Nhanh chóng tìm đúng kho khi có nhiều kho | Should Have | FR-M02 |
| US-M03 | Quản lý cửa hàng | Thêm mới kho | Có thêm kho để lưu trữ khi cửa hàng phát sinh nhu cầu | Must Have | FR-M03 |
| US-M04 | Quản lý cửa hàng | Xem và chỉnh sửa thông tin một kho | Cập nhật thông tin kho cho đúng khi có thay đổi | Must Have | FR-M04 |
| US-M05 | Quản lý cửa hàng | Ngừng hoạt động một kho | Tạm dừng sử dụng kho mà vẫn giữ lại dữ liệu | Should Have | FR-M05 |
| US-M06 | Quản lý cửa hàng | Xóa một kho không còn dùng | Dọn dẹp những kho không còn sử dụng | Should Have | FR-M06 |

### 2.4 Ngữ cảnh người dùng

- Người dùng thao tác trên **điện thoại** (màn hình dọc), thường trong lúc vận hành cửa hàng.
- Đối tượng: **chủ / quản lý cửa hàng** có quyền quản lý kho; không có kỹ năng kỹ thuật.
- Yêu cầu thao tác **nhanh, ít bước**, dùng được một tay; ưu tiên danh sách dạng thẻ và chọn nhanh.

### 2.5 Thay đổi CSDL

**Không áp dụng.** Mobile dùng **chung schema và dữ liệu** với web (bảng kho và các bảng liên quan). Không phát sinh bảng/cột mới, không migrate.

### 2.6 Danh sách chức năng

| STT | Mã FR | Tên chức năng | Actor | Màn hình | Ưu tiên |
|---|---|---|---|---|---|
| 1 | FR-M01 | Xem danh sách kho (tab Quản lý kho) | Quản lý cửa hàng | Kho hàng > Quản lý kho | Cao |
| 2 | FR-M02 | Tìm kiếm & lọc kho | Quản lý cửa hàng | Kho hàng > Quản lý kho | Trung bình |
| 3 | FR-M03 | Thêm mới kho | Quản lý cửa hàng | Thêm mới kho | Cao |
| 4 | FR-M04 | Xem & sửa chi tiết kho | Quản lý cửa hàng | Chi tiết kho | Cao |
| 5 | FR-M05 | Ngừng hoạt động kho | Quản lý cửa hàng | Chi tiết kho (menu ⋮) | Trung bình |
| 6 | FR-M06 | Xóa kho | Quản lý cửa hàng | Chi tiết kho (menu ⋮) | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG

> Các mục dưới đây mô tả **giao diện và tương tác trên mobile**. Nội dung dữ liệu từng trường lấy tương đương các cột trên bảng web: Mã kho, Tên kho, Điện thoại, Địa chỉ, Số lượng sản phẩm, Trạng thái, Mô tả.

### FR-M01 — Xem danh sách kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Xem toàn bộ kho của cửa hàng và trạng thái hoạt động |
| **Kích hoạt** | Người dùng vào **Kho hàng** và chọn tab **Quản lý kho** |
| **Tiền điều kiện** | Đã đăng nhập; có quyền quản lý kho |
| **Hậu điều kiện** | Màn hình hiển thị danh sách kho dạng thẻ |

**Bố cục màn hình:**

```
┌────────────────────────────────┐
│ ‹  Kho hàng                 [+] │
├────────────────────────────────┤
│ 🔍 Tên kho, mã kho        [ ⚙ ] │  ← ô tìm kiếm
├────────────────────────────────┤
│ ☰ Quản lý kho │ Nhập kho (3262) │  ← tab (Quản lý kho ĐỨNG TRƯỚC)
│   ▔▔▔▔▔▔▔▔▔                     │     Xuất kho │ Chuyển kho
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ 🏬 WH1        • Đang hoạt động│ │  ← thẻ kho
│ │ Tên kho          Kho bán hàng│ │
│ │ Điện thoại               --  │ │
│ │ Địa chỉ                  --  │ │
│ │ Số lượng sản phẩm      1.450 │ │
│ │ Mô tả                    --  │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 🏬 dutru      • Đang hoạt động│ │
│ │ ...            Kho dự trữ / 30│ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Thêm mới | Button (+) | — | Ở góc phải thanh tiêu đề; click mở màn **Thêm mới kho** (FR-M03) |
| 2 | Ô tìm kiếm | Textbox | — | Placeholder **"Tên kho, mã kho"** (FR-M02) |
| 3 | Tab Quản lý kho | Tab | — | **Đặt trước** tab Nhập kho; đang chọn (gạch xanh) |
| 4 | Mã kho | Text | — | Tiêu đề thẻ, in đậm, kèm icon kho |
| 5 | Trạng thái | Text (màu) | — | • Đang hoạt động (xanh) / • Ngừng hoạt động (đỏ) |
| 6 | Tên kho | Text | — | Tên đầy đủ của kho |
| 7 | Điện thoại | Text | — | Số điện thoại; trống hiển thị `--` |
| 8 | Địa chỉ | Text | — | Địa chỉ kho; trống hiển thị `--` |
| 9 | Số lượng sản phẩm | Number | — | Chỉ đọc; định dạng phân cách nghìn (vd `1.450`) |
| 10 | Mô tả | Text | — | Ghi chú kho; trống hiển thị `--` |

**Khác biệt so với các tab giao dịch (Nhập/Xuất/Chuyển kho):**
- **Ẩn dòng lọc "Lọc theo: Tháng này"** (kho không lọc theo tháng).
- **Ẩn dòng tổng Nhập kho / Xuất kho** (số liệu giao dịch, không áp dụng cho danh sách kho).
- Placeholder ô tìm kiếm đổi thành "Tên kho, mã kho".

**Khác biệt so với web:**
- Danh sách kho dạng **thẻ dọc**, không phải bảng nhiều cột.
- **Không có cột STT** và **không hiển thị cột Thao tác** trên danh sách; thao tác chuyển vào màn Chi tiết kho (FR-M04) và menu ⋮.

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở tab Quản lý kho | Tải và hiển thị danh sách kho; ẩn lọc tháng + tổng nhập/xuất |
| 2 | Chạm vào một thẻ kho | Mở màn **Chi tiết kho** (FR-M04) với dữ liệu kho đó |

**Quy tắc nghiệp vụ:**
- **BR-M02:** Danh sách chỉ hiển thị các kho thuộc **cửa hàng đang đăng nhập**.
- **BR-M03:** Kho đang **Ngừng hoạt động** vẫn hiển thị trong tab Quản lý kho (badge đỏ); tab này liệt kê đủ kho ở mọi trạng thái.

---

### FR-M02 — Tìm kiếm & lọc kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Tìm nhanh kho theo tên/mã và lọc danh sách theo trạng thái |
| **Kích hoạt** | Người dùng nhập ô tìm kiếm hoặc bấm icon bộ lọc ở tab Quản lý kho |
| **Hậu điều kiện** | Danh sách hiển thị theo từ khóa và/hoặc bộ lọc đã áp dụng |

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Ô tìm kiếm | Textbox | — | Placeholder "Tên kho, mã kho"; tìm theo **Tên kho** hoặc **Mã kho**. Nếu không tìm thấy hiển thị "Không có dữ liệu" |
| 2 | Bộ lọc | Icon | — | Click icon bộ lọc → hiển thị màn **Bộ lọc**. Chọn **Áp dụng** → danh sách kho hiển thị theo bộ lọc đã chọn; chọn **Đặt lại** → reset về bộ lọc mặc định. Click icon **arrow right** ở dòng Trạng thái → hiển thị **bottom sheet** để chọn giá trị. Giá trị bộ lọc: **Tất cả / Đang hoạt động / Ngừng hoạt động**. Giá trị mặc định: **Tất cả** |

**Màn hình — Bộ lọc:**

```
┌────────────────────────────────┐
│ ‹  Bộ lọc                        │
├────────────────────────────────┤
│  Trạng thái                   ›  │  ← bấm › mở bottom sheet
│  Tất cả                          │  ← giá trị đang chọn
├────────────────────────────────┤
│   [ Đặt lại ]      [ Áp dụng ]   │  ← cố định đáy
└────────────────────────────────┘

  ── Bottom sheet chọn Trạng thái ──
  ┌────────────────────────────┐
  │ Tất cả                   ✓ │
  │ Đang hoạt động             │
  │ Ngừng hoạt động            │
  └────────────────────────────┘
```

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Nhập từ khóa vào ô tìm kiếm | Lọc danh sách theo tên/mã kho khớp |
| 2 | Xóa từ khóa | Hiển thị lại toàn bộ danh sách |
| 3 | Bấm icon bộ lọc | Mở màn Bộ lọc (mục Trạng thái, mặc định Tất cả) |
| 4 | Bấm arrow right dòng Trạng thái | Hiển thị bottom sheet 3 giá trị |
| 5 | Chọn giá trị + bấm **Áp dụng** | Danh sách hiển thị theo trạng thái đã chọn, đóng màn Bộ lọc |
| 6 | Bấm **Đặt lại** | Bộ lọc về giá trị mặc định (Tất cả) |

**Ngoại lệ:**

| Tình huống | Hiển thị |
|---|---|
| Không có kho khớp từ khóa hoặc bộ lọc | Trạng thái rỗng "Không có dữ liệu" |

**Quy tắc nghiệp vụ:**
- **BR-M04:** Tìm kiếm khớp theo **Tên kho** hoặc **Mã kho**, không phân biệt chữ hoa/thường.
- **BR-M12:** Bộ lọc **Trạng thái** có 3 giá trị (Tất cả / Đang hoạt động / Ngừng hoạt động), mặc định **Tất cả**. Bấm **Áp dụng** lọc danh sách theo giá trị đã chọn; bấm **Đặt lại** đưa bộ lọc về mặc định.

---

### FR-M03 — Thêm mới kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Tạo một kho mới cho cửa hàng |
| **Kích hoạt** | Người dùng bấm nút **[+]** ở thanh tiêu đề màn Kho hàng |
| **Tiền điều kiện** | Đã đăng nhập; có quyền quản lý kho |
| **Hậu điều kiện** | Kho mới được lưu; quay lại danh sách; hiển thị thông báo thành công |
| **Quy tắc NV** | Tên kho bắt buộc; Mã kho để trống sẽ tự sinh, nếu nhập thì không trùng (như web) |

**Màn hình:** toàn màn hình (full-screen) có nút back; nội dung các trường **giống form thêm kho trên web**.

```
┌────────────────────────────────┐
│ ‹  Thêm mới kho                  │
├────────────────────────────────┤
│  Tên kho *                       │
│ [ Tên kho                      ] │
│  Mã kho                          │
│ [ Mã kho                       ] │
│  Mã kho sẽ tự động sinh nếu để   │
│  trống                           │
│  Điện thoại                      │
│ [ Điện thoại                   ] │
│  Địa chỉ                         │
│ [ Địa chỉ                      ] │
│  Mô tả                           │
│ [ Mô tả                        ] │
│  [x] Bán trực tiếp  (i)          │
├────────────────────────────────┤
│        [   Lưu   ]               │
└────────────────────────────────┘
```

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Tên kho | Textbox | Y | Placeholder "Tên kho" |
| 2 | Mã kho | Textbox | — | Placeholder "Mã kho"; **để trống thì hệ thống tự sinh mã**; nếu nhập thì không trùng mã đã có. Ghi chú dưới ô: "Mã kho sẽ tự động sinh nếu để trống" |
| 3 | Điện thoại | Textbox | — | Placeholder "Điện thoại" |
| 4 | Địa chỉ | Textbox | — | Placeholder "Địa chỉ" |
| 5 | Mô tả | Textbox | — | Placeholder "Mô tả" |
| 6 | Bán trực tiếp | Checkbox | — | Có icon thông tin (ⓘ) với tooltip: *"Cho phép kho và sản phẩm trong kho được hiển thị trên màn bán hàng"*. Mặc định **được tích**; nếu bỏ tick, kho không hiển thị trong bộ lọc kho ở màn bán hàng để chọn sản phẩm |
| 7 | Lưu | Button | — | Lưu kho; về danh sách; thông báo thành công |

> Kho mới tạo mặc định **Đang hoạt động**; **Số lượng sản phẩm = 0** (chưa có sản phẩm). *(Xác nhận trạng thái khởi tạo — xem OQ-4.)*

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Bấm nút **[+]** ở màn Kho hàng | Mở màn Thêm mới kho với các trường để trống |
| 2 | Nhập Tên kho (bắt buộc), Mã kho (tùy chọn) và các thông tin khác | Ghi nhận dữ liệu người dùng nhập |
| 3 | Bấm **Lưu** | Kiểm tra hợp lệ (Tên kho bắt buộc; nếu nhập Mã kho thì không trùng); nếu để trống Mã kho → tự sinh mã; lưu kho mới, quay lại danh sách, hiển thị thông báo thành công |
| 4 | Bấm back **‹** khi chưa lưu | Thoát màn Thêm mới, không tạo kho, quay lại danh sách |

**Ngoại lệ:**

| Tình huống | Thông báo |
|---|---|
| Bỏ trống Tên kho | "Vui lòng nhập tên kho" |
| Nhập Mã kho trùng với kho đã có | "Mã kho đã tồn tại. Vui lòng nhập mã khác." |

**Quy tắc nghiệp vụ:**
- **BR-M05:** **Mã kho** để trống khi thêm mới → hệ thống **tự sinh mã**; nếu người dùng nhập thì mã phải **duy nhất** (không trùng kho đã có).
- **BR-M06:** **Tên kho** là trường bắt buộc; **Mã kho** không bắt buộc.
- **BR-M07:** Kho mới khởi tạo ở trạng thái **Đang hoạt động**, Số lượng sản phẩm = 0. *(chờ OQ-4)*
- **BR-M13:** Checkbox **"Bán trực tiếp"** mặc định được tích khi thêm mới. Khi tick, kho và sản phẩm trong kho được hiển thị trên màn bán hàng; nếu bỏ tick, kho **không hiển thị trong bộ lọc kho ở màn bán hàng** (không chọn được sản phẩm của kho để bán).

---

### FR-M04 — Xem & sửa chi tiết kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Xem thông tin chi tiết một kho và cập nhật khi cần |
| **Kích hoạt** | Người dùng chạm vào một thẻ kho ở danh sách (FR-M01) |
| **Tiền điều kiện** | Đã đăng nhập; có quyền quản lý kho |
| **Hậu điều kiện** | Cập nhật thành công; quay lại danh sách; thông báo thành công |

**Màn hình — Chi tiết kho** (full-screen, dữ liệu điền sẵn theo kho được chọn):

```
┌────────────────────────────────┐
│ ‹  Chi tiết kho              ⋮  │  ← ⋮: menu Ngừng hoạt động / Xóa
├────────────────────────────────┤
│  Mã kho *                        │
│  WH1                             │
│  Tên kho *                       │
│  Kho bán hàng                    │
│  Điện thoại                      │
│  Nhập số điện thoại              │
│  Địa chỉ                         │
│  Nhập địa chỉ                    │
│  Mô tả                           │
│  Nhập mô tả                      │
├────────────────────────────────┤
│        [  Cập nhật  ]            │
└────────────────────────────────┘
```

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|---|---|---|---|
| 1 | Mã kho | Textbox | Y | Điền sẵn giá trị hiện tại *(cho sửa hay chỉ đọc — xem OQ-5)* |
| 2 | Tên kho | Textbox | Y | Điền sẵn; cho sửa |
| 3 | Điện thoại | Textbox | — | Điền sẵn; trống thì hiện placeholder "Nhập số điện thoại" |
| 4 | Địa chỉ | Textbox | — | Điền sẵn; trống thì hiện placeholder "Nhập địa chỉ" |
| 5 | Mô tả | Textbox | — | Điền sẵn; trống thì hiện placeholder "Nhập mô tả" |
| 6 | Menu ⋮ | Icon (3 chấm dọc) | — | Mở menu thao tác: **Ngừng hoạt động** (FR-M05), **Xóa** (FR-M06) |
| 7 | Cập nhật | Button | — | Lưu thay đổi; về danh sách; thông báo thành công |

**Không hiển thị trường Số lượng sản phẩm trong form cập nhật** — số lượng chỉ để xem, hiển thị ở thẻ danh sách (FR-M01).

**Không hiển thị trường Trạng thái trong form** — trạng thái chỉ thay đổi qua hành động Ngừng hoạt động ở menu ⋮ (không chọn tay).

**Quy tắc menu ⋮ theo loại kho (BR-M01):**

| Loại kho | Sửa (Cập nhật) | Ngừng hoạt động | Xóa |
|---|:---:|:---:|:---:|
| **Kho mặc định** (vd Kho bán hàng) | ✔ | ✘ (ẩn) | ✘ (ẩn) |
| Kho thường | ✔ | ✔ | ✔ |

> Với kho mặc định, menu ⋮ **không hiển thị** hai mục Ngừng hoạt động và Xóa (chỉ còn chỉnh sửa qua form).

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Chạm thẻ kho | Mở màn chi tiết, đổ dữ liệu kho |
| 2 | Sửa trường, bấm Cập nhật | Kiểm tra hợp lệ, lưu, về danh sách, thông báo thành công |
| 3 | Bấm ⋮ | Mở menu; kho mặc định chỉ có form sửa (không hiện Ngừng/Xóa) |

**Ngoại lệ:** như FR-M03 (thiếu trường bắt buộc, trùng mã kho).

**Quy tắc nghiệp vụ:**
- **BR-M01:** Kho mặc định chỉ được **chỉnh sửa**; không được Ngừng hoạt động và Xóa (menu ⋮ ẩn hai mục này).
- **BR-M05:** Khi sửa **Mã kho**, giá trị mới vẫn phải là duy nhất (không trùng kho khác).
- **BR-M08:** **Số lượng sản phẩm** do hệ thống tự tính, **chỉ để xem** — hiển thị ở thẻ danh sách (FR-M01), **không xuất hiện trong form cập nhật**.
- **BR-M09:** Trạng thái kho **không đổi trong form**; chỉ thay đổi qua hành động Ngừng hoạt động / Kích hoạt lại ở menu ⋮.

---

### FR-M05 — Ngừng hoạt động kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Chuyển kho sang trạng thái Ngừng hoạt động (không xóa dữ liệu) |
| **Kích hoạt** | Trong màn Chi tiết kho, bấm ⋮ > **Ngừng hoạt động** |
| **Hậu điều kiện** | Trạng thái kho chuyển "Ngừng hoạt động"; thông báo thành công |
| **Quy tắc NV** | **BR-M01** — Không áp dụng cho kho mặc định (menu ẩn mục này) |

- Trạng thái kho tự chuyển sang **Ngừng hoạt động** (badge đỏ ở danh sách); không cần người dùng chọn tay ở form.
- Ảnh hưởng của việc ngừng hoạt động tới các nghiệp vụ dùng kho (nhập/xuất/chuyển/bán hàng) — *xem OQ-2.*

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Trong màn Chi tiết kho, bấm **⋮** | Hiển thị menu thao tác (Ngừng hoạt động / Xóa) |
| 2 | Chọn **Ngừng hoạt động** | Chuyển trạng thái kho sang Ngừng hoạt động, hiển thị thông báo thành công |
| 3 | Quay lại danh sách | Kho hiển thị badge đỏ "Ngừng hoạt động" |

**Ngoại lệ:**

| Tình huống | Hành động hệ thống |
|---|---|
| Kho là kho mặc định | Mục "Ngừng hoạt động" **không xuất hiện** trong menu ⋮ |

**Quy tắc nghiệp vụ:**
- **BR-M01:** Không áp dụng cho kho mặc định (menu ⋮ ẩn mục Ngừng hoạt động).
- **BR-M10:** Ngừng hoạt động chỉ đổi trạng thái, **không xóa dữ liệu**; kho có thể được kích hoạt lại sau đó. *(cơ chế kích hoạt lại — chờ xác nhận)*
- **BR-M03 (liên quan):** Kho đã ngừng vẫn nằm trong tab Quản lý kho; ảnh hưởng tới dropdown chọn kho ở các nghiệp vụ khác — *chờ OQ-2.*

---

### FR-M06 — Xóa kho (Mobile)

| Mục | Nội dung |
|---|---|
| **Mục đích** | Xóa một kho không còn sử dụng |
| **Kích hoạt** | Trong màn Chi tiết kho, bấm ⋮ > **Xóa** |
| **Hậu điều kiện** | Xóa thành công hoặc báo lỗi nếu không đủ điều kiện |
| **Quy tắc NV** | **BR-M01** — Không áp dụng cho kho mặc định (menu ẩn mục này) |

**Popup xác nhận** (bottom-sheet / dialog mobile):

| # | Thành phần | Loại | Mô tả |
|---|---|---|---|
| 1 | Thông báo | Text | "Bạn có chắc chắn muốn xóa kho này?" |
| 2 | Xóa | Button (đỏ) | Thực hiện xóa; thông báo thành công |
| 3 | Hủy bỏ | Button | Đóng popup, giữ nguyên |

**Xử lý tương tác:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Trong màn Chi tiết kho, bấm **⋮** | Hiển thị menu thao tác (Ngừng hoạt động / Xóa) |
| 2 | Chọn **Xóa** | Hiển thị popup xác nhận xóa |
| 3 | Bấm **Xóa** trong popup | Kiểm tra điều kiện; nếu hợp lệ: xóa kho, đóng popup, quay lại danh sách, thông báo thành công; nếu không đủ điều kiện: báo lỗi, giữ nguyên |
| 4 | Bấm **Hủy bỏ** | Đóng popup, giữ nguyên kho |

**Ngoại lệ:**

| Tình huống | Hành động hệ thống |
|---|---|
| Kho là kho mặc định | Mục "Xóa" **không xuất hiện** trong menu ⋮ |
| Kho đã có sản phẩm / phát sinh giao dịch | Báo lỗi, không cho xóa *(điều kiện chính xác — xem OQ-3)* |

**Quy tắc nghiệp vụ:**
- **BR-M01:** Không áp dụng cho kho mặc định (menu ⋮ ẩn mục Xóa).
- **BR-M11:** Chỉ được xóa kho khi **không còn sản phẩm / tồn / giao dịch phát sinh**; nếu vi phạm, hệ thống báo lỗi và không xóa. *(điều kiện chính xác — chờ OQ-3)*

---

## 4. NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình (mobile) | Mức độ | Mô tả ảnh hưởng |
|---|---|---|---|
| Kho hàng | Màn Kho hàng | Cao | Bổ sung tab **Quản lý kho** đặt trước Nhập kho; ẩn lọc tháng + tổng nhập/xuất khi ở tab này |
| Nhập / Xuất / Chuyển kho | Các màn giao dịch kho | Trung bình | Dropdown chọn kho lấy từ danh sách kho **đang hoạt động** (kho ngừng hoạt động không hiển thị — *chờ OQ-2*) |
| Bán hàng | Chọn kho bán | Thấp | Kho ngừng hoạt động ảnh hưởng danh sách kho chọn được (*chờ OQ-2*) |

### 4.2 Chức năng hệ thống khác (API)

Mobile **dùng chung API với web** — không phát sinh API mới. Danh mục API cụ thể (lấy danh sách kho, tạo/sửa/xóa/đổi trạng thái kho) kế thừa từ backend web hiện có.

---

## OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người trả lời | Trạng thái |
|---|---|---|---|---|
| OQ-1 | Cách hệ thống nhận biết **kho mặc định** (cờ dữ liệu nào)? Có nhiều hơn một kho mặc định không? | FR-M04, BR-M01 | PO / Dev | [ ] |
| OQ-2 | Khi kho **Ngừng hoạt động**, kho đó còn xuất hiện trong dropdown chọn kho ở nhập/xuất/chuyển/bán hàng không? | FR-M05, Mục 4.1 | PO | [ ] |
| OQ-3 | Điều kiện được phép **Xóa** kho là gì (kho rỗng, không có tồn, không có giao dịch)? Thông báo lỗi cụ thể? | FR-M06 | PO / Dev | [ ] |
| OQ-4 | Kho mới tạo mặc định trạng thái **Đang hoạt động** và Số lượng sản phẩm = 0 đúng không? Màn Thêm mới có cần chọn trạng thái ban đầu? | FR-M03 | PO / Designer | [ ] |
| OQ-5 | Trường **Mã kho** khi sửa có cho phép chỉnh không, hay chỉ đọc sau khi tạo? | FR-M04 | PO | [ ] |
| OQ-6 | "**Số lượng sản phẩm**" là tổng số **mặt hàng (SKU)** trong kho hay tổng **số lượng tồn**? | FR-M01, FR-M04 | PO | [ ] |
| OQ-7 | Checkbox **"Bán trực tiếp"** ở form thêm/sửa kho có ý nghĩa gì, tác động nghiệp vụ nào? Luôn mặc định tích? | FR-M03, FR-M04 | PO | [x] Đã chốt: bật = kho và sản phẩm hiển thị trên màn bán hàng; bỏ tick = kho bị ẩn khỏi bộ lọc kho khi bán, không chọn được sản phẩm. Mặc định tích. |

---

*Hết tài liệu*
