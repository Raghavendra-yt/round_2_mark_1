import { useRef, memo } from 'react';

/** Single animated particle in the hero background. */
const Particle = memo(function Particle({ size, left, duration, delay }) {
  return (
    <div
      className="particle"
      style={{
        width:             `${size}px`,
        height:            `${size}px`,
        left:              `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay:    `${delay}s`,
      }}
    />
  );
});

Particle.displayName = 'Particle';

/** Full-bleed hero section with animated particles and CTA buttons. */
function Hero() {
  // Stable particles via ref — won't re-randomize on re-renders
  const particlesRef = useRef(
    Array.from({ length: 14 }, (_, index) => ({
      id:       index,
      size:     Math.random() * 4 + 2,
      left:     Math.random() * 100,
      duration: Math.random() * 18 + 12,
      delay:    Math.random() * -20,
    }))
  );

  return (
    <section id="hero" aria-labelledby="hero-heading" className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-particles" id="particles" aria-hidden="true">
        {particlesRef.current.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>

      <div className="hero-content">
        <div className="badge" role="note" aria-label="Non-partisan civic education resource">
          Non-Partisan Civic Education
        </div>
        <h1 id="hero-heading">
          Understand the Power of Your <em>Vote</em>
        </h1>
        <p className="hero-sub">
          A comprehensive, accessible guide to how elections work — from candidacy declaration
          to official certification. Learn the process, test your knowledge, and participate
          with confidence.
        </p>
        <div className="hero-cta">
          <a href="#timeline" className="btn-primary">
            Explore the Process →
          </a>
          <a href="#quiz" className="btn-outline">
            Take the Quiz
          </a>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

export { Hero };
