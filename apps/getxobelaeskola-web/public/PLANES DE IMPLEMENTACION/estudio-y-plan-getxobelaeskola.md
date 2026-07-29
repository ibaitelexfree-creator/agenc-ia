# Estudio de rendimiento — getxobelaeskola.cloud
**Fuente:** PageSpeed Insights, 29 jul 2026 · Mobile (Moto G Power, Slow 4G, Lighthouse 13.4.1)
**URL auditada:** `https://www.getxobelaeskola.cloud/en/`

## 1. Resumen de puntuaciones

| Categoría | Score | Estado |
|---|---|---|
| Performance | **58** | 🔴 Crítico |
| Accessibility | 100 | ✅ |
| Best Practices | 100 | ✅ |
| SEO | 92 | 🟡 Un fix pendiente |
| Agentic Browsing | 3/3 | ✅ |

El único bloque realmente problemático es **Performance**. Accesibilidad y Best Practices están perfectos, así que el plan se centra casi enteramente en rendimiento, con un pequeño fix de SEO al final.

## 2. Core Web Vitals (mobile)

| Métrica | Valor | Objetivo | Diagnóstico |
|---|---|---|---|
| FCP (First Contentful Paint) | 1.2 s | <1.8s | ✅ OK |
| **LCP (Largest Contentful Paint)** | **10.2 s** | <2.5s | 🔴 **El problema principal** |
| TBT (Total Blocking Time) | 350 ms | <200ms | 🔴 Alto |
| CLS (Cumulative Layout Shift) | 0.011 | <0.1 | ✅ Excelente |
| Speed Index | 9.2 s | <3.4s | 🔴 Alto |

**Conclusión:** el layout no salta (CLS perfecto) y el primer pintado es rápido (FCP bueno), pero la página tarda muchísimo en quedar "usable" — hay demasiado JS bloqueando el hilo principal y recursos pesados (vídeos + imágenes) compitiendo por ancho de banda antes de que el contenido final se pinte.

## 3. Causas raíz identificadas

### 3.1 Payload total: 4,110 KiB — el verdadero cuello de botella
Esto es lo que más pesa en la carga:

| Recurso | Tamaño | Nota |
|---|---|---|
| `chunks/9335-fa8a4ecbe3596546.js` | **649.5 KiB** | Bundle JS enorme, sin source map |
| `videos/club_optimized.mp4` | 546.4 KiB | |
| `videos/club_optimized.webm` | 319.3 KiB | |
| `videos/equipos_optimized.webm` | 313.5 KiB | |
| `parallax/tierra.webp?v=5` | 186.5 KiB | ⚠️ Duplicado |
| `parallax/tierra.webp?v=3` | 186.5 KiB | ⚠️ Duplicado — **la misma imagen se descarga dos veces con distinto query param** |
| `parallax/velero.webp?v=3` | 155.3 KiB | Esta es la imagen LCP |
| `videos/cursos_optimized.webm` | 154.7 KiB | |
| `course-raquero-students.webp` | 137.5 KiB | |
| `videos/cursos_optimized.mp4` | 135.4 KiB | |

👉 Solo con eliminar el duplicado de `tierra.webp` (v3 vs v5) ya te ahorras ~186 KiB gratis. Parece que hay dos componentes/breakpoints pidiendo la misma imagen con distinta versión de caché.

👉 Los 5 vídeos suman **~1.47 MB** — casi el 36% del payload total. Hay que revisar si se cargan todos en el load inicial (probablemente el parallax de "home" los precarga todos aunque el usuario no llegue a esas secciones).

### 3.2 LCP breakdown (imagen "Velero navegando en Getxo")
| Fase | Duración |
|---|---|
| Time to First Byte | 380 ms |
| Resource load delay | 640 ms |
| Resource load duration | 680 ms |
| **Element render delay** | **1,230 ms** |

El "element render delay" es el tramo más largo: el navegador ya tiene la imagen descargada pero tarda en pintarla porque el hilo principal está ocupado ejecutando JS (coincide con el TBT alto y la ejecución de `chunks/3824...js`).

