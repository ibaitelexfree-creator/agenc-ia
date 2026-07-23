# Plan de Implementación Hiperdetallado — Background Remover Pro
### Ubicación: `apps/inmobiliaria-demo/app/background-remover`
### Nivel de detalle: Atómico (cada tarea es ejecutable sin ambigüedad)
### Hardware objetivo: ASUS ROG Strix 16 · RTX 4080 (aprovechado vía WebGL2/WebGPU en navegador)

---

## 0. RESUMEN EJECUTIVO

Herramienta web de remoción de fondo basada en **chroma/threshold keying manual** (no IA/segmentación automática), con control total sobre el color objetivo, tolerancias independientes por encima/por debajo del color, selección de zonas específicas de la imagen, historial completo de undo/redo, galería de versiones, e importación/exportación. Todo el procesamiento de píxeles se ejecuta **en GPU vía shaders WebGL2** para permitir preview en tiempo real incluso en imágenes de alta resolución (4K–8K), aprovechando la RTX 4080.

No es un MVP: es una herramienta de nivel "profesional de escritorio" (tipo Photoshop "Color Range" + "Chroma Key") corriendo 100% client-side en Next.js.

---

## 1. OBJETIVOS Y ALCANCE

### 1.1 Requisitos funcionales (extraídos literalmente del pedido del usuario)

| # | Requisito | Detalle técnico derivado |
|---|-----------|---------------------------|
| R1 | Quitar background de una imagen | Algoritmo de keying por color + máscara alpha |
| R2 | Varios potenciómetros (sliders) para ajustar rango de color | Sliders independientes: tolerancia inferior y superior |
| R3 | Elegir un color (ej. negro) y ajustar cuánto por arriba/abajo será el threshold | Modelo de tolerancia asimétrica en espacio HSL, no solo RGB |
| R4 | Preset Chroma `#00FF00` y preset Negro `#000000` | Botones de preset + color picker libre + eyedropper |
| R5 | Seleccionar un área de la imagen y aplicar el efecto solo ahí | Sistema de máscara de selección (rectángulo, lazo, elipse) combinable con la máscara de color |
| R6 | Aplicar por zonas pequeñas o toda la imagen a la vez | El motor de keying siempre respeta la "máscara de selección activa"; si no hay selección, aplica a 100% del lienzo |
| R7 | Botón deshacer/rehacer ilimitado | Command Stack (patrón Memento/Command) con snapshots de máscara comprimidos |
| R8 | Botón descargar | Export PNG con canal alpha, más export de la máscara sola (opcional) |
| R9 | Botón importar foto | File input + drag&drop + paste (Ctrl+V) |
| R10 | Ver fotos pasadas | Galería de sesiones persistida en IndexedDB (no localStorage, por límite de tamaño) |
| R11 | Perfección, inteligencia, configurabilidad | Presets guardables, auto-detección de color dominante de fondo, modo "smart edge" (feathering + spill suppression), atajos de teclado, comparación antes/después |

### 1.2 No-objetivos (para no desviar el scope)
- No se implementa segmentación por IA/ML (rembg, U2Net, etc.) — es 100% keying manual por color, tal como pidió el usuario.
- No se requiere backend: todo corre client-side (Canvas/WebGL). Esto es intencional para performance y privacidad.

---

## 2. STACK TECNOLÓGICO Y JUSTIFICACIÓN

| Capa | Tecnología | Justificación |
|------|-----------|----------------|
| Framework | Next.js 14 (App Router), igual que `apps/inmobiliaria-demo` | Consistencia con el resto del monorepo |
| Lenguaje | TypeScript estricto (`strict: true`) | Cero `any`, tipado atómico de cada estructura de datos |
| Renderizado de imagen | **WebGL2** (fallback a Canvas2D si WebGL2 no disponible) | Permite recalcular la máscara de color en tiempo real (60fps) usando la GPU (RTX 4080) mientras el usuario mueve los sliders, sin recorrer píxeles en JS |
| Estado global | **Zustand** con middleware `temporal` (zundo) para undo/redo | Zustand ya minimiza boilerplate; `zundo` da undo/redo "gratis" con control de qué partes del store se versionan |
| Persistencia de galería | **IndexedDB** vía `idb` (wrapper) | localStorage tiene límite ~5MB; IndexedDB soporta Blobs grandes (imágenes) sin problema |
| UI Components | Componentes propios + Radix UI primitives (Slider, Popover, Tooltip, Dialog) | Accesibilidad gratis, estilo custom con Tailwind |
| Estilos | Tailwind CSS + variables CSS custom (tema oscuro/neón, consistente con inmobiliaria-demo) | Igual que el resto del proyecto |
| Manipulación de color | Conversión RGB↔HSL propia (sin librerías externas, para controlar precisión) | Necesitamos tolerancias asimétricas por canal H/S/L |
| Web Workers | 1 worker dedicado para: (a) generar thumbnails de galería, (b) exportar PNG final en full-res sin bloquear UI | Evita jank en imágenes grandes |
| Testing | Vitest (unit, para funciones de color/máscara) + Playwright (e2e, flujo completo) | Cobertura de algoritmos críticos + regresión visual |

---

## 3. ARQUITECTURA GENERAL

```
┌──────────────────────────────────────────────────────────────────┐
│                         page.tsx (Route)                         │
│  Orquesta layout: Sidebar Izq (Herramientas) | Canvas Central |  │
│  Sidebar Der (Galería/Historial)                                  │
└───────────────────────────────┬────────────────────────────────┘
                                 │
                 ┌───────────────┼────────────────┐
                 ▼               ▼                ▼
        ┌────────────────┐ ┌───────────┐ ┌──────────────────┐
        │  useEditorStore │ │ CanvasStage│ │ GalleryPanel      │
        │  (Zustand+zundo)│ │ (WebGL2)   │ │ (IndexedDB reads) │
        └────────┬────────┘ └─────┬─────┘ └─────────┬─────────┘
                 │                │                  │
        ┌────────▼────────┐ ┌─────▼──────┐  ┌────────▼─────────┐
        │ maskEngine.ts    │ │ glRenderer │  │ galleryDB.ts      │
        │ (CPU fallback +  │ │ .ts        │  │ (idb wrapper)     │
        │ region ops)      │ │ (shaders)  │  │                    │
        └──────────────────┘ └────────────┘  └────────────────────┘
```

