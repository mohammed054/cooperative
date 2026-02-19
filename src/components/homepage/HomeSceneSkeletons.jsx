import React, { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import ScribbleButton from '../ScribbleButton'
import { SceneShell, SceneWrapper, ScrollLockedSection } from '../flagship'
import { MOTION_TOKEN_CONTRACT, parseBezier } from '../../motion/motionTokenContract.js'
import { caseStudies, services, testimonials as testimonialData } from '../../data/siteData'
import { assetUrl } from '../../lib/assetUrl'

const EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.authority)
const MASS = parseBezier(MOTION_TOKEN_CONTRACT.easing.mass)
const FREE = 'free'
const PINNED = 'pinned'

const AUTHORITY_MODULES = [
  {
    title: 'Creative Direction',
    detail:
      'Studio-level narrative control built for high-stakes brand moments.',
    image: assetUrl('images/event-planning-in-action.png'),
  },
  {
    title: 'Technical Command',
    detail:
      'Show systems architecture with disciplined execution and redundancy.',
    image: assetUrl('images/av-setup.png'),
  },
  {
    title: 'Executive Delivery',
    detail:
      'Enterprise-ready operations cadence for leadership and stakeholder events.',
    image: assetUrl('images/always-on-time.png'),
  },
]

const PROJECTS = caseStudies.slice(0, 3).map((project, index) => ({
  id: `project-${String(index + 1).padStart(2, '0')}`,
  title: project.title,
  subtitle: project.summary,
  image: project.image,
  location: project.location,
}))

const CAPABILITIES = [
  {
    title: 'Stagecraft & Scenic',
    copy: 'Scenic systems and stage architecture tailored for executive sightlines and camera readiness.',
    image: assetUrl('images/full-production.png'),
  },
  {
    title: 'AV Systems',
    copy: 'Integrated signal flow and operator control for critical live content delivery.',
    image: assetUrl('images/av-setup.png'),
  },
  {
    title: 'Lighting Narrative',
    copy: 'Lighting composition that supports pacing, focus, and presentation hierarchy.',
    image: assetUrl('images/lighting-effects.png'),
  },
]

const STEPS = [
  {
    id: '01',
    title: 'Strategic intake',
    detail:
      'Objectives, constraints, and leadership requirements are aligned into an executable scope.',
    image: assetUrl('images/process-bg.jpg'),
  },
  {
    id: '02',
    title: 'System alignment',
    detail:
      'Creative, technical, and logistics teams move under one command cadence.',
    image: assetUrl('images/event-planning.png'),
  },
  {
    id: '03',
    title: 'Rehearsal discipline',
    detail:
      'Show flow and cueing are validated before live audience exposure.',
    image: assetUrl('images/event-planning-in-action.png'),
  },
  {
    id: '04',
    title: 'Live execution',
    detail:
      'Senior-led floor command protects timing, transitions, and delivery quality.',
    image: assetUrl('images/full-production.png'),
  },
]

const TESTIMONIAL_TARGET_COUNT = 9

const TESTIMONIALS = Array.from({ length: TESTIMONIAL_TARGET_COUNT }, (_, index) => {
  const source = testimonialData[index]
  const fallbackStudy = caseStudies[index % caseStudies.length]

  if (source) {
    return {
      id: source.id || `testimonial-${String(index + 1).padStart(2, '0')}`,
      name: source.name,
      role: source.role,
      organization: source.company,
      quote: source.quote,
      eventContext: source.project,
      outcome: `Delivered in ${source.location}`,
      image: caseStudies[index]?.image || assetUrl(`images/event${index + 1}.jpg`),
      verification: 'verified',
    }
  }

  return {
    id: `testimonial-pending-${String(index + 1).padStart(2, '0')}`,
    name: 'Client profile pending release',
    role: 'Executive Stakeholder',
    organization: fallbackStudy.title,
    quote: 'Verified testimonial copy pending client publication approval.',
    eventContext: fallbackStudy.summary,
    outcome: 'Reserved slot for an approved client statement.',
    image: fallbackStudy.image,
    verification: 'pending',
  }
})

