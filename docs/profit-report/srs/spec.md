---
type: srs
feature: profit-report
status: draft
lang: vi
owner: "@huelinh"
created: 2026-07-14
updated: 2026-07-15
version: "1.0"
priority: P1
links: []
tags: [report, profit, warehouse]
stale_reason: ""
changelog:
  - 2026-07-15 | /srs | chốt doanh thu=bill.total_amount, giá vốn=bill_product.total_cogs; resolve OQ-02, OQ-05
  - 2026-07-14 | /srs | thêm 2 tab + thanh công cụ, chốt OQ-04 (xuất PDF/Excel)
  - 2026-07-14 | /srs | initial draft SRS báo cáo lợi nhuận tổng
---

# Tài liệu SRS — Báo cáo lợi nhuận tổng

**Mã tài liệu:** SRS-PROFIT-REPORT-001
**Phiên bản:** 1.0
**Ngày tạo:** 14/07/2026
**Người soạn:** @huelinh (Duong Thi Hue Linh)
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|---------|----------------|---------|
| 14/07/2026 | Toàn bộ | A | Cải tiến hệ thống | @huelinh | Tạo mới tài liệu | |

---

## MỤC LỤC

1. Nguồn gốc thay đổi
2. Nội dung thay đổi
   - 2.1 Mô tả chung về yêu cầu thay đổi
   - 2.2 Mô tả thay đổi về luồng nghiệp vụ
   - 2.3 Yêu cầu người dùng
   - 2.4 Ngữ cảnh người dùng
   - 2.5 Danh sách các chức năng
3. Chi tiết các chức năng thay đổi
   - 3.1.5 Quy tắc nghiệp vụ
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Open Questions

---

## 1. NGUỒN GỐC THAY ĐỔI

Bổ sung mới báo cáo lợi nhuận tổng, cho phép người dùng theo dõi doanh thu – giá vốn – lợi nhuận gộp theo kỳ và bung xuống chi tiết từng hóa đơn. Báo cáo phụ thuộc chức năng tính giá xuất kho (giá vốn), phải triển khai sau khi chức năng đó hoàn thiện thì số liệu mới đúng.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

- Thêm **báo cáo lợi nhuận tổng**: hiển thị Tổng doanh thu, Tổng giá vốn, Lợi nhuận gộp, Tỷ suất lợi nhuận theo kỳ.
- Hỗ trợ xem theo nhiều cấp thời gian: bấm vào một dòng thời gian để **điều hướng sang màn cấp chi tiết hơn** (bấm tháng → màn theo ngày; bấm ngày → màn chi tiết theo hóa đơn).
- Chỉ hiển thị kỳ (tháng/ngày) **có phát sinh dữ liệu**.
- Màn hình gồm **2 tab**: **Báo cáo** (bảng biểu) và **Biểu đồ** (trực quan hóa — đặc tả bổ sung sau, xem OQ-06).
- Thanh công cụ: nút **Chọn tham số**, **Làm mới dữ liệu**, **Kết xuất PDF**, **Kết xuất Excel**. Có tiêu đề báo cáo kèm dòng khoảng thời gian ("Từ ngày … đến ngày …").

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**
1. Hệ thống hiện mới có **báo cáo lợi nhuận theo hàng hóa** (theo sản phẩm), **chưa có báo cáo lợi nhuận tổng** theo thời gian.
2. Người dùng chưa xem được tổng doanh thu – giá vốn – lợi nhuận gộp tổng hợp theo kỳ (năm/quý/tháng/ngày) trên một màn hình, cũng chưa bung được xuống chi tiết theo hóa đơn.

**Luồng mới (To-Be):**
1. Người dùng mở màn hình Báo cáo lợi nhuận tổng (mặc định kỳ = hôm nay).
2. Người dùng mở popup **Chọn tham số**, chọn kỳ báo cáo, chi nhánh, khoảng từ ngày – đến ngày, tùy chọn **Tách lợi nhuận Combo theo từng thành phần**, rồi bấm **Xem báo cáo**.
3. Hệ thống hiển thị bảng tổng hợp theo cấp thời gian tương ứng với kỳ chọn (chỉ hiện kỳ có dữ liệu).
4. Người dùng bấm vào một dòng thời gian để chuyển sang màn cấp nhỏ hơn (Năm → Tháng → Ngày; Quý/Tháng/Tuần → Ngày).
5. Tại cấp ngày, người dùng bấm vào một ngày để xem **báo cáo chi tiết theo hóa đơn** của ngày đó.

