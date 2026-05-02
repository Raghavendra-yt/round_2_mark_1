import { useState, useCallback, useMemo, ChangeEvent, memo } from 'react';
import PropTypes from 'prop-types';

import { glossaryTerms } from '@/data/content';
import { SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { sanitizeText } from '@/utils/sanitize';

/**
 * Data structure for a glossary term.
 */
interface GlossaryItemData {
  /** The term being defined. */
  term: string;
  /** The definition of the term. */
  def: string;
}

/** 
 * Individual glossary term card, memoized for performance.
 * 
 * @component
 */
const GlossaryCard = memo(({ item }: { item: GlossaryItemData }) => (
  <article className="glossary-card reveal" role="listitem">
    <div className="glossary-term">{item.term}</div>
    <div className="glossary-def">{item.def}</div>
  </article>
));

GlossaryCard.displayName = 'GlossaryCard';

GlossaryCard.propTypes = {
  item: PropTypes.shape({
    term: PropTypes.string.isRequired,
    def: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * Searchable election glossary section.
 * Uses a debounced search input to filter terms without excessive re-renders.
 * 
 * @component
 */
export const Glossary = memo(() => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  /** Handles changes to the search input, including sanitization. */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(sanitizeText(event.target.value));
  }, []);

  const filteredTerms = useMemo(() => {
    const normalised = debouncedQuery.toLowerCase().trim();
    const allTerms = glossaryTerms as GlossaryItemData[];
    if (!normalised) return allTerms;
    return allTerms.filter(
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

        <div className="glossary-search reveal">
          <label htmlFor="glossary-search" className="sr-only">Search glossary terms</label>
          <input
            id="glossary-search"
            type="search"
            className="glossary-search-input"
            placeholder="Search terms…"
            value={searchQuery}
            onChange={handleSearchChange}
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
              <GlossaryCard key={item.term} item={item} />
            ))
          ) : (
            <p className="glossary-empty">No terms match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
});

Glossary.displayName = 'Glossary';
