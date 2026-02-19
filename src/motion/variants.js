import { MOTION_DURATION, MOTION_EASE } from './tokens'

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.medium,
      ease: MOTION_EASE.authority,
    },
  },
}

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.medium,
      ease: MOTION_EASE.mass,
    },
  },
}

export const stagger = (delayChildren = 0.08, staggerChildren = 0.1) => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
})

export const maskReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
  show: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: MOTION_DURATION.dramatic,
      ease: MOTION_EASE.mass,
    },
  },
}
