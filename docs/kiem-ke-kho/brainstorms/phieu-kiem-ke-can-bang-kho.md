---
type: brainstorm
feature: kiem-ke-kho
status: draft
lang: vi
owner: "@huelinh"
created: 2026-09-05
updated: 2026-09-05
links: [docs/kiem-ke-kho/gd1-giai-phap-so-bo.md, docs/sua-ton-lo-san-pham/srs/spec.md]
tags: [ton-kho, kiem-ke, phieu-dieu-chinh, gia-von]
stale_reason: ""
mode: deep
changelog:
  - 2026-09-05 | /brainstorm | chốt 10 OQ: giá vốn theo kỳ ngày kiểm kê, không cảnh báo trùng mã, không tự lưu tạm
  - 2026-09-05 | /brainstorm | brainstorm kiểm kê kho, bỏ đóng băng khi nháp và bỏ gộp phiếu
---

# Phiếu kiểm kê và cân bằng kho — Brainstorm

> Bổ sung nghiệp vụ kiểm kê kho: lập phiếu kiểm kê cho một kho, ghi số đếm thực tế, đối chiếu với tồn sổ sách, tính chênh lệch cả số lượng lẫn giá trị, rồi cân bằng kho bằng chứng từ nhập/xuất tự sinh.

## 1. Idea Seed

Phần mềm chưa có kiểm kê kho. Hiện mới có nhập kho, xuất kho, chuyển kho, và cho phép chỉnh sửa số lượng tồn trực tiếp trong thông tin sản phẩm. Người dùng đã trực tiếp phản ánh vì sao chưa có chức năng kiểm kê.

## 2. Context

**Đã có trong phần mềm:**

- Ba giao dịch kho: **nhập kho, xuất kho, chuyển kho**.
- **Sửa số lượng tồn trực tiếp** trong thông tin sản phẩm; hệ thống tự sinh chứng từ điều chỉnh nhập/xuất phần chênh lệch. Sản phẩm có theo dõi lô thì sửa theo từng lô — xem [docs/sua-ton-lo-san-pham/srs/spec.md](../../sua-ton-lo-san-pham/srs/spec.md).

**Chưa có:**

- Chứng từ kiểm kê để chốt danh sách sản phẩm cần đếm và lưu song song số sổ sách với số đếm thực tế.
- Cách truy vết ai đã kiểm, kiểm khi nào, lệch bao nhiêu.
- Cách quy đổi chênh lệch ra **giá trị bằng tiền** cho kế toán.

Thượng nguồn: [docs/kiem-ke-kho/gd1-giai-phap-so-bo.md](../gd1-giai-phap-so-bo.md) (Giai đoạn 1).

**Hai quyết định đảo lại so với Giai đoạn 1:**

| Giai đoạn 1 ghi | Chốt lại tại buổi brainstorm |
|---|---|
| Cố định dữ liệu — đóng băng tồn sổ sách tại thời điểm bắt đầu đếm làm mốc đối chiếu | **Không giữ mốc cứng khi phiếu còn Nháp.** Tồn sổ sách nạp lại theo số hiện tại mỗi lần mở phiếu. Đến khi cân bằng thì nạp lần cuối, tính chênh lệch trên số đó rồi **ghi cứng bộ số vào phiếu**. Không khóa kho, không chặn bán hàng |
| (chưa có) Gộp nhiều phiếu nháp của nhiều người thành một phiếu | **Bỏ gộp phiếu.** Có bàn giữa buổi rồi chốt không làm |

## 3. User Types

| Vai trò | Quyền | Ghi chú |
|---|---|---|
| Người có quyền kiểm kê kho | **Tạo / Sửa / Xóa / Xem** phiếu kiểm kê | Phân quyền do khách tự cấu hình theo vai trò họ dựng |
| Người chỉ có quyền Xem | Mở phiếu để đối soát, không sửa | Thường là kế toán, chủ cửa hàng |

- **Không giới hạn theo chi nhánh** — ai có quyền thì kiểm được mọi kho.
- Điểm vào: menu **Kho > Kiểm kê kho**, đặt dưới mục Giao dịch.

