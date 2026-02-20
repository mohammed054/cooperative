import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './OperationsSpineScene.module.css'

const assetUrl =
  typeof window !== 'undefined' && window.__assetUrl
    ? window.__assetUrl
    : path => `/${path}`

const PHASES = [
  {
    id: '01',
    label: 'Phase 01',
    title: 'Executive Briefing',
    detail:
      'Scope, stakeholders, and decision constraints are locked before creative routing begins. Every dependency is named. Every risk surface is documented.',
    image: assetUrl('images/process-bg.jpg'),
  },
  {
    id: '02',
    label: 'Phase 02',
    title: 'Systems Alignment',
    detail:
      'Production, venue, and technical teams align under one command structure. Communication channels are fixed; escalation paths are clear.',
    image: assetUrl('images/event-planning.png'),
  },
  {
    id: '03',
    label: 'Phase 03',
    title: 'Rehearsal Control',
    detail:
      'Cue integrity and fallback logic are validated under full run conditions. The show runs twice before it runs once in public.',
    image: assetUrl('images/event-planning-in-action.png'),
  },
  {
    id: '04',
    label: 'Phase 04',
    title: 'Live Command',
    detail:
      'Floor leadership executes timing and transitions with protected authority. No improvisation. Every contingency has already been choreographed.',
    image: assetUrl('images/full-production.png'),
  },
]

const VH_PER_PHASE = 0.9
const pad = n => String(n).padStart(2, '0')

// FIX: Breakpoint aligned between JS and CSS so pin behaviour and layout
// changes are consistent. Mobile (< 768px) skips GSAP ScrollTrigger entirely
// for stability; desktop retains full scroll-driven animations.
const MOBILE_BREAKPOINT = 768

const PhaseCard = React.memo(
  React.forwardRef(({ phase, isActive }, ref) => (
    <article
      ref={ref}
      aria-current={isActive ? 'step' : undefined}
      tabIndex={0}
      className={`${styles.osv2Card}${isActive ? ` ${styles.osv2CardActive}` : ''}`}
      aria-label={`${phase.label}: ${phase.title}`}
    >
      <span className={styles.osv2CardNum} aria-hidden="true">
        {phase.id}
      </span>

      <div className={styles.osv2CardInner}>
        <div className={styles.osv2CardThumb} aria-hidden="true">
          <img
            src={phase.image}
            alt=""
            loading="lazy"
            decoding="async"
            className={styles.osv2CardImg}
          />
          {isActive ? <span className={styles.osv2CardShimmer} aria-hidden="true" /> : null}
        </div>

        <div className={styles.osv2CardText}>
          <p className={styles.osv2CardEyebrow}>{phase.label}</p>
          <h3 className={styles.osv2CardTitle}>{phase.title}</h3>
          <p className={styles.osv2CardDetail}>{phase.detail}</p>
        </div>
      </div>

      <span className={styles.osv2CardDot} aria-hidden="true" style={{ opacity: isActive ? 1 : 0 }} />
    </article>
  ))
)
PhaseCard.displayName = 'PhaseCard'

export const OperationsSpineScene = ({ scene }) => {
  const outerRef = useRef(null)
  const stickyRef = useRef(null)
  const sentinelRef = useRef(null)
  const headerRef = useRef(null)
  const ctaRef = useRef(null)
  const railFillRef = useRef(null)
  const progBarRef = useRef(null)
  const cardRefs = useRef([])

  const [activeIdx, setActiveIdx] = useState(0)
  const activeIdxRef = useRef(0)
  const reducedMotion = useReducedMotion()

  const setCardRef = useCallback(i => node => {
    cardRefs.current[i] = node
  }, [])

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const outer = outerRef.current
    const sticky = stickyRef.current
    const header = headerRef.current
    const cta = ctaRef.current
    const railFill = railFillRef.current
    const progBar = progBarRef.current
    const cards = cardRefs.current.filter(Boolean)

    if (!outer || !sticky || !header || !cards.length) return undefined

    // Dev StrictMode/HMR hardening: remove stale triggers tied to this instance
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === outer || trigger.pin === sticky) {
        trigger.kill()
      }
    })

    // FIX: On mobile screens (< 768px) skip GSAP ScrollTrigger entirely.
    // Pinning and complex transforms on mobile cause layout instability,
    // spacer overflow, and visual duplication. Show all phases stacked statically.
    const isMobile = window.innerWidth < 768

    if (reducedMotion || isMobile) {
      gsap.set(header, { opacity: 1, y: 0 })
      gsap.set(cards, { opacity: 1, y: 0 })
      if (cta) gsap.set(cta, { opacity: 1, y: 0 })
      if (railFill) gsap.set(railFill, { scaleY: 1 })
      if (progBar) gsap.set(progBar, { scaleX: 1 })
      const finalIdx = PHASES.length - 1
      activeIdxRef.current = finalIdx
      const rafId = window.requestAnimationFrame(() => setActiveIdx(finalIdx))
      return () => window.cancelAnimationFrame(rafId)
    }

    let pinTrigger
    let sentinelTrigger

    const ctx = gsap.context(() => {
      // ── Initial states ────────────────────────────────────────────────
      gsap.set(outer, { position: 'relative', zIndex: 2 })
      gsap.set(header, { opacity: 0, y: 36 })
      if (cta) gsap.set(cta, { opacity: 0, y: 20 })
      if (railFill) gsap.set(railFill, { scaleY: 0, transformOrigin: 'top center' })
      if (progBar) gsap.set(progBar, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(cards, { opacity: 0, y: 52 })

      // FIX: isMobile now uses MOBILE_BREAKPOINT (760) to stay in sync with the
      // CSS breakpoint where the card inner collapses to a single column. The old
      // value (760 in CSS, also 760 in JS but via a magic number inline) was fine
      // but is now a named constant so both sides stay in sync if it changes.
      const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
      const cardBudget = 0.76
      const cardStart = 0.1
      const stepSize = cardBudget / PHASES.length

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: () => {
            const perStep = isMobile() ? VH_PER_PHASE * 0.6 : VH_PER_PHASE
            return `+=${window.innerHeight * (PHASES.length * perStep + 1.2)}`
          },
          pin: sticky,
          pinSpacing: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onUpdate(self) {
            const cp = Math.max(0, (self.progress - cardStart) / cardBudget)
            const next = Math.min(PHASES.length - 1, Math.floor(cp * PHASES.length))
            if (next !== activeIdxRef.current) {
              activeIdxRef.current = next
              setActiveIdx(next)
            }
          },

          onLeave() {
            gsap.set(outer, { zIndex: 'auto' })
          },

          onEnterBack() {
            gsap.set(outer, { zIndex: 2 })
          },

          onRefresh(self) {
            // FIX: Force the GSAP pin spacer fully transparent on every refresh.
            // On mobile browsers the spacer can inherit the sticky element's
            // computed background and render as a grey/white rectangle — which
            // looks exactly like a second copy of the section (duplication bug).
            if (self.spacer) {
              self.spacer.style.cssText +=
                ';background:transparent!important;background-color:transparent!important;background-image:none!important;'
              // FIX: Also reset any inherited min-height that can push the spacer
              // below the pin area and create an empty ghost section on mobile.
              self.spacer.style.minHeight = ''
            }
          },
        },
      })
      pinTrigger = tl.scrollTrigger

      // Header enters
      tl.to(header, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0)

      // Rail grows
      if (railFill) tl.to(railFill, { scaleY: 1, duration: 0.86, ease: 'none' }, 0.06)

      // Progress bar grows
      if (progBar) tl.to(progBar, { scaleX: 1, duration: 0.86, ease: 'power1.inOut' }, 0.06)

      // Cards stagger in sequentially
      cards.forEach((card, i) => {
        const at = cardStart + i * stepSize
        tl.to(card, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, at)
      })

      // CTA enters near end
      if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.26, ease: 'power2.out' }, 0.88)

      tl.call(() => {
        gsap.set(header, { clearProps: 'willChange' })
        gsap.set(cards, { clearProps: 'willChange' })
        if (cta) gsap.set(cta, { clearProps: 'willChange' })
      }, [], 1)

      // ── Sentinel: prime the next scene's entry animation ─────────────
      sentinelTrigger = ScrollTrigger.create({
        trigger: sentinelRef.current,
        start: 'top 92%',
        once: true,
        onEnter() {
          let cursor = sentinelRef.current?.nextElementSibling
          while (cursor) {
            if (cursor.matches?.('[data-scene-id]')) break
            const nested = cursor.querySelector?.('[data-scene-id]')
            if (nested) {
              cursor = nested
              break
            }
            cursor = cursor.nextElementSibling
          }
          if (!cursor) return

          const rect = cursor.getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.95) return

          gsap.fromTo(
            cursor,
            { y: 72, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.92,
              ease: 'power3.out',
              clearProps: 'y,opacity',
            }
          )
        },
      })
    }, outer)

    return () => {
      pinTrigger?.kill()
      sentinelTrigger?.kill()
      ctx.revert()
    }
  }, [reducedMotion])

  const displayIdx = reducedMotion ? PHASES.length - 1 : activeIdx
  const progressPercent = Math.round(((displayIdx + 1) / PHASES.length) * 100)

  return (
    <div
      ref={outerRef}
      id={scene?.id || 'operations-spine'}
      data-scene-id={scene?.id}
      data-theme="light"
      className={styles.osv2Outer}
      aria-label="Delivery Framework - scroll to advance through phases"
    >
      <div ref={stickyRef} className={styles.osv2Sticky}>
        <div className={styles.osv2Grain} aria-hidden="true">
          <span className={styles.osv2GrainBack} />
          <span className={styles.osv2GrainLines} />
        </div>

        <div className={styles.osv2Content}>
          {/* ── Left: copy + progress ────────────────────────────────── */}
          <div ref={headerRef} className={styles.osv2Left}>
            <p className={styles.osv2Eyebrow}>Delivery Framework</p>

            <h2 className={styles.osv2Headline}>
              Process pressure
              <br />
              translated into
              <br />
              composure at showtime.
            </h2>

            <p className={styles.osv2Body}>
              Each phase locks before the next advances. Scroll through the command sequence.
            </p>

            <div className={styles.osv2ProgWrap}>
              <div
                role="progressbar"
                aria-label="Delivery framework progression"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                className={styles.osv2ProgTrack}
              >
                <div
                  ref={progBarRef}
                  className={styles.osv2ProgFill}
                  style={
                    reducedMotion
                      ? { transform: `scaleX(${(displayIdx + 1) / PHASES.length})` }
                      : undefined
                  }
                />
              </div>

              <p className={styles.osv2ProgLabel} aria-live="polite">
                <span className={styles.osv2ProgLabelCurrent}>{pad(displayIdx + 1)}</span>
                <span className={styles.osv2ProgLabelSep} aria-hidden="true">/</span>
                <span>{pad(PHASES.length)}</span>
              </p>
            </div>

            <div ref={ctaRef} className={styles.osv2Cta}>
              <a
                href="/process"
                className={styles.osv2CtaBtn}
                title="View the full delivery process documentation"
                aria-label="View full delivery process"
              >
                View Full Process
                <span className={styles.osv2CtaArrow} aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* ── Right: rail + cards ──────────────────────────────────── */}
          <div className={styles.osv2Right}>
            <div className={styles.osv2Rail} aria-hidden="true">
              <div className={styles.osv2RailTrack} />
              <div
                ref={railFillRef}
                className={styles.osv2RailFill}
                style={reducedMotion ? { transform: 'translateX(-50%) scaleY(1)' } : undefined}
              />
              <div className={styles.osv2RailDots}>
                {PHASES.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.osv2RailDot}${i <= displayIdx ? ` ${styles.osv2RailDotActive}` : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.osv2Cards} role="list" aria-label="Delivery phases">
              {PHASES.map((phase, i) => (
                <PhaseCard
                  key={phase.id}
                  ref={setCardRef(i)}
                  phase={phase}
                  isActive={i === displayIdx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel: tells the next scene to animate in on approach */}
      <div
        ref={sentinelRef}
        className={styles.osv2Sentinel}
        aria-hidden="true"
        data-osv2-sentinel="true"
      />
    </div>
  )
}

export default OperationsSpineScene