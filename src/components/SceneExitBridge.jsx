import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, stagger } from '../motion/variants'

const SceneExitBridge = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-label="Cinematic exit"
      className="relative overflow-hidden bg-[#101114]"
    >
      <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />

      <motion.div
        variants={stagger(0.06, 0.08)}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      >
        <motion.p
          variants={fadeUp}
          className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/38"
        >
          Cinematic exit
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="mt-4 max-w-4xl font-serif text-[clamp(1.8rem,3.8vw,3.2rem)] leading-[1.08] tracking-[-0.02em] text-white/95"
        >
          A composed room does not happen by chance. It is engineered.
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition-colors duration-300 hover:border-white/45 hover:text-white"
          >
            Start a confidential planning call
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default SceneExitBridge
