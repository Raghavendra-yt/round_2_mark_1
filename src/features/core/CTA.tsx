import React, { memo } from 'react';

/**
 * Call-to-action section encouraging civic participation.
 * Final section of the page to reinforce learning and encourage sharing.
 * 
 * @component
 */
export const CTA: React.FC = memo(() => {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-inner">
        <p className="section-label reveal" style={{ textAlign: 'center' }}>
          Ready to Participate?
        </p>
        <h2
          className="section-title reveal"
          id="cta-heading"
          style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto' }}
        >
          Your Vote is Your <em>Voice</em>
        </h2>
        <p
          className="section-desc reveal"
          style={{ textAlign: 'center', margin: '1.3rem auto 2.8rem', maxWidth: '50ch' }}
        >
          Democracy works when citizens are informed and engaged. Share this resource with friends
          and family to help them understand the process too.
        </p>
        <div className="hero-cta reveal">
          <a href="#quiz" className="btn-primary">
            Retake the Quiz →
          </a>
          <a href="#timeline" className="btn-outline">
            Review the Timeline
          </a>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
