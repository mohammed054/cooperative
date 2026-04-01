/**
 * Hero — Scene 1
 * ─────────────────────────────────────────────────────────────
 * CHANGES FROM PREVIOUS VERSION:
 *
 *  CHANGE 1 — VIDEO LESS DARK
 *    Left gradient: 0.60 → 0.38 anchor (much lighter right-side luminosity)
 *    Bottom gradient: top reduced 0.40 → 0.18, mid reduced
 *    Bottom seam: 0.82 preserved exactly (Statement bridge depends on it)
 *    Scroll exit overlay max: 0.72 → 0.50 (video stays more visible on scroll)
 *
 *  All other fixes from previous version preserved unchanged.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Word split helper ──────────────────────────────────────── */

function WordLine({ words, italic = false, accent = false }: {
  words: string[]; italic?: boolean; accent?: boolean;
}) {
  return (
    <>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span
            className="hero-word"
            style={{
              display:   'inline-block',
              fontStyle: italic ? 'italic' : 'normal',
              color:     accent  ? 'var(--color-accent-1)' : 'inherit',
            }}
          >
            {word}{'\u00a0'}
          </span>
        </span>
      ))}
    </>
  );
}

/* ── Corner ornament ─────────────────────────────────────────── */

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

/* ── Stat item ───────────────────────────────────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="hero-stat flex flex-col items-center md:items-start gap-1" style={{ opacity: 0 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.55rem, 2.8vw, 2.25rem)',
        fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1,
        color: '#FFFFFF',
      }}>{value}</span>
      <span style={{
        fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase',
        fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(255,255,255,0.52)',
      }}>{label}</span>
    </div>
  );
}

/* ── Glass CTA button ───────────────────────────────────────── */

