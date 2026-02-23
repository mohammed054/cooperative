/**
 * ScrollLockedSection — Minimal Sticky Architecture
 *
 * Single sticky container per section:
 *   <section class="panel" style="height: 200vh">
 *     <div class="sticky" style="height: 100svh">...</div>
 *   </section>
 *
 * CSS:
 *   .panel { position: relative; }
 *   .sticky { position: sticky; top: 0; height: 100svh; }
 *
 * scrollYProgress — live MotionValue (0 → 1):
 *   0 = panel top reaches viewport top (sticky begins)
 *   1 = panel bottom reaches viewport bottom (sticky releases)
 *
 * Children receive: (progress: MotionValue<number>, reduced: boolean)
 */

import { useRef } from 'react'
import { useScroll, useReducedMotion } from 'framer-motion'
import { ProgressProvider } from './ProgressContext.jsx'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

const ScrollLockedSection = ({
  id,
  children,
  className = '',
  tone = 'dark',
  height = '200vh',
  theme = 'light',
  transitionReady = false,
}) => {
  const panelRef = useRef(null)
  const prefersReduced = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start start', 'end end'],
  })

  const content =
    typeof children === 'function'
      ? children(scrollYProgress, prefersReduced)
      : children

  return (
    <section
      ref={panelRef}
      className={joinClasses(
        'panel',
        'flagship-scene',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ height }}
      data-scene-id={id}
      data-theme={theme}
      data-transition-ready={String(Boolean(transitionReady))}
    >
      <div className="sticky" id={id}>
        <div className="flagship-scene-content">
          <ProgressProvider progress={scrollYProgress} reduced={prefersReduced}>
            {content}
          </ProgressProvider>
        </div>
      </div>
    </section>
  )
}

export default ScrollLockedSection
