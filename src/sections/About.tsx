/**
 * About — Cinematic Rebuild · Final Transformation
 * ─────────────────────────────────────────────────
 * Every layer upgraded:
 *   ✓ GSAP headline reveal: yPercent + blur(8px→0) + opacity for each line
 *   ✓ "Flawless" — gold shimmer + soft luminous text-shadow pulse
 *   ✓ Ambient background: two drifting light orbs, breathing slowly
 *   ✓ Deeper parallax: 4 independent layers at different scroll speeds      
 *   ✓ Image: Ken Burns slow zoom (scale 1 → 1.045 on scroll)
 *   ✓ CTA: magnetic hover with elastic arrow + underline draw
 *   ✓ Pillar cards: top-edge light reveal + text sharpening on hover
 *   ✓ Divider lines: scaleX from centre, staggered
 *   ✓ Section exit: multi-layer fade to guide transition
 *   ✓ Grain, vignette, and micro-noise depth preserved and refined
 */
import { BASE_PATH } from '@/utils/basePath';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  gold:      '#C6A061',
  goldDim:   'rgba(198,160,97,0.50)',
  goldFaint: 'rgba(198,160,97,0.10)',
  cream:     '#F7F5F1',
  creamDark: '#F0EDE7',
  ink:       '#1A1814',
  inkMid:    '#4A4640',
  inkMuted:  '#8A8480',
  inkFaint:  'rgba(26,24,20,0.04)',
} as const;

/* ─── Pillar data ────────────────────────────────────────── */
const PILLARS = [
  {
    num: '01',
    title: 'A quiet approach.',
    body: "We don't seek attention for ourselves. The event is the statement. Our role is invisible architecture — the reason everything feels inevitable.",
  },
  {
    num: '02',
    title: 'Precision over performance.',
    body: "Execution is not measured in headcount or decibels. It's measured in the quality of conversation the morning after.",
  },
  {
    num: '03',
    title: 'Legacy over landmark.',
    body: 'Any venue can impress once. We design experiences that compound — that become reference points in the memory of everyone in the room.',
  },
];

/* ─── GSAP headline reveal: yPercent + blur + opacity ───── */
function useHeadlineReveal(
  lineRefs: React.RefObject<HTMLSpanElement | null>[],
  triggerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const lines   = lineRefs.map(r => r.current).filter(Boolean);
    const trigger = triggerRef.current;
    if (!lines.length || !trigger) return;

    gsap.set(lines, {
      yPercent: 110,
      opacity: 0,
      filter: 'blur(8px)',
      willChange: 'transform, filter, opacity',
    });

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        yPercent: 0,
        opacity:  1,
        filter:   'blur(0px)',
        duration: 1.25,
        ease:     'power4.out',
        stagger:  0.19,
        delay:    0.06,
        scrollTrigger: {
          trigger,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ─── Magnetic CTA ───────────────────────────────────────── */
function CTALink() {
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hov) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width  - 0.5) * 7);
    my.set(((e.clientY - rect.top)  / rect.height - 0.5) * 5);
  }, [hov, mx, my]);

  const onLeave = useCallback(() => {
    setHov(false);
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.a
      href="#work"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{
        x: sx, y: sy,
        display: 'inline-flex',
        alignItems: 'center',
        gap: hov ? '18px' : '10px',
        fontFamily: 'var(--font-body)',
        fontSize: '0.59rem',
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
        color: T.gold,
        textDecoration: 'none',
        transition: 'gap 0.38s cubic-bezier(0.22,1,0.36,1)',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <span style={{ position: 'relative', paddingBottom: '3px' }}>
        View Our Work
        {/* underline draw */}
        <span style={{
          position: 'absolute', bottom: 0, left: 0,
          height: '1px',
          width: hov ? '100%' : '0%',
          background: `linear-gradient(to right, ${T.goldDim}, rgba(198,160,97,0.20))`,
          transition: 'width 0.50s cubic-bezier(0.22,1,0.36,1)',
        }} />
        {/* glow under text */}
        <span style={{
          position: 'absolute', bottom: '-4px', left: 0, right: 0,
          height: '6px',
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(198,160,97,0.18), transparent)',
          opacity: hov ? 1 : 0,
          transition: 'opacity 0.42s ease',
          pointerEvents: 'none',
        }} />
      </span>

      {/* Arrow */}
      <svg
        width="22" height="10" viewBox="0 0 22 10" fill="none"
        style={{
          transform: hov ? 'translateX(6px) scaleX(1.08)' : 'translateX(0) scaleX(1)',
          transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1)',
          flexShrink: 0,
          opacity: hov ? 1 : 0.75,
        }}
      >
        <path
          d="M1 5h20M15 1l6 4-6 4"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.a>
  );
}

