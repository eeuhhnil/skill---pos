
# Task: BMAD Help

## QUY TẮC ĐỊNH TUYẾN (ROUTING RULES)

- **`phase` trống = bất kỳ lúc nào** — Các công cụ phổ quát hoạt động bất kể trạng thái workflow
- **Phase có số chỉ thứ tự** — Các phase như `1-discover` → `2-define` → `3-build` → `4-ship` chạy theo thứ tự (tên gọi có thể khác nhau tùy module)
- **Phase không có Bước Bắt Buộc** — Nếu toàn bộ phase không có mục required=true, cả phase đó là tùy chọn. Nếu nó đứng trước phase khác theo thứ tự, có thể khuyến nghị, nhưng luôn làm rõ với người dùng mục bắt buộc thực sự tiếp theo là gì.
- **Ở trong module** — Hướng dẫn theo workflow của module đang hoạt động dựa trên thứ tự phase+sequence
- **Mô tả chứa định tuyến** — Đọc các đường dẫn thay thế (ví dụ: "quay lại phần trước nếu cần sửa")
- **`required=true` chặn tiến trình** — Các workflow bắt buộc phải hoàn thành trước khi chuyển sang phase sau
- **Artifact tiết lộ hoàn thành** — Tìm kiếm các đường dẫn output đã giải quyết để khớp các file tìm thấy với hàng workflow

## QUY TẮC HIỂN THỊ (DISPLAY RULES)

### Workflow Dựa Trên Lệnh
Khi trường `command` có giá trị:
- Hiển thị lệnh như tên skill trong backticks (ví dụ: `bmad-bmm-create-prd`)

### Workflow Tham Chiếu Skill
Khi `workflow-file` bắt đầu bằng `skill:`:
- Giá trị là một tham chiếu skill (ví dụ: `skill:bmad-quick-dev-new-preview`), KHÔNG phải đường dẫn file
- KHÔNG cố giải quyết hoặc load nó như đường dẫn file
- Hiển thị dùng giá trị cột `command` như tên skill trong backticks (giống workflow dựa trên lệnh)

### Workflow Dựa Trên Agent
Khi trường `command` trống:
- Người dùng load agent trước bằng cách gọi agent skill (ví dụ: `bmad-pm`)
- Sau đó gọi bằng cách tham chiếu trường `code` hoặc mô tả trường `name`
- KHÔNG hiển thị slash command — hiển thị giá trị code và hướng dẫn load agent thay thế

Ví dụ trình bày khi command trống:
```
Giải Thích Khái Niệm (EC)
Load: agent skill tech-writer, sau đó yêu cầu "EC về [chủ đề]"
Agent: Tech Writer
Mô tả: Tạo giải thích kỹ thuật rõ ràng với ví dụ...
```

## PHÁT HIỆN MODULE (MODULE DETECTION)

- **Cột `module` trống** → công cụ phổ quát (hoạt động trên tất cả module)
- **`module` được đặt tên** → workflow đặc thù của module

Phát hiện module đang hoạt động từ ngữ cảnh hội thoại, các workflow gần đây hoặc từ khóa truy vấn của người dùng. Nếu không rõ, hỏi người dùng.

## PHÂN TÍCH INPUT

Xác định những gì vừa được hoàn thành:
- Người dùng tuyên bố hoàn thành rõ ràng
- Workflow đã hoàn thành trong hội thoại hiện tại
- Các artifact tìm thấy khớp với các pattern `outputs`
- Nếu `index.md` tồn tại, đọc nó để có thêm ngữ cảnh
- Nếu vẫn không rõ, hỏi: "Workflow nào bạn vừa hoàn thành gần đây nhất?"

## THỰC THI

1. **Load catalog** — Load `{project-root}/_bmad/_config/bmad-help.csv`

2. **Giải quyết vị trí output và config** — Quét từng thư mục trong `{project-root}/_bmad/` (ngoại trừ `_config`) để tìm `config.yaml`. Với mỗi hàng workflow, giải quyết các biến `output-location` dựa trên config của module đó để có thể tìm kiếm đường dẫn artifact. Cũng trích xuất `communication_language` và `project_knowledge` từ config của từng module đã quét.

3. **Nắm vững kiến thức dự án** — Nếu `project_knowledge` giải quyết đến một đường dẫn tồn tại, đọc các file tài liệu có sẵn (tài liệu kiến trúc, tổng quan dự án, tham chiếu tech stack) để có ngữ cảnh nền tảng. Dùng các thông tin dự án được phát hiện khi soạn bất kỳ output đặc thù nào của dự án. Không bao giờ bịa đặt chi tiết đặc thù của dự án — nếu tài liệu không có sẵn, hãy nói rõ.

4. **Phát hiện module đang hoạt động** — Dùng MODULE DETECTION ở trên

5. **Phân tích input** — Task có thể cung cấp tên/mã workflow, cụm từ hội thoại, hoặc không có gì. Suy luận những gì vừa được hoàn thành bằng INPUT ANALYSIS ở trên.

6. **Trình bày khuyến nghị** — Hiển thị các bước tiếp theo dựa trên:
   - Các workflow đã hoàn thành được phát hiện
   - Thứ tự phase/sequence (ROUTING RULES)
   - Sự hiện diện của artifact

   **Mục tùy chọn trước** — Liệt kê các workflow tùy chọn cho đến khi đạt đến bước bắt buộc
   **Mục bắt buộc tiếp theo** — Liệt kê workflow bắt buộc tiếp theo

   Với mỗi mục, áp dụng DISPLAY RULES ở trên và bao gồm:
   - **Tên** workflow
   - **Lệnh** HOẶC **Mã + Hướng dẫn load agent** (theo DISPLAY RULES)
   - **Agent** tiêu đề và tên hiển thị từ CSV (ví dụ: "🎨 Alex (Designer)")
   - **Mô tả** ngắn gọn

7. **Hướng dẫn bổ sung cần truyền đạt**:
   - Trình bày tất cả output bằng `{communication_language}`
   - Chạy mỗi workflow trong **cửa sổ ngữ cảnh mới**
   - Với các **workflow validation**: khuyến nghị dùng LLM chất lượng cao khác nếu có
   - Với các yêu cầu hội thoại: phù hợp với tone của người dùng trong khi trình bày rõ ràng

8. Quay lại quy trình đang gọi sau khi trình bày các khuyến nghị.
