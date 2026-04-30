import { useState, useCallback, useMemo } from 'react';
import { glossaryTerms } from '../data/content';
import { useDebounce } from '../hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { sanitizeText } from '../utils/sanitize';

/**
 * Searchable election glossary section.
 * Uses a debounced search input to filter terms without excessive re-renders.
 */
function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(sanitizeText(event.target.value));
  }, []);

  const filteredTerms = useMemo(() => {
    const normalised = debouncedQuery.toLowerCase().trim();
    if (!normalised) return glossaryTerms;
    return glossaryTerms.filter(
      (item) =>
        item.term.toLowerCase().includes(normalised) ||
        item.def.toLowerCase().includes(normalised)
    );
  }, [debouncedQuery]);

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

        {/* Debounced search */}
        <div className="glossary-search reveal">
          <input
            id="glossary-search"
            type="search"
            className="glossary-search-input"
            placeholder="Search terms…"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search glossary terms"
            aria-controls="glossary-results"
            autoComplete="off"
          />
        </div>

        <div
          id="glossary-results"
          className="glossary-grid reveal-stagger"
          role="list"
          aria-live="polite"
          aria-label={`${filteredTerms.length} term${filteredTerms.length !== 1 ? 's' : ''} found`}
        >
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => (
              <article key={item.term} className="glossary-card reveal" role="listitem">
                <div className="glossary-term">{item.term}</div>
                <div className="glossary-def">{item.def}</div>
              </article>
            ))
          ) : (
            <p className="glossary-empty">No terms match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export { Glossary };
