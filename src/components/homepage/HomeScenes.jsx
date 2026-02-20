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
import { OperationsSpineScene } from './OperationsSpineScene'
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
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 4,
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
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 3.2,
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
          duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.8,
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
      style={{ '--scene-buffer-height': 'clamp(3.2rem, 8vh, 6rem)' }}
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
      style={{ '--scene-buffer-height': 'clamp(3.2rem, 8vh, 6rem)' }}
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
  const firstCardRef = useRef(null)
  const [cardWidth, setCardWidth] = useState(252)
  const scrollFrameRef = useRef(0)
  const [manualIndex, setManualIndex] = useState(null)
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    const card = firstCardRef.current
    if (!card) return

    const measure = () => {
      const rect = card.getBoundingClientRect()
      if (rect.width > 0) setCardWidth(rect.width)
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(card)
    return () => ro.disconnect()
  }, [])

  useMotionValueEvent(progress, 'change', latest => {
    setProgressValue(latest)
  })

  const indexFromScroll = clampIndex(
    Math.floor(progressValue * PROJECTS.length),
    PROJECTS.length - 1
  )

  const manualIndexInRange =
    typeof manualIndex === 'number' &&
    Math.abs(indexFromScroll - manualIndex) <= 1
  const selectedIndex = manualIndexInRange ? manualIndex : indexFromScroll
  const selected = PROJECTS[selectedIndex]
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < PROJECTS.length - 1

  const tension = reduced
    ? 0
    : Math.max(0, 1 - Math.abs(progressValue - 0.55) / 0.55)
  const apertureInset = reduced ? 0 : 8 + tension * 26

  const conveyorOffset = reduced ? 0 : -selectedIndex * (cardWidth + CARD_GAP)

  const backgroundY = reduced ? 0 : (0.5 - progressValue) * 40
  const midY = reduced ? 0 : (0.5 - progressValue) * 22
  const foregroundY = reduced ? 0 : (0.5 - progressValue) * 14

  useEffect(
    () => () => {
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    },
    []
  )

  const selectProject = index => {
    const clamped = clampIndex(index, PROJECTS.length - 1)
    setManualIndex(clamped)

    if (!mobileTrackRef.current) return
    const target = mobileTrackRef.current.querySelector(
      `[data-project-index="${clamped}"]`
    )
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      })
    }
  }

  const syncSelectedIndexFromMobileRail = () => {
    if (!mobileTrackRef.current) return
    const items = Array.from(
      mobileTrackRef.current.querySelectorAll('[data-project-index]')
    )
    if (!items.length) return

    const containerRect = mobileTrackRef.current.getBoundingClientRect()
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    items.forEach(node => {
      const index = Number(node.getAttribute('data-project-index'))
      const nodeRect = node.getBoundingClientRect()
      const distance = Math.abs(nodeRect.left - containerRect.left)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (Number.isFinite(closestIndex) && closestIndex !== manualIndex) {
      setManualIndex(clampIndex(closestIndex, PROJECTS.length - 1))
    }
  }

  const handleMobileTrackScroll = () => {
    if (!mobileTrackRef.current) return
    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0
      syncSelectedIndexFromMobileRail()
    })
  }

  return (
    <div className="scene-depth-stage scene-depth-stage-signature grid gap-5">
      <AmbientDepthField
        reduced={reduced}
        variant="signature"
        backgroundY={backgroundY}
        midY={midY}
        foregroundY={foregroundY}
        glowOpacity={0.62}
      />

      <div className="relative z-[2] grid gap-5">
        <SceneCard className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="max-w-[64ch]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
                Featured Engagements
              </p>
              <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.6rem,2.95vw,2.52rem)] leading-[1.06] text-[var(--color-ink)]">
                Three recent productions where precision carried the room.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ScribbleButton
                title="Navigate to previous project case"
                ariaLabel="Go to previous project in signature reel"
                variant="micro"
                tone="light"
                size="sm"
                showArrow={false}
                onClick={() => selectProject(selectedIndex - 1)}
                analyticsLabel="signature-prev"
                disabled={!hasPrev}
              >
                Previous Case
              </ScribbleButton>
              <ScribbleButton
                title="Navigate to next project case"
                ariaLabel="Go to next project in signature reel"
                variant="micro"
                tone="light"
                size="sm"
                showArrow={false}
                onClick={() => selectProject(selectedIndex + 1)}
                analyticsLabel="signature-next"
                disabled={!hasNext}
              >
                Next Case
              </ScribbleButton>
            </div>
          </div>
        </SceneCard>

        <div className="command-aperture-stage relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:p-4">
          <motion.img
            key={selected.id}
            src={selected.image}
            alt={selected.title}
            className="absolute inset-0 h-full w-full object-cover"
            initial={reduced ? false : { opacity: 0.78, scale: 1.16 }}
            style={{ scale: reduced ? 1.02 : 1.1, y: backgroundY }}
            animate={
              reduced
                ? undefined
                : {
                    opacity: 1,
                    x: [0, -22, 0],
                    y: [backgroundY, backgroundY + 8, backgroundY],
                    scale: [1.1, 1.12, 1.1],
                  }
            }
            transition={{
              duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.2,
              ease: AUTHORITY_EASE,
              repeat: Infinity,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,12,0.46)_0%,rgba(4,7,12,0.88)_100%)]" />
          <motion.div
            aria-hidden="true"
            className="command-aperture-beam pointer-events-none absolute inset-0 z-[1]"
            style={{
              y: midY,
              clipPath: `inset(0 ${apertureInset}% 0 ${apertureInset}% round 24px)`,
            }}
          />

          <div className="relative z-10 grid gap-4">
            <p className="px-2 pt-2 text-[10px] uppercase tracking-[0.14em] text-white/76">
              Active Case {String(selectedIndex + 1).padStart(2, '0')} /{' '}
              {String(PROJECTS.length).padStart(2, '0')}
            </p>

            <motion.div
              className="hidden gap-3 md:flex will-change-transform"
              animate={reduced ? undefined : { x: conveyorOffset }}
              transition={{
                duration: MOTION_TOKEN_CONTRACT.durations.ui,
                ease: MASS_EASE,
              }}
            >
              {PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
                  ref={index === 0 ? firstCardRef : undefined}
                  animate={{
                    y: reduced ? 0 : index === selectedIndex ? 0 : 10,
                    scale: reduced ? 1 : index === selectedIndex ? 1 : 0.95,
                  }}
                  transition={{
                    duration: MOTION_TOKEN_CONTRACT.durations.scene,
                    ease: MASS_EASE,
                    delay: reduced ? 0 : index * 0.03,
                  }}
                >
                  <ProjectCard
                    project={project}
                    active={index === selectedIndex}
                    reduced={reduced}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div
              ref={mobileTrackRef}
              className="cinematic-horizontal-rail flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:hidden"
              style={{ touchAction: 'pan-x' }}
              onScroll={handleMobileTrackScroll}
              role="region"
              aria-label="Signature projects horizontal rail"
            >
              {PROJECTS.map((project, index) => (
                <div key={`mobile-${project.id}`} data-project-index={index}>
                  <ProjectCard
                    project={project}
                    active={index === selectedIndex}
                    reduced={reduced}
                    interactive
                    onSelect={() => selectProject(index)}
                  />
                </div>
              ))}
            </div>

            <motion.div
              key={selected.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: MOTION_TOKEN_CONTRACT.durations.scene,
                ease: RELEASE_EASE,
              }}
            >
              <SceneCard className="border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.78)] p-4 backdrop-blur-md">
                <h3 className="font-serif text-[1.2rem] text-[var(--color-ink)]">
                  {selected.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  {selected.challenge}
                </p>
                <div className="mt-4">
                  <ScribbleButton
                    title="Open full production case details"
                    to={`/work/${selected.slug}`}
                    variant="primary"
                    tone="light"
                    size="md"
                    analyticsLabel={`signature-case-${selected.slug}`}
                  >
                    View Case Study
                  </ScribbleButton>
                </div>
              </SceneCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Command Arrival: emotional landing and authority prelude.
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
      // Base styles that apply to both mobile and desktop
      gsap.set(transitionWrapper, {
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 10,
        background:
          'linear-gradient(180deg, #ffffff 0%, #f8f9fb 50%, #f0f3f8 100%)',
      })
      gsap.set(heroSection, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1,
        zIndex: 3,
      })
      gsap.set(nextSection, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        y: '50%',
        opacity: 0,
        zIndex: 2,
        overflow: 'hidden',
      })
      gsap.set(video, { scale: 1, transformOrigin: 'center center' })
      gsap.set(eyebrowNode, { opacity: 1, y: 0 })
      gsap.set(headlineNode, { opacity: 1, y: 0 })
      gsap.set(subtextNode, { opacity: 1 })
      gsap.set(ctaNode, { opacity: 1 })

      ScrollTrigger.matchMedia({
        // ── Mobile: disable pinning, show static hero content ───────────────────
        [`(max-width: ${MOBILE_BREAKPOINT - 1}px)`]: function mobileSetup() {
          // On mobile, just show the hero section statically without scroll transitions
          gsap.set(ledgerTextNodes, { opacity: 1, y: 0 })
          gsap.set(ledgerCardNodes, { opacity: 1, y: 0 })
          if (ledgerCtaNode) gsap.set(ledgerCtaNode, { opacity: 1, y: 0 })

          // Return cleanup for mobile context
          return () => {
            gsap.set(ledgerTextNodes, { clearProps: 'all' })
            gsap.set(ledgerCardNodes, { clearProps: 'all' })
            if (ledgerCtaNode) gsap.set(ledgerCtaNode, { clearProps: 'all' })
          }
        },

        // ── Desktop: enable pinning and scroll-driven animations ─────────────────
        [`(min-width: ${MOBILE_BREAKPOINT}px)`]: function desktopSetup() {
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

          // Return cleanup for desktop context
          return () => {
            if (timeline?.scrollTrigger) timeline.scrollTrigger.kill()
            gsap.set(ledgerTextNodes, { clearProps: 'all' })
            gsap.set(ledgerCardNodes, { clearProps: 'all' })
            if (ledgerCtaNode) gsap.set(ledgerCtaNode, { clearProps: 'all' })
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

        <div className="authority-ledger-capability-grid">
          {CAPABILITY_MODULES.map((module, index) => (
            <motion.article
              key={module.id}
              variants={
                !embedded && !reduced
                  ? revealLift(index * 0.06 + 0.1, 14)
                  : undefined
              }
            >
              <SceneCard className="authority-ledger-card authority-ledger-capability h-full overflow-hidden p-4 md:p-5">
                <img
                  src={module.image}
                  alt={module.title}
                  loading="lazy"
                  decoding="async"
                  className="authority-ledger-media w-full rounded-xl border border-[var(--color-border)] object-cover"
                />
                <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  {module.title}
                </p>
                <p className="mt-2 text-[clamp(0.9rem,1.15vw,1.02rem)] leading-relaxed text-[var(--color-ink-muted)]">
                  {module.summary}
                </p>
              </SceneCard>
            </motion.article>
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

// Capability Matrix: layered craft capabilities with depth.
export const CapabilityMatrixScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [24, -14])
  const midY = useTransform(scrollYProgress, [0, 1], [14, -10])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [6, -6])

  return (
    <FreeSceneFrame
      scene={scene}
      pinBehavior="matrix-reveal"
      layout="capability-matrix"
      className="scene-cinematic scene-capability-matrix"
    >
      {({ reduced }) => (
        <div
          ref={depthRef}
          className="scene-depth-stage scene-depth-stage-matrix"
        >
          <AmbientDepthField
            reduced={reduced}
            variant="matrix"
            backgroundY={backgroundY}
            midY={midY}
            foregroundY={foregroundY}
            glowOpacity={0.4}
          />

          <motion.div
            variants={sequence(0.03, 0.08)}
            initial={reduced ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
            className="relative z-[2] grid gap-4"
          >
            <motion.div variants={revealLift(0.01, 10)}>
              <SceneCard className="p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
                  Capabilities
                </p>
                <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.55rem,2.95vw,2.42rem)] leading-[1.08] text-[var(--color-ink)]">
                  Technical depth, creative precision, operational control.
                </h2>
              </SceneCard>
            </motion.div>

            <div className="grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.article variants={revealSide(0.08, 20)}>
                <SceneCard className="h-full overflow-hidden p-4 md:p-5">
                  <img
                    src={CAPABILITY_MODULES[0].image}
                    alt={CAPABILITY_MODULES[0].title}
                    loading="lazy"
                    decoding="async"
                    className="h-40 w-full rounded-xl border border-[var(--color-border)] object-cover"
                  />
                  <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                    Primary Capability
                  </p>
                  <h3 className="mt-2 font-serif text-[1.3rem] text-[var(--color-ink)]">
                    {CAPABILITY_MODULES[0].title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {CAPABILITY_MODULES[0].detail}
                  </p>
                </SceneCard>
              </motion.article>

              <div className="grid gap-3">
                {CAPABILITY_MODULES.slice(1).map((module, index) => (
                  <motion.article
                    key={module.id}
                    variants={revealLift(index * 0.06 + 0.12, 10)}
                  >
                    <SceneCard className="overflow-hidden">
                      <div className="grid gap-3 sm:grid-cols-[0.42fr_0.58fr]">
                        <img
                          src={module.image}
                          alt={module.title}
                          loading="lazy"
                          decoding="async"
                          className="h-24 w-full rounded-xl border border-[var(--color-border)] object-cover"
                        />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                            Capability Track
                          </p>
                          <h3 className="mt-1 font-serif text-[1.06rem] text-[var(--color-ink)]">
                            {module.title}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                            {module.summary}
                          </p>
                        </div>
                      </div>
                    </SceneCard>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

// NOTE: OperationsSpineScene is NOT re-exported from here.
// Import it directly from './OperationsSpineScene'.

// Narrative Bridge: release tension before proof concentration.
export const NarrativeBridgeScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [20, -12])
  const midY = useTransform(scrollYProgress, [0, 1], [12, -8])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [6, -4])
  const cardY = useTransform(scrollYProgress, [0, 1], [10, -8])
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.985, 1.015])

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
          className="scene-depth-stage scene-depth-stage-bridge"
        >
          <AmbientDepthField
            reduced={reduced}
            variant="bridge"
            backgroundY={backgroundY}
            midY={midY}
            foregroundY={foregroundY}
            glowOpacity={0.36}
          />
          <motion.div
            style={reduced ? undefined : { y: cardY, scale: cardScale }}
            className="relative z-[2]"
          >
            <SceneCard className="relative grid min-h-[clamp(320px,50vh,500px)] place-items-center overflow-hidden text-center p-6 md:p-8">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: MOTION_TOKEN_CONTRACT.durations.scene,
                  ease: AUTHORITY_EASE,
                }}
                className="text-[11px] uppercase tracking-[0.17em] text-[var(--color-ink-subtle)]"
              >
                Outcome Transition
              </motion.p>
              <motion.h2
                initial={
                  reduced
                    ? false
                    : { opacity: 0, y: 16, letterSpacing: '-0.06em' }
                }
                whileInView={{ opacity: 1, y: 0, letterSpacing: '-0.03em' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.1,
                  ease: MASS_EASE,
                  delay: 0.05,
                }}
                className="mt-4 max-w-[20ch] font-serif text-[clamp(1.8rem,3.9vw,2.85rem)] leading-[1.08] text-[var(--color-ink)]"
              >
                Precision is only credible when proof carries the weight.
              </motion.h2>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: MOTION_TOKEN_CONTRACT.durations.scene,
                  ease: AUTHORITY_EASE,
                  delay: 0.12,
                }}
                className="mt-5 max-w-[60ch] text-sm leading-relaxed text-[var(--color-ink-muted)]"
              >
                The next chapter shifts from directional language to verified
                outcomes, named stakeholders, and delivery context.
              </motion.p>
            </SceneCard>
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

// FIX 1: ProofTheaterSplit — testimonial slide direction now tracked via a ref
const ProofTheaterSplit = ({ reduced }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [entryDirection, setEntryDirection] = useState(1)
  const touchStartXRef = useRef(null)
  const touchDeltaRef = useRef(0)
  const safeIndex = clampIndex(
    activeIndex,
    Math.max(TESTIMONIALS.length - 1, 0)
  )
  const active = TESTIMONIALS[safeIndex]
  const progress = TESTIMONIALS.length
    ? ((safeIndex + 1) / TESTIMONIALS.length) * 100
    : 0
  const hasPrev = safeIndex > 0
  const hasNext = safeIndex < TESTIMONIALS.length - 1

  const goPrev = () => {
    setEntryDirection(-1)
    setActiveIndex(index => clampIndex(index - 1, TESTIMONIALS.length - 1))
  }

  const goNext = () => {
    setEntryDirection(1)
    setActiveIndex(index => clampIndex(index + 1, TESTIMONIALS.length - 1))
  }

  const onTouchStart = event => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
    touchDeltaRef.current = 0
  }

  const onTouchMove = event => {
    if (touchStartXRef.current === null) return
    touchDeltaRef.current =
      (event.touches[0]?.clientX ?? touchStartXRef.current) -
      touchStartXRef.current
  }

  const onTouchEnd = () => {
    if (touchStartXRef.current === null) return
    const threshold = 46
    if (touchDeltaRef.current <= -threshold) goNext()
    if (touchDeltaRef.current >= threshold) goPrev()
    touchStartXRef.current = null
    touchDeltaRef.current = 0
  }

  const onRailKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  return (
    <div className="relative grid gap-3 overflow-hidden rounded-2xl">
      <div className="relative grid gap-3 lg:grid-cols-[0.6fr_0.4fr]">
        <SceneCard
          className="bg-[var(--color-surface)] p-5"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onKeyDown={onRailKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Client testimonial carousel; use arrow keys to navigate"
        >
          {active ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0,
                        x: entryDirection * 72,
                        rotate: entryDirection * 3.2,
                        scale: 0.96,
                      }
                }
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        x: entryDirection * -44,
                        rotate: entryDirection * -2.2,
                        scale: 0.98,
                      }
                }
                transition={{
                  duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.12,
                  ease: MASS_EASE,
                }}
                className="grid gap-4"
              >
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                  <img
                    src={active.image}
                    alt={active.name}
                    loading="lazy"
                    decoding="async"
                    className={`h-56 w-full object-cover ${reduced ? '' : 'proof-image-kenburns'}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-subtle)]">
                    Featured Client Voice
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-ink)]">
                    "{active.quote}"
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                    {active.name}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {active.role}, {active.organization}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div
                    className="relative h-1.5 overflow-hidden rounded-full bg-[var(--color-accent-soft)]"
                    role="progressbar"
                    aria-label="Testimonial progression"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                  >
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        duration: MOTION_TOKEN_CONTRACT.durations.ui,
                        ease: MASS_EASE,
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <ScribbleButton
                      title="Previous client testimonial"
                      ariaLabel="Go to previous testimonial"
                      variant="micro"
                      tone="light"
                      size="sm"
                      showArrow={false}
                      onClick={goPrev}
                      analyticsLabel="proof-prev"
                      disabled={!hasPrev}
                    >
                      Previous
                    </ScribbleButton>
                    <ScribbleButton
                      title="Next client testimonial"
                      ariaLabel="Go to next testimonial"
                      variant="micro"
                      tone="light"
                      size="sm"
                      showArrow={false}
                      onClick={goNext}
                      analyticsLabel="proof-next"
                      disabled={!hasNext}
                    >
                      Next
                    </ScribbleButton>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </SceneCard>

        <SceneCard className="bg-[var(--color-surface-2)] p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
            Client Index
          </p>
          <div className="mt-3 grid gap-2">
            {TESTIMONIALS.map((item, index) => (
              <ScribbleButton
                key={item.id}
                type="button"
                onClick={() => {
                  setEntryDirection(index > safeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                variant={index === safeIndex ? 'primary' : 'outline'}
                tone="light"
                size="sm"
                showArrow={false}
                analyticsLabel={`proof-index-${item.id}`}
                className="proof-index-button"
              >
                <div className="grid items-center gap-2 sm:grid-cols-[64px_1fr]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-full rounded-md border border-[var(--color-border)] object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      {item.role}
                    </p>
                    <p className="text-xs text-[var(--color-ink-subtle)]">
                      {item.organization}
                    </p>
                  </div>
                </div>
              </ScribbleButton>
            ))}
          </div>
        </SceneCard>
      </div>
    </div>
  )
}

// Proof Theater: rectangular, project-style testimonial presentation.
export const ProofTheaterScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [42, -30])
  const midY = useTransform(scrollYProgress, [0, 1], [26, -18])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [14, -10])

  return (
    <FreeSceneFrame
      scene={scene}
      pinBehavior="proof-consolidation"
      layout="proof-theater"
      className="scene-cinematic scene-proof-theater"
    >
      {({ reduced }) => (
        <div
          ref={depthRef}
          className="scene-depth-stage scene-depth-stage-proof"
        >
          <AmbientDepthField
            reduced={reduced}
            variant="proof"
            backgroundY={backgroundY}
            midY={midY}
            foregroundY={foregroundY}
            glowOpacity={0.46}
          />
          <div className="relative z-[2] grid gap-5">
            <SceneCard className="p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
                Client Outcomes
              </p>
              <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.56rem,2.95vw,2.44rem)] leading-[1.08] text-[var(--color-ink)]">
                Verified outcomes, named stakeholders, accountable delivery.
              </h2>
            </SceneCard>
            <ProofTheaterSplit reduced={reduced} />
          </div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

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
      setStatus('success')
      setFeedbackMessage(
        'Request received. A senior producer will contact you within one business day.'
      )
      form.reset()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to submit request right now. Please retry in a moment.'
      setStatus('error')
      setFeedbackMessage(message)
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

// Conversion close: API-aware intake flow with stub fallback when no endpoint is configured.
export const ConversionChamberScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    pinBehavior="closing-ritual"
    layout="conversion-chamber"
    className="scene-cinematic scene-conversion-chamber"
  >
    {({ reduced }) => <ConversionChamberContent reduced={reduced} />}
  </FreeSceneFrame>
)

// FIX 5: Removed CLIENT_LOGO_ASSET_BY_ORGANIZATION block — always empty, never rendered.
export const GlobalFooterScene = ({ scene }) => {
  const currentYear = new Date().getFullYear()

  return (
    <FreeSceneFrame
      scene={scene}
      pinBehavior="terminal-close"
      layout="global-footer"
      className="scene-cinematic scene-global-footer"
    >
      {({ reduced }) => (
        <motion.div
          variants={sequence(0.05, 0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4"
        >
          <SceneCard className="p-5 md:p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">
              Next Move
            </p>
            <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(1.6rem,2.95vw,2.45rem)] leading-[1.08] text-[var(--color-ink)]">
              Precision-led production for moments where public failure is not
              an option.
            </h2>
            <p className="mt-4 max-w-[62ch] text-sm text-[var(--color-ink-muted)]">
              Regional reach across UAE, one accountable command structure, and
              execution discipline from scope to show close.
            </p>
          </SceneCard>

          <div className="grid gap-3 md:grid-cols-4">
            <motion.div variants={revealLift(0.02, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Company
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {FOOTER_COMPANY_LINKS.map(item => (
                    <li key={item.to}>
                      <Link
                        className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                        to={item.to}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.06, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Services
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {services.slice(0, 4).map(service => (
                    <li key={service.slug}>
                      <Link
                        className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                        to={`/services/${service.slug}`}
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.1, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Case Work
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {caseStudies.map(study => (
                    <li key={study.slug}>
                      <Link
                        className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                        to={`/work/${study.slug}`}
                      >
                        {study.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.14, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
                  Direct Contact
                </p>
                <div className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  <a
                    className="footer-micro-link block transition-colors hover:text-[var(--color-ink)]"
                    href="tel:+97142345678"
                  >
                    +971 4 234 5678
                  </a>
                  <a
                    className="footer-micro-link block transition-colors hover:text-[var(--color-ink)]"
                    href="mailto:hello@ghaimuae.com"
                  >
                    hello@ghaimuae.com
                  </a>
                  <p>Dubai Design District, UAE</p>
                </div>
              </SceneCard>
            </motion.div>
          </div>

          <SceneCard className="footer-utility-row p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
              <p className="text-xs text-[var(--color-ink-subtle)]">
                {currentYear} Ghaim UAE. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.11em] text-[var(--color-ink-subtle)]">
                <Link
                  className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                  to="/privacy"
                >
                  Privacy
                </Link>
                <Link
                  className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                  to="/terms"
                >
                  Terms
                </Link>
                <a
                  className="footer-micro-link transition-colors hover:text-[var(--color-ink)]"
                  href="mailto:hello@ghaimuae.com"
                >
                  Support
                </a>
              </div>
              <ScribbleButton
                title="Open final proposal request flow"
                variant="micro"
                tone="light"
                size="sm"
                to="/contact"
                analyticsLabel="footer-utility-submit"
                showArrow={false}
              >
                Submit Request
              </ScribbleButton>
            </div>
          </SceneCard>

          <div className="pb-2">
            <ScribbleButton
              title="Open contact and schedule executive consult"
              variant="primary"
              tone="light"
              size="md"
              analyticsLabel="footer-command-consult"
              to="/contact"
            >
              Request Proposal
            </ScribbleButton>
          </div>
        </motion.div>
      )}
    </FreeSceneFrame>
  )
}
