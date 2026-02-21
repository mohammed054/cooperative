import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION_TOKEN_CONTRACT, parseBezier } from '../../motion/motionTokenContract.js'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')
const AUTHORITY_EASE = parseBezier(MOTION_TOKEN_CONTRACT.easing.authority)

const SceneWrapper = ({
  id,
  children,
  className = '',
  minHeight = '100vh',
  tone = 'light',
  theme = 'light',
  transitionReady = false,
  style,
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id={id}
      data-scene-id={id}
      data-theme={theme}
      data-transition-ready={String(Boolean(transitionReady))}
      className={joinClasses(
        'flagship-scene',
        `flagship-scene-${tone}`,
        className
      )}
      style={{ '--scene-min-height': minHeight, ...style }}
    >
      <motion.div
        className="flagship-scene-content scene-transition-shell"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{
          duration: MOTION_TOKEN_CONTRACT.durations.scene + 0.08,
          ease: AUTHORITY_EASE,
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}

export default SceneWrapper
