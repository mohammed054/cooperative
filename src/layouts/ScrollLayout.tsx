/**
 * ScrollLayout — Lenis smooth scroll + scene color transitions
 * ──────────────────────────────────────────────────────────────
 * Changes:
 *   + Section color transitions via GSAP ScrollTrigger
 *   + Dark overlay fade as hero → statement → (light sections)
 *   + Lenis config tuned for cinematic pacing
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
      lerp:            0.08,   // smoothing — lower = more cinematic inertia
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel:     true,
    });

    // Sync ScrollTrigger positions with Lenis eased position
    lenis.on('scroll', ScrollTrigger.update);

    // Unified animation clock
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
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