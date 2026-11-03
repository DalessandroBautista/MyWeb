# Portfolio insular — contrato de implementación

## Dirección aprobada
Landing costera al atardecer, Rocket Power / Vice City como inspiración cromática. Lancha deportiva que viaja a islas por proyecto; sidebar con selección directa y flechas anterior/siguiente. Isla centrada con lancha al llegar. Mantener 2D y Pixel como opciones, 2D predeterminada. Nombres visibles, diseño usable con teclado y móvil. No publicar todavía.

## Ownership
- Agy Gemini 3.8 medium: SOLO `src/portfolio/sceneRenderer.js` (arte Canvas).
- Luna 6 medium: app, estilos, navegación, hook/canvas, configuración, build, integración. NO editar sceneRenderer.js ni content.js mientras sus owners estén activos.
- OpenCode DeepSeek V4.1 Flash Free LOW (si variante confirmada): SOLO `src/portfolio/content.js`, `README.md`, `docs/CONTENT_REVIEW.md` (contenido y guía deploy).

## Contrato renderer
Export named `renderScene(ctx, state)` desde sceneRenderer.js. Canvas logical space 1280×720, caller configura transform DPR y scale; renderer dibuja sin cambiar canvas.width/height. ctx.save/restore balanced. state = { time:number segundos, cameraX:number, boatX:640, boatY:535, moving:boolean, direction:1|-1, progress:number 0..1, paused:boolean, reducedMotion:boolean, projects:Array, selectedIndex:number, style:'2d'|'pixel' }. World island i tiene x=640+i*1600-cameraX, y=420. cameraX=selectedIndex*1600 al llegar. Cada entrada projects posee id,title,kind ('home'|'agenda'|'copa'|'code'),shortDescription,description,tags[],liveUrl|null,repoUrl|null. El renderer no controla estado React ni DOM ni RAF. Debe dibujar cielo, mar, islas grandes orgánicas distintas, palmeras, muelles, carteles legibles, lancha deportiva, wakes y detalles animados. Caller usa buffer lowres si style pixel; renderer puede diferenciar trazos según style. Mantener viewBox entero visible móvil.

## Contrato contenido
Export named `profile` y `projects`. profile = {name,role,location,bio,email,github,linkedin,cvUrl,skills:string[],experience:Array<{role,organization,period,description}>,education:Array<{title,organization,period}>}. projects empieza por home id:'inicio', luego agenda id:'que-hay', copa id:'copa-del-pueblo'; añadir SOLO proyectos personales públicos verificados con metadatos reales, máximo 6 total. Para home liveUrl/repoUrl null; enlaces de perfil por separado. No enlaces # ni logros/métricas inventadas. Datos existentes en src/components y public/CV_Bautista_DAlessandro.pdf; CV se enlaza vía import.meta.env.BASE_URL en app. El PDF existe y debe descargarse de verdad. No cargar archivos .env.

## Navegación

Actualización de ownership tras settlement de Agy y Luna: OpenCode LOW puede cerrar integración en App.jsx, IslandScene.jsx, estilos, Vite, ESLint y workflow, además de sus archivos de contenido/docs. Preservar el arte de Agy; cambios mecánicos de lint permitidos en sceneRenderer.js. No quedan escritores concurrentes de esos archivos. El coordinador está recuperando npm ci tras un node_modules incompleto; no ejecutar otra instalación en paralelo.
Seleccionar cualquier isla anima desde cameraX actual al destino con easing y duración acotada; indicador de viaje y bloqueo o retarget seguro. Atrás/adelante navegación real con hash y Back/Forward, focus/aria-current. Sidebar siempre visible desktop, list wrap/scroll accesible mobile. Pausa ambiental independiente del viaje; reduced-motion inmediato. Sobre mí y CV panel accesible, contactos reales y enlaces seguros. No autoplay sonido ni APIs. Dibujos originales ligeros, sin dependencias pesadas.

## Validación
Usuario eligió sólo comprobaciones habituales; NO ronda cinco personas. Build y lint, navegación directa y vuelta, hash/back/forward, PDF no404, enlaces, 375px sin overflow, reduced-motion y cleanup RAF. Mantener diseños previos como historial, no modificar credenciales, archivos QA previos, repos externos, ni monetización. npm ci permitido si faltan dependencias; no instalaciones globales.
