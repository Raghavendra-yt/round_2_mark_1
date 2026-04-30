import { steps } from '../data/content';

export default function HowItWorks() {
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
            <article key={step.num} className="step-card reveal" role="listitem">
              <div className="step-num" aria-hidden="true">
                {step.num}
              </div>
              <div className="step-icon" aria-hidden="true">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
