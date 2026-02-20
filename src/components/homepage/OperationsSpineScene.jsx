import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScribbleButton from '../ScribbleButton'
import { assetUrl } from '../../lib/assetUrl'

const STEPS = [
  {
    id: '01',
    title: 'Executive Briefing',
    detail:
      'Scope, stakeholders, and decision constraints are locked before creative routing begins.',
    image: assetUrl('images/process-bg.jpg'),
    accent: 'Phase 01',
  },
  {
    id: '02',
    title: 'Systems Alignment',
    detail:
      'Production, venue, and technical teams align under one command structure.',
    image: assetUrl('images/event-planning.png'),
    accent: 'Phase 02',
  },
  {
    id: '03',
    title: 'Rehearsal Control',
    detail:
      'Cue integrity and fallback logic are validated under full run conditions.',
    image: assetUrl('images/event-planning-in-action.png'),
    accent: 'Phase 03',
  },
  {
    id: '04',
    title: 'Live Command',
    detail:
      'Floor leadership executes timing and transitions with protected authority.',
    image: assetUrl('images/full-production.png'),
    accent: 'Phase 04',
  },
]

const VH_PER_STEP = 1.0

const findNextSceneElement = sentinel => {
  if (!sentinel) return null

  let cursor = sentinel.nextElementSibling
  while (cursor) {
    if (cursor.matches?.('[data-scene-id]')) return cursor
    const nestedScene = cursor.querySelector?.('[data-scene-id]')
    if (nestedScene) return nestedScene
    cursor = cursor.nextElementSibling
  }

  return (
    document.getElementById('featured-engagements') ??
    document.getElementById('signature-reel') ??
    null
  )
}

const PhaseCard = React.forwardRef(({ step, active }, ref) => (
  <article
    ref={ref}
    aria-current={active ? 'step' : undefined}
    className={`ops-spine-card ${active ? 'ops-spine-card-active' : ''}`}
  >
    <div className="ops-spine-card-index" aria-hidden="true">
      {step.id}
    </div>

    <div className="ops-spine-card-body">
      <div className="ops-spine-card-thumb">
        <img
          src={step.image}
          alt={step.title}
          loading="lazy"
          decoding="async"
        />
        {active ? (
          <span className="ops-spine-card-shimmer" aria-hidden="true" />
        ) : null}
      </div>

      <div className="ops-spine-card-text">
        <p className="ops-spine-card-eyebrow">{step.accent}</p>
        <h3 className="ops-spine-card-title">{step.title}</h3>
        <p className="ops-spine-card-detail">{step.detail}</p>
      </div>
    </div>
  </article>
))
PhaseCard.displayName = 'PhaseCard'