const LOGOS = [
  'MERIDIAN',
  'NOVA',
  'ALTIUS',
  'LUMERA',
  'SILQ',
  'ORBITAL',
  'KINETIC',
  'ASTRA',
]

const FOOTER_COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
]

const buildHeight = vh => `${vh}vh`
const clampIndex = (value, max) => Math.max(0, Math.min(max, value))

const fadeUp = (delay = 0, distance = MOTION_TOKEN_CONTRACT.distances.copy) => ({
  hidden: {
    opacity: 0,
    y: distance,
    filter: `blur(${MOTION_TOKEN_CONTRACT.blur.entry}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: MOTION_TOKEN_CONTRACT.durations.scene,
      ease: EASE,
      delay,
    },
  },
})

const stagger = (
  delayChildren = 0.04,
  staggerChildren = MOTION_TOKEN_CONTRACT.stagger.card
) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})

const SceneCard = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 shadow-[0_14px_26px_rgba(28,28,28,0.06)] ${className}`}
  >
    {children}
  </div>
)

const FreeSceneFrame = ({ scene, pinBehavior = 'none', layout, className = '', children }) => {
  const reduced = useReducedMotion()
  const content = typeof children === 'function' ? children({ reduced }) : children

  return (
    <SceneWrapper
      id={scene.id}
      tone={scene.tone}
      minHeight={buildHeight(scene.length)}
      className={className}
    >
      <SceneShell scene={scene} scrollMode={FREE} pinBehavior={pinBehavior} layout={layout}>
        {content}
      </SceneShell>
    </SceneWrapper>
  )
}

const PinnedSceneFrame = ({ scene, layout, className = '', children }) => (
  <>
    <div
      aria-hidden="true"
      className="scene-friction-buffer"
      style={{ '--scene-buffer-height': '10vh' }}
      data-buffer-for={scene.id}
      data-buffer-position="pre"
    />
    <ScrollLockedSection
      id={scene.id}
      tone={scene.tone}
      height={buildHeight(scene.length)}
      className={className}
    >
      {(progress, reduced) => (
        <SceneShell
          scene={scene}
          scrollMode={PINNED}
          pinBehavior="scroll-lock-placeholder"
          layout={layout}
        >
          {typeof children === 'function' ? children({ progress, reduced }) : children}
        </SceneShell>
      )}
    </ScrollLockedSection>
    <div
      aria-hidden="true"
      className="scene-friction-buffer"
      style={{ '--scene-buffer-height': '10vh' }}
      data-buffer-for={scene.id}
      data-buffer-position="post"
    />
  </>
)

const ProjectPanelCard = ({
  project,
  mediaRef,
  isActive,
  reduced,
  interactive = false,
  onSelect,
}) => (
  <motion.article
    layout
    whileHover={interactive && !reduced ? { y: -4 } : undefined}
    onClick={interactive ? onSelect : undefined}
    animate={{
      opacity: reduced ? 1 : isActive ? 1 : 0.58,
      scale: reduced ? 1 : isActive ? 1 : 0.96,
      y: reduced ? 0 : isActive ? 0 : 8,
    }}
    transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS }}
    className={`min-w-[250px] snap-start rounded-2xl border p-3 shadow-[0_12px_24px_rgba(28,28,28,0.06)] ${
      isActive
        ? 'border-[rgba(28,28,28,0.28)] bg-[var(--color-surface-2)]'
        : 'border-[var(--color-border)] bg-[var(--color-surface-2)]'
    } ${interactive ? 'cursor-pointer' : ''}`}
  >
    <div className="relative h-36 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
      <div className="absolute left-2 top-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
        {mediaRef}
      </div>
    </div>
    <p className="mt-3 text-[10px] uppercase tracking-[0.13em] text-[var(--color-ink-subtle)]">{project.id}</p>
    <h3 className="mt-1 font-serif text-lg text-[var(--color-ink)]">{project.title}</h3>
    <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{project.subtitle}</p>
    <p className="mt-1 text-xs text-[var(--color-ink-subtle)]">{project.location}</p>
    <div className="mt-3">
      <ScribbleButton
        variant="micro"
        tone="dark"
        size="sm"
        showArrow={false}
        analyticsLabel={`phase9-reel-brief-${project.id}`}
        onClick={event => event.stopPropagation()}
      >
        Start a Similar Brief
      </ScribbleButton>
    </div>
  </motion.article>
)

const SignatureReelContent = ({ scene, progress, reduced }) => {
  const mobileTrackRef = useRef(null)
  const mediaRefs = Array.isArray(scene.mediaPlaceholder.ref)
    ? scene.mediaPlaceholder.ref
    : [scene.mediaPlaceholder.ref]
  const activeFromScroll = clampIndex(
    Math.floor(progress * PROJECTS.length),
    PROJECTS.length - 1
  )
  const [manualIndex, setManualIndex] = useState(null)
  const selectedIndex =
    typeof manualIndex === 'number' ? manualIndex : activeFromScroll
  const x = reduced ? 0 : -progress * (PROJECTS.length - 2) * 210
  const bgParallaxX = reduced ? 0 : -progress * 64
  const fgParallaxX = reduced ? 0 : progress * 46

  const scrollToCard = index => {
    setManualIndex(clampIndex(index, PROJECTS.length - 1))
    if (!mobileTrackRef.current) return
    const target = mobileTrackRef.current.querySelector(`[data-project-index="${index}"]`)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
  }

  return (
    <div className="grid gap-4">
      <SceneCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Signature Reel</p>
            <h2 className="mt-2 font-serif text-[clamp(1.4rem,2.8vw,2.2rem)] text-[var(--color-ink)]">Pinned horizontal signature conveyor</h2>
          </div>
          <div className="flex items-center gap-2">
            <ScribbleButton
              variant="micro"
              tone="dark"
              size="sm"
              showArrow={false}
              analyticsLabel="phase7-reel-prev"
              onClick={() => scrollToCard(selectedIndex - 1)}
            >
              Prev
            </ScribbleButton>
            <ScribbleButton
              variant="micro"
              tone="dark"
              size="sm"
              showArrow={false}
              analyticsLabel="phase7-reel-next"
              onClick={() => scrollToCard(selectedIndex + 1)}
            >
              Next
            </ScribbleButton>
          </div>
        </div>
      </SceneCard>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-3)] p-3">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[32%] rounded-r-[30%] bg-[radial-gradient(circle_at_center,rgba(28,28,28,0.08)_0%,rgba(28,28,28,0)_72%)]"
          style={{ x: bgParallaxX }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[26%] rounded-l-[28%] bg-[radial-gradient(circle_at_center,rgba(28,28,28,0.1)_0%,rgba(28,28,28,0)_74%)]"
          style={{ x: fgParallaxX }}
        />
        <motion.div
          variants={stagger(0.02, 0.12)}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="relative z-10 hidden gap-3 md:flex"
          style={{ x }}
        >
          {PROJECTS.map((project, index) => (
            <motion.div key={project.id} variants={fadeUp(index * 0.03, 22)}>
              <ProjectPanelCard
                project={project}
                mediaRef={mediaRefs[index] || `project-reel-${String(index + 1).padStart(2, '0')}`}
                reduced={reduced}
                isActive={index === selectedIndex}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          ref={mobileTrackRef}
          variants={stagger(0.02, 0.12)}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          className="relative z-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:hidden"
          style={{ touchAction: 'pan-x' }}
        >
          {PROJECTS.map((project, index) => (
            <motion.div
              key={`mobile-${project.id}`}
              data-project-index={index}
              variants={fadeUp(index * 0.03, 22)}
            >
              <ProjectPanelCard
                project={project}
                mediaRef={mediaRefs[index] || `project-reel-${String(index + 1).padStart(2, '0')}`}
                reduced={reduced}
                isActive={index === selectedIndex}
                interactive
                onSelect={() => scrollToCard(index)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.div initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }} animate={reduced || progress > 0.45 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(8px)' }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }} className="flex flex-wrap items-center justify-end gap-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
          Active panel: {String(selectedIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </p>
      </motion.div>
    </div>
  )
}

// Scroll behavior: free with hero lock and micro-pause after lock.
// Tone layer: deep (mapped to light surface system).
// Pin status: free.
export const CommandArrivalScene = ({ scene }) => (
  <>
    <FreeSceneFrame
      scene={scene}
      layout="hero-split"
      pinBehavior="micro-pause-after-lock"
      className="scene-skeleton scene-skeleton-command-arrival"
    >
      {({ reduced }) => (
        <div className="grid min-h-[clamp(460px,68vh,760px)] gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={stagger()}
            initial={reduced ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SceneCard className="relative h-full overflow-hidden p-6">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 right-4 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(28,28,28,0.2)_0%,rgba(28,28,28,0)_72%)]"
                animate={reduced ? undefined : { x: [0, 14, 0], y: [0, 10, 0] }}
                transition={{
                  duration: MOTION_TOKEN_CONTRACT.durations.epic,
                  ease: MASS,
                  repeat: Infinity,
                  repeatType: 'mirror',
                }}
              />
              <motion.p variants={fadeUp(0)} className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-subtle)]">Command Arrival</motion.p>
              <motion.h1
                variants={stagger(0.02, MOTION_TOKEN_CONTRACT.stagger.line)}
                initial={reduced ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="mt-4 max-w-[16ch] font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.02] text-[var(--color-ink)]"
              >
                {['We Engineer', 'Moments'].map((line, index) => (
                  <motion.span
                    key={line}
                    variants={fadeUp(index * MOTION_TOKEN_CONTRACT.stagger.line, MOTION_TOKEN_CONTRACT.distances.panel * 0.4)}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p variants={fadeUp(0.1)} className="mt-4 max-w-[50ch] text-sm leading-relaxed text-[var(--color-ink-muted)]">Immediate authority and immersive production for high-stakes events</motion.p>
              <motion.div variants={fadeUp(0.14)} className="mt-7">
                <ScribbleButton variant="primary" tone="dark" size="md" analyticsLabel="phase9-hero-see-signature-builds">See Signature Builds</ScribbleButton>
              </motion.div>
            </SceneCard>
          </motion.div>
          <motion.div initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }}>
            <SceneCard className="h-full">
              <div className="relative min-h-[300px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-3)]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={Array.isArray(scene.mediaPlaceholder.ref) ? scene.mediaPlaceholder.ref[0] : scene.mediaPlaceholder.ref}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/90">Hero video</div>
              </div>
            </SceneCard>
          </motion.div>
        </div>
      )}
    </FreeSceneFrame>
    <div
      aria-hidden="true"
      className="scene-friction-buffer"
      style={{ '--scene-buffer-height': '8vh' }}
      data-buffer-for={scene.id}
      data-buffer-position="post"
    />
  </>
)

// Scroll behavior: free metric scan with stagger.
// Tone layer: dark (mapped to light surface system).
// Pin status: free.
export const AuthorityLedgerScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} layout="ledger-bands" pinBehavior="none" className="scene-skeleton scene-skeleton-authority-ledger">
    {({ reduced }) => (
      <motion.div variants={stagger(0.02, 0.12)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-4">
        <motion.div variants={fadeUp(0)}>
          <SceneCard className="bg-[var(--color-surface-2)]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Authority Ledger</p>
            <h2 className="mt-3 max-w-[22ch] font-serif text-[clamp(1.4rem,2.8vw,2.2rem)] text-[var(--color-ink)]">
              Studio-level narrative. Enterprise-level reliability.
            </h2>
          </SceneCard>
        </motion.div>
        <div className="grid gap-3 md:grid-cols-3">
          {AUTHORITY_MODULES.map((module, index) => (
            <motion.div key={module.title} variants={fadeUp(index * 0.12)}>
              <SceneCard>
                <img
                  src={module.image}
                  alt={module.title}
                  loading="lazy"
                  decoding="async"
                  className="h-24 w-full rounded-xl border border-[var(--color-border)] object-cover"
                />
                <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">{module.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{module.detail}</p>
              </SceneCard>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp(0.16)}>
          <ScribbleButton variant="secondary" tone="dark" size="sm" analyticsLabel="phase9-authority-discuss-scope">
            Discuss Your Scope
          </ScribbleButton>
        </motion.div>
      </motion.div>
    )}
  </FreeSceneFrame>
)

// Scroll behavior: pinned project reel; card fade/scale follows scroll progress.
// Tone layer: dark (mapped to light surface system).
// Pin status: pinned.
export const SignatureReelScene = ({ scene }) => (
  <PinnedSceneFrame scene={scene} layout="horizontal-reel" className="scene-skeleton scene-skeleton-signature-reel !bg-none bg-[var(--color-surface-3)]">
    {({ progress, reduced }) => (
      <SignatureReelContent scene={scene} progress={progress} reduced={reduced} />
    )}
  </PinnedSceneFrame>
)

// Scroll behavior: free asymmetric capability modules.
// Tone layer: steel (mapped to light surface system).
// Pin status: free.
export const CapabilityMatrixScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} layout="matrix-asymmetric" pinBehavior="none" className="scene-skeleton scene-skeleton-capability-matrix">
    {({ reduced }) => (
      <motion.div variants={stagger(0.02)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-3">
        <motion.div variants={fadeUp(0)}>
          <SceneCard>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Capability Matrix</p>
            <h2 className="mt-2 font-serif text-[clamp(1.4rem,2.8vw,2.2rem)] text-[var(--color-ink)]">Technical and creative capability modules</h2>
          </SceneCard>
        </motion.div>
        <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
          <motion.div variants={fadeUp(0)}><SceneCard className="h-full"><img src={CAPABILITIES[0].image} alt={CAPABILITIES[0].title} loading="lazy" decoding="async" className="h-28 w-full rounded-xl border border-[var(--color-border)] object-cover" /><p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Capability Module 01</p><h3 className="mt-2 font-serif text-[1.18rem] text-[var(--color-ink)]">{CAPABILITIES[0].title}</h3><p className="mt-2 text-sm text-[var(--color-ink-muted)]">{CAPABILITIES[0].copy}</p></SceneCard></motion.div>
          <div className="grid gap-3">
            {CAPABILITIES.slice(1).map((capability, index) => (
              <motion.div key={capability.title} variants={fadeUp((index + 1) * MOTION_TOKEN_CONTRACT.stagger.card)}>
                <SceneCard><img src={capability.image} alt={capability.title} loading="lazy" decoding="async" className="h-20 w-full rounded-xl border border-[var(--color-border)] object-cover" /><p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Capability Module {String(index + 2).padStart(2, '0')}</p><h3 className="mt-2 font-serif text-[1.08rem] text-[var(--color-ink)]">{capability.title}</h3><p className="mt-2 text-sm text-[var(--color-ink-muted)]">{capability.copy}</p></SceneCard>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div variants={fadeUp(0.14)}>
          <ScribbleButton variant="secondary" tone="dark" size="sm" analyticsLabel="phase9-capability-explore">
            Explore Capabilities
          </ScribbleButton>
        </motion.div>
      </motion.div>
    )}
  </FreeSceneFrame>
)

// Scroll behavior: pinned timeline with slide/fade and CTA after step 3.
// Tone layer: steel (mapped to light surface system).
// Pin status: pinned.
export const OperationsSpineScene = ({ scene }) => (
  <PinnedSceneFrame scene={scene} layout="timeline-spine" className="scene-skeleton scene-skeleton-operations-spine">
    {({ progress, reduced }) => {
      const active = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
      const showCta = reduced || active >= 2
      return (
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SceneCard className="h-fit">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Operations Spine</p>
            <h2 className="mt-2 font-serif text-[clamp(1.4rem,2.8vw,2.2rem)] text-[var(--color-ink)]">Pinned 4-step process placeholder</h2>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)]">Steps animate with slide-in and fade based on scroll progress.</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-accent-soft)]">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent)]"
                animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS }}
              />
            </div>
            <motion.div animate={showCta ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(8px)' }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }} className="mt-6">
              <ScribbleButton variant="outline" tone="dark" size="sm" analyticsLabel="phase9-operations-review-step-details">Review Step Details</ScribbleButton>
            </motion.div>
          </SceneCard>
          <div className="grid gap-2">
            {STEPS.map((step, index) => (
              <motion.article key={step} animate={{ opacity: reduced ? 1 : index === active ? 1 : 0.44, x: reduced ? 0 : index === active ? 0 : 26 }} transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: EASE }} className={`rounded-2xl border p-4 ${index === active ? 'border-[rgba(28,28,28,0.28)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)] bg-[var(--color-surface)]'}`}>
                <img src={step.image} alt={step.title} loading="lazy" decoding="async" className="h-14 w-20 rounded-lg border border-[var(--color-border)] object-cover" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Step {step.id}</p>
                  <h3 className="mt-2 font-serif text-[1.05rem] text-[var(--color-ink)]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{step.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )
    }}
  </PinnedSceneFrame>
)

// Scroll behavior: free narrative bridge with word stagger.
// Tone layer: warm.
// Pin status: free.
export const NarrativeBridgeScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} layout="bridge-centerline" pinBehavior="release-bridge" className="scene-skeleton scene-skeleton-narrative-bridge">
    {({ reduced }) => (
      <SceneCard className="grid min-h-[clamp(280px,44vh,460px)] place-items-center text-center">
        <motion.h2 variants={fadeUp(0.02, 14)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.4 }} className="max-w-[18ch] font-serif text-[clamp(1.6rem,3.7vw,2.6rem)] text-[var(--color-ink)]">
          Calm, composed narrative to release tension before proof theater
        </motion.h2>
        <motion.p variants={fadeUp(0.12)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.4 }} className="mt-4 max-w-[52ch] text-sm text-[var(--color-ink-muted)]">Bridge-centerline release copy placeholder.</motion.p>
      </SceneCard>
    )}
  </FreeSceneFrame>
)

// Scroll behavior: free proof theater with available testimonial assets.
// Tone layer: linen.
// Pin status: free.
export const ProofTheaterScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} layout="proof-stage" pinBehavior="none" className="scene-skeleton scene-skeleton-proof-theater !bg-none bg-[var(--color-surface-3)]">
    {({ reduced }) => (
      <div className="grid gap-4">
        <SceneCard>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Proof Theater</p>
          <h2 className="mt-2 font-serif text-[clamp(1.4rem,2.8vw,2.2rem)] text-[var(--color-ink)]">Split testimonial rail and featured proof panel</h2>
        </SceneCard>
        <ProofTheaterSplit reduced={reduced} mediaRefs={scene.mediaPlaceholder.ref} />
      </div>
    )}
  </FreeSceneFrame>
)

const ProofTheaterSplit = ({ reduced, mediaRefs }) => {
  const refs = Array.isArray(mediaRefs) ? mediaRefs : [mediaRefs]
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = TESTIMONIALS[activeIndex]
  const progress = ((activeIndex + 1) / TESTIMONIALS.length) * 100

  const goPrev = () => {
    setActiveIndex(prev => clampIndex(prev - 1, TESTIMONIALS.length - 1))
  }

  const goNext = () => {
    setActiveIndex(prev => clampIndex(prev + 1, TESTIMONIALS.length - 1))
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[0.56fr_0.44fr]">
        <SceneCard className="bg-[var(--color-surface-3)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={reduced ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? undefined : { opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }}
              className="grid gap-4"
            >
              <div className="grid gap-3 sm:grid-cols-[0.66fr_0.34fr]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Selected Testimonial</p>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-ink)]">
                    "{activeTestimonial.quote}"
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.1em] text-[var(--color-ink-subtle)]">Event Context</p>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{activeTestimonial.eventContext}</p>
                </div>
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: MASS }}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
                >
                  <img
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto h-24 w-24 rounded-full border border-[var(--color-border)] object-cover"
                  />
                  <p className="mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    {refs[activeIndex] || activeTestimonial.id}
                  </p>
                </motion.div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{activeTestimonial.name}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {activeTestimonial.role}, {activeTestimonial.organization}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-accent-soft)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: MOTION_TOKEN_CONTRACT.durations.ui, ease: MASS }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <ScribbleButton variant="micro" tone="dark" size="sm" showArrow={false} analyticsLabel="phase9-proof-prev" onClick={goPrev}>
                    Prev
                  </ScribbleButton>
                  <ScribbleButton variant="micro" tone="dark" size="sm" showArrow={false} analyticsLabel="phase9-proof-next" onClick={goNext}>
                    Next
                  </ScribbleButton>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }}
            className="mt-4"
          >
            <ScribbleButton variant="primary" tone="dark" size="md" analyticsLabel="phase9-proof-request-proposal">
              Request a Proposal
            </ScribbleButton>
          </motion.div>
        </SceneCard>
        <motion.aside
          variants={stagger(0.02, MOTION_TOKEN_CONTRACT.stagger.card)}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
        >
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Testimonial Selection</p>
          <div className="mt-3 grid gap-2">
            {TESTIMONIALS.map((item, index) => (
              <motion.div
                role="button"
                tabIndex={0}
                key={item.id}
                variants={fadeUp(index * MOTION_TOKEN_CONTRACT.stagger.card, 12)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveIndex(index)
                  }
                }}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  index === activeIndex
                    ? 'border-[rgba(28,28,28,0.28)] bg-[var(--color-surface-3)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-3)]'
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">{item.id}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{item.name}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.role}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.organization}</p>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      </div>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-2">
        <motion.div
          className="flex gap-3 px-2"
          animate={
            reduced
              ? undefined
              : { x: ['0%', '-50%'] }
          }
          transition={
            reduced
              ? undefined
              : {
                  duration: MOTION_TOKEN_CONTRACT.durations.epic * 8,
                  ease: 'linear',
                  repeat: Infinity,
                }
          }
        >
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <span key={`${logo}-${index}`} className="whitespace-nowrap rounded-full border border-[var(--color-border)] bg-[var(--color-surface-3)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const ConversionChamberContent = ({ scene, reduced }) => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = event => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div
        variants={stagger(0.04, MOTION_TOKEN_CONTRACT.stagger.line)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <SceneCard className="h-full bg-[var(--color-surface-3)] p-6">
          <motion.p variants={fadeUp(0)} className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-subtle)]">Conversion Chamber</motion.p>
          <motion.h2 variants={fadeUp(0.04, MOTION_TOKEN_CONTRACT.distances.panel)} className="mt-3 max-w-[18ch] font-serif text-[clamp(1.5rem,3vw,2.4rem)] text-[var(--color-ink)]">Request a Private Consultation</motion.h2>
          <motion.p variants={fadeUp(0.1)} className="mt-3 text-sm text-[var(--color-ink-muted)]">Narrative lines animate with controlled stagger before form reveal.</motion.p>
          <motion.p variants={fadeUp(0.14)} className="mt-2 text-sm text-[var(--color-ink-muted)]">Placeholder media and fields are wired for swap-in with production assets.</motion.p>
          <motion.div variants={fadeUp(0.18)} className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">Media placeholder</p>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {Array.isArray(scene.mediaPlaceholder.ref)
                ? scene.mediaPlaceholder.ref[0]
                : scene.mediaPlaceholder.ref}
            </p>
            <div className="mt-3 h-20 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </motion.div>
        </SceneCard>
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        variants={stagger(0.03, MOTION_TOKEN_CONTRACT.stagger.line)}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
      >
        <motion.label variants={fadeUp(0.03)} className="grid gap-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Name</span>
          <input type="text" placeholder="Placeholder name" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)]" />
        </motion.label>
        <motion.label variants={fadeUp(0.07)} className="grid gap-1">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Company</span>
          <input type="text" placeholder="Placeholder company" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)]" />
        </motion.label>
        <div className="grid gap-3 sm:grid-cols-2">
          <motion.label variants={fadeUp(0.1)} className="grid gap-1">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Budget</span>
            <select className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)]">
              <option>Placeholder budget</option>
            </select>
          </motion.label>
          <motion.label variants={fadeUp(0.12)} className="grid gap-1">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Event Type</span>
            <select className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)]">
              <option>Placeholder type</option>
            </select>
          </motion.label>
        </div>
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="conversion-confirmed"
              initial={reduced ? false : { opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? undefined : { opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }}
              className="rounded-xl border border-[rgba(16,185,129,0.38)] bg-[rgba(16,185,129,0.12)] px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-700">Request queued</p>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Confirmation placeholder animation completed.</p>
            </motion.div>
          ) : (
            <motion.div
              key="conversion-submit"
              initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reduced ? undefined : { opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: MOTION_TOKEN_CONTRACT.durations.scene, ease: EASE }}
            >
              <ScribbleButton
                type="submit"
                variant="primary"
                tone="dark"
                size="md"
                analyticsLabel="phase8-conversion-submit-request"
              >
                Submit Request
              </ScribbleButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}

// Scroll behavior: free conversion split with form placeholders.
// Tone layer: deep (mapped to light surface system).
// Pin status: free.
export const ConversionChamberScene = ({ scene }) => (
  <FreeSceneFrame
    scene={scene}
    layout="conversion-split"
    pinBehavior="none"
    className="scene-skeleton scene-skeleton-conversion-chamber !bg-none bg-[var(--color-surface)]"
  >
    {({ reduced }) => (
      <ConversionChamberContent scene={scene} reduced={reduced} />
    )}
  </FreeSceneFrame>
)

// Scroll behavior: free footer continuation with utility CTA.
// Tone layer: deep (mapped to light surface system).
// Pin status: free.
export const GlobalFooterScene = ({ scene }) => (
  <FreeSceneFrame scene={scene} layout="footer-columns" pinBehavior="none" className="scene-skeleton scene-skeleton-global-footer">
    {({ reduced }) => (
      <motion.div variants={stagger(0.03, MOTION_TOKEN_CONTRACT.stagger.card)} initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-3 md:grid-cols-4">
        <motion.div variants={fadeUp(0)}>
          <SceneCard>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
              {FOOTER_COMPANY_LINKS.map(item => (
                <li key={item.to}>
                  <Link className="transition-colors hover:text-[var(--color-ink)]" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SceneCard>
        </motion.div>
        <motion.div variants={fadeUp(MOTION_TOKEN_CONTRACT.stagger.card)}>
          <SceneCard>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Services</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
              {services.slice(0, 4).map(service => (
                <li key={service.slug}>
                  <Link className="transition-colors hover:text-[var(--color-ink)]" to={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </SceneCard>
        </motion.div>
        <motion.div variants={fadeUp(MOTION_TOKEN_CONTRACT.stagger.card * 2)}>
          <SceneCard>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Work</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
              {caseStudies.map(study => (
                <li key={study.slug}>
                  <Link className="transition-colors hover:text-[var(--color-ink)]" to={`/work/${study.slug}`}>
                    {study.title}
                  </Link>
                </li>
              ))}
            </ul>
          </SceneCard>
        </motion.div>
        <motion.div variants={fadeUp(MOTION_TOKEN_CONTRACT.stagger.card * 3)}>
          <SceneCard>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">Contact</p>
            <div className="mt-3 space-y-2 text-sm text-[var(--color-ink-muted)]">
              <a className="block transition-colors hover:text-[var(--color-ink)]" href="tel:+97142345678">
                +971 4 234 5678
              </a>
              <a className="block transition-colors hover:text-[var(--color-ink)]" href="mailto:hello@ghaimuae.com">
                hello@ghaimuae.com
              </a>
              <p>Dubai Design District</p>
            </div>
          </SceneCard>
        </motion.div>
        <motion.div variants={fadeUp(0.14)} className="md:col-span-4">
          <ScribbleButton variant="micro" tone="dark" size="sm" showArrow={false} analyticsLabel="phase9-footer-utility" to="/contact">
            Utility Access
          </ScribbleButton>
        </motion.div>
      </motion.div>
    )}
  </FreeSceneFrame>
)
