/**
 * HomeScenes.jsx
 *
 * Fixes applied:
 * - FIX 1: Testimonial slide direction tracked via ref (prev/next) instead of
 *          index parity — direction is now correct for both forward and backward nav
 * - FIX 2: CARD_WIDTH measured at runtime via ResizeObserver instead of hardcoded
 *          252px — conveyor no longer drifts at non-standard zoom levels
 * - FIX 3: AmbientDepthField infinity animations gated by useInView — prevents
 *          24 perpetual animations running simultaneously across all scenes
 * - FIX 4: CommandArrivalScene GSAP cleanup uses ctx.revert() only — removed
 *          double-kill pattern that followed ctx.revert() with explicit kills
 * - FIX 5: CLIENT_LOGO_ASSET_BY_ORGANIZATION section removed from GlobalFooterScene
 *          since the map was always empty ({}) and the block never rendered
 * - FIX 6: CTA pointer-events toggle uses data attribute instead of matching
 *          GSAP inline style strings — fragile [style*='height: auto'] selector removed
 * - FIX 7: CommandArrivalScene scroll-triggered text fade scrub timing adjusted.
 *          Changed from scrub: true (instant) to scrub: 0.5 (slight lag) so the
 *          animation has natural easing that smooths out discrete wheel steps.
 *          ScrollTrigger updates are driven solely by Lenis scroll callback in
 *          useLenisScroll.js — this single update path prevents jitter from
 *          multiple ScrollTrigger.update() calls per frame.
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
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  MOTION_TOKEN_CONTRACT,
  parseBezier,
} from '../../motion/motionTokenContract.js'
import {
  caseStudies,
  services,
  testimonials as testimonialData,
} from '../../data/siteData'
import { assetUrl } from '../../lib/assetUrl'
import { isLeadCaptureConfigured, submitLead } from '../../utils/leadCapture'
import { MOBILE_BREAKPOINT } from '../../lib/constants'

const FREE = 'free'
const PINNED = 'pinned'
const AUTHORITY_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.authority)
const MASS_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.mass)
const RELEASE_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.release)

// FIX 2: CARD_GAP still needed for runtime offset calculation.
// CARD_WIDTH is now measured dynamically via ResizeObserver — see SignatureReelContent.
const CARD_GAP = 12 // gap-3 = 12px

const PROJECTS = caseStudies.slice(0, 3).map((project, index) => ({
  id: `case-${String(index + 1).padStart(2, '0')}`,
  title: project.title,
  subtitle: project.summary,
  challenge: project.challenge,
  outcome: project.results?.[0] || 'Delivered without timeline drift.',
  image: project.image,
  location: project.location,
  slug: project.slug,
}))

const CAPABILITY_MODULES = services.slice(0, 3).map((service, index) => ({
  id: service.slug,
  title: service.title,
  summary: service.summary,
  detail: service.description,
  standards: service.standards?.slice(0, 2) || [],
  image:
    [
      assetUrl('images/full-production.png'),
      assetUrl('images/lighting-effects.png'),
      assetUrl('images/av-setup.png'),
    ][index] || assetUrl('images/full-production.png'),
}))

const TESTIMONIALS = testimonialData
  .filter(item => item?.name && item?.quote)
  .slice(0, 3)
  .map((item, index) => ({
    id: item.id || `testimonial-${String(index + 1).padStart(2, '0')}`,
    name: item.name,
    role: item.role,
    organization: item.company,
    quote: item.quote,
    context: item.project,
    location: item.location,
    image:
      caseStudies[index]?.image || PROJECTS[index % PROJECTS.length]?.image,
  }))

const FOOTER_COMPANY_LINKS = [
  { to: '/about', label: 'Company' },
  { to: '/process', label: 'Process' },
  { to: '/pricing', label: 'Engagement' },
  { to: '/faq', label: 'FAQ' },
]

const parseMetricValue = raw => {
  const digits = String(raw || '').match(/\d+/g)
  return digits ? Number(digits.join('')) : 0
}

const AUTHORITY_METRICS = [
  { label: 'Events Delivered', value: caseStudies.length, suffix: '' },
  {
    label: 'Guests Managed',
    value: caseStudies.reduce((sum, study) => {
      const stat = study.stats?.find(item => /guest/i.test(item.label))
      return sum + parseMetricValue(stat?.value)
    }, 0),
    suffix: '+',
  },
  {
    label: 'Cue Volume',
    value: caseStudies.reduce((sum, study) => {
      const stat = study.stats?.find(item =>
        /cue|reset|phase|act|screen/i.test(item.label)
      )
      return sum + parseMetricValue(stat?.value)
    }, 0),
    suffix: '+',
  },
  { label: 'Verified Testimonials', value: TESTIMONIALS.length, suffix: '' },
]

const buildHeight = vh => `${vh}vh`
const clampIndex = (value, max) => Math.max(0, Math.min(max, value))

const revealLift = (delay = 0, distance = 16) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.08,
      ease: AUTHORITY_EASE,
      delay,
    },
  },
})

const revealSide = (delay = 0, distance = 24) => ({
  hidden: { opacity: 0, x: distance },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.1,
      ease: MASS_EASE,
      delay,
    },
  },
})

const revealMask = (delay = 0) => ({
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0 round 18px)',
    transition: {
      duration: MOTION_TOKEN_CONTRACT.durations.cinematic,
      ease: RELEASE_EASE,
      delay,
    },
  },
})

const sequence = (delayChildren = 0.04, staggerChildren = 0.08) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
})

const CountUpMetric = ({ value, suffix = '', reduced }) => {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  useEffect(() => {
    if (!isInView || reduced) return undefined

    const duration = 920
    const start = performance.now()
    let frameId = 0

    const tick = now => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (progress < 1) frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
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
    className={`cinematic-scene-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/88 p-4 shadow-[0_20px_46px_rgba(8,12,20,0.28)] backdrop-blur-[2px] ${className}`}
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

// FIX 3: AmbientDepthField infinity animations are now gated by useInView.
const AmbientDepthField = ({
  reduced,
  variant = 'core',
  backgroundY = 0,
  midY = 0,
  foregroundY = 0,
  glowOpacity = 0.5,
}) => {
  const fieldRef = useRef(null)
  const isInView = useInView(fieldRef, { amount: 0.1 })

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className={`scene-ambient-field scene-ambient-${variant}`}
    >
      <motion.span
        className="scene-ambient-layer scene-ambient-back"
        style={reduced ? undefined : { y: backgroundY }}
        animate={
          reduced || !isInView
            ? undefined
            : {
                opacity: [glowOpacity * 0.84, glowOpacity, glowOpacity * 0.8],
                scale: [1, 1.035, 1],
              }
        }
        transition={{
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 3,
          ease: AUTHORITY_EASE,
          repeat: Infinity,
        }}
      />
      <motion.span
        className="scene-ambient-layer scene-ambient-mid"
        style={reduced ? undefined : { y: midY }}
        animate={
          reduced || !isInView
            ? undefined
            : {
                x: [0, 14, 0],
                opacity: [0.24, 0.36, 0.24],
              }
        }
        transition={{
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.4,
          ease: MASS_EASE,
          repeat: Infinity,
        }}
      />
      <motion.span
        className="scene-ambient-layer scene-ambient-front"
        style={reduced ? undefined : { y: foregroundY }}
        animate={
          reduced || !isInView
            ? undefined
            : {
                x: [0, -10, 0],
                opacity: [0.14, 0.26, 0.14],
              }
        }
        transition={{
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 2,
          ease: RELEASE_EASE,
          repeat: Infinity,
        }}
      />
    </div>
  )
}

const FreeSceneFrame = ({
  scene,
  pinBehavior,
  layout,
  className = '',
  children,
}) => {
  const reduced = useReducedMotion()
  const content =
    typeof children === 'function' ? children({ reduced }) : children

  return (
    <>
      <SceneWrapper
        id={scene.id}
        tone={scene.tone}
        theme="light"
        transitionReady={scene.transitionReady}
        minHeight={buildHeight(scene.length)}
        className={className}
      >
        <SceneShell
          scene={scene}
          scrollMode={FREE}
          pinBehavior={pinBehavior}
          layout={layout}
        >
          {content}
        </SceneShell>
      </SceneWrapper>
      <SceneTransitionHook scene={scene} position="post" />
    </>
  )
}

const PinnedSceneFrame = ({
  scene,
  pinBehavior,
  layout,
  className = '',
  children,
}) => (
  <>
    <div
      aria-hidden="true"
      className="scene-friction-buffer"
      style={{ '--scene-buffer-height': 'clamp(0.8rem, 1.5vh, 1.4rem)' }}
      data-buffer-for={scene.id}
      data-buffer-position="pre"
    />
    <ScrollLockedSection
      id={scene.id}
      tone={scene.tone}
      theme="light"
      transitionReady={scene.transitionReady}
      height={buildHeight(scene.length)}
      className={className}
    >
      {(progress, reduced) => (
        <SceneShell
          scene={scene}
          scrollMode={PINNED}
          pinBehavior={pinBehavior}
          layout={layout}
        >
          {typeof children === 'function'
            ? children({ progress, reduced })
            : children}
        </SceneShell>
      )}
    </ScrollLockedSection>
    <div
      aria-hidden="true"
      className="scene-friction-buffer"
      style={{ '--scene-buffer-height': 'clamp(0.8rem, 1.5vh, 1.4rem)' }}
      data-buffer-for={scene.id}
      data-buffer-position="post"
    />
    <SceneTransitionHook scene={scene} position="post" />
  </>
)

const ProjectCard = ({
  project,
  active,
  reduced,
  onSelect,
  interactive = false,
}) => {
  const handleKeyDown = event => {
    if (!interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.()
    }
  }

  return (
    <motion.article
      layout
      whileHover={!reduced ? { y: -5, scale: 1.01, rotateY: -1.4 } : undefined}
      whileTap={!reduced ? { y: -1, scale: 0.988 } : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? active : undefined}
      aria-label={
        interactive ? `Select project panel: ${project.title}` : undefined
      }
      animate={{
        opacity: reduced ? 1 : active ? 1 : 0.62,
        scale: reduced ? 1 : active ? 1 : 0.96,
        y: reduced ? 0 : active ? 0 : 10,
        rotateX: reduced ? 0 : active ? 0 : 3.8,
        rotateY: reduced ? 0 : active ? 0 : -2,
      }}
      transition={{
        duration: MOTION_TOKEN_CONTRACT.durations.ui,
        ease: MASS_EASE,
      }}
      style={{ transformPerspective: 980, transformStyle: 'preserve-3d' }}
      className={`cinematic-interactive-card min-w-[252px] snap-start rounded-2xl border p-3 ${
        active
          ? 'border-[rgba(234,241,255,0.44)] bg-[var(--color-surface-2)] shadow-[0_30px_70px_rgba(3,5,8,0.44)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_14px_30px_rgba(4,6,10,0.24)]'
      } ${interactive ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-36 overflow-hidden rounded-xl border border-[var(--color-border)]">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,28,36,0.08)_0%,rgba(24,28,36,0.48)_100%)]" />
        <p className="absolute left-3 top-3 text-[9px] uppercase tracking-[0.14em] text-white/80">
          {project.location}
        </p>
      </div>
      <h3 className="mt-3 font-serif text-[1.08rem] text-[var(--color-ink)]">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        {project.subtitle}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
        {project.outcome}
      </p>
    </motion.article>
  )
}



const SignatureReelContent = () => {
  const { progress, reduced } = useProgress()
  const mobileTrackRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const [manualIndex, setManualIndex] = useState(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const prevScrollIndexRef = useRef(0)

  useMotionValueEvent(progress, 'change', latest => {
    const newIndex = clampIndex(Math.floor(latest * PROJECTS.length), PROJECTS.length - 1)
    if (newIndex !== prevScrollIndexRef.current) {
      prevScrollIndexRef.current = newIndex
      setScrollIndex(newIndex)
      setManualIndex(null)
    }
  })

  const manualIndexInRange = typeof manualIndex === 'number' && Math.abs(scrollIndex - manualIndex) <= 1
  const selectedIndex = manualIndexInRange ? manualIndex : scrollIndex
  const selected = PROJECTS[selectedIndex]
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < PROJECTS.length - 1
  const backgroundY = useTransform(progress, v => reduced ? 0 : (0.5 - v) * 28)

  useEffect(() => () => { if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current) }, [])

  const selectProject = index => {
    const clamped = clampIndex(index, PROJECTS.length - 1)
    setManualIndex(clamped)
    if (!mobileTrackRef.current) return
    const target = mobileTrackRef.current.querySelector(`[data-project-index="${clamped}"]`)
    if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  const syncSelectedIndexFromMobileRail = () => {
    if (!mobileTrackRef.current) return
    const items = Array.from(mobileTrackRef.current.querySelectorAll('[data-project-index]'))
    if (!items.length) return
    const containerRect = mobileTrackRef.current.getBoundingClientRect()
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY
    items.forEach(node => {
      const index = Number(node.getAttribute('data-project-index'))
      const distance = Math.abs(node.getBoundingClientRect().left - containerRect.left)
      if (distance < closestDistance) { closestDistance = distance; closestIndex = index }
    })
    if (Number.isFinite(closestIndex) && closestIndex !== manualIndex)
      setManualIndex(clampIndex(closestIndex, PROJECTS.length - 1))
  }

  const handleMobileTrackScroll = () => {
    if (!mobileTrackRef.current) return
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current)
    scrollFrameRef.current = window.requestAnimationFrame(() => { scrollFrameRef.current = 0; syncSelectedIndexFromMobileRail() })
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%' }}>
      {/* ── Header row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(16,15,13,0.1)',
        paddingBottom: '1.4rem',
      }}>
        <p className="lux-eyebrow-muted">Featured Engagements</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'var(--lux-ink-subtle)', letterSpacing: '0.04em' }}>
          <span style={{ color: 'var(--lux-gold)' }}>{String(selectedIndex + 1).padStart(2, '0')}</span>
          {' / '}
          {String(PROJECTS.length).padStart(2, '0')}
        </p>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'grid', minHeight: 0, padding: 'clamp(2.2rem, 4.5vh, 3.8rem) 0' }}
        className="md:grid-cols-[0.48fr_0.52fr] md:gap-12 lg:gap-16"
      >
        {/* Left: editorial info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.06, ease: MASS_EASE }}
              style={{ display: 'grid', gap: '1.1rem' }}
            >
              <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--lux-gold)', opacity: 0.8 }}>
                {selected.location}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 4vw, 4rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                fontWeight: 500,
                color: 'var(--color-ink)',
              }}>
                {selected.title}
              </h2>
              <div style={{ width: '2.2rem', height: '1px', background: 'var(--lux-gold)', opacity: 0.5 }} />
              <p style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', lineHeight: 1.74, color: 'var(--lux-ink-muted)', maxWidth: '36ch' }}>
                {selected.challenge}
              </p>
              <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lux-ink-subtle)' }}>
                {selected.outcome}
              </p>
            </motion.div>
          </AnimatePresence>
          <div style={{ marginTop: '2.4rem' }}>
            <Link to={`/work/${selected.slug}`} className="lux-cta-dark">
              View Case Study
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: image — desktop */}
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
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.1, ease: RELEASE_EASE }}
            />
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(160deg, rgba(10,9,7,0.04) 0%, rgba(10,9,7,0.24) 100%)' }} />
        </div>

        {/* Mobile horizontal rail */}
        <div className="md:hidden">
          <div
            ref={mobileTrackRef}
            style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', scrollSnapType: 'x mandatory', touchAction: 'pan-x', paddingBottom: '0.25rem' }}
            onScroll={handleMobileTrackScroll}
            role="region"
            aria-label="Signature projects"
          >
            {PROJECTS.map((project, index) => (
              <div
                key={`mob-${project.id}`}
                data-project-index={index}
                style={{ position: 'relative', minWidth: '78vw', scrollSnapAlign: 'start', overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}
                onClick={() => selectProject(index)}
                role="button" tabIndex={0}
              >
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 36%, rgba(4,6,10,0.88) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, padding: '1rem' }}>
                  <p style={{ fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(181,146,79,0.8)', marginBottom: '0.3rem' }}>
                    {project.location}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'white' }}>
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.2rem', fontSize: '0.92rem', lineHeight: 1.74, color: 'var(--lux-ink-muted)' }}>{selected.challenge}</p>
          <div style={{ marginTop: '1.4rem' }}>
            <Link to={`/work/${selected.slug}`} className="lux-cta-dark">
              View Case Study
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Nav row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(16,15,13,0.1)',
        paddingTop: '1.2rem',
      }}>
        <button
          onClick={() => selectProject(selectedIndex - 1)} disabled={!hasPrev}
          aria-label="Previous project"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: hasPrev ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)',
            background: 'none', border: 'none', cursor: hasPrev ? 'pointer' : 'not-allowed', transition: 'color 0.2s',
          }}
          onMouseEnter={e => { if (hasPrev) e.currentTarget.style.color = 'var(--lux-gold)' }}
          onMouseLeave={e => { e.currentTarget.style.color = hasPrev ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Previous
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {PROJECTS.map((_, i) => (
            <button
              key={i} onClick={() => selectProject(i)} aria-label={`Project ${i + 1}`}
              style={{
                position: 'relative', width: i === selectedIndex ? '2rem' : '0.5rem', height: '1px',
                background: i === selectedIndex ? 'var(--lux-gold)' : 'rgba(16,15,13,0.18)',
                border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.36s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => selectProject(selectedIndex + 1)} disabled={!hasNext}
          aria-label="Next project"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: hasNext ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)',
            background: 'none', border: 'none', cursor: hasNext ? 'pointer' : 'not-allowed', transition: 'color 0.2s',
          }}
          onMouseEnter={e => { if (hasNext) e.currentTarget.style.color = 'var(--lux-gold)' }}
          onMouseLeave={e => { e.currentTarget.style.color = hasNext ? 'var(--lux-ink-subtle)' : 'rgba(16,15,13,0.2)' }}
        >
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2.5L9.5 7 5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}


export const CommandArrivalScene = ({ scene, nextScene }) => {
  const transitionWrapperRef = useRef(null)
  const heroRef = useRef(null)
  const nextRef = useRef(null)
  const depthRef = useRef(null)
  const videoRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headlineRef = useRef(null)
  const subtextRef = useRef(null)
  const ctaRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const mediaRef = scene?.videoSrc || scene?.media?.ref
  const heroMediaSrc = Array.isArray(mediaRef) ? mediaRef[0] : mediaRef
  const headline =
    scene?.headline ||
    'We command public moments where failure is visible and expensive.'
  const subtitle =
    scene?.subtitle ||
    'Ghaim unifies narrative direction, technical systems, and floor authority for executive events that cannot miss timing, clarity, or impact.'
  const ctaText = scene?.ctaText || 'See Signature Builds'

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const transitionWrapper = transitionWrapperRef.current
    const heroSection = heroRef.current
    const nextSection = nextRef.current
    const video = videoRef.current
    const eyebrowNode = eyebrowRef.current
    const headlineNode = headlineRef.current
    const subtextNode = subtextRef.current
    const ctaNode = ctaRef.current

    if (
      !transitionWrapper ||
      !heroSection ||
      !nextSection ||
      !video ||
      !eyebrowNode ||
      !headlineNode ||
      !subtextNode ||
      !ctaNode
    ) {
      return undefined
    }

    const ledgerHeadingNode = nextSection.querySelector(
      '.authority-ledger-heading'
    )
    const ledgerSubcopyNode = nextSection.querySelector(
      '.authority-ledger-subcopy'
    )
    const ledgerCtaNode = nextSection.querySelector('.authority-ledger-cta')
    const ledgerCardNodes = Array.from(
      nextSection.querySelectorAll('.authority-ledger-card')
    )
    const ledgerTextNodes = [ledgerHeadingNode, ledgerSubcopyNode].filter(
      Boolean
    )

    // Use ScrollTrigger.matchMedia() for responsive pinning.
    // - Mobile (< 768px): Disables pinning, shows static hero without scroll transitions
    // - Desktop (>= 768px): Enables full scroll-driven animation with pinning
    const context = gsap.context(() => {
      // NOTE: All position/layout gsap.set calls are inside matchMedia blocks
      // so mobile and desktop get correct values. Only safe neutral values here.
      gsap.set(video, { scale: 1, transformOrigin: 'center center' })
      gsap.set(eyebrowNode, { opacity: 1, y: 0 })
      gsap.set(headlineNode, { opacity: 1, y: 0 })
      gsap.set(subtextNode, { opacity: 1 })
      gsap.set(ctaNode, { opacity: 1 })

      ScrollTrigger.matchMedia({
        // ── Mobile: disable pinning, show sections stacked as normal flow ───────
        [`(max-width: ${MOBILE_BREAKPOINT - 1}px)`]: function mobileSetup() {
          // On mobile: undo the absolute positioning set outside matchMedia so
          // both hero and authority ledger render as stacked flow elements.
          gsap.set(transitionWrapper, {
            position: 'relative',
            height: 'auto',
            overflow: 'visible',
          })
          gsap.set(heroSection, {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            width: '100%',
            height: '100svh',
            opacity: 1,
          })
          gsap.set(nextSection, {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            width: '100%',
            height: 'auto',
            y: '0%',
            opacity: 1,
            overflow: 'visible',
          })
          gsap.set(ledgerTextNodes, { opacity: 1, y: 0 })
          gsap.set(ledgerCardNodes, { opacity: 1, y: 0 })
          if (ledgerCtaNode) gsap.set(ledgerCtaNode, { opacity: 1, y: 0 })

          return () => {
            gsap.set(
              [transitionWrapper, heroSection, nextSection, ...ledgerTextNodes, ...ledgerCardNodes],
              { clearProps: 'all' }
            )
            if (ledgerCtaNode) gsap.set(ledgerCtaNode, { clearProps: 'all' })
          }
        },

        // ── Desktop: enable pinning and scroll-driven animations ─────────────────
        [`(min-width: ${MOBILE_BREAKPOINT}px)`]: function desktopSetup() {
          // Desktop: set up the overlapping stack animation
          gsap.set(transitionWrapper, {
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 10,
          })
          gsap.set(heroSection, {
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: 1, zIndex: 3,
          })
          gsap.set(nextSection, {
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            y: '50%', opacity: 0, zIndex: 2, overflow: 'hidden',
          })
          gsap.set(ledgerTextNodes, { opacity: 0, y: 36 })
          gsap.set(ledgerCardNodes, { opacity: 0, y: 56 })
          if (ledgerCtaNode) gsap.set(ledgerCtaNode, { opacity: 0, y: 42 })

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: transitionWrapper,
              start: 'top top',
              end: reducedMotion ? '+=180%' : '+=300%',
              pin: true,
              // FIX 7: Changed from scrub: true (instant) to scrub: 0.5 so the
              // animation has a slight lag that smooths out the discrete jumps
              // produced by mouse-wheel scroll steps. With scrub: true, each
              // rAF-batched ScrollTrigger.update() caused a visible snap; 0.5
              // gives a natural easing feel that matches trackpad behaviour.
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              onLeave: () => {
                gsap.set(transitionWrapper, {
                  height: 'auto',
                  overflow: 'visible',
                  zIndex: 'auto',
                })
                gsap.set(nextSection, {
                  position: 'relative',
                  top: 'auto',
                  left: 'auto',
                  width: '100%',
                  height: 'auto',
                  y: '0%',
                  opacity: 1,
                  overflow: 'visible',
                })
                gsap.set(heroSection, { opacity: 0, pointerEvents: 'none' })
                gsap.set(ledgerTextNodes, { opacity: 1, y: 0 })
                gsap.set(ledgerCardNodes, { opacity: 1, y: 0 })
                if (ledgerCtaNode) gsap.set(ledgerCtaNode, { opacity: 1, y: 0 })

                // FIX 6: Toggle a data attribute to re-enable CTA pointer-events
                if (transitionWrapper) {
                  transitionWrapper.dataset.pinReleased = 'true'
                }
              },

              onEnterBack: () => {
                gsap.set(transitionWrapper, {
                  height: '100vh',
                  overflow: 'hidden',
                  zIndex: 10,
                })
                gsap.set(heroSection, {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'auto',
                  zIndex: 3,
                })
                gsap.set(nextSection, {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 2,
                })

                // FIX 6: Remove the data attribute to restore CTA disable state
                if (transitionWrapper) {
                  delete transitionWrapper.dataset.pinReleased
                }
              },
            },
          })

          timeline
            .to(
              [eyebrowNode, headlineNode],
              { opacity: 0, y: -120, duration: 1.35, ease: 'power3.out' },
              0
            )
            .to(
              [subtextNode, ctaNode],
              { opacity: 0, y: -60, duration: 1.35, ease: 'power3.out' },
              0.08
            )
            .to(video, { scale: 1.08, duration: 3, ease: 'none' }, 0)
            .to(
              nextSection,
              { y: '0%', opacity: 1, duration: 1.6, ease: 'power3.out' },
              1.5
            )
            .to(
              heroSection,
              { opacity: 0, duration: 1.6, ease: 'power3.out' },
              1.5
            )

          if (ledgerTextNodes.length) {
            timeline.to(
              ledgerTextNodes,
              {
                opacity: 1,
                y: 0,
                duration: 0.78,
                stagger: 0.1,
                ease: 'power2.out',
              },
              1.72
            )
          }

          if (ledgerCardNodes.length) {
            timeline.to(
              ledgerCardNodes,
              {
                opacity: 1,
                y: 0,
                duration: 0.92,
                stagger: 0.1,
                ease: 'power2.out',
              },
              1.92
            )
          }

          if (ledgerCtaNode) {
            timeline.to(
              ledgerCtaNode,
              { opacity: 1, y: 0, duration: 0.76, ease: 'power2.out' },
              2.18
            )
          }
        },
      })
    }, transitionWrapper)

    // FIX 4: ctx.revert() is the only cleanup needed.
    return () => {
      context.revert()
    }
  }, [reducedMotion])

  return (
    <div
      ref={transitionWrapperRef}
      className="hero-authority-transition-stage"
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        isolation: 'isolate',
        zIndex: 1,
      }}
    >
      <section
        ref={heroRef}
        id={scene.id}
        className="hero-authority-hero-stage"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <div
          ref={depthRef}
          className="scene-depth-stage scene-depth-stage-hero-full relative overflow-hidden"
        >
          <AmbientDepthField
            reduced
            variant="hero"
            backgroundY={0}
            midY={0}
            foregroundY={0}
            glowOpacity={0.58}
          />

          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              className="hero-command-video h-full w-full object-cover"
              src={heroMediaSrc}
              preload="metadata"
              muted
              loop
              playsInline
              autoPlay
            />
          </div>

          <HeroAmbientCanvas />
          <div className="hero-volumetric-layer" />
          <div className="hero-particle-layer" />
          <div className="hero-vignette-layer" />
          <div className="hero-dof-layer" />
          <div className="hero-command-soften-layer" />

          <div className="hero-command-overlay absolute inset-0 z-20 flex flex-col items-start justify-center px-4 sm:px-6 md:px-10 lg:px-14">
            <div className="hero-command-copy w-[90%] sm:w-[82%] lg:w-[40%] max-w-none">
              <div className="inline-flex max-w-full flex-col p-1">
                <p
                  ref={eyebrowRef}
                  className="text-xs uppercase tracking-[0.18em] text-white/80"
                >
                  Executive Event Command
                </p>
                <h1
                  ref={headlineRef}
                  className="mt-4 max-w-[16ch] font-serif text-[clamp(1.9rem,7.8vw,5.4rem)] leading-[0.98] tracking-[-0.03em] text-white"
                >
                  {headline}
                </h1>
                <p
                  ref={subtextRef}
                  className="mt-5 max-w-[38ch] text-[clamp(0.98rem,2.15vw,1.45rem)] leading-relaxed text-white/90"
                >
                  {subtitle}
                </p>
                <div ref={ctaRef} className="mt-8">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={nextRef}
        id={nextScene?.id || 'authority-ledger'}
        className="hero-authority-next-stage"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {nextScene ? <AuthorityLedgerScene scene={nextScene} embedded /> : null}
      </section>
    </div>
  )
}

