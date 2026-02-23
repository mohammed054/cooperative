/**
 * HomeScenes.jsx — MOBILE-FIRST MOTION REBUILD
 *
 * All animations use direct whileInView on each element.
 * No parent-child variant propagation (unreliable on mobile).
 * viewport={{ once: true, amount: 0.1 }} — works at all breakpoints.
 * Ease: cubic-bezier(.22,.61,.36,1) throughout.
 *
 * Section 2 (AuthorityLedgerScene) — now uses tone:'steel' (light).
 * All sections animate. No section is dark unless explicitly coded.
 */

import React, { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import ScribbleButton from '../ScribbleButton'
import {
  HeroAmbientCanvas,
  SceneShell,
  SceneWrapper,
  ScrollLockedSection,
  useProgress,
} from '../flagship'
import {
  caseStudies,
  services,
  testimonials as testimonialData,
} from '../../data/siteData'
import { assetUrl } from '../../lib/assetUrl'
import { isLeadCaptureConfigured, submitLead } from '../../utils/leadCapture'

// ---------------------------------------------------------------------------
// MOTION CONSTANTS — mobile-first
// ---------------------------------------------------------------------------

const EASE = [0.22, 0.61, 0.36, 1]
const DUR = { fast: 0.6, base: 0.8, slow: 1.0, cinematic: 1.1 }
const VP = { once: true, amount: 0.1 } // low threshold — fires early on mobile
const VP_CARD = { once: true, amount: 0.05 }

/** Standard entrance: opacity 0→1, y 40→0, blur 6→0 */
const enterFrom = (delay = 0, distance = 40) => ({
  initial: { opacity: 0, y: distance, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: VP,
  transition: { duration: DUR.base, ease: EASE, delay },
})

/** Card variant (staggered): y 60→0, scale 0.97→1, blur 6→0 */
const cardEnter = (delay = 0) => ({
  initial: { opacity: 0, y: 60, scale: 0.97, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  viewport: VP_CARD,
  transition: { duration: DUR.base, ease: EASE, delay },
})

/** Narrative text: scale 1.02→1, y 20→0 */
const narrativeEnter = {
  initial: { opacity: 0, y: 20, scale: 1.02 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: VP,
  transition: { duration: DUR.cinematic, ease: EASE },
}

/** Testimonial: y 40→0, scale 0.95→1 */
const testimonialEnter = (delay = 0) => ({
  initial: { opacity: 0, y: 40, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: VP,
  transition: { duration: DUR.fast, ease: EASE, delay },
})

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const FREE = 'free'
const PINNED = 'pinned'
const clampIndex = (v, max) => Math.max(0, Math.min(max, v))

const PROJECTS = caseStudies.slice(0, 3).map((project, i) => ({
  id: `case-${String(i + 1).padStart(2, '0')}`,
  title: project.title,
  subtitle: project.summary,
  challenge: project.challenge,
  outcome: project.results?.[0] || 'Delivered without timeline drift.',
  image: project.image,
  location: project.location,
  slug: project.slug,
}))

const CAPABILITY_MODULES = services.slice(0, 3).map((service, i) => ({
  id: service.slug,
  title: service.title,
  summary: service.summary,
  standards: service.standards?.slice(0, 2) || [],
  image:
    [
      assetUrl('images/full-production.png'),
      assetUrl('images/lighting-effects.png'),
      assetUrl('images/av-setup.png'),
    ][i] || assetUrl('images/full-production.png'),
}))

const TESTIMONIALS = testimonialData
  .filter(t => t?.name && t?.quote)
  .slice(0, 3)
  .map((t, i) => ({
    id: t.id || `testimonial-${String(i + 1).padStart(2, '0')}`,
    name: t.name,
    role: t.role,
    organization: t.company,
    quote: t.quote,
    context: t.project,
    image: caseStudies[i]?.image || PROJECTS[i % PROJECTS.length]?.image,
  }))

const parseMetricValue = raw => {
  const d = String(raw || '').match(/\d+/g)
  return d ? Number(d.join('')) : 0
}

const AUTHORITY_METRICS = [
  { label: 'Events Delivered', value: caseStudies.length, suffix: '' },
  {
    label: 'Guests Managed',
    value: caseStudies.reduce((sum, s) => {
      const stat = s.stats?.find(x => /guest/i.test(x.label))
      return sum + parseMetricValue(stat?.value)
    }, 0),
    suffix: '+',
  },
  {
    label: 'Cue Volume',
    value: caseStudies.reduce((sum, s) => {
      const stat = s.stats?.find(x => /cue|reset|phase|act|screen/i.test(x.label))
      return sum + parseMetricValue(stat?.value)
    }, 0),
    suffix: '+',
  },
  { label: 'Verified Testimonials', value: TESTIMONIALS.length, suffix: '' },
]

const buildHeight = vh => `${vh}vh`

// ---------------------------------------------------------------------------
// SHARED HELPERS
// ---------------------------------------------------------------------------

const CountUpMetric = ({ value, suffix = '', reduced }) => {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (!isInView || reduced) return undefined
    const dur = 920
    const start = performance.now()
    let fid = 0
    const tick = now => {
      const p = Math.min(1, (now - start) / dur)
      setDisplay(Math.round(value * (1 - (1 - p) ** 3)))
      if (p < 1) fid = requestAnimationFrame(tick)
    }
    fid = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(fid)
  }, [isInView, reduced, value])

  return (
    <span ref={ref}>
      {reduced ? value : display}
      {suffix}
    </span>
  )
}

const SceneCard = ({ children, className = '', ...rest }) => (
  <div
    className={`cinematic-scene-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/88 p-4 shadow-[0_20px_46px_rgba(8,12,20,0.18)] backdrop-blur-[2px] ${className}`}
    {...rest}
  >
    {children}
  </div>
)

const SceneTransitionHook = ({ scene, position = 'post' }) => (
  <div
    aria-hidden="true"
    className={`scene-transition-hook scene-transition-hook-${position}`}
    data-scene-id={scene.id}
    data-theme="light"
    data-transition-ready={String(Boolean(scene.transitionReady))}
  />
)

// AmbientDepthField — gated by useInView so GPU isn't wasted off-screen
const AmbientDepthField = ({
  reduced,
  variant = 'core',
  backgroundY = 0,
  midY = 0,
  foregroundY = 0,
  glowOpacity = 0.5,
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.1 })
  return (
    <div ref={ref} aria-hidden="true" className={`scene-ambient-field scene-ambient-${variant}`}>
      <motion.span
        className="scene-ambient-layer scene-ambient-back"
        style={reduced ? undefined : { y: backgroundY }}
        animate={reduced || !inView ? undefined : {
          opacity: [glowOpacity * 0.84, glowOpacity, glowOpacity * 0.8],
          scale: [1, 1.035, 1],
        }}
        transition={{ duration: 7.8, ease: EASE, repeat: Infinity }}
      />
      <motion.span
        className="scene-ambient-layer scene-ambient-mid"
        style={reduced ? undefined : { y: midY }}
        animate={reduced || !inView ? undefined : { x: [0, 14, 0], opacity: [0.24, 0.36, 0.24] }}
        transition={{ duration: 6.2, ease: EASE, repeat: Infinity }}
      />
      <motion.span
        className="scene-ambient-layer scene-ambient-front"
        style={reduced ? undefined : { y: foregroundY }}
        animate={reduced || !inView ? undefined : { x: [0, -10, 0], opacity: [0.14, 0.26, 0.14] }}
        transition={{ duration: 5.2, ease: EASE, repeat: Infinity }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// FRAME WRAPPERS
// ---------------------------------------------------------------------------

const FreeSceneFrame = ({ scene, pinBehavior, layout, className = '', children }) => {
  const reduced = useReducedMotion()
  const frameRef = useRef(null)

  // Single useScroll per scene — tracks this scene's position in the master scroll.
  // offset ['start end', 'end start']: progress=0 when scene top hits viewport bottom,
  // progress=1 when scene bottom hits viewport top.
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })

  // Cinematic enter: fade up from 0 opacity + subtle scale lift
  // Cinematic exit: very gentle opacity pull (not full black — avoids gap between scenes)
  const opacity = useTransform(scrollYProgress, [0, 0.07, 0.88, 1], [0, 1, 1, 0.82])
  const scale   = useTransform(scrollYProgress, [0, 0.07, 0.9, 1],  [0.978, 1, 1, 1.009])
  const yShift  = useTransform(scrollYProgress, [0, 0.10],          [28, 0])

  const content = typeof children === 'function' ? children({ reduced }) : children
  return (
    <>
      {/* motion.div owns the cinematic enter/exit — SceneWrapper content is unaffected */}
      <motion.div
        ref={frameRef}
        style={reduced ? undefined : { opacity, scale, y: yShift }}
      >
        <SceneWrapper
          id={scene.id}
          tone={scene.tone}
          theme="light"
          transitionReady={scene.transitionReady}
          minHeight={buildHeight(scene.length)}
          className={className}
        >
          <SceneShell scene={scene} scrollMode={FREE} pinBehavior={pinBehavior} layout={layout}>
            {content}
          </SceneShell>
        </SceneWrapper>
      </motion.div>
      <SceneTransitionHook scene={scene} position="post" />
    </>
  )
}

const PinnedSceneFrame = ({ scene, pinBehavior, layout, className = '', children }) => (
  <>
    {/* ScrollLockedSection provides: scroll spacer (height=scene.length) + sticky pin + live progress */}
    <ScrollLockedSection
      id={scene.id}
      tone={scene.tone}
      theme="light"
      transitionReady={scene.transitionReady}
      height={buildHeight(scene.length)}
      className={className}
    >
      {(progress, reduced) => (
        <SceneShell scene={scene} scrollMode={PINNED} pinBehavior={pinBehavior} layout={layout}>
          {typeof children === 'function' ? children({ progress, reduced }) : children}
        </SceneShell>
      )}
    </ScrollLockedSection>
    <SceneTransitionHook scene={scene} position="post" />
  </>
)

// ---------------------------------------------------------------------------
// SIGNATURE REEL CONTENT
// ---------------------------------------------------------------------------

const SignatureReelContent = () => {
  const { progress, reduced } = useProgress()
  const mobileTrackRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const [manualIndex, setManualIndex] = useState(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const prevRef = useRef(0)

  useMotionValueEvent(progress, 'change', latest => {
    const next = clampIndex(Math.floor(latest * PROJECTS.length), PROJECTS.length - 1)
    if (next !== prevRef.current) {
      prevRef.current = next
      setScrollIndex(next)
      setManualIndex(null)
    }
  })

  const manualOk = typeof manualIndex === 'number' && Math.abs(scrollIndex - manualIndex) <= 1
  const selectedIndex = manualOk ? manualIndex : scrollIndex
  const selected = PROJECTS[selectedIndex]
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < PROJECTS.length - 1

  const backgroundY = useTransform(progress, v => reduced ? 0 : (0.5 - v) * 24 * 0.95)
  const headerOpacity = useTransform(progress, [0, 0.1], [0, 1])
  const headerY = useTransform(progress, [0, 0.12], [60, 0])
  const headerScale = useTransform(progress, [0, 0.12], [0.97, 1])

  useEffect(() => () => { if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current) }, [])

  const selectProject = index => {
    const c = clampIndex(index, PROJECTS.length - 1)
    setManualIndex(c)
    if (!mobileTrackRef.current) return
    const t = mobileTrackRef.current.querySelector(`[data-project-index="${c}"]`)
    if (t) t.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  const syncMobile = () => {
    if (!mobileTrackRef.current) return
    const items = Array.from(mobileTrackRef.current.querySelectorAll('[data-project-index]'))
    if (!items.length) return
    const cr = mobileTrackRef.current.getBoundingClientRect()
    let ci = 0, cd = Infinity
    items.forEach(n => {
      const idx = Number(n.getAttribute('data-project-index'))
      const d = Math.abs(n.getBoundingClientRect().left - cr.left)
      if (d < cd) { cd = d; ci = idx }
    })
    if (isFinite(ci) && ci !== manualIndex) setManualIndex(clampIndex(ci, PROJECTS.length - 1))
  }

  const onMobileScroll = () => {
    if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current)
    scrollFrameRef.current = requestAnimationFrame(() => { scrollFrameRef.current = 0; syncMobile() })
  }

  const STBTN = {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
    transition: 'color 0.2s',
    WebkitTapHighlightColor: 'transparent',
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%' }}>
      {/* Header — card rise (scroll-linked) */}
      <motion.div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(16,15,13,0.1)', paddingBottom: '1.4rem',
          opacity: headerOpacity, y: headerY, scale: headerScale,
        }}
      >
        <p className="lux-eyebrow-muted">Featured Engagements</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--lux-ink-subtle)', letterSpacing: '0.04em' }}>
          <span style={{ color: 'var(--lux-gold)' }}>{String(selectedIndex + 1).padStart(2, '0')}</span>
          {' / '}{String(PROJECTS.length).padStart(2, '0')}
        </p>
      </motion.div>

      {/* Body */}
      <div style={{ display: 'grid', minHeight: 0, padding: 'clamp(2.2rem, 4.5vh, 3.8rem) 0' }} className="md:grid-cols-[0.48fr_0.52fr] md:gap-12 lg:gap-16">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: DUR.fast + 0.06, ease: EASE }}
              style={{ display: 'grid', gap: '1.1rem' }}
            >
              <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--lux-gold)', opacity: 0.8 }}>{selected.location}</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 4rem)', lineHeight: 1.0, letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--color-ink)' }}>{selected.title}</h2>
              <div style={{ width: '2.2rem', height: '1px', background: 'var(--lux-gold)', opacity: 0.5 }} />
              <p style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', lineHeight: 1.74, color: 'var(--lux-ink-muted)', maxWidth: '36ch' }}>{selected.challenge}</p>
              <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lux-ink-subtle)' }}>{selected.outcome}</p>
            </motion.div>
          </AnimatePresence>
          <div style={{ marginTop: '2.4rem' }}>
            <Link to={`/work/${selected.slug}`} className="lux-cta-dark">
              View Case Study
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>

        {/* Image — desktop, parallax 0.95 */}
        <div className="hidden md:block" style={{ position: 'relative', overflow: 'hidden', minHeight: '320px' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={selected.id}
              src={selected.image}
              alt={selected.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', y: backgroundY }}
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: DUR.fast + 0.1, ease: EASE }}
            />
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(160deg, rgba(10,9,7,0.04) 0%, rgba(10,9,7,0.24) 100%)' }} />
        </div>

        {/* Mobile rail */}
        <div className="md:hidden">
          <div
            ref={mobileTrackRef}
            style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollSnapType: 'x mandatory', touchAction: 'pan-x', paddingBottom: '0.25rem', WebkitOverflowScrolling: 'touch' }}
            onScroll={onMobileScroll}
            role="region"
            aria-label="Signature projects"
          >
            {PROJECTS.map((p, i) => (
              <div
                key={`mob-${p.id}`}
                data-project-index={i}
                style={{ position: 'relative', minWidth: '78vw', scrollSnapAlign: 'start', overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => selectProject(i)}
                role="button" tabIndex={0}
              >
                <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 36%, rgba(4,6,10,0.88) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, padding: '1rem' }}>
                  <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(181,146,79,0.8)', marginBottom: '0.3rem' }}>{p.location}</p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'white' }}>{p.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.2rem', fontSize: '0.92rem', lineHeight: 1.74, color: 'var(--lux-ink-muted)' }}>{selected.challenge}</p>
          <div style={{ marginTop: '1.4rem' }}>
            <Link to={`/work/${selected.slug}`} className="lux-cta-dark">
              View Case Study
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(16,15,13,0.1)', paddingTop: '1.2rem' }}>
        <button
          onClick={() => selectProject(selectedIndex - 1)} disabled={!hasPrev}
          aria-label="Previous project"
          style={{ ...STBTN, color: hasPrev ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)', cursor: hasPrev ? 'pointer' : 'not-allowed' }}
          onMouseEnter={e => { if (hasPrev) e.currentTarget.style.color = 'var(--lux-gold)' }}
          onMouseLeave={e => { e.currentTarget.style.color = hasPrev ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Previous
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {PROJECTS.map((_, i) => (
            <button key={i} onClick={() => selectProject(i)} aria-label={`Project ${i + 1}`}
              style={{ position: 'relative', width: i === selectedIndex ? '2rem' : '0.5rem', height: '1px', background: i === selectedIndex ? 'var(--lux-gold)' : 'rgba(16,15,13,0.18)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.36s ease', minHeight: '20px', WebkitTapHighlightColor: 'transparent' }}
            />
          ))}
        </div>
        <button
          onClick={() => selectProject(selectedIndex + 1)} disabled={!hasNext}
          aria-label="Next project"
          style={{ ...STBTN, color: hasNext ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)', cursor: hasNext ? 'pointer' : 'not-allowed' }}
          onMouseEnter={e => { if (hasNext) e.currentTarget.style.color = 'var(--lux-gold)' }}
          onMouseLeave={e => { e.currentTarget.style.color = hasNext ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)' }}
        >
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2.5L9.5 7 5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// COMMAND ARRIVAL — HERO
// ---------------------------------------------------------------------------

export const CommandArrivalScene = ({ scene, nextScene }) => {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)

  const mediaRef = scene?.videoSrc || scene?.media?.ref
  const heroSrc = Array.isArray(mediaRef) ? mediaRef[0] : mediaRef
  const headline = scene?.headline || 'We command public moments where failure is visible and expensive.'
  const subtitle = scene?.subtitle || 'Ghaim unifies narrative direction, technical systems, and floor authority for executive events that cannot miss timing, clarity, or impact.'
  const ctaText = scene?.ctaText || 'See Signature Builds'

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const heroExitOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0.85])

  // Headline: split into display lines
  const rawLines = headline.split(/\.\s+|[\n]/g).filter(Boolean)
  const lines = rawLines.length > 1
    ? rawLines.map((l, i) => i < rawLines.length - 1 ? l + '.' : l)
    : [headline]

  return (
    <>
      <motion.section
        ref={sectionRef}
        id={scene.id}
        data-scene-id={scene.id}
        className="scene-depth-stage-hero-full flagship-scene-deep"
        style={{ position: 'relative', isolation: 'isolate', opacity: reduced ? 1 : heroExitOpacity }}
        // Entire section entrance: opacity 0→1, y 30→0, 0.9s
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <AmbientDepthField reduced={reduced} variant="hero" glowOpacity={0.58} />

        <div className="absolute inset-0 z-0">
          <video
            className="hero-command-video h-full w-full object-cover"
            src={heroSrc}
            preload="metadata"
            muted loop playsInline autoPlay
          />
        </div>

        <HeroAmbientCanvas />
        <div className="hero-volumetric-layer" />
        <div className="hero-particle-layer" />
        <div className="hero-vignette-layer" />
        <div className="hero-dof-layer" />
        <div className="hero-command-soften-layer" />

        {/* Radial accent overlay — 5% opacity */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background: 'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(181,146,79,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="hero-lens-warmtint" aria-hidden="true" />
        <div className="hero-parallax-shimmer" aria-hidden="true" />

        {/* Content — interactive, fully clickable */}
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-4 sm:px-6 md:px-10 lg:px-14">
          <div className="w-[90%] sm:w-[82%] lg:w-[40%] max-w-none">
            <div className="inline-flex max-w-full flex-col p-1">

              {/* Eyebrow — delay 0.1s */}
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.1 }}
                className="text-xs uppercase tracking-[0.18em] text-white/80"
              >
                Executive Event Command
              </motion.p>

              {/* Headline — line-by-line, stagger 0.12s */}
              <h1 className="mt-4 max-w-[16ch] font-serif text-[clamp(1.9rem,7.8vw,5.4rem)] leading-[0.98] tracking-[-0.03em] text-white">
                {lines.map((line, i) => (
                  <motion.span
                    key={i}
                    style={{ display: 'block' }}
                    initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: DUR.base, ease: EASE, delay: 0.22 + i * 0.12 }}
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              {/* Subtitle — blur to focus */}
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.22 + lines.length * 0.12 + 0.08 }}
                className="mt-5 max-w-[38ch] text-[clamp(0.98rem,2.15vw,1.45rem)] leading-relaxed text-white/90"
              >
                {subtitle}
              </motion.p>

              {/* CTA — y 40→0, scale 0.96→1 */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.22 + lines.length * 0.12 + 0.22 }}
                className="mt-8"
                style={{ position: 'relative', zIndex: 30, display: 'inline-block' }}
              >
                <ScribbleButton
                  title="Open flagship case reel and signature builds"
                  variant="primary"
                  tone="light"
                  size="md"
                  to="/work"
                  analyticsLabel="hero-signature-work"
                >
                  {ctaText}
                </ScribbleButton>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Authority Ledger fades in simultaneously as hero exits */}
      {nextScene ? <AuthorityLedgerScene scene={nextScene} /> : null}
    </>
  )
}