### 2.3 Yêu cầu người dùng

- Người dùng muốn xem nhanh lợi nhuận gộp và tỷ suất lợi nhuận theo kỳ để đánh giá hiệu quả kinh doanh.
- Người dùng muốn bung từ tổng thể xuống chi tiết từng ngày, từng hóa đơn để truy nguồn số liệu.
- Người dùng muốn số liệu loại bỏ các dòng không phải hàng hóa (chiết khấu, phí, dịch vụ, vận chuyển…) khi tính giá vốn để lợi nhuận phản ánh đúng.

### 2.4 Ngữ cảnh người dùng

Đối tượng sử dụng chính là kế toán, chủ cửa hàng, quản lý chi nhánh. Báo cáo được tra cứu định kỳ (cuối ngày, cuối kỳ) sau khi đã thực hiện tính giá xuất kho cho kỳ tương ứng.

### 2.5 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|-------|---------|-----------|-------|-----------|
| Kế toán / Quản lý | Báo cáo lợi nhuận tổng | Xem báo cáo tổng theo thời gian | Hiển thị tổng doanh thu, giá vốn, lợi nhuận gộp, tỷ suất theo cấp thời gian; drill-down đa cấp | Cao |
| Kế toán / Quản lý | Chi tiết lợi nhuận theo hóa đơn | Xem chi tiết theo hóa đơn | Bung từ cấp ngày ra danh sách hóa đơn phát sinh | Cao |
| Kế toán / Quản lý | Báo cáo lợi nhuận tổng (tab Biểu đồ) | Xem biểu đồ lợi nhuận | Trực quan hóa số liệu lợi nhuận theo kỳ (đặc tả bổ sung sau — OQ-06) | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Báo cáo lợi nhuận tổng (theo thời gian)

#### 3.1.1 Thông tin chung về chức năng

Chức năng cho phép kế toán/quản lý xem tổng hợp lợi nhuận gộp theo kỳ. Màn hình hiển thị bảng theo cấp thời gian phù hợp với kỳ được chọn; mỗi dòng thể hiện Tổng doanh thu, Tổng giá vốn, Lợi nhuận gộp và Tỷ suất lợi nhuận. Người dùng có thể bung dần xuống cấp thời gian nhỏ hơn cho tới cấp ngày, sau đó xem chi tiết theo hóa đơn.

#### 3.1.2 Màn hình chức năng

Màn hình gồm **2 tab**: **Báo cáo** (bảng biểu — mô tả dưới đây) và **Biểu đồ** (đặc tả bổ sung sau — OQ-06). Trên cùng có tiêu đề báo cáo kèm dòng khoảng thời gian đang xem ("Từ ngày … đến ngày …").

**a) Thanh công cụ**

| # | Thành phần | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | Chọn tham số | Button | Mở popup bộ lọc tham số (kỳ báo cáo, chi nhánh, từ ngày – đến ngày, tách lợi nhuận combo) |
| 2 | Làm mới dữ liệu | Button | Tải lại số liệu theo tham số hiện tại |
| 3 | Kết xuất PDF | Button | Xuất báo cáo ra file PDF |
| 4 | Kết xuất Excel | Button | Xuất báo cáo ra file Excel |

**b) Popup Chọn tham số (bộ lọc)**

