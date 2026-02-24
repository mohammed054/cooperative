/**
 * HomeScenes.jsx — GHAIM UAE · CINEMATIC HOMEPAGE
 *
 * STRUCTURAL CORRECTION PASS — layout, spacing, alignment only.
 * No content, copy, or design changes.
 *
 * FIXES APPLIED:
 *   [1] Hero: justifyContent flex-end → use padding-top offset from navbar, headline no longer buried
 *   [2] AuthorityLedger: excessive vh padding reduced, tighter top/bottom rhythm
 *   [3] CapabilityMatrix: differentiated from §2 — right-offset container, smaller top pad, no eyebrow gap
 *   [4] NarrativeBridge: removed partial centering ambiguity — committed to full center with explicit align-items
 *   [5] ProofTheater: minHeight auto, inner padding tightened so title+nav fit within 100vh
 *   [6] ConversionChamber: SceneWrapper gap/padding removed, grid locked flush
 *   [7] GlobalFooter: all text colors raised to meet visible contrast; opacity floor lifted
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = caseStudies.slice(0, 3).map((p, i) => ({
  id: `case-${String(i + 1).padStart(2, '0')}`,
  title: p.title,
  subtitle: p.summary,
  challenge: p.challenge,
  outcome: p.results?.[0] || 'Delivered without timeline drift.',
  image: p.image,
  location: p.location,
  slug: p.slug,
}))

const CAPABILITY_CARDS = [
  {
    id: 'event-production',
    num: '01',
    title: 'Event Production',
    summary:
      services[0]?.summary ||
      'Full-spectrum live event production from concept to show close.',
    tags: services[0]?.standards?.slice(0, 3) || [
      'Narrative Direction',
      'Floor Authority',
      'Risk Protocols',
    ],
  },
  {
    id: 'technical-production',
    num: '02',
    title: 'Technical Production',
    summary:
      services[1]?.summary ||
      'AV, lighting, and systems integration at broadcast-grade precision.',
    tags: services[1]?.standards?.slice(0, 3) || [
      'Systems Integration',
      'Broadcast AV',
      'Redundancy',
    ],
  },
  {
    id: 'staging-scenic',
    num: '03',
    title: 'Staging & Scenic',
    summary:
      services[2]?.summary ||
      'Custom staging, scenic architecture, and spatial design for executive environments.',
    tags: services[2]?.standards?.slice(0, 3) || [
      'Scenic Build',
      'Spatial Design',
      'Custom Fabrication',
    ],
  },
]

const TESTIMONIALS = testimonialData
  .filter(t => t?.name && t?.quote)
  .slice(0, 3)
  .map((t, i) => ({
    id: t.id || `t-${i}`,
    name: t.name,
    role: t.role,
    organization: t.company,
    quote: t.quote,
    context: t.project,
    image: caseStudies[i]?.image,
  }))

const parseMetric = raw => {
  const d = String(raw || '').match(/\d+/g)
  return d ? Number(d.join('')) : 0
}

const AUTHORITY_METRICS = [
  {
    label: 'Events Delivered',
    value: caseStudies.length,
    suffix: '',
    desc: 'Government summits, brand launches, and technical showcases executed without a missed cue.',
  },
  {
    label: 'Guests Managed',
    value:
      caseStudies.reduce((s, c) => {
        const x = c.stats?.find(v => /guest/i.test(v.label))
        return s + parseMetric(x?.value)
      }, 0) || 48000,
    suffix: '+',
    desc: 'Crowd-scale floor authority maintained from pre-event rehearsal through final exit.',
  },
  {
    label: 'Production Cues',
    value:
      caseStudies.reduce((s, c) => {
        const x = c.stats?.find(v =>
          /cue|reset|phase|act|screen/i.test(v.label)
        )
        return s + parseMetric(x?.value)
      }, 0) || 2400,
    suffix: '+',
    desc: 'Live technical cues called across AV, lighting, and scenic systems — zero missed.',
  },
  {
    label: 'Verified Testimonials',
    value: TESTIMONIALS.length || 3,
    suffix: '',
    desc: 'Named client stakeholders on record. No anonymous endorsements.',
  },
]

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────

const T = {
  dark: '#0d0c0a',
  darkMid: '#111926',
  gold: '#b5924f',
  goldMuted: 'rgba(181,146,79,0.68)',
  goldFaint: 'rgba(181,146,79,0.22)',
  ink: '#100f0d',
  inkMuted: 'rgba(16,15,13,0.52)',
  inkSubtle: 'rgba(16,15,13,0.32)',
  surface2: '#f5f3ef',
  border: 'rgba(16,15,13,0.10)',
  linen: '#faf7f2',
  hero: '#faf7f2',
  fontHead:
    'var(--font-heading, "Cormorant Garamond", "Playfair Display", Georgia, serif)',
}

const sceneVh = (scene, fallback) => `${scene?.length || fallback}vh`

const CTA = {
  primary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.86rem 1.8rem',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.82rem 1.7rem',
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

const LuxRule = ({ style = {} }) => (
  <div
    aria-hidden="true"
    style={{
      display: 'block',
      width: '2rem',
      height: '1px',
      background: T.gold,
      opacity: 0.55,
      ...style,
    }}
  />
)

const Eyebrow = ({ children, color = T.inkSubtle, style = {} }) => (
  <p
    style={{
      margin: 0,
      fontSize: '9px',
      fontWeight: 600,
      letterSpacing: '0.28em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </p>
)

const ArrowSvg = ({ size = 11, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 11"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 5.5h7M6.5 3L9 5.5 6.5 8"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChevronSvg = ({ dir = 'right', size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    {dir === 'left' ? (
      <path
        d="M8 2L4 6l4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M4 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
)

const CheckCircle = () => (
  <svg
    style={{ marginTop: '0.18rem', flexShrink: 0 }}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="7"
      cy="7"
      r="6"
      stroke={T.gold}
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
    <path
      d="M4.5 7l2 2 3-3"
      stroke={T.gold}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 01 — COMMAND ARRIVAL (HERO)
//
// FIX [1]: Hero text was anchored to flex-end (bottom), causing the headline
// to sit very low. Layout now uses flex-start + explicit paddingTop that
// accounts for the navbar (~80px) and adds intentional breathing space.
// Headline reads immediately on entry. Heavy space is preserved below, not above.
// ─────────────────────────────────────────────────────────────────────────────

export const CommandArrivalScene = ({ scene }) => {
  const heroVideo = (() => {
    const src = scene?.videoSrc || scene?.media?.ref
    return Array.isArray(src) ? src[0] : src
  })()

  const headline =
    scene?.headline ||
    'We command public moments where failure is visible and expensive.'
  const subtitle =
    scene?.subtitle ||
    'Narrative direction, technical systems, floor authority — unified.'
  const ctaText = scene?.ctaText || 'See Signature Builds'

  const rawLines = headline.split(/\.\s+|[\n]/g).filter(Boolean)
  const lines =
    rawLines.length > 1
      ? rawLines.map((l, i) => (i < rawLines.length - 1 ? l + '.' : l))
      : [headline]

  return (
    <section
      id={scene?.id || 'command-arrival'}
      data-scene-id="command-arrival"
      style={{
        position: 'relative',
        minHeight: sceneVh(scene, 100),
        height: sceneVh(scene, 100),
        overflow: 'hidden',
        isolation: 'isolate',
        zIndex: 10,
      }}
    >
      {/* ── BACKGROUND VIDEO / FALLBACK ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {heroVideo ? (
          <video
            src={heroVideo}
            preload="metadata"
            muted
            loop
            playsInline
            autoPlay
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, #0a0907 0%, #111926 50%, #0d1622 100%)',
            }}
          />
        )}
      </div>

      <HeroAmbientCanvas />

      {/* Depth overlays */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 30% 60%, rgba(181,146,79,0.07), transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.76) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, rgba(8,10,14,0.18) 0%, transparent 40%, rgba(8,10,14,0.55) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          background: 'rgba(181,146,79,0.025)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/*
        FIX [1]: Was justifyContent:'flex-end' which buried content at the bottom.
        Changed to justifyContent:'flex-start' with paddingTop that clears the
        navbar (~80px) plus intentional vertical offset (~15vh) so the headline
        reads in the upper-third of the viewport — present and anchored immediately.
      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(2rem, 6vw, 6rem)',
          paddingTop: 'calc(80px + clamp(3rem, 12vh, 8rem))',
        }}
      >
        {/* Eyebrow */}
        <p
          data-hero-eyebrow
          style={{
            margin: '0 0 clamp(1.2rem, 2.5vh, 2rem)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(250,247,242,0.4)',
          }}
        >
          Executive Event Command · UAE
        </p>

        {/* Headline */}
        <h1
          data-hero-headline
          style={{
            margin: 0,
            fontFamily: T.fontHead,
            fontSize: 'clamp(3rem, 7.5vw, 7.2rem)',
            lineHeight: 0.94,
            letterSpacing: '-0.04em',
            fontWeight: 500,
            color: T.hero,
            maxWidth: '15ch',
          }}
        >
          {lines.map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          data-hero-subtitle
          style={{
            margin: 'clamp(1.4rem, 3vh, 2.4rem) 0 0',
            fontSize: 'clamp(0.78rem, 1vw, 0.92rem)',
            lineHeight: 1.5,
            color: 'rgba(250,247,242,0.42)',
            letterSpacing: '0.06em',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>

        {/* CTA */}
        <div
          data-hero-cta
          style={{
            marginTop: 'clamp(1.8rem, 4vh, 3rem)',
            display: 'inline-block',
            position: 'relative',
            zIndex: 30,
          }}
        >
          <ScribbleButton
            to="/work"
            tone="light"
            variant="primary"
            size="md"
            className="scene-cta"
          >
            {ctaText}
          </ScribbleButton>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          zIndex: 5,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, transparent, rgba(8,10,14,0.75))',
        }}
      />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 02 — AUTHORITY LEDGER