### 3.1 Principio de capas (layers) del lienzo

El canvas visual se compone conceptualmente de 4 capas, compuestas en el shader final:

1. **Capa Base (Original Image)** — textura RGBA de la imagen importada, inmutable.
2. **Capa de Máscara Acumulada (Alpha Mask)** — textura de un canal (R32F o R8), valores 0.0–1.0, donde 0 = transparente, 1 = opaco. Se actualiza con cada "aplicación" confirmada por el usuario.
3. **Capa de Preview en vivo** — máscara temporal calculada en tiempo real mientras el usuario mueve sliders, ANTES de confirmar (no se aplica a la capa 2 hasta que el usuario haga click en "Aplicar").
4. **Capa de Selección de Región** — máscara binaria (rectángulo/lazo) que limita dónde puede actuar la capa 3.

Fórmula de composición final por píxel (en el fragment shader):

```
maskFinal = mix(maskAcumulada, maskPreviewCombinada, uPreviewActivo)
maskPreviewCombinada = mix(maskAcumulada, maskColorKey, regionSelectMask)
colorSalida.rgb = colorOriginal.rgb
colorSalida.a   = colorOriginal.a * maskFinal
```

---

## 4. ESTRUCTURA DE CARPETAS Y ARCHIVOS

```
apps/inmobiliaria-demo/
└── app/
    └── background-remover/
        ├── page.tsx                         # Entry point de la ruta
        ├── layout.tsx                       # (opcional) metadata de la página
        │
        ├── components/
        │   ├── CanvasStage.tsx               # Contenedor del <canvas> WebGL2 + overlay SVG de selección
        │   ├── Toolbar/
        │   │   ├── ToolbarRoot.tsx
        │   │   ├── ImportButton.tsx
        │   │   ├── ExportButton.tsx
        │   │   ├── UndoRedoButtons.tsx
        │   │   └── ToolModeSwitch.tsx        # Eyedropper | Selección Rect | Selección Lazo | Pan/Zoom
        │   │
        │   ├── ColorPanel/
        │   │   ├── ColorPanelRoot.tsx
        │   │   ├── PresetButtons.tsx         # Chroma verde / Negro / Custom
        │   │   ├── ColorSwatchPicker.tsx     # <input type=color> + hex input
        │   │   ├── EyedropperButton.tsx      # usa EyeDropper API nativa + fallback manual
        │   │   ├── ToleranceSliders.tsx      # los "potenciómetros"
        │   │   ├── AdvancedChannelSliders.tsx# H/S/L individuales (modo avanzado)
        │   │   ├── FeatherSlider.tsx         # suavizado de bordes
        │   │   └── SpillSuppressSlider.tsx   # des-tiñe bordes verdes/negros residuales
        │   │
        │   ├── SelectionTools/
        │   │   ├── RectSelectOverlay.tsx
        │   │   ├── LassoSelectOverlay.tsx
        │   │   ├── EllipseSelectOverlay.tsx
        │   │   └── SelectionActionsBar.tsx   # Aplicar a selección / Invertir / Limpiar selección
        │   │
        │   ├── HistoryPanel/
        │   │   ├── HistoryPanelRoot.tsx      # Lista de pasos (deshacer específicos)
        │   │   └── HistoryStepItem.tsx
        │   │
        │   ├── GalleryPanel/
        │   │   ├── GalleryPanelRoot.tsx      # Lista de imágenes/proyectos pasados
        │   │   ├── GalleryThumbnail.tsx
        │   │   └── GalleryEmptyState.tsx
        │   │
        │   ├── CompareSlider.tsx             # Antes/Después con divisor arrastrable
        │   └── StatusBar.tsx                 # zoom %, dimensiones, color bajo el cursor
        │
        ├── engine/
        │   ├── color/
        │   │   ├── colorSpace.ts             # rgbToHsl, hslToRgb, rgbToLab (para distancia perceptual)
        │   │   ├── colorDistance.ts          # distancia euclidiana RGB, distancia HSL asimétrica, deltaE (Lab)
        │   │   └── presets.ts                # CHROMA_GREEN, PURE_BLACK, etc.
        │   │
        │   ├── mask/
        │   │   ├── maskTypes.ts              # tipos: ColorKeySettings, RegionSelection, MaskLayer
        │   │   ├── maskEngine.ts             # aplica color-key sobre un ImageData (fallback CPU)
        │   │   ├── regionMask.ts             # rasteriza selección (rect/lazo/elipse) a máscara binaria
        │   │   ├── featherMask.ts            # aplica blur gaussiano al borde de la máscara (suavizado)
        │   │   └── spillSuppress.ts          # neutraliza tinte de color residual en bordes
        │   │
        │   ├── gl/
        │   │   ├── glContext.ts              # inicialización WebGL2, manejo de pérdida de contexto
        │   │   ├── shaders/
        │   │   │   ├── vertex.glsl.ts
        │   │   │   ├── colorKey.frag.glsl.ts # shader principal de keying
        │   │   │   ├── feather.frag.glsl.ts  # shader de blur de máscara (2-pass gaussian)
        │   │   │   └── composite.frag.glsl.ts# shader de composición final de capas
        │   │   ├── glRenderer.ts             # clase GLRenderer: sube texturas, ejecuta draw calls
        │   │   └── glTextureUtils.ts
        │   │
        │   ├── history/
        │   │   ├── commandStack.ts           # Command Pattern genérico (execute/undo/redo)
        │   │   └── commands/
        │   │       ├── ApplyColorKeyCommand.ts
        │   │       ├── ApplyRegionMaskCommand.ts
        │   │       ├── ImportImageCommand.ts
        │   │       └── ResetCommand.ts
        │   │
        │   └── io/
        │       ├── imageImport.ts            # decode File -> HTMLImageElement -> ImageBitmap
        │       ├── imageExport.ts            # canvas -> PNG blob (usa OffscreenCanvas + worker)
        │       ├── galleryDB.ts              # IndexedDB CRUD (idb wrapper)
        │       └── exportWorker.ts           # Web Worker: export en full-res sin bloquear main thread
        │
        ├── store/
        │   ├── useEditorStore.ts             # Zustand store principal + zundo (undo/redo)
        │   ├── selectors.ts                  # selectors memoizados
        │   └── types.ts                      # EditorState, ToolMode, etc.
        │
        ├── hooks/
        │   ├── useCanvasInteraction.ts        # pan, zoom, click-to-pick-color, drag-to-select
        │   ├── useKeyboardShortcuts.ts        # Ctrl+Z, Ctrl+Y, Ctrl+V (paste), Delete
        │   ├── useEyedropper.ts               # wrapper de EyeDropper API + fallback
        │   └── useImageDropzone.ts            # drag & drop de archivos
        │
        └── styles/
            └── background-remover.module.css  # patrón de "checkerboard" transparencia, etc.
```

