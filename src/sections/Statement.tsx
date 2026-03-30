/**
 * Statement — Scene 2  (WHITE GAP FIX)
 * ─────────────────────────────────────────────────────────────
 * ROOT CAUSE OF WHITE GAP:
 *   Previous approach used GSAP ScrollTrigger.create({ pin: true, pinSpacing: true }).
 *   GSAP inserts a spacer div (100vh tall, body background = CREAM) into the DOM
 *   between the Statement section and the rest of the page.
 *   This cream spacer is the white gap visible between Hero and Statement content.
 *
 * FIX: Replace GSAP pin with CSS sticky.
 *   Outer wrapper = 180vh tall, background: #070605 (DARK — no cream spacer possible)
 *   Inner section  = position: sticky; top: 0; height: 100vh
 *   GSAP timeline  = triggers on outer wrapper (start: top top → end: bottom bottom)
 *   Active scroll  = 180vh - 100vh = 80vh of pin travel. IDENTICAL to before.
 *
 * RESULT: No DOM spacer. No cream gap. Dark background all the way through.
 *
 * TRANSITION:
 *   Hero (dark video, 100svh) → Statement outer (dark, 180vh) → About (cream)
 *   Visually seamless. The transition to cream is handled by About's own gradient bridge.
 *
 * ANIMATION:
 *   Scrub increased to 1.8 for ultra-smooth, damped feel.
 *   Phase rhythm: 0–22% fade in → 22–70% hold → 70–100% fade out
 */

import { useEffect, useRef } from 'react';
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const outerRef   = useRef<HTMLDivElement>(null);   /* 180vh scroll wrapper */
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLSpanElement>(null);
  const line2Ref   = useRef<HTMLSpanElement>(null);
  const runeRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Initial invisible state */
      gsap.set([line1Ref.current, line2Ref.current], {
        y: 32, opacity: 0, filter: 'blur(7px)',
      });
      gsap.set(runeRef.current, { opacity: 0 });

      /*
       * Timeline tied to OUTER WRAPPER scroll.
       *   trigger: outerRef  (180vh)
       *   start:   'top top'      → when outer wrapper top hits viewport top
       *   end:     'bottom bottom' → when outer wrapper bottom hits viewport bottom
       *   Active scroll range = 180vh - 100vh = 80vh
       *
       * Scrub 1.8 = beautifully over-damped, premium feel.
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1.8,
        },
      });

      tl
        /* ── Fade in (0–22%) ───────────────────────────────── */
        .to(runeRef.current, {
          opacity: 0.45, duration: 0.18, ease: 'none',
        }, 0)
        .to(line1Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.24, ease: 'power2.out',
        }, 0.06)
        .to(line2Ref.current, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.24, ease: 'power2.out',
        }, 0.14)

        /* ── Hold (22–70%) — empty duration = pause ─────────── */
        .to({}, { duration: 0.46 })

        /* ── Fade out (70–100%) ─────────────────────────────── */
        .to([line1Ref.current, line2Ref.current], {
          y: -22, opacity: 0, filter: 'blur(5px)', duration: 0.26, ease: 'power2.in',
        })
        .to(runeRef.current, { opacity: 0, duration: 0.20 }, '<');

    });

    return () => ctx.revert();
  }, []);

  return (
    /*
     * OUTER WRAPPER — the scroll distance provider.
     * MUST have background: #070605 so NO cream body bg shows
     * through it as the user scrolls past.
     * This is what killed the white gap: the wrapper's dark bg
     * replaces GSAP's cream spacer entirely.
     */
    <div
      ref={outerRef}
      style={{
        height:     '180vh',
        position:   'relative',
        background: '#070605',   /* dark — critical for seamless transition */
      }}
    >
      <section
        ref={sectionRef}
        id="statement"
        style={{
          position:        'sticky',
          top:             0,
          height:          '100vh',
          background:      '#070605',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          overflow:        'hidden',
        }}
      >
        {/* Faint gold radial glow */}
        <div aria-hidden style={{
          position:     'absolute',
          top:          '50%', left: '50%',
          transform:    'translate(-50%, -50%)',
          width:        '700px', height: '400px',
          borderRadius: '50%',
          background:   'radial-gradient(ellipse, rgba(197,160,89,0.065) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative rule ornament */}
        <div
          ref={runeRef}
          aria-hidden
          style={{
            position:   'absolute',
            top:        '50%', left: '50%',
            transform:  'translate(-50%, -120px)',
            display:    'flex',
            alignItems: 'center',
            gap:        '20px',
            opacity:    0,
          }}
        >
          <span style={{ display: 'block', width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
          <span style={{
            fontSize: '0.55rem', letterSpacing: '0.38em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.5)',
          }}>Our Philosophy</span>
          <span style={{ display: 'block', width: '48px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
        </div>

        {/* The statement — two lines */}
        <div style={{
          textAlign: 'center',
          padding:   '0 clamp(32px, 8vw, 120px)',
          display:   'flex', flexDirection: 'column', gap: '0.12em',
        }}>
          <span
            ref={line1Ref}
            style={{
              display:       'block',
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(2.2rem, 5.5vw, 6rem)',
              fontWeight:    300,
              fontStyle:     'italic',
              lineHeight:    1.12,
              letterSpacing: '-0.022em',
              color:         'rgba(248, 244, 238, 0.88)',
            }}
          >
            We don't plan events.
          </span>
          <span
            ref={line2Ref}
            style={{
              display:       'block',
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(2.2rem, 5.5vw, 6rem)',
              fontWeight:    300,
              fontStyle:     'italic',
              lineHeight:    1.12,
              letterSpacing: '-0.022em',
              color:         'var(--color-accent-1)',
            }}
          >
            We craft legacy.
          </span>
        </div>
      </section>
    </div>
  );
}
