// BottomBar — total + Save/Pay
function BottomBar({ count, total, onPay, onSave }) {
  return (
    <div className="ep-bottom">
      <div className="ep-bottom-left">
        <div className="ep-total-card">
          <span className="ep-total-label">Tổng tiền hàng ({count})</span>
          <span className="ep-total-right">
            <span className="ep-total-amt">{window.epFormat(total)}đ</span>
            <Icon n="circle-chevron-right" size={22} />
          </span>
        </div>
        <div className="ep-bottom-meta">
          <span className="ep-created"><Icon n="calendar" size={18} />Ngày tạo: <b>16/09/2024</b></span>
          <div className="ep-note-field"><Icon n="paperclip" size={18} /><input placeholder="Ghi chú" /></div>
        </div>
      </div>
      <div className="ep-bottom-actions">
        <button className="ep-act save" onClick={onSave}>Lưu đơn <span className="ep-key">F8</span></button>
        <button className="ep-act pay" onClick={onPay}>Thanh toán <span className="ep-key">F9</span></button>
      </div>
    </div>
  );
}
window.BottomBar = BottomBar;
