/**
 * Testimonials — Scene 5 · REBUILT ($25k)
 * ─────────────────────────────────────────────────────────────
 * Architecture fix:
 *   REPLACED GSAP ScrollTrigger step triggers with IntersectionObserver.
 *   The original GSAP `.create({ start: 'top 55%' })` triggers could
 *   fire at wrong positions if prior pinned sections (Statement/About)
 *   had miscalculated their scroll space. IntersectionObserver is
 *   viewport-relative, not scroll-position-relative — completely immune
 *   to upstream pin spacing issues.
 *
 *   The sticky left panel pattern is preserved and now works because
 *   global.css uses `main { overflow-x: clip }` (not hidden), which
 *   was silently blocking position:sticky on all descendants.
 *
 * Design upgrade:
 *   — Larger quote display with ghost numeral behind each quote
 *   — Right column: preview cards with subtle dim/bright on active
 *   — Gold progress line (not dots)
 *   — Atmospheric dark left panel, cream right panel
 *   — Verified footer line preserved
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    author: 'Khalid Al Mansouri',
    title: 'Chief Executive Officer',
    company: 'Dubai Holding',
    event: 'Global Investor Forum 2023',
  },
  {
    id: '02',
    quote: 'Three hundred guests from thirty countries, zero compromises. The GHAIM team understood that our brand is our reputation — and treated every moment of that evening accordingly.',
    author: 'Layla Al Nuaimi',
    title: 'Senior VP, Corporate Affairs',
    company: 'Emaar Properties',
    event: 'Brand Centenary Celebration',
  },
  {
    id: '03',
    quote: 'We have worked with event houses in London, Geneva, and Singapore. None have matched the quiet authority GHAIM brings. They do not just execute — they architect experiences.',
    author: 'James Whitfield',
    title: 'Group Managing Director',
    company: 'MAG Group',
    event: 'Leadership Retreat — Desert Edition',
  },
  {
    id: '04',
    quote: 'Our annual summit is the single most visible moment of our calendar year. Placing it with GHAIM was not a decision we made lightly — it was the best we have made.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
    event: 'Annual Leadership Summit',
  },
];

export function Testimonials() {
  const sectionRef  = useRef<HTMLElement>(null);
  const stepRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Use IntersectionObserver — viewport-relative, never affected
    // by upstream GSAP pin spacing miscalculations.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-idx'));
            if (!isNaN(idx)) setActive(idx);
          }
        }
      },
      {
        root: null,
        // Fire when the step's vertical centre crosses 55% down viewport
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      },
    );

    stepRefs.current.forEach((el) => { if (el) obs.observe(el); });

    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        position:   'relative',
        background: 'var(--color-bg)',
        borderTop:  '1px solid rgba(197,160,89,0.08)',
      }}
    >
      {/* ── SECTION HEADER ──────────────────────────────────── */}
      <div style={{
        padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 72px) clamp(56px, 6vw, 80px)',
        maxWidth: '1340px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
            <span style={{
              fontSize: '0.62rem', letterSpacing: '0.34em',
              textTransform: 'uppercase', fontFamily: 'var(--font-body)',
              fontWeight: 500, color: 'var(--color-accent-1)',
            }}>Client Voices</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
            fontWeight: 300, lineHeight: 1.04,
            letterSpacing: '-0.025em',
            color: 'var(--color-text)',
            maxWidth: '620px',
          }}>
            Trusted by Those Who{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>
              Demand Excellence.
            </em>
          </h2>
        </motion.div>
      </div>

      {/* ── STICKY PANEL + SCROLL STEPS ─────────────────────
       * Grid: left = sticky quote panel, right = scroll steps.
       * align-items: start is critical — without it, the grid
       * stretches the left cell to match the taller right cell,
       * which gives sticky no room to stick inside.
       * ─────────────────────────────────────────────────── */}
      <div
        className="testimonials-grid"
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems:          'start',  // CRITICAL — do not use 'stretch'
          maxWidth:            '1340px',
          margin:              '0 auto',
          padding:             '0 clamp(24px, 5vw, 72px)',
          gap:                 'clamp(40px, 6vw, 96px)',
          paddingBottom:       'clamp(80px, 9vw, 120px)',
        }}
      >
        {/* LEFT — sticky quote display */}
        <div
          style={{
            position:   'sticky',
            top:        0,
            height:     '100vh',    // explicit height = sticky works
            display:    'flex',
            alignItems: 'center',
            alignSelf:  'start',    // don't stretch in grid
          }}
        >
          <div style={{ width: '100%', paddingTop: '1.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{   opacity: 0, y: -16, filter: 'blur(3px)' }}
                transition={{ duration: 0.65, ease: EASE }}
              >
                {/* Ghost index number */}
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(6rem, 11vw, 10rem)',
                  fontWeight: 300, lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: 'rgba(197,160,89,0.08)',
                  marginBottom: '-0.22em',
                  userSelect: 'none',
                }}>
                  {TESTIMONIALS[active].id}
                </span>

                {/* Gold rule */}
                <div style={{
                  width: '52px', height: '1px',
                  background: 'var(--color-accent-1)',
                  opacity: 0.55,
                  marginBottom: '36px',
                }} />

                {/* Quote */}
                <blockquote style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.65rem)',
                  fontWeight: 300, lineHeight: 1.72,
                  letterSpacing: '0.004em',
                  color: 'var(--color-text)',
                  fontStyle: 'italic',
                  margin: 0, marginBottom: '40px',
                }}>
                  "{TESTIMONIALS[active].quote}"
                </blockquote>

                {/* Author block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.84rem',
                    fontWeight: 500, letterSpacing: '0.02em',
                    color: 'var(--color-text)',
                  }}>
                    {TESTIMONIALS[active].author}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                    fontWeight: 300, color: 'var(--color-text-muted)',
                  }}>
                    {TESTIMONIALS[active].title}, {TESTIMONIALS[active].company}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                    letterSpacing: '0.26em', textTransform: 'uppercase',
                    color: 'var(--color-accent-1)', opacity: 0.72,
                    marginTop: '6px',
                  }}>
                    {TESTIMONIALS[active].event}
                  </span>
                </div>

                {/* Progress line */}
                <div style={{
                  display: 'flex', gap: '8px',
                  marginTop: '44px', alignItems: 'center',
                }}>
                  {TESTIMONIALS.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: i === active ? 1 : 0.2,
                        width:   i === active ? '32px' : '10px',
                      }}
                      transition={{ duration: 0.45, ease: EASE }}
                      style={{
                        height: '1.5px',
                        background: 'var(--color-accent-1)',
                        borderRadius: '2px',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — scroll steps (drive the IntersectionObserver) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-idx={i}
              className="t-step"
              style={{
                minHeight:     '72vh',
                display:       'flex',
                alignItems:    'center',
                paddingTop:    '8vh',
                paddingBottom: '8vh',
                borderTop:     '1px solid rgba(197,160,89,0.1)',
              }}
            >
              <motion.div
                animate={{ opacity: i === active ? 1 : 0.2 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.58rem',
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  color: 'var(--color-accent-1)',
                }}>
                  {t.company}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(1rem, 1.7vw, 1.3rem)',
                  color: 'var(--color-text-mid)',
                  maxWidth: '340px', lineHeight: 1.55,
                }}>
                  {t.quote.slice(0, 90)}…
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.62rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--color-text-muted)', opacity: 0.65,
                }}>
                  — {t.author}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VERIFIED FOOTER LINE ──────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '0 clamp(24px, 5vw, 72px)',
        paddingBottom: 'clamp(60px, 7vw, 96px)',
        maxWidth: '1340px', margin: '0 auto',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.25), transparent)' }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.62rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--color-text-muted)', whiteSpace: 'nowrap',
        }}>
          All testimonials from verified live engagements
        </span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.25), transparent)' }} />
      </div>

      <style>{`
        @media (max-width: 767px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .t-step { display: none !important; }
          #testimonials [style*="position: sticky"] {
            position: relative !important;
            height: auto !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #testimonials * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}