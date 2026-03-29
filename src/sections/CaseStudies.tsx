/**
 * CaseStudies — Gallery / Portfolio Section
 * ─────────────────────────────────────────
 * Full 100vh+ section. Magazine-editorial masonry grid.
 * GSAP ScrollTrigger: staggered card reveals.
 * Framer Motion: hover micro-interactions, lightbox, parallax.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/Button';
import { fadeInUp, fadeIn, staggerContainer } from '@/animations/fadeInUp';

gsap.registerPlugin(ScrollTrigger);

// ── Types ────────────────────────────────────────────────

interface CaseStat {
  value: string;
  label: string;
}

interface CaseStudy {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  location: string;
  year: string;
  image: string;
  stats: CaseStat[];
}

// ── Data ─────────────────────────────────────────────────

const FEATURED_STUDY: CaseStudy = {
  id: 'grand-cascade',
  category: 'Gala & Awards',
  title: 'The Grand Cascade',
  subtitle:
    'A landmark luxury gala for 600 guests at Atlantis The Palm — reimagining the grand ballroom as a living waterfall of light and sound.',
  location: 'Dubai, UAE',
  year: '2024',
  image:
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1800&auto=format&fit=crop&q=85',
  stats: [
    { value: '600+', label: 'Guests' },
    { value: '3', label: 'Days' },
    { value: '14', label: 'Vendors' },
  ],
};

const GRID_STUDIES: CaseStudy[] = [
  {
    id: 'summit-edge',
    category: 'Corporate Retreat',
    title: 'Summit at the Edge',
    subtitle:
      'An executive leadership summit designed to inspire vision at altitude.',
    location: 'Davos, Switzerland',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80',
    stats: [
      { value: '120', label: 'Executives' },
      { value: '4', label: 'Days' },
      { value: '9', label: 'Speakers' },
    ],
  },
  {
    id: 'celestial-wedding',
    category: 'Luxury Wedding',
    title: 'Celestial Union',
    subtitle:
      'An otherworldly wedding ceremony beneath a canopy of 10,000 suspended crystal lights.',
    location: 'Amalfi Coast, Italy',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=80',
    stats: [
      { value: '280', label: 'Guests' },
      { value: '5', label: 'Days' },
      { value: '22', label: 'Artisans' },
    ],
  },
  {
    id: 'meridian-forum',
    category: 'Conference & Forum',
    title: 'The Meridian Forum',
    subtitle:
      'A two-day thought leadership forum redefining the future of global finance.',
    location: 'Singapore',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    stats: [
      { value: '450', label: 'Delegates' },
      { value: '2', label: 'Days' },
      { value: '18', label: 'Keynotes' },
    ],
  },
  {
    id: 'aurora-banquet',
    category: 'Brand Experience',
    title: 'The Aurora Banquet',
    subtitle:
      'A bespoke brand activation for a luxury fashion house — intimate, immersive, unforgettable.',
    location: 'Tromsø, Norway',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&auto=format&fit=crop&q=80',
    stats: [
      { value: '80', label: 'VIP Guests' },
      { value: '2', label: 'Nights' },
      { value: '7', label: 'Partners' },
    ],
  },
  {
    id: 'renaissance-gala',
    category: 'Gala & Awards',
    title: 'The Renaissance Gala',
    subtitle:
      'An art-inspired awards evening transforming a historic museum into an evening of living art.',
    location: 'Paris, France',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=80',
    stats: [
      { value: '350', label: 'Guests' },
      { value: '1', label: 'Night' },
      { value: '6', label: 'Awards' },
    ],
  },
];

// ── Sub-Components ────────────────────────────────────────

function GoldRule({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        height: '1px',
        background:
          'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
      }}
    />
  );
}

function CategoryTag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.6rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        color: 'var(--color-accent-1)',
        padding: '5px 10px',
        border: '1px solid rgba(197,160,89,0.45)',
        background: 'rgba(10,8,6,0.55)',
        backdropFilter: 'blur(6px)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {label}
    </span>
  );
}

// ── Featured / Hero Case Study ────────────────────────────

interface FeaturedStudyProps {
  study: CaseStudy;
  onOpen: (s: CaseStudy) => void;
}

function FeaturedStudy({ study, onOpen }: FeaturedStudyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* Image drifts up slightly as page scrolls — cinematic depth */
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden cursor-pointer group"
      style={{
        height: 'clamp(420px, 56vw, 700px)',
        borderRadius: 'var(--radius-md)',
      }}
      onClick={() => onOpen(study)}
      whileHover="hovered"
      initial="rest"
      animate="rest"
    >
      {/* Parallax image */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
        <motion.img
          src={study.image}
          alt={study.title}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: imgY, scale: 1.08 }}
          variants={{
            rest: { scale: 1.08 },
            hovered: { scale: 1.12 },
          }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Layered overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(10,8,6,0.72) 0%,
              rgba(10,8,6,0.36) 45%,
              rgba(10,8,6,0.10) 100%
            ),
            linear-gradient(
              to top,
              rgba(10,8,6,0.60) 0%,
              transparent 55%
            )
          `,
          borderRadius: 'inherit',
        }}
      />

      {/* Gold left edge accent */}
      <motion.div
        className="absolute left-0 top-8 bottom-8 w-0.5 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--color-accent-1), transparent)',
        }}
        variants={{
          rest: { opacity: 0.45, scaleY: 0.7 },
          hovered: { opacity: 0.85, scaleY: 1 },
        }}
        transition={{ duration: 0.45 }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-14">
        {/* Top row: category + year */}
        <div className="absolute top-8 left-8 md:left-12 lg:left-14 flex items-center gap-4">
          <CategoryTag label={study.category} />
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.38)',
            }}
          >
            {study.year}
          </span>
        </div>

        {/* Bottom: main content */}
        <div className="max-w-xl">
          <motion.h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#F8F4EE',
              marginBottom: '0.65rem',
            }}
            variants={{
              rest: { y: 0 },
              hovered: { y: -4 },
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {study.title}
          </motion.h3>

          <motion.p
            style={{
              fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.52)',
              marginBottom: '1.4rem',
              maxWidth: '380px',
            }}
            variants={{
              rest: { opacity: 0.52, y: 0 },
              hovered: { opacity: 0.75, y: -3 },
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {study.subtitle}
          </motion.p>

          {/* Meta row */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.7 3.5 6.5 3.5 6.5s3.5-3.8 3.5-6.5C9.5 2.57 7.93 1 6 1z"
                  stroke="rgba(197,160,89,0.7)"
                  strokeWidth="0.8"
                  fill="none"
                />
                <circle cx="6" cy="4.5" r="1" fill="rgba(197,160,89,0.7)" />
              </svg>
              <span
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {study.location}
              </span>
            </div>

            {study.stats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-accent-1)',
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(255,255,255,0.32)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* View arrow */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-12 lg:right-14 flex items-center gap-3"
          variants={{
            rest: { opacity: 0, x: 8 },
            hovered: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-accent-1)',
            }}
          >
            View Full Case
          </span>
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path
              d="M1 5h18M14 1l5 4-5 4"
              stroke="var(--color-accent-1)"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Grid Card ─────────────────────────────────────────────

interface StudyCardProps {
  study: CaseStudy;
  index: number;
  onOpen: (s: CaseStudy) => void;
}

// Wide cards span 2 columns
const WIDE_INDICES = new Set([0, 3]);
// Tall cards have more height
const HEIGHTS: Record<number, string> = {
  0: '380px',
  1: '280px',
  2: '320px',
  3: '360px',
  4: '260px',
};

function StudyCard({ study, index, onOpen }: StudyCardProps) {
  const isWide = WIDE_INDICES.has(index);
  const height = HEIGHTS[index] ?? '300px';
  const isOffset = index === 1 || index === 4; // slight vertical offset for editorial feel

  return (
    <motion.article
      className={`case-card relative overflow-hidden cursor-pointer group ${
        isWide ? 'md:col-span-2' : 'col-span-1'
      }`}
      style={{
        height,
        borderRadius: 'var(--radius-md)',
        marginTop: isOffset ? '24px' : '0',
        boxShadow: 'var(--shadow-medium)',
        willChange: 'transform',
      }}
      onClick={() => onOpen(study)}
      whileHover="hovered"
      initial="rest"
      animate="rest"
    >
      {/* Image with hover scale */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
        <motion.img
          src={study.image}
          alt={study.title}
          loading="lazy"
          className="w-full h-full object-cover"
          variants={{
            rest: { scale: 1.04 },
            hovered: { scale: 1.10 },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Base gradient — always visible, keeps text legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(10,8,6,0.70) 0%, rgba(10,8,6,0.22) 50%, transparent 100%)',
          borderRadius: 'inherit',
        }}
      />

      {/* Hover overlay — tinted accent wash */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(197,160,89,0.06)',
          borderRadius: 'inherit',
        }}
        variants={{
          rest: { opacity: 0 },
          hovered: { opacity: 1 },
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Bottom gold line — reveals on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--color-accent-1), transparent)',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        }}
        variants={{
          rest: { scaleX: 0, opacity: 0 },
          hovered: { scaleX: 1, opacity: 0.8 },
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Shadow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: 'inherit' }}
        variants={{
          rest: { boxShadow: 'var(--shadow-medium)' },
          hovered: { boxShadow: 'var(--shadow-deep)' },
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Category tag — top left */}
      <div className="absolute top-4 left-4">
        <CategoryTag label={study.category} />
      </div>

      {/* Year — top right */}
      <motion.span
        className="absolute top-4 right-4"
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          color: 'rgba(255,255,255,0.35)',
        }}
        variants={{
          rest: { opacity: 0.35 },
          hovered: { opacity: 0.65 },
        }}
      >
        {study.year}
      </motion.span>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2.4vw, 1.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: '#F8F4EE',
            marginBottom: '0.35rem',
          }}
          variants={{
            rest: { y: 0 },
            hovered: { y: -3 },
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {study.title}
        </motion.h4>

        <motion.div
          className="flex items-center gap-2"
          variants={{
            rest: { opacity: 0.5, y: 0 },
            hovered: { opacity: 0.8, y: -2 },
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.7 3.5 6.5 3.5 6.5s3.5-3.8 3.5-6.5C9.5 2.57 7.93 1 6 1z"
              stroke="rgba(197,160,89,0.7)"
              strokeWidth="0.8"
              fill="none"
            />
            <circle cx="6" cy="4.5" r="1" fill="rgba(197,160,89,0.7)" />
          </svg>
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-body)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {study.location}
          </span>
        </motion.div>
      </div>
    </motion.article>
  );
}

// ── Lightbox ──────────────────────────────────────────────

interface LightboxProps {
  study: CaseStudy | null;
  onClose: () => void;
}

function Lightbox({ study, onClose }: LightboxProps) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(10,8,6,0.92)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative flex flex-col lg:flex-row overflow-hidden w-full max-w-5xl max-h-[90vh]"
            style={{
              borderRadius: 'var(--radius-lg)',
              background: '#0E0C0A',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.12)',
            }}
            initial={{ scale: 0.93, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image panel */}
            <div className="relative flex-shrink-0 w-full lg:w-[58%] overflow-hidden" style={{ minHeight: '260px' }}>
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '260px', maxHeight: '580px' }}
              />
              {/* Gradient for text legibility on mobile */}
              <div
                className="absolute inset-0 lg:hidden"
                style={{
                  background: 'linear-gradient(to top, rgba(14,12,10,0.8) 0%, transparent 60%)',
                }}
              />
              {/* Top-left overlay tag */}
              <div className="absolute top-5 left-5">
                <CategoryTag label={study.category} />
              </div>
            </div>

            {/* Details panel */}
            <div
              className="flex flex-col justify-between p-7 md:p-10 w-full overflow-y-auto"
              style={{ minWidth: 0 }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    style={{
                      display: 'block',
                      height: '1px',
                      width: '28px',
                      background: 'var(--color-accent-1)',
                      opacity: 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(197,160,89,0.65)',
                    }}
                  >
                    {study.year} · {study.location}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 300,
                    lineHeight: 1.08,
                    letterSpacing: '-0.02em',
                    color: '#F8F4EE',
                    marginBottom: '1.1rem',
                  }}
                >
                  {study.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.50)',
                    marginBottom: '2rem',
                  }}
                >
                  {study.subtitle}
                </p>

                <GoldRule className="mb-5" />

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  {study.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                          fontWeight: 300,
                          letterSpacing: '-0.02em',
                          color: 'var(--color-accent-1)',
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-body)',
                          color: 'rgba(255,255,255,0.30)',
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <span
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  Press Esc to close
                </span>
                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-2"
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(197,160,89,0.65)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  whileHover={{ color: 'rgba(197,160,89,1)' }}
                >
                  Close
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4l8 8"
                      stroke="currentColor"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                    />
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

// ══════════════════════════════════════════════════════════
//   CASE STUDIES — Main Export
// ══════════════════════════════════════════════════════════

export function CaseStudies() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  const [lightboxStudy, setLightboxStudy] = useState<CaseStudy | null>(null);
  const openLightbox  = useCallback((s: CaseStudy) => setLightboxStudy(s), []);
  const closeLightbox = useCallback(() => setLightboxStudy(null), []);

  /* ── GSAP Scroll Reveals ────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header staggered entrance
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll('.hdr-anim');
        gsap.from(els, {
          opacity: 0,
          y: 36,
          stagger: 0.13,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Featured study entrance
      if (featuredRef.current) {
        gsap.from(featuredRef.current, {
          opacity: 0,
          y: 48,
          scale: 0.98,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Grid cards — staggered reveal
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.case-card');
        gsap.from(cards, {
          opacity: 0,
          y: 44,
          scale: 0.97,
          stagger: 0.12,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
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
        style={{
          background: 'var(--color-bg)',
          borderTop: '1px solid rgba(197,160,89,0.07)',
          paddingTop: 'clamp(80px, 9vw, 130px)',
          paddingBottom: 'clamp(80px, 9vw, 130px)',
        }}
      >
        {/* ── Subtle background texture ─────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 50% at 90% 20%, rgba(197,160,89,0.035) 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 10% 80%, rgba(197,160,89,0.025) 0%, transparent 60%)
            `,
          }}
        />

        <div
          className="relative mx-auto w-full"
          style={{ maxWidth: '1340px', padding: '0 clamp(20px, 5vw, 72px)' }}
        >

          {/* ════════════════════════════════════════════════
              SECTION HEADER
          ════════════════════════════════════════════════ */}
          <div
            ref={headerRef}
            className="mb-12 md:mb-16"
            style={{ maxWidth: '640px' }}
          >
            {/* Eyebrow */}
            <div className="hdr-anim flex items-center gap-4 mb-6">
              <span
                style={{
                  display: 'block',
                  height: '1px',
                  width: '36px',
                  background: 'var(--color-accent-1)',
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  color: 'var(--color-accent-1)',
                }}
              >
                Our Work
              </span>
            </div>

            {/* Headline */}
            <h2
              className="hdr-anim"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                fontWeight: 300,
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                marginBottom: '1.1rem',
              }}
            >
              Moments That<br />
              <em
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-accent-1)',
                }}
              >
                Define Legacy.
              </em>
            </h2>

            {/* Subtext */}
            <p
              className="hdr-anim"
              style={{
                fontSize: 'clamp(0.82rem, 1.1vw, 0.9rem)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'var(--color-text-muted)',
                maxWidth: '380px',
              }}
            >
              Selected engagements across six continents — each one a study
              in precision, storytelling, and the art of leaving nothing to chance.
            </p>
          </div>

          {/* ════════════════════════════════════════════════
              FEATURED CASE STUDY
          ════════════════════════════════════════════════ */}
          <div ref={featuredRef} className="mb-5">
            <FeaturedStudy study={FEATURED_STUDY} onOpen={openLightbox} />
          </div>

          {/* ════════════════════════════════════════════════
              GRID
          ════════════════════════════════════════════════ */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ alignItems: 'start' }}
          >
            {GRID_STUDIES.map((study, i) => (
              <StudyCard
                key={study.id}
                study={study}
                index={i}
                onOpen={openLightbox}
              />
            ))}
          </div>

          {/* ════════════════════════════════════════════════
              CTA ROW
          ════════════════════════════════════════════════ */}
          <motion.div
            className="mt-14 md:mt-18 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left copy */}
            <div>
              <GoldRule className="mb-4 w-24" />
              <p
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.7,
                }}
              >
                200+ events. 18 countries. One standard: extraordinary.
              </p>
            </div>

            {/* Right CTA */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Button variant="gold" size="md">
                All Case Studies
              </Button>

              <motion.a
                href="#contact"
                className="flex items-center gap-2.5"
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                }}
                whileHover={{ x: 4, color: 'var(--color-accent-1)' }}
                transition={{ duration: 0.22 }}
              >
                <span>Discuss Your Event</span>
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path
                    d="M1 5h16M12 1l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}