// ---------------------------------------------------------------------------
// AUTHORITY LEDGER — SECTION 2 (LIGHT — tone:steel)
// ---------------------------------------------------------------------------

export const AuthorityLedgerScene = ({ scene, embedded = false }) => {
  const depthRef = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: depthRef, offset: ['start end', 'end start'] })

  const backgroundY = embedded ? 0 : useTransform(scrollYProgress, [0, 1], [30, -20])
  const midY = embedded ? 0 : useTransform(scrollYProgress, [0, 1], [18, -14])
  const foregroundY = embedded ? 0 : useTransform(scrollYProgress, [0, 1], [8, -8])

  const heading = scene?.headline || 'Outcome authority before visual theater.'
  const body = scene?.subtitle || 'Executive productions stay trusted when timing, technical certainty, and delivery control are visible before the spotlight turns on.'

  const ledgerBody = r => (
    <div
      ref={depthRef}
      className="authority-ledger scene-depth-stage scene-depth-stage-ledger"
      // Explicit light background — prevents any inherited dark tone
      style={{ background: 'transparent' }}
    >
      <AmbientDepthField reduced={r} variant="ledger" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.32} />

      <div className="authority-ledger-shell relative z-[2]">
        {/* Heading — direct whileInView (mobile-first) */}
        <motion.header
          {...(embedded || r ? {} : enterFrom(0, 20))}
          className="authority-ledger-intro"
        >
          <p className="authority-ledger-eyebrow text-[11px] uppercase tracking-[0.17em] text-[var(--color-ink-subtle)]">Performance Record</p>
          <h2 className="authority-ledger-heading mt-4 font-serif leading-[1.02] text-[var(--color-ink)]">{heading}</h2>
          <p className="authority-ledger-subcopy mt-4 text-[var(--color-ink-muted)]">{body}</p>
        </motion.header>

        {/* Metrics — stagger 0.12s */}
        <div className="authority-ledger-metrics-grid">
          {AUTHORITY_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              {...(embedded || r ? {} : {
                initial: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
                whileInView: { opacity: 1, clipPath: 'inset(0 0 0% 0 round 18px)' },
                viewport: VP,
                transition: { duration: DUR.base, ease: EASE, delay: i * 0.12 },
              })}
            >
              <SceneCard className="authority-ledger-card authority-ledger-metric p-4 md:p-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">{metric.label}</p>
                <p className="authority-ledger-metric-value mt-3 font-serif leading-none text-[var(--color-ink)]">
                  <CountUpMetric value={metric.value} suffix={metric.suffix} reduced={r} />
                </p>
              </SceneCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          {...(embedded || r ? {} : enterFrom(0.24, 14))}
          className="authority-ledger-cta"
        >
          <ScribbleButton
            title="Open capability and delivery portfolio"
            variant="outline"
            tone="dark"
            size="md"
            to="/services"
            analyticsLabel="authority-ledger-capabilities"
          >
            Explore Capabilities
          </ScribbleButton>
        </motion.div>
      </div>
    </div>
  )

  if (embedded) return ledgerBody(reduced)

  return (
    <FreeSceneFrame scene={scene} pinBehavior="evidence-ramp" layout="authority-ledger" className="scene-cinematic scene-authority-ledger">
      {({ reduced: r }) => ledgerBody(r)}
    </FreeSceneFrame>
  )
}

