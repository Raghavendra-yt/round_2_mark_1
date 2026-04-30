import React, { Suspense, lazy } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { GoogleTranslateInit } from './components/GoogleTranslate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HelpButton } from './components/HelpButton';
import { ARIA_LABELS, APP_NAME, SKIP_LINK_TARGET } from './constants';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Route-level code splitting with React.lazy
const Hero      = lazy(() => import('./components/Hero').then((m) => ({ default: m.Hero })));
const Stats     = lazy(() => import('./components/Stats').then((m) => ({ default: m.Stats })));
const Timeline  = lazy(() => import('./components/Timeline').then((m) => ({ default: m.Timeline })));
const HowItWorks= lazy(() => import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks })));
const PollMap   = lazy(() => import('./components/PollMap').then((m) => ({ default: m.PollMap })));
const Quiz      = lazy(() => import('./components/Quiz').then((m) => ({ default: m.Quiz })));
const Glossary  = lazy(() => import('./components/Glossary').then((m) => ({ default: m.Glossary })));
const CTA       = lazy(() => import('./components/CTA').then((m) => ({ default: m.CTA })));

/** Root application component. Assembles all page sections with lazy loading. */
function App() {
  useScrollReveal();

  return (
    <>
      {/* Google Translate initialiser (no visible DOM output) */}
      <GoogleTranslateInit />

      {/* Accessibility: skip navigation link */}
      <a id="skip-link" href={`#${SKIP_LINK_TARGET}`} className="skip-link">
        {ARIA_LABELS.SKIP_LINK}
      </a>

      <Navbar />

      <main id={SKIP_LINK_TARGET} aria-label={`${APP_NAME} main content`}>
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

      <Footer />
      <HelpButton />
    </>
  );
}

export { App };
