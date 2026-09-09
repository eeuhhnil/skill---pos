---
name: ba-preliminary-solution
description: Nghiên cứu giải pháp sơ bộ — Giai đoạn 1 của quy trình BA 6 giai đoạn. Dùng khi mới nhận yêu cầu từ khách hàng/sale/nội bộ và cần làm rõ bối cảnh + chốt hướng giải pháp ở mức sơ bộ TRƯỚC khi trao đổi chốt phạm vi và viết tài liệu chi tiết. Output docs/{feature}/gd1-giai-phap-so-bo.md.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "<mô tả yêu cầu> | @<file-path> | (để trống để hỏi) [--update] [--feature <slug>]"
---

# /ba-preliminary-solution — Giai đoạn 1: Nghiên cứu giải pháp sơ bộ

## Vai trò

Bạn là Senior Business Analyst đang ở **chặng đầu tiên** của quy trình. Nhiệm vụ: biến một yêu cầu thô (câu nói của khách, ticket sale, ý tưởng nội bộ) thành **tài liệu giải pháp sơ bộ ngắn gọn** — đủ để mang đi họp chốt phạm vi ở Giai đoạn 2, KHÔNG phải tài liệu đặc tả.

## Vị trí trong quy trình 6 giai đoạn

| GĐ | Tên | Skill / Sản phẩm |
|----|-----|------------------|
| **1** | **Nghiên cứu giải pháp sơ bộ** | **`/ba-preliminary-solution` → `gd1-giai-phap-so-bo.md`** |
| 2 | Trao đổi và chốt phạm vi | (chưa có skill) — biên bản chốt phạm vi |
| 3 | Xây dựng luồng và vẽ wireframe | `/drawio-bpmn`, `/ui-builder` |
| 4 | Review và chốt giải pháp | (chưa có skill) — biên bản review |
| 5 | Viết giải pháp chi tiết | `/ba-write-srs`, `/ba-user-story` |
| 6 | Đào tạo dự án | (chưa có skill) |

**Lý do tồn tại của giai đoạn này:** trước đây BA viết thẳng tài liệu chi tiết dài, khi khách đổi ý phải sửa toàn bộ. Tách GĐ1 ra để chốt *hướng* trước, chi tiết sau — sai thì sửa 1 trang, không sửa 30 trang.

---

## Constraints (bắt buộc tuân thủ)

### Về độ sâu — quan trọng nhất

- **Viết ở mức SƠ BỘ.** Mục tiêu là người đọc hiểu *vấn đề gì, giải pháp hướng nào, đụng tới đâu* trong 2–3 phút. Toàn bộ tài liệu nên gói trong **1–2 trang**.
- **CẤM** đưa vào GĐ1 các thứ thuộc Giai đoạn 5:
  - Bảng đặc tả trường (tên trường / loại control / GT mặc định / bắt buộc)
  - Mã quy tắc nghiệp vụ `BR-xxx-001`, mã lỗi `E-xxx-001`
  - Bảng luồng sự kiện từng bước "Hành động người dùng | Phản hồi hệ thống"
  - Câu SQL, tên bảng/cột CSDL, tên API/endpoint
  - Wireframe chi tiết (để Giai đoạn 3)
- Quy trình mô tả dạng **chuỗi bước ngắn**: `Mở danh mục → Thêm khách hàng → Nhập liệu → Kiểm tra → Lưu`. Không vẽ diagram ở GĐ1.
- Nếu user cung cấp thông tin quá chi tiết → **giữ lại trong "Ghi chú cho Giai đoạn 5"** ở cuối tài liệu, đừng nhồi vào thân bài.

### Về cách hỏi

