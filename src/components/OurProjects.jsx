import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'
import ScribbleButton from './ScribbleButton'

// ── Data ─────────────────────────────────────────────────
const categories = ['All', 'Weddings', 'Corporate', 'Birthday', 'Product Launch']

const projects = [
  {
    id: 1,
    title: 'Luxury Wedding',
    category: 'Weddings',
    location: 'Burj Al Arab, Dubai',
    image: assetUrl('images/event1.jpg'),
  },
  {
    id: 2,
    title: 'Corporate Gala',
    category: 'Corporate',
    location: 'DIFC, Dubai',
    image: assetUrl('images/event2.jpg'),
  },
  {
    id: 3,
    title: 'Birthday Celebration',
    category: 'Birthday',
    location: 'Abu Dhabi',
    image: assetUrl('images/event3.jpg'),
  },
  {
    id: 4,
    title: 'Product Launch',
    category: 'Product Launch',
    location: 'Dubai Design District',
    image: assetUrl('images/event1.jpg'),
  },
]

// ── Filter pill ───────────────────────────────────────────
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '7px 16px',
      borderRadius: '100px',
      border: active ? '1px solid #1c1c1c' : '1px solid rgba(0,0,0,0.12)',
      background: active ? '#1c1c1c' : 'transparent',
      color: active ? '#fff' : '#888',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.22s ease',
      whiteSpace: 'nowrap',
      minHeight: '36px',
    }}
  >
    {label}
  </button>
)

// ── Mobile project row — full bleed image + text below ────
const MobileProjectCard = ({ project, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      ref={ref}
      href="/work"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Image — 3/2 ratio, full width */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/2',
        overflow: 'hidden',
        background: '#f0eeec',
      }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Category badge — top left */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          padding: '4px 10px',
          borderRadius: '100px',
        }}>
          {project.category}
        </span>
      </div>

      {/* Meta row */}
      <div style={{
        padding: '16px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div>
          <h3 className="font-serif" style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1c1c1c',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginBottom: '3px',
          }}>
            {project.title}
          </h3>
          <p style={{
            fontSize: '12px',
            color: '#aaa',
            letterSpacing: '0.04em',
          }}>
            {project.location}
          </p>
        </div>

        {/* Circle arrow */}
        <div style={{
          flexShrink: 0,
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="#1c1c1c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.a>
  )
}

// ── Desktop project card ──────────────────────────────────
const DesktopProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.a
      ref={ref}
      href="/work"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4/3',
        background: '#f0eeec',
        borderRadius: '3px',
      }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            filter: hovered ? 'brightness(0.78)' : 'brightness(0.92)',
          }}
        />

        {/* Category */}
        <span style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.28)',
          backdropFilter: 'blur(6px)',
          padding: '4px 10px',
          borderRadius: '100px',
        }}>
          {project.category}
        </span>

        {/* Arrow on hover */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '16px',
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div style={{ paddingTop: '14px' }}>
        <h3 className="font-serif" style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#1c1c1c',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          marginBottom: '4px',
        }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '12px', color: '#aaa', letterSpacing: '0.03em' }}>
          {project.location}
        </p>
      </div>
    </motion.a>
  )
}

// ── Main component ────────────────────────────────────────
export default function OurProjects() {
  const shouldReduceMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState('All')
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-5% 0px' })

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const headingVariants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  }

  return (
    <section id="our-projects" style={{ background: '#fff' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        ref={headerRef}
        variants={headingVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={headerInView ? 'show' : 'hidden'}
        style={{ padding: '56px 20px 32px' }}
        className="sm:px-6 lg:px-8"
      >
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <p style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#aaa',
            fontWeight: 500,
            marginBottom: '12px',
          }}>
            Projects
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.7rem, 4vw, 3rem)',
              fontWeight: 600,
              color: '#1c1c1c',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              maxWidth: '520px',
            }}>
              A gallery of recent rooms and builds.
            </h2>

            {/* Desktop CTA — lives in header, not a whole separate section */}
            <a
              href="/work"
              className="hidden md:inline-flex"
              style={{
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'rgba(0,0,0,0.4)',
                textDecoration: 'none',
                transition: 'color 0.22s ease',
                paddingBottom: '6px',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1c1c1c' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.4)' }}
            >
              View all case studies
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Filter strip ───────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <div
          className="mx-auto sm:px-6 lg:px-8"
          style={{
            maxWidth: '1280px',
            display: 'flex',
            gap: '8px',
            padding: '12px 20px',
          }}
        >
          {categories.map(cat => (
            <FilterPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────── */}
      <div className="mx-auto sm:px-6 lg:px-8" style={{ maxWidth: '1280px', padding: '0 0' }}>

        {/* MOBILE — full-width stacked cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + '-mobile'}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="md:hidden"
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            {filtered.map((project, i) => (
              <MobileProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* DESKTOP — clean 2 or 3-col grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + '-desktop'}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="hidden md:grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px 24px',
              padding: '40px 24px 56px',
            }}
          >
            {filtered.map((project, i) => (
              <DesktopProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile CTA ─────────────────────────────────── */}
      <div
        className="md:hidden"
        style={{
          padding: '32px 20px 48px',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <ScribbleButton
          to="/contact"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:bg-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Request a proposal
        </ScribbleButton>
        <ScribbleButton
          to="/work"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border text-ink px-6 py-3 text-sm font-semibold transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          View case studies
        </ScribbleButton>
      </div>

    </section>
  )
}
