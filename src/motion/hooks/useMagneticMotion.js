import { useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { MOTION_MAGNET } from '../tokens'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const useMagneticMotion = (config = {}) => {
  const radius = config.radius ?? MOTION_MAGNET.radius
  const maxOffset = config.maxOffset ?? MOTION_MAGNET.maxOffset
  const maxScale = config.maxScale ?? MOTION_MAGNET.maxScale
  const springConfig = config.spring ?? MOTION_MAGNET.spring

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawScale = useMotionValue(1)

  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)
  const scale = useSpring(rawScale, springConfig)

  const onPointerMove = useCallback(
    event => {
      const rect = event.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = event.clientX - centerX
      const dy = event.clientY - centerY
      const distance = Math.hypot(dx, dy)

      if (distance > radius) {
        rawX.set(0)
        rawY.set(0)
        rawScale.set(1)
        return
      }

      rawX.set(clamp(dx * 0.22, -maxOffset, maxOffset))
      rawY.set(clamp(dy * 0.22, -maxOffset, maxOffset))
      rawScale.set(maxScale)
    },
    [maxOffset, maxScale, radius, rawScale, rawX, rawY]
  )

  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
    rawScale.set(1)
  }, [rawScale, rawX, rawY])

  return {
    style: { x, y, scale },
    handlers: { onPointerMove, onPointerLeave },
  }
}

export default useMagneticMotion
