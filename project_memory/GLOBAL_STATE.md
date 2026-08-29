# GLOBAL STATE — Getxo Bela Eskola

## Recent Activity
- **Agent:** Antigravity / @[frontend-specialist]
- **Task:** Optimized video playback performance & eliminated video stuttering across homepage (`http://localhost:3000/en/`).
- **Changes:**
  - Optimized `CanvasBlobVideo` in `BlobCard.tsx` with pre-tokenized SVG paths, 30fps frame throttling, and `IntersectionObserver` off-screen auto-pause.
  - Added GPU hardware compositing hints (`will-change: transform`, `transform: translateZ(0)`) to `Section1Hero.tsx`.
- **Status:** COMPLETED & VERIFIED.