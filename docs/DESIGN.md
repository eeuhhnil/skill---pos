# Pos — Style Reference
> A professional, high-trust POS design system with a clean, modular aesthetic.

**Theme:** light

The Pos design system is built on a foundation of clarity and functional efficiency, featuring a crisp white artboard that prioritizes readability. Its primary typeface, **Inter**, lends a friendly yet professional geometric personality to the interface, maintaining a consistent rhythm with its 150% line height. The color palette is driven by a strong "Brand Primary Blue" for navigation and primary actions, balanced by a "Brand Secondary Orange" for highlights and attention-grabbing elements. Surfaces use a subtle structural depth with soft grays (#F7F7F7 for base backgrounds), while components follow a precise modular grid with rounded corners (predominantly 8px or pill-shaped) that create a modern, approachable feel. What makes this system distinctive is its robust component library, particularly the highly detailed button system that covers every possible state and size transition, ensuring a seamless user experience across a complex POS workflow.

## Tokens — Colors

### Grayscale (Neutral)
| Name | Value | Token | Role |
|------|-------|-------|------|
| Neutral 900 | `#000000` | `--color-neutral-900` | Pure black text / deep contrast |
| Neutral 800 | `#333333` | `--color-neutral-800` | Primary text |
| Neutral 700 | `#545454` | `--color-neutral-700` | Secondary text |
| Neutral 600 | `#8A8A8A` | `--color-neutral-600` | Muted text / tertiary |
| Neutral 500 | `#B0B0B0` | `--color-neutral-500` | Disabled text / icons |
| Neutral 400 | `#E6E6E6` | `--color-neutral-400` | Strong borders |
| Neutral 300 | `#EBEBEB` | `--color-neutral-300` | Regular borders |
| Neutral 200 | `#EEEEEE` | `--color-neutral-200` | Subtle dividers |
| Neutral 100 | `#EEEEEE` | `--color-neutral-100` | Subtle dividers (duplicate) |
| Neutral 50 | `#F7F7F7` | `--color-neutral-50` | Page background |

### Primary (Blue)
| Name | Value | Token | Role |
|------|-------|-------|------|
| Primary 900 | `#00314F` | `--color-primary-900` | Deepest navy accent |
| Primary 800 | `#004068` | `--color-primary-800` | Secondary active states |
| Primary 700 | `#005286` | `--color-primary-700` | Active states |
| Primary 600 | `#006AAC` | `--color-primary-600` | Hover states |
| Primary 500 | `#0074BD` | `--color-primary-500` | Brand primary color / main actions |
| Primary 400 | `#3390CA` | `--color-primary-400` | Secondary level blue |
| Primary 300 | `#54A2D3` | `--color-primary-300` | Subtle background Blue |
| Primary 200 | `#8ABFE1` | `--color-primary-200` | Lightest blue accents |
| Primary 100 | `#B0D4EB` | `--color-primary-100` | Very light tint |
| Primary 50 | `#E6F1F8` | `--color-primary-50` | Extremely light blue tint |

### Secondary (Orange)
| Name | Value | Token | Role |
|------|-------|-------|------|
| Secondary 900 | `#612200` | `--color-secondary-900` | Deepest orange accent |
| Secondary 500 | `#E65100` | `--color-secondary-500` | Brand secondary color / highlights |
| Secondary 50 | `#FDEEE6` | `--color-secondary-50` | Lightest orange tint |

### Semantic
| Name | Value | Token | Role |
|------|-------|-------|------|
| Success 500-main | `#13C05D` | `--color-success` | Success states / Green |
| Success 50 | `#EDFCF3` | `--color-success-bg` | Success background |
| Warning 500-main | `#F08D14` | `--color-warning` | Warning states / Orange-Yellow |
| Warning 50 | `#FFFAE7` | `--color-warning-bg` | Warning background |
| Error 500-main | `#EB5146` | `--color-error` | Error states / Red |
| Error 50 | `#FEF3F2` | `--color-error-bg` | Error background |

---

## Tokens — Typography

### Inter — Modern Geometric Sans · `--font-primary`
- **Substitute:** Inter, Montserrat
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Sizes:** 10, 12, 14, 16, 18, 20, 24, 36, 40
- **Line height:** 150% (Default for Headings), Variable for Body (16px, 20px, 24px, 26px)
- **Letter spacing:** 0
- **Role:** Primary typeface for all UI elements, headings, and body text.

### Type Scale

#### Headings
| Role | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| Heading 1 | 64px | 96px (150%) | Semibold | `--text-h1` |
| Heading 2 | 48px | 72px (150%) | Semibold | `--text-h2` |
| Heading 3 | 40px | 60px (150%) | Semibold | `--text-h3` |
| Heading 4 | 36px | 54px (150%) | Semibold | `--text-h4` |
| Heading 5 | 24px | 36px (150%) | Semibold | `--text-h5` |
| Heading 6 | 20px | 30px (150%) | Semibold | `--text-h6` |
| Heading 7 | 20px | 30px (150%) | Semibold | `--text-h7` |

#### Titles
| Role | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| Title/Large-SemiBold | 16px | 24px | Semibold | `--text-title-lg` |
| Title/Medium-SemiBold | 14px | 20px | Semibold | `--text-title-md` |
| Title/Small-SemiBold | 12px | 16px | Semibold | `--text-title-sm` |
| Title/XSmall-SemiBold | 10px | 16px | Semibold | `--text-title-xs` |

#### Body Text
| Role | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| Body Text/XLarge/Bold | 18px | 26px | Bold | `--text-body-xl-bold` |
| Body Text/XLarge/Semibold | 18px | 26px | Semibold | `--text-body-xl-semibold` |
| Body Text/XLarge/Regular | 18px | 26px | Regular | `--text-body-xl-regular` |
| Body Text/Large/Bold | 16px | 24px | Bold | `--text-body-lg-bold` |
| Body Text/Large/Semibold | 16px | 24px | Semibold | `--text-body-lg-semibold` |
| Body Text/Large/Regular | 16px | 24px | Regular | `--text-body-lg-regular` |
| Body Text/Medium/Bold | 14px | 20px | Bold | `--text-body-md-bold` |
| Body Text/Medium/Semibold | 14px | 20px | Semibold | `--text-body-md-semibold` |
| Body Text/Medium/Regular | 14px | 20px | Regular | `--text-body-md-regular` |
| Body Text/Small/Bold | 12px | 16px | Bold | `--text-body-sm-bold` |
| Body Text/Small/Semibold | 12px | 16px | Semibold | `--text-body-sm-semibold` |
| Body Text/Small/Regular | 12px | 16px | Regular | `--text-body-sm-regular` |

---

## Typography Guidelines

### Overview
Inter is selected as the primary typeface for its geometric clarity and friendly professional tone. It ensures readability across both large displays and small mobile interfaces.

### Usage
- **Headings**: Used primarily for page titles, section headers, and modal titles. Always use Semibold.
- **Titles**: Used for interactive labels, table headers, and small card titles.
- **Body**: Used for all descriptive content, input text, and meta-data.

### Hierarchy
Maintain a clear hierarchy by never skipping heading levels. Use **Heading 3** for main page titles and **Heading 5/6** for section breaks. Use **Body/Medium** as the default reading size.

### Accessibility
Ensure all typography meets WCAG 2.1 AA standards for contrast. Body text should never be smaller than **12px** for critical information. Use **10px** only for non-essential captions or secondary metadata.

---

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale
Modular scale based on increments of 4px.
| Name | Value | Token |
|------|-------|-------|
| xs | 4px | `--spacing-xs` |
| sm | 8px | `--spacing-sm` |
| md | 16px | `--spacing-md` |
| lg | 24px | `--spacing-lg` |
| xl | 32px | `--spacing-xl` |

### Border Radius
| Name | Value | Token |
|------|-------|-------|
| sm | 4px | `--radius-sm` |
| md | 8px | `--radius-md` |
| lg | 12px | `--radius-lg` |
| pill | 100px | `--radius-pill` |

---

## Components

### Primary Button
**Role:** Main CTA
- background: `{color.primary-500}` (#0074BD)
- color: `#ffffff`
- border-radius: `8px`
- font: `Inter`, 14px/500/1.5
- hover: background: `{color.primary-600}`
- active: background: `{color.primary-700}`

### Destructive Button
**Role:** Dangerous actions
- background: `{color.error-500}` (#EB5146)
- color: `#ffffff`
- border-radius: `8px`
- font: `Inter`, 14px/500/1.5

---

## Do's and Don'ts

### Do
- Use **Primary 500** for all main action buttons.
- Ensure all text uses **Inter** with a minimum line height of 1.5.
- Apply **8px border radius** to cards and standard buttons for consistency.
- Use **Neutral 50** for the main page background to reduce eye strain.
- Reserve **Secondary 500** for highlighting specific financial or status indicators.
- Use **Success 500** for positive confirmation messages.

### Don't
- Don't use Primary Blue for destructive actions; use **Error 500** instead.
- Avoid using pure black (`#000000`) for large blocks of body text; use **Neutral 800**.
- Don't mix different border radii on the same page; stick to the defined scale.
- Avoid tight line heights; always maintain the 150% ratio for Inter.

---

## Agent Prompt Guide

### Create a POS Dashboard Header
"Create a dashboard header using the Pos design system: background is Neutral 50, title is Heading 6 (20px Inter Semibold, color Neutral 800), and includes a Primary Button labeled 'New Sale' (Primary 500 background, 8px radius, Title 14 Medium text)."

---

## Quick Start

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary-500: #0074BD;
  --color-secondary-500: #E65100;
  --color-neutral-800: #333333;
  --color-neutral-50: #F7F7F7;
  --color-success: #13C05D;
  --color-error: #EB5146;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --text-h3: 40px;
  --text-body-md: 14px;
}
```
