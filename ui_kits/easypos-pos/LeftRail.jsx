// LeftRail — slim icon navigation
function LeftRail() {
  const { useState } = React;
  const items = [
    { icon: "layout-grid", label: "Bán hàng" },
    { icon: "shopping-cart", label: "Đơn hàng" },
    { icon: "package", label: "Sản phẩm" },
    { icon: "bookmark", label: "Đơn lưu" },
    { icon: "ticket-percent", label: "Khuyến mãi" },
    { icon: "users", label: "Khách hàng" },
    { icon: "layers", label: "Kho" },
    { icon: "arrow-left-right", label: "Giao dịch" },
    { icon: "bar-chart-3", label: "Báo cáo" },
    { icon: "credit-card", label: "Sổ quỹ" },
    { icon: "home", label: "Trang chủ" },
    { icon: "settings", label: "Cài đặt" },
  ];
  const [active, setActive] = useState(0);
  return (
    <nav className="ep-rail">
      {items.map((it, i) => (
        <button
          key={i}
          className={"ep-rail-item" + (i === active ? " active" : "")}
          title={it.label}
          onClick={() => setActive(i)}
        >
          <Icon n={it.icon} size={24} />
        </button>
      ))}
    </nav>
  );
}
window.LeftRail = LeftRail;
