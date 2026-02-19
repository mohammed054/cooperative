import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { assetUrl } from '../lib/assetUrl'

const CAPABILITIES = [
  {
    index: '01',
    title: 'Command-led production',
    subtitle: 'Single accountable producer',
    description:
      'One senior owner orchestrates approvals, crew alignment, and show priorities end-to-end.',
    image: assetUrl('images/event-planning.png'),
  },
  {
    index: '02',
    title: 'Technical certainty',
    subtitle: 'AV, lighting, and show control',
    description:
      'Signal flow, redundancy, and cue logic are designed for clarity before doors open.',
    image: assetUrl('images/av-setup.png'),
  },
  {
    index: '03',
    title: 'Spatial precision',
    subtitle: 'Staging and scenic architecture',
    description:
      'Builds are translated from concept into safe, camera-ready room geometry.',
    image: assetUrl('images/seating.png'),
  },
  {
    index: '04',
    title: 'Curated finish quality',
    subtitle: 'Furniture and premium rentals',
    description:
      'Inventory arrives staged, labeled, and set with white-glove handling.',
    image: assetUrl('images/lighting-effects.png'),
  },
  {
    index: '05',
    title: 'Show-day composure',
    subtitle: 'Operational leadership',
    description:
      'A calm command lane maintains cadence while stakeholders stay focused on outcomes.',
    image: assetUrl('images/full-production.png'),
  },
]

const getRange = (index, total) => {
  const step = 1 / total
  const start = step * index
  const mid = start + step * 0.54
  const end = start + step * 1.18
  return [Math.max(0, start - step * 0.24), Math.min(1, mid), Math.min(1, end)]
}

const CapabilityCard = ({
  item,
  progress,
  range,
  shouldReduceMotion,
  isFirst,
  isLast,
}) => {
  // Fades cards in and out in sequence to create directed scene choreography.
  const opacity = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [0.3, 1, 1] : isFirst ? [0.86, 1, 0.44] : [0.3, 1, 0.42]
  )
  // Adds vertical motion to reinforce progression through the capability stack.
  const y = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [24, 0, 0] : isFirst ? [8, 0, -18] : [26, 0, -18]
  )
  // Slight scaling keeps active cards visually dominant without aggressive zoom.
  const scale = useTransform(
    progress,
    [range[0], range[1], range[2]],
    isLast ? [0.986, 1, 1] : [0.985, 1, 0.992]
  )
  // Dynamic border contrast helps users identify the active card at a glance.
  const borderAlpha = useTransform(progress, [range[0], range[1], range[2]], [0.08, 0.26, 0.1])
  const borderColor = useTransform(borderAlpha, value => `rgba(20,24,32,${value})`)

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
      className="overflow-hidden rounded-2xl border bg-white/72 shadow-[0_12px_30px_rgba(16,18,24,0.1)] backdrop-blur-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.08fr]">
        <div className="relative h-44 overflow-hidden sm:h-full sm:min-h-[170px] lg:min-h-[190px]">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
        <div className="p-5 sm:p-6">
          <p className="cinematic-eyebrow text-ink-subtle">{item.subtitle}</p>
          <h3 className="mt-3 font-serif text-[clamp(1.14rem,1.84vw,1.52rem)] leading-[1.1] tracking-[-0.016em] text-ink">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
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
  const [trackEndY, setTrackEndY] = useState(-500)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Controls sequence timing for all capability cards in the sticky track.
  const sequenceProgress = useTransform(scrollYProgress, [0.04, 0.92], [0, 1])
  // Draws the vertical progress rail as users move through the scene.
  const railScale = useTransform(sequenceProgress, [0, 1], [0, 1])
  // Scroll-translates the card stack so the next capability is always staged.
  const cardTrackY = useTransform(sequenceProgress, [0, 0.16, 1], [0, 0, trackEndY])
  // Adds ambient glow depth to keep the scene visually rich on large screens.
  const glowOpacity = useTransform(sequenceProgress, [0.1, 0.6, 1], [0.08, 0.18, 0.1])

  useEffect(() => {
    if (shouldReduceMotion) return

    const updateTrackEnd = () => {
      const viewportEl = trackViewportRef.current
      const trackEl = trackRef.current
      if (!viewportEl || !trackEl) return

      const cards = Array.from(trackEl.children)
      const lastCard = cards[cards.length - 1]
      if (!lastCard) return

      const viewportHeight = viewportEl.clientHeight
      const targetTop = Math.max(88, Math.min(152, viewportHeight * 0.2))
      const alignLastCardY = targetTop - lastCard.offsetTop
      const nextEnd = Math.min(0, alignLastCardY)

      setTrackEndY(previous => (Math.abs(previous - nextEnd) < 1 ? previous : nextEnd))
    }

    updateTrackEnd()

    const resizeObserver = new ResizeObserver(updateTrackEnd)
    if (trackViewportRef.current) resizeObserver.observe(trackViewportRef.current)
    if (trackRef.current) {
      resizeObserver.observe(trackRef.current)
      Array.from(trackRef.current.children).forEach(card => resizeObserver.observe(card))
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
      className="relative h-[520vh] overflow-hidden bg-transparent"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_46%_at_16%_30%,rgba(255,255,255,0.58),rgba(255,255,255,0)_76%),radial-gradient(46%_36%_at_82%_62%,rgba(216,188,142,0.28),rgba(216,188,142,0)_78%)]"
      />

      <div className="sticky top-0 h-screen">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-12 lg:gap-14 lg:px-8">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="cinematic-eyebrow text-[#8f8f8f]">Capability establishment</p>
            <h2 className="mt-4 max-w-[13ch] font-serif text-[clamp(1.95rem,4.08vw,3.26rem)] leading-[1.04] tracking-[-0.022em] text-ink">
              Engineered for high-stakes rooms.
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
              Delivery discipline is layered from first brief to final cue, so
              confidence grows as complexity increases.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-20 w-[2px] overflow-hidden rounded-full bg-black/10">
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
                Scope clarity before procurement starts
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-black/30" />
                Sequenced crew deployment with tight approvals
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 block h-[1px] w-3 shrink-0 bg-black/30" />
                Show-day command continuity across the full room
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
                className="space-y-4 pb-5 pt-6 pr-1 will-change-transform lg:space-y-5 lg:pt-8"
              >
                {CAPABILITIES.map((item, index) => (
                  <CapabilityCard
                    key={item.index}
                    item={item}
                    progress={sequenceProgress}
                    range={getRange(index, CAPABILITIES.length)}
                    shouldReduceMotion={shouldReduceMotion}
                    isFirst={index === 0}
                    isLast={index === CAPABILITIES.length - 1}
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
