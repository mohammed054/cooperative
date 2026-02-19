import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SceneNarrativeRelease = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const copyOpacity = useTransform(scrollYProgress, [0.06, 0.35, 0.86], [0, 1, 0.78])
  const copyY = useTransform(scrollYProgress, [0, 1], [28, -20])
  const lineScale = useTransform(scrollYProgress, [0.1, 0.62], [0, 1])

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative release"
      className="relative h-[150vh] overflow-hidden bg-gradient-to-b from-[#0f1013] via-[#171a20] to-[#ece7df]"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-12">
          <motion.p
            style={
              shouldReduceMotion ? undefined : { opacity: copyOpacity, y: copyY }
            }
            className="max-w-[22ch] font-serif text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.06] tracking-[-0.03em] text-white/92"
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
