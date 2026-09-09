---
name: easypos-design
description: >
  Generate UI screens, components and prototypes that are pixel-accurate to the
  EasyPOS design system — a Vietnamese all-in-one POS / e-invoice / tax platform
  by SoftDreams. Fully self-contained: every token, measurement, component spec
  and copy rule is inlined below. No external files to read.
---

# EasyPOS Design System — Single-File Skill

> **Self-contained.** Everything you need is in this document: design tokens,
> exact measurements, component CSS, reference React code, icon names, Vietnamese
> microcopy rules and demo data. Do **not** look for `colors_and_type.css`,
> `README.md`, `preview/` or `ui_kits/` — their contents are already inlined here.

You are an expert EasyPOS product designer. When asked for a screen, component or
flow, produce output that looks like it was cut straight out of the shipping
product: flat, calm, dense, blue, Vietnamese.

---

## 0 · How to use this in Figma Make

1. **Tokens first.** Paste the whole `:root { … }` block from §3 into `globals.css`
   (or a `<style>` tag). Never hard-code a hex that has a token.
2. **Fonts.** Add the Google Fonts link from §3.1. Be Vietnam Pro + Noto Sans +
   Inter, all with full Vietnamese diacritics.
3. **Icons.** `import { ShoppingCart, Search, … } from 'lucide-react'`.
   Icon names listed in §8. Never emoji, never Unicode glyphs as icons.
4. **Canvas.** Desktop POS = fixed **1920×1080**, `overflow: hidden`, no outer
   scrollbar. Only the cart body and the product grid scroll internally.
5. **Component CSS.** §5 gives production-grade CSS for every part of the shell —
   copy it verbatim, it already matches the real product's measurements.
   If you prefer Tailwind, use the mapping in §4 but keep the pixel values.
6. **Images.** Product thumbnails = a `56px`/`62px` rounded-8 box filled with
   `var(--surface-subtle)`. Use a real photo only if the user supplies one;
   otherwise a neutral placeholder box or a Lucide `Image` glyph in `--gray-200`.

**Clarify at most 3 questions** if the request is ambiguous:
which screen/component, prototype vs production code, what content (product
names, amounts, customer names). Then act — never ask the user to make design
decisions; the system below already decides them.

---

## 1 · Product context

**EasyPOS** is an all-in-one **point-of-sale + e-invoice + tax-declaration**
platform for Vietnamese businesses and household merchants ("hộ kinh doanh").
Selling, issuing legal invoices and filing tax all happen in one piece of
software — synced data, light operation, fewer errors, lower setup cost.

Made by **SoftDreams** ("Make IT Simple"). Hotline **1900 3369**.

One-liner (VN): *"Giải pháp bán hàng – xuất hóa đơn – kê khai thuế toàn diện cho
doanh nghiệp và hộ kinh doanh."*

**Core surface — the Bán hàng (Sell) screen:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP BAR 70px  blue #0074BD                                           │
│ [mark EasyPOS] [search 360px] [HĐ 001][+] [QR order ③] ····· [Bán    │
│ thường ▾] [avatar Công ty Cổ phần SDS] [☰]                           │
├────┬─────────────────────────────────────────────────────────────────┤
│RAIL│ ORDER HEADER                                                     │
│72px│ (Khách lẻ · 1.000 điểm · Ví 125.000đ) [Mang về|Tại chỗ|Ship]     │
│ 12 │ [Bảng giá chung ▾] ····· [Thực đơn] [Phòng bàn]                  │
│icon├──────────────────────────────┬──────────────────────────────────┤
│nav │ CART CARD (flex 1.55, r16)   │ PRODUCT PICKER (flex 1, r16)     │
│    │  Tên SP | SL | Đơn giá |     │  Sản phẩm · Combo · Dịch vụ      │
│    │  Giảm giá | Thuế | Thành tiền│  [search][barcode ⬤][filter]     │
│    │  ↳ Quà tặng / Topping rows   │  chips · 2-col product grid      │
│    ├──────────────────────────────┴──────────────────────────────────┤
│    │ BOTTOM BAR 160px                                                 │
│    │ Tổng tiền hàng (4)  5.000.000đ ›   │ [Lưu đơn F8][Thanh toán F9] │
│    │ Ngày tạo 16/09/2024 · [Ghi chú]    │                             │
└────┴──────────────────────────────────────────────────────────────────┘
```

The same shell is reused across industry variants: **Bán hàng** (retail),
**F&B** (restaurant), **Khách sạn** (hotel), plus **Sản phẩm**,
**Danh sách khách hàng**, **Thông báo**.

---

## 2 · Non-negotiable design rules

| Rule | Detail |
|---|---|
| **One brand blue** | `#0074BD` carries identity **and** every primary action: top bar, primary buttons, links, active states, totals, steppers. |
| **Flat only** | No gradients, no textures, no photographic backdrops in chrome, no glow/colored shadows. |
| **Cool navy neutrals** | Text `#151B33`, page `#F4F6F8`, cards pure white `#FFFFFF`. |
| **Soft, not pill** | inputs/chips 6px · buttons/rail items 8px · popovers 12px · main cards **16px** · keycaps 4px · counters 999px. |
| **Hairlines** | borders `#E6E6E6`, table dividers `#DEE0E2`, faint `#EEEEEE`. Cards lean on shadow + white fill more than borders. |
| **Subtle elevation** | sm `0 1 2 /8%` chips·hover · md `0 4 12 /15%` cards·popovers · lg `0 12 32 /16%` modals. |
| **4px spacing grid** | 4 · 8 · 12 · 16 · 24 · 32 · 40 · 64. Gutters between cards 16px. |
| **Motion** | 120–200ms ease, functional. No bounce, no large scale change. `:active` = `translateY(1px)` or `scale(.99)`. |
| **Transparency** | Only translucent modal scrim `rgba(10,18,35,.45)` and white @22% keycaps on primary buttons. No frosted glass. |
| **Vietnamese sentence case** | `Tổng tiền hàng`, never Title Case. ALL-CAPS only for short notice headlines. |
| **No emoji** | Never in working UI. 3D spot illustrations only on full-page notices / empty states. |

### States (apply consistently)

- **Hover** → one step darker fill (`--blue-600`), or tint fill for tertiary.
- **Active / pressed** → deeper blue, no big scale change.
- **Focus** → blue border + ring `0 0 0 3px var(--blue-100)`.
- **Disabled** → `--gray-50` fill, `--text-placeholder` text.
- **Active nav / tab** → blue text + `--blue-100` background (rail) or 3px blue
  underline (tabs).

---

## 3 · Design tokens — paste this whole block

> Source of truth: `EasyPos - Design system (1).fig`.
> **Primary-color caveat:** the Figma "Color Style — Primitives" page documents a
> TEAL primary + ORANGE secondary ramp, but every shipping screen uses **BLUE
> `#0074BD`**. Blue is the working primary; teal survives only as `--ref-teal-*`.

