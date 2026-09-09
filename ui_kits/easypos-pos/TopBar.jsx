// TopBar — fixed blue product bar
function TopBar() {
  const { useState } = React;
  const [tabs] = useState(["HĐ 001"]);
  return (
    <header className="ep-topbar">
      <div className="ep-brand">
        <span className="ep-mark" dangerouslySetInnerHTML={{ __html: window.EP_MARK_SVG || "" }} />
        <span className="ep-word">EasyPOS</span>
      </div>

      <div className="ep-search-top">
        <Icon n="search" />
        <input placeholder="Tìm kiếm hàng hóa" />
      </div>

      <div className="ep-inv-tabs">
        {tabs.map((t) => (
          <button key={t} className="ep-inv-tab active">
            <Icon n="receipt-text" />{t}
          </button>
        ))}
        <button className="ep-inv-add"><Icon n="plus" /></button>
      </div>

      <button className="ep-qr">
        <Icon n="qr-code" />QR order
        <span className="ep-qr-count">3</span>
      </button>

      <div className="ep-spacer"></div>

      <button className="ep-mode">
        <Icon n="shopping-cart" />
        <b>Bán thường</b>
        <Icon n="chevron-down" />
      </button>

      <div className="ep-account">
        <img src="https://i.pravatar.cc/64?img=47" alt="" />
        <span>Công ty Cổ phần SDS</span>
      </div>
      <button className="ep-burger"><Icon n="menu" /></button>
    </header>
  );
}
window.TopBar = TopBar;
