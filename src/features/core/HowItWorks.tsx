import { memo } from 'react';
import { steps } from '@/data/content';

interface StepCardProps {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

/** Single voter step card. */
const StepCard = memo(({ num, icon, title, desc }: StepCardProps) => {
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

/** Section detailing the steps every voter should know. */
export const HowItWorks = () => {
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
            <StepCard key={step.num} num={step.num} icon={step.icon} title={step.title} desc={step.desc} />
          ))}
        </div>
      </div>
    </section>
  );
};
