// OrderHeader — customer chip, delivery mode, price book, menu/rooms
function OrderHeader() {
  const { useState } = React;
  const [mode, setMode] = useState("Mang về");
  const modes = [
    { k: "Mang về", icon: "shopping-bag" },
    { k: "Tại chỗ", icon: "utensils" },
    { k: "Ship", icon: "truck" },
  ];
  return (
    <div className="ep-orderhead">
      <div className="ep-customer">
        <img src="https://i.pravatar.cc/64?img=32" alt="" />
        <div>
          <div className="ep-cust-name">Khách lẻ</div>
          <div className="ep-cust-meta">
            <span><Icon n="star" size={14} />1.000 điểm</span>
            <span><Icon n="wallet" size={14} />Ví: 125.000đ</span>
          </div>
        </div>
      </div>

      <div className="ep-seg">
        {modes.map((m) => (
          <button
            key={m.k}
            className={"ep-seg-btn" + (mode === m.k ? " active" : "")}
            onClick={() => setMode(m.k)}
          >
            <Icon n={m.icon} size={18} />{m.k}
          </button>
        ))}
      </div>

      <button className="ep-pricebook">
        <Icon n="map-pin" size={18} />Bảng giá chung<Icon n="chevron-down" size={18} />
      </button>

      <div className="ep-spacer"></div>

      <button className="ep-head-btn primary"><Icon n="list" size={18} />Thực đơn</button>
      <button className="ep-head-btn"><Icon n="grid-2x2" size={18} />Phòng bàn</button>
    </div>
  );
}
window.OrderHeader = OrderHeader;
