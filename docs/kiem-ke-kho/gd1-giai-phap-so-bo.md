---
type: giai-phap-so-bo
stage: 1
feature: kiem-ke-kho
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-28
updated: 2026-09-05
source: "Yêu cầu nội bộ — người dùng phản ánh phần mềm chưa có chức năng kiểm kê kho"
links: [docs/sua-ton-lo-san-pham/srs/spec.md, docs/kiem-ke-kho/brainstorms/phieu-kiem-ke-can-bang-kho.md]
changelog:
  - 2026-09-05 | /brainstorm | đồng bộ từ brainstorm: bỏ đóng băng tồn, thêm tính giá trị, chốt 10 OQ
  - 2026-09-03 | /ba-preliminary-solution | viết chi tiết Yêu cầu nghiệp vụ thành 5 nhóm nghiệp vụ
  - 2026-08-28 | /ba-preliminary-solution | tạo mới giải pháp sơ bộ từ yêu cầu nội bộ về kiểm kê kho
---

# Kiểm kê kho — Giải pháp sơ bộ

## Làm rõ yêu cầu

### 1. Đặc điểm khách hàng

Doanh nghiệp thuộc mọi loại hình kinh doanh trừ cửa hàng xăng dầu có nhu cầu kiểm kê kho định kỳ, do **thủ kho** trực tiếp thực hiện. Mỗi lần kiểm kê chỉ làm trên **một kho** và trên danh sách sản phẩm được chọn, không kiểm nhiều kho hay nhiều chi nhánh cùng lúc. Tần suất kiểm kê do từng khách hàng tự quyết định.

### 2. Câu chuyện nghiệp vụ

Hiện tại, khi thủ kho đếm số lượng thực tế trong kho và thấy lệch so với số trên phần mềm, thủ kho phải mở từng sản phẩm để chỉnh lại số tồn cho khớp; hệ thống tự sinh phiếu nhập hoặc xuất tương ứng phần chênh lệch. Việc sửa được thực hiện thẳng, không qua bước duyệt của ai. Cách làm này **không đúng nguyên tắc kiểm kê kho của kế toán** vì không có phiếu kiểm kê làm căn cứ.

Quy trình hiện tại: Đếm thực tế tại kho → So sánh với số trên phần mềm → Mở từng sản phẩm sửa lại tồn → Hệ thống sinh phiếu nhập/xuất phần chênh lệch

### 3. Phần mềm đáp ứng

Phần mềm đã có ba giao dịch kho là **nhập kho, xuất kho, chuyển kho**, cùng với chức năng **chỉnh sửa số lượng tồn trực tiếp trên màn sản phẩm** — người dùng nhập lại số tồn, hệ thống cập nhật tồn hiện có và tự sinh phiếu điều chỉnh nhập/xuất tương ứng phần chênh lệch; sản phẩm có theo dõi lô thì sửa theo từng lô.

Tuy nhiên, phần mềm **chưa có nghiệp vụ kiểm kê kho** đúng chuẩn kế toán: chưa có phiếu kiểm kê để chốt danh sách sản phẩm cần đếm tại một thời điểm, chưa lưu song song số tồn sổ sách và số đếm thực tế để đối chiếu chênh lệch, và không truy vết được ai đã kiểm cùng thời điểm kiểm.

### 4. Khó khăn

Thủ kho phải mở lần lượt từng sản phẩm để sửa tồn nên mất nhiều thời gian khi kho có nhiều mặt hàng. Số đếm thực tế chỉ ghi trên giấy hoặc file ngoài, sửa xong là mất dấu nên **không đối chiếu lại được số sổ sách trước khi sửa với số đã đếm**. Kế toán không có chứng từ kiểm kê hợp lệ để ghi nhận thừa/thiếu, và do sửa tồn không để lại phiếu nên **không quy được trách nhiệm ai sửa, sửa vì lý do gì**. Người dùng đã trực tiếp phản ánh việc phần mềm chưa có chức năng kiểm kê kho.

<!-- TBD: số mã hàng mỗi đợt kiểm và thời gian một đợt kiểm hiện tại — xem Câu hỏi mở -->

### 5. Mong muốn

Thủ kho mong muốn phần mềm có **phiếu kiểm kê kho** riêng: chọn kho cần kiểm, chọn một hoặc nhiều sản phẩm từ danh sách, sản phẩm có theo dõi lô thì chọn tới từng lô cần đếm; hệ thống tự lấy **số tồn sổ sách** tại thời điểm kiểm, thủ kho nhập **số đếm thực tế**, hệ thống tự tính **chênh lệch thừa/thiếu theo từng mã và từng lô**. Khi phiếu được hoàn thành, hệ thống **cân bằng tồn kho theo số thực tế và sinh chứng từ điều chỉnh** để kế toán đối soát, đồng thời lưu lại phiếu kiểm kê làm bằng chứng ai kiểm và kiểm khi nào.

