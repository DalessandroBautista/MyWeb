/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { projects as defaultProjects } from './content.js';

const baseUrl = import.meta.env.BASE_URL || '/';

export default function CvPage({
  profile,
  projects = defaultProjects,
  onBackToSea,
}) {
  const h1Ref = useRef(null);
  const cvHref = `${baseUrl}${profile.cvUrl.replace(/^\//, '')}`;
  const personalProjects = (projects || defaultProjects).filter(
    (p) =>
      p.id !== 'inicio' &&
      p.id !== 'contacto' &&
      p.kind !== 'home' &&
      p.kind !== 'contact'
  );

  useEffect(() => {
    document.title = "Sobre mí / CV · Bautista D'Alessandro";
    window.scrollTo(0, 0);
    h1Ref.current?.focus();
  }, []);

  return (
    <div className="page-container cv-page-view">
      <nav aria-label="Miga de pan" className="page-breadcrumb no-print">
        <a
          href="#inicio"
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
        <span className="breadcrumb-current" aria-current="page">
          Sobre mí / CV
        </span>
      </nav>

      <header className="cv-header">
        <p className="eyebrow">
          {profile.location} · {profile.workLocation}
        </p>
        <h1 ref={h1Ref} tabIndex={-1} className="page-title">
          {profile.name}
        </h1>
        <p className="cv-headline">{profile.role} (orientado a Backend)</p>

        <div className="cv-contact-bar" aria-label="Datos de contacto">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="cv-contact-item">
              <span className="contact-label">Email:</span> {profile.email}
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <span className="contact-label">LinkedIn:</span> linkedin.com/in/bautistadalessandro
            </a>
          )}
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item"
            >
              <span className="contact-label">GitHub:</span> github.com/DalessandroBautista
            </a>
          )}
        </div>

        <div className="cv-actions-row no-print">
          <a
            href={cvHref}
            download="CV_Bautista_DAlessandro.pdf"
            className="btn-primary-action"
          >
            Descargar CV (PDF) ↓
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary-action"
          >
            Imprimir ⎙
          </button>
        </div>
      </header>

      <div className="cv-sections-body">
        <section className="cv-section" aria-labelledby="cv-profile-title">
          <h2 id="cv-profile-title">Perfil Profesional</h2>
          <p className="cv-bio-text">{profile.bio}</p>
        </section>

        <section className="cv-section" aria-labelledby="cv-skills-title">
          <h2 id="cv-skills-title">Tecnologías y Herramientas</h2>
          <div className="cv-skills-grid">
            {profile.skillGroups?.map((group) => (
              <div key={group.category} className="cv-skill-card">
                <h3>{group.category}</h3>
                <ul className="cv-skill-tags">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-experience-title">
          <h2 id="cv-experience-title">Experiencia Laboral</h2>
          <div className="cv-timeline">
            {profile.experience?.map((job) => (
              <article
                key={`${job.organization}-${job.period}`}
                className="cv-timeline-item"
              >
                <header className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">{job.role}</h3>
                    <p className="cv-item-org">{job.organization}</p>
                  </div>
                  <div className="cv-item-meta">
                    <span className="cv-item-period">{job.period}</span>
                    <span className="cv-item-location">{job.location}</span>
                  </div>
                </header>
                <ul className="cv-bullets-list">
                  {job.highlights?.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-projects-title">
          <h2 id="cv-projects-title">Proyectos personales</h2>
          <div className="cv-projects-list">
            {personalProjects.map((item) => (
              <article key={item.id} className="cv-project-card">
                <header className="cv-project-card-header">
                  <div>
                    <h3 className="cv-project-title">{item.title}</h3>
                    <p className="cv-project-tagline">{item.tagline}</p>
                  </div>
                  {item.status && (
                    <span className="status-badge">{item.status}</span>
                  )}
                </header>
                <div className="cv-project-links no-print">
                  <a
                    href={`#proyecto/${item.id}`}
                    className="cv-project-link-internal"
                  >
                    Ver en portfolio →
                  </a>
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cv-project-link-external"
                    >
                      Visitar sitio ↗
                    </a>
                  )}
                </div>
                {item.liveUrl && (
                  <p className="cv-print-only-url print-only">
                    {item.liveUrl}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-education-title">
          <h2 id="cv-education-title">Formación Académica</h2>
          <div className="cv-timeline">
            {profile.education?.map((item) => (
              <article
                key={`${item.title}-${item.period}`}
                className="cv-timeline-item"
              >
                <header className="cv-item-header">
                  <div>
                    <h3 className="cv-item-title">{item.title}</h3>
                    <p className="cv-item-org">{item.organization}</p>
                  </div>
                  <div className="cv-item-meta">
                    <span className="cv-item-period">{item.period}</span>
                  </div>
                </header>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-section" aria-labelledby="cv-languages-title">
          <h2 id="cv-languages-title">Idiomas</h2>
          <ul className="cv-simple-list">
            {profile.languages?.map((lang) => (
              <li key={lang.language}>
                <strong>{lang.language}:</strong> {lang.level}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="cv-page-footer no-print">
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            onBackToSea?.();
          }}
          className="btn-back-sea"
        >
          ← Volver al mar
        </a>
      </footer>
    </div>
  );
}
