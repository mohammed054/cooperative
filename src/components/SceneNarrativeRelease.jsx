import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SceneNarrativeRelease = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Fades copy in during the release moment to maintain emotional continuity.
  const copyOpacity = useTransform(scrollYProgress, [0.04, 0.22, 1], [0, 1, 1])
  // Lifts copy slightly as darkness releases into lighter tonal space.
  const copyY = useTransform(scrollYProgress, [0, 1], [24, -12])
  // Adds subtle breathing scale so headline feels alive without visual noise.
  const copyScale = useTransform(scrollYProgress, [0.04, 0.3, 0.92, 1], [0.94, 1.02, 1.01, 1])
  // Deblur transition sharpens the message through the key release window.
  const copyBlur = useTransform(scrollYProgress, [0.04, 0.24], [8, 0])
  const copyFilter = useTransform(copyBlur, value => `blur(${value}px)`)
  // Shift headline tone from light-on-dark to warm neutral for handoff to light scenes.
  const copyColor = useTransform(scrollYProgress, [0, 0.62, 0.88, 1], ['#f7f4ef', '#f7f4ef', '#645b51', '#242321'])
  // Support line follows with delayed reveal for layered editorial pacing.
  const supportingOpacity = useTransform(scrollYProgress, [0.16, 0.36, 1], [0, 1, 1])
  const supportingY = useTransform(scrollYProgress, [0.16, 1], [14, -8])
  const supportingColor = useTransform(scrollYProgress, [0, 0.62, 0.86, 1], ['#f5efe6', '#f5efe6', '#72685d', '#2d2a26'])
  // Rule line reinforces narrative cadence and directs eyes into the next section.
  const lineScale = useTransform(scrollYProgress, [0.1, 0.4], [0, 1])
  // Ambient glows keep the bridge atmospheric while preserving text contrast.
  const primaryGlowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0.08, 0.24, 0.16, 0.1])
  const primaryGlowY = useTransform(scrollYProgress, [0, 1], [30, -24])
  const secondaryGlowOpacity = useTransform(scrollYProgress, [0.12, 0.44, 1], [0, 0.2, 0.08])
  const secondaryGlowY = useTransform(scrollYProgress, [0, 1], [18, -16])

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative release"
      className="relative h-[150vh] overflow-hidden cinematic-gradient-release"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: primaryGlowOpacity, y: primaryGlowY }}
          className="absolute -left-[12vw] top-[20vh] h-[36vh] w-[42vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.36)_0%,rgba(255,255,255,0)_72%)] blur-3xl"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: secondaryGlowOpacity, y: secondaryGlowY }}
          className="absolute right-[-8vw] top-[46vh] h-[32vh] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(214,194,160,0.36)_0%,rgba(214,194,160,0)_76%)] blur-3xl"
        />
        <div className="cinematic-grain-overlay absolute inset-0 opacity-[0.08]" />
      </div>

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-12">
          <motion.p
            style={
              shouldReduceMotion
                ? { textShadow: '0 1px 12px rgba(0,0,0,0.38)' }
                : {
                    opacity: copyOpacity,
                    y: copyY,
                    scale: copyScale,
                    filter: copyFilter,
                    color: copyColor,
                    textShadow: '0 2px 16px rgba(0,0,0,0.52)',
                  }
            }
            className="max-w-[22ch] font-serif text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.06] tracking-[-0.03em] text-[#f7f4ef]"
          >
            Precision is what lets the room feel inevitable.
          </motion.p>
          <motion.p
            style={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: supportingOpacity,
                    y: supportingY,
                    color: supportingColor,
                  }
            }
            className="mt-5 max-w-[46ch] text-[clamp(14px,1.55vw,17px)] font-medium leading-[1.65] text-[#f5efe6]"
          >
            Direction is what lets stakeholders experience confidence when the
            stakes rise.
          </motion.p>

          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : {
                    scaleX: lineScale,
                    transformOrigin: 'left center',
                  }
            }
            className="mt-7 h-[1px] w-24 bg-white/45"
          />
        </div>
      </div>
    </section>
  )
}

export default SceneNarrativeRelease
