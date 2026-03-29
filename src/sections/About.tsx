/**
 * About — Scene 3 (FIXED)
 * ─────────────────────────────────────────────────────────────
 * Fixes applied:
 *   ✓ Mobile-responsive 2-col layout (stacks on < lg)
 *   ✓ Sticky headline works correctly in CSS grid
 *   ✓ Pillar grid collapses on mobile (3-col → 1-col)
 *   ✓ Marquee container overflow fixed
 *   ✓ Section is fully visible (removed opacity:0 from initial)
 *   ✓ Image reveal clip-path correctly initialized
 *   ✓ Padding scales properly on all screen sizes
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeIn, staggerContainer } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ────────────────────────────────────────────────────── */

const CLIENTS = [
  'MAG Group', 'Emaar Properties', 'DIFC Authority',
  'Dubai Holding', 'Meraas', 'Aldar Properties',
  'MAG Group', 'Emaar Properties', 'DIFC Authority',
  'Dubai Holding', 'Meraas', 'Aldar Properties',
];

const PILLARS = [
  {
    number: '01',
    title: 'A quiet approach.',
    body: "We don't seek attention for ourselves. The event is the statement. Our role is invisible architecture — the reason everything feels inevitable.",
  },
  {
    number: '02',
    title: 'Precision over performance.',
    body: "Execution is not measured in headcount or decibels. It's measured in the quality of conversation the morning after.",
  },
  {
    number: '03',
    title: 'Legacy over landmark.',
    body: "Any venue can impress once. We design experiences that compound — that become reference points in the memory of everyone in the room.",
  },
];

/* ── Sub-components ──────────────────────────────────────────── */

function LogoMarquee() {
  return (
    <div
      style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <motion.div
        animate={{ x: '-50%' }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'clamp(48px, 6vw, 80px)',
          whiteSpace: 'nowrap',
        }}
      >
        {CLIENTS.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      'clamp(0.6rem, 0.85vw, 0.72rem)',
              fontWeight:    500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'var(--color-text-muted)',
              flexShrink:    0,
            }}
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Pillar({ pillar }: { pillar: (typeof PILLARS)[0] }) {
  return (
    <div
      className="about-pillar"
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '16px',
        paddingTop:    '28px',
        borderTop:     '1px solid var(--color-accent-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span
          style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '0.72rem',
            fontWeight:    300,
            letterSpacing: '0.12em',
            color:         'var(--color-text-muted)',
          }}
        >
          {pillar.number}
        </span>
        <span
          style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(1rem, 1.6vw, 1.35rem)',
            fontWeight:    300,
            fontStyle:     'italic',
            letterSpacing: '-0.01em',
            color:         'var(--color-text)',
          }}
        >
          {pillar.title}
        </span>
      </div>
      <p
        style={{
          fontFamily:  'var(--font-body)',
          fontSize:    'clamp(0.82rem, 1.05vw, 0.9rem)',
          fontWeight:  300,
          lineHeight:  1.8,
          color:       'var(--color-text-muted)',
          maxWidth:    '360px',
        }}
      >
        {pillar.body}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════════ */

