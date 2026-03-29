/**
 * Hero — Scene 1
 * ───────────────────────────────────────────────────────────────
 * Blueprint spec implemented:
 *   ✓ Word-by-word stagger (y: 80 → 0, opacity 0 → 1, stagger 0.055s)
 *   ✓ 200vh section with sticky inner frame — the extra 100vh is the
 *     "transition zone" where the scene dissolves before the next begins
 *   ✓ Scroll-driven dark overlay (GSAP scrub) replaces Framer scroll hooks
 *   ✓ Video scales out slightly as user exits — adds cinematic depth
 *   ✓ Content fades + lifts away as overlay comes in
 *
 * ARCHITECTURE CHANGE:
 *   OLD: section is 100svh, Framer Motion handles parallax
 *   NEW: section is 200vh, inner frame is position:sticky + 100svh.
 *        GSAP owns all scroll-driven motion. Framer handles only hover
 *        micro-interactions and the initial load timeline.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/Button';

gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────── */

/** Splits a string into individual word <span> elements for GSAP targeting */
function WordLine({
  words,
  italic = false,
  accent = false,
}: {
  words: string[];
  italic?: boolean;
  accent?: boolean;
}) {
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            // Each word gets a clip container so the word slides up from below
            // the line without affecting surrounding layout
          }}
        >
          <span
            className="hero-word"
            style={{
              display: 'inline-block',
              fontStyle: italic ? 'italic' : 'normal',
              color: accent ? 'var(--color-accent-1)' : 'inherit',
            }}
          >
            {word}
            {/* Non-breaking space after each word except within final iteration —
                the line-break is handled by the parent via <br /> */}
            {'\u00a0'}
          </span>
        </span>
      ))}
    </>
  );
}

/* ── Corner Ornament ─────────────────────────────────────────── */

function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const pos = {
    tl: 'top-7 left-7 rotate-0',
    tr: 'top-7 right-7 rotate-90',
    bl: 'bottom-7 left-7 -rotate-90',
    br: 'bottom-7 right-7 rotate-180',
  }[position];

  return (
    <div
      className={`hero-ornament absolute ${pos} w-7 h-7 pointer-events-none hidden lg:block`}
      style={{ opacity: 0 }}
    >
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <path d="M2 26 L2 2 L26 2" stroke="#C5A059" strokeWidth="0.9" />
        <circle cx="2" cy="2" r="1.4" fill="#C5A059" opacity="0.8" />
      </svg>
    </div>
  );
}

/* ── Stat Item ───────────────────────────────────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="hero-stat flex flex-col items-center md:items-start gap-1" style={{ opacity: 0 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.55rem, 2.8vw, 2.25rem)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#FFFFFF',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.52)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */

export function Hero() {
  const sectionRef  = useRef<HTMLElement>(null); // 200vh outer section
  const contentRef  = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);

  /* ─────────────────────────────────────────────────────────────
     LOAD ANIMATION — runs once on mount, not scroll-driven
     Order: words → eyebrow + sub → CTA → stats → ornaments
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Start everything hidden (set before animation begins)
      gsap.set('.hero-word', { y: 80, opacity: 0 });
      gsap.set('.hero-eyebrow', { y: 24, opacity: 0 });
      gsap.set('.hero-sub', { y: 20, opacity: 0 });
      gsap.set('.hero-cta', { y: 16, opacity: 0 });
      gsap.set('.hero-stat', { y: 18, opacity: 0 });
      gsap.set('.hero-ornament', { opacity: 0 });
      gsap.set('.hero-side', { opacity: 0, x: 0 });
      gsap.set('.hero-pulse', { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.35 });

      // 1 — Headline words float up into position — the hero moment
      tl.to('.hero-word', {
        y: 0,
        opacity: 1,
        duration: 1.15,
        stagger: 0.055,
        ease: 'power4.out',
      })

      // 2 — Supporting content comes in together
      .to(
        ['.hero-eyebrow', '.hero-sub'],
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.65'
      )

      // 3 — CTA button
      .to(
        '.hero-cta',
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.55'
      )

      // 4 — Stats bar
      .to(
        '.hero-stat',
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.75,
          ease: 'power2.out',
        },
        '-=0.5'
      )

      // 5 — Decorative elements last — subtle, not central
      .to(
        '.hero-ornament',
        { opacity: 0.5, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .to(
        '.hero-side',
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '<'
      )
      .to(
        '.hero-pulse',
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─────────────────────────────────────────────────────────────
     SCROLL ANIMATION — section exit (the 100vh transition zone)
     ScrollTrigger watches the OUTER 200vh section.
     Trigger start: when the midpoint of the section hits the top.
     Trigger end: when the bottom hits the top (section leaves).
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '42% top',   // content starts fading ~halfway through
          end: 'bottom top',  // completes when section leaves viewport
          scrub: 0.85,
        },
      });

      tl
        // Content lifts and fades out
        .to(contentRef.current, { opacity: 0, y: -36, ease: 'none' }, 0)
        // Stats fade slightly faster
        .to(statsRef.current, { opacity: 0, y: -18, ease: 'none' }, 0)
        // Dark overlay comes in
        .to(overlayRef.current, { opacity: 1, ease: 'none' }, 0)
        // Video drifts slightly — adds the cinematic "pull back" feel
        .to(videoRef.current, { scale: 1.07, ease: 'none' }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    /*
     * OUTER SECTION — 200vh
     * The extra 100vh below the viewport is the scroll transition zone.
     * The sticky frame stays pinned while the user scrolls through it.
     */
    <section
      ref={sectionRef}
      id="hero"
      style={{ height: '200vh', position: 'relative' }}
    >
      {/* ──────────────────────────────────────────────────────────
          STICKY FRAME — always fills the viewport while in view
      ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          minHeight: '660px',
          overflow: 'hidden',
          background: '#060504', // fallback before video loads
        }}
      >
        {/* ════════════════════════════════════════════════════════
            BACKGROUND — Video
        ════════════════════════════════════════════════════════ */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transformOrigin: 'center center',
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>

        {/* Layered gradient vignettes — preserve video brightness mid-frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(6, 5, 4, 0.42)  0%,
                rgba(6, 5, 4, 0.14) 35%,
                rgba(6, 5, 4, 0.20) 60%,
                rgba(6, 5, 4, 0.58) 88%,
                rgba(6, 5, 4, 0.76) 100%
              )
            `,
          }}
        />
        {/* Left-side atmospheric vignette — grounds the headline */}
        <div
          className="absolute inset-y-0 left-0 w-2/5 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(6,5,4,0.48), transparent)' }}
        />

        {/* Scroll-exit dark overlay — animated by GSAP scrub above */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: '#060504', opacity: 0 }}
        />

        {/* ════════════════════════════════════════════════════════
            DECORATIVE
        ════════════════════════════════════════════════════════ */}
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Side labels */}
        <div
          className="hero-side absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10"
          style={{ opacity: 0 }}
        >
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.32)',
            }}
          >
            Est. 2018
          </span>
          <span
            style={{
              width: '1px',
              height: '56px',
              background: 'linear-gradient(to bottom, rgba(197,160,89,0.6), transparent)',
            }}
          />
        </div>

        <div
          className="hero-side absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10"
          style={{ opacity: 0 }}
        >
          <span
            style={{
              width: '1px',
              height: '56px',
              background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.5))',
            }}
          />
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.30)',
            }}
          >
            Scroll
          </span>
        </div>

        {/* ════════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════════ */}
        <div
          ref={contentRef}
          className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24"
        >
          <div className="flex flex-col gap-7 max-w-[720px]">

            {/* Eyebrow */}
            <div
              className="hero-eyebrow flex items-center gap-4"
              style={{ opacity: 0 }}
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
                Luxury Event Management
              </span>
            </div>

            {/* Headline — word-split for stagger animation */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7.2vw, 7.4rem)',
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: '-0.024em',
                color: '#F8F4EE',
              }}
            >
              <WordLine words={['We', 'Craft']} />
              <br />
              <WordLine words={['Extraordinary']} italic accent />
              <br />
              <WordLine words={['Experiences.']} />
            </h1>

            {/* Supporting text */}
            <p
              className="hero-sub"
              style={{
                fontSize: 'clamp(0.875rem, 1.2vw, 0.95rem)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                lineHeight: 1.78,
                letterSpacing: '0.01em',
                color: 'rgba(255,255,255,0.58)',
                maxWidth: '390px',
                opacity: 0,
              }}
            >
              From intimate corporate retreats to landmark galas —
              every detail is an act of deliberate precision.
            </p>

            {/* CTA Row */}
            <div
              className="hero-cta flex flex-wrap items-center gap-5 pt-1"
              style={{ opacity: 0 }}
            >
              <Button variant="ghost-light" size="lg">
                Explore Our Work
              </Button>

              <motion.a
                href="#about"
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(255,255,255,0.48)',
                }}
                whileHover={{ x: 4, color: 'rgba(255,255,255,0.88)' }}
                transition={{ duration: 0.22 }}
              >
                <span>Our Story</span>
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path
                    d="M1 5h16M12 1l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            STATS BAR — bottom edge
        ════════════════════════════════════════════════════════ */}
        <div
          ref={statsRef}
          className="absolute bottom-10 left-8 md:left-16 lg:left-24 right-8 md:right-16 lg:right-24 z-10"
        >
          {/* Gold rule */}
          <div
            className="mb-7 w-full"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7), transparent)',
            }}
          />
          <div className="flex flex-row items-start justify-between md:justify-start md:gap-16">
            <StatItem value="200+" label="Events Delivered" />
            <StatItem value="18"   label="Countries"        />
            <StatItem value="12+"  label="Years of Excellence" />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            SCROLL PULSE — centre bottom
        ════════════════════════════════════════════════════════ */}
        <div
          className="hero-pulse absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center"
          style={{ opacity: 0 }}
        >
          <motion.span
            style={{
              display: 'block',
              width: '1px',
              height: '42px',
              background: 'linear-gradient(to bottom, rgba(197,160,89,0.7), transparent)',
            }}
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.7, 0.22, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

      </div>{/* /sticky frame */}
    </section>
  );
}