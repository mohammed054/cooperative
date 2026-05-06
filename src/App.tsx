/**
 * App.tsx — FIXED
 * ─────────────────────────────────────────────────────────────
 * FIX: ScrollTrigger.refresh() delay increased from 150ms → 500ms.
 *
 * 150ms was not enough for all section ScrollTriggers to be created
 * AND for the browser to complete layout after the loading dissolve.
 * 500ms gives React one full render cycle + multiple rAF frames to
 * ensure every section's heights are measurable before recalculating
 * pin/scrub positions.
 */

import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollLayout }  from '@/layouts/ScrollLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar }        from '@/components/Navbar';
import { Hero }          from '@/sections/Hero';
import { Statement }     from '@/sections/Statement';
import { About }         from '@/sections/About';
import { CaseStudies }   from '@/sections/CaseStudies';
import { Testimonials }  from '@/sections/Testimonials';
import { Contact }       from '@/sections/Contact';
import { Footer }        from '@/sections/Footer';
import { Projects }      from '@/pages/Projects';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  return (
    <>
      <main>
        <Hero />
        <Statement />
        <About />
        <CaseStudies />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
      window.setTimeout(() => {
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  function handleLoadingComplete() {
    setLoading(false);

    // Give the DOM 500ms to fully layout after the loading screen dissolves.
    // This ensures all GSAP ScrollTrigger pin/scrub positions are
    // measured against the real, fully-rendered document height.
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        style={{
          opacity:       loading ? 0 : 1,
          transition:    'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <ScrollLayout>
          <Navbar />
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </ScrollLayout>
      </div>
    </>
  );
}
