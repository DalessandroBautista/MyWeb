import React from 'react';
import { Briefcase, GraduationCap, Award, Download } from 'lucide-react';
import './CVSection.css';

export default function CVSection() {
    return (
        <section className="cv-section">
            <div className="cv-container">
                <div className="cv-header">
                    <h2 className="section-title">Mi Trayectoria</h2>
                    <a
                        href="/CV_Bautista_DAlessandro.pdf"
                        download="CV_Bautista_DAlessandro.pdf"
                        className="btn-download"
                    >
                        <Download size={18} /> Descargar CV
                    </a>
                </div>

                <div className="cv-content">
                    {/* Experience Timeline */}
                    <div className="cv-column">
                        <h3 className="column-title">
                            <Briefcase className="icon-accent" size={24} /> Experiencia
                        </h3>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <span className="timeline-date">Dic 2021 - Actualidad</span>
                                    <h4 className="timeline-role">Desarrollador Java Fullstack SSR</h4>
                                    <span className="timeline-company">SENASA • Buenos Aires</span>
                                    <p className="timeline-desc">
                                        Desarrollo, mantenimiento y evolución de sistemas backend y frontend a nivel nacional. Implementación con Java, Spring Boot, Oracle y ReactJS/VueJS. Dockerización de aplicaciones.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="column-title mt-8">
                            <GraduationCap className="icon-accent" size={24} /> Educación
                        </h3>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <span className="timeline-date">2017 - Presente</span>
                                    <h4 className="timeline-role">Licenciatura en Sistemas (4º año)</h4>
                                    <span className="timeline-company">UNLP • La Plata</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Area */}
                    <div className="cv-column">
                        <h3 className="column-title">
                            <Award className="icon-accent" size={24} /> Habilidades
                        </h3>

                        <div className="skills-group">
                            <h4 className="skill-category">Backend</h4>
                            <div className="skill-tags">
                                <span className="skill-tag">Java 11/17</span>
                                <span className="skill-tag">Spring Boot</span>
                                <span className="skill-tag">Maven</span>
                                <span className="skill-tag">JHipster</span>
                            </div>
                        </div>

                        <div className="skills-group">
                            <h4 className="skill-category">Frontend</h4>
                            <div className="skill-tags">
                                <span className="skill-tag">ReactJS</span>
                                <span className="skill-tag">VueJS</span>
                                <span className="skill-tag">HTML/CSS</span>
                                <span className="skill-tag">TypeScript</span>
                            </div>
                        </div>

                        <div className="skills-group">
                            <h4 className="skill-category">Base de Datos & Tools</h4>
                            <div className="skill-tags">
                                <span className="skill-tag">Oracle SQL</span>
                                <span className="skill-tag">Docker</span>
                                <span className="skill-tag">Linux</span>
                                <span className="skill-tag">Git & Jira</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
