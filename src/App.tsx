import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { ScrollLayout } from '@/layouts/ScrollLayout';
import { About } from '@/sections/About';
import { CaseStudies } from '@/sections/CaseStudies';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { Hero } from '@/sections/Hero';
import { OperatingSystem } from '@/sections/OperatingSystem';
import { Statement } from '@/sections/Statement';
import { Testimonials } from '@/sections/Testimonials';
import { Projects } from '@/pages/Projects';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  return (
    <>
      <main>
        <Hero />
        <Statement />
        <About />
        <OperatingSystem />
        <CaseStudies />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function scrollToHashTarget(hash: string, behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(hash.replace('#', ''));
  if (!target) return;

  const nav = document.querySelector<HTMLElement>('.site-nav');
  const offset = (nav?.offsetHeight ?? 76) + 16;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior });
}

function ScrollToHash({ ready }: { ready: boolean }) {
  const location = useLocation();

  useEffect(() => {
    if (!ready) return;

    if (location.hash) {
      const initial = window.setTimeout(() => {
        scrollToHashTarget(location.hash);
      }, 80);
      const settled = window.setTimeout(() => {
        scrollToHashTarget(location.hash, 'auto');
      }, 620);

      return () => {
        window.clearTimeout(initial);
        window.clearTimeout(settled);
      };
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash, ready]);

  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  function handleLoadingComplete() {
    setLoading(false);

    window.setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <ScrollLayout>
          <Navbar />
          <ScrollToHash ready={!loading} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </ScrollLayout>
      </div>
    </>
  );
}
