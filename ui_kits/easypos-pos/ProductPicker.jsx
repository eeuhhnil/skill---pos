// ProductPicker — tabs, search, category chips, product grid
function ProductCard({ p, onAdd }) {
  return (
    <button className="ep-pcard" onClick={() => onAdd(p)}>
      <div className="ep-pcard-thumb"><img src="../../assets/product-thumb.png" alt="" /></div>
      <div className="ep-pcard-body">
        <div className="ep-pcard-name">{p.name} <span className="ep-pcard-unit">- {p.unit}</span></div>
        <div className="ep-pcard-meta">
          <span className="ep-stock"><i className="ep-stock-dot"></i>{p.stock}</span>
          {p.promo && <span className="ep-pcard-promo">{p.promo}</span>}
        </div>
        <div className="ep-pcard-price">
          {p.oldPrice && <span className="ep-old">{window.epFormat(p.oldPrice)}</span>}
          <b>{window.epFormat(p.price)}đ</b>
        </div>
      </div>
    </button>
  );
}

function ProductPicker({ onAdd }) {
  const { useState } = React;
  const [tab, setTab] = useState("Sản phẩm");
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const tabs = ["Sản phẩm", "Combo", "Dịch vụ"];

  let list = window.EP_PRODUCTS;
  if (q.trim()) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="ep-picker">
      <div className="ep-picker-tabs">
        {tabs.map((t) => (
          <button key={t} className={"ep-ptab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
        ))}
        <button className="ep-picker-list"><Icon n="menu" size={18} /></button>
      </div>

      <div className="ep-picker-search">
        <div className="ep-search-field">
          <Icon n="search" />
          <input placeholder="Tìm kiếm hàng hóa" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label className="ep-barcode">Tìm kiếm barcode
          <span className="ep-tg on"></span>
        </label>
        <button className="ep-filter"><Icon n="sliders-horizontal" /></button>
      </div>

      <div className="ep-cats">
        {window.EP_CATEGORIES.map((c) => (
          <button key={c} className={"ep-cat" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>
            {c} <span className="ep-cat-n">(125)</span>
          </button>
        ))}
      </div>

      {tab === "Sản phẩm" ? (
        <div className="ep-grid">
          {list.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
        </div>
      ) : (
        <div className="ep-picker-empty">
          <Icon n={tab === "Combo" ? "package-2" : "concierge-bell"} size={48} />
          <p>Chưa có {tab.toLowerCase()} nào</p>
        </div>
      )}

      <div className="ep-pager">
        <span>1-{list.length} <em>of 100</em></span>
        <button className="ep-pg"><Icon n="chevron-left" size={16} /></button>
        <button className="ep-pg active"><Icon n="chevron-right" size={16} /></button>
      </div>
    </section>
  );
}
window.ProductPicker = ProductPicker;
