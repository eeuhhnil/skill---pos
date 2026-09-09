---
name: ba-write-srs
description: Tạo tài liệu SRS theo đúng mẫu chuẩn công ty. Dùng khi cần viết tài liệu đặc tả yêu cầu cho một chức năng mới hoặc thay đổi hệ thống.
argument-hint: "[tên chức năng hoặc yêu cầu thay đổi]"
---

# BA: Viết tài liệu SRS (theo mẫu công ty)

**Vai trò:** Bạn là một Senior Business Analyst. Nhiệm vụ là tạo tài liệu SRS đầy đủ, rõ ràng theo đúng cấu trúc mẫu công ty, đủ để team kỹ thuật và QA hiểu và triển khai.

---

## THỰC THI

### Bước 1: Thu thập thông tin

Xác định từ đầu vào:
- Tên chức năng / yêu cầu thay đổi
- Nguồn gốc thay đổi (khách hàng yêu cầu / fix bug / cải tiến / pháp lý)
- Ticket/issue tham chiếu (nếu có)
- Các actor, màn hình, chức năng liên quan

Nếu thiếu thông tin quan trọng, hỏi trước khi viết.

### Bước 2: Xuất tài liệu SRS theo mẫu công ty

---


## LỊCH SỬ THAY ĐỔI TÀI LIỆU

> *A – Tạo mới, M – Sửa đổi, D – Xóa bỏ*

| Ngày thay đổi  | Mô tả thay đổi | Nguồn gốc | Người thực hiện  | Mô tả thay đổi | Ghi chú |
|--------------|-----------|-----------|---------|----------------|---------|
| [Ngày] | A | [Nguồn] | [Tên BA] | Tạo mới tài liệu | |

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
4. Chi tiết các nghiệp vụ ảnh hưởng

---

## 1. NGUỒN GỐC THAY ĐỔI

> *Ghi rõ lý do phát sinh thay đổi: yêu cầu khách hàng, quy định pháp luật, cải tiến hệ thống, fix bug. Mô tả ngắn gọn kèm tham chiếu ticket/issue.*

[Mô tả nguồn gốc — ví dụ: Yêu cầu thay đổi từ khách hàng A (Jira-1234). Khách hàng phản ánh quy trình xuất báo cáo hiện tại quá chậm, ảnh hưởng đến công việc hàng ngày.]

---

## 2. NỘI DUNG THAY ĐỔI

### 2.1 Mô tả chung về yêu cầu thay đổi

> *Tóm tắt thay đổi ở mức tổng quan, dễ hiểu cho cả người không chuyên. Viết 2–3 đoạn, không đi quá chi tiết kỹ thuật.*

[Mô tả tổng quan — ví dụ: Hệ thống hiện tại chưa hỗ trợ người dùng xuất báo cáo theo khoảng thời gian tùy chọn. Yêu cầu bổ sung tính năng cho phép người dùng chọn từ ngày – đến ngày và xuất báo cáo dưới dạng Excel/PDF.]

### 2.2 Mô tả thay đổi về luồng nghiệp vụ

> *Diễn giải thay đổi trong quy trình/flow nghiệp vụ. Dùng BPMN/UML activity diagram hoặc mô tả dạng bước.*

**Luồng hiện tại (As-Is):**
1. [Bước 1 hiện tại]
2. [Bước 2 hiện tại]

**Luồng mới (To-Be):**
1. [Bước 1 mới]
2. [Bước 2 mới]
3. [Bước bổ sung]

*(Đính kèm diagram nếu có)*

### 2.3 Yêu cầu người dùng

> *Thay vì nhúng trực tiếp bảng user story vào SRS, mục này sẽ **gọi skill** `ba-user-story` để sinh User Story và Open Questions từ đầu vào hiện có.*

Quy trình thực thi trong mục 2.3:

1. Chuẩn bị input cho `ba-user-story` gồm: tiêu đề chức năng, tóm tắt yêu cầu nghiệp vụ, danh sách actor (nếu có), các ràng buộc/giả định, và bất kỳ context quan trọng nào.
2. Gọi `ba-user-story` với input trên — nhận về output là: bảng User Story (StoryID | Vai trò | Mong muốn | Mục đích | Độ ưu tiên), metadata cho từng story, và danh sách Open Questions.
3. Hiển thị preview của output cho user/BA để review. Nếu cần chỉnh sửa, cho phép sửa prompt/inputs rồi gọi lại `ba-user-story` (tối đa 3 lần chỉnh sửa khuyến nghị).
4. Khi user xác nhận, tích hợp output vào SRS:
  - Chèn bảng User Story vào mục 2.3.
  - Chèn metadata (Story Points, Dependencies, Notes) dưới mỗi story.
  - Chèn mục "Open Questions" dưới cùng, giữ nguyên ID và thông tin người cần trả lời.
5. Nếu tích hợp sẽ thay đổi file đã tồn tại → hiển thị diff (L2 Diff) trước khi ghi file, theo quy định Approval Gate.

Ghi chú vận hành:
- Nếu input thiếu thông tin cần thiết để `ba-user-story` sinh stories chất lượng, skill `ba-write-srs` phải hỏi ngắn (1-2 câu) để hoàn thiện input trước khi gọi.
- Mỗi lần gọi `ba-user-story` lưu lại prompt/ngữ cảnh dùng để repro (đưa vào changelog hoặc lưu tạm). 
- Open Questions sinh ra bởi `ba-user-story` được xử lý theo quy trình Phase E (Resolve Open Questions) — liệt kê và cho phép resolve hoặc hold.

Mục tiêu: tận dụng lại logic chuẩn hoá User Story từ `ba-user-story`, tránh trùng lặp định dạng và đảm bảo consistency giữa các skill.

### 2.4 Ngữ cảnh người dùng

> *Mô tả tình huống thực tế khi người dùng thao tác: thiết bị, thời gian, đối tượng sử dụng.*

[Mô tả ngữ cảnh — ví dụ: Người dùng thường tra cứu và xuất báo cáo từ thiết bị mobile trong giờ cao điểm (8h–9h sáng). Đối tượng chủ yếu là kế toán và trưởng bộ phận, không có kỹ năng kỹ thuật chuyên sâu.]

### 2.5 Mô tả thay đổi về CSDL

> *Ghi nhận thay đổi ở mức database: bảng, cột, kiểu dữ liệu, constraint. Script SQL để ở phụ lục nếu có.*

| Loại thay đổi | Bảng | Cột | Kiểu dữ liệu | Constraint | Mô tả |
|:---:|------|-----|-------------|------------|-------|
| A / M / D | [tên_bảng] | [tên_cột] | [varchar/int/...] | [NOT NULL / FK / ...] | [Mục đích] |

*(Không có thay đổi CSDL: ghi "Không áp dụng")*

### 2.6 Danh sách các chức năng

| Actor | Màn hình | Chức năng | Mô tả | Độ ưu tiên |
|-------|---------|-----------|-------|-----------|
| [Vai trò người dùng] | [Tên màn hình] | [Tên chức năng] | [Mô tả ngắn] | Cao / Trung bình / Thấp |

---

## 3. CHI TIẾT CÁC CHỨC NĂNG THAY ĐỔI

### 3.1 [Tên chức năng 1]

#### 3.1.1 Thông tin chung về chức năng

> *Mục đích, phạm vi của chức năng. Viết 3–5 câu mô tả.*

[Mô tả mục đích và phạm vi chức năng. Chức năng này cho phép [actor] thực hiện [hành động] nhằm [mục đích nghiệp vụ]. Áp dụng cho [đối tượng sử dụng] trong bối cảnh [ngữ cảnh]. Mô tả ngắn gọn có thể]

#### 3.1.2 Màn hình chức năng

> *Mô tả UI/UX thay đổi, mô tả chi tiết các thành phần trong màn hình. Đính kèm wireframe/mockup hoặc screenshot.*

*(Đính kèm hình ảnh wireframe/mockup nếu có)*

