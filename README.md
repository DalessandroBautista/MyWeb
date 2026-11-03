# Portfolio de Bautista D'Alessandro

Portfolio personal con formato de archipiélago navegable: cada isla representa
un proyecto y una lancha viaja entre destinos. La escena se dibuja en Canvas y
ofrece dos estilos visuales, ilustración 2D (predeterminado) y pixel.

## Stack

- React 18 + Vite 5
- Canvas 2D (sin dependencias pesadas de animación)
- `lucide-react` para iconografía
- ESLint para lint

## Requisitos

- Node.js 18 o superior (recomendado 20 LTS)
- npm

## Puesta en marcha

```sh
npm ci        # instala dependencias exactas del package-lock
npm run dev   # servidor de desarrollo con HMR
```

Vite imprime la URL local (por defecto `http://localhost:5173`).

## Build y previsualización

```sh
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
npm run lint      # ESLint
```

## Contenido

Los datos de perfil y proyectos viven en `src/portfolio/content.js`:

- `profile`: nombre, rol, ubicación, bio, contacto, CV, skills, experiencia y
  educación. El CV se resuelve en la app como
  `${import.meta.env.BASE_URL}CV_Bautista_DAlessandro.pdf`; en `content.js`
  sólo se guarda el nombre del archivo, sin barra inicial.
- `projects`: islas en orden de navegación. `inicio` (home), `que-hay`
  (agenda) y `copa-del-pueblo` (copa) son las únicas cargadas. Los repositorios
  de Qué Hay y Copa del Pueblo son privados, por eso sus `repoUrl` son `null`
  y sólo se muestran los enlaces publicados. En `inicio` ambos enlaces son
  `null`; el contacto del perfil se muestra por separado.

Las fuentes de los datos y su vigencia están documentadas en
`docs/CONTENT_REVIEW.md`. Antes de sumar un proyecto, verificá que sus
metadatos (título, descripción, URLs) sean reales y que el enlace que quieras
mostrar sea público; el máximo previsto es seis islas.

## Deploy en GitHub Pages

Repositorio: `DalessandroBautista/MyWeb`. El sitio se publica como project page
en `https://dalessandrobautista.github.io/MyWeb/`, por lo que el build necesita
la base `/MyWeb/`.

> **El repositorio MyWeb es privado y el sitio todavía no fue publicado.**
> GitHub Pages en el plan Free sólo sirve repositorios públicos; para publicar
> desde un repositorio privado hace falta un plan que lo permita (Pro, Team o
> Enterprise). No cambies la visibilidad del repositorio sin decidirlo aparte.

La base de Vite se toma de `VITE_BASE_PATH` y por defecto es `/`:

```sh
npm run build                          # base /
VITE_BASE_PATH=/MyWeb/ npm run build   # build para Pages
npm run preview                        # sirve dist/ localmente
```

El workflow `.github/workflows/pages.yml` se dispara manualmente
(`workflow_dispatch`), ejecuta `npm ci`, construye con
`VITE_BASE_PATH=/MyWeb/`, sube el artefacto de Pages y lo despliega con los
permisos `pages: write` e `id-token: write`. Para usarlo:

1. En el repositorio, abrí **Settings → Pages** y elegí **GitHub Actions** como
   fuente.
2. Asegurate de que el repositorio sea público o de que el plan permita Pages
   en repositorios privados.
3. Ejecutá el workflow **Deploy a GitHub Pages** desde la pestaña Actions.
4. Comprobá que `https://dalessandrobautista.github.io/MyWeb/` y el PDF
   (`.../MyWeb/CV_Bautista_DAlessandro.pdf`) respondan sin 404.

El workflow no se ejecutó ni se publicó nada en esta tarea. El PDF debe estar
en `public/` para que Vite lo copie a `dist/`; el archivo
`public/CV_Bautista_DAlessandro.pdf` ya existe en el repositorio.

## Estructura

```
public/                 archivos estáticos (CV, favicon)
src/App.jsx             composición general y navegación
src/portfolio/          contenido y escena del portfolio
src/components/         componentes previos del sitio
src/styles/             estilos globales y variables
.github/workflows/      workflow manual de deploy a GitHub Pages
docs/                   contrato de implementación y revisión de contenido
designs/                referencias visuales e historial de diseño
```
