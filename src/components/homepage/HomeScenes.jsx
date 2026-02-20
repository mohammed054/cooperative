import React, { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import ScribbleButton from '../ScribbleButton'
import {
  HeroAmbientCanvas,
  SceneShell,
  SceneWrapper,
  ScrollLockedSection,
} from '../flagship'
import { MOTION_TOKEN_CONTRACT, parseBezier } from '../../motion/motionTokenContract.js'
import { caseStudies, services, testimonials as testimonialData } from '../../data/siteData'
import { assetUrl } from '../../lib/assetUrl'
import { isLeadCaptureConfigured, submitLead } from '../../utils/leadCapture'

const FREE = 'free'
const PINNED = 'pinned'
const AUTHORITY_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.authority)
const MASS_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.mass)
const RELEASE_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.release)

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
    image: caseStudies[index]?.image || PROJECTS[index % PROJECTS.length]?.image,
  }))

const OPERATIONS_STEPS = [
  {
    id: '01',
    title: 'Executive Briefing',
    detail:
      'Scope, stakeholders, and decision constraints are locked before creative routing begins.',
    image: assetUrl('images/process-bg.jpg'),
  },
  {
    id: '02',
    title: 'Systems Alignment',
    detail:
      'Production, venue, and technical teams align under one command structure.',
    image: assetUrl('images/event-planning.png'),
  },
  {
    id: '03',
    title: 'Rehearsal Control',
    detail:
      'Cue integrity and fallback logic are validated under full run conditions.',
    image: assetUrl('images/event-planning-in-action.png'),
  },
  {
    id: '04',
    title: 'Live Command',
    detail:
      'Floor leadership executes timing and transitions with protected authority.',
    image: assetUrl('images/full-production.png'),
  },
]

const FOOTER_COMPANY_LINKS = [
  { to: '/about', label: 'Company' },
  { to: '/process', label: 'Process' },
  { to: '/pricing', label: 'Engagement' },
  { to: '/faq', label: 'FAQ' },
]

const CLIENT_LOGO_ASSET_BY_ORGANIZATION = Object.freeze({})

const CLIENT_PROOF_MARKS = TESTIMONIALS
  .map(item => ({
    id: `client-mark-${item.id}`,
    name: item.organization,
    role: item.role,
    logo: CLIENT_LOGO_ASSET_BY_ORGANIZATION[item.organization] || null,
  }))
  .filter(mark => Boolean(mark.logo))