## 4. Capabilities Breakdown

### P0 — bắt buộc

- Lập phiếu kiểm kê cho **một kho**; đưa sản phẩm vào phiếu bằng hai cách (chọn tất cả hàng hóa trong kho, hoặc chọn tay bằng tìm kiếm và quét barcode).
- Sản phẩm có theo dõi lô thì kiểm tới **từng lô**.
- Hệ thống nạp **tồn sổ sách hiện tại** cho từng dòng.
- Nhập số đếm thực tế; tự tính **chênh lệch số lượng** từng dòng.
- Tính **giá trị tồn sổ sách, giá trị thực tế, giá trị chênh lệch** theo giá vốn; tổng giá trị chênh lệch của cả phiếu.
- **Cân bằng kho**: tự sinh chứng từ nhập cho phần thừa, chứng từ xuất cho phần thiếu, cập nhật tồn.
- Trạng thái phiếu **Nháp / Hoàn thành**; hoàn thành là khóa phiếu.
- Danh sách phiếu kiểm kê lọc theo kho, thời gian, người kiểm, trạng thái.

### P1 — nên có

- Quét barcode để thêm sản phẩm vào phiếu và cộng dồn số đếm — làm được **cả trên bản web bằng máy quét, lẫn trên mobile bằng camera**, tùy người dùng chọn.
- Ghi **lý do chênh lệch** cho từng dòng (hỏng vỡ, thất thoát, nhầm mã, sai sót nhập liệu) — **không bắt buộc nhập**.
- Lọc riêng các dòng có chênh lệch trên phiếu.
- In và xuất biên bản kiểm kê để ký và lưu hồ sơ — có **mẫu chung sẵn**, người dùng **chỉnh lại mẫu** được.

### P2 — có thì tốt

- Báo cáo chênh lệch kiểm kê theo kỳ — **nằm chung trong báo cáo xuất nhập tồn**, không làm màn báo cáo riêng.
- Theo dõi tiến độ đếm: đánh dấu dòng nào đã nhập, dòng nào còn trống.

## 5. Core Flow (Happy Path)

### Luồng — Lập phiếu kiểm kê và cân bằng kho

1. Người dùng vào **Kho > Kiểm kê kho**, bấm **Thêm phiếu**.
2. Chọn **kho** cần kiểm — một phiếu chỉ một kho.
3. Đưa sản phẩm vào phiếu theo một trong hai cách:
   - Tick **Chọn tất cả hàng hóa trong kho** — danh sách chỉ hiển thị theo **đơn vị tính chính** của từng mã.
   - **Chọn tay**: tìm kiếm sản phẩm hoặc quét barcode để thêm từng mã.
   - Sản phẩm có theo dõi lô thì chọn tới từng lô cần đếm.
4. Hệ thống nạp **tồn sổ sách hiện tại** cho từng dòng; khi phiếu còn Nháp thì mỗi lần mở lại là nạp số mới nhất.
5. Người dùng nhập hoặc quét mã để ghi **số đếm thực tế** từng dòng. Bỏ trống nghĩa là **chưa kiểm**.
6. Hệ thống tính **chênh lệch số lượng** và **chênh lệch giá trị** từng dòng, cộng tổng giá trị chênh lệch của phiếu.
7. Người dùng **Lưu nháp** để đếm tiếp lần sau, hoặc bấm **Cân bằng kho**.
8. Nếu còn dòng chưa kiểm, hệ thống cảnh báo để người dùng chọn loại bỏ những dòng đó khỏi phiếu, hoặc quay lại kiểm tiếp. Sau đó hiển thị câu xác nhận cân bằng kho.
9. Người dùng xác nhận. Hệ thống **nạp tồn sổ sách lần cuối**, tính chênh lệch trên số vừa nạp, sinh chứng từ điều chỉnh cho từng dòng có lệch, cập nhật tồn (tới từng lô nếu có), **ghi cứng bộ số của từng dòng vào phiếu** (tồn sổ sách, số thực tế, chênh lệch, giá vốn đã dùng, giá trị chênh lệch), rồi chuyển phiếu sang **Hoàn thành** và khóa lại.

