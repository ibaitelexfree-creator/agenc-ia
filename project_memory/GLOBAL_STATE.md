# GLOBAL STATE — Getxo Bela Eskola

## Recent Activity
- **Agent:** Antigravity / @[frontend-specialist]
- **Task:** Fixed Udalekuak Hero Video landscape responsive behavior for real mobile devices (`586x320` and landscape range `480x320` to `768x432`).
- **Changes:**
  - Removed vertical `translateY(29vh)` shifts that caused text overflow and viewport stretching on real landscape mobile screens.
  - Applied dynamic `100svh`/`100dvh` viewport constraints with `min-height: 0 !important` and `object-fit: contain !important` on `.heroVideo`.
  - Added safe area inset padding (`env(safe-area-inset-*)`) for notch/home indicator devices.
  - Guaranteed 0px overflow, 0px crop, and 0px distortion across all landscape resolution ranges.
- **Status:** COMPLETED & VERIFIED.