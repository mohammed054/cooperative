/**
 * About — Cinematic Rebuild
 * ROOT CAUSE FIX: Headline was invisible because Framer whileInView
 * with once:true never fires when element is already in viewport on mount.
 * SOLUTION: GSAP ScrollTrigger drives the headline lines instead — it
 * evaluates position correctly on mount AND on scroll.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOKEN = {
  gold:     '#C6A061',
  goldMid:  'rgba(198,160,97,0.55)',
  cream:    '#F7F5F1',
  textDark: '#1A1814',
  textMid:  '#4A4640',
  textMuted:'#8A8480',
} as const;

const PILLARS = [
  { num:'01', title:'A quiet approach.', body:"We don't seek attention for ourselves. The event is the statement. Our role is invisible architecture — the reason everything feels inevitable." },
  { num:'02', title:'Precision over performance.', body:"Execution is not measured in headcount or decibels. It's measured in the quality of conversation the morning after." },
  { num:'03', title:'Legacy over landmark.', body:'Any venue can impress once. We design experiences that compound — that become reference points in the memory of everyone in the room.' },
];

/* GSAP headline reveal — fires reliably on mount or scroll */
function useHeadlineReveal(lineRefs: React.RefObject<HTMLSpanElement | null>[], triggerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const lines = lineRefs.map(r => r.current).filter(Boolean);
    const trigger = triggerRef.current;
    if (!lines.length || !trigger) return;
    gsap.set(lines, { yPercent: 108, willChange: 'transform' });
    const ctx = gsap.context(() => {
      gsap.to(lines, {
        yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.17, delay: 0.05,
        scrollTrigger: { trigger, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function CTALink() {
  const [hov, setHov] = useState(false);
  return (
    <a href="#work" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'inline-flex', alignItems:'center', gap: hov?'20px':'10px', fontFamily:'var(--font-body)', fontSize:'0.60rem', letterSpacing:'0.30em', textTransform:'uppercase', color:TOKEN.gold, textDecoration:'none', transition:'gap 0.34s cubic-bezier(0.22,1,0.36,1)', userSelect:'none' }}>
      <span style={{ position:'relative', paddingBottom:'2px' }}>
        View Our Work
        <span style={{ position:'absolute', bottom:0, left:0, height:'1px', width: hov?'100%':'0%', background:TOKEN.goldMid, transition:'width 0.44s cubic-bezier(0.22,1,0.36,1)' }} />
      </span>
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none" style={{ transform: hov?'translateX(5px)':'translateX(0)', transition:'transform 0.34s cubic-bezier(0.22,1,0.36,1)', flexShrink:0 }}>
        <path d="M1 5h18M14 1l5 4-5 4" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.18 }}
      transition={{ duration:1.0, ease:[0.22,1,0.36,1], delay: 0.12 + index * 0.14 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding:'clamp(20px,2.2vw,30px)', borderRadius:'5px', background: hov?'rgba(198,160,97,0.04)':'transparent', border:`1px solid ${hov?'rgba(198,160,97,0.16)':'transparent'}`, transform: hov?'scale(1.025) translateY(-4px)':'scale(1) translateY(0)', transition:'background 0.48s ease, border-color 0.48s ease, transform 0.48s cubic-bezier(0.22,1,0.36,1), box-shadow 0.48s ease', boxShadow: hov?'0 16px 48px rgba(26,24,20,0.06)':'none', cursor:'default', willChange:'transform' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1rem' }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.50rem', letterSpacing:'0.26em', color:'rgba(198,160,97,0.55)' }}>{pillar.num}</span>
        <span style={{ display:'block', height:'1px', flexShrink:0, width: hov?'32px':'16px', background: hov?'rgba(198,160,97,0.70)':'rgba(198,160,97,0.28)', transition:'width 0.44s cubic-bezier(0.22,1,0.36,1), background 0.44s ease' }} />
      </div>
      <h3 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.92rem,1.2vw,1.08rem)', fontWeight:300, fontStyle:'italic', letterSpacing:'-0.01em', lineHeight:1.25, color:TOKEN.textDark, marginBottom:'0.7rem', filter: hov?'brightness(1.0)':'brightness(0.80)', transition:'filter 0.38s ease' }}>{pillar.title}</h3>
      <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.74rem,0.85vw,0.80rem)', fontWeight:300, lineHeight:1.85, color: hov?TOKEN.textMid:TOKEN.textMuted, transition:'color 0.42s ease' }}>{pillar.body}</p>
    </motion.div>
  );
}

