import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SCENE_RANGES } from '../motion/ranges'

const SceneBridgeDusk = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Smoothly lifts the bridge copy upward so the transition feels directional.
  const copyY = useTransform(scrollYProgress, SCENE_RANGES.bridgeDusk.drift, [30, -36])
  // Controls reveal intensity to avoid abrupt jumps between light and dark scenes.
  const copyOpacity = useTransform(scrollYProgress, SCENE_RANGES.bridgeDusk.fade, [0.28, 1])
  // Tightens vignette density as the user approaches the dark narrative block.
  const vignetteOpacity = useTransform(scrollYProgress, [0.15, 1], [0.14, 0.52])

  return (
    <section
      ref={sectionRef}
      aria-label="Transition bridge"
      className="relative h-[140vh] overflow-hidden cinematic-gradient-dusk"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: vignetteOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_66%_at_50%_28%,rgba(255,255,255,0.14),rgba(255,255,255,0)_70%),linear-gradient(180deg,rgba(9,10,14,0.08)_0%,rgba(9,10,14,0.56)_100%)]"
      />

      <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-12">
          <motion.div
            style={shouldReduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
            className="max-w-[56ch]"
          >
            <p className="cinematic-eyebrow text-black/48">Transition bridge</p>
            <h2 className="mt-4 font-serif text-[clamp(1.85rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.03em] text-black/88">
              Discipline turns momentum into certainty.
            </h2>
            <p className="mt-5 max-w-[44ch] text-[clamp(0.94rem,1.45vw,1.12rem)] leading-[1.72] text-black/66">
              The room shifts from preparation to consequence. Every detail now
              has a measurable cost, so execution must become calm and exact.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SceneBridgeDusk
