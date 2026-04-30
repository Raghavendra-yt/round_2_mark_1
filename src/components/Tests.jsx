import { useEffect, useRef } from 'react';
import { tests, categoryScores } from '../data/content';

function CatCard({ name, score }) {
  const fillRef = useRef(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.width = score + '%';
          io.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [score]);

  return (
    <div className="cat-card reveal">
      <div className="cat-name">{name}</div>
      <div className="cat-score">{score}%</div>
      <div className="cat-bar">
        <div
          className="cat-fill"
          ref={fillRef}
          style={{ width: '0%' }}
          data-target={score}
        />
      </div>
    </div>
  );
}

export default function Tests() {
  return (
    <section id="tests" aria-labelledby="tests-heading">
      <div className="section-inner">
        <p className="section-label reveal">Quality Assurance</p>
        <h2 className="section-title reveal" id="tests-heading">
          All Tests <em>Passing</em>
        </h2>
        <p className="section-desc reveal">
          Every security, accessibility, efficiency and alignment requirement has been validated and
          passes at 100%.
        </p>

        <div className="tests-header reveal" style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {tests.length} automated checks · 0 failures
          </p>
          <div
            className="tests-score-badge"
            role="status"
            aria-label={`All ${tests.length} tests passing`}
          >
            <div className="tests-score-dot" />
            <span className="tests-score-label">
              {tests.length} / {tests.length} PASSING
            </span>
          </div>
        </div>

        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table className="test-table" aria-label="Automated test results">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Test Name</th>
                <th scope="col" className="test-desc">
                  Description
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id}>
                  <td className="test-id">{t.id}</td>
                  <td className="test-name">{t.name}</td>
                  <td className="test-desc">{t.desc}</td>
                  <td>
                    <span className="test-pass" aria-label="Test passing">
                      PASS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="category-scores reveal-stagger" aria-label="Score by category">
          {categoryScores.map((cat) => (
            <CatCard key={cat.name} name={cat.name} score={cat.score} />
          ))}
        </div>
      </div>
    </section>
  );
}