### 3.1 Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
```

- **Noto Sans** — primary UI typeface (full Vietnamese support).
- **Be Vietnam Pro** — display / brand headings (Semibold 600, Extrabold 800).
- **Inter** — secondary body + button labels.
- **Numerals / money totals** — the product uses Apple **SF Pro Display Bold**,
  which is not web-distributable. Substitute the `-apple-system` UI stack
  (`--font-num`). Supply the licensed font if exact numeral rendering matters.

### 3.2 The token block

```css
:root {
  /* ================= PRIMARY — Brand Blue (the product action color) ======= */
  --blue-900: #00314F;   /* deepest — swatch caps, pressed */
  --blue-800: #004671;   /* dark headings on light, hover-dark */
  --blue-700: #005C96;
  --blue-600: #0068AA;
  --blue-500: #0074BD;   /* ★ PRIMARY — top bar, primary buttons */
  --blue-400: #3392CB;
  --blue-300: #66ADD9;
  --blue-200: #B0D4EB;   /* keycaps, subtle borders */
  --blue-100: #E6F1F8;   /* tint fill — active sidebar, secondary-btn bg */
  --blue-50:  #F0F7FB;   /* faint wash */
  --blue-accent: #0767FE;/* brighter blue on some outline-button icons */

  /* ================= SECONDARY — Orange (accents, "Topping" tags) ========== */
  --orange-800: #7D451E;
  --orange-700: #A15926;
  --orange-600: #CF7331;
  --orange-500: #E37E36;  /* ★ secondary main */
  --orange-400: #E9985E;
  --orange-300: #ECA978;
  --orange-200: #F2C4A3;
  --orange-100: #F6D7C1;
  --orange-50:  #FCF2EB;

  /* ================= NEUTRALS — navy-based grayscale ======================= */
  --ink:      #151B33;   /* ★ primary text — the most-used color */
  --gray-800: #08062A;
  --gray-700: #0B0737;
  --gray-600: #0E0946;
  --gray-500: #0F0A4D;
  --gray-400: #3F3B71;
  --gray-300: #5E5B88;
  --gray-200: #918EAD;
  --gray-100: #B5B3C8;
  --gray-50:  #E7E7ED;

  /* Functional neutrals seen across product chrome */
  --text-primary:     #151B33;
  --text-secondary:   #455064;  /* labels, captions */
  --text-tertiary:    #545454;  /* muted body */
  --text-placeholder: #B0B0B0;  /* input placeholders */
  --text-on-primary:  #FFFFFF;

  --surface:        #FFFFFF;  /* cards, panels */
  --surface-page:   #F4F6F8;  /* app background */
  --surface-subtle: #F7F7F7;  /* zebra rows, chips */
  --border:         #E6E6E6;  /* default 1px borders */
  --border-strong:  #DEE0E2;  /* table / divider strokes */
  --border-faint:   #EEEEEE;

  /* ================= SEMANTIC ============================================= */
  --success-700: #1E7D45;
  --success-500: #2BA45C;   /* "Quà tặng", in-stock, confirm */
  --success-100: #C8F2D7;
  --success-50:  #E0FFEB;

  --warning-700: #B7791F;
  --warning-500: #F0A92A;
  --warning-100: #FDEFC8;
  --warning-50:  #FFFAE7;

  --error-700: #BE211C;
  --error-500: #EB5146;     /* destructive, errors */
  --error-300: #FDA59B;
  --error-100: #FED9D5;
  --error-50:  #FEF3F2;

  --info-500: #0074BD;      /* info == brand blue */
  --info-50:  #E6F1F8;

  /* Documented-but-unused primitive (reference only) */
  --ref-teal-500: #449297;
  --ref-teal-900: #00314F;

  /* ================= TYPOGRAPHY — families ================================ */
  --font-sans:    'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Be Vietnam Pro', 'Noto Sans', sans-serif;  /* headings / brand */
  --font-body:    'Inter', 'Noto Sans', sans-serif;           /* secondary body */
  --font-num:     -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;

  /* ================= TYPE SCALE (600 Semibold · 700 Bold) =================
     Heading line-height 150% (H1 120%) · body 150% · tracking ≈ 0          */
  --h1: 600 64px/1.2 var(--font-display);
  --h2: 600 48px/1.5 var(--font-display);
  --h3: 600 40px/1.5 var(--font-display);
  --h4: 600 36px/1.5 var(--font-display);
  --h5: 600 24px/1.5 var(--font-display);
  --h6: 600 20px/1.5 var(--font-display);

  --title-lg: 600 20px/1.4 var(--font-sans);  /* card / section titles */
  --title-md: 600 16px/1.4 var(--font-sans);
  --title-sm: 600 14px/1.4 var(--font-sans);
  --title-xs: 600 12px/1.4 var(--font-sans);

  --body-xl: 400 20px/1.5 var(--font-sans);
  --body-lg: 400 16px/1.5 var(--font-sans);   /* default body */
  --body-md: 400 14px/1.5 var(--font-sans);
  --body-sm: 400 12px/1.5 var(--font-sans);

  --label:   500 14px/1.4 var(--font-sans);
  --caption: 400 12px/1.4 var(--font-sans);

  /* ================= RADII / SHADOW / SPACING ============================= */
  --radius-xs: 4px;    /* keycaps, mini chips */
  --radius-sm: 6px;    /* inputs, chips, bottom-bar buttons */
  --radius-md: 8px;    /* buttons, sidebar items, swatches */
  --radius-lg: 12px;   /* dropdowns, popovers */
  --radius-xl: 16px;   /* main content cards / panels */
  --radius-full: 999px;

  --shadow-sm: 0 1px 2px rgba(16,24,40,0.08);
  --shadow-md: 0 4px 12px rgba(16,24,40,0.15);   /* card / popover */
  --shadow-lg: 0 12px 32px rgba(16,24,40,0.16);  /* modal */

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 40px; --space-8: 64px;
}

/* ---- Semantic helper classes ---- */
.ep-h1 { font: var(--h1); color: var(--text-primary); margin: 0; letter-spacing: -0.01em; }
.ep-h2 { font: var(--h2); color: var(--text-primary); margin: 0; }
.ep-h3 { font: var(--h3); color: var(--text-primary); margin: 0; }
.ep-h4 { font: var(--h4); color: var(--text-primary); margin: 0; }
.ep-h5 { font: var(--h5); color: var(--text-primary); margin: 0; }
.ep-h6 { font: var(--h6); color: var(--text-primary); margin: 0; }
.ep-title-lg { font: var(--title-lg); color: var(--text-primary); }
.ep-title-md { font: var(--title-md); color: var(--text-primary); }
.ep-body     { font: var(--body-lg);  color: var(--text-primary); }
.ep-body-sm  { font: var(--body-md);  color: var(--text-secondary); }
.ep-caption  { font: var(--caption);  color: var(--text-tertiary); }
.ep-num { font-family: var(--font-num); font-weight: 700; font-variant-numeric: tabular-nums; }
```

---

## 4 · Quick-reference cheat sheet (Tailwind-friendly)

If you write Tailwind instead of the CSS in §5, keep these exact values:

```
Primary action / top bar   #0074BD   blue-500
Hover on primary           #0068AA   blue-600
Tint fill / active nav     #E6F1F8   blue-100
Primary text               #151B33   ink
Secondary text             #455064
Placeholder                #B0B0B0
Page background            #F4F6F8
Card / panel               #FFFFFF
Default border             #E6E6E6
Divider                    #DEE0E2
Success                    #2BA45C
Warning                    #F0A92A
Error / destructive        #EB5146
Secondary accent (Topping) #E37E36
```

Tailwind v4 theme bridge:

```css
@theme {
  --color-ep-blue: #0074BD;
  --color-ep-blue-tint: #E6F1F8;
  --color-ep-ink: #151B33;
  --color-ep-muted: #455064;
  --color-ep-page: #F4F6F8;
  --color-ep-border: #E6E6E6;
  --font-ep-display: 'Be Vietnam Pro', sans-serif;
  --font-ep-sans: 'Noto Sans', sans-serif;
  --radius-ep-card: 16px;
}
```

### Buttons

| Hierarchy | Fill | Label | Border |
|---|---|---|---|
| Primary | `#0074BD` | white, **700** | — |
| Secondary | white | `#0074BD` | 1.2px `#0074BD` |
| Tertiary | `#E6F1F8` | `#0074BD` | — |
| Ghost | transparent | `#0074BD` | — |
| Destructive | `#EB5146` | white | — |
| Disabled | `#E7E7ED` | `#B0B0B0` | — |

Radius 8px (bottom-bar actions 6px). Sizes:

```
Large   16px / padding 8px 24px / line-height 24px
Medium  14px / padding 6px 16px / line-height 20px
Small   13px / padding 4px 12px / line-height 18px / radius 6px
```

Power-user actions carry a **keyboard-shortcut keycap** inside the button on the
right — `F8` (Lưu đơn), `F9` (Thanh toán). On primary: white @22% fill, white
text. On secondary: `--blue-200` fill, `--blue-700` text. Radius 4–5px,
padding 3px 9px, font 15–16px/700.

### Tags & badges

```
Quà tặng / Hoàn thành / Mua 2 tặng 1   bg #E0FFEB  text #1E7D45
Topping                                 bg #FCF2EB  text #A15926
Demopro / label                         bg #E6F1F8  text #005C96
Sắp hết                                 bg #FFFAE7  text #B7791F
Hủy / error                             bg #FEF3F2  text #BE211C
```
Font 12–13px / weight 600 / padding 2–3px 8–10px / radius 5–6px.