| # | Tên trường | Loại control | GT mặc định | Bắt buộc | Mô tả |
|---|-----------|-------------|-------------|---------|-------|
| 1 | [Tên trường/component] | Textbox / Dropdown / Checkbox / Radio / Datepicker / Button / Grid / ... | [Giá trị hiển thị khi mở màn hình — vd: Trống, Hôm nay, "Tất cả"] | Có / Không | [Mô tả chi tiết, nguồn dữ liệu, validation rules] |
| 2 | | | | | |

#### 3.1.3 Xử lý luồng sự kiện

> *Gộp cả sự kiện do người dùng tương tác và sự kiện hệ thống tự động xử lý vào một luồng duy nhất. Trước tiên khai báo khung nghiệp vụ (mục tiêu, tác nhân, điều kiện), sau đó mô tả từng bước.*

**Khung nghiệp vụ:**

| Hạng mục | Nội dung |
|----------|---------|
| **Mục tiêu (Purpose)** | [Chức năng này giải quyết vấn đề nghiệp vụ gì, kết quả mong đợi] |
| **Tác nhân (Actor)** | [Người dùng chính + tác nhân phụ. Nếu là job/hệ thống tự chạy: ghi "Hệ thống" hoặc tên scheduler/service] |
| **Điều kiện kích hoạt (Trigger)** | [Hành động người dùng — vd: nhấn nút "Xuất báo cáo"; hoặc sự kiện hệ thống — vd: đến 23h00 hằng ngày, sau khi hóa đơn chuyển trạng thái Hoàn thành] |
| **Điều kiện tiên quyết (Pre-condition)** | [Trạng thái phải thỏa mãn trước khi chạy: đã đăng nhập, có quyền X, dữ liệu Y tồn tại, tham số cấu hình Z bật] |
| **Điều kiện sau khi thực hiện (Post-condition)** | [Trạng thái hệ thống sau khi hoàn tất: bản ghi được tạo/cập nhật với giá trị nào, trạng thái chuyển từ A sang B, file/thông báo được sinh ra] |

**Các bước xử lý:**

| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|---------------------|-------------------|
| 1 | [Người dùng thực hiện... — nếu là bước hệ thống tự chạy, ghi "(Hệ thống tự động)"] | [Mô tả CHI TIẾT: kiểm tra/validate gì, lấy dữ liệu từ bảng nào, điều kiện lọc (WHERE) ra sao, join/tính toán gì, sắp xếp/phân trang thế nào, ghi dữ liệu vào đâu, hiển thị hoặc trả về kết quả gì] |
| 2 | | |

**Yêu cầu bắt buộc khi mô tả cột "Phản hồi hệ thống":**
- Nêu rõ **nguồn dữ liệu**: tên bảng/view/API được đọc.
- Nêu rõ **điều kiện lọc**: filter theo trường nào, giá trị nào, phạm vi ngày, trạng thái, đơn vị/chi nhánh, phân quyền dữ liệu.
- Nêu rõ **logic tính toán**: công thức, quy tắc làm tròn, đơn vị, thứ tự ưu tiên nếu có nhiều điều kiện.
- Nêu rõ **thao tác ghi**: bảng nào được insert/update, trường nào đổi giá trị gì.
- Nêu rõ **kết quả người dùng thấy**: màn hình/thông báo/file xuất ra.
- Nếu cần, đính kèm câu truy vấn mẫu hoặc pseudo-code trong khối code ngay dưới bảng.

```sql
-- Truy vấn mẫu cho bước [N] (nếu có)
SELECT ...
FROM ...
WHERE ...
```

**Trường hợp lỗi / Ngoại lệ:**

| Tình huống | Thông báo hiển thị | Hành động hệ thống |
|-----------|-------------------|-------------------|
| [Ví dụ: Nhập sai định dạng] | [Nội dung thông báo lỗi] | [Hệ thống làm gì: dừng xử lý, rollback, ghi log, cho retry...] |

#### 3.1.4 Quy tắc nghiệp vụ

> *Các ràng buộc nghiệp vụ chi phối chức năng này: điều kiện hợp lệ, công thức tính, quy tắc phân quyền, giới hạn giá trị. Mỗi quy tắc một mã riêng để các mục khác và test case tham chiếu tới.*