## Yêu cầu nghiệp vụ

Hệ thống cần hỗ trợ nghiệp vụ kiểm kê kho theo đúng nguyên tắc kế toán: chốt số tồn sổ sách tại thời điểm kiểm, ghi nhận số đếm thực tế, đối chiếu chênh lệch và cân bằng kho bằng chứng từ có truy vết — thay cho việc sửa số tồn rời rạc trên từng sản phẩm. Nghiệp vụ chia thành năm nhóm.

### 1. Khởi tạo và thiết lập phiếu kiểm kê

- **Chọn phạm vi kiểm kê:** chọn kho cần kiểm (mỗi phiếu một kho); đưa sản phẩm vào phiếu bằng cách lọc theo nhóm hoặc danh mục sản phẩm, theo nhà cung cấp, theo trạng thái hàng hóa, hoặc chọn thủ công từng mã. Sản phẩm có theo dõi lô thì chọn tới từng lô cần đếm.
- **Nạp tồn sổ sách hiện tại:** hệ thống tự lấy số tồn đang có của từng dòng làm mốc đối chiếu; người dùng không sửa được. Khi phiếu còn nháp thì mỗi lần mở lại là nạp số mới nhất — **không khóa kho, không chặn bán hàng trong lúc đếm**.
- **Thông tin đầu phiếu:** kho, ngày kiểm, người kiểm, lý do kiểm kê; phiếu lưu nháp được để đếm dở nhiều lượt rồi quay lại làm tiếp.

### 2. Ghi nhận số liệu thực tế

- **Nhập số đếm thực tế** cho từng dòng theo từng mã và từng lô.
- **Hỗ trợ thiết bị ngoại vi:** quét mã vạch hoặc QR bằng camera điện thoại hoặc máy quét gắn cổng USB để thêm nhanh sản phẩm vào phiếu và cộng dồn số đếm, hạn chế nhầm mã khi đếm.
- **Theo dõi tiến độ đếm:** nhận biết dòng nào đã nhập số thực tế, dòng nào còn bỏ trống, tránh sót hàng khi phiếu có nhiều mã.

### 3. Đối chiếu và xử lý chênh lệch

- **Tự tính chênh lệch số lượng** từng dòng bằng số thực tế trừ số sổ sách, đánh dấu rõ thừa hay thiếu.
- **Tính chênh lệch giá trị:** giá trị tồn sổ sách, giá trị thực tế và giá trị chênh lệch của từng dòng đều bằng số lượng nhân giá vốn; giá vốn lấy theo **ngày kiểm kê ghi trên phiếu** (kỳ chứa ngày đó, kỳ đó chưa có giá thì lùi về kỳ gần nhất có giá). Phiếu có dòng tổng giá trị chênh lệch.
- **Xem nhanh phần lệch:** lọc riêng các dòng có chênh lệch, tổng hợp số dòng lệch và giá trị lệch của cả phiếu.
- **Ghi lý do chênh lệch** cho từng dòng (hỏng vỡ, thất thoát, nhầm mã, sai sót nhập liệu) làm căn cứ cho kế toán — **không bắt buộc nhập**.

### 4. Cân bằng kho và hạch toán

- **Cập nhật tồn theo số thực tế** khi hoàn thành phiếu; hệ thống nạp tồn lần cuối rồi mới tính chênh lệch; sản phẩm có theo dõi lô thì cân bằng xuống từng lô.
- **Ghi cứng số liệu vào phiếu khi hoàn thành:** tồn sổ sách, số thực tế, chênh lệch, giá vốn đã dùng và giá trị chênh lệch của từng dòng được lưu lại; mở lại phiếu cũ luôn ra đúng số cũ, không đọc số sống.
- **Tự sinh chứng từ điều chỉnh:** dòng thừa sinh chứng từ nhập điều chỉnh, dòng thiếu sinh chứng từ xuất điều chỉnh, mỗi chứng từ liên kết ngược về phiếu kiểm kê đã sinh ra nó.
- **Ghi nhận giá trị thừa thiếu theo giá vốn** để kế toán có số liệu hạch toán, không chỉ có số lượng.
- **Khóa phiếu sau khi hoàn thành**, không cho sửa; muốn điều chỉnh tiếp thì lập phiếu kiểm kê mới.

### 5. Phân quyền và báo cáo

