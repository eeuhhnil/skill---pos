---
agent_party: '{project-root}/_bmad/_config/agent-manifest.csv'
---

# Workflow Elicitation Nâng Cao

**Mục tiêu:** Thúc đẩy LLM xem xét lại, tinh chỉnh và cải thiện kết quả vừa tạo ra.

---

## HƯỚNG DẪN QUAN TRỌNG CHO LLM

- **BẮT BUỘC:** Thực thi TẤT CẢ các bước trong phần flow THEO ĐÚNG THỨ TỰ
- KHÔNG bỏ qua bước nào hoặc thay đổi trình tự
- DỪNG ngay lập tức khi gặp điều kiện dừng (halt conditions)
- Mỗi hành động trong một bước là hành động BẮT BUỘC để hoàn thành bước đó
- Các phần ngoài flow (validation, output, critical-context) cung cấp ngữ cảnh thiết yếu — xem xét và áp dụng trong suốt quá trình thực thi
- **LUÔN PHẢI PHẢN HỒI theo phong cách giao tiếp của Agent với `communication_language`**

---

## TÍCH HỢP (Khi Được Gọi Gián Tiếp)

Khi được gọi từ một prompt hoặc quy trình khác:

1. Nhận hoặc xem xét nội dung phần hiện tại vừa được tạo ra
2. Áp dụng các phương pháp elicitation lặp đi lặp lại để nâng cao nội dung đó
3. Trả về phiên bản đã được cải thiện khi người dùng chọn 'x' để tiếp tục
4. Nội dung đã cải thiện thay thế nội dung phần gốc trong tài liệu output

---

## FLOW

### Bước 1: Tải Danh Mục Phương Pháp

**Hành động:** Đọc file `./methods.csv` và `{agent_party}`

#### Cấu Trúc CSV

- **category:** Nhóm phương pháp (core, structural, risk, v.v.)
- **method_name:** Tên hiển thị của phương pháp
- **description:** Giải thích chi tiết về phương pháp, khi nào dùng và tại sao có giá trị
- **output_pattern:** Hướng dẫn flow linh hoạt dùng mũi tên (ví dụ: "analysis -> insights -> action")

#### Phân Tích Ngữ Cảnh

- Sử dụng lịch sử hội thoại
- Phân tích: loại nội dung, độ phức tạp, nhu cầu stakeholder, mức độ rủi ro, tiềm năng sáng tạo

#### Lựa Chọn Thông Minh

1. Phân tích ngữ cảnh: Loại nội dung, độ phức tạp, nhu cầu stakeholder, mức độ rủi ro, tiềm năng sáng tạo
2. Phân tích mô tả: Hiểu mục đích của từng phương pháp từ các mô tả trong CSV
3. Chọn 5 phương pháp: Chọn những phương pháp phù hợp nhất với ngữ cảnh dựa trên mô tả
4. Cân bằng cách tiếp cận: Kết hợp kỹ thuật nền tảng và chuyên biệt phù hợp

---

### Bước 2: Hiển Thị Tùy Chọn và Xử Lý Phản Hồi

#### Định Dạng Hiển Thị

```
**Tùy Chọn Elicitation Nâng Cao**
_Nếu party mode đang hoạt động, các agent sẽ tham gia._
Chọn một số (1-5), [r] để Xáo Trộn, [a] Liệt Kê Tất Cả, hoặc [x] để Tiếp Tục:

1. [Tên Phương Pháp]
2. [Tên Phương Pháp]
3. [Tên Phương Pháp]
4. [Tên Phương Pháp]
5. [Tên Phương Pháp]
r. Xáo trộn danh sách với 5 tùy chọn mới
a. Liệt kê tất cả phương pháp kèm mô tả
x. Tiếp Tục / Không Có Hành Động Nào Thêm
```

#### Xử Lý Phản Hồi

**Trường hợp 1-5 (Người dùng chọn phương pháp có số):**

