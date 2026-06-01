# Responsive Layout Rule

All pages must support mobile, tablet, desktop, and Full HD screens.

Implementation rules:
- Build pages mobile-first, then expand layout at `sm`, `md`, `lg`, and `xl` breakpoints.
- Do not leave a full page locked to `max-w-md` on desktop unless it is a focused modal-like task screen.
- For normal app pages, use a responsive canvas such as `w-full max-w-[1200px]` or `max-w-7xl mx-auto`.
- On Full HD screens, page content should use available width without stretching text into unreadable lines.
- Prefer responsive grids:
  - Mobile: 1 column
  - Tablet: 2 columns when content supports it
  - Desktop and Full HD: 3-4 columns for repeated cards or dashboard groups
- Shared top and bottom navigation must remain globally mounted.
- Do not add page-specific duplicated top or bottom navigation.

Global safeguards:
- `src/app/globals.css` expands common `main.max-w-md`, `main.max-w-lg`, `main.max-w-xl`, and `main.max-w-2xl` layouts on desktop.
- Desktop horizontal padding uses `clamp(32px, 4vw, 64px)`.
- The shared top navigation uses the same desktop padding.

When adding or editing a page:
- Check the page at mobile width around `390px`.
- Check the page at desktop width around `1440px`.
- Check the page at Full HD width `1920px`.
- Make sure text does not overlap and fixed bottom navigation does not cover primary actions.
