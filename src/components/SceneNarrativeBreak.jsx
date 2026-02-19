import React, { useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { MOTION_EASE } from '../motion'

const NARRATIVE_LINE =
  'When the room is high-stakes, every second of the show must feel inevitable.'
const REVEAL_START = 0.16
const REVEAL_END = 0.58

const SceneNarrativeBreak = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const words = useMemo(() => NARRATIVE_LINE.split(' '), [])
  const [revealedWords, setRevealedWords] = useState(
    shouldReduceMotion ? words.length : 0
  )

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const backgroundTone = useTransform(
    scrollYProgress,
    [0, 1],
    ['#17191d', '#0f1013']
  )
  const panelY = useTransform(scrollYProgress, [0.82, 1], ['0vh', '-10vh'])
  const panelOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.22, 0.72, 1],
    [0.18, 1, 1, 0.9]
  )

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    if (shouldReduceMotion) {
      return
    }

    let nextWordCount = 0
    if (latest >= REVEAL_END) {
      nextWordCount = words.length
    } else if (latest > REVEAL_START) {
      const revealProgress = (latest - REVEAL_START) / (REVEAL_END - REVEAL_START)
      nextWordCount = Math.min(
        words.length,
        Math.max(0, Math.floor(revealProgress * (words.length + 1)))
      )
    }

    setRevealedWords(current =>
      current === nextWordCount ? current : nextWordCount
    )
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative break"
      className="relative h-[300vh] overflow-clip"
    >
      <motion.div
        style={{ backgroundColor: backgroundTone }}
        className="sticky top-0 h-screen"
      >
        <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.07]" />

        <motion.div
          style={
            shouldReduceMotion ? undefined : { y: panelY, opacity: panelOpacity }
          }
          transition={{ duration: 0.8, ease: MOTION_EASE.mass }}
          className="relative mx-auto flex h-full max-w-5xl items-center px-6 sm:px-10 lg:px-12"
        >
          <div>
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
              Narrative break
            </p>
            <p className="font-serif text-[clamp(2rem,4.8vw,4rem)] leading-[1.03] tracking-[-0.03em] text-white/95">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="transition-opacity duration-500"
                  style={{
                    opacity:
                      shouldReduceMotion || index < revealedWords ? 1 : 0.18,
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default SceneNarrativeBreak