```
        ┌──────────────────────────────────────┐
        │ Kho > Kiểm kê kho > Thêm phiếu       │
        └──────────────────┬───────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │ Chọn kho (1 phiếu = 1 kho)           │
        └──────────────────┬───────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │ Đưa sản phẩm vào phiếu — 2 cách:     │
        │  1. Tick "Chọn tất cả hàng hóa trong │
        │     kho" → chỉ hiện theo ĐVT chính   │
        │  2. Chọn tay: tìm kiếm sản phẩm      │
        │     hoặc quét barcode                │
        │ SP theo dõi lô → chọn tới từng lô    │
        └──────────────────┬───────────────────┘
                           ▼
        ╔══════════════════════════════════════╗
        ║ HỆ THỐNG nạp tồn sổ sách hiện tại    ║
        ║ cho từng dòng (còn Nháp: mở lại là   ║
        ║ nạp số mới nhất)                     ║
        ╚══════════════════┬═══════════════════╝
                           ▼
        ┌──────────────────────────────────────┐
        │ Nhập hoặc quét mã để đếm thực tế     │
        │ ≥ 0, cho số lẻ, bỏ trống = chưa kiểm │
        └────────┬────────────────────┬────────┘
                 │ Lưu nháp           │ Cân bằng kho
                 ▼                    ▼
        ┌────────────────┐   ◇────────────────────◇
        │ Phiếu: Nháp    │   │ Còn dòng chưa kiểm? │
        │ (quay lại sau) │   ◇──┬──────────────┬───◇
        └────────────────┘   CÓ │              │ KHÔNG
                                ▼              │
        ┌───────────────────────────────────┐  │
        │ "Trong phiếu kiểm kho có {N} sản  │  │
        │  phẩm chưa kiểm. Bạn có muốn loại │  │
        │  bỏ các sản phẩm chưa kiểm khỏi   │  │
        │  phiếu để cân bằng hay tiếp tục   │  │
        │  kiểm?"                           │  │
        └──────┬─────────────────────┬──────┘  │
      Tiếp tục │                     │ Loại bỏ │
        kiểm   │                     ▼         ▼
               │            ┌────────────────────────┐
               │            │ "Lưu ý: Khi cân bằng   │
               │            │  kho, phần mềm sẽ tự   │
               │            │  động tạo phiếu nhập/  │
               │            │  xuất kho để điều      │
               │            │  chỉnh số lượng hàng   │
               │            │  hóa theo kết quả kiểm │
               │            │  kê. Bạn có chắc chắn  │
               │            │  muốn cân bằng kho?"   │
               │            └───────────┬────────────┘
               │                        │ Xác nhận
               │                        ▼
               │       ╔═══════════════════════════════════╗
               │       ║ HỆ THỐNG nạp tồn lần cuối, rồi xử ║
               │       ║ lý từng dòng đã kiểm:             ║
               │       ║  thực tế > sổ sách → phiếu NHẬP   ║
               │       ║  thực tế < sổ sách → phiếu XUẤT   ║
               │       ║  bằng nhau        → không sinh    ║
               │       ║ Cập nhật tồn (theo lô nếu có)     ║
               │       ║ Ghi cứng bộ số vào phiếu          ║
               │       ╚═══════════════┬═══════════════════╝
               │                       ▼
               │            ┌────────────────────────┐
               └───────────▶│ Phiếu: Hoàn thành      │
            (quay lại nhập) │ Khóa, không sửa được   │
                            └────────────────────────┘
```

## 6. System Behavior Deep Dive

### 6.1 Điểm rẽ nhánh