**Total estimado:** ~45 archivos atómicos, cada uno con responsabilidad única (Single Responsibility).

---

## 5. MODELO DE DATOS (TypeScript — definiciones exactas)

```typescript
// store/types.ts

export type RGB = { r: number; g: number; b: number };       // 0-255 cada canal
export type HSL = { h: number; s: number; l: number };        // h:0-360, s/l:0-100

export type ColorPreset = 'chroma-green' | 'pure-black' | 'custom';

export interface ToleranceSettings {
  /** Distancia permitida por DEBAJO del color objetivo (más oscuro / menos saturado) */
  lowerTolerance: number;   // 0-100
  /** Distancia permitida por ENCIMA del color objetivo (más claro / más saturado) */
  upperTolerance: number;   // 0-100
  /** Modo de cálculo de distancia */
  distanceMode: 'rgb-euclidean' | 'hsl-weighted' | 'lab-deltaE';
  /** Pesos individuales por canal (solo si distanceMode === 'hsl-weighted') */
  channelWeights: { h: number; s: number; l: number };
}

export interface FeatherSettings {
  radiusPx: number;         // 0-30, radio del blur gaussiano en el borde de la máscara
  contrast: number;         // 0-100, endurece/suaviza la transición del borde
}

export interface SpillSuppressSettings {
  enabled: boolean;
  strength: number;         // 0-100
  targetColor: RGB;         // normalmente igual al color-key activo
}

export interface ColorKeySettings {
  id: string;                       // uuid
  preset: ColorPreset;
  targetColor: RGB;                 // color base elegido (ej. #000000)
  tolerance: ToleranceSettings;
  feather: FeatherSettings;
  spill: SpillSuppressSettings;
}

export type RegionShape = 'rectangle' | 'ellipse' | 'lasso' | 'none';

export interface RegionSelection {
  shape: RegionShape;
  /** Coordenadas normalizadas (0-1) relativas a la imagen original, no al canvas en pantalla */
  points: Array<{ x: number; y: number }>;
  feather: number;          // difuminado del borde de la selección misma
  inverted: boolean;
}

export interface HistoryStepMeta {
  id: string;
  label: string;             // ej. "Chroma key aplicado en selección #2"
  timestamp: number;
  thumbnailDataUrl: string;  // snapshot pequeño (64x64) para el panel de historial
  colorKeySettings: ColorKeySettings;
  region: RegionSelection | null;
}

export interface GalleryEntry {
  id: string;
  createdAt: number;
  updatedAt: number;
  originalImageBlob: Blob;
  currentMaskBlob: Blob | null;   // última máscara alpha aplicada (R8 PNG)
  thumbnailDataUrl: string;
  name: string;
  historySteps: HistoryStepMeta[];
}

export type ToolMode =
  | 'pan'
  | 'eyedropper'
  | 'select-rect'
  | 'select-ellipse'
  | 'select-lasso'
  | 'compare';

export interface EditorState {
  // Imagen actual
  currentImageBitmap: ImageBitmap | null;
  currentImageWidth: number;
  currentImageHeight: number;
  currentGalleryEntryId: string | null;

  // Herramienta activa
  toolMode: ToolMode;

  // Configuración de color-key EN EDICIÓN (preview, no confirmada)
  draftColorKey: ColorKeySettings;

  // Selección de región activa
  activeRegion: RegionSelection | null;

  // Máscara acumulada confirmada (se versiona con zundo)
  confirmedMaskVersion: number;   // referencia a textura GPU, no se serializa completa en cada undo step

  // Zoom / Pan
  zoom: number;
  panX: number;
  panY: number;

  // UI
  isGalleryPanelOpen: boolean;
  isHistoryPanelOpen: boolean;
  isComparing: boolean;
}
```

---

## 6. ALGORITMOS CORE (detalle atómico, con fórmulas exactas)

### 6.1 Conversión RGB → HSL (base para todo el sistema de tolerancias)

Archivo: `engine/color/colorSpace.ts`

```
Dado r,g,b en [0,255]:
  r' = r/255, g' = g/255, b' = b/255
  max = max(r',g',b'), min = min(r',g',b')
  Δ = max - min
  L = (max + min) / 2

  Si Δ == 0:  H = 0, S = 0
  Si no:
    S = Δ / (1 - |2L - 1|)
    H = calcular según cuál canal es max (fórmula estándar de 60° por sector)

  Retornar {h: H*360, s: S*100, l: L*100}
```
Implementar también `hslToRgb` (inverso exacto) para reconstrucción y para pintar el color picker.

### 6.2 Distancia de color — 3 modos configurables

**Modo A — RGB Euclidiana simple** (rápido, poco perceptual):
```
distance = sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²) / 441.67   // normalizado 0-1 (441.67 = sqrt(255²*3))
```

**Modo B — HSL ponderado (recomendado, el que pidió el usuario: "arriba/abajo" asimétrico)**:
```
ΔH = min(|h1-h2|, 360-|h1-h2|) / 180      // distancia circular normalizada
ΔS = |s1-s2| / 100
ΔL = (l1 - l2) / 100                      // SIN valor absoluto: signo importa

Si ΔL < 0  → el píxel es MÁS OSCURO que el target → comparar contra lowerTolerance
Si ΔL >= 0 → el píxel es MÁS CLARO que el target → comparar contra upperTolerance

distanciaCombinada = wH*ΔH + wS*ΔS + wL*|ΔL|   (pesos configurables, default wH=0.3 wS=0.3 wL=0.4)
```
Esta es la clave de la funcionalidad pedida: *"cuánto por arriba y cuánto por abajo"*. La tolerancia efectiva a usar en el umbral depende del signo de ΔL (más clara vs más oscura que el target).

