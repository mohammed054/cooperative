import React from 'react'
import { motion } from 'framer-motion'

const pulseTransition = {
  duration: 1.6,
  repeat: Infinity,
  ease: 'easeInOut',
}

const InitialLoadingScreen = ({ shouldReduceMotion = false }) => (
  <motion.div
    role="status"
    aria-live="polite"
    aria-label="Loading website"
    className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden cinematic-gradient-light"
    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45 }}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_46%_at_18%_24%,rgba(255,255,255,0.66),rgba(255,255,255,0)_74%),radial-gradient(50%_38%_at_82%_70%,rgba(197,166,121,0.26),rgba(197,166,121,0)_78%)]"
    />
    <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

    <div className="pointer-events-none relative w-full max-w-md px-8 text-center">
      <p className="cinematic-eyebrow text-black/54">Ghaim UAE</p>
      <h1 className="mt-4 font-serif text-[clamp(2rem,4.2vw,3rem)] leading-[1.06] tracking-[-0.022em] text-[#161819]">
        Preparing your cinematic brief
      </h1>

      <div className="mx-auto mt-8 h-[4px] w-full overflow-hidden rounded-full bg-black/10">
        {/* Loader bar sweep gives a premium prelude before scene 01 starts. */}
        <motion.div
          className="h-full w-2/5 rounded-full bg-black/76"
          initial={shouldReduceMotion ? false : { x: '-115%' }}
          animate={shouldReduceMotion ? false : { x: '260%' }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 1.15, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </div>

      {/* Pulsing copy keeps perceived load active while staying calm and luxurious. */}
      <motion.p
        className="mt-5 text-sm text-black/62"
        animate={shouldReduceMotion ? false : { opacity: [0.56, 1, 0.56] }}
        transition={shouldReduceMotion ? { duration: 0 } : pulseTransition}
      >
        Loading scene direction...
      </motion.p>
    </div>
  </motion.div>
)

export default InitialLoadingScreen