| Mã BR | Mô tả |
|-------|-------|
| BR-[feature]-001 | [Phát biểu quy tắc dạng khẳng định, có giá trị cụ thể — vd: Khoảng thời gian lọc báo cáo tối đa 31 ngày; nếu vượt, hệ thống chặn và báo lỗi E-001] |
| BR-[feature]-002 | |

**Quy ước viết quy tắc nghiệp vụ:**
- Mã theo format `BR-{feature}-{NNN}` (3 chữ số, tăng dần, không tái sử dụng mã đã xóa).
- Mỗi dòng chỉ một quy tắc — không gộp nhiều ràng buộc vào một mô tả.
- Phát biểu phải kiểm chứng được: nêu số liệu, ngưỡng, trạng thái, vai trò cụ thể. Cấm từ mơ hồ ("hợp lý", "phù hợp", "nhanh").
- Quy tắc nào được áp dụng ở bước nào thì bước đó trong bảng 3.1.3 phải tham chiếu mã BR tương ứng.

---

### 3.2 [Tên chức năng 2]

*(Lặp lại cấu trúc 3.1.1 đến 3.1.4)*

---

## 4. CHI TIẾT CÁC NGHIỆP VỤ ẢNH HƯỞNG

### 4.1 Các nghiệp vụ trong cùng hệ thống

> *Liệt kê các chức năng khác trong hệ thống bị ảnh hưởng bởi thay đổi này. Ghi rõ mức độ ảnh hưởng.*

| Chức năng bị ảnh hưởng | Màn hình | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|------------------------|---------|-----------------|----------------|
| [Tên chức năng] | [Tên màn hình] | Cao / Trung bình / Thấp | [Mô tả cụ thể ảnh hưởng] |

*(Không có ảnh hưởng: ghi "Không áp dụng")*

### 4.2 Chức năng của hệ thống khác

> *Xác định các hệ thống vệ tinh hoặc tích hợp bị ảnh hưởng. Liệt kê hệ thống + API/WS liên quan.*

| Hệ thống | API / Webservice | Mức độ ảnh hưởng | Mô tả ảnh hưởng |
|---------|----------------|-----------------|----------------|
| [Tên hệ thống] | [Endpoint / WS name] | Cao / Trung bình / Thấp | [Mô tả cụ thể] |

*(Không có ảnh hưởng: ghi "Không áp dụng")*

---

### Bước 3: Kiểm tra chất lượng trước khi hoàn thiện

- [ ] Bảng lịch sử thay đổi đã điền đầy đủ chưa?
- [ ] Nguồn gốc thay đổi có kèm ticket/issue tham chiếu không?
- [ ] Tất cả chức năng trong mục 2.6 đã có chi tiết ở mục 3 chưa?
- [ ] Mỗi trường trong màn hình (3.1.2) có đủ: tên trường, loại control, GT mặc định, bắt buộc, mô tả không?
- [ ] Mục 3.1.3 đã khai báo đủ khung nghiệp vụ: mục tiêu, tác nhân, điều kiện kích hoạt, điều kiện tiên quyết, điều kiện sau khi thực hiện chưa?
- [ ] Cột "Phản hồi hệ thống" ở 3.1.3 đã nêu rõ nguồn dữ liệu, điều kiện lọc, logic tính toán, thao tác ghi chưa (không viết chung chung "hệ thống xử lý")?
- [ ] Đã mô tả cả luồng lỗi / ngoại lệ ở mục 3.1.3 chưa?
- [ ] Mỗi chức năng đã có bảng quy tắc nghiệp vụ (3.1.4) với mã BR đúng format và mô tả kiểm chứng được chưa?
- [ ] Không dùng từ mơ hồ: "nhanh", "dễ dùng", "phù hợp", "một số"
- [ ] Mục 4 đã liệt kê đầy đủ các nghiệp vụ và hệ thống bị ảnh hưởng chưa?

### Bước 4: Open Questions

Liệt kê các điểm còn cần làm rõ với stakeholder:

| # | Câu hỏi | Ảnh hưởng đến mục | Người cần trả lời | Deadline |
|---|---------|------------------|------------------|---------|
| 1 | | | | |
