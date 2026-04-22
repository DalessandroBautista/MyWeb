import React from 'react';
import CarouselLayout from './components/CarouselLayout';
import Hero from './components/Hero';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';

function App() {
  return (
    <CarouselLayout>
      <Hero />
      <CVSection />
      <ProjectsSection />
    </CarouselLayout>
  );
}

export default App;
