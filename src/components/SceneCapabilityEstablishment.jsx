import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const CAPABILITIES = [
  {
    index: '01',
    title: 'Event production leadership',
    subtitle: 'Single accountable producer',
    description:
      'Senior ownership from first brief to room close keeps timelines and decisions disciplined.',
    image: assetUrl('images/event-planning.png'),
  },
  {
    index: '02',
    title: 'Technical systems',
    subtitle: 'AV, lighting, show control',
    description:
      'Audio, video, and cue infrastructure engineered for clarity, redundancy, and calm operation.',
    image: assetUrl('images/av-setup.png'),
  },
  {
    index: '03',
    title: 'Staging and scenic',
    subtitle: 'Built to approved render',
    description:
      'Stage architecture and scenic execution delivered with exacting build standards.',
    image: assetUrl('images/seating.png'),
  },
  {
    index: '04',
    title: 'Furniture and rentals',
    subtitle: 'Curated premium inventory',
    description:
      'White-glove logistics for seating, tables, and finish pieces that read as intentional.',
    image: assetUrl('images/lighting-effects.png'),
  },
  {
    index: '05',
    title: 'Show-day command',
    subtitle: 'Calm operational control',
    description:
      'On-site producer and crew maintain cadence so stakeholders stay focused on outcomes.',
    image: assetUrl('images/full-production.png'),
  },
]

const getRange = (index, total) => {
  const step = 1 / total
  const start = step * index
  const leadIn = index === 0 ? step * 0.38 : step * 0.28
  const mid = start + step * (index === total - 1 ? 0.74 : 0.58)
  const end = start + step
  const tail = index === total - 1 ? step * 0.44 : step * 0.22

  return [Math.max(0, start - leadIn), Math.min(1, mid), Math.min(1, end + tail)]
}

const CapabilityCard = ({
  item,
  progress,
  range,
  shouldReduceMotion,
  isFirst,
}) => {
  const holdEnd = range[1] + (range[2] - range[1]) * 0.64
  const opacity = useTransform(
    progress,
    [range[0], range[1], holdEnd, range[2]],
    isFirst ? [0.86, 1, 1, 0.44] : [0.26, 1, 1, 0.4]
  )
  const y = useTransform(
    progress,
    [range[0], range[1], holdEnd, range[2]],
    isFirst ? [8, 0, 0, -20] : [26, 0, 0, -20]
  )
  const scale = useTransform(
    progress,
    [range[0], range[1], holdEnd, range[2]],
    isFirst ? [0.998, 1, 1, 0.993] : [0.985, 1, 1, 0.993]
  )
  const borderAlpha = useTransform(
    progress,
    [range[0], range[1], holdEnd, range[2]],
    [0.08, 0.22, 0.2, 0.1]
  )
  const borderColor = useTransform(
    borderAlpha,
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
      className="overflow-hidden rounded-2xl border bg-white/[0.74] shadow-[0_10px_28px_rgba(17,17,17,0.05)] backdrop-blur-[1.5px]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]">
        <div className="relative h-44 overflow-hidden sm:h-full sm:min-h-[160px] lg:min-h-[180px]">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-subtle">
            {item.subtitle}
          </p>
          <h3 className="mt-3 font-serif text-[clamp(1.1rem,1.8vw,1.45rem)] leading-[1.1] tracking-[-0.015em] text-ink">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {item.description}
          </p>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
            Capability {item.index}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

const SceneCapabilityEstablishment = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const trackViewportRef = useRef(null)
  const trackRef = useRef(null)
  const [trackEndY, setTrackEndY] = useState(-520)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const sequenceProgress = useTransform(scrollYProgress, [0.04, 0.995], [0, 1])
  const railScale = useTransform(sequenceProgress, [0, 1], [0, 1])
  const cardTrackY = useTransform(sequenceProgress, [0, 0.16, 1], [0, 0, trackEndY])

  useEffect(() => {
    if (shouldReduceMotion) return

    const updateTrackEnd = () => {
      const viewportEl = trackViewportRef.current
      const trackEl = trackRef.current
      if (!viewportEl || !trackEl) return

      const viewportHeight = viewportEl.clientHeight
      const trackHeight = trackEl.scrollHeight

      // Keep scrolling upward until only a small tail of the stack remains visible.
      const visibleTail = Math.max(56, Math.min(140, viewportHeight * 0.14))
      const overflowEndY = Math.min(0, visibleTail - trackHeight)

      setTrackEndY(previous =>
        Math.abs(previous - overflowEndY) < 1 ? previous : overflowEndY
      )
    }

    updateTrackEnd()

    const resizeObserver = new ResizeObserver(updateTrackEnd)
    const viewportEl = trackViewportRef.current
    const trackEl = trackRef.current

    if (viewportEl) resizeObserver.observe(viewportEl)
    if (trackEl) {
      resizeObserver.observe(trackEl)
      Array.from(trackEl.children).forEach(card => resizeObserver.observe(card))
    }

    window.addEventListener('resize', updateTrackEnd)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateTrackEnd)
    }
  }, [shouldReduceMotion])

  return (
    <section
      id="scene-capability-establishment"
      ref={sectionRef}
      className="relative h-[460vh] bg-transparent"
    >
      <div className="sticky top-0 h-screen">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8f8f8f]">
              Capability establishment
            </p>
            <h2 className="mt-4 max-w-[13ch] font-serif text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.04] tracking-[-0.02em] text-ink">
              Built for high-stakes rooms.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
              Every capability is structured to reduce volatility and preserve
              executive confidence through delivery.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-20 w-[2px] overflow-hidden rounded-full bg-black/[0.08]">
                <motion.div
                  style={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scaleY: railScale,
                          transformOrigin: 'top center',
                        }
                  }
                  className="absolute inset-0 bg-ink"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-subtle">
                Service sequence
              </p>
            </div>

            <ul className="mt-8 space-y-2.5 text-sm text-ink-muted">
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-black/30" />
                UAE-wide technical and production coverage
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-black/30" />
                Senior crew leadership through show close
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-black/30" />
                White-glove logistics and room finishing
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div
              ref={trackViewportRef}
              className="relative h-[50vh] min-h-[300px] overflow-hidden pb-2 sm:h-[55vh] lg:h-[68vh] lg:min-h-[420px]"
            >
              <motion.div
                style={shouldReduceMotion ? undefined : { y: cardTrackY }}
                ref={trackRef}
                className="space-y-4 pb-5 pr-1 will-change-transform lg:space-y-5"
              >
                {CAPABILITIES.map((item, index) => (
                  <CapabilityCard
                    key={item.index}
                    item={item}
                    progress={sequenceProgress}
                    range={getRange(index, CAPABILITIES.length)}
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

export default SceneCapabilityEstablishment
