import { useCallback, useEffect, useState } from 'react';
import { profile, projects } from './portfolio/content.js';
import IslandScene from './portfolio/IslandScene.jsx';
import ProjectPage from './portfolio/ProjectPage.jsx';
import CvPage from './portfolio/CvPage.jsx';
import ContactPage from './portfolio/ContactPage.jsx';
import './styles/global.css';

const parseHash = (hashString) => {
  const raw = (hashString || '').replace(/^#/, '');
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  if (!decoded || decoded === 'inicio') {
    return {
      view: 'sea',
      selectedIndex: 0,
      canonical: '#inicio',
      isValid: true,
    };
  }

  if (decoded === 'cv') {
    return {
      view: 'cv',
      selectedIndex: 0,
      canonical: '#cv',
      isValid: true,
    };
  }

  if (decoded === 'contacto') {
    const contactIndex = projects.findIndex((p) => p.id === 'contacto');
    return {
      view: 'contact',
      selectedIndex: contactIndex >= 0 ? contactIndex : 3,
      canonical: '#contacto',
      isValid: true,
    };
  }

  if (
    decoded === 'isla/contacto' ||
    decoded === 'mar/contacto' ||
    decoded === 'isla-contacto'
  ) {
    const contactIndex = projects.findIndex((p) => p.id === 'contacto');
    return {
      view: 'sea',
      selectedIndex: contactIndex >= 0 ? contactIndex : 3,
      canonical: '#isla/contacto',
      isValid: true,
    };
  }

  if (decoded.startsWith('isla/') || decoded.startsWith('mar/')) {
    const islandId = decoded.replace(/^(isla|mar)\//, '');
    const index = projects.findIndex((p) => p.id === islandId);
    if (index >= 0) {
      return {
        view: 'sea',
        selectedIndex: index,
        canonical:
          islandId === 'contacto' ? '#isla/contacto' : `#${projects[index].id}`,
        isValid: true,
      };
    }
  }

  if (decoded.startsWith('proyecto/')) {
    const projectId = decoded.slice('proyecto/'.length);
    const index = projects.findIndex(
      (p) =>
        p.id === projectId &&
        p.id !== 'inicio' &&
        p.id !== 'contacto' &&
        p.kind !== 'home' &&
        p.kind !== 'contact'
    );
    if (index >= 0) {
      return {
        view: 'project',
        selectedIndex: index,
        projectId,
        canonical: `#proyecto/${projectId}`,
        isValid: true,
      };
    }
    return {
      view: 'sea',
      selectedIndex: 0,
      canonical: '#inicio',
      isValid: false,
    };
  }

  const seaIndex = projects.findIndex((p) => p.id === decoded);
  if (seaIndex >= 0) {
    return {
      view: 'sea',
      selectedIndex: seaIndex,
      canonical:
        projects[seaIndex].id === 'contacto'
          ? '#isla/contacto'
          : `#${projects[seaIndex].id}`,
      isValid: true,
    };
  }

  return {
    view: 'sea',
    selectedIndex: 0,
    canonical: '#inicio',
    isValid: false,
  };
};

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
};

export default function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        view: 'sea',
        selectedIndex: 0,
        canonical: '#inicio',
        isValid: true,
      };
    }
    return parseHash(window.location.hash);
  });

  const [style, setStyle] = useState('2d');
  const [paused, setPaused] = useState(false);
  const [traveling, setTraveling] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(pointer: coarse)');
    const updatePointer = () => setIsCoarsePointer(mql.matches);
    updatePointer();

    if (mql.addEventListener) {
      mql.addEventListener('change', updatePointer);
      return () => mql.removeEventListener('change', updatePointer);
    } else if (mql.addListener) {
      mql.addListener(updatePointer);
      return () => mql.removeListener(updatePointer);
    }
  }, []);

  const selected = route.selectedIndex;
  const current = projects[selected] || projects[0];

  useEffect(() => {
    const syncRoute = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed.isValid) {
        window.history.replaceState(null, '', '#inicio');
      }
      setRoute(parsed);
    };

    if (window.location.hash !== route.canonical) {
      if (route.isValid) {
        window.history.replaceState(null, '', route.canonical);
      } else {
        window.history.replaceState(null, '', '#inicio');
      }
    }

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, [route.canonical, route.isValid]);

  useEffect(() => {
    if (route.view === 'sea') {
      document.title =
        current.id === 'inicio'
          ? "Bautista D'Alessandro · Portfolio"
          : `${current.title} · Bautista D'Alessandro`;
    }
  }, [route.view, current]);

  const navigate = useCallback((index) => {
    if (!Number.isInteger(index) || index < 0 || index >= projects.length) return;
    const target = projects[index];
    const hash = target.id === 'contacto' ? '#isla/contacto' : `#${target.id}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
    setRoute(parseHash(hash));
  }, []);

  const openIslandPage = useCallback((index) => {
    const target = projects[index];
    if (!target) return;
    let hash;
    if (target.id === 'inicio') {
      hash = '#cv';
    } else if (target.id === 'contacto') {
      hash = '#contacto';
    } else {
      hash = `#proyecto/${target.id}`;
    }
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
    setRoute(parseHash(hash));
  }, []);

  const navigateSea = useCallback((indexOrId) => {
    let index = 0;
    if (typeof indexOrId === 'number') {
      index = indexOrId;
    } else if (typeof indexOrId === 'string') {
      const found = projects.findIndex((p) => p.id === indexOrId);
      index = found >= 0 ? found : 0;
    }
    const target = projects[index];
    const hash =
      target?.id === 'contacto'
        ? '#isla/contacto'
        : `#${target?.id || 'inicio'}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
    setRoute(parseHash(hash));
  }, []);

  const handleIslandClick = useCallback(
    (index) => {
      if (traveling) return;
      if (index !== selected) {
        navigate(index);
      } else {
        openIslandPage(index);
      }
    },
    [traveling, selected, navigate, openIslandPage]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      if (route.view === 'sea') {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          navigate(selected + 1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          navigate(selected - 1);
        } else if (event.key === 'Enter') {
          if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
            event.preventDefault();
            openIslandPage(selected);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, openIslandPage, route.view, selected]);

  const handleTravel = useCallback(() => setTraveling(true), []);
  const handleArrive = useCallback(() => setTraveling(false), []);

  const focusAbout = () => {
    const section = document.getElementById('about');
    if (!section) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    });
    section.querySelector('h2')?.focus({ preventScroll: true });
  };

  return (
    <main className="portfolio">
      {route.view === 'sea' && (
        <>
          <header className="topbar">
            <div>
              <p className="eyebrow">
                Bitácora de proyectos · {profile.location}
              </p>
              <h1>{profile.name}</h1>
              <p className="role">{profile.role}</p>
            </div>
            <nav aria-label="Contacto" className="social">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {profile.email && <a href={`mailto:${profile.email}`}>Email</a>}
            </nav>
          </header>

          <section className="layout" aria-label="Portfolio insular">
            <aside className="sidebar">
              <h2>Destinos</h2>
              <nav aria-label="Proyectos">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    className="destination"
                    aria-current={index === selected ? 'location' : undefined}
                    onClick={() => navigate(index)}
                  >
                    {project.title}
                  </button>
                ))}
              </nav>
              <button type="button" className="about" onClick={focusAbout}>
                Sobre mí ↓
              </button>
            </aside>

            <div className="main-column">
              <IslandScene
                projects={projects}
                selectedIndex={selected}
                onArrive={handleArrive}
                onTravel={handleTravel}
                onIslandClick={handleIslandClick}
                style={style}
                paused={paused}
              />

              <p className="island-hint" role="note">
                {isCoarsePointer
                  ? 'Tocá una isla para entrar'
                  : 'Hacé clic en una isla para entrar · ← → para navegar'}
              </p>

              <div className="controls">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(selected - 1)}
                    disabled={selected === 0}
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(selected + 1)}
                    disabled={selected === projects.length - 1}
                  >
                    Siguiente →
                  </button>
                </div>
                <span role="status" aria-live="polite">
                  {traveling
                    ? `Navegando hacia ${current.title}`
                    : `${selected + 1} / ${projects.length} · ${current.title}`}
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={paused}
                    onChange={(event) => setPaused(event.target.checked)}
                  />{' '}
                  Pausar ambiente
                </label>
                <div>
                  {[
                    ['2d', 'Ilustración 2D'],
                    ['pixel', 'Pixel'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={style === value}
                      onClick={() => setStyle(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <article
                className="project"
                aria-labelledby="current-project-title"
              >
                <div className="project-main-info">
                  <p className="eyebrow">
                    Parada {String(selected + 1).padStart(2, '0')} de{' '}
                    {projects.length}
                  </p>
                  <h2 id="current-project-title">{current.title}</h2>
                  <p>{current.shortDescription}</p>
                  <p>{current.description}</p>
                  <ul aria-label="Etiquetas del proyecto">
                    {current.tags?.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
                <div className="project-actions-column">
                  <button
                    type="button"
                    className="btn-enter-island"
                    onClick={() => openIslandPage(selected)}
                  >
                    {current.id === 'inicio' || current.kind === 'home'
                      ? 'Ver CV completo ↵'
                      : current.id === 'contacto' || current.kind === 'contact'
                      ? 'Ver contacto ↵'
                      : 'Entrar a la isla ↵'}
                  </button>
                  <div className="links">
                    {current.liveUrl && (
                      <a
                        href={current.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visitar sitio ↗
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Más en GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section
            className="about-section about-summary"
            id="about"
            aria-labelledby="about-title"
          >
            <p className="eyebrow">Un poco sobre mí</p>
            <h2 id="about-title" tabIndex={-1}>
              {profile.role}
            </h2>
            <p>{profile.bio}</p>

            <div className="about-summary-cta">
              <a
                href="#cv"
                onClick={(e) => {
                  e.preventDefault();
                  openIslandPage(0);
                }}
                className="btn-view-full-cv"
              >
                Ver CV completo →
              </a>
            </div>

            <div className="contact-links" aria-label="Contacto y enlaces">
              {profile.email && (
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </section>
        </>
      )}

      {route.view === 'project' && (
        <ProjectPage
          project={current}
          allProjects={projects}
          onBackToSea={() => navigateSea(current.id)}
        />
      )}

      {route.view === 'cv' && (
        <CvPage
          profile={profile}
          projects={projects}
          onBackToSea={() => navigateSea('inicio')}
        />
      )}

      {route.view === 'contact' && (
        <ContactPage
          profile={profile}
          onBackToSea={() => navigateSea('contacto')}
          onNavigateCv={() => {
            if (window.location.hash !== '#cv') {
              window.history.pushState(null, '', '#cv');
            }
            setRoute(parseHash('#cv'));
          }}
        />
      )}
    </main>
  );
}
