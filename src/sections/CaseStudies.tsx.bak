/**
 * CaseStudies — Scene 4
 * ─────────────────────────────────────────────────────────────
 * KEY FIX — Mobile gallery:
 *   WAS: flex-direction:column on mobile → completely broken vertical stack
 *   NOW: overflow-x:auto + scroll-snap-type:x mandatory → true horizontal
 *        touch-scroll identical to desktop (just touch-driven not GSAP-driven)
 *
 * Added gallery-wrapper class to the overflow container so the mobile CSS
 * override can target it. Everything else — featured card, lightbox,
 * desktop GSAP pin — preserved unchanged.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CaseStat  { value: string; label: string; }
interface CaseStudy {
  id: string; category: string; title: string;
  subtitle: string; location: string; year: string;
  image: string; stats: CaseStat[];
}

const FEATURED_STUDY: CaseStudy = {
  id: 'grand-cascade', category: 'Gala & Awards',
  title: 'The Grand Cascade',
  subtitle: 'A landmark luxury gala for 600 guests at Atlantis The Palm — reimagining the grand ballroom as a living waterfall of light and sound.',
  location: 'Dubai, UAE', year: '2024',
  image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=85',
  stats: [{ value: '600+', label: 'Guests' }, { value: '3', label: 'Days' }, { value: '14', label: 'Vendors' }],
};

const GALLERY_STUDIES: CaseStudy[] = [
  {
    id: 'summit-edge', category: 'Corporate Retreat',
    title: 'Summit at the Edge',
    subtitle: 'An executive leadership summit designed to inspire vision at altitude.',
    location: 'Davos, Switzerland', year: '2024',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80',
    stats: [{ value: '120', label: 'Executives' }, { value: '4', label: 'Days' }, { value: '9', label: 'Speakers' }],
  },
  {
    id: 'celestial-wedding', category: 'Luxury Wedding',
    title: 'Celestial Union',
    subtitle: 'An otherworldly ceremony beneath a canopy of 10,000 suspended crystal lights.',
    location: 'Amalfi Coast, Italy', year: '2023',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=80',
    stats: [{ value: '280', label: 'Guests' }, { value: '5', label: 'Days' }, { value: '22', label: 'Artisans' }],
  },
  {
    id: 'meridian-forum', category: 'Conference & Forum',
    title: 'The Meridian Forum',
    subtitle: 'A two-day thought leadership forum redefining the future of global finance.',
    location: 'Singapore', year: '2023',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    stats: [{ value: '450', label: 'Delegates' }, { value: '2', label: 'Days' }, { value: '18', label: 'Keynotes' }],
  },
  {
    id: 'aurora-banquet', category: 'Brand Experience',
    title: 'The Aurora Banquet',
    subtitle: 'A bespoke brand activation for a luxury fashion house — intimate, immersive, unforgettable.',
    location: 'Tromsø, Norway', year: '2023',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&auto=format&fit=crop&q=80',
    stats: [{ value: '80', label: 'VIP Guests' }, { value: '2', label: 'Nights' }, { value: '7', label: 'Partners' }],
  },
  {
    id: 'renaissance-gala', category: 'Gala & Awards',
    title: 'The Renaissance Gala',
    subtitle: 'An art-inspired awards evening transforming a historic museum into an evening of living art.',
    location: 'Paris, France', year: '2022',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=80',
    stats: [{ value: '350', label: 'Guests' }, { value: '1', label: 'Night' }, { value: '6', label: 'Awards' }],
  },
];

function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div className={className} style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)' }} />
  );
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.6rem', letterSpacing: '0.28em',
      textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500,
      color: 'var(--color-accent-1)', padding: '5px 10px',
      border: '1px solid rgba(197,160,89,0.45)', background: 'rgba(10,8,6,0.55)',
      backdropFilter: 'blur(6px)', borderRadius: 'var(--radius-sm)',
    }}>
      {label}
    </span>
  );
}

function FeaturedStudy({ study, onOpen }: { study: CaseStudy; onOpen: (s: CaseStudy) => void }) {
  return (
    <motion.div
      className="relative w-full overflow-hidden cursor-pointer group"
      style={{ height: 'clamp(340px, 48vw, 620px)', borderRadius: 'var(--radius-md)' }}
      onClick={() => onOpen(study)}
      whileHover="hovered" initial="rest" animate="rest"
    >
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
        <motion.img
          src={study.image} alt={study.title} loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
          variants={{ rest: { scale: 1.06 }, hovered: { scale: 1.10 } }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to right, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.36) 45%, rgba(10,8,6,0.10) 100%), linear-gradient(to top, rgba(10,8,6,0.60) 0%, transparent 55%)`, borderRadius: 'inherit' }} />
      <motion.div className="absolute left-0 top-8 bottom-8 w-0.5 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--color-accent-1), transparent)' }} variants={{ rest: { opacity: 0.45, scaleY: 0.7 }, hovered: { opacity: 0.85, scaleY: 1 } }} transition={{ duration: 0.45 }} />
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-14">
        <div className="absolute top-8 left-8 md:left-12 lg:left-14 flex items-center gap-4">
          <CategoryTag label={study.category} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.38)' }}>{study.year}</span>
        </div>
        <div className="max-w-xl">
          <motion.h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 3.8vw, 3.6rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#F8F4EE', marginBottom: '0.6rem' }} variants={{ rest: { y: 0 }, hovered: { y: -4 } }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {study.title}
          </motion.h3>
          <motion.p style={{ fontSize: 'clamp(0.78rem, 1vw, 0.88rem)', fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.52)', marginBottom: '1.4rem', maxWidth: '360px' }} variants={{ rest: { opacity: 0.52 }, hovered: { opacity: 0.75 } }} transition={{ duration: 0.4 }}>
            {study.subtitle}
          </motion.p>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.7 3.5 6.5 3.5 6.5s3.5-3.8 3.5-6.5C9.5 2.57 7.93 1 6 1z" stroke="rgba(197,160,89,0.7)" strokeWidth="0.8" fill="none" /><circle cx="6" cy="4.5" r="1" fill="rgba(197,160,89,0.7)" /></svg>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)' }}>{study.location}</span>
            </div>
            {study.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.95rem, 1.7vw, 1.4rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--color-accent-1)' }}>{s.value}</span>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.32)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.div className="absolute bottom-8 right-8 md:right-12 lg:right-14 flex items-center gap-3" variants={{ rest: { opacity: 0, x: 8 }, hovered: { opacity: 1, x: 0 } }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-accent-1)' }}>View Full Case</span>
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none"><path d="M1 5h18M14 1l5 4-5 4" stroke="var(--color-accent-1)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

function GalleryCard({ study, onOpen }: { study: CaseStudy; onOpen: (s: CaseStudy) => void }) {
  return (
    <motion.article
      className="gallery-card relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: 'clamp(280px, 28vw, 390px)',
        height: 'clamp(340px, 44vw, 500px)',
        borderRadius: 'var(--radius-md)',
      }}
      onClick={() => onOpen(study)}
      whileHover="hovered" initial="rest" animate="rest"
    >
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
        <motion.img
          src={study.image} alt={study.title} loading="lazy"
          className="w-full h-full object-cover"
          variants={{ rest: { scale: 1.04 }, hovered: { scale: 1.09 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.18) 55%, transparent 100%)', borderRadius: 'inherit' }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(197,160,89,0.05)', borderRadius: 'inherit' }} variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }} transition={{ duration: 0.35 }} />
      <motion.div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent-1), transparent)' }} variants={{ rest: { scaleX: 0, opacity: 0 }, hovered: { scaleX: 1, opacity: 0.8 } }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
      <div className="absolute top-5 left-5"><CategoryTag label={study.category} /></div>
      <motion.span className="absolute top-5 right-5" style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.35)' }} variants={{ rest: { opacity: 0.35 }, hovered: { opacity: 0.65 } }}>{study.year}</motion.span>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <motion.h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.1vw, 1.75rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.01em', color: '#F8F4EE', marginBottom: '0.45rem' }} variants={{ rest: { y: 0 }, hovered: { y: -4 } }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          {study.title}
        </motion.h4>
        <div className="flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.7 3.5 6.5 3.5 6.5s3.5-3.8 3.5-6.5C9.5 2.57 7.93 1 6 1z" stroke="rgba(197,160,89,0.7)" strokeWidth="0.8" fill="none" /><circle cx="6" cy="4.5" r="1" fill="rgba(197,160,89,0.7)" /></svg>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>{study.location}</span>
        </div>
      </div>
    </motion.article>
  );
}

function Lightbox({ study, onClose }: { study: CaseStudy | null; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (study) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [study, onClose]);

  return (
    <AnimatePresence>
      {study && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ padding: 'clamp(16px, 4vw, 48px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} onClick={onClose}
        >
          <motion.div className="absolute inset-0" style={{ background: 'rgba(10,8,6,0.92)', backdropFilter: 'blur(8px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="relative flex flex-col lg:flex-row overflow-hidden w-full max-w-5xl"
            style={{ maxHeight: '90vh', borderRadius: 'var(--radius-lg)', background: '#0E0C0A', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.12)' }}
            initial={{ scale: 0.93, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-shrink-0 w-full lg:w-[55%] overflow-hidden" style={{ minHeight: '240px' }}>
              <img src={study.image} alt={study.title} className="w-full h-full object-cover" style={{ minHeight: '240px', maxHeight: '560px' }} />
              <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to top, rgba(14,12,10,0.8) 0%, transparent 60%)' }} />
              <div className="absolute top-5 left-5"><CategoryTag label={study.category} /></div>
            </div>
            <div className="flex flex-col justify-between p-7 md:p-10 w-full overflow-y-auto" style={{ minWidth: 0 }}>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ display: 'block', height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.65)' }}>{study.year} · {study.location}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#F8F4EE', marginBottom: '1rem' }}>{study.title}</h2>
                <p style={{ fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.50)', marginBottom: '2rem' }}>{study.subtitle}</p>
                <GoldRule className="mb-5" />
                <div className="flex flex-wrap gap-6">
                  {study.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--color-accent-1)', lineHeight: 1 }}>{s.value}</span>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.30)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.25)' }}>Press Esc to close</span>
                <motion.button onClick={onClose} className="flex items-center gap-2" style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.65)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} whileHover={{ color: 'rgba(197,160,89,1)' }}>
                  Close <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" /></svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CaseStudies() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const hWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);

  const [lightboxStudy, setLightboxStudy] = useState<CaseStudy | null>(null);
  const openLightbox  = useCallback((s: CaseStudy) => setLightboxStudy(s), []);
  const closeLightbox = useCallback(() => setLightboxStudy(null), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.querySelectorAll('.hdr-anim'), {
          opacity: 0, y: 36, stagger: 0.13, duration: 1.05, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        });
      }
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          opacity: 0, y: 48, scale: 0.98, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: featuredRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        if (!hWrapperRef.current || !trackRef.current) return;
        const wrapper = hWrapperRef.current;
        const track   = trackRef.current;
        const cards   = track.querySelectorAll('.gallery-card');
        if (cards.length === 0) return;

        const calcAndPin = () => {
          const cardW      = (cards[0] as HTMLElement).offsetWidth;
          const gap        = 24;
          const totalW     = (cardW + gap) * cards.length - gap;
          const wrapperW   = wrapper.offsetWidth;
          const scrollDist = Math.max(0, totalW - wrapperW + 80);
          if (scrollDist <= 0) return;

          gsap.to(track, {
            x: -scrollDist,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              pin: true,
              scrub: 1.2,
              end: `+=${scrollDist}`,
              anticipatePin: 1,
              pinSpacing: true,
            },
          });
        };

        const raf = requestAnimationFrame(calcAndPin);
        return () => cancelAnimationFrame(raf);
      });

      if (trackRef.current) {
        gsap.from(trackRef.current.querySelectorAll('.gallery-card'), {
          opacity: 0, y: 40, stagger: 0.09, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: hWrapperRef.current, start: 'top 88%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Lightbox study={lightboxStudy} onClose={closeLightbox} />

      <section
        id="work"
        ref={sectionRef}
        className="relative w-full"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid rgba(197,160,89,0.07)' }}
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(ellipse 70% 50% at 90% 20%, rgba(197,160,89,0.03) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(197,160,89,0.02) 0%, transparent 60%)` }} />

        <div className="relative mx-auto w-full" style={{ maxWidth: '1340px', padding: 'clamp(72px, 8vw, 112px) clamp(20px, 4vw, 64px) 0' }}>
          <div ref={headerRef} className="mb-10 md:mb-14 text-center mx-auto" style={{ maxWidth: '640px' }}>
            <div className="hdr-anim flex items-center justify-center gap-4 mb-6">
              <span style={{ display: 'block', height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.34em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)' }}>Our Work</span>
              <span style={{ display: 'block', height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.6 }} />
            </div>
            <h2 className="hdr-anim" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4.8rem)', fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.025em', color: 'var(--color-text)', marginBottom: '1rem' }}>
              Moments That<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>Define Legacy.</em>
            </h2>
            <p className="hdr-anim mx-auto" style={{ fontSize: 'clamp(0.8rem, 1vw, 0.88rem)', fontFamily: 'var(--font-body)', fontWeight: 300, lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              Selected engagements across six continents — each one a study in precision,
              storytelling, and the art of leaving nothing to chance.
            </p>
          </div>
          <div ref={featuredRef} className="mb-12 md:mb-18">
            <FeaturedStudy study={FEATURED_STUDY} onOpen={openLightbox} />
          </div>
        </div>

        <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 64px) 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ height: '1px', width: '28px', background: 'var(--color-accent-1)', opacity: 0.45, display: 'block' }} />
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.32em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
              Scroll to explore ›
            </span>
          </div>
        </div>

        {/* ─── GALLERY WRAPPER ───────────────────────────────────────
         *  Desktop: overflow:hidden, GSAP drives x-translation (pin)
         *  Mobile:  overflow-x:auto, native touch-scroll with snap
         *  The .gallery-wrapper class is the CSS hook for mobile override
         * ─────────────────────────────────────────────────────────── */}
        <div ref={hWrapperRef} className="gallery-wrapper" style={{ overflow: 'hidden', width: '100%' }}>
          <div
            ref={trackRef}
            className="gallery-track"
            style={{
              display: 'flex', gap: '24px',
              width: 'max-content',
              paddingLeft: 'clamp(20px, 4vw, 64px)',
              paddingRight: 'clamp(40px, 6vw, 96px)',
              paddingTop: '8px',
              paddingBottom: 'clamp(56px, 6vw, 88px)',
            }}
          >
            {GALLERY_STUDIES.map((study) => (
              <GalleryCard key={study.id} study={study} onOpen={openLightbox} />
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 64px)', paddingBottom: 'clamp(64px, 7vw, 96px)' }}>
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <GoldRule className="mb-4 w-24" />
              <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: 300, letterSpacing: '0.04em', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                200+ events. 18 countries. One standard: extraordinary.
              </p>
            </div>
            <motion.a
              href="#contact"
              className="flex items-center gap-2.5 flex-shrink-0"
              style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', textDecoration: 'none' }}
              whileHover={{ x: 4, color: 'var(--color-accent-1)' }}
              transition={{ duration: 0.22 }}
            >
              <span>Discuss Your Event</span>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.a>
          </motion.div>
        </div>

        <style>{`
          /* ── MOBILE: horizontal touch-scroll with snap ── */
          @media (max-width: 767px) {
            /* Make the wrapper scrollable instead of clipping */
            .gallery-wrapper {
              overflow-x: auto    !important;
              overflow-y: visible !important;
              -webkit-overflow-scrolling: touch;
              scroll-snap-type: x mandatory;
              scrollbar-width: none;
            }
            .gallery-wrapper::-webkit-scrollbar { display: none; }

            /* Track stays as a row — no column flip */
            .gallery-track {
              flex-direction: row    !important;
              width: max-content     !important;
              padding-left: 20px     !important;
              padding-right: 20px    !important;
              padding-bottom: 48px   !important;
              gap: 14px              !important;
            }

            /* Each card: 82vw wide, snaps to start */
            .gallery-track .gallery-card {
              flex-shrink: 0         !important;
              width: 82vw            !important;
              height: 68vw           !important;
              min-height: 260px      !important;
              scroll-snap-align: start;
              scroll-snap-stop: always;
            }
          }
        `}</style>
      </section>
    </>
  );
}
