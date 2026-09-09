---
type: srs
feature: sinh-ma-barcode-tu-dong
status: draft
lang: vi
owner: "@huelinh"
version: 1.0
created: 2026-08-11
updated: 2026-08-11
links: [docs/sinh-ma-barcode-tu-dong/brainstorms/cau-hinh-sinh-ma-barcode.md,
  docs/sinh-ma-barcode-tu-dong/diagrams/cau-hinh-sinh-ma-barcode.drawio,
  docs/sinh-ma-barcode-tu-dong/diagrams/sinh-ma-khi-luu-san-pham.drawio]
tags: [barcode, cau-hinh, san-pham, code128, ean13]
stale_reason: ""
changelog:
  - 2026-08-11 | /srs | import chạy ngầm bất đồng bộ, không bổ sung thông báo sinh mã; thêm OQ-4, OQ-5
  - 2026-08-11 | /srs | tiền tố tính vào độ dài ở cả 2 kiểu; bỏ ràng buộc 50 ký tự, thêm BR-006 mới
  - 2026-08-11 | /srs | tắt cấu hình thì 3 khóa về null (không xóa bản ghi); giữ bộ đếm (BR-barcode-009)
  - 2026-08-11 | /srs | thêm 2 lưu đồ draw.io cho luồng cấu hình và luồng sinh mã
  - 2026-08-11 | /srs | initial draft từ brainstorm cau-hinh-sinh-ma-barcode
---

# SRS — Cấu hình sinh mã barcode tự động cho sản phẩm

**Mã tài liệu:** SRS-BARCODE-001
**Phiên bản:** 1.0
**Ngày tạo:** 11/08/2026
**Người soạn:** Dương Thị Huệ Linh
**Trạng thái:** Draft

---

## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi | Vị trí thay đổi | A / M / D | Nguồn gốc | Đầu mối | Mô tả thay đổi | Ghi chú |
|--------------|----------------|-----------|-----------|---------|----------------|---------|
| 11/08/2026 | Toàn bộ | A | Yêu cầu khách hàng | Dương Thị Huệ Linh | Tạo mới tài liệu | |

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
   - 3.1 Cấu hình sinh mã barcode tự động
   - 3.2 Sinh mã barcode khi lưu sản phẩm
   - 3.3 Cập nhật hàng loạt sinh mã barcode
4. Chi tiết các nghiệp vụ ảnh hưởng
5. Open Questions

---

## 1. NGUỒN GỐC THAY ĐỔI

Yêu cầu từ khách hàng. Sản phẩm không có mã vạch sẵn của nhà sản xuất thì người dùng phải tự nghĩ và nhập mã vạch thủ công — mất thời gian và dễ đặt trùng. Yêu cầu: cho phép mỗi chi nhánh bật sinh mã vạch tự động khi tạo sản phẩm.

Phạm vi lần này: **web quản trị**. Phần ứng dụng mobile sẽ viết tài liệu riêng ở giai đoạn sau.

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

- Bổ sung khối cấu hình **Tự động sinh mã Barcode** vào màn **Cấu hình > Sản phẩm**, đặt riêng theo từng chi nhánh.
- Cho chọn **kiểu barcode**: CODE128 (độ dài tự chọn 5–50) hoặc EAN13 (cố định 13 số).
- Cho đặt **tiền tố mã vạch** tối đa 6 ký tự và xem trước **barcode mẫu** ngay khi gõ. Tiền tố **nằm trong** độ dài, không cộng thêm — mã sinh ra luôn đúng bằng độ dài đã cấu hình.
- Hệ thống tự sinh mã vạch tại **5 điểm chạm**: thêm sản phẩm, sửa sản phẩm, import sản phẩm, import cập nhật sản phẩm, cập nhật hàng loạt.
- Chỉ sinh cho sản phẩm **chưa có mã vạch**; sản phẩm đã có mã thì giữ nguyên, không ghi đè.
- Số chạy lấy từ **bộ đếm trên Redis** theo cặp doanh nghiệp + tiền tố, chạy tiếp không reset.
- Bổ sung chức năng **cập nhật hàng loạt** cho phép chọn danh sách sản phẩm cũ để sinh mã.

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

**Luồng hiện tại (As-Is):**

1. Người dùng vào màn **Sản phẩm > Thêm sản phẩm** (hoặc sửa sản phẩm, hoặc import từ file Excel).
2. Người dùng nhập các thông tin sản phẩm. Đến ô **Mã vạch**, nếu sản phẩm có tem của nhà sản xuất thì quét hoặc gõ lại mã trên tem.
3. Nếu sản phẩm **không có tem** (hàng tự sản xuất, hàng chia lẻ, hàng nhập không nhãn), người dùng **tự nghĩ một mã** rồi gõ tay vào ô Mã vạch.
4. Người dùng bấm **Lưu**. Hệ thống kiểm tra mã vạch có trùng với sản phẩm khác trong chi nhánh không; trùng thì báo lỗi, người dùng phải nghĩ mã khác và nhập lại.

**Luồng mới (To-Be) — phần cấu hình:**

1. Người dùng vào **Cấu hình > Sản phẩm**, tìm mục **Tự động sinh mã Barcode** và chọn **Áp dụng**.
2. Hệ thống hiện khối con gồm: **Kiểu barcode**, **Tiền tố mã vạch**, **Độ dài barcode**, **Barcode mẫu**.
3. Người dùng chọn kiểu barcode. Chọn **EAN13** thì hệ thống **ẩn ô Độ dài barcode** vì mã đã cố định 13 số; chọn **CODE128** thì hiện ô Độ dài barcode với giá trị mặc định 8.
4. Người dùng nhập **Tiền tố mã vạch** (tối đa 6 ký tự) và độ dài (nếu CODE128). Độ dài là **tổng số ký tự của cả mã**, đã bao gồm tiền tố. Hệ thống **cập nhật khung Barcode mẫu tức thì** theo từng ký tự gõ vào, dựng đúng mã sẽ sinh ra kèm số ký tự thực tế.
5. Người dùng bấm **Lưu**. Hệ thống kiểm tra hai điều kiện: độ dài phải lớn hơn số ký tự của tiền tố (còn chỗ cho số chạy), và phần số chạy đủ chứa bộ đếm hiện tại của tiền tố đó.
6. Đạt thì lưu cấu hình vào bảng `config` của chi nhánh và báo *"Lưu cấu hình thành công."*; không đạt thì báo lỗi tương ứng và giữ nguyên màn cho người dùng sửa.

**Luồng mới (To-Be) — phần sinh mã khi lưu sản phẩm:**

