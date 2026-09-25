# GLOBAL STATE - Getxo Bela Eskola

## Recent Activity
- **Agent:** Antigravity / @[frontend-specialist]
- **Task:** Mobile Landscape Optimization for Section 2 (Identity) and Section 3 (Adapts)
  1. **Section 2 & 3 Responsive Media Queries:** Added `@media (max-width: 767px) and (orientation: landscape)` and `@media (max-height: 500px) and (orientation: landscape)` rules in `src/app/globals.css`.
  2. **Vertical Spacing & Font Scaling:**
     - Reduced excessive vertical margins, line-heights, gaps, and section paddings on small height landscape viewports (e.g. 586 x 320px).
     - Scaled font sizes dynamically using `clamp()` with `vh` units so titles, subtitles, text blocks, and "LEER MÁS" buttons fit compactly in a single view without overflowing.
     - Shifted text content blocks down by 10% (`transform: translateY(10%)`) in mobile landscape view as requested by user.
  3. **Components Updated:**
     - `src/components/sections/Section2Identity.tsx`
     - `src/components/home-prototypes/Section2Curved.tsx`
     - `src/components/sections/Section3Adapts.tsx`
     - `src/components/home-prototypes/Section3Curved.tsx`
     - `src/app/globals.css`
- **Status:** COMPLETED & VERIFIED.
  1. **Copia exacta de Home en Home 10:** Replicada la estructura completa de `page.tsx` original (metadatos multilingües en es/eu/en/fr, JsonLd, NativeAppRedirect, Hero con oleaje, todas las secciones y SEO).
  2. **Implantación del pergamino de Home 12 en Home 10:**
     - Rodillos de pergamino tan anchos como la pantalla (`100vw`).
     - Eliminado el recuadro amarillo, bordes y sombras intermedias.
     - Fondo beige puro `#F6F2EC` continuo con las secciones 2 y 3.
     - Sin mapa náutico exterior y sin estrella de mar.
     - **Mapa náutico interior**: Vive dentro del pergamino y se revela progresivamente según se desenrolla el rodillo inferior.
     - Muelle pausado y suave con inercia profunda (`stiffness: 45, damping: 20, mass: 1.8`), sin saltos bruscos.
     - Despliegue de opciones del árbol de cursos y avance de la línea náutica de puntos 100% sincronizados.
  3. **Verificación:** Probado vía HTTP con respuesta 200 OK y 0 errores de ESLint.
- **Status:** COMPLETED & VERIFIED.
  2. Implemented 4 distinct strategies to eradicate the 3px horizontal shadow/seam between Section 3 beige and Section 4 curved beige extension (`Section3To4CurvedExtension.tsx`):
     - Home 5: Removed SVG drop shadow and diffuse blur shadow layer.
     - Home 6: Negative vertical overlap (`top: -3px`) with upward coordinates.
     - Home 7: SVG geometric upward seal (`M 0,-6`) without translucid wake overlays.
     - Home 8: Combined full-seal method (`top: -4px`, `M 0,-6`, zero drop shadow, zero blur).
  3. Added numbered identification badges (1 to 8) to the organic bubble windows on Home 8:
     - Bubbles 1, 2, 3, 4 placed on Section 2.
     - Bubbles 5, 6, 7, 8 placed on Section 3.
  4. Adjusted bubble positions per user directive:
     - Bubble 1: moved 1% downwards (`cy: 10% -> 11%`).
     - Bubble 2: moved 4% right (`cx: 75% -> 79%`) and 6% upwards (`cy: 85% -> 79%`).
     - Bubble 3: moved 7% upwards (`cy: 85% -> 78%`).
     - Bubble 4: moved 2% right (`cx: 72% -> 74%`).
     - Bubble 5: moved 12% right (`cx: 42% -> 54%`) and 4% downwards (`cy: 10% -> 14%`).
     - Bubble 7: moved 30% downwards (`cy: 16% -> 46%`).
     - Bubble 8: reduced 20% in size (`rx: 64->51`, `ry: 56->45`), moved 25% right (`cx: 20% -> 45%`) and 12% upwards (`cy: 93% -> 81%`).
  5. Fixed mouse repulsion physics in Section 3/4:
     - Corrected swapped and outdated `basePositions` array in `Section3Curved.tsx` so calculation centers align 1:1 with actual rendered bubble SVG coordinates.
     - Added boundary detection to ignore cursor movements when the mouse is outside the beige area (e.g. over the video or adjacent sections).
     - Reduced repel radius to 135px with smooth distance scaling, eliminating ghost/phantom repulsion when moving through empty areas.
  6. Editorial & UI cleanup:
     - Centered the "LEER MÁS" CTA buttons in both curved sections across all viewports (desktop and mobile) instead of aligning them to the right/start.
     - Removed all temporary numeric badges (1-8) and wave emoji badges.
  7. Section 1 to 2 transition & Parallax bleed fix:
     - Root cause: Section 1's parallax layers (`layer2Y` sea and `layer3Y` sailboat) translate downwards up to +25% during scroll; standard `overflow: hidden` without hardware clipping allowed GPU compositor frames to bleed below the 100dvh boundary.
     - Solution:
       - Added `clipPath: 'inset(0)'`, `WebkitClipPath: 'inset(0)'`, `isolation: 'isolate'`, `contain: 'paint layout'`, and `transform: 'translateZ(0)'` to Section 1 hero.
       - Enforced stacking hierarchy in `HomePrototypeLayout.tsx` (`z-10` on Section 1, `z-20` on Section 2, `z-30` on the wave band).
       - Added `-mt-[1px]` to Section 2 to seal subpixel rendering gaps on high-DPI screens.
