/**
 * ScrollArchitectureTest.jsx
 *
 * STEP 6 — MINIMAL BASELINE VERIFICATION
 *
 * Use this scene to confirm the scroll architecture is working before
 * restoring cinematic logic. If this test does NOT animate:
 *   → your scroll container is still broken
 *   → check html/body for overflow:hidden (must be overflow:clip)
 *   → check for any ancestor with overflow:hidden above this component
 *   → check that the ref is attached to the section element
 *
 * HOW TO USE:
 *   Import into Home.jsx or any page and render at the top:
 *     import ScrollArchitectureTest from '../components/ScrollArchitectureTest'
 *     // In JSX: <ScrollArchitectureTest />
 *
 *   Expected behaviour:
 *     - "SCROLL ARCHITECTURE ✓" heading fades from opacity 1 → 0 as you scroll
 *     - Progress bar fills left-to-right as you scroll through the 200vh section
 *     - Console logs scrollYProgress values between 0 and 1
 *
 *   If heading never fades → architecture still broken.
 *   Remove this component once baseline is confirmed.
 */

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

export function ScrollArchitectureTest() {
  const ref = useRef(null)

  // STEP 6 SPEC: attach ref to section, track it against viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Opacity fades as user scrolls (progress 0→1 = opacity 1→0)
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -24])

  // Console verification — remove once confirmed working
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[ScrollArchitectureTest] scrollYProgress:', v.toFixed(3))
    }
  })

  return (
    // CRITICAL: ref on the section, height > 100vh
    <section
      ref={ref}
      style={{
        height: '200vh',
        position: 'relative',
        background: 'linear-gradient(180deg, #0f1218 0%, #1d2230 100%)',
      }}
    >
      {/* Sticky inner — what the user sees. Position:sticky on a div INSIDE
          the tall section. This is the correct pattern. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <motion.h1
          style={{
            opacity,
            y,
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            margin: 0,
          }}
        >
          SCROLL ARCHITECTURE ✓
        </motion.h1>

        <motion.p
          style={{
            opacity,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.9rem',
            margin: 0,
          }}
        >
          This text fades as you scroll. If it doesn&apos;t → check overflow on ancestors.
        </motion.p>

        {/* Progress bar — visual confirmation scrollYProgress is live */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'rgba(255,255,255,0.8)',
              transformOrigin: 'left center',
              scaleX,
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default ScrollArchitectureTest