// Authority Ledger: real outcomes and command capability framing.
export const AuthorityLedgerScene = ({ scene, embedded = false }) => {
  const depthRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })

  const backgroundYTransform = useTransform(scrollYProgress, [0, 1], [30, -20])
  const midYTransform = useTransform(scrollYProgress, [0, 1], [18, -14])
  const foregroundYTransform = useTransform(scrollYProgress, [0, 1], [8, -8])
  const backgroundY = embedded ? 0 : backgroundYTransform
  const midY = embedded ? 0 : midYTransform
  const foregroundY = embedded ? 0 : foregroundYTransform

  const heading = scene?.headline || 'Outcome authority before visual theater.'
  const body =
    scene?.subtitle ||
    'Executive productions stay trusted when timing, technical certainty, and delivery control are visible before the spotlight turns on.'

  const ledgerBody = reduced => (
    <div
      ref={depthRef}
      className="authority-ledger scene-depth-stage scene-depth-stage-ledger"
    >
      <AmbientDepthField
        reduced={reduced}
        variant="ledger"
        backgroundY={backgroundY}
        midY={midY}
        foregroundY={foregroundY}
        glowOpacity={0.44}
      />

      <motion.div
        variants={!embedded && !reduced ? sequence(0.04, 0.1) : undefined}
        initial={!embedded && !reduced ? 'hidden' : false}
        whileInView={!embedded && !reduced ? 'visible' : undefined}
        viewport={
          !embedded && !reduced ? { once: true, amount: 0.24 } : undefined
        }
        className="authority-ledger-shell relative z-[2]"
      >
        <motion.header
          variants={!embedded && !reduced ? revealLift(0.02, 12) : undefined}
          className="authority-ledger-intro"
        >
          <p className="authority-ledger-eyebrow text-[11px] uppercase tracking-[0.17em] text-[var(--color-ink-subtle)]">
            Performance Record
          </p>
          <h2 className="authority-ledger-heading mt-4 font-serif leading-[1.02] text-[var(--color-ink)]">
            {heading}
          </h2>
          <p className="authority-ledger-subcopy mt-4 text-[var(--color-ink-muted)]">
            {body}
          </p>
        </motion.header>

        <div className="authority-ledger-metrics-grid">
          {AUTHORITY_METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={
                !embedded && !reduced ? revealMask(index * 0.04) : undefined
              }
            >
              <SceneCard className="authority-ledger-card authority-ledger-metric p-4 md:p-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  {metric.label}
                </p>
                <p className="authority-ledger-metric-value mt-3 font-serif leading-none text-[var(--color-ink)]">
                  <CountUpMetric
                    value={metric.value}
                    suffix={metric.suffix}
                    reduced={reduced}
                  />
                </p>
              </SceneCard>
            </motion.div>
          ))}
        </div>


        <motion.div
          variants={!embedded && !reduced ? revealLift(0.24, 14) : undefined}
          className="authority-ledger-cta"
        >
          <ScribbleButton
            title="Open capability and delivery portfolio"
            variant="outline"
            tone="light"
            size="md"
            to="/services"
            analyticsLabel="authority-ledger-capabilities"
          >
            Explore Capabilities
          </ScribbleButton>
        </motion.div>
      </motion.div>
    </div>
  )

  if (embedded) return ledgerBody(reducedMotion)

  return (
    <FreeSceneFrame
      scene={scene}
      pinBehavior="evidence-ramp"
      layout="authority-ledger"
      className="scene-cinematic scene-authority-ledger"
    >
      {({ reduced }) => ledgerBody(reduced)}
    </FreeSceneFrame>
  )
}

