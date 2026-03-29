/**
 * LoadingScreen — Premium preloader
 * ─────────────────────────────────
 * Dark screen → logo fades in → gold bar sweeps → count → dissolves
 * Locks scroll during load. Triggers onComplete when done.
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

  useEffect(() => {
    // Lock scroll during load
    document.body.style.overflow = 'hidden';

    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          // Dissolve the loading screen
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.85,
            ease: 'power2.inOut',
            onComplete: () => {
              document.body.style.overflow = '';
              onComplete();
            },
          });
        },
      });

      // Initial states
      gsap.set([logoRef.current, wordmarkRef.current], { opacity: 0, y: 12 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left' });

      tl
        // Logo slides up
        .to(logoRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        })
        // Wordmark
        .to(wordmarkRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.6')
        // Separator line
        .to(lineRef.current, {
          scaleX: 1,
          duration: 0.7,
          ease: 'power2.inOut',
        }, '-=0.4')
        // Progress bar sweeps
        .to(barRef.current, {
          scaleX: 1,
          duration: 1.6,
          ease: 'power2.inOut',
        }, '-=0.2')
        // Counter animates
        .to(counter, {
          val: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate() {
            if (countRef.current) {
              countRef.current.textContent = `${Math.round(counter.val)}`;
            }
          },
        }, '<')
        // Hold
        .to({}, { duration: 0.35 });
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#070605',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}
    >
      {/* ── Faint gold radial bloom ──── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(197,160,89,0.055) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Brand mark ──────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <img
          ref={logoRef}
          src="/logo.webp"
          alt="GHAIM"
          style={{
            width: 'clamp(56px, 8vw, 80px)',
            height: 'auto',
            opacity: 0,
          }}
        />

        {/* Separator */}
        <div
          ref={lineRef}
          style={{
            width: '36px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65), transparent)',
          }}
        />

        <span
          ref={wordmarkRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            opacity: 0,
          }}
        >
          GHAIM
        </span>
      </div>

      {/* ── Progress bar ─────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end', width: 'clamp(140px, 20vw, 200px)' }}>
        {/* Track */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(197,160,89,0.15)',
            overflow: 'hidden',
          }}
        >
          <div
            ref={barRef}
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(197,160,89,0.5), var(--color-accent-1))',
            }}
          />
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span
            ref={countRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              color: 'rgba(197,160,89,0.55)',
              fontWeight: 300,
            }}
          >
            0
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.5rem',
              letterSpacing: '0.04em',
              color: 'rgba(197,160,89,0.35)',
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* ── Bottom tagline ───────────── */}
      <span
        style={{
          position: 'absolute',
          bottom: '36px',
          fontFamily: 'var(--font-body)',
          fontSize: '0.55rem',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.15)',
          fontWeight: 300,
        }}
      >
        Luxury Event Management
      </span>
    </div>
  );
}