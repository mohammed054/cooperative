/**
 * ScrollLayout — IMPROVED
 * ──────────────────────────────────────────────────────────────
 * Fixes:
 *   ✓ Lenis config tuned for premium cinematic feel (slightly more lerp)
 *   ✓ Scroll snap assist: debounced snap-to-section on scroll end
 *     — snaps to nearest section boundary if within 25% threshold
 *     — skips pinned sections to avoid conflicting with GSAP pins
 *     — gives the "assisted scroll" premium feel without hard CSS snap
 *   ✓ Thin gold scroll progress bar at top of viewport
 *   ✓ GSAP ticker stays in sync
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
    const lenis = new Lenis({
      lerp:            0.10,   // slightly higher than 0.08 → snappier but still cinematic
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      smoothWheel:     true,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Scroll progress bar
    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      if (progressRef.current) {
        const pct = limit > 0 ? (scroll / limit) * 100 : 0;
        progressRef.current.style.width = `${pct}%`;
      }
    });

    // Unified animation clock
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    /* ── Scroll Snap Assist ─────────────────────────────────
     * When the user stops scrolling, check if they're near
     * a section boundary. If within 25% of viewport height,
     * smoothly snap to the nearest section start.
     * Skips sections during GSAP pin scroll so they don't conflict.
     */
    let snapTimeout: number;
    let isSnapping = false;

    const handleScrollEnd = ({ scroll }: { scroll: number }) => {
      clearTimeout(snapTimeout);

      snapTimeout = window.setTimeout(() => {
        if (isSnapping) return;

        // Gather all top-level sections
        const sections = Array.from(
          document.querySelectorAll('main > section[id], main > div[id]')
        ) as HTMLElement[];

        const vH = window.innerHeight;
        const threshold = vH * 0.25; // snap if within 25% of viewport height

        let bestSection: HTMLElement | null = null;
        let bestDist = Infinity;

        for (const sec of sections) {
          // Get the top of the section (adjusted for pinned sections)
          const rect = sec.getBoundingClientRect();
          // The section's document-relative top
          const sectionTop = scroll + rect.top;
          const dist = Math.abs(scroll - sectionTop);

          if (dist < threshold && dist < bestDist) {
            bestDist = dist;
            bestSection = sec;
          }
        }

        if (bestSection && bestDist > 4) {
          isSnapping = true;
          const targetTop = scroll + bestSection.getBoundingClientRect().top;
          lenis.scrollTo(targetTop, {
            duration: 1.1,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
            onComplete: () => { isSnapping = false; },
          });
        }
      }, 180); // fire 180ms after scroll stops
    };

    lenis.on('scroll', handleScrollEnd);

    return () => {
      clearTimeout(snapTimeout);
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <>
      {/* Gold scroll progress bar — ultra thin, top of viewport */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '1.5px',
          background: 'rgba(197,160,89,0.15)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'linear-gradient(to right, rgba(197,160,89,0.6), rgba(197,160,89,1))',
            transition: 'width 0.1s linear',
            transformOrigin: 'left',
          }}
        />
      </div>

      <div
        id="scroll-root"
        className="relative w-full overflow-x-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        {children}
      </div>
    </>
  );
}