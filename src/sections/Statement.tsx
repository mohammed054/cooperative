import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=85%',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      gsap.set(quoteRef.current, { opacity: 0, y: 32, filter: 'blur(8px)' });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });

      tl.to(quoteRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.35,
        ease: 'power3.out',
      })
        .to(lineRef.current, { scaleX: 1, duration: 0.22, ease: 'power2.out' }, '-=0.08')
        .to({}, { duration: 0.26 })
        .to(quoteRef.current, {
          opacity: 0,
          y: -24,
          filter: 'blur(6px)',
          duration: 0.28,
          ease: 'power2.in',
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="statement" ref={sectionRef} className="statement-scene" data-snap="skip">
      <div className="statement-scene__texture" aria-hidden />
      <div ref={quoteRef} className="statement-quote">
        <span className="eyebrow eyebrow--light">The standard</span>
        <h2>Luxury is not how it looks. It is how little the guest notices the work.</h2>
        <span ref={lineRef} className="statement-quote__line" />
        <p>Private control, public ease, and a room that feels inevitable.</p>
      </div>
    </section>
  );
}
