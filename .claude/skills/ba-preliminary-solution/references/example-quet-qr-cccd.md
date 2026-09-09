# Bản mẫu tham khảo — Giải pháp sơ bộ

> File này là **ví dụ đầu ra chuẩn** của `/ba-preliminary-solution`. Bám đúng văn phong, độ dài và mức chi tiết này.
> Lưu ý mức độ: mô tả *hướng* giải pháp, không đặc tả. Không có bảng trường, không mã BR, không SQL.

---

```markdown
---
type: giai-phap-so-bo
stage: 1
feature: quet-qr-cccd
status: draft
lang: vi
owner: "@huelinh"
created: 2026-08-28
updated: 2026-08-28
source: "Yêu cầu khách hàng — quầy bán hàng đề xuất qua sale"
links: []
changelog:
  - 2026-08-28 | /ba-preliminary-solution | tạo mới giải pháp sơ bộ từ yêu cầu khách hàng quầy bán hàng
---

# Quét mã QR trên CCCD để tự điền thông tin khách hàng — Giải pháp sơ bộ

## Làm rõ yêu cầu

### 1. Đặc điểm khách hàng

Doanh nghiệp có nhu cầu quản lý danh bạ khách hàng, thường xuyên thực hiện nghiệp vụ thêm mới thông tin khách hàng tại quầy hoặc trực tiếp khi tiếp xúc khách.

### 2. Câu chuyện nghiệp vụ

Hiện tại, khi có khách hàng mới, nhân viên phải quan sát CCCD và gõ thủ công từng trường thông tin (Số CCCD, Họ tên, Ngày sinh, Giới tính, Địa chỉ) vào biểu mẫu trên phần mềm.

Quy trình hiện tại: Mở danh mục → Thêm khách hàng → Nhập liệu → Kiểm tra → Lưu

### 3. Phần mềm đáp ứng

Phần mềm đã có chức năng thêm khách hàng bằng cách nhập liệu tay. Tuy nhiên, chưa có tính năng hỗ trợ đọc dữ liệu tự động từ thiết bị quét mã QR/barcode để điền vào biểu mẫu.

### 4. Khó khăn

Nhân viên mất nhiều thời gian nhập liệu và đối soát thủ công, dẫn đến hiệu suất thấp và dễ xảy ra sai sót thông tin khách hàng.

### 5. Mong muốn

Quản lý hoặc nhân viên mong muốn có thể quét mã QR trên CCCD để hệ thống tự động bóc tách và điền các thông tin (Số CCCD, Họ tên, Ngày sinh, Giới tính, Địa chỉ) vào biểu mẫu nhằm tối ưu tốc độ và độ chính xác.

## Yêu cầu nghiệp vụ

Hệ thống cần hỗ trợ tự động hóa việc nhập liệu thông tin khách hàng thông qua việc khai thác dữ liệu từ mã QR trên CCCD. Nghiệp vụ chia thành ba nhóm.

### 1. Thu nhận dữ liệu từ mã QR

- **Kích hoạt quét tại biểu mẫu:** thao tác quét đặt ngay trên màn thêm khách hàng, không phải mở màn hình khác rồi quay lại.
- **Hỗ trợ thiết bị ngoại vi:** nhận dữ liệu từ máy quét mã QR/Barcode gắn cổng USB trên bản web và từ camera điện thoại trên bản mobile.

### 2. Bóc tách và điền thông tin

- **Bóc tách chuỗi mã QR:** tách chuỗi quét được thành các thông tin Số CCCD, Họ tên, Ngày sinh, Giới tính, Địa chỉ và điền vào đúng ô trên biểu mẫu.
- **Chuẩn hóa dữ liệu:** đưa Ngày sinh và Giới tính về đúng định dạng phần mềm đang dùng trước khi điền.
- **Báo lỗi chuỗi không hợp lệ:** khi chuỗi quét không đúng chuẩn thì thông báo ngay, không điền dữ liệu sai vào biểu mẫu.

### 3. Kiểm soát trước khi lưu

- **Cho sửa lại sau khi tự điền:** người dùng kiểm tra và chỉnh từng thông tin đã được điền tự động.
- **Xác nhận trước khi lưu:** thông tin chỉ vào danh bạ khách hàng sau khi người dùng bấm lưu, không tự lưu ngay sau khi quét.

**Mục tiêu:** tối ưu hóa tốc độ nhập liệu và triệt tiêu sai sót do thao tác thủ công.

## Giải pháp nghiệp vụ

Triển khai tính năng "Quét mã CCCD" tích hợp trực tiếp vào luồng nghiệp vụ thêm mới khách hàng.

Các thành phần của giải pháp:

- **Giao diện (UI):** bổ sung nút lệnh "Quét mã CCCD" tại popup/màn hình Thêm khách hàng.
- **Logic xử lý:** dùng quy tắc phân tách chuỗi bằng ký tự `|` để bóc tách dữ liệu; ánh xạ từng phần vào trường tương ứng trên phần mềm, bao gồm chuẩn hóa lại định dạng Ngày sinh và Giới tính; kiểm tra tính hợp lệ của chuỗi QR, hiển thị thông báo lỗi ngay nếu định dạng không đúng chuẩn.
- **Quy trình (Process):** Mở form → Quét mã → Hệ thống tự điền → Người dùng xác nhận → Lưu

**Phạm vi ảnh hưởng:**

- Cần sử dụng thiết bị barcode scanner có khả năng quét mã QR.
- Cần kiểm tra khả năng tương thích của thiết bị với phần mềm.
- Trên mobile, quét bằng camera thay cho thiết bị scanner.

## Câu hỏi mở

| # | Câu hỏi | Người trả lời | Trạng thái |
|---|---------|---------------|-----------|
| 1 | Danh sách model scanner khách đang dùng để kiểm tra tương thích? | Khách hàng / sale | [ ] |
| 2 | Khi quét trúng khách đã tồn tại (trùng số CCCD) thì xử lý thế nào — cảnh báo, mở bản ghi cũ, hay vẫn tạo mới? | Khách hàng | [ ] |
| 3 | Có cần lưu lại ảnh/chuỗi QR gốc phục vụ đối soát không? | Nội bộ | [ ] |

## Ghi chú cho Giai đoạn 5

- Chuỗi QR CCCD gắn chip gồm các phần phân tách bởi `|`, thứ tự trường cần xác nhận lại với mẫu thực tế khi đặc tả chi tiết.
- Ngày sinh trong mã QR ở định dạng ddMMyyyy, cần chuẩn hóa khi ánh xạ.
```