function GlassButton({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} whileHover="hover" initial="rest">
      <motion.span
        variants={{ rest: { opacity: 0, scale: 0.88 }, hover: { opacity: 1, scale: 1.05 } }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: '-6px', borderRadius: '3px',
          background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.16) 0%, transparent 72%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
      <motion.span
        variants={{ rest: { background: 'rgba(255,255,255,0.04)' }, hover: { background: 'rgba(255,255,255,0.09)' } }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0, backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)', borderRadius: '2px', pointerEvents: 'none', zIndex: 1,
        }}
      />
      <span style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(255,255,255,0.24)', borderRadius: '2px', pointerEvents: 'none', zIndex: 1,
      }} />
      <motion.span
        variants={{ rest: { scaleX: 0, originX: 0 }, hover: { scaleX: 1, originX: 0 } }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(197,160,89,0.18), rgba(197,160,89,0.07))',
          borderRadius: '2px', pointerEvents: 'none', zIndex: 2,
        }}
      />
      <motion.span
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.38, delay: 0.16, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0,
          border: '1px solid rgba(197,160,89,0.58)', borderRadius: '2px', pointerEvents: 'none', zIndex: 3,
        }}
      />
      <motion.a
        href={href}
        variants={{ rest: { color: 'rgba(255,255,255,0.85)' }, hover: { color: '#FFFFFF' } }}
        transition={{ duration: 0.3, delay: 0.18, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 4, display: 'inline-block',
          padding: 'clamp(12px,1.4vw,14px) clamp(28px,3.2vw,42px)',
          fontSize: '0.74rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          fontFamily: 'var(--font-body)', fontWeight: 500, textDecoration: 'none',
        }}
      >{children}</motion.a>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);

  /* ── Load sequence ──────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-word',          { y: 90, opacity: 0 });
      gsap.set('.hero-sub-statement', { y: 22, opacity: 0 });
      gsap.set('.hero-eyebrow',       { y: 24, opacity: 0 });
      gsap.set('.hero-sub',           { y: 20, opacity: 0 });
      gsap.set('.hero-cta',           { y: 16, opacity: 0 });
      gsap.set('.hero-stat',          { y: 18, opacity: 0 });
      gsap.set('.hero-ornament',      { opacity: 0 });
      gsap.set('.hero-side',          { opacity: 0 });
      gsap.set('.hero-pulse',         { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.38 });

      tl
        .to('.hero-word',          { y: 0, opacity: 1, duration: 1.25, stagger: 0.058, ease: 'power4.out' })
        .to('.hero-sub-statement', { y: 0, opacity: 1, duration: 1.0,  ease: 'power3.out' }, '-=0.58')
        .to('.hero-eyebrow',       { y: 0, opacity: 1, duration: 0.88, ease: 'power3.out' }, '-=0.78')
        .to('.hero-sub',           { y: 0, opacity: 1, duration: 0.88, ease: 'power3.out' }, '-=0.58')
        .to('.hero-cta',           { y: 0, opacity: 1, duration: 0.80, ease: 'power3.out' }, '-=0.52')
        .to('.hero-stat',          { y: 0, opacity: 1, stagger: 0.12, duration: 0.78, ease: 'power2.out' }, '-=0.52')
        .to('.hero-ornament',      { opacity: 0.5, duration: 0.8, ease: 'power2.out' }, '-=0.56')
        .to('.hero-side',          { opacity: 1,   duration: 0.8, ease: 'power2.out' }, '<')
        .to('.hero-pulse',         { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.4');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Scroll exit ────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -55, opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top', scrub: 0.7,
        },
      });
      gsap.to(statsRef.current, {
        y: -28, opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top', scrub: 0.5,
        },
      });

      /*
       * CHANGE: max opacity 0.72 → 0.50
       * The video was getting too dark during scroll exit.
       * Start trigger preserved at '45% top'.
       */
      gsap.to(overlayRef.current, {
        opacity: 0.50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '45% top',
          end:   'bottom top',
          scrub: 0.9,
        },
      });

      gsap.to(videoRef.current, {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', end: 'bottom top', scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        height:    '100svh',
        minHeight: '660px',
        position:  'relative',
        overflow:  'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {/* ══ VIDEO ════════════════════════════════════════════ */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        poster="/images/hero-poster.jpg"
        style={{
          position:        'absolute',
          inset:           0,
          width:           '100%',
          height:          '100%',
          objectFit:       'cover',
          transformOrigin: 'center center',
          willChange:      'transform',
          animation:       'heroVideoFadeIn 1.1s ease 0.25s both',
        }}
      >
        <source src="/background.mp4"   type="video/mp4" />
        <source src="/videos/hero.webm" type="video/webm" />
      </video>

      <style>{`
        @keyframes heroVideoFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ══ GRADIENTS ════════════════════════════════════════
          CHANGE: Left gradient lightened — 0.60 → 0.38 anchor.
          CHANGE: Bottom top reduced 0.40 → 0.18, mid softened.
          PRESERVED: Bottom seam at 0.82 — Statement bridge requires this.
      ════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.20) 32%, rgba(0,0,0,0.07) 58%, rgba(0,0,0,0.0) 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `linear-gradient(to bottom,
          rgba(6,5,4,0.18)  0%,
          rgba(6,5,4,0.03) 28%,
          rgba(6,5,4,0.05) 56%,
          rgba(6,5,4,0.52) 85%,
          rgba(6,5,4,0.82) 100%
        )`,
      }} />

      {/* Scroll-exit overlay — CHANGE: max opacity 0.72 → 0.50 */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#060504', opacity: 0 }}
      />

      {/* ══ DECORATIVE ══════════════════════════════════════ */}
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="hero-side absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10" style={{ opacity: 0 }}>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(255,255,255,0.30)' }}>Est. 2018</span>
        <span style={{ width: '1px', height: '56px', background: 'linear-gradient(to bottom, rgba(197,160,89,0.55), transparent)' }} />
      </div>
      <div className="hero-side absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10" style={{ opacity: 0 }}>
        <span style={{ width: '1px', height: '56px', background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.45))' }} />
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(255,255,255,0.28)' }}>Scroll</span>
      </div>

      {/* ══ MAIN CONTENT ═════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center"
        style={{ paddingLeft: 'clamp(32px,7.5vw,114px)', paddingRight: 'clamp(24px,6vw,80px)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px,2.6vw,30px)', maxWidth: '660px' }}>

          {/* Eyebrow */}
          <div className="hero-eyebrow flex items-center gap-4" style={{ opacity: 0 }}>
            <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.75 }} />
            <span style={{ fontSize: '0.66rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--color-accent-1)' }}>
              Luxury Event Management
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 8.5vw, 9.2rem)',
            fontWeight: 300, lineHeight: 0.92, letterSpacing: '-0.030em', color: '#F8F4EE',
          }}>
            <WordLine words={['Extraordinary']} italic accent />
            <br />
            <WordLine words={['Experiences.']} />
          </h1>

          {/* Sub-statement */}
          <p className="hero-sub-statement" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem,1.65vw,1.38rem)',
            fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.005em', lineHeight: 1.42,
            color: 'rgba(255,255,255,0.44)', opacity: 0, marginTop: '-4px',
          }}>
            Crafted with precision.
          </p>

          {/* Body copy */}
          <p className="hero-sub" style={{
            fontSize: 'clamp(0.875rem,1.15vw,0.96rem)', fontFamily: 'var(--font-body)',
            fontWeight: 300, lineHeight: 1.84, letterSpacing: '0.01em',
            color: 'rgba(255,255,255,0.50)', maxWidth: '375px', opacity: 0,
          }}>
            From intimate corporate retreats to landmark galas —
            every detail is an act of deliberate precision.
          </p>

          {/* CTA row */}
          <div className="hero-cta flex flex-wrap items-center gap-6 pt-1" style={{ opacity: 0 }}>
            <GlassButton href="#work">Explore Our Work</GlassButton>
            <motion.a
              href="#about"
              className="flex items-center gap-3"
              style={{
                fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgba(255,255,255,0.42)',
              }}
              whileHover={{ x: 5, color: 'rgba(255,255,255,0.88)' }}
              transition={{ duration: 0.22 }}
            >
              <span>Our Story</span>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                <path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>

      {/* ══ STATS BAR ════════════════════════════════════════ */}
      <div
        ref={statsRef}
        className="absolute bottom-10 z-10"
        style={{ left: 'clamp(32px,7.5vw,114px)', right: 'clamp(32px,7.5vw,114px)' }}
      >
        <div className="mb-7" style={{
          height: '1px',
          background: 'linear-gradient(to right, rgba(197,160,89,0.62), rgba(197,160,89,0.18), transparent)',
        }} />
        <div className="flex flex-row items-start justify-between md:justify-start md:gap-16">
          <StatItem value="200+" label="Events Delivered"    />
          <StatItem value="18"   label="Countries"           />
          <StatItem value="12+"  label="Years of Excellence" />
        </div>
      </div>

      {/* ══ SCROLL PULSE ═════════════════════════════════════ */}
      <div className="hero-pulse absolute bottom-12 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center" style={{ opacity: 0 }}>
        <motion.span
          style={{ display: 'block', width: '1px', height: '44px', background: 'linear-gradient(to bottom, rgba(197,160,89,0.65), transparent)' }}
          animate={{ scaleY: [1, 0.35, 1], opacity: [0.7, 0.16, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}