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

Repositorio público: `DalessandroBautista/dalessandrobautista.github.io`. Al
llamarse así, GitHub lo publica como sitio de usuario en
`https://dalessandrobautista.github.io/`, con base `/` (la de Vite por defecto).

El workflow `.github/workflows/pages.yml` corre en cada push a `main` y también
a mano (`workflow_dispatch`): ejecuta `npm ci`, construye, sube el artefacto de
Pages y lo despliega. Pages está configurado con **GitHub Actions** como fuente.

```sh
npm run build     # base /
npm run preview   # sirve dist/ localmente
```

Después de publicar, comprobá que `https://dalessandrobautista.github.io/` y
`https://dalessandrobautista.github.io/CV_Bautista_DAlessandro.pdf` respondan
sin 404. El PDF vive en `public/` y Vite lo copia a `dist/`.

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
