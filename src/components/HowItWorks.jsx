import { memo } from 'react';
import PropTypes from 'prop-types';
import { steps } from '../data/content';

/** Single voter step card. */
const StepCard = memo(function StepCard({ num, icon, title, desc }) {
  return (
    <article className="step-card reveal" role="listitem">
      <div className="step-num" aria-hidden="true">{num}</div>
      <div className="step-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </article>
  );
});

StepCard.displayName = 'StepCard';
StepCard.propTypes = {
  num:   PropTypes.string.isRequired,
  icon:  PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc:  PropTypes.string.isRequired,
};

/** Section detailing the steps every voter should know. */
function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading">
      <div className="section-inner">
        <p className="section-label reveal">How It Works</p>
        <h2 className="section-title reveal" id="how-heading">
          Steps Every <em>Voter</em> Should Know
        </h2>
        <p className="section-desc reveal">
          Participating in an election is straightforward when you know the steps. Here's your
          complete guide.
        </p>

        <div className="steps-grid reveal-stagger" role="list">
          {steps.map((step) => (
            <StepCard key={step.num} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { HowItWorks };
