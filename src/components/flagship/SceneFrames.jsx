/**
 * SceneFrames.jsx — SCROLL ARCHITECTURE PRIMITIVES
 *
 * Two and only two wrappers. Every scene on the page must live in one of these.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FreeSceneFrame — for scenes that scroll normally (no pinning)
 * ─────────────────────────────────────────────────────────────────────────────
 *   • position: relative  — creates a stacking context without locking scroll
 *   • No overflow restriction — descendants can be as tall as they need
 *   • Use useScroll({ target: ref, offset: ['start end', 'end start'] }) inside
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PinnedSceneFrame — for scenes that stick while the user scrolls through them
 * ─────────────────────────────────────────────────────────────────────────────
 *   ARCHITECTURE RULES (all three must hold or sticky breaks):
 *   1. Outer section must have height > 100vh (e.g. 200vh, 300vh).
 *      This is the "scroll budget". useScroll maps 0→1 over this range.
 *   2. Inner div must be `position: sticky; top: 0; height: 100vh`.
 *      This is what the user sees pinned.
 *   3. NO ancestor may have overflow: hidden or overflow: auto.
 *      Those create new scroll containers and silently kill sticky.
 *
 *   Children receive: (scrollYProgress: MotionValue<0→1>)
 *   All scroll-linked animations inside must derive from this single value.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPORTANT — overflow rule for the whole page
 * ─────────────────────────────────────────────────────────────────────────────
 *   html, body must have:
 *     height: auto;
 *     overflow-x: clip;   ← NOT overflow-x: hidden (hidden creates scroll container)
 *
 *   Any wrapper that sets overflow: hidden breaks sticky for ALL descendants.
 *   Use overflow: clip when you need visual clipping without breaking sticky.
 */

import React, { useRef } from 'react'
import { useScroll, useReducedMotion } from 'framer-motion'

// ─── FreeSceneFrame ───────────────────────────────────────────────────────────

/**
 * FreeSceneFrame wraps a normal-flow scene section.
 *
 * Usage:
 *   <FreeSceneFrame>
 *     <YourContent />
 *   </FreeSceneFrame>
 *
 * For scroll-linked animations inside, create your own ref + useScroll:
 *   const ref = useRef(null)
 *   const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
 *   return <FreeSceneFrame><div ref={ref}>…</div></FreeSceneFrame>
 */
export function FreeSceneFrame({ children, id, style, className }) {
  return (
    <section
      id={id}
      className={className}
      style={{
        position: 'relative',
        padding: '120px 0',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

// ─── PinnedSceneFrame ─────────────────────────────────────────────────────────

/**
 * PinnedSceneFrame — sticky pinning with a live scroll progress MotionValue.
 *
 * @param {string}   height    — total scroll budget for this pin (default '200vh').
 *                               Must be > 100vh. More phases = taller height.
 * @param {function} children  — render prop receiving (scrollYProgress, reduced).
 *                               All scroll-linked transforms must derive from
 *                               scrollYProgress (a Framer MotionValue 0 → 1).
 *
 * Usage:
 *   <PinnedSceneFrame height="300vh">
 *     {(progress, reduced) => (
 *       <motion.div style={{ opacity: useTransform(progress, [0, 1], [1, 0]) }}>
 *         Fades as you scroll
 *       </motion.div>
 *     )}
 *   </PinnedSceneFrame>
 */
export function PinnedSceneFrame({ children, height = '200vh', id, style, className }) {
  // ref lives on the OUTER section — useScroll tracks when this enters/exits viewport
  const ref = useRef(null)
  const reduced = useReducedMotion() ?? false

  // offset ['start start', 'end end']:
  //   0 = outer section's top reaches viewport top  (pin begins)
  //   1 = outer section's bottom reaches viewport bottom  (pin releases)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const content =
    typeof children === 'function'
      ? children(scrollYProgress, reduced)
      : children

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{
        // SCROLL ARCHITECTURE: position:relative makes this the sticky-containing block.
        position: 'relative',
        // Height must exceed 100vh — this is the scroll budget.
        // The user scrolls (height - 100vh) worth of distance while content pins.
        height,
        // SCROLL ARCHITECTURE: NO overflow restriction here.
        // overflow:hidden on a sticky-containing block kills sticky.
        ...style,
      }}
    >
      {/* Sticky inner: what the user actually sees. Pinned at top while outer scrolls. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          // SCROLL ARCHITECTURE: overflow:hidden here is safe — the sticky element
          // is established above this div, so clipping content inside is fine.
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    </section>
  )
}

export default { FreeSceneFrame, PinnedSceneFrame }