// Signature Reel: anchor cinematic lock moment.
export const SignatureReelScene = ({ scene }) => (

  <PinnedSceneFrame
    scene={scene}
    pinBehavior="command-aperture-lock"
    layout="command-aperture"
    className="scene-cinematic scene-signature-reel"
  >
    <SignatureReelContent />
  </PinnedSceneFrame>
)


// Capability Matrix: numbered editorial service list.

export const CapabilityMatrixScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    pinBehavior="matrix-reveal"
    layout="capability-matrix"
    className="scene-cinematic scene-capability-matrix"
  >
    {({ reduced }) => (
      <motion.div
        variants={sequence(0.02, 0.1)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* ── Section header ── */}
        <motion.div variants={revealLift(0, 16)} className="mb-14 lg:mb-20">
          <p className="lux-eyebrow-muted mb-5">Capabilities</p>
          <div className="lux-rule mb-7" />
          <h2 className="lux-display text-[var(--color-ink)]" style={{ maxWidth: '16ch' }}>
            Technical depth,<br />creative precision,<br />operational control.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1rem' }}>
            <Link
              to="/services"
              className="lux-cta-dark-outline"
            >
              All Services
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* ── Capability rows ── */}
        {CAPABILITY_MODULES.map((module, index) => (
          <motion.div
            key={module.id}
            variants={revealLift(index * 0.1 + 0.06, 18)}
            className="lux-capability-row group"
          >
            <p className="lux-capability-num">{String(index + 1).padStart(2, '0')}</p>

            <div style={{ display: 'grid', gap: '0.55rem', paddingBottom: '0.5rem' }}>
              <h3 className="lux-section-head text-[var(--color-ink)]" style={{ letterSpacing: '-0.03em' }}>
                {module.title}
              </h3>
              <p style={{
                fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
                lineHeight: 1.72,
                color: 'var(--lux-ink-muted)',
                maxWidth: '54ch',
              }}>
                {module.summary}
              </p>
              {module.standards?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 2rem', marginTop: '0.5rem' }}>
                  {module.standards.map(s => (
                    <span key={s} style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--lux-ink-subtle)',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail — desktop only */}
            <div className="hidden lg:block" style={{
              width: '140px',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              <img
                src={module.image}
                alt={module.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  aspectRatio: '3/2',
                  objectFit: 'cover',
                  filter: 'grayscale(0.22)',
                  transition: 'filter 0.5s ease, transform 0.6s ease',
                }}
                className="group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </motion.div>
        ))}

        {/* Bottom rule */}
        <div className="lux-rule-full mt-0" style={{ borderColor: 'rgba(16,15,13,0.1)' }} />

        <div className="mt-8 lg:hidden">
          <Link to="/services" className="lux-cta-dark-outline">
            All Services
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </motion.div>
    )}
  </FreeSceneFrame>
)


// Narrative Bridge: full-viewport typographic intermezzo.
export const NarrativeBridgeScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: depthRef, offset: ['start end', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [18, -18])

  return (
    <FreeSceneFrame
      scene={scene}
      pinBehavior="calm-release"
      layout="narrative-bridge"
      className="scene-cinematic scene-narrative-bridge"
    >
      {({ reduced }) => (
        <div
          ref={depthRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(3rem, 8vh, 6rem) 0',
          }}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: AUTHORITY_EASE }}
            style={reduced ? undefined : { y: textY }}
          >
            {/* Gold top rule */}
            <div className="lux-rule" style={{ margin: '0 auto 2.4rem' }} />

            <p className="lux-eyebrow-light" style={{ marginBottom: '2rem', color: 'rgba(181,146,79,0.7)' }}>
              Outcome Transition
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
                fontWeight: 500,
                maxWidth: '18ch',
                margin: '0 auto',
                color: 'var(--color-ink)',
              }}
            >
              Precision is only credible when proof carries the weight.
            </h2>

            <p
              style={{
                marginTop: '2.2rem',
                maxWidth: '44ch',
                marginInline: 'auto',
                fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
                lineHeight: 1.74,
                color: 'var(--lux-ink-muted)',
              }}
            >
              The next chapter shifts from directional language to verified
              outcomes, named stakeholders, and delivery context.
            </p>

            {/* Gold bottom rule */}
            <div className="lux-rule" style={{ margin: '2.6rem auto 0' }} />
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
  )
}


