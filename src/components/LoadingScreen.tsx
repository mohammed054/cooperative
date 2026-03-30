/**
 * LoadingScreen — LIGHT / CREAM THEME
 * ─────────────────────────────────────────────────────────────
 * Site is primarily cream / light. Loader MUST match.
 * Dark loader creates jarring contrast on a mainly-light brand.
 *
 * Palette:
 *   Background: #F7F5F1  (exact match of --color-bg)
 *   Text:       dark     (#1A1A1A family, muted)
 *   Accent:     #C5A059  (gold — unchanged, pops on cream)
 *
 * Dissolve: cream screen fades out → hero (also cream bg) fades in → seamless
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLImageElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);
  const countRef     = useRef<HTMLSpanElement>(null);
  const wordmarkRef  = useRef<HTMLSpanElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity:  0,
            duration: 0.95,
            ease:     'power2.inOut',
            onComplete: () => {
              document.body.style.overflow = '';
              onComplete();
            },
          });
        },
      });

      gsap.set([logoRef.current, wordmarkRef.current, taglineRef.current], { opacity: 0, y: 14 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });
      gsap.set(barRef.current,  { scaleX: 0, transformOrigin: 'left' });

      tl
        .to(logoRef.current, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
        .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' }, '-=0.55')
        .to(lineRef.current,     { scaleX: 1,            duration: 0.68, ease: 'power2.inOut' }, '-=0.38')
        .to(barRef.current,      { scaleX: 1,            duration: 1.55, ease: 'power2.inOut' }, '-=0.2')
        .to(counter, {
          val: 100,
          duration: 1.55,
          ease: 'power2.inOut',
          onUpdate() {
            if (countRef.current) countRef.current.textContent = `${Math.round(counter.val)}`;
          },
        }, '<')
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=1.05')
        .to({}, { duration: 0.32 });
    }, containerRef);

    return () => { ctx.revert(); document.body.style.overflow = ''; };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        background:     '#F7F5F1',   /* cream — exact match to site bg */
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '34px',
      }}
    >
      {/* Soft gold radial bloom — subtle on cream */}
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '560px', height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(197,160,89,0.12) 0%, transparent 66%)',
        pointerEvents: 'none',
      }} />

      {/* ── Brand mark ──────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
        {/* Logo — dark filter so it reads on cream background */}
        <img
          ref={logoRef}
          src="/logo.webp"
          alt="GHAIM"
          style={{
            width:  'clamp(50px, 7vw, 70px)',
            height: 'auto',
            opacity: 0,
            filter: 'brightness(0) opacity(0.68)',   /* dark on cream */
          }}
        />

        {/* Gold separator */}
        <div ref={lineRef} style={{
          width: '30px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.85), transparent)',
        }} />

        {/* Wordmark — muted dark */}
        <span ref={wordmarkRef} style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(0.56rem, 1vw, 0.68rem)',
          fontWeight:    300,
          letterSpacing: '0.58em',
          textTransform: 'uppercase',
          color:         'rgba(26,26,26,0.48)',
          opacity:       0,
        }}>
          GHAIM
        </span>
      </div>

      {/* ── Progress bar ────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        alignItems: 'flex-end', width: 'clamp(130px, 18vw, 185px)',
      }}>
        {/* Track */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(26,26,26,0.10)', overflow: 'hidden' }}>
          <div ref={barRef} style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(to right, rgba(197,160,89,0.55), #C5A059)',
          }} />
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span ref={countRef} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.08em', color: 'rgba(197,160,89,0.85)', fontWeight: 400,
          }}>0</span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.5rem',
            letterSpacing: '0.04em', color: 'rgba(197,160,89,0.55)',
          }}>%</span>
        </div>
      </div>

      {/* Tagline */}
      <span ref={taglineRef} style={{
        position: 'absolute', bottom: '34px',
        fontFamily: 'var(--font-body)', fontSize: '0.54rem',
        letterSpacing: '0.38em', textTransform: 'uppercase',
        color: 'rgba(26,26,26,0.26)', fontWeight: 400, opacity: 0,
      }}>
        Luxury Event Management
      </span>
    </div>
  );
}
