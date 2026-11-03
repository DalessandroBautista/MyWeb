# Fase 2 — Islas clicables, páginas de proyecto y CV completo

Coordinador: Claude Code (Opus 5.5). Workers: Agy, Gemini 3.8 Flash medium (default de ROUTING.md: el usuario no eligió modelo para esta fase).
Leer antes: `/home/bautista/.config/ai-agents/ROUTING.md`, `AGENTS.md`, `docs/IMPLEMENTATION_CONTRACT.md` (fase 1, sigue vigente salvo lo que cambia acá).

Reglas comunes: no push, no deploy, no commits, no `.env`, no lanzar otros agentes, no editar archivos fuera de tu ownership. No inventar métricas, logros, empleos ni tecnologías: todo dato debe salir del CV (`public/CV_Bautista_DAlessandro.pdf`, texto con `pdftotext`), de `src/portfolio/content.js` o de leer (sólo lectura) los repos de los proyectos. El servidor de desarrollo ya corre en `http://127.0.0.1:4173/` (no levantar otro en ese puerto).

## Rutas (hash)

| Hash | Vista |
|---|---|
| `#inicio`, `#que-hay`, `#copa-del-pueblo` | Mar, lancha en esa isla (igual que hoy) |
| `#proyecto/que-hay`, `#proyecto/copa-del-pueblo` | Página del proyecto |
| `#cv` | Página "Sobre mí / CV" completa |

Hash inválido → `#inicio` con `replaceState`. Back/Forward deben funcionar entre todas las vistas. Al abrir una página: scroll arriba, foco en su `h1`, `document.title` = `"<Título> · Bautista D'Alessandro"`. Al volver al mar (`Volver al mar` o Back) la lancha ya está en la isla de ese proyecto (sin viaje).

## Interacción con las islas

- Click/tap en una isla **distinta** de la actual → la lancha viaja a esa isla (igual que el sidebar).
- Click/tap en la isla **actual**, con la lancha ya llegada → abre su página: `inicio` → `#cv`; los demás → `#proyecto/<id>`.
- Mientras viaja, los clicks sobre islas se ignoran.
- Hover sobre una isla clicable → cursor `pointer` y resaltado visual en el canvas (glow/contorno cálido en el cartel del muelle + una burbuja/etiqueta "Entrar ↵" sobre la isla actual, o "Navegar →" si es otra isla visible).
- Equivalente accesible obligatorio (el canvas no es accesible): en la tarjeta del proyecto, botón principal "Entrar a la isla" (o "Ver CV completo" en Inicio). La tecla Enter, con el foco fuera de inputs y en la vista de mar, también entra a la isla actual.

## Contrato IslandScene ↔ App (interfaz entre workers)

`IslandScene` recibe una prop nueva `onIslandClick(index:number)` y la llama con el índice de la isla clicada (ignora clicks durante el viaje). App decide: si `index !== selected` → `navigate(index)`; si no → abrir la página. Las demás props no cambian.
`renderScene(ctx, state)` acepta un campo nuevo opcional `state.hoveredIndex: number | null` para dibujar el resaltado.
Hit-test: isla `i` en espacio lógico 1280×720, centro `x = 640 + i*1600 - cameraX`, `y ≈ 420`; usar una elipse que cubra isla+muelle+cartel (ajustar a los dibujos reales). Convertir coordenadas del puntero con la misma escala/offset de `drawScene`.

## Página de proyecto

Layout editorial con la misma paleta atardecer: barra superior con "← Volver al mar" y breadcrumb; hero con título grande, tagline, captura real (`public/projects/<id>.webp`, con `alt` descriptivo y `loading="lazy"` salvo la principal), CTA "Visitar sitio ↗". Secciones: "Qué es", "Qué hice" (mi rol), "Funcionalidades" (lista), "Stack" (chips) y "Estado" (en producción + URL). Al pie: navegación "← Proyecto anterior / Proyecto siguiente →" entre páginas de proyecto.

## Página CV (`#cv`)

Contenido completo del CV, sin recortar: perfil profesional; tecnologías agrupadas (Backend, Frontend, Base de datos, DevOps y herramientas, Otros); experiencia SENASA con **todos** los bullets, ubicación y modalidad; formación; idiomas; contacto (email, LinkedIn, GitHub); botón "Descargar CV (PDF)". Debe verse bien al imprimir (`@media print` simple: fondo blanco, sin canvas ni navegación).
En la vista de mar, la sección "Sobre mí" inferior se reduce a un resumen breve + enlace "Ver CV completo".

## Mejoras de diseño (decididas por el coordinador)

1. Tipografía propia, sin depender de fuentes instaladas: `@fontsource-variable/fraunces` (títulos) y `@fontsource-variable/outfit` (texto). Instalar con `npm install` (no global). Reemplazar Georgia/Inter.
2. Transición al entrar/salir de una página: fundido + leve desplazamiento hacia arriba (≈250 ms), desactivado con `prefers-reduced-motion`.
3. Metadatos para compartir en `index.html`: Open Graph y Twitter card (título, descripción, `og:type=website`); `lang="es"` ya está.
4. Limpiar código muerto: borrar `src/components/*` (Hero, CVSection, CarouselLayout, ProjectsSection y sus CSS) y `src/assets/react.svg`, `public/vite.svg` si nada los importa. Cambiar `name` de package.json a `myweb-portfolio`.
5. Hint de primera visita bajo el canvas, sutil: "Tocá una isla para entrar · ← → para navegar".

## Ownership

- **Worker ESCENA**: SOLO `src/portfolio/IslandScene.jsx` y `src/portfolio/sceneRenderer.js`. Hit-test, hover, cursor, `onIslandClick`, `hoveredIndex` y su dibujo en 2D y Pixel. Preservar el arte existente. Prueba: montar la prop con un `console.log` provisional no queda en el código final.
- **Worker PÁGINAS**: todo lo demás: `src/App.jsx`, `src/portfolio/content.js`, nuevos `src/portfolio/ProjectPage.jsx` y `src/portfolio/CvPage.jsx` (u otros nuevos en `src/portfolio/`), `src/styles/*`, `src/main.jsx`, `index.html`, `package.json`/lock, borrado de `src/components`, `docs/CONTENT_REVIEW.md`, `README.md`. Pasa `onIslandClick` a `IslandScene` según el contrato aunque el otro worker todavía no lo haya implementado.
  - Contenido de proyectos: ampliar `projects` con campos `tagline`, `about`, `role`, `features: string[]`, `stack: string[]`, `status`, `image`, `imageAlt`. Fuentes de sólo lectura: Copa → `/home/bautista/Documentos/Personal/duelo-del-pueblo` (`README.md`, `ARCHITECTURE.md`, `package.json`s) y el sitio público; Qué Hay → `/home/bautista/orca/workspaces/agendaeventoslp-web` (README, package.json) y el sitio público. No abrir `.env*`. No enlazar repos (son privados). Registrar las fuentes nuevas en `docs/CONTENT_REVIEW.md`.
  - Ampliar `profile` con `location` laboral ("Buenos Aires, modalidad híbrida"), `experience[].highlights: string[]` (bullets del CV), `skillGroups`, `languages`.

## Validación de cada worker

`npm run lint` y `npm run build` sin errores. No dejar `console.log`. Reportar al final: archivos tocados, qué se verificó y qué quedó pendiente. El coordinador verifica en navegador real.
