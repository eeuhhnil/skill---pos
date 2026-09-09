<map version="1.0.1">
<!-- Kiem ke kho - So do tu duy (Giai doan 1). Nguon: docs/kiem-ke-kho/gd1-giai-phap-so-bo.md -->
<node TEXT="KIỂM KÊ KHO" COLOR="#1d2433" STYLE="bubble">
<font NAME="Segoe UI" SIZE="16" BOLD="true"/>
<richcontent TYPE="NOTE"><html><head></head><body><p>Giải pháp sơ bộ — Giai đoạn 1. Nguồn: docs/kiem-ke-kho/gd1-giai-phap-so-bo.md</p></body></html></richcontent>

<node TEXT="Làm rõ yêu cầu" POSITION="right" COLOR="#2f7ed8">
<font NAME="Segoe UI" SIZE="14" BOLD="true"/>
<edge COLOR="#2f7ed8" WIDTH="2"/>

  <node TEXT="1. Đặc điểm khách hàng" COLOR="#2f7ed8" FOLDED="true">
    <node TEXT="Thủ kho là người trực tiếp kiểm kê"/>
    <node TEXT="Mọi loại hình kinh doanh, trừ cửa hàng xăng dầu"/>
    <node TEXT="Mỗi phiếu chỉ một kho, chọn sản phẩm cần đếm">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Không kiểm nhiều kho hay nhiều chi nhánh cùng lúc</p></body></html></richcontent>
    </node>
    <node TEXT="Tần suất kiểm kê do từng khách hàng tự quyết"/>
  </node>

  <node TEXT="2. Câu chuyện nghiệp vụ" COLOR="#2f7ed8" FOLDED="true">
    <node TEXT="Đếm thực tế thấy lệch thì mở từng sản phẩm sửa lại tồn"/>
    <node TEXT="Hệ thống tự sinh phiếu nhập hoặc xuất phần chênh lệch"/>
    <node TEXT="Sửa thẳng, không qua bước duyệt của ai"/>
    <node TEXT="Không đúng nguyên tắc kiểm kê kho của kế toán">
      <font NAME="Segoe UI" SIZE="12" BOLD="true"/>
      <richcontent TYPE="NOTE"><html><head></head><body><p>Vì không có phiếu kiểm kê làm căn cứ</p></body></html></richcontent>
    </node>
    <node TEXT="Quy trình hiện tại" FOLDED="true">
      <node TEXT="1. Đếm thực tế tại kho"/>
      <node TEXT="2. So sánh với số trên phần mềm"/>
      <node TEXT="3. Mở từng sản phẩm sửa lại tồn"/>
      <node TEXT="4. Hệ thống sinh phiếu nhập/xuất phần chênh lệch"/>
    </node>
  </node>

  <node TEXT="3. Phần mềm đáp ứng" COLOR="#2f7ed8" FOLDED="true">
    <node TEXT="[ĐÃ CÓ] Chỉnh sửa số lượng tồn trực tiếp trên màn sản phẩm" FOLDED="true">
      <node TEXT="Nhập lại số tồn, hệ thống cập nhật tồn hiện có"/>
      <node TEXT="Tự sinh phiếu điều chỉnh nhập/xuất phần chênh lệch"/>
      <node TEXT="Sản phẩm có theo dõi lô thì sửa theo từng lô"/>
    </node>
    <node TEXT="[CHƯA CÓ] Nghiệp vụ kiểm kê kho đúng chuẩn kế toán" FOLDED="true">
      <node TEXT="Chưa có phiếu kiểm kê chốt danh sách sản phẩm cần đếm tại một thời điểm"/>
      <node TEXT="Chưa lưu song song số tồn sổ sách và số đếm thực tế để đối chiếu"/>
      <node TEXT="Không truy vết được ai đã kiểm và kiểm khi nào"/>
    </node>
  </node>

  <node TEXT="4. Khó khăn" COLOR="#2f7ed8" FOLDED="true">
    <node TEXT="Mở lần lượt từng sản phẩm nên mất nhiều thời gian khi kho nhiều mặt hàng"/>
    <node TEXT="Số đếm chỉ ghi trên giấy hoặc file ngoài, sửa xong là mất dấu">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Không đối chiếu lại được số sổ sách trước khi sửa với số đã đếm</p></body></html></richcontent>
    </node>
    <node TEXT="Kế toán không có chứng từ kiểm kê hợp lệ để ghi nhận thừa/thiếu"/>
    <node TEXT="Không quy được trách nhiệm ai sửa, sửa vì lý do gì"/>
    <node TEXT="Người dùng đã trực tiếp phản ánh phần mềm chưa có chức năng này"/>
    <node TEXT="Chưa có số liệu số mã hàng và thời gian mỗi đợt kiểm">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Đưa vào câu hỏi mở số 5</p></body></html></richcontent>
    </node>
  </node>

  <node TEXT="5. Mong muốn" COLOR="#2f7ed8" FOLDED="true">
    <node TEXT="Có phiếu kiểm kê kho riêng"/>
    <node TEXT="Chọn kho, chọn một hoặc nhiều sản phẩm, sản phẩm theo lô thì chọn tới từng lô"/>
    <node TEXT="Hệ thống tự lấy số tồn sổ sách tại thời điểm kiểm"/>
    <node TEXT="Thủ kho nhập số đếm thực tế, hệ thống tự tính chênh lệch thừa/thiếu"/>
    <node TEXT="Hoàn thành phiếu thì cân bằng tồn theo số thực tế và sinh chứng từ điều chỉnh"/>
    <node TEXT="Lưu phiếu làm bằng chứng ai kiểm và kiểm khi nào"/>
  </node>
