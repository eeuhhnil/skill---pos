---
type: srs
feature: doi-tac-mac-dinh
status: draft
lang: vi
owner: "@huelinh"
created: 2026-07-06
updated: 2026-07-06
links: []
tags: [thue, hoa-don, mac-dinh]
changelog:
  - 2026-07-06 | /ba-write-srs | initial draft từ elicit session tách đối tác mặc định
---

# SRS — Tách đối tác mặc định (bán hàng vs nhập kho)

**Mã tài liệu:** SRS-DTMD-001
**Phiên bản:** 1.0
**Ngày tạo:** 2026-07-06
**Người soạn:** Duong Thi Hue Linh (@huelinh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A/M/D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|---|---|---|---|---|---|---|
| 2026-07-06 | Toàn bộ | A | Quy định pháp luật (Thuế) | @huelinh | Tạo mới tài liệu | |

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
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

Quy định mới của cơ quan Thuế: khi người mua **không cung cấp thông tin**, tên người mua trên chứng từ bán phải ghi **"Bán cho người tiêu dùng"** (thay cho "Khách lẻ" đang dùng).

Hệ thống hiện dùng chung một đối tác mặc định "Khách lẻ" (mã KH16, loại *Khách hàng và Nhà cung cấp*) cho cả bán hàng lẫn nhập kho. Cần tách thành hai mặc định riêng để đáp ứng quy định và phản ánh đúng vai trò từng nghiệp vụ.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

Tách một đối tác mặc định dùng chung thành **hai mặc định riêng theo nghiệp vụ**:

- **Bán hàng:** người mua không cung cấp thông tin thì Tên người mua mặc định là **"Bán cho người tiêu dùng"**, không cần mã/tên đơn vị.
- **Nhập kho:** dùng đối tác mặc định loại **Nhà cung cấp** (record master mới, tách khỏi khách hàng bán).

Thay đổi áp dụng cho tất cả chứng từ bán hàng. Chứng từ đã lập trước thời điểm thay đổi giữ nguyên tên "Khách lẻ" (không hồi tố).

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**
1. Lập chứng từ bán hoặc phiếu nhập kho.
2. Nếu không chọn đối tác cụ thể, hệ thống gắn mặc định "Khách lẻ" (KH16, loại Khách hàng và Nhà cung cấp) cho cả hai loại chứng từ.
3. Tên người mua trên hóa đơn hiển thị "Khách lẻ".

**Luồng mới (To-Be):**
1. Lập chứng từ **bán hàng**:
   - Nếu người mua không cung cấp thông tin, Tên người mua mặc định = **"Bán cho người tiêu dùng"** (không cần mã đơn vị).
   - Người dùng có thể sửa Tên người mua sang tên thật khi khách cung cấp thông tin.
   - Nếu người dùng xóa trắng Tên người mua, khi lưu hệ thống tự điền lại "Bán cho người tiêu dùng".
2. Lập **phiếu nhập kho**:
   - Nếu không chọn nhà cung cấp cụ thể, hệ thống gắn đối tác mặc định loại **Nhà cung cấp**.
3. Chứng từ bán đã lập trước thay đổi: giữ nguyên "Khách lẻ" (snapshot tại thời điểm lập).

### 2.3 Yêu cầu người dùng

- Người dùng (kế toán / thu ngân) muốn khi bán cho khách không lấy thông tin, tên người mua **tự động** là "Bán cho người tiêu dùng" để đúng quy định Thuế mà không phải nhập tay.
- Người dùng muốn vẫn **sửa được** Tên người mua khi khách có cung cấp tên, nhưng hệ thống **không cho để trống** để tránh hóa đơn thiếu thông tin bắt buộc.
- Người dùng muốn nghiệp vụ **nhập kho tách riêng** với đối tác mặc định là Nhà cung cấp, không lẫn với khách bán hàng.
- Người dùng muốn chứng từ cũ **không bị thay đổi** tên đối tác đã ghi.

### 2.4 Ngữ cảnh người dùng

Đối tượng chính là **kế toán và thu ngân** tại điểm bán, lập chứng từ bán hàng trên phần mềm (web/desktop). Tình huống phổ biến: khách lẻ mua hàng không lấy hóa đơn có thông tin, nhân viên bán nhanh trong giờ cao điểm — mặc định "Bán cho người tiêu dùng" giúp xuất chứng từ hợp lệ mà không dừng thao tác. Nghiệp vụ nhập kho do bộ phận kho/mua hàng thực hiện, cần gắn nhà cung cấp.

### 2.5 Mô tả thay đổi về CSDL

| Loại thay đổi | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|---|---|---|---|---|
| A | (master đối tác) | — | — | — | Thêm 1 record master **Nhà cung cấp mặc định** cho nhập kho (dữ liệu, chưa chốt mã/tên — xem OQ-1). |
| M | (cấu hình mặc định) | mặc định người mua chứng từ bán | — | — | Giá trị mặc định Tên người mua chứng từ bán đổi từ "Khách lẻ" sang "Bán cho người tiêu dùng". |

> Ghi chú: đây là thay đổi ở mức **dữ liệu master + cấu hình mặc định**, không thay đổi cấu trúc bảng. Chi tiết cấu hình cần dev xác nhận khi triển khai. Record KH16 xử lý ra sao (giữ/archive) — xem OQ-2.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Kế toán / Thu ngân | Lập chứng từ bán hàng | Mặc định Tên người mua | Tự điền "Bán cho người tiêu dùng" khi khách không cung cấp thông tin; sửa được, không để trống | Cao |
| Kho / Mua hàng | Lập phiếu nhập kho | Đối tác mặc định nhập kho | Gắn đối tác mặc định loại Nhà cung cấp khi không chọn NCC cụ thể | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Mặc định Tên người mua trên chứng từ bán hàng

#### 3.1.1 Thông tin chung về chức năng

Chức năng đảm bảo mọi chứng từ bán hàng luôn có Tên người mua hợp lệ theo quy định Thuế. Khi khách không cung cấp thông tin, hệ thống tự điền "Bán cho người tiêu dùng". Áp dụng cho **tất cả** loại chứng từ bán hàng. Người dùng được điều chỉnh tên người mua theo thông tin khách cung cấp, nhưng không được để trống trường này.

#### 3.1.2 Màn hình chức năng

Áp dụng tại màn hình lập chứng từ bán hàng, ở khu vực thông tin người mua.

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Tên người mua | Text | Theo chuẩn tên hiện hành | Có | Mặc định "Bán cho người tiêu dùng" khi khách không cung cấp thông tin. Cho phép sửa sang tên thật. Không cho lưu khi để trống — tự điền lại giá trị mặc định. |
| 2 | Mã đơn vị | Text | Theo chuẩn hiện hành | Không | Không bắt buộc với trường hợp "Bán cho người tiêu dùng" (không có mã/tên đơn vị). |

#### 3.1.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Mở màn lập chứng từ bán, không chọn khách / khách không cung cấp thông tin | Tên người mua hiển thị mặc định "Bán cho người tiêu dùng" | Chứng từ bán hàng |
| 2 | Nhập tên người mua thật (khách có cung cấp) | Nhận giá trị người dùng nhập, thay cho mặc định | Khách cung cấp thông tin |
| 3 | Xóa trắng ô Tên người mua rồi lưu | Tự điền lại "Bán cho người tiêu dùng" trước khi lưu | Ô để trống khi lưu |
| 4 | Lưu chứng từ | Ghi nhận Tên người mua hiện tại vào chứng từ (snapshot) | — |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Xóa trắng Tên người mua rồi lưu | (Không chặn) | Tự điền lại "Bán cho người tiêu dùng", cho lưu bình thường |

#### 3.1.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện:** Tự điền giá trị mặc định Tên người mua
  - **Điều kiện kích hoạt:** Lập chứng từ bán hàng mà Tên người mua đang trống (chưa chọn/nhập khách).
  - **Xử lý:** Gán Tên người mua = "Bán cho người tiêu dùng".
  - **Output:** Chứng từ có Tên người mua hợp lệ, không cần mã đơn vị.

- **Sự kiện:** Snapshot tên đối tác khi lưu chứng từ
  - **Điều kiện kích hoạt:** Lưu chứng từ bán.
  - **Xử lý:** Ghi cố định Tên người mua tại thời điểm lập; thay đổi mặc định sau này không hồi tố chứng từ cũ.
  - **Output:** Chứng từ cũ giữ nguyên "Khách lẻ"; chứng từ mới dùng "Bán cho người tiêu dùng".

---

### 3.2 Đối tác mặc định cho nhập kho

#### 3.2.1 Thông tin chung về chức năng

Tách nghiệp vụ nhập kho khỏi mặc định dùng chung. Khi lập phiếu nhập kho mà không chọn nhà cung cấp cụ thể, hệ thống gắn đối tác mặc định loại **Nhà cung cấp** (record master mới, riêng biệt với khách hàng bán).

#### 3.2.2 Màn hình chức năng

Áp dụng tại màn hình lập phiếu nhập kho, ở khu vực chọn nhà cung cấp.

| # | Thành phần | Loại | Kích thước tối đa | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Nhà cung cấp | Dropdown / chọn đối tác | — | Theo cấu hình nhập kho | Mặc định gắn đối tác Nhà cung cấp mặc định khi không chọn NCC cụ thể. |

#### 3.2.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|---|---|---|---|
| 1 | Lập phiếu nhập kho, không chọn NCC | Gắn đối tác Nhà cung cấp mặc định | Phiếu nhập kho |
| 2 | Chọn NCC cụ thể | Nhận NCC người dùng chọn, thay mặc định | Có NCC cụ thể |

#### 3.2.4 Xử lý luồng sự kiện hệ thống

- **Sự kiện:** Gán nhà cung cấp mặc định
  - **Điều kiện kích hoạt:** Lập phiếu nhập kho không chọn NCC.
  - **Xử lý:** Gán đối tác Nhà cung cấp mặc định (record master mới).
  - **Output:** Phiếu nhập kho có nhà cung cấp hợp lệ.

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Bán hàng | Lập chứng từ bán hàng | Cao | Đổi giá trị mặc định Tên người mua sang "Bán cho người tiêu dùng"; ràng buộc không để trống. |
| Nhập kho | Lập phiếu nhập kho | Trung bình | Đối tác mặc định tách sang Nhà cung cấp riêng. |
| Quản lý khách hàng / đối tác | Danh sách + cập nhật khách hàng | Trung bình | Xử lý record KH16 (loại kép) và thêm record Nhà cung cấp mặc định. |
| Xuất hóa đơn điện tử | Phát hành hóa đơn | Cao | Tên người mua trên hóa đơn lấy theo giá trị mới. |

### 4.2 Chức năng của hệ thống khác

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Hệ thống hóa đơn điện tử / CQT | (phát hành hóa đơn) | Trung bình | Trường tên người mua truyền sang phải là "Bán cho người tiêu dùng" khi khách không cung cấp thông tin — cần đảm bảo đúng chuẩn dữ liệu Thuế. |

---

## OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-1 | Record Nhà cung cấp mặc định mới có **mã đơn vị + tên** hiển thị là gì? | 2.5, 3.2 | BA / Kế toán | TBD |
| OQ-2 | Record KH16 (loại kép) sau khi tách: **giữ** hay **archive**? Dữ liệu chứng từ cũ trỏ KH16 xử lý ra sao? | 2.5, 4.1 | BA | TBD |
| OQ-3 | Chứng từ **trả hàng bán** có tính là "chứng từ bán hàng" để áp mặc định "Bán cho người tiêu dùng" không? | 2.2, 3.1 | Kế toán | TBD |
| OQ-4 | Người mua cung cấp **một phần** thông tin (vd chỉ tên, không MST) thì hiển thị / xử lý thế nào? | 3.1 | Kế toán / Thuế | TBD |
