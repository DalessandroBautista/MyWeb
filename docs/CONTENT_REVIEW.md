# Revisión de contenido del portfolio

Documento de evidencia y vigencia para `src/portfolio/content.js`. No reemplaza
al CV: registra de dónde salió cada dato y qué conviene confirmar antes de
publicar.

## Fuentes usadas (Fases 1, 2 y 3)

| Dato | Fuente |
| --- | --- |
| Nombre, rol base | `public/CV_Bautista_DAlessandro.pdf` (`pdftotext`) y cabecera original |
| Email | `public/CV_Bautista_DAlessandro.pdf` (`dalessandrobau@gmail.com`) |
| LinkedIn | `public/CV_Bautista_DAlessandro.pdf` (`linkedin.com/in/bautistadalessandro`) |
| GitHub | Perfil real verificado: `github.com/DalessandroBautista` |
| Perfil profesional completo | `public/CV_Bautista_DAlessandro.pdf` (foco en backend, sistemas críticos SENASA, UNLP) |
| Experiencia SENASA (completa con 6 bullets) | `public/CV_Bautista_DAlessandro.pdf` (diciembre 2021 – actualidad, Buenos Aires, modalidad híbrida) |
| Formación académica | `public/CV_Bautista_DAlessandro.pdf` (Licenciatura en Sistemas UNLP, 4º año en curso, inicio 2017) |
| Idiomas | `public/CV_Bautista_DAlessandro.pdf` (Inglés: Básico, lectura y escritura limitada) |
| Tecnologías agrupadas (`skillGroups`) | `public/CV_Bautista_DAlessandro.pdf` (Backend, Frontend, Base de datos, DevOps y herramientas, Otros) |
| CV descargable (PDF) | `public/CV_Bautista_DAlessandro.pdf`, resuelto con `import.meta.env.BASE_URL` en la app |
| Contacto (Email, LinkedIn, GitHub, CV) | Verificado contra `public/CV_Bautista_DAlessandro.pdf` y perfiles web oficiales |
| Qué Hay: datos de producto y funcionalidades | `/home/bautista/Documentos/Personal/ideas/agendaeventoslp-web` (`README.md`, `PRODUCT.md`) y sitio público `https://quehaylp.com` |
| Qué Hay: stack técnico | `/home/bautista/Documentos/Personal/ideas/agendaeventoslp-web/package.json` (React, TypeScript, Vite, Fastify, Neon Postgres, Drizzle ORM, Leaflet) |
| Qué Hay: captura real | `public/projects/que-hay.webp` |
| Copa del Pueblo: datos de producto y funcionalidades | `/home/bautista/Documentos/Personal/duelo-del-pueblo` (`README.md`, `ARCHITECTURE.md`) y sitio público `https://copadelpueblo.com.ar` |
| Copa del Pueblo: stack técnico | `/home/bautista/Documentos/Personal/duelo-del-pueblo/package.json` y `apps/web/package.json` (Next.js 16, React 19, TypeScript, PostgreSQL, monorepo pnpm) |
| Copa del Pueblo: captura real | `public/projects/copa-del-pueblo.webp` |
| Repositorios de proyectos | Verificados como privados (`isPrivate: true`); no se exponen URLs de repositorios privados |

## Correspondencia con el contrato (Fase 2 y Fase 3)

`profile` expone:
- `name`: "Bautista D'Alessandro"
- `role`: "Desarrollador Java Fullstack"
- `location`: "La Plata, Argentina"
- `workLocation`: "Buenos Aires (modalidad híbrida)"
- `bio`: Texto completo del Perfil Profesional del CV
- `email`, `github`, `linkedin`, `cvUrl`
- `skills`: Lista plana de tecnologías del CV
- `skillGroups`: 5 grupos (Backend, Frontend, Base de datos, DevOps y herramientas, Otros)
- `experience`: Array con SENASA, período, ubicación, descripción y los 6 `highlights` textuales
- `education`: Licenciatura en Sistemas UNLP
- `languages`: Inglés básico

`projects` expone para cada isla (orden final de 4 islas: `inicio`, `que-hay`, `copa-del-pueblo`, `contacto`):
- `id`: `'inicio'`, `'que-hay'`, `'copa-del-pueblo'`, `'contacto'`
- `title`: Título de la isla / proyecto
- `kind`: `'home'`, `'agenda'`, `'copa'`, `'contact'`
- `tagline`: Frase síntesis para el hero editorial
- `shortDescription`: Resumen breve de la tarjeta en el mar
- `description`: Descripción general del proyecto / canales de contacto
- `about`: Sección editorial "Qué es" / propósito del espacio
- `role`: Sección editorial "Qué hice" (responsabilidad real y rol técnico)
- `features`: Array de strings con funcionalidades verificadas en documentación y código
- `stack`: Array de tecnologías verificadas
- `status`: Estado del proyecto ("En producción" para Qué Hay y Copa del Pueblo; "En desarrollo" para Inicio; "Disponible" para Contacto)
- `image`: Ruta relativa en `public/` a la captura webp real (o `null` en inicio/contacto)
- `imageAlt`: Texto accesible descriptivo de la imagen
- `tags`: Etiquetas temáticas
- `liveUrl`: URL pública activa (o `null` en inicio/contacto)
- `repoUrl`: `null` (ambos repos son privados)

## Decisiones de diseño y arquitectura (Fase 2 y Fase 3)

1. **Tipografías locales**: Se instalaron `@fontsource-variable/fraunces` para títulos y encabezados y `@fontsource-variable/outfit` para texto de lectura y controles de interfaz, reemplazando fuentes del sistema (Georgia/Inter).
2. **Aspect-ratio 4/5 en pantallas angostas (`<= 700px`)**:
   - En móviles y pantallas pequeñas, `.scene-canvas` y `canvas` adoptan `aspect-ratio: 4 / 5`, brindando un encuadre vertical más alto que permite apreciar la isla, el muelle y la lancha sin pérdida de escala ni desbordamiento horizontal a 375px.
3. **Rutas hash, navegación y Back/Forward**:
   - Mar: `#inicio`, `#que-hay`, `#copa-del-pueblo`, `#isla/contacto` (también soporta alias `#mar/contacto`).
   - Páginas de proyecto: `#proyecto/que-hay`, `#proyecto/copa-del-pueblo`.
   - CV completo: `#cv`.
   - Contacto: `#contacto` renderiza `ContactPage.jsx`.
   - Rutas no reconocidas o hashes inválidos redirigen inmediatamente a `#inicio` mediante `replaceState`.
   - El historial de Back/Forward del navegador sincroniza vista, foco en `h1`, scroll superior y `document.title` (`<Título> · Bautista D'Alessandro`).
   - Al volver al mar desde Contacto (botón "← Volver al mar" o retroceso del navegador), la lancha y la cámara permanecen posicionadas en la isla de Contacto sin desajustes.
4. **Página de Contacto (`ContactPage.jsx`)**:
   - Título, línea de subtítulo breve y tarjetas grandes para Email, LinkedIn, GitHub y Currículum Vitae (PDF).
   - Email: enlace directo `mailto:` y botón "Copiar email" con `navigator.clipboard.writeText`, aviso accesible "Copiado" con `role="status" aria-live="polite"`, y degradado funcional con selección de texto si la API de portapapeles no estuviera disponible.
   - LinkedIn y GitHub: enlaces externos seguros con `rel="noopener noreferrer"`.
   - CV: descarga directa del PDF con atributo `download` y enlace complementario a la versión web `#cv`.
   - Foco accesible en `h1` en la carga sin outline programático invasivo, conservando `:focus-visible` para navegación con teclado.
5. **Textos contextuales del botón de la tarjeta en el mar**:
   - Isla Inicio: "Ver CV completo ↵"
   - Islas de proyectos (`que-hay`, `copa-del-pueblo`): "Entrar a la isla ↵"
   - Isla Contacto: "Ver contacto ↵"
6. **Filtrado de proyectos reales**:
   - En las páginas de proyectos (`ProjectPage.jsx`), el enlace de navegación al pie ("Otro proyecto") filtra `inicio` y `contacto`, asegurando que sólo se navegue entre proyectos de software reales.
   - En la página de CV (`CvPage.jsx`), la sección "Proyectos personales" filtra `inicio` y `contacto`, mostrando únicamente tarjetas para proyectos reales (`que-hay` y `copa-del-pueblo`).
7. **Página de CV y estilos de impresión**:
   - Página `#cv` contiene la totalidad de la información del PDF sin omisiones y tarjetas de proyectos personales en producción.
   - Estilos `@media print` optimizados: oculta canvas, controles, sidebar y elementos decorativos; fondo blanco, texto oscuro de alto contraste y saltos de página controlados.
8. **Transición y accesibilidad**:
   - Las páginas (`ProjectPage`, `CvPage`, `ContactPage`) entran con una sutil transición de fundido y desplazamiento vertical (250 ms), desactivada inmediatamente si el usuario tiene `prefers-reduced-motion: reduce`.
   - Hint accesible bajo el canvas adaptado a mouse o pantalla táctil.

## Validación ejecutada

- `node --check src/portfolio/content.js`: sintaxis correcta.
- `npm run lint`: 0 errores, 0 warnings con ESLint.
- `npm run build`: compilación limpia con Vite; bundle genera assets de fuentes Fraunces y Outfit woff2, CSS y chunks optimizados.
- Verificación de no-overflow en anchos móviles de 375px: clases `min-width: 0`, `word-break: break-all`, contenedores con `box-sizing: border-box`.
- Respuestas HTTP en servidor de desarrollo:
  - `http://127.0.0.1:4173/`: 200 OK
  - `http://127.0.0.1:4173/projects/que-hay.webp`: 200 OK
  - `http://127.0.0.1:4173/projects/copa-del-pueblo.webp`: 200 OK
  - `http://127.0.0.1:4173/CV_Bautista_DAlessandro.pdf`: 200 OK
