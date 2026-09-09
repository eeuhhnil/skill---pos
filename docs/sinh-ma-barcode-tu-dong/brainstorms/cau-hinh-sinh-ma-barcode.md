---
type: brainstorm
feature: sinh-ma-barcode-tu-dong
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-11
updated: 2026-08-11
links: []
tags: [barcode, cau-hinh, san-pham, code128, ean13]
stale_reason: ""
changelog:
  - 2026-08-11 | /srs | cascade: import chạy ngầm, không bổ sung thông báo sinh mã; thêm rủi ro R5
  - 2026-08-11 | /srs | cascade: tiền tố tính vào độ dài ở cả 2 kiểu, bỏ ràng buộc 50 ký tự
  - 2026-08-11 | /srs | cascade: tắt cấu hình thì kiểu mã, tiền tố, độ dài về rỗng; chỉ giữ bộ đếm
  - 2026-08-11 | /brainstorm | brainstorm cấu hình sinh mã barcode tự động, chốt 19 quyết định, còn 1 câu hỏi mở
---

# Cấu hình sinh mã barcode tự động cho sản phẩm

> Cho phép mỗi chi nhánh bật sinh mã vạch tự động khi tạo sản phẩm, chọn kiểu mã CODE128 hoặc EAN13, đặt tiền tố và độ dài, để nhân viên không phải tự nghĩ và nhập mã vạch thủ công cho những sản phẩm không có mã của nhà sản xuất.

## 1. Nguồn gốc & bối cảnh

**Yêu cầu mới từ khách hàng** (không phải cải tiến nội bộ).

Pain hiện tại: sản phẩm nào không có mã vạch sẵn của nhà sản xuất thì người dùng phải **tự nghĩ và nhập mã thủ công**, vừa mất thời gian vừa dễ đặt trùng. Với cửa hàng nhập hàng số lượng lớn hoặc bán hàng tự sản xuất thì đây là công việc lặp lại rất tốn công.

Mã sinh ra là **mã quản lý nội bộ** của khách hàng, không nhằm mục đích lưu thông ra ngoài thị trường.

## 2. Người dùng & phạm vi

| Nội dung | Chốt |
|---|---|
| Ai vào màn cấu hình | Chủ cửa hàng / admin — theo **nghiệp vụ phân quyền đã có**, không định nghĩa quyền mới |
| Ai hưởng kết quả | Người tạo sản phẩm (thêm mới, sửa, import, cập nhật hàng loạt) |
| Phạm vi cấu hình | **Riêng theo từng chi nhánh** — mỗi chi nhánh chọn kiểu mã / tiền tố / độ dài riêng |
| Đường vào | `Cấu hình` → `Sản phẩm` |
| Nền tảng | **Giai đoạn này chỉ web quản trị.** Mobile làm sau, viết tài liệu riêng |

## 3. Màn cấu hình

Khối "Tự động sinh mã Barcode" nằm chung màn `Cấu hình` → `Sản phẩm` với 3 cấu hình sản phẩm khác (quản lý theo số lô/hạn dùng, quản lý theo Imei/Serial, quản lý bảo hành). Mỗi mục là một cặp radio **Không áp dụng / Áp dụng**.

Chọn **Áp dụng** thì hiện khối con, tất cả đều là trường bắt buộc:

| Trường | Kiểu | Quy tắc |
|---|---|---|
| Kiểu barcode | Radio | CODE128 hoặc EAN13, mỗi lựa chọn có tooltip giải thích |
| Tiền tố mã vạch | Ô nhập | Tối đa 6 ký tự. CODE128 nhận chữ Latin + số; EAN13 chỉ nhận số |
| Độ dài barcode | Ô nhập | 5–50, mặc định 8, là **tổng số ký tự của cả mã** đã gồm tiền tố. Phải lớn hơn số ký tự tiền tố. **Chỉ hiện khi chọn CODE128** — chọn EAN13 thì ẩn hẳn vì đã cố định 13 |
| Barcode mẫu | Khung xem trước | Dựng đúng mã sẽ sinh ra (gồm tiền tố), cập nhật tức thì khi người dùng gõ, kèm số ký tự thực tế |

