import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const PROCESS_STEPS = [
  {
    index: '01',
    title: 'Brief & scope lock',
    description:
      'We define decision owners, timeline constraints, and non-negotiable room objectives.',
  },
  {
    index: '02',
    title: 'Vendor alignment',
    description:
      'Technical, scenic, and logistics teams align against one production runbook.',
  },
  {
    index: '03',
    title: 'Run-of-show assurance',
    description:
      'Cue sheets, rehearsals, and approval gates are finalized before show day.',
  },
  {
    index: '04',
    title: 'Show-day command',
    description:
      'A senior producer runs execution in real time so your leadership remains composed.',
  },
]

const getRange = (index, total) => {
  const step = 1 / total
  const start = step * index
  const mid = start + step * 0.52
  const end = start + step

  return [Math.max(0, start - step * 0.38), mid, Math.min(1, end + step * 0.12)]
}

const ProcessStepCard = ({
  step,
  progress,
  range,
  shouldReduceMotion,
  isFirst,
}) => {
  const mid = (range[0] + range[1]) / 2
  const opacity = useTransform(
    progress,
    [range[0], mid, range[1]],
    isFirst ? [0.86, 1, 0.42] : [0.28, 1, 0.38]
  )
  const y = useTransform(
    progress,
    [range[0], mid, range[1]],
    isFirst ? [8, 0, -16] : [22, 0, -16]
  )
  const scale = useTransform(
    progress,
    [range[0], mid, range[1]],
    isFirst ? [0.998, 1, 0.992] : [0.985, 1, 0.992]
  )
  const borderOpacity = useTransform(progress, [range[0], mid, range[1]], [0.08, 0.2, 0.1])
  const borderColor = useTransform(
    borderOpacity,
    value => `rgba(17,17,17,${value})`
  )

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
      className="rounded-2xl border bg-white/[0.74] p-6 backdrop-blur-[1.5px] sm:p-7"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-subtle">
        Step {step.index}
      </p>
      <h3 className="mt-3 font-serif text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.1] tracking-[-0.015em] text-ink">
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

  const sequenceProgress = useTransform(scrollYProgress, [0.02, 0.78], [0, 1])
  const spineScale = useTransform(sequenceProgress, [0, 1], [0, 1])
  const imageScale = useTransform(sequenceProgress, [0, 1], [1.04, 1])
  const imageY = useTransform(sequenceProgress, [0, 1], [14, -14])
  const stepTrackY = useTransform(
    sequenceProgress,
    [0, 0.15, 1],
    ['0%', '0%', '-44%']
  )

  return (
    <section
      id="scene-process-depth"
      ref={sectionRef}
      className="relative h-[360vh] bg-transparent"
    >
      <div className="sticky top-0 h-screen">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="lg:col-span-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8f8f8f]">
              Process depth
            </p>
            <h2 className="mt-4 max-w-[14ch] font-serif text-[clamp(1.8rem,4vw,3.1rem)] leading-[1.05] tracking-[-0.02em] text-ink">
              A room of this level is not improvised.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
              Each phase is engineered to remove uncertainty before audiences
              arrive. Scroll reveals the same sequence your team experiences in
              delivery.
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
              className="mt-8 hidden overflow-hidden rounded-2xl border border-black/[0.08] bg-white/[0.82] lg:block"
            >
              <img
                src={assetUrl('images/event-planning-in-action.png')}
                alt="Production planning in progress"
                className="h-[220px] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-[46vh] min-h-[280px] overflow-hidden sm:h-[52vh] lg:h-[64vh] lg:min-h-[380px]">
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
