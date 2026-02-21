/**
 * ScrollLockedSection — STABILIZATION MODE
 *
 * Scroll-lock (GSAP pin) is temporarily disabled.
 * Sections render as natural flow with a static progress value.
 * Choreography will be restored in a later pass.
 *
 * Changes from original:
 * - No GSAP ScrollTrigger pinning
 * - No sticky positioning
 * - Progress is static at 0 (content renders in initial state)
 * - reduced is false so framer-motion scroll animations still work
 * - Sections scroll naturally, meeting the 100vh min-height requirement
 */

import React from 'react'
import { useMotionValue } from 'framer-motion'
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
  // Static progress — scroll lock disabled for stabilization
  const progress = useMotionValue(0)

  const content =
    typeof children === 'function'
      ? children(progress, false)
      : children

  return (
    <section
      id={id}
      data-scene-id={id}
      data-theme={theme}
      data-transition-ready={String(Boolean(transitionReady))}
      className={joinClasses(
        'flagship-scene',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ '--scene-min-height': '100vh', minHeight: '100vh' }}
    >
      {/* No sticky wrapper — sections scroll naturally in stabilization mode */}
      <div className="flagship-scene-content scene-transition-shell">
        <ProgressProvider progress={progress} reduced={false}>
          {content}
        </ProgressProvider>
      </div>
    </section>
  )
}

export default ScrollLockedSection