**Quy tắc ẩn hiện:** chuyển về *Không áp dụng* thì ẩn cả khối con và đưa ba giá trị đã nhập (kiểu mã, tiền tố, độ dài) **về rỗng** — bản ghi cấu hình vẫn còn, chỉ giá trị trống. Riêng **bộ đếm được giữ nguyên** để lần sau bật lại, nhập đúng tiền tố cũ thì số chạy tiếp mà không sinh trùng.

**Khung Barcode mẫu** chỉ để xem trước trên màn cấu hình, **không phải mẫu tem in thật**.

**Tooltip:**

| Kiểu | Nội dung |
|---|---|
| CODE128 | "Mã vạch nhận cả chữ và số, tổng độ dài tự chọn từ 5 đến 50 ký tự (đã gồm tiền tố). Chọn kiểu này nếu muốn đặt tiền tố có chữ để phân nhóm sản phẩm." |
| EAN13 | "Mã vạch gồm đúng 13 chữ số. Tiền tố nằm trong 13 số này và chỉ được nhập số." |

## 4. Quy tắc sinh mã

| | CODE128 | EAN13 |
|---|---|---|
| Tiền tố | Chữ Latin + số, tối đa 6 ký tự | **Chỉ số**, tối đa 6 ký tự |
| Tiền tố có tính vào độ dài? | **Có** — tiền tố nằm trong độ dài | **Có** — tiền tố nằm trong 13 số |
| Độ dài | Người dùng nhập, 5–50, mặc định 8 | Cố định 13, không cho nhập |
| Phần số chạy | Đệm 0 cho đủ `độ dài − độ dài tiền tố` | Đệm 0 cho đủ `13 − độ dài tiền tố` |
| Số kiểm tra | Không có | **Không có** (quyết định của khách hàng — xem rủi ro R3) |
| Tổng độ dài mã | Luôn đúng bằng độ dài cấu hình | Luôn đúng 13 |

**Ví dụ CODE128** — tiền tố `SP` (2 ký tự), độ dài 8 nên còn 6 số chạy:

| Bộ đếm | Mã vạch | Số ký tự |
|---|---|---|
| 1 | `SP000001` | 8 |
| 2 | `SP000002` | 8 |
| 14 | `SP000014` | 8 |

**Ví dụ EAN13** — tiền tố `88` (còn 11 số chạy):

| Bộ đếm | Mã vạch | Số ký tự |
|---|---|---|
| 1 | `8800000000001` | 13 |
| 2 | `8800000000002` | 13 |

Tiền tố `889` thì còn 10 số chạy: bộ đếm 1 cho ra `8890000000001`.

## 5. Bộ đếm số chạy

Lưu trên **Redis**, một khoá cho mỗi cặp **doanh nghiệp + tiền tố**:

```
key   = {com_id}_{tiền tố}        VD: 123_89, 123_SP
value = số chạy thuần             VD: 1, 2, 14
```

Tiền tố và phần đệm 0 được ghép lúc sinh mã, **không lưu trong value**. Nhờ vậy tiền tố có chữ (CODE128) vẫn tăng số bình thường, và đổi độ dài cấu hình không ảnh hưởng tới bộ đếm.

**Quy tắc: chạy tiếp, không reset.** Mỗi tiền tố nhớ số cuối cùng của riêng nó. Đổi tiền tố thì số bắt đầu lại từ 1 vì đó là khoá mới; đổi ngược về tiền tố cũ thì chạy tiếp số cũ nên không sinh trùng.

**Ví dụ minh hoạ** — doanh nghiệp `123`, chi nhánh CN01, CODE128 độ dài 8:

