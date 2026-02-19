import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FLAGSHIP_MOTION } from '../../motion/flagshipTokens'

const MediaReveal = ({
  children,
  className = '',
  delay = 0,
  amount = 0.35,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: FLAGSHIP_MOTION.fadeUp.distance,
              filter: `blur(${FLAGSHIP_MOTION.blur.from}px)`,
              clipPath: 'inset(0 0 18% 0 round 18px)',
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        filter: `blur(${FLAGSHIP_MOTION.blur.to}px)`,
        clipPath: 'inset(0 0 0% 0 round 18px)',
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: FLAGSHIP_MOTION.duration.slow,
        ease: FLAGSHIP_MOTION.ease,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default MediaReveal