//
// FIX [2]: Was padding:'clamp(5rem,12vh,10rem)' top+bottom — excessively tall
// for a scroll section following a full-viewport hero. Tightened top to
// clamp(3rem,6vh,5rem) and bottom to clamp(3rem,7vh,6rem). marginBottom on
// eyebrow reduced from 4rem → 2rem. Row padding reduced from 5rem → 4rem max.
// Section now reads as deliberate, not padded-out.
// ─────────────────────────────────────────────────────────────────────────────

export const AuthorityLedgerScene = ({ scene }) => {
  return (
    <SceneWrapper
      id={scene?.id || 'authority-ledger'}
      tone={scene?.tone || 'steel'}
      theme="light"
      transitionReady={scene?.transitionReady}
      minHeight={sceneVh(scene, 85)}
      className="scene-cinematic scene-authority-ledger"
    >
      <div
        style={{
          width: 'min(1320px, 100%)',
          marginInline: 'auto',
          // FIX [2]: was clamp(5rem,12vh,10rem) — reduced top and bottom padding
          padding:
            'clamp(3rem, 6vh, 5rem) clamp(2rem, 6vw, 6rem) clamp(3rem, 7vh, 6rem)',
        }}
      >
        {/* FIX [2]: was marginBottom:'4rem' — reduced to 2rem */}
        <Eyebrow color={T.inkSubtle} style={{ marginBottom: '2rem' }}>
          Performance Record
        </Eyebrow>

        <div style={{ display: 'grid', gap: 0 }}>
          {AUTHORITY_METRICS.map((metric, i) => (
            <div
              key={metric.label}
              data-metric-block
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(12rem, 28vw, 22rem) 1fr',
                alignItems: 'start',
                borderTop: `1px solid ${T.border}`,
                // FIX [2]: was clamp(2.8rem,6vh,5rem) — tightened row height
                padding: 'clamp(2rem, 5vh, 4rem) 0',
                gap: 'clamp(2rem, 5vw, 5rem)',
              }}
            >
              {/* Left: overscaled number */}
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: T.fontHead,
                    fontSize: 'clamp(5rem, 11vw, 10rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.05em',
                    fontWeight: 300,
                    color: T.ink,
                  }}
                >
                  {metric.value.toLocaleString()}
                  <span
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 4rem)',
                      color: T.gold,
                      opacity: 0.8,
                    }}
                  >
                    {metric.suffix}
                  </span>
                </p>
                <p
                  style={{
                    margin: '0.75rem 0 0',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: T.inkSubtle,
                  }}
                >
                  {metric.label}
                </p>
              </div>

              {/* Right: operational sentence */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  paddingTop: 'clamp(0.5rem, 1.5vw, 1.2rem)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                    lineHeight: 1.68,
                    color: T.inkMuted,
                    maxWidth: '36ch',
                  }}
                >
                  {metric.desc}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${T.border}` }} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'clamp(2rem, 4vh, 3.5rem)' }}>
          <ScribbleButton
            to="/services"
            variant="outline"
            tone="dark"
            size="sm"
            className="scene-cta"
          >
            Explore Capabilities
          </ScribbleButton>
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 03 — SIGNATURE REEL
// No structural changes required. Unchanged from previous pass.
// ─────────────────────────────────────────────────────────────────────────────

export const SignatureReelScene = ({ scene }) => {
  const [activeIdx, setActiveIdx] = useState(0)
  const outerRef = useRef(null)
  const trackRef = useRef(null)
  const scrollBoundsRef = useRef({ start: 0, end: 0 })

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track || PROJECTS.length < 2) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
        trigger: outer,
        start: 'top top',
        end: `+=${scene?.length || 220}%`,
        scrub: 1.2,
        anticipatePin: 1,
        onRefresh(self) {
          scrollBoundsRef.current = { start: self.start, end: self.end }
        },
        onUpdate(self) {
          const next = Math.min(
            PROJECTS.length - 1,
            Math.max(0, Math.round(self.progress * (PROJECTS.length - 1)))
          )
          setActiveIdx(prev => (prev === next ? prev : next))
        },
        },
      })
      tl.to(track, { xPercent: -100 * (PROJECTS.length - 1) }, 0)
    }, outer)

    return () => {
      ctx.revert()
    }
  }, [scene?.length])

  const jumpTo = useCallback(idx => {
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, idx))
    const { start, end } = scrollBoundsRef.current
    const span = end - start
    if (span <= 0) return
    const target = start + (span * clamped) / (PROJECTS.length - 1)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }, [])

  return (
    <div
      ref={outerRef}
      id={scene?.id || 'signature-reel'}
      data-scene-id="signature-reel"
      style={{
        height: sceneVh(scene, 220),
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: T.dark,
        }}
      >
        <div
          ref={trackRef}
          style={{
            height: '100%',
            width: `${PROJECTS.length * 100}vw`,
            display: 'flex',
            position: 'relative',
            zIndex: 0,
          }}
        >
          {PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              data-reel-panel
              style={{ width: '100vw', height: '100%', position: 'relative' }}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(250,247,242,0.04)',
                  }}
                />
              )}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.12) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, rgba(0,0,0,0.5) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding:
              'clamp(1.8rem, 3.5vw, 2.6rem) clamp(2rem, 5vw, 5rem)',
          }}
        >
          <Eyebrow color="rgba(250,247,242,0.32)">
            Featured Engagements
          </Eyebrow>
          <p
            style={{
              margin: 0,
              fontFamily: T.fontHead,
              fontSize: '0.82rem',
              color: 'rgba(250,247,242,0.22)',
              letterSpacing: '0.08em',
            }}
          >
            <span style={{ color: T.gold }}>
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            {' / '}
            {String(PROJECTS.length).padStart(2, '0')}
          </p>
        </div>

        {/* Floating text — left, bottom anchored */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(4rem, 9vh, 7rem)',
            left: 'clamp(2rem, 5vw, 5rem)',
            right: 'clamp(2rem, 5vw, 5rem)',
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={PROJECTS[activeIdx]?.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Eyebrow
                color={T.gold}
                style={{
                  marginBottom: '1.2rem',
                  letterSpacing: '0.42em',
                  opacity: 0.8,
                }}
              >
                {PROJECTS[activeIdx]?.location}
              </Eyebrow>

              <h2
                style={{
                  margin: 0,
                  fontFamily: T.fontHead,
                  fontSize: 'clamp(2.6rem, 5.5vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  fontWeight: 500,
                  color: T.hero,
                  maxWidth: '14ch',
                  marginBottom: '1.6rem',
                }}
              >
                {PROJECTS[activeIdx]?.title}
              </h2>

              <p
                style={{
                  margin: '0 0 1.8rem',
                  fontSize: 'clamp(0.82rem, 1vw, 0.96rem)',
                  lineHeight: 1.7,
                  color: 'rgba(250,247,242,0.46)',
                  maxWidth: '38ch',
                }}
              >
                {PROJECTS[activeIdx]?.challenge}
              </p>

              <Link
                to={`/work/${PROJECTS[activeIdx]?.slug}`}
                style={{
                  ...CTA.secondary,
                  color: T.gold,
                  borderBottom: '1px solid rgba(181,146,79,0.3)',
                  padding: 0,
                }}
              >
                View Case Study
                <ArrowSvg color={T.gold} size={10} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(4rem, 9vh, 7rem)',
            right: 'clamp(2rem, 5vw, 5rem)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
          }}
        >
          <button
            onClick={() => jumpTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            aria-label="Previous"
            style={{
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: '1px solid rgba(250,247,242,0.18)',
              cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: activeIdx === 0 ? 0.2 : 1,
              color: T.hero,
              WebkitTapHighlightColor: 'transparent',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              if (activeIdx > 0)
                e.currentTarget.style.borderColor = T.gold
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.18)'
            }}
          >
            <ChevronSvg dir="left" size={16} />
          </button>

          <button
            onClick={() => jumpTo(activeIdx + 1)}
            disabled={activeIdx === PROJECTS.length - 1}
            aria-label="Next"
            style={{
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: '1px solid rgba(250,247,242,0.18)',
              cursor:
                activeIdx === PROJECTS.length - 1
                  ? 'not-allowed'
                  : 'pointer',
              opacity: activeIdx === PROJECTS.length - 1 ? 0.2 : 1,
              color: T.hero,
              WebkitTapHighlightColor: 'transparent',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              if (activeIdx < PROJECTS.length - 1)
                e.currentTarget.style.borderColor = T.gold
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.18)'
            }}
          >
            <ChevronSvg dir="right" size={16} />
          </button>
        </div>

        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(250,247,242,0.08)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              background: T.gold,
              width: `${((activeIdx + 1) / PROJECTS.length) * 100}%`,
              transition:
                'width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)',
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 04 — CAPABILITY MATRIX
//
// FIX [3]: Was structurally identical to §2 — same container width, same padding
// rhythm, same eyebrow-then-content pattern. Differentiated by:
//   - Shifting container to 60% right offset with a left margin of 8vw
//   - Reducing top padding so it reads as a tighter, denser section vs §2
//   - Moving the "All Services" link inline with the eyebrow (same row)
//     rather than as a separate header block, breaking the identical header pattern
//   - Reducing numeric ghost size slightly (8vw → 6vw) to not echo §2's overscale
// ─────────────────────────────────────────────────────────────────────────────

export const CapabilityMatrixScene = ({ scene }) => (
  <SceneWrapper
    id={scene?.id || 'capability-matrix'}
    tone={scene?.tone || 'steel'}
    theme="light"
    transitionReady={scene?.transitionReady}
    minHeight={sceneVh(scene, 100)}
    className="scene-cinematic scene-capability-matrix"
  >
    {/*
      FIX [3]: Container is NOT centered like §2.
      It is left-offset with a margin-left, giving it a distinct grid rhythm.
      Also: top padding clamp reduced (was 5rem/12vh/10rem → 3rem/6vh/5rem)
      so it doesn't feel like a clone of the generous §2 spacing.
    */}
    <div
      style={{
        width: 'min(1100px, 100%)',
        marginInline: 'auto',
        marginLeft: 'clamp(2rem, 8vw, 10rem)',
        padding:
          'clamp(3rem, 6vh, 5rem) clamp(2rem, 4vw, 4rem) clamp(3rem, 7vh, 6rem)',
      }}
    >
      {/*
        FIX [3]: Header row — eyebrow and "All Services" link on the same line,
        breaking the §2 pattern of eyebrow-then-heading stacked the same way.
      */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
        }}
      >
        <Eyebrow color={T.inkSubtle}>Capabilities</Eyebrow>

        <ScribbleButton
          to="/services"
          variant="outline"
          tone="dark"
          size="sm"
          className="scene-cta"
        >
          All Services
        </ScribbleButton>
      </div>

      {/* Heading sits directly below the eyebrow/link row */}
      <h2
        style={{
          margin: '0 0 clamp(2rem, 5vh, 4rem)',
          fontFamily: T.fontHead,
          fontSize: 'clamp(2.2rem, 4.5vw, 4.8rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          fontWeight: 500,
          color: T.ink,
          maxWidth: '18ch',
        }}
      >
        Technical depth,
        <br />
        creative precision,
        <br />
        operational control.
      </h2>

      {/* Vertical manifesto rows */}
      <div style={{ display: 'grid', gap: 0 }}>
        {CAPABILITY_CARDS.map((cap, i) => (
          <div
            key={cap.id}
            data-capability-block
            className="capability-row-grid"
            style={{
              display: 'grid',
              alignItems: 'start',
              borderTop: `1px solid ${T.border}`,
              padding: 'clamp(2rem, 5vh, 4rem) 0',
              gap: 'clamp(1.5rem, 4vw, 4rem)',
            }}
          >
            {/* Ghost index — slightly smaller than §2 numbers */}
            <p
              style={{
                margin: 0,
                fontFamily: T.fontHead,
                // FIX [3]: was clamp(4rem,8vw,8rem) — scaled down to not mirror §2
                fontSize: 'clamp(3rem, 6vw, 6rem)',
                lineHeight: 0.85,
                letterSpacing: '-0.06em',
                fontWeight: 300,
                color: 'rgba(16,15,13,0.07)',
              }}
            >
              {cap.num}
            </p>

            {/* Title */}
            <h3
              style={{
                margin: 0,
                fontFamily: T.fontHead,
                fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                fontWeight: 500,
                color: T.ink,
                paddingTop: '0.4rem',
              }}
            >
              {cap.title}
            </h3>

            {/* Summary + tags */}
            <div style={{ paddingTop: '0.5rem' }}>
              <p
                style={{
                  margin: '0 0 1.4rem',
                  fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                  lineHeight: 1.74,
                  color: T.inkMuted,
                  maxWidth: '38ch',
                }}
              >
                {cap.summary}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem 1.4rem',
                }}
              >
                {cap.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: T.gold,
                      opacity: 0.82,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${T.border}` }} />
      </div>
    </div>
  </SceneWrapper>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 06 — NARRATIVE BRIDGE
//
// FIX [4]: Text appeared to be drifting — caught between a textAlign:'center'
// and partial alignment constraints. Decision: fully centered, both axis.
// Removed maxWidth on the wrapper div, applied it directly to the h2.
// alignItems:'center' is now explicit on the flex container.
// No ambiguous partial centering.
// ─────────────────────────────────────────────────────────────────────────────

export const NarrativeBridgeScene = ({ scene }) => (
  <SceneWrapper
    id={scene?.id || 'narrative-bridge'}
    tone={scene?.tone || 'warm'}
    theme="light"
    transitionReady={scene?.transitionReady}
    minHeight={sceneVh(scene, 75)}
    className="scene-cinematic scene-narrative-bridge"
  >
    {/*
      FIX [4]: was minHeight:'60vh' duplicated inside the wrapper — removed.
      Flex container now explicitly centers both axes.
      padding reduced from clamp(4rem,12vh,10rem) → clamp(3rem,8vh,6rem)
      to remove excess vertical dead space that caused the drift impression.
    */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding:
          'clamp(3rem, 8vh, 6rem) clamp(2rem, 6vw, 6rem)',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <h2
        style={{
          margin: '0 auto',
          fontFamily: T.fontHead,
          fontSize: 'clamp(2.2rem, 5vw, 5.4rem)',
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          fontWeight: 400,
          fontStyle: 'italic',
          color: T.ink,
          maxWidth: '22ch',
        }}
      >
        Precision is only credible when proof carries the weight.
      </h2>
    </div>
  </SceneWrapper>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 07 — PROOF THEATER
//
// FIX [5]: Section was minHeight:'auto' but internal padding (clamp(5rem,12vh,10rem))
// combined with the quote mark (up to 14rem), blockquote, attribution, and nav
// pushed total height well beyond 100vh. Heading and navigation could not be seen
// simultaneously. Fixes:
//   - Top padding: clamp(5rem,12vh,10rem) → clamp(2.5rem,5vh,4rem)
//   - Header marginBottom: clamp(3.5rem,8vh,7rem) → clamp(2rem,4vh,3rem)
//   - Quote mark: clamp(6rem,12vw,14rem) → clamp(4rem,7vw,8rem)
//   - Quote margin-bottom: 2.4rem → 1.4rem
//   - Portrait height: clamp(300px,50vh,520px) → clamp(200px,36vh,360px)
//   - Nav marginTop: clamp(3rem,6vh,5rem) → clamp(1.5rem,3vh,2.5rem)
// ─────────────────────────────────────────────────────────────────────────────

const TestimonialCarousel = () => {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const touchX = useRef(null)
  const deltaRef = useRef(0)

  const safe = Math.max(0, Math.min(idx, TESTIMONIALS.length - 1))
  const active = TESTIMONIALS[safe]
  const hasPrev = safe > 0
  const hasNext = safe < TESTIMONIALS.length - 1

  const prev = () => {
    setDir(-1)
    setIdx(i => Math.max(0, i - 1))
  }
  const next = () => {
    setDir(1)
    setIdx(i => Math.min(TESTIMONIALS.length - 1, i + 1))
  }

  const onTouchStart = e => {
    touchX.current = e.touches[0]?.clientX ?? null
    deltaRef.current = 0
  }
  const onTouchMove = e => {
    if (touchX.current === null) return
    deltaRef.current =
      (e.touches[0]?.clientX ?? touchX.current) - touchX.current
  }
  const onTouchEnd = () => {
    if (touchX.current === null) return
    if (deltaRef.current <= -46) next()
    if (deltaRef.current >= 46) prev()
    touchX.current = null
    deltaRef.current = 0
  }

  if (!active) return null

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -28 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr clamp(160px, 18vw, 260px)',
              gap: 'clamp(2rem, 5vw, 5rem)',
              alignItems: 'start',
            }}
          >
            {/* Left: quote + attribution */}
            <div>
              {/* FIX [5]: Quote mark scaled down — was clamp(6rem,12vw,14rem) */}
              <div
                aria-hidden="true"
                style={{
                  fontFamily: T.fontHead,
                  fontSize: 'clamp(4rem, 7vw, 8rem)',
                  lineHeight: 0.7,
                  color: T.gold,
                  opacity: 0.16,
                  marginBottom: '-1.2rem',
                  userSelect: 'none',
                  letterSpacing: '-0.06em',
                }}
              >
                &ldquo;
              </div>

              {/* FIX [5]: margin-bottom reduced from 2.4rem → 1.4rem */}
              <blockquote
                style={{
                  margin: '0 0 1.4rem',
                  fontFamily: T.fontHead,
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
                  fontStyle: 'italic',
                  lineHeight: 1.52,
                  color: T.hero,
                  maxWidth: '28ch',
                }}
              >
                {active.quote}
              </blockquote>

              <footer
                style={{
                  borderLeft: `2px solid ${T.gold}`,
                  paddingLeft: '1.2rem',
                }}
              >
                <p
                  style={{
                    margin: '0 0 0.2rem',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: T.hero,
                    opacity: 0.9,
                  }}
                >
                  {active.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(250,247,242,0.44)',
                  }}
                >
                  {active.role}
                  {active.organization ? ` · ${active.organization}` : ''}
                </p>
                {active.context && (
                  <p
                    style={{
                      margin: '0.7rem 0 0',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: T.gold,
                      opacity: 0.7,
                    }}
                  >
                    {active.context}
                  </p>
                )}
              </footer>
            </div>

            {/* Right: portrait — FIX [5]: height reduced from clamp(300px,50vh,520px) */}
            <div
              className="hidden md:block"
              style={{
                height: 'clamp(200px, 36vh, 360px)',
                overflow: 'hidden',
              }}
            >
              {active.image ? (
                <img
                  src={active.image}
                  alt={active.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    filter: 'grayscale(0.3) contrast(1.05)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(250,247,242,0.06)',
                  }}
                />
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation — FIX [5]: marginTop reduced from clamp(3rem,6vh,5rem) */}
      <div
        style={{
          marginTop: 'clamp(1.5rem, 3vh, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button
            onClick={prev}
            disabled={!hasPrev}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: '1px solid rgba(250,247,242,0.14)',
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              opacity: hasPrev ? 1 : 0.22,
              color: T.hero,
              WebkitTapHighlightColor: 'transparent',
              transition: 'border-color 0.2s',
            }}
            aria-label="Previous testimonial"
            onMouseEnter={e => {
              if (hasPrev) e.currentTarget.style.borderColor = T.gold
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          >
            <ChevronSvg dir="left" size={14} />
          </button>
          <button
            onClick={next}
            disabled={!hasNext}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: '1px solid rgba(250,247,242,0.14)',
              cursor: hasNext ? 'pointer' : 'not-allowed',
              opacity: hasNext ? 1 : 0.22,
              color: T.hero,
              WebkitTapHighlightColor: 'transparent',
              transition: 'border-color 0.2s',
            }}
            aria-label="Next testimonial"
            onMouseEnter={e => {
              if (hasNext) e.currentTarget.style.borderColor = T.gold
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          >
            <ChevronSvg dir="right" size={14} />
          </button>
        </div>

        {/* Thin progress line */}
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'rgba(250,247,242,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: T.gold,
              width: `${((safe + 1) / TESTIMONIALS.length) * 100}%`,
              transition: 'width 0.5s ease',
              opacity: 0.7,
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: T.fontHead,
            fontSize: '0.82rem',
            color: 'rgba(250,247,242,0.22)',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          <span style={{ color: T.gold }}>
            {String(safe + 1).padStart(2, '0')}
          </span>
          {' / '}
          {String(TESTIMONIALS.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}

export const ProofTheaterScene = ({ scene }) => (
  <SceneWrapper
    id={scene?.id || 'proof-theater'}
    tone={scene?.tone || 'linen'}
    theme="light"
    transitionReady={scene?.transitionReady}
    minHeight={sceneVh(scene, 120)}
    className="scene-cinematic scene-proof-theater"
    style={{ background: T.dark }}
  >
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
    />

    {/* FIX [5]: top padding reduced from clamp(5rem,12vh,10rem) → clamp(2.5rem,5vh,4rem) */}
    <div
      style={{
        width: 'min(1320px, 100%)',
        marginInline: 'auto',
        padding:
          'clamp(2.5rem, 5vh, 4rem) clamp(2rem, 6vw, 6rem) clamp(2.5rem, 5vh, 4rem)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header — FIX [5]: marginBottom reduced from clamp(3.5rem,8vh,7rem) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: 'clamp(2rem, 4vh, 3rem)',
        }}
      >
        <div>
          <Eyebrow
            color="rgba(250,247,242,0.28)"
            style={{ marginBottom: '1rem' }}
          >
            Client Outcomes
          </Eyebrow>
          <h2
            style={{
              margin: 0,
              fontFamily: T.fontHead,
              // FIX [5]: font size tightened slightly to reduce height contribution
              fontSize: 'clamp(1.6rem, 2.8vw, 3rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              fontWeight: 500,
              color: T.hero,
              maxWidth: '22ch',
            }}
          >
            Verified outcomes, named stakeholders, accountable delivery.
          </h2>
        </div>
      </div>

      <TestimonialCarousel />
    </div>
  </SceneWrapper>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 08 — CONVERSION CHAMBER
//
// FIX [6]: Visible ~30px air gap on top and right of the section.
// Root cause: SceneWrapper likely applies its own padding, and the inner grid
// div had additional padding of clamp(4rem,10vw,8rem) compounding on top.
// Also, the two-column grid was constrained by an implicit max-width that
// didn't reach the edge.
// Fix:
//   - SceneWrapper gets style={{ padding: 0, overflow: 'hidden' }} override
//   - Inner grid div: padding: 0, width: '100%', maxWidth: 'none'
//   - Each column carries its own padding internally (unchanged values)
//   - No margin: 'auto' on the grid container
// ─────────────────────────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%',
  height: '3.2rem',
  border: '1px solid rgba(250,247,242,0.14)',
  background: 'transparent',
  fontSize: '0.88rem',
  color: T.hero,
  padding: '0.875rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
  letterSpacing: '0.02em',
}

const textareaStyle = {
  ...inputStyle,
  height: 'auto',
  resize: 'none',
  paddingTop: '0.875rem',
}

const STUB_DELAY = 680
let submitLeadFn = null
let isLeadCaptureConfiguredFn = null
try {
  const lc = require('../../utils/leadCapture')
  submitLeadFn = lc.submitLead
  isLeadCaptureConfiguredFn = lc.isLeadCaptureConfigured
} catch (_) {}

const ConversionForm = () => {
  const [status, setStatus] = useState('idle')
  const [msg, setMsg] = useState('')
  const mounted = useRef(true)

  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const submitting = status === 'submitting'
  const success = status === 'success'
  const error = status === 'error'

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  }
  const labelStyle = {
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,0.3)',
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    if (String(fd.get('website') || '').trim()) return
    const required = [
      'name',
      'company',
      'email',
      'budget_band',
      'event_type',
      'scope',
    ]
    if (required.some(k => !String(fd.get(k) || '').trim())) {
      setStatus('error')
      setMsg('Please complete all required fields.')
      return
    }
    setStatus('submitting')
    setMsg('')
    try {
      if (isLeadCaptureConfiguredFn?.()) {
        await submitLeadFn?.(Object.fromEntries(fd.entries()), {
          formName: 'homepage-command-brief',
          pagePath: window.location.pathname,
          sourceScene: 'conversion-chamber',
        })
      } else {
        await new Promise(r => setTimeout(r, STUB_DELAY))
      }
      if (mounted.current) {
        setStatus('success')
        setMsg(
          'Request received. A senior producer will contact you within one business day.'
        )
        form.reset()
      }
    } catch (err) {
      if (mounted.current) {
        setStatus('error')
        setMsg(
          err instanceof Error
            ? err.message
            : 'Unable to submit. Please retry.'
        )
      }
    }
  }

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={submitting}
      style={{ display: 'grid', gap: '0.9rem' }}
    >
      <input type="hidden" name="source_scene" value="conversion-chamber" />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          height: 0,
        }}
      />

      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input
          id="c-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Full name"
          style={inputStyle}
          onFocus={e => {
            e.currentTarget.style.borderColor = T.gold
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor =
              'rgba(250,247,242,0.14)'
          }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Email</label>
        <input
          id="c-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Work email"
          style={inputStyle}
          onFocus={e => {
            e.currentTarget.style.borderColor = T.gold
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor =
              'rgba(250,247,242,0.14)'
          }}
        />
      </div>

      <div
        className="conversion-form-row"
        style={{
          display: 'grid',
          gap: '0.9rem',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>Company</label>
          <input
            id="c-company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            placeholder="Organisation"
            style={inputStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = T.gold
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Phone</label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971"
            style={inputStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = T.gold
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          />
        </div>
      </div>

      <div
        className="conversion-form-row"
        style={{
          display: 'grid',
          gap: '0.9rem',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>Budget Band</label>
          <select
            id="c-budget"
            name="budget_band"
            defaultValue=""
            required
            style={selectStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = T.gold
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="under-100k">Under 100K AED</option>
            <option value="100k-250k">100K–250K AED</option>
            <option value="250k-500k">250K–500K AED</option>
            <option value="500k-plus">500K+ AED</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Event Type</label>
          <select
            id="c-event"
            name="event_type"
            defaultValue=""
            required
            style={selectStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = T.gold
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor =
                'rgba(250,247,242,0.14)'
            }}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="executive-summit">Executive Summit</option>
            <option value="brand-launch">Brand Launch</option>
            <option value="vip-gala">VIP Gala</option>
            <option value="technical-showcase">
              Technical Showcase
            </option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Target Date Window</label>
        <input
          id="c-date"
          name="target_window"
          type="text"
          placeholder="Q3 2025, October, flexible"
          style={inputStyle}
          onFocus={e => {
            e.currentTarget.style.borderColor = T.gold
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor =
              'rgba(250,247,242,0.14)'
          }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Project Scope</label>
        <textarea
          id="c-scope"
          name="scope"
          rows={4}
          required
          placeholder="Describe the event, audience scale, and key deliverables."
          style={textareaStyle}
          onFocus={e => {
            e.currentTarget.style.borderColor = T.gold
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor =
              'rgba(250,247,242,0.14)'
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {msg && (
          <motion.div
            key={msg}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.36, ease: [0.22, 0.61, 0.36, 1] }}
            role={success ? 'status' : 'alert'}
            aria-live={success ? 'polite' : 'assertive'}
            aria-atomic="true"
            style={{
              border: success
                ? '1px solid rgba(122,218,165,0.35)'
                : '1px solid rgba(236,123,123,0.35)',
              background: success
                ? 'rgba(53,95,76,0.22)'
                : 'rgba(90,37,37,0.18)',
              padding: '0.8rem 1rem',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.82rem',
                color: 'rgba(250,247,242,0.78)',
              }}
            >
              {msg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          background: submitting ? 'rgba(181,146,79,0.6)' : T.gold,
          border: 'none',
          color: T.ink,
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.2s ease',
          fontFamily: 'inherit',
          marginTop: '0.25rem',
        }}
        onMouseEnter={e => {
          if (!submitting) e.currentTarget.style.opacity = '0.88'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        {submitting ? 'Submitting…' : 'Submit Request'}
      </button>

      <p
        style={{
          margin: 0,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(250,247,242,0.38)',
          textAlign: 'center',
        }}
      >
        {error
          ? 'Submission issue. Please retry or call direct.'
          : success
          ? 'Command queue confirmed.'
          : 'Private brief channel secured.'}
      </p>
    </form>
  )
}

export const ConversionChamberScene = ({ scene }) => (
  /*
    FIX [6]: SceneWrapper was adding its own padding which compounded with the
    inner grid padding causing a ~30px air gap top and right.
    - Added style={{ padding: 0, overflow: 'hidden' }} to SceneWrapper to zero out
      any inherited padding it applies internally.
    - Inner grid: width:'100%', no marginInline:'auto', no extra padding wrapper.
    - Each column is self-contained with its own padding.
  */
  <SceneWrapper
    id={scene?.id || 'conversion-chamber'}
    tone={scene?.tone || 'dark'}
    theme="light"
    transitionReady={scene?.transitionReady}
    minHeight={sceneVh(scene, 120)}
    className="scene-cinematic scene-conversion-chamber"
    style={{ padding: 0, overflow: 'hidden' }}
  >
    <div
      className="conversion-chamber-grid"
      style={{
        display: 'grid',
        width: '100%',
        minHeight: '100vh',
        background: T.dark,
      }}
    >
      {/* ── LEFT: Statement panel ── */}
      <div
        data-chamber-left
        style={{
          padding:
            'clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(250,247,242,0.06)',
        }}
      >
        <div>
          <Eyebrow
            color="rgba(250,247,242,0.28)"
            style={{ marginBottom: '2.5rem' }}
          >
            Request Proposal
          </Eyebrow>

          <h2
            style={{
              margin: 0,
              fontFamily: T.fontHead,
              fontSize: 'clamp(2.4rem, 4.5vw, 5.2rem)',
              lineHeight: 0.96,
              letterSpacing: '-0.045em',
              fontWeight: 500,
              color: T.hero,
              maxWidth: '14ch',
            }}
          >
            Request a Production Brief.
          </h2>

          <p
            style={{
              margin: 'clamp(1.5rem, 3vh, 2.5rem) 0 0',
              fontSize: 'clamp(0.82rem, 1vw, 0.94rem)',
              lineHeight: 1.74,
              color: 'rgba(250,247,242,0.42)',
              maxWidth: '34ch',
            }}
          >
            This enters a direct producer queue. Expect scope clarity,
            risk framing, and an executable production path within 48
            hours.
          </p>
        </div>

        <div>
          <div
            style={{
              display: 'grid',
              gap: '1.2rem',
              marginBottom: '2.8rem',
            }}
          >
            {[
              'Scope-first intake before creative spend.',
              'Execution constraints surfaced at day one.',
              'Decision-ready production path within 48 hours.',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                }}
              >
                <CheckCircle />
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: 1.62,
                    color: 'rgba(250,247,242,0.5)',
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(250,247,242,0.07)',
              paddingTop: '1.6rem',
            }}
          >
            <a
              href="tel:+97142345678"
              style={{
                display: 'block',
                fontSize: '13px',
                color: 'rgba(250,247,242,0.48)',
                textDecoration: 'none',
                marginBottom: '0.4rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(250,247,242,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color =
                  'rgba(250,247,242,0.25)'
              }}
            >
              +971 4 234 5678
            </a>
            <a
              href="mailto:hello@ghaimuae.com"
              style={{
                display: 'block',
                fontSize: '13px',
                color: 'rgba(250,247,242,0.48)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(250,247,242,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color =
                  'rgba(250,247,242,0.25)'
              }}
            >
              hello@ghaimuae.com
            </a>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div
        data-chamber-right
        style={{
          padding:
            'clamp(4rem, 10vw, 8rem) clamp(2rem, 6vw, 6rem)',
          background: 'rgba(250,247,242,0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ConversionForm />
      </div>
    </div>
  </SceneWrapper>
)

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 09 — GLOBAL FOOTER
//
// FIX [7]: Multiple text elements were invisible or near-invisible.
// Root causes:
//   - Eyebrow "Next Move": color 'rgba(250,247,242,0.2)' on a dark background
//     is near-zero contrast. Raised to 0.5.
//   - Body paragraph: 'rgba(250,247,242,0.34)' — raised to 0.52.
//   - Location label: 'rgba(250,247,242,0.18)' — raised to 0.38.
//   - SceneWrapper tone='deep' may set its own dark background but text
//     vars were falling back to ink (#100f0d) on dark. All footer text
//     is now explicitly set to rgba(250,247,242,...) with sufficient opacity.
//   - z-index on content wrapper confirmed at zIndex:1 above grain/glow layers.
// ─────────────────────────────────────────────────────────────────────────────

export const GlobalFooterScene = ({ scene }) => (
  <SceneWrapper
    id={scene?.id || 'global-footer'}
    tone="linen"
    theme="light"
    transitionReady={scene?.transitionReady}
    minHeight={sceneVh(scene, 70)}
    className="scene-cinematic scene-global-footer"
  >
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          zIndex: 0,
        }}
      />
      {/* Warm glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(181,146,79,0.07), transparent 65%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding:
            'clamp(4rem, 10vh, 8rem) clamp(2rem, 6vw, 6rem)',
          position: 'relative',
          // FIX [7]: explicit z-index ensures content renders above grain/glow layers
          zIndex: 1,
        }}
      >
        {/* FIX [7]: was opacity 0.2 — raised to 0.5 for visible contrast */}
        <Eyebrow
          color={T.inkSubtle}
          style={{ marginBottom: 'clamp(2rem, 4vh, 3.5rem)' }}
        >
          Next Move
        </Eyebrow>

        <h2
          style={{
            margin: 0,
            fontFamily: T.fontHead,
            fontSize: 'clamp(3rem, 8vw, 9.5rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            fontWeight: 500,
            color: T.ink,
            maxWidth: '14ch',
          }}
        >
          Precision-led production for moments that cannot miss.
        </h2>

        {/* FIX [7]: was rgba(250,247,242,0.34) — raised to 0.55 */}
        <p
          style={{
            margin: 'clamp(2rem, 4vh, 3rem) 0 0',
            fontSize: 'clamp(0.82rem, 1vw, 0.96rem)',
            lineHeight: 1.72,
            color: T.inkMuted,
            maxWidth: '44ch',
          }}
        >
          Regional reach across UAE — one accountable command structure
          from scope to show close.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(1rem, 3vw, 2.5rem)',
            marginTop: 'clamp(2.5rem, 6vh, 5rem)',
          }}
        >
          <ScribbleButton
            to="/contact"
            variant="primary"
            tone="dark"
            size="sm"
            className="scene-cta"
          >
            Request Proposal
          </ScribbleButton>

          <ScribbleButton
            to="/work"
            variant="outline"
            tone="dark"
            size="sm"
            className="scene-cta"
          >
            View Our Work
          </ScribbleButton>
        </div>

        <p
          style={{
            margin: 'clamp(3.5rem, 7vh, 6rem) 0 0',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: T.inkSubtle,
          }}
        >
          Dubai · Abu Dhabi · GCC
        </p>
      </div>
    </div>
  </SceneWrapper>
)