| # | Thành phần | Loại | Bắt buộc | Mô tả |
|---|-----------|------|---------|-------|
| 1 | Kỳ báo cáo | Combobox | Có | Mặc định **hôm nay**. Giá trị: hôm nay, hôm qua, tuần này, tuần trước, tháng này, tháng trước, 30 ngày qua, quý này, quý trước, năm nay, năm trước, tháng 1–12, tùy chỉnh *(danh sách kế thừa báo cáo theo sản phẩm — xem OQ-03)* |
| 2 | Chi nhánh | Combobox | Có | Chọn chi nhánh theo phân quyền; mặc định chi nhánh đang truy cập |
| 3 | Từ ngày – đến ngày | Datepicker | Có | Tự fill theo kỳ báo cáo; cho phép chỉnh lại. Điều kiện: Đến ngày ≥ Từ ngày; Từ ngày ≤ ngày hiện tại |
| 4 | Tách lợi nhuận Combo theo từng thành phần | Checkbox | Không | Mặc định **tắt**. Bật/tắt cách tính combo khi tổng hợp doanh thu/giá vốn (xem BR-profit-report-008) |

Nút trong popup: **Đóng** (bỏ qua) · **Xem báo cáo** (áp tham số, tải dữ liệu).

**c) Bảng dữ liệu tổng hợp**

| STT | Tên trường | Loại control | Công thức | Mô tả |
|-----|-----------|--------------|-----------|-------|
| 1 | Thời gian | Text/Link | — | Nhãn kỳ theo cấp đang xem (năm/tháng/ngày). Bấm để điều hướng sang màn cấp kế tiếp hoặc mở chi tiết hóa đơn |
| 2 | Tổng doanh thu | Text | `sum(bill.total_amount)` | Tổng doanh thu theo kỳ (cấp hóa đơn), lọc trạng thái theo BR-profit-report-003 |
| 3 | Tổng giá vốn | Text | `sum(bill_product.total_cogs)` | Của tất cả sản phẩm trong kỳ, loại mã sản phẩm hệ thống (BR-profit-report-004) |
| 4 | Lợi nhuận gộp | Text | `Tổng doanh thu − Tổng giá vốn` | Lợi nhuận gộp theo kỳ |
| 5 | Tỷ suất lợi nhuận (%) | Text | `Lợi nhuận gộp / Tổng doanh thu × 100` | Tỷ suất lợi nhuận trên doanh thu |

Ví dụ dòng tổng: Thời gian `01/07/2026` — Tổng doanh thu 400.000 — Tổng giá vốn 100.000 — Lợi nhuận gộp 300.000 — Tỷ suất 75%.

**d) Màn cấp chi tiết (khi điều hướng xuống cấp con)**

Khi bấm vào một dòng thời gian để xuống cấp con (tháng, ngày), hệ thống mở màn bảng của cấp đó với các thành phần:

| STT | Tên trường | Loại control | Mô tả |
|-----|-----------|--------------|-------|
| 1 | Breadcrumb | Text/Link | Đường dẫn phân cấp thể hiện vị trí hiện tại trong chuỗi điều hướng, hiển thị từ cấp gốc đến cấp đang xem, các mắt xích ngăn cách bằng dấu `›`. Ví dụ đang ở cấp ngày của tháng 6/2026: `Năm 2026 › Tháng 06/2026`. Mỗi mắt xích phía trước (trừ cấp hiện tại) là link bấm được để nhảy thẳng về đúng cấp đó; mắt xích cuối cùng là cấp đang xem, in đậm và không bấm. Breadcrumb tự cập nhật mỗi khi người dùng điều hướng xuống cấp con hoặc quay lại cấp trên |
| 2 | Quay lại | Button | Góc trên bên phải; trở về cấp liền trước |
| 3 | Tiêu đề theo cấp | Text | Ví dụ "BÁO CÁO LỢI NHUẬN THEO NGÀY — THÁNG 06/2026" |
| 4 | Dòng phụ tiêu đề | Text | "Kỳ báo cáo: Từ ngày … đến ngày … · Chi nhánh …" |
| 5 | Dòng "Tổng" | Text/Row | Ở đầu bảng; tổng hợp Doanh thu / Tổng giá vốn / Lợi nhuận gộp / Tỷ suất LN (%) của toàn cấp |
| 6 | Danh sách kỳ con | List/Link | Từng kỳ con (chỉ hiển thị kỳ có dữ liệu); bấm để xuống cấp nhỏ hơn hoặc mở chi tiết theo hóa đơn |

