/**
 * About — Scene 3 — AIR GAP FIX
 * ─────────────────────────────────────────────────────────────
 * FIX: Reduced editorial outer from 300vh to 220vh.
 *   Active scroll = 220 - 100 = 120vh (was 200vh = too much emptiness).
 *   Timeline is re-timed to fill the 120vh travel more completely.
 *
 * FIX: Editorial scene uses a tighter timeline with NO dead zones.
 *   Every phase of the scroll drives visible change.
 *
 * FIX: Dark→light bridge height reduced to 60px (was 80px).
 *
 * ALL existing design preserved: editorial grid, pillars, marquee, CTA.
 */

import { useEffect, useRef } from 'react';
import { motion }        from 'framer-motion';
import { gsap }          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = [
  'MAG Group', 'Emaar Properties', 'DIFC Authority',
  'Dubai Holding', 'Meraas', 'Aldar Properties',
  'MAG Group', 'Emaar Properties', 'DIFC Authority',
  'Dubai Holding', 'Meraas', 'Aldar Properties',
];

function LogoMarquee() {
  return (
    <div style={{
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
    }}>
      <motion.div
        animate={{ x: '-50%' }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(48px,6vw,80px)', whiteSpace: 'nowrap' }}
      >
        {CLIENTS.map((name, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(0.6rem,0.85vw,0.72rem)',
            fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', flexShrink: 0,
          }}>{name}</span>
        ))}
      </motion.div>
    </div>
  );
}