</node>

<node TEXT="Yêu cầu nghiệp vụ" POSITION="left" COLOR="#159c74">
<font NAME="Segoe UI" SIZE="14" BOLD="true"/>
<edge COLOR="#159c74" WIDTH="2"/>

  <node TEXT="Khả năng thu thập" COLOR="#159c74" FOLDED="true">
    <node TEXT="Lập phiếu kiểm kê cho một kho, chọn một hoặc nhiều sản phẩm"/>
    <node TEXT="Sản phẩm có theo dõi lô thì chọn tới từng lô cần đếm"/>
    <node TEXT="Hệ thống tự nạp số tồn sổ sách từng dòng tại thời điểm lập phiếu"/>
  </node>

  <node TEXT="Khả năng xử lý" COLOR="#159c74" FOLDED="true">
    <node TEXT="Nhận số đếm thực tế người dùng nhập cho từng dòng"/>
    <node TEXT="Tự tính chênh lệch thừa/thiếu theo từng mã và từng lô"/>
    <node TEXT="Tổng hợp số dòng lệch của cả phiếu"/>
  </node>

  <node TEXT="Khả năng kiểm soát" COLOR="#159c74" FOLDED="true">
    <node TEXT="Cho kiểm tra và sửa lại số thực tế trước khi hoàn thành phiếu"/>
    <node TEXT="Khi hoàn thành thì cân bằng tồn kho theo số thực tế"/>
    <node TEXT="Tự sinh chứng từ điều chỉnh nhập/xuất đúng phần chênh lệch"/>
  </node>

  <node TEXT="Khả năng lưu trữ và tra cứu" COLOR="#159c74" FOLDED="true">
    <node TEXT="Lưu người kiểm, kho, thời điểm kiểm"/>
    <node TEXT="Lưu số sổ sách, số thực tế, chênh lệch của từng dòng"/>
    <node TEXT="Tra cứu lại được để kế toán đối soát"/>
  </node>

  <node TEXT="[MỤC TIÊU] Mọi điều chỉnh tồn từ kiểm kê đều có phiếu kiểm kê làm căn cứ và chứng từ điều chỉnh đi kèm" COLOR="#0f7a5a">
    <font NAME="Segoe UI" SIZE="12" BOLD="true"/>
    <richcontent TYPE="NOTE"><html><head></head><body><p>Đủ căn cứ cho kế toán ghi nhận thừa/thiếu và quy trách nhiệm người thực hiện</p></body></html></richcontent>
  </node>