1. Người dùng thêm sản phẩm, sửa sản phẩm, import sản phẩm, import cập nhật sản phẩm hoặc chạy cập nhật hàng loạt, rồi bấm **Lưu**.
2. Hệ thống đọc cấu hình của chi nhánh hiện tại. Cấu hình **Không áp dụng** thì để trống ô Mã vạch, người dùng tự nhập như cũ — kết thúc luồng.
3. Cấu hình **Áp dụng** thì hệ thống kiểm tra sản phẩm đã có mã vạch chưa. **Đã có** thì giữ nguyên mã cũ, không sinh đè — kết thúc luồng.
4. **Chưa có** thì hệ thống tăng bộ đếm trên Redis theo khóa `{com_id}_{tiền tố}` và lấy số mới.
5. Hệ thống ghép mã theo kiểu barcode đang cấu hình: lấy tiền tố cộng số chạy đệm 0 sao cho **tổng mã đúng bằng độ dài cấu hình** — CODE128 là `barcode_length`, EAN13 là 13.
6. Hệ thống kiểm tra mã vừa ghép đã tồn tại ở sản phẩm nào trong **cùng chi nhánh** chưa. Chưa tồn tại thì gán mã cho sản phẩm và lưu.
7. Đã tồn tại thì quay lại bước 4 lấy số tiếp theo, **thử lại tối đa 5 lần**. Hết 5 lần vẫn trùng thì để trống ô Mã vạch và báo *"Không sinh được mã vạch tự động. Vui lòng nhập mã vạch thủ công."*

**Khác biệt chính:** As-Is bắt người dùng tự nghĩ mã ở bước 3 và tự xử lý khi trùng ở bước 4. To-Be đưa việc sinh mã và xử lý trùng về phía hệ thống, người dùng chỉ can thiệp khi hệ thống thử 5 lần vẫn không sinh được.

**Hình luồng — cấu hình** (lưu đồ draw.io: [cau-hinh-sinh-ma-barcode.drawio](../diagrams/cau-hinh-sinh-ma-barcode.drawio)):

```
NGƯỜI DÙNG: Cấu hình > Sản phẩm
        │
        ▼
┌──────────────────────┐
│ Bật sinh mã tự động  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Chọn kiểu barcode    │
└─────┬──────────┬─────┘
   CODE128     EAN13
      │           │
      ▼           ▼
┌────────────┐ ┌──────────────────────┐
│ Tiền tố:   │ │ Tiền tố: chỉ số, ≤6  │
│ chữ + số   │ │ Ô độ dài ẨN          │
│ ≤6 ký tự   │ │ Tổng mã = 13 số      │
│ Độ dài:    │ │ Phần chạy = 13 − độ  │
│ 5–50, là   │ │   dài tiền tố        │
│ TỔNG cả mã │ │                      │
│ (mđ 8)     │ │                      │
└─────┬──────┘ └──────────┬───────────┘
      └───────────┬───────┘
                  ▼
      ┌─────────────────────────┐
      │ Xem trước: mã mẫu +     │
      │ ảnh barcode + số ký tự  │
      │ (cập nhật tức thì)      │
      └───────────┬─────────────┘
                  ▼  bấm Lưu
      ┌──────────────────────────────┐
      │ Kiểm tra:                    │
      │ • độ dài > độ dài tiền tố    │
      │ • phần số chạy ≥ số chữ số   │
      │   của bộ đếm                 │
      └──────┬────────────────┬──────┘
           ĐẠT             KHÔNG ĐẠT
             │                 │
             ▼                 ▼
      ┌─────────────┐   ┌────────────────┐
      │ Lưu thành   │   │ Báo lỗi,       │
      │ công        │   │ giữ nguyên màn │
      └─────────────┘   └────────────────┘
```

**Hình luồng — sinh mã khi lưu sản phẩm** (lưu đồ draw.io: [sinh-ma-khi-luu-san-pham.drawio](../diagrams/sinh-ma-khi-luu-san-pham.drawio)):

```
NGƯỜI DÙNG: Thêm / Sửa / Import / Cập nhật hàng loạt
                    │
                    ▼
        ┌───────────────────────────┐
        │ Chi nhánh có bật sinh mã? │
        └──────┬─────────────┬──────┘
            KHÔNG           CÓ
               │             │
               ▼             ▼
      ┌─────────────┐  ┌──────────────────────┐
      │ Ô mã vạch   │  │ Sản phẩm đã có mã?   │
      │ để trống    │  └─────┬──────────┬─────┘
      └─────────────┘      CÓ          CHƯA
                            │            │
                            ▼            ▼
                   ┌─────────────┐  ┌──────────────────────┐
                   │ Giữ mã cũ,  │  │ Tăng bộ đếm Redis    │
                   │ không sinh  │  │ khóa {com_id}_{tiền  │
                   └─────────────┘  │ tố}, VD 123_89       │
                                    └──────────┬───────────┘
                                               ▼
                                    ┌──────────────────────┐
                                    │ Ghép mã: tiền tố +   │
                                    │ số chạy đệm 0, TỔNG  │
                                    │ mã đúng bằng độ dài  │
                                    │ CODE128: barcode_len │
                                    │ EAN13: 13 số         │
                                    └──────────┬───────────┘
                                               ▼
                                    ┌──────────────────────┐
                        ┌──────────►│ Mã đã tồn tại trong  │
                        │           │ chi nhánh?           │
                        │           └────┬────────────┬────┘
                        │              CÓ            KHÔNG
                        │               │              │
                        │               ▼              ▼
                        │    ┌──────────────────┐  ┌──────────┐
                        │    │ Đã thử đủ 5 lần? │  │ Gán mã   │
                        │    └───┬──────────┬───┘  │ + Lưu SP │
                        │      CHƯA        RỒI     └──────────┘
                        └────────┘          │
                                            ▼
                              ┌──────────────────────────┐
                              │ Để trống mã vạch         │
                              │ "Không sinh được mã vạch │
                              │  tự động. Vui lòng nhập  │
                              │  mã vạch thủ công."      │
                              └──────────────────────────┘
```

### 2.3 Yêu cầu người dùng

| Story ID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên |
|---|---|---|---|---|
| US-001 | Chủ cửa hàng / admin | Bật sinh mã vạch tự động cho chi nhánh và chọn kiểu mã, tiền tố, độ dài | Chuẩn hóa mã vạch nội bộ theo cách quản lý của cửa hàng | Cao |
| US-002 | Chủ cửa hàng / admin | Nhìn thấy mã mẫu và ảnh barcode ngay khi đang chỉnh cấu hình | Biết mã sẽ trông như thế nào trước khi lưu, tránh in tem sai hàng loạt | Cao |
| US-003 | Nhân viên nhập hàng | Tạo sản phẩm mà hệ thống tự điền mã vạch khi sản phẩm không có tem nhà sản xuất | Không phải tự nghĩ mã và không sợ đặt trùng | Cao |
| US-004 | Nhân viên nhập hàng | Import danh sách sản phẩm và để trống cột mã vạch cho hệ thống tự sinh | Nhập hàng loạt nhanh, không phải chuẩn bị mã trước trong file Excel | Cao |
| US-005 | Chủ cửa hàng / admin | Chọn danh sách sản phẩm cũ chưa có mã vạch để sinh mã hàng loạt | Bổ sung mã cho dữ liệu cũ mà không phải sửa từng sản phẩm | Trung bình |

### 2.4 Ngữ cảnh người dùng

Người thao tác **cấu hình** là chủ cửa hàng hoặc admin, làm trên máy tính, tần suất rất thấp — thường chỉ đặt một lần lúc khởi tạo cửa hàng hoặc khi đổi quy ước đánh mã. Người **hưởng kết quả** là nhân viên nhập hàng, thao tác hằng ngày trên màn thêm sản phẩm hoặc import file Excel, đa số không có kiến thức kỹ thuật và không phân biệt được sự khác nhau giữa CODE128 và EAN13 — nên màn cấu hình cần tooltip giải thích và khung xem trước trực quan.

Mã sinh ra là **mã quản lý nội bộ** của cửa hàng, dùng để dán tem và quét tại quầy, không nhằm mục đích lưu thông ra thị trường.

### 2.5 Mô tả thay đổi về CSDL

Không phát sinh bảng mới. Dùng lại bảng `config` (key–value theo chi nhánh) và bổ sung bộ đếm trên Redis.

| Loại thay đổi | Bảng | Khóa (`code`) | Giá trị | Mô tả |
|:---:|---|---|---|---|
| A | `config` | `auto_generate_barcode` | `0` / `1` | `0` = Không áp dụng, `1` = Áp dụng. Đặt riêng theo từng chi nhánh |
| A | `config` | `barcode_type` | `1` / `2` | `1` = CODE128, `2` = EAN13. Chỉ có giá trị khi `auto_generate_barcode = 1` |
| A | `config` | `barcode_prefix` | Chuỗi tối đa 6 ký tự | CODE128 nhận chữ Latin và số; EAN13 chỉ nhận số. Tiền tố **nằm trong** độ dài mã |
| A | `config` | `barcode_length` | Số nguyên 5–50, mặc định 8 | **Tổng số ký tự của cả mã**, đã bao gồm tiền tố. **Chỉ dùng cho CODE128**; EAN13 bỏ trống vì đã cố định 13 |

Khi người dùng chuyển cấu hình về **Không áp dụng**, ba khóa `barcode_type`, `barcode_prefix`, `barcode_length` được gán `null` — **bản ghi không bị xóa**, chỉ giá trị về rỗng (BR-barcode-009).

**Bộ đếm số chạy trên Redis:**

| Thành phần | Giá trị | Mô tả |
|---|---|---|
| Khóa | `{com_id}_{tiền tố}` | Ví dụ `123_89`, `123_SP`. Một bộ đếm cho mỗi cặp doanh nghiệp và tiền tố |
| Giá trị | Số chạy thuần, ví dụ `1`, `2`, `14` | **Không** lưu tiền tố và phần đệm 0 trong giá trị — hai phần này ghép lúc sinh mã |

Bộ đếm dùng chung **theo doanh nghiệp**, trong khi cấu hình đặt **theo chi nhánh**. Nhờ vậy hai chi nhánh vô tình đặt cùng tiền tố vẫn không sinh ra mã giống nhau.

Trường lưu mã vạch của sản phẩm giữ nguyên kiểu `varchar(50)` — đây là căn cứ cho giới hạn tổng độ dài ở BR-barcode-006.

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|---|---|---|---|---|
| Chủ cửa hàng / admin | Cấu hình > Sản phẩm | Cấu hình sinh mã barcode tự động | Bật/tắt, chọn kiểu barcode, đặt tiền tố và độ dài, xem trước barcode mẫu | Cao |
| Nhân viên nhập hàng | Sản phẩm > Thêm / Sửa sản phẩm | Sinh mã barcode khi lưu sản phẩm | Tự điền mã vạch cho sản phẩm chưa có mã | Cao |
| Nhân viên nhập hàng | Sản phẩm > Import / Import cập nhật | Sinh mã barcode khi import | Sinh mã cho các dòng để trống cột mã vạch, báo cáo dòng không sinh được | Cao |
| Chủ cửa hàng / admin | Sản phẩm > Danh sách sản phẩm | Cập nhật hàng loạt sinh mã barcode | Chọn danh sách sản phẩm để sinh mã, bỏ qua sản phẩm đã có mã | Trung bình |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 Cấu hình sinh mã barcode tự động

#### 3.1.1 Thông tin chung về chức năng

Cho phép chủ cửa hàng hoặc admin bật chế độ sinh mã vạch tự động cho chi nhánh và quy định mã sẽ trông như thế nào: kiểu barcode, tiền tố, độ dài phần số chạy. Khối cấu hình nằm chung màn **Cấu hình > Sản phẩm** với ba cấu hình sản phẩm sẵn có (quản lý theo số lô và hạn dùng, quản lý theo Imei/Serial, quản lý bảo hành sản phẩm). Cấu hình đặt **riêng theo từng chi nhánh**. Đây là điều kiện tiên quyết để chức năng 3.2 và 3.3 hoạt động.

#### 3.1.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Tự động sinh mã Barcode | Radio | Không áp dụng | Có | Hai lựa chọn **Không áp dụng** / **Áp dụng**. Chọn *Áp dụng* thì hiện các trường 2–5; chọn *Không áp dụng* thì ẩn hết và đưa giá trị đã lưu của ba trường 2–4 về `null` (BR-barcode-009) |
| 2 | Kiểu barcode (*) | Radio | CODE128 | Có | Hai lựa chọn **CODE128** / **EAN13**, mỗi lựa chọn kèm icon ⓘ hiện tooltip giải thích. Đổi lựa chọn thì trường 3 và 4 đổi quy tắc theo (BR-barcode-002, BR-barcode-003) |
| 3 | Tiền tố mã vạch (*) | Textbox | Trống | Có | Tối đa 6 ký tự, chú thích dưới ô ghi *"Tối đa 6 ký tự"*. CODE128 nhận chữ Latin và số; EAN13 chỉ nhận số (BR-barcode-004). Tiền tố **nằm trong** độ dài mã, không cộng thêm |
| 4 | Độ dài barcode (*) | Textbox | 8 | Có (khi CODE128) | Số nguyên từ 5 đến 50, là **tổng số ký tự của cả mã** gồm cả tiền tố. Phải lớn hơn số ký tự của tiền tố (BR-barcode-006). **Ẩn hoàn toàn khi chọn EAN13** vì mã đã cố định 13 số (BR-barcode-003) |
| 5 | Barcode mẫu | Vùng xem trước | Dựng theo cấu hình hiện tại | – | Hiển thị ảnh mã vạch và dãy số của **mã sẽ sinh ra**, có kèm tiền tố, cộng thêm dòng ghi số ký tự thực tế. Cập nhật tức thì theo từng ký tự người dùng gõ (BR-barcode-005). Đây chỉ là khung xem trước, **không phải mẫu tem in** |
| 6 | Nút **Lưu** | Button | – | – | Lưu cấu hình sau khi vượt qua các kiểm tra ở 3.1.3 |

**Nội dung tooltip:**

| Kiểu | Nội dung |
|---|---|
| CODE128 | "Mã vạch nhận cả chữ và số, tổng độ dài tự chọn từ 5 đến 50 ký tự (đã gồm tiền tố). Chọn kiểu này nếu muốn đặt tiền tố có chữ để phân nhóm sản phẩm." |
| EAN13 | "Mã vạch gồm đúng 13 chữ số. Tiền tố nằm trong 13 số này và chỉ được nhập số." |

**Trạng thái màn hình:**

| Tình huống | Hiển thị |
|---|---|
| Chọn **Không áp dụng** | Ẩn trường 2–5. Ba khóa `barcode_type`, `barcode_prefix`, `barcode_length` trong `config` được gán `null` (bản ghi vẫn còn); bộ đếm Redis giữ nguyên |
| Chọn **Áp dụng**, kiểu CODE128 | Hiện đủ trường 2, 3, 4, 5 |
| Chọn **Áp dụng**, kiểu EAN13 | Hiện trường 2, 3, 5. **Ẩn trường 4** |
| Đang gõ tiền tố hoặc độ dài | Trường 5 dựng lại mã mẫu và ảnh barcode ngay, kèm số ký tự |
| Bộ đếm của tiền tố đang dùng đã đạt 90% sức chứa của phần số chạy | Hiện cảnh báo dưới trường 4: *"Dải số của tiền tố `SP` sắp hết. Nên tăng độ dài mã vạch."* (BR-barcode-008) |

#### 3.1.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Quy định cách hệ thống sinh mã vạch cho sản phẩm của chi nhánh, để nhân viên không phải tự nghĩ và nhập mã thủ công |
| **Tác nhân** | Chủ cửa hàng / admin |
| **Điều kiện kích hoạt** | Người dùng nhấn nút **Lưu** trên màn Cấu hình > Sản phẩm |
| **Điều kiện tiên quyết** | Đã đăng nhập EPOS và có quyền vào màn Cấu hình (theo phân quyền hiện hành, không định nghĩa quyền mới) |
| **Điều kiện sau khi thực hiện** | Bốn khóa cấu hình được ghi vào `config` của chi nhánh hiện tại; các chức năng 3.2 và 3.3 áp dụng cấu hình mới ngay cho sản phẩm tạo sau đó |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Mở màn **Cấu hình > Sản phẩm** | Đọc bảng `config` theo chi nhánh hiện tại, lấy bốn khóa `auto_generate_barcode`, `barcode_type`, `barcode_prefix`, `barcode_length`. `auto_generate_barcode = 1` thì hiện khối con với giá trị đã lưu; `= 0` hoặc chưa có bản ghi thì hiện radio ở trạng thái *Không áp dụng*, ẩn khối con |
| 2 | Chọn **Áp dụng** ở mục Tự động sinh mã Barcode | Hiện khối con gồm kiểu barcode, tiền tố, độ dài, barcode mẫu. Kiểu barcode mặc định **CODE128**, độ dài mặc định **8** |
| 3 | Chọn kiểu barcode | Chọn **EAN13**: ẩn ô Độ dài barcode, chuyển ô Tiền tố sang chế độ chỉ nhận chữ số, dựng lại barcode mẫu theo công thức 13 số. Chọn **CODE128**: hiện lại ô Độ dài barcode, ô Tiền tố nhận cả chữ Latin và số |
| 4 | Nhập tiền tố và độ dài | Kiểm tra tại chỗ: tiền tố không quá 6 ký tự (BR-barcode-004), độ dài trong khoảng 5–50 (BR-barcode-002). Đồng thời dựng lại **Barcode mẫu**: ghép tiền tố với số chạy giả định sao cho tổng mã đúng bằng độ dài, rồi vẽ ảnh mã vạch, hiển thị kèm số ký tự thực tế (BR-barcode-005) |
| 5 | Nhấn **Lưu** | Kiểm tra lần lượt: (a) các trường bắt buộc không trống; (b) tiền tố hợp lệ theo kiểu barcode đang chọn; (c) độ dài trong khoảng 5–50 nếu là CODE128; (d) độ dài **lớn hơn** số ký tự của tiền tố, tức phần số chạy còn ít nhất 1 chữ số (BR-barcode-006); (e) phần số chạy — bằng độ dài trừ số ký tự tiền tố — không nhỏ hơn số chữ số của bộ đếm hiện tại, đọc giá trị khóa Redis `{com_id}_{tiền tố}` để so sánh (BR-barcode-007). Sai bất kỳ điều kiện nào thì dừng, hiện thông báo lỗi tương ứng ở mục Trường hợp lỗi, **không ghi** `config` |
| 6 | (Hệ thống tự động) | Toàn bộ kiểm tra đạt: ghi bốn khóa vào `config` theo chi nhánh hiện tại — `auto_generate_barcode = 1`, `barcode_type` = 1 hoặc 2, `barcode_prefix` = giá trị người dùng nhập, `barcode_length` = giá trị người dùng nhập nếu CODE128 hoặc để trống nếu EAN13. Hiện thông báo **"Lưu cấu hình thành công."** |
| 7 | Chuyển mục Tự động sinh mã Barcode về **Không áp dụng** rồi nhấn **Lưu** | Ghi `auto_generate_barcode = 0` và gán `null` cho `barcode_type`, `barcode_prefix`, `barcode_length` — bản ghi trong `config` vẫn giữ, chỉ giá trị về rỗng. **Giữ nguyên** bộ đếm trên Redis để lần sau bật lại, nhập đúng tiền tố cũ thì số chạy tiếp mà không sinh mã trùng (BR-barcode-009). Hiện thông báo **"Lưu cấu hình thành công."** |

**Công thức ghép mã dùng chung cho 3.1, 3.2, 3.3:**

Quy tắc chung cho cả hai kiểu: **tiền tố nằm trong độ dài**, tổng mã luôn đúng bằng độ dài cấu hình.

```
tong_do_dai    = (barcode_type = 1) ? barcode_length : 13
so_chu_so_chay = tong_do_dai - len(barcode_prefix)
so_chay_dem_0  = đệm 0 bên trái cho counter đủ so_chu_so_chay chữ số
ma_vach        = barcode_prefix + so_chay_dem_0

Ràng buộc: so_chu_so_chay >= 1                         (BR-barcode-006)
           so_chu_so_chay >= số chữ số của counter     (BR-barcode-007)
EAN13 không có số kiểm tra.
```

Ví dụ minh họa:

| Kiểu | Tiền tố | Độ dài | Số chữ số chạy | Bộ đếm | Mã vạch | Số ký tự |
|---|---|---|---|---|---|---|
| CODE128 | `SP` | 8 | 6 | 1 | `SP000001` | 8 |
| CODE128 | `SP` | 8 | 6 | 14 | `SP000014` | 8 |
| CODE128 | `HH01` | 10 | 6 | 14 | `HH01000014` | 10 |
| EAN13 | `88` | 13 | 11 | 1 | `8800000000001` | 13 |
| EAN13 | `889` | 13 | 10 | 1 | `8890000000001` | 13 |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Bỏ trống tiền tố hoặc độ dài khi đang bật cấu hình | Lỗi đỏ dưới ô tương ứng | Dừng, không ghi `config` |
| Tiền tố quá 6 ký tự | "Tiền tố mã vạch tối đa 6 ký tự." | Dừng, không ghi `config` |
| Kiểu EAN13 nhưng tiền tố có chữ | "Tiền tố mã vạch của kiểu EAN13 chỉ được nhập số." | Dừng, không ghi `config` |
| Kiểu CODE128 nhưng tiền tố có ký tự đặc biệt | "Tiền tố mã vạch chỉ được nhập chữ và số." | Dừng, không ghi `config` |
| Độ dài ngoài khoảng 5–50 | "Độ dài mã vạch phải từ 5 đến 50 ký tự." | Dừng, không ghi `config` |
| Độ dài không lớn hơn số ký tự tiền tố | "Độ dài mã vạch phải lớn hơn số ký tự của tiền tố." | Dừng, không ghi `config` |
| Phần số chạy không đủ chứa bộ đếm hiện tại | "Tiền tố `SP` đã sinh tới mã thứ 100.000, độ dài mã vạch tối thiểu là 8 ký tự." | Dừng, không ghi `config` |
| Bộ đếm của tiền tố đang dùng đạt 90% sức chứa của phần số chạy | "Dải số của tiền tố `SP` sắp hết. Nên tăng độ dài mã vạch." | Chỉ cảnh báo, **vẫn cho lưu** |

#### 3.1.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-barcode-001 | Cấu hình sinh mã barcode đặt **riêng theo từng chi nhánh**; mỗi chi nhánh có bộ giá trị `auto_generate_barcode`, `barcode_type`, `barcode_prefix`, `barcode_length` độc lập |
| BR-barcode-002 | Kiểu **CODE128**: độ dài barcode là **tổng số ký tự của cả mã, đã bao gồm tiền tố**, nhận giá trị từ 5 đến 50, mặc định 8. Phần số chạy bằng độ dài barcode trừ số ký tự tiền tố |
| BR-barcode-003 | Kiểu **EAN13**: mã luôn đúng 13 chữ số, ô Độ dài barcode bị ẩn và không nhận giá trị. Tiền tố **nằm trong** 13 số; phần số chạy bằng 13 trừ số ký tự tiền tố. Mã **không có số kiểm tra** |
| BR-barcode-004 | Tiền tố mã vạch tối đa 6 ký tự. Kiểu CODE128 nhận chữ Latin và chữ số; kiểu EAN13 chỉ nhận chữ số |
| BR-barcode-005 | Khung Barcode mẫu phải dựng đúng mã sẽ sinh ra, bao gồm cả tiền tố, và cập nhật tức thì theo từng ký tự người dùng gõ, kèm hiển thị số ký tự thực tế của mã |
| BR-barcode-006 | Độ dài barcode phải **lớn hơn số ký tự của tiền tố** ít nhất 1 — phần số chạy tối thiểu 1 chữ số. Vi phạm thì chặn lưu cấu hình |
| BR-barcode-007 | Phần số chạy — bằng độ dài barcode trừ số ký tự tiền tố — không được nhỏ hơn số chữ số của bộ đếm hiện tại ứng với tiền tố đang dùng. Vi phạm thì chặn lưu và báo độ dài tối thiểu |
| BR-barcode-008 | Khi bộ đếm của tiền tố đang dùng đạt **90%** sức chứa của phần số chạy, màn cấu hình hiện cảnh báo đề nghị tăng độ dài. Cảnh báo không chặn thao tác lưu |
| BR-barcode-009 | Chuyển cấu hình về **Không áp dụng** thì ghi `auto_generate_barcode = 0` và gán `null` cho `barcode_type`, `barcode_prefix`, `barcode_length` — **bản ghi trong `config` không bị xóa**, chỉ giá trị về rỗng. Riêng **bộ đếm trên Redis được giữ nguyên** để nếu lần sau bật lại và nhập đúng tiền tố cũ thì số chạy tiếp, không sinh mã trùng với mã đã cấp |
| BR-barcode-010 | Quyền vào màn cấu hình dùng **nghiệp vụ phân quyền hiện hành** của màn Cấu hình, không định nghĩa quyền mới cho chức năng này |

---

### 3.2 Sinh mã barcode khi lưu sản phẩm

#### 3.2.1 Thông tin chung về chức năng

Khi chi nhánh đã bật cấu hình, hệ thống tự điền mã vạch cho sản phẩm **chưa có mã vạch** tại thời điểm lưu. Áp dụng cho bốn điểm chạm: **thêm sản phẩm**, **sửa sản phẩm**, **import sản phẩm**, **import cập nhật sản phẩm**. Sản phẩm đã có mã vạch thì giữ nguyên, hệ thống không ghi đè. Người dùng vẫn được sửa hoặc nhập đè mã do hệ thống sinh ra.

Hai điểm chạm đầu chạy **đồng bộ** — người dùng thấy kết quả ngay khi bấm Lưu. Hai điểm chạm import chạy **ngầm bất đồng bộ** qua tiến trình nền, người dùng không thấy kết quả sinh mã tại chỗ. Giai đoạn này **không bổ sung thông báo hay màn hình nào** cho luồng import (xem BR-barcode-017 và OQ-4).

