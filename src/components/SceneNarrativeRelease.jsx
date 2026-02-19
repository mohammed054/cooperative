import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SceneNarrativeRelease = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const copyOpacity = useTransform(
    scrollYProgress,
    [0.04, 0.18, 0.5, 0.68],
    [0, 1, 1, 0]
  )
  const copyY = useTransform(scrollYProgress, [0, 1], [20, -10])
  const lineScale = useTransform(scrollYProgress, [0.08, 0.36], [0, 1])

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative release"
      className="relative h-[120vh] overflow-hidden bg-gradient-to-b from-[#0f1013] via-[#141820] to-[#f4efe7]"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-12">
          <motion.p
            style={
              shouldReduceMotion
                ? { textShadow: '0 1px 12px rgba(0,0,0,0.38)' }
                : {
                    opacity: copyOpacity,
                    y: copyY,
                    textShadow: '0 1px 12px rgba(0,0,0,0.44)',
                  }
            }
            className="max-w-[22ch] font-serif text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.06] tracking-[-0.03em] text-white"
          >
            Precision is what lets the room feel effortless.
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
