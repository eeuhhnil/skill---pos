// PaymentModal — click-thru checkout
function PaymentModal({ total, onClose, onDone }) {
  const { useState } = React;
  const [tendered, setTendered] = useState(total);
  const [method, setMethod] = useState("cash");
  const quick = [total, 200000, 500000, 1000000];
  const change = Math.max(0, tendered - total);

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ep-modal-head">
          <h3>Thanh toán</h3>
          <button onClick={onClose}><Icon n="x" size={18} /></button>
        </div>

        <div className="ep-pay-amount">
          <span>Khách cần trả</span>
          <b>{window.epFormat(total)}đ</b>
        </div>

        <div className="ep-pay-methods">
          {[
            { k: "cash", label: "Tiền mặt", icon: "banknote" },
            { k: "card", label: "Thẻ", icon: "credit-card" },
            { k: "qr", label: "Chuyển khoản", icon: "qr-code" },
          ].map((m) => (
            <button key={m.k} className={"ep-pay-method" + (method === m.k ? " active" : "")} onClick={() => setMethod(m.k)}>
              <Icon n={m.icon} size={24} />{m.label}
            </button>
          ))}
        </div>

        <label className="ep-pay-field-label">Tiền khách đưa</label>
        <div className="ep-pay-input">
          <input
            type="text"
            value={window.epFormat(tendered)}
            onChange={(e) => setTendered(Number(e.target.value.replace(/\D/g, "")) || 0)}
          />
          <span>đ</span>
        </div>
        <div className="ep-pay-quick">
          {quick.map((v, i) => (
            <button key={i} onClick={() => setTendered(v)}>{window.epFormat(v)}</button>
          ))}
        </div>

        <div className="ep-pay-change">
          <span>Tiền thừa trả khách</span>
          <b>{window.epFormat(change)}đ</b>
        </div>

        <button className="ep-pay-confirm" onClick={onDone}>
          <Icon n="check-circle-2" size={22} />Hoàn thành
        </button>
      </div>
    </div>
  );
}
window.PaymentModal = PaymentModal;