### 3.3 JavaScript — ejecución y bundle
- **Reducir ejecución de JS:** 1.9 s de CPU total. El chunk `3824-346aeaa4340ccbb8.js` es el más pesado: **2,180 ms de CPU**, 676 ms solo de evaluación.
- **JS legacy innecesario:** ~12 KiB desperdiciados en `chunks/1528...js` por transpilar a ES5 features que ya son baseline (`Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `String.prototype.trimStart/trimEnd`, clases, spread). Esto indica que el `browserslist` / target de compilación de Next.js está poniendo el listón muy bajo.
- **JS sin usar:** 34.5 KiB en `chunks/7217-097bab0b456d7134.js` no se ejecutan en esta página — candidato a code-splitting/lazy import.
- **Sin source map:** `chunks/9335...js` (el bundle de 649.5 KiB) no tiene source map, así que ni Lighthouse ni vosotros podéis saber qué librería es la culpable. Primer paso: identificarlo.

### 3.4 CSS render-blocking
Dos hojas de estilo bloquean el render inicial:
- `449ce2a2329e6aff.css` — 33.7 KiB, 450 ms, con **29.3 KiB de reglas sin usar**
- `3f3777d0c5f4be99.css` — 2.3 KiB, 450 ms

Además forman parte de la cadena crítica de dependencias (network dependency tree), con latencia máxima de **1,663 ms** solo para que llegue el CSS.

### 3.5 Forced reflows
JavaScript está leyendo propiedades geométricas (`offsetWidth` y similares) después de invalidar estilos, forzando recalcular el layout de forma síncrona:
- `layout-88f1ef185....js` → 233 ms de reflow forzado (dos puntos distintos del archivo)
- `chunks/3824-346aeaa4340ccbb8.js` → 68 ms + 17 ms
- Varios más pequeños en `page-0c42ec6c...js` y `chunks/8049...js`

Esto huele a los efectos de scroll/parallax o al flip-card 3D leyendo dimensiones en cada frame en vez de cachear el valor.

### 3.6 Animaciones no compuestas
**71 elementos animados** detectados que no corren en el compositor (GPU), es decir, se recalculan en el hilo principal. Con el uso intensivo de Framer Motion que ya tenéis (parallax, flip cards 3D, translateZ), es muy probable que varias animaciones estén tocando propiedades que disparan layout/paint (`width`, `top`, `left`) en lugar de solo `transform`/`opacity`.

### 3.7 SEO — canonical
Falta un `rel=canonical` válido apuntando a la ubicación hreflang correcta (`https://www.getxobelaeskola.cloud/en/`). Fix rápido y de bajo esfuerzo.

### 3.8 Cache
`cdn.equalweb.com/.../accessibility.js` (16 KiB, el widget de accesibilidad) ya cachea bien (25 días). No es prioritario, pero si podéis auto-hospedar ese script os ahorráis una conexión externa.

---

## 4. Plan de implementación

Priorizado por impacto estimado vs esfuerzo. Pensado para el stack actual (Next.js, monorepo `agenc-ia`, Framer Motion).

### Fase 0 — Quick wins (1 día, impacto alto/esfuerzo bajo)
1. **Eliminar la imagen duplicada `tierra.webp`** (v3 y v5): usar una única URL de imagen (invalidar caché con un solo `?v=` consistente en todos los componentes que la referencian). Ahorro inmediato ~186 KiB.
2. **Comprimir `tierra.webp` y el logo**: usar el mismo formato pero con mejor factor de compresión (objetivo: -42.9 KiB en tierra, -4.2 KiB en el logo). Revisar si se puede servir en AVIF con fallback webp.
3. **Añadir `rel=canonical`** correcto en el `<head>` de cada locale (`/en/`, y el resto de idiomas si existen), apuntando a su propia URL con `www.`.
4. **Preload de la imagen LCP** (`velero.webp`) con `<link rel="preload" as="image">` en el `<head>`, ya que tiene `fetchpriority="high"` pero aun así tarda 1,230 ms en pintarse tras descargarse — un preload adelanta el "resource load delay" de 640 ms.

### Fase 1 — Vídeos (2-3 días, impacto muy alto)
1. **Auditar qué vídeos se cargan en el load inicial de home.** Si el parallax carga los 5 vídeos (club, equipos, cursos en mp4+webm) de golpe aunque estén fuera del viewport, cambiar a:
   - `loading="lazy"` / `IntersectionObserver` para cargar cada vídeo solo cuando su sección esté a punto de entrar en pantalla.
   - `preload="none"` o `preload="metadata"` en el `<video>` en vez de `auto`.
2. **Reducir bitrate/resolución** de los `_optimized` — si ya pasaron por una pasada de optimización y aun así pesan 300-550 KiB, probablemente se pueden bajar más sin pérdida visual perceptible (target: <150 KiB c/u en móvil, sirviendo una versión de menor resolución para mobile vs desktop).
3. Considerar servir un **poster/thumbnail estático** con reproducción solo al hacer scroll o clic, en vez de autoplay en todas las secciones.

### Fase 2 — Bundle de JavaScript (3-4 días, impacto alto)
1. **Identificar `chunks/9335...js` (649.5 KiB)** — activar source maps en build (`productionBrowserSourceMaps: true` en `next.config.js`, aunque sea temporalmente) para ver qué librería es. Sospechosos habituales: alguna librería de mapas/3D, un SDK completo importado sin tree-shaking, o iconos/fuentes empaquetados enteros.
2. **Code-splitting / dynamic import** de todo lo que no sea crítico para el primer render: `next/dynamic` con `ssr: false` para componentes below-the-fold (flip cards, secciones de vídeo, widgets de terceros).
3. **Actualizar el target de compilación**: revisar `browserslist` en `package.json` — si no necesitáis soportar navegadores muy antiguos, subir el target elimina los polyfills de `Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, etc. (~12 KiB + menos parse time).
4. **Eliminar JS sin usar** de `chunks/7217...js` (34.5 KiB) — revisar si es una librería importada globalmente cuando solo se usa en una ruta/sección concreta.
5. **Revisar `chunks/3824...js`** (2,180 ms de CPU) — es el mayor consumidor de main-thread. Si contiene Framer Motion + lógica de parallax + flip cards todo junto, separarlo por sección con dynamic import.

### Fase 3 — CSS (1-2 días, impacto medio)
1. **Purgar CSS sin usar** en `449ce2a2329e6aff.css` (29.3 KiB de 32.9 KiB no se usan en esta página) — revisar configuración de Tailwind/PurgeCSS si aplica, para que solo incluya las clases realmente usadas por ruta.
2. **Inline del CSS crítico** above-the-fold y diferir el resto (`media="print" onload="this.media='all'"` o el propio mecanismo de Next.js con `next/head` + carga async) para no bloquear el render con las 2 hojas de estilo.

### Fase 4 — Reflows forzados y animaciones (2-3 días, impacto alto en TBT)
1. **Cachear lecturas de geometría**: revisar `layout-88f1ef185....js` y el código de parallax/scroll — si se lee `offsetWidth`/`getBoundingClientRect()` dentro de un handler de scroll o `requestAnimationFrame`, mover esas lecturas fuera del loop o cachearlas con `ResizeObserver` en vez de leer en cada frame.
2. **Auditar los 71 elementos animados**: para cada animación de Framer Motion, confirmar que solo anima `transform` y `opacity` (compuestas por GPU) y no `width`, `top`, `left`, `box-shadow`, etc. Usar `will-change: transform` con moderación (no en los 71 a la vez, o generará más coste que beneficio).
3. Revisar el flip-card 3D con `translateZ` — confirmar que el contenedor tiene `transform-style: preserve-3d` y `backface-visibility: hidden` para forzar la promoción a capa compuesta, y que no dispara reflow en cada frame del volteo.

### Fase 5 — Validación
1. Repetir la auditoría de PageSpeed Insights (mobile + desktop) tras cada fase para medir el delta real.
2. Objetivo final: Performance ≥ 90, LCP < 2.5s, TBT < 200ms, manteniendo el CLS actual (0.011) y los 100/100 de Accessibility y Best Practices.
3. SEO a 100 tras el fix de canonical.

## 5. Resumen de impacto esperado

| Fase | Esfuerzo | Ahorro estimado |
|---|---|---|
| 0 — Quick wins | ~1 día | ~230 KiB + fix SEO |
| 1 — Vídeos | 2-3 días | ~700 KiB-1 MB, mayor caída de TBT/LCP |
| 2 — Bundle JS | 3-4 días | ~80 KiB + reducción notable de TBT (bundle de 649 KiB es la incógnita más grande) |
| 3 — CSS | 1-2 días | ~450 ms de render-blocking + 29 KiB |
| 4 — Reflows/animaciones | 2-3 días | Reducción directa de TBT y del "element render delay" del LCP |

El mayor ROI está en **Fase 1 (vídeos)** y **Fase 2 (identificar el bundle de 649 KiB)** — son los dos elementos individuales más pesados del payload total y probablemente los responsables del salto de LCP a 10.2s.
