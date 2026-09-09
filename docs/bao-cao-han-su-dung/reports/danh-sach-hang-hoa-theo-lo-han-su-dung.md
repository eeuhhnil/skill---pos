
<!-- confluence-page-id: 44077429 -->
<!-- confluence-space-key: EP -->



## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày | Vị trí | A/M/D | Nguồn gốc | Đầu mối | Mô tả |
|---|---|---|---|---|---|
| 2026-07-22 | Mục 4.1 | M | Sửa lỗi báo cáo | @huelinh | Lọc theo `exp_date` thay `mfg_date`; gộp bộ lọc kỳ |
| 2026-07-22 | Mục 4.2 | M | Sửa lỗi báo cáo | @huelinh | Cột NSX & HSD chỉ hiển thị date, bỏ phần giờ |

---

## 1. THÔNG TIN CHUNG

Báo cáo "Danh sách hàng hoá theo lô, hạn sử dụng" liệt kê các lô hàng theo hạn sử dụng, giúp theo dõi hàng cận date / hết date trong kỳ báo cáo. Dữ liệu lấy từ bảng lô hàng `dbo.batches`.

---

## 2. NỘI DUNG THAY ĐỔI

1. **Lọc theo hạn sử dụng** — khoảng ngày của kỳ báo cáo áp lên `exp_date` thay vì `mfg_date`.
2. **Cắt phần giờ** — cột Ngày sản xuất & Hạn sử dụng chỉ hiển thị `dd/MM/yyyy` (bỏ `T00:00:00+07:00`).
3. **Gộp bộ lọc kỳ** — bỏ 2 ô *Từ ngày* / *Đến ngày* riêng, dùng component **Kỳ báo cáo** (Theo tháng / quý / năm / Tùy chỉnh).

**Lý do phụ (thay đổi 1):** `mfg_date` có nhiều lô để trống (NULL) → lọc theo NSX sẽ bỏ sót lô có HSD nhưng không có NSX.

---

## 3. SO SÁNH AS-IS / TO-BE

| | As-Is (hiện tại) | To-Be (sau sửa) |
|---|---|---|
| Trường lọc theo kỳ | `mfg_date BETWEEN từ ngày AND đến ngày` | `CAST(exp_date AS date) BETWEEN từ ngày AND đến ngày` |
| Bộ lọc kỳ | Kỳ báo cáo + 2 ô Từ ngày / Đến ngày riêng | Chỉ component Kỳ báo cáo (Theo tháng/quý/năm/Tùy chỉnh) |
| Cột NSX / HSD | `2026-07-01T00:00:00+07:00` (datetime) | `01/07/2026` (date) |

---

## 4. CHI TIẾT

### 4.1 Bộ lọc tham số

| STT | Trường | Control | Mặc định | Mô tả |
|---|---|---|---|---|
| 1 | Kỳ báo cáo | Component chọn kỳ | Tháng hiện tại | **Theo tháng** (chọn 1 tháng) / **Theo quý** / **Theo năm** / **Tùy chỉnh** (mở lịch chọn khoảng ngày từ–đến). Suy ra khoảng ngày `[từ ngày, đến ngày]` |
| 2 | Chi nhánh | Combo-box | Chi nhánh hiện tại | Chọn 1 chi nhánh |
| 3 | Kho hàng | Combo-box | Kho bán hàng | Chọn kho lấy số lượng lô |
| 4 | Sản phẩm | Popup + tìm kiếm | Tất cả | Tìm theo mã/tên; "Chọn tất cả"; để trống = tất cả SP |

**Bỏ so với bản gốc:** 2 ô datepicker *Từ ngày* và *Đến ngày* — khoảng ngày nay lấy từ component Kỳ báo cáo.

### 4.2 Bảng kết quả

**Đầu vào:** kỳ báo cáo (→ khoảng ngày lọc `exp_date`), chi nhánh, kho hàng, danh sách sản phẩm.

**Điều kiện lấy dữ liệu:**
- `CAST(b.exp_date AS date) BETWEEN từ ngày AND đến ngày` *(thay `mfg_date`)*.
- Theo chi nhánh, kho hàng, và sản phẩm đã chọn.

**Đầu ra:**

| STT | Cột | Công thức / Nguồn | Ghi chú |
|---|---|---|---|
| 1 | Mã sản phẩm | mã SP của lô | |
| 2 | Tên sản phẩm | tên SP của lô | |
| 3 | Kho hàng | kho được chọn | |
| 4 | Lô | `batches.lot_no` | |
| 5 | Ngày sản xuất | `batches.mfg_date` | **Hiển thị `dd/MM/yyyy`, bỏ phần giờ**; NULL → để trống |
| 6 | Hạn sử dụng | `batches.exp_date` | **Hiển thị `dd/MM/yyyy`, bỏ phần giờ** |
| 7 | Số ngày còn lại | `DATEDIFF(day, ngày hiện tại, exp_date)` | Số nguyên |
| 8 | Số lượng | tồn của lô tại kho được chọn | |

---


