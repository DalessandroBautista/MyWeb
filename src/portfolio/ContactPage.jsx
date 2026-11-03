/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

const baseUrl = import.meta.env.BASE_URL || '/';

export default function ContactPage({ profile, onBackToSea, onNavigateCv }) {
  const h1Ref = useRef(null);
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied' | 'error'
  const timerRef = useRef(null);

  useEffect(() => {
    document.title = "Contacto · Bautista D'Alessandro";
    window.scrollTo(0, 0);
    h1Ref.current?.focus();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let success = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(profile.email);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = profile.email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopyState('copied');
      timerRef.current = setTimeout(() => {
        setCopyState('idle');
      }, 2500);
    } else {
      setCopyState('error');
      timerRef.current = setTimeout(() => {
        setCopyState('idle');
      }, 4000);
    }
  };

  const cvHref = `${baseUrl}${profile.cvUrl.replace(/^\//, '')}`;

  return (
    <div className="page-container contact-page-view">
      <nav aria-label="Miga de pan" className="page-breadcrumb no-print">
        <a
          href="#isla/contacto"
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
          Contacto
        </span>
      </nav>

      <header className="contact-header">
        <p className="eyebrow">Contacto · Bautista D&apos;Alessandro</p>
        <h1 ref={h1Ref} tabIndex={-1} className="page-title">
          Contacto
        </h1>
        <p className="contact-headline">
          Escribime: email, LinkedIn, GitHub y CV.
        </p>
      </header>

      <section
        className="contact-cards-grid"
        aria-label="Vías directas de contacto"
      >
        <article className="contact-card">
          <header className="contact-card-header">
            <h2 className="contact-card-title">Email</h2>
            <a href={`mailto:${profile.email}`} className="contact-card-value">
              {profile.email}
            </a>
          </header>
          <p className="contact-card-desc">
            Vía directa para conversar sobre búsquedas laborales, proyectos o
            consultas técnicas.
          </p>
          <div className="contact-card-actions">
            <a href={`mailto:${profile.email}`} className="btn-primary-action">
              Escribir email ↗
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-secondary-action btn-copy-email"
              aria-describedby="copy-announcement"
            >
              {copyState === 'copied' ? '¡Copiado!' : 'Copiar email'}
            </button>
          </div>
          <div
            id="copy-announcement"
            role="status"
            aria-live="polite"
            className={`contact-copy-status ${copyState}`}
          >
            {copyState === 'copied' && 'Copiado'}
            {copyState === 'error' &&
              'No se pudo copiar automáticamente: seleccioná el email de arriba.'}
          </div>
        </article>

        <article className="contact-card">
          <header className="contact-card-header">
            <h2 className="contact-card-title">LinkedIn</h2>
            <span className="contact-card-value">
              linkedin.com/in/bautistadalessandro
            </span>
          </header>
          <p className="contact-card-desc">
            Perfil profesional, historial laboral, validación de aptitudes y
            red de contactos.
          </p>
          <div className="contact-card-actions">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-action"
            >
              Ver perfil en LinkedIn ↗
            </a>
          </div>
        </article>

        <article className="contact-card">
          <header className="contact-card-header">
            <h2 className="contact-card-title">GitHub</h2>
            <span className="contact-card-value">
              github.com/DalessandroBautista
            </span>
          </header>
          <p className="contact-card-desc">
            Repositorios públicos, código fuente, historial de contribuciones y
            proyectos personales.
          </p>
          <div className="contact-card-actions">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-action"
            >
              Ver perfil en GitHub ↗
            </a>
          </div>
        </article>

        <article className="contact-card">
          <header className="contact-card-header">
            <h2 className="contact-card-title">Currículum Vitae</h2>
            <span className="contact-card-value">
              CV_Bautista_DAlessandro.pdf
            </span>
          </header>
          <p className="contact-card-desc">
            Documento completo en PDF con experiencia en sistemas críticos,
            formación académica y stack tecnológico.
          </p>
          <div className="contact-card-actions">
            <a
              href={cvHref}
              download="CV_Bautista_DAlessandro.pdf"
              className="btn-primary-action"
            >
              Descargar CV (PDF) ↓
            </a>
            <a
              href="#cv"
              onClick={(e) => {
                e.preventDefault();
                onNavigateCv?.();
              }}
              className="btn-secondary-action"
            >
              Ver CV web →
            </a>
          </div>
        </article>
      </section>

      <footer className="contact-page-footer no-print">
        <a
          href="#isla/contacto"
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