const HAS_CLIENT_LOGOS = CLIENT_PROOF_MARKS.length > 0

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
      const stat = study.stats?.find(item => /cue|reset|phase|act|screen/i.test(item.label))
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
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduced) return undefined

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
  }, [reduced, value])

  return (
    <span>
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

const AmbientDepthField = ({
  reduced,
  variant = 'core',
  backgroundY = 0,
  midY = 0,
  foregroundY = 0,
  glowOpacity = 0.5,
}) => (
  <div aria-hidden="true" className={`scene-ambient-field scene-ambient-${variant}`}>
    <motion.span
      className="scene-ambient-layer scene-ambient-back"
      style={reduced ? undefined : { y: backgroundY }}
      animate={
        reduced
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
        reduced
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
        reduced
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

const FreeSceneFrame = ({ scene, pinBehavior, layout, className = '', children }) => {
  const reduced = useReducedMotion()
  const content = typeof children === 'function' ? children({ reduced }) : children

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
        <SceneShell scene={scene} scrollMode={FREE} pinBehavior={pinBehavior} layout={layout}>
          {content}
        </SceneShell>
      </SceneWrapper>
      <SceneTransitionHook scene={scene} position="post" />
    </>
  )
}

const PinnedSceneFrame = ({ scene, pinBehavior, layout, className = '', children }) => (
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
        <SceneShell scene={scene} scrollMode={PINNED} pinBehavior={pinBehavior} layout={layout}>
          {typeof children === 'function' ? children({ progress, reduced }) : children}
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

const ProjectCard = ({ project, active, reduced, onSelect, interactive = false }) => {
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
      aria-label={interactive ? `Select project panel: ${project.title}` : undefined}
      animate={{
        opacity: reduced ? 1 : active ? 1 : 0.62,
        scale: reduced ? 1 : active ? 1 : 0.96,
        y: reduced ? 0 : active ? 0 : 10,
        rotateX: reduced ? 0 : active ? 0 : 3.8,
        rotateY: reduced ? 0 : active ? 0 : -2,
      }}
      transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS_EASE }}
      style={{ transformPerspective: 980, transformStyle: 'preserve-3d' }}
      className={`cinematic-interactive-card min-w-[252px] snap-start rounded-2xl border p-3 ${
        active
          ? 'border-[rgba(234,241,255,0.44)] bg-[var(--color-surface-2)] shadow-[0_30px_70px_rgba(3,5,8,0.44)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_14px_30px_rgba(4,6,10,0.24)]'
      } ${interactive ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-36 overflow-hidden rounded-xl border border-[var(--color-border)]">
        <img src={project.image} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,28,36,0.08)_0%,rgba(24,28,36,0.48)_100%)]" />
        <p className="absolute left-3 top-3 text-[9px] uppercase tracking-[0.14em] text-white/80">{project.location}</p>
      </div>
      <h3 className="mt-3 font-serif text-[1.08rem] text-[var(--color-ink)]">{project.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{project.subtitle}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">{project.outcome}</p>
    </motion.article>
  )
}

const SignatureReelContent = ({ progress, reduced }) => {
  const mobileTrackRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const [manualIndex, setManualIndex] = useState(null)

  const indexFromScroll = clampIndex(Math.floor(progress * PROJECTS.length), PROJECTS.length - 1)
  const manualIndexInRange =
    typeof manualIndex === 'number' &&
    Math.abs(indexFromScroll - manualIndex) <= 1
  const selectedIndex = manualIndexInRange ? manualIndex : indexFromScroll
  const selected = PROJECTS[selectedIndex]
  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < PROJECTS.length - 1

  const tension = reduced ? 0 : Math.max(0, 1 - Math.abs(progress - 0.55) / 0.55)
  const apertureInset = reduced ? 0 : 8 + tension * 26
  const conveyorOffset = reduced ? 0 : -progress * (PROJECTS.length - 1) * 252
  const backgroundY = reduced ? 0 : (0.5 - progress) * 40
  const midY = reduced ? 0 : (0.5 - progress) * 22
  const foregroundY = reduced ? 0 : (0.5 - progress) * 14

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
    const target = mobileTrackRef.current.querySelector(`[data-project-index="${clamped}"]`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
  }

  const syncSelectedIndexFromMobileRail = () => {
    if (!mobileTrackRef.current) return
    const items = Array.from(
      mobileTrackRef.current.querySelectorAll('[data-project-index]')
    )
    if (!items.length) return

    const currentLeft = mobileTrackRef.current.scrollLeft
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    items.forEach(node => {
      const index = Number(node.getAttribute('data-project-index'))
      const distance = Math.abs(node.offsetLeft - currentLeft)
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
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Featured Engagements</p>
              <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.6rem,2.95vw,2.52rem)] leading-[1.06] text-[var(--color-ink)]">
                Three recent productions where precision carried the room.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ScribbleButton title="Navigate to previous project case" ariaLabel="Go to previous project in signature reel" variant="micro" tone="light" size="sm" showArrow={false} onClick={() => selectProject(selectedIndex - 1)} analyticsLabel="signature-prev" disabled={!hasPrev}>
                Previous Case
              </ScribbleButton>
              <ScribbleButton title="Navigate to next project case" ariaLabel="Go to next project in signature reel" variant="micro" tone="light" size="sm" showArrow={false} onClick={() => selectProject(selectedIndex + 1)} analyticsLabel="signature-next" disabled={!hasNext}>
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
            animate={reduced ? undefined : { opacity: 1, x: [0, -22, 0], y: [backgroundY, backgroundY + 8, backgroundY], scale: [1.1, 1.12, 1.1] }}
            transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.2, ease: AUTHORITY_EASE, repeat: Infinity }}
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
              Active Case {String(selectedIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </p>

            <motion.div
              className="hidden gap-3 md:flex will-change-transform"
              animate={reduced ? undefined : { x: conveyorOffset }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS_EASE }}
            >
              {PROJECTS.map((project, index) => (
                <motion.div
                  key={project.id}
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
                  <ProjectCard project={project} active={index === selectedIndex} reduced={reduced} />
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
                  <ProjectCard project={project} active={index === selectedIndex} reduced={reduced} interactive onSelect={() => selectProject(index)} />
                </div>
              ))}
            </div>

            <motion.div
              key={selected.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: RELEASE_EASE }}
            >
              <SceneCard className="border-[rgba(255,255,255,0.52)] bg-[rgba(255,255,255,0.78)] p-4 backdrop-blur-md">
                <h3 className="font-serif text-[1.2rem] text-[var(--color-ink)]">{selected.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{selected.challenge}</p>
                <div className="mt-4">
                  <ScribbleButton title="Open full production case details" to={`/work/${selected.slug}`} variant="primary" tone="light" size="md" analyticsLabel={`signature-case-${selected.slug}`}>
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
export const CommandArrivalScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [56, -42])
  const midY = useTransform(scrollYProgress, [0, 1], [28, -24])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [16, -12])
  const rayY = useTransform(scrollYProgress, [0, 1], [0, -34])
  const particleY = useTransform(scrollYProgress, [0, 1], [16, -18])
  const mediaRef = scene?.videoSrc || scene?.media?.ref
  const heroMediaSrc = Array.isArray(mediaRef) ? mediaRef[0] : mediaRef
  const headline =
    scene?.headline ||
    'We command public moments where failure is visible and expensive.'
  const subtitle =
    scene?.subtitle ||
    'Ghaim unifies narrative direction, technical systems, and floor authority for executive events that cannot miss timing, clarity, or impact.'
  const ctaText = scene?.ctaText || 'See Signature Builds'

  return (
    <FreeSceneFrame scene={scene} pinBehavior="authority-prelude" layout="hero-command" className="scene-cinematic scene-command-arrival scene-command-arrival-full">
      {({ reduced }) => (
        <div ref={depthRef} className="scene-depth-stage scene-depth-stage-hero-full relative overflow-hidden">
          <AmbientDepthField
            reduced={reduced}
            variant="hero"
            backgroundY={backgroundY}
            midY={midY}
            foregroundY={foregroundY}
            glowOpacity={0.58}
          />

          <div className="absolute inset-0 z-0">
            <motion.video
              className="hero-command-video h-full w-full object-cover"
              src={heroMediaSrc}
              preload="metadata"
              muted
              loop
              playsInline
              autoPlay
              initial={reduced ? false : { opacity: 0.74, scale: 1.1 }}
              style={reduced ? undefined : { y: backgroundY }}
              animate={reduced ? undefined : { opacity: 1, scale: [1.02, 1.06, 1.02] }}
              transition={{
                duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.6,
                ease: AUTHORITY_EASE,
                repeat: Infinity,
              }}
            />
          </div>

          <HeroAmbientCanvas />
          <motion.div className="hero-volumetric-layer" style={reduced ? undefined : { y: rayY }} animate={reduced ? undefined : { opacity: [0.3, 0.44, 0.3] }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.8, ease: MASS_EASE, repeat: Infinity }} />
          <motion.div className="hero-light-ray-layer" style={reduced ? undefined : { y: rayY }} animate={reduced ? undefined : { opacity: [0.18, 0.32, 0.18], x: [0, 20, 0] }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 3.4, ease: AUTHORITY_EASE, repeat: Infinity }} />
          <motion.div className="hero-particle-layer" style={reduced ? undefined : { y: particleY }} animate={reduced ? undefined : { opacity: [0.16, 0.24, 0.16] }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.4, ease: RELEASE_EASE, repeat: Infinity }} />
          <motion.div className="hero-vignette-layer" animate={reduced ? undefined : { opacity: [0.38, 0.46, 0.38] }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.6, ease: AUTHORITY_EASE, repeat: Infinity }} />
          <motion.div className="hero-dof-layer" animate={reduced ? undefined : { opacity: [0.22, 0.3, 0.22] }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 2.1, ease: MASS_EASE, repeat: Infinity }} />
          <div className="hero-command-soften-layer" />

          <div className="hero-command-overlay absolute inset-0 z-20 flex flex-col items-start justify-center px-4 sm:px-6 md:px-10 lg:px-14">
            <motion.div
              variants={sequence(0.04, MOTION_TOKEN_CONTRACT.stagger.line)}
              initial={reduced ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.28 }}
              className="hero-command-copy w-[90%] sm:w-[82%] lg:w-[40%] max-w-none"
            >
              <div className="inline-flex max-w-full flex-col p-1">
                <motion.p variants={revealLift(0.02, 10)} className="text-xs uppercase tracking-[0.18em] text-white/80">
                  Executive Event Command
                </motion.p>
                <motion.h1
                  variants={revealLift(0.06, 16)}
                  className="mt-4 max-w-[16ch] font-serif text-[clamp(1.9rem,7.8vw,5.4rem)] leading-[0.98] tracking-[-0.03em] text-white"
                >
                  {headline}
                </motion.h1>
                <motion.p
                  variants={revealLift(0.12, 12)}
                  className="mt-5 max-w-[38ch] text-[clamp(0.98rem,2.15vw,1.45rem)] leading-relaxed text-white/90"
                >
                  {subtitle}
                </motion.p>
                <motion.div variants={revealLift(0.17, 10)} className="mt-8">
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
            </motion.div>
          </div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

// Authority Ledger: real outcomes and command capability framing.
export const AuthorityLedgerScene = ({ scene }) => {
  const depthRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: depthRef,
    offset: ['start end', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], [30, -20])
  const midY = useTransform(scrollYProgress, [0, 1], [18, -14])
  const foregroundY = useTransform(scrollYProgress, [0, 1], [8, -8])

  return (
    <FreeSceneFrame scene={scene} pinBehavior="evidence-ramp" layout="authority-ledger" className="scene-cinematic scene-authority-ledger">
      {({ reduced }) => (
        <div ref={depthRef} className="scene-depth-stage scene-depth-stage-ledger">
          <AmbientDepthField reduced={reduced} variant="ledger" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.44} />

          <motion.div variants={sequence(0.04, 0.1)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.24 }} className="relative z-[2] grid gap-5">
            <motion.div variants={revealLift(0.02, 12)}>
              <SceneCard className="p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.17em] text-[var(--color-ink-subtle)]">Performance Record</p>
                <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.07] text-[var(--color-ink)]">Outcome authority before visual theater.</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {AUTHORITY_METRICS.map((metric, index) => (
                    <motion.div key={metric.label} variants={revealMask(index * 0.03)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">{metric.label}</p>
                      <p className="mt-2 font-serif text-[1.45rem] leading-none text-[var(--color-ink)]"><CountUpMetric value={metric.value} suffix={metric.suffix} reduced={reduced} /></p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-5">
                  <ScribbleButton title="Open capability and delivery portfolio" variant="outline" tone="light" size="sm" to="/services" analyticsLabel="authority-ledger-capabilities">
                    Explore Capabilities
                  </ScribbleButton>
                </div>
              </SceneCard>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-3">
              {CAPABILITY_MODULES.map((module, index) => (
                <motion.article key={module.id} variants={revealLift(index * 0.05 + 0.08, 12)}>
                  <SceneCard className="h-full overflow-hidden">
                    <img src={module.image} alt={module.title} loading="lazy" decoding="async" className="h-24 w-full rounded-xl border border-[var(--color-border)] object-cover" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">{module.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{module.summary}</p>
                  </SceneCard>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

// Signature Reel: anchor cinematic lock moment.
export const SignatureReelScene = ({ scene }) => (
  <PinnedSceneFrame scene={scene} pinBehavior="command-aperture-lock" layout="command-aperture" className="scene-cinematic scene-signature-reel">
    {({ progress, reduced }) => <SignatureReelContent progress={progress} reduced={reduced} />}
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
    <FreeSceneFrame scene={scene} pinBehavior="matrix-reveal" layout="capability-matrix" className="scene-cinematic scene-capability-matrix">
      {({ reduced }) => (
        <div ref={depthRef} className="scene-depth-stage scene-depth-stage-matrix">
          <AmbientDepthField reduced={reduced} variant="matrix" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.4} />

          <motion.div variants={sequence(0.03, 0.08)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.22 }} className="relative z-[2] grid gap-4">
            <motion.div variants={revealLift(0.01, 10)}>
              <SceneCard className="p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Capabilities</p>
                <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.55rem,2.95vw,2.42rem)] leading-[1.08] text-[var(--color-ink)]">Technical depth, creative precision, operational control.</h2>
              </SceneCard>
            </motion.div>

            <div className="grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.article variants={revealSide(0.08, 20)}>
                <SceneCard className="h-full overflow-hidden p-4 md:p-5">
                  <img src={CAPABILITY_MODULES[0].image} alt={CAPABILITY_MODULES[0].title} loading="lazy" decoding="async" className="h-40 w-full rounded-xl border border-[var(--color-border)] object-cover" />
                  <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Primary Capability</p>
                  <h3 className="mt-2 font-serif text-[1.3rem] text-[var(--color-ink)]">{CAPABILITY_MODULES[0].title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">{CAPABILITY_MODULES[0].detail}</p>
                </SceneCard>
              </motion.article>

              <div className="grid gap-3">
                {CAPABILITY_MODULES.slice(1).map((module, index) => (
                  <motion.article key={module.id} variants={revealLift(index * 0.06 + 0.12, 10)}>
                    <SceneCard className="overflow-hidden">
                      <div className="grid gap-3 sm:grid-cols-[0.42fr_0.58fr]">
                        <img src={module.image} alt={module.title} loading="lazy" decoding="async" className="h-24 w-full rounded-xl border border-[var(--color-border)] object-cover" />
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Capability Track</p>
                          <h3 className="mt-1 font-serif text-[1.06rem] text-[var(--color-ink)]">{module.title}</h3>
                          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{module.summary}</p>
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

// Operations Spine: pinned process friction and staged control.
export const OperationsSpineScene = ({ scene }) => (
  <PinnedSceneFrame scene={scene} pinBehavior="precision-friction" layout="operations-spine" className="scene-cinematic scene-operations-spine">
    {({ progress, reduced }) => {
      const activeStep = Math.min(OPERATIONS_STEPS.length - 1, Math.floor(progress * OPERATIONS_STEPS.length))
      const railProgress = ((activeStep + 1) / OPERATIONS_STEPS.length) * 100
      const ctaVisible = reduced || progress > 0.62
      const backgroundY = reduced ? 0 : (0.5 - progress) * 34
      const midY = reduced ? 0 : (0.5 - progress) * 20
      const foregroundY = reduced ? 0 : (0.5 - progress) * 10

      return (
        <div className="scene-depth-stage scene-depth-stage-operations">
          <AmbientDepthField reduced={reduced} variant="operations" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.54} />

          <div className="relative z-[2] grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <SceneCard className="relative h-fit p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Delivery Framework</p>
              <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(1.56rem,2.95vw,2.42rem)] leading-[1.08] text-[var(--color-ink)]">Process pressure translated into composure at showtime.</h2>
              <p className="mt-4 max-w-[56ch] text-sm text-[var(--color-ink-muted)]">Scroll holds tension while each command phase locks before advancing.</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--color-accent-soft)]" role="progressbar" aria-label="Operations spine progression" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(railProgress)}>
                <motion.div className="h-full rounded-full bg-[var(--color-accent)]" animate={{ width: `${railProgress}%` }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS_EASE }} />
              </div>
              <motion.div animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: AUTHORITY_EASE }} className="mt-6">
                <ScribbleButton variant="outline" tone="light" size="sm" to="/process" analyticsLabel="operations-process">Explore Capabilities</ScribbleButton>
              </motion.div>
            </SceneCard>

            <div className="relative grid gap-3 pl-5">
              <div aria-hidden="true" className="absolute inset-y-2 left-1 w-[2px] rounded-full bg-[var(--color-accent-soft)]" />
              <motion.div aria-hidden="true" className="absolute left-[3px] top-2 w-[3px] rounded-full bg-[var(--color-accent)]" animate={{ height: `calc(${railProgress}% - 0.4rem)` }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: AUTHORITY_EASE }} style={{ minHeight: '1rem' }} />

              {OPERATIONS_STEPS.map((step, index) => {
                const isActive = index === activeStep
                const distanceFromActive = Math.abs(index - activeStep)

                return (
                  <motion.article
                    key={step.id}
                    initial={reduced ? false : { opacity: 0, x: 28, scale: 0.97 }}
                    animate={{
                      opacity: reduced ? 1 : isActive ? 1 : 0.54,
                      x: reduced ? 0 : isActive ? 0 : 14 + distanceFromActive * 4,
                      scale: reduced ? 1 : isActive ? 1 : 0.976,
                    }}
                    transition={
                      reduced
                        ? { duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS_EASE }
                        : { type: 'spring', stiffness: 240, damping: 21, mass: 0.78 }
                    }
                    className={`rounded-2xl border p-4 ${isActive ? 'border-[rgba(223,234,255,0.48)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}
                  >
                    <div className="grid gap-3 sm:grid-cols-[96px_1fr] sm:items-start">
                      <img src={step.image} alt={step.title} loading="lazy" decoding="async" className="h-20 w-full rounded-lg border border-[var(--color-border)] object-cover" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Phase {step.id}</p>
                        <h3 className="mt-2 font-serif text-[1.06rem] text-[var(--color-ink)]">{step.title}</h3>
                        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{step.detail}</p>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      )
    }}
  </PinnedSceneFrame>
)

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
    <FreeSceneFrame scene={scene} pinBehavior="calm-release" layout="narrative-bridge" className="scene-cinematic scene-narrative-bridge">
      {({ reduced }) => (
        <div ref={depthRef} className="scene-depth-stage scene-depth-stage-bridge">
          <AmbientDepthField reduced={reduced} variant="bridge" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.36} />
          <motion.div style={reduced ? undefined : { y: cardY, scale: cardScale }} className="relative z-[2]">
            <SceneCard className="relative grid min-h-[clamp(320px,50vh,500px)] place-items-center overflow-hidden text-center p-6 md:p-8">
              <motion.p initial={reduced ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: AUTHORITY_EASE }} className="text-[11px] uppercase tracking-[0.17em] text-[var(--color-ink-subtle)]">Outcome Transition</motion.p>
              <motion.h2 initial={reduced ? false : { opacity: 0, y: 16, letterSpacing: '-0.06em' }} whileInView={{ opacity: 1, y: 0, letterSpacing: '-0.03em' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.1, ease: MASS_EASE, delay: 0.05 }} className="mt-4 max-w-[20ch] font-serif text-[clamp(1.8rem,3.9vw,2.85rem)] leading-[1.08] text-[var(--color-ink)]">Precision is only credible when proof carries the weight.</motion.h2>
              <motion.p initial={reduced ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: AUTHORITY_EASE, delay: 0.12 }} className="mt-5 max-w-[60ch] text-sm leading-relaxed text-[var(--color-ink-muted)]">The next chapter shifts from directional language to verified outcomes, named stakeholders, and delivery context.</motion.p>
            </SceneCard>
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
  )
}

