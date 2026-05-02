import { Suspense, lazy } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useActiveSection } from './hooks/useActiveSection';
import { useAnalytics } from './hooks/useAnalytics';
import { GoogleTranslateInit } from './components/GoogleTranslate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HelpButton } from './components/HelpButton';
import { ARIA_LABELS, APP_NAME, SKIP_LINK_TARGET } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Route-level code splitting with React.lazy
const Hero      = lazy(() => import('./features/hero/Hero').then((m) => ({ default: m.Hero })));
const Stats     = lazy(() => import('./features/stats/Stats').then((m) => ({ default: m.StatsSection })));
const Timeline  = lazy(() => import('./features/timeline/Timeline').then((m) => ({ default: m.Timeline })));
const HowItWorks= lazy(() => import('./features/core/HowItWorks').then((m) => ({ default: m.HowItWorks })));
const PollMap   = lazy(() => import('./features/map/PollMap').then((m) => ({ default: m.PollMap })));
const Quiz      = lazy(() => import('./features/quiz/Quiz').then((m) => ({ default: m.Quiz })));
const Glossary  = lazy(() => import('./features/core/Glossary').then((m) => ({ default: m.Glossary })));
const CTA       = lazy(() => import('./features/core/CTA').then((m) => ({ default: m.CTA })));

/** Root application component. Assembles all page sections with lazy loading. */
function App() {
  useScrollReveal();
  const activeSection = useActiveSection();
  useAnalytics(activeSection);

  return (
    <>
      {/* Screen Reader Announcements for section changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Viewing ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section`}
      </div>
      {/* Google Translate initialiser (no visible DOM output) */}
      <GoogleTranslateInit />

      {/* Accessibility: skip navigation link */}
      <a id="skip-link" href={`#${SKIP_LINK_TARGET}`} className="skip-link sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-white z-50">
        {ARIA_LABELS.SKIP_LINK}
      </a>

      <header role="banner">
        <Navbar />
      </header>

      <main id={SKIP_LINK_TARGET} role="main" aria-label={`${APP_NAME} main content`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading Hero section" />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading statistics" />}>
            <Stats />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading election timeline" />}>
            <Timeline />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading process steps" />}>
            <HowItWorks />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading polling station map" />}>
            <PollMap />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading knowledge quiz" />}>
            <Quiz />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading glossary" />}>
            <Glossary />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner label="Loading call to action" />}>
            <CTA />
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer role="contentinfo">
        <Footer />
      </footer>
      <HelpButton />
    </>
  );
}

export { App };
