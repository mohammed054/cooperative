/**
 * About — Scene 3
 * ─────────────────────────────────────────────────────────────
 * Blueprint changes applied:
 *
 *   ❌ REMOVED: 3-column case study card grid (cards belong in CaseStudies)
 *   ❌ REMOVED: Client logo pill grid
 *   ❌ REMOVED: Framer Motion scroll hooks (useScroll / useTransform)
 *
 *   ✓ ADDED: Full-width clip-path image reveal (Scene 4 from blueprint)
 *   ✓ ADDED: Left-pinned editorial layout — left column pins while right scrolls
 *   ✓ ADDED: Infinite logo marquee (no pills, just spaced names — cleaner)
 *   ✓ ADDED: Three philosophy statements replacing the card grid
 *   ✓ ALL scroll animation now owned by GSAP
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeIn, staggerContainer } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ────────────────────────────────────────────────────── */

const CLIENTS = [
  'MAG Group',
  'Emaar Properties',
  'DIFC Authority',
  'Dubai Holding',
  'Meraas',
  'Aldar Properties',
  'MAG Group',          // duplicated for seamless marquee loop
  'Emaar Properties',
  'DIFC Authority',
  'Dubai Holding',
  'Meraas',
  'Aldar Properties',
];

// Three core philosophy statements — replace the card grid
const PILLARS = [
  {
    number: '01',
    title: 'A quiet approach.',
    body: 'We don\'t seek attention for ourselves. The event is the statement. Our role is invisible architecture — the reason everything feels inevitable.',
  },
  {
    number: '02',
    title: 'Precision over performance.',
    body: 'Execution is not measured in headcount or decibels. It\'s measured in the quality of conversation the morning after.',
  },
  {
    number: '03',
    title: 'Legacy over landmark.',
    body: 'Any venue can impress once. We design experiences that compound — that become reference points in the memory of everyone in the room.',
  },
];

/* ── Sub-components ──────────────────────────────────────────── */