**Count badge** (QR order, notifications): `#EB5146` fill (orange `#E37E36` in
the top bar), white 12px/700, min-width 18px, height 18px, radius 999px.

**Status dots** — 7–8px circle: `Còn hàng` `#2BA45C` · `Sắp hết` `#F0A92A` ·
`Hết hàng` `#EB5146`.

### Form controls

```
Input     height 40px, border 1px #E6E6E6, radius 6px, padding 0 14px, font 16px
  focus   border #0074BD + shadow 0 0 0 3px #E6F1F8; leading icon turns blue
  error   border #EB5146 + AlertCircle icon in #EB5146
Checkbox  20×20, radius 5px, border 1.5px #DEE0E2; on → fill #0074BD, white Check 14px
Radio     20×20 circle, border 1.5px #DEE0E2; on → border #0074BD + 10px blue dot
Toggle    40×22 track radius 999px (#B5B3C8 off / #0074BD on),
          18px white knob, top 2px, left 2px → 20px, transition .2s
```

---

## 5 · Component CSS — copy verbatim

Base reset + the full POS shell. Class prefix `ep-`.

```css
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{font-family:var(--font-sans);background:var(--surface-page);color:var(--ink);-webkit-font-smoothing:antialiased}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input{font-family:inherit;outline:none;border:none;background:none}
a{cursor:pointer}
.ep-ic{display:inline-flex;align-items:center;justify-content:center;line-height:0;flex:none}
::-webkit-scrollbar{width:9px;height:9px}
::-webkit-scrollbar-thumb{background:#cfd6de;border-radius:6px}

/* ---- Stage: fixed 1920×1080 canvas, scaled to fit the viewport ---- */
#stage{position:fixed;inset:0;background:#0a1726;overflow:hidden}
#root{position:absolute;top:0;left:0;width:1920px;height:1080px;transform-origin:top left;background:var(--surface-page);overflow:hidden}
.ep-app{display:flex;flex-direction:column;height:1080px;width:1920px}

/* ===== Top bar — 70px, blue ===== */
.ep-topbar{height:70px;background:var(--blue-500);display:flex;align-items:center;gap:16px;padding:0 20px;color:#fff;flex:none}
.ep-brand{display:flex;align-items:center;gap:9px;color:#fff;padding-right:6px}
.ep-mark{width:30px;height:30px;display:inline-flex;color:#fff}
.ep-mark svg{width:100%;height:100%}
.ep-word{font-family:var(--font-display);font-weight:800;font-size:22px;letter-spacing:-.01em}
.ep-search-top{flex:0 0 360px;height:42px;background:#fff;border-radius:8px;display:flex;align-items:center;gap:9px;padding:0 14px;color:var(--text-secondary)}
.ep-search-top svg{width:20px;height:20px}
.ep-search-top input{flex:1;font-size:15px;color:var(--ink)}
.ep-inv-tabs{display:flex;align-items:center;gap:8px}
.ep-inv-tab{display:flex;align-items:center;gap:7px;height:40px;padding:0 16px;border-radius:8px;color:#fff;font-weight:600;font-size:15px;background:rgba(255,255,255,.16)}
.ep-inv-tab svg{width:18px;height:18px}
.ep-inv-add{width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.16);color:#fff;display:flex;align-items:center;justify-content:center}
.ep-inv-add svg{width:20px;height:20px}
.ep-qr{display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:8px;background:rgba(255,255,255,.16);color:#fff;font-weight:600;font-size:15px}
.ep-qr svg{width:20px;height:20px}
.ep-qr-count{background:var(--orange-500);color:#fff;font-size:13px;font-weight:700;border-radius:6px;min-width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0 6px}
.ep-spacer{flex:1}
.ep-mode{display:flex;align-items:center;gap:9px;height:46px;padding:0 16px;border-radius:9px;background:#fff;color:var(--blue-500);font-size:16px}
.ep-mode b{font-weight:700}
.ep-mode svg{width:20px;height:20px}
.ep-account{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px}
.ep-account img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.5)}
.ep-burger{width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.16);color:#fff;display:flex;align-items:center;justify-content:center}
.ep-burger svg{width:22px;height:22px}

/* ===== Body + left rail — 72px ===== */
.ep-body{flex:1;display:flex;min-height:0}
.ep-rail{width:72px;background:#fff;flex:none;display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:6px;border-right:1px solid var(--border)}
.ep-rail-item{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--gray-200)}
.ep-rail-item svg{width:24px;height:24px}
.ep-rail-item:hover{background:var(--blue-50);color:var(--blue-400)}
.ep-rail-item.active{background:var(--blue-100);color:var(--blue-500)}
.ep-main{flex:1;display:flex;flex-direction:column;min-width:0;padding:14px 16px 0}

/* ===== Order header ===== */
.ep-orderhead{display:flex;align-items:center;gap:16px;padding:0 4px 14px}
.ep-customer{display:flex;align-items:center;gap:11px}
.ep-customer img{width:42px;height:42px;border-radius:50%;object-fit:cover}
.ep-cust-name{font-weight:600;font-size:17px}
.ep-cust-meta{display:flex;gap:14px;margin-top:2px}
.ep-cust-meta span{display:flex;align-items:center;gap:4px;font-size:13px;color:var(--text-secondary)}
.ep-cust-meta svg{width:14px;height:14px;color:var(--warning-500)}
.ep-cust-meta span:last-child svg{color:var(--blue-400)}
.ep-seg{display:flex;background:var(--surface-subtle);border-radius:9px;padding:4px;gap:2px}
.ep-seg-btn{display:flex;align-items:center;gap:7px;height:38px;padding:0 16px;border-radius:7px;font-size:15px;font-weight:500;color:var(--text-secondary)}
.ep-seg-btn svg{width:18px;height:18px}
.ep-seg-btn.active{background:#fff;color:var(--blue-500);font-weight:600;box-shadow:var(--shadow-sm)}
.ep-pricebook{display:flex;align-items:center;gap:8px;height:46px;padding:0 16px;border:1px solid var(--border);border-radius:9px;background:#fff;font-size:15px;font-weight:500}
.ep-pricebook svg{width:18px;height:18px;color:var(--blue-500)}
.ep-pricebook svg:last-child{color:var(--text-secondary)}
.ep-head-btn{display:flex;align-items:center;gap:8px;height:46px;padding:0 18px;border-radius:9px;font-size:15px;font-weight:600;background:#fff;border:1px solid var(--border);color:var(--text-primary)}
.ep-head-btn svg{width:18px;height:18px}
.ep-head-btn.primary{background:var(--blue-500);color:#fff;border-color:var(--blue-500)}

/* ===== Work area — cart 1.55 : picker 1 ===== */
.ep-work{flex:1;display:flex;gap:16px;min-height:0;padding-bottom:14px}
.ep-cart-col{flex:1.55;min-width:0;display:flex}
.ep-picker{flex:1;min-width:0;background:#fff;border-radius:16px;display:flex;flex-direction:column;overflow:hidden}

/* ===== Cart table ===== */
.ep-cart{flex:1;background:#fff;border-radius:16px;display:flex;flex-direction:column;overflow:hidden;width:100%}
.ep-cart-head{display:grid;grid-template-columns:1fr 92px 110px 100px 80px 130px 40px;align-items:center;padding:16px 20px;font-size:14px;color:var(--text-secondary);border-bottom:1px solid var(--border-faint);font-weight:500}
.ep-cart-head .c{text-align:center}
.ep-cart-head .r{text-align:right}
.ep-cart-body{flex:1;overflow-y:auto}
.ep-cart-row{display:grid;grid-template-columns:1fr 92px 110px 100px 80px 130px 40px;align-items:flex-start;padding:14px 20px 8px;gap:0}
.ep-cart-thumb{width:56px;height:56px;border-radius:8px;overflow:hidden;background:var(--surface-subtle);float:left;margin-right:14px}
.ep-cart-thumb img{width:100%;height:100%;object-fit:cover}
.ep-cart-info{overflow:hidden}
.ep-cart-name{font-weight:600;font-size:16px;display:flex;align-items:center;gap:7px}
.ep-copy{width:15px;height:15px;color:var(--blue-400)}
.ep-cart-attr{font-size:13px;color:var(--text-secondary);margin-top:3px}
.ep-cart-attr2{display:flex;align-items:center;gap:8px;margin-top:5px;font-size:13px;color:var(--text-secondary)}
.ep-chip-line{display:inline-flex;align-items:center;gap:4px}
.ep-chip-line svg{width:14px;height:14px;color:var(--blue-400)}
.ep-lot{color:var(--text-secondary)}
.ep-lot-x{display:inline-flex;color:var(--text-placeholder)}
.ep-lot-x svg{width:14px;height:14px}
.ep-link{color:var(--blue-500);font-weight:500}
.ep-note-link{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--text-secondary);margin-top:6px}
.ep-note-link svg{width:13px;height:13px}
.ep-cart-sl{display:flex;justify-content:center;padding-top:2px}
.ep-cart-num{text-align:right;font-family:var(--font-num);font-weight:700;font-variant-numeric:tabular-nums;font-size:15px;padding-top:4px}
.ep-price{cursor:pointer;text-decoration:underline;text-decoration-color:var(--border-strong);text-underline-offset:3px}
.ep-total-cell{color:var(--blue-500)}
.ep-cart-del{display:flex;justify-content:center;color:var(--gray-200);padding-top:4px}
.ep-cart-del svg{width:18px;height:18px}
.ep-cart-del:hover{color:var(--error-500)}

/* Quantity stepper */
.ep-step{display:flex;align-items:center;gap:9px}
.ep-step-btn{width:24px;height:24px;border-radius:6px;background:var(--blue-500);color:#fff;display:flex;align-items:center;justify-content:center}
.ep-step-btn svg{width:14px;height:14px}
.ep-step-qty{font-family:var(--font-num);font-weight:700;min-width:16px;text-align:center;font-size:15px}

/* Gift / topping nested rows */
.ep-addon{display:flex;align-items:center;gap:8px;padding:4px 20px 4px 90px;font-size:14px;color:var(--text-secondary)}
.ep-addon-ico{width:18px;height:18px;color:var(--gray-200)}
.ep-addon-tag{font-size:12px;font-weight:600;padding:2px 9px;border-radius:5px}
.ep-addon-tag.gift{background:var(--success-50);color:var(--success-700)}
.ep-addon-tag.top{background:var(--orange-50);color:var(--orange-700)}
.ep-addon-name{flex:1}
.ep-addon-qty{font-family:var(--font-num);font-weight:700}

/* Cart empty state */
.ep-cart-empty{flex:1;background:#fff;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--text-secondary);width:100%}
.ep-cart-empty svg{width:54px;height:54px;color:var(--gray-100);margin-bottom:6px}
.ep-cart-empty p{font-size:18px;font-weight:600;color:var(--text-primary);margin:0}
.ep-cart-empty span{font-size:14px}

/* ===== Product picker ===== */
.ep-picker-tabs{display:flex;align-items:center;gap:24px;padding:16px 20px 0;border-bottom:1px solid var(--border-faint);position:relative}
.ep-ptab{font-size:17px;font-weight:600;color:var(--text-secondary);padding-bottom:13px;position:relative}
.ep-ptab.active{color:var(--blue-500)}
.ep-ptab.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--blue-500);border-radius:3px 3px 0 0}
.ep-picker-list{margin-left:auto;width:34px;height:34px;border-radius:8px;background:var(--surface-subtle);color:var(--text-secondary);display:flex;align-items:center;justify-content:center;margin-bottom:8px}
.ep-picker-list svg{width:18px;height:18px}
.ep-picker-search{display:flex;align-items:center;gap:14px;padding:14px 20px 10px}
.ep-search-field{flex:1;height:42px;border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;gap:9px;padding:0 14px;color:var(--text-secondary)}
.ep-search-field svg{width:20px;height:20px}
.ep-search-field input{flex:1;font-size:15px;color:var(--ink)}
.ep-barcode{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--text-secondary);white-space:nowrap}
.ep-tg{width:40px;height:22px;border-radius:999px;background:var(--gray-100);position:relative;display:inline-block}
.ep-tg.on{background:var(--blue-500)}
.ep-tg::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s}
.ep-tg.on::after{left:20px}
.ep-filter{width:42px;height:42px;border:1px solid var(--border);border-radius:8px;color:var(--blue-500);display:flex;align-items:center;justify-content:center}
.ep-filter svg{width:20px;height:20px}
.ep-cats{display:flex;gap:8px;padding:4px 20px 12px;overflow-x:auto}
.ep-cat{white-space:nowrap;font-size:14px;font-weight:500;color:var(--text-secondary);padding:7px 14px;border-radius:7px;border:1px solid var(--border);background:#fff}
.ep-cat .ep-cat-n{color:var(--text-placeholder);font-weight:400}
.ep-cat.active{background:var(--blue-100);border-color:var(--blue-200);color:var(--blue-700)}
.ep-cat.active .ep-cat-n{color:var(--blue-500)}
.ep-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:4px 20px 12px;align-content:start}
.ep-pcard{display:flex;gap:12px;padding:10px;border:1px solid var(--border-faint);border-radius:12px;text-align:left;background:#fff;transition:.12s}
.ep-pcard:hover{border-color:var(--blue-200);box-shadow:var(--shadow-md)}
.ep-pcard:active{transform:scale(.99)}
.ep-pcard-thumb{width:62px;height:62px;border-radius:8px;overflow:hidden;background:var(--surface-subtle);flex:none}
.ep-pcard-thumb img{width:100%;height:100%;object-fit:cover}
.ep-pcard-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.ep-pcard-name{font-size:15px;font-weight:600;line-height:1.3}
.ep-pcard-unit{color:var(--text-secondary);font-weight:400}
.ep-pcard-meta{display:flex;align-items:center;gap:8px}
.ep-stock{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--text-secondary);font-family:var(--font-num);font-weight:600}
.ep-stock-dot{width:7px;height:7px;border-radius:50%;background:var(--blue-500)}
.ep-pcard-promo{font-size:12px;font-weight:600;color:var(--success-700);background:var(--success-50);padding:2px 8px;border-radius:5px}
.ep-pcard-price{display:flex;align-items:baseline;gap:8px;font-family:var(--font-num)}
.ep-old{font-size:13px;color:var(--text-placeholder);text-decoration:line-through}
.ep-pcard-price b{font-size:16px;color:var(--blue-500);font-weight:700}
.ep-picker-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--text-secondary)}
.ep-picker-empty svg{width:48px;height:48px;color:var(--gray-100)}
.ep-picker-empty p{font-size:16px;margin:0}
.ep-pager{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:10px 20px;border-top:1px solid var(--border-faint);font-size:14px;color:var(--text-primary);font-family:var(--font-num)}
.ep-pager em{color:var(--text-secondary);font-style:normal}
.ep-pg{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);color:var(--text-secondary);display:flex;align-items:center;justify-content:center}
.ep-pg svg{width:16px;height:16px}
.ep-pg.active{background:var(--blue-500);color:#fff;border-color:var(--blue-500)}

/* ===== Bottom bar — 160px ===== */
.ep-bottom{height:160px;display:flex;gap:16px;padding:14px 16px 16px;flex:none;align-items:stretch}
.ep-bottom-left{flex:1.55;display:flex;flex-direction:column;gap:12px;min-width:0}
.ep-total-card{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--border);border-radius:10px;padding:12px 18px}
.ep-total-label{font-size:16px;color:var(--text-secondary)}
.ep-total-right{display:flex;align-items:center;gap:10px}
.ep-total-amt{font-family:var(--font-num);font-weight:700;font-size:26px;color:var(--blue-500);letter-spacing:-.01em}
.ep-total-right svg{width:22px;height:22px;color:var(--blue-500)}
.ep-bottom-meta{display:flex;align-items:center;gap:14px}
.ep-created{display:flex;align-items:center;gap:8px;font-size:15px;color:var(--text-secondary);white-space:nowrap}
.ep-created svg{width:18px;height:18px}
.ep-note-field{flex:1;height:48px;background:#fff;border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;gap:9px;padding:0 14px;color:var(--text-secondary)}
.ep-note-field svg{width:18px;height:18px}
.ep-note-field input{flex:1;font-size:15px;color:var(--ink)}
.ep-bottom-actions{flex:1;display:flex;gap:16px}
.ep-act{flex:1;display:flex;align-items:center;justify-content:center;gap:12px;border-radius:8px;font-weight:700;font-size:21px}
.ep-act.save{flex:0 0 46%;background:var(--blue-100);border:1px solid var(--blue-500);color:var(--blue-500)}
.ep-act.save:hover{background:#dcebf6}
.ep-act.pay{background:var(--blue-500);color:#fff}
.ep-act.pay:hover{background:var(--blue-600)}
.ep-act:active{transform:translateY(1px)}
.ep-key{font-size:15px;font-weight:700;border-radius:5px;padding:3px 9px}
.ep-act.save .ep-key{background:var(--blue-200);color:var(--blue-700)}
.ep-act.pay .ep-key{background:rgba(255,255,255,.22);color:#fff}

/* ===== Payment modal — 480px ===== */
.ep-modal-overlay{position:absolute;inset:0;background:rgba(10,18,35,.45);display:flex;align-items:center;justify-content:center;z-index:50}
.ep-modal{width:480px;background:#fff;border-radius:16px;box-shadow:var(--shadow-lg);padding:24px;animation:epPop .16s ease}
@keyframes epPop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
.ep-modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.ep-modal-head h3{font-family:var(--font-display);font-size:22px;font-weight:700;margin:0}
.ep-modal-head button{width:34px;height:34px;border-radius:8px;background:var(--surface-subtle);color:var(--text-secondary);display:flex;align-items:center;justify-content:center}
.ep-modal-head button svg{width:18px;height:18px}
.ep-pay-amount{display:flex;align-items:center;justify-content:space-between;background:var(--blue-50);border-radius:10px;padding:16px 18px;margin-bottom:16px}
.ep-pay-amount span{font-size:16px;color:var(--text-secondary)}
.ep-pay-amount b{font-family:var(--font-num);font-size:28px;font-weight:700;color:var(--blue-500)}
.ep-pay-methods{display:flex;gap:10px;margin-bottom:18px}
.ep-pay-method{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 0;border:1px solid var(--border);border-radius:10px;font-size:14px;font-weight:500;color:var(--text-secondary)}
.ep-pay-method svg{width:24px;height:24px}
.ep-pay-method.active{border-color:var(--blue-500);background:var(--blue-50);color:var(--blue-500);font-weight:600}
.ep-pay-field-label{font-size:14px;font-weight:500;color:var(--text-secondary);display:block;margin-bottom:7px}
.ep-pay-input{display:flex;align-items:center;height:50px;border:1px solid var(--border);border-radius:10px;padding:0 16px;margin-bottom:10px}
.ep-pay-input input{flex:1;font-family:var(--font-num);font-weight:700;font-size:22px;color:var(--ink);text-align:right}
.ep-pay-input span{font-size:18px;color:var(--text-secondary);margin-left:6px}
.ep-pay-quick{display:flex;gap:8px;margin-bottom:18px}
.ep-pay-quick button{flex:1;padding:9px 0;border-radius:8px;background:var(--surface-subtle);font-family:var(--font-num);font-weight:600;font-size:14px;color:var(--text-primary)}
.ep-pay-quick button:hover{background:var(--blue-100);color:var(--blue-600)}
.ep-pay-change{display:flex;align-items:center;justify-content:space-between;padding:0 2px 20px}
.ep-pay-change span{font-size:16px;color:var(--text-secondary)}
.ep-pay-change b{font-family:var(--font-num);font-size:22px;font-weight:700;color:var(--success-500)}
.ep-pay-confirm{width:100%;height:56px;border-radius:10px;background:var(--blue-500);color:#fff;font-size:19px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px}
.ep-pay-confirm:hover{background:var(--blue-600)}
.ep-pay-confirm svg{width:22px;height:22px}

/* ===== Toast ===== */
.ep-toast{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:10px;font-size:16px;font-weight:600;color:#fff;box-shadow:var(--shadow-lg);z-index:60;animation:epPop .16s ease}
.ep-toast.ok{background:var(--success-500)}
.ep-toast.warn{background:var(--warning-500)}
.ep-toast svg{width:22px;height:22px}
```

