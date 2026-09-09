# EasyPOS — UI Kit · Bán hàng (Sell / POS)

A high-fidelity, interactive recreation of the EasyPOS **Bán hàng** (point-of-sale) screen — the core surface of the product. Built to match the real product render in `../../reference/banhang-screen.png`.

Open **`index.html`** to use it.

## What it does (click-through prototype)
- **Add products** — click any card in the right-hand product grid to add it to the order; clicking again increments quantity. Gift ("Quà tặng") and Topping items auto-nest under their parent line.
- **Quantity steppers** — the blue −/+ controls on each cart line.
- **Remove** — trash icon on each line.
- **Running total** — the bottom total card and item count update live.
- **Tabs** — Sản phẩm / Combo / Dịch vụ (Combo & Dịch vụ show empty states).
- **Category chips & search** — filter the product list.
- **Delivery mode** — Mang về / Tại chỗ / Ship segmented control.
- **Thanh toán (F9)** — opens the payment modal: pick a method, enter cash tendered (with quick-amount chips), see change due, **Hoàn thành** completes the sale (success toast + clears the order).
- **Lưu đơn (F8)** — saves the order (toast).

## Components
| File | Component | Notes |
|---|---|---|
| `TopBar.jsx` | `TopBar` | Blue product bar: brand, global search, invoice tabs, QR-order, sales mode, account. |
| `LeftRail.jsx` | `LeftRail` | 72px icon navigation rail with active state. |
| `OrderHeader.jsx` | `OrderHeader` | Customer chip, delivery-mode segmented control, price book, Thực đơn / Phòng bàn. |
| `CartTable.jsx` | `CartTable` (+ `CartLine`, `QtyStepper`) | Order line-item table with gift/topping rows and empty state. |
| `ProductPicker.jsx` | `ProductPicker` (+ `ProductCard`) | Tabs, search, barcode toggle, category chips, 2-col product grid, pager. |
| `BottomBar.jsx` | `BottomBar` | Total card, created date, note field, Save / Pay actions with keycaps. |
| `PaymentModal.jsx` | `PaymentModal` | Checkout modal: methods, cash tendered, change, confirm. |
| `App.jsx` | `App` | Wires everything; owns cart state + toast. |
| `data.js` | — | Demo products, categories, `epFormat` (vi-VN number formatting). |

## Conventions
- All tokens come from `../../colors_and_type.css` (do not hard-code colors/type).
- Icons via **Lucide** CDN (substitute for the product's Iconsax — see root README → ICONOGRAPHY), rendered through the self-contained `<Icon n="name" size={20} cls="..."/>` component in `Icon.jsx`. **Never** call the global `lucide.createIcons()` — it mutates React-owned nodes and crashes the app on re-render.
- Each `.jsx` exports its component to `window` (separate Babel scopes don't share scope).
- The app is a fixed **1920×1080** canvas scaled to fit the viewport (letterboxed on dark).

## Caveats
- Product thumbnail (`../../assets/product-thumb.png`) is a single sample image reused for all products (cropped from the real product render). Swap in real catalog images for production.
- Logo mark is the reconstructed `../../assets/easypos-mark.svg` — replace with the official SVG when available.
- This is a cosmetic recreation: data is mocked, no persistence, no real printing/tax flow.
