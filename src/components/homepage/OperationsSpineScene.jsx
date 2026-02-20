import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

// FIX: Breakpoint thresholds aligned between JS and CSS so pin behaviour and
// layout changes are consistent. Previously isMobile() used 760px in JS but
// the CSS disabled the rail at 480px — mismatched thresholds caused the rail
// to visually disappear while GSAP still calculated pin height for a two-column
// layout, producing extra whitespace that looked like duplication.
const MOBILE_BREAKPOINT = 760
const TINY_BREAKPOINT = 420 // below this skip GSAP pin entirely

const PhaseCard = React.memo(
  React.forwardRef(({ phase, isActive }, ref) => (
    <article
      ref={ref}
      aria-current={isActive ? 'step' : undefined}
      tabIndex={0}
      className={`osv2-card${isActive ? ' osv2-card--active' : ''}`}
      aria-label={`${phase.label}: ${phase.title}`}
    >
      <span className="osv2-card__num" aria-hidden="true">
        {phase.id}
      </span>

      <div className="osv2-card__inner">
        <div className="osv2-card__thumb" aria-hidden="true">
          <img
            src={phase.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="osv2-card__img"
          />
          {isActive ? <span className="osv2-card__shimmer" aria-hidden="true" /> : null}
        </div>

        <div className="osv2-card__text">
          <p className="osv2-card__eyebrow">{phase.label}</p>
          <h3 className="osv2-card__title">{phase.title}</h3>
          <p className="osv2-card__detail">{phase.detail}</p>
        </div>
      </div>

      <span className="osv2-card__dot" aria-hidden="true" style={{ opacity: isActive ? 1 : 0 }} />
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

    // FIX: On tiny screens (< TINY_BREAKPOINT) skip GSAP pin entirely.
    // Pinning on very small viewports causes GSAP's spacer to overflow the
    // layout, which manifests as visual duplication of the sticky element.
    // Show all phases statically instead.
    const isTinyScreen = window.matchMedia(`(max-width: ${TINY_BREAKPOINT}px)`).matches

    if (reducedMotion || isTinyScreen) {
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
    <>
      <style>{`
        .osv2-outer { position: relative; }

        .osv2-sticky {
          position: relative; width: 100%;
          min-height: 100vh; min-height: 100dvh;
          display: flex; align-items: center;
          overflow: hidden; isolation: isolate;
          background:
            radial-gradient(44% 38% at 80% 8%, rgba(141,161,190,0.13), transparent 72%),
            radial-gradient(36% 30% at 18% 82%, rgba(183,196,214,0.10), transparent 72%),
            linear-gradient(180deg, #ffffff 0%, #f6f7f9 52%, #eef1f6 100%);
        }

        /*
          FIX: GSAP pin spacer duplication fix.
          When GSAP pins .osv2-sticky it wraps it in a .pin-spacer div whose
          computed background inherits from the sticky element. On mobile this
          renders as a solid rectangle — visually identical to a second copy of
          the section. Force the spacer transparent on all sides and collapse any
          extra min-height it may inherit.
        */
        .osv2-outer > .pin-spacer {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          min-height: 0 !important;
        }

        .osv2-grain { position: absolute; inset: -8% -5%; pointer-events: none; z-index: 1; overflow: hidden; }
        .osv2-grain__back { position: absolute; inset: 0; opacity: 0.34; background: radial-gradient(46% 34% at 16% 22%, rgba(255,255,255,0.2), transparent 74%), radial-gradient(38% 28% at 84% 74%, rgba(167,194,236,0.16), transparent 76%); }
        .osv2-grain__lines { position: absolute; inset: 10% 6%; opacity: 0.12; mix-blend-mode: soft-light; background-image: repeating-linear-gradient(90deg, rgba(28,28,28,0.07) 0 1px, transparent 1px 30px); }

        .osv2-content { position: relative; z-index: 2; width: min(1260px, calc(100% - 2.4rem)); margin: 0 auto; padding-block: clamp(3.2rem, 8vh, 6.4rem); display: grid; gap: clamp(2.4rem, 5vw, 5rem); }
        @media (min-width: 960px) { .osv2-content { grid-template-columns: 0.86fr 1.14fr; align-items: center; } }

        .osv2-left { display: grid; gap: clamp(0.9rem, 2.2vh, 1.5rem); align-content: start; }
        @media (min-width: 960px) { .osv2-left { position: sticky; top: clamp(4rem, 12vh, 8rem); } }

        .osv2-eyebrow { margin: 0; font-size: 0.63rem; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 600; color: var(--color-ink-subtle, #8892a0); }
        .osv2-headline { margin: 0; font-family: var(--font-heading, 'Fraunces', serif); font-size: clamp(1.72rem, 3.6vw, 2.9rem); line-height: 1.04; letter-spacing: -0.03em; color: var(--color-ink, #1c1c1c); text-wrap: balance; }
        .osv2-body { margin: 0; font-size: clamp(0.88rem, 1.3vw, 1.05rem); line-height: 1.7; color: var(--color-ink-muted, #5c6470); max-width: 42ch; }

        .osv2-prog-wrap { display: flex; flex-direction: column; gap: 0.5rem; }
        .osv2-prog-track { width: min(260px, 100%); height: 3px; border-radius: 999px; background: rgba(28,28,28,0.1); overflow: hidden; }
        .osv2-prog-fill { height: 100%; width: 100%; border-radius: inherit; background: var(--color-ink, #1c1c1c); transform: scaleX(0); transform-origin: left center; will-change: transform; transition: transform 0.05s linear; }
        .osv2-prog-label { margin: 0; display: flex; align-items: baseline; gap: 0.28em; font-family: var(--font-heading, 'Fraunces', serif); font-size: 0.72rem; color: var(--color-ink-subtle, #8892a0); letter-spacing: 0.04em; user-select: none; }
        .osv2-prog-label__current { font-size: clamp(1.5rem, 2.8vw, 1.72rem); line-height: 1; color: var(--color-ink, #1c1c1c); letter-spacing: -0.03em; }
        .osv2-prog-label__sep { opacity: 0.35; font-size: 0.88rem; }

        .osv2-cta { padding-top: 0.5rem; will-change: opacity, transform; }
        .osv2-cta__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 999px; border: 1px solid rgba(28,28,28,0.22); background: transparent; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; color: var(--color-ink, #1c1c1c); cursor: pointer; text-decoration: none; transition: background 0.22s ease, border-color 0.22s ease, transform 0.18s ease; }
        .osv2-cta__btn:hover { background: rgba(28,28,28,0.06); border-color: rgba(28,28,28,0.4); transform: translateY(-1px); }
        .osv2-cta__btn:focus-visible { outline: 2px solid var(--color-ink, #1c1c1c); outline-offset: 3px; }
        .osv2-cta__arrow { display: inline-block; transition: transform 0.18s ease; }
        .osv2-cta__btn:hover .osv2-cta__arrow { transform: translateX(3px); }

        .osv2-right { position: relative; display: grid; grid-template-columns: 18px 1fr; gap: 0 clamp(0.8rem, 2vw, 1.5rem); align-items: stretch; }

        /* FIX: Hide rail column at 760px (matching the card-inner breakpoint)
           previously the rail disappeared at 480px via JS but stayed visible
           in CSS until 480px — now both align at 760px on mobile. */
        @media (max-width: 760px) {
          .osv2-right { grid-template-columns: 1fr; }
          .osv2-rail { display: none; }
        }

        .osv2-rail { position: relative; display: flex; flex-direction: column; align-items: center; padding-block: 4px; }
        .osv2-rail__track { position: absolute; inset: 0; width: 2px; margin-inline: auto; border-radius: 999px; background: rgba(28,28,28,0.10); }
        .osv2-rail__fill { position: absolute; top: 0; left: 50%; width: 3px; height: 100%; transform: translateX(-50%) scaleY(0); transform-origin: top center; border-radius: 999px; background: var(--color-ink, #1c1c1c); will-change: transform; }
        .osv2-rail__dots { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding-block: 4px; }
        .osv2-rail__dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(28,28,28,0.14); border: 1.5px solid white; transition: background 0.3s ease, transform 0.3s ease; flex-shrink: 0; }
        .osv2-rail__dot--active { background: var(--color-ink, #1c1c1c); transform: scale(1.3); }

        .osv2-cards { display: grid; gap: clamp(0.6rem, 1.4vh, 1rem); }

        .osv2-card {
          position: relative; will-change: opacity, transform;
          border: 1px solid rgba(28,28,28,0.10); border-radius: 1.15rem;
          background: var(--color-surface, #f6f7f9);
          padding: clamp(0.85rem, 2vh, 1.25rem) clamp(0.9rem, 2vw, 1.2rem);
          cursor: default; outline: none;
          transition:
            border-color 0.42s cubic-bezier(0.22,1,0.36,1),
            background-color 0.42s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.42s cubic-bezier(0.22,1,0.36,1),
            transform 0.42s cubic-bezier(0.22,1,0.36,1);
        }
        .osv2-card:focus-visible { outline: 2px solid var(--color-ink, #1c1c1c); outline-offset: 3px; }
        .osv2-card--active {
          border-color: rgba(28,28,28,0.26);
          background: var(--color-surface-2, #ffffff);
          box-shadow: 0 0 0 1px rgba(28,28,28,0.05), 0 14px 36px rgba(14,18,26,0.10), 0 2px 6px rgba(14,18,26,0.05);
          transform: scale(1.016) translateX(-2px);
        }
        /* FIX: Remove the inward translateX on mobile — it causes a 2px horizontal
           overflow that triggers a ghost scroll column on narrow viewports, and was
           previously only reset at 480px (too late for 760px-wide phones). */
        @media (max-width: 760px) {
          .osv2-card--active { transform: scale(1.012) translateX(0); }
        }
        @media (max-width: 480px) {
          .osv2-card--active { transform: scale(1) translateX(0); }
        }

        .osv2-card__num { display: block; font-family: var(--font-heading, 'Fraunces', serif); font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-ink-subtle, #8892a0); margin-bottom: clamp(0.4rem, 1vh, 0.72rem); transition: color 0.32s ease; }
        .osv2-card--active .osv2-card__num { color: var(--color-ink, #1c1c1c); }

        .osv2-card__inner { display: grid; gap: clamp(0.6rem, 1.5vw, 0.9rem); }
        @media (min-width: 480px) { .osv2-card__inner { grid-template-columns: clamp(68px, 11vw, 96px) 1fr; align-items: start; } }

        .osv2-card__thumb { position: relative; overflow: hidden; border-radius: 0.75rem; border: 1px solid rgba(28,28,28,0.08); aspect-ratio: 4/3; min-height: 56px; transition: border-color 0.32s ease; background: rgba(28,28,28,0.04); }
        @media (max-width: 760px) { .osv2-card__thumb { aspect-ratio: 16/5; max-height: 56px; } .osv2-card__inner { grid-template-columns: 1fr; } }
        .osv2-card--active .osv2-card__thumb { border-color: rgba(28,28,28,0.16); }
        .osv2-card__img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.76s cubic-bezier(0.22,1,0.36,1); }
        .osv2-card--active .osv2-card__img { transform: scale(1.06); }

        .osv2-card__shimmer { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(110deg, rgba(255,255,255,0) 28%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0) 72%); animation: osv2-shimmer 1.4s ease-in-out; }
        @keyframes osv2-shimmer { from { transform: translateX(-110%); } to { transform: translateX(210%); } }

        .osv2-card__text { display: grid; gap: 0.24rem; align-content: start; }
        .osv2-card__eyebrow { margin: 0; font-size: 0.57rem; letter-spacing: 0.17em; text-transform: uppercase; color: var(--color-ink-subtle, #8892a0); transition: color 0.28s ease; }
        .osv2-card--active .osv2-card__eyebrow { color: var(--color-ink, #1c1c1c); }
        .osv2-card__title { margin: clamp(0.22rem, 0.5vh, 0.36rem) 0 0; font-family: var(--font-heading, 'Fraunces', serif); font-size: clamp(0.96rem, 1.4vw, 1.12rem); line-height: 1.14; letter-spacing: -0.02em; color: var(--color-ink, #1c1c1c); }
        .osv2-card__detail { margin: clamp(0.2rem, 0.5vh, 0.32rem) 0 0; font-size: clamp(0.78rem, 1vw, 0.87rem); line-height: 1.64; color: var(--color-ink-muted, #5c6470); max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease; }
        .osv2-card--active .osv2-card__detail { max-height: 12rem; opacity: 1; }

        .osv2-card__dot { position: absolute; top: clamp(0.9rem, 2vh, 1.2rem); right: clamp(0.9rem, 2vw, 1.1rem); width: 6px; height: 6px; border-radius: 50%; background: var(--color-ink, #1c1c1c); transition: opacity 0.32s ease; }

        .osv2-sentinel { height: 0; overflow: hidden; pointer-events: none; }

        /* FIX: On tiny screens (≤ TINY_BREAKPOINT) the GSAP pin is skipped entirely.
           Show all cards in their final active-like state so the section is readable
           without any scroll interaction. */
        @media (max-width: 420px) {
          .osv2-card { opacity: 1 !important; transform: none !important; }
          .osv2-card__detail { max-height: 12rem !important; opacity: 1 !important; }
          .osv2-left { opacity: 1 !important; transform: none !important; }
          .osv2-cta { opacity: 1 !important; transform: none !important; }
          .osv2-sticky { align-items: flex-start; padding-top: clamp(5.2rem, 12vh, 7rem); }
          .osv2-rail__fill { transform: translateX(-50%) scaleY(1) !important; }
          .osv2-prog-fill { transform: scaleX(1) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .osv2-card, .osv2-card__img, .osv2-card__detail, .osv2-prog-fill, .osv2-rail__fill, .osv2-cta__btn { transition-duration: 0.01ms !important; animation: none !important; }
          .osv2-card { opacity: 1 !important; transform: none !important; }
          .osv2-card__detail { max-height: 12rem !important; opacity: 1 !important; }
          .osv2-card__shimmer { display: none; }
          .osv2-rail__fill { transform: translateX(-50%) scaleY(1) !important; }
          .osv2-prog-fill { transform: scaleX(1) !important; }
        }
      `}</style>

      <div
        ref={outerRef}
        id={scene?.id || 'operations-spine'}
        data-scene-id={scene?.id}
        data-theme="light"
        className="osv2-outer"
        aria-label="Delivery Framework - scroll to advance through phases"
      >
        <div ref={stickyRef} className="osv2-sticky">
          <div className="osv2-grain" aria-hidden="true">
            <span className="osv2-grain__back" />
            <span className="osv2-grain__lines" />
          </div>

          <div className="osv2-content">
            {/* ── Left: copy + progress ────────────────────────────────── */}
            <div ref={headerRef} className="osv2-left">
              <p className="osv2-eyebrow">Delivery Framework</p>

              <h2 className="osv2-headline">
                Process pressure
                <br />
                translated into
                <br />
                composure at showtime.
              </h2>

              <p className="osv2-body">
                Each phase locks before the next advances. Scroll through the command sequence.
              </p>

              <div className="osv2-prog-wrap">
                <div
                  role="progressbar"
                  aria-label="Delivery framework progression"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercent}
                  className="osv2-prog-track"
                >
                  <div
                    ref={progBarRef}
                    className="osv2-prog-fill"
                    style={
                      reducedMotion
                        ? { transform: `scaleX(${(displayIdx + 1) / PHASES.length})` }
                        : undefined
                    }
                  />
                </div>

                <p className="osv2-prog-label" aria-live="polite">
                  <span className="osv2-prog-label__current">{pad(displayIdx + 1)}</span>
                  <span className="osv2-prog-label__sep" aria-hidden="true">/</span>
                  <span>{pad(PHASES.length)}</span>
                </p>
              </div>

              <div ref={ctaRef} className="osv2-cta">
                <a
                  href="/process"
                  className="osv2-cta__btn"
                  title="View the full delivery process documentation"
                  aria-label="View full delivery process"
                >
                  View Full Process
                  <span className="osv2-cta__arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* ── Right: rail + cards ──────────────────────────────────── */}
            <div className="osv2-right">
              <div className="osv2-rail" aria-hidden="true">
                <div className="osv2-rail__track" />
                <div
                  ref={railFillRef}
                  className="osv2-rail__fill"
                  style={reducedMotion ? { transform: 'translateX(-50%) scaleY(1)' } : undefined}
                />
                <div className="osv2-rail__dots">
                  {PHASES.map((_, i) => (
                    <span
                      key={i}
                      className={`osv2-rail__dot${i <= displayIdx ? ' osv2-rail__dot--active' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div className="osv2-cards" role="list" aria-label="Delivery phases">
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
      </div>

      {/* Sentinel: tells the next scene to animate in on approach */}
      <div
        ref={sentinelRef}
        className="osv2-sentinel"
        aria-hidden="true"
        data-osv2-sentinel="true"
      />
    </>
  )
}

export default OperationsSpineScene
