/**
 * Statement — Scene 2 — PREMIUM REBUILD
 * ─────────────────────────────────────────────────────────────
 * BEHAVIOR:
 *   1. User scrolls through Hero (100vh) — Statement outer begins.
 *   2. Statement inner STICKS at the top for 250vh of outer scroll.
 *   3. While stuck: scroll drives a cinematic word-by-word reveal.
 *   4. Hold at full reveal for ~30% of total travel.
 *   5. Slow, breathtaking fade-out + slight scale with blur.
 *   6. Section releases — About section naturally appears below.
 *
 * TRANSITIONS:
 *   - Each word enters from y:+40px through a clip mask (theatrical reveal).
 *   - Gold ornamental rule draws in from center on hold phase.
 *   - Subtle breathing ambient glow behind text.
 *   - Exit: words drift up + blur, glow fades — feels like dissolving into memory.
 *
 * TECH:
 *   - Outer: 300vh height, background: #070605 (no cream seam possible)
 *   - Inner: position sticky, top 0, height 100vh
 *   - GSAP timeline scrub 2.2 — ultra-damped, silky
 */

import { useEffect, useRef } from 'react';
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Individual word refs for theatrical per-word reveal
  const word1Ref = useRef<HTMLSpanElement>(null);  // "We don't"
  const word2Ref = useRef<HTMLSpanElement>(null);  // "plan events."
  const word3Ref = useRef<HTMLSpanElement>(null);  // "We craft"
  const word4Ref = useRef<HTMLSpanElement>(null);  // "legacy."

  const runeRef    = useRef<HTMLDivElement>(null);
  const ruleLeftRef  = useRef<HTMLSpanElement>(null);
  const ruleRightRef = useRef<HTMLSpanElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Initial state ──────────────────────────────────────
      // Each word wrapped in a clip container — overflow hidden on parent
      gsap.set([word1Ref.current, word2Ref.current], {
        y: 52, opacity: 0, filter: 'blur(12px)',
      });
      gsap.set([word3Ref.current, word4Ref.current], {
        y: 52, opacity: 0, filter: 'blur(12px)',
      });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 18 });
      gsap.set(glowRef.current,    { opacity: 0, scale: 0.8 });
      gsap.set(ruleLeftRef.current,  { scaleX: 0, transformOrigin: 'right center' });
      gsap.set(ruleRightRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(runeRef.current,    { opacity: 0 });

      /**
       * Timeline tied to OUTER WRAPPER scroll.
       *   300vh outer - 100vh inner = 200vh active scroll travel.
       *   Phases distribute across that 200vh.
       *   scrub: 2.2 = gorgeously over-damped / buttery
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   2.2,
        },
      });

      tl
        // ── ACT I — AMBIENT GLOW BREATHES IN (0–10%) ──────────
        .to(glowRef.current, {
          opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out',
        }, 0)

        // ── ACT II — EYEBROW (5–18%) ──────────────────────────
        .to(eyebrowRef.current, {
          opacity: 1, y: 0, duration: 0.14, ease: 'power3.out',
        }, 0.05)

        // ── ACT III — LINE 1: "We don't" (10–26%) ─────────────
        .to(word1Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.18,
          ease: 'power4.out',
        }, 0.10)

        // ── ACT IV — LINE 1: "plan events." (18–34%) ──────────
        .to(word2Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.18,
          ease: 'power4.out',
        }, 0.18)

        // ── ACT V — PAUSE — ornamental rule draws in (30–46%) ──
        .to(runeRef.current, { opacity: 0.7, duration: 0.08, ease: 'none' }, 0.29)
        .to(ruleLeftRef.current,  { scaleX: 1, duration: 0.16, ease: 'power2.inOut' }, 0.30)
        .to(ruleRightRef.current, { scaleX: 1, duration: 0.16, ease: 'power2.inOut' }, 0.30)

        // ── ACT VI — LINE 2: "We craft" (38–54%) ──────────────
        .to(word3Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20,
          ease: 'power4.out',
        }, 0.38)

        // ── ACT VII — LINE 2: "legacy." GOLD, delayed (46–64%) ─
        .to(word4Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.22,
          ease: 'power4.out',
        }, 0.46)

        // ── HOLD (64–72%) — empty tween, pure pause ────────────
        .to({}, { duration: 0.08 }, 0.64)

        // ── ACT VIII — BREATHTAKING EXIT (72–100%) ────────────
        // Words drift upward + blur out — cinematic dissolve
        .to([word1Ref.current, word2Ref.current], {
          y: -38, opacity: 0, filter: 'blur(10px)', duration: 0.20, ease: 'power2.in',
        }, 0.72)
        .to([word3Ref.current, word4Ref.current], {
          y: -38, opacity: 0, filter: 'blur(10px)', duration: 0.20, ease: 'power2.in',
        }, 0.76)
        .to([ruleLeftRef.current, ruleRightRef.current], {
          scaleX: 0, duration: 0.14, ease: 'power2.in',
        }, 0.72)
        .to([runeRef.current, eyebrowRef.current], {
          opacity: 0, duration: 0.14, ease: 'power2.in',
        }, 0.72)
        .to(glowRef.current, {
          opacity: 0, scale: 1.4, duration: 0.26, ease: 'power1.in',
        }, 0.74);

    });

    return () => ctx.revert();
  }, []);

  const fontSize = 'clamp(2.6rem, 6.2vw, 7.2rem)';
  const fontStyle: React.CSSProperties = {
    fontFamily:    'var(--font-display)',
    fontWeight:    300,
    fontStyle:     'italic',
    lineHeight:    1.08,
    letterSpacing: '-0.026em',
    display:       'block',
  };

  return (
    /*
     * OUTER WRAPPER — provides 300vh of scroll distance.
     * Background MUST be #070605 — dark all the way through.
     * No GSAP spacer div = no cream gap between Hero and Statement.
     */
    <div
      ref={outerRef}
      style={{
        height:     '300vh',
        position:   'relative',
        background: '#070605',
      }}
    >
      <section
        ref={sectionRef}
        id="statement"
        style={{
          position:       'sticky',
          top:            0,
          height:         '100vh',
          background:     '#070605',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
        }}
      >
        {/* ── AMBIENT GLOW — breathes with the reveal ─────── */}
        <div
          ref={glowRef}
          aria-hidden
          style={{
            position:  'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px', height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(197,160,89,0.055) 0%, transparent 65%)',
            pointerEvents: 'none',
            opacity: 0,
          }}
        />

        {/* ── SUBTLE GRID TEXTURE ────────────────────────── */}
        <div aria-hidden style={{
          position:        'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(197,160,89,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197,160,89,0.015) 1px, transparent 1px)
          `,
          backgroundSize:  '80px 80px',
          pointerEvents:   'none',
          opacity:         1,
        }} />

        {/* ── MAIN TEXT BLOCK ─────────────────────────────── */}
        <div style={{
          textAlign:     'center',
          padding:       '0 clamp(32px, 8vw, 120px)',
          display:       'flex',
          flexDirection: 'column',
          gap:           '0',
          position:      'relative',
          zIndex:        2,
        }}>

          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '20px', marginBottom: 'clamp(28px, 3.5vw, 44px)', opacity: 0,
            }}
          >
            <span style={{ display: 'block', width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.38em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.5)' }}>
              Our Philosophy
            </span>
            <span style={{ display: 'block', width: '48px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
          </div>

          {/* Line 1: "We don't" */}
          <div style={{ overflow: 'hidden' }}>
            <span ref={word1Ref} style={{ ...fontStyle, fontSize, color: 'rgba(248, 244, 238, 0.86)' }}>
              We don't plan events.
            </span>
          </div>

          {/* Ornamental rule between lines — draws in during hold phase */}
          <div
            ref={runeRef}
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '16px',
              margin:         'clamp(14px, 2vw, 22px) 0',
              opacity:        0,
            }}
          >
            <span
              ref={ruleLeftRef}
              style={{
                display:    'block',
                width:      'clamp(60px, 8vw, 100px)',
                height:     '1px',
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65))',
                transformOrigin: 'right center',
              }}
            />
            <span style={{
              display: 'block', width: '4px', height: '4px', borderRadius: '50%',
              background: 'rgba(197,160,89,0.65)',
            }} />
            <span
              ref={ruleRightRef}
              style={{
                display:    'block',
                width:      'clamp(60px, 8vw, 100px)',
                height:     '1px',
                background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.65))',
                transformOrigin: 'left center',
              }}
            />
          </div>

          {/* Line 2: "We craft" + "legacy." */}
          <div style={{ overflow: 'hidden' }}>
            <span ref={word3Ref} style={{ ...fontStyle, fontSize, color: 'rgba(248, 244, 238, 0.86)' }}>
              We craft{' '}
            </span>
            <span ref={word4Ref} style={{ ...fontStyle, fontSize, color: 'var(--color-accent-1)', display: 'inline' }}>
              legacy.
            </span>
          </div>

        </div>

        {/* ── CORNER ORNAMENTS ────────────────────────────── */}
        {(['tl','tr','bl','br'] as const).map((pos) => {
          const styles: Record<string, React.CSSProperties> = {
            tl: { top: '28px', left: '28px' },
            tr: { top: '28px', right: '28px', transform: 'rotate(90deg)' },
            bl: { bottom: '28px', left: '28px', transform: 'rotate(-90deg)' },
            br: { bottom: '28px', right: '28px', transform: 'rotate(180deg)' },
          };
          return (
            <div key={pos} aria-hidden style={{ position: 'absolute', width: '22px', height: '22px', opacity: 0.2, ...styles[pos] }}>
              <svg viewBox="0 0 22 22" fill="none" className="w-full h-full">
                <path d="M2 20 L2 2 L20 2" stroke="#C5A059" strokeWidth="0.8" />
                <circle cx="2" cy="2" r="1.2" fill="#C5A059" opacity="0.7" />
              </svg>
            </div>
          );
        })}

      </section>
    </div>
  );
}