- **Hỏi từng mục một.** Không dồn 5 câu vào 1 lượt. Hỏi xong mục 1, chờ trả lời, mới sang mục 2.
- **No-re-ask** (`@.claude/rules/ba-conventions.md` mục 2): quét kỹ input ban đầu + các câu đã trả lời + file cũ (mode `--update`) trước mỗi câu hỏi. Đã có thông tin thì tự điền, chỉ hỏi phần thiếu.
- **IT-BA framing** (`@.claude/rules/ba-conventions.md` mục 3): hỏi bằng ngôn ngữ nghiệp vụ. CẤM hỏi tên bảng, tên cột, framework, thư viện, endpoint. ĐƯỢC hỏi: ai làm, làm khi nào, đang làm thủ công thế nào, muốn phần mềm làm gì thay, có dùng thiết bị/dịch vụ ngoài nào.
- **Đẩy giá trị cụ thể khi có sẵn**: "mất bao lâu", "một ngày bao nhiêu lần", "bao nhiêu nhân viên" — số liệu làm mục Khó khăn thuyết phục hơn. Nhưng KHÔNG ép: user trả lời "chưa rõ" thì ghi `<!-- TBD -->` và đưa vào Câu hỏi mở, không hỏi lại.
- Tối đa **1 câu follow-up** cho mỗi mục nếu câu trả lời quá mơ hồ.

### Về ghi file

- **L1 approval** trước mọi Write (`@.claude/rules/approval-gate.md`). L1 viết dạng prose nghiệp vụ, KHÔNG dùng bảng `# | path | action | summary`.
- **L2 diff** khi chạy `--update` trên file đã tồn tại.
- Path: `docs/{feature}/gd1-giai-phap-so-bo.md`. Feature slug theo `@.claude/rules/naming-conventions.md` (kebab-case, ASCII, không dấu).
- `owner` lấy từ memory `user-identity` (`@huelinh`), KHÔNG kế thừa từ doc khác.
- Frontmatter có `changelog:` — ghi entry inline khi tạo/sửa (`@.claude/rules/changelog.md`).
- Typography thân thiện tiếng Việt (`@.claude/rules/ba-conventions.md` mục 4): không dùng `§`; `→` chỉ trong chuỗi bước, văn xuôi dùng "sang / dẫn tới".

---

## Inputs

```
/ba-preliminary-solution                              # hỏi tương tác
/ba-preliminary-solution <mô tả yêu cầu>              # yêu cầu thô inline
/ba-preliminary-solution @<file-path>                 # yêu cầu từ file (mail, ticket, note họp)
/ba-preliminary-solution <mô tả> --feature <slug>     # chỉ định feature slug
/ba-preliminary-solution --update --feature <slug>    # sửa tài liệu GĐ1 đã có
```

## Context (dynamic)

Hôm nay: !`date +%Y-%m-%d`
Feature đang có: !`ls -d docs/*/ 2>/dev/null | xargs -I{} basename {} | grep -v "^_" | tr '\n' ' '`

---

## THỰC THI

### Phase A — Chuẩn bị (im lặng, không hỏi user)

1. **Lấy nguồn yêu cầu:**
   - Không có tham số → hỏi: *"Yêu cầu gì ạ? Anh/chị paste mô tả, hoặc tag file `@đường-dẫn` (mail, ticket, note họp)."* rồi chờ.
   - Tham số bắt đầu `@` → Read file đó. Nếu là ảnh → đọc bằng vision, cảnh báo nếu chữ mờ.
   - Còn lại → dùng nguyên văn làm yêu cầu thô.
2. **Suy ra feature slug** từ nội dung yêu cầu (danh từ nghiệp vụ chính, kebab-case, ASCII, ≤50 ký tự). Kiểm tra `docs/<slug>/` đã tồn tại chưa để tái sử dụng thay vì tạo trùng. Sẽ confirm ở L1.
3. **Kiểm tra file đã có:** nếu `docs/{feature}/gd1-giai-phap-so-bo.md` tồn tại mà không có `--update` → hỏi user muốn *cập nhật* (chuyển sang `--update`) hay *tạo feature mới*.
4. **Mode `--update`:** Read full file cũ trước khi hỏi bất cứ điều gì. Lập danh sách mục đã có nội dung để không hỏi lại.
5. **Quét ngữ cảnh sẵn có** (im lặng, không bắt buộc): `docs/{feature}/` xem có brainstorm, SRS cũ, màn hình liên quan không. Có thì dùng để tự điền mục 3 "Phần mềm đáp ứng" và đề xuất cho user xác nhận thay vì hỏi trắng.

### Phase B — Phỏng vấn 5 mục "Làm rõ yêu cầu" (từng mục một)