#### 3.1.3 Xử lý luồng sự kiện tương tác (điều hướng theo cấp thời gian)

Bấm vào một dòng thời gian sẽ **mở màn bảng của cấp thời gian kế tiếp** — điều hướng sang màn mới (có breadcrumb dạng "Năm 2026 › Tháng 06/2026" và nút **Quay lại**), không phải mở rộng cây tại chỗ. Cấp hiển thị phụ thuộc kỳ chọn:

| Kỳ chọn | Cấp hiển thị đầu tiên | Chuỗi điều hướng |
|---------|----------------------|------------------|
| Năm | Tháng | Năm → **Tháng** → Ngày → Chi tiết hóa đơn |
| Quý | Ngày | Quý → **Ngày** → Chi tiết hóa đơn |
| Tháng | Ngày | Tháng → **Ngày** → Chi tiết hóa đơn |
| Tuần | Ngày | Tuần → **Ngày** → Chi tiết hóa đơn |

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Chọn kỳ = Năm, xác nhận | Hiển thị danh sách **tháng có dữ liệu** trong năm | — |
| 2 | Bấm vào một tháng | Hiển thị danh sách **ngày có dữ liệu** trong tháng | — |
| 3 | Bấm vào một ngày | Mở **báo cáo chi tiết theo hóa đơn** của ngày đó (chức năng 3.2) | — |
| 4 | Chọn kỳ = Quý/Tháng/Tuần, xác nhận | Hiển thị thẳng danh sách **ngày có dữ liệu** | — |

**Quy tắc hiển thị:** mọi cấp (tháng, ngày) **chỉ hiển thị kỳ có phát sinh giao dịch**; kỳ không có dữ liệu thì ẩn.

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo / Hành vi | Hành động hệ thống |
|-----------|--------------------|-------------------|
| Kỳ chọn không có dữ liệu | Hiển thị bảng rỗng / thông báo "Không có dữ liệu" | Không hiển thị dòng nào |
| Từ ngày > Đến ngày | Cảnh báo điều kiện thời gian | Không truy vấn |
| Đến ngày > ngày hiện tại | Cảnh báo, chặn chọn | Không truy vấn |

#### 3.1.4 Xử lý luồng sự kiện hệ thống

- **Tổng hợp số liệu theo trạng thái đơn:** hệ thống chỉ tính các đơn theo công thức dấu **`bill.status = 1 + 3 − 4 + 6`** (xem BR-02, BR-03). Đơn trạng thái 4 (trả hàng) mang giá trị âm.
- **Loại sản phẩm hệ thống khi tính Tổng giá vốn:** bỏ qua các dòng `bill_product` có `product.code` thuộc danh sách mã hệ thống (xem BR-profit-report-004).

#### 3.1.5 Quy tắc nghiệp vụ

| Mã | Nội dung |
|----|----------|
| BR-profit-report-001 | **Tổng doanh thu** = `sum(bill.total_amount)` — lấy ở cấp hóa đơn (bill), theo trạng thái BR-profit-report-003 |
| BR-profit-report-002 | `bill.status`: 0 chưa hoàn thành, 1 hoàn thành, 2 hủy, 3 bị trả hàng, 4 trả hàng, 5 bị thay thế, 6 thay thế, 7 gộp, 8 tách. Báo cáo chỉ cộng theo BR-profit-report-003 |
| BR-profit-report-003 | Tổng số liệu tính theo công thức dấu **`1 + 3 − 4 + 6`** (chỉ lấy status 1, 3, 4, 6): hoàn thành + bị trả hàng − trả hàng + thay thế. Status 4 mang giá trị âm. Status 2 (hủy) và 5 (bị thay thế) hiển thị gạch ngang, không cộng tổng |
| BR-profit-report-004 | **Tổng giá vốn** = `sum(bill_product.total_cogs)` của **tất cả sản phẩm** trong các hóa đơn hợp lệ (BR-profit-report-003), **loại** các dòng có `product.code` thuộc: `GC` (ghi chú), `PT` (phụ thu), `CKDH` (chiết khấu riêng đơn hàng), `CKKM` (chiết khấu đơn hàng theo CTKM), `TTDB` (thuế tiêu thụ đặc biệt), `DV` (dịch vụ), `VC` (vận chuyển) |
| BR-profit-report-005 | Lợi nhuận gộp = Tổng doanh thu − Tổng giá vốn; Tỷ suất lợi nhuận (%) = Lợi nhuận gộp / Tổng doanh thu × 100 |
| BR-profit-report-006 | Mọi cấp thời gian chỉ hiển thị kỳ có phát sinh dữ liệu; kỳ rỗng bị ẩn |
| BR-profit-report-007 | Điều kiện thời gian: Đến ngày ≥ Từ ngày; Từ ngày ≤ ngày hiện tại |
| BR-profit-report-008 | Xử lý combo khi tổng hợp doanh thu/giá vốn — theo checkbox **"Tách lợi nhuận Combo theo từng thành phần"** (mặc định tắt): **Bật (tách)** → bỏ qua `bill_product` là sản phẩm combo (`product.type=2`), chỉ tính sản phẩm thành phần. **Tắt (không tách)** → bỏ qua `bill_product` có `parent_combo_id != null`, chỉ tính combo cha |

