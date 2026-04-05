/**
 * CaseStudies — Cinematic Scroll Atelier  ✦
 * ─────────────────────────────────────────────────────────────
 * Architecture:
 *   – Section: N × 100vh of total scroll space
 *   – Inner div: position:sticky top:0 h:100vh
 *     → pins for (N-1) × 100vh, zero GSAP pin artefacts
 *   – Photo panels: absolute-stacked, GSAP-driven diagonal
 *     polygon() clip-path wipe (forward-slash curtain reveal)
 *   – Image parallax: independent translateX per panel
 *   – Content: single React layer above all photos →
 *     AnimatePresence "wait" transitions per active case
 *   – Section header: GSAP opacity/y fade-out on first scroll
 *   – Stats: useCountUp on panel activation
 *   – Chrome: scrubbed top progress bar, right-rail dash nav
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */

interface CaseStat  { value: string; label: string }
interface CaseStudy {
  id: string; category: string; year: string
  title: string; titleItalic: string
  subtitle: string; location: string
  image: string; stats: CaseStat[]
}

const CASES: CaseStudy[] = [
  {
    id: 'grand-cascade', category: 'Gala & Awards', year: '2024',
    title: 'The Grand', titleItalic: 'Cascade',
    subtitle: 'A landmark luxury gala for 600 guests at Atlantis The Palm — reimagining the grand ballroom as a living waterfall of light and sound.',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=85',
    stats: [{ value: '600+', label: 'Guests' }, { value: '3', label: 'Days' }, { value: '14', label: 'Vendors' }],
  },
  {
    id: 'summit-edge', category: 'Corporate Retreat', year: '2024',
    title: 'Summit at', titleItalic: 'the Edge',
    subtitle: 'An executive leadership summit designed to inspire vision at altitude — where the world\'s most consequential decisions take form.',
    location: 'Davos, Switzerland',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&auto=format&fit=crop&q=80',
    stats: [{ value: '120', label: 'Executives' }, { value: '4', label: 'Days' }, { value: '9', label: 'Speakers' }],
  },
  {
    id: 'celestial-wedding', category: 'Luxury Wedding', year: '2023',
    title: 'Celestial', titleItalic: 'Union',
    subtitle: 'An otherworldly ceremony beneath 10,000 suspended crystal lights — where love becomes something you can see, hear, and feel.',
    location: 'Amalfi Coast, Italy',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1800&auto=format&fit=crop&q=80',
    stats: [{ value: '280', label: 'Guests' }, { value: '5', label: 'Days' }, { value: '22', label: 'Artisans' }],
  },
  {
    id: 'meridian-forum', category: 'Conference & Forum', year: '2023',
    title: 'The Meridian', titleItalic: 'Forum',
    subtitle: 'A two-day thought leadership forum that redefined the future of global finance — and the mindsets required to shape it.',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=80',
    stats: [{ value: '450', label: 'Delegates' }, { value: '2', label: 'Days' }, { value: '18', label: 'Keynotes' }],
  },
  {
    id: 'aurora-banquet', category: 'Brand Experience', year: '2023',
    title: 'The Aurora', titleItalic: 'Banquet',
    subtitle: 'A bespoke brand activation beneath the Northern Lights — intimate, immersive, and designed to leave no detail to chance.',
    location: 'Tromsø, Norway',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&auto=format&fit=crop&q=80',
    stats: [{ value: '80', label: 'VIP Guests' }, { value: '2', label: 'Nights' }, { value: '7', label: 'Partners' }],
  },
  {
    id: 'renaissance-gala', category: 'Gala & Awards', year: '2022',
    title: 'The Renaissance', titleItalic: 'Gala',
    subtitle: 'An art-inspired awards evening that transformed the Grand Palais into a living canvas of performance, light, and wonder.',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1800&auto=format&fit=crop&q=80',
    stats: [{ value: '350', label: 'Guests' }, { value: '1', label: 'Night' }, { value: '6', label: 'Awards' }],
  },
];

const N   = CASES.length;
const pad = (n: number) => String(n + 1).padStart(2, '0');