| ID | Ở bước | Điều kiện | Nhánh CÓ | Nhánh KHÔNG |
|---|---|---|---|---|
| DP-1 | Đưa sản phẩm vào phiếu | Tick "Chọn tất cả hàng hóa trong kho"? | Nạp toàn bộ mã của kho, chỉ hiện theo đơn vị tính chính | Người dùng tự tìm kiếm hoặc quét barcode thêm từng mã |
| DP-2 | Đưa sản phẩm vào phiếu | Sản phẩm có theo dõi lô? | Tách dòng theo từng lô, kiểm tới mức lô | Một dòng cho cả mã |
| DP-3 | Bấm Cân bằng kho | Còn dòng chưa nhập số thực tế? | Cảnh báo, cho chọn loại bỏ dòng chưa kiểm hoặc quay lại kiểm tiếp | Đi thẳng tới câu xác nhận cân bằng |
| DP-4 | Cân bằng từng dòng | Số thực tế so với tồn sổ sách | Thực tế **lớn hơn** sinh chứng từ **nhập** điều chỉnh; thực tế **nhỏ hơn** sinh chứng từ **xuất** điều chỉnh | Bằng nhau thì không sinh chứng từ nào |
| DP-5 | Cân bằng từng dòng | Dòng đang ở trạng thái chưa kiểm? | Bỏ qua, không cân bằng, không sinh chứng từ | Cân bằng theo số đã đếm |

### 6.2 Bảng tình huống

| # | Loại sản phẩm | Số thực tế so với sổ sách | Hệ thống làm gì | Người dùng thấy gì |
|---|---|---|---|---|
| 1 | Không theo dõi lô | Thực tế > sổ sách | Sinh chứng từ **nhập** điều chỉnh phần thừa, tăng tồn của kho | Dòng chênh lệch số dương, giá trị chênh lệch dương |
| 2 | Không theo dõi lô | Thực tế < sổ sách | Sinh chứng từ **xuất** điều chỉnh phần thiếu, giảm tồn của kho | Dòng chênh lệch số âm, giá trị chênh lệch âm |
| 3 | Không theo dõi lô | Bằng nhau | Không sinh chứng từ, tồn giữ nguyên | Chênh lệch bằng 0 |
| 4 | Không theo dõi lô | Bỏ trống (chưa kiểm) | Bỏ qua dòng, không cân bằng | Cảnh báo còn sản phẩm chưa kiểm khi bấm cân bằng |
| 5 | Có theo dõi lô | Thực tế > sổ sách ở một lô | Sinh chứng từ nhập điều chỉnh **cho đúng lô đó**, tăng tồn lô rồi cộng lên tồn kho | Chênh lệch hiển thị ở dòng lô |
| 6 | Có theo dõi lô | Thực tế < sổ sách ở một lô | Sinh chứng từ xuất điều chỉnh **cho đúng lô đó**, giảm tồn lô rồi trừ khỏi tồn kho | Chênh lệch hiển thị ở dòng lô |
| 7 | Có theo dõi lô | Lệch ở nhiều lô cùng lúc | Xử lý độc lập từng lô theo tình huống 5 và 6 | Nhiều dòng lô cùng có chênh lệch |
| 8 | Có theo dõi lô | Chỉ kiểm một phần các lô của mã | Chỉ cân bằng những lô đã kiểm, lô không đưa vào phiếu giữ nguyên | Tồn tổng của mã thay đổi đúng phần lô đã kiểm |

### 6.3 Trạng thái phiếu

| Đối tượng | Từ | Sang | Trigger | Quay lại được? |
|---|---|---|---|---|
| Phiếu kiểm kê | (mới) | **Nháp** | Người dùng bấm Lưu nháp | — |
| Phiếu kiểm kê | Nháp | Nháp | Sửa lại số đếm, thêm bớt dòng | Có |
| Phiếu kiểm kê | Nháp | (xóa) | Người có quyền Xóa xóa phiếu nháp | Không |
| Phiếu kiểm kê | Nháp | **Hoàn thành** | Xác nhận cân bằng kho | **Không** — phiếu khóa, muốn chỉnh phải lập phiếu mới |

Chỉ có hai trạng thái **Nháp** và **Hoàn thành**. **Không có trạng thái Hủy**, không đảo ngược được phiếu đã hoàn thành.

### 6.4 Tình huống đứt quãng