#### 3.1.6 Kết xuất Excel / PDF

Người dùng bấm **Kết xuất Excel** hoặc **Kết xuất PDF** trên thanh công cụ để xuất báo cáo theo tham số hiện tại (kỳ báo cáo, chi nhánh, từ–đến ngày, tách combo).

**a) Phần đầu file (header)**

| STT | Trường | Nguồn | Mô tả |
|-----|--------|-------|-------|
| 1 | Tên đơn vị | company | Ví dụ "QLDV EASYPOS" |
| 2 | Địa chỉ | company | Ví dụ "Thôn Đồng Văn, Phường Phú Thượng, Thành Phố Hà Nội" |
| 3 | Mã số thuế | company | Ví dụ "0105987432-998" |
| 4 | Tiêu đề báo cáo | — | "BÁO CÁO LỢI NHUẬN" *(ảnh mẫu đang ghi "TỔNG HỢP XUẤT - NHẬP - TỒN KHO" — cần xác nhận, xem OQ-07)* |
| 5 | Kỳ báo cáo | — | "Từ ngày … đến ngày …" |

**b) Bảng dữ liệu** (mỗi dòng = 1 hóa đơn thuộc 1 kỳ thời gian)

| Cột | Tên cột | Công thức / Nguồn | Mô tả |
|-----|---------|-------------------|-------|
| A | Thời gian | — | Kỳ thời gian |
| B | Doanh thu (theo thời gian) | `sum(bill.total_amount)` | Tổng doanh thu của kỳ |
| C | Tổng giá vốn (theo thời gian) | `sum(bill_product.total_cogs)` | Tổng giá vốn của kỳ (loại mã hệ thống — BR-profit-report-004) |
| D | Lợi nhuận gộp (theo thời gian) | `B − C` | Lợi nhuận gộp của kỳ |
| E | Mã chứng từ | `bill.code` | Mã hóa đơn |
| F | Thời gian (theo mã chứng từ) | — | Thời điểm hóa đơn (đến giờ:phút:giây) |
| G | Tổng tiền hàng (theo mã chứng từ) | *(nguồn trường cần xác nhận — OQ-08)* | Tổng tiền hàng của hóa đơn |
| H | Giảm giá (theo mã chứng từ) | *(giảm giá hóa đơn + giảm giá phiếu trả — nguồn trường cần xác nhận, OQ-08)* | Giảm giá của hóa đơn |
| I | Doanh thu (theo mã chứng từ) | `bill.total_amount` (= G − H) | Doanh thu của hóa đơn |
| J | Tổng giá vốn (theo mã chứng từ) | `sum(bill_product.total_cogs)` | Giá vốn của hóa đơn |
| K | Lợi nhuận gộp (theo mã chứng từ) | `I − J` | Lợi nhuận gộp của hóa đơn |
| L | Chi nhánh | `company.name` | Chi nhánh |

---

### 3.2 Báo cáo chi tiết lợi nhuận theo hóa đơn