---

## Vì sao bản mẫu này đạt

- Mỗi mục **1–3 câu**, bám đúng khung mẫu của công ty.
- Mục 2 có chuỗi bước quy trình hiện tại; mục 3 tách rõ "đã có" và "chưa có".
- Mục 5 liệt kê **cụ thể** các trường được tự điền, không nói chung "cho nhanh hơn".
- Yêu cầu nghiệp vụ chia **3 nhóm theo vòng đời** (thu nhận dữ liệu, bóc tách và điền, kiểm soát trước khi lưu) — tính năng nhỏ nên 3 nhóm là đủ; mỗi mục con nêu đúng một việc kèm đối tượng cụ thể, không gộp cả nhóm vào một dòng.
- Giải pháp nêu nguyên tắc xử lý (phân tách bằng `|`, chuẩn hóa ngày sinh/giới tính) nhưng **không** đặc tả từng trường, không mã BR, không SQL.
- Phạm vi ảnh hưởng nêu đúng các điểm cần kiểm tra trước khi cam kết: thiết bị, tương thích, nền tảng mobile.
- Những gì chưa chốt được đẩy xuống Câu hỏi mở để mang đi họp Giai đoạn 2, thay vì đoán bừa trong thân bài.
- Chi tiết kỹ thuật lỡ thu thập được (thứ tự trường, định dạng ngày) để riêng ở "Ghi chú cho Giai đoạn 5", không làm nặng tài liệu sơ bộ.