export function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const pillarsRef  = useRef<HTMLDivElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Clip-path image reveal ───────────────────────── */
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(28% 12% 28% 12%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              end:   'bottom 30%',
              scrub: 1.4,
            },
          }
        );

        const img = imageRef.current.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.1, y: '3%' },
            {
              scale: 1.0,
              y:     '-3%',
              ease:  'none',
              scrollTrigger: {
                trigger: imageRef.current,
                start:   'top bottom',
                end:     'bottom top',
                scrub:   true,
              },
            }
          );
        }
      }

      /* ── 2. Headline lift ────────────────────────────────── */
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          opacity:  0,
          y:        28,
          duration: 1.1,
          ease:     'power3.out',
          scrollTrigger: {
            trigger:     headlineRef.current,
            start:       'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* ── 3. Pillars stagger ──────────────────────────────── */
      if (pillarsRef.current) {
        gsap.set('.about-pillar', { opacity: 0, y: 28 });
        gsap.to('.about-pillar', {
          opacity:  1,
          y:        0,
          duration: 1.0,
          stagger:  0.18,
          ease:     'power3.out',
          scrollTrigger: {
            trigger:     pillarsRef.current,
            start:       'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* ── 4. Marquee fade ─────────────────────────────────── */
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          opacity:  0,
          duration: 1.0,
          ease:     'power2.out',
          scrollTrigger: {
            trigger:     marqueeRef.current,
            start:       'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position:   'relative',
        background: 'var(--color-bg)',
        overflow:   'hidden',
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        style={{
          position:          'absolute',
          inset:             0,
          backgroundImage:   `
            linear-gradient(rgba(197,160,89,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.028) 1px, transparent 1px)
          `,
          backgroundSize:    '64px 64px',
          pointerEvents:     'none',
        }}
      />

      {/* ════════════════════════════════════════════════════════
          IMAGE REVEAL
      ════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding:   'clamp(80px, 9vw, 120px) clamp(20px, 4vw, 64px) 0',
          position:  'relative',
          zIndex:    1,
        }}
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.75 }} />
          <span style={{ fontSize: '0.66rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--color-accent-1)' }}>
            About Ghaim
          </span>
        </motion.div>

        {/* Clip-path image */}
        <div
          ref={imageRef}
          style={{
            width:    '100%',
            height:   'clamp(280px, 48vw, 620px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2000&auto=format&fit=crop&q=85"
            alt="GHAIM luxury event — grand ballroom setup"
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              transformOrigin: 'center center',
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to bottom, transparent 55%, rgba(247,245,241,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              bottom:   '20px',
              left:     '24px',
              display:  'flex',
              alignItems: 'center',
              gap:      '12px',
            }}
          >
            <span style={{ display: 'block', width: '24px', height: '1px', background: 'rgba(197,160,89,0.7)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
              Atlantis The Palm · 2024
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          EDITORIAL SPLIT — responsive grid
      ════════════════════════════════════════════════════════ */}
      <div
        className="about-editorial-grid"
        style={{
          position:              'relative',
          zIndex:                1,
          padding:               'clamp(52px, 7vw, 96px) clamp(20px, 4vw, 64px)',
          display:               'grid',
          gridTemplateColumns:   '1fr',    /* mobile: single column */
          gap:                   'clamp(36px, 5vw, 72px)',
          alignItems:            'start',
        }}
      >
        {/* Left — Headline */}
        <div className="about-headline-col">
          <h2
            ref={headlineRef}
            style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(2.4rem, 5vw, 5.2rem)',
              fontWeight:    300,
              lineHeight:    1.04,
              letterSpacing: '-0.022em',
              color:         'var(--color-text)',
            }}
          >
            Where Vision
            <br />
            Meets{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-accent-1)' }}>
              Flawless
            </em>
            <br />
            Execution.
          </h2>
          <div
            style={{
              marginTop:  '28px',
              width:      '48px',
              height:     '1px',
              background: 'linear-gradient(to right, var(--color-accent-1), transparent)',
              opacity:    0.7,
            }}
          />
        </div>

        {/* Right — Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 3.5vw, 44px)' }}>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              fontFamily:  'var(--font-body)',
              fontSize:    'clamp(0.875rem, 1.15vw, 0.98rem)',
              fontWeight:  300,
              lineHeight:  1.84,
              color:       'var(--color-text-mid)',
              maxWidth:    '520px',
            }}
          >
            GHAIM has spent over a decade shaping the most prestigious
            corporate events across the Gulf. We work exclusively with
            organisations that demand the highest standards — in venue,
            in service, in lasting impression.
          </motion.p>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(0.875rem, 1.15vw, 0.98rem)',
              fontWeight: 300,
              lineHeight: 1.84,
              color:      'var(--color-text-muted)',
              maxWidth:   '480px',
            }}
          >
            Our approach is quiet, deliberate, and precise. We do not
            measure success in headcount — we measure it in the
            conversations that happen the day after.
          </motion.p>

          <motion.a
            href="#work"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
            style={{
              fontSize:      '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily:    'var(--font-body)',
              fontWeight:    500,
              color:         'var(--color-accent-1)',
              width:         'fit-content',
            }}
            whileHover={{ x: 5 }}
          >
            <span>View Our Work</span>
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path d="M1 5h18M14 1l5 4-5 4" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          PHILOSOPHY PILLARS
      ════════════════════════════════════════════════════════ */}
      <motion.div
        ref={pillarsRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="about-pillars-grid"
        style={{
          position:   'relative',
          zIndex:     1,
          padding:    '0 clamp(20px, 4vw, 64px) clamp(60px, 8vw, 96px)',
          display:    'grid',
          gap:        'clamp(20px, 3.5vw, 48px)',
        }}
      >
        {PILLARS.map((pillar) => (
          <Pillar key={pillar.number} pillar={pillar} />
        ))}
      </motion.div>

      {/* ════════════════════════════════════════════════════════
          CLIENT MARQUEE
      ════════════════════════════════════════════════════════ */}
      <div
        ref={marqueeRef}
        style={{
          position:     'relative',
          zIndex:       1,
          borderTop:    '1px solid var(--color-accent-3)',
          borderBottom: '1px solid var(--color-accent-3)',
          padding:      'clamp(16px, 2vw, 22px) 0',
          overflow:     'hidden',
        }}
      >
        {/* Label */}
        <div
          style={{
            position:  'absolute',
            left:      'clamp(20px, 4vw, 64px)',
            top:       '50%',
            transform: 'translateY(-50%)',
            zIndex:    2,
            display:   'flex',
            alignItems: 'center',
            gap:       '14px',
            background: 'var(--color-bg)',
            paddingRight: '12px',
          }}
        >
          <span
            style={{
              fontSize:      '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily:    'var(--font-body)',
              color:         'var(--color-text-muted)',
              whiteSpace:    'nowrap',
            }}
          >
            Trusted by
          </span>
          <span
            style={{
              display:    'block',
              width:      '32px',
              height:     '1px',
              background: 'linear-gradient(to right, rgba(197,160,89,0.5), transparent)',
            }}
          />
        </div>

        <div style={{ paddingLeft: 'clamp(120px, 13vw, 180px)' }}>
          <LogoMarquee />
        </div>
      </div>

      {/* ── Responsive grid CSS (injected inline via style tag approach) ── */}
      <style>{`
        @media (min-width: 768px) {
          .about-editorial-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .about-headline-col {
            position: sticky;
            top: 120px;
            align-self: start;
          }
          .about-pillars-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 767px) {
          .about-pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}