// CartTable — line items with steppers, gifts/toppings
function QtyStepper({ qty, onChange }) {
  return (
    <div className="ep-step">
      <button className="ep-step-btn" onClick={() => onChange(Math.max(1, qty - 1))}>
        <Icon n="minus" size={14} />
      </button>
      <span className="ep-step-qty">{qty}</span>
      <button className="ep-step-btn" onClick={() => onChange(qty + 1)}>
        <Icon n="plus" size={14} />
      </button>
    </div>
  );
}

function CartLine({ item, onQty, onRemove }) {
  const line = item.price * item.qty;
  return (
    <React.Fragment>
      <div className="ep-cart-row">
        <div className="ep-cart-thumb">
          <img src="../../assets/product-thumb.png" alt="" />
        </div>
        <div className="ep-cart-info">
          <div className="ep-cart-name">
            {item.name} <Icon n="copy" cls="ep-copy" size={15} />
          </div>
          <div className="ep-cart-attr">{item.unit} · Kho mặc định · Demopro</div>
          <div className="ep-cart-attr2">
            {item.warranty && <span className="ep-chip-line"><Icon n="shield-check" size={14} />{item.warranty}</span>}
            <span className="ep-lot">LO2:05/05/2025</span>
            <span className="ep-lot-x"><Icon n="x" size={14} /></span>
            <a className="ep-link">Chọn lô</a>
          </div>
          <a className="ep-note-link"><Icon n="paperclip" size={13} />Ghi chú</a>
        </div>
        <div className="ep-cart-sl"><QtyStepper qty={item.qty} onChange={(q) => onQty(item.uid, q)} /></div>
        <div className="ep-cart-num ep-price">{window.epFormat(item.price)}</div>
        <div className="ep-cart-num">0</div>
        <div className="ep-cart-num">0</div>
        <div className="ep-cart-num ep-total-cell">{window.epFormat(line)}</div>
        <button className="ep-cart-del" onClick={() => onRemove(item.uid)}><Icon n="trash-2" size={18} /></button>
      </div>
      {item.addons && item.addons.map((a, i) => (
        <div className="ep-addon" key={i}>
          <Icon n="gift" cls="ep-addon-ico" size={18} />
          <span className={"ep-addon-tag " + (a.type === "gift" ? "gift" : "top")}>
            {a.type === "gift" ? "Quà tặng" : "Topping"}
          </span>
          <span className="ep-addon-name">{a.name}</span>
          <span className="ep-addon-qty">{a.qty}</span>
        </div>
      ))}
    </React.Fragment>
  );
}

function CartTable({ items, onQty, onRemove }) {
  if (!items.length) {
    return (
      <div className="ep-cart-empty">
        <Icon n="shopping-cart" size={54} />
        <p>Chưa có hàng hóa trong đơn</p>
        <span>Chọn sản phẩm ở danh sách bên phải để thêm vào đơn</span>
      </div>
    );
  }
  return (
    <div className="ep-cart">
      <div className="ep-cart-head">
        <div>Tên sản phẩm</div>
        <div className="c">SL</div>
        <div className="r">Đơn giá</div>
        <div className="r">Giảm giá</div>
        <div className="r">Thuế</div>
        <div className="r">Thành tiền</div>
        <div></div>
      </div>
      <div className="ep-cart-body">
        {items.map((it) => (
          <CartLine key={it.uid} item={it} onQty={onQty} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}
window.CartTable = CartTable;
