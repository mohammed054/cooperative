export const MOTION_EASE = {
  authority: [0.23, 1, 0.32, 1],
  mass: [0.18, 0.9, 0.25, 1],
  release: [0.76, 0, 0.24, 1],
  micro: [0.2, 0.8, 0.2, 1],
  hover: [0.16, 1, 0.3, 1],
}

export const MOTION_DURATION = {
  fast: 0.24,
  medium: 0.6,
  dramatic: 1.3,
}

export const MOTION_MAGNET = {
  radius: 140,
  maxOffset: 8,
  maxScale: 1.03,
  spring: {
    stiffness: 170,
    damping: 20,
    mass: 0.4,
  },
}

export const MOTION_SCROLL_RANGE = {
  intro: [0, 0.2],
  reveal: [0.2, 0.75],
  release: [0.75, 1],
}
