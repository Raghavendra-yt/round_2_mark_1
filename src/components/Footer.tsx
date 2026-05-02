import { memo } from 'react';
import { APP_NAME } from '@/constants';

/**
 * Page footer with branding and non-partisan disclaimer.
 * Provides context on the application's purpose and privacy stance.
 * 
 * @component
 */
const Footer = memo(() => {
  return (
    <footer>
      <div className="footer-logo">{APP_NAME}</div>
      <div className="footer-copy">
        <p>Election Process Education · Civic Participation · Informed Voting</p>
        <p style={{ marginTop: '0.3rem', fontSize: '0.75rem' }}>
          Non-partisan educational resource · No tracking · No ads · No data collection
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export { Footer };
