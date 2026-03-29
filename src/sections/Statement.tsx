/**
 * Statement — Scene 2 (NEW)
 * ─────────────────────────────────────────────────────────────
 * Blueprint: Scene 3 — "Locked Statement"
 *
 * A single powerful line. Full viewport. Near-black.
 * Pinned so the user has to breathe through it.
 *
 * The animation arc:
 *   scroll 0%  → text is invisible, faded out
 *   scroll 25% → text fades in, drifts to centre
 *   scroll 60% → text holds, fully visible
 *   scroll 85% → text scales very slightly, begins fading
 *   scroll 100%→ text gone, section releases
 *
 * The pin creates ~80vh of scroll distance for this scene.
 * Feels like a moment — not a section.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLSpanElement>(null);
  const line2Ref   = useRef<HTMLSpanElement>(null);
  const runeRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Pin the section ────────────────────────────────────── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=80%',          // pin for 80vh of scroll
        pin: true,
        pinSpacing: true,
      });

      /* ── Text arc: fade in → hold → fade out ───────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 1.1,
        },
      });

      // Set initial state
      gsap.set([line1Ref.current, line2Ref.current], {
        y: 28,
        opacity: 0,
        filter: 'blur(6px)',
      });
      gsap.set(runeRef.current, { opacity: 0 });

      tl
        // Fade in (0 → 30% of pin duration)
        .to(runeRef.current, {
          opacity: 0.4,
          duration: 0.25,
          ease: 'none',
        }, 0)
        .to(line1Ref.current, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          ease: 'power2.out',
        }, 0.05)
        .to(line2Ref.current, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.3,
          ease: 'power2.out',
        }, 0.15)

        // Hold (30% → 65% of pin duration — add empty label to pause timeline)
        .to({}, { duration: 0.35 })

        // Fade out (65% → 100%)
        .to(
          [line1Ref.current, line2Ref.current],
          {
            y: -20,
            opacity: 0,
            filter: 'blur(4px)',
            duration: 0.28,
            ease: 'power2.in',
          }
        )
        .to(
          runeRef.current,
          { opacity: 0, duration: 0.22 },
          '<'
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="statement"
      style={{
        height: '100vh',
        background: '#070605',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Faint gold radial glow — centre of attention ───────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(197,160,89,0.06) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Decorative rule ornament above text ────────────────── */}
      <div
        ref={runeRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -120px)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          opacity: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            width: '48px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))',
          }}
        />
        <span
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            color: 'rgba(197,160,89,0.5)',
          }}
        >
          Our Philosophy
        </span>
        <span
          style={{
            display: 'block',
            width: '48px',
            height: '1px',
            background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))',
          }}
        />
      </div>

      {/* ── The statement ──────────────────────────────────────── */}
      <div
        ref={textRef}
        style={{
          textAlign: 'center',
          padding: '0 clamp(32px, 8vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.15em',
        }}
      >
        <span
          ref={line1Ref}
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5.5vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.12,
            letterSpacing: '-0.022em',
            color: 'rgba(248, 244, 238, 0.88)',
          }}
        >
          We don't plan events.
        </span>
        <span
          ref={line2Ref}
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5.5vw, 6rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.12,
            letterSpacing: '-0.022em',
            color: 'var(--color-accent-1)',
          }}
        >
          We craft legacy.
        </span>
      </div>
    </section>
  );
}
