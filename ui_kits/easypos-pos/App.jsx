// App — wires the EasyPOS Bán hàng screen together
function App() {
  const { useState, useEffect, useRef } = React;
  const [items, setItems] = useState([]);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState(null);
  const uid = useRef(1);

  const addProduct = (p) => {
    setItems((prev) => {
      const ex = prev.find((x) => x.id === p.id);
      if (ex) return prev.map((x) => (x.uid === ex.uid ? { ...x, qty: x.qty + 1 } : x));
      const addons =
        p.promo === "Quà tặng"
          ? [{ type: "gift", name: "Khăn quàng cổ nữ OWL", qty: 1 }]
          : p.id === 1
          ? [
              { type: "gift", name: "Khăn quàng cổ nữ OWL", qty: 1 },
              { type: "top", name: "Khăn quàng cổ nữ OWL", qty: 1 },
            ]
          : null;
      return [...prev, { ...p, uid: uid.current++, qty: 1, addons }];
    });
  };
  const setQty = (u, q) => setItems((prev) => prev.map((x) => (x.uid === u ? { ...x, qty: q } : x)));
  const remove = (u) => setItems((prev) => prev.filter((x) => x.uid !== u));

  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };
  const doSave = () => {
    if (!items.length) return showToast({ t: "warn", m: "Đơn hàng đang trống" });
    showToast({ t: "ok", m: "Đã lưu đơn vào danh sách đơn lưu" });
  };
  const doPay = () => {
    if (!items.length) return showToast({ t: "warn", m: "Đơn hàng đang trống" });
    setPaying(true);
  };
  const finishPay = () => {
    setPaying(false);
    setItems([]);
    showToast({ t: "ok", m: "Thanh toán thành công · Đã in hóa đơn" });
  };

  // (Icons render via the self-contained <Icon> component — no global createIcons)

  return (
    <div className="ep-app">
      <TopBar />
      <div className="ep-body">
        <LeftRail />
        <main className="ep-main">
          <OrderHeader />
          <div className="ep-work">
            <div className="ep-cart-col">
              <CartTable items={items} onQty={setQty} onRemove={remove} />
            </div>
            <ProductPicker onAdd={addProduct} />
          </div>
          <BottomBar count={count} total={total} onPay={doPay} onSave={doSave} />
        </main>
      </div>

      {paying && <PaymentModal total={total} onClose={() => setPaying(false)} onDone={finishPay} />}

      {toast && (
        <div className={"ep-toast " + toast.t}>
          <Icon n={toast.t === "ok" ? "check-circle-2" : "alert-triangle"} size={22} />
          {toast.m}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
