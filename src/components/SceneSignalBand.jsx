import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SCENE_TONES = {
  light: {
    section:
      'bg-gradient-to-b from-[#f8f4ee] via-[#f3eee6] to-[#f0ebe3] text-ink',
    eyebrow: 'text-[#8d8d8d]',
    body: 'text-ink-muted',
    rail: 'bg-black/[0.08]',
    fill: 'bg-ink',
  },
  dark: {
    section:
      'bg-gradient-to-b from-[#111317] via-[#14171d] to-[#1a1f27] text-white',
    eyebrow: 'text-white/45',
    body: 'text-white/62',
    rail: 'bg-white/18',
    fill: 'bg-white/72',
  },
}

const SceneSignalBand = ({
  id,
  eyebrow = 'Narrative signal',
  title,
  description,
  tone = 'light',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const sceneTone = SCENE_TONES[tone] ?? SCENE_TONES.light

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const copyY = useTransform(scrollYProgress, [0, 1], [24, -18])
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.86], [0, 1, 0.76])
  const railScale = useTransform(scrollYProgress, [0.08, 0.7], [0, 1])

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative overflow-hidden ${sceneTone.section} ${className}`}
    >
      <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  y: copyY,
                  opacity: copyOpacity,
                }
          }
          className="max-w-3xl"
        >
          <p
            className={`text-[10px] font-medium uppercase tracking-[0.22em] ${sceneTone.eyebrow}`}
          >
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-[20ch] font-serif text-[clamp(1.7rem,5.6vw,3.2rem)] leading-[1.06] tracking-[-0.02em]">
            {title}
          </h2>
          <p className={`mt-4 max-w-[45ch] text-[15px] leading-relaxed ${sceneTone.body}`}>
            {description}
          </p>

          <div className={`mt-8 h-[2px] w-full max-w-sm overflow-hidden rounded-full ${sceneTone.rail}`}>
            <motion.div
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      scaleX: railScale,
                      transformOrigin: 'left center',
                    }
              }
              className={`h-full w-full ${sceneTone.fill}`}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SceneSignalBand
