---
type: brainstorm
feature: sua-ton-lo-san-pham
status: draft
lang: vi
owner: "@huelinh"
created: 2026-07-27
updated: 2026-07-27
links: [preview/ton-kho-theo-lo-phan-bo.html]
tags: [ton-kho, lo-hang, phieu-dieu-chinh]
stale_reason: ""
changelog:
  - 2026-07-27 | /srs | kiểm chứng DB: sửa E1/#4 (bật lô không tạo N2), tên bảng/business_type_id, thêm dòng chuyển đổi
  - 2026-07-27 | /srs | mỗi lô 1 phiếu riêng, bỏ cơ chế gom (C2, Mục 4 vòng đời phiếu)
  - 2026-07-27 | /srs | đồng bộ quyết định #11/D1/R3 với SRS (gating theo phát sinh giao dịch)
  - 2026-07-27 | /brainstorm | initial draft từ phân tích nghiệp vụ sửa tồn theo lô
---

# Sửa tồn kho theo lô — phân bổ lại & sinh chứng từ điều chỉnh

> Cho phép sửa số lượng tồn theo lô ngay trên màn sản phẩm (thay vì bắt buộc vào giao dịch kho), hiển thị tồn còn lại thực và cho phân bổ lại nhiều lần, mọi thay đổi đều để lại chứng từ truy vết.

## 1. Nguồn gốc thay đổi

**Cải tiến nội bộ** (không phát sinh từ ticket khách hàng cụ thể). Quy trình hiện tại có 2 hạn chế cần khắc phục:

1. Sản phẩm bật theo dõi lô chỉ **phân bổ số lượng vào lô được 1 lần** (lúc chuyển từ không theo dõi lô sang theo dõi lô), sau đó không phân bổ lại được.
2. Sau khi đã phân bổ, muốn sửa tồn **phải vào giao dịch nhập/xuất kho**, không sửa trực tiếp trên sản phẩm.

Yêu cầu cải tiến: cho sửa tồn theo lô ngay trên màn sản phẩm, hiển thị **tồn còn lại thực** và **phân bổ lại nhiều lần**, đồng thời để lại chứng từ truy vết.

> Ngữ cảnh hệ thống: sản phẩm bật **Sử dụng lô hàng** → tồn mỗi kho = tổng số lượng các lô (auto, không nhập tay). Chứng từ kho lưu ở bảng **`rs_inoutward`** (header + detail mỗi lô 1 dòng, phân loại qua `business_type`). Mockup: [preview/ton-kho-theo-lo-phan-bo.html](../../../preview/ton-kho-theo-lo-phan-bo.html).

## 2. Nghiệp vụ hiện tại (As-Is)

1. Người dùng thêm sản phẩm và bật theo dõi số lô → khi chọn kho + nhập số lượng thì mở popup nhập số lô để phân bổ số lượng vào lô.
2. Khi convert sản phẩm **không theo dõi lô → theo dõi lô** mà **không đổi tổng số lượng**: chỉ phân bổ được số lượng vào lô **đúng 1 lần**, sau đó không phân bổ lại được.
3. Sản phẩm đã phân bổ vào lô rồi thì khi chỉnh sửa **không sửa trực tiếp được** — phải vào **giao dịch nhập/xuất kho** mới giảm được số lượng tồn.

## 3. Nghiệp vụ mong muốn (To-Be)

- Khi vào **chỉnh sửa sản phẩm**, hiển thị **tồn còn lại thực của từng lô** (đã trừ số đã bán) và cho **sửa số lượng trực tiếp**.
- Cho **phân bổ lại giữa các lô nhiều lần**, kể cả khi **tổng số lượng không đổi** (bỏ giới hạn "1 lần").
- Mỗi thay đổi tồn theo lô → **tự sinh chứng từ điều chỉnh** tương ứng để truy vết thao tác:
  - Tăng số lượng lô → phiếu **N3** (nhập điều chỉnh).
  - Giảm số lượng lô → phiếu **X2** (xuất điều chỉnh).

## 4. Vòng đời phiếu (`rs_inoutward`)

> Loại phiếu qua `rs_inoutward.business_type_id` (FK bảng `business_type`, **theo từng công ty**): **N2**="Khởi tạo kho", **N3**="Sửa tồn kho" (nhập), **X2**="Sửa tồn kho" (xuất). Phiếu khởi tạo tra qua `rs_inout_ward_init`.

