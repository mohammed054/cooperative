/**
 * Statement — Scene 2
 * ─────────────────────────────────────────────────────────────
 * CHANGE: end '+=320%' → '+=180%'
 *
 * Root cause of the air gap:
 *   320% = 320vh of pinned scroll space. At 1080p that's over 3 full screens
 *   of pinned scroll just for this scene. The user was scrolling through ~140vh
 *   of "stuck" screen where the bloom was already 100% cream with no visible
 *   change — felt like dead air before About arrived.
 *
 *   180% = 180vh. Timeline still maps 0→1.0 across this range.
 *   Bloom hits 100% at exactly the pin end — no wasted scroll.
 *   The transition to About is immediate when pin releases.
 *
 * All animation values, timings, and visual design preserved unchanged.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef     = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const line4Ref   = useRef<HTMLDivElement>(null);
  const ruleRef    = useRef<HTMLSpanElement>(null);
  const bloomRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Initial states ───────────────────────────────────
      gsap.set(orbRef.current,   { scale: 0.35, opacity: 0 });
      gsap.set(line1Ref.current, { opacity: 0, y: 28,  filter: 'blur(10px)' });
      gsap.set(line2Ref.current, { opacity: 0, y: 40,  filter: 'blur(14px)', scale: 0.96 });
      gsap.set(line3Ref.current, { opacity: 0, y: 28,  filter: 'blur(10px)' });
      gsap.set(line4Ref.current, { opacity: 0, y: 52,  filter: 'blur(18px)', scale: 0.95 });
      gsap.set(ruleRef.current,  { scaleX: 0, opacity: 0, transformOrigin: 'center' });
      gsap.set(bloomRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',   /* CHANGE: was +=320% — eliminates ~140vh of dead-air scroll */
          scrub: 2.2,
          pin: true,
        },
      });

      // ── 0.00 → 0.10: Orb materializes from void ─────────
      tl.to(orbRef.current, {
        scale: 1, opacity: 0.42,
        duration: 0.10, ease: 'power2.out',
      }, 0);

      // ── 0.10 → 0.28: First couplet enters ───────────────
      tl.to(line1Ref.current, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.16, ease: 'power3.out',
      }, 0.10);
      tl.to(line2Ref.current, {
        opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
        duration: 0.20, ease: 'power3.out',
      }, 0.22);

      // ── 0.32 → 0.52: Echo fade + second couplet enters ──
      tl.to(line1Ref.current, {
        opacity: 0.11, filter: 'blur(3.5px)',
        duration: 0.12, ease: 'power2.in',
      }, 0.32);
      tl.to(line2Ref.current, {
        opacity: 0.14, filter: 'blur(2.5px)',
        duration: 0.12, ease: 'power2.in',
      }, 0.34);
      tl.to(line3Ref.current, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.16, ease: 'power3.out',
      }, 0.38);
      tl.to(line4Ref.current, {
        opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
        duration: 0.26, ease: 'power3.out',
      }, 0.50);

      // ── 0.54 → 0.68: Legacy holds — ceremony ────────────
      tl.to(line3Ref.current, {
        opacity: 0.11, filter: 'blur(3.5px)',
        duration: 0.10, ease: 'power2.in',
      }, 0.54);
      tl.to(ruleRef.current, {
        scaleX: 1, opacity: 0.65,
        duration: 0.18, ease: 'power2.inOut',
      }, 0.58);
      tl.to(orbRef.current, {
        scale: 1.28, opacity: 0.58,
        duration: 0.18, ease: 'power2.out',
      }, 0.58);

      // ── 0.68 → 0.80: Weighted hold on "Legacy." ─────────
      tl.to({}, { duration: 0.12 }, 0.68);

      // ── 0.80 → 1.00: Cream bloom exit ───────────────────
      tl.to(ruleRef.current, {
        opacity: 0, scaleX: 0.4,
        duration: 0.08, ease: 'power2.in',
      }, 0.80);
      tl.to([line1Ref.current, line2Ref.current, line3Ref.current], {
        opacity: 0, y: -18, filter: 'blur(14px)',
        duration: 0.12, ease: 'power2.in',
      }, 0.81);
      tl.to(line4Ref.current, {
        opacity: 0, scale: 1.04, filter: 'blur(22px)',
        duration: 0.15, ease: 'power2.in',
      }, 0.84);
      tl.to(orbRef.current, {
        scale: 2.8, opacity: 0,
        duration: 0.20, ease: 'power2.in',
      }, 0.82);
      tl.to(bloomRef.current, {
        opacity: 1,
        duration: 0.22, ease: 'power1.inOut',
      }, 0.86);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="statement"
      style={{
        height: '100vh',
        minHeight: '600px',
        background: '#060504',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Hero → Statement bridge ────────────────────────── */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '100px',
        background: 'linear-gradient(to bottom, rgba(6,5,4,0.82) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* ── Film grain texture ────────────────────────────── */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '280px 280px',
        opacity: 0.033,
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── Ambient gold orb ──────────────────────────────── */}
      <div
        ref={orbRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(68vw, 780px)',
          height: 'min(68vw, 780px)',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(197,160,89,0.11)  0%,
            rgba(197,160,89,0.04) 44%,
            transparent           70%
          )`,
          pointerEvents: 'none', zIndex: 0,
          willChange: 'transform, opacity',
        }}
      />

      {/* ── Typography ────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>

        {/* "Not events." */}
        <div ref={line1Ref} style={{ opacity: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.8vw, 3.2rem)',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'rgba(245,240,235,0.30)',
            display: 'block',
            marginBottom: 'clamp(1px, 0.3vw, 4px)',
          }}>Not events.</span>
        </div>

        {/* "Experiences." */}
        <div ref={line2Ref} style={{ opacity: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 6.8vw, 7.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '-0.038em',
            lineHeight: 0.95,
            color: '#C5A059',
            display: 'block',
            marginBottom: 'clamp(18px, 3.2vw, 42px)',
          }}>Experiences.</span>
        </div>

        {/* "Not moments." */}
        <div ref={line3Ref} style={{ opacity: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.8vw, 3.2rem)',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            color: 'rgba(245,240,235,0.30)',
            display: 'block',
            marginBottom: 'clamp(1px, 0.3vw, 4px)',
          }}>Not moments.</span>
        </div>

        {/* "Legacy." */}
        <div ref={line4Ref} style={{ opacity: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 11.5vw, 13.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '-0.048em',
            lineHeight: 0.90,
            color: '#D6B97A',
            display: 'block',
            textShadow: `
              0 0  80px rgba(197,160,89,0.22),
              0 0 160px rgba(197,160,89,0.10),
              0 0 320px rgba(197,160,89,0.04)
            `,
            willChange: 'transform, opacity, filter',
          }}>Legacy.</span>
        </div>

        {/* Gold center rule */}
        <span ref={ruleRef} style={{
          display: 'block',
          width: 'clamp(44px, 5.5vw, 72px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.75), transparent)',
          marginTop: 'clamp(16px, 2.5vw, 26px)',
          opacity: 0,
          transformOrigin: 'center',
        }} />
      </div>

      {/* ── Statement → About: Cream bloom overlay ──────────── */}
      <div
        ref={bloomRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: '#F7F5F1',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #statement * {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}