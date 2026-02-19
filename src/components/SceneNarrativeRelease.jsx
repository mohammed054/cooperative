import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SceneNarrativeRelease = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyOpacity = useTransform(scrollYProgress, [0.04, 0.2, 1], [0, 1, 1])
  const copyY = useTransform(scrollYProgress, [0, 1], [20, -10])
  const copyScale = useTransform(scrollYProgress, [0.02, 0.28, 0.9, 1], [0.94, 1.03, 1.01, 1])
  const copyBlur = useTransform(scrollYProgress, [0.02, 0.22], [8, 0])
  const copyFilter = useTransform(copyBlur, value => `blur(${value}px)`)
  const copyColor = useTransform(
    scrollYProgress,
    [0, 0.62, 0.86, 1],
    ['#f7f4ef', '#f7f4ef', '#61584d', '#252422']
  )
  const supportingCopyOpacity = useTransform(scrollYProgress, [0.16, 0.34, 1], [0, 1, 1])
  const supportingCopyY = useTransform(scrollYProgress, [0.16, 1], [12, -8])
  const supportingCopyColor = useTransform(
    scrollYProgress,
    [0, 0.62, 0.84, 1],
    ['#f5efe6', '#f5efe6', '#6d6459', '#2f2c28']
  )
  const lineScale = useTransform(scrollYProgress, [0.08, 0.36], [0, 1])
  const primaryGlowOpacity = useTransform(scrollYProgress, [0, 0.28, 0.85, 1], [0.06, 0.2, 0.17, 0.12])
  const primaryGlowY = useTransform(scrollYProgress, [0, 1], [28, -24])
  const secondaryGlowOpacity = useTransform(scrollYProgress, [0.12, 0.44, 1], [0, 0.18, 0.08])
  const secondaryGlowY = useTransform(scrollYProgress, [0, 1], [16, -18])

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative release"
      className="relative h-[145vh] overflow-hidden bg-[linear-gradient(180deg,#0f1013_0%,#121722_34%,#dad2c6_66%,#f4efe7_76%,#f4efe7_100%)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: primaryGlowOpacity, y: primaryGlowY }}
          className="absolute -left-[12vw] top-[22vh] h-[34vh] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_72%)] blur-3xl"
        />
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: secondaryGlowOpacity, y: secondaryGlowY }}
          className="absolute right-[-8vw] top-[48vh] h-[32vh] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(214,194,160,0.34)_0%,rgba(214,194,160,0)_76%)] blur-3xl"
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
                    textShadow: '0 2px 16px rgba(0,0,0,0.56)',
                  }
              }
            className="max-w-[22ch] font-serif text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.06] tracking-[-0.03em] text-[#f7f4ef]"
          >
            Precision is what lets the room feel effortless.
          </motion.p>
          <motion.p
            style={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: supportingCopyOpacity,
                    y: supportingCopyY,
                    color: supportingCopyColor,
                  }
            }
            className="mt-5 max-w-[46ch] text-[clamp(14px,1.55vw,17px)] font-medium leading-[1.65] text-[#f5efe6]"
          >
            Decision is what lets the room stay calm when the stakes are highest.
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