- Thực thi phương pháp đã chọn dựa theo mô tả trong CSV
- Điều chỉnh độ phức tạp và định dạng output của phương pháp theo ngữ cảnh hiện tại
- Áp dụng phương pháp sáng tạo vào nội dung phần hiện tại đang được cải thiện
- Hiển thị phiên bản đã được cải thiện, cho thấy phương pháp đã tiết lộ hoặc cải thiện điều gì
- **QUAN TRỌNG:** Hỏi người dùng có muốn áp dụng thay đổi vào tài liệu không (y/n/other) và DỪNG để chờ phản hồi.
- **QUAN TRỌNG:** CHỈ nếu Yes thì mới áp dụng thay đổi. Nếu No, bỏ qua các thay đổi đề xuất. Nếu là câu trả lời khác, cố gắng thực hiện theo hướng dẫn của người dùng.
- **QUAN TRỌNG:** Hiển thị lại prompt 1-5, r, x để cho phép tiếp tục elicitation

**Trường hợp r (Xáo Trộn):**

- Chọn 5 phương pháp ngẫu nhiên từ methods.csv, hiển thị danh sách mới với cùng định dạng prompt
- Khi chọn, cố gắng chọn tập hợp đa dạng các phương pháp bao phủ các danh mục và cách tiếp cận khác nhau, với 1 và 2 là những lựa chọn hữu ích nhất cho tài liệu hoặc phần đang được khám phá

**Trường hợp x (Tiếp Tục):**

- Hoàn tất elicitation và tiếp tục
- Trả về nội dung đã được cải thiện đầy đủ về skill đang gọi
- Nội dung đã cải thiện trở thành phiên bản cuối cùng cho phần đó
- Báo hiệu hoàn thành về skill đang gọi để tiếp tục với phần tiếp theo

**Trường hợp a (Liệt Kê Tất Cả):**

- Liệt kê tất cả phương pháp kèm mô tả từ CSV trong bảng gọn gàng
- Cho phép người dùng chọn bất kỳ phương pháp nào theo tên hoặc số từ danh sách đầy đủ
- Sau khi chọn, thực thi phương pháp như mô tả trong Trường hợp 1-5

**Trường hợp: Phản Hồi Trực Tiếp:**

- Áp dụng thay đổi vào nội dung phần hiện tại và hiển thị lại các lựa chọn

**Trường hợp: Nhiều Số:**

- Thực thi các phương pháp theo thứ tự trên nội dung, sau đó hiển thị lại các lựa chọn

---

### Bước 3: Hướng Dẫn Thực Thi

- **Thực thi phương pháp:** Dùng mô tả từ CSV để hiểu và áp dụng từng phương pháp
- **Output pattern:** Dùng pattern như hướng dẫn linh hoạt (ví dụ: "paths -> evaluation -> selection")
- **Thích ứng động:** Điều chỉnh độ phức tạp theo nhu cầu nội dung (từ đơn giản đến phức tạp)
- **Áp dụng sáng tạo:** Diễn giải phương pháp linh hoạt theo ngữ cảnh nhưng vẫn nhất quán về pattern
- Tập trung vào các insights có thể hành động được
- **Giữ liên quan:** Gắn elicitation với nội dung cụ thể đang được phân tích (phần hiện tại của tài liệu đang tạo, trừ khi người dùng chỉ định khác)
- **Xác định personas:** Với các phương pháp một hoặc nhiều persona, xác định rõ quan điểm và dùng các thành viên party nếu có trong bộ nhớ
- **Hành vi vòng lặp quan trọng:** Luôn hiển thị lại các lựa chọn 1-5, r, a, x sau mỗi lần thực thi phương pháp
- Tiếp tục cho đến khi người dùng chọn 'x' để tiếp tục với nội dung đã cải thiện, xác nhận hoặc hỏi người dùng những gì nên được chấp nhận từ session
- Mỗi lần áp dụng phương pháp xây dựng dựa trên các cải tiến trước đó
- **Bảo tồn nội dung:** Theo dõi tất cả cải tiến đã thực hiện trong quá trình elicitation
- **Cải tiến lặp đi lặp lại:** Mỗi phương pháp được chọn (1-5) nên:
  1. Áp dụng vào phiên bản nội dung đã được cải thiện hiện tại
  2. Hiển thị các cải tiến đã thực hiện
  3. Quay lại prompt để tiếp tục elicitation hoặc hoàn thành
