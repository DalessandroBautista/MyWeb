import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CarouselLayout.css';

export default function CarouselLayout({ children }) {
    const scrollContainerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollTo = (index) => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    const nextSlide = () => {
        if (activeIndex < children.length - 1) scrollTo(activeIndex + 1);
    };

    const prevSlide = () => {
        if (activeIndex > 0) scrollTo(activeIndex - 1);
    };

    // Update active index based on scroll position
    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.clientWidth;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <div className="carousel-wrapper">
            <div
                className="carousel-container"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                {React.Children.map(children, (child, index) => (
                    <div className="carousel-slide" key={index}>
                        {child}
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="carousel-controls">
                <button
                    className="carousel-btn"
                    onClick={prevSlide}
                    disabled={activeIndex === 0}
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={32} />
                </button>

                <div className="carousel-indicators">
                    {React.Children.map(children, (_, index) => (
                        <button
                            className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    className="carousel-btn"
                    onClick={nextSlide}
                    disabled={activeIndex === children.length - 1}
                    aria-label="Next Slide"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
}
