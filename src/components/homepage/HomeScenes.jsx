/**
 * HomeScenes.jsx — GHAIM UAE CINEMATIC SCROLL ARCHITECTURE
 *
 * MOTION CONTRACT (ENFORCED):
 *   ✅ GSAP + ScrollTrigger = ONLY scroll controllers
 *   ✅ Framer Motion = hover states, AnimatePresence, non-scroll micro-UI only
 *   ❌ No Framer useScroll / useTransform / whileInView
 *   ❌ No IntersectionObserver  ❌ No Lenis
 *   ✅ body is scroll root — no overflow:hidden above sections
 *   ✅ Pinned scenes: CSS sticky inner + one master GSAP scrub timeline
 *   ✅ Free scenes: gsap.fromTo() + ScrollTrigger toggleActions
 *   ✅ Debounced ScrollTrigger.refresh() on resize
 *   ✅ prefers-reduced-motion respected
 *   ✅ Initial hidden state via gsap.set() — NOT inline opacity:0 in JSX
 *      (inline opacity:0 in JSX causes gsap.from() to animate 0→0, staying invisible)
 *
 * SCENE MAP:
 *   01  CommandArrivalScene     — Hero 100vh, mount timeline + scroll fade-out
 *   02  AuthorityLedgerScene    — Free 85vh, toggleActions stagger
 *   03  SignatureReelScene      — Pinned horizontal 220vh, scrub 1.2
 *   04  CapabilityMatrixScene   — Free 100vh, toggleActions
 *   05  OperationsSpineScene    — Pinned vertical 240vh (external)
 *   06  NarrativeBridgeScene    — Free 75vh, toggleActions
 *   07  ProofTheaterScene       — Free 120vh, toggleActions
 *   08  ConversionChamberScene  — Free 120vh, toggleActions
 *   09  GlobalFooterScene       — Free 70vh, toggleActions
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScribbleButton from '../ScribbleButton'
import { HeroAmbientCanvas, SceneWrapper } from '../flagship'
import {
  caseStudies,
  services,
  testimonials as testimonialData,
} from '../../data/siteData'
import { assetUrl } from '../../lib/assetUrl'
import { isLeadCaptureConfigured, submitLead } from '../../utils/leadCapture'

// ─── GSAP SETUP ─────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger)

// Debounced resize → ScrollTrigger.refresh()
let _resizeTimer = null
if (typeof window !== 'undefined') {
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(_resizeTimer)
      _resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
    },
    { passive: true }
  )
}

// ─── MOTION CONSTANTS (spec-compliant) ──────────────────────────────────────

const EASE_ENTRANCE = 'power3.out'  // spec: entrances
const EASE_FADE     = 'power2.out'  // spec: fades
const EASE_CINEMATIC = 'cubic-bezier(0.22, 0.61, 0.36, 1)'
const FM_EASE = [0.22, 0.61, 0.36, 1] // Framer Motion — hover/micro only
const STAGGER = 0.15 // spec: 0.15s per element
const SCRUB   = 1.2  // spec: pinned scrub

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = caseStudies.slice(0, 3).map((p, i) => ({
  id:        `case-${String(i + 1).padStart(2, '0')}`,
  title:     p.title,
  subtitle:  p.summary,
  challenge: p.challenge,
  outcome:   p.results?.[0] || 'Delivered without timeline drift.',
  image:     p.image,
  location:  p.location,
  slug:      p.slug,
}))

const CAPABILITY_CARDS = [
  {
    id:      'event-production',
    num:     '01',
    title:   'Event Production',
    summary: services[0]?.summary || 'Full-spectrum live event production from concept to show close.',
    tags:    services[0]?.standards?.slice(0, 3) || ['Narrative Direction', 'Floor Authority', 'Risk Protocols'],
  },
  {
    id:      'technical-production',
    num:     '02',
    title:   'Technical Production',
    summary: services[1]?.summary || 'AV, lighting, and systems integration at broadcast-grade precision.',
    tags:    services[1]?.standards?.slice(0, 3) || ['Systems Integration', 'Broadcast AV', 'Redundancy'],
  },
  {
    id:      'staging-scenic',
    num:     '03',
    title:   'Staging & Scenic',
    summary: services[2]?.summary || 'Custom staging, scenic architecture, and spatial design for executive environments.',
    tags:    services[2]?.standards?.slice(0, 3) || ['Scenic Build', 'Spatial Design', 'Custom Fabrication'],
  },
]

const TESTIMONIALS = testimonialData
  .filter(t => t?.name && t?.quote)
  .slice(0, 3)
  .map((t, i) => ({
    id:           t.id || `t-${i}`,
    name:         t.name,
    role:         t.role,
    organization: t.company,
    quote:        t.quote,
    context:      t.project,
    image:        caseStudies[i]?.image,
  }))

const parseMetric = raw => {
  const d = String(raw || '').match(/\d+/g)
  return d ? Number(d.join('')) : 0
}

const AUTHORITY_METRICS = [
  { label: 'Events Delivered',    value: caseStudies.length,  suffix: '' },
  {
    label: 'Guests Managed',
    value: caseStudies.reduce((s, c) => {
      const x = c.stats?.find(v => /guest/i.test(v.label))
      return s + parseMetric(x?.value)
    }, 0),
    suffix: '+',
  },
  {
    label: 'Cue Volume',
    value: caseStudies.reduce((s, c) => {
      const x = c.stats?.find(v => /cue|reset|phase|act|screen/i.test(v.label))
      return s + parseMetric(x?.value)
    }, 0),
    suffix: '+',
  },
  { label: 'Verified Testimonials', value: TESTIMONIALS.length, suffix: '' },
]

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

/**
 * CountUpMetric — GSAP ScrollTrigger triggered, no IntersectionObserver.
 * onEnter starts a rAF count-up animation.
 */
