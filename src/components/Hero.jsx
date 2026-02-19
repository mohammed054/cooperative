import React, { useEffect, useMemo, useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import ScribbleButton from './ScribbleButton'
import { assetUrl } from '../lib/assetUrl'
import { useSceneProgress } from '../motion/hooks/useSceneProgress'
import { SCENE_RANGES } from '../motion/ranges'

const HERO_TRUST_ITEMS = [
  'UAE-wide command coverage',
  'Senior show-day leadership',
  'White-glove technical delivery',
]

const Hero = () => {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const videoRef = useRef(null)

  const { scrollYProgress } = useSceneProgress(sectionRef, {
    offset: ['start start', 'end start'],
  })

  // Settles the media stack as users enter the journey for a premium directed opening.
  const mediaScale = useTransform(scrollYProgress, SCENE_RANGES.hero.mediaSettle, [1.08, 1])
  // Adds subtle vertical drift so the hero feels like a living stage, not a flat banner.
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, -30])
  // Lifts content while preserving readability during scroll.
  const copyY = useTransform(scrollYProgress, SCENE_RANGES.hero.contentLift, [0, -32])
  // Softens alpha transitions for copy to avoid abrupt visual jumps.
  const copyOpacity = useTransform(scrollYProgress, [0.02, 0.14, 0.9], [0.78, 1, 0.9])
  // Deepens the veil to bridge into lighter follow-up scenes.
  const veilOpacity = useTransform(scrollYProgress, SCENE_RANGES.hero.veilDeepen, [0.24, 0.54])
  // Reveals trust micro-list after authority headline lands.
  const trustOpacity = useTransform(scrollYProgress, SCENE_RANGES.hero.trustReveal, [0.18, 1])

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const bloomStyle = useMemo(
    () => ({
      backgroundImage:
        'radial-gradient(76% 54% at 52% 12%, rgba(255,255,255,0.16), rgba(255,255,255,0) 66%), radial-gradient(62% 46% at 12% 70%, rgba(206,180,128,0.24), rgba(206,180,128,0) 70%)',
    }),
    []
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay can be blocked by browser policy; poster image remains as fallback.
      }
    }

    tryPlay()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-black"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: mediaScale, y: mediaY }}
        className="absolute inset-0"
      >
        <img
          src={assetUrl('images/event1.jpg')}
          alt="Luxury event production in progress"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={assetUrl('images/event1.jpg')}
          onCanPlay={() => videoRef.current?.play().catch(() => {})}
          aria-hidden="true"
          width={1920}
          height={1080}
        >
          <source src={assetUrl('videos/background.mp4')} type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: veilOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0" style={{ background: 'var(--cine-gradient-hero)' }} />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={bloomStyle}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--home-light-100)] via-[var(--home-light-200)] to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          style={shouldReduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="cinematic-eyebrow text-white/84">
              Hero authority scene
            </span>
          </div>

          <h1 className="mt-6 font-serif text-[clamp(2.1rem,5.6vw,4.8rem)] leading-[1.03] tracking-[-0.032em] text-white">
            Production direction
            <br className="hidden sm:block" /> for rooms that cannot slip.
          </h1>

          <p className="mt-5 max-w-[46ch] text-[clamp(0.95rem,1.55vw,1.18rem)] leading-[1.72] text-white/72">
            Senior-led AV, staging, lighting, and show control calibrated for
            executive-level precision and composure.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ScribbleButton
              onClick={() => scrollToSection('get-started')}
              ariaLabel="Request a proposal"
              analyticsLabel="hero-request-proposal"
              tone="light"
              variant="primary"
              size="lg"
            >
              Request a proposal
            </ScribbleButton>
            <ScribbleButton
              onClick={() => scrollToSection('scene-capability-establishment')}
              ariaLabel="Explore capabilities"
              analyticsLabel="hero-explore-capabilities"
              tone="light"
              variant="outline"
              size="lg"
              showArrow={false}
            >
              Explore capabilities
            </ScribbleButton>
          </div>

          <motion.ul
            style={shouldReduceMotion ? undefined : { opacity: trustOpacity }}
            className="mt-8 flex flex-wrap gap-x-8 gap-y-3"
          >
            {HERO_TRUST_ITEMS.map(item => (
              <li
                key={item}
                className="flex items-center gap-2 text-[12px] tracking-[0.04em] text-white/72"
              >
                <span className="h-[1px] w-3 bg-white/44" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
