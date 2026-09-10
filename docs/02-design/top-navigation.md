# Top Navigation Rule

All pages must include the shared top navigation.

Implementation:
- Use `src/components/shared/TopNavigation.tsx`.
- The component is mounted globally in `src/app/layout.tsx`.
- Do not create page-specific duplicated top app bar markup.
- Existing page-level `<header>` elements are hidden globally so the shared top navigation stays consistent.

Required controls:
- Brand link: `K-Lingo Bridge`, routes to `/student/home`.
- Notification button.
- Settings button, routes to `/notification-settings`.
- Profile image button, routes to `/student/profile`.
- Menu button.

Canonical markup style:
- Sticky top bar.
- `bg-white/80`, `backdrop-blur-md`.
- Brand icon uses Material Symbol `language`.
- Brand text uses `font-display-lg text-headline-md font-bold text-primary`.