const CountUpMetric = ({ value, suffix = '', reduced }) => {
  const spanRef  = useRef(null)
  const [display, setDisplay] = useState(reduced ? value : 0)
  const fired = useRef(false)

  useLayoutEffect(() => {
    if (!spanRef.current || reduced) return
    const trigger = ScrollTrigger.create({
      trigger: spanRef.current,
      start: 'top 90%',
      once: true,
      onEnter() {
        if (fired.current) return
        fired.current = true
        const dur   = 920
        const t0    = performance.now()
        let raf     = 0
        const tick  = now => {
          const p = Math.min(1, (now - t0) / dur)
          setDisplay(Math.round(value * (1 - (1 - p) ** 3)))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      },
    })
    return () => trigger.kill()
  }, [reduced, value])

  return <span ref={spanRef}>{display}{suffix}</span>
}

/**
 * AmbientDepthField — Framer Motion idle breathing (non-scroll) — permitted.
 */
const AmbientDepthField = ({ reduced, variant = 'core', glowOpacity = 0.5 }) => (
  <div aria-hidden="true" className={`scene-ambient-field scene-ambient-${variant}`}>
    <motion.span
      className="scene-ambient-layer scene-ambient-back"
      animate={reduced ? undefined : {
        opacity: [glowOpacity * 0.84, glowOpacity, glowOpacity * 0.8],
        scale:   [1, 1.035, 1],
      }}
      transition={{ duration: 7.8, ease: FM_EASE, repeat: Infinity }}
    />
    <motion.span
      className="scene-ambient-layer scene-ambient-mid"
      animate={reduced ? undefined : { x: [0, 14, 0], opacity: [0.24, 0.36, 0.24] }}
      transition={{ duration: 6.2, ease: FM_EASE, repeat: Infinity }}
    />
    <motion.span
      className="scene-ambient-layer scene-ambient-front"
      animate={reduced ? undefined : { x: [0, -10, 0], opacity: [0.14, 0.26, 0.14] }}
      transition={{ duration: 5.2, ease: FM_EASE, repeat: Infinity }}
    />
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 01 — COMMAND ARRIVAL (HERO)
// 100vh. One GSAP timeline on mount. Scrub-linked fade-out on scroll.
// FIX: removed inline opacity:0 — use gsap.set() inside effect instead.
// FIX: removed scene-depth-stage-hero-full class (forced 200vh via CSS).
// ─────────────────────────────────────────────────────────────────────────────

export const CommandArrivalScene = ({ scene }) => {
  const reduced    = useReducedMotion()
  const sectionRef = useRef(null)

  const heroVideo = (() => {
    const src = scene?.videoSrc || scene?.media?.ref
    return Array.isArray(src) ? src[0] : src
  })()

  const headline = scene?.headline || 'We command public moments where failure is visible and expensive.'
  const subtitle  = scene?.subtitle  || 'Ghaim unifies narrative direction, technical systems, and floor authority for executive events that cannot miss timing, clarity, or impact.'
  const ctaText   = scene?.ctaText   || 'See Signature Builds'

  const rawLines = headline.split(/\.\s+|[\n]/g).filter(Boolean)
  const lines = rawLines.length > 1
    ? rawLines.map((l, i) => (i < rawLines.length - 1 ? l + '.' : l))
    : [headline]

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const eyebrow    = section.querySelector('[data-hero-eyebrow]')
      const lineEls    = section.querySelectorAll('[data-headline-line]')
      const headlineEl = section.querySelector('[data-hero-headline]')
      const subtitleEl = section.querySelector('[data-hero-subtitle]')
      const ctaEl      = section.querySelector('[data-hero-cta]')

      if (reduced) {
        // Ensure everything is visible in reduced-motion mode
        gsap.set([eyebrow, ...lineEls, subtitleEl, ctaEl].filter(Boolean), { opacity: 1, y: 0, filter: 'none' })
        return
      }

      // ── STEP 1: set initial hidden state (NOT inline JSX styles) ──
      gsap.set([eyebrow, ...lineEls, subtitleEl, ctaEl].filter(Boolean), {
        opacity: 0, y: 30,
      })
      if (lineEls.length) gsap.set(lineEls, { filter: 'blur(8px)' })
      if (eyebrow)    gsap.set(eyebrow,    { filter: 'blur(8px)' })
      if (subtitleEl) gsap.set(subtitleEl, { filter: 'blur(8px)' })
      if (ctaEl)      gsap.set(ctaEl,      { y: 40, scale: 0.96 })

      // ── STEP 2: mount timeline — fromTo with explicit targets ──
      const mountTl = gsap.timeline({ defaults: { ease: EASE_ENTRANCE } })

      if (eyebrow)
        mountTl.fromTo(eyebrow,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9 },
          0.15
        )

      if (lineEls.length)
        mountTl.fromTo(lineEls,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9, stagger: STAGGER },
          0.3
        )

      if (subtitleEl)
        mountTl.fromTo(subtitleEl,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9 },
          0.3 + lineEls.length * STAGGER + 0.1
        )

      if (ctaEl)
        mountTl.fromTo(ctaEl,
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0,  scale: 1, duration: 0.9 },
          0.3 + lineEls.length * STAGGER + 0.25
        )

      // ── STEP 3: scroll-linked fade-out (scrub) ──
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      if (eyebrow)    scrollTl.to(eyebrow,    { opacity: 0, y: -14, ease: 'none' }, 0.18)
      if (headlineEl) scrollTl.to(headlineEl, { opacity: 0, y: -14, ease: 'none' }, 0.24)
      if (subtitleEl) scrollTl.to(subtitleEl, { opacity: 0, y: -8,  ease: 'none' }, 0.34)
      if (ctaEl)      scrollTl.to(ctaEl,      { opacity: 0, y: -6,  ease: 'none' }, 0.44)
    }, section)

    return () => ctx.revert()
  }, [reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      id={scene?.id || 'command-arrival'}
      data-scene-id="command-arrival"
      style={{
        position: 'relative',
        minHeight: '100vh',
        height: '100vh',       // spec: exactly 100vh
        overflow: 'hidden',
        isolation: 'isolate',
        zIndex: 10,            // spec: hero z-10
      }}
    >
      {/* Video — steady, not scroll-driven */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {heroVideo ? (
          <video
            className="hero-command-video"
            src={heroVideo}
            preload="metadata"
            muted loop playsInline autoPlay
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          /* Placeholder when video is absent */
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #0a0907 0%, #111926 50%, #0d1622 100%)',
          }} />
        )}
      </div>

      {/* Three.js ambient canvas */}
      <HeroAmbientCanvas />

      {/* Cinematic depth layers */}
      <div className="hero-volumetric-layer" />
      <div className="hero-particle-layer" />
      <div className="hero-vignette-layer" />
      <div className="hero-dof-layer" />
      <div className="hero-command-soften-layer" />
      <div className="hero-lens-warmtint"    aria-hidden="true" />
      <div className="hero-parallax-shimmer" aria-hidden="true" />

      {/* ── CONTENT — GSAP targets via data attributes ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(2rem, 5vw, 5rem)',
        }}
      >
        <div style={{ width: 'min(100%, 680px)' }}>

          <p
            data-hero-eyebrow
            style={{
              margin: 0,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(250,247,242,0.7)',
            }}
          >
            Executive Event Command · UAE
          </p>

          <div data-hero-headline>
            <h1
              style={{
                margin: '1.2rem 0 0',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 6.5vw, 5.2rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                fontWeight: 500,
                color: '#faf7f2',
                maxWidth: '16ch',
              }}
            >
              {lines.map((line, i) => (
                <span
                  key={i}
                  data-headline-line
                  style={{ display: 'block' }}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <p
            data-hero-subtitle
            style={{
              margin: '1.6rem 0 0',
              maxWidth: '42ch',
              fontSize: 'clamp(0.98rem, 1.6vw, 1.18rem)',
              lineHeight: 1.68,
              color: 'rgba(250,247,242,0.78)',
            }}
          >
            {subtitle}
          </p>

          <div
            data-hero-cta
            style={{ marginTop: '2rem', display: 'inline-block', position: 'relative', zIndex: 30 }}
          >
            {/* Framer Motion whileHover — non-scroll, permitted */}
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.03 }}
              whileTap={reduced  ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease: FM_EASE }}
              style={{ display: 'inline-block' }}
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

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          zIndex: 5,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, rgba(8,10,14,0.6))',
        }}
      />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 02 — AUTHORITY LEDGER