| # | Hành động | Khoá Redis | Value sau | Mã sinh ra |
|---|---|---|---|---|
| 1 | Thêm SP "Bút bi Thiên Long" | `123_SP` | 1 | `SP000001` |
| 2 | Thêm SP "Vở ô ly 96 trang" | `123_SP` | 2 | `SP000002` |
| 3 | Thêm SP "Bút chì 2B" | `123_SP` | 3 | `SP000003` |
| 4 | Đổi tiền tố sang `32`, lưu cấu hình | — | — | — |
| 5 | Thêm SP "Tẩy Pentel" | `123_32` (khoá mới) | 1 | `32000001` |
| 6 | Thêm SP "Thước kẻ 20cm" | `123_32` | 2 | `32000002` |
| 7 | Đổi tiền tố về lại `SP` | — | — | — |
| 8 | Thêm SP "Compa" | `123_SP` | **4** (chạy tiếp từ 3) | `SP000004` |

Trạng thái cuối: `123_SP = 4`, `123_32 = 2`. Bước 8 là điểm mấu chốt — bộ đếm không quay về 1 nên không đụng `SP000001` đã tồn tại.

**Lưu ý về phạm vi:** bộ đếm dùng chung **theo doanh nghiệp**, trong khi cấu hình đặt **theo chi nhánh**. Nhờ vậy hai chi nhánh vô tình đặt cùng tiền tố vẫn không sinh ra mã giống nhau. Còn **kiểm tra trùng** thì thực hiện trong **phạm vi chi nhánh**.

## 6. Các luồng chính

### 6.1 Luồng A — Lưu cấu hình

1. Người dùng vào `Cấu hình` → `Sản phẩm`, chuyển "Tự động sinh mã Barcode" sang **Áp dụng**.
2. Hệ thống hiện khối con: kiểu barcode, tiền tố, độ dài, barcode mẫu.
3. Người dùng chọn kiểu barcode. Chọn **EAN13** thì hệ thống ẩn ô độ dài.
4. Người dùng nhập tiền tố và (nếu CODE128) độ dài. Hệ thống **cập nhật ảnh mẫu tức thì** theo từng ký tự gõ vào.
5. Người dùng bấm **Lưu**. Hệ thống kiểm tra: độ dài phải lớn hơn số ký tự tiền tố (còn chỗ cho số chạy), và phần số chạy đủ chứa bộ đếm hiện tại của tiền tố đó.
6. Đạt thì lưu và báo thành công; không đạt thì báo lỗi và giữ nguyên màn cho người dùng sửa.

