# Bottom Navigation Rule

All pages must include the shared bottom navigation.

Implementation:
- Use `src/components/shared/BottomNavigation.tsx`.
- The component is mounted globally in `src/app/layout.tsx`.
- Do not create page-specific duplicated bottom navigation markup.
- Add new navigation routes by updating `NAV_ITEMS` in `BottomNavigation.tsx`.
- Keep page content padded enough for the fixed 80px bottom bar.

Current tabs:
- 홈: `/student/home`
- 검색: `/student/search`
- 예약: `/student/booking`
- 채팅: `/student/chat`
- 마이: `/student/profile`