</node>

<node TEXT="Giải pháp nghiệp vụ" POSITION="left" COLOR="#cc7a15">
<font NAME="Segoe UI" SIZE="14" BOLD="true"/>
<edge COLOR="#cc7a15" WIDTH="2"/>
<richcontent TYPE="NOTE"><html><head></head><body><p>Tính năng &quot;Kiểm kê kho&quot; — phân hệ chứng từ riêng trong nhóm nghiệp vụ kho</p></body></html></richcontent>

  <node TEXT="Giao diện (UI)" COLOR="#cc7a15" FOLDED="true">
    <node TEXT="Menu Kho thêm mục Kiểm kê kho, đặt dưới mục Giao dịch"/>
    <node TEXT="Màn danh sách phiếu kiểm kê">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Lọc theo kho, thời gian, người kiểm</p></body></html></richcontent>
    </node>
    <node TEXT="Màn lập phiếu kiểm kê" FOLDED="true">
      <node TEXT="Đầu phiếu: kho, ngày kiểm, người kiểm, ghi chú"/>
      <node TEXT="Lưới dòng kiểm: Sản phẩm — Lô — Tồn sổ sách — Số thực tế — Chênh lệch"/>
    </node>
    <node TEXT="Màn xem chi tiết phiếu đã hoàn thành, chỉ đọc, phục vụ đối soát"/>
  </node>

  <node TEXT="Logic xử lý" COLOR="#cc7a15" FOLDED="true">
    <node TEXT="Tồn sổ sách do hệ thống tự nạp, người dùng không sửa được"/>
    <node TEXT="Chênh lệch tự tính bằng số thực tế trừ số sổ sách"/>
    <node TEXT="Dòng thừa sinh chứng từ nhập điều chỉnh, dòng thiếu sinh chứng từ xuất điều chỉnh">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Dùng lại cơ chế chứng từ điều chỉnh của chức năng sửa tồn hiện có</p></body></html></richcontent>
    </node>
    <node TEXT="Sản phẩm theo dõi lô thì cân bằng tới từng lô"/>
    <node TEXT="Phiếu kiểm kê không cần bước duyệt"/>
    <node TEXT="Phiếu đã hoàn thành bị khóa, muốn chỉnh phải lập phiếu mới"/>
  </node>

  <node TEXT="Quy trình mới (Process)" COLOR="#cc7a15" FOLDED="true">
    <node TEXT="1. Vào Kiểm kê kho"/>
    <node TEXT="2. Thêm phiếu"/>
    <node TEXT="3. Chọn kho"/>
    <node TEXT="4. Chọn sản phẩm và lô cần đếm"/>
    <node TEXT="5. Hệ thống nạp tồn sổ sách"/>
    <node TEXT="6. Nhập số đếm thực tế"/>
    <node TEXT="7. Lưu nháp nếu đếm dở"/>
    <node TEXT="8. Hoàn thành phiếu, hệ thống cân bằng tồn và sinh chứng từ điều chỉnh"/>
  </node>

  <node TEXT="Phương án khi vẫn bán hàng lúc đang đếm" COLOR="#cc7a15" FOLDED="true">
    <node TEXT="[ĐÃ CHỐT] A — Ghi đè tồn theo số đếm thực tế" COLOR="#b35c00">
      <font NAME="Segoe UI" SIZE="12" BOLD="true"/>
      <richcontent TYPE="NOTE"><html><head></head><body><p>Ưu: tồn sau kiểm đúng bằng số đã đếm, dễ hiểu với thủ kho.</p><p>Nhược: nuốt mất giao dịch bán phát sinh trong lúc đếm.</p><p>Khắc phục: cảnh báo khi tồn sổ sách đã đổi kể từ lúc lập phiếu, yêu cầu nạp lại trước khi hoàn thành.</p></body></html></richcontent>
    </node>
    <node TEXT="B — Áp mức chênh lệch lên tồn hiện tại">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Ưu: không nuốt giao dịch giữa chừng. Nhược: tồn sau kiểm có thể khác số đã đếm.</p></body></html></richcontent>
    </node>
    <node TEXT="C — Khóa giao dịch trong lúc kiểm">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Ưu: số liệu sạch tuyệt đối. Nhược: cửa hàng phải ngừng bán.</p></body></html></richcontent>
    </node>
  </node>

  <node TEXT="Phạm vi ảnh hưởng" COLOR="#cc7a15" FOLDED="true">
    <node TEXT="Dùng lại cơ chế chứng từ điều chỉnh sẵn có">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Cần chốt có tách riêng loại chứng từ &quot;kiểm kê&quot; để phân biệt nguồn gốc không</p></body></html></richcontent>
    </node>
    <node TEXT="Báo cáo xuất nhập tồn và báo cáo lợi nhuận">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Kiểm tra cách hiển thị và cách tính giá vốn phần thừa/thiếu</p></body></html></richcontent>
    </node>
    <node TEXT="Nghiệp vụ tồn theo lô — cân bằng phải áp xuống từng lô"/>
    <node TEXT="Bổ sung quyền sử dụng chức năng kiểm kê cho vai trò thủ kho"/>
    <node TEXT="Xác định có làm trên app mobile không">
      <richcontent TYPE="NOTE"><html><head></head><body><p>Thủ kho thường cầm điện thoại đi đếm tại kho</p></body></html></richcontent>
    </node>
  </node>
