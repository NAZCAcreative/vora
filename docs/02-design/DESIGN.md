---
name: Vibrant K-Learn
colors:
  surface: '#f8f9fe'
  surface-dim: '#d8dadf'
  surface-bright: '#f8f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f8'
  surface-container: '#0e131fff'
  surface-container-high: '#e7e8ed'
  surface-container-highest: '#e1e2e7'
  on-surface: '#191c1f'
  on-surface-variant: '#484555'
  inverse-surface: '#2e3134'
  inverse-on-surface: '#eff0f5'
  outline: '#797587'
  outline-variant: '#c9c4d8'
  surface-tint: '#603ce2'
  primary: '#5e39e0'
  on-primary: '#ffffff'
  primary-container: '#7757fa'
  on-primary-container: '#fffbff'
  inverse-primary: '#cabeff'
  secondary: '#b9045e'
  on-secondary: '#ffffff'
  secondary-container: '#fe4a91'
  on-secondary-container: '#59002a'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#4816cb'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c6'
  on-secondary-fixed: '#3f001b'
  on-secondary-fixed-variant: '#8e0046'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9fe'
  on-background: '#191c1f'
  surface-variant: '#e1e2e7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  gutter-md: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-gap: 32px
---

## Brand & Style

The design system is centered on a **Modern & Friendly** aesthetic tailored for a Korean language learning platform. It targets a global audience that values both educational rigor and cultural engagement. The personality is optimistic, encouraging, and highly polished, bridging the gap between a professional educational tool and a lifestyle entertainment app.

The visual style utilizes **Corporate Modern** foundations—clear hierarchy and structured layouts—infused with **Soft Minimalism** and subtle **Glassmorphism**. Key elements include:
- **Optimistic Gradients:** Use of vibrant purple-to-pink transitions to signify progress and energy.
- **High Legibility:** A focus on bilingual clarity where Korean and English (or other languages) coexist harmoniously.
- **Soft Touch:** Extensive use of rounded corners and generous whitespace to reduce "learning fatigue" and make the interface feel approachable.

---

## Colors

The palette is driven by a high-energy primary purple, supported by a warm pink used for accents and celebratory moments.

- **Primary (#7C5CFF):** Used for main actions, active states, and brand-defining moments.
- **Secondary (#FF4B91):** Used for "high-emotion" interactions like heart icons, success states, and decorative gradients.
- **Neutral (#F8F9FE):** A cool-toned off-white used for backgrounds to allow the vibrant primary colors and user photos to pop without creating harsh contrast.
- **Semantic Colors:**
  - **Success:** Soft teal/green for completed lessons.
  - **Warning:** Soft amber for expiring subscriptions or upcoming deadlines.
  - **Error:** Clean red for missed sessions or input errors.

---

## Typography

This design system uses **Plus Jakarta Sans** for headlines to provide a modern, friendly geometric feel that scales well. **Be Vietnam Pro** is used for body and labels due to its exceptional legibility and contemporary humanist characteristics, which pair well with the rounded nature of Hangul (Korean) characters.

- **Korean Character Support:** Ensure all chosen fonts are implemented with a fall-back to a high-quality Gothic (Sans-serif) font like **Pretendard** or **Noto Sans KR** for native-level character balance.
- **Hierarchy:** Use font weight rather than just size to distinguish between content types. Headlines should be bold (`700`) to stand out against soft backgrounds.

---

## Layout & Spacing

The layout utilizes a **Fluid Grid** model with strict horizontal margins to ensure content remains readable on all mobile device widths.

- **Mobile (Default):** 4-column grid with 20px side margins and 16px gutters.
- **Tablet:** 8-column grid with 40px margins.
- **Desktop:** 12-column grid with a max-width of 1200px.

**Spacing Philosophy:**
- Use an 8px base unit system.
- Card padding should be a minimum of 16px to ensure touch targets are comfortable.
- Vertical rhythm is maintained through `stack-md` (16px) for related elements and `section-gap` (32px) between distinct content blocks.

---

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

| Level | Element | Style |
|-------|---------|-------|
| 0 | Background | `#F8F9FE` neutral |
| 1 | Cards | White + `box-shadow: 0px 4px 20px rgba(0,0,0,0.04)` |
| 2 | Active / Modals | Deeper shadow + 1px border `#F1F1F1` |
| — | CTA Depth | Primary gradient draws eye to "Next Step" |

---

## Shapes

The design system adopts a **Rounded** shape language to reinforce the friendly and approachable brand personality.

| Element | Radius |
|---------|--------|
| Buttons & Main Cards | `1rem` (16px) |
| Small Chips & Tags | `0.5rem` or pill (`9999px`) |
| Input Fields | `0.75rem` (12px) |
| Profile images / Thumbnails | `rounded-lg` or `rounded-xl` |

---

## Components

### Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | Gradient (Purple → Pink) | White | — |
| Secondary | White | Primary Purple | 1.5px Primary Purple |
| Ghost | None | Primary Purple | — |

### Cards (The "Learning Block")

- White background
- 16–20px internal padding
- `rounded-lg` corners
- Subtle drop shadow (`0px 4px 20px rgba(0,0,0,0.04)`)

### Chips & Badges

- Semi-transparent primary/secondary (10% opacity bg, 100% opacity text)
- Examples: `TOPIK II`, `Speaking`, `Beginner`

### Input Fields

- Background `#F1F3F9` or white with light border
- Floating labels or bold header labels above the field
- Border radius: `0.75rem`

### Progress Indicators

- Progress bars: primary gradient fill
- Circular progress rings: lesson completion percentage on dashboard
- Success states: soft teal/green accent