#### 3.2.1 Thông tin chung về chức năng

Từ cấp ngày của báo cáo tổng, người dùng bấm vào một ngày để xem danh sách các hóa đơn (chứng từ) phát sinh trong ngày cùng doanh thu, giá vốn và lợi nhuận gộp của từng hóa đơn.

#### 3.2.2 Màn hình chức năng

| # | Cột | Kiểu | Mô tả |
|---|-----|------|-------|
| 1 | Mã chứng từ | Text | Mã hóa đơn/chứng từ (`bill.code`) |
| 2 | Thời gian | Datetime | Thời điểm giao dịch (đến giờ:phút:giây) |
| 3 | Doanh thu | Số | `bill.total_amount` của hóa đơn |
| 4 | Tổng giá vốn | Số | `sum(bill_product.total_cogs)` theo hóa đơn (loại mã sản phẩm hệ thống — BR-04) |
| 5 | Lợi nhuận gộp | Số | Doanh thu − Tổng giá vốn |

Ví dụ dòng chi tiết: `DH001` — `01/07/2026 14:40:09` — Doanh thu 100.000 — Tổng giá vốn 20.000 — Lợi nhuận gộp 80.000.

#### 3.2.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Bấm vào một ngày ở báo cáo tổng | Hiển thị danh sách hóa đơn phát sinh trong ngày | — |

Doanh thu, giá vốn, lợi nhuận của từng hóa đơn áp dụng cùng quy tắc BR-profit-report-001, BR-profit-report-004 (xem Mục 3.1.5).

**Quy tắc hiển thị theo trạng thái đơn (BR-profit-report-003):**

| Trạng thái đơn | Hiển thị |
|----------------|----------|
| status = 2 (đơn hủy), 5 (đơn bị thay thế) | **Gạch ngang dòng** (hiển thị nhưng không cộng vào tổng) |
| status = 4 (đơn trả hàng) | Toàn bộ giá trị (doanh thu, giá vốn, lợi nhuận) hiển thị **số âm** |
| status = 1, 3, 6 | Hiển thị bình thường, cộng vào tổng |

---

### 3.3 Tab Biểu đồ

#### 3.3.1 Thông tin chung về chức năng

Tab **Biểu đồ** trực quan hóa số liệu của cùng kỳ báo cáo (cùng tham số với tab Báo cáo) dưới dạng **biểu đồ kết hợp cột – đường**: cột thể hiện Doanh thu, đường thể hiện Lợi nhuận gộp theo từng kỳ con. Giúp người dùng nhìn nhanh xu hướng doanh thu và lợi nhuận trong kỳ.

#### 3.3.2 Màn hình chức năng

Biểu đồ dùng chung tham số với tab Báo cáo (Chọn tham số). Trục X hiển thị các kỳ con theo cấp đầu tiên của kỳ báo cáo (ví dụ kỳ = Năm → 12 tháng Th01…Th12; kỳ = Quý/Tháng/Tuần → theo ngày).

| STT | Tên trường | Loại control | Mô tả |
|-----|-----------|--------------|-------|
| 1 | Tiêu đề | Text | "BÁO CÁO LỢI NHUẬN" |
| 2 | Dòng phụ tiêu đề | Text | "Kỳ báo cáo: Từ ngày … đến ngày …" |
| 3 | Chú giải (Legend) | Text | Hai chuỗi: **Doanh thu (VNĐ)** (cột, màu xanh) và **Lợi nhuận gộp (VNĐ)** (đường, màu cam) |
| 4 | Trục Y trái | Axis | Thang **Doanh thu (VNĐ)** — áp cho cột |
| 5 | Trục Y phải | Axis | Thang **Lợi nhuận gộp (VNĐ)** — áp cho đường |
| 6 | Trục X | Axis | Các kỳ con theo kỳ báo cáo (chỉ kỳ có dữ liệu), ví dụ Th 01 … Th 12 |
| 7 | Cột Doanh thu | Bar | Mỗi kỳ con một cột, chiều cao theo Doanh thu của kỳ (đọc theo trục Y trái) |
| 8 | Đường Lợi nhuận gộp | Line | Nối các điểm Lợi nhuận gộp của từng kỳ con (đọc theo trục Y phải) |
| 9 | Tooltip | Popover | Khi hover một kỳ: hiển thị nhãn kỳ + **Doanh thu** + **Lợi nhuận** + **Tỷ suất lợi nhuận (%)**; cột tương ứng được tô đậm |

