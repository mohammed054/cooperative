/**
 * App.tsx — With LoadingScreen & polished section order
 * ─────────────────────────────────────────────────────
 * Changes:
 *   + LoadingScreen preloader (dissolves into Hero on complete)
 *   + Navbar delay synced with loading screen exit
 *   + All sections in correct order
 */

import { useState } from 'react';
import { ScrollLayout }   from '@/layouts/ScrollLayout';
import { LoadingScreen }  from '@/components/LoadingScreen';
import { Navbar }         from '@/components/Navbar';
import { Hero }           from '@/sections/Hero';
import { Statement }      from '@/sections/Statement';
import { About }          from '@/sections/About';
import { CaseStudies }    from '@/sections/CaseStudies';
import { Testimonials }   from '@/sections/Testimonials';
import { Contact }        from '@/sections/Contact';
import { Footer }         from '@/sections/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Loading screen — dissolves when done */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* Main site — hidden during load to prevent flash */}
      <div
        style={{
          opacity:    loading ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <ScrollLayout>
          {/* Fixed navigation */}
          <Navbar />

          <main>
            {/* Scene 1 — Hero (200vh, sticky, word stagger) */}
            <Hero />

            {/* Scene 2 — Statement ("We craft legacy.") */}
            <Statement />

            {/* Scene 3 — About (clip-path reveal, editorial split) */}
            <About />

            {/* Scene 4 — Case Studies (featured + horizontal scroll) */}
            <CaseStudies />

            {/* Scene 5 — Testimonials (sticky scroll-stepped) */}
            <Testimonials />

            {/* Scene 6 — Contact (dark CTA) */}
            <Contact />
          </main>

          <Footer />
        </ScrollLayout>
      </div>
    </>
  );
}