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
    ScrollTrigger.normalizeScroll(false);

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      if (progressRef.current && limit > 0) {
        progressRef.current.style.width = `${(scroll / limit) * 100}%`;
      }
    });

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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
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
