/**
 * App.tsx — FIXED
 * ─────────────────────────────────────────────────────────────
 * FIX: ScrollTrigger.refresh() called 150ms after loading completes.
 *
 * Problem: All GSAP ScrollTrigger instances were created while the loading
 * screen had the page hidden (opacity:0, pointerEvents:none). The layout
 * positions (scroll heights, element offsets) were measured before the DOM
 * was properly laid out and sized.
 *
 * Solution: After the loading screen dissolves and the main content becomes
 * visible, force ScrollTrigger to remeasure ALL trigger points.
 * 150ms delay gives React one render cycle + layout calculation time.
 *
 * This is the root cause of "about section not visible" — the editorial
 * ScrollTrigger was mapped to wrong scroll positions during initial measure.
 */

import { useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollLayout } from '@/layouts/ScrollLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { Statement } from '@/sections/Statement';
import { About } from '@/sections/About';
import { CaseStudies } from '@/sections/CaseStudies';
import { Testimonials } from '@/sections/Testimonials';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

  function handleLoadingComplete() {
    setLoading(false);

    /*
     * CRITICAL: Refresh ScrollTrigger after loading screen dissolves.
     * Without this, all scroll-based animations in Statement and About
     * were measuring positions against a hidden/zero-height layout.
     *
     * 150ms delay = one React render cycle + requestAnimationFrame
     * to ensure the DOM is fully painted and measurable.
     */
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 150);
  }

  return (
    <>
      {/* Loading screen — dissolves when animation completes */}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main site — hidden during load to prevent flash */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <ScrollLayout>
          <Navbar />

          <main>
            {/* Scene 1 — Hero */}
            <Hero />

            {/* Scene 2 — Statement ("We craft legacy.") */}
            <Statement />

            {/* Scene 3 — About */}
            <About />

            {/* Scene 4 — Case Studies */}
            <CaseStudies />

            {/* Scene 5 — Testimonials */}
            <Testimonials />

            {/* Scene 6 — Contact */}
            <Contact />
          </main>

          <Footer />
        </ScrollLayout>
      </div>
    </>
  );
}