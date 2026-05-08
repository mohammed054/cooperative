import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BASE_PATH } from '@/utils/basePath';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.95,
            ease: 'power2.inOut',
            onComplete: () => {
              document.body.style.overflow = '';
              onComplete();
            },
          });
        },
      });

      gsap.set([logoRef.current, wordmarkRef.current, taglineRef.current], { opacity: 0, y: 14 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left' });

      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' }, '-=0.55')
        .to(lineRef.current, { scaleX: 1, duration: 0.68, ease: 'power2.inOut' }, '-=0.38')
        .to(barRef.current, { scaleX: 1, duration: 1.55, ease: 'power2.inOut' }, '-=0.2')
        .to(counter, {
          val: 100,
          duration: 1.55,
          ease: 'power2.inOut',
          onUpdate() {
            if (countRef.current) countRef.current.textContent = `${Math.round(counter.val)}`;
          },
        }, '<')
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=1.05')
        .to({}, { duration: 0.32 });
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen">
      <div className="loading-screen__brand">
        <img ref={logoRef} src={`${BASE_PATH}logo.webp`} alt="GHAIM" />
        <div ref={lineRef} className="loading-screen__rule" />
        <span ref={wordmarkRef}>GHAIM</span>
      </div>

      <div className="loading-screen__progress">
        <div>
          <div ref={barRef} />
        </div>
        <p>
          <span ref={countRef}>0</span>
          <span>%</span>
        </p>
      </div>

      <span ref={taglineRef} className="loading-screen__tagline">
        Private Event Command
      </span>
    </div>
  );
}