| Tình huống | Hệ thống xử lý thế nào | Người dùng phải làm gì |
|---|---|---|
| Mất mạng hoặc tắt máy khi đang nhập, **chưa bấm Lưu nháp** | **Chốt: không tự lưu tạm.** Số đã nhập mất | Nhập lại tay từ đầu |
| Đã Lưu nháp rồi thoát | Phiếu giữ nguyên ở trạng thái Nháp | Mở lại phiếu, đếm tiếp |
| Phiếu nháp bỏ quên lâu ngày | **Để nguyên mãi**, không tự dọn, không nhắc | Người dùng tự xóa nếu không dùng |
| Hai phiếu nháp cùng một kho, **khác mã sản phẩm** | Không xung đột — cân bằng chỉ tác động đúng những dòng có trong phiếu | Không cần làm gì |
| Hai phiếu nháp cùng một kho, **trùng mã sản phẩm** | Phiếu cân bằng sau ghi đè kết quả của phiếu cân bằng trước. **Chốt: không cảnh báo trùng mã** | Tự thỏa thuận chia mã trước khi đếm |
| Vẫn bán hàng trong lúc đếm | Phiếu còn Nháp thì tồn sổ sách nạp lại mỗi lần mở; lúc cân bằng nạp lần cuối rồi mới tính chênh lệch, nên giao dịch bán phát sinh không bị nuốt oan | Nên đếm và cân bằng gần nhau về thời gian |
| Mở lại phiếu đã Hoàn thành | Đọc bộ số **đã ghi cứng trong phiếu**, không đọc tồn hiện tại — biên bản in ra luôn khớp màn hình | Không cần làm gì |

### 6.5 Tình huống khác

- Sản phẩm có nhiều đơn vị tính: khi **chọn tay** thì người dùng tự chọn đơn vị muốn kiểm; khi **tick chọn tất cả hàng hóa trong kho** thì danh sách chỉ hiện các sản phẩm theo **đơn vị tính chính**.
- Hai người cùng kiểm một kho là chuyện bình thường, mỗi người một phiếu riêng, chia nhau theo mã sản phẩm.

## 7. Validation, Limits & Wording

### 7.1 Ràng buộc nhập liệu

| Nội dung | Quy tắc |
|---|---|
| Số đếm thực tế | **Không cho số âm**; **cho số lẻ**; **cho nhập 0** (nghĩa là đếm được 0, khác với bỏ trống) |
| Bỏ trống số thực tế | Hiểu là **chưa kiểm** — không cân bằng, không sinh chứng từ |
| Tồn sổ sách | Hệ thống tự nạp, người dùng **không sửa được** |
| Chênh lệch số lượng | Tự tính, bằng số thực tế trừ tồn sổ sách |
| Lý do chênh lệch | **Không bắt buộc** — người dùng tự chọn có ghi hay không cho từng dòng |
| Kho trên phiếu | Một phiếu **một kho**, không đổi kho sau khi đã nhập số đếm |

### 7.2 Giá trị và giới hạn

| Nội dung | Giá trị |
|---|---|
| Giá trị tồn sổ sách của dòng | Tồn sổ sách **nhân** giá vốn |
| Giá trị thực tế của dòng | Số đếm thực tế **nhân** giá vốn |
| Giá trị chênh lệch của dòng | Chênh lệch số lượng **nhân** giá vốn |
| Tổng giá trị chênh lệch | Cộng giá trị chênh lệch của tất cả các dòng đã kiểm trong phiếu |
| Nguồn giá vốn | Lấy theo **ngày kiểm kê ghi trên phiếu** — giá vốn của kỳ chứa ngày đó; nếu kỳ đó chưa có giá thì **lùi về kỳ gần nhất có giá**. Áp dụng chung cho cả phần thừa lẫn phần thiếu. Xem ghi chú kỹ thuật ở Mục 11 |
| Số liệu khi phiếu Hoàn thành | Ghi cứng vào phiếu: tồn sổ sách, số thực tế, chênh lệch, giá vốn đã dùng, giá trị chênh lệch — mở lại không đọc số sống |
| Số dòng tối đa một phiếu | **Không giới hạn** |
| Số phiếu nháp cùng một kho | **Không chặn**, một kho có bao nhiêu phiếu cũng được |
| Phạm vi kho theo chi nhánh | Không giới hạn, ai có quyền là kiểm được mọi kho |