export function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const imgWrapRef  = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLSpanElement>(null);
  const line2Ref    = useRef<HTMLSpanElement>(null);
  const line3Ref    = useRef<HTMLSpanElement>(null);

  useHeadlineReveal([line1Ref, line2Ref, line3Ref], headlineRef);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end','end start'] });
  const bgBloomY = useTransform(scrollYProgress, [0,1], ['0%','10%']);
  const bodyY    = useTransform(scrollYProgress, [0,1], ['0%','-3%']);

  useEffect(() => {
    const wrap = imgWrapRef.current;
    const section = sectionRef.current;
    const divider = dividerRef.current;
    if (!wrap || !section) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.set(wrap, { width:'40%', borderRadius:'6px' });
        gsap.to(wrap, { width:'94%', borderRadius:'2px', ease:'none', scrollTrigger:{ trigger:wrap, start:'top 84%', end:'top 12%', scrub:1.8 } });
      });
      mm.add('(max-width: 767px)', () => {
        gsap.set(wrap, { width:'80%', borderRadius:'5px' });
        gsap.to(wrap, { width:'94%', borderRadius:'2px', ease:'none', scrollTrigger:{ trigger:wrap, start:'top 88%', end:'top 28%', scrub:1.2 } });
      });
      if (divider) {
        gsap.from(divider, { scaleX:0, transformOrigin:'left center', ease:'power3.out', duration:1.8, scrollTrigger:{ trigger:divider, start:'top 90%', toggleActions:'play none none none' } });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{ background:TOKEN.cream, paddingTop:'clamp(80px,9vw,120px)', paddingBottom:0, borderTop:'1px solid rgba(198,160,97,0.08)', position:'relative', overflow:'hidden' }}>

      {/* Grain */}
      <div aria-hidden style={{ position:'absolute', inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`, backgroundRepeat:'repeat', backgroundSize:'200px 200px', opacity:0.030, pointerEvents:'none', zIndex:1, mixBlendMode:'multiply' }} />
      {/* Vignette */}
      <div aria-hidden style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 110% 90% at 50% 40%, transparent 50%, rgba(0,0,0,0.05) 100%)', pointerEvents:'none', zIndex:1 }} />
      {/* Ambient gold bloom */}
      <motion.div aria-hidden style={{ position:'absolute', top:'-10%', left:'-10%', right:'-10%', bottom:'-10%', background:'radial-gradient(ellipse 55% 38% at 28% 18%, rgba(198,160,97,0.065) 0%, transparent 68%)', y:bgBloomY, pointerEvents:'none', zIndex:0 }} />

      <div style={{ position:'relative', zIndex:2 }}>

        {/* Eyebrow */}
        <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.6 }} transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
          style={{ padding:'0 clamp(24px,4.5vw,72px)', marginBottom:'clamp(20px,2.5vw,32px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ display:'block', height:'1px', width:'24px', background:TOKEN.goldMid, flexShrink:0 }} />
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.56rem', letterSpacing:'0.34em', textTransform:'uppercase', color:TOKEN.textMuted, fontWeight:500 }}>About Ghaim</span>
          </div>
        </motion.div>

        {/* Image */}
        <div style={{ display:'flex', justifyContent:'center', overflow:'hidden', marginBottom:'clamp(60px,7vw,96px)' }}>
          <div ref={imgWrapRef} style={{ overflow:'hidden', flexShrink:0, position:'relative' }}>
            <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=2200&auto=format&fit=crop&q=85" alt="Ghaim event — Atlantis The Palm, 2024" style={{ width:'100%', height:'clamp(200px,30vw,420px)', objectFit:'cover', objectPosition:'center 38%', display:'block' }} />
            <span style={{ position:'absolute', bottom:'12px', left:'16px', fontFamily:'var(--font-body)', fontSize:'0.50rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.30)', userSelect:'none' }}>Atlantis The Palm · 2024</span>
          </div>
        </div>

        {/* 60/40 text block */}
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 clamp(24px,4.5vw,72px)', marginBottom:'clamp(60px,7vw,96px)' }}>
          <div className="about-text-grid" style={{ display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:'clamp(40px,6vw,112px)', alignItems:'start' }}>

            {/* LEFT — Headline (GSAP clip-reveal) */}
            <div>
              <h2 ref={headlineRef as React.RefObject<HTMLHeadingElement>}
                aria-label="Where Vision Meets Flawless Execution."
                style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,5vw,5.4rem)', fontWeight:300, lineHeight:1.02, letterSpacing:'-0.032em', color:TOKEN.textDark, margin:0 }}>

                <span style={{ display:'block', overflow:'hidden', paddingBottom:'0.08em' }}>
                  <span ref={line1Ref} style={{ display:'block' }}>Where Vision</span>
                </span>

                <span style={{ display:'block', overflow:'hidden', paddingBottom:'0.08em' }}>
                  <span ref={line2Ref} style={{ display:'block' }}>
                    Meets{' '}
                    <em style={{ fontStyle:'italic', background:'linear-gradient(92deg, #8c6b2f 0%, #c6a061 28%, #ead898 50%, #c6a061 72%, #8c6b2f 100%)', backgroundSize:'300% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'goldShimmer 5.5s ease-in-out infinite', willChange:'background-position' }}>
                      Flawless
                    </em>
                  </span>
                </span>

                <span style={{ display:'block', overflow:'hidden', paddingBottom:'0.08em' }}>
                  <span ref={line3Ref} style={{ display:'block' }}>Execution.</span>
                </span>
              </h2>

              <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ duration:1.3, ease:[0.22,1,0.36,1], delay:0.7 }}
                style={{ marginTop:'32px', height:'1px', width:'40px', background:`linear-gradient(to right, ${TOKEN.goldMid}, transparent)`, transformOrigin:'left center' }} />
            </div>

            {/* RIGHT — Body + CTA */}
            <motion.div style={{ y:bodyY, paddingTop:'clamp(8px,1vw,14px)' }}>
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:0.15 }} transition={{ duration:1.0, ease:[0.22,1,0.36,1], delay:0.38 }}>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.82rem,0.96vw,0.92rem)', fontWeight:300, lineHeight:1.88, color:TOKEN.textMid, maxWidth:'420px', marginBottom:'1.5rem' }}>
                  GHAIM has spent over a decade shaping the most prestigious corporate events across the Gulf. We work exclusively with organisations that demand the highest standards — in venue, in service, in lasting impression.
                </p>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.82rem,0.96vw,0.92rem)', fontWeight:300, lineHeight:1.88, color:TOKEN.textMid, maxWidth:'420px', marginBottom:'2.6rem' }}>
                  Our approach is quiet, deliberate, and precise. We do not measure success in headcount — we measure it in the conversations that happen the day after.
                </p>
                <CTALink />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 clamp(24px,4.5vw,72px)', marginBottom:'clamp(48px,6vw,72px)' }}>
          <div ref={dividerRef} style={{ height:'1px', background:'linear-gradient(to right, transparent, rgba(198,160,97,0.18), transparent)' }} />
        </div>

        {/* Pillars */}
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'0 clamp(24px,4.5vw,72px)', paddingBottom:'clamp(80px,10vw,130px)' }}>
          <div className="about-pillars-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'clamp(8px,1.5vw,20px)' }}>
            {PILLARS.map((p, i) => <PillarCard key={p.num} pillar={p} index={i} />)}
          </div>
        </div>
      </div>

      {/* Transition out */}
      <div aria-hidden style={{ position:'absolute', bottom:0, left:0, right:0, height:'clamp(60px,8vw,100px)', background:`linear-gradient(to bottom, transparent, ${TOKEN.cream})`, pointerEvents:'none', zIndex:3 }} />

      <style>{`
        @keyframes goldShimmer {
          0%   { background-position: 230% center; }
          50%  { background-position: -50% center; }
          100% { background-position: 230% center; }
        }
        @media (max-width: 900px) { .about-text-grid { grid-template-columns: 1fr !important; gap: 36px !important; } }
        @media (max-width: 620px) { .about-pillars-grid { grid-template-columns: 1fr !important; gap: 16px !important; } }
        @media (prefers-reduced-motion: reduce) { #about * { animation: none !important; transition: none !important; } }
      `}</style>
    </section>
  );
}