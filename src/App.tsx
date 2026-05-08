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
