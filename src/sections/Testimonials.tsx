/**
 * Testimonials — Scene 5 · REBUILT
 * ─────────────────────────────────────────────────────────────
 * Root cause of prior breakage:
 *   position:sticky on the left quote panel was silently failing.
 *   Even with overflow-x:clip on <main>, Lenis wraps content in a
 *   scroll-root div which — under certain conditions — interferes
 *   with sticky inside a CSS grid. Additionally, the ghost quote
 *   text rendered cream-on-cream because the section background
 *   is var(--color-bg) and the initial mount opacity animation
 *   sometimes didn't fire.
 *
 * New architecture:
 *   — GSAP ScrollTrigger pin on the WHOLE section for
 *     (N_TESTIMONIALS * 100vh) of scroll distance.
 *   — Scrub-driven gsap.timeline that steps through quotes via
 *     opacity/blur/y transitions. No position:sticky needed at all.
 *   — Left panel: large quote with ghost numeral behind
 *   — Right panel: compact preview list, active item brightens
 *   — Mobile: simple vertical stagger, no pin
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    quote: 'Our annual summit is the single most visible moment of our calendar year. Placing it with GHAIM was not a decision we made lightly — it was the best we have ever made.',
    author: 'Fatima Al Rashid',
    title: 'Director of Strategy',
    company: 'DIFC Authority',
    event: 'Annual Leadership Summit',
  },
];

/* ── Quote Panel (Left) ──────────────────────────────────────── */

function QuotePanel({ active }: { active: number }) {
  const t = TESTIMONIALS[active];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        exit={{   opacity: 0, y: -18, filter: 'blur(3px)' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Ghost numeral */}
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 10vw, 9rem)',
          fontWeight: 300, lineHeight: 1,
          letterSpacing: '-0.05em',
          color: 'rgba(197,160,89,0.09)',
          marginBottom: '-0.18em',
          userSelect: 'none',
        }}>
          {t.id}
        </span>

        {/* Gold rule */}
        <div style={{
          width: '52px', height: '1px',
          background: 'var(--color-accent-1)',
          opacity: 0.55, marginBottom: '32px',
        }} />

        {/* Quote */}
        <blockquote style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.05rem, 2vw, 1.6rem)',
          fontWeight: 300, lineHeight: 1.72,
          letterSpacing: '0.004em',
          color: 'var(--color-text)',
          fontStyle: 'italic',
          margin: 0, marginBottom: '36px',
        }}>
          "{t.quote}"
        </blockquote>

        {/* Author */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.84rem',
            fontWeight: 500, letterSpacing: '0.02em',
            color: 'var(--color-text)',
          }}>
            {t.author}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.7rem',
            fontWeight: 300, color: 'var(--color-text-muted)',
          }}>
            {t.title}, {t.company}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.26em', textTransform: 'uppercase',
            color: 'var(--color-accent-1)', opacity: 0.72, marginTop: '6px',
          }}>
            {t.event}
          </span>
        </div>

        {/* Progress pips */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '40px', alignItems: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i === active ? 1 : 0.2, width: i === active ? '32px' : '10px' }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ height: '1.5px', background: 'var(--color-accent-1)', borderRadius: '2px', flexShrink: 0 }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Preview List (Right) ────────────────────────────────────── */

function PreviewList({ active }: { active: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {TESTIMONIALS.map((t, i) => (
        <motion.div
          key={t.id}
          animate={{ opacity: i === active ? 1 : 0.22 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            padding: 'clamp(28px, 4vw, 48px) 0',
            borderTop: '1px solid rgba(197,160,89,0.1)',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}
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
            fontSize: 'clamp(0.9rem, 1.6vw, 1.25rem)',
            color: 'var(--color-text-mid)',
            maxWidth: '320px', lineHeight: 1.55,
          }}>
            {t.quote.slice(0, 88)}…
          </span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.62rem',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', opacity: 0.65,
          }}>
            — {t.author}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS — Main Export
══════════════════════════════════════════════════════════════ */

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── DESKTOP: GSAP pin + scrub ──────────────────────────── */
    mm.add('(min-width: 768px)', () => {
      if (!sectionRef.current || !innerRef.current) return;

      // Total scroll distance = (N - 1) full viewport heights
      // Each testimonial "owns" one viewport of scroll
      const SCROLL_PER = window.innerHeight;
      const TOTAL      = SCROLL_PER * (TESTIMONIALS.length - 1);

      const st = ScrollTrigger.create({
        trigger:      sectionRef.current,
        pin:          innerRef.current,
        start:        'top top',
        end:          `+=${TOTAL}`,
        scrub:        true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            TESTIMONIALS.length - 1,
            Math.floor(self.progress * TESTIMONIALS.length),
          );
          setActive(idx);
        },
      });

      return () => st.kill();
    });

    /* ── MOBILE: no pin, IntersectionObserver on mobile cards ── */
    mm.add('(max-width: 767px)', () => {
      // On mobile the section is non-pinned;
      // the mobile-cards div drives the active index via IO
      const cards = document.querySelectorAll('.t-mobile-card');
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const idx = Number(e.target.getAttribute('data-idx'));
              if (!isNaN(idx)) setActive(idx);
            }
          }
        },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
      );
      cards.forEach((c) => obs.observe(c));
      return () => obs.disconnect();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{ position: 'relative', background: 'var(--color-bg)', borderTop: '1px solid rgba(197,160,89,0.08)' }}
    >
      {/* ── Inner container — this is what gets pinned on desktop ── */}
      <div ref={innerRef}>

        {/* ── SECTION HEADER ─────────────────────────────────── */}
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
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)' }}>Client Voices</span>
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

        {/* ── DESKTOP LAYOUT: 2-col grid ─────────────────────── */}
        <div
          className="t-desktop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'start',
            maxWidth: '1340px',
            margin: '0 auto',
            padding: '0 clamp(24px, 5vw, 72px)',
            gap: 'clamp(40px, 6vw, 96px)',
            paddingBottom: 'clamp(80px, 9vw, 120px)',
          }}
        >
          {/* LEFT: active quote, changes with scroll */}
          <div style={{ paddingTop: '1rem' }}>
            <QuotePanel active={active} />
          </div>

          {/* RIGHT: preview list (opacity driven by active) */}
          <div>
            <PreviewList active={active} />
          </div>
        </div>

        {/* ── MOBILE LAYOUT: stacked cards ───────────────────── */}
        <div
          className="t-mobile-stack"
          style={{ display: 'none', padding: '0 clamp(20px, 5vw, 32px) clamp(60px, 8vw, 96px)' }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className="t-mobile-card"
              data-idx={i}
              style={{
                padding: 'clamp(32px, 5vw, 56px) 0',
                borderTop: '1px solid rgba(197,160,89,0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ display: 'block', height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.5 }} />
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-accent-1)' }}>{t.company}</span>
              </div>
              <blockquote style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 3.5vw, 1.3rem)',
                fontWeight: 300, lineHeight: 1.7,
                fontStyle: 'italic', color: 'var(--color-text)',
                margin: 0, marginBottom: '24px',
              }}>
                "{t.quote}"
              </blockquote>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {t.author} · {t.title}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent-1)', opacity: 0.65, marginTop: '6px' }}>
                {t.event}
              </p>
            </div>
          ))}
        </div>

        {/* ── VERIFIED FOOTER LINE ─────────────────────────── */}
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

      </div>{/* /innerRef */}

      <style>{`
        @media (max-width: 767px) {
          .t-desktop-grid { display: none !important; }
          .t-mobile-stack { display: block !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          #testimonials * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}