### 5.1 Reusable primitives (outside the POS shell)

```css
/* Buttons */
.ep-btn{font-family:var(--font-sans);font-weight:700;font-size:16px;border-radius:8px;padding:8px 24px;line-height:24px;display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none}
.ep-btn.primary{background:var(--blue-500);color:#fff}
.ep-btn.primary:hover{background:var(--blue-600)}
.ep-btn.secondary{background:#fff;color:var(--blue-500);border:1.2px solid var(--blue-500)}
.ep-btn.tertiary{background:var(--blue-100);color:var(--blue-500)}
.ep-btn.ghost{background:transparent;color:var(--blue-500)}
.ep-btn.destructive{background:var(--error-500);color:#fff}
.ep-btn.disabled{background:var(--gray-50);color:var(--text-placeholder);cursor:not-allowed}
.ep-btn.md{font-size:14px;padding:6px 16px;line-height:20px}
.ep-btn.sm{font-size:13px;padding:4px 12px;line-height:18px;border-radius:6px}

/* Input field */
.ep-field{display:flex;align-items:center;gap:8px;height:40px;border:1px solid var(--border);border-radius:6px;padding:0 14px;background:#fff;color:var(--text-secondary);font:var(--body-lg)}
.ep-field:focus-within{border-color:var(--blue-500);box-shadow:0 0 0 3px var(--blue-100)}
.ep-field:focus-within svg{color:var(--blue-500)}
.ep-field.error{border-color:var(--error-500)}
.ep-field svg{width:20px;height:20px;color:var(--text-secondary)}
.ep-field input{flex:1;color:var(--ink)}
.ep-lab{font:var(--label);color:var(--text-secondary);margin-bottom:6px;display:block}

/* Checkbox / radio */
.ep-cb{width:20px;height:20px;border-radius:5px;border:1.5px solid var(--border-strong);display:inline-flex;align-items:center;justify-content:center;color:#fff}
.ep-cb.on{background:var(--blue-500);border-color:var(--blue-500)}
.ep-cb svg{width:14px;height:14px}
.ep-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--border-strong);display:inline-flex;align-items:center;justify-content:center}
.ep-radio.on{border-color:var(--blue-500)}
.ep-radio.on::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--blue-500)}

/* Pills / badges */
.ep-pill{font-size:13px;font-weight:600;padding:3px 10px;border-radius:6px;line-height:18px;display:inline-block}
.ep-pill.green{background:var(--success-50);color:var(--success-700)}
.ep-pill.orange{background:var(--orange-50);color:var(--orange-700)}
.ep-pill.blue{background:var(--blue-100);color:var(--blue-700)}
.ep-pill.red{background:var(--error-50);color:var(--error-700)}
.ep-pill.amber{background:var(--warning-50);color:var(--warning-700)}
.ep-dot{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-secondary)}
.ep-dot i{width:8px;height:8px;border-radius:50%}
.ep-count{background:var(--error-500);color:#fff;font-size:12px;font-weight:700;border-radius:999px;min-width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}
```

