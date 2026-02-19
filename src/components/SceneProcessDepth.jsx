import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const PROCESS_STEPS = [
  {
    index: '01',
    title: 'Strategic intake',
    description:
      'Decision owners, event constraints, and technical non-negotiables are locked in one briefing lane.',
  },
  {
    index: '02',
    title: 'System architecture',
    description:
      'AV, power, staging, and scenic teams are aligned to a single production logic before build.',
  },
  {
    index: '03',
    title: 'Rehearsal discipline',
    description:
      'Cue stacks, transitions, and contingency pathways are rehearsed before show-day pressure starts.',
  },
  {
    index: '04',
    title: 'Live execution command',
    description:
      'A senior producer controls pace in real time so stakeholders experience calm continuity.',
  },
]

const getRange = (index, total) => {
  const step = 1 / total
  const start = step * index
  const mid = start + step * 0.6
  const end = start + step * 1.22
  return [Math.max(0, start - step * 0.24), Math.min(1, mid), Math.min(1, end)]
}

const ProcessStepCard = ({
  step,
  progress,
  range,
  shouldReduceMotion,
  isFirst,
  isLast,
}) => {
  // Fades each step in sequence to create a guided process reveal.
  const opacity = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [0.44, 1, 1] : isFirst ? [0.85, 1, 0.56] : [0.4, 1, 0.58]
  )
  // Vertical offset gives each step an intentional entrance and exit cadence.
  const y = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [16, 0, 0] : isFirst ? [8, 0, -8] : [18, 0, -10]
  )
  // Gentle scale shift keeps the active step visually forward.
  const scale = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [0.992, 1, 1] : [0.99, 1, 0.996]
  )
  // Border contrast indicates active step while preserving a soft premium finish.
  const borderOpacity = useTransform(progress, [range[0], range[1], range[2]], [0.08, 0.24, 0.1])
  const borderColor = useTransform(borderOpacity, value => `rgba(17,17,17,${value})`)

  return (
    <motion.article
      style={
        shouldReduceMotion
          ? undefined
          : {
              opacity,
              y,
              scale,
              borderColor,
            }
      }
      className="rounded-2xl border bg-white/74 p-6 shadow-[0_12px_34px_rgba(13,16,22,0.09)] backdrop-blur-md sm:p-7"
    >
      <p className="cinematic-eyebrow text-ink-subtle">Step {step.index}</p>
      <h3 className="mt-3 font-serif text-[clamp(1.16rem,2vw,1.58rem)] leading-[1.1] tracking-[-0.015em] text-ink">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-ink-muted sm:text-[15px]">
        {step.description}
      </p>
    </motion.article>
  )
}

const SceneProcessDepth = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Normalizes scroll timing for process choreography.
  const sequenceProgress = useTransform(scrollYProgress, [0.03, 0.95], [0, 1])
  // Draws the process spine for directional context.
  const spineScale = useTransform(sequenceProgress, [0, 1], [0, 1])
  // Scales and drifts the media block to add depth while users scan steps.
  const imageScale = useTransform(sequenceProgress, [0, 1], [1.05, 1])
  const imageY = useTransform(sequenceProgress, [0, 1], [16, -16])
  // Scroll-translates step stack to keep progress narrative continuous.
  const stepTrackY = useTransform(sequenceProgress, [0, 0.18, 1], ['0%', '0%', '-55%'])
  // Modulates ambient glow to avoid static flat backgrounds.
  const glowOpacity = useTransform(sequenceProgress, [0.1, 0.62, 1], [0.06, 0.18, 0.08])

  return (
    <section
      id="scene-process-depth"
      ref={sectionRef}
      className="relative h-[440vh] overflow-hidden bg-transparent"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_52%_at_84%_26%,rgba(255,255,255,0.64),rgba(255,255,255,0)_74%),radial-gradient(50%_38%_at_12%_66%,rgba(199,169,125,0.26),rgba(199,169,125,0)_78%)]"
      />

      <div className="sticky top-0 h-screen">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-start gap-10 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="lg:col-span-5">
            <p className="cinematic-eyebrow text-[#8f8f8f]">Process depth</p>
            <h2 className="mt-4 max-w-[14ch] font-serif text-[clamp(1.86rem,4.02vw,3.12rem)] leading-[1.05] tracking-[-0.02em] text-ink">
              High-value rooms are directed, never improvised.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
              Scroll through the exact progression stakeholders experience, from
              intake clarity to show-day command.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-20 w-[2px] overflow-hidden rounded-full bg-black/[0.08]">
                <motion.div
                  style={{
                    scaleY: shouldReduceMotion ? 1 : spineScale,
                    transformOrigin: 'top center',
                  }}
                  className="absolute inset-0 bg-ink"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle">
                Production sequence
              </p>
            </div>

            <motion.div
              style={shouldReduceMotion ? undefined : { scale: imageScale, y: imageY }}
              className="mt-6 hidden overflow-hidden rounded-2xl border border-black/[0.08] bg-white/82 shadow-[0_12px_34px_rgba(14,16,22,0.12)] lg:mt-7 lg:block"
            >
              <img
                src={assetUrl('images/event-planning-in-action.png')}
                alt="Production planning in progress"
                className="h-[clamp(166px,25vh,224px)] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-[46vh] min-h-[280px] overflow-hidden sm:h-[52vh] lg:h-[64vh] lg:min-h-[340px]">
              <motion.div
                style={shouldReduceMotion ? undefined : { y: stepTrackY }}
                className="space-y-4 pb-5 pr-1 will-change-transform lg:space-y-5"
              >
                {PROCESS_STEPS.map((step, index) => (
                  <ProcessStepCard
                    key={step.index}
                    step={step}
                    progress={sequenceProgress}
                    range={getRange(index, PROCESS_STEPS.length)}
                    shouldReduceMotion={shouldReduceMotion}
                    isFirst={index === 0}
                    isLast={index === PROCESS_STEPS.length - 1}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SceneProcessDepth
