name: design
description: >
  Generate UI screens, components, and prototypes that are pixel-accurate to
  the EasyPOS design system — a Vietnamese all-in-one POS platform by
  SoftDreams. Covers HTML artifacts, React JSX, and standalone mocks.
user-invocable: true
---

# EasyPOS Design System Skill

You are an expert EasyPOS designer. When invoked, read the files below to get
full context, then build what the user needs as a **self-contained HTML file**
(or React JSX if they're working in production code).

---

## Step 1 — Load context

Read these files **before** generating anything:

| File | What it gives you |
|------|-------------------|
| `colors_and_type.css` | Every CSS custom property — colors, type scale, spacing, radius, shadows. ALWAYS `<link>` this (or copy its `:root {}` block inline). Never hard-code a token value. |
| `README.md` | Product context, content rules, Vietnamese microcopy guide, iconography notes. |
| `reference/banhang-screen.png` | Ground-truth render of the main POS screen. Use it to validate proportions. |
| `ui_kits/easypos-pos/*.jsx` | Production React components. Copy and adapt — TopBar, LeftRail, OrderHeader, CartTable, ProductPicker, BottomBar, PaymentModal, Icon. |
| `preview/*.html` | Spec cards for individual tokens and components. Open the relevant one for exact details. |

---

## Step 2 — Clarify (if needed)

If the user's request is ambiguous, ask **at most 3 focused questions**:
1. Which screen / component / flow?
2. HTML prototype vs. production React?
3. Any content to include (product names, amounts, user names)?

Then act — don't ask for design decisions; you already know the system.

---

## Step 3 — Generate

### Output format

**HTML prototype** (default unless user says otherwise):
- Single self-contained `.html` file.
- `<link>` `colors_and_type.css` with a relative path from the project root,
  OR paste its `:root {}` block inside `<style>`.
- Load fonts from Google Fonts:
  `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap`
- Load Lucide icons via CDN:
  `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`
  Call `lucide.createIcons()` at end of `<body>`.
- Canvas: fixed 1920×1080, `overflow: hidden`, no scrollbars on the outer shell.

**React JSX** (when user asks for production code):
- Import design tokens via `import '../colors_and_type.css'`.
- Use Lucide React: `import { IconName } from 'lucide-react'`.
- Adapt components from `ui_kits/easypos-pos/`.

---

## Design rules (apply always)

### Colors
```
Primary action / top bar:   #0074BD  (var(--blue-500))
Primary text:               #151B33  (var(--ink))
Secondary text:             #455064
Page background:            #F4F6F8  (var(--surface-page))
Cards / panels:             #FFFFFF  (var(--surface))
Default border:             #E6E6E6  (var(--border))
Success:                    #2BA45C  (var(--success-500))
Warning:                    #F0A92A  (var(--warning-500))
Error / destructive:        #EB5146  (var(--error-500))
```
No gradients. No textures. No colored drop-shadows.

### Typography
- **Headings / brand**: `font-family: 'Be Vietnam Pro', sans-serif; font-weight: 600`
- **UI text**: `font-family: 'Noto Sans', sans-serif`
- **Numerals / currency**: tabular, bold, right-aligned; use `font-feature-settings: 'tnum'`
- **Vietnamese sentence case** for all labels and buttons — no Title Case
- Number format: dot thousands separator → `5.000.000đ`, `35.000đ`
- Date format: `DD/MM/YYYY`

### Spacing (4 px grid)
```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px  --space-6: 32px  --space-7: 40px  --space-8: 64px
```

### Border radius
```
--radius-xs: 4px   --radius-sm: 6px   --radius-md: 8px
--radius-lg: 12px  --radius-xl: 16px  --radius-full: 999px
```
Content cards → `--radius-xl` (16px). Inputs / buttons → `--radius-md` (8px).
Chips / tags → `--radius-full` (999px).

### Shadows
```
--shadow-sm: 0 1px 2px rgba(16,24,40,.08)    /* chips, hover */
--shadow-md: 0 4px 12px rgba(16,24,40,.15)   /* cards, popovers */
--shadow-lg: 0 12px 32px rgba(16,24,40,.16)  /* modals */
```

### Icons
- Library: Lucide (CDN substitute for Iconsax)
- Size: 24px in chrome / navigation; 20px inline in buttons and fields
- Color: `currentColor`; blue (`#0074BD`) when active
- Stroke width: 1.5px (Lucide default)
- No emoji as icons

### Layout (POS shell)
```
Top bar:    70px height, blue #0074BD background, white text/icons
Left rail:  72px width, white bg, icon nav (12 items), active = blue-100 tint
Work area:  flex row, fills remaining space
  ├─ Cart panel:           flex col, white card, radius 16px
  └─ Product picker panel: flex col, white card, radius 16px
Bottom bar: sticky to cart, white bg, totals left + action buttons right
```

### Buttons
```
Primary:     solid #0074BD, white label, radius 8px
Secondary:   white bg, 1.2px #0074BD border, blue label
Tertiary:    #E6F1F8 fill, blue label
Ghost:       transparent, blue label
Destructive: solid #EB5146, white label
Disabled:    #F7F7F7 fill, #B0B0B0 text
```
Power-user buttons carry a keyboard shortcut keycap (e.g. F8, F9) — white
20%-opacity fill, 4px radius, 2px 6px padding, inside the button on the right.

Sizes:
- Large: 16px font, padding 8px 24px
- Medium: 14px font, padding 6px 16px
- Small: 13px font, padding 4px 12px

### Tags & status
```
Green  (quà tặng, hoàn thành): bg #E0FFEB  text #1E7D45
Orange (topping):               bg #FCF2EB  text #A15926
Blue   (label / demopro):       bg #E6F1F8  text #005C96
Amber  (sắp hết):               bg #FFFAE7  text #B7791F
Red    (hủy, error):            bg #FEF3F2  text #BE211C
```
Font: 12–13px, weight 600, padding 2px 8px, radius 999px.

### Stock indicator dots
```
Còn hàng  → green  #2BA45C
Sắp hết   → amber  #F0A92A
Hết hàng  → red    #EB5146
```

### Content language
- Primary: Vietnamese (full Unicode diacritics)
- Dates/times: Vietnamese locale
- No emoji in working UI
- 3D spot illustrations only for full-page empty states / error pages

---

## Common Lucide icon names used in EasyPOS

```
layout-grid      shopping-cart    package          bookmark
ticket-percent   gift             credit-card      receipt
users            bar-chart-3      wallet           store
bell             settings         search           calendar
printer          qr-code          tag              box
home             arrow-left-right file-text        menu
check            alert-triangle   x                minus
plus             copy             shield-check     paperclip
trash-2          chevron-down     chevron-right    sliders-horizontal
chevron-left     star             list             grid-2x2
utensils         truck            map-pin          shopping-bag
more-horizontal  check-circle-2   alert-circle     banknote
package-2        concierge-bell
```

---

## Sample Lucide CDN usage (HTML)

```html
<head>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
  <i data-lucide="shopping-cart" style="width:24px;height:24px;color:#0074BD"></i>
  <script>lucide.createIcons();</script>
</body>
```

---

## Sample Google Fonts link

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

---

## After generating

- Verify the output visually matches `reference/banhang-screen.png` for layout-level screens.
- Vietnamese text must use correct diacritics — never romanize or abbreviate.
- If the artifact is an HTML file, write it to the project root or a folder the user specifies, then tell them to open it in a browser. -->

