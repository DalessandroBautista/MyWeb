# Fase 3 — Escena más alta en móvil e isla de Contacto

Coordinador: Claude Code. Workers: Agy, Gemini 3.8 Flash medium (default de ROUTING.md). Leer antes `/home/bautista/.config/ai-agents/ROUTING.md`, `AGENTS.md`, `docs/IMPLEMENTATION_CONTRACT.md` y `docs/FASE2_CONTRATO.md` (siguen vigentes salvo lo que cambia acá). Mismas reglas: sin commits, sin push, sin `.env`, sin lanzar agentes, sólo archivos propios. Dev server ya corriendo en `http://127.0.0.1:4173/`.

## 1. Encuadre más alto en pantallas angostas

Hoy el canvas es 16:9 y en un celular de 375 px la isla queda chica.
- CSS (Worker PÁGINAS): en `max-width: 700px`, `.scene-canvas` y su `canvas` pasan a `aspect-ratio: 4 / 5`.
- Canvas (Worker ESCENA): `IslandScene` deja de usar "contain" fijo. Escala = `Math.max(canvasW / 1280, canvasH / 720)` ("cover"), centrada horizontalmente en x = 640 (lancha e isla actual) y verticalmente alineada para que entre desde el cielo alto hasta el agua bajo la lancha. Si recortar la altura corta algo, priorizar mostrar isla + cartel + lancha: elegí el offset vertical para que el rango lógico y ∈ [~180, ~640] quede visible cuando el canvas es más alto que ancho. Con 16:9 el resultado tiene que ser idéntico al actual.
  - El buffer Pixel deja de ser fijo 320×180: alto 180 y ancho = `round(180 * aspect)`, con el mismo transform cover.
  - El hit-test y el hover usan exactamente el mismo transform (sin desfasajes en 4:5).
  - El renderer dibuja en el espacio lógico 1280×720; si en "cover" quedan franjas sin dibujar (cielo arriba o agua abajo), extender el cielo/mar para que no haya bordes vacíos.

## 2. Cuarta isla: Contacto

- `projects` (Worker PÁGINAS) suma al final `{ id: 'contacto', title: 'Contacto', kind: 'contact', shortDescription: 'Escribime: email, LinkedIn, GitHub y CV.', description: …, tags: ['Email', 'LinkedIn', 'GitHub', 'CV'], liveUrl: null, repoUrl: null }`. Orden final: inicio, que-hay, copa-del-pueblo, contacto.
- Renderer (Worker ESCENA): nuevo `drawLandmarkContact` para `kind: 'contact'`. Es original y distinto de Inicio, que ya tiene faro: una caseta de guardavidas sobre pilotes, con un buzón y una bandera, una botella con mensaje flotando cerca del muelle (bobbing; quieta si `reducedMotion`) y un cartel neón superior "CONTACTO" medido con `measureText`/`maxWidth`. El cartel del muelle sigue la convención existente. Funciona en 2D y Pixel.
- Rutas (Worker PÁGINAS): clic o Enter en la isla Contacto (lancha ya llegada) abre `#contacto` en una página nueva `ContactPage.jsx`: título, línea breve, tarjetas grandes para Email (`mailto:` + botón "Copiar email" con `navigator.clipboard`, aviso accesible "Copiado" y degradado si falla), LinkedIn, GitHub y "Descargar CV (PDF)". Volver al mar deja la lancha en Contacto. `document.title`, foco en el h1 sin outline programático, Back/Forward y hash inválido como en la fase 2.
- El botón de la tarjeta en el mar dice "Entrar a la isla" para proyectos, "Ver CV completo" en Inicio y "Ver contacto" en Contacto.
- "Otro proyecto" en las páginas de proyecto y "Proyectos personales" en el CV sólo listan proyectos reales (kind `agenda`/`copa`/`code`), nunca Inicio ni Contacto.

## Ownership

- **ESCENA**: `src/portfolio/IslandScene.jsx`, `src/portfolio/sceneRenderer.js`.
- **PÁGINAS**: todo lo demás que haga falta (`src/App.jsx`, `src/portfolio/content.js`, `src/portfolio/*Page.jsx`, `src/styles/*`, `docs/CONTENT_REVIEW.md`, `README.md`).

## Validación

`npm run lint` y `npm run build` sin errores, sin `console.log`, sin overflow a 375 px. Reporte final: archivos tocados, qué verificaste y pendientes.
