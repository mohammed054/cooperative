/**
 * App.tsx — Updated scene order
 * ─────────────────────────────────────────────────────────────
 * Changes:
 *   + Statement scene inserted between Hero and About
 *   All other sections unchanged (CaseStudies, Testimonials,
 *   Contact, Footer will be upgraded in subsequent sprints)
 */

import { ScrollLayout } from '@/layouts/ScrollLayout';
import { Navbar }       from '@/components/Navbar';
import { Hero }         from '@/sections/Hero';
import { Statement }    from '@/sections/Statement';
import { About }        from '@/sections/About';
import { CaseStudies }  from '@/sections/CaseStudies';
import { Testimonials } from '@/sections/Testimonials';
import { Contact }      from '@/sections/Contact';
import { Footer }       from '@/sections/Footer';

export default function App() {
  return (
    <ScrollLayout>
      {/* Fixed navigation */}
      <Navbar />

      <main>
        {/* Scene 1 — Hero (200vh, sticky, word stagger) */}
        <Hero />

        {/* Scene 2 — Statement (pinned, "We craft legacy.") */}
        <Statement />

        {/* Scene 3 — About (clip-path image reveal, no cards) */}
        <About />

        {/* Scene 4 onwards — unchanged in this sprint */}
        <CaseStudies />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </ScrollLayout>
  );
}