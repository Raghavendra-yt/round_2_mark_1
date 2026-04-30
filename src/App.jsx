import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Timeline from './components/Timeline';
import HowItWorks from './components/HowItWorks';
import PollMap from './components/PollMap';
import Quiz from './components/Quiz';
import Glossary from './components/Glossary';
import CTA from './components/CTA';
import Footer from './components/Footer';
import HelpButton from './components/HelpButton';
import { GoogleTranslateInit } from './components/GoogleTranslate';

function useScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export default function App() {
  useScrollReveal();

  return (
    <>
      {/* Loads Google Translate script + exposes window.__setGoogleTranslateLang */}
      <GoogleTranslateInit />

      <a id="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Stats />
        <Timeline />
        <HowItWorks />
        <PollMap />
        <Quiz />
        <Glossary />
        <CTA />
      </main>
      <Footer />
      <HelpButton />
    </>
  );
}
