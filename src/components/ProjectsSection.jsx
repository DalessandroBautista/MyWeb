import React from 'react';
import { ExternalLink, Github, Code2, Database } from 'lucide-react';
import './ProjectsSection.css';

const projectsData = [
    {
        title: 'Club Management App',
        description: 'Sistema integral de gestión de clubes con dashboard administrativo, carnet de socio digital mediante QR, y gestión de sponsors/beneficios. Refactorización de entidades como "Socio" para mejor escalabilidad.',
        tags: ['Java', 'Spring Boot', 'React', 'Oracle SQL'],
        icon: <Database size={24} />,
        githubUrl: '#',
        liveUrl: '#'
    },
    {
        title: 'GPS Analytics 2.0',
        description: 'Plataforma para el análisis de métricas GPS de jugadores. Implementación de control de acceso avanzado y resolución de problemas de autorización (Spring Security) para roles como Preparador Físico (PF).',
        tags: ['Java 17', 'Spring Security', 'REST APIs', 'VueJS'],
        icon: <Code2 size={24} />,
        githubUrl: '#',
        liveUrl: '#'
    },
    {
        title: 'SENASA Nacional',
        description: 'Desarrollo y evolución de sistemas críticos para la trazabilidad alimentaria a nivel nacional, modernizando plataformas legacy con stack tecnológico actualizado y contenedores Docker.',
        tags: ['Java', 'Spring Boot', 'Docker', 'Oracle'],
        icon: <Database size={24} />,
        githubUrl: '#',
        liveUrl: '#'
    }
];

export default function ProjectsSection() {
    return (
        <section className="projects-section">
            <div className="projects-container">
                <h2 className="section-title text-center mb-12">Proyectos Destacados</h2>

                <div className="projects-grid">
                    {projectsData.map((project, index) => (
                        <div className="project-card" key={index}>
                            <div className="project-icon-wrapper">
                                {project.icon}
                            </div>
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>

                            <div className="project-tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>

                            <div className="project-links">
                                <a href={project.githubUrl} className="project-link" aria-label="Github">
                                    <Github size={20} /> Código
                                </a>
                                <a href={project.liveUrl} className="project-link" aria-label="Demo">
                                    <ExternalLink size={20} /> Demo
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