---

## 6 · Reference React implementation

Drop-in components for the Bán hàng screen. Written for `lucide-react`; the
classNames map 1:1 to §5.

### 6.1 Data + formatter

```jsx
export const epFormat = (n) => Number(n || 0).toLocaleString("vi-VN");

export const EP_PRODUCTS = [
  { id: 1,  name: "Iphone 17 Promax",       unit: "Chiếc", price: 30000,  oldPrice: 35000,  stock: 125, promo: "Mua 2 tặng 1", warranty: "12 tháng" },
  { id: 2,  name: "Áo thun OWL trắng",      unit: "Chiếc", price: 199000, oldPrice: 250000, stock: 84,  promo: "Mua 2 tặng 1", warranty: "" },
  { id: 3,  name: "Quần jean nam slim",     unit: "Chiếc", price: 459000, oldPrice: null,   stock: 42,  promo: "",             warranty: "" },
  { id: 4,  name: "Áo sơ mi Oxford",        unit: "Chiếc", price: 329000, oldPrice: 380000, stock: 60,  promo: "",             warranty: "" },
  { id: 5,  name: "Khăn quàng cổ nữ OWL",   unit: "Chiếc", price: 89000,  oldPrice: null,   stock: 210, promo: "Quà tặng",     warranty: "" },
  { id: 6,  name: "Mũ lưỡi trai basic",     unit: "Chiếc", price: 120000, oldPrice: 150000, stock: 95,  promo: "",             warranty: "" },
  { id: 7,  name: "Giày sneaker trắng",     unit: "Đôi",   price: 690000, oldPrice: 790000, stock: 33,  promo: "Mua 2 tặng 1", warranty: "6 tháng" },
  { id: 8,  name: "Túi tote canvas",        unit: "Chiếc", price: 149000, oldPrice: null,   stock: 120, promo: "",             warranty: "" },
  { id: 9,  name: "Áo khoác gió 2 lớp",     unit: "Chiếc", price: 549000, oldPrice: 620000, stock: 28,  promo: "",             warranty: "" },
  { id: 10, name: "Thắt lưng da nam",       unit: "Chiếc", price: 259000, oldPrice: null,   stock: 47,  promo: "",             warranty: "" },
  { id: 11, name: "Vớ cotton (combo 5)",    unit: "Bộ",    price: 99000,  oldPrice: 130000, stock: 300, promo: "Mua 2 tặng 1", warranty: "" },
  { id: 12, name: "Kính mát thời trang",    unit: "Chiếc", price: 219000, oldPrice: null,   stock: 65,  promo: "",             warranty: "" },
];

export const EP_CATEGORIES = ["Tất cả", "Quần áo", "Áo", "Quần", "Áo sơ mi", "Khăn", "Mũ", "Giày"];
```