#### 3.3.3 Xử lý luồng sự kiện tương tác

| Bước | Hành động người dùng | Phản hồi hệ thống | Điều kiện |
|------|---------------------|------------------|-----------|
| 1 | Chuyển sang tab Biểu đồ | Hiển thị biểu đồ cột – đường theo tham số hiện tại | Đã có dữ liệu theo Chọn tham số |
| 2 | Rê chuột (hover) vào một cột / điểm | Tô đậm cột tương ứng và hiện tooltip: nhãn kỳ, Doanh thu, Lợi nhuận, Tỷ suất lợi nhuận | — |

Ví dụ tooltip (hover Tháng 06/2026): Doanh thu 150tr · Lợi nhuận 100tr · Tỷ suất lợi nhuận 37,50%.

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|------------------------|---------|-----------------|----------------|
| Tính giá xuất kho | Danh sách giao dịch kho | Cao | Báo cáo lợi nhuận tổng phụ thuộc dữ liệu giá vốn (`purchase_price`, `total_cogs`) do chức năng tính giá xuất kho sinh ra. Phải chạy tính giá xuất kho trước thì Tổng giá vốn mới đúng |

### 4.2 Chức năng của hệ thống khác

Không áp dụng.

---

## 5. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Trạng thái |
|---|---------|------------------|------------------|-----------|
| OQ-01 | Báo cáo lợi nhuận tổng có bộ lọc **Chi nhánh** (chọn nhiều theo phân quyền) không? | 2.2, 3.1.2 | Nguyễn Thị Minh Ánh | [x] Đã chốt: CÓ — filter Chi nhánh trong popup Chọn tham số |
| OQ-02 | **Tổng giá vốn** lấy từ trường nào: `sum(bill_product.total_cogs)` hay `sum(bill_product.purchase_price)`? | 3.1.2, 3.2.2 | Dev/BA | [x] Đã chốt: `sum(bill_product.total_cogs)` |
| OQ-03 | Danh sách giá trị **Kỳ báo cáo** có đúng bằng danh sách của báo cáo theo sản phẩm không? | 3.1.2 | Nguyễn Thị Minh Ánh | [ ] |
| OQ-04 | Báo cáo tổng có hỗ trợ **xuất Excel/PDF** không? | 2.1 | Nguyễn Thị Minh Ánh | [x] Đã chốt: CÓ — nút Kết xuất PDF + Kết xuất Excel trên thanh công cụ |
| OQ-05 | Báo cáo tổng có **bộ lọc sản phẩm** không, hay chỉ lọc theo thời gian/chi nhánh? | 3.1.2 | Nguyễn Thị Minh Ánh | [x] Đã chốt: KHÔNG có bộ lọc sản phẩm; Tổng giá vốn sum tất cả sản phẩm (trừ mã hệ thống) |
| OQ-07 | Tiêu đề file kết xuất là "BÁO CÁO LỢI NHUẬN" đúng không (ảnh mẫu đang ghi "TỔNG HỢP XUẤT - NHẬP - TỒN KHO")? | 3.1.6 | Nguyễn Thị Minh Ánh | [ ] |
| OQ-08 | Nguồn trường cụ thể của **Tổng tiền hàng** và **Giảm giá** (theo mã chứng từ) trong file kết xuất? | 3.1.6, 3.2.2 | Dev/BA | [ ] |
| OQ-06 | Đặc tả tab **Biểu đồ** (loại biểu đồ, trục, dữ liệu hiển thị)? Chờ tài liệu bổ sung từ tác giả | 2.1, 2.5, 3 | Nguyễn Thị Minh Ánh | [x] Đã chốt: combo cột (Doanh thu) – đường (Lợi nhuận gộp), 2 trục Y, tooltip — xem Mục 3.3 |