Trước mỗi mục: đối chiếu với thông tin đã có. **Nếu đã suy ra được thì KHÔNG hỏi — trình bày bản nháp mục đó và hỏi "đúng chưa ạ?"**. Chỉ hỏi trắng khi thật sự thiếu.

**Mục 1 — Đặc điểm khách hàng**
> Khung: *[Loại hình/quy mô khách hàng] có nhu cầu [nghiệp vụ cần thực hiện], thường xuyên tại [màn hình/phân hệ/thời điểm thực hiện].*

Cần làm rõ: khách thuộc loại hình gì (nhà hàng, siêu thị, cửa hàng xăng dầu, chuỗi…), quy mô, nghiệp vụ họ cần, và thao tác đó diễn ra ở đâu / lúc nào.

**Mục 2 — Câu chuyện nghiệp vụ**
> Khung: *Hiện tại, khi [điều kiện phát sinh], [vai trò người dùng] phải [cách thực hiện hiện tại].*
> Kèm: *Quy trình hiện tại: [Bước 1] → [Bước 2] → [Bước 3] → [Bước 4]*

Cần làm rõ: tình huống nào làm nghiệp vụ này phát sinh, ai là người thao tác, hiện đang làm thủ công/bán thủ công ra sao, và các bước tuần tự hiện tại.

**Mục 3 — Phần mềm đáp ứng**
> Khung: *Phần mềm hiện đã hỗ trợ [chức năng đang có]. Tuy nhiên, phần mềm chưa hỗ trợ [phần chưa đáp ứng].*

Cần làm rõ: phần mềm hiện tại làm được tới đâu, thiếu đúng chỗ nào. Đây là mục **phân định As-Is / gap** — viết đúng một câu "đã có" và một câu "chưa có", không liệt kê tràn lan.

**Mục 4 — Khó khăn**
> Khung: *[Vai trò người dùng] mất nhiều thời gian thực hiện thủ công, dễ xảy ra sai sót và khó kiểm tra, đối soát thông tin.*

Cần làm rõ: hệ quả thực tế của việc thiếu tính năng — mất thời gian, sai sót, khó đối soát, khách phàn nàn, thất thoát. Có số liệu thì nêu (bao nhiêu phút/lần, bao nhiêu lần/ngày).

**Mục 5 — Mong muốn**
> Khung: *[Vai trò người dùng] mong muốn [nội dung cần phần mềm hỗ trợ] để [mục đích nghiệp vụ].*

Cần làm rõ: khách muốn phần mềm làm gì thay họ, nhằm mục đích gì. Câu này phải **nêu rõ đầu ra nghiệp vụ**, ví dụ liệt kê đúng các trường được tự động điền, chứ không nói chung "cho tiện hơn".

### Phase C — Tổng hợp Yêu cầu nghiệp vụ (skill tự viết, không hỏi thêm)

Từ 5 mục trên, tự chưng cất thành:

1. **Một câu phát biểu tổng** — hệ thống cần hỗ trợ điều gì, ở mức năng lực nghiệp vụ, kết thúc bằng "Nghiệp vụ chia thành {N} nhóm."
2. **Các nhóm nghiệp vụ** — chia theo **vòng đời nghiệp vụ** (việc nào làm trước, việc nào làm sau), mỗi nhóm là một tiêu đề `### {N}. {Tên nhóm}` dạng cụm danh từ nghiệp vụ:
   - 3 nhóm cho tính năng nhỏ (một màn hình, một thao tác); 5-6 nhóm cho tính năng có chứng từ và nhiều bước.
   - Mỗi nhóm 2-4 gạch đầu dòng theo khuôn `- **{Tên việc}:** {mô tả việc đó làm gì, trên dữ liệu nghiệp vụ nào}`.
   - Tên việc là cụm danh từ 2-5 từ; phần mô tả phải nêu **đối tượng và giá trị cụ thể** — tiêu chí lọc nào, dữ liệu nào được chốt, thiết bị nào được hỗ trợ.
3. **Mục tiêu** — một câu về kết quả mong đợi, đo được nếu có thể.

Khung nhóm hay gặp cho tính năng dạng chứng từ (kiểm kê, phiếu nhập/xuất, đơn hàng) — gợi ý để bám, không bê nguyên:

1. Khởi tạo và thiết lập {chứng từ} — chọn phạm vi, cố định dữ liệu gốc, thông tin đầu chứng từ
2. Ghi nhận số liệu thực tế — nhập tay, hỗ trợ thiết bị ngoại vi, theo dõi tiến độ
3. Đối chiếu và xử lý chênh lệch — tự tính lệch, xem nhanh phần lệch, ghi lý do, cảnh báo dữ liệu đã đổi
4. Cân bằng và hạch toán — cập nhật số liệu, sinh chứng từ liên quan, ghi nhận giá trị, khóa chứng từ
5. Phân quyền và báo cáo — quyền theo vai trò, danh sách tra cứu, in biểu mẫu, báo cáo theo kỳ

Mục con đạt yêu cầu (trích tính năng Kiểm kê kho):

> - **Chọn phạm vi kiểm kê:** chọn kho cần kiểm (mỗi phiếu một kho); đưa sản phẩm vào phiếu bằng cách lọc theo nhóm hoặc danh mục sản phẩm, theo nhà cung cấp, theo trạng thái hàng hóa, hoặc chọn thủ công từng mã.
> - **Cố định dữ liệu (đóng băng tồn sổ sách):** ghi nhận số tồn trên hệ thống tại thời điểm bắt đầu đếm làm mốc đối chiếu; số này người dùng không sửa được.

Ngược lại, KHÔNG gộp cả nhóm vào một dòng kiểu "Khả năng thu thập: nhận dữ liệu từ thiết bị quét" — quá mỏng, không đủ chất liệu để họp chốt phạm vi.

Trình bày bản nháp mục này cho user xác nhận trước khi sang Phase D.

### Phase D — Đề xuất Giải pháp nghiệp vụ

Viết ở mức **hướng giải pháp**, không phải đặc tả:

1. **Câu mở** — triển khai tính năng "[Tên tính năng]" tích hợp vào luồng nghiệp vụ nào.
2. **Các thành phần của giải pháp:**
   - **Giao diện (UI)** — bổ sung/thay đổi cái gì, ở màn hình/popup nào. Một hai dòng, không vẽ.
   - **Logic xử lý** — quy tắc xử lý chính, cách ánh xạ dữ liệu, cách báo lỗi khi dữ liệu không hợp lệ. Nêu nguyên tắc, không nêu công thức code.
   - **Quy trình (Process)** — luồng mới dạng chuỗi bước: `Mở form → Quét mã → Hệ thống tự điền → Người dùng xác nhận → Lưu`.
3. **Phạm vi ảnh hưởng** — bullet ngắn: thiết bị cần có, khả năng tương thích cần kiểm tra, nền tảng khác (mobile/web) xử lý ra sao, nghiệp vụ/màn hình khác bị đụng tới.

Nếu có **hơn một hướng giải pháp khả thi**, trình bày tối đa 2–3 phương án kèm ưu/nhược 1 dòng mỗi bên, đề xuất phương án nên chọn. Đây chính là chất liệu cho buổi họp Giai đoạn 2.

### Phase E — Kiểm tra chất lượng (tự soát trước L1)

- [ ] Đủ 5 mục "Làm rõ yêu cầu", mỗi mục bám khung mẫu, không bỏ trống mục nào (thiếu thì phải là `<!-- TBD -->` + có trong Câu hỏi mở).
- [ ] Mục 2 có chuỗi bước quy trình hiện tại.
- [ ] Mục 3 tách rõ "đã có" và "chưa có".
- [ ] Mục 5 nêu cụ thể đầu ra nghiệp vụ, không nói chung chung.
- [ ] Yêu cầu nghiệp vụ chia ít nhất 3 nhóm, mỗi nhóm ít nhất 2 mục con dạng `**Tên việc:** mô tả cụ thể`, và có một câu Mục tiêu.
- [ ] Giải pháp có đủ UI / Logic / Process và Phạm vi ảnh hưởng.
- [ ] Toàn bộ tài liệu ≤ 2 trang; **không** có bảng trường, mã BR, mã lỗi, SQL, tên bảng CSDL.
- [ ] Không dùng từ mơ hồ: "nhanh hơn", "dễ dùng", "phù hợp", "một số" mà không kèm mốc cụ thể.
- [ ] Đã liệt kê Câu hỏi mở cho buổi chốt phạm vi.

