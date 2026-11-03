/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

const baseUrl = import.meta.env.BASE_URL || '/';

export default function ProjectPage({
  project,
  allProjects,
  onBackToSea,
}) {
  const h1Ref = useRef(null);

  useEffect(() => {
    document.title = `${project.title} · Bautista D'Alessandro`;
    window.scrollTo(0, 0);
    h1Ref.current?.focus();
  }, [project]);

  const projectsWithPages = allProjects.filter(
    (p) =>
      p.id !== 'inicio' &&
      p.id !== 'contacto' &&
      p.kind !== 'home' &&
      p.kind !== 'contact'
  );
  const currentIndex = projectsWithPages.findIndex((p) => p.id === project.id);
  const count = projectsWithPages.length;

  let singleOtherProject = null;
  let prevProject = null;
  let nextProject = null;

  if (count === 2) {
    singleOtherProject = projectsWithPages.find((p) => p.id !== project.id);
  } else if (count >= 3) {
    const prevCandidate = projectsWithPages[(currentIndex - 1 + count) % count];
    const nextCandidate = projectsWithPages[(currentIndex + 1) % count];
    if (prevCandidate && nextCandidate && prevCandidate.id !== nextCandidate.id) {
      prevProject = prevCandidate;
      nextProject = nextCandidate;
    }
  }

  return (
    <div className="page-container project-page-view">
      <nav aria-label="Miga de pan" className="page-breadcrumb">
        <a
          href={`#${project.id}`}
          onClick={(e) => {
            e.preventDefault();
            onBackToSea?.();
          }}
          className="back-link"
        >
          ← Volver al mar
        </a>
        <span className="breadcrumb-separator" aria-hidden="true">
          /
        </span>
        <span className="breadcrumb-category">Proyectos</span>
        <span className="breadcrumb-separator" aria-hidden="true">
          /
        </span>
        <span className="breadcrumb-current" aria-current="page">
          {project.title}
        </span>
      </nav>

      <header className="project-hero">
        <p className="eyebrow">
          Proyecto · {project.tags?.join(' · ') || 'Web'}
        </p>
        <h1 ref={h1Ref} tabIndex={-1} className="page-title">
          {project.title}
        </h1>
        <p className="project-tagline">{project.tagline}</p>

        {project.image && (
          <div className="project-screenshot-card">
            <img
              src={`${baseUrl}${project.image.replace(/^\//, '')}`}
              alt={project.imageAlt || `Captura de pantalla de ${project.title}`}
              className="project-screenshot"
              loading="lazy"
            />
          </div>
        )}
      </header>

      <div className="project-body-layout">
        <div className="project-main-content">
          <section className="editorial-section">
            <h2>Qué es</h2>
            <p>{project.about}</p>
          </section>

          <section className="editorial-section">
            <h2>Qué hice</h2>
            <p>{project.role}</p>
          </section>

          <section className="editorial-section">
            <h2>Funcionalidades</h2>
            <ul className="editorial-features-list">
              {project.features?.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="project-sidebar" aria-label="Ficha del proyecto">
          <div className="project-sidebar-card">
            <section className="project-sidebar-section">
              <h2>Estado</h2>
              <p className="project-status-info">
                <span className="status-badge">{project.status}</span>
                {project.liveUrl && (
                  <span className="status-url">
                    {' · '}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.liveUrl}
                    </a>
                  </span>
                )}
              </p>
            </section>

            {project.liveUrl && (
              <div className="project-sidebar-action">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-action project-sidebar-btn"
                >
                  Visitar sitio ↗
                </a>
              </div>
            )}

            <section className="project-sidebar-section">
              <h2>Stack</h2>
              <div className="editorial-chips">
                {project.stack?.map((tech) => (
                  <span key={tech} className="editorial-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <div className="project-sidebar-back">
              <a
                href={`#${project.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onBackToSea?.();
                }}
                className="btn-back-sea sidebar-back-btn"
              >
                ← Volver al mar
              </a>
            </div>
          </div>
        </aside>
      </div>

      <footer className="project-footer-nav">
        <nav aria-label="Navegación entre proyectos" className="project-nav-row">
          {singleOtherProject && (
            <a
              href={`#proyecto/${singleOtherProject.id}`}
              className="project-nav-link next project-nav-single"
              aria-label={`Otro proyecto: ${singleOtherProject.title} →`}
            >
              <span className="nav-text">
                <span className="nav-label">Otro proyecto:</span>
                <span className="nav-title">{singleOtherProject.title}</span>
              </span>
              <span className="nav-arrow" aria-hidden="true">
                →
              </span>
            </a>
          )}
          {prevProject && (
            <a
              href={`#proyecto/${prevProject.id}`}
              className="project-nav-link prev"
            >
              <span className="nav-arrow" aria-hidden="true">
                ←
              </span>
              <span className="nav-text">
                <span className="nav-label">Proyecto anterior</span>
                <span className="nav-title">{prevProject.title}</span>
              </span>
            </a>
          )}
          {nextProject && (
            <a
              href={`#proyecto/${nextProject.id}`}
              className="project-nav-link next"
            >
              <span className="nav-text">
                <span className="nav-label">Proyecto siguiente</span>
                <span className="nav-title">{nextProject.title}</span>
              </span>
              <span className="nav-arrow" aria-hidden="true">
                →
              </span>
            </a>
          )}
        </nav>
      </footer>
    </div>
  );
}
