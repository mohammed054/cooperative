/**
 * ScrollLockedSection — CINEMATIC ENGINE RESTORED
 *
 * Architecture: scroll spacer outer div + CSS sticky inner pin + live Framer Motion progress.
 *
 * Outer div (ref = containerRef):
 *   height = scene.length  e.g. "220vh" for signature-reel
 *   class  = flagship-scene-locked  →  CSS: position: relative
 *   Creates the scroll duration. useScroll tracks this element.
 *
 * Inner div (flagship-lock-inner):
 *   CSS: position: sticky; top: 0; min-height: 100svh
 *   Pins the visible viewport while the outer spacer scrolls past.
 *
 * scrollYProgress — live MotionValue (0 → 1):
 *   0 = outer div top reaches viewport top   (scene fully entered, pin begins)
 *   1 = outer div bottom reaches viewport bottom  (pin releases, next scene takes over)
 *
 * Children receive: (progress: MotionValue<number>, reduced: boolean)
 * All internal scroll-linked animations derive from this single authoritative value.
 */

import React, { useRef } from 'react'
import { useScroll, useReducedMotion } from 'framer-motion'
import { ProgressProvider } from './ProgressContext.jsx'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const ScrollLockedSection = ({
  id,
  children,
  className = '',
  tone = 'dark',
  height = '100vh',
  theme = 'light',
  transitionReady = false,
}) => {
  // containerRef wraps the full scroll spacer (height = scene.length in vh).
  // useScroll measures: spacer-top-at-viewport-top → 0, spacer-bottom-at-viewport-bottom → 1
  const containerRef = useRef(null)
  const prefersReduced = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // scrollYProgress is a live MotionValue — updates continuously on every scroll frame.
  const content =
    typeof children === 'function'
      ? children(scrollYProgress, prefersReduced)
      : children

  return (
    // Scroll spacer: reserves the full scroll distance for this scene (e.g. 220vh)
    <div
      ref={containerRef}
      style={{ height }}
      className="flagship-scene-locked"
    >
      {/* Sticky pin: stays at viewport top while user scrolls through the spacer above */}
      <div
        className="flagship-lock-inner"
        style={{ padding: 0, alignItems: 'stretch' }}
      >
        <section
          id={id}
          data-scene-id={id}
          data-theme={theme}
          data-transition-ready={String(Boolean(transitionReady))}
          className={joinClasses(
            'flagship-scene',
            `flagship-scene-${tone}`,
            className,
          )}
          style={{
            height: '100svh',
            '--scene-min-height': '100svh',
            overflow: 'hidden',
          }}
        >
          <div
            className="flagship-scene-content scene-transition-shell"
            style={{ minHeight: '100svh' }}
          >
            <ProgressProvider progress={scrollYProgress} reduced={prefersReduced}>
              {content}
            </ProgressProvider>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ScrollLockedSection