| Hành động | business_type (code) | Số phiếu sinh ra | Ghi chú |
|---|---|---|---|
| Tạo SP lần đầu (lúc TẠO sản phẩm) | **N2** — Khởi tạo kho | 1 header + N detail | Chỉ **1 N2/sản phẩm** (link `rs_inout_ward_init`). Sửa N2 chỉ qua **giao dịch kho** |
| Bật lô trên SP đã tạo (chuyển đổi non-lô → lô) | **X2 + N3** | X2 xuất non-lô + N3 nhập mỗi lô 1 phiếu | **KHÔNG** sinh N2; giữ nguyên `inventory.on_hand`, thêm `batches_detail`. Xem SRS 3.3 |
| Sửa (từ màn SP): tăng SL lô | **N3** — Sửa tồn kho | **1 phiếu riêng cho MỖI lô tăng** (1 lô/phiếu) | Chỉ sinh khi lô có chênh lệch ≠ 0 |
| Sửa (từ màn SP): giảm SL lô | **X2** — Sửa tồn kho | **1 phiếu riêng cho MỖI lô giảm** (1 lô/phiếu) | Chỉ sinh khi lô có chênh lệch ≠ 0 |
| Phân bổ lại giữa lô (tổng không đổi) | **X2 + N3** | mỗi lô 1 phiếu riêng, `type_desc="Phân bổ lại lô"` | Xem Mục 6 |

**Quy tắc chung:**
- Chỉ tạo phiếu khi **delta ≠ 0** — không có phiếu rỗng.
- **Mỗi lô có thay đổi → 1 phiếu riêng** (N3 nếu tăng, X2 nếu giảm), **1 lô/phiếu — KHÔNG gom** nhiều lô vào 1 phiếu. Lô không đổi → không phiếu.
- Nhiều phiếu trong 1 lần Lưu → nằm trong **1 transaction**, lỗi thì rollback toàn bộ.
- Giá vốn phiếu = **giá vốn hiện tại của sản phẩm** (chấp nhận lệch so với giá vốn lô gốc).
- Phiếu chỉ sinh khi bấm **Lưu** (Hủy giữa chừng không để lại phiếu).

## 5. Hai cửa thay đổi tồn

| Cửa | Thao tác | Kết quả |
|---|---|---|
| **Màn sản phẩm** | Sửa số lượng lô | Sinh **N3/X2**, N2 giữ nguyên |
| **Giao dịch kho** | Sửa thẳng phiếu khởi tạo | Đổi **N2** |

**Guard áp cho CẢ hai cửa:** không được hạ số lượng lô xuống dưới **lượng đã bán/đã xuất** của lô đó (tránh tồn âm). Tồn khả dụng lấy theo **logic tồn hiện có của hệ thống** (không định nghĩa lại ở đây).

## 6. Phân bổ lại lô — tổng không đổi (Option A)

Phân bổ lại = chuyển số lượng từ lô này sang lô khác **trong cùng 1 kho** mà **tổng không đổi**. Bản chất là lô A giảm + lô B tăng, net tổng = 0.

- **Bỏ giới hạn 1 lần** — cho phân bổ lại không giới hạn số lần.
- Truy vết bằng **chính cặp phiếu X2 (lô giảm) + N3 (lô tăng)** — gắn **`type_desc = "Phân bổ lại lô"`** để báo cáo phân biệt với sửa tổng thật. Không dựng bảng log riêng (tránh 2 nguồn sự thật).
- Chuỗi phiếu chính là **lịch sử phân bổ** (ai, khi nào, từ lô nào sang lô nào, bao nhiêu).

## 7. Loại phiếu & ghi chú cho phiếu tự sinh

| Trường hợp | business_type | Ghi chú |
|---|---|---|
| Sửa tồn (tăng) | **N3** "Sửa tồn kho" | `description` = "Nhập kho chỉnh sửa số lượng tồn" |
| Sửa tồn (giảm) | **X2** "Sửa tồn kho" | `description` = "Xuất kho chỉnh sửa số lượng tồn" |
| Phân bổ lại (tổng không đổi) | **N3/X2** | thêm `type_desc = "Phân bổ lại lô"` để báo cáo phân biệt |
| Chuyển đổi non-lô → lô | **X2 + N3** | như sửa tồn thường (không nhãn riêng) |

