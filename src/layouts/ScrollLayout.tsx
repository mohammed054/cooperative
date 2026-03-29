/**
 * ScrollLayout — Root scroll container
 * ─────────────────────────────────────
 * Wires Lenis smooth scroll into the GSAP ticker so ScrollTrigger
 * and Lenis share a single clock. Every scroll-driven animation in
 * every child section inherits this automatically.
 *
 * HOW IT WORKS:
 *   1. Lenis intercepts wheel/touch events and eases the scroll position
 *   2. gsap.ticker drives Lenis.raf() so both systems stay in lock-step
 *   3. lenis.on('scroll', ScrollTrigger.update) keeps ScrollTrigger's
 *      internal position synced to the eased position — not the raw one
 *
 * INSTALL (if not already in package.json):
 *   npm i lenis
 */

import { useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface ScrollLayoutProps {
  children: ReactNode;
}

export function ScrollLayout({ children }: ScrollLayoutProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,           // smoothing factor (lower = more inertia)
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    // Keep ScrollTrigger positions in sync with Lenis-eased scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis through the GSAP ticker — unified animation clock
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);

    // Prevent GSAP from compensating for "missed frames" (conflicts with Lenis)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <div
      id="scroll-root"
      className="relative w-full overflow-x-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {children}
    </div>
  );
}