#### 3.2.2 Màn hình chức năng

Chức năng không thêm màn hình mới, chỉ thay đổi hành vi của ô **Mã vạch** trên màn Thêm/Sửa sản phẩm và cột **Mã vạch** trong file import.

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Mã vạch (màn Thêm/Sửa sản phẩm) | Textbox | Trống | Không | Người dùng để trống thì hệ thống tự sinh khi lưu. Người dùng nhập tay hoặc quét tem thì hệ thống giữ nguyên giá trị đó (BR-barcode-011). Mã hệ thống sinh ra vẫn cho **sửa và nhập đè** (BR-barcode-012) |
| 2 | Cột Mã vạch (file import) | Cột Excel | Trống | Không | Dòng nào để trống thì hệ thống sinh mã khi import; dòng nào có giá trị thì giữ nguyên |

#### 3.2.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Tự điền mã vạch cho sản phẩm chưa có mã, để nhân viên không phải tự nghĩ mã và không sợ đặt trùng |
| **Tác nhân** | Nhân viên nhập hàng / chủ cửa hàng. Tác nhân phụ: hệ thống (bộ đếm Redis) |
| **Điều kiện kích hoạt** | Người dùng nhấn **Lưu** trên màn Thêm/Sửa sản phẩm, hoặc chạy Import / Import cập nhật sản phẩm |
| **Điều kiện tiên quyết** | Chi nhánh có `auto_generate_barcode = 1`; đã cấu hình đủ kiểu barcode, tiền tố và độ dài (nếu CODE128) |
| **Điều kiện sau khi thực hiện** | Sản phẩm được lưu kèm mã vạch do hệ thống sinh; bộ đếm Redis của cặp doanh nghiệp và tiền tố tăng thêm số lượng mã đã cấp |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Nhấn **Lưu** ở màn Thêm/Sửa sản phẩm, hoặc chạy Import / Import cập nhật | Đọc `config` của chi nhánh hiện tại, lấy `auto_generate_barcode`. Giá trị `0` hoặc chưa cấu hình thì bỏ qua toàn bộ luồng sinh mã, lưu sản phẩm với ô Mã vạch đúng như người dùng nhập |
| 2 | (Hệ thống tự động) | `auto_generate_barcode = 1`: đọc tiếp `barcode_type`, `barcode_prefix`, `barcode_length`. Kiểm tra sản phẩm đang lưu **đã có mã vạch chưa**. Đã có thì giữ nguyên mã cũ, không sinh, **không tiêu tốn bộ đếm** (BR-barcode-011) |
| 3 | (Hệ thống tự động) | Chưa có mã vạch: tăng bộ đếm trên Redis theo khóa `{com_id}_{barcode_prefix}` và lấy giá trị mới. Sản phẩm có nhiều đơn vị tính hoặc nhiều thuộc tính thì **mỗi đơn vị tính và mỗi thuộc tính lấy một số riêng**, bộ đếm nhảy liên tiếp (BR-barcode-013) |
| 4 | (Hệ thống tự động) | Ghép mã theo công thức ở mục 3.1.3: tiền tố cộng số chạy đệm 0 sao cho tổng mã đúng bằng độ dài — CODE128 là `barcode_length`, EAN13 là 13. Phần số chạy có `độ dài − len(prefix)` chữ số |
| 5 | (Hệ thống tự động) | Kiểm tra mã vừa ghép đã tồn tại ở sản phẩm nào trong **cùng chi nhánh** chưa (BR-barcode-014). Chưa tồn tại: gán mã cho sản phẩm, lưu sản phẩm bình thường |
| 6 | (Hệ thống tự động) | Đã tồn tại: quay lại bước 3 lấy số tiếp theo và ghép lại mã, **thử lại tối đa 5 lần** (BR-barcode-015) |
| 7 | (Hệ thống tự động) | Hết 5 lần vẫn trùng: để trống ô Mã vạch của sản phẩm, vẫn lưu sản phẩm. Ở màn **Thêm/Sửa sản phẩm** hiện thông báo **"Không sinh được mã vạch tự động. Vui lòng nhập mã vạch thủ công."**; ở luồng **Import** không hiện thông báo riêng (BR-barcode-017). Bộ đếm **không hoàn lại** các số đã tiêu (BR-barcode-016) |
| 8 | Sửa lại mã vạch hệ thống vừa sinh rồi lưu | Nhận giá trị người dùng nhập, ghi đè mã hệ thống đã sinh, không sinh lại. Áp dụng kiểm tra trùng mã vạch theo nghiệp vụ hiện hành (BR-barcode-012) |

**Riêng luồng Import và Import cập nhật:**

Import sản phẩm chạy **ngầm bất đồng bộ**. Ở bước 3 của wizard *Nhập sản phẩm từ excel*, modal chỉ báo **"Hệ thống đang xử lý dữ liệu của bạn"** kèm link *"Ấn vào để xem tiến trình xử lý"* rồi đóng; toàn bộ việc ghi sản phẩm và sinh mã vạch diễn ra ở tiến trình nền. **Giai đoạn này không bổ sung màn hình, trạng thái hay thông báo nào cho việc sinh mã vạch** — wizard và màn Lịch sử đồng bộ giữ nguyên như hiện hành.

| Bước | Hành động | Phản hồi hệ thống |
|---|---|---|
| I1 | Người dùng chọn file và chạy import | Wizard hiển thị **"Hệ thống đang xử lý dữ liệu của bạn"**, tạo tiến trình nền rồi đóng modal. Không kiểm tra trước dải số mã vạch (xem OQ-4) |
| I2 | (Tiến trình nền) | Duyệt từng dòng. Dòng nào cột Mã vạch có giá trị thì giữ nguyên; dòng nào để trống thì chạy bước 3–7 ở trên |
| I3 | (Tiến trình nền) | Dòng nào hết 5 lượt thử vẫn trùng thì **vẫn lưu sản phẩm với ô Mã vạch trống** rồi chạy tiếp các dòng sau — không dừng file, không loại dòng, **không ghi nhận riêng** (BR-barcode-017) |
| I4 | (Tiến trình nền) | Kết thúc: cập nhật trạng thái tiến trình trong **Lịch sử đồng bộ** theo nghiệp vụ hiện hành (*Thành công* / *Thất bại*). Việc có sản phẩm thiếu mã vạch **không làm đổi trạng thái** và không sinh thêm cảnh báo |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Thử 5 lần vẫn trùng mã (màn Thêm/Sửa sản phẩm) | "Không sinh được mã vạch tự động. Vui lòng nhập mã vạch thủ công." | Vẫn lưu sản phẩm, để trống ô Mã vạch |
| Import 500 dòng, một số dòng không sinh được | **Không có thông báo** — tiến trình chạy ngầm, trạng thái trong Lịch sử đồng bộ vẫn là *Thành công* | Các dòng đó vẫn được import, ô Mã vạch để trống; các dòng khác import bình thường |
| Import mà dải số của tiền tố đã cạn | **Không có thông báo** ở giai đoạn này (xem OQ-4) | Toàn bộ sản phẩm trong lần nhập đó được lưu với ô Mã vạch trống |
| Không lấy được số từ bộ đếm (Redis không phản hồi) | "Không sinh được mã vạch tự động. Vui lòng nhập mã vạch thủ công." | Coi như trường hợp không sinh được, vẫn lưu sản phẩm với ô Mã vạch trống |