// Free scroll 85vh. GSAP fromTo + toggleActions stagger on all elements.
// FIX: removed all inline opacity:0 from JSX — gsap.set() handles initial state.
// ─────────────────────────────────────────────────────────────────────────────

export const AuthorityLedgerScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (reduced) return

      // ── Set initial hidden state for ALL animated elements ──
      const headerEls = el.querySelectorAll('[data-ledger-header] [data-reveal]')
      const metricCards = el.querySelectorAll('[data-metric-card]')
      const ctaEl = el.querySelector('[data-ledger-cta]')

      gsap.set(headerEls, { opacity: 0, y: 24, filter: 'blur(6px)' })
      gsap.set(metricCards, { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' })
      gsap.set(ctaEl, { opacity: 0, y: 14 })

      // ── Header reveal ──
      gsap.fromTo(
        headerEls,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.85, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-ledger-header]'),
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // ── Metric cards — clip from bottom ──
      gsap.fromTo(
        metricCards,
        { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
        {
          opacity: 1, clipPath: 'inset(0 0 0% 0 round 18px)',
          duration: 0.85, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-ledger-metrics]'),
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // ── CTA ──
      if (ctaEl)
        gsap.fromTo(
          ctaEl,
          { opacity: 0, y: 14 },
          {
            opacity: 1, y: 0,
            duration: 0.7, ease: EASE_FADE,
            scrollTrigger: {
              trigger: ctaEl,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  const heading = scene?.headline || 'Outcome authority before visual theater.'
  const body    = scene?.subtitle  || 'Executive productions stay trusted when timing, technical certainty, and delivery control are visible before the spotlight turns on.'

  return (
    <SceneWrapper
      id={scene?.id || 'authority-ledger'}
      tone={scene?.tone || 'steel'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="85vh"
      className="scene-cinematic scene-authority-ledger"
    >
      <div
        ref={sceneRef}
        className="authority-ledger"
        style={{
          width: '100%',
          minHeight: '85vh',
          display: 'grid',
          alignItems: 'center',
          padding: 'clamp(3rem, 7vh, 6rem) clamp(1.2rem, 4vw, 2rem)',
        }}
      >
        <AmbientDepthField reduced={reduced} variant="ledger" glowOpacity={0.3} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: 'min(1240px, 100%)',
            marginInline: 'auto',
            display: 'grid',
            gap: 'clamp(2.4rem, 5vh, 4rem)',
          }}
        >
          {/* Header */}
          <header data-ledger-header style={{ maxWidth: '56ch' }}>
            <p
              data-reveal
              style={{
                margin: 0,
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-subtle)',
              }}
            >
              Performance Record
            </p>

            <h2
              data-reveal
              className="authority-ledger-heading"
              style={{ margin: '1rem 0 0', color: 'var(--color-ink)' }}
            >
              {heading}
            </h2>

            <p
              data-reveal
              className="authority-ledger-subcopy"
              style={{ margin: '1rem 0 0', color: 'var(--color-ink-muted)' }}
            >
              {body}
            </p>
          </header>

          {/* Metric cards */}
          <div
            data-ledger-metrics
            className="authority-ledger-metrics-grid"
          >
            {AUTHORITY_METRICS.map(metric => (
              <div
                key={metric.label}
                data-metric-card
                style={{
                  borderRadius: '1.1rem',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-2)',
                  padding: 'clamp(1.2rem, 2.5vh, 2rem) clamp(1rem, 2vw, 1.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 'clamp(9rem, 18vh, 13rem)',
                  boxShadow: '0 18px 46px rgba(8,12,20,0.08)',
                }}
              >
                <p style={{
                  margin: 0,
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-subtle)',
                }}>
                  {metric.label}
                </p>
                <p
                  className="authority-ledger-metric-value"
                  style={{
                    margin: '0.75rem 0 0',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1,
                    color: 'var(--color-ink)',
                  }}
                >
                  <CountUpMetric value={metric.value} suffix={metric.suffix} reduced={reduced} />
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div data-ledger-cta className="authority-ledger-cta">
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
          </div>
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 03 — SIGNATURE REEL
// PINNED HORIZONTAL — outer 220vh, inner 100vh CSS sticky.
// One master GSAP timeline, scrub: 1.2. No nested ScrollTriggers.
// z-index: 20 per spec.
// ─────────────────────────────────────────────────────────────────────────────

export const SignatureReelScene = ({ scene }) => {
  const reduced      = useReducedMotion()
  const outerRef     = useRef(null)
  const trackRef     = useRef(null)
  const headRef      = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [dir, setDir]             = useState(1)

  const go = useCallback(idx => {
    const c = Math.max(0, Math.min(PROJECTS.length - 1, idx))
    setDir(c > activeIdx ? 1 : -1)
    setActiveIdx(c)
  }, [activeIdx])

  useLayoutEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    const head  = headRef.current
    if (!outer || !track || reduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': function desktopReel() {
          const panels = track.querySelectorAll('[data-reel-panel]')

          // Initial state — head hidden, subsequent panels hidden
          gsap.set(head, { opacity: 0, y: 16 })
          gsap.set([...panels].slice(1), { opacity: 0 })

          // ── ONE master timeline, ONE ScrollTrigger ──
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: outer,
              start: 'top top',
              end: 'bottom bottom',
              scrub: SCRUB,
              invalidateOnRefresh: true,
              onUpdate(self) {
                setActiveIdx(
                  Math.min(PROJECTS.length - 1, Math.floor(self.progress * PROJECTS.length))
                )
              },
            },
          })

          // Phase 0: header appears
          tl.fromTo(head,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.1, ease: EASE_FADE },
            0
          )

          // Phase 0.08→0.88: horizontal slide
          tl.fromTo(
            track,
            { x: 0 },
            {
              x: () => -(window.innerWidth * (PROJECTS.length - 1)),
              ease: 'none',
              duration: 0.8,
            },
            0.08
          )

          // Fade in subsequent panels as they enter
          ;[...panels].slice(1).forEach((panel, i) => {
            const at = 0.1 + ((i + 1) / PROJECTS.length) * 0.7
            tl.fromTo(panel,
              { opacity: 0 },
              { opacity: 1, duration: 0.1, ease: EASE_FADE },
              at
            )
          })

          return () => {
            gsap.set(track, { clearProps: 'x' })
            gsap.set(head, { clearProps: 'all' })
          }
        },
      })
    }, outer)

    return () => ctx.revert()
  }, [reduced])

  const sel = PROJECTS[activeIdx] || PROJECTS[0]

  const NAV_BTN = disabled => ({
    background: 'none', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase',
    color: disabled ? 'rgba(250,247,242,0.22)' : 'rgba(250,247,242,0.6)',
    WebkitTapHighlightColor: 'transparent',
  })

  return (
    /* OUTER — 220vh scroll distance */
    <div
      ref={outerRef}
      id={scene?.id || 'signature-reel'}
      data-scene-id="signature-reel"
      style={{ height: '220vh', position: 'relative', zIndex: 20 }}
    >
      {/* INNER — 100vh CSS sticky (NOT GSAP pin) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--lux-dark, #111926)',
        }}
      >

        {/* ── DESKTOP: GSAP horizontal reel ── */}
        <div className="hidden md:block" style={{ width: '100%', height: '100%', position: 'relative' }}>

          {/* Header bar */}
          <div
            ref={headRef}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'clamp(1.6rem, 3.5vw, 2.4rem) clamp(2rem, 4.5vw, 4rem)',
              borderBottom: '1px solid rgba(250,247,242,0.08)',
            }}
          >
            <p style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.42)', margin: 0 }}>
              Featured Engagements
            </p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'rgba(250,247,242,0.26)', letterSpacing: '0.04em', margin: 0 }}>
              <span style={{ color: 'var(--lux-gold, #b5924f)' }}>{String(activeIdx + 1).padStart(2, '0')}</span>
              {' / '}{String(PROJECTS.length).padStart(2, '0')}
            </p>
          </div>

          {/* Horizontal track — GSAP animates X */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              width: `${PROJECTS.length * 100}vw`,
              height: '100%',
              willChange: 'transform',
            }}
          >
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                data-reel-panel
                style={{
                  width: '100vw', height: '100%', flexShrink: 0,
                  display: 'grid',
                  gridTemplateColumns: '0.48fr 0.52fr',
                  padding: 'clamp(5rem, 10vh, 7rem) clamp(2rem, 4.5vw, 4rem) clamp(2rem, 4vh, 3.5rem)',
                  gap: 'clamp(2rem, 4vw, 4rem)',
                  alignItems: 'center',
                }}
              >
                {/* Copy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 600, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)', opacity: 0.8 }}>
                    {p.location}
                  </p>
                  <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4.5vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.04em', fontWeight: 500, color: '#faf7f2', maxWidth: '14ch' }}>
                    {p.title}
                  </h2>
                  <div style={{ width: '2rem', height: '1px', background: 'var(--lux-gold, #b5924f)', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: 'clamp(0.88rem, 1.15vw, 1.02rem)', lineHeight: 1.74, color: 'rgba(250,247,242,0.55)', maxWidth: '36ch' }}>
                    {p.challenge}
                  </p>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.32)' }}>
                    {p.outcome}
                  </p>
                  <Link
                    to={`/work/${p.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)', textDecoration: 'none', marginTop: '0.5rem' }}
                  >
                    View Case Study
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                {/* Image */}
                <div style={{ position: 'relative', height: '72vh' }}>
                  {p.image ? (
                    <img
                      src={p.image} alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(250,247,242,0.06)', borderRadius: '0.5rem' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,9,7,0.06) 0%, rgba(10,9,7,0.28) 100%)', pointerEvents: 'none' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div style={{
            position: 'absolute', bottom: 'clamp(1.4rem, 3vh, 2.2rem)',
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '0.5rem', zIndex: 10,
          }}>
            {PROJECTS.map((_, i) => (
              <div key={i} style={{
                width: i === activeIdx ? '1.8rem' : '0.5rem',
                height: '2px',
                background: i === activeIdx ? 'var(--lux-gold, #b5924f)' : 'rgba(250,247,242,0.2)',
                borderRadius: '1px',
                transition: 'width 0.36s ease, background 0.36s ease',
              }} />
            ))}
          </div>
        </div>

        {/* ── MOBILE: manual navigation (AnimatePresence — non-scroll, permitted) ── */}
        <div
          className="md:hidden"
          style={{ height: '100%', overflowY: 'auto', background: 'var(--lux-dark, #111926)', padding: 'clamp(5rem, 12vh, 7rem) clamp(1.2rem, 4vw, 2rem) clamp(2rem, 4vh, 3rem)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(250,247,242,0.08)', paddingBottom: '1.2rem', marginBottom: '1.8rem' }}>
            <p style={{ margin: 0, fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.42)' }}>Featured Engagements</p>
            <p style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: 'rgba(250,247,242,0.32)' }}>
              <span style={{ color: 'var(--lux-gold, #b5924f)' }}>{String(activeIdx + 1).padStart(2, '0')}</span>
              {' / '}{String(PROJECTS.length).padStart(2, '0')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, x: dir * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.6, ease: FM_EASE }}
            >
              <p style={{ margin: '0 0 0.8rem', fontSize: '9px', fontWeight: 600, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)' }}>{sel.location}</p>
              <h2 style={{ margin: '0 0 1.2rem', fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', lineHeight: 1.0, letterSpacing: '-0.04em', color: '#faf7f2' }}>{sel.title}</h2>
              {sel.image && <img src={sel.image} alt={sel.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', marginBottom: '1.2rem' }} loading="lazy" />}
              <p style={{ margin: '0 0 1.2rem', fontSize: '0.92rem', lineHeight: 1.7, color: 'rgba(250,247,242,0.55)', maxWidth: '36ch' }}>{sel.challenge}</p>
              <Link to={`/work/${sel.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)', textDecoration: 'none' }}>
                View Case Study <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(250,247,242,0.08)', paddingTop: '1.4rem', marginTop: '1.8rem' }}>
            <button onClick={() => go(activeIdx - 1)} disabled={activeIdx === 0} style={NAV_BTN(activeIdx === 0)} aria-label="Previous">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7 9 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Previous
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {PROJECTS.map((_, i) => (
                <button key={i} onClick={() => go(i)} aria-label={`Project ${i + 1}`}
                  style={{ width: i === activeIdx ? '1.8rem' : '0.5rem', height: '3px', background: i === activeIdx ? 'var(--lux-gold, #b5924f)' : 'rgba(250,247,242,0.2)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease', minHeight: '20px', WebkitTapHighlightColor: 'transparent' }} />
              ))}
            </div>
            <button onClick={() => go(activeIdx + 1)} disabled={activeIdx === PROJECTS.length - 1} style={NAV_BTN(activeIdx === PROJECTS.length - 1)} aria-label="Next">
              Next <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2.5L9.5 7 5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 04 — CAPABILITY MATRIX
// Free scroll 100vh. GSAP fromTo + toggleActions sequential card reveal.
// ─────────────────────────────────────────────────────────────────────────────

const CapabilityCard = ({ card }) => (
  <div
    style={{
      border: '1px solid rgba(16,15,13,0.1)',
      background: 'rgba(250,248,245,0.92)',
      boxShadow: '0 8px 24px rgba(8,12,20,0.06)',
      padding: 'clamp(1.6rem, 3.5vw, 2.6rem)',
      display: 'flex', flexDirection: 'column', gap: '1.4rem',
      height: '100%',
    }}
  >
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', letterSpacing: '0.28em', color: 'rgba(181,146,79,0.88)' }}>{card.num}</span>
    <div style={{ width: '2.2rem', height: '1px', background: 'rgba(181,146,79,0.56)' }} />
    <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 2.2vw, 2.1rem)', lineHeight: 1.06, letterSpacing: '-0.03em', fontWeight: 500, color: 'var(--color-ink)' }}>{card.title}</h3>
    <p style={{ margin: 0, fontSize: 'clamp(0.85rem, 1.1vw, 0.96rem)', lineHeight: 1.7, color: 'var(--color-ink-muted)', maxWidth: '32ch' }}>{card.summary}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.2rem', marginTop: 'auto' }}>
      {card.tags.map(tag => (
        <span key={tag} style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)' }}>{tag}</span>
      ))}
    </div>
  </div>
)

export const CapabilityMatrixScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      const headerEls = el.querySelectorAll('[data-matrix-header] [data-reveal]')
      const cards     = el.querySelectorAll('[data-capability-card]')

      gsap.set(headerEls, { opacity: 0, y: 24, filter: 'blur(6px)' })
      gsap.set(cards,     { opacity: 0, y: 20 })

      gsap.fromTo(headerEls,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.85, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-matrix-header]'),
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.85, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-matrix-cards]'),
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <SceneWrapper
      id={scene?.id || 'capability-matrix'}
      tone={scene?.tone || 'steel'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="100vh"
      className="scene-cinematic scene-capability-matrix"
    >
      <div
        ref={sceneRef}
        style={{
          width: 'min(1240px, calc(100% - 2.5rem))',
          marginInline: 'auto',
          padding: 'clamp(3rem, 7vh, 6rem) 0',
          display: 'grid',
          gap: 'clamp(2rem, 4vh, 3.5rem)',
        }}
      >
        {/* Header */}
        <header data-matrix-header style={{ display: 'grid', gap: '1.1rem' }}>
          <p data-reveal className="lux-eyebrow-muted" style={{ margin: 0 }}>Capabilities</p>
          <div data-reveal className="lux-rule" />
          <h2
            data-reveal
            className="lux-display"
            style={{ margin: 0, color: 'var(--color-ink)', maxWidth: '18ch' }}
          >
            Technical depth,<br />creative precision,<br />operational control.
          </h2>
          <div data-reveal style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.6rem' }}>
            <Link to="/services" className="lux-cta-dark-outline">
              All Services
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Desktop 3-col */}
        <div data-matrix-cards className="capability-cards-grid">
          {CAPABILITY_CARDS.map(card => (
            <div key={card.id} data-capability-card>
              <CapabilityCard card={card} />
            </div>
          ))}
        </div>

        {/* Mobile stacked */}
        <div className="capability-cards-mobile" style={{ display: 'grid', gap: '1rem' }}>
          {CAPABILITY_CARDS.map(card => (
            <CapabilityCard key={`m-${card.id}`} card={card} />
          ))}
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 06 — NARRATIVE BRIDGE
// Free scroll 75vh. GSAP fromTo + toggleActions staggered text reveal.
// ─────────────────────────────────────────────────────────────────────────────

export const NarrativeBridgeScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('[data-bridge-reveal]')
      gsap.set(items, { opacity: 0, y: 14 })

      gsap.fromTo(items,
        { opacity: 0, y: 14 },
        {
          opacity: 1, y: 0,
          duration: 1.0, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el,
            start: 'top 76%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <SceneWrapper
      id={scene?.id || 'narrative-bridge'}
      tone={scene?.tone || 'warm'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="75vh"
      className="scene-cinematic scene-narrative-bridge"
    >
      <div ref={sceneRef} style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
            padding: 'clamp(4rem, 10vh, 8rem) clamp(1.5rem, 4vw, 3rem)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div data-bridge-reveal className="lux-rule" style={{ margin: '0 auto 2.2rem' }} />

          <p
            data-bridge-reveal
            style={{
              margin: '0 0 1.8rem',
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'rgba(181,146,79,0.68)',
            }}
          >
            Outcome Transition
          </p>

          <h2
            data-bridge-reveal
            style={{
              margin: '0 auto',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
              lineHeight: 1.04, letterSpacing: '-0.04em', fontWeight: 500,
              maxWidth: '18ch', color: 'var(--color-ink)',
            }}
          >
            Precision is only credible when proof carries the weight.
          </h2>

          <p
            data-bridge-reveal
            style={{
              margin: '2rem auto 0', maxWidth: '44ch',
              fontSize: 'clamp(0.9rem, 1.2vw, 1.04rem)', lineHeight: 1.74,
              color: 'var(--color-ink-muted)',
            }}
          >
            The next chapter shifts from directional language to verified outcomes, named stakeholders, and delivery context.
          </p>

          <div data-bridge-reveal className="lux-rule" style={{ margin: '2.5rem auto 0' }} />
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 07 — PROOF THEATER
// Free scroll 120vh. Header stagger + testimonial carousel (AnimatePresence).
// ─────────────────────────────────────────────────────────────────────────────

const TestimonialCarousel = ({ reduced }) => {
  const [idx, setIdx]   = useState(0)
  const [dir, setDir]   = useState(1)
  const touchX = useRef(null)
  const delta  = useRef(0)

  const safe  = Math.max(0, Math.min(idx, TESTIMONIALS.length - 1))
  const active = TESTIMONIALS[safe]
  const hasPrev = safe > 0
  const hasNext = safe < TESTIMONIALS.length - 1

  const prev = () => { setDir(-1); setIdx(i => Math.max(0, i - 1)) }
  const next = () => { setDir(1);  setIdx(i => Math.min(TESTIMONIALS.length - 1, i + 1)) }

  const onTouchStart = e => { touchX.current = e.touches[0]?.clientX ?? null; delta.current = 0 }
  const onTouchMove  = e => { if (touchX.current === null) return; delta.current = (e.touches[0]?.clientX ?? touchX.current) - touchX.current }
  const onTouchEnd   = () => {
    if (touchX.current === null) return
    if (delta.current <= -46) next()
    if (delta.current >=  46) prev()
    touchX.current = null; delta.current = 0
  }

  if (!active) return null

  const BTN = disabled => ({
    width: '44px', height: '44px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: '1px solid rgba(16,15,13,0.14)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.25 : 1,
    transition: 'border-color 0.2s ease', WebkitTapHighlightColor: 'transparent',
  })

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{ paddingTop: 'clamp(2.5rem, 5vh, 4rem)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: dir * 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -24 }}
          transition={{ duration: 0.7, ease: FM_EASE }}
        >
          <div style={{ display: 'grid', gap: 'clamp(2rem, 5vw, 4.5rem)', alignItems: 'start' }} className="md:grid-cols-[1fr_200px]">
            <div>
              <div
                aria-hidden="true"
                style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(4rem, 7vw, 8rem)', lineHeight: 0.8, color: 'var(--lux-gold, #b5924f)', opacity: 0.26, marginBottom: '-1.2rem', userSelect: 'none', letterSpacing: '-0.04em' }}
              >"</div>
              <blockquote className="lux-blockquote" style={{ color: 'var(--color-ink)', margin: '0 0 1.8rem' }}>
                {active.quote}
              </blockquote>
              <footer>
                <p style={{ margin: '0 0 0.2rem', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>{active.name}</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  {active.role}{active.organization ? ` · ${active.organization}` : ''}
                </p>
                {active.context && (
                  <p style={{ margin: '0.6rem 0 0', fontSize: '9px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--lux-gold, #b5924f)', opacity: 0.8 }}>
                    {active.context}
                  </p>
                )}
              </footer>
            </div>
            {active.image && (
              <div className="hidden md:block">
                <img src={active.image} alt={active.name} loading="lazy" decoding="async"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', filter: 'grayscale(0.12)' }} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2.4rem', paddingTop: '1.4rem', borderTop: '1px solid rgba(16,15,13,0.1)' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={prev} disabled={!hasPrev} style={BTN(!hasPrev)} aria-label="Previous testimonial"
            onMouseEnter={e => { if (hasPrev) e.currentTarget.style.borderColor = 'var(--lux-gold, #b5924f)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={next} disabled={!hasNext} style={BTN(!hasNext)} aria-label="Next testimonial"
            onMouseEnter={e => { if (hasNext) e.currentTarget.style.borderColor = 'var(--lux-gold, #b5924f)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(16,15,13,0.14)' }}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > safe ? 1 : -1); setIdx(i) }} aria-label={`Testimonial ${i + 1}`}
              style={{ width: i === safe ? '1.6rem' : '0.4rem', height: '4px', background: i === safe ? 'var(--lux-gold, #b5924f)' : 'rgba(16,15,13,0.18)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease', WebkitTapHighlightColor: 'transparent' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const ProofTheaterScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      const headerEls = el.querySelectorAll('[data-proof-header] [data-reveal]')
      const bodyEl    = el.querySelector('[data-proof-body]')

      gsap.set(headerEls, { opacity: 0, y: 14, filter: 'blur(4px)' })
      gsap.set(bodyEl,    { opacity: 0, y: 10 })

      gsap.fromTo(headerEls,
        { opacity: 0, y: 14, filter: 'blur(4px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.9, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-proof-header]'),
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(bodyEl,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: EASE_FADE,
          scrollTrigger: {
            trigger: bodyEl,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <SceneWrapper
      id={scene?.id || 'proof-theater'}
      tone={scene?.tone || 'linen'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="120vh"
      className="scene-cinematic scene-proof-theater"
    >
      <div
        ref={sceneRef}
        style={{
          width: 'min(1240px, calc(100% - 2.5rem))',
          marginInline: 'auto',
          padding: 'clamp(3rem, 7vh, 6rem) 0',
          position: 'relative',
        }}
      >
        <div className="cine-grain-overlay" aria-hidden="true" />

        <header data-proof-header style={{ position: 'relative', zIndex: 1 }}>
          <p data-reveal className="lux-eyebrow-muted" style={{ margin: '0 0 1.2rem' }}>Client Outcomes</p>
          <div data-reveal className="lux-rule" style={{ marginBottom: '1.6rem' }} />
          <h2
            data-reveal
            className="lux-title"
            style={{ margin: 0, color: 'var(--color-ink)', maxWidth: '22ch' }}
          >
            Verified outcomes, named stakeholders, accountable delivery.
          </h2>
        </header>

        <div data-proof-body style={{ position: 'relative', zIndex: 1 }}>
          <TestimonialCarousel reduced={reduced} />
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 08 — CONVERSION CHAMBER
// Free scroll 120vh. Left editorial + right form elevation via GSAP fromTo.
// ─────────────────────────────────────────────────────────────────────────────

const FloatingField = ({ id, label, children }) => (
  <label htmlFor={id} className="cinematic-field">
    {children}
    <span className="cinematic-field-label">{label}</span>
  </label>
)

const STUB_DELAY = 680

const ConversionForm = ({ reduced }) => {
  const [status, setStatus] = useState('idle')
  const [msg,    setMsg]    = useState('')
  const mounted = useRef(true)

  useEffect(() => () => { mounted.current = false }, [])

  const submitting = status === 'submitting'
  const success    = status === 'success'
  const error      = status === 'error'

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.currentTarget
    const fd   = new FormData(form)
    if (String(fd.get('website') || '').trim()) return

    const required = ['name', 'company', 'email', 'budget_band', 'event_type', 'scope']
    if (required.some(k => !String(fd.get(k) || '').trim())) {
      setStatus('error'); setMsg('Please complete all required fields.'); return
    }
    setStatus('submitting'); setMsg('')
    try {
      if (isLeadCaptureConfigured()) {
        await submitLead(Object.fromEntries(fd.entries()), {
          formName: 'homepage-command-brief',
          pagePath: window.location.pathname,
          sourceScene: 'conversion-chamber',
        })
      } else {
        await new Promise(r => setTimeout(r, STUB_DELAY))
      }
      if (mounted.current) { setStatus('success'); setMsg('Request received. A senior producer will contact you within one business day.'); form.reset() }
    } catch (err) {
      if (mounted.current) { setStatus('error'); setMsg(err instanceof Error ? err.message : 'Unable to submit. Please retry.') }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="cinematic-conversion-form grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
      aria-busy={submitting}
    >
      <input type="hidden" name="source_scene" value="conversion-chamber" />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <FloatingField id="c-name"  label="Name">  <input id="c-name"  name="name"    type="text"  placeholder=" " autoComplete="name"         required className="cinematic-field-input" /></FloatingField>
      <FloatingField id="c-email" label="Email">  <input id="c-email" name="email"   type="email" placeholder=" " autoComplete="email"        required className="cinematic-field-input" /></FloatingField>
      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingField id="c-company" label="Company"><input id="c-company" name="company" type="text" placeholder=" " autoComplete="organization" required className="cinematic-field-input" /></FloatingField>
        <FloatingField id="c-phone"   label="Phone">  <input id="c-phone"   name="phone"   type="tel"  placeholder=" " autoComplete="tel"                className="cinematic-field-input" /></FloatingField>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FloatingField id="c-budget" label="Budget Band">
          <select id="c-budget" name="budget_band" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
            <option value="" disabled>Select band</option>
            <option value="under-100k">Under 100K AED</option>
            <option value="100k-250k">100K–250K AED</option>
            <option value="250k-500k">250K–500K AED</option>
            <option value="500k-plus">500K+ AED</option>
          </select>
        </FloatingField>
        <FloatingField id="c-event" label="Event Type">
          <select id="c-event" name="event_type" defaultValue="" className="cinematic-field-input cinematic-select-input" required>
            <option value="" disabled>Select type</option>
            <option value="executive-summit">Executive Summit</option>
            <option value="brand-launch">Brand Launch</option>
            <option value="vip-gala">VIP Gala</option>
            <option value="technical-showcase">Technical Showcase</option>
          </select>
        </FloatingField>
      </div>
      <FloatingField id="c-date"  label="Target Date Window"><input    id="c-date"  name="target_window" type="text"     placeholder=" " className="cinematic-field-input" /></FloatingField>
      <FloatingField id="c-scope" label="Project Scope">    <textarea  id="c-scope" name="scope"          placeholder=" " rows={4}    required className="cinematic-field-input resize-none" /></FloatingField>

      <AnimatePresence mode="wait">
        {msg && (
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.36, ease: FM_EASE }}
            className={`cinematic-feedback-panel rounded-xl border px-4 py-3 ${success ? 'is-success border-[rgba(122,218,165,0.45)] bg-[rgba(53,95,76,0.28)]' : 'border-[rgba(236,123,123,0.44)] bg-[rgba(90,37,37,0.24)]'}`}
            role={success ? 'status' : 'alert'} aria-live={success ? 'polite' : 'assertive'} aria-atomic="true"
          >
            <div className="flex items-center gap-3">
              {success && <span className="cinematic-success-mark" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4.5 10.7l3.2 3.4 7.8-8.3" /></svg></span>}
              <p className="text-sm text-[var(--color-ink)]">{msg}</p>
            </div>
          </motion.div>
        )}
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
        {submitting ? 'Submitting...' : 'Submit Request'}
      </ScribbleButton>
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
        {error ? 'Submission issue. Please retry or call direct.' : success ? 'Command queue confirmed.' : 'Private brief channel secured.'}
      </p>
    </form>
  )
}

export const ConversionChamberScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      const leftEls = el.querySelectorAll('[data-chamber-left] [data-reveal]')
      const rightEl = el.querySelector('[data-chamber-right]')

      gsap.set(leftEls, { opacity: 0, y: 22, filter: 'blur(6px)' })
      gsap.set(rightEl, { opacity: 0, y: 12 })

      gsap.fromTo(leftEls,
        { opacity: 0, y: 22, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.85, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el.querySelector('[data-chamber-left]'),
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(rightEl,
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0,
          duration: 1.0, ease: EASE_FADE,
          scrollTrigger: {
            trigger: rightEl,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <SceneWrapper
      id={scene?.id || 'conversion-chamber'}
      tone={scene?.tone || 'dark'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="120vh"
      className="scene-cinematic scene-conversion-chamber"
    >
      <div
        ref={sceneRef}
        style={{ display: 'grid' }}
        className="md:grid-cols-[0.44fr_0.56fr]"
      >
        {/* Left — dark editorial panel */}
        <div
          data-chamber-left
          style={{
            background: 'var(--lux-dark, #111926)',
            padding: 'clamp(2.4rem, 6vw, 4.5rem) clamp(1.6rem, 3.5vw, 3.2rem)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2.8rem',
          }}
        >
          <div>
            <p data-reveal style={{ margin: '0 0 1.6rem', fontSize: '9px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.42)' }}>
              Request Proposal
            </p>
            <div data-reveal style={{ width: '2rem', height: '1px', background: 'var(--lux-gold, #b5924f)', opacity: 0.58, marginBottom: '1.6rem' }} />
            <h2 data-reveal style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 500, color: 'rgba(250,247,242,0.88)', maxWidth: '18ch' }}>
              Brief a senior producer before creative spend begins.
            </h2>
            <p data-reveal style={{ margin: '1.2rem 0 0', fontSize: 'clamp(0.84rem, 1.1vw, 0.94rem)', lineHeight: 1.72, color: 'rgba(250,247,242,0.3)', maxWidth: '38ch' }}>
              This enters a direct producer queue. Expect scope clarity, risk framing, and an executable production path.
            </p>
          </div>
          <div>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.2rem' }}>
              {['Scope-first intake before creative spend.', 'Execution constraints surfaced at day one.', 'Decision-ready production path within 48 hours.'].map((item, i) => (
                <div key={i} data-reveal style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <svg style={{ marginTop: '0.18rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="var(--lux-gold, #b5924f)" strokeWidth="0.8" strokeOpacity="0.4" />
                    <path d="M4.5 7l2 2 3-3" stroke="var(--lux-gold, #b5924f)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.62, color: 'rgba(250,247,242,0.52)' }}>{item}</p>
                </div>
              ))}
            </div>
            <div data-reveal style={{ borderTop: '1px solid rgba(250,247,242,0.08)', paddingTop: '1.4rem' }}>
              <a href="tel:+97142345678" style={{ display: 'block', fontSize: '13px', color: 'rgba(250,247,242,0.3)', textDecoration: 'none', marginBottom: '0.3rem' }}>+971 4 234 5678</a>
              <a href="mailto:hello@ghaimuae.com" style={{ display: 'block', fontSize: '13px', color: 'rgba(250,247,242,0.3)', textDecoration: 'none' }}>hello@ghaimuae.com</a>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div
          data-chamber-right
          style={{
            background: '#faf7f2',
            padding: 'clamp(2.4rem, 6vw, 4.5rem) clamp(1.6rem, 3.5vw, 3.2rem)',
          }}
        >
          <ConversionForm reduced={reduced} />
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 09 — GLOBAL FOOTER
// Free scroll 70vh. GSAP fromTo staggered reveal.
// ─────────────────────────────────────────────────────────────────────────────

export const GlobalFooterScene = ({ scene }) => {
  const reduced  = useReducedMotion()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    const el = sceneRef.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('[data-footer-reveal]')
      gsap.set(items, { opacity: 0, y: 16 })

      gsap.fromTo(items,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: EASE_ENTRANCE, stagger: STAGGER,
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <SceneWrapper
      id={scene?.id || 'global-footer'}
      tone={scene?.tone || 'deep'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight="70vh"
      className="scene-cinematic scene-global-footer"
    >
      <div ref={sceneRef} style={{ position: 'relative', width: '100%' }}>
        <div className="cine-grain-overlay"               aria-hidden="true" />
        <div className="cine-scene-glow cine-scene-glow-warm" aria-hidden="true" />

        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', padding: 'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 4vw, 3rem)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div data-footer-reveal>
            <div className="lux-rule" style={{ margin: '0 auto 2rem' }} />
            <p className="lux-eyebrow-muted" style={{ marginBottom: '1.8rem' }}>Next Move</p>
          </div>

          <h2
            data-footer-reveal
            style={{
              margin: '0 0 1.8rem',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 6vw, 5.8rem)',
              lineHeight: 0.97, letterSpacing: '-0.045em', fontWeight: 500,
              color: 'var(--color-ink)', maxWidth: '16ch',
            }}
          >
            Precision-led production for moments that cannot miss.
          </h2>

          <p
            data-footer-reveal
            style={{
              margin: '0 0 2.8rem',
              fontSize: 'clamp(0.88rem, 1.2vw, 1.04rem)', lineHeight: 1.74,
              color: 'var(--color-ink-muted)', maxWidth: '48ch',
            }}
          >
            Regional reach across UAE — one accountable command structure from scope to show close.
          </p>

          <div
            data-footer-reveal
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', justifyContent: 'center', marginBottom: '2.8rem' }}
          >
            {/* Framer Motion hover pulse — non-scroll, permitted */}
            <motion.div
              animate={reduced ? undefined : {
                scale: [1, 1.016, 1],
                transition: { duration: 0.9, ease: FM_EASE, repeat: Infinity, repeatDelay: 3.2 },
              }}
              style={{ display: 'inline-flex' }}
            >
              <Link to="/contact" className="lux-cta-dark">
                Request Proposal
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5h7M6.5 3L9 5.5 6.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
            <Link to="/work" className="lux-cta-dark-outline">View Our Work</Link>
          </div>

          <p
            data-footer-reveal
            style={{
              margin: 0, fontSize: '9px', fontWeight: 600, letterSpacing: '0.38em',
              textTransform: 'uppercase', color: 'var(--color-ink-subtle)',
            }}
          >
            Dubai · Abu Dhabi · GCC
          </p>

          <div data-footer-reveal>
            <div className="lux-rule" style={{ margin: '2rem auto 0' }} />
          </div>
        </div>
      </div>
    </SceneWrapper>
  )
}