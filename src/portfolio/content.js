// Contenido del portfolio insular.
// Fuentes de datos:
// - public/CV_Bautista_DAlessandro.pdf (extraído con pdftotext)
// - Repositorio de sólo lectura Copa del Pueblo (/home/bautista/Documentos/Personal/duelo-del-pueblo)
// - Repositorio de sólo lectura Qué Hay (/home/bautista/Documentos/Personal/ideas/agendaeventoslp-web)
// - Sitios web públicos: https://copadelpueblo.com.ar y https://quehaylp.com
// No inventar métricas, logros ni empleos que no estén respaldados por esas fuentes.
// El CV se resuelve en la app con import.meta.env.BASE_URL; acá va sólo el nombre del archivo.

export const profile = {
  name: "Bautista D'Alessandro",
  role: 'Desarrollador Java Fullstack',
  location: 'La Plata, Argentina',
  workLocation: 'Buenos Aires (modalidad híbrida)',
  bio: 'Desarrollador Java Fullstack con más de 4 años de experiencia profesional y foco principal en desarrollo backend. Experiencia sólida en Java 11/17, Spring Boot y Maven, participando en sistemas críticos con impacto en la trazabilidad y control de alimentos. Orientado a calidad de código, buenas prácticas, trabajo en equipo y mejora continua. Experiencia en modernización y migración de sistemas, así como en dockerización y containerización para estandarizar entornos de desarrollo y despliegue. Actualmente cursando la Licenciatura en Sistemas en la UNLP.',
  email: 'dalessandrobau@gmail.com',
  github: 'https://github.com/DalessandroBautista',
  linkedin: 'https://linkedin.com/in/bautistadalessandro',
  cvUrl: 'CV_Bautista_DAlessandro.pdf',
  skills: [
    'Java 11/17',
    'Spring Boot',
    'Maven',
    'JHipster',
    'ReactJS',
    'VueJS',
    'HTML',
    'CSS',
    'TypeScript',
    'Oracle SQL',
    'Docker',
    'Linux',
    'Git',
    'Jira',
  ],
  skillGroups: [
    {
      category: 'Backend',
      skills: ['Java 11/17', 'Spring Boot', 'Maven', 'JHipster'],
    },
    {
      category: 'Frontend',
      skills: ['ReactJS', 'VueJS', 'HTML', 'CSS', 'TypeScript'],
    },
    {
      category: 'Base de datos',
      skills: ['Oracle SQL'],
    },
    {
      category: 'DevOps y herramientas',
      skills: ['Git', 'Docker', 'Linux', 'Jira'],
    },
    {
      category: 'Otros',
      skills: ['Testing manual y automatizado', 'Metodologías ágiles'],
    },
  ],
  experience: [
    {
      role: 'Desarrollador Java Fullstack SSR',
      organization:
        'SENASA · Servicio Nacional de Sanidad y Calidad Agroalimentaria',
      period: 'Diciembre 2021 – Actualidad',
      location: 'Buenos Aires (modalidad híbrida)',
      description:
        'Desarrollo, mantenimiento y evolución de sistemas backend y frontend utilizados a nivel nacional con Java, Spring Boot, Oracle y ReactJS/VueJS, priorizando mantenibilidad y performance.',
      highlights: [
        'Desarrollo, mantenimiento y evolución de sistemas backend y frontend utilizados a nivel nacional.',
        'Implementación de funcionalidades en Java + Spring Boot + Oracle y ReactJS/VueJS, priorizando mantenibilidad y performance.',
        'Participación en el ciclo completo de desarrollo: análisis, diseño, desarrollo, code review y despliegue.',
        'Dockerización y containerización de aplicaciones y servicios para estandarizar entornos (dev/test) y facilitar despliegues.',
        'Participación activa en procesos de modernización y migración tecnológica de sistemas legacy.',
        'Coordinación directa con otros desarrolladores y áreas funcionales para el análisis, implementación y mantenimiento de funcionalidades, utilizando Jira como herramienta de gestión.',
      ],
    },
  ],
  education: [
    {
      title: 'Licenciatura en Sistemas (4º año)',
      organization: 'Universidad Nacional de La Plata (UNLP)',
      period: '2017 – En curso',
    },
  ],
  languages: [
    {
      language: 'Inglés',
      level: 'Básico (lectura y escritura limitada)',
    },
  ],
};

export const skillGroups = profile.skillGroups;
export const languages = profile.languages;

export const projects = [
  {
    id: 'inicio',
    title: 'Inicio',
    kind: 'home',
    shortDescription:
      'Quién soy, qué hago y qué proyectos vas a encontrar en este portfolio.',
    description:
      "Soy Bautista D'Alessandro, desarrollador Java Fullstack con foco en backend. Acá reúno los proyectos que construyo y mantengo: sistemas de gestión, una agenda cultural y un juego de cartas. Recorré las islas para conocerlos y escribime si querés contactarme.",
    tagline: 'Desarrollador Java Fullstack orientado a backend',
    about:
      'Portfolio insular navegable. Presenta mi trayectoria profesional, experiencia en sistemas críticos del sector público y proyectos personales en producción.',
    role: 'Desarrollador Fullstack',
    features: [
      'Navegación interactiva por islas con canvas 2D y pixel art',
      'Rutas directas con historial y soporte completo de teclado',
      'CV completo interactivo y versión optimizada para impresión',
      'Diseño accesible con soporte para movimiento reducido',
    ],
    stack: ['React', 'Vite', 'Canvas API', 'CSS moderno'],
    status: 'En desarrollo',
    image: null,
    imageAlt: null,
    tags: ['Desarrollador Java Fullstack', 'Java', 'Spring Boot', 'React'],
    liveUrl: null,
    repoUrl: null,
  },
  {
    id: 'que-hay',
    title: 'Qué Hay',
    kind: 'agenda',
    shortDescription: 'Agenda de eventos, recitales y fiestas en La Plata.',
    description:
      'Sitio que reúne la agenda cultural de La Plata: eventos, recitales y fiestas en un solo lugar para consultar qué hay para hacer en la ciudad.',
    tagline: 'Agenda colaborativa de eventos, recitales y salidas en La Plata',
    about:
      'Plataforma web colaborativa para descubrir y compartir la agenda de eventos, recitales y salidas en La Plata. Permite explorar qué hacer por fecha, lugar y presupuesto mediante un mapa interactivo y filtros avanzados, además de publicar eventos y guardar recordatorios.',
    role: 'Creador y desarrollador fullstack: concepción, arquitectura, desarrollo de backend y frontend, modelo de datos y despliegue continuo.',
    features: [
      'Mapa interactivo con geolocalización de eventos culturales y salidas',
      'Filtros avanzados por fecha, lugar y presupuesto',
      'Detalle completo por evento con flyer, ubicación y accesos',
      'Publicación colaborativa de eventos con carga simplificada',
      'Autenticación con Google OAuth y guardado de eventos favoritos',
    ],
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'React Leaflet',
      'Fastify',
      'Neon Postgres',
      'Drizzle ORM',
      'Vercel',
      'Render',
    ],
    status: 'En producción',
    image: 'projects/que-hay.webp',
    imageAlt:
      'Captura de pantalla de Qué Hay mostrando la agenda de eventos y mapa de La Plata',
    tags: ['Agenda cultural', 'La Plata', 'Eventos'],
    liveUrl: 'https://quehaylp.com',
    repoUrl: null,
  },
  {
    id: 'copa-del-pueblo',
    title: 'Copa del Pueblo',
    kind: 'copa',
    shortDescription:
      'Duelo del Pueblo: juego de cartas de fútbol argentino por turnos.',
    description:
      'Duelo del Pueblo es un juego de cartas coleccionables de fútbol argentino por turnos, que se juega gratis en el navegador en copadelpueblo.com.ar.',
    tagline:
      'Juego de cartas coleccionables por turnos del fútbol argentino de todas las épocas',
    about:
      'Juego web por turnos ambientado en el fútbol argentino histórico y contemporáneo ("Duelo del Pueblo"). Construido sobre un monorepo modular con un motor de reglas determinista y versionado (rulesets), soporte para partidas contra CPU heurística y multijugador en tiempo real con repetición jugada a jugada.',
    role: 'Creador y desarrollador fullstack: diseño e implementación del motor determinista de reglas por turnos, CPU con IA heurística, backend API, interfaz web y suite de pruebas automatizadas.',
    features: [
      'Motor determinista de reglas por turnos con reglas versionadas',
      'Partidas contra CPU con IA heurística y simulación de jugadas',
      'Constructor y validador de mazos personalizados ("Mazos del Duelo")',
      'Replay determinista y relato jugada a jugada a partir del log de comandos',
      'Autenticación de usuarios y persistencia de partidas en PostgreSQL',
    ],
    stack: [
      'Next.js 16 (App Router)',
      'React 19',
      'TypeScript',
      'PostgreSQL',
      'Vitest',
      'Playwright',
      'Vercel',
    ],
    status: 'En producción',
    image: 'projects/copa-del-pueblo.webp',
    imageAlt:
      'Captura de pantalla de Copa del Pueblo mostrando el tablero del Duelo del Pueblo',
    tags: ['Juego de cartas', 'Fútbol argentino', 'Navegador'],
    liveUrl: 'https://copadelpueblo.com.ar',
    repoUrl: null,
  },
  {
    id: 'contacto',
    title: 'Contacto',
    kind: 'contact',
    shortDescription: 'Escribime: email, LinkedIn, GitHub y CV.',
    description:
      'Canales directos para conversar sobre oportunidades laborales, proyectos o colaboraciones: correo electrónico, perfiles profesionales de LinkedIn y GitHub, o descarga de mi currículum en PDF.',
    tagline: 'Canales directos de comunicación profesional y perfiles',
    about:
      'Página de contacto del portfolio insular. Reúne vías directas para escribirme por correo, conectar en redes profesionales o descargar mi currículum vitae actualizado.',
    role: 'Desarrollador Java Fullstack',
    features: [
      'Copia rápida de email al portapapeles con confirmación accesible',
      'Enlaces directos a perfiles profesionales en LinkedIn y GitHub',
      'Descarga directa del CV actualizado en formato PDF',
    ],
    stack: ['Email', 'LinkedIn', 'GitHub', 'CV (PDF)'],
    status: 'Disponible',
    image: null,
    imageAlt: null,
    tags: ['Email', 'LinkedIn', 'GitHub', 'CV'],
    liveUrl: null,
    repoUrl: null,
  },
];