const ProofTheaterSplit = ({ reduced }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartXRef = useRef(null)
  const touchDeltaRef = useRef(0)
  const safeIndex = clampIndex(activeIndex, Math.max(TESTIMONIALS.length - 1, 0))
  const active = TESTIMONIALS[safeIndex]
  const progress = TESTIMONIALS.length ? ((safeIndex + 1) / TESTIMONIALS.length) * 100 : 0
  const hasPrev = safeIndex > 0
  const hasNext = safeIndex < TESTIMONIALS.length - 1

  const goPrev = () => setActiveIndex(index => clampIndex(index - 1, TESTIMONIALS.length - 1))
  const goNext = () => setActiveIndex(index => clampIndex(index + 1, TESTIMONIALS.length - 1))
  const entryDirection = safeIndex % 2 === 0 ? 1 : -1

  const onTouchStart = event => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
    touchDeltaRef.current = 0
  }

  const onTouchMove = event => {
    if (touchStartXRef.current === null) return
    touchDeltaRef.current = (event.touches[0]?.clientX ?? touchStartXRef.current) - touchStartXRef.current
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
        <SceneCard className="bg-[var(--color-surface)] p-5" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onKeyDown={onRailKeyDown} tabIndex={0} role="region" aria-label="Client testimonial carousel; use arrow keys to navigate">
          {active ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, x: entryDirection * 72, rotate: entryDirection * 3.2, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, x: entryDirection * -44, rotate: entryDirection * -2.2, scale: 0.98 }}
                transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.12, ease: MASS_EASE }}
                className="grid gap-4"
              >
                <motion.div variants={revealMask(0.02)} className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                  <motion.img
                    src={active.image}
                    alt={active.name}
                    loading="lazy"
                    decoding="async"
                    className="h-56 w-full object-cover"
                    animate={reduced ? undefined : { scale: [1.03, 1.06, 1.03], y: [0, -5, 0] }}
                    transition={{ duration: MOTION_TOKEN_CONTRACT.durations.epic * 1.8, ease: AUTHORITY_EASE, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-subtle)]">Featured Client Voice</p>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-ink)]">"{active.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">{active.name}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{active.role}, {active.organization}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--color-accent-soft)]" role="progressbar" aria-label="Testimonial progression" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                    <motion.div className="h-full rounded-full bg-[var(--color-accent)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS_EASE }} />
                  </div>
                  <div className="flex gap-2">
                    <ScribbleButton title="Previous client testimonial" ariaLabel="Go to previous testimonial" variant="micro" tone="light" size="sm" showArrow={false} onClick={goPrev} analyticsLabel="proof-prev" disabled={!hasPrev}>Previous</ScribbleButton>
                    <ScribbleButton title="Next client testimonial" ariaLabel="Go to next testimonial" variant="micro" tone="light" size="sm" showArrow={false} onClick={goNext} analyticsLabel="proof-next" disabled={!hasNext}>Next</ScribbleButton>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </SceneCard>

        <SceneCard className="bg-[var(--color-surface-2)] p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Client Index</p>
          <div className="mt-3 grid gap-2">
            {TESTIMONIALS.map((item, index) => (
              <ScribbleButton key={item.id} type="button" onClick={() => setActiveIndex(index)} variant={index === safeIndex ? 'primary' : 'outline'} tone="light" size="sm" showArrow={false} analyticsLabel={`proof-index-${item.id}`} className="proof-index-button">
                <div className="grid items-center gap-2 sm:grid-cols-[64px_1fr]">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="h-12 w-full rounded-md border border-[var(--color-border)] object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{item.name}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">{item.role}</p>
                    <p className="text-xs text-[var(--color-ink-subtle)]">{item.organization}</p>
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
    <FreeSceneFrame scene={scene} pinBehavior="proof-consolidation" layout="proof-theater" className="scene-cinematic scene-proof-theater">
      {({ reduced }) => (
        <div ref={depthRef} className="scene-depth-stage scene-depth-stage-proof">
          <AmbientDepthField reduced={reduced} variant="proof" backgroundY={backgroundY} midY={midY} foregroundY={foregroundY} glowOpacity={0.46} />
          <div className="relative z-[2] grid gap-5">
            <SceneCard className="p-5 md:p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Client Outcomes</p>
              <h2 className="mt-3 max-w-[24ch] font-serif text-[clamp(1.56rem,2.95vw,2.44rem)] leading-[1.08] text-[var(--color-ink)]">Verified outcomes, named stakeholders, accountable delivery.</h2>
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

    if (!name || !company || !email || !budgetBand || !eventType) {
      setStatus('error')
      setFeedbackMessage('Please complete Name, Company, Budget Band, Event Type, and Email before submitting.')
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
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Request Proposal</p>
        <h2 className="mt-3 max-w-[20ch] font-serif text-[clamp(1.7rem,3.1vw,2.6rem)] leading-[1.06] text-[var(--color-ink)]">Close the narrative with a deliberate production brief</h2>
        <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-[var(--color-ink-muted)]">This request enters a direct producer queue. Expect response clarity, risk framing, and executable scope.</p>
        <div className="mt-5 grid gap-3">
          {[
            'Scope-first intake before creative spend.',
            'Execution constraints surfaced at day one.',
            'Decision-ready production path within 48 hours.',
          ].map(item => (
            <p key={item} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-3 text-sm text-[var(--color-ink-muted)]">
              {item}
            </p>
          ))}
        </div>
      </SceneCard>

      <motion.form onSubmit={handleSubmit} variants={sequence(0.02, 0.08)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.25 }} className="cinematic-conversion-form grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5" aria-busy={isSubmitting}>
        <input type="hidden" name="source_scene" value="conversion-chamber" />
        <input type="hidden" name="source_path" value="/" />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

        <FloatingField id="conversion-name" label="Name">
          <input id="conversion-name" name="name" type="text" placeholder=" " autoComplete="name" required className="cinematic-field-input" />
        </FloatingField>

        <FloatingField id="conversion-email" label="Email">
          <input id="conversion-email" name="email" type="email" placeholder=" " autoComplete="email" required className="cinematic-field-input" />
        </FloatingField>

        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="conversion-company" label="Company">
            <input id="conversion-company" name="company" type="text" placeholder=" " autoComplete="organization" required className="cinematic-field-input" />
          </FloatingField>
          <FloatingField id="conversion-phone" label="Phone">
            <input id="conversion-phone" name="phone" type="tel" placeholder=" " autoComplete="tel" className="cinematic-field-input" />
          </FloatingField>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingField id="conversion-budget" label="Budget Band">
            <select id="conversion-budget" name="budget_band" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
              <option value="" disabled>Select budget band</option>
              <option value="under-100k">Under 100K AED</option>
              <option value="100k-250k">100K-250K AED</option>
              <option value="250k-500k">250K-500K AED</option>
              <option value="500k-plus">500K+ AED</option>
            </select>
          </FloatingField>
          <FloatingField id="conversion-event-type" label="Event Type">
            <select id="conversion-event-type" name="event_type" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
              <option value="" disabled>Select event type</option>
              <option value="executive-summit">Executive Summit</option>
              <option value="brand-launch">Brand Launch</option>
              <option value="vip-gala">VIP Gala</option>
              <option value="technical-showcase">Technical Showcase</option>
            </select>
          </FloatingField>
        </div>

        <FloatingField id="conversion-event-date" label="Target Date Window">
          <input id="conversion-event-date" name="target_window" type="text" placeholder=" " className="cinematic-field-input" />
        </FloatingField>

        <FloatingField id="conversion-scope" label="Project Scope">
          <textarea id="conversion-scope" name="scope" placeholder=" " rows={4} required className="cinematic-field-input resize-none" />
        </FloatingField>

        <AnimatePresence mode="wait">
          {feedbackMessage ? (
            <motion.div key={feedbackMessage} initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: MASS_EASE }} className={`cinematic-feedback-panel rounded-xl border px-4 py-3 ${isSuccess ? 'is-success border-[rgba(122,218,165,0.45)] bg-[rgba(53,95,76,0.28)] text-[var(--color-ink)]' : 'border-[rgba(236,123,123,0.44)] bg-[rgba(90,37,37,0.24)] text-[var(--color-ink)]'}`} role={isSuccess ? 'status' : 'alert'} aria-live={isSuccess ? 'polite' : 'assertive'} aria-atomic="true">
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

        <ScribbleButton title="Submit private production intake form" type="submit" variant="primary" tone="light" size="md" analyticsLabel="conversion-brief-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
        </ScribbleButton>

        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
          {isError ? 'Submission issue. Please retry or call direct.' : isSuccess ? 'Command queue confirmed.' : 'Private brief channel secured.'}
        </p>
      </motion.form>
    </div>
  )
}

// Conversion close: API-aware intake flow with stub fallback when no endpoint is configured.
export const ConversionChamberScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} pinBehavior="closing-ritual" layout="conversion-chamber" className="scene-cinematic scene-conversion-chamber">
    {({ reduced }) => <ConversionChamberContent reduced={reduced} />}
  </FreeSceneFrame>
)

// Global Footer: premium utility and contact closure.
export const GlobalFooterScene = ({ scene }) => {
  const currentYear = new Date().getFullYear()

  return (
    <FreeSceneFrame scene={scene} pinBehavior="terminal-close" layout="global-footer" className="scene-cinematic scene-global-footer">
      {({ reduced }) => (
        <motion.div variants={sequence(0.05, 0.08)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-4">
          <SceneCard className="p-5 md:p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Next Move</p>
            <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(1.6rem,2.95vw,2.45rem)] leading-[1.08] text-[var(--color-ink)]">Precision-led production for moments where public failure is not an option.</h2>
            <p className="mt-4 max-w-[62ch] text-sm text-[var(--color-ink-muted)]">Regional reach across UAE, one accountable command structure, and execution discipline from scope to show close.</p>
          </SceneCard>

          {HAS_CLIENT_LOGOS ? (
            <SceneCard className="p-5 md:p-6">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Client Logos</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {CLIENT_PROOF_MARKS.map((mark, index) => (
                  <motion.article
                    key={mark.id}
                    initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: MOTION_TOKEN_CONTRACT.durations.scene,
                      ease: MASS_EASE,
                      delay: reduced ? 0 : index * 0.05,
                    }}
                    whileHover={reduced ? undefined : { scale: 1.012 }}
                    className="client-logo-panel rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4"
                  >
                    <img src={mark.logo} alt={`${mark.name} logo`} loading="lazy" decoding="async" className="h-8 w-auto object-contain" />
                  </motion.article>
                ))}
              </div>
            </SceneCard>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            <motion.div variants={revealLift(0.02, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Company</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {FOOTER_COMPANY_LINKS.map(item => (
                    <li key={item.to}>
                      <Link className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.06, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Services</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {services.slice(0, 4).map(service => (
                    <li key={service.slug}>
                      <Link className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" to={`/services/${service.slug}`}>{service.title}</Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.1, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Case Work</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  {caseStudies.map(study => (
                    <li key={study.slug}>
                      <Link className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" to={`/work/${study.slug}`}>{study.title}</Link>
                    </li>
                  ))}
                </ul>
              </SceneCard>
            </motion.div>

            <motion.div variants={revealLift(0.14, 10)}>
              <SceneCard>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Direct Contact</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
                  <a className="footer-micro-link block transition-colors hover:text-[var(--color-ink)]" href="tel:+97142345678">+971 4 234 5678</a>
                  <a className="footer-micro-link block transition-colors hover:text-[var(--color-ink)]" href="mailto:hello@ghaimuae.com">hello@ghaimuae.com</a>
                  <p>Dubai Design District, UAE</p>
                </div>
              </SceneCard>
            </motion.div>
          </div>

          <SceneCard className="footer-utility-row p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
              <p className="text-xs text-[var(--color-ink-subtle)]">{currentYear} Ghaim UAE. All rights reserved.</p>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.11em] text-[var(--color-ink-subtle)]">
                <Link className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" to="/privacy">Privacy</Link>
                <Link className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" to="/terms">Terms</Link>
                <a className="footer-micro-link transition-colors hover:text-[var(--color-ink)]" href="mailto:hello@ghaimuae.com">Support</a>
              </div>
              <ScribbleButton title="Open final proposal request flow" variant="micro" tone="light" size="sm" to="/contact" analyticsLabel="footer-utility-submit" showArrow={false}>
                Submit Request
              </ScribbleButton>
            </div>
          </SceneCard>

          <div className="pb-2">
            <ScribbleButton title="Open contact and schedule executive consult" variant="primary" tone="light" size="md" analyticsLabel="footer-command-consult" to="/contact">Request Proposal</ScribbleButton>
          </div>
        </motion.div>
      )}
    </FreeSceneFrame>
  )
}
