/**
 * MotionTokenContract
 * Single authoritative motion source for homepage animation timing, easing,
 * distances, blur behavior, and stagger cadence.
 */
export const MOTION_TOKEN_CONTRACT = Object.freeze({
  durations: Object.freeze({
    instant: 0,
    micro: 0.16,
    ui: 0.28,
    scene: 0.52,
    cinematic: 0.9,
    epic: 1.3,
  }),
  easing: Object.freeze({
    authority: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    mass: 'cubic-bezier(0.16, 1, 0.3, 1)',
    release: 'cubic-bezier(0.76, 0, 0.24, 1)',
  }),
  distances: Object.freeze({
    copy: 28,
    panel: 64,
    parallax: Object.freeze({
      atmosphere: 0.2,
      background: 0.45,
      midground: 0.7,
      content: 1,
      accent: 1.15,
    }),
  }),
  blur: Object.freeze({
    entry: 8,
    max: 10,
  }),
  stagger: Object.freeze({
    word: 0.035,
    line: 0.06,
    card: 0.09,
    panel: 0.13,
  }),
  scroll: Object.freeze({
    damping: 0.085,
    inertia: 1.08,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.15,
  }),
})

/**
 * Converts a cubic-bezier string into Framer Motion numeric tuple format.
 * @param {string} cubicBezier
 * @returns {[number, number, number, number]}
 */
export const parseBezier = cubicBezier => {
  const match = String(cubicBezier)
    .trim()
    .match(/^cubic-bezier\(([^)]+)\)$/)

  if (!match) {
    return [0.22, 0.61, 0.36, 1]
  }

  const parts = match[1]
    .split(',')
    .map(value => Number(value.trim()))
    .filter(value => Number.isFinite(value))

  if (parts.length !== 4) {
    return [0.22, 0.61, 0.36, 1]
  }

  return [parts[0], parts[1], parts[2], parts[3]]
}