#### 3.2.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-barcode-011 | Hệ thống chỉ sinh mã cho sản phẩm **chưa có mã vạch**. Sản phẩm đã có mã vạch thì giữ nguyên và không tiêu tốn bộ đếm |
| BR-barcode-012 | Mã vạch do hệ thống sinh ra **vẫn cho người dùng sửa hoặc nhập đè**; giá trị người dùng nhập được ưu tiên |
| BR-barcode-013 | Sản phẩm có nhiều **đơn vị tính** hoặc nhiều **thuộc tính** thì mỗi đơn vị tính và mỗi thuộc tính được cấp một mã vạch riêng |
| BR-barcode-014 | Kiểm tra trùng mã vạch thực hiện trong **phạm vi chi nhánh** |
| BR-barcode-015 | Mã sinh ra bị trùng thì hệ thống lấy số tiếp theo và ghép lại, **tối đa 5 lần thử** |
| BR-barcode-016 | Hết 5 lần thử vẫn trùng thì sản phẩm vẫn được lưu với ô Mã vạch trống. Ở màn Thêm/Sửa sản phẩm có thông báo yêu cầu nhập thủ công; ở luồng import thì không. Các số đã tiêu trong quá trình thử **không được hoàn lại** cho bộ đếm |
| BR-barcode-017 | Trong luồng import chạy ngầm, dòng không sinh được mã **không làm dừng cả file** và **không bị loại khỏi lần nhập** — sản phẩm vẫn được lưu với ô Mã vạch trống. Giai đoạn này **không ghi nhận riêng và không hiển thị báo cáo** cho các dòng đó; trạng thái tiến trình trong Lịch sử đồng bộ không đổi vì lý do này |
| BR-barcode-018 | Bộ đếm lưu trên Redis theo khóa `{com_id}_{tiền tố}`, giá trị là **số chạy thuần**. Bộ đếm **chạy tiếp, không reset** khi người dùng đổi tiền tố, đổi kiểu barcode hay đổi độ dài |

---

### 3.3 Cập nhật hàng loạt sinh mã barcode

#### 3.3.1 Thông tin chung về chức năng

Cho phép chủ cửa hàng chọn một danh sách sản phẩm trên màn Danh sách sản phẩm và yêu cầu hệ thống sinh mã vạch cho các sản phẩm đó. Dùng để bổ sung mã vạch cho dữ liệu cũ đã tạo trước khi bật cấu hình, thay vì phải mở sửa từng sản phẩm.

#### 3.3.2 Màn hình chức năng

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|---|---|---|---|---|
| 1 | Ô chọn dòng | Checkbox | Bỏ chọn | – | Chọn từng sản phẩm hoặc chọn tất cả trên trang danh sách |
| 2 | Thao tác **Sinh mã vạch** | Button / mục trong menu thao tác hàng loạt | – | – | Chỉ bật khi đã chọn ít nhất một sản phẩm |
| 3 | Hộp xác nhận | Modal | – | – | Hiện trước khi chạy, ghi rõ số lượng sản phẩm được chọn. Hai nút **Hủy** / **Đồng ý** (BR-barcode-019) |
| 4 | Thông báo kết quả | Toast / modal | – | – | Hiện sau khi chạy xong, ghi số sản phẩm đã sinh mã và số sản phẩm bị bỏ qua |

#### 3.3.3 Xử lý luồng sự kiện

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Bổ sung mã vạch hàng loạt cho sản phẩm cũ chưa có mã, không phải sửa từng sản phẩm |
| **Tác nhân** | Chủ cửa hàng / admin |
| **Điều kiện kích hoạt** | Người dùng chọn sản phẩm trên màn Danh sách sản phẩm rồi chọn thao tác **Sinh mã vạch** và xác nhận |
| **Điều kiện tiên quyết** | Chi nhánh có `auto_generate_barcode = 1` và đã cấu hình đủ tham số |
| **Điều kiện sau khi thực hiện** | Các sản phẩm chưa có mã trong danh sách chọn được gán mã vạch; sản phẩm đã có mã giữ nguyên; hệ thống hiện báo cáo kết quả |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|---|---|---|
| 1 | Chọn các sản phẩm cần sinh mã trên màn Danh sách sản phẩm | Bật thao tác **Sinh mã vạch**, hiển thị số lượng sản phẩm đang chọn |
| 2 | Chọn thao tác **Sinh mã vạch** | Đọc `config` của chi nhánh. `auto_generate_barcode = 0` thì báo cần bật cấu hình trước và dừng. Đang bật thì hiện hộp xác nhận ghi rõ số lượng sản phẩm được chọn (BR-barcode-019) |
| 3 | Nhấn **Đồng ý** | Duyệt lần lượt từng sản phẩm trong danh sách chọn. Sản phẩm **đã có mã vạch** thì bỏ qua, đếm vào nhóm bỏ qua, **không ghi đè** (BR-barcode-020) |
| 4 | (Hệ thống tự động) | Sản phẩm chưa có mã: chạy bước 3–7 của mục 3.2.3 — lấy số từ bộ đếm, ghép mã, kiểm tra trùng trong chi nhánh, thử lại tối đa 5 lần |
| 5 | (Hệ thống tự động) | Sản phẩm nào hết 5 lượt thử vẫn trùng thì bỏ qua sản phẩm đó và chạy tiếp các sản phẩm sau, đếm vào nhóm không sinh được |
| 6 | (Hệ thống tự động) | Chạy xong: ghi mã vạch cho các sản phẩm thành công và hiện thông báo kết quả, ví dụ **"Đã sinh mã cho 70/100 sản phẩm. 30 sản phẩm đã có mã vạch nên được bỏ qua."** Nếu có sản phẩm không sinh được thì liệt kê thêm danh sách sản phẩm đó |
| 7 | Nhấn **Hủy** ở hộp xác nhận | Đóng hộp thoại, không sinh mã, không thay đổi dữ liệu và không tiêu tốn bộ đếm |

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|---|---|---|
| Chi nhánh chưa bật cấu hình sinh mã | "Chi nhánh chưa bật cấu hình tự động sinh mã Barcode. Vui lòng vào Cấu hình > Sản phẩm để bật." | Dừng, không mở hộp xác nhận |
| Toàn bộ sản phẩm được chọn đều đã có mã vạch | "Các sản phẩm được chọn đều đã có mã vạch. Không có sản phẩm nào cần sinh mã." | Không thay đổi dữ liệu |
| Một số sản phẩm hết 5 lượt thử vẫn trùng | Báo cáo kết quả liệt kê danh sách sản phẩm không sinh được | Các sản phẩm còn lại vẫn được gán mã bình thường |

