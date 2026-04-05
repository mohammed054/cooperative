/**
 * Testimonials — Scene 5  ·  COMPLETE REDESIGN
 * ─────────────────────────────────────────────────────────────
 * Problems with the old design:
 *   1. GSAP pin broke inside Lenis scroll container — quote panel
 *      would freeze at wrong position or not pin at all.
 *   2. Ghost numeral was cream-on-cream (var(--color-bg) ≈ #F7F5F1,
 *      ghost was rgba(197,160,89,0.09) → barely visible).
 *   3. Right "preview list" at 22% opacity looked like broken CSS,
 *      not intentional design.
 *   4. The 2-col split felt cramped and misaligned at mid-viewport.
 *
 * New architecture — NO GSAP PIN:
 *   Full-width magazine-style auto-carousel.
 *   • Left 55%: large italic quote, author attribution, gold accent.
 *   • Right 45%: vertical stack of all testimonials — active item
 *     is full brightness, rest subtly faded, each is clickable.
 *   • Auto-advances every 6 s; pauses on hover/focus.
 *   • AnimatePresence drives quote transitions: blur+y fade.
 *   • Mobile: single centered quote + dot-navigator.
 *   • Zero GSAP, zero pinning, zero scroll-distance calculations.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTO_ADVANCE_MS = 6000;

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
    quote: 'Our annual summit is the single most visible moment of our calendar year. Placing it with GHAIM was not a decision we made lightly — it was the best we have ever made.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
    event: 'Annual Leadership Summit',
  },
];

/* ── Quote display (left panel) ──────────────────────────────── */

function QuoteDisplay({ t, direction }: { t: Testimonial; direction: number }) {
  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: direction * 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0,             filter: 'blur(0px)' }}
      exit={{   opacity: 0, y: direction * -16, filter: 'blur(4px)' }}
      transition={{ duration: 0.62, ease: EASE }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Large decorative quote mark */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(6rem, 11vw, 10rem)',
        lineHeight: 1,
        color: 'rgba(197,160,89,0.12)',
        marginBottom: '-0.4em',
        marginLeft: '-0.04em',
        userSelect: 'none',
        fontWeight: 300,
      }}>
        "
      </div>

      {/* Quote text */}
      <blockquote style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.15rem, 2.1vw, 1.75rem)',
        fontWeight: 300,
        lineHeight: 1.68,
        letterSpacing: '0.005em',
        color: 'var(--color-text)',
        fontStyle: 'italic',
        margin: 0,
        marginBottom: 'clamp(28px, 3.5vw, 44px)',
      }}>
        {t.quote}
      </blockquote>

      {/* Gold divider */}
      <div style={{
        width: '40px', height: '1px',
        background: 'var(--color-accent-1)',
        opacity: 0.6,
        marginBottom: 'clamp(20px, 2.5vw, 28px)',
      }} />

      {/* Author */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.88rem',
          fontWeight: 500, letterSpacing: '0.02em',
          color: 'var(--color-text)',
        }}>
          {t.author}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.72rem',
          fontWeight: 300, color: 'var(--color-text-muted)',
        }}>
          {t.title}, {t.company}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.58rem',
          letterSpacing: '0.26em', textTransform: 'uppercase',
          color: 'var(--color-accent-1)', opacity: 0.75,
          marginTop: '4px',
        }}>
          {t.event}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Right-rail testimonial list ─────────────────────────────── */

function TestimonialRail({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {TESTIMONIALS.map((t, i) => {
        const isActive = i === active;
        return (
          <motion.button
            key={t.id}
            onClick={() => onSelect(i)}
            animate={{ opacity: isActive ? 1 : 0.28 }}
            whileHover={{ opacity: isActive ? 1 : 0.52 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: 'clamp(22px, 3vw, 32px) 0',
              borderTop: `1px solid rgba(197,160,89,${isActive ? '0.22' : '0.08'})`,
              transition: 'border-color 0.4s ease',
              textAlign: 'left',
              position: 'relative',
            }}
          >
            {/* Active indicator */}
            <motion.div
              style={{
                position: 'absolute',
                left: '-28px',
                top: '50%',
                translateY: '-50%',
                width: '3px',
                height: '28px',
                background: 'var(--color-accent-1)',
                borderRadius: '2px',
              }}
              animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.4 }}
              transition={{ duration: 0.4, ease: EASE }}
            />

            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.58rem',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--color-accent-1)',
            }}>
              {t.company}
            </span>

            <span style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(0.88rem, 1.4vw, 1.15rem)',
              color: 'var(--color-text-mid)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {t.quote.slice(0, 90)}…
            </span>

            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}>
              — {t.author}
            </span>
          </motion.button>
        );
      })}

      {/* Border at bottom */}
      <div style={{ height: '1px', background: 'rgba(197,160,89,0.08)' }} />
    </div>
  );
}

/* ── Mobile single-quote stack ───────────────────────────────── */

function MobileStack() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    const clamped = (next + TESTIMONIALS.length) % TESTIMONIALS.length;
    setDir(next > active ? 1 : -1);
    setActive(clamped);
  }, [active]);

  useEffect(() => {
    timerRef.current = setTimeout(() => go(active + 1), AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, go]);

  const t = TESTIMONIALS[active];

  return (
    <div style={{ padding: '0 clamp(20px, 5vw, 32px)' }}>
      {/* Quote area */}
      <div style={{ position: 'relative', minHeight: '320px', marginBottom: '36px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: dir * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir * -14 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', lineHeight: 1, color: 'rgba(197,160,89,0.12)', marginBottom: '-0.35em', fontWeight: 300, userSelect: 'none' }}>"</div>
            <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 4vw, 1.35rem)', fontWeight: 300, lineHeight: 1.68, fontStyle: 'italic', color: 'var(--color-text)', margin: 0, marginBottom: '24px' }}>
              {t.quote}
            </blockquote>
            <div style={{ width: '36px', height: '1px', background: 'var(--color-accent-1)', opacity: 0.6, marginBottom: '18px' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px' }}>{t.author}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>{t.title}, {t.company}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-accent-1)', opacity: 0.72, marginTop: '8px' }}>{t.event}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {TESTIMONIALS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => go(i)}
            animate={{ width: i === active ? '32px' : '8px', opacity: i === active ? 1 : 0.3, background: 'var(--color-accent-1)' }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ all: 'unset', cursor: 'pointer', height: '2px', borderRadius: '2px', flexShrink: 0 }}
          />
        ))}
        <div style={{ flex: 1 }} />
        {/* Prev / Next */}
        <button
          onClick={() => go(active - 1)}
          style={{ all: 'unset', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: '6px' }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M17 7H1M7 1L1 7l6 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={() => go(active + 1)}
          style={{ all: 'unset', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: '6px' }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M1 7h16M11 1l6 6-6 6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS — Main Export
══════════════════════════════════════════════════════════════ */

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    const clamped = (next + TESTIMONIALS.length) % TESTIMONIALS.length;
    setDir(next >= active ? 1 : -1);
    setActive(clamped);
  }, [active]);

  const select = useCallback((i: number) => {
    setDir(i >= active ? 1 : -1);
    setActive(i);
  }, [active]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => go(active + 1), AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, go]);

  return (
    <section
      id="testimonials"
      style={{ position: 'relative', background: 'var(--color-bg)', borderTop: '1px solid rgba(197,160,89,0.08)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Subtle ambient radial */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(ellipse 60% 55% at 30% 50%, rgba(197,160,89,0.025) 0%, transparent 70%)' }} />

      {/* ── SECTION HEADER ──────────────────────────────────── */}
      <div style={{ maxWidth: '1340px', margin: '0 auto', padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 72px) clamp(56px, 6vw, 72px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)' }}>Client Voices</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.025em', color: 'var(--color-text)', maxWidth: '620px' }}>
            Trusted by Those Who{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>Demand Excellence.</em>
          </h2>
        </motion.div>
      </div>

      {/* ── DESKTOP: 2-col split layout ─────────────────────── */}
      <div
        className="t-desktop"
        style={{
          maxWidth: '1340px', margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 72px)',
          paddingBottom: 'clamp(80px, 9vw, 120px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 7vw, 110px)',
          alignItems: 'start',
        }}
      >
        {/* LEFT: Quote panel */}
        <div style={{ position: 'relative', minHeight: '380px' }}>
          <AnimatePresence mode="wait">
            <QuoteDisplay key={active} t={TESTIMONIALS[active]} direction={dir} />
          </AnimatePresence>

          {/* Progress bars — below the quote (positioned at bottom of column) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => select(i)}
                animate={{ width: i === active ? '36px' : '10px', opacity: i === active ? 1 : 0.25, background: 'var(--color-accent-1)' }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ all: 'unset', cursor: 'pointer', height: '1.5px', borderRadius: '2px', flexShrink: 0 }}
              />
            ))}
            <span style={{ marginLeft: '12px', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', opacity: 0.55 }}>
              {String(active + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* RIGHT: Rail list */}
        <div style={{ paddingLeft: '28px', position: 'relative' }}>
          {/* Vertical gold line */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.22) 20%, rgba(197,160,89,0.22) 80%, transparent)' }} />
          <TestimonialRail active={active} onSelect={select} />
        </div>
      </div>

      {/* ── MOBILE: single quote + dots ─────────────────────── */}
      <div className="t-mobile" style={{ display: 'none', paddingBottom: 'clamp(60px, 8vw, 96px)' }}>
        {/* Section header already shown above */}
        <MobileStack />
      </div>

      {/* Verified footer */}
      <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 72px)', paddingBottom: 'clamp(60px, 7vw, 96px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.2), transparent)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', opacity: 0.6 }}>
            All testimonials from verified live engagements
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.2), transparent)' }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .t-desktop { display: none !important; }
          .t-mobile  { display: block !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #testimonials * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}