> `business_type_id` phải trỏ đúng mã N3/X2 **của công ty sản phẩm** (bảng `business_type` có bản ghi riêng mỗi `com_id`).

## 8. Đăng ký Edge Case

Mức độ: 🔴 nghiêm trọng (dễ sai tồn/sai sổ) · 🟡 cần luật rõ · 🟢 validation thường.

### A. Guard & tồn khả dụng
- 🔴 **A1.** Số mới ≥ lượng **đã xuất** (bán + mọi xuất khác) → X2 không được xuất quá tồn khả dụng hiện tại (tránh âm kho). Áp cho cả 2 cửa (Mục 5).
- 🟢 **A2.** Hạ tồn về đúng 0 (tồn còn lại = 0) là hợp lệ; **dòng lô vẫn giữ**, không bị xóa (không cho xóa lô — Mục 10).

### B. Concurrency
- 🔴 **B1.** Quầy khác bán chính lô đó khi form đang mở → **re-check tồn thực lúc Lưu**; nếu tồn thực đã tụt dưới mức user định giảm tới → chặn/cảnh báo, không ghi theo số đã cũ.
- 🔴 **B2.** Concurrency giữa **2 cửa**: cùng lúc sửa SP (sinh X2) và sửa N2 trong giao dịch kho của cùng lô/kho → re-check tồn thực tại thời điểm ghi, tránh cộng dồn ra âm.

### C. Sinh phiếu N3/X2
- 🔴 **C1.** Chỉ sinh khi delta ≠ 0 — không phiếu rỗng.
- 🔴 **C2.** **Mỗi lô có thay đổi → 1 phiếu riêng** (N3 nếu tăng, X2 nếu giảm), 1 lô/phiếu — **không gom** nhiều lô vào 1 phiếu; lô không đổi → không phiếu.
- 🔴 **C3.** Nhiều phiếu trong 1 lần Lưu → **1 transaction**, lỗi thì rollback hết.
- 🟡 **C4.** Giá vốn phiếu = giá vốn SP hiện tại → có thể lệch giá vốn lô gốc; **chấp nhận** giá trị tồn kho trôi theo giá SP.
- 🔴 **C5.** Bấm **Hủy** → không để lại phiếu rác.
- 🟡 **C6.** Phiếu tự sinh có `description` + `type_desc` mặc định (Mục 7); không bắt user nhập tay lý do.

### D. Thêm mới khi sửa
- 🔴 **D1.** Màn sửa **không thêm lô mới vào kho đã lưu** (không có nút "Thêm lô" cho kho đã có). Lô mới của kho hiện có đi qua giao dịch nhập kho, không qua sửa SP.
- 🔴 **D2.** Thêm **kho mới** khi sửa → khối kho mới thao tác lô tự do (chưa phát sinh); Lưu → **N3** cho kho mới, không tạo N2 thứ 2; kho cũ không đổi → không phiếu.
- 🔴 **D3.** Thêm lô **trùng mã lô ở kho khác** → không vượt **tồn khả dụng chung** của mã lô (chống phân bổ ảo vượt tồn thật).
- 🟡 **D4.** Thêm lô **trùng mã trong cùng kho** → **chặn**, không cho thêm trùng.
- 🟢 **D5.** Thêm lô/kho mới **bỏ trống** (chưa chọn mã, SL=0) → validation, không lưu dòng/kho rỗng, không phiếu.

### E. N2 khởi tạo
- 🔴 **E1.** **1 SP = đúng 1 phiếu khởi tạo N2**, gắn lúc TẠO sản phẩm (liên kết qua `rs_inout_ward_init`). Bật "Sử dụng lô hàng" *sau khi đã tạo SP* **KHÔNG** sinh N2 mới → dùng **X2 (xuất non-lô) + N3 (nhập vào lô)** (xem Mục "Chuyển đổi" / SRS 3.3).
- 🟢 **E2.** Header N2 total = Σ detail (ràng buộc toàn vẹn khi ghi).

### F. Kỳ kế toán
- 🟡 **F1.** Kỳ đã khóa sổ → **vẫn cho sửa tùy người dùng** (không chặn cứng).
- (Hồi tố báo cáo lợi nhuận: **không cần quan tâm** trong phạm vi này.)

### G. Vòng đời lô
- 🟢 **G1.** Lô quá HSD → **đã ẩn ở UI**, không chọn được để phân bổ mới.

### H. Phân quyền & audit
- 🟡 **H1.** **Có phân quyền** tạo phiếu nhập/xuất kho; người sửa SP phải có quyền tương ứng mới sinh được phiếu.
- 🟢 **H2.** Audit qua chính chuỗi phiếu N2/N3/X2 (ngày, người tạo, chi tiết lô).

### I. Kiểu dữ liệu
- 🟢 **I1.** Số lượng lô nhận **số thập phân tùy cấu hình đơn vị/sản phẩm** (hàng bán theo lít/kg — vd xăng dầu, business_type=4).

### R. Phân bổ lại (tổng không đổi)
- 🔴 **R1.** Verify `Σ lô sau = Σ lô trước` mới là phân bổ lại; nếu lệch → rơi về case sửa tổng (N3/X2 net ≠ 0).
- 🔴 **R2.** Guard vẫn áp — chỉ chuyển được trong phần **tồn khả dụng còn lại** của lô nguồn.
- 🟡 **R3.** Phân bổ lại chỉ điều phối giữa **các lô đã có trong kho** (màn sửa không thêm lô mới vào kho đã lưu — xem D1). Muốn đưa vào lô mới → qua giao dịch nhập kho.
- 🟡 **R4.** Phạm vi phân bổ lại = **trong cùng kho**. Chuyển giữa 2 kho là đổi tổng mỗi kho → thuộc case sửa tồn có phiếu theo kho.
- 🟢 **R5.** Không giới hạn số lần; mỗi lần 1 cặp phiếu → chuỗi phiếu là lịch sử phân bổ.

### J. Ghi chú từ dữ liệu thật (kiểm chứng DB 2026-07-31)
- 🔴 **J1.** `on_hand` **âm có thật** trong prod (−21, −684.8, −180…) → guard tồn âm/oversold (Mục 3.3, A2) là thực tế; xử lý chặn phân bổ khi tồn âm.
- 🟡 **J2.** Một số dòng `inventory.on_hand ≠ Σ batches_detail.on_hand` (drift) → nên đối soát/ràng buộc toàn vẹn khi ghi `batches_detail`.

## 9. Quyết định đã chốt

| # | Vấn đề | Quyết định |
|---|--------|-----------|
| 1 | Ranh giới N2 vs N3/X2 | 2 cửa: màn SP → N3/X2 (N2 giữ nguyên); giao dịch kho → sửa N2 |
| 2 | Giá vốn | Theo giá vốn hiện tại của SP |
| 3 | Trùng mã lô cùng kho | Chặn |
| 4 | Bật lô trên SP đã tạo | KHÔNG tạo N2 (1 SP chỉ 1 khởi tạo lúc tạo SP) → dùng X2 (xuất non-lô) + N3 (nhập lô) |
| 5 | Kỳ khóa sổ | Vẫn cho sửa, tùy người dùng |
| 6 | Hồi tố báo cáo | Không quan tâm |
| 7 | Lô quá hạn | Đã ẩn ở UI |
| 8 | Phân quyền | Có phân quyền tạo phiếu nhập/xuất |
| 9 | Phiếu tự sinh | description/type_desc theo Mục 7 |
| 10 | Số thập phân | Tùy cấu hình đơn vị/SP |
| 11 | Xóa/thêm lô-kho theo màn | **Màn Thêm** (chưa phát sinh): thêm/xóa lô & kho tự do. **Màn Sửa** (dòng đã lưu): khóa kho, chỉ sửa SL, **không thêm/xóa lô**; xóa kho chỉ khi kho **chưa phát sinh giao dịch** → xóa kèm N2 (logic cũ); được thêm kho mới |
| 12 | Truy vết phân bổ lại | Option A — dùng chính cặp N3/X2, tag `type_desc="Phân bổ lại lô"` |
| 13 | Gating thao tác | Theo nguyên tắc **"đã phát sinh giao dịch chưa"** (giao dịch = đã bán hoặc đã có N3/X2; N2 không tính): chưa phát sinh → tự do, đã phát sinh → khóa |

## 10. Open Questions

- Không còn — tất cả đã chốt.

## Next Steps

- `/srs sua-ton-lo-san-pham` — đặc tả FR/NFR/BR + error matrix cho sinh phiếu N3/X2/N2 và guard.
- `/usecase sua-ton-lo-san-pham` — luồng sửa tồn theo lô + phân bổ lại (tổng không đổi).