// ---------------------------------------------------------------------------
// SIGNATURE REEL — pinned
// ---------------------------------------------------------------------------

export const SignatureReelScene = ({ scene }) => (
  <PinnedSceneFrame scene={scene} pinBehavior="command-aperture-lock" layout="command-aperture" className="scene-cinematic scene-signature-reel">
    <SignatureReelContent />
  </PinnedSceneFrame>
)

// ---------------------------------------------------------------------------
// CAPABILITY MATRIX
// ---------------------------------------------------------------------------

export const CapabilityMatrixScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} pinBehavior="matrix-reveal" layout="capability-matrix" className="scene-cinematic scene-capability-matrix">
    {({ reduced }) => (
      <div>
        {/* Header — direct whileInView */}
        <motion.div {...(reduced ? {} : cardEnter(0))} className="mb-14 lg:mb-20">
          <p className="lux-eyebrow-muted mb-5">Capabilities</p>
          <div className="lux-rule mb-7" />
          <h2 className="lux-display text-[var(--color-ink)]" style={{ maxWidth: '16ch' }}>
            Technical depth,<br />creative precision,<br />operational control.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1rem' }}>
            <Link to="/services" className="lux-cta-dark-outline">
              All Services
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </motion.div>

        {/* Capability rows — stagger 0.12s */}
        {CAPABILITY_MODULES.map((module, i) => (
          <motion.div
            key={module.id}
            {...(reduced ? {} : cardEnter(i * 0.12))}
            className="lux-capability-row group"
          >
            <p className="lux-capability-num">{String(i + 1).padStart(2, '0')}</p>
            <div style={{ display: 'grid', gap: '0.55rem', paddingBottom: '0.5rem' }}>
              <h3 className="lux-section-head text-[var(--color-ink)]" style={{ letterSpacing: '-0.03em' }}>{module.title}</h3>
              <p style={{ fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.72, color: 'var(--lux-ink-muted)', maxWidth: '54ch' }}>{module.summary}</p>
              {module.standards?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 2rem', marginTop: '0.5rem' }}>
                  {module.standards.map(s => (
                    <span key={s} style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lux-ink-subtle)' }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden lg:block" style={{ width: '140px', flexShrink: 0, overflow: 'hidden' }}>
              <img
                src={module.image} alt={module.title} loading="lazy" decoding="async"
                style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', filter: 'grayscale(0.22)', transition: 'filter 0.5s ease, transform 0.6s cubic-bezier(0.22,0.61,0.36,1)' }}
                className="group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </motion.div>
        ))}

        <div className="lux-rule-full mt-0" style={{ borderColor: 'rgba(16,15,13,0.1)' }} />
        <motion.div {...(reduced ? {} : enterFrom(0.1, 12))} className="mt-8 lg:hidden">
          <Link to="/services" className="lux-cta-dark-outline">
            All Services
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </motion.div>
      </div>
    )}
  </FreeSceneFrame>
)

// ---------------------------------------------------------------------------
// NARRATIVE BRIDGE
// ---------------------------------------------------------------------------

export const NarrativeBridgeScene = ({ scene }) => {
  const depthRef = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: depthRef, offset: ['start end', 'end start'] })
  // Parallax rate 0.8 — slower than scroll (slow-motion feel)
  const textY = useTransform(scrollYProgress, [0, 1], [18 * 0.8, -18 * 0.8])
  const bgY = useTransform(scrollYProgress, [0, 1], [10 * 0.8, -10 * 0.8])

  return (
    <FreeSceneFrame scene={scene} pinBehavior="calm-release" layout="narrative-bridge" className="scene-cinematic scene-narrative-bridge">
      {({ reduced: r }) => (
        <>
          {/* Accent tint overlay — 3% opacity */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(181,146,79,0.03) 0%, transparent 70%)' }} />
          <div className="cine-scene-glow cine-scene-glow-warm" aria-hidden="true" />
          <motion.div ref={depthRef} style={r ? undefined : { y: bgY, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(3rem, 8vh, 6rem) 0' }}>
              {/* Scale 1.02→1 + opacity, parallax text */}
              <motion.div
                {...(r ? {} : narrativeEnter)}
                style={r ? undefined : { y: textY }}
              >
                <div className="lux-rule" style={{ margin: '0 auto 2.4rem' }} />
                <p className="lux-eyebrow-light" style={{ marginBottom: '2rem', color: 'rgba(181,146,79,0.7)' }}>Outcome Transition</p>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)', lineHeight: 1.04, letterSpacing: '-0.04em', fontWeight: 500, maxWidth: '18ch', margin: '0 auto', color: 'var(--color-ink)' }}>
                  Precision is only credible when proof carries the weight.
                </h2>
                <p style={{ marginTop: '2.2rem', maxWidth: '44ch', marginInline: 'auto', fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)', lineHeight: 1.74, color: 'var(--lux-ink-muted)' }}>
                  The next chapter shifts from directional language to verified outcomes, named stakeholders, and delivery context.
                </p>
                <div className="lux-rule" style={{ margin: '2.6rem auto 0' }} />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </FreeSceneFrame>
  )
}

// ---------------------------------------------------------------------------
// PROOF THEATER — Testimonials
// ---------------------------------------------------------------------------

const ProofTheaterSplit = ({ reduced }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [entryDir, setEntryDir] = useState(1)
  const touchStartX = useRef(null)
  const touchDelta = useRef(0)
  const safe = clampIndex(activeIndex, Math.max(TESTIMONIALS.length - 1, 0))
  const active = TESTIMONIALS[safe]
  const hasPrev = safe > 0
  const hasNext = safe < TESTIMONIALS.length - 1

  const goPrev = () => { setEntryDir(-1); setActiveIndex(i => clampIndex(i - 1, TESTIMONIALS.length - 1)) }
  const goNext = () => { setEntryDir(1); setActiveIndex(i => clampIndex(i + 1, TESTIMONIALS.length - 1)) }

  const onTouchStart = e => { touchStartX.current = e.touches[0]?.clientX ?? null; touchDelta.current = 0 }
  const onTouchMove = e => { if (touchStartX.current === null) return; touchDelta.current = (e.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current }
  const onTouchEnd = () => {
    if (touchStartX.current === null) return
    if (touchDelta.current <= -46) goNext()
    if (touchDelta.current >= 46) goPrev()
    touchStartX.current = null; touchDelta.current = 0
  }

  if (!active) return null

  const NAVBTN = (disabled) => ({
    width: '44px', height: '44px', // larger touch target
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: '1px solid rgba(16,15,13,0.14)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.25 : 1,
    transition: 'border-color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  })

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ paddingTop: 'clamp(3rem, 5vh, 4.5rem)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={reduced ? false : { opacity: 0, x: entryDir * 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: entryDir * -24 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div style={{ display: 'grid', gap: 'clamp(2.4rem, 5vw, 5rem)', alignItems: 'start' }} className="md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_240px]">
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(5rem, 8vw, 9rem)', lineHeight: 0.8, color: 'var(--lux-gold)', opacity: 0.28, marginBottom: '-1.4rem', userSelect: 'none', letterSpacing: '-0.04em' }} aria-hidden="true">"</div>
              <blockquote className="lux-blockquote" style={{ color: 'var(--color-ink)', marginBottom: '2rem' }}>{active.quote}</blockquote>
              <footer>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--lux-ink)', marginBottom: '0.25rem' }}>{active.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--lux-ink-muted)', letterSpacing: '0.02em' }}>{active.role}{active.organization ? ` · ${active.organization}` : ''}</p>
                {active.context && <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--lux-gold)', marginTop: '0.7rem', opacity: 0.8 }}>{active.context}</p>}
              </footer>
            </div>
            {active.image && (
              <div style={{ overflow: 'hidden', display: 'none' }} className="md:block">
                <img src={active.image} alt={active.name} loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(0.15)' }} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2.8rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(16,15,13,0.1)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setEntryDir(i > safe ? 1 : -1); setActiveIndex(i) }}
              aria-label={`Testimonial ${i + 1}`}
              style={{ position: 'relative', width: i === safe ? '1.8rem' : '0.5rem', height: '4px', background: i === safe ? 'var(--lux-gold)' : 'rgba(16,15,13,0.18)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={goPrev} disabled={!hasPrev} style={NAVBTN(!hasPrev)}
            onMouseEnter={e => { if (hasPrev) e.currentTarget.style.borderColor = 'var(--lux-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={goNext} disabled={!hasNext} style={NAVBTN(!hasNext)}
            onMouseEnter={e => { if (hasNext) e.currentTarget.style.borderColor = 'var(--lux-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}
          >
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export const ProofTheaterScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} pinBehavior="proof-consolidation" layout="proof-theater" className="scene-cinematic scene-proof-theater">
    {({ reduced }) => (
      <>
        <div className="cine-grain-overlay" aria-hidden="true" />
        <div className="cine-scene-glow cine-scene-glow-warm" aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header — direct whileInView */}
          <motion.div {...(reduced ? {} : enterFrom(0, 14))}>
            <p className="lux-eyebrow-muted" style={{ marginBottom: '1.4rem' }}>Client Outcomes</p>
            <div className="lux-rule" style={{ marginBottom: '1.8rem' }} />
            <h2 className="lux-title" style={{ color: 'var(--color-ink)', maxWidth: '22ch' }}>
              Verified outcomes, named stakeholders, accountable delivery.
            </h2>
          </motion.div>
          {/* Testimonials — y 40→0, scale 0.95→1, stagger 0.1s */}
          <motion.div {...(reduced ? {} : testimonialEnter(0.1))}>
            <ProofTheaterSplit reduced={reduced} />
          </motion.div>
        </div>
      </>
    )}
  </FreeSceneFrame>
)

// ---------------------------------------------------------------------------
// CONVERSION CHAMBER
// ---------------------------------------------------------------------------

const FloatingField = ({ id, label, children }) => (
  <label htmlFor={id} className="cinematic-field">
    {children}
    <span className="cinematic-field-label">{label}</span>
  </label>
)

const HOMEPAGE_LEAD_FORM = 'homepage-command-brief'
const STUB_DELAY = 680

const submitHomepageLead = async fields => {
  if (isLeadCaptureConfigured()) {
    await submitLead(fields, { formName: HOMEPAGE_LEAD_FORM, pagePath: window.location.pathname, pageTitle: document.title, sourceScene: 'conversion-chamber' })
    return { mode: 'live' }
  }
  await new Promise(r => setTimeout(r, STUB_DELAY))
  return { mode: 'stub' }
}

const ConversionChamberContent = ({ reduced }) => {
  const [status, setStatus] = useState('idle')
  const [msg, setMsg] = useState('')
  const submitting = status === 'submitting'
  const success = status === 'success'
  const error = status === 'error'
  const mounted = useRef(true)

  useEffect(() => () => { mounted.current = false }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (String(fd.get('website') || '').trim()) return

    const required = ['name', 'company', 'email', 'budget_band', 'event_type', 'scope']
    if (required.some(k => !String(fd.get(k) || '').trim())) {
      setStatus('error'); setMsg('Please complete all required fields before submitting.'); return
    }
    setStatus('submitting'); setMsg('')
    try {
      await submitHomepageLead(Object.fromEntries(fd.entries()))
      if (mounted.current) { setStatus('success'); setMsg('Request received. A senior producer will contact you within one business day.'); form.reset() }
    } catch (err) {
      if (mounted.current) { setStatus('error'); setMsg(err instanceof Error ? err.message : 'Unable to submit. Please retry.') }
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <SceneCard className="h-full bg-[var(--color-surface)] p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Request Proposal</p>
        <h2 className="mt-3 max-w-[20ch] font-serif text-[clamp(1.7rem,3.1vw,2.6rem)] leading-[1.06] text-[var(--color-ink)]">Close the narrative with a deliberate production brief</h2>
        <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-[var(--color-ink-muted)]">This request enters a direct producer queue. Expect response clarity, risk framing, and executable scope.</p>
        <div className="mt-5 grid gap-3">
          {['Scope-first intake before creative spend.', 'Execution constraints surfaced at day one.', 'Decision-ready production path within 48 hours.'].map(item => (
            <p key={item} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-sm text-[var(--color-ink-muted)]">{item}</p>
          ))}
        </div>
      </SceneCard>

      <form
        onSubmit={handleSubmit}
        className="cinematic-conversion-form grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
        aria-busy={submitting}
      >
        <input type="hidden" name="source_scene" value="conversion-chamber" />
        <input type="hidden" name="source_path" value="/" />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
        <FloatingField id="c-name" label="Name"><input id="c-name" name="name" type="text" placeholder=" " autoComplete="name" required className="cinematic-field-input" /></FloatingField>
        <FloatingField id="c-email" label="Email"><input id="c-email" name="email" type="email" placeholder=" " autoComplete="email" required className="cinematic-field-input" /></FloatingField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="c-company" label="Company"><input id="c-company" name="company" type="text" placeholder=" " autoComplete="organization" required className="cinematic-field-input" /></FloatingField>
          <FloatingField id="c-phone" label="Phone"><input id="c-phone" name="phone" type="tel" placeholder=" " autoComplete="tel" className="cinematic-field-input" /></FloatingField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="c-budget" label="Budget Band">
            <select id="c-budget" name="budget_band" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
              <option value="" disabled>Select budget band</option>
              <option value="under-100k">Under 100K AED</option>
              <option value="100k-250k">100K–250K AED</option>
              <option value="250k-500k">250K–500K AED</option>
              <option value="500k-plus">500K+ AED</option>
            </select>
          </FloatingField>
          <FloatingField id="c-event" label="Event Type">
            <select id="c-event" name="event_type" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
              <option value="" disabled>Select event type</option>
              <option value="executive-summit">Executive Summit</option>
              <option value="brand-launch">Brand Launch</option>
              <option value="vip-gala">VIP Gala</option>
              <option value="technical-showcase">Technical Showcase</option>
            </select>
          </FloatingField>
        </div>
        <FloatingField id="c-date" label="Target Date Window"><input id="c-date" name="target_window" type="text" placeholder=" " className="cinematic-field-input" /></FloatingField>
        <FloatingField id="c-scope" label="Project Scope"><textarea id="c-scope" name="scope" placeholder=" " rows={4} required className="cinematic-field-input resize-none" /></FloatingField>

        <AnimatePresence mode="wait">
          {msg ? (
            <motion.div
              key={msg}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              className={`cinematic-feedback-panel rounded-xl border px-4 py-3 ${success ? 'is-success border-[rgba(122,218,165,0.45)] bg-[rgba(53,95,76,0.28)] text-[var(--color-ink)]' : 'border-[rgba(236,123,123,0.44)] bg-[rgba(90,37,37,0.24)] text-[var(--color-ink)]'}`}
              role={success ? 'status' : 'alert'}
              aria-live={success ? 'polite' : 'assertive'}
              aria-atomic="true"
            >
              <div className="flex items-center gap-3">
                {success && <span className="cinematic-success-mark" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4.5 10.7l3.2 3.4 7.8-8.3" /></svg></span>}
                <p className="text-sm">{msg}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ScribbleButton
          title="Submit private production intake form"
          type="submit"
          variant="primary"
          tone="dark"
          size="md"
          analyticsLabel="conversion-brief-submit"
          disabled={submitting}
        >
          {submitting ? 'Submitting Request...' : 'Submit Request'}
        </ScribbleButton>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
          {error ? 'Submission issue. Please retry or call direct.' : success ? 'Command queue confirmed.' : 'Private brief channel secured.'}
        </p>
      </form>
    </div>
  )
}

export const ConversionChamberScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} pinBehavior="closing-ritual" layout="conversion-chamber" className="scene-cinematic scene-conversion-chamber">
    {({ reduced }) => (
      <div style={{ display: 'grid', overflow: 'hidden' }} className="md:grid-cols-[0.44fr_0.56fr]">
        {/* Left: intentionally dark — isolated, no leakage outside */}
        <div style={{ background: 'var(--lux-dark)', padding: 'clamp(2.4rem, 5vw, 4rem) clamp(1.6rem, 3.5vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3rem' }}>
          <div>
            <p className="lux-eyebrow-light" style={{ marginBottom: '1.8rem' }}>Request Proposal</p>
            <div style={{ width: '2rem', height: '1px', background: 'var(--lux-gold)', opacity: 0.6, marginBottom: '1.8rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.7rem, 3vw, 2.8rem)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 500, color: 'var(--lux-white-88)', maxWidth: '18ch' }}>
              Brief a senior producer before creative spend begins.
            </h2>
            <p style={{ marginTop: '1.4rem', fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)', lineHeight: 1.72, color: 'var(--lux-white-32)', maxWidth: '38ch' }}>
              This enters a direct producer queue. Expect scope clarity, risk framing, and an executable production path.
            </p>
          </div>
          <div>
            <div style={{ display: 'grid', gap: '1.1rem', marginBottom: '2.4rem' }}>
              {['Scope-first intake before creative spend.', 'Execution constraints surfaced at day one.', 'Decision-ready production path within 48 hours.'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <svg style={{ marginTop: '0.2rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="var(--lux-gold)" strokeWidth="0.8" strokeOpacity="0.4" />
                    <path d="M4.5 7l2 2 3-3" stroke="var(--lux-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ fontSize: '13px', lineHeight: 1.62, color: 'var(--lux-white-56)' }}>{item}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(250,247,242,0.08)', paddingTop: '1.6rem' }}>
              <a href="tel:+97142345678" style={{ display: 'block', fontSize: '13px', color: 'var(--lux-white-32)', textDecoration: 'none', marginBottom: '0.4rem' }}>+971 4 234 5678</a>
              <a href="mailto:hello@ghaimuae.com" style={{ display: 'block', fontSize: '13px', color: 'var(--lux-white-32)', textDecoration: 'none' }}>hello@ghaimuae.com</a>
            </div>
          </div>
        </div>
        {/* Right: light form */}
        <div style={{ background: '#faf7f2', padding: 'clamp(2.4rem, 5vw, 4rem) clamp(1.6rem, 3.5vw, 3rem)' }}>
          <ConversionChamberContent reduced={reduced} />
        </div>
      </div>
    )}
  </FreeSceneFrame>
)

// ---------------------------------------------------------------------------
// GLOBAL FOOTER — Final CTA
// ---------------------------------------------------------------------------

export const GlobalFooterScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} pinBehavior="terminal-close" layout="global-footer" className="scene-cinematic scene-global-footer">
    {({ reduced }) => (
      <>
        <div className="cine-grain-overlay" aria-hidden="true" />
        <div className="cine-scene-glow cine-scene-glow-warm" aria-hidden="true" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(2rem, 5vh, 4rem) 0', position: 'relative', zIndex: 1 }}>

          {/* Section fades in over 1.1s */}
          <motion.div {...(reduced ? {} : enterFrom(0, 18))}>
            <div className="lux-rule" style={{ margin: '0 auto 2.2rem' }} />
            <p className="lux-eyebrow-muted" style={{ marginBottom: '2rem' }}>Next Move</p>
          </motion.div>

          <motion.h2
            {...(reduced ? {} : enterFrom(0.06, 20))}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.8rem, 6vw, 6rem)', lineHeight: 0.97, letterSpacing: '-0.045em', fontWeight: 500, color: 'var(--color-ink)', maxWidth: '16ch', marginBottom: '2rem' }}
          >
            Precision-led production for moments that cannot miss.
          </motion.h2>

          <motion.p
            {...(reduced ? {} : enterFrom(0.1, 16))}
            style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)', lineHeight: 1.74, color: 'var(--lux-ink-muted)', maxWidth: '48ch', marginBottom: '3rem' }}
          >
            Regional reach across UAE — one accountable command structure and execution discipline from scope to show close.
          </motion.p>

          <motion.div
            {...(reduced ? {} : enterFrom(0.14, 14))}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}
          >
            {/* Primary CTA — pulse every 4s: scale 1→1.015→1 */}
            <motion.div
              animate={reduced ? undefined : {
                scale: [1, 1.015, 1],
                transition: { duration: 0.9, ease: EASE, repeat: Infinity, repeatDelay: 3.1 },
              }}
              style={{ display: 'inline-flex' }}
            >
              <Link to="/contact" className="lux-cta-dark">
                Request Proposal
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
            <Link to="/work" className="lux-cta-dark-outline">View Our Work</Link>
          </motion.div>

          <motion.p
            {...(reduced ? {} : enterFrom(0.18, 10))}
            style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'var(--lux-ink-subtle)' }}
          >
            Dubai · Abu Dhabi · GCC
          </motion.p>

          <motion.div {...(reduced ? {} : enterFrom(0.2, 8))}>
            <div className="lux-rule" style={{ margin: '2rem auto 0' }} />
          </motion.div>
        </div>
      </>
    )}
  </FreeSceneFrame>
)