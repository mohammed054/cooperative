/**
 * cinematicVariants.js — MOBILE-FIRST MOTION REBUILD
 *
 * Single authoritative source for all homepage animation variants.
 * All variants use direct whileInView props — no parent/child propagation
 * that breaks on mobile Safari/Chrome.
 *
 * Rules:
 * - GPU only: transform + opacity + filter:blur (composited)
 * - No height, no layout properties
 * - Ease: cubic-bezier(.22,.61,.36,1) throughout
 * - viewport: { once: true, amount: 0.1 } — fires early on mobile
 */

/** Master easing — cubic-bezier(.22,.61,.36,1) */
export const CINE_EASE = [0.22, 0.61, 0.36, 1]

// ---------------------------------------------------------------------------
// TIMING
// ---------------------------------------------------------------------------

export const CINE_DURATION = Object.freeze({
  fast: 0.6,
  base: 0.8,
  major: 0.9,
  cinematic: 1.1,
  stagger: {
    headline: 0.12,
    card: 0.12,
    testimonial: 0.1,
    ui: 0.08,
  },
})

// ---------------------------------------------------------------------------
// VIEWPORT CONFIG — mobile-first (low threshold, fires early)
// ---------------------------------------------------------------------------

/** Standard viewport: fires when 10% of element is visible */
export const VIEWPORT = { once: true, amount: 0.1 }

/** Card viewport: fires even earlier for cards partially visible */
export const VIEWPORT_CARD = { once: true, amount: 0.05 }

// ---------------------------------------------------------------------------
// DIRECT whileInView PROPS (spread onto motion.div)
// These work on mobile — no variant propagation required.
// ---------------------------------------------------------------------------

/**
 * Standard entrance: opacity 0→1, y 40→0, blur 6→0, 0.8s
 * Spec: every section initial={opacity:0,y:40,filter:'blur(6px)'}
 */
export const enterFrom = (delay = 0, distance = 40) => ({
  initial: { opacity: 0, y: distance, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: VIEWPORT,
  transition: { duration: CINE_DURATION.base, ease: CINE_EASE, delay },
})

/**
 * Card entrance: y 60→0, scale 0.97→1, blur 6→0, stagger 0.12s
 */
export const cardEnter = (delay = 0) => ({
  initial: { opacity: 0, y: 60, scale: 0.97, filter: 'blur(6px)' },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  viewport: VIEWPORT_CARD,
  transition: { duration: CINE_DURATION.base, ease: CINE_EASE, delay },
})

/**
 * Mask reveal: clipPath wipe upward
 */
export const maskEnter = (delay = 0) => ({
  initial: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
  whileInView: { opacity: 1, clipPath: 'inset(0 0 0% 0 round 18px)' },
  viewport: VIEWPORT,
  transition: { duration: CINE_DURATION.base, ease: CINE_EASE, delay },
})

/**
 * Narrative text: scale 1.02→1 + opacity, y 20→0 — slow-motion feel
 */
export const narrativeEnter = {
  initial: { opacity: 0, y: 20, scale: 1.02 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: VIEWPORT,
  transition: { duration: CINE_DURATION.cinematic, ease: CINE_EASE },
}

/**
 * Testimonial: y 40→0, scale 0.95→1
 */
export const testimonialEnter = (delay = 0) => ({
  initial: { opacity: 0, y: 40, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: VIEWPORT,
  transition: { duration: CINE_DURATION.fast, ease: CINE_EASE, delay },
})

// ---------------------------------------------------------------------------
// HERO — animate() driven (not whileInView, fires on mount)
// ---------------------------------------------------------------------------

/**
 * Hero line: opacity 0→1, y 30→0, blur 8→0
 * Used with animate prop (not whileInView — hero is above fold)
 */
export const heroLine = (delay = 0) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: CINE_DURATION.major, ease: CINE_EASE, delay },
})

/**
 * Hero CTA: opacity 0→1, y 40→0, scale 0.96→1
 */
export const heroCta = (delay = 0) => ({
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: CINE_DURATION.major, ease: CINE_EASE, delay },
})

// ---------------------------------------------------------------------------
// FINAL CTA
// ---------------------------------------------------------------------------

/**
 * Final CTA button pulse: scale 1→1.015→1 every 4 seconds
 */
export const finalCtaPulse = {
  scale: [1, 1.015, 1],
  transition: {
    duration: 0.9,
    ease: CINE_EASE,
    repeat: Infinity,
    repeatDelay: 3.1,
  },
}

// ---------------------------------------------------------------------------
// LEGACY VARIANT API — for components that still use variants/hidden/visible
// Kept for backward compat with any downstream consumers.
// ---------------------------------------------------------------------------

export const sceneReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: CINE_DURATION.major, ease: CINE_EASE },
  },
}

export const cardRise = (delay = 0) => ({
  hidden: { opacity: 0, y: 60, scale: 0.97, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: CINE_DURATION.major, ease: CINE_EASE, delay },
  },
})

export const narrativeReveal = {
  hidden: { opacity: 0, scale: 1.02 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: CINE_DURATION.cinematic, ease: CINE_EASE },
  },
}

export const testimonialCard = (delay = 0) => ({
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: CINE_DURATION.fast, ease: CINE_EASE, delay },
  },
})

export const finalCtaSection = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: CINE_DURATION.cinematic, ease: CINE_EASE },
  },
}

export const lift = (delay = 0, distance = 20) => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: CINE_DURATION.major, ease: CINE_EASE, delay },
  },
})

export const maskReveal = (delay = 0) => ({
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0 round 18px)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0 round 18px)',
    transition: { duration: CINE_DURATION.major, ease: CINE_EASE, delay },
  },
})

export const staggerContainer = (delayChildren = 0, staggerChildren = CINE_DURATION.stagger.ui) => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
})
