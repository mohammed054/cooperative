import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import ScribbleButton from './ScribbleButton'

/*
 * PART 5 FIX: Removed hardcoded bg-[#0f1116] Tailwind utility.
 * Background now owned by flagship-scene-deep CSS class which maps to the
 * darkest tone in the tone system. No inline background or Tailwind bg-[#...].
 */
const SceneExitBridge = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Raises finale copy subtly so the last statement feels intentional and directed.
  const copyY = useTransform(scrollYProgress, [0, 1], [14, -10])
  // Light fade envelope keeps finale readable while adding cinematic depth.
  const copyOpacity = useTransform(scrollYProgress, [0.1, 0.36, 1], [0.32, 1, 0.92])
  // Glow pulse builds emotional finish without visual clutter.
  const glowOpacity = useTransform(scrollYProgress, [0.08, 0.62], [0.12, 0.3])

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic exit"
      /* PART 5 FIX: Use tone class instead of hardcoded Tailwind bg-[#0f1116] */
      className="flagship-scene-deep relative overflow-hidden"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_44%_at_50%_28%,rgba(255,255,255,0.15),rgba(255,255,255,0)_76%),radial-gradient(56%_42%_at_84%_72%,rgba(212,186,144,0.18),rgba(212,186,144,0)_78%)]"
      />
      <div className="cinematic-grain-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <motion.div
        style={shouldReduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative mx-auto flex min-h-[66vh] max-w-7xl flex-col justify-center px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
      >
        <p className="cinematic-eyebrow text-white/42">Cinematic finale</p>

        <h2 className="mt-4 max-w-4xl font-serif text-[clamp(1.9rem,3.9vw,3.3rem)] leading-[1.08] tracking-[-0.022em] text-white/96">
          Composed rooms are never accidental. They are authored in detail.
        </h2>

        <p className="mt-5 max-w-[52ch] text-[clamp(0.95rem,1.5vw,1.08rem)] leading-[1.72] text-white/68">
          If your next audience cannot tolerate uncertainty, we design the
          production system before execution begins.
        </p>

        <div className="mt-9">
          <ScribbleButton
            to="/contact"
            tone="light"
            variant="outline"
            size="lg"
            analyticsLabel="exit-start-planning-call"
          >
            Start a confidential planning call
          </ScribbleButton>
        </div>
      </motion.div>
    </section>
  )
}

export default SceneExitBridge