- **Phân quyền theo vai trò:** tách quyền lập phiếu, quyền hoàn thành phiếu để cân bằng kho, và quyền chỉ xem để đối soát.
- **Danh sách phiếu kiểm kê** lọc theo kho, khoảng thời gian, người kiểm và trạng thái phiếu.
- **In và xuất biên bản kiểm kê** để ký xác nhận và lưu hồ sơ.
- **Báo cáo chênh lệch kiểm kê theo kỳ** phục vụ đối soát và đánh giá mức thất thoát của kho.

**Mục tiêu:** mọi lần điều chỉnh tồn phát sinh từ kiểm kê đều có phiếu kiểm kê làm căn cứ và chứng từ điều chỉnh đi kèm, đủ căn cứ cho kế toán ghi nhận thừa/thiếu và quy trách nhiệm người thực hiện.

## Giải pháp nghiệp vụ

Triển khai tính năng **"Kiểm kê kho"** thành một phân hệ chứng từ riêng trong nhóm nghiệp vụ kho, thay cho việc sửa tồn rời rạc trên màn sản phẩm.

Các thành phần của giải pháp:

- **Giao diện (UI):** bổ sung mục **Kiểm kê kho** vào menu **Kho**, đặt dưới mục Giao dịch. Gồm màn **danh sách phiếu kiểm kê** (lọc theo kho, thời gian, người kiểm, trạng thái), màn **lập phiếu kiểm kê** với phần đầu phiếu (kho, ngày kiểm, người kiểm, lý do kiểm) và lưới các dòng kiểm gồm Sản phẩm — Lô (nếu có theo dõi lô) — Tồn sổ sách — Số thực tế — Chênh lệch — Lý do chênh lệch, kèm ô quét mã để thêm và đếm sản phẩm nhanh; và màn **xem chi tiết phiếu đã hoàn thành** ở dạng chỉ đọc phục vụ đối soát, có nút in biên bản kiểm kê.
- **Logic xử lý:** tồn sổ sách do hệ thống nạp, người dùng không sửa được; phiếu còn nháp thì mở lại là nạp số mới nhất. Chênh lệch tự tính bằng số thực tế trừ số sổ sách, dòng bỏ trống số thực tế coi như chưa kiểm và không cân bằng. Khi bấm cân bằng, hệ thống nạp tồn lần cuối rồi mới tính: dòng thừa sinh chứng từ nhập điều chỉnh, dòng thiếu sinh chứng từ xuất điều chỉnh — dùng lại đúng cơ chế chứng từ điều chỉnh của chức năng sửa tồn hiện có; sản phẩm theo dõi lô thì cân bằng tới từng lô. Phiếu kiểm kê **không cần bước duyệt**; phiếu đã hoàn thành bị khóa và giữ nguyên bộ số đã ghi, muốn chỉnh phải lập phiếu mới.
- **Quy trình (Process):** Vào Kiểm kê kho → Thêm phiếu → Chọn kho → Chọn sản phẩm và lô cần đếm → Hệ thống nạp tồn sổ sách hiện tại → Nhập hoặc quét số đếm thực tế → Lưu nháp nếu đếm dở → Cân bằng kho → Hệ thống nạp tồn lần cuối, cập nhật tồn và sinh chứng từ điều chỉnh

### Các phương án cân nhắc

Vấn đề cần xử lý: cửa hàng vẫn bán hàng trong lúc thủ kho đang đếm, nên tồn sổ sách lúc lập phiếu có thể khác lúc hoàn thành phiếu.

| Phương án | Ưu điểm | Nhược điểm |
|-----------|---------|-----------|
| A — Ghi đè tồn theo số đếm thực tế | Tồn sau kiểm luôn đúng bằng số đã đếm, dễ hiểu với thủ kho | Nuốt mất các giao dịch bán phát sinh trong lúc đếm |
| B — Áp mức chênh lệch lên tồn hiện tại | Không nuốt giao dịch phát sinh giữa chừng | Tồn sau kiểm có thể khác số đã đếm, thủ kho khó hiểu |
| C — Khóa giao dịch trong lúc kiểm | Số liệu sạch tuyệt đối | Cửa hàng phải ngừng bán, khách khó chấp nhận |

**Đã chốt: Phương án A** — ghi đè tồn theo số đếm thực tế. Không khóa kho, không chặn bán hàng; thay vào đó hệ thống nạp lại tồn sổ sách mỗi lần mở phiếu nháp và nạp lần cuối ngay trước khi cân bằng, nên chênh lệch luôn tính trên số mới nhất.

**Phạm vi ảnh hưởng:**

