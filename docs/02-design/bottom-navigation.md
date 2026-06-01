# Bottom Navigation Rule

All pages must include the shared bottom navigation.

Implementation:
- Use `src/components/shared/BottomNavigation.tsx`.
- The component is mounted globally in `src/app/layout.tsx`.
- Do not create page-specific duplicated bottom navigation markup.
- Add new navigation routes by updating `NAV_ITEMS` in `BottomNavigation.tsx`.
- Keep page content padded enough for the fixed 80px bottom bar.

Current tabs:
- 홈: `/home`
- 검색: `/search`
- 예약: `/my-bookings`
- 채팅: `/chat`
- 마이: `/profile-setup`