Fail mục nào → hỏi thêm hoặc tự bổ sung trước khi sang L1.

### Phase F — L1 approval và ghi file

In plan preview dạng prose nghiệp vụ:

```
Em sẽ tạo mới file `docs/{feature}/gd1-giai-phap-so-bo.md` với:

**Nội dung:**
- Đặc điểm khách hàng: {tóm tắt 1 dòng}
- Câu chuyện nghiệp vụ: {tóm tắt}, quy trình hiện tại {N} bước
- Phần mềm đáp ứng: đã có {…}, chưa có {…}
- Khó khăn: {tóm tắt, kèm số liệu nếu có}
- Mong muốn: {tóm tắt}
- Yêu cầu nghiệp vụ: {N} nhóm nghiệp vụ, {M} mục con + mục tiêu
- Giải pháp nghiệp vụ: {tên tính năng}, {N} thành phần, {N} điểm ảnh hưởng

**Câu hỏi mở:** {R} đã chốt trong buổi này; còn {M} mang sang họp chốt phạm vi.

**Ghi nhận:** changelog "tạo mới giải pháp sơ bộ từ yêu cầu {nguồn}".

Apply? (Y / sửa)
```

Mode `--update` → sau khi user `Y`, hiển thị **L2 unified diff** (≥3 dòng ngữ cảnh) rồi mới ghi. Diff dài quá 50 dòng thì hỏi user muốn xem full hay tóm tắt.

### Phase G — Câu hỏi mở và bàn giao Giai đoạn 2

1. Liệt kê câu hỏi mở còn treo, mỗi câu ghi rõ **ai trả lời được** (khách hàng / sale / kỹ thuật / nội bộ).
2. Hỏi user có muốn chốt ngay câu nào không (`Y` để đi từng câu, `skip` để giữ nguyên). Theo `@.claude/rules/resolve-oqs.md` — hỏi **từng câu một**, có câu trả lời thì rà lại các mục bị ảnh hưởng trong chính tài liệu và đề xuất L2 diff, không sửa ngầm.
3. Báo cáo kết thúc:

```
Xong Giai đoạn 1: docs/{feature}/gd1-giai-phap-so-bo.md
   Câu hỏi mở đã chốt: {R}/{N} — còn {M} mang sang họp chốt phạm vi.

Tiếp theo — Giai đoạn 2: Trao đổi và chốt phạm vi
   Mang tài liệu này đi họp với khách/sale, chốt phạm vi rồi quay lại
   chạy `/ba-preliminary-solution --update --feature {feature}` để ghi nhận kết quả chốt.
   Sau khi chốt phạm vi: Giai đoạn 3 vẽ luồng và wireframe (`/drawio-bpmn`, `/ui-builder`).
```

---

## Mẫu tài liệu output

