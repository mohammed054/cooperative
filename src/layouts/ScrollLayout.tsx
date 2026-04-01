/**
 * ScrollLayout — REBUILT
 * ─────────────────────────────────────────────────────────────
 * Fixes over previous version:
 *
 *   ✓ REMOVED snap assist entirely.
 *     The debounced lenis.scrollTo() was firing mid-GSAP-scrub every
 *     180ms and overriding GSAP's scroll position — the source of
 *     the "locked up" feeling on pinned sections.
 *
 *   ✓ Added ScrollTrigger.normalizeScroll(false).
 *     Without this, GSAP tries to normalise native scroll events
 *     at the same time Lenis does — double processing causes drift.
 *
 *   ✓ Lenis lerp dialled to 0.09 (slightly more responsive).
 *
 *   ✓ Progress bar and ticker sync preserved.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface ScrollLayoutProps {
  children: ReactNode;
}

export function ScrollLayout({ children }: ScrollLayoutProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Critical: prevent GSAP from trying to normalise scroll events
    // while Lenis is already handling smooth scroll.
    ScrollTrigger.normalizeScroll(false);

    const lenis = new Lenis({
      lerp:            0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel:     true,
    });

    // Keep GSAP ScrollTrigger in sync with Lenis virtual scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Scroll progress bar (gold, 1.5px, top of viewport)
    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      if (progressRef.current && limit > 0) {
        progressRef.current.style.width = `${(scroll / limit) * 100}%`;
      }
    });

    // Unified RAF — drive Lenis from GSAP's ticker so both are in step
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <>
      {/* Ultra-thin gold progress line */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '1.5px',
          background: 'rgba(197,160,89,0.12)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(to right, rgba(197,160,89,0.5), rgba(197,160,89,1))',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      <div
        id="scroll-root"
        className="relative w-full"
        style={{ background: 'var(--color-bg)', overflowX: 'clip' }}
      >
        {children}
      </div>
    </>
  );
}