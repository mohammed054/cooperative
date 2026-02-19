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
  'When consequence enters the room, precision is no longer optional.'
const REVEAL_START = 0.17
const REVEAL_END = 0.61

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

  // Gradually cools the backdrop to move emotional tone deeper into the narrative arc.
  const backgroundTone = useTransform(scrollYProgress, [0, 1], ['#161a22', '#0e1118'])
  // Raises the copy panel slightly to stage the reveal as a directed moment.
  const panelY = useTransform(scrollYProgress, [0.78, 1], ['0vh', '-11vh'])
  // Soft fade envelope keeps the copy readable through the reveal cycle.
  const panelOpacity = useTransform(scrollYProgress, [0.08, 0.24, 0.72, 1], [0.2, 1, 1, 0.88])
  // De-blur effect gives words a sharpened premium release as they become active.
  const blurValue = useTransform(scrollYProgress, [0.04, 0.24], [8, 0])
  const blurFilter = useTransform(blurValue, value => `blur(${value}px)`)

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    if (shouldReduceMotion) return

    let nextWordCount = 0
    if (latest >= REVEAL_END) {
      nextWordCount = words.length
    } else if (latest > REVEAL_START) {
      const revealProgress = (latest - REVEAL_START) / (REVEAL_END - REVEAL_START)
      nextWordCount = Math.min(words.length, Math.floor(revealProgress * (words.length + 1)))
    }

    setRevealedWords(current => (current === nextWordCount ? current : nextWordCount))
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Narrative break"
      className="relative h-[300vh] overflow-clip"
    >
      <motion.div style={{ backgroundColor: backgroundTone }} className="sticky top-0 h-screen">
        <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(66%_44%_at_50%_22%,rgba(255,255,255,0.1),rgba(255,255,255,0)_74%),radial-gradient(50%_38%_at_18%_70%,rgba(214,183,135,0.2),rgba(214,183,135,0)_76%)]" />

        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { y: panelY, opacity: panelOpacity, filter: blurFilter }
          }
          transition={{ duration: 0.8, ease: MOTION_EASE.mass }}
          className="relative mx-auto flex h-full max-w-5xl items-center px-6 sm:px-10 lg:px-12"
        >
          <div>
            <p className="cinematic-eyebrow mb-6 text-white/44">Narrative break</p>
            <p className="font-serif text-[clamp(2rem,4.8vw,4rem)] leading-[1.03] tracking-[-0.03em] text-white/95">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="transition-opacity duration-500"
                  style={{ opacity: shouldReduceMotion || index < revealedWords ? 1 : 0.18 }}
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