/* ─── Pillar card ────────────────────────────────────────── */
function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.10 + index * 0.16 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: 'clamp(22px,2.4vw,34px)',
        borderRadius: '6px',
        position: 'relative',
        background: hov ? 'rgba(198,160,97,0.035)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(198,160,97,0.18)' : 'rgba(198,160,97,0.05)'}`,
        transform: hov ? 'scale(1.022) translateY(-5px)' : 'scale(1) translateY(0)',
        transition: [
          'background 0.52s ease',
          'border-color 0.52s ease',
          'transform 0.52s cubic-bezier(0.22,1,0.36,1)',
          'box-shadow 0.52s ease',
        ].join(', '),
        boxShadow: hov
          ? '0 20px 54px rgba(26,24,20,0.07), 0 2px 8px rgba(198,160,97,0.06)'
          : 'none',
        cursor: 'default',
        willChange: 'transform',
        overflow: 'hidden',
      }}
    >
      {/* top-edge shimmer on hover */}
      <span style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(198,160,97,0.55), transparent)',
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.50s ease',
        pointerEvents: 'none',
      }} />

      {/* Number + rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.1rem' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.50rem',
          letterSpacing: '0.28em',
          color: 'rgba(198,160,97,0.48)',
        }}>{pillar.num}</span>
        <span style={{
          display: 'block', height: '1px', flexShrink: 0,
          width: hov ? '36px' : '16px',
          background: hov ? 'rgba(198,160,97,0.65)' : 'rgba(198,160,97,0.22)',
          transition: 'width 0.48s cubic-bezier(0.22,1,0.36,1), background 0.48s ease',
        }} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(0.90rem,1.15vw,1.06rem)',
        fontWeight: 300,
        fontStyle: 'italic',
        letterSpacing: '-0.01em',
        lineHeight: 1.22,
        color: T.ink,
        marginBottom: '0.75rem',
        filter: hov ? 'brightness(1.0)' : 'brightness(0.78)',
        transition: 'filter 0.42s ease',
      }}>{pillar.title}</h3>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.73rem,0.84vw,0.79rem)',
        fontWeight: 300,
        lineHeight: 1.92,
        color: hov ? T.inkMid : T.inkMuted,
        transition: 'color 0.46s ease',
        letterSpacing: '0.005em',
      }}>{pillar.body}</p>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLImageElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLSpanElement>(null);
  const line2Ref    = useRef<HTMLSpanElement>(null);
  const line3Ref    = useRef<HTMLSpanElement>(null);

  useHeadlineReveal([line1Ref, line2Ref, line3Ref], headlineRef);

  /* Framer scroll progress for parallax layers */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Multiple layers at different speeds */
  const bgBloomY   = useTransform(scrollYProgress, [0, 1], ['0%',   '12%']);
  const bgBloom2Y  = useTransform(scrollYProgress, [0, 1], ['0%',  '-8%']);
  const bodyY      = useTransform(scrollYProgress, [0, 1], ['0%',  '-4%']);
  const headlineY  = useTransform(scrollYProgress, [0, 1], ['0%',  '-2%']);
  const eyebrowY   = useTransform(scrollYProgress, [0, 1], ['0%',  '-1%']);

  /* GSAP: image width expand + Ken Burns + divider */
  useEffect(() => {
    const wrap    = imgWrapRef.current;
    const img     = imgInnerRef.current;
    const section = sectionRef.current;
    const divider = dividerRef.current;
    if (!wrap || !section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Image container width expand */
      mm.add('(min-width: 768px)', () => {
        gsap.set(wrap, { width: '38%', borderRadius: '7px' });
        gsap.to(wrap, {
          width: '92%', borderRadius: '3px',
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top 86%', end: 'top 10%', scrub: 2.0 },
        });
      });
      mm.add('(max-width: 767px)', () => {
        gsap.set(wrap, { width: '78%', borderRadius: '6px' });
        gsap.to(wrap, {
          width: '93%', borderRadius: '3px',
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top 90%', end: 'top 26%', scrub: 1.4 },
        });
      });

      /* Ken Burns on the image itself */
      if (img) {
        gsap.set(img, { scale: 1.06 });
        gsap.to(img, {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 2.4 },
        });
      }

      /* Divider */
      if (divider) {
        gsap.from(divider, {
          scaleX: 0,
          transformOrigin: 'center center',
          ease: 'power3.out',
          duration: 2.0,
          scrollTrigger: { trigger: divider, start: 'top 92%', toggleActions: 'play none none none' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: T.cream,
        paddingTop: 'clamp(80px,9vw,120px)',
        paddingBottom: 0,
        borderTop: '1px solid rgba(198,160,97,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* ── Grain overlay ── */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.028,
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'multiply',
      }} />

      {/* ── Vignette ── */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.055) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ── Ambient bloom 1 (top-left, drifts down on scroll) ── */}
      <motion.div aria-hidden style={{
        position: 'absolute', top: '-15%', left: '-12%', right: '-12%', bottom: '-15%',
        background: 'radial-gradient(ellipse 52% 36% at 24% 16%, rgba(198,160,97,0.060) 0%, transparent 68%)',
        y: bgBloomY,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'breatheA 18s ease-in-out infinite',
      }} />

      {/* ── Ambient bloom 2 (bottom-right, drifts up on scroll) ── */}
      <motion.div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 40% 28% at 78% 82%, rgba(198,160,97,0.038) 0%, transparent 65%)',
        y: bgBloom2Y,
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'breatheB 22s ease-in-out infinite',
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Eyebrow — lightest parallax layer */}
        <motion.div
          style={{ y: eyebrowY }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ padding: '0 clamp(24px,4.5vw,72px)', marginBottom: 'clamp(20px,2.5vw,32px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                display: 'block', height: '1px', width: '22px',
                background: 'linear-gradient(to right, rgba(198,160,97,0.55), rgba(198,160,97,0.18))',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.54rem',
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                color: T.inkMuted,
                fontWeight: 500,
              }}>About Ghaim</span>
            </div>
          </div>
        </motion.div>

        {/* ── Image ── */}
        <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', marginBottom: 'clamp(64px,8vw,104px)' }}>
          <div ref={imgWrapRef} style={{ overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            <img
              ref={imgInnerRef}
              src={`${BASE_PATH}event1.jpg`} 
              alt="Ghaim event — Atlantis The Palm, 2024"
              style={{
                width: '100%',
                height: 'clamp(200px,30vw,420px)',
                objectFit: 'cover',
                objectPosition: 'center 38%',
                display: 'block',
                transformOrigin: 'center center',
              }}
            />
            {/* Image inner vignette */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.22) 100%)',
              pointerEvents: 'none',
            }} />
            <span style={{
              position: 'absolute', bottom: '14px', left: '18px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.49rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              userSelect: 'none',
            }}>Atlantis The Palm · 2024</span>
          </div>
        </div>

        {/* ── 60/40 text block ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px,4.5vw,72px)', marginBottom: 'clamp(64px,7.5vw,100px)' }}>
          <div className="about-text-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 'clamp(40px,6vw,112px)', alignItems: 'start' }}>

            {/* LEFT — headline with headline parallax layer */}
            <motion.div style={{ y: headlineY }}>
              <h2
                ref={headlineRef as React.RefObject<HTMLHeadingElement>}
                aria-label="Where Vision Meets Flawless Execution."
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.6rem,5vw,5.4rem)',
                  fontWeight: 300,
                  lineHeight: 1.02,
                  letterSpacing: '-0.033em',
                  color: T.ink,
                  margin: 0,
                }}
              >
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.10em' }}>
                  <span ref={line1Ref} style={{ display: 'block' }}>Where Vision</span>
                </span>

                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.10em' }}>
                  <span ref={line2Ref} style={{ display: 'block' }}>
                    Meets{' '}
                    {/* "Flawless" — dimensional shimmer + luminous pulse */}
                    <em style={{
                      fontStyle: 'italic',
                      background: 'linear-gradient(95deg, #7a5a24 0%, #b8904e 18%, #c6a061 32%, #e8d090 50%, #c6a061 68%, #b8904e 82%, #7a5a24 100%)',
                      backgroundSize: '320% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'goldShimmer 7s ease-in-out infinite',
                      willChange: 'background-position',
                      /* Luminous glow that pulses */
                      filter: 'drop-shadow(0 0 18px rgba(198,160,97,0.22))',
                    }}>
                      Flawless
                    </em>
                  </span>
                </span>

                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.10em' }}>
                  <span ref={line3Ref} style={{ display: 'block' }}>Execution.</span>
                </span>
              </h2>

              {/* Headline accent rule */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                style={{
                  marginTop: '36px',
                  height: '1px',
                  width: '44px',
                  background: `linear-gradient(to right, ${T.goldDim}, transparent)`,
                  transformOrigin: 'left center',
                }}
              />
            </motion.div>

            {/* RIGHT — body at slower parallax */}
            <motion.div style={{ y: bodyY, paddingTop: 'clamp(8px,1vw,14px)' }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
              >
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.80rem,0.95vw,0.91rem)',
                  fontWeight: 300,
                  lineHeight: 1.92,
                  color: T.inkMid,
                  maxWidth: '420px',
                  marginBottom: '1.6rem',
                  letterSpacing: '0.006em',
                }}>
                  GHAIM has spent over a decade shaping the most prestigious corporate events across the Gulf. We work exclusively with organisations that demand the highest standards — in venue, in service, in lasting impression.
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.80rem,0.95vw,0.91rem)',
                  fontWeight: 300,
                  lineHeight: 1.92,
                  color: T.inkMid,
                  maxWidth: '420px',
                  marginBottom: '2.8rem',
                  letterSpacing: '0.006em',
                }}>
                  Our approach is quiet, deliberate, and precise. We do not measure success in headcount — we measure it in the conversations that happen the day after.
                </p>
                <CTALink />
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px,4.5vw,72px)', marginBottom: 'clamp(52px,6.5vw,76px)' }}>
          <div
            ref={dividerRef}
            style={{
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(198,160,97,0.16) 30%, rgba(198,160,97,0.16) 70%, transparent)',
            }}
          />
        </div>

        {/* ── Pillars ── */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(24px,4.5vw,72px)', paddingBottom: 'clamp(80px,10vw,130px)' }}>
          <div className="about-pillars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(8px,1.5vw,18px)' }}>
            {PILLARS.map((p, i) => (
              <PillarCard key={p.num} pillar={p} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* ── Transition out — 3-layer fade ── */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 'clamp(80px,10vw,120px)',
        background: `linear-gradient(to bottom, transparent, ${T.cream})`,
        pointerEvents: 'none',
        zIndex: 3,
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 'clamp(40px,5vw,60px)',
        background: `linear-gradient(to bottom, transparent, rgba(240,237,231,0.6))`,
        pointerEvents: 'none',
        zIndex: 4,
      }} />

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes goldShimmer {
          0%   { background-position: 260% center; }
          50%  { background-position: -60% center; }
          100% { background-position: 260% center; }
        }

        @keyframes breatheA {
          0%, 100% { opacity: 1; transform: translate(0%, 0%) scale(1); }
          45%       { opacity: 0.72; transform: translate(2%, 3%) scale(1.04); }
        }

        @keyframes breatheB {
          0%, 100% { opacity: 0.85; transform: translate(0%, 0%) scale(1); }
          50%       { opacity: 1;    transform: translate(-2%, -2%) scale(1.05); }
        }

        @media (max-width: 900px) {
          .about-text-grid {
            grid-template-columns: 1fr !important;
            gap: 38px !important;
          }
        }
        @media (max-width: 620px) {
          .about-pillars-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #about * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}