export function About() {
  const sectionRef     = useRef<HTMLElement>(null);
  const imageRef       = useRef<HTMLDivElement>(null);
  const editorialOuter = useRef<HTMLDivElement>(null);
  const eyebrowRef     = useRef<HTMLDivElement>(null);
  const headline1Ref   = useRef<HTMLSpanElement>(null);
  const headline2Ref   = useRef<HTMLSpanElement>(null);
  const goldRuleRef    = useRef<HTMLSpanElement>(null);
  const para1Ref       = useRef<HTMLParagraphElement>(null);
  const para2Ref       = useRef<HTMLParagraphElement>(null);
  const pillar1Ref     = useRef<HTMLDivElement>(null);
  const pillar2Ref     = useRef<HTMLDivElement>(null);
  const pillar3Ref     = useRef<HTMLDivElement>(null);
  const ctaRef         = useRef<HTMLAnchorElement>(null);
  const bgGlowRef      = useRef<HTMLDivElement>(null);
  const marqueeRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Image reveal ──────────────────────────────────────
      if (imageRef.current) {
        gsap.fromTo(imageRef.current,
          { clipPath: 'inset(22% 8% 22% 8%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 82%', end: 'bottom 20%', scrub: 1.6,
            },
          }
        );
        const img = imageRef.current.querySelector('img');
        if (img) {
          gsap.fromTo(img,
            { scale: 1.12, y: '3%' },
            {
              scale: 1.0, y: '-3%', ease: 'none',
              scrollTrigger: {
                trigger: imageRef.current,
                start: 'top bottom', end: 'bottom top', scrub: true,
              },
            }
          );
        }
      }

      // ── Editorial pinned scene ─────────────────────────────
      // OUTER = 220vh (reduced from 300vh — eliminates air gap)
      // INNER = 100svh sticky
      // Active scroll = 120vh
      // scrub: 1.8 — over-damped, premium
      if (editorialOuter.current) {

        gsap.set(eyebrowRef.current,   { y: 28,  opacity: 0, filter: 'blur(5px)' });
        gsap.set(headline1Ref.current, { y: 36,  opacity: 0, filter: 'blur(6px)' });
        gsap.set(headline2Ref.current, { y: 36,  opacity: 0, filter: 'blur(6px)', scale: 0.97 });
        gsap.set(goldRuleRef.current,  { scaleX: 0, opacity: 0, transformOrigin: 'left center' });
        gsap.set(para1Ref.current,     { y: 28,  opacity: 0, filter: 'blur(4px)' });
        gsap.set(para2Ref.current,     { y: 28,  opacity: 0, filter: 'blur(4px)' });
        gsap.set(pillar1Ref.current,   { y: 44,  opacity: 0, filter: 'blur(5px)' });
        gsap.set(pillar2Ref.current,   { y: 44,  opacity: 0, filter: 'blur(5px)' });
        gsap.set(pillar3Ref.current,   { y: 44,  opacity: 0, filter: 'blur(5px)' });
        gsap.set(ctaRef.current,       { y: 18,  opacity: 0 });
        gsap.set(bgGlowRef.current,    { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: editorialOuter.current,
            start:   'top top',
            end:     'bottom bottom',
            scrub:   1.8,
          },
        });

        // 10 total duration units mapped across 120vh active scroll.
        // No dead zones — every unit drives a visible change.
        tl
          .to(bgGlowRef.current,   { opacity: 1, duration: 0.15, ease: 'none' }, 0)
          .to(eyebrowRef.current,  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power2.out' }, 0.05)
          .to(headline1Ref.current, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.25, ease: 'power3.out' }, 0.15)
          .to(headline2Ref.current, { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1.0, duration: 0.28, ease: 'power3.out' }, 0.24)
          .to(goldRuleRef.current,  { scaleX: 1, opacity: 0.7, duration: 0.22, ease: 'power2.inOut' }, 0.36)
          .to(para1Ref.current,    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' }, 0.44)
          .to(para2Ref.current,    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power2.out' }, 0.54)
          .to(pillar1Ref.current,  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power3.out' }, 0.62)
          .to(pillar2Ref.current,  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power3.out' }, 0.72)
          .to(pillar3Ref.current,  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.20, ease: 'power3.out' }, 0.82)
          .to(ctaRef.current,      { y: 0, opacity: 1, duration: 0.16, ease: 'power2.out' }, 0.92);
      }

      // ── Marquee fade ──────────────────────────────────────
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          opacity: 0, duration: 1.0, ease: 'power2.out',
          scrollTrigger: { trigger: marqueeRef.current, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: 'relative', background: 'var(--color-bg)', overflow: 'clip' }}
    >
      {/* Dark → light bridge — 60px soft gradient */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '60px',
        background: 'linear-gradient(to bottom, rgba(7,6,5,0.55) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* Subtle gold grid texture */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(197,160,89,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197,160,89,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── PART 1 — IMAGE REVEAL ─────────────────────────── */}
      <div style={{ padding: 'clamp(80px, 9vw, 120px) clamp(20px, 4vw, 64px) 0', position: 'relative', zIndex: 1 }}>
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
        >
          <span style={{ display: 'block', height: '1px', width: '36px', background: 'var(--color-accent-1)', opacity: 0.75 }} />
          <span style={{ fontSize: '0.66rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--color-accent-1)' }}>
            About Ghaim
          </span>
        </motion.div>

        <div ref={imageRef} style={{ width: '100%', height: 'clamp(280px, 48vw, 620px)', overflow: 'hidden', position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2000&auto=format&fit=crop&q=85"
            alt="GHAIM luxury event — grand ballroom setup"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(247,245,241,0.60) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: 'rgba(197,160,89,0.7)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.65)' }}>
              Atlantis The Palm · 2024
            </span>
          </div>
        </div>
      </div>

      {/* ── PART 2 — PINNED EDITORIAL ─────────────────────────
          220vh outer (reduced from 300vh — fixes air gap)
          100svh sticky inner
          Active scroll = 120vh
      ───────────────────────────────────────────────────── */}
      <div ref={editorialOuter} style={{ height: '220vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100svh', minHeight: '600px',
          overflow: 'hidden', background: 'var(--color-bg)',
          display: 'flex', alignItems: 'center',
        }}>
          <div ref={bgGlowRef} aria-hidden style={{
            position: 'absolute', top: '40%', left: '0%',
            width: '55%', height: '120%',
            background: 'radial-gradient(ellipse at 30% 50%, rgba(197,160,89,0.055) 0%, transparent 65%)',
            pointerEvents: 'none', opacity: 0,
          }} />

          <div
            className="about-editorial-scene"
            style={{
              position: 'relative', zIndex: 1, width: '100%',
              padding: '0 clamp(20px, 5vw, 80px)',
              display: 'grid', gridTemplateColumns: '1fr',
              gap: 'clamp(40px, 5vw, 80px)', alignItems: 'start',
            }}
          >
            {/* LEFT: Headline */}
            <div className="about-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div ref={eyebrowRef} style={{ display: 'flex', alignItems: 'center', gap: '14px', opacity: 0 }}>
                <span style={{ display: 'block', height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.7 }} />
                <span style={{ fontSize: '0.64rem', letterSpacing: '0.32em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--color-accent-1)' }}>Our Approach</span>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5.2vw, 5.8rem)', fontWeight: 300, lineHeight: 1.02, letterSpacing: '-0.024em', color: 'var(--color-text)' }}>
                <span ref={headline1Ref} style={{ display: 'block', opacity: 0 }}>Where Vision Meets</span>
                <span ref={headline2Ref} style={{ display: 'block', opacity: 0, fontStyle: 'italic', color: 'var(--color-accent-1)' }}>Flawless Execution.</span>
              </h2>

              <span ref={goldRuleRef} style={{
                display: 'block', width: 'clamp(40px, 5vw, 64px)', height: '1px',
                background: 'linear-gradient(to right, var(--color-accent-1), transparent)',
                opacity: 0, transformOrigin: 'left center',
              }} />
            </div>

            {/* RIGHT: Content phases */}
            <div className="about-right-col" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 36px)' }}>
              <p ref={para1Ref} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.875rem, 1.15vw, 0.98rem)', fontWeight: 300, lineHeight: 1.88, color: 'var(--color-text-mid)', maxWidth: '500px', opacity: 0 }}>
                GHAIM has spent over a decade shaping the most prestigious corporate events across the Gulf.
                We work exclusively with organisations that demand the highest standards — in venue, in service, in lasting impression.
              </p>
              <p ref={para2Ref} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.875rem, 1.15vw, 0.98rem)', fontWeight: 300, lineHeight: 1.88, color: 'var(--color-text-muted)', maxWidth: '460px', opacity: 0 }}>
                Our approach is quiet, deliberate, and precise. We do not measure success in headcount —
                we measure it in the conversations that happen the day after.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 24px)' }}>
                {[
                  { ref: pillar1Ref, n: '01', title: 'A quiet approach.', body: "We don't seek attention for ourselves. The event is the statement. Our role is invisible architecture — the reason everything feels inevitable." },
                  { ref: pillar2Ref, n: '02', title: 'Precision over performance.', body: "Execution is not measured in headcount or decibels. It's measured in the quality of conversation the morning after." },
                  { ref: pillar3Ref, n: '03', title: 'Legacy over landmark.', body: "Any venue can impress once. We design experiences that compound — that become reference points in the memory of everyone in the room." },
                ].map(({ ref, n, title, body }) => (
                  <div key={n} ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '22px', borderTop: '1px solid var(--color-accent-3)', opacity: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>{n}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 1.55vw, 1.3rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em', color: 'var(--color-text)' }}>{title}</span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.82rem, 1vw, 0.88rem)', fontWeight: 300, lineHeight: 1.82, color: 'var(--color-text-muted)', maxWidth: '420px' }}>{body}</p>
                  </div>
                ))}
              </div>

              <motion.a
                ref={ctaRef}
                href="#work"
                className="flex items-center gap-3"
                style={{
                  fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)',
                  width: 'fit-content', opacity: 0,
                  position: 'relative', paddingBottom: '3px', textDecoration: 'none',
                }}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span style={{ position: 'absolute', bottom: 0, left: 0, height: '1px', background: 'var(--color-accent-1)', transformOrigin: 'left center' }}
                  initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.05 }} />
                <span>View Our Work</span>
                <motion.span style={{ display: 'flex', alignItems: 'center' }} whileHover={{ x: 3 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                    <path d="M1 5h18M14 1l5 4-5 4" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </motion.a>
            </div>
          </div>
        </div>

        <style>{`
          .about-editorial-scene { grid-template-columns: 1fr !important; }
          @media (min-width: 900px) {
            .about-editorial-scene { grid-template-columns: 45fr 55fr !important; align-items: center !important; }
          }
        `}</style>
      </div>

      {/* ── PART 3 — CLIENT MARQUEE ───────────────────────── */}
      <div ref={marqueeRef} style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--color-accent-3)', borderBottom: '1px solid var(--color-accent-3)',
        padding: 'clamp(16px, 2vw, 22px) 0', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', left: 'clamp(20px, 4vw, 64px)', top: '50%', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--color-bg)', paddingRight: '12px' }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Trusted by</span>
          <span style={{ display: 'block', width: '32px', height: '1px', background: 'linear-gradient(to right, rgba(197,160,89,0.5), transparent)' }} />
        </div>
        <div style={{ paddingLeft: 'clamp(120px, 13vw, 180px)' }}>
          <LogoMarquee />
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .about-editorial-scene * { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}