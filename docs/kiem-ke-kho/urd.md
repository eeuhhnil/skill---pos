---
type: urd
feature: kiem-ke-kho
status: draft
lang: vi
owner: "@huelinh"
created: 2026-09-05
updated: 2026-09-05
links: [docs/kiem-ke-kho/gd1-giai-phap-so-bo.md, docs/kiem-ke-kho/brainstorms/phieu-kiem-ke-can-bang-kho.md]
tags: [ton-kho, kiem-ke, gia-von]
stale_reason: ""
changelog:
  - 2026-09-05 | /urd | tạo mới URD từ brainstorm phieu-kiem-ke-can-bang-kho
---

# Kiểm kê kho — Tài liệu yêu cầu người dùng (URD)

## 1. Mục đích và phạm vi

Tài liệu ghi lại **nhu cầu của người dùng** với nghiệp vụ kiểm kê kho, ở góc nhìn người đi kiểm và người đọc kết quả kiểm — không mô tả màn hình, không mô tả cách hệ thống xử lý.

Phạm vi: mỗi lần kiểm kê làm trên **một kho**, trên danh sách sản phẩm do người dùng chọn. Áp dụng cho mọi loại hình kinh doanh **trừ cửa hàng xăng dầu**.

Nguồn: [gd1-giai-phap-so-bo.md](gd1-giai-phap-so-bo.md) và [brainstorms/phieu-kiem-ke-can-bang-kho.md](brainstorms/phieu-kiem-ke-can-bang-kho.md).

## 2. Đối tượng người dùng

| Vai trò | Mô tả | Quyền | Mức độ dùng |
|---|---|---|---|
| Người kiểm kê | Thường là thủ kho, người trực tiếp đếm hàng tại kho | Tạo, Sửa, Xóa, Xem phiếu kiểm kê | Chính, dùng thường xuyên |
| Người đối soát | Kế toán, chủ cửa hàng, quản lý — đọc kết quả để ghi nhận thừa thiếu | Chỉ Xem | Đọc sau mỗi đợt kiểm |
| Người cấu hình quyền | Chủ cửa hàng hoặc quản trị, quyết định ai được kiểm kê | Cấu hình phân quyền | Thiết lập một lần |

Phân quyền do từng khách hàng tự cấu hình theo vai trò họ dựng. **Không giới hạn theo chi nhánh** — ai có quyền thì kiểm được mọi kho. Tần suất kiểm kê do từng khách hàng tự quyết định.

## 3. Hành trình người dùng hiện tại

| Bước | Người dùng làm gì | Điểm đau |
|---|---|---|
| 1 | Đếm số lượng thực tế tại kho, ghi ra giấy hoặc file ngoài | Số đếm nằm ngoài phần mềm, sau này không đối chiếu lại được |
| 2 | So sánh với số tồn trên phần mềm, mã nào lệch thì ghi lại | Phải tự dò từng mã, kho nhiều hàng thì rất lâu và dễ sót |
| 3 | Mở lần lượt từng sản phẩm để sửa số tồn cho khớp | Mỗi mã một lần mở, tốn thời gian; sửa thẳng không qua ai duyệt |
| 4 | Hệ thống sinh phiếu nhập hoặc xuất tương ứng phần chênh lệch | Có chứng từ điều chỉnh nhưng **không có phiếu kiểm kê làm căn cứ**; kế toán không biết đợt kiểm nào sinh ra chúng, ai kiểm, kiểm khi nào |

Hệ quả chung: cách làm này **không đúng nguyên tắc kiểm kê kho của kế toán**, không quy được trách nhiệm ai sửa và sửa vì lý do gì, và không quy đổi được chênh lệch ra tiền. Người dùng đã trực tiếp phản ánh việc phần mềm chưa có chức năng kiểm kê.

## 4. Nhu cầu người dùng

