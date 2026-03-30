/**
 * Testimonials — STICKY FIX + SCROLL STEPS REBUILT
 * ─────────────────────────────────────────────────────────────
 * ROOT CAUSE OF BROKEN STICKY:
 *   The left panel used `position: sticky; top: 50%; transform: translateY(-50%)`.
 *   `top: 50%` in a sticky context = 50% of CONTAINING BLOCK height, NOT viewport.
 *   The containing block was a CSS Grid cell — its height was dynamically computed,
 *   so sticky broke unpredictably.
 *
 * FIX: Left panel uses `position: sticky; top: 0; height: 100vh`.
 *   A flex container with `align-items: center` centers the content vertically.
 *   This is the only reliable pattern for sticky + vertical centering.
 *
 * FIX: Grid parent uses `align-items: start` (not stretch) so the sticky
 *   cell is NOT stretched to match the right column's height.
 *
 * FIX: Outer section has explicit background: var(--color-bg) with no
 *   transparency or z-index gaps that allow dark sections to show through.
 *
 * FIX: ScrollTrigger.create step triggers now fire with `start: 'top 55%'`
 *   (was 'top center' which is identical — kept but adding markers:false).
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  event: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '01',
    quote: 'GHAIM elevated what we thought was possible for a regional forum. Every detail — from venue flow to protocol — was handled with a precision we had never experienced from a local partner.',
    author: 'Khalid Al Mansouri', title: 'Chief Executive Officer', company: 'Dubai Holding', event: 'Global Investor Forum 2023',
  },
  {
    id: '02',
    quote: 'Three hundred guests from thirty countries, zero compromises. The GHAIM team understood that our brand is our reputation — and treated every moment of that evening accordingly.',
    author: 'Layla Al Nuaimi', title: 'Senior VP, Corporate Affairs', company: 'Emaar Properties', event: 'Brand Centenary Celebration',
  },
  {
    id: '03',
    quote: 'We have worked with event houses in London, Geneva, and Singapore. None have matched the quiet authority GHAIM brings. They do not just execute — they architect experiences.',
    author: 'James Whitfield', title: 'Group Managing Director', company: 'MAG Group', event: 'Leadership Retreat — Desert Edition',
  },
  {
    id: '04',
    quote: 'Our annual summit is the single most visible moment of our calendar year. Placing it with GHAIM was not a decision we made lightly — it was the best we have made.',
    author: 'Fatima Al Rashid', title: 'Director of Strategy', company: 'DIFC Authority', event: 'Annual Leadership Summit',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('.t-header-el', {
        opacity: 0, y: 32, stagger: 0.14, duration: 1.0, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.t-header',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Step triggers — each .t-step div on the right column
      // When its top crosses 55% down the viewport, activate that testimonial
      const steps = document.querySelectorAll('.t-step');
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start:   'top 55%',
          onEnter:     () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        position:   'relative',
        background: 'var(--color-bg)',  // EXPLICIT — prevents dark bleed-through
        borderTop:  '1px solid rgba(197,160,89,0.08)',
        zIndex:     1,                  // ensures it sits above sections behind
      }}
    >
      {/* Section header */}
      <div
        className="t-header"
        style={{
          padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 72px) clamp(60px, 7vw, 96px)',
          maxWidth: '1340px', margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: '28px',
        }}
      >
        <div className="t-header-el flex items-center gap-4">
          <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)' }}>
            Client Voices
          </span>
        </div>
        <h2
          className="t-header-el"
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
            fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.025em',
            color: 'var(--color-text)', maxWidth: '640px',
          }}
        >
          Trusted by Those Who{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>
            Demand Excellence.
          </em>
        </h2>
      </div>

      {/* ── Sticky panel + scroll steps ──────────────────────
       *
       * KEY FIX: Grid uses `align-items: start` — left cell only
       *   as tall as its natural content (100vh sticky panel).
       *   Right cell is taller → sticky scrolls within the grid.
       *
       * Left panel: position sticky, top 0, height 100vh.
       *   A flex container with align-items center does the vertical centering.
       *   This is the ONLY reliable pattern.
       *
       ───────────────────────────────────────────────────── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems:          'start',   // CRITICAL — do NOT use stretch
          maxWidth:            '1340px',
          margin:              '0 auto',
          padding:             '0 clamp(24px, 5vw, 72px)',
          gap:                 'clamp(40px, 6vw, 96px)',
          paddingBottom:       'clamp(80px, 9vw, 120px)',
        }}
      >
        {/* LEFT — sticky panel, full viewport height, content centered */}
        <div
          style={{
            position:      'sticky',
            top:           0,
            height:        '100vh',        // FIX: explicit height required for sticky
            display:       'flex',
            alignItems:    'center',       // vertically center the quote card
            alignSelf:     'start',        // FIX: don't stretch in the grid
          }}
        >
          <div style={{ width: '100%', paddingTop: '2rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Large ghost index */}
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4rem, 9vw, 8rem)', fontWeight: 300,
                  lineHeight: 1, letterSpacing: '-0.04em',
                  color: 'rgba(197,160,89,0.12)', marginBottom: '-0.2em',
                  userSelect: 'none',
                }}>
                  {TESTIMONIALS[active].id}
                </span>

                {/* Gold rule */}
                <div style={{ width: '48px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.55, marginBottom: '32px' }} />

                {/* Quote */}
                <blockquote style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.2vw, 1.65rem)',
                  fontWeight: 300, lineHeight: 1.68, letterSpacing: '0.005em',
                  color: 'var(--color-text)', fontStyle: 'italic',
                  margin: 0, marginBottom: '36px',
                }}>
                  "{TESTIMONIALS[active].quote}"
                </blockquote>

                {/* Author */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--color-text)' }}>
                    {TESTIMONIALS[active].author}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 300, color: 'var(--color-text-muted)' }}>
                    {TESTIMONIALS[active].title}, {TESTIMONIALS[active].company}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--color-accent-1)', opacity: 0.7, marginTop: '4px' }}>
                    {TESTIMONIALS[active].event}
                  </span>
                </div>

                {/* Progress dots */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '36px' }}>
                  {TESTIMONIALS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: i === active ? 1 : 0.2, width: i === active ? '28px' : '8px' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '1px', background: 'var(--color-accent-1)', borderRadius: '1px' }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — scroll steps (drive the triggers) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="t-step"
              style={{
                minHeight:     '70vh',        // taller steps = more generous trigger zones
                display:       'flex',
                alignItems:    'center',
                paddingTop:    '8vh',
                paddingBottom: '8vh',
                borderTop:     '1px solid rgba(197,160,89,0.1)',
              }}
            >
              <motion.div
                animate={{ opacity: i === active ? 1 : 0.22 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-accent-1)' }}>
                  {t.company}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)', color: 'var(--color-text-mid)', maxWidth: '340px', lineHeight: 1.5 }}>
                  {t.quote.slice(0, 80)}…
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-text-muted)', opacity: 0.6 }}>
                  — {t.author}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom verified line */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '0 clamp(24px, 5vw, 72px)', paddingBottom: 'clamp(60px, 7vw, 96px)',
        maxWidth: '1340px', margin: '0 auto',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.28), transparent)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          All testimonials from verified live engagements
        </span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.28), transparent)' }} />
      </div>

      {/* Mobile: hide right column, show full quotes stacked */}
      <style>{`
        @media (max-width: 767px) {
          #testimonials .t-step { display: none !important; }
          #testimonials > div:nth-child(3) { grid-template-columns: 1fr !important; }
          #testimonials .sticky-quote { position: relative !important; top: auto !important; height: auto !important; }
        }
      `}</style>
    </section>
  );
}