- Dùng lại cơ chế sinh chứng từ điều chỉnh nhập/xuất của chức năng sửa tồn hiện có; cần chốt có tách riêng loại chứng từ "kiểm kê" để báo cáo phân biệt được nguồn gốc điều chỉnh không.
- Báo cáo xuất nhập tồn và báo cáo lợi nhuận sẽ xuất hiện thêm chứng từ điều chỉnh phát sinh từ kiểm kê — cần kiểm tra cách hiển thị và cách tính giá vốn phần thừa/thiếu.
- Sản phẩm có theo dõi lô: việc cân bằng phải áp xuống từng lô, đụng tới nghiệp vụ tồn theo lô.
- Cần bổ sung quyền sử dụng chức năng kiểm kê cho vai trò thủ kho, tách quyền lập phiếu với quyền hoàn thành phiếu.
- Cần xác định có làm trên app mobile không, vì thủ kho thường cầm điện thoại đi đếm tại kho.
- Cần thiết bị quét mã vạch: máy quét gắn cổng USB trên bản web và camera điện thoại trên bản mobile, phải kiểm tra khả năng tương thích với các model khách đang dùng.
- Cần mẫu in biên bản kiểm kê để ký và lưu hồ sơ, đụng tới bộ mẫu in sẵn có của phần mềm.

## Câu hỏi mở

| # | Câu hỏi | Người trả lời | Trạng thái |
|---|---------|---------------|-----------|
| 1 | Có tách riêng loại chứng từ điều chỉnh do kiểm kê, khác với sửa tồn thủ công, để báo cáo phân biệt nguồn gốc không? | Nội bộ / kế toán | [ ] |
| 2 | Dòng đã chọn vào phiếu nhưng bỏ trống số thực tế thì hiểu là chưa đếm hay tồn bằng 0? | Khách hàng | [x] Chưa kiểm — bỏ qua khi cân bằng |
| 3 | Giá vốn phần hàng thừa/thiếu ghi nhận thế nào? | Kế toán / khách hàng | [x] Theo ngày kiểm kê trên phiếu, kỳ chứa ngày đó; chưa có giá thì lùi về kỳ gần nhất |
| 4 | Có làm chức năng kiểm kê trên app mobile không? | Nội bộ / sale | [x] Có — quét mã hỗ trợ cả web lẫn mobile, tùy người dùng |
| 5 | Mỗi đợt kiểm kê khoảng bao nhiêu mã hàng và mất bao lâu? | Khách hàng / sale | [x] Tùy người dùng, không đặt mốc; phiếu không giới hạn số dòng |
| 6 | Phiếu kiểm kê đã hoàn thành có cho hủy hoặc đảo lại không? | Khách hàng | [x] Không — chỉ hai trạng thái Nháp và Hoàn thành, muốn chỉnh thì lập phiếu mới |
| 7 | Ngoài chọn từng mã, có cần chọn nhanh toàn bộ sản phẩm của kho không? | Khách hàng | [x] Có — tick chọn tất cả hàng hóa trong kho, danh sách hiện theo đơn vị tính chính |
| 8 | Quét mã làm trên bản web hay app mobile? | Nội bộ / khách hàng | [x] Cả hai, tùy người dùng |
| 9 | Lý do chênh lệch chọn từ danh mục cố định hay tự nhập tay? | Kế toán / khách hàng | [x] Không bắt buộc nhập; cách nhập để `/srs` chốt |
| 10 | Biên bản kiểm kê in theo mẫu nào? | Khách hàng / sale | [x] Mẫu chung sẵn có, người dùng chỉnh lại được |
| 11 | Quyền hoàn thành phiếu có tách khỏi quyền lập phiếu không? | Khách hàng | [x] Không cần tách — quyền kiểm kê gồm Tạo, Sửa, Xóa, Xem |

## Ghi chú cho Giai đoạn 5

> Thông tin chi tiết thu thập được ở giai đoạn này nhưng chưa đưa vào tài liệu sơ bộ — dùng khi viết giải pháp chi tiết.

- Chức năng sửa tồn hiện có đã sinh chứng từ điều chỉnh nhập/xuất trên chứng từ kho; kiểm kê dự kiến dùng lại đúng cơ chế này, tham chiếu [docs/sua-ton-lo-san-pham/srs/spec.md](../sua-ton-lo-san-pham/srs/spec.md).
- Sản phẩm bật theo dõi lô: tồn mỗi kho bằng tổng tồn các lô, nên việc cân bằng theo kiểm kê phải áp xuống từng lô chứ không sửa tổng.
- Phiếu hoàn thành phải lưu cứng bộ số của từng dòng (tồn sổ sách, số thực tế, chênh lệch, giá vốn đã dùng, giá trị chênh lệch) vì tồn sổ sách của quá khứ không tra ngược được.
- Giá vốn lấy từ lịch sử giá vốn (bảng `cogs_history`) sau khi tính giá xuất kho, chọn theo kỳ chứa ngày kiểm kê.
- Loại hình cửa hàng xăng dầu nằm ngoài phạm vi chức năng này.
