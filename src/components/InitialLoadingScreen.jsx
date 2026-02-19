import React from 'react'
import { motion } from 'framer-motion'

const pulseTransition = {
  duration: 1.4,
  repeat: Infinity,
  ease: 'easeInOut',
}

const InitialLoadingScreen = ({ shouldReduceMotion = false }) => (
  <motion.div
    role="status"
    aria-live="polite"
    aria-label="Loading website"
    className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f8f4ee] via-[#f2ede4] to-[#ece6db]"
    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35 }}
  >
    <div className="pointer-events-none relative w-full max-w-sm px-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/55">Ghaim UAE</p>
      <h1
        className="mt-4 text-3xl text-[#171717] sm:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Crafting your event
      </h1>
      <div className="mx-auto mt-8 h-[3px] w-full overflow-hidden rounded-full bg-black/10">
        <motion.div
          className="h-full w-2/5 rounded-full bg-black/75"
          initial={shouldReduceMotion ? false : { x: '-110%' }}
          animate={shouldReduceMotion ? false : { x: '260%' }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <motion.p
        className="mt-5 text-sm text-black/60"
        animate={shouldReduceMotion ? false : { opacity: [0.55, 1, 0.55] }}
        transition={shouldReduceMotion ? { duration: 0 } : pulseTransition}
      >
        Loading experience...
      </motion.p>
    </div>
  </motion.div>
)

export default InitialLoadingScreen