| ID | Vai trò | Nhu cầu | Lý do nghiệp vụ |
|---|---|---|---|
| UN-01 | Người kiểm kê | Lập được một phiếu kiểm kê cho **một kho** tại một thời điểm | Có chứng từ làm căn cứ cho cả đợt kiểm, thay vì sửa tồn rời rạc từng mã |
| UN-02 | Người kiểm kê | Đưa hàng vào phiếu bằng cách **chọn nhanh toàn bộ hàng hóa trong kho**, hoặc **chọn tay bằng tìm kiếm và quét mã vạch** | Kho ít mã thì chọn tay cho gọn, kiểm toàn kho thì không phải tick từng dòng |
| UN-03 | Người kiểm kê | Với hàng có theo dõi lô, kiểm được **tới từng lô** | Hàng có hạn dùng phải biết thiếu thừa ở lô nào mới xử lý được |
| UN-04 | Người kiểm kê | **Nhìn thấy số tồn theo sổ sách ngay cạnh ô nhập** khi đang đếm | Phát hiện lệch tại chỗ, đếm lại ngay thay vì phát hiện sau khi rời kho |
| UN-05 | Người kiểm kê | **Đếm dở rồi lưu lại**, hôm sau hoặc ca sau mở ra đếm tiếp | Kho lớn không đếm xong trong một lượt |
| UN-06 | Người kiểm kê, người đối soát | Biết **chênh lệch cả số lượng lẫn giá trị bằng tiền** của từng dòng và tổng cả phiếu | Kế toán cần con số tiền để ghi nhận thừa thiếu, không tự nhân tay từng mã |
| UN-07 | Người kiểm kê | **Cân bằng kho một lần cho cả phiếu**, hệ thống tự tạo chứng từ điều chỉnh phần lệch | Thay cho việc mở từng sản phẩm sửa tồn, và vẫn giữ được vết chứng từ |
| UN-08 | Người kiểm kê, nhân viên bán hàng | **Không bị chặn bán hàng** trong lúc đang đếm | Cửa hàng không thể ngừng kinh doanh để kiểm kê |
| UN-09 | Người đối soát | **Mở lại phiếu cũ và thấy đúng số liệu tại thời điểm kiểm**, khớp với biên bản đã in | Phiếu kiểm kê là chứng từ kế toán, số liệu phải cố định để đối soát và giải trình về sau |
| UN-10 | Người kiểm kê | **Ghi lý do chênh lệch** cho dòng nào cần giải thích (hỏng vỡ, thất thoát, nhầm mã, sai sót nhập liệu) | Kế toán hiểu nguyên nhân, không phải hỏi ngược lại thủ kho; ghi hay không là tùy người dùng |
| UN-11 | Người đối soát | **In và xuất biên bản kiểm kê** để ký xác nhận và lưu hồ sơ, theo mẫu chung nhưng chỉnh lại được | Hồ sơ giấy phục vụ ký duyệt nội bộ và kiểm toán, mỗi khách một cách trình bày |
| UN-12 | Người cấu hình quyền | **Phân quyền ai được kiểm kê kho** ở mức Tạo, Sửa, Xóa, Xem | Không để ai cũng chỉnh được tồn kho, đây là dữ liệu ảnh hưởng trực tiếp tới tiền hàng |

## 5. Kỳ vọng của người dùng

Cách người dùng tự kiểm chứng nhu cầu đã được đáp ứng:

| Nhu cầu | Người dùng kiểm chứng bằng cách |
|---|---|
| UN-01, UN-02, UN-03 | Tạo được một phiếu cho kho bất kỳ, đưa vào cả trăm mã bằng một thao tác chọn tất cả, và thấy hàng có lô tách thành từng dòng lô riêng |
| UN-04, UN-05 | Trong lúc nhập nhìn thấy tồn sổ sách của từng dòng; thoát ra vào lại vẫn còn nguyên số đã nhập của phần đã lưu |
| UN-06 | Đọc được ngay trên phiếu số chênh lệch và số tiền chênh lệch của từng dòng, cùng tổng tiền chênh lệch của cả phiếu |
| UN-07 | Sau một lần bấm cân bằng, tồn kho khớp số đã đếm và tra ra được các chứng từ nhập xuất do phiếu này sinh ra |
| UN-08 | Trong lúc đang kiểm kê, quầy vẫn bán hàng bình thường, không bị khóa mã nào |
| UN-09 | Mở lại phiếu của tháng trước, số liệu hiển thị đúng bằng số trên biên bản đã in ra hôm đó |
| UN-10, UN-11 | Ghi được lý do cho dòng lệch mà không bị bắt buộc; in ra biên bản có đủ chữ ký và số liệu |
| UN-12 | Tài khoản không được cấp quyền thì không nhìn thấy chức năng kiểm kê |

## 6. Ngoài phạm vi

- Kiểm nhiều kho hoặc nhiều chi nhánh trong cùng một phiếu.
- Gộp phiếu kiểm kê của nhiều người thành một phiếu — đã bàn và chốt không làm.
- Khóa kho, chặn bán hàng hoặc chặn nhập xuất trong lúc đếm.
- Bước duyệt phiếu kiểm kê trước khi cân bằng kho.
- Hủy hoặc đảo ngược phiếu đã hoàn thành.
- Màn báo cáo chênh lệch kiểm kê riêng — nội dung này nằm chung trong báo cáo xuất nhập tồn.
- Cửa hàng xăng dầu.

## 7. Giả định

- Phân quyền do từng khách hàng tự cấu hình; phần mềm chỉ cung cấp bộ quyền Tạo, Sửa, Xóa, Xem cho chức năng kiểm kê.
- Khi nhiều người cùng kiểm một kho, họ **tự chia mã sản phẩm với nhau**; phần mềm không điều phối và không cảnh báo nếu hai phiếu trùng mã.
- Chứng từ điều chỉnh sinh ra từ kiểm kê dùng lại đúng cơ chế chứng từ điều chỉnh của chức năng sửa tồn hiện có.
- Người dùng chấp nhận việc số đã nhập bị mất nếu chưa lưu mà mất kết nối.
- Số lượng mã mỗi đợt kiểm và thời gian mỗi đợt tùy từng khách hàng, không đặt mốc nào.

## 8. Câu hỏi mở

| # | Câu hỏi | Người trả lời | Trạng thái |
|---|---------|---------------|-----------|
| 1 | Có tách riêng loại chứng từ điều chỉnh do kiểm kê, khác với sửa tồn thủ công, để báo cáo phân biệt được nguồn gốc điều chỉnh không? | Nội bộ / kế toán | [ ] |

Toàn bộ các câu hỏi mở khác của feature đã chốt tại buổi brainstorm ngày 05/09/2026 — xem [brainstorms/phieu-kiem-ke-can-bang-kho.md](brainstorms/phieu-kiem-ke-can-bang-kho.md) Mục 12.