#### 3.3.4 Quy tắc nghiệp vụ

| Mã BR | Mô tả |
|---|---|
| BR-barcode-019 | Thao tác sinh mã hàng loạt bắt buộc có **hộp xác nhận** ghi rõ số lượng sản phẩm được chọn trước khi chạy |
| BR-barcode-020 | Sinh mã hàng loạt **bỏ qua** sản phẩm đã có mã vạch, không ghi đè — thống nhất với BR-barcode-011 |
| BR-barcode-021 | Kết thúc chạy hàng loạt, hệ thống phải báo số sản phẩm đã sinh mã, số sản phẩm bị bỏ qua vì đã có mã, và danh sách sản phẩm không sinh được (nếu có) |

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---|---|---|---|
| Thêm sản phẩm | Sản phẩm > Thêm sản phẩm | Cao | Ô Mã vạch được hệ thống tự điền khi lưu nếu để trống. Không còn bắt buộc người dùng tự nghĩ mã |
| Sửa sản phẩm | Sản phẩm > Sửa sản phẩm | Cao | Sản phẩm cũ chưa có mã vạch sẽ được sinh mã khi lưu lại |
| Import sản phẩm / Import cập nhật sản phẩm | Sản phẩm > Import | Cao | Cột Mã vạch để trống thì hệ thống sinh mã. Bổ sung báo cáo danh sách dòng không sinh được mã |
| Danh sách sản phẩm | Sản phẩm > Danh sách sản phẩm | Trung bình | Bổ sung thao tác hàng loạt **Sinh mã vạch** |
| In tem mã vạch | Sản phẩm > In tem | Trung bình | Sản phẩm được sinh mã tự động sẽ có mã vạch để in tem. Lưu ý mã kiểu EAN13 sinh ra **không có số kiểm tra** nên phải vẽ bằng thư viện CODE128, không dùng được thư viện EAN13 tiêu chuẩn |
| Tra cứu sản phẩm bằng máy quét (bán hàng, kiểm kê, nhập kho) | Bán hàng / Kiểm kê / Nhập kho | Trung bình | Mã nội bộ do hệ thống sinh dùng để quét tại quầy bình thường. Riêng mã kiểu EAN13 không có số kiểm tra sẽ **không đọc được bằng đầu đọc EAN13 tiêu chuẩn** — xem Open Question OQ-2 |
| Cấu hình sản phẩm | Cấu hình > Sản phẩm | Trung bình | Bổ sung một mục cấu hình mới vào màn sẵn có, đặt cạnh ba mục hiện hữu |
| Nhập sản phẩm từ excel (wizard 3 bước) | Sản phẩm > Import | Thấp | **Không thay đổi giao diện**. Việc sinh mã diễn ra trong tiến trình nền sau khi modal đóng |
| Lịch sử đồng bộ | Lịch sử đồng bộ | Thấp | **Không thay đổi**. Không bổ sung trạng thái mới; sản phẩm thiếu mã vạch không làm đổi trạng thái tiến trình |

### 4.2 Chức năng của hệ thống khác

Không áp dụng. Chức năng không gọi sang hệ thống bên ngoài. Riêng **Redis** là thành phần hạ tầng nội bộ dùng lưu bộ đếm, đã mô tả ở mục 2.5.

---

## 5. OPEN QUESTIONS

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---|---|---|---|
| OQ-1 | Khi khởi tạo khách hàng mới, cấu hình **Tự động sinh mã Barcode** mặc định là *Không áp dụng* hay *Áp dụng*? Hiện đã thống nhất là chưa cần quyết, tài liệu tạm ghi **Không áp dụng** ở mục 3.1.2 | 3.1.2, BR-barcode-001 | Chủ nhiệm sản phẩm | Chưa đặt |
| OQ-2 | Mã kiểu EAN13 sinh ra **không có số kiểm tra** theo yêu cầu của khách hàng, nên chỉ dùng được cho quản lý nội bộ và không đọc được bằng đầu đọc EAN13 tiêu chuẩn. Cần xác nhận nội dung này được ghi vào tài liệu bàn giao cho khách hàng để tránh hiểu nhầm về sau | 3.1.4 BR-barcode-003, Mục 4.1 | Khách hàng / đầu mối triển khai | Trước khi bàn giao |
| OQ-3 | Phần ứng dụng mobile (bao gồm quy tắc không cho tạo sản phẩm khi mất mạng vì không lấy được số từ bộ đếm) sẽ viết tài liệu riêng ở giai đoạn nào? | Mục 1 phạm vi | Chủ nhiệm sản phẩm | Chưa đặt |
| OQ-4 | Giai đoạn này **cố ý không cảnh báo** khi import mà dải số của tiền tố đã cạn. Hệ quả: một lần nhập hàng loạt có thể lưu hàng trăm sản phẩm với ô Mã vạch trống mà người dùng không biết, phát hiện muộn thì phải bổ sung tay số lượng lớn. Cần theo dõi sau khi lên môi trường thật, nếu phát sinh thì bổ sung cảnh báo chặn ở bước 2 của wizard (chạy đồng bộ, chỉ đọc bộ đếm nên không tiêu tốn dải số) | 3.2.3 luồng Import, BR-barcode-017 | Chủ nhiệm sản phẩm | Sau khi triển khai đợt đầu |
| OQ-5 | Màn **Danh sách sản phẩm** hiện có bộ lọc "chưa có mã vạch" không? Nếu chưa có thì người dùng không có cách nào tìm ra các sản phẩm bị thiếu mã sau khi import — đây là điều kiện để quyết định OQ-4 | 3.2.3, Mục 4.1 | Đầu mối nghiệp vụ sản phẩm | Trước khi phát triển |
