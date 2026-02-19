import React, { createElement } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FLAGSHIP_MOTION, createWordStagger } from '../../motion/flagshipTokens'

const splitIntoWords = text => String(text).split(/\s+/).filter(Boolean)

const MotionText = ({
  as = 'h2',
  text,
  className = '',
  containerClassName = '',
  delay = 0,
  wordClassName = '',
  amount = 0.45,
}) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return createElement(as, { className }, text)
  }

  const words = splitIntoWords(text)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={createWordStagger(delay)}
      className={containerClassName}
    >
      {createElement(
        as,
        { className },
        words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={{
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
                },
              },
            }}
            className={`flagship-motion-word ${wordClassName}`.trim()}
          >
            {word}
          </motion.span>
        ))
      )}
    </motion.div>
  )
}

export default MotionText