/* ══════════════════════════════════════════════════════════════
   PRIMITIVES
══════════════════════════════════════════════════════════════ */

/** Counts up from 0 to the numeric prefix of rawValue on activation. */
function useCountUp(rawValue: string, isActive: boolean) {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!isActive) { setDisplay('0'); return; }
    const m = rawValue.match(/^(\d+)(.*)$/);
    if (!m) { setDisplay(rawValue); return; }
    const target   = parseInt(m[1], 10);
    const suffix   = m[2] ?? '';
    const duration = 1100;
    const t0       = performance.now();
    const tick = (now: number) => {
      const p    = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(ease * target) + suffix);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, rawValue]);

  return display;
}

function StatBlock({ stat, isActive }: { stat: CaseStat; isActive: boolean }) {
  const value = useCountUp(stat.value, isActive);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '60px' }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)',
        fontWeight: 300,
        letterSpacing: '-0.02em',
        color: 'var(--color-accent-1)',
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: '0.52rem', letterSpacing: '0.30em', textTransform: 'uppercase',
        fontFamily: 'var(--font-body)', fontWeight: 500,
        color: 'rgba(255,255,255,0.35)',
      }}>
        {stat.label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PHOTO PANEL  (image + gradient only, no text)
══════════════════════════════════════════════════════════════ */

interface PhotoPanelProps {
  study: CaseStudy
  index: number
  panelRef: (el: HTMLDivElement | null) => void
  imgRef: (el: HTMLImageElement | null) => void
}

function PhotoPanel({ study, index, panelRef, imgRef }: PhotoPanelProps) {
  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        willChange: 'clip-path',
      }}
    >
      {/* ── Image with extra width for parallax room ── */}
      <img
        ref={imgRef}
        src={study.image}
        alt={study.title}
        loading={index === 0 ? 'eager' : 'lazy'}
        draggable={false}
        style={{
          position: 'absolute', top: 0, left: '-7%',
          width: '114%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          willChange: 'transform',
          userSelect: 'none', pointerEvents: 'none',
        }}
      />

      {/* ── Cinematic gradient stack ── */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: [
          /* Strong left-side darkening for text legibility */
          'linear-gradient(95deg, rgba(3,2,1,0.92) 0%, rgba(3,2,1,0.60) 35%, rgba(3,2,1,0.15) 60%, transparent 100%)',
          /* Bottom vignette */
          'linear-gradient(to top, rgba(3,2,1,0.75) 0%, rgba(3,2,1,0.10) 38%, transparent 100%)',
          /* Subtle top bar for UI readability */
          'linear-gradient(to bottom, rgba(3,2,1,0.45) 0%, transparent 22%)',
        ].join(', '),
      }} />

      {/* ── Vertical gold accent line (left edge) ── */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, top: '12%', bottom: '12%', width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(197,160,89,0.35), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTENT LAYER  (React-only, above all panels)
══════════════════════════════════════════════════════════════ */

interface ContentLayerProps {
  study: CaseStudy
  index: number
  onOpen: (s: CaseStudy) => void
}

function ContentLayer({ study, index, onOpen }: ContentLayerProps) {
  const container = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.06 } },
    exit:   {},
  };
  const line = {
    hidden: { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    exit:   { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        padding: 'clamp(24px, 3.5vw, 56px)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* ── Top meta row ── */}
      <motion.div variants={line} style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        pointerEvents: 'auto',
      }}>
        {/* Category pill */}
        <span style={{
          fontSize: '0.55rem', letterSpacing: '0.30em', textTransform: 'uppercase',
          fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)',
          padding: '5px 11px', border: '1px solid rgba(197,160,89,0.38)',
          background: 'rgba(3,2,1,0.48)', backdropFilter: 'blur(8px)',
          borderRadius: '2px',
        }}>
          {study.category}
        </span>
        <div style={{ width: '1px', height: '14px', background: 'rgba(197,160,89,0.25)' }} />
        <span style={{
          fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.30)',
        }}>
          {study.year}
        </span>
        <span style={{ flex: 1 }} />
        {/* Location (top-right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="9" height="11" viewBox="0 0 12 14" fill="none">
            <path d="M6 1C3.79 1 2 2.79 2 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" stroke="rgba(197,160,89,0.55)" strokeWidth="0.9" fill="none" />
            <circle cx="6" cy="5" r="1.2" fill="rgba(197,160,89,0.55)" />
          </svg>
          <span style={{
            fontSize: '0.55rem', letterSpacing: '0.14em',
            fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.35)',
          }}>
            {study.location}
          </span>
        </div>
      </motion.div>

      {/* ── Spacer + Giant faded index ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Ghost index number — texture element, not interactive */}
        <div aria-hidden style={{
          position: 'absolute',
          top: '50%', left: '-0.04em',
          transform: 'translateY(-54%)',
          fontFamily: 'var(--font-display)', fontWeight: 200,
          fontSize: 'clamp(10rem, 28vw, 30rem)',
          lineHeight: 1, letterSpacing: '-0.05em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(197,160,89,0.065)',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {pad(index)}
        </div>
      </div>

      {/* ── Main case content (bottom) ── */}
      <div style={{ pointerEvents: 'auto' }}>
        {/* Title */}
        <motion.div variants={line} style={{ overflow: 'hidden' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.6rem, 7vw, 8rem)',
            lineHeight: 0.92, letterSpacing: '-0.025em',
            color: '#F8F4EE', marginBottom: '0',
          }}>
            {study.title}
          </h3>
        </motion.div>

        <motion.div variants={line} style={{ overflow: 'hidden', marginBottom: '1.8rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.6rem, 7vw, 8rem)',
            lineHeight: 0.92, letterSpacing: '-0.025em',
            fontStyle: 'italic', color: 'var(--color-accent-1)',
          }}>
            {study.titleItalic}
          </h3>
        </motion.div>

        {/* Gold rule */}
        <motion.div variants={line} style={{
          height: '1px',
          width: 'clamp(36px, 5vw, 64px)',
          marginBottom: '1.4rem',
          background: 'linear-gradient(to right, var(--color-accent-1), rgba(197,160,89,0.2))',
        }} />

        {/* Subtitle */}
        <motion.p variants={line} style={{
          fontSize: 'clamp(0.75rem, 0.95vw, 0.9rem)',
          fontFamily: 'var(--font-body)', fontWeight: 300,
          lineHeight: 1.85, color: 'rgba(255,255,255,0.48)',
          maxWidth: 'min(420px, 38vw)', marginBottom: '2.2rem',
        }}>
          {study.subtitle}
        </motion.p>

        {/* Stats */}
        <motion.div variants={line} style={{
          display: 'flex', alignItems: 'flex-start',
          gap: 'clamp(20px, 3.5vw, 52px)', flexWrap: 'wrap',
          marginBottom: '2.8rem',
        }}>
          {study.stats.map((s) => (
            <StatBlock key={s.label} stat={s} isActive={true} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={line}>
          <motion.button
            onClick={() => onOpen(study)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: '14px',
            }}
            whileHover="hov" initial="rest" animate="rest"
          >
            <motion.span
              style={{
                fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)',
                transition: 'color 0.3s ease',
              }}
              variants={{ rest: { color: 'rgba(255,255,255,0.45)' }, hov: { color: 'var(--color-accent-1)' } }}
              transition={{ duration: 0.25 }}
            >
              Explore Full Case
            </motion.span>
            {/* Animated rule */}
            <motion.div
              style={{
                height: '1px', background: 'rgba(197,160,89,0.5)',
                width: '32px', transformOrigin: 'left',
              }}
              variants={{ rest: { scaleX: 1, background: 'rgba(197,160,89,0.5)' }, hov: { scaleX: 1.7, background: 'rgba(197,160,89,1)' } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.svg
              width="14" height="8" viewBox="0 0 14 8" fill="none"
              variants={{ rest: { x: 0 }, hov: { x: 5 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M1 4h12M8 1l4 3-4 3" stroke="rgba(197,160,89,0.8)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════ */

function Lightbox({ study, onClose }: { study: CaseStudy | null; onClose: () => void }) {
  useEffect(() => {
    if (!study) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
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
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(3,2,1,0.94)', backdropFilter: 'blur(12px)' }}
          />
          <motion.div
            className="relative flex flex-col lg:flex-row overflow-hidden w-full max-w-5xl"
            style={{
              maxHeight: '88vh',
              borderRadius: 'var(--radius-lg)',
              background: '#0C0A08',
              boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(197,160,89,0.14)',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image half */}
            <div className="relative flex-shrink-0 w-full lg:w-[52%] overflow-hidden" style={{ minHeight: '240px' }}>
              <img
                src={study.image} alt={study.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '240px', maxHeight: '560px' }}
              />
              <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 60%)' }} />
              <span style={{
                position: 'absolute', top: '20px', left: '20px',
                fontSize: '0.55rem', letterSpacing: '0.30em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)',
                padding: '5px 11px', border: '1px solid rgba(197,160,89,0.38)',
                background: 'rgba(3,2,1,0.55)', backdropFilter: 'blur(8px)', borderRadius: '2px',
              }}>
                {study.category}
              </span>
            </div>

            {/* Content half */}
            <div className="flex flex-col justify-between p-8 md:p-10 w-full overflow-y-auto" style={{ minWidth: 0 }}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span style={{ display: 'block', height: '1px', width: '24px', background: 'var(--color-accent-1)', opacity: 0.55 }} />
                  <span style={{
                    fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.60)',
                  }}>
                    {study.year} · {study.location}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 300,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 0.94, letterSpacing: '-0.022em', color: '#F8F4EE',
                  marginBottom: '1.2rem',
                }}>
                  {study.title}<br />
                  <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>{study.titleItalic}</em>
                </h2>

                <p style={{
                  fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: 300,
                  lineHeight: 1.8, color: 'rgba(255,255,255,0.48)', marginBottom: '2rem',
                }}>
                  {study.subtitle}
                </p>

                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.35), transparent)', marginBottom: '1.5rem' }} />

                <div className="flex flex-wrap gap-7">
                  {study.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1.5">
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                        fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--color-accent-1)', lineHeight: 1,
                      }}>{s.value}</span>
                      <span style={{
                        fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.28)',
                      }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{
                  fontSize: '0.55rem', letterSpacing: '0.20em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.18)',
                }}>Press Esc to close</span>
                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)', color: 'rgba(197,160,89,0.55)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                  whileHover={{ color: 'rgba(197,160,89,1)' }}
                >
                  Close
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   CASE STUDIES — Main Export
══════════════════════════════════════════════════════════════ */

export function CaseStudies() {
  const sectionRef     = useRef<HTMLElement>(null);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLDivElement>(null);
  const panelRefs      = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const imgRefs        = useRef<(HTMLImageElement | null)[]>(Array(N).fill(null));

  const [activeIndex, setActiveIndex]     = useState(0);
  const [lightboxStudy, setLightboxStudy] = useState<CaseStudy | null>(null);
  const activeIndexRef = useRef(0);

  const openLightbox  = useCallback((s: CaseStudy) => setLightboxStudy(s), []);
  const closeLightbox = useCallback(() => setLightboxStudy(null), []);

  /* ── GSAP scroll orchestration ── */
  useEffect(() => {
    if (!stickyRef.current) return;

    /* Init: panels 1..N-1 start fully clipped (hidden) */
    panelRefs.current.forEach((panel, i) => {
      if (panel && i > 0) {
        /* polygon fully collapsed to right edge */
        gsap.set(panel, {
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
        });
      }
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stickyRef.current,
        start: 'top top',
        /* (N-1) × 100vh of scroll while the sticky viewer is pinned */
        end: () => `+=${(N - 1) * window.innerHeight}`,
        scrub: 1.2,

        onUpdate(self) {
          const p = self.progress; // 0 → 1

          /* ── Progress bar ── */
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: p });
          }

          /* ── Section header fade-out + lift on early scroll ── */
          if (headerRef.current) {
            const headerP = Math.min(1, p * (N - 1) * 2.5); // fade over first ~40% of first transition
            gsap.set(headerRef.current, {
              opacity: Math.max(0, 1 - headerP),
              y: -headerP * 40,
            });
          }

          /* ── Per-panel diagonal wipe ── */
          for (let i = 1; i < N; i++) {
            const segStart = (i - 1) / (N - 1);
            const segEnd   = i       / (N - 1);
            const segP = Math.max(0, Math.min(1, (p - segStart) / (segEnd - segStart)));

            /**
             * Diagonal "forward-slash" curtain:
             *   top-left  x: 100% → −5%   (top edge reveals first)
             *   bottom-left x: 100% → +5%  (bottom edge follows, creating ~10° slant)
             */
            const tlX = 100 - segP * 105; // 100 → -5
            const blX = 100 - segP * 95;  // 100 → +5

            if (panelRefs.current[i]) {
              gsap.set(panelRefs.current[i]!, {
                clipPath: `polygon(${tlX.toFixed(2)}% 0%, 100% 0%, 100% 100%, ${blX.toFixed(2)}% 100%)`,
              });
            }
          }

          /* ── Per-panel image parallax (subtle horizontal drift) ── */
          for (let i = 0; i < N; i++) {
            const localP = p * (N - 1) - i; // -i → (N-1-i)
            const clamped = Math.max(-1, Math.min(1, localP));
            /* image drifts ±5% over the panel's visible window */
            if (imgRefs.current[i]) {
              gsap.set(imgRefs.current[i]!, { xPercent: clamped * 5 });
            }
          }

          /* ── Active index for React state (content transitions) ── */
          const next = Math.min(N - 1, Math.round(p * (N - 1)));
          if (next !== activeIndexRef.current) {
            activeIndexRef.current = next;
            setActiveIndex(next);
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <>
      <Lightbox study={lightboxStudy} onClose={closeLightbox} />

      <section
        id="work"
        ref={sectionRef}
        style={{
          position: 'relative',
          /* N × 100vh: the sticky inner div pins for (N-1) × 100vh */
          height: `${N * 100}vh`,
          borderTop: '1px solid rgba(197,160,89,0.07)',
        }}
      >
        {/* ════════════════════════════════════════════════════
            STICKY VIEWPORT — the cinematic case viewer
        ════════════════════════════════════════════════════ */}
        <div
          ref={stickyRef}
          style={{
            position: 'sticky', top: 0, height: '100vh',
            overflow: 'hidden', background: '#030201',
          }}
        >
          {/* ── Top progress bar (GSAP-driven scaleX) ── */}
          <div
            ref={progressBarRef}
            aria-hidden
            style={{
              position: 'absolute', top: 0, left: 0, height: '2px', width: '100%',
              background: 'linear-gradient(to right, var(--color-accent-1), rgba(197,160,89,0.4))',
              transformOrigin: 'left',
              zIndex: 30,
            }}
          />

          {/* ── Photo panels (GSAP clip-path + parallax) ── */}
          {CASES.map((study, i) => (
            <PhotoPanel
              key={study.id}
              study={study}
              index={i}
              panelRef={(el) => { panelRefs.current[i] = el; }}
              imgRef={(el) => { imgRefs.current[i] = el; }}
            />
          ))}

          {/* ── Section header overlay (fades on scroll) ── */}
          <div
            ref={headerRef}
            aria-hidden={activeIndex > 0}
            style={{
              position: 'absolute',
              top: 'clamp(28px, 4vw, 56px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              textAlign: 'center',
              pointerEvents: activeIndex > 0 ? 'none' : 'auto',
              maxWidth: '560px',
              width: '100%',
              padding: '0 24px',
            }}
          >
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ display: 'block', height: '1px', width: '24px', background: 'var(--color-accent-1)', opacity: 0.5 }} />
              <span style={{
                fontSize: '0.55rem', letterSpacing: '0.38em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-accent-1)',
              }}>Our Work</span>
              <span style={{ display: 'block', height: '1px', width: '24px', background: 'var(--color-accent-1)', opacity: 0.5 }} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3.8vw, 4rem)',
              lineHeight: 1.04, letterSpacing: '-0.022em',
              color: '#F8F4EE', marginBottom: '0.75rem',
            }}>
              Moments That<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-accent-1)' }}>Define Legacy.</em>
            </h2>
            <p style={{
              fontSize: 'clamp(0.72rem, 0.88vw, 0.84rem)',
              fontFamily: 'var(--font-body)', fontWeight: 300,
              lineHeight: 1.85, color: 'rgba(255,255,255,0.40)',
            }}>
              Selected engagements across six continents — each one a study in precision,
              storytelling, and the art of leaving nothing to chance.
            </p>
          </div>

          {/* ── Content layer: animated per-case text ── */}
          <AnimatePresence mode="wait">
            <ContentLayer
              key={activeIndex}
              study={CASES[activeIndex]}
              index={activeIndex}
              onOpen={openLightbox}
            />
          </AnimatePresence>

          {/* ── Right-rail navigation dashes ── */}
          <div
            aria-label="Case navigation"
            style={{
              position: 'absolute',
              right: 'clamp(18px, 2.5vw, 40px)',
              top: '50%', transform: 'translateY(-50%)',
              zIndex: 20,
              display: 'flex', flexDirection: 'column',
              gap: '12px', alignItems: 'flex-end',
            }}
          >
            {CASES.map((_, i) => (
              <div
                key={i}
                style={{
                  height: '1px',
                  width: activeIndex === i ? '24px' : '8px',
                  background: activeIndex === i
                    ? 'var(--color-accent-1)'
                    : 'rgba(255,255,255,0.20)',
                  transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
                  transformOrigin: 'right',
                }}
              />
            ))}
          </div>

          {/* ── Bottom counter strip ── */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(20px, 3vw, 40px)',
            right: 'clamp(18px, 2.5vw, 40px)',
            zIndex: 20,
            display: 'flex', alignItems: 'baseline', gap: '6px',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
              fontWeight: 300, letterSpacing: '-0.01em',
              color: 'rgba(197,160,89,0.65)',
            }}>
              {pad(activeIndex)}
            </span>
            <span style={{
              fontSize: '0.5rem', letterSpacing: '0.20em',
              fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.18)',
            }}>
              / {pad(N - 1)}
            </span>
          </div>

          {/* ── Scroll hint (visible only on first panel) ── */}
          <AnimatePresence>
            {activeIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(20px, 3vw, 40px)',
                  left: '50%', transform: 'translateX(-50%)',
                  zIndex: 20,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '8px',
                  pointerEvents: 'none',
                }}
              >
                {/* Animated scroll dot */}
                <div style={{
                  width: '20px', height: '32px',
                  border: '1px solid rgba(197,160,89,0.30)',
                  borderRadius: '10px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <motion.div
                    style={{
                      position: 'absolute', top: '5px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '3px', height: '6px',
                      borderRadius: '2px',
                      background: 'var(--color-accent-1)',
                    }}
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <span style={{
                  fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.22)',
                }}>
                  Scroll
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Section footer (below pinned area, light background) ── */}
      <div style={{
        background: 'var(--color-bg)',
        borderTop: '1px solid rgba(197,160,89,0.07)',
        padding: 'clamp(40px, 5vw, 72px) clamp(20px, 4vw, 64px)',
      }}>
        <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.35), transparent)',
            marginBottom: 'clamp(24px, 3vw, 40px)',
          }} />
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{
              fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 300,
              letterSpacing: '0.04em', color: 'var(--color-text-muted)', lineHeight: 1.7,
            }}>
              200+ events. 18 countries. One standard: extraordinary.
            </p>
            <motion.a
              href="#contact"
              className="flex items-center gap-3 flex-shrink-0"
              style={{
                fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)', textDecoration: 'none',
              }}
              whileHover={{ x: 5, color: 'var(--color-accent-1)' }}
              transition={{ duration: 0.25 }}
            >
              Discuss Your Event
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                <path d="M1 4h16M12 1l5 3-5 3" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  );
}