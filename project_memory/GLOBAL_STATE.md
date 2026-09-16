# GLOBAL STATE - Getxo Bela Eskola

## Recent Activity
- **Agent:** Antigravity / @[frontend-specialist]
- **Task:** 
  1. Updated `/club/socias/` page Hero Title to "HAZTE SOCIA DEL CLUB" in a single line (replacing "Forma parte de <br /> nuestra tripulación").
  2. Updated translations in all supported languages (`es.json`, `eu.json`, `en.json`, `fr.json`).
  3. Ensured build and type checks pass cleanly.
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