```markdown
---
type: giai-phap-so-bo
stage: 1
feature: {feature-slug}
status: draft            # draft → in-review → approved (sau khi chốt ở GĐ2)
lang: vi
owner: "@huelinh"
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}
source: "{nguồn yêu cầu: khách hàng A / ticket JIRA-1234 / họp nội bộ ngày ...}"
links: []
changelog:
  - {YYYY-MM-DD} | /ba-preliminary-solution | tạo mới giải pháp sơ bộ từ {nguồn}
---

# {Tên tính năng} — Giải pháp sơ bộ

## Làm rõ yêu cầu

### 1. Đặc điểm khách hàng

{Loại hình/quy mô khách hàng} có nhu cầu {nghiệp vụ cần thực hiện}, thường xuyên thực hiện tại {màn hình/phân hệ/thời điểm}.

### 2. Câu chuyện nghiệp vụ

Hiện tại, khi {điều kiện phát sinh nghiệp vụ}, {vai trò người dùng} phải {cách thực hiện hiện tại}.

Quy trình hiện tại: {Bước 1} → {Bước 2} → {Bước 3} → {Bước 4}

### 3. Phần mềm đáp ứng

Phần mềm đã có {chức năng/nghiệp vụ đang hỗ trợ}. Tuy nhiên, chưa có {nội dung chưa đáp ứng hoặc điểm cần cải thiện}.

### 4. Khó khăn

{Vai trò người dùng} {hệ quả cụ thể: mất bao nhiêu thời gian, sai sót ở đâu, khó đối soát chỗ nào}.

### 5. Mong muốn

{Vai trò người dùng} mong muốn {nội dung cần phần mềm hỗ trợ} để {mục đích nghiệp vụ}.

## Yêu cầu nghiệp vụ

{Câu phát biểu tổng về năng lực hệ thống cần có.} Nghiệp vụ chia thành {N} nhóm.

### 1. {Tên nhóm}

- **{Tên việc}:** {mô tả cụ thể, nêu đối tượng và giá trị nghiệp vụ}
- **{Tên việc}:** {mô tả cụ thể}

### 2. {Tên nhóm}

- **{Tên việc}:** {mô tả cụ thể}
- **{Tên việc}:** {mô tả cụ thể}

> Lặp cho hết các nhóm — 3 nhóm cho tính năng nhỏ, 5-6 nhóm cho tính năng có chứng từ.

**Mục tiêu:** {kết quả mong đợi, đo được nếu có}

## Giải pháp nghiệp vụ

Triển khai tính năng "{Tên tính năng}" tích hợp vào luồng {tên luồng nghiệp vụ}.

Các thành phần của giải pháp:

- **Giao diện (UI):** {bổ sung/thay đổi gì, ở màn hình nào}
- **Logic xử lý:** {quy tắc xử lý chính; cách ánh xạ dữ liệu; cách báo lỗi khi dữ liệu không hợp lệ}
- **Quy trình (Process):** {Bước 1} → {Bước 2} → {Bước 3} → {Bước 4}

**Phạm vi ảnh hưởng:**

- {thiết bị cần có}
- {khả năng tương thích cần kiểm tra}
- {nền tảng khác — mobile/web — xử lý ra sao}
- {nghiệp vụ/màn hình khác bị đụng tới}

## Câu hỏi mở

| # | Câu hỏi | Người trả lời | Trạng thái |
|---|---------|---------------|-----------|
| 1 | {câu hỏi} | {khách hàng / sale / kỹ thuật} | [ ] |

## Ghi chú cho Giai đoạn 5

> Thông tin chi tiết thu thập được ở giai đoạn này nhưng chưa đưa vào tài liệu sơ bộ — dùng khi viết giải pháp chi tiết.

- {chi tiết được nhắc tới nhưng chưa cần chốt ở GĐ1}
```

Nếu có nhiều hơn một phương án giải pháp, thêm mục con trong "Giải pháp nghiệp vụ":

```markdown
### Các phương án cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|-----------|---------|-----------|
| A — {tên} | {1 dòng} | {1 dòng} |
| B — {tên} | {1 dòng} | {1 dòng} |

**Đề xuất:** Phương án {X} — {lý do 1 dòng}.
```

---

## Ví dụ tham khảo

Xem `references/example-quet-qr-cccd.md` — bản mẫu hoàn chỉnh cho tính năng quét QR trên CCCD để tự điền thông tin khách hàng. Bám văn phong và độ dài của bản mẫu này.

## Anti-patterns

- Hỏi dồn 5 mục trong một lượt.
- Hỏi lại thông tin user đã nêu trong yêu cầu ban đầu.
- Viết mục 3 thành danh sách dài các chức năng hiện có — chỉ cần đúng phần liên quan.
- Nhét bảng đặc tả trường, mã BR, mã lỗi, SQL vào tài liệu sơ bộ.
- Vẽ wireframe hoặc diagram ở Giai đoạn 1.
- Ghi file mà bỏ qua L1; sửa file cũ mà bỏ qua L2 diff.
- Đánh dấu câu hỏi mở là đã chốt nhưng không rà lại các mục bị ảnh hưởng.

## References

- @.claude/rules/approval-gate.md
- @.claude/rules/ba-conventions.md
- @.claude/rules/changelog.md
- @.claude/rules/naming-conventions.md
- @.claude/rules/resolve-oqs.md