</node>

<node TEXT="Câu hỏi mở" POSITION="right" COLOR="#d1477a">
<font NAME="Segoe UI" SIZE="14" BOLD="true"/>
<edge COLOR="#d1477a" WIDTH="2"/>
<richcontent TYPE="NOTE"><html><head></head><body><p>7 câu mang sang họp chốt phạm vi — Giai đoạn 2</p></body></html></richcontent>

  <node TEXT="1. Có tách riêng loại chứng từ điều chỉnh do kiểm kê, khác với sửa tồn thủ công?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: nội bộ / kế toán</p></body></html></richcontent>
  </node>
  <node TEXT="2. Dòng bỏ trống số thực tế là chưa đếm hay là tồn bằng 0?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: khách hàng</p></body></html></richcontent>
  </node>
  <node TEXT="3. Giá vốn phần hàng thừa/thiếu ghi nhận thế nào?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: kế toán / khách hàng</p></body></html></richcontent>
  </node>
  <node TEXT="4. Có làm chức năng kiểm kê trên app mobile không?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: nội bộ / sale</p></body></html></richcontent>
  </node>
  <node TEXT="5. Mỗi đợt kiểm khoảng bao nhiêu mã hàng, hiện mất bao lâu?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: khách hàng / sale</p></body></html></richcontent>
  </node>
  <node TEXT="6. Phiếu đã hoàn thành có cho hủy hoặc đảo lại không?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: khách hàng</p></body></html></richcontent>
  </node>
  <node TEXT="7. Có cần chọn nhanh theo nhóm sản phẩm hoặc lấy toàn bộ kho không?">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Người trả lời: khách hàng</p></body></html></richcontent>
  </node>
</node>

<node TEXT="Ghi chú cho Giai đoạn 5" POSITION="right" COLOR="#7a5ad1">
<font NAME="Segoe UI" SIZE="14" BOLD="true"/>
<edge COLOR="#7a5ad1" WIDTH="2"/>

  <node TEXT="Kiểm kê dùng lại cơ chế chứng từ điều chỉnh của chức năng sửa tồn">
    <richcontent TYPE="NOTE"><html><head></head><body><p>Tham chiếu docs/sua-ton-lo-san-pham/srs/spec.md</p></body></html></richcontent>
  </node>
  <node TEXT="Sản phẩm bật theo dõi lô: tồn mỗi kho bằng tổng tồn các lô, cân bằng phải áp xuống từng lô"/>
  <node TEXT="Phương án A cần lưu song song tồn sổ sách lúc lập phiếu và lúc hoàn thành để cảnh báo"/>
  <node TEXT="Loại hình cửa hàng xăng dầu nằm ngoài phạm vi chức năng này"/>
</node>

</node>
</map>
