import { MOTION_TOKEN_CONTRACT, parseBezier } from './motionTokenContract.js'

export const FLAGSHIP_MOTION = {
  duration: {
    base: MOTION_TOKEN_CONTRACT.durations.scene,
    slow: MOTION_TOKEN_CONTRACT.durations.cinematic,
    overlay: MOTION_TOKEN_CONTRACT.durations.ui,
  },
  ease: parseBezier(MOTION_TOKEN_CONTRACT.easing.authority),
  fadeUp: {
    distance: MOTION_TOKEN_CONTRACT.distances.panel,
  },
  blur: {
    from: MOTION_TOKEN_CONTRACT.blur.entry,
    to: 0,
  },
  stagger: {
    card: MOTION_TOKEN_CONTRACT.stagger.card,
    word: MOTION_TOKEN_CONTRACT.stagger.word,
  },
  scroll: {
    damping: MOTION_TOKEN_CONTRACT.scroll.damping,
    inertia: MOTION_TOKEN_CONTRACT.scroll.inertia,
  },
}

export const createFadeUp = (delay = 0) => ({
  hidden: {
    opacity: 0,
    y: FLAGSHIP_MOTION.fadeUp.distance,
    filter: `blur(${FLAGSHIP_MOTION.blur.from}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: `blur(${FLAGSHIP_MOTION.blur.to}px)`,
    transition: {
      duration: FLAGSHIP_MOTION.duration.base,
      ease: FLAGSHIP_MOTION.ease,
      delay,
    },
  },
})

export const createCardStagger = (delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren: FLAGSHIP_MOTION.stagger.card,
    },
  },
})

export const createWordStagger = (delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren: FLAGSHIP_MOTION.stagger.word,
    },
  },
})