- **Status:** COMPLETED & VERIFIED.

## Previous Activity
- **Changes:**
  - Configured `CoursesListClient.tsx` grid to `grid-cols-1 min-[586px]:grid-cols-3`.
  - Ensures small mobile portrait (<586px) displays 1 card per row (`[ 1 ]`).
  - Ensures tablet/iPad portrait (>=586px, 768px, 820px) AND all landscape/desktop viewports display exactly 3 cards per row (`[ 1 ] [ 2 ] [ 3 ]`).
  - Removed "Nuestra Esencia / Lo que nos define" section from `src/app/[locale]/about/page.tsx` (`/es/club/conocenos/`).
  - Added new route `src/app/[locale]/club/instalaciones/page.tsx` with SEO metadata and cinematic header.
  - Implemented `src/components/facilities/FacilitiesBlobGallery.tsx` featuring 4 organic morphing liquid blobs: Nuestras Instalaciones, Pantalán Propio, Aulas and Aseos, each with Canvas 2D morphing interpolation and center-pull zoom effects on hover.
  - Updated Navbar (`src/components/layout/Navbar.tsx`) with `instalaciones` localized label and added it to the `club` dropdown in 2nd position between Conócenos and Club de socias (total 5 items).
  - Added full translation dictionaries `facilities_page` for all 4 languages (`es`, `eu`, `en`, `fr`).
- **Recent Improvements:**
  - Increased Canvas resolution to high-DPI 800x800 with vector coordinate scaling for crystal-clear blob borders and image clipping (eliminating pixelation).
  - Removed icon bubble emojis from the blobs for a pure, clean organic look.
  - Converted all facility titles ("Nuestras Instalaciones", "Pantalán Propio", "Aulas y Taller", "Aseos y Vestuarios") and descriptions to solid black/dark typography.
  - Adjusted Hero height to 100vh (`min-h-screen sm:min-h-[100dvh]`), preventing the next section from peeking in when opening the page.
  - Redesigned bottom CTA card with black typography, solid buttons, and strong volumetric shadow (`shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)]`) on pure white background.
- **Status:** COMPLETED & VERIFIED.

## Courses Catalog Reorganization & Price Table Modal
- **Agent:** Antigravity / @[frontend-specialist]
- **Task:** 
  1. Reorganized course catalog so ONLY requested courses exist in the requested order (Adults first).
  2. Implemented top-left "Tabla de Precios" button with modal popup (backdrop blur, click-outside dismissal matching Home's "Leer más" modals).
  3. Cleaned out unlisted courses including Titulín / Licencia de navegación.
- **Changes:**
  - Created `src/components/courses/PriceTableModal.tsx` with complete pricing breakdown (Cursos Cortos, Tecnificación continuo, Windsurf).
  - Updated `src/components/courses/CourseFilters.tsx` to include "Tabla de Precios" trigger on the top-left and updated category filters.
  - Updated `src/components/courses/CourseCard.tsx` with customized price labels (`precio_texto` / fallback), level chips, and responsive layout.
  - Reorganized `src/app/[locale]/courses/page.tsx` and `src/app/[locale]/courses/[slug]/page.tsx` with the exact 17 courses across 5 categories (`cursos-adults`, `cursos-jovenes`, `cursos-personalizados`, `windsurf`, `mantenimiento`).
  - Sincronizado `courses_data` en todos los idiomas (`messages/{es,eu,en,fr}.json`).
  - Corregido el nombre del curso a **"Iniciación J80"** (antes figuraba como "Crucero iniciación") en catálogo, fichas individuales y traducciones.
  - Eliminada la sección redundante de Newsletter (`NewsletterSection`) al final de la página de cursos para mantener únicamente la del pie de página global.
  - Convertidas las tarjetas de cursos (`CourseCard.tsx`) en enlaces completos: ahora cualquier clic en la imagen, título, descripción o cuerpo de la tarjeta navega directamente a los detalles del curso (`/${locale}/servicios/cursos/${course.slug}`).
- **Status:** COMPLETED & VERIFIED (Next.js build succeeded 0 errors).
