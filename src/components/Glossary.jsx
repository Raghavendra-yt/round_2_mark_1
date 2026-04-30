import { glossaryTerms } from '../data/content';

export default function Glossary() {
  return (
    <section id="glossary" aria-labelledby="gloss-heading">
      <div className="section-inner">
        <p className="section-label reveal">Key Terms</p>
        <h2 className="section-title reveal" id="gloss-heading">
          Election <em>Glossary</em>
        </h2>
        <p className="section-desc reveal">
          Understand the language of democracy. These essential terms will help you follow election
          news with confidence.
        </p>

        <div className="glossary-grid reveal-stagger" role="list">
          {glossaryTerms.map((item) => (
            <article key={item.term} className="glossary-card reveal" role="listitem">
              <div className="glossary-term">{item.term}</div>
              <div className="glossary-def">{item.def}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