**Modo C — Lab + Delta E** (máxima fidelidad perceptual, más costoso, ideal para bordes de pelo/humo):
```
1. RGB -> XYZ (matriz sRGB estándar D65)
2. XYZ -> Lab (fórmulas CIE estándar)
3. ΔE76 = sqrt((L1-L2)² + (a1-a2)² + (b1-b2)²)
4. Normalizar ΔE a 0-1 dividiendo por 100 (rango práctico)
```

### 6.3 Función de pertenencia a la máscara (umbral suave, no binario)

Para evitar bordes "dentados" (jaggies), no usamos un corte binario sino una rampa suave tipo "smoothstep":

```
umbralEfectivo = (ΔL < 0) ? lowerTolerance : upperTolerance    // normalizado 0-1

alpha_mask(pixel) =
  Si distanciaCombinada <= umbralEfectivo * (1 - featherZone):
      0.0   // completamente transparente (es "background")
  Si distanciaCombinada >= umbralEfectivo:
      1.0   // completamente opaco (es "foreground")
  Si no (zona de transición):
      smoothstep(umbralEfectivo*(1-featherZone), umbralEfectivo, distanciaCombinada)

donde smoothstep(a,b,x) = t² * (3 - 2t), con t = clamp((x-a)/(b-a), 0, 1)
```

`featherZone` es controlado por el slider "Feather" (0-30px convertido a proporción del umbral).

### 6.4 Selección de región → máscara de región

Archivo: `engine/mask/regionMask.ts`

- **Rectángulo**: dado (x0,y0)-(x1,y1) normalizados, rasterizar un cuadrado con antialiasing en el borde (1-2px de transición smoothstep, más el `region.feather` configurado).
- **Elipse**: ecuación `((x-cx)/rx)² + ((y-cy)/ry)² <= 1`, con smoothstep en el borde igual que arriba.
- **Lazo (lasso)**: polígono libre dibujado por el usuario (array de puntos). Rasterizar con algoritmo *even-odd rule* (point-in-polygon) por píxel, o —más eficiente en GPU— renderizar el polígono como triángulos (fan triangulation) a un stencil buffer WebGL2 y leerlo como textura de máscara.
- Todas las máscaras de región soportan `inverted: boolean` (aplicar a todo MENOS la selección).

### 6.5 Combinación de máscaras (composición final)

```
maskFinal(pixel) = maskAcumuladaPrevia(pixel) AND-blend [
    maskColorKey(pixel) SOLO SI maskRegion(pixel) > 0
]

// En términos de alpha compositing:
resultado = maskAcumuladaPrevia * (1 - maskRegion) + 
            min(maskAcumuladaPrevia, maskColorKey) * maskRegion
```
Esto garantiza que el color-key **solo afecte los píxeles dentro de la región seleccionada**, dejando el resto de la máscara acumulada intacta — exactamente el requisito R5/R6 ("atacar por zonas o toda la imagen").

### 6.6 Feathering de máscara (suavizado de bordes)

Archivo: `engine/mask/featherMask.ts` + shader `feather.frag.glsl.ts`

Blur gaussiano de 2 pasadas (horizontal + vertical) sobre la textura de máscara de 1 canal, kernel de radio configurable (`FeatherSettings.radiusPx`), implementado en GPU para performance:

```glsl
// Pseudocódigo del fragment shader (pasada horizontal, la vertical es análoga)
float sum = 0.0;
float weightSum = 0.0;
for (int i = -RADIUS; i <= RADIUS; i++) {
  float weight = gaussian(float(i), sigma);
  sum += texture(uMask, vUv + vec2(float(i)/uTextureWidth, 0.0)).r * weight;
  weightSum += weight;
}
outColor = vec4(sum / weightSum);
```

### 6.7 Spill Suppression (des-tinte de bordes)

Cuando se usa chroma verde, los bordes del sujeto suelen quedar teñidos de verde. Algoritmo estándar de la industria (adaptado):

```
Para cada píxel con alpha en zona de transición (0 < alpha < 1):
  Si canal G > max(canal R, canal B) * (1 + spillStrength):
      G_nuevo = max(R, B)   // recorta el exceso de verde
  colorFinal = mix(colorOriginal, colorDesaturado, spillStrength * (1-alpha))
```
Generalizar a cualquier `targetColor`, no solo verde: se resta el "exceso" del canal dominante del color objetivo.

---

## 7. RENDERIZADO GPU — WEBGL2 (uso explícito de la RTX 4080)

### 7.1 Por qué WebGL2 y no solo Canvas2D + `ImageData`

Procesar un `ImageData` en el CPU (JS puro) para una imagen de 6000×4000px = 24M píxeles, recalculando en cada frame mientras el usuario arrastra un slider, es inviable a 60fps en el hilo principal. Con WebGL2:
- La imagen se sube UNA vez a una textura GPU.
- Cada movimiento de slider solo actualiza **uniforms** (variables escalares: tolerancia, color objetivo) — no vuelve a subir textura.
- El fragment shader recalcula la máscara para los 24M píxeles en paralelo en la GPU, en <2ms en una RTX 4080.

### 7.2 Pipeline de renderizado (draw calls por frame)

```
1. [Textura] uImageTexture      ← imagen original (subida 1 vez al importar)
2. [Textura] uAccumulatedMask   ← máscara confirmada (Framebuffer Object, se re-renderiza SOLO al confirmar un paso)
3. [Textura] uRegionMask        ← máscara de selección activa (se recalcula al mover el rect/lazo)
4. [Pass 1]  colorKey.frag.glsl → calcula maskColorKey en un FBO temporal (usa uniforms de tolerancia/color)
5. [Pass 2]  feather.frag.glsl  → blur horizontal + vertical sobre el FBO de Pass 1 (2 draw calls)
6. [Pass 3]  composite.frag.glsl→ combina uAccumulatedMask + maskColorKey_feathered + uRegionMask → renderiza a canvas visible
```

### 7.3 Manejo de pérdida de contexto WebGL

`glContext.ts` debe registrar listeners `webglcontextlost` / `webglcontextrestored` y re-subir todas las texturas desde el estado en memoria (el `ImageBitmap` original y los snapshots de máscara siempre viven también en CPU/IndexedDB como respaldo).

### 7.4 Fallback sin WebGL2

Si `canvas.getContext('webgl2')` retorna `null` (navegador viejo o GPU deshabilitada), usar `maskEngine.ts` (CPU, `ImageData` + `Uint8ClampedArray`), con throttling (procesar preview cada 100ms en vez de cada frame) y un aviso visual "Modo compatibilidad: rendimiento reducido".

---

## 8. SISTEMA DE UNDO/REDO (Command Pattern) — detalle atómico

Archivo: `engine/history/commandStack.ts`

```typescript
export interface EditorCommand {
  id: string;
  label: string;
  execute(state: EditorSnapshot): EditorSnapshot;
  undo(state: EditorSnapshot): EditorSnapshot;
}

export class CommandStack {
  private undoStack: EditorCommand[] = [];
  private redoStack: EditorCommand[] = [];

  do(command: EditorCommand, state: EditorSnapshot): EditorSnapshot {
    const newState = command.execute(state);
    this.undoStack.push(command);
    this.redoStack = [];              // limpiar redo al hacer una acción nueva
    return newState;
  }

  undo(state: EditorSnapshot): EditorSnapshot | null {
    const cmd = this.undoStack.pop();
    if (!cmd) return null;
    this.redoStack.push(cmd);
    return cmd.undo(state);
  }

  redo(state: EditorSnapshot): EditorSnapshot | null {
    const cmd = this.redoStack.pop();
    if (!cmd) return null;
    this.undoStack.push(cmd);
    return cmd.execute(state);
  }
}
```

**Decisión clave de performance**: cada `EditorCommand` NO guarda una copia completa de la imagen en cada paso (eso explotaría la memoria con imágenes grandes). En su lugar:
- `ApplyColorKeyCommand` guarda solo los **parámetros** (`ColorKeySettings` + `RegionSelection`) usados, no los píxeles resultantes.
- Al hacer `undo()`, se re-renderiza la máscara acumulada **desde cero, re-ejecutando la lista de comandos anteriores** sobre la GPU (operación de <50ms gracias al shader), en vez de descomprimir un blob pesado.
- Excepción: `ImportImageCommand` sí referencia el `ImageBitmap` completo (una sola vez por imagen).

Esto se integra con Zustand vía `zundo`, pero **customizando** el middleware para que solo trackee la lista de `EditorCommand[]` (ligera) y no el store completo (que incluye la textura pesada).

### 8.1 Atajos de teclado (hooks/useKeyboardShortcuts.ts)
- `Ctrl+Z` → undo
- `Ctrl+Shift+Z` / `Ctrl+Y` → redo
- `Ctrl+V` → pegar imagen del portapapeles como import
- `Delete` / `Backspace` → si hay selección activa, limpiar solo la selección
- `Espacio` (mantener) → modo Pan temporal
- `+` / `-` → zoom in/out
- `[` / `]` → disminuir/aumentar radio de feather rápidamente

---

## 9. GALERÍA / HISTORIAL (IndexedDB) — detalle atómico

Archivo: `engine/io/galleryDB.ts`

### 9.1 Esquema de la base de datos

```
DB name: "background-remover-db"
Version: 1

ObjectStore "entries" (keyPath: "id"):
  - id: string (uuid)
  - createdAt: number
  - updatedAt: number
  - name: string
  - originalImageBlob: Blob        (imagen original sin procesar, formato original)
  - currentMaskBlob: Blob | null   (PNG de 1 canal, la máscara acumulada más reciente)
  - thumbnailDataUrl: string       (base64, 128x128, para render rápido en la lista)
  - historySteps: HistoryStepMeta[] (array serializable, JSON)

  Índices:
    - by-updatedAt (para ordenar la galería por más reciente)
    - by-name
```

### 9.2 Operaciones CRUD atómicas

```typescript
async function createEntry(imageBlob: Blob, name: string): Promise<string>
async function updateEntryMask(id: string, maskBlob: Blob, steps: HistoryStepMeta[]): Promise<void>
async function listEntries(): Promise<GalleryEntry[]>            // ordenado por updatedAt desc
async function loadEntry(id: string): Promise<GalleryEntry>
async function deleteEntry(id: string): Promise<void>
async function renameEntry(id: string, newName: string): Promise<void>
```

### 9.3 Autoguardado
- Cada vez que el usuario confirma un paso (botón "Aplicar" en color-key o región), se dispara un `debounce(800ms)` que llama a `updateEntryMask`.
- Al importar una imagen nueva, se llama `createEntry` inmediatamente y se guarda el `id` en `EditorState.currentGalleryEntryId`.

### 9.4 UI de galería (`GalleryPanel/GalleryPanelRoot.tsx`)
- Grid de thumbnails, click para cargar (`loadEntry` → hidrata `useEditorStore` + reconstruye el `CommandStack` a partir de `historySteps`).
- Hover muestra fecha y nombre; doble-click permite renombrar inline.
- Botón "Eliminar" con confirmación (Radix `AlertDialog`).
- Botón "Duplicar" (crea una copia independiente para experimentar sin perder el original).

---

## 10. COMPONENTES UI — BREAKDOWN ATÓMICO (props exactas)

### 10.1 `ToleranceSliders.tsx` (los "potenciómetros" pedidos)

```typescript
interface ToleranceSlidersProps {
  lowerTolerance: number;              // 0-100
  upperTolerance: number;              // 0-100
  onLowerChange: (v: number) => void;  // actualiza draftColorKey en tiempo real (preview GPU)
  onUpperChange: (v: number) => void;
  onCommit: () => void;                // se llama en onPointerUp: dispara re-cálculo final + posible autosave
}
```
Requisitos de UX:
- Cada slider muestra el valor numérico editable directamente (input number sincronizado).
- Debajo de los sliders, un **gradiente visual** que muestra el rango de color cubierto (ej. de negro puro a gris #333333 según `lowerTolerance`, y de negro puro a gris #1A1A1A según `upperTolerance` — visualiza literalmente "cuánto por arriba y cuánto por abajo").
- Doble-click en el slider resetea a 0.

### 10.2 `AdvancedChannelSliders.tsx` (modo experto, colapsable)
6 sliders adicionales: `H-lower, H-upper, S-lower, S-upper, L-lower, L-upper` — para usuarios que quieran control quirúrgico por canal en vez de la distancia combinada.

### 10.3 `CompareSlider.tsx`
Divisor arrastrable estilo "antes/después" (antes = imagen original con checkerboard de fondo si aplica, después = resultado actual). Implementado con `clip-path` sobre dos `<canvas>` superpuestos.

### 10.4 `StatusBar.tsx`
Muestra en tiempo real: color RGB/HEX bajo el cursor, coordenadas del píxel, zoom %, dimensiones de la imagen, y — crucial para debug del usuario — la **distancia de color calculada** para el píxel bajo el cursor respecto al `targetColor` activo (ayuda a calibrar los sliders con feedback inmediato).

---

## 11. FLUJOS DE INTERACCIÓN DE USUARIO (paso a paso, sin ambigüedad)

### 11.1 Flujo: Remover fondo negro de toda la imagen
1. Usuario importa imagen (drag&drop o botón).
2. Sistema crea `GalleryEntry` y sube textura a WebGL.
3. Usuario click en preset "Negro puro" → `draftColorKey.targetColor = {0,0,0}`.
4. Usuario mueve slider "Tolerancia inferior" a 15 → GPU recalcula preview en <16ms, canvas muestra transparencia en tiempo real (checkerboard visible donde antes había negro).
5. Usuario mueve slider "Tolerancia superior" a 8 (para no comerse grises oscuros del sujeto).
6. Usuario ajusta "Feather" a 2px para suavizar el borde.
7. Usuario click "Aplicar" → se ejecuta `ApplyColorKeyCommand`, se hace push al `CommandStack`, se actualiza `maskAcumulada`, se autoguarda en IndexedDB.

### 11.2 Flujo: Atacar solo una zona pequeña
1. Usuario cambia `toolMode` a `select-rect` (o lazo).
2. Dibuja un rectángulo sobre una esquina de la imagen con residuos de fondo.
3. Sistema calcula `RegionSelection` normalizada y la sube como `uRegionMask`.
4. Usuario ajusta sliders — el preview SOLO afecta dentro del rectángulo (resto de la imagen sin cambios, visualmente "atenuado" fuera de la selección para dar feedback claro).
5. Click "Aplicar a selección" → `ApplyRegionMaskCommand` + `ApplyColorKeyCommand` combinados en un solo paso de historial.
6. Usuario repite con otra zona, o limpia la selección (`Esc` o botón "Limpiar selección") para volver a modo "imagen completa".

### 11.3 Flujo: Eyedropper para elegir color exacto
1. Usuario click en icono de gotero.
2. Sistema usa `window.EyeDropper` nativo (Chrome/Edge) si existe; si no, entra en "modo gotero manual": el cursor sobre el canvas muestra un magnifier 4x del área bajo el mouse, y el click toma el color de ese píxel exacto (leyendo del framebuffer WebGL vía `gl.readPixels`).
3. `draftColorKey.targetColor` se actualiza y `preset` pasa a `'custom'`.

### 11.4 Flujo: Deshacer/Rehacer
1. Usuario presiona `Ctrl+Z` o click en botón Undo.
2. `CommandStack.undo()` retorna al estado anterior; GPU re-renderiza la máscara acumulada re-ejecutando comandos restantes.
3. Panel de Historial resalta visualmente el paso actual dentro de la lista.
4. `Ctrl+Y` / botón Redo reaplica.

### 11.5 Flujo: Exportar
1. Usuario click "Descargar".
2. Se dispara `exportWorker.ts`: recibe el `ImageBitmap` original en full-resolución + la máscara acumulada actual (también en full-res, no la versión downscaled usada para preview en pantallas pequeñas) + settings de spill suppression.
3. El worker compone el PNG final con canal alpha usando `OffscreenCanvas`, sin bloquear el hilo principal.
4. Se genera un `Blob`, se crea un `ObjectURL`, se dispara descarga automática (`<a download>`).
5. Opción adicional: checkbox "Exportar también la máscara en escala de grises" (útil para compositing externo en After Effects/Premiere).

---

## 12. PLAN DE FASES (SPRINTS) — CHECKLIST ATÓMICO

> Cada ítem es una unidad de trabajo verificable de forma independiente. Se recomienda commitear tras cada checkbox.

### FASE 0 — Setup del proyecto
- [ ] Crear carpeta `app/background-remover/` dentro de `apps/inmobiliaria-demo`.
- [ ] Instalar dependencias: `zustand`, `zundo`, `idb`, `@radix-ui/react-slider`, `@radix-ui/react-popover`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `@radix-ui/react-alert-dialog`, `uuid`.
- [ ] Configurar `tsconfig` paths si hace falta alias `@/background-remover/*`.
- [ ] Crear `page.tsx` mínimo con layout de 3 columnas (placeholder).
- [ ] Verificar que la ruta `/background-remover` renderiza en `npm run dev:inmob`.

### FASE 1 — Tipos y store base
- [ ] Escribir `store/types.ts` completo (sección 5 de este documento).
- [ ] Escribir `engine/color/colorSpace.ts` (rgbToHsl, hslToRgb) + tests unitarios Vitest (casos: negro, blanco, rojo puro, gris 50%).
- [ ] Escribir `engine/color/colorDistance.ts` con los 3 modos (6.2) + tests con valores conocidos.
- [ ] Escribir `engine/color/presets.ts` (CHROMA_GREEN, PURE_BLACK).
- [ ] Crear `useEditorStore.ts` con estado inicial completo, sin lógica de comandos todavía.

### FASE 2 — Importación de imagen y visualización básica
- [ ] `engine/io/imageImport.ts`: función `importFile(file: File): Promise<ImageBitmap>`.
- [ ] `hooks/useImageDropzone.ts`: drag&drop + click-to-browse + paste desde portapapeles.
- [ ] `components/Toolbar/ImportButton.tsx`.
- [ ] `CanvasStage.tsx`: renderizar la imagen importada en un `<canvas>` simple (Canvas2D primero, sin WebGL aún) para validar el flujo end-to-end de importación.
- [ ] Checkerboard de fondo (CSS) para simular transparencia detrás del canvas.

### FASE 3 — Motor WebGL2 base
- [ ] `engine/gl/glContext.ts`: inicialización, manejo de pérdida/restauración de contexto.
- [ ] `engine/gl/glTextureUtils.ts`: subir `ImageBitmap` a textura, crear FBOs.
- [ ] `engine/gl/shaders/vertex.glsl.ts`: quad de pantalla completa estándar.
- [ ] `engine/gl/shaders/composite.frag.glsl.ts`: versión inicial que solo muestra la imagen sin máscara (passthrough), para validar el pipeline de shaders.
- [ ] `engine/gl/glRenderer.ts`: clase que orquesta el render loop (`requestAnimationFrame`).
- [ ] Migrar `CanvasStage.tsx` de Canvas2D a WebGL2, verificar que la imagen se ve idéntica.
- [ ] Fallback: detectar ausencia de WebGL2 y mostrar aviso + usar `maskEngine.ts` CPU (implementar versión mínima de fallback en paralelo).

### FASE 4 — Algoritmo de color-key en shader
- [ ] `engine/gl/shaders/colorKey.frag.glsl.ts`: implementar fórmula de 6.2 (modo HSL ponderado) + 6.3 (smoothstep).
- [ ] Uniforms: `uTargetColor (vec3)`, `uLowerTolerance (float)`, `uUpperTolerance (float)`, `uDistanceMode (int)`, `uChannelWeights (vec3)`.
- [ ] Conectar `ToleranceSliders.tsx` al store (`draftColorKey`) y de ahí a los uniforms del shader en cada frame.
- [ ] Verificar visualmente: imagen con fondo negro sólido, mover sliders, confirmar que el fondo se vuelve transparente progresivamente.
- [ ] `PresetButtons.tsx`: implementar presets Chroma Verde y Negro (sección 10, R4).
- [ ] `ColorSwatchPicker.tsx`: input de color libre + hex manual, sincronizado con `draftColorKey.targetColor`.

### FASE 5 — Selección de región
- [ ] `hooks/useCanvasInteraction.ts`: capturar pointerdown/move/up en modo `select-rect`, convertir coordenadas de pantalla a coordenadas normalizadas de imagen (considerando zoom/pan).
- [ ] `components/SelectionTools/RectSelectOverlay.tsx`: overlay SVG del rectángulo mientras se dibuja.
- [ ] `engine/mask/regionMask.ts`: rasterizar rectángulo a textura de máscara (función `buildRegionMaskTexture`).
- [ ] `engine/gl/shaders/composite.frag.glsl.ts`: extender para aplicar `uRegionMask` según fórmula de 6.5.
- [ ] Implementar modo elipse (`EllipseSelectOverlay.tsx`).
- [ ] Implementar modo lazo (`LassoSelectOverlay.tsx`) — capturar polígono libre, triangulación fan, subir a stencil/textura.
- [ ] `SelectionActionsBar.tsx`: botones "Invertir selección", "Limpiar selección", "Aplicar solo aquí".
- [ ] Feedback visual: atenuar (oscurecer levemente) el área FUERA de la selección activa para claridad del usuario.

### FASE 6 — Feathering y Spill Suppression
- [ ] `engine/gl/shaders/feather.frag.glsl.ts`: blur gaussiano 2-pass (sección 6.6).
- [ ] `FeatherSlider.tsx` conectado a `draftColorKey.feather.radiusPx`.
- [ ] Implementar `spillSuppress.ts` como función GLSL adicional dentro de `composite.frag.glsl.ts` (sección 6.7).
- [ ] `SpillSuppressSlider.tsx` + toggle de activación.
- [ ] Test visual con imagen de chroma verde real: verificar que los bordes del sujeto no quedan verdes tras aplicar.

### FASE 7 — Comando y sistema de Undo/Redo
- [ ] `engine/history/commandStack.ts` (sección 8, implementación completa).
- [ ] `engine/history/commands/ApplyColorKeyCommand.ts`.
- [ ] `engine/history/commands/ApplyRegionMaskCommand.ts`.
- [ ] `engine/history/commands/ImportImageCommand.ts`.
- [ ] Integrar `CommandStack` con `useEditorStore` (acciones `applyColorKey()`, `undo()`, `redo()`).
- [ ] `UndoRedoButtons.tsx` con estado disabled correcto (deshabilitado si stack vacío).
- [ ] `hooks/useKeyboardShortcuts.ts`: Ctrl+Z / Ctrl+Y.
- [ ] `HistoryPanel/HistoryPanelRoot.tsx`: lista de pasos con thumbnail, click para "saltar" a ese punto del historial (undo/redo múltiple de una vez).
- [ ] Test: aplicar 5 pasos distintos (2 en toda la imagen, 3 en regiones distintas), deshacer 3, rehacer 2, verificar que el resultado visual coincide exactamente en cada punto.

### FASE 8 — Galería persistente (IndexedDB)
- [ ] `engine/io/galleryDB.ts`: setup de la DB con `idb`, definición de schema (sección 9.1).
- [ ] CRUD completo (9.2) + tests.
- [ ] Autoguardado con debounce tras cada "Aplicar" confirmado.
- [ ] `GalleryPanel/GalleryPanelRoot.tsx` + `GalleryThumbnail.tsx`: listar entradas ordenadas por fecha.
- [ ] Click en thumbnail → cargar imagen + reconstruir `CommandStack` desde `historySteps` guardados.
- [ ] Renombrar, eliminar, duplicar entradas.
- [ ] `GalleryEmptyState.tsx` para cuando no hay historial (primera vez que se usa la herramienta).

### FASE 9 — Exportación
- [ ] `engine/io/exportWorker.ts`: Web Worker que recibe `ImageBitmap` + máscara full-res + settings.
- [ ] `engine/io/imageExport.ts`: orquesta comunicación con el worker, arma el PNG final vía `OffscreenCanvas`.
- [ ] `ExportButton.tsx`: dispara descarga, muestra spinner mientras el worker procesa imágenes grandes.
- [ ] Checkbox opcional: exportar máscara en escala de grises por separado.
- [ ] Checkbox opcional: exportar también un `.json` con los `ColorKeySettings` usados (para reproducibilidad/config guardable, ligado a R11 "configurar/ayudar al programa").
- [ ] Test con imagen de 6000x4000px: verificar que no bloquea el hilo principal (UI sigue respondiendo durante export).

### FASE 10 — Comparación y refinamiento UX
- [ ] `CompareSlider.tsx`: implementación completa antes/después.
- [ ] `StatusBar.tsx`: color bajo cursor + distancia calculada en vivo (sección 10.4).
- [ ] `useEyedropper.ts`: EyeDropper API nativa + fallback manual con magnifier.
- [ ] Zoom con rueda del mouse (`Ctrl+scroll` o scroll simple, a decidir) + Pan con `Espacio+drag`.
- [ ] Animaciones/transiciones sutiles (Framer Motion opcional) en apertura de paneles.
- [ ] Modo "Auto-detección de color dominante de fondo": al importar, samplear las 4 esquinas + bordes de la imagen, sugerir automáticamente el `targetColor` inicial (parte de R11 "inteligente").
- [ ] Tooltips explicativos en cada slider (Radix Tooltip) explicando qué hace cada control.

### FASE 11 — Diseño visual (consistencia con inmobiliaria-demo)
- [ ] Revisar tema oscuro/neón usado en el resto de `apps/inmobiliaria-demo` y reutilizar variables CSS/Tailwind config.
- [ ] Diseñar layout responsive: 3 columnas en desktop, colapsable a tabs en mobile/tablet.
- [ ] Iconografía consistente (usar la misma librería de íconos que el resto del proyecto, ej. `lucide-react`).
- [ ] Estados de carga (skeletons) para: carga inicial de galería, procesamiento de export.
- [ ] Manejo de errores visual: imagen corrupta, formato no soportado, WebGL no disponible, IndexedDB llena/no disponible (modo incógnito).

### FASE 12 — Testing y QA final
- [ ] Unit tests (Vitest): `colorSpace.ts`, `colorDistance.ts`, `regionMask.ts`, `commandStack.ts` — cobertura >90% en `engine/`.
- [ ] Test de integración: `galleryDB.ts` (usar `fake-indexeddb` en entorno de test).
- [ ] E2E (Playwright): flujo completo — importar imagen fixture → aplicar chroma key → seleccionar región → aplicar → undo → redo → exportar → verificar que el PNG descargado tiene canal alpha correcto (leer bytes del PNG en el test).
- [ ] Test de performance manual: imagen 8K, medir tiempo de: import, primer render, cada movimiento de slider (debe ser <16ms para 60fps), export final.
- [ ] Test de regresión visual: capturar screenshot del canvas tras aplicar settings fijos conocidos, comparar pixel a pixel contra un baseline (Playwright `toHaveScreenshot`).
- [ ] Checklist de accesibilidad: navegación por teclado completa, roles ARIA en sliders/botones, contraste de color en modo oscuro.
- [ ] Cross-browser: Chrome, Edge, Firefox (WebGL2 y EyeDropper API tienen soporte distinto — verificar fallbacks).

---

## 13. CONSIDERACIONES DE RENDIMIENTO Y USO DE LA RTX 4080

| Escenario | Estrategia |
|-----------|-----------|
| Imagen de hasta 12MP (4000x3000) | Render WebGL2 directo en tiempo real, sin downscaling, todo full-res incluso en preview |
| Imagen >12MP (ej. 8K, 33MP) | Preview en una textura downscaled a ~4MP para arrastre de sliders (mantiene 60fps); al soltar el slider (`onCommit`) o al exportar, recalcular en full-res una sola vez |
| Múltiples pasos de historial (20+) | El re-cálculo de la máscara acumulada al hacer `undo` re-ejecuta comandos en GPU (no en CPU), manteniendo el undo instantáneo incluso con historiales largos |
| Exportación de PNG grande | Delegado a Web Worker + `OffscreenCanvas`, para no congelar la UI del hilo principal mientras la GPU/CPU comprimen el PNG final |
| Memoria de texturas | Liberar (`texture.dispose()` / `gl.deleteTexture`) texturas de imágenes anteriores al cargar una nueva desde la galería, evitando memory leaks en sesiones largas |

---

## 14. CRITERIOS DE ACEPTACIÓN FINAL (Definition of Done)

- [ ] Se puede importar una imagen por click, drag&drop, y pegado desde portapapeles.
- [ ] Los presets Chroma Verde (`#00FF00`) y Negro (`#000000`) funcionan y son seleccionables con un click.
- [ ] Se puede elegir cualquier color custom vía color picker o eyedropper (click directo sobre la imagen).
- [ ] Existen sliders independientes de tolerancia "por debajo" y "por encima" del color elegido, con feedback visual en tiempo real (<16ms de latencia percibida).
- [ ] Se puede dibujar una selección (rectángulo, elipse o lazo) y aplicar el efecto SOLO dentro de ella.
- [ ] Se puede aplicar el efecto a la imagen completa sin ninguna selección activa.
- [ ] Undo y Redo funcionan de forma ilimitada (limitado solo por memoria del navegador) y son instantáneos.
- [ ] El panel de Historial permite saltar a cualquier paso anterior, no solo el inmediato.
- [ ] Existe una galería persistente entre sesiones (recargar la página no pierde el trabajo) que muestra imágenes/proyectos anteriores con thumbnail.
- [ ] Se puede exportar el resultado como PNG con canal alpha, en la resolución original de la imagen importada.
- [ ] La herramienta funciona fluida (60fps en interacción) en imágenes de hasta 12MP en el hardware especificado (RTX 4080).
- [ ] Existe fallback funcional (aunque más lento) en navegadores sin soporte WebGL2.
- [ ] El diseño visual es consistente con el resto de `apps/inmobiliaria-demo`.

---

## 15. SIGUIENTE PASO

Este documento es el **plan**. Una vez aprobado, la implementación real debe seguir el orden exacto de las Fases 0→12 de la sección 12, sin saltar fases, ya que cada una depende de la anterior (ej. no se puede implementar Undo/Redo de forma correcta sin que el motor de shaders de la Fase 4 ya esté funcionando, porque el `undo()` re-ejecuta comandos sobre ese motor).

Cuando confirmes este plan, comienzo la implementación empezando por la **Fase 0**.
