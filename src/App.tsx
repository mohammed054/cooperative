import { ScrollLayout } from '@/layouts/ScrollLayout';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { CaseStudies } from '@/sections/CaseStudies';
import { Testimonials } from '@/sections/Testimonials';
import { Contact } from '@/sections/Contact';

export default function App() {
  return (
    <ScrollLayout>
      {/* Fixed navigation — always present */}
      <Navbar />

      {/* ── Sections ──────────────────────────────────────
          Each section is a 100svh viewport block.
          Sections are assembled here in scroll order.
          Only Hero is fully implemented in this sprint.
      ─────────────────────────────────────────────────── */}
      <main>
        <Hero />
        <About />
        <CaseStudies />
        <Testimonials />
        <Contact />
      </main>
    </ScrollLayout>
  );
}