export const OperationsSpineScene = ({ scene }) => {
  const outerRef = useRef(null)
  const stickyRef = useRef(null)
  const sentinelRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])
  const railFillRef = useRef(null)
  const progFillRef = useRef(null)
  const ctaWrapRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const reducedMotion = useReducedMotion()

  const setCardRef = useCallback(
    index => node => {
      cardRefs.current[index] = node
    },
    []
  )

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const outer = outerRef.current
    const sticky = stickyRef.current
    const header = headerRef.current
    const cards = cardRefs.current.filter(Boolean)
    const rail = railFillRef.current
    const prog = progFillRef.current
    const ctaWrap = ctaWrapRef.current

    if (!outer || !sticky || !header || !cards.length || !ctaWrap) return

    if (reducedMotion) {
      activeIndexRef.current = 0
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(outer, { zIndex: 2, position: 'relative' })
      gsap.set(header, { opacity: 0, y: 28 })
      gsap.set(cards, { opacity: 0, y: 44 })
      gsap.set(ctaWrap, { opacity: 0, y: 18 })
      if (rail) gsap.set(rail, { scaleY: 0, transformOrigin: 'top center' })
      if (prog) gsap.set(prog, { scaleX: 0, transformOrigin: 'left center' })

      const cardStepSize = 0.85 / STEPS.length

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'ops-spine-pin',
          trigger: outer,
          start: 'top top',
          end: () => {
            const isNarrow = window.matchMedia('(max-width: 760px)').matches
            const perStep = isNarrow ? VH_PER_STEP * 0.5 : VH_PER_STEP
            const totalScrollPx =
              window.innerHeight * (STEPS.length * perStep + 1)
            return `+=${totalScrollPx}`
          },
          pin: sticky,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const cardStart = 0.12
            const cardBudget = 0.85
            const cardProgress = Math.max(
              0,
              (self.progress - cardStart) / cardBudget
            )
            const nextIndex = Math.min(
              STEPS.length - 1,
              Math.floor(cardProgress * STEPS.length)
            )

            if (nextIndex !== activeIndexRef.current) {
              activeIndexRef.current = nextIndex
              setActiveIndex(nextIndex)
            }
          },
          onLeave: () => {
            gsap.set(outer, { zIndex: 'auto' })
          },
          onEnterBack: () => {
            gsap.set(outer, { zIndex: 2 })
          },
        },
      })

      timeline.to(
        header,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        0
      )

      if (rail) {
        timeline.to(
          rail,
          {
            scaleY: 1,
            duration: 0.88,
            ease: 'none',
          },
          0.1
        )
      }

      if (prog) {
        timeline.to(
          prog,
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power1.inOut',
          },
          0.08
        )
      }

      cards.forEach((card, index) => {
        const cardAt = 0.12 + index * cardStepSize
        timeline.to(
          card,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          cardAt
        )
      })

      timeline.to(
        ctaWrap,
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: 'power2.out',
        },
        0.89
      )

      ScrollTrigger.create({
        id: 'ops-spine-next',
        trigger: sentinelRef.current,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const nextEl = findNextSceneElement(sentinelRef.current)
          if (!nextEl) return

          const rect = nextEl.getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.9) return

          gsap.fromTo(
            nextEl,
            { y: 56, opacity: 0 },
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
      ctx.revert()
      ScrollTrigger.getById('ops-spine-pin')?.kill()
      ScrollTrigger.getById('ops-spine-next')?.kill()
    }
  }, [reducedMotion])

  const displayActiveIndex = reducedMotion ? 0 : activeIndex
  const railProgress = reducedMotion
    ? `${((displayActiveIndex + 1) / STEPS.length) * 100}%`
    : '100%'

  return (
    <>
      <div
        ref={outerRef}
        id={scene?.id || 'operations-spine'}
        className="ops-spine-outer"
        aria-label="Delivery Framework - scroll to advance through phases"
        data-scene-id={scene?.id}
        data-theme="light"
      >
        <div ref={stickyRef} className="ops-spine-sticky">
          <div className="ops-spine-ambient" aria-hidden="true">
            <span className="ops-spine-ambient-back" />
            <span className="ops-spine-ambient-mid" />
          </div>

          <div className="ops-spine-content">
            <div ref={headerRef} className="ops-spine-left">
              <p className="ops-spine-eyebrow">Delivery Framework</p>
              <h2 className="ops-spine-headline">
                Process pressure
                <br />
                translated into
                <br />
                composure at showtime.
              </h2>
              <p className="ops-spine-body">
                Each phase locks before the next advances. Scroll through the
                command sequence.
              </p>

              <div
                className="ops-spine-progress-track"
                role="progressbar"
                aria-label="Delivery framework progression"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(
                  ((displayActiveIndex + 1) / STEPS.length) * 100
                )}
              >
                <div
                  ref={progFillRef}
                  className="ops-spine-progress-fill"
                  style={
                    reducedMotion
                      ? {
                          transform: `scaleX(${
                            (displayActiveIndex + 1) / STEPS.length
                          })`,
                        }
                      : undefined
                  }
                />
              </div>

              <p className="ops-spine-counter" aria-live="polite">
                <span className="ops-spine-counter-active">
                  {String(displayActiveIndex + 1).padStart(2, '0')}
                </span>
                <span className="ops-spine-counter-sep" aria-hidden="true">
                  /
                </span>
                <span className="ops-spine-counter-total">
                  {String(STEPS.length).padStart(2, '0')}
                </span>
              </p>

              <div ref={ctaWrapRef} className="ops-spine-cta-wrap">
                <ScribbleButton
                  title="View the full delivery process documentation"
                  variant="outline"
                  tone="light"
                  size="sm"
                  to="/process"
                  analyticsLabel="operations-process-cta"
                >
                  View Full Process
                </ScribbleButton>
              </div>
            </div>

            <div className="ops-spine-right">
              <div className="ops-spine-rail" aria-hidden="true">
                <div className="ops-spine-rail-track" />
                <div
                  ref={railFillRef}
                  className="ops-spine-rail-fill"
                  style={
                    reducedMotion
                      ? {
                          transform: 'scaleY(1)',
                          height: railProgress,
                        }
                      : undefined
                  }
                />
              </div>

              <div className="ops-spine-cards">
                {STEPS.map((step, index) => (
                  <PhaseCard
                    key={step.id}
                    ref={setCardRef(index)}
                    step={step}
                    active={index === displayActiveIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ height: 0, pointerEvents: 'none', overflow: 'hidden' }}
        data-ops-sentinel="true"
      />
    </>
  )
}

export default OperationsSpineScene