### 6.2 Logo mark (reconstruction — replace with the official SVG when supplied)

```jsx
export const EasyposMark = (props) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" fill="currentColor"
      d="M7 4 h20 a3 3 0 0 1 3 3 v9 h5 a3 3 0 0 1 3 3 v14 a3 3 0 0 1 -3 3 H7 a3 3 0 0 1 -3 -3 V7 a3 3 0 0 1 3 -3 Z M9 8 v7 h18 V8 Z M9 22 h5 v5 H9 Z M17 22 h5 v5 h-5 Z M25 22 h5 v5 h-5 Z M33 22 h2 v5 h-2 Z M9 30 h26 v3 H9 Z" />
  </svg>
);
```

### 6.3 TopBar

```jsx
import { Search, ReceiptText, Plus, QrCode, ShoppingCart, ChevronDown, Menu } from "lucide-react";

export function TopBar() {
  const tabs = ["HĐ 001"];
  return (
    <header className="ep-topbar">
      <div className="ep-brand">
        <span className="ep-mark"><EasyposMark /></span>
        <span className="ep-word">EasyPOS</span>
      </div>

      <div className="ep-search-top">
        <Search /><input placeholder="Tìm kiếm hàng hóa" />
      </div>

      <div className="ep-inv-tabs">
        {tabs.map((t) => (
          <button key={t} className="ep-inv-tab"><ReceiptText />{t}</button>
        ))}
        <button className="ep-inv-add"><Plus /></button>
      </div>

      <button className="ep-qr">
        <QrCode />QR order<span className="ep-qr-count">3</span>
      </button>

      <div className="ep-spacer" />

      <button className="ep-mode">
        <ShoppingCart /><b>Bán thường</b><ChevronDown />
      </button>

      <div className="ep-account">
        <img src="/avatar.png" alt="" />
        <span>Công ty Cổ phần SDS</span>
      </div>
      <button className="ep-burger"><Menu /></button>
    </header>
  );
}
```

### 6.4 LeftRail — 12 items, exact labels & order

```jsx
import {
  LayoutGrid, ShoppingCart, Package, Bookmark, TicketPercent, Users,
  Layers, ArrowLeftRight, BarChart3, CreditCard, Home, Settings,
} from "lucide-react";
import { useState } from "react";

const RAIL = [
  { Icon: LayoutGrid,     label: "Bán hàng" },
  { Icon: ShoppingCart,   label: "Đơn hàng" },
  { Icon: Package,        label: "Sản phẩm" },
  { Icon: Bookmark,       label: "Đơn lưu" },
  { Icon: TicketPercent,  label: "Khuyến mãi" },
  { Icon: Users,          label: "Khách hàng" },
  { Icon: Layers,         label: "Kho" },
  { Icon: ArrowLeftRight, label: "Giao dịch" },
  { Icon: BarChart3,      label: "Báo cáo" },
  { Icon: CreditCard,     label: "Sổ quỹ" },
  { Icon: Home,           label: "Trang chủ" },
  { Icon: Settings,       label: "Cài đặt" },
];

export function LeftRail() {
  const [active, setActive] = useState(0);
  return (
    <nav className="ep-rail">
      {RAIL.map(({ Icon, label }, i) => (
        <button key={label} title={label}
          className={"ep-rail-item" + (i === active ? " active" : "")}
          onClick={() => setActive(i)}>
          <Icon size={24} />
        </button>
      ))}
    </nav>
  );
}
```

### 6.5 OrderHeader

```jsx
import { Star, Wallet, ShoppingBag, Utensils, Truck, MapPin, ChevronDown, List, Grid2x2 } from "lucide-react";
import { useState } from "react";

export function OrderHeader() {
  const [mode, setMode] = useState("Mang về");
  const modes = [
    { k: "Mang về", Icon: ShoppingBag },
    { k: "Tại chỗ", Icon: Utensils },
    { k: "Ship",    Icon: Truck },
  ];
  return (
    <div className="ep-orderhead">
      <div className="ep-customer">
        <img src="/customer.png" alt="" />
        <div>
          <div className="ep-cust-name">Khách lẻ</div>
          <div className="ep-cust-meta">
            <span><Star size={14} />1.000 điểm</span>
            <span><Wallet size={14} />Ví: 125.000đ</span>
          </div>
        </div>
      </div>

      <div className="ep-seg">
        {modes.map(({ k, Icon }) => (
          <button key={k} onClick={() => setMode(k)}
            className={"ep-seg-btn" + (mode === k ? " active" : "")}>
            <Icon size={18} />{k}
          </button>
        ))}
      </div>

      <button className="ep-pricebook">
        <MapPin size={18} />Bảng giá chung<ChevronDown size={18} />
      </button>

      <div className="ep-spacer" />

      <button className="ep-head-btn primary"><List size={18} />Thực đơn</button>
      <button className="ep-head-btn"><Grid2x2 size={18} />Phòng bàn</button>
    </div>
  );
}
```

### 6.6 CartTable + QtyStepper + gift/topping rows

```jsx
import { Minus, Plus, Copy, ShieldCheck, X, Paperclip, Trash2, Gift, ShoppingCart } from "lucide-react";

function QtyStepper({ qty, onChange }) {
  return (
    <div className="ep-step">
      <button className="ep-step-btn" onClick={() => onChange(Math.max(1, qty - 1))}><Minus size={14} /></button>
      <span className="ep-step-qty">{qty}</span>
      <button className="ep-step-btn" onClick={() => onChange(qty + 1)}><Plus size={14} /></button>
    </div>
  );
}

function CartLine({ item, onQty, onRemove }) {
  const line = item.price * item.qty;
  return (
    <>
      <div className="ep-cart-row">
        <div className="ep-cart-thumb"><img src="/product-thumb.png" alt="" /></div>
        <div className="ep-cart-info">
          <div className="ep-cart-name">{item.name}<Copy className="ep-copy" size={15} /></div>
          <div className="ep-cart-attr">{item.unit} · Kho mặc định · Demopro</div>
          <div className="ep-cart-attr2">
            {item.warranty && <span className="ep-chip-line"><ShieldCheck size={14} />{item.warranty}</span>}
            <span className="ep-lot">LO2:05/05/2025</span>
            <span className="ep-lot-x"><X size={14} /></span>
            <a className="ep-link">Chọn lô</a>
          </div>
          <a className="ep-note-link"><Paperclip size={13} />Ghi chú</a>
        </div>
        <div className="ep-cart-sl"><QtyStepper qty={item.qty} onChange={(q) => onQty(item.uid, q)} /></div>
        <div className="ep-cart-num ep-price">{epFormat(item.price)}</div>
        <div className="ep-cart-num">0</div>
        <div className="ep-cart-num">0</div>
        <div className="ep-cart-num ep-total-cell">{epFormat(line)}</div>
        <button className="ep-cart-del" onClick={() => onRemove(item.uid)}><Trash2 size={18} /></button>
      </div>

      {item.addons?.map((a, i) => (
        <div className="ep-addon" key={i}>
          <Gift className="ep-addon-ico" size={18} />
          <span className={"ep-addon-tag " + (a.type === "gift" ? "gift" : "top")}>
            {a.type === "gift" ? "Quà tặng" : "Topping"}
          </span>
          <span className="ep-addon-name">{a.name}</span>
          <span className="ep-addon-qty">{a.qty}</span>
        </div>
      ))}
    </>
  );
}

export function CartTable({ items, onQty, onRemove }) {
  if (!items.length) {
    return (
      <div className="ep-cart-empty">
        <ShoppingCart size={54} />
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
        <div />
      </div>
      <div className="ep-cart-body">
        {items.map((it) => (
          <CartLine key={it.uid} item={it} onQty={onQty} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}
```

### 6.7 ProductPicker

```jsx
import { Search, Menu, SlidersHorizontal, ChevronLeft, ChevronRight, Package2, ConciergeBell } from "lucide-react";
import { useState } from "react";

function ProductCard({ p, onAdd }) {
  return (
    <button className="ep-pcard" onClick={() => onAdd(p)}>
      <div className="ep-pcard-thumb"><img src="/product-thumb.png" alt="" /></div>
      <div className="ep-pcard-body">
        <div className="ep-pcard-name">{p.name} <span className="ep-pcard-unit">- {p.unit}</span></div>
        <div className="ep-pcard-meta">
          <span className="ep-stock"><i className="ep-stock-dot" />{p.stock}</span>
          {p.promo && <span className="ep-pcard-promo">{p.promo}</span>}
        </div>
        <div className="ep-pcard-price">
          {p.oldPrice && <span className="ep-old">{epFormat(p.oldPrice)}</span>}
          <b>{epFormat(p.price)}đ</b>
        </div>
      </div>
    </button>
  );
}

export function ProductPicker({ onAdd }) {
  const [tab, setTab] = useState("Sản phẩm");
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const tabs = ["Sản phẩm", "Combo", "Dịch vụ"];
  const list = q.trim()
    ? EP_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : EP_PRODUCTS;

  return (
    <section className="ep-picker">
      <div className="ep-picker-tabs">
        {tabs.map((t) => (
          <button key={t} className={"ep-ptab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
        ))}
        <button className="ep-picker-list"><Menu size={18} /></button>
      </div>

      <div className="ep-picker-search">
        <div className="ep-search-field">
          <Search /><input placeholder="Tìm kiếm hàng hóa" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label className="ep-barcode">Tìm kiếm barcode<span className="ep-tg on" /></label>
        <button className="ep-filter"><SlidersHorizontal /></button>
      </div>

      <div className="ep-cats">
        {EP_CATEGORIES.map((c) => (
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
          {tab === "Combo" ? <Package2 size={48} /> : <ConciergeBell size={48} />}
          <p>Chưa có {tab.toLowerCase()} nào</p>
        </div>
      )}

      <div className="ep-pager">
        <span>1-{list.length} <em>of 100</em></span>
        <button className="ep-pg"><ChevronLeft size={16} /></button>
        <button className="ep-pg active"><ChevronRight size={16} /></button>
      </div>
    </section>
  );
}
```

### 6.8 BottomBar

```jsx
import { CircleChevronRight, Calendar, Paperclip } from "lucide-react";

export function BottomBar({ count, total, onPay, onSave }) {
  return (
    <div className="ep-bottom">
      <div className="ep-bottom-left">
        <div className="ep-total-card">
          <span className="ep-total-label">Tổng tiền hàng ({count})</span>
          <span className="ep-total-right">
            <span className="ep-total-amt">{epFormat(total)}đ</span>
            <CircleChevronRight size={22} />
          </span>
        </div>
        <div className="ep-bottom-meta">
          <span className="ep-created"><Calendar size={18} />Ngày tạo: <b>16/09/2024</b></span>
          <div className="ep-note-field"><Paperclip size={18} /><input placeholder="Ghi chú" /></div>
        </div>
      </div>
      <div className="ep-bottom-actions">
        <button className="ep-act save" onClick={onSave}>Lưu đơn <span className="ep-key">F8</span></button>
        <button className="ep-act pay"  onClick={onPay}>Thanh toán <span className="ep-key">F9</span></button>
      </div>
    </div>
  );
}
```

### 6.9 PaymentModal

```jsx
import { X, Banknote, CreditCard, QrCode, CircleCheckBig } from "lucide-react";
import { useState } from "react";

export function PaymentModal({ total, onClose, onDone }) {
  const [tendered, setTendered] = useState(total);
  const [method, setMethod] = useState("cash");
  const quick = [total, 200000, 500000, 1000000];
  const change = Math.max(0, tendered - total);
  const methods = [
    { k: "cash", label: "Tiền mặt",     Icon: Banknote },
    { k: "card", label: "Thẻ",          Icon: CreditCard },
    { k: "qr",   label: "Chuyển khoản", Icon: QrCode },
  ];

  return (
    <div className="ep-modal-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ep-modal-head">
          <h3>Thanh toán</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="ep-pay-amount">
          <span>Khách cần trả</span><b>{epFormat(total)}đ</b>
        </div>

        <div className="ep-pay-methods">
          {methods.map(({ k, label, Icon }) => (
            <button key={k} onClick={() => setMethod(k)}
              className={"ep-pay-method" + (method === k ? " active" : "")}>
              <Icon size={24} />{label}
            </button>
          ))}
        </div>

        <label className="ep-pay-field-label">Tiền khách đưa</label>
        <div className="ep-pay-input">
          <input type="text" value={epFormat(tendered)}
            onChange={(e) => setTendered(Number(e.target.value.replace(/\D/g, "")) || 0)} />
          <span>đ</span>
        </div>
        <div className="ep-pay-quick">
          {quick.map((v, i) => <button key={i} onClick={() => setTendered(v)}>{epFormat(v)}</button>)}
        </div>

        <div className="ep-pay-change">
          <span>Tiền thừa trả khách</span><b>{epFormat(change)}đ</b>
        </div>

        <button className="ep-pay-confirm" onClick={onDone}>
          <CircleCheckBig size={22} />Hoàn thành
        </button>
      </div>
    </div>
  );
}
```

### 6.10 App shell + cart logic + toast

```jsx
import { CircleCheckBig, TriangleAlert } from "lucide-react";
import { useRef, useState } from "react";

export default function App() {
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
          ? [{ type: "gift", name: "Khăn quàng cổ nữ OWL", qty: 1 },
             { type: "top",  name: "Khăn quàng cổ nữ OWL", qty: 1 }]
          : null;
      return [...prev, { ...p, uid: uid.current++, qty: 1, addons }];
    });
  };
  const setQty  = (u, q) => setItems((p) => p.map((x) => (x.uid === u ? { ...x, qty: q } : x)));
  const remove  = (u)    => setItems((p) => p.filter((x) => x.uid !== u));

  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 2600); };
  const doSave = () => items.length
    ? showToast({ t: "ok",   m: "Đã lưu đơn vào danh sách đơn lưu" })
    : showToast({ t: "warn", m: "Đơn hàng đang trống" });
  const doPay  = () => items.length ? setPaying(true) : showToast({ t: "warn", m: "Đơn hàng đang trống" });
  const finishPay = () => {
    setPaying(false); setItems([]);
    showToast({ t: "ok", m: "Thanh toán thành công · Đã in hóa đơn" });
  };

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
          {toast.t === "ok" ? <CircleCheckBig size={22} /> : <TriangleAlert size={22} />}
          {toast.m}
        </div>
      )}
    </div>
  );
}
```

### 6.11 Scaling the fixed canvas to any viewport

```jsx
// Wrap <App/> in <div id="stage"><div id="root">…</div></div> and run:
function epScale() {
  const r = document.getElementById("root");
  const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  const x = (window.innerWidth - 1920 * s) / 2;
  const y = (window.innerHeight - 1080 * s) / 2;
  r.style.transform = `translate(${x}px,${y}px) scale(${s})`;
}
window.addEventListener("resize", epScale); epScale();
```

---

## 7 · Content & language

**Language.** Vietnamese first, **full diacritics always**. Never romanize, never
abbreviate away tone marks. English appears only in occasional product/feature
names (`QR order`, `Demopro`, `of 100`).

**Voice & tone.** Practical, plain, action-oriented — built for busy shop staff.
Labels are short noun phrases or imperatives, never sentences:
`Bán hàng`, `Thanh toán`, `Lưu đơn`, `Chọn lô`, `Ghi chú`, `Thực đơn`,
`Phòng bàn`, `Mang về`, `Tại chỗ`, `Ship`.

**Person.** Customer-facing notices address the merchant politely as
**"Quý khách"** (e.g. *"Mong Quý khách thông cảm vì sự bất tiện này!"*). In-app
actions use neutral imperatives. Avoid "tôi/bạn" inside the working app.

**Casing.** Vietnamese **sentence case** for buttons, labels, menu items
(`Tổng tiền hàng`, not `Tổng Tiền Hàng`). ALL-CAPS only for short notice
headlines (`NÂNG CẤP VÀ BẢO TRÌ HỆ THỐNG`) — never for body or buttons.

**Numbers & currency.** Dot thousands separator, `đ` suffixed:
`5.000.000đ`, `35.000`, `30.000đ`. Format with `toLocaleString("vi-VN")`.
Dates `DD/MM/YYYY` → `16/09/2024`. Numerals set in `--font-num`, tabular,
right-aligned in tables; totals **bold blue**.

**Emoji.** Not used in the working product UI. Lightweight decorative **3D spot
illustrations** (a friendly bell, a maintenance scene — glossy, rounded, warm
yellow/orange with a pop of red/blue) appear only on full-page notices and empty
states, never inline.

**Imagery.** Product photos are neutral, well-lit, on white — utilitarian and
true-to-life, not stylized.

### Microcopy bank (reuse verbatim)

| Context | Vietnamese |
|---|---|
| Global search | `Tìm kiếm hàng hóa` |
| Barcode toggle | `Tìm kiếm barcode` |
| Price book | `Bảng giá chung` |
| Customer chip | `Khách lẻ · 1.000 điểm · Ví: 125.000đ` |
| Invoice tab | `HĐ 001` |
| Sales mode | `Bán thường` |
| Delivery modes | `Mang về` · `Tại chỗ` · `Ship` |
| Header actions | `Thực đơn` · `Phòng bàn` |
| Cart columns | `Tên sản phẩm` · `SL` · `Đơn giá` · `Giảm giá` · `Thuế` · `Thành tiền` |
| Line meta | `Chiếc · Kho mặc định · Demopro` · `LO2:05/05/2025` · `Chọn lô` · `Ghi chú` |
| Add-on tags | `Quà tặng` · `Topping` |
| Promo tag | `Mua 2 tặng 1` |
| Total | `Tổng tiền hàng (4)` → `5.000.000đ` |
| Created date | `Ngày tạo: 16/09/2024` |
| Actions | `Lưu đơn` (F8) · `Thanh toán` (F9) |
| Picker tabs | `Sản phẩm` · `Combo` · `Dịch vụ` |
| Categories | `Tất cả` · `Quần áo` · `Áo` · `Quần` · `Áo sơ mi` · `Khăn` · `Mũ` · `Giày` |
| Pager | `1-16 of 100` |
| Payment modal | `Thanh toán` · `Khách cần trả` · `Tiền mặt` / `Thẻ` / `Chuyển khoản` · `Tiền khách đưa` · `Tiền thừa trả khách` · `Hoàn thành` |
| Cart empty | `Chưa có hàng hóa trong đơn` / `Chọn sản phẩm ở danh sách bên phải để thêm vào đơn` |
| Picker empty | `Chưa có combo nào` / `Chưa có dịch vụ nào` |
| Toast ok | `Đã lưu đơn vào danh sách đơn lưu` · `Thanh toán thành công · Đã in hóa đơn` |
| Toast warn | `Đơn hàng đang trống` |
| Stock status | `Còn hàng` · `Sắp hết` · `Hết hàng` |
| Order status | `Hoàn thành` · `Hủy` |
| Support | `Hotline 1900 3369` |

---

## 8 · Iconography

The real product uses **Iconsax / vuesax** throughout — `linear` (outline, ~1.5px
stroke, rounded joins), `bold` (filled) and `twotone`. Figma names confirm it:
`EmptyWalletAdd`, `MoneyRecive`, `ReceiptEdit`, `ReceiptSearch`, `WalletMoney`,
`ArchiveTick`, `NotificationBing`, `DirectboxDefault`.

**Substitution (flagged):** use **[Lucide](https://lucide.dev)** — the closest
freely-available match (clean, consistent, ~1.6px rounded stroke). When
pixel-fidelity to Iconsax matters, swap in the real Iconsax SVGs.

**Usage:** 24px in toolbars/nav · 20px inline in buttons/fields · 18px in
secondary chrome · 14px inline with 13px text. Single-color, inherit
`currentColor`, tinted `#0074BD` when active. Stroke width 1.5–1.6.
**No emoji, no Unicode glyphs as icons.**

**Icon vocabulary used in EasyPOS** (kebab name → `lucide-react` PascalCase):

```
layout-grid        shopping-cart     package           bookmark
ticket-percent     gift              credit-card       receipt
receipt-text       users             bar-chart-3       wallet
store              bell              settings          search
calendar           printer           qr-code           tag
box                home              arrow-left-right  file-text
menu               check             alert-triangle    x
minus              plus              copy              shield-check
paperclip          trash-2           chevron-down      chevron-right
chevron-left       sliders-horizontal star             list
grid-2x2           utensils          truck             map-pin
shopping-bag       more-horizontal   check-circle-2    alert-circle
banknote           package-2         concierge-bell    layers
image              circle-chevron-right
```

> Lucide renamed a few icons: `check-circle-2` → `CircleCheckBig`,
> `alert-triangle` → `TriangleAlert`, `chevron-right-circle` → `CircleChevronRight`,
> `bar-chart-3` → `BarChart3`. Use the current names in `lucide-react`.

---

## 9 · Known caveats — carry these forward

- **Logo.** The official EasyPOS logo exists in Figma only as fragmented vector
  paths. The mark in §6.2 is a **faithful reconstruction** of the POS-terminal
  glyph + "EasyPOS" wordmark (Be Vietnam Pro Extrabold). Replace with the
  official SVG when supplied.
- **Icons.** Lucide is a substitute for Iconsax (see §8).
- **SF Pro Display.** Not web-distributable; numerals fall back to the
  `-apple-system` stack via `--font-num`.
- **Teal primitive.** Documented in Figma but unused in product — do not ship it.
- **Product photos.** The UI kit reuses one sample thumbnail for every product.
  Swap in real catalog images for production.

---

## 10 · Output checklist — verify before you hand back

- [ ] Every color comes from a token; no stray hex.
- [ ] Blue `#0074BD` is the only accent carrying primary actions.
- [ ] Cards are white, radius 16px, on `#F4F6F8`; gutters 16px.
- [ ] No gradient, no texture, no colored shadow anywhere.
- [ ] Vietnamese text has correct diacritics; sentence case; no emoji.
- [ ] Money uses `toLocaleString("vi-VN")` + `đ`; dates `DD/MM/YYYY`.
- [ ] Numerals tabular, bold, right-aligned in tables; totals blue.
- [ ] Icons are Lucide, `currentColor`, 24/20/18px per context.
- [ ] Canvas 1920×1080, no outer scrollbar; only cart body + product grid scroll.
- [ ] Hover / focus / active / disabled states defined for every interactive element.
- [ ] Keyboard-shortcut keycaps present on `Lưu đơn` (F8) and `Thanh toán` (F9).
- [ ] Empty states written, not omitted.