### 7.3 Câu chữ thông báo

**Cảnh báo**

| Khi nào | Nguyên văn |
|---|---|
| Bấm Cân bằng kho mà còn dòng chưa nhập số thực tế | "Trong phiếu kiểm kho có {N} sản phẩm chưa kiểm. Bạn có muốn loại bỏ các sản phẩm chưa kiểm khỏi phiếu để cân bằng hay tiếp tục kiểm?" |

**Xác nhận**

| Khi nào | Nguyên văn |
|---|---|
| Trước khi thực hiện cân bằng kho | "Lưu ý: Khi cân bằng kho, phần mềm sẽ tự động tạo phiếu nhập/xuất kho để điều chỉnh số lượng hàng hóa theo kết quả kiểm kê.<br>Bạn có chắc chắn muốn cân bằng kho?" |

**Thông báo cho người khác**

Không gửi thông báo cho ai khi hoàn thành phiếu — không email, không thông báo trong phần mềm. Kết quả chỉ hiển thị trên màn hình cho người đang thao tác.

## 8. Assumptions

- Người có quyền kiểm kê tự chịu trách nhiệm chia mã sản phẩm với đồng nghiệp khi cùng kiểm một kho, phần mềm không điều phối.
- Phiếu kiểm kê không cần bước duyệt — chốt từ Giai đoạn 1, giữ nguyên.
- Chứng từ điều chỉnh sinh ra từ kiểm kê dùng lại đúng cơ chế chứng từ điều chỉnh của chức năng sửa tồn hiện có.
- Phiếu nháp xóa được bằng quyền Xóa; phiếu đã hoàn thành thì không.
- **Quyền cân bằng kho không tách riêng** — ai có quyền Tạo và Sửa phiếu thì cân bằng được.
- Báo cáo chênh lệch kiểm kê không làm màn riêng, gộp vào báo cáo xuất nhập tồn.

## 9. Risks

| # | Rủi ro | Khả năng | Hậu quả nghiệp vụ | Cách phòng |
|---|---|---|---|---|
| R-1 | Hai phiếu cùng kho **trùng mã sản phẩm**, phiếu cân bằng sau ghi đè phiếu trước | Thỉnh thoảng | Tồn cuối cùng sai mà không ai phát hiện, vì cả hai phiếu đều hiện Hoàn thành | Đã chốt không cảnh báo trùng mã, nên phòng bằng quy trình: chia mã cho từng người trước khi đếm và đưa vào hướng dẫn sử dụng |
| R-2 | Nhiều người cùng kiểm một kho nhưng không có chỗ ghi ai đếm dòng nào | Thường | Khi số liệu lệch bất thường thì không truy được trách nhiệm, mất ý nghĩa kiểm soát của kiểm kê | Mỗi người lập phiếu riêng nên tên người kiểm ở đầu phiếu đủ truy vết theo phiếu; chia mã rõ ràng để không chồng lấn |
| R-3 | Đếm kéo dài trong lúc vẫn bán hàng — số đếm ghi buổi sáng đem cân bằng buổi chiều | Thường | Số đếm cũ đem áp lên tồn mới làm sai lệch kết quả, tồn tăng ảo | Lúc cân bằng hệ thống nạp tồn lần cuối nên chênh lệch tính trên số mới nhất; vẫn nên hướng dẫn đếm và cân bằng gần nhau về thời gian |
| R-4 | Mất kết nối khi chưa Lưu nháp làm mất toàn bộ số đã nhập | Thỉnh thoảng | Đếm lại từ đầu, tốn công gấp đôi, người dùng nản và quay về cách sửa tồn tay | Đã chốt không tự lưu tạm, nên phòng bằng hướng dẫn lưu nháp thường xuyên khi phiếu nhiều dòng |

## 10. Success Criteria

- Mọi lần điều chỉnh tồn phát sinh từ kiểm kê đều có phiếu kiểm kê làm căn cứ và chứng từ nhập/xuất đi kèm, tra lại được.
- Kế toán đọc được **giá trị chênh lệch bằng tiền** của từng đợt kiểm kê, không phải tự nhân tay.
- Người dùng không còn phải mở từng sản phẩm để sửa tồn sau khi đếm.

## 11. Ghi chú kỹ thuật cho `/srs`

> Chi tiết kỹ thuật thu thập được ở buổi brainstorm, để dành khi viết đặc tả — không thuộc phần nghiệp vụ.

- **Giá vốn** dùng để tính ba cột giá trị lấy từ lịch sử giá vốn ở bảng `cogs_history`, sau khi đã tính giá xuất kho. Chọn theo **ngày kiểm kê ghi trên phiếu**: lấy giá vốn của kỳ chứa ngày đó; kỳ đó chưa có giá thì lùi dần về **kỳ gần nhất có giá**. Giá vốn đã dùng được ghi cứng vào phiếu khi hoàn thành.
- Chứng từ điều chỉnh dùng lại cơ chế của chức năng sửa tồn theo lô, tham chiếu [docs/sua-ton-lo-san-pham/srs/spec.md](../../sua-ton-lo-san-pham/srs/spec.md).
- Sản phẩm bật theo dõi lô: tồn mỗi kho bằng tổng tồn các lô, nên cân bằng phải áp xuống từng lô.

## 12. Open Questions

Toàn bộ 10 câu đã chốt trong buổi brainstorm này.

| ID | Câu hỏi | Kết luận | Trạng thái |
|---|---|---|---|
| OQ-1 | Giá vốn lấy tại thời điểm nào? | Theo **ngày kiểm kê ghi trên phiếu** — lấy giá vốn của kỳ chứa ngày đó; kỳ đó chưa có giá thì lùi về kỳ gần nhất có giá | [x] |
| OQ-2 | Hàng thừa nhập điều chỉnh theo giá vốn nào? | **Cùng quy tắc OQ-1** — không phân biệt thừa hay thiếu | [x] |
| OQ-3 | Lý do chênh lệch có bắt buộc không? | **Không bắt buộc**, người dùng tùy chọn ghi cho từng dòng | [x] |
| OQ-4 | Có cảnh báo khi một mã đã nằm trong phiếu nháp khác cùng kho không? | **Không** | [x] |
| OQ-5 | Có tự lưu tạm số đã nhập khi rớt mạng không? | **Không** — chưa Lưu nháp mà mất kết nối là mất số đã nhập | [x] |
| OQ-6 | Sản phẩm nhiều đơn vị tính đếm thế nào? | **Chọn tay thì người dùng tự chọn đơn vị**; tick chọn tất cả hàng hóa trong kho thì chỉ hiện theo đơn vị tính chính | [x] |
| OQ-7 | Quét barcode trên web hay mobile? | **Tùy người dùng** — hỗ trợ cả máy quét trên web lẫn camera trên mobile | [x] |
| OQ-8 | Biên bản kiểm kê in theo mẫu nào? | Có **mẫu chung sẵn**, người dùng **chỉnh lại mẫu** được | [x] |
| OQ-9 | Quyền cân bằng kho có tách khỏi quyền Tạo và Sửa không? | **Không cần tách** | [x] |
| OQ-10 | Mỗi đợt kiểm khoảng bao nhiêu mã, mất bao lâu? | **Tùy người dùng**, không đặt mốc — màn nhập liệu thiết kế không giới hạn số dòng | [x] |

**Chốt kèm từ Giai đoạn 1:** dòng bỏ trống nghĩa là chưa kiểm, không cân bằng (câu hỏi mở số 2); phiếu chỉ có hai trạng thái Nháp và Hoàn thành, không có hủy (câu hỏi mở số 6).

## 13. Next Steps

- Dựng lại hai file sơ đồ tư duy của feature cho khớp nội dung mới.
- Chạy `/urd` hoặc `/prd` cho `kiem-ke-kho` — không còn câu hỏi mở nào treo lại.
