import React from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-content animate-fade-in">
                <h1 className="hero-title">
                    Hola, soy <span className="highlight">Bautista</span>
                </h1>
                <h2 className="hero-subtitle">
                    Desarrollador Java Fullstack
                </h2>
                <p className="hero-description">
                    Con más de 4 años de experiencia profesional construyendo
                    soluciones robustas y escalables. Especializado en backend,
                    orientado a la calidad del software.
                </p>

                <div className="hero-actions">
                    <button
                        className="btn-primary"
                        onClick={() => document.querySelector('.carousel-btn:last-child').click()}
                    >
                        Ver Mi CV <ArrowRight size={20} />
                    </button>

                    <div className="social-links">
                        <a href="https://linkedin.com/in/bautistadalessandro" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                        <a href="mailto:dalessandrobau@gmail.com" aria-label="Email">
                            <Mail size={24} />
                        </a>
                        {/* Si tuviera Github, se agregaría aquí. Agrego placeholder por si lo requiere */}
                        <a href="#" target="_blank" rel="noreferrer" aria-label="GitHub">
                            <Github size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="decoration-circle-1" />
            <div className="decoration-circle-2" />
        </section>
    );
}