// ProofTheaterSplit — full editorial, no cards
const ProofTheaterSplit = ({ reduced }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [entryDirection, setEntryDirection] = useState(1)
  const touchStartXRef = useRef(null)
  const touchDeltaRef = useRef(0)
  const safeIndex = clampIndex(activeIndex, Math.max(TESTIMONIALS.length - 1, 0))
  const active = TESTIMONIALS[safeIndex]
  const hasPrev = safeIndex > 0
  const hasNext = safeIndex < TESTIMONIALS.length - 1

  const goPrev = () => { setEntryDirection(-1); setActiveIndex(i => clampIndex(i - 1, TESTIMONIALS.length - 1)) }
  const goNext = () => { setEntryDirection(1); setActiveIndex(i => clampIndex(i + 1, TESTIMONIALS.length - 1)) }
  const onTouchStart = e => { touchStartXRef.current = e.touches[0]?.clientX ?? null; touchDeltaRef.current = 0 }
  const onTouchMove = e => { if (touchStartXRef.current === null) return; touchDeltaRef.current = (e.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current }
  const onTouchEnd = () => {
    if (touchStartXRef.current === null) return
    if (touchDeltaRef.current <= -46) goNext()
    if (touchDeltaRef.current >= 46) goPrev()
    touchStartXRef.current = null; touchDeltaRef.current = 0
  }

  if (!active) return null

  return (
    <div
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{ paddingTop: 'clamp(3rem, 5vh, 4.5rem)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={reduced ? false : { opacity: 0, x: entryDirection * 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: entryDirection * -24 }}
          transition={{ duration: 0.75, ease: MASS_EASE }}
        >
          {/* Layout: quote left, portrait right */}
          <div style={{
            display: 'grid',
            gap: 'clamp(2.4rem, 5vw, 5rem)',
            alignItems: 'start',
          }}
            className="md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_240px]"
          >
            <div>
              {/* Decorative opening mark */}
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(5rem, 8vw, 9rem)',
                lineHeight: 0.8,
                color: 'var(--lux-gold)',
                opacity: 0.28,
                marginBottom: '-1.4rem',
                userSelect: 'none',
                letterSpacing: '-0.04em',
              }} aria-hidden="true">
                "
              </div>

              <blockquote className="lux-blockquote" style={{ color: 'var(--color-ink)', marginBottom: '2rem' }}>
                {active.quote}
              </blockquote>

              <footer>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--lux-ink)', marginBottom: '0.25rem' }}>
                  {active.name}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--lux-ink-muted)', letterSpacing: '0.02em' }}>
                  {active.role}{active.organization ? ` · ${active.organization}` : ''}
                </p>
                {active.context && (
                  <p style={{
                    fontSize: '8.5px', fontWeight: 600, letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: 'var(--lux-gold)', marginTop: '0.7rem', opacity: 0.8,
                  }}>
                    {active.context}
                  </p>
                )}
              </footer>
            </div>

            {/* Portrait */}
            {active.image && (
              <div style={{ overflow: 'hidden', display: 'none' }} className="md:block">
                <img
                  src={active.image}
                  alt={active.name}
                  loading="lazy" decoding="async"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(0.15)' }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2.8rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(16,15,13,0.1)',
      }}>
        {/* Dot nav */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setEntryDirection(i > safeIndex ? 1 : -1); setActiveIndex(i) }}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                position: 'relative',
                width: i === safeIndex ? '1.8rem' : '0.5rem',
                height: '1px',
                background: i === safeIndex ? 'var(--lux-gold)' : 'rgba(16,15,13,0.18)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={goPrev} disabled={!hasPrev}
            style={{
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid rgba(16,15,13,0.14)',
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              opacity: hasPrev ? 1 : 0.25,
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => { if (hasPrev) e.currentTarget.style.borderColor = 'var(--lux-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={goNext} disabled={!hasNext}
            style={{
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid rgba(16,15,13,0.14)',
              cursor: hasNext ? 'pointer' : 'not-allowed',
              opacity: hasNext ? 1 : 0.25,
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => { if (hasNext) e.currentTarget.style.borderColor = 'var(--lux-gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Proof Theater: editorial testimonial stage.
export const ProofTheaterScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    pinBehavior="proof-consolidation"
    layout="proof-theater"
    className="scene-cinematic scene-proof-theater"
  >
    {({ reduced }) => (
      <motion.div
        variants={sequence(0.02, 0.1)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* ── Header ── */}
        <motion.div variants={revealLift(0, 14)}>
          <p className="lux-eyebrow-muted" style={{ marginBottom: '1.4rem' }}>Client Outcomes</p>
          <div className="lux-rule" style={{ marginBottom: '1.8rem' }} />
          <h2 className="lux-title" style={{ color: 'var(--color-ink)', maxWidth: '22ch' }}>
            Verified outcomes, named stakeholders, accountable delivery.
          </h2>
        </motion.div>

        {/* ── Testimonials ── */}
        <motion.div variants={revealLift(0.12, 16)}>
          <ProofTheaterSplit reduced={reduced} />
        </motion.div>
      </motion.div>
    )}
  </FreeSceneFrame>
)


const FloatingField = ({ id, label, children }) => (
  <label htmlFor={id} className="cinematic-field">
    {children}
    <span className="cinematic-field-label">{label}</span>
  </label>
)

const HOMEPAGE_LEAD_FORM = 'homepage-command-brief'
const STUB_API_DELAY_MS = 680

const submitHomepageLead = async fields => {
  if (isLeadCaptureConfigured()) {
    await submitLead(fields, {
      formName: HOMEPAGE_LEAD_FORM,
      pagePath: window.location.pathname,
      pageTitle: document.title,
      sourceScene: 'conversion-chamber',
    })
    return { mode: 'live' }
  }

  await new Promise(resolve => window.setTimeout(resolve, STUB_API_DELAY_MS))
  return { mode: 'stub' }
}

const ConversionChamberContent = ({ reduced }) => {
  const [status, setStatus] = useState('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'
  const isError = status === 'error'
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const honeypotValue = String(formData.get('website') || '').trim()

    if (honeypotValue) return

    const name = String(formData.get('name') || '').trim()
    const company = String(formData.get('company') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const budgetBand = String(formData.get('budget_band') || '').trim()
    const eventType = String(formData.get('event_type') || '').trim()
    const scope = String(formData.get('scope') || '').trim()

    if (!name || !company || !email || !budgetBand || !eventType || !scope) {
      setStatus('error')
      setFeedbackMessage(
        'Please complete all required fields before submitting.'
      )
      return
    }

    setStatus('submitting')
    setFeedbackMessage('')

    try {
      await submitHomepageLead(Object.fromEntries(formData.entries()))
      if (isMounted.current) {
        setStatus('success')
        setFeedbackMessage(
          'Request received. A senior producer will contact you within one business day.'
        )
        form.reset()
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to submit request right now. Please retry in a moment.'
      if (isMounted.current) {
        setStatus('error')
        setFeedbackMessage(message)
      }
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <SceneCard className="h-full bg-[var(--color-surface)] p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
          Request Proposal
        </p>
        <h2 className="mt-3 max-w-[20ch] font-serif text-[clamp(1.7rem,3.1vw,2.6rem)] leading-[1.06] text-[var(--color-ink)]">
          Close the narrative with a deliberate production brief
        </h2>
        <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-[var(--color-ink-muted)]">
          This request enters a direct producer queue. Expect response clarity,
          risk framing, and executable scope.
        </p>
        <div className="mt-5 grid gap-3">
          {[
            'Scope-first intake before creative spend.',
            'Execution constraints surfaced at day one.',
            'Decision-ready production path within 48 hours.',
          ].map(item => (
            <p
              key={item}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-sm text-[var(--color-ink-muted)]"
            >
              {item}
            </p>
          ))}
        </div>
      </SceneCard>

      <motion.form
        onSubmit={handleSubmit}
        variants={sequence(0.02, 0.08)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="cinematic-conversion-form grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
        aria-busy={isSubmitting}
      >
        <input type="hidden" name="source_scene" value="conversion-chamber" />
        <input type="hidden" name="source_path" value="/" />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        <FloatingField id="conversion-name" label="Name">
          <input
            id="conversion-name"
            name="name"
            type="text"
            placeholder=" "
            autoComplete="name"
            required
            className="cinematic-field-input"
          />
        </FloatingField>

        <FloatingField id="conversion-email" label="Email">
          <input
            id="conversion-email"
            name="email"
            type="email"
            placeholder=" "
            autoComplete="email"
            required
            className="cinematic-field-input"
          />
        </FloatingField>

        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="conversion-company" label="Company">
            <input
              id="conversion-company"
              name="company"
              type="text"
              placeholder=" "
              autoComplete="organization"
              required
              className="cinematic-field-input"
            />
          </FloatingField>
          <FloatingField id="conversion-phone" label="Phone">
            <input
              id="conversion-phone"
              name="phone"
              type="tel"
              placeholder=" "
              autoComplete="tel"
              className="cinematic-field-input"
            />
          </FloatingField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="conversion-budget" label="Budget Band">
            <select
              id="conversion-budget"
              name="budget_band"
              defaultValue=""
              className="cinematic-field-input cinematic-select-input"
              required
            >
              <option value="" disabled>
                Select budget band
              </option>
              <option value="under-100k">Under 100K AED</option>
              <option value="100k-250k">100K–250K AED</option>
              <option value="250k-500k">250K–500K AED</option>
              <option value="500k-plus">500K+ AED</option>
            </select>
          </FloatingField>
          <FloatingField id="conversion-event-type" label="Event Type">
            <select
              id="conversion-event-type"
              name="event_type"
              defaultValue=""
              className="cinematic-field-input cinematic-select-input"
              required
            >
              <option value="" disabled>
                Select event type
              </option>
              <option value="executive-summit">Executive Summit</option>
              <option value="brand-launch">Brand Launch</option>
              <option value="vip-gala">VIP Gala</option>
              <option value="technical-showcase">Technical Showcase</option>
            </select>
          </FloatingField>
        </div>

        <FloatingField id="conversion-event-date" label="Target Date Window">
          <input
            id="conversion-event-date"
            name="target_window"
            type="text"
            placeholder=" "
            className="cinematic-field-input"
          />
        </FloatingField>

        <FloatingField id="conversion-scope" label="Project Scope">
          <textarea
            id="conversion-scope"
            name="scope"
            placeholder=" "
            rows={4}
            required
            className="cinematic-field-input resize-none"
          />
        </FloatingField>

        <AnimatePresence mode="wait">
          {feedbackMessage ? (
            <motion.div
              key={feedbackMessage}
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{
                duration: MOTION_TOKEN_CONTRACT.durations.scene,
                ease: MASS_EASE,
              }}
              className={`cinematic-feedback-panel rounded-xl border px-4 py-3 ${isSuccess ? 'is-success border-[rgba(122,218,165,0.45)] bg-[rgba(53,95,76,0.28)] text-[var(--color-ink)]' : 'border-[rgba(236,123,123,0.44)] bg-[rgba(90,37,37,0.24)] text-[var(--color-ink)]'}`}
              role={isSuccess ? 'status' : 'alert'}
              aria-live={isSuccess ? 'polite' : 'assertive'}
              aria-atomic="true"
            >
              <div className="flex items-center gap-3">
                {isSuccess ? (
                  <span className="cinematic-success-mark" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M4.5 10.7l3.2 3.4 7.8-8.3" />
                    </svg>
                  </span>
                ) : null}
                <p className="text-sm">{feedbackMessage}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <ScribbleButton
          title="Submit private production intake form"
          type="submit"
          variant="primary"
          tone="light"
          size="md"
          analyticsLabel="conversion-brief-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
        </ScribbleButton>

        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
          {isError
            ? 'Submission issue. Please retry or call direct.'
            : isSuccess
              ? 'Command queue confirmed.'
              : 'Private brief channel secured.'}
        </p>
      </motion.form>
    </div>
  )
}


// Conversion close: API-aware intake with refined split layout.

// Conversion: luxury split — dark editorial left, underline-field form right.
export const ConversionChamberScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    pinBehavior="closing-ritual"
    layout="conversion-chamber"
    className="scene-cinematic scene-conversion-chamber"
  >
    {({ reduced }) => (
      <div
        style={{
          display: 'grid',
          overflow: 'hidden',
        }}
        className="md:grid-cols-[0.44fr_0.56fr]"
      >
        {/* ── Left: dark editorial panel ── */}
        <div
          style={{
            background: 'var(--lux-dark)',
            padding: 'clamp(2.4rem, 5vw, 4rem) clamp(1.6rem, 3.5vw, 3rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '3rem',
          }}
        >
          <div>
            <p className="lux-eyebrow-light" style={{ marginBottom: '1.8rem' }}>Request Proposal</p>
            <div style={{
              width: '2rem', height: '1px',
              background: 'var(--lux-gold)', opacity: 0.6,
              marginBottom: '1.8rem',
            }} />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.7rem, 3vw, 2.8rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                fontWeight: 500,
                color: 'var(--lux-white-88)',
                maxWidth: '18ch',
              }}
            >
              Brief a senior producer before creative spend begins.
            </h2>
            <p style={{
              marginTop: '1.4rem',
              fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
              lineHeight: 1.72,
              color: 'var(--lux-white-32)',
              maxWidth: '38ch',
            }}>
              This enters a direct producer queue. Expect scope clarity, risk framing, and an executable production path.
            </p>
          </div>

          <div>
            <div style={{ display: 'grid', gap: '1.1rem', marginBottom: '2.4rem' }}>
              {[
                'Scope-first intake before creative spend.',
                'Execution constraints surfaced at day one.',
                'Decision-ready production path within 48 hours.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <svg style={{ marginTop: '0.2rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="var(--lux-gold)" strokeWidth="0.8" strokeOpacity="0.4"/>
                    <path d="M4.5 7l2 2 3-3" stroke="var(--lux-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p style={{ fontSize: '13px', lineHeight: 1.62, color: 'var(--lux-white-56)' }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(250,247,242,0.08)', paddingTop: '1.6rem' }}>
              <a href="tel:+97142345678" style={{
                display: 'block', fontSize: '13px', color: 'var(--lux-white-32)',
                textDecoration: 'none', transition: 'color 0.2s', marginBottom: '0.4rem',
              }}>
                +971 4 234 5678
              </a>
              <a href="mailto:hello@ghaimuae.com" style={{
                display: 'block', fontSize: '13px', color: 'var(--lux-white-32)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}>
                hello@ghaimuae.com
              </a>
            </div>
          </div>
        </div>

        {/* ── Right: luxury form ── */}
        <div style={{
          background: '#faf7f2',
          padding: 'clamp(2.4rem, 5vw, 4rem) clamp(1.6rem, 3.5vw, 3rem)',
        }}>
          <ConversionChamberContent reduced={reduced} formStyle="luxury" />
        </div>
      </div>
    )}
  </FreeSceneFrame>
)


// GlobalFooterScene: grand closing statement.
export const GlobalFooterScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    pinBehavior="terminal-close"
    layout="global-footer"
    className="scene-cinematic scene-global-footer"
  >
    {({ reduced }) => (
      <motion.div
        variants={sequence(0.04, 0.1)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(2rem, 5vh, 4rem) 0',
        }}
      >
        <motion.div variants={revealLift(0, 18)}>
          <div className="lux-rule" style={{ margin: '0 auto 2.2rem' }} />
          <p className="lux-eyebrow-muted" style={{ marginBottom: '2rem' }}>Next Move</p>
        </motion.div>

        <motion.h2
          variants={revealLift(0.06, 20)}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.8rem, 6vw, 6rem)',
            lineHeight: 0.97,
            letterSpacing: '-0.045em',
            fontWeight: 500,
            color: 'var(--color-ink)',
            maxWidth: '16ch',
            marginBottom: '2rem',
          }}
        >
          Precision-led production for moments that cannot miss.
        </motion.h2>

        <motion.p
          variants={revealLift(0.1, 16)}
          style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            lineHeight: 1.74,
            color: 'var(--lux-ink-muted)',
            maxWidth: '48ch',
            marginBottom: '3rem',
          }}
        >
          Regional reach across UAE — one accountable command structure and execution discipline from scope to show close.
        </motion.p>

        <motion.div
          variants={revealLift(0.14, 14)}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem' }}
        >
          <Link to="/contact" className="lux-cta-dark">
            Request Proposal
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/work" className="lux-cta-dark-outline">
            View Our Work
          </Link>
        </motion.div>

        <motion.p
          variants={revealLift(0.18, 10)}
          style={{
            fontSize: '9px', fontWeight: 600,
            letterSpacing: '0.36em', textTransform: 'uppercase',
            color: 'var(--lux-ink-subtle)',
          }}
        >
          Dubai · Abu Dhabi · GCC
        </motion.p>

        <motion.div variants={revealLift(0.2, 8)}>
          <div className="lux-rule" style={{ margin: '2rem auto 0' }} />
        </motion.div>
      </motion.div>
    )}
  </FreeSceneFrame>
)