/** Infinite horizontal logo marquee — no pills, editorial names only */
function LogoMarquee() {
  return (
    <div
      style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      }}
    >
      <motion.div
        animate={{ x: '-50%' }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
        }}
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
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.62rem, 0.9vw, 0.75rem)',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** Single philosophy pillar — no card, just editorial text */
function Pillar({ pillar }: { pillar: (typeof PILLARS)[0] }) {
  return (
    <div
      className="about-pillar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingTop: '28px',
        borderTop: '1px solid var(--color-accent-3)',
        opacity: 0,  // GSAP will animate this in
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'var(--color-text-muted)',
          }}
        >
          {pillar.number}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            color: 'var(--color-text)',
          }}
        >
          {pillar.title}
        </span>
      </div>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.825rem, 1.1vw, 0.9rem)',
          fontWeight: 300,
          lineHeight: 1.8,
          color: 'var(--color-text-muted)',
          maxWidth: '460px',
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
  const sectionRef   = useRef<HTMLElement>(null);
  const imageRef     = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const pillarsRef   = useRef<HTMLDivElement>(null);
  const marqueeRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. Image reveal — clip-path expands from centre ─────── */
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(36% 18% 36% 18%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 1.4,
            },
          }
        );

        // Slight parallax drift on the image itself
        gsap.fromTo(
          imageRef.current.querySelector('img'),
          { scale: 1.12, y: '4%' },
          {
            scale: 1.0,
            y: '-4%',
            ease: 'none',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      /* ── 2. Headline lifts in ────────────────────────────────── */
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          opacity: 0,
          y: 32,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      /* ── 3. Pillars stagger in ───────────────────────────────── */
      if (pillarsRef.current) {
        gsap.to('.about-pillar', {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });

        // Set initial state for pillars
        gsap.set('.about-pillar', { y: 28 });
      }

      /* ── 4. Marquee fades in ─────────────────────────────────── */
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          opacity: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: 'top 88%',
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
        position: 'relative',
        background: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle grid texture ────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(197,160,89,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.032) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Hero image with clip-path reveal
          Blueprint: Scene 4 — Image Reveal
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: 'clamp(80px, 9vw, 120px) clamp(24px, 5vw, 72px) 0',
          position: 'relative',
          zIndex: 1,
        }}
      >

        {/* Eyebrow above image */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{
              display: 'block',
              height: '1px',
              width: '36px',
              background: 'var(--color-accent-1)',
              opacity: 0.75,
            }}
          />
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              color: 'var(--color-accent-1)',
            }}
          >
            About Ghaim
          </span>
        </motion.div>

        {/* ── CLIP-PATH IMAGE ─────────────────────────────────── */}
        {/*
          The clipPath starts tight (inset from all sides) and expands to
          fill the full container as the user scrolls. GSAP scrub handles it.
          The overflow:hidden on the outer div is critical — without it the
          image shows outside the clip during the animation.
        */}
        <div
          ref={imageRef}
          style={{
            width: '100%',
            height: 'clamp(360px, 55vw, 680px)',
            overflow: 'hidden',
            position: 'relative',
            clipPath: 'inset(36% 18% 36% 18%)', // initial state — GSAP animates this
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2000&auto=format&fit=crop&q=85"
            alt="GHAIM luxury event — grand ballroom setup"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transformOrigin: 'center center',
              scale: 1.12, // GSAP will animate this
            }}
          />

          {/* Overlay so image doesn't compete with text below */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 55%, rgba(247,245,241,0.6) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Image caption — bottom left */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: 'rgba(197,160,89,0.7)',
              }}
            />
            <span
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              Atlantis The Palm · 2024
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — Editorial split: headline left, narrative right
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 72px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'start',
        }}
      >
        {/* Left — Headline (pinned via position:sticky in tall screens) */}
        <div
          style={{
            position: 'sticky',
            top: '120px',
            alignSelf: 'start',
          }}
        >
          <h2
            ref={headlineRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.6rem, 5.2vw, 5.4rem)',
              fontWeight: 300,
              lineHeight: 1.04,
              letterSpacing: '-0.022em',
              color: 'var(--color-text)',
            }}
          >
            Where Vision
            <br />
            Meets{' '}
            <em
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-accent-1)',
              }}
            >
              Flawless
            </em>
            <br />
            Execution.
          </h2>

          {/* Gold accent rule under headline */}
          <div
            style={{
              marginTop: '32px',
              width: '56px',
              height: '1px',
              background: 'linear-gradient(to right, var(--color-accent-1), transparent)',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Right — Narrative text + pillars (scrolls past the sticky headline) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 52px)' }}>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.875rem, 1.2vw, 0.98rem)',
              fontWeight: 300,
              lineHeight: 1.84,
              letterSpacing: '0.008em',
              color: 'var(--color-text-mid)',
              maxWidth: '480px',
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
              fontSize: 'clamp(0.875rem, 1.2vw, 0.98rem)',
              fontWeight: 300,
              lineHeight: 1.84,
              color: 'var(--color-text-muted)',
              maxWidth: '440px',
            }}
          >
            Our approach is quiet, deliberate, and precise. We do not
            measure success in headcount — we measure it in the
            conversations that happen the day after.
          </motion.p>

          {/* CTA link */}
          <motion.a
            href="#work"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              color: 'var(--color-accent-1)',
              width: 'fit-content',
            }}
            whileHover={{ x: 5 }}
          >
            <span>View Our Work</span>
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path
                d="M1 5h18M14 1l5 4-5 4"
                stroke="currentColor"
                strokeWidth="0.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — Philosophy pillars (replaces card grid)
          Three horizontal statements, separated by border-top lines.
          Editorial, not UI.
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        ref={pillarsRef}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '0 clamp(24px, 5vw, 72px) clamp(60px, 8vw, 100px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(24px, 4vw, 56px)',
        }}
      >
        {PILLARS.map((pillar) => (
          <Pillar key={pillar.number} pillar={pillar} />
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4 — Client trust marquee
          Infinite horizontal scroll of client names.
          No pills. No hover states. Just quiet authority.
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={marqueeRef}
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--color-accent-3)',
          borderBottom: '1px solid var(--color-accent-3)',
          padding: 'clamp(18px, 2vw, 24px) 0',
        }}
      >
        {/* Label */}
        <div
          style={{
            position: 'absolute',
            left: 'clamp(24px, 5vw, 72px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            Trusted by
          </span>
          <span
            style={{
              display: 'block',
              width: '36px',
              height: '1px',
              background: 'linear-gradient(to right, rgba(197,160,89,0.5), transparent)',
            }}
          />
        </div>

        {/* Marquee (padded left to clear the label) */}
        <div style={{ paddingLeft: 'clamp(120px, 14vw, 200px)' }}>
          <LogoMarquee />
        </div>
      </div>

    </section>
  );
}