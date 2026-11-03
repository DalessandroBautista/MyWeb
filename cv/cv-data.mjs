// Contenido del CV en español e inglés. Fuente: CV de octubre 2026
// (~/Descargas/CV_Bautista_DAlessandro.pdf) + proyectos de src/portfolio/content.js.
// No agregar métricas, empleos ni tecnologías que no estén respaldados.

const contact = {
  email: 'dalessandrobau@gmail.com',
  portfolio: 'https://dalessandrobautista.github.io',
  linkedin: 'https://www.linkedin.com/in/bautistadalessandro',
  github: 'https://github.com/DalessandroBautista',
};

export const cv = {
  es: {
    lang: 'es',
    file: 'cv.pdf',
    title: "CV · Bautista D'Alessandro",
    name: "Bautista D'Alessandro",
    headline: 'Desarrollador Java Fullstack · Spring Boot · React · TypeScript',
    location: 'La Plata, Buenos Aires, Argentina',
    contact,
    labels: {
      profile: 'Perfil',
      skills: 'Tecnologías',
      experience: 'Experiencia',
      projects: 'Proyectos personales',
      education: 'Formación',
      languages: 'Idiomas',
      portfolio: 'Portfolio',
    },
    profile:
      'Desarrollador Java Fullstack con más de 4 años de experiencia en el desarrollo, mantenimiento y modernización de aplicaciones empresariales críticas de alcance nacional, vinculadas a control, fiscalización y trazabilidad agroalimentaria. Trabajo con Java 11/17, Spring Boot, Hibernate/JPA, Oracle, React y TypeScript, en todo el ciclo de desarrollo: análisis y diseño, code review, testing, despliegue y soporte post-implementación. Por fuera del trabajo diseño, construyo y opero productos web propios en producción.',
    skills: [
      ['Backend', 'Java 11/17 · Spring Boot · Hibernate/JPA · Maven · APIs REST · JHipster · Node.js (Fastify)'],
      ['Frontend', 'React · TypeScript · Next.js · Vue.js · HTML · CSS'],
      ['Bases de datos', 'Oracle · PostgreSQL · SQL'],
      ['Infra y seguridad', 'Docker · Keycloak · Linux · WildFly · JBoss · Vercel'],
      ['Integraciones', 'REST · SOAP · JSON · OAuth'],
      ['Herramientas', 'Git · GitLab · SVN · Jira · JasperReports · Vitest · Playwright'],
      ['Prácticas', 'Scrum · Code review · Testing · Integración de sistemas · Modernización de legacy'],
    ],
    experience: [
      {
        org: 'SENASA · Servicio Nacional de Sanidad y Calidad Agroalimentaria',
        role: 'Desarrollador Java Fullstack Semi Senior',
        meta: 'Buenos Aires (híbrido)',
        period: 'Dic. 2021 – Actualidad',
        bullets: [
          'Desarrollo de funcionalidades y mantenimiento evolutivo de aplicaciones de uso nacional con Java 11/17, Spring Boot, Oracle SQL, React y TypeScript.',
          'Implementación de reglas de negocio críticas para procesos de control, fiscalización, certificación y trazabilidad agroalimentaria.',
          'Desarrollo y mantenimiento de APIs REST e integraciones entre sistemas, incluidos servicios legacy REST y SOAP.',
          'Containerización de aplicaciones con Docker y autenticación y autorización centralizadas con Keycloak.',
          'Modernización de aplicaciones Java legacy: actualización de dependencias, frameworks y servidores JBoss/WildFly.',
          'Migración de repositorios de SVN a Git/GitLab, preservando historial, versionado y ramas de desarrollo.',
          'Reportes con JasperReports; análisis, diseño, code review, testing, despliegues y soporte post-implementación junto a equipos técnicos y funcionales (Scrum, Jira).',
        ],
      },
    ],
    projects: [
      {
        name: 'Copa del Pueblo',
        url: 'https://copadelpueblo.com.ar',
        stack: 'Next.js · React · TypeScript · PostgreSQL · Vitest · Playwright',
        text: 'Juego de cartas por turnos del fútbol argentino, en producción. Motor de reglas determinista y versionado, CPU con IA heurística, replay jugada a jugada, constructor de mazos y autenticación de usuarios.',
      },
      {
        name: 'Qué Hay',
        url: 'https://quehaylp.com',
        stack: 'React · TypeScript · Fastify · Postgres · Drizzle ORM · Leaflet',
        text: 'Agenda colaborativa de eventos y salidas en La Plata, en producción. Mapa interactivo, filtros por fecha, lugar y presupuesto, publicación de eventos y login con Google OAuth.',
      },
      {
        name: 'Portfolio interactivo',
        url: contact.portfolio,
        stack: 'React · Vite · Canvas API · GitHub Pages',
        text: 'Portfolio navegable en lancha entre islas de proyectos, con render 2D y pixel art, rutas con historial y accesibilidad por teclado.',
      },
    ],
    education: [
      {
        title: 'Licenciatura en Sistemas',
        org: 'Universidad Nacional de La Plata (UNLP)',
        period: '2017 – En curso (4.º año)',
      },
    ],
    languages: ['Español: nativo', 'Inglés: lectura de documentación técnica'],
  },

  en: {
    lang: 'en',
    file: 'cv-en.pdf',
    title: "Resume · Bautista D'Alessandro",
    name: "Bautista D'Alessandro",
    headline: 'Java Full Stack Developer · Spring Boot · React · TypeScript',
    location: 'La Plata, Buenos Aires, Argentina',
    contact,
    labels: {
      profile: 'Profile',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Personal projects',
      education: 'Education',
      languages: 'Languages',
      portfolio: 'Portfolio',
    },
    profile:
      'Java Full Stack Developer with 4+ years of experience building, maintaining and modernizing critical nationwide enterprise applications for agri-food control, inspection and traceability. I work with Java 11/17, Spring Boot, Hibernate/JPA, Oracle, React and TypeScript across the full development lifecycle: analysis and design, code review, testing, deployment and post-release support. Outside work, I design, build and run my own web products in production.',
    skills: [
      ['Backend', 'Java 11/17 · Spring Boot · Hibernate/JPA · Maven · REST APIs · JHipster · Node.js (Fastify)'],
      ['Frontend', 'React · TypeScript · Next.js · Vue.js · HTML · CSS'],
      ['Databases', 'Oracle · PostgreSQL · SQL'],
      ['Infra & security', 'Docker · Keycloak · Linux · WildFly · JBoss · Vercel'],
      ['Integrations', 'REST · SOAP · JSON · OAuth'],
      ['Tools', 'Git · GitLab · SVN · Jira · JasperReports · Vitest · Playwright'],
      ['Practices', 'Scrum · Code review · Testing · System integration · Legacy modernization'],
    ],
    experience: [
      {
        org: 'SENASA · National Agri-Food Health and Quality Service (Argentina)',
        role: 'Semi-Senior Java Full Stack Developer',
        meta: 'Buenos Aires (hybrid)',
        period: 'Dec 2021 – Present',
        bullets: [
          'Build features and evolve nationwide applications using Java 11/17, Spring Boot, Oracle SQL, React and TypeScript.',
          'Implement critical business rules for agri-food control, inspection, certification and traceability processes.',
          'Develop and maintain REST APIs and system integrations, including legacy REST and SOAP services.',
          'Containerized applications with Docker and implemented centralized authentication and authorization with Keycloak.',
          'Modernize legacy Java applications: upgrading dependencies, frameworks and JBoss/WildFly application servers.',
          'Migrated repositories from SVN to Git/GitLab, preserving history, versioning strategy and development branches.',
          'JasperReports reporting; analysis, design, code review, testing, deployments and post-release support with technical and business teams (Scrum, Jira).',
        ],
      },
    ],
    projects: [
      {
        name: 'Copa del Pueblo',
        url: 'https://copadelpueblo.com.ar',
        stack: 'Next.js · React · TypeScript · PostgreSQL · Vitest · Playwright',
        text: 'Turn-based Argentine football card game, live in production. Deterministic, versioned rules engine, heuristic AI opponent, play-by-play replay, deck builder and user authentication.',
      },
      {
        name: 'Qué Hay',
        url: 'https://quehaylp.com',
        stack: 'React · TypeScript · Fastify · Postgres · Drizzle ORM · Leaflet',
        text: 'Community events and nightlife guide for La Plata, live in production. Interactive map, filters by date, venue and budget, event publishing and Google OAuth sign-in.',
      },
      {
        name: 'Interactive portfolio',
        url: contact.portfolio,
        stack: 'React · Vite · Canvas API · GitHub Pages',
        text: 'Portfolio you explore by boat across project islands, with 2D and pixel-art rendering, history-aware routes and keyboard accessibility.',
      },
    ],
    education: [
      {
        title: 'Bachelor’s Degree in Information Systems',
        org: 'National University of La Plata (UNLP)',
        period: '2017 – In progress (4th year)',
      },
    ],
    languages: ['Spanish: native', 'English: technical reading'],
  },
};