```
NGƯỜI DÙNG: Cấu hình → Sản phẩm
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

### 6.2 Luồng B — Sinh mã khi lưu sản phẩm

Áp dụng cho cả 5 điểm chạm: **thêm sản phẩm, sửa sản phẩm, import sản phẩm, import cập nhật sản phẩm, cập nhật hàng loạt**.

1. Người dùng lưu sản phẩm.
2. Hệ thống kiểm tra chi nhánh có bật sinh mã tự động không. Không bật thì để trống ô mã vạch.
3. Có bật thì kiểm tra sản phẩm đã có mã vạch chưa. Đã có thì **giữ nguyên mã cũ, không sinh đè**.
4. Chưa có thì tăng bộ đếm Redis theo khoá `{com_id}_{tiền tố}` và lấy số mới.
5. Ghép mã theo kiểu barcode đang cấu hình.
6. Kiểm tra mã vừa ghép đã tồn tại trong chi nhánh chưa. Chưa có thì gán cho sản phẩm và lưu.
7. Đã tồn tại thì quay lại bước 4, **thử lại tối đa 5 lần**. Hết 5 lần vẫn trùng thì để trống ô mã vạch và báo người dùng nhập tay.

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
                   │ không sinh  │  │ khoá {com_id}_{tiền  │
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

## 7. Điểm rẽ nhánh nghiệp vụ

| ID | Luồng | Điều kiện | Có | Không |
|---|---|---|---|---|
| D1 | B | Chi nhánh bật sinh mã tự động? | Đi tiếp D2 | Để trống ô mã vạch, người dùng tự nhập |
| D2 | B | Sản phẩm đã có mã vạch? | Giữ mã cũ, không sinh đè | Sinh mã mới |
| D3 | B | Mã vừa sinh đã tồn tại trong chi nhánh? | Thử lại, tối đa 5 lần | Gán mã, lưu sản phẩm |
| D4 | B | Đã thử đủ 5 lần? | Để trống mã, báo nhập tay | Quay lại lấy số tiếp theo |
| D5 | A | Kiểu barcode là EAN13? | Ẩn ô độ dài, tiền tố chỉ nhận số | Hiện ô độ dài 5–50, tiền tố nhận cả chữ |
| D6 | A | Độ dài lớn hơn số ký tự tiền tố? | Đi tiếp D7 | Chặn lưu, báo lỗi |
| D7 | A | Phần số chạy đủ chứa bộ đếm hiện tại? | Lưu thành công | Chặn lưu, báo độ dài tối thiểu |

## 8. Bảng tình huống

| Tình huống | Xử lý |
|---|---|
| Sản phẩm đã có mã vạch của nhà sản xuất | Giữ nguyên, **không sinh đè**. Bộ đếm không bị tiêu tốn |
| Người dùng muốn sửa mã hệ thống vừa sinh | **Được phép** sửa và nhập đè bình thường |
| Sản phẩm nhiều đơn vị tính (lon / thùng) | **Mỗi đơn vị một mã riêng**, bộ đếm nhảy liên tiếp |
| Sản phẩm nhiều thuộc tính (size, màu) | **Mỗi biến thể một mã riêng** |
| Mã sinh ra trùng mã đã có trong chi nhánh | Thử lại tối đa **5 lần**. Hết lượt thì để trống mã, báo nhập tay. Bộ đếm **không hoàn lại**, chấp nhận bỏ phí vài số |
| Tiền tố 6 ký tự nhưng độ dài chỉ 5 | Không còn chỗ cho số chạy → **chặn ngay lúc lưu cấu hình**. Độ dài phải lớn hơn số ký tự tiền tố |
| Bộ đếm tràn phần số chạy (tiền tố `SP`, độ dài 8 nên còn 6 số, bộ đếm tới 1.000.000) | **Chặn từ đầu nguồn:** lúc lưu cấu hình nếu phần số chạy không đủ chứa bộ đếm thì báo lỗi kèm độ dài tối thiểu. Cảnh báo trước ở mốc **90% dải số**. Lúc tạo sản phẩm là lưới an toàn cuối: để trống mã cho nhập tay |
| Tắt sinh mã tự động rồi bật lại | Cấu hình phải nhập lại từ đầu vì ba giá trị đã về rỗng. Bộ đếm giữ nguyên nên nhập lại đúng tiền tố cũ thì số chạy tiếp, không sinh trùng |
| Nhiều nhân viên cùng tạo sản phẩm một lúc | Bộ đếm tăng trên Redis nên mỗi người lấy một số khác nhau, không trùng |

## 9. Kiểm tra, giới hạn & thông báo

### 9.1 Quy tắc kiểm tra

| Trường | Quy tắc |
|---|---|
| Tiền tố mã vạch | Bắt buộc. Tối đa 6 ký tự. CODE128: chữ Latin + số. EAN13: chỉ số |
| Độ dài barcode | Bắt buộc khi CODE128. Từ 5 đến 50, mặc định 8. Là **tổng số ký tự cả mã**, đã gồm tiền tố |
| Độ dài vs tiền tố | Độ dài phải lớn hơn số ký tự tiền tố ít nhất 1 (phần số chạy tối thiểu 1 chữ số) |
| Phần số chạy vs bộ đếm | Phần số chạy (`độ dài − độ dài tiền tố`) phải ≥ số chữ số của bộ đếm hiện tại của tiền tố đó |
| Số lần thử lại khi trùng | 5 |
| Ngưỡng cảnh báo dải số | 90% sức chứa |

### 9.2 Thông báo lỗi

| Tình huống | Câu thông báo |
|---|---|
| Retry 5 lần vẫn trùng | "Không sinh được mã vạch tự động. Vui lòng nhập mã vạch thủ công." |
| EAN13, tiền tố có chữ | "Tiền tố mã vạch của kiểu EAN13 chỉ được nhập số." |
| CODE128, tiền tố có ký tự đặc biệt | "Tiền tố mã vạch chỉ được nhập chữ và số." |
| Tiền tố quá 6 ký tự | "Tiền tố mã vạch tối đa 6 ký tự." |
| Độ dài ngoài khoảng | "Độ dài mã vạch phải từ 5 đến 50 ký tự." |
| Độ dài không lớn hơn số ký tự tiền tố | "Độ dài mã vạch phải lớn hơn số ký tự của tiền tố." |
| Phần số chạy không đủ chứa bộ đếm | "Tiền tố `SP` đã sinh tới mã thứ 100.000, độ dài mã vạch tối thiểu là 8 ký tự." |

### 9.3 Thông báo thành công

| Tình huống | Câu thông báo |
|---|---|
| Lưu cấu hình | "Lưu cấu hình thành công." |
| Cập nhật hàng loạt xong | "Đã sinh mã cho 70/100 sản phẩm. 30 sản phẩm đã có mã vạch nên được bỏ qua." |

### 9.4 Thông báo cảnh báo

| Tình huống | Câu thông báo |
|---|---|
| Dải số còn dưới 10% | "Dải số của tiền tố `SP` sắp hết. Nên tăng độ dài mã vạch." |

## 10. Import & cập nhật hàng loạt

**Import sản phẩm / import cập nhật sản phẩm** — chạy **ngầm bất đồng bộ**:
- Wizard *Nhập sản phẩm từ excel* ở bước 3 chỉ báo "Hệ thống đang xử lý dữ liệu của bạn" rồi đóng; việc ghi sản phẩm và sinh mã diễn ra ở tiến trình nền, tra kết quả ở màn **Lịch sử đồng bộ**.
- File import có cột mã vạch. Dòng nào để trống thì hệ thống sinh mã theo luồng B.
- Dòng nào không sinh được (hết 5 lượt thử) thì **vẫn lưu sản phẩm với ô mã vạch trống** rồi chạy tiếp các dòng sau — không dừng file, không loại dòng.
- **Giai đoạn này không bổ sung thông báo, trạng thái hay màn hình nào** cho việc sinh mã: wizard và Lịch sử đồng bộ giữ nguyên như hiện hành. Rủi ro đi kèm ghi ở R5.

**Cập nhật hàng loạt** (người dùng chọn danh sách sản phẩm để sinh mã):
- Sản phẩm **đã có mã vạch** thì bỏ qua, **không ghi đè** — thống nhất với luồng thêm/sửa.
- Có **màn xác nhận** trước khi chạy.
- Chạy xong báo kết quả: *"Đã sinh mã cho 70/100 sản phẩm. 30 sản phẩm đã có mã vạch nên được bỏ qua."*

## 11. Lưu trữ cấu hình

Bốn dòng trong bảng `config`, đặt riêng theo từng chi nhánh:

| `config.code` | Giá trị | Ghi chú |
|---|---|---|
| `auto_generate_barcode` | `0` = Không áp dụng, `1` = Áp dụng | |
| `barcode_type` | `1` = CODE128, `2` = EAN13 | |
| `barcode_prefix` | Tối đa 6 ký tự | CODE128 nhận chữ + số; EAN13 chỉ số |
| `barcode_length` | 5–50, mặc định 8 | Tổng số ký tự cả mã, đã gồm tiền tố. Chỉ dùng cho CODE128; EAN13 bỏ trống |

## 12. Giả định

1. Trường lưu mã vạch của sản phẩm có sức chứa **50 ký tự** — đây là căn cứ cho trần độ dài. Vì tiền tố đã nằm trong độ dài nên mã sinh ra không bao giờ vượt 50 ký tự.
2. Redis luôn sẵn sàng khi người dùng tạo sản phẩm. Trường hợp Redis không phản hồi thì coi như không sinh được mã.
3. Mã sinh ra chỉ dùng **quản lý nội bộ**, không lưu thông ra thị trường nên không cần đăng ký mã doanh nghiệp.
4. Độ dài 50 ký tự là trần kỹ thuật, thực tế không dùng tới — tem CODE128 50 ký tự in ra dài khoảng 20cm, không dán vừa sản phẩm. Mặc định 8 là con số nên khuyến nghị.

## 13. Rủi ro

| ID | Rủi ro | Khả năng | Hậu quả nghiệp vụ | Cách phòng |
|---|---|---|---|---|
| R1 | Mã nội bộ bị lẫn với mã vạch của nhà sản xuất, khó phân biệt khi tra cứu | Thường | Nhân viên nhầm lẫn khi kiểm kê, khó lọc riêng sản phẩm tự đặt mã | Khuyến nghị khách hàng đặt tiền tố riêng biệt cho mã nội bộ và ghi vào tài liệu hướng dẫn |
| R2 | Chọn sai kiểu barcode nên tem in ra máy quét không đọc được | Thỉnh thoảng | Phải in lại toàn bộ tem, tốn vật tư và thời gian | Tooltip giải thích rõ hai kiểu; khung xem trước dựng đúng mã sẽ sinh để người dùng thử quét trước khi in loạt |
| R3 | **EAN13 không có số kiểm tra** nên đầu đọc mã vạch tiêu chuẩn từ chối đọc tem, và ảnh mẫu phải vẽ bằng thư viện khác thay vì thư viện EAN13 | Thường | Nếu về sau khách hàng muốn dùng tem ở nơi có máy quét siêu thị tiêu chuẩn thì phải làm lại toàn bộ dải mã | Đã thống nhất với khách hàng là mã chỉ dùng nội bộ. Cần ghi rõ giới hạn này trong tài liệu bàn giao để tránh hiểu nhầm về sau |
| R4 | Khách hàng đổi tiền tố nhiều lần làm dải mã phân mảnh, khó nhìn ra thứ tự sản phẩm | Hiếm | Gây khó khi đối chiếu thủ công, không ảnh hưởng dữ liệu | Bộ đếm nhớ theo từng tiền tố nên không sinh trùng; chấp nhận việc số không liên tục |
| R5 | Import chạy ngầm và **không có thông báo** khi sản phẩm không sinh được mã vạch — kể cả khi dải số của tiền tố đã cạn | Thỉnh thoảng | Một lần nhập hàng loạt có thể lưu hàng trăm sản phẩm với ô mã vạch trống mà không ai biết; phát hiện muộn thì phải bổ sung tay số lượng lớn | Đã thống nhất chấp nhận ở giai đoạn này để giữ luồng import nguyên trạng. Theo dõi sau khi lên môi trường thật; nếu phát sinh thì bổ sung cảnh báo chặn ở bước 2 của wizard (chạy đồng bộ, chỉ đọc bộ đếm nên không tiêu dải số) |

## 14. Ngoài phạm vi

- **Ứng dụng mobile** — giai đoạn này chỉ làm web quản trị. Phần mobile (gồm quy tắc không cho tạo sản phẩm khi mất mạng vì không lấy được số từ Redis) sẽ viết tài liệu riêng.
- **Mẫu tem in** — khung "Barcode mẫu" chỉ để xem trước trên màn cấu hình, không định nghĩa mẫu tem in thật.
- **Quyền truy cập màn cấu hình** — dùng nghiệp vụ phân quyền đã có, không định nghĩa quyền mới.
- **Đăng ký mã vạch chuẩn quốc tế** cho khách hàng.

## 15. Câu hỏi mở

- [~] **OQ-1**: Khi khởi tạo khách hàng mới thì cấu hình "Tự động sinh mã Barcode" mặc định là *Không áp dụng* hay *Áp dụng*? — Ngoài phạm vi quan tâm ở thời điểm này. Tạm lấy **Không áp dụng**, vì bật sẵn mà khách chưa kịp đặt tiền tố thì các sản phẩm nhập vào đầu tiên sẽ mang mã theo tiền tố rỗng, sau muốn đổi thì mã cũ đã lỡ sinh.

## 16. Bước tiếp theo

- `/srs sinh-ma-barcode-tu-dong` — viết đặc tả cho màn cấu hình và quy tắc sinh mã.
- `/usecase sinh-ma-barcode-tu-dong` — mô tả chi tiết luồng B theo từng điểm chạm (thêm, sửa, import, cập nhật